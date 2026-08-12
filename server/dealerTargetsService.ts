import { createHash } from "node:crypto";

import { and, asc, eq } from "drizzle-orm";
import ExcelJS from "exceljs";

import { dealerMonthlyTargets } from "../drizzle/schema";
import dealerTargetAliases from "./data/dealer-target-aliases.json";
import {
  getOfficialDealers,
  normalizeDealerLookupKey,
} from "./dealerNormalization";
import { getDb } from "./db";
import { storagePut } from "./storage";
import { resolveWeeklySalesCanonicalDealer } from "./weeklySalesCsv";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const REQUIRED_HEADERS = [
  "DEALER",
  "GOOGLE",
  "META",
  "PUBLYA",
  "WEBMOTORS",
  "MERCADO LIVRE",
  "TIKTOK",
  "TOTAL DEALER",
  "SALES",
  "WEIGHT",
  "CONVERSION INVESTMENT",
] as const;

export type DealerTargetChannelTargets = {
  google: number;
  meta: number;
  publya: number;
  webmotors: number;
  mercadoLivre: number;
  tiktok: number;
};

export type DealerTargetParsedRow = {
  sourceRowNumber: number;
  sourceDealerName: string;
  officialDealerName: string;
  canonicalDealer: string;
  canonicalDealerKey: string;
  stateCode: string;
  leadTarget: number;
  salesTarget: number;
  channelTargets: DealerTargetChannelTargets;
  channelTotal: number;
  weightPercent: number;
  conversionInvestment: number;
  recordHash: string;
};

export type DealerTargetsPreview = {
  fileName: string;
  fileHash: string;
  competence: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    rows: number;
    matchedRows: number;
    unmatchedRows: number;
    duplicateDealerKeys: number;
    missingOfficialDealers: number;
    totalLeadTarget: number;
    totalSalesTarget: number;
    channelTotal: number;
    channelDifference: number;
  };
  rows: DealerTargetParsedRow[];
};

export type DealerTargetsImportResult = DealerTargetsPreview & {
  status: "UPDATED" | "NO_CHANGES";
  idempotent: boolean;
  rowsInserted: number;
  fileUrl: string | null;
  importedAt: number;
};

export function decodeDealerTargetsBase64(value: string): Buffer {
  const trimmed = value.trim();
  const match = trimmed.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  const payload = match?.[2] ?? trimmed;
  if (match && !/spreadsheetml\.sheet|octet-stream/i.test(match[1])) {
    throw new Error("O tipo MIME informado não corresponde a uma planilha XLSX.");
  }
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(payload)) {
    throw new Error("O conteúdo base64 da planilha de metas é inválido.");
  }
  const bytes = Buffer.from(payload.replace(/\s/g, ""), "base64");
  if (!bytes.length) throw new Error("A planilha de metas está vazia.");
  return bytes;
}

export function dealerTargetRecordSetsEqual(
  currentRows: readonly Pick<typeof dealerMonthlyTargets.$inferSelect, "recordHash">[],
  nextRows: readonly Pick<DealerTargetParsedRow, "recordHash">[],
): boolean {
  if (currentRows.length !== nextRows.length) return false;
  const currentHashes = currentRows.map(row => row.recordHash).sort();
  const nextHashes = nextRows.map(row => row.recordHash).sort();
  return currentHashes.every((hash, index) => hash === nextHashes[index]);
}

function assertCompetence(competence: string): void {
  if (!/^\d{4}-\d{2}$/.test(competence)) {
    throw new Error("Competência das metas inválida. Use AAAA-MM.");
  }
  const [year, month] = competence.split("-").map(Number);
  if (year < 2020 || year > 2100 || month < 1 || month > 12) {
    throw new Error("Competência das metas fora do intervalo permitido.");
  }
}

