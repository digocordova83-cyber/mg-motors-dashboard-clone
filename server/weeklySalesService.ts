import { getDashboardCutoffDate } from "@shared/dashboardDates";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

import {
  leads,
  weeklySalesImports,
  weeklySalesRecords,
  type WeeklySalesImport,
} from "../drizzle/schema";
import { canonicalizeDealerName, normalizeDealerLookupKey } from "./dealerNormalization";
import { getDb } from "./db";
import { LEADS_UNAVAILABLE } from "./leadsAnalytics";
import { storagePut } from "./storage";
import {
  parseWeeklySalesCsv,
  type WeeklySalesCsvPreview,
  type WeeklySalesRow,
  type WeeklySalesWeekMetrics,
} from "./weeklySalesCsv";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_HISTORY_LIMIT = 100;
const PROCESSING_TIMEOUT_MS = 15 * 60 * 1000;
const INSERT_CHUNK_SIZE = 100;

export type WeeklySalesDealerPreviewRow = {
  sourceRowNumber: number;
  sourceName: string;
  canonicalDealer: string;
  matchStatus: "MATCHED" | "UNMATCHED";
  week4Retail: number | null;
  week4AchievementPercent: number | null;
};

export type WeeklySalesPreviewResult = {
  fileName: string;
  fileHash: string;
  competence: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: WeeklySalesCsvPreview["summary"] & {
    matchedDealerRows: number;
    unmatchedDealerRows: number;
  };
  dealers: WeeklySalesDealerPreviewRow[];
  unmatchedDealers: string[];
};

export type WeeklySalesImportResult = WeeklySalesPreviewResult & {
  importId: number;
  status: "COMPLETED";
  idempotent: boolean;
  rowsInserted: number;
  fileUrl: string | null;
  importedAt: number;
};

export type WeeklyLeadCounts = Record<"1" | "2" | "3" | "4", number>;

export type WeeklySalesDealerWeekMetric = WeeklySalesWeekMetrics & {
  leads: number | null;
};

export type WeeklySalesDealerMetric = {
  sourceName: string;
  dealerName: string;
  matchStatus: "MATCHED" | "UNMATCHED";
  leads: number;
  sales: number | null;
  conversionRatePercent: number | null;
  leadsPerSale: number | null;
  estimatedLeadsNeeded: number | null;
  weeks: Record<string, WeeklySalesDealerWeekMetric>;
};

export type WeeklySalesMetrics = {
  competence: string;
  dateFrom: string;
  dateTo: string;
  import: {
    id: number;
    fileName: string;
    importedBy: string;
    importedAt: number;
  } | null;
  summary: {
    dealers: number;
    matchedDealers: number;
    unmatchedDealers: number;
    dealersWithoutWeek4Sales: number;
    totalLeads: number;
    totalSales: number;
    matchedSales: number;
    unmatchedSales: number;
    conversionRatePercent: number | null;
    leadsPerSale: number | null;
    estimatedLeadsNeeded: number | null;
  };
  dealers: WeeklySalesDealerMetric[];
};

type EnrichedSalesRow = WeeklySalesRow & {
  matchStatus: "MATCHED" | "UNMATCHED" | "AGGREGATE";
};

function assertCompetence(competence: string): void {
  if (!/^\d{4}-\d{2}$/.test(competence)) {
    throw new Error("Competência de vendas inválida. Use AAAA-MM.");
  }
  const [year, month] = competence.split("-").map(Number);
  if (year < 2020 || year > 2100 || month < 1 || month > 12) {
    throw new Error("Competência de vendas fora do intervalo permitido.");
  }
}

function sanitizeFileName(fileName: string): string {
  const clean = fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 180);
  if (!clean.toLocaleLowerCase("en-US").endsWith(".csv")) {
    throw new Error("Selecione um arquivo de vendas no formato CSV.");
  }
  return clean || "weekly-sales.csv";
}

function assertFileSize(bytes: Buffer): void {
  if (bytes.length === 0) throw new Error("O arquivo de vendas está vazio.");
  if (bytes.length > MAX_FILE_SIZE_BYTES) {
    throw new Error("O arquivo de vendas excede o limite de 5 MB.");
  }
}

