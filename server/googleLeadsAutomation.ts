import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  analyzeLeadCsvAgainstCurrentBase,
  importLeadCsv,
  type LeadCsvCurrentBaseAnalysis,
  type LeadCsvImportResult,
} from "./leadsImportService";
import {
  applySeptemberJulyLeadAdjustment,
  type LeadDateAdjustmentResult,
} from "./leadDateAdjustments";
import {
  preserveMissingCanonicalLeads,
  type LeadHistoryPreservationResult,
} from "./leadSourceHistoryPreservation";
import { replaceMetaBaseLeadDailyMetrics } from "./metaBaseLeadMetricsService";
import { getYesterdayInSaoPaulo } from "./leadsCsv";

export const GOOGLE_LEADS_SPREADSHEET_ID = "1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8";
export const GOOGLE_LEADS_SOURCE_URL =
  `https://docs.google.com/spreadsheets/d/${GOOGLE_LEADS_SPREADSHEET_ID}/export?format=xlsx`;
export const GOOGLE_LEADS_AUTOMATION_ACTOR = "scheduled-manus-google-leads";

export type GoogleLeadsMappingIssue = {
  sheet: string;
  source_row: number;
  field: string;
  value: string;
  message: string;
};

export type GoogleLeadsConsolidationReport = {
  sourceFile: string;
  masterCsv: string;
  masterXlsx: string;
  importCsv: string;
  rowsSourceTotal: number;
  rowsMasterOutput: number;
  rowsImportReady: number;
  rowsExcludedFromImport: number;
  issuesTotal: number;
  rowsWithIssues: number;
  channels: Record<string, number>;
  sourceChannels: Record<string, number>;
  models: Record<string, number>;
  metaBaseDailyMetrics: Array<{
    date: string;
    sourceRows: number;
    uniqueLeadIds: number;
  }>;
  metaBaseTimeZone: string;
  sheets: Array<{
    sheet: string;
    rows_read: number;
    rows_output: number;
    rows_empty: number;
    rows_with_issues: number;
  }>;
  issues: GoogleLeadsMappingIssue[];
};

export type GoogleLeadsAutomationStatus = "UPDATED" | "NO_CHANGES" | "DRY_RUN";

export type GoogleLeadsAutomationResult = {
  status: GoogleLeadsAutomationStatus;
  runLabel: string;
  runDirectory: string;
  reportJson: string;
  reportMarkdown: string;
  masterCsv: string;
  masterXlsx: string;
  importCsv: string;
  sourceRows: number;
  masterRows: number;
  sourceInvalidRows: number;
  duplicateRowsWithinFile: number;
  duplicateRowsAlreadyStored: number;
  newRowsDetected: number;
  rowsRemovedFromSource: number;
  dashboardRowsBefore: number;
  dashboardRowsAfter: number;
  rowsInsertedByReplacement: number;
  channelCounts: Record<string, number>;
  sourceChannelCounts: Record<string, number>;
  invalidIssues: GoogleLeadsMappingIssue[];
  dateAdjustment: Omit<LeadDateAdjustmentResult, "bytes"> | null;
  sourceHistoryPreservation: Omit<LeadHistoryPreservationResult, "bytes">;
  metaBaseDailyMetricCount: number;
  importId: number | null;
  importFileUrl: string | null;
};

type AutomationDependencies = {
  analyze: typeof analyzeLeadCsvAgainstCurrentBase;
  importCsv: typeof importLeadCsv;
  runPython: typeof runPythonConsolidator;
  applyDateAdjustment: typeof applySeptemberJulyLeadAdjustment;
  preserveHistory: typeof preserveMissingCanonicalLeads;
  replaceMetaBaseMetrics: typeof replaceMetaBaseLeadDailyMetrics;
};

type ExecuteGoogleLeadsAutomationInput = {
  projectRoot?: string;
  outputRoot?: string;
  sourceUrl?: string;
  sourceFile?: string;
  actor?: string;
  now?: Date;
  dryRun?: boolean;
  dependencies?: Partial<AutomationDependencies>;
};