function assertWorkbook(input: { fileName: string; bytes: Buffer }): void {
  if (!input.fileName.trim().toLowerCase().endsWith(".xlsx")) {
    throw new Error("A planilha de metas precisa estar no formato XLSX.");
  }
  if (input.bytes.length === 0) throw new Error("A planilha de metas está vazia.");
  if (input.bytes.length > MAX_FILE_SIZE_BYTES) {
    throw new Error("A planilha de metas excede o limite de 5 MB.");
  }
  if (!input.bytes.subarray(0, 2).equals(Buffer.from("PK"))) {
    throw new Error("O conteúdo informado não corresponde a um arquivo XLSX válido.");
  }
}

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "result" in value) return String(value.result ?? "").trim();
  return String(value).trim();
}

function numericValue(value: ExcelJS.CellValue): number {
  if (typeof value === "number") return value;
  const text = cellText(value)
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace("%", "");
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function integerValue(value: ExcelJS.CellValue, field: string, row: number): number {
  const parsed = numericValue(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Linha ${row}: ${field} precisa ser um inteiro maior ou igual a zero.`);
  }
  return parsed;
}

function decimalValue(value: ExcelJS.CellValue, field: string, row: number): number {
  const parsed = numericValue(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Linha ${row}: ${field} precisa ser um número maior ou igual a zero.`);
  }
  return parsed;
}

function stateCodeFromOperationalArea(operationalArea: string | null): string | null {
  return operationalArea?.trim().toUpperCase().match(/\/([A-Z]{2})$/)?.[1] ?? null;
}

function createRecordHash(row: Omit<DealerTargetParsedRow, "recordHash">): string {
  return createHash("sha256").update(JSON.stringify(row)).digest("hex");
}