function monthBounds(competence: string): { dateFrom: string; dateTo: string } {
  assertCompetence(competence);
  const [year, month] = competence.split("-").map(Number);
  const dateFrom = `${competence}-01`;
  const monthEnd = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
  const cutoff = getDashboardCutoffDate();
  return {
    dateFrom,
    dateTo: cutoff.slice(0, 7) === competence && cutoff < monthEnd ? cutoff : monthEnd,
  };
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function decimalValue(value: number | null): string | null {
  return value === null ? null : value.toFixed(2);
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function getKnownDealerKeys(): Promise<Set<string>> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.selectDistinct({ dealerName: leads.dealerName }).from(leads);
  const unavailableKey = normalizeDealerLookupKey(LEADS_UNAVAILABLE);
  return new Set(
    rows
      .map(row => canonicalizeDealerName(row.dealerName ?? ""))
      .map(normalizeDealerLookupKey)
      .filter(key => Boolean(key) && key !== unavailableKey),
  );
}

export function getWeeklyLeadCutoffDates(
  competence: string,
  dateTo: string,
): Record<keyof WeeklyLeadCounts, string> {
  assertCompetence(competence);
  if (!dateTo.startsWith(`${competence}-`)) {
    throw new Error("A data final precisa pertencer à competência informada.");
  }
  const cappedDate = (day: number) => {
    const boundary = `${competence}-${String(day).padStart(2, "0")}`;
    return boundary < dateTo ? boundary : dateTo;
  };
  return {
    "1": cappedDate(7),
    "2": cappedDate(14),
    "3": cappedDate(21),
    "4": dateTo,
  };
}

export function buildCumulativeWeeklyLeadCounts(
  rows: Array<{ dealerName: string | null; correctedDate: string; count: number }>,
  cutoffs: Record<keyof WeeklyLeadCounts, string>,
): Map<string, WeeklyLeadCounts> {
  const counts = new Map<string, WeeklyLeadCounts>();
  const unavailableKey = normalizeDealerLookupKey(LEADS_UNAVAILABLE);
  const weeks: Array<keyof WeeklyLeadCounts> = ["1", "2", "3", "4"];

  for (const row of rows) {
    const canonical = canonicalizeDealerName(row.dealerName ?? "");
    const key = normalizeDealerLookupKey(canonical);
    if (!key || key === unavailableKey) continue;
    const current = counts.get(key) ?? { "1": 0, "2": 0, "3": 0, "4": 0 };
    for (const week of weeks) {
      if (row.correctedDate <= cutoffs[week]) current[week] += Number(row.count ?? 0);
    }
    counts.set(key, current);
  }

  return counts;
}

async function getLeadCountsByDealerAndWeek(
  competence: string,
): Promise<Map<string, WeeklyLeadCounts>> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const { dateFrom, dateTo } = monthBounds(competence);
  const rows = await db
    .select({
      dealerName: leads.dealerName,
      correctedDate: leads.correctedDate,
      count: sql<number>`count(*)`,
    })
    .from(leads)
    .where(and(gte(leads.correctedDate, dateFrom), lte(leads.correctedDate, dateTo)))
    .groupBy(leads.dealerName, leads.correctedDate);

  return buildCumulativeWeeklyLeadCounts(
    rows.map(row => ({ ...row, count: Number(row.count ?? 0) })),
    getWeeklyLeadCutoffDates(competence, dateTo),
  );
}

function enrichRows(parsed: WeeklySalesCsvPreview, knownDealerKeys: Set<string>): EnrichedSalesRow[] {
  return parsed.rows.map(row => {
    if (row.rowType !== "DEALER") return { ...row, matchStatus: "AGGREGATE" as const };
    const matchStatus =
      row.canonicalDealerKey && knownDealerKeys.has(row.canonicalDealerKey)
        ? ("MATCHED" as const)
        : ("UNMATCHED" as const);
    return { ...row, matchStatus };
  });
}

