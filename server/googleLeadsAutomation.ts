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
  models: Record<string, number>;
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
  invalidIssues: GoogleLeadsMappingIssue[];
  importId: number | null;
  importFileUrl: string | null;
};

type AutomationDependencies = {
  analyze: typeof analyzeLeadCsvAgainstCurrentBase;
  importCsv: typeof importLeadCsv;
  runPython: typeof runPythonConsolidator;
};

type ExecuteGoogleLeadsAutomationInput = {
  projectRoot?: string;
  outputRoot?: string;
  sourceUrl?: string;
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
  outputDirectory: string;
  runLabel: string;
  reportPath: string;
}): Promise<GoogleLeadsConsolidationReport> {
  const scriptPath = path.join(input.projectRoot, "scripts", "googleLeadsConsolidator.py");
  await runProcess(
    "python3",
    [
      scriptPath,
      "--source-url",
      input.sourceUrl,
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
    "## Leads válidos por canal",
    "",
    ...breakdownLines(result.channelCounts),
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
  };
  const consolidation = await dependencies.runPython({
    projectRoot,
    sourceUrl: input.sourceUrl ?? GOOGLE_LEADS_SOURCE_URL,
    outputDirectory: runDirectory,
    runLabel,
    reportPath: reportJson,
  });
  const importBytes = await readFile(consolidation.importCsv);
  const importFileName = path.basename(consolidation.importCsv);
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
  const dashboardRowsAfter = importResult?.rowsInserted ?? analysis.currentBaseRows;
  const result: GoogleLeadsAutomationResult = {
    status,
    runLabel,
    runDirectory,
    reportJson,
    reportMarkdown: path.join(runDirectory, "execution-report.md"),
    masterCsv: consolidation.masterCsv,
    masterXlsx: consolidation.masterXlsx,
    importCsv: consolidation.importCsv,
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
    channelCounts: consolidation.channels,
    invalidIssues: consolidation.issues,
    importId: importResult?.importId ?? null,
    importFileUrl: importResult?.fileUrl ?? null,
  };
  const reportMarkdown = formatGoogleLeadsAutomationReport(result);
  await writeFile(result.reportMarkdown, reportMarkdown, "utf8");
  await writeFile(path.join(runDirectory, "execution-result.json"), JSON.stringify(result, null, 2), "utf8");
  return result;
}