export async function parseDealerTargetsWorkbook(input: {
  fileName: string;
  bytes: Buffer;
  competence: string;
}): Promise<DealerTargetsPreview> {
  const fileName = input.fileName.trim();
  assertWorkbook({ fileName, bytes: input.bytes });
  assertCompetence(input.competence);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(input.bytes as unknown as Parameters<typeof workbook.xlsx.load>[0]);
  const sheet = workbook.getWorksheet(dealerTargetAliases.sourceSheet) ?? workbook.worksheets[0];
  if (!sheet) throw new Error("A planilha de metas não possui abas legíveis.");

  const headerIndex = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, column) => {
    headerIndex.set(cellText(cell.value).toUpperCase(), column);
  });
  const missingHeaders = REQUIRED_HEADERS.filter(header => !headerIndex.has(header));
  if (missingHeaders.length) {
    throw new Error(`Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(", ")}.`);
  }

  const officialByKey = new Map(
    getOfficialDealers().map(dealer => [normalizeDealerLookupKey(dealer.name), dealer] as const),
  );
  const aliasByKey = new Map(
    dealerTargetAliases.mappings.map(mapping => [normalizeDealerLookupKey(mapping.source), mapping.officialName] as const),
  );
  const errors: string[] = [];
  const warnings: string[] = [];
  const rows: DealerTargetParsedRow[] = [];
  let unmatchedRows = 0;

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const sourceDealerName = cellText(row.getCell(headerIndex.get("DEALER")!).value);
    if (!sourceDealerName) continue;
    try {
      const officialName = aliasByKey.get(normalizeDealerLookupKey(sourceDealerName));
      const official = officialName
        ? officialByKey.get(normalizeDealerLookupKey(officialName))
        : undefined;
      if (!official) {
        unmatchedRows += 1;
        errors.push(`Linha ${rowNumber}: concessionária sem de-para oficial (${sourceDealerName}).`);
        continue;
      }
      const canonicalDealer = resolveWeeklySalesCanonicalDealer(official.name).canonicalDealer;
      const canonicalDealerKey = normalizeDealerLookupKey(canonicalDealer);
      const stateCode = stateCodeFromOperationalArea(official.operationalArea);
      if (!canonicalDealerKey || !stateCode) {
        errors.push(`Linha ${rowNumber}: não foi possível resolver a chave ou UF de ${sourceDealerName}.`);
        continue;
      }
      const channelTargets: DealerTargetChannelTargets = {
        google: integerValue(row.getCell(headerIndex.get("GOOGLE")!).value, "GOOGLE", rowNumber),
        meta: integerValue(row.getCell(headerIndex.get("META")!).value, "META", rowNumber),
        publya: integerValue(row.getCell(headerIndex.get("PUBLYA")!).value, "PUBLYA", rowNumber),
        webmotors: integerValue(row.getCell(headerIndex.get("WEBMOTORS")!).value, "WEBMOTORS", rowNumber),
        mercadoLivre: integerValue(row.getCell(headerIndex.get("MERCADO LIVRE")!).value, "MERCADO LIVRE", rowNumber),
        tiktok: integerValue(row.getCell(headerIndex.get("TIKTOK")!).value, "TIKTOK", rowNumber),
      };
      const channelTotal = Object.values(channelTargets).reduce((sum, value) => sum + value, 0);
      const withoutHash = {
        sourceRowNumber: rowNumber,
        sourceDealerName,
        officialDealerName: official.name,
        canonicalDealer,
        canonicalDealerKey,
        stateCode,
        leadTarget: integerValue(row.getCell(headerIndex.get("TOTAL DEALER")!).value, "TOTAL DEALER", rowNumber),
        salesTarget: integerValue(row.getCell(headerIndex.get("SALES")!).value, "SALES", rowNumber),
        channelTargets,
        channelTotal,
        weightPercent: decimalValue(row.getCell(headerIndex.get("WEIGHT")!).value, "WEIGHT", rowNumber) * 100,
        conversionInvestment: decimalValue(
          row.getCell(headerIndex.get("CONVERSION INVESTMENT")!).value,
          "CONVERSION INVESTMENT",
          rowNumber,
        ),
      } satisfies Omit<DealerTargetParsedRow, "recordHash">;
      rows.push({ ...withoutHash, recordHash: createRecordHash(withoutHash) });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `Linha ${rowNumber}: erro não identificado.`);
    }
  }

  const duplicateKeys = Array.from(new Set(
    rows
      .map(row => row.canonicalDealerKey)
      .filter((key, index, keys) => keys.indexOf(key) !== index),
  ));
  if (duplicateKeys.length) {
    errors.push(`Há concessionárias duplicadas após o de-para: ${duplicateKeys.join(", ")}.`);
  }
  const importedOfficialKeys = new Set(rows.map(row => normalizeDealerLookupKey(row.officialDealerName)));
  const missingOfficialDealers = getOfficialDealers().filter(
    dealer => !importedOfficialKeys.has(normalizeDealerLookupKey(dealer.name)),
  );
  if (missingOfficialDealers.length) {
    errors.push(`Metas ausentes para: ${missingOfficialDealers.map(dealer => dealer.name).join(", ")}.`);
  }

  const totalLeadTarget = rows.reduce((sum, row) => sum + row.leadTarget, 0);
  const totalSalesTarget = rows.reduce((sum, row) => sum + row.salesTarget, 0);
  const channelTotal = rows.reduce((sum, row) => sum + row.channelTotal, 0);
  const channelDifference = channelTotal - totalLeadTarget;
  if (channelDifference !== 0) {
    warnings.push(
      `A soma dos canais (${channelTotal.toLocaleString("pt-BR")}) difere do TOTAL DEALER (${totalLeadTarget.toLocaleString("pt-BR")}) em ${channelDifference.toLocaleString("pt-BR")} por arredondamento.`,
    );
  }
  warnings.push("O arquivo não informa competência; foi utilizada a competência selecionada no dashboard.");

  return {
    fileName,
    fileHash: createHash("sha256").update(input.bytes).digest("hex"),
    competence: input.competence,
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      rows: rows.length + unmatchedRows,
      matchedRows: rows.length,
      unmatchedRows,
      duplicateDealerKeys: duplicateKeys.length,
      missingOfficialDealers: missingOfficialDealers.length,
      totalLeadTarget,
      totalSalesTarget,
      channelTotal,
      channelDifference,
    },
    rows,
  };
}