function buildPreview(input: {
  fileName: string;
  competence: string;
  parsed: WeeklySalesCsvPreview;
  rows: EnrichedSalesRow[];
}): WeeklySalesPreviewResult {
  const dealerRows = input.rows.filter(
    (row): row is EnrichedSalesRow & { canonicalDealer: string } =>
      row.rowType === "DEALER" && Boolean(row.canonicalDealer),
  );
  const matchedDealerRows = dealerRows.filter(row => row.matchStatus === "MATCHED").length;
  const unmatchedDealerRows = dealerRows.filter(row => row.matchStatus === "UNMATCHED").length;
  const unmatchedDealers = dealerRows
    .filter(row => row.matchStatus === "UNMATCHED")
    .map(row => row.sourceName)
    .sort((left, right) => left.localeCompare(right, "pt-BR"));

  return {
    fileName: input.fileName,
    fileHash: input.parsed.fileHash,
    competence: input.competence,
    valid: input.parsed.errors.length === 0 && input.parsed.summary.reconciliationPassed,
    errors: input.parsed.errors,
    warnings: input.parsed.warnings,
    summary: {
      ...input.parsed.summary,
      matchedDealerRows,
      unmatchedDealerRows,
    },
    dealers: dealerRows.map(row => ({
      sourceRowNumber: row.sourceRowNumber,
      sourceName: row.sourceName,
      canonicalDealer: row.canonicalDealer,
      matchStatus: row.matchStatus as "MATCHED" | "UNMATCHED",
      week4Retail: row.weeks["4"]?.retail ?? null,
      week4AchievementPercent: row.weeks["4"]?.achievementPercent ?? null,
    })),
    unmatchedDealers,
  };
}

export async function previewWeeklySalesCsv(input: {
  fileName: string;
  bytes: Buffer;
  competence: string;
}): Promise<WeeklySalesPreviewResult> {
  const fileName = sanitizeFileName(input.fileName);
  assertFileSize(input.bytes);
  assertCompetence(input.competence);
  const [parsed, knownDealerKeys] = await Promise.all([
    Promise.resolve(parseWeeklySalesCsv(input.bytes)),
    getKnownDealerKeys(),
  ]);
  const rows = enrichRows(parsed, knownDealerKeys);
  return buildPreview({ fileName, competence: input.competence, parsed, rows });
}

async function findImportByIdentity(fileHash: string, competence: string): Promise<WeeklySalesImport | null> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [existing] = await db
    .select()
    .from(weeklySalesImports)
    .where(
      and(
        eq(weeklySalesImports.fileHash, fileHash),
        eq(weeklySalesImports.competence, competence),
      ),
    )
    .limit(1);
  return existing ?? null;
}

async function createOrResetImport(input: {
  fileName: string;
  bytes: Buffer;
  competence: string;
  actor: string;
  parsed: WeeklySalesCsvPreview;
  preview: WeeklySalesPreviewResult;
  existing: WeeklySalesImport | null;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const now = Date.now();
  const values = {
    fileName: input.fileName,
    fileSizeBytes: input.bytes.length,
    competence: input.competence,
    referenceWeek: 4,
    status: "PROCESSING" as const,
    rowsTotal: input.parsed.summary.rowsTotal,
    dealerRows: input.parsed.summary.dealerRows,
    regionRows: input.parsed.summary.regionRows,
    totalRows: input.parsed.summary.totalRows,
    rowsInserted: 0,
    rowsInvalid: input.parsed.errors.length,
    matchedDealerRows: input.preview.summary.matchedDealerRows,
    unmatchedDealerRows: input.preview.summary.unmatchedDealerRows,
    dealersWithoutWeek4Sales: input.parsed.summary.dealersWithoutWeek4Sales,
    week4DealerSalesTotal: input.parsed.summary.week4DealerSalesTotal,
    week4RegionSalesTotal: input.parsed.summary.week4RegionSalesTotal,
    week4ReportedSalesTotal: input.parsed.summary.week4ReportedSalesTotal,
    reconciliationPassed: input.parsed.summary.reconciliationPassed,
    errorSummary: input.parsed.errors.length ? input.parsed.errors : null,
    importedBy: input.actor,
    createdAt: now,
    completedAt: null,
  };

  if (input.existing) {
    if (
      input.existing.status === "PROCESSING" &&
      now - input.existing.createdAt < PROCESSING_TIMEOUT_MS
    ) {
      throw new Error("Este arquivo de vendas já está sendo processado. Aguarde a conclusão.");
    }
    await db.update(weeklySalesImports).set(values).where(eq(weeklySalesImports.id, input.existing.id));
    return input.existing.id;
  }

  await db.insert(weeklySalesImports).values({
    ...values,
    fileHash: input.parsed.fileHash,
  });
  const created = await findImportByIdentity(input.parsed.fileHash, input.competence);
  if (!created) throw new Error("Não foi possível registrar o lote de vendas semanais.");
  return created.id;
}

async function markImportFailed(importId: number, error: unknown): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const message = error instanceof Error ? error.message : "Falha não identificada na importação.";
  await db
    .update(weeklySalesImports)
    .set({ status: "FAILED", errorSummary: [message.slice(0, 500)], completedAt: Date.now() })
    .where(eq(weeklySalesImports.id, importId));
}

