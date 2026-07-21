import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { leadImports, leads, type LeadImport } from "../drizzle/schema";
import { getDb } from "./db";
import {
  LeadCsvValidationError,
  MAX_LEAD_CSV_BYTES,
  parseLeadCsv,
  type ParsedLeadCsv,
} from "./leadsCsv";
import { storagePut } from "./storage";

const INSERT_CHUNK_SIZE = 500;
const QUERY_CHUNK_SIZE = 1_000;
const PROCESSING_TIMEOUT_MS = 15 * 60 * 1_000;

export type LeadCsvPreview = {
  fileName: string;
  fileHash: string;
  fileSizeBytes: number;
  rowsTotal: number;
  validRows: number;
  invalidRows: number;
  uniqueValidRows: number;
  duplicateRowsWithinFile: number;
  rowsAlreadyStored: number;
  rowsReadyToInsert: number;
  dateFrom: string | null;
  dateTo: string | null;
  channels: ParsedLeadCsv["channels"];
  models: ParsedLeadCsv["models"];
  regions: ParsedLeadCsv["regions"];
  errors: ParsedLeadCsv["errors"];
  alreadyImported: boolean;
  existingImport: LeadImport | null;
};

export type LeadCsvImportResult = LeadCsvPreview & {
  importId: number;
  status: "COMPLETED";
  rowsInserted: number;
  rowsSkipped: number;
  rowsInvalid: number;
  idempotent: boolean;
  fileUrl: string | null;
  importedAt: number;
};

function chunk<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

export function sanitizeLeadCsvFileName(fileName: string): string {
  const basename = fileName.replace(/\\/g, "/").split("/").at(-1)?.trim() ?? "";
  if (!basename || !basename.toLocaleLowerCase("pt-BR").endsWith(".csv")) {
    throw new LeadCsvValidationError("Selecione um arquivo com extensão .csv.");
  }
  const sanitized = basename
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 180);
  return sanitized || "leads.csv";
}

export function decodeLeadCsvBase64(value: string): Buffer {
  const base64 = value.replace(/^data:text\/csv(?:;charset=[^;,]+)?;base64,/i, "").replace(/\s+/g, "");
  if (!base64 || base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
    throw new LeadCsvValidationError("O conteúdo do arquivo CSV está corrompido.");
  }
  const bytes = Buffer.from(base64, "base64");
  const canonicalInput = base64.replace(/=+$/, "");
  const canonicalDecoded = bytes.toString("base64").replace(/=+$/, "");
  if (canonicalInput !== canonicalDecoded) {
    throw new LeadCsvValidationError("O conteúdo do arquivo CSV está corrompido.");
  }
  if (bytes.length > MAX_LEAD_CSV_BYTES) {
    throw new LeadCsvValidationError("O arquivo CSV excede o limite de 10 MB.");
  }
  return bytes;
}

async function findImportByHash(fileHash: string): Promise<LeadImport | null> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [record] = await db.select().from(leadImports).where(eq(leadImports.fileHash, fileHash)).limit(1);
  return record ?? null;
}

async function countExistingRecords(recordHashes: string[]): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  let total = 0;
  for (const hashChunk of chunk(recordHashes, QUERY_CHUNK_SIZE)) {
    if (!hashChunk.length) continue;
    const rows = await db
      .select({ recordHash: leads.recordHash })
      .from(leads)
      .where(inArray(leads.recordHash, hashChunk));
    total += rows.length;
  }
  return total;
}

function buildPreview(
  parsed: ParsedLeadCsv,
  fileName: string,
  rowsAlreadyStored: number,
  existingImport: LeadImport | null,
): LeadCsvPreview {
  return {
    fileName,
    fileHash: parsed.fileHash,
    fileSizeBytes: parsed.fileSizeBytes,
    rowsTotal: parsed.rowsTotal,
    validRows: parsed.validRows,
    invalidRows: parsed.invalidRows,
    uniqueValidRows: parsed.uniqueValidRows,
    duplicateRowsWithinFile: parsed.duplicateRowsWithinFile,
    rowsAlreadyStored,
    rowsReadyToInsert: Math.max(0, parsed.validRows - rowsAlreadyStored),
    dateFrom: parsed.dateFrom,
    dateTo: parsed.dateTo,
    channels: parsed.channels,
    models: parsed.models,
    regions: parsed.regions,
    errors: parsed.errors,
    alreadyImported:
      existingImport?.status === "COMPLETED" && rowsAlreadyStored === parsed.validRows,
    existingImport,
  };
}