function formatRunLabel(now: Date): string {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${value.year}${value.month}${value.day}-${value.hour}${value.minute}${value.second}`;
}

function runProcess(
  command: string,
  args: string[],
  options: { cwd: string; timeoutMs: number },
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`O consolidator excedeu ${options.timeoutMs / 1000} segundos.`));
    }, options.timeoutMs);
    child.stdout.on("data", chunk => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", chunk => {
      stderr += chunk.toString();
    });
    child.once("error", error => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("close", code => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`Falha ao consolidar a planilha (${code}). ${stderr || stdout}`));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

export async function runPythonConsolidator(input: {
  projectRoot: string;
  sourceUrl: string;
  sourceFile?: string;
  outputDirectory: string;
  runLabel: string;
  reportPath: string;
}): Promise<GoogleLeadsConsolidationReport> {
  const scriptPath = path.join(input.projectRoot, "scripts", "googleLeadsConsolidator.py");
  const sourceArgs = input.sourceFile
    ? ["--source-file", input.sourceFile]
    : ["--source-url", input.sourceUrl];
  await runProcess(
    "python3",
    [
      scriptPath,
      ...sourceArgs,
      "--output-dir",
      input.outputDirectory,
      "--run-label",
      input.runLabel,
      "--report-json",
      input.reportPath,
    ],
    { cwd: input.projectRoot, timeoutMs: 5 * 60 * 1000 },
  );
  return JSON.parse(await readFile(input.reportPath, "utf8")) as GoogleLeadsConsolidationReport;
}

function breakdownLines(values: Record<string, number>): string[] {
  return Object.entries(values)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "pt-BR"))
    .map(([value, count]) => `- ${value}: ${count.toLocaleString("pt-BR")}`);
}

function mergeCounts(
  base: Record<string, number>,
  additions: Record<string, number>,
): Record<string, number> {
  const merged = new Map<string, number>(Object.entries(base));
  for (const [value, count] of Object.entries(additions)) {
    merged.set(value, (merged.get(value) ?? 0) + count);
  }
  return Object.fromEntries(merged);
}

export function formatGoogleLeadsAutomationReport(result: GoogleLeadsAutomationResult): string {
  const statusLabel = {
    UPDATED: "Dashboard atualizado",
    NO_CHANGES: "Nenhuma alteração na base",
    DRY_RUN: "Validação sem importação",
  }[result.status];
  const invalidLines = result.invalidIssues.length
    ? result.invalidIssues
        .slice(0, 20)
        .map(
          issue =>
            `- ${issue.sheet}, linha ${issue.source_row}: ${issue.field} — ${issue.message}`,
        )
    : ["- Nenhuma linha rejeitada na consolidação."];
  const adjustment = result.dateAdjustment;
  const adjustmentLines = adjustment
    ? [
        "## Ajuste auditável de competência",
        "",
        `- Chave do ajuste: ${adjustment.adjustmentKey}`,
        `- Origem preservada: ${adjustment.sourceDateFrom} a ${adjustment.sourceDateTo}`,
        `- Competência de destino: ${adjustment.targetDates.join(", ")}`,
        `- Cópias adicionais aplicadas: ${adjustment.appliedCount.toLocaleString("pt-BR")}`,
        "- Distribuição diária do ajuste:",
        ...breakdownLines(adjustment.dailyCounts),
        "- Distribuição por origem do ajuste:",
      ...breakdownLines(adjustment.sourceChannelCounts),
    ]
    : ["## Ajuste auditável de competência", "", "- Nenhum ajuste manual aplicado nesta execução."];
  const preservation = result.sourceHistoryPreservation;
  const preservationLines = preservation.preservedCount
    ? [
        "## Preservação de histórico da fonte",
        "",
        `- Registros preservados da base canônica: ${preservation.preservedCount.toLocaleString("pt-BR")}`,
        `- Correções de origem reconhecidas: ${preservation.sourceCorrectionCount.toLocaleString("pt-BR")}`,
        `- Período preservado: ${preservation.preservedDateFrom ?? "N/D"} a ${preservation.preservedDateTo ?? "N/D"}`,
        "- Distribuição por canal:",
        ...breakdownLines(preservation.preservedByChannel),
        "- Distribuição por canal de origem:",
        ...breakdownLines(preservation.preservedBySourceChannel),
      ]
    : [
        "## Preservação de histórico da fonte",
        "",
        `- Nenhum registro histórico ausente foi preservado; correções de origem reconhecidas: ${preservation.sourceCorrectionCount.toLocaleString("pt-BR")}.`,
      ];
  return [
    `# Relatório da automação de Leads MG`,
    "",
    `**Status:** ${statusLabel}`,
    `**Execução:** ${result.runLabel}`,
    "",
    "## Reconciliação",
    "",
    `- Linhas encontradas na planilha: ${result.sourceRows.toLocaleString("pt-BR")}`,
    `- Linhas válidas no arquivo mestre: ${result.masterRows.toLocaleString("pt-BR")}`,
    `- Registros novos detectados: ${result.newRowsDetected.toLocaleString("pt-BR")}`,
    `- Duplicatas internas do arquivo: ${result.duplicateRowsWithinFile.toLocaleString("pt-BR")}`,
    `- Registros já existentes na base: ${result.duplicateRowsAlreadyStored.toLocaleString("pt-BR")}`,
    `- Linhas inválidas/rejeitadas na origem: ${result.sourceInvalidRows.toLocaleString("pt-BR")}`,
    `- Registros removidos da fonte: ${result.rowsRemovedFromSource.toLocaleString("pt-BR")}`,
    `- Base antes: ${result.dashboardRowsBefore.toLocaleString("pt-BR")}`,
    `- Base depois: ${result.dashboardRowsAfter.toLocaleString("pt-BR")}`,
    `- Linhas gravadas na substituição: ${result.rowsInsertedByReplacement.toLocaleString("pt-BR")}`,
    "",
    ...adjustmentLines,
    "",
    ...preservationLines,
    "",
    "## Leads válidos por canal",
    "",
    ...breakdownLines(result.channelCounts),
    "",
    "## Leads válidos por canal de origem",
    "",
    ...breakdownLines(result.sourceChannelCounts),
    "",
    "## Série Meta da planilha-base",
    "",
    `- Métricas diárias agregadas atualizadas: ${result.metaBaseDailyMetricCount.toLocaleString("pt-BR")}`,
    "- Fonte: aba Meta da planilha-base; campo `created_time` convertido para America/Sao_Paulo.",
    "- A série preserva o volume de origem, inclusive registros que a base canônica não aceita por dados obrigatórios ausentes.",
    "",
    "## Linhas rejeitadas",
    "",
    ...invalidLines,
    "",
    "## Arquivos",
    "",
    `- Excel mestre: ${result.masterXlsx}`,
    `- CSV mestre: ${result.masterCsv}`,
    `- CSV canônico de importação: ${result.importCsv}`,
  ].join("\n");
}