export async function importWeeklySalesCsv(input: {
  fileName: string;
  bytes: Buffer;
  competence: string;
  actor: string;
  expectedFileHash?: string;
}): Promise<WeeklySalesImportResult> {
  const actor = input.actor.trim();
  if (!actor) throw new Error("Usuário responsável pela importação não identificado.");
  const fileName = sanitizeFileName(input.fileName);
  assertFileSize(input.bytes);
  assertCompetence(input.competence);

  const [parsed, knownDealerKeys] = await Promise.all([
    Promise.resolve(parseWeeklySalesCsv(input.bytes)),
    getKnownDealerKeys(),
  ]);
  if (input.expectedFileHash && input.expectedFileHash !== parsed.fileHash) {
    throw new Error("O arquivo mudou após a prévia. Gere uma nova prévia antes de confirmar.");
  }
  const rows = enrichRows(parsed, knownDealerKeys);
  const preview = buildPreview({ fileName, competence: input.competence, parsed, rows });
  if (!preview.valid) {
    throw new Error(
      preview.errors[0] ?? "O arquivo de vendas não passou na reconciliação da Semana 4.",
    );
  }

  const existing = await findImportByIdentity(parsed.fileHash, input.competence);
  if (existing?.status === "COMPLETED") {
    return {
      ...preview,
      importId: existing.id,
      status: "COMPLETED",
      idempotent: true,
      rowsInserted: 0,
      fileUrl: existing.fileUrl,
      importedAt: existing.completedAt ?? existing.createdAt,
    };
  }

  const importId = await createOrResetImport({
    fileName,
    bytes: input.bytes,
    competence: input.competence,
    actor,
    parsed,
    preview,
    existing,
  });

  try {
    const stored = await storagePut(
      `weekly-sales/${input.competence}/${parsed.fileHash.slice(0, 12)}/${fileName}`,
      input.bytes,
      "text/csv; charset=utf-8",
    );
    const db = await getDb();
    if (!db) throw new Error("Banco de dados indisponível");
    const now = Date.now();

    const rowsInserted = await db.transaction(async tx => {
      await tx.delete(weeklySalesRecords).where(eq(weeklySalesRecords.importId, importId));
      for (const rowsChunk of chunk(rows, INSERT_CHUNK_SIZE)) {
        await tx.insert(weeklySalesRecords).values(
          rowsChunk.map(row => ({
            importId,
            competence: input.competence,
            sourceRowNumber: row.sourceRowNumber,
            rowType: row.rowType,
            sourceName: row.sourceName,
            sourceKey: row.sourceKey,
            canonicalDealer: row.canonicalDealer,
            canonicalDealerKey: row.canonicalDealerKey,
            matchStatus: row.matchStatus,
            recordHash: row.recordHash,
            week1Target: decimalValue(row.weeks["1"]?.target ?? null),
            week1Retail: row.weeks["1"]?.retail ?? null,
            week1Achievement: decimalValue(row.weeks["1"]?.achievementPercent ?? null),
            week2Target: decimalValue(row.weeks["2"]?.target ?? null),
            week2Retail: row.weeks["2"]?.retail ?? null,
            week2Achievement: decimalValue(row.weeks["2"]?.achievementPercent ?? null),
            week3Target: decimalValue(row.weeks["3"]?.target ?? null),
            week3Retail: row.weeks["3"]?.retail ?? null,
            week3Achievement: decimalValue(row.weeks["3"]?.achievementPercent ?? null),
            week4Target: decimalValue(row.weeks["4"]?.target ?? null),
            week4Retail: row.weeks["4"]?.retail ?? null,
            week4Achievement: decimalValue(row.weeks["4"]?.achievementPercent ?? null),
            week5Target: decimalValue(row.weeks["5"]?.target ?? null),
            week5Retail: row.weeks["5"]?.retail ?? null,
            week5Achievement: decimalValue(row.weeks["5"]?.achievementPercent ?? null),
            rawPayload: { tokens: row.tokens, weeks: row.weeks },
            createdAt: now,
          })),
        );
      }

      const [confirmed] = await tx
        .select({ count: sql<number>`count(*)` })
        .from(weeklySalesRecords)
        .where(eq(weeklySalesRecords.importId, importId));
      const count = Number(confirmed?.count ?? 0);
      if (count !== rows.length) {
        throw new Error(`Falha de integridade: esperadas ${rows.length} linhas, confirmadas ${count}.`);
      }

      await tx
        .update(weeklySalesImports)
        .set({
          fileKey: stored.key,
          fileUrl: stored.url,
          status: "COMPLETED",
          rowsInserted: count,
          rowsInvalid: 0,
          errorSummary: null,
          completedAt: now,
        })
        .where(eq(weeklySalesImports.id, importId));
      return count;
    });

    return {
      ...preview,
      importId,
      status: "COMPLETED",
      idempotent: false,
      rowsInserted,
      fileUrl: stored.url,
      importedAt: now,
    };
  } catch (error) {
    await markImportFailed(importId, error);
    throw error;
  }
}

