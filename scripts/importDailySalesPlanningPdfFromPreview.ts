import { basename } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

import { buildWeeklySalesPreviewFromPdfExtraction } from "../server/weeklySalesPdf";
import { importWeeklySalesCsv } from "../server/weeklySalesService";

const pdfPath = "/home/ubuntu/upload/pasted_file_2MhVQz_260908DailySalesPlanningReport.pdf";
const diagnosisPath = "/tmp/mg-sales-preview-2026-09-08.json";
const outputPath = "/tmp/mg-sales-import-2026-09-08-recovered.json";
const competence = "2026-09";

type DiagnosticRow = {
  sourceName: string;
  weeks: Record<string, {
    target: number | null;
    retail: number | null;
    achievementPercent: number | null;
  }>;
};

async function main() {
  const [bytes, diagnosticRaw] = await Promise.all([
    readFile(pdfPath),
    readFile(diagnosisPath, "utf8"),
  ]);
  const diagnostic = JSON.parse(diagnosticRaw) as {
    summary: { referenceWeek: number | null; referenceReportedSalesTotal: number | null };
    errors: string[];
    rows: DiagnosticRow[];
  };

  if (diagnostic.errors.length) {
    throw new Error(`A prévia original contém erros: ${diagnostic.errors.join(" | ")}`);
  }
  if (diagnostic.summary.referenceWeek !== 2 || diagnostic.summary.referenceReportedSalesTotal !== 110) {
    throw new Error(
      `A prévia original não corresponde ao PDF esperado: W${diagnostic.summary.referenceWeek} e ${diagnostic.summary.referenceReportedSalesTotal} Retail.`,
    );
  }
  if (diagnostic.rows.length !== 29) {
    throw new Error(`A prévia original deveria conter 29 linhas, mas contém ${diagnostic.rows.length}.`);
  }

  const extraction = {
    tableTitle: "Weekly Target Achievement - Retail",
    rows: diagnostic.rows.map(row => ({ name: row.sourceName, weeks: row.weeks })),
  };
  const preview = buildWeeklySalesPreviewFromPdfExtraction(bytes, extraction);
  if (preview.errors.length || !preview.summary.reconciliationPassed) {
    throw new Error(`A prévia reconstruída não reconciliou: ${[...preview.errors, ...preview.warnings].join(" | ")}`);
  }
  if (preview.summary.referenceWeek !== 2 || preview.summary.referenceReportedSalesTotal !== 110) {
    throw new Error(
      `A prévia reconstruída divergiu: W${preview.summary.referenceWeek} e ${preview.summary.referenceReportedSalesTotal} Retail.`,
    );
  }

  const result = await importWeeklySalesCsv({
    fileName: basename(pdfPath),
    bytes,
    competence,
    competencePolicy: "EXPLICIT",
    parsedOverride: preview,
    expectedFileHash: preview.fileHash,
    declaredMimeType: "application/pdf",
    actor: "system:approved-pdf-preview-recovery",
  });

  const audit = {
    status: result.idempotent ? "NO_CHANGES" : "UPDATED_FROM_APPROVED_PREVIEW",
    importedAt: new Date(result.importedAt).toISOString(),
    competence,
    sourceFile: basename(pdfPath),
    sourceMethod: "Prévia oficial previamente bem-sucedida, validada contra o PDF e reconstruída pelo parser canônico antes da escrita transacional.",
    importId: result.importId,
    idempotent: result.idempotent,
    rowsInserted: result.rowsInserted,
    referenceWeek: result.summary.referenceWeek,
    mtdRetailOrder: result.summary.referenceReportedSalesTotal,
    dealerRows: result.summary.dealerRows,
    matchedDealerRows: result.summary.matchedDealerRows,
    unmatchedDealerRows: result.summary.unmatchedDealerRows,
    reconciliationPassed: result.summary.reconciliationPassed,
    warnings: result.warnings,
    errors: result.errors,
  };
  await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ outputPath, ...audit })}\n`);
}

main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exit(1);
});