export async function previewDealerTargets(input: {
  fileName: string;
  bytes: Buffer;
  competence: string;
}): Promise<DealerTargetsPreview> {
  return parseDealerTargetsWorkbook(input);
}

export async function importDealerTargets(input: {
  fileName: string;
  bytes: Buffer;
  competence: string;
  actor: string;
  expectedFileHash?: string;
}): Promise<DealerTargetsImportResult> {
  const actor = input.actor.trim();
  if (!actor) throw new Error("Usuário responsável pela importação não identificado.");
  const preview = await parseDealerTargetsWorkbook(input);
  if (!preview.valid) throw new Error(preview.errors[0] ?? "A planilha de metas é inválida.");
  if (input.expectedFileHash && input.expectedFileHash !== preview.fileHash) {
    throw new Error("O arquivo mudou após a prévia. Gere uma nova prévia antes de confirmar.");
  }

  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const currentRows = await db
    .select()
    .from(dealerMonthlyTargets)
    .where(eq(dealerMonthlyTargets.competence, input.competence));
  if (dealerTargetRecordSetsEqual(currentRows, preview.rows)) {
    return {
      ...preview,
      status: "NO_CHANGES",
      idempotent: true,
      rowsInserted: 0,
      fileUrl: null,
      importedAt: Math.max(...currentRows.map(row => row.updatedAt), 0),
    };
  }

  const stored = await storagePut(
    `dealer-targets/${input.competence}/${preview.fileHash.slice(0, 12)}/${preview.fileName}`,
    input.bytes,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  const now = Date.now();
  await db.transaction(async tx => {
    await tx
      .delete(dealerMonthlyTargets)
      .where(eq(dealerMonthlyTargets.competence, input.competence));
    await tx.insert(dealerMonthlyTargets).values(
      preview.rows.map(row => ({
        competence: input.competence,
        sourceRowNumber: row.sourceRowNumber,
        sourceDealerName: row.sourceDealerName,
        officialDealerName: row.officialDealerName,
        canonicalDealer: row.canonicalDealer,
        canonicalDealerKey: row.canonicalDealerKey,
        stateCode: row.stateCode,
        leadTarget: row.leadTarget,
        salesTarget: row.salesTarget,
        channelTargets: row.channelTargets,
        weightPercent: row.weightPercent.toFixed(4),
        conversionInvestment: row.conversionInvestment.toFixed(2),
        sourceFileName: preview.fileName,
        sourceFileHash: preview.fileHash,
        recordHash: row.recordHash,
        importedBy: actor,
        createdAt: now,
        updatedAt: now,
      })),
    );
  });

  return {
    ...preview,
    status: "UPDATED",
    idempotent: false,
    rowsInserted: preview.rows.length,
    fileUrl: stored.url,
    importedAt: now,
  };
}

export async function getDealerTargetsForCompetence(competence: string) {
  assertCompetence(competence);
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db
    .select()
    .from(dealerMonthlyTargets)
    .where(eq(dealerMonthlyTargets.competence, competence))
    .orderBy(asc(dealerMonthlyTargets.canonicalDealer));
}

export async function getDealerTargetByKey(competence: string, canonicalDealerKey: string) {
  assertCompetence(competence);
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [target] = await db
    .select()
    .from(dealerMonthlyTargets)
    .where(
      and(
        eq(dealerMonthlyTargets.competence, competence),
        eq(dealerMonthlyTargets.canonicalDealerKey, canonicalDealerKey),
      ),
    )
    .limit(1);
  return target ?? null;
}