export async function getWeeklySalesImportHistory(limit = 20): Promise<WeeklySalesImport[]> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db
    .select()
    .from(weeklySalesImports)
    .orderBy(desc(weeklySalesImports.createdAt))
    .limit(Math.max(1, Math.min(MAX_HISTORY_LIMIT, limit)));
}

function toWeekMetrics(
  record: typeof weeklySalesRecords.$inferSelect,
  weeklyLeads: WeeklyLeadCounts | null,
): Record<string, WeeklySalesDealerWeekMetric> {
  const metric = (
    target: string | null,
    retail: number | null,
    achievement: string | null,
    leadsCount: number | null,
  ): WeeklySalesDealerWeekMetric => ({
    target: target === null ? null : Number(target),
    retail,
    achievementPercent: achievement === null ? null : Number(achievement),
    leads: leadsCount,
  });
  return {
    "1": metric(record.week1Target, record.week1Retail, record.week1Achievement, weeklyLeads?.["1"] ?? null),
    "2": metric(record.week2Target, record.week2Retail, record.week2Achievement, weeklyLeads?.["2"] ?? null),
    "3": metric(record.week3Target, record.week3Retail, record.week3Achievement, weeklyLeads?.["3"] ?? null),
    "4": metric(record.week4Target, record.week4Retail, record.week4Achievement, weeklyLeads?.["4"] ?? null),
    "5": metric(record.week5Target, record.week5Retail, record.week5Achievement, null),
  };
}

export function calculateWeeklySalesEfficiency(leadsCount: number, sales: number | null) {
  if (sales === null || leadsCount <= 0) {
    return {
      conversionRatePercent: null,
      leadsPerSale: null,
      estimatedLeadsNeeded: null,
    };
  }
  if (sales === 0) {
    return {
      conversionRatePercent: 0,
      leadsPerSale: null,
      estimatedLeadsNeeded: null,
    };
  }
  const leadsPerSale = leadsCount / sales;
  return {
    conversionRatePercent: round((sales / leadsCount) * 100),
    leadsPerSale: round(leadsPerSale),
    estimatedLeadsNeeded: Math.ceil(leadsPerSale),
  };
}