export async function previewLeadCsv(input: {
  fileName: string;
  bytes: Buffer;
}): Promise<LeadCsvPreview> {
  const fileName = sanitizeLeadCsvFileName(input.fileName);
  const parsed = parseLeadCsv(input.bytes);
  const [existingImport, rowsAlreadyStored] = await Promise.all([
    findImportByHash(parsed.fileHash),
    countExistingRecords(parsed.records.map(record => record.recordHash)),
  ]);
  return buildPreview(parsed, fileName, rowsAlreadyStored, existingImport);
}

async function markImportFailed(importId: number, error: unknown): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const message = error instanceof Error ? error.message : "Falha não identificada durante a importação.";
  await db
    .update(leadImports)
    .set({
      status: "FAILED",
      errorSummary: [message.slice(0, 500)],
      completedAt: Date.now(),
    })
    .where(eq(leadImports.id, importId));
}

async function createOrResetImport(input: {
  parsed: ParsedLeadCsv;
  fileName: string;
  actor: string;
  existingImport: LeadImport | null;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const now = Date.now();

  if (input.existingImport) {
    if (
      input.existingImport.status === "PROCESSING" &&
      now - input.existingImport.createdAt < PROCESSING_TIMEOUT_MS
    ) {
      throw new Error("Este arquivo já está sendo processado. Aguarde a conclusão antes de tentar novamente.");
    }
    await db
      .update(leadImports)
      .set({
        fileName: input.fileName,
        fileSizeBytes: input.parsed.fileSizeBytes,
        fileKey: null,
        fileUrl: null,
        status: "PROCESSING",
        rowsTotal: input.parsed.rowsTotal,
        rowsInserted: 0,
        rowsSkipped: 0,
        rowsInvalid: input.parsed.invalidRows,
        errorSummary: null,
        importedBy: input.actor,
        createdAt: now,
        completedAt: null,
      })
      .where(eq(leadImports.id, input.existingImport.id));
    return input.existingImport.id;
  }

  await db.insert(leadImports).values({
    fileName: input.fileName,
    fileHash: input.parsed.fileHash,
    fileSizeBytes: input.parsed.fileSizeBytes,
    status: "PROCESSING",
    rowsTotal: input.parsed.rowsTotal,
    rowsInserted: 0,
    rowsSkipped: 0,
    rowsInvalid: input.parsed.invalidRows,
    importedBy: input.actor,
    createdAt: now,
  });
  const [created] = await db
    .select({ id: leadImports.id })
    .from(leadImports)
    .where(eq(leadImports.fileHash, input.parsed.fileHash))
    .limit(1);
  if (!created) throw new Error("Não foi possível registrar o lote de importação.");
  return created.id;
}

export async function importLeadCsv(input: {
  fileName: string;
  bytes: Buffer;
  actor: string;
}): Promise<LeadCsvImportResult> {
  const fileName = sanitizeLeadCsvFileName(input.fileName);
  const parsed = parseLeadCsv(input.bytes);
  const actor = input.actor.trim();
  if (!actor) throw new Error("Usuário responsável pela importação não identificado.");

  const existingImport = await findImportByHash(parsed.fileHash);
  const rowsAlreadyStored = await countExistingRecords(parsed.records.map(record => record.recordHash));
  const preview = buildPreview(parsed, fileName, rowsAlreadyStored, existingImport);

  if (
    existingImport?.status === "COMPLETED" &&
    rowsAlreadyStored === parsed.validRows
  ) {
    return {
      ...preview,
      importId: existingImport.id,
      status: "COMPLETED",
      rowsInserted: 0,
      rowsSkipped: parsed.validRows,
      rowsInvalid: parsed.invalidRows,
      idempotent: true,
      fileUrl: existingImport.fileUrl,
      importedAt: existingImport.completedAt ?? existingImport.createdAt,
    };
  }
  if (parsed.invalidRows > 0) {
    throw new LeadCsvValidationError(
      `O arquivo possui ${parsed.invalidRows.toLocaleString("pt-BR")} linha(s) inválida(s). Corrija o CSV antes de confirmar a importação.`,
    );
  }
  if (parsed.validRows === 0) {
    throw new LeadCsvValidationError(
      "O arquivo não contém nenhuma linha válida para substituir a base consolidada.",
    );
  }

  const importId = await createOrResetImport({ parsed, fileName, actor, existingImport });

  try {
    const stored = await storagePut(
      `lead-imports/${parsed.fileHash.slice(0, 12)}/${fileName}`,
      input.bytes,
      "text/csv; charset=utf-8",
    );
    const db = await getDb();
    if (!db) throw new Error("Banco de dados indisponível");
    const now = Date.now();

    const result = await db.transaction(async tx => {
      if (existingImport) {
        await tx.delete(leads).where(eq(leads.importId, importId));
      }

      for (const recordsChunk of chunk(parsed.records, INSERT_CHUNK_SIZE)) {
        await tx
          .insert(leads)
          .ignore()
          .values(
            recordsChunk.map(record => ({
              importId,
              sourceRowNumber: record.sourceRowNumber,
              recordHash: record.recordHash,
              correctedDate: record.correctedDate,
              correctedDateRaw: record.correctedDateRaw,
              sourceDateRaw: record.sourceDateRaw,
              channel: record.channel,
              channelRaw: record.channelRaw,
              model: record.model,
              modelRaw: record.modelRaw,
              region: record.region,
              regionRaw: record.regionRaw,
              city: record.city,
              cityRaw: record.cityRaw,
              dealerName: record.dealerName,
              dealerRaw: record.dealerRaw,
              contactName: record.contactName,
              email: record.email,
              phone: record.phone,
              rawPayload: record.rawPayload,
              createdAt: now,
            })),
          );
      }

      const insertedRows = await tx
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.importId, importId));
      const rowsInserted = insertedRows.length;
      if (rowsInserted !== parsed.validRows) {
        throw new Error(
          `Falha de integridade: eram esperadas ${parsed.validRows} inserções válidas, mas somente ${rowsInserted} foram confirmadas.`,
        );
      }
      const rowsSkipped = parsed.validRows - rowsInserted;

      // O CSV recebido é uma base consolidada completa. A base anterior só é
      // removida após a confirmação integral do novo lote, dentro da mesma
      // transação, para que qualquer falha preserve todos os dados anteriores.
      await tx.delete(leads).where(ne(leads.importId, importId));

      await tx
        .update(leadImports)
        .set({
          fileKey: stored.key,
          fileUrl: stored.url,
          status: "COMPLETED",
          rowsTotal: parsed.rowsTotal,
          rowsInserted,
          rowsSkipped,
          rowsInvalid: parsed.invalidRows,
          errorSummary: null,
          completedAt: now,
        })
        .where(and(eq(leadImports.id, importId), eq(leadImports.status, "PROCESSING")));

      return { rowsInserted, rowsSkipped };
    });

    return {
      ...preview,
      importId,
      status: "COMPLETED",
      rowsInserted: result.rowsInserted,
      rowsSkipped: result.rowsSkipped,
      rowsInvalid: parsed.invalidRows,
      idempotent: false,
      fileUrl: stored.url,
      importedAt: now,
    };
  } catch (error) {
    await markImportFailed(importId, error);
    throw error;
  }
}

export async function getLeadImportHistory(limit = 20): Promise<LeadImport[]> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db
    .select()
    .from(leadImports)
    .orderBy(desc(leadImports.createdAt))
    .limit(Math.max(1, Math.min(100, limit)));
}