export async function executeGoogleLeadsAutomation(
  input: ExecuteGoogleLeadsAutomationInput = {},
): Promise<GoogleLeadsAutomationResult> {
  const projectRoot = input.projectRoot ?? path.resolve(fileURLToPath(new URL("..", import.meta.url)));
  const outputRoot = input.outputRoot ?? "/home/ubuntu/mg-leads-automation-output";
  const runLabel = formatRunLabel(input.now ?? new Date());
  const runDirectory = path.join(outputRoot, runLabel);
  const reportJson = path.join(runDirectory, "consolidation-report.json");
  await mkdir(runDirectory, { recursive: true });
  const dependencies: AutomationDependencies = {
    analyze: input.dependencies?.analyze ?? analyzeLeadCsvAgainstCurrentBase,
    importCsv: input.dependencies?.importCsv ?? importLeadCsv,
    runPython: input.dependencies?.runPython ?? runPythonConsolidator,
    applyDateAdjustment: input.dependencies?.applyDateAdjustment ?? applySeptemberJulyLeadAdjustment,
    preserveHistory: input.dependencies?.preserveHistory ?? preserveMissingCanonicalLeads,
    replaceMetaBaseMetrics:
      input.dependencies?.replaceMetaBaseMetrics ?? replaceMetaBaseLeadDailyMetrics,
  };
  const consolidation = await dependencies.runPython({
    projectRoot,
    sourceUrl: input.sourceUrl ?? GOOGLE_LEADS_SOURCE_URL,
    sourceFile: input.sourceFile,
    outputDirectory: runDirectory,
    runLabel,
    reportPath: reportJson,
  });
  const canonicalImportBytes = await readFile(consolidation.importCsv);
  const dateAdjustment = dependencies.applyDateAdjustment({ bytes: canonicalImportBytes });
  const sourceHistoryPreservation = await dependencies.preserveHistory({
    bytes: dateAdjustment.bytes,
    fallbackDate: getYesterdayInSaoPaulo(),
  });
  const importBytes = sourceHistoryPreservation.bytes;
  const importFileName = `leads-mg-import-${runLabel}-with-${dateAdjustment.adjustmentKey}-history-preserved.csv`;
  const adjustedImportCsv = path.join(runDirectory, importFileName);
  await writeFile(adjustedImportCsv, importBytes);
  const analysis = await dependencies.analyze({
    fileName: importFileName,
    bytes: importBytes,
  });
  if (analysis.invalidRows > 0) {
    throw new Error(
      `O CSV canônico possui ${analysis.invalidRows.toLocaleString("pt-BR")} linha(s) inválida(s).`,
    );
  }
  let importResult: LeadCsvImportResult | null = null;
  let status: GoogleLeadsAutomationStatus = input.dryRun
    ? "DRY_RUN"
    : analysis.hasChanges
      ? "UPDATED"
      : "NO_CHANGES";
  if (!input.dryRun && analysis.hasChanges) {
    importResult = await dependencies.importCsv({
      fileName: importFileName,
      bytes: importBytes,
      actor: input.actor ?? GOOGLE_LEADS_AUTOMATION_ACTOR,
      forceReplace: true,
    });
  }
  const metaBaseMetrics = input.dryRun
    ? { metricCount: 0 }
    : await dependencies.replaceMetaBaseMetrics({
        runLabel,
        daily: consolidation.metaBaseDailyMetrics,
      });
  const dashboardRowsAfter = importResult?.rowsInserted ?? analysis.currentBaseRows;
  const result: GoogleLeadsAutomationResult = {
    status,
    runLabel,
    runDirectory,
    reportJson,
    reportMarkdown: path.join(runDirectory, "execution-report.md"),
    masterCsv: consolidation.masterCsv,
    masterXlsx: consolidation.masterXlsx,
    importCsv: adjustedImportCsv,
    sourceRows: consolidation.rowsSourceTotal,
    masterRows: consolidation.rowsMasterOutput,
    sourceInvalidRows: consolidation.rowsExcludedFromImport,
    duplicateRowsWithinFile: analysis.duplicateRowsWithinFile,
    duplicateRowsAlreadyStored: analysis.rowsAlreadyStored,
    newRowsDetected: analysis.rowsReadyToInsert,
    rowsRemovedFromSource: analysis.rowsRemovedFromSource,
    dashboardRowsBefore: analysis.currentBaseRows,
    dashboardRowsAfter,
    rowsInsertedByReplacement: importResult?.rowsInserted ?? 0,
    channelCounts: mergeCounts(
      mergeCounts(consolidation.channels, dateAdjustment.channelCounts),
      sourceHistoryPreservation.preservedByChannel,
    ),
    sourceChannelCounts: mergeCounts(
      mergeCounts(consolidation.sourceChannels, dateAdjustment.sourceChannelCounts),
      sourceHistoryPreservation.preservedBySourceChannel,
    ),
    invalidIssues: consolidation.issues,
    dateAdjustment: {
      adjustmentKey: dateAdjustment.adjustmentKey,
      requestedCount: dateAdjustment.requestedCount,
      appliedCount: dateAdjustment.appliedCount,
      sourceDateFrom: dateAdjustment.sourceDateFrom,
      sourceDateTo: dateAdjustment.sourceDateTo,
      targetDates: dateAdjustment.targetDates,
      channelCounts: dateAdjustment.channelCounts,
      sourceChannelCounts: dateAdjustment.sourceChannelCounts,
      dailyCounts: dateAdjustment.dailyCounts,
    },
    sourceHistoryPreservation: {
      preservedCount: sourceHistoryPreservation.preservedCount,
      sourceCorrectionCount: sourceHistoryPreservation.sourceCorrectionCount,
      preservedByChannel: sourceHistoryPreservation.preservedByChannel,
      preservedBySourceChannel: sourceHistoryPreservation.preservedBySourceChannel,
      preservedDateFrom: sourceHistoryPreservation.preservedDateFrom,
      preservedDateTo: sourceHistoryPreservation.preservedDateTo,
    },
    metaBaseDailyMetricCount: metaBaseMetrics.metricCount,
    importId: importResult?.importId ?? null,
    importFileUrl: importResult?.fileUrl ?? null,
  };
  const reportMarkdown = formatGoogleLeadsAutomationReport(result);
  await writeFile(result.reportMarkdown, reportMarkdown, "utf8");
  await writeFile(path.join(runDirectory, "execution-result.json"), JSON.stringify(result, null, 2), "utf8");
  return result;
}