export async function getWeeklySalesMetrics(competence: string): Promise<WeeklySalesMetrics> {
  assertCompetence(competence);
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const { dateFrom, dateTo } = monthBounds(competence);
  const [latestImport] = await db
    .select()
    .from(weeklySalesImports)
    .where(
      and(
        eq(weeklySalesImports.competence, competence),
        eq(weeklySalesImports.status, "COMPLETED"),
      ),
    )
    .orderBy(desc(weeklySalesImports.completedAt), desc(weeklySalesImports.createdAt))
    .limit(1);

  if (!latestImport) {
    return {
      competence,
      dateFrom,
      dateTo,
      import: null,
      summary: {
        dealers: 0,
        matchedDealers: 0,
        unmatchedDealers: 0,
        dealersWithoutWeek4Sales: 0,
        totalLeads: 0,
        totalSales: 0,
        matchedSales: 0,
        unmatchedSales: 0,
        conversionRatePercent: null,
        leadsPerSale: null,
        estimatedLeadsNeeded: null,
      },
      dealers: [],
    };
  }

  const [records, leadCountsByWeek] = await Promise.all([
    db
      .select()
      .from(weeklySalesRecords)
      .where(
        and(
          eq(weeklySalesRecords.importId, latestImport.id),
          eq(weeklySalesRecords.rowType, "DEALER"),
        ),
      ),
    getLeadCountsByDealerAndWeek(competence),
  ]);

  const dealers = records
    .map(record => {
      const key = record.canonicalDealerKey ?? "";
      const weeklyLeads =
        record.matchStatus === "MATCHED"
          ? (leadCountsByWeek.get(key) ?? { "1": 0, "2": 0, "3": 0, "4": 0 })
          : null;
      const leadsCount = weeklyLeads?.["4"] ?? 0;
      const efficiency = calculateWeeklySalesEfficiency(leadsCount, record.week4Retail);
      return {
        sourceName: record.sourceName,
        dealerName: record.canonicalDealer ?? record.sourceName,
        matchStatus: record.matchStatus as "MATCHED" | "UNMATCHED",
        leads: leadsCount,
        sales: record.week4Retail,
        ...efficiency,
        weeks: toWeekMetrics(record, weeklyLeads),
      } satisfies WeeklySalesDealerMetric;
    })
    .sort(
      (left, right) =>
        (right.sales ?? -1) - (left.sales ?? -1) ||
        left.dealerName.localeCompare(right.dealerName, "pt-BR"),
    );

  const matchedDealers = dealers.filter(dealer => dealer.matchStatus === "MATCHED");
  const unmatchedDealers = dealers.filter(dealer => dealer.matchStatus === "UNMATCHED");
  const totalLeads = matchedDealers.reduce((total, dealer) => total + dealer.leads, 0);
  const matchedSales = matchedDealers.reduce((total, dealer) => total + (dealer.sales ?? 0), 0);
  const unmatchedSales = unmatchedDealers.reduce((total, dealer) => total + (dealer.sales ?? 0), 0);
  const totalSales = matchedSales + unmatchedSales;
  const overallEfficiency = calculateWeeklySalesEfficiency(totalLeads, matchedSales);

  return {
    competence,
    dateFrom,
    dateTo,
    import: {
      id: latestImport.id,
      fileName: latestImport.fileName,
      importedBy: latestImport.importedBy,
      importedAt: latestImport.completedAt ?? latestImport.createdAt,
    },
    summary: {
      dealers: dealers.length,
      matchedDealers: matchedDealers.length,
      unmatchedDealers: unmatchedDealers.length,
      dealersWithoutWeek4Sales: dealers.filter(dealer => dealer.sales === null).length,
      totalLeads,
      totalSales,
      matchedSales,
      unmatchedSales,
      ...overallEfficiency,
    },
    dealers,
  };
}
