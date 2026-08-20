import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import { parseWeeklySalesPdf } from "../server/weeklySalesPdf";
import { importWeeklySalesCsv } from "../server/weeklySalesService";

function inferCompetence(fileName: string): string {
  const compactDate = fileName.match(/(?:^|\D)(\d{2})(\d{2})(\d{2})(?:\D|$)/);
  if (!compactDate) {
    throw new Error(
      "Não foi possível inferir a competência pelo nome do arquivo. Informe AAAA-MM como segundo argumento.",
    );
  }
  return `20${compactDate[1]}-${compactDate[2]}`;
}

async function main() {
  const pdfPathArgument = process.argv[2];
  if (!pdfPathArgument) {
    throw new Error(
      "Uso: pnpm exec tsx scripts/importDailySalesPlanningPdf.ts <pdf> [competência] [saída-json]",
    );
  }

  const pdfPath = resolve(pdfPathArgument);
  const fileName = basename(pdfPath);
  const competence = process.argv[3] ?? inferCompetence(fileName);
  const outputPath = resolve(
    process.argv[4] ?? `/tmp/daily-sales-planning-import-${Date.now()}.json`,
  );
  const bytes = await readFile(pdfPath);
  const preview = await parseWeeklySalesPdf(bytes);

  if (preview.errors.length > 0) {
    throw new Error(`A prévia contém erros: ${preview.errors.join(" | ")}`);
  }
  if (!preview.summary.reconciliationPassed) {
    throw new Error("A prévia não reconciliou concessionárias, regiões e TOTAL.");
  }
  if (!preview.summary.referenceWeek) {
    throw new Error("Não foi possível identificar a semana de referência.");
  }
  if (preview.summary.referenceReportedSalesTotal === null) {
    throw new Error("O TOTAL de MTD Retail Order não foi informado na semana de referência.");
  }
  if (
    preview.summary.dealerRows <= 0 ||
    preview.summary.regionRows <= 0 ||
    preview.summary.totalRows !== 1
  ) {
    throw new Error(
      `Estrutura inesperada: ${preview.summary.dealerRows} dealers, ${preview.summary.regionRows} regiões e ${preview.summary.totalRows} TOTAL.`,
    );
  }

  const result = await importWeeklySalesCsv({
    fileName,
    bytes,
    competence,
    competencePolicy: "EXPLICIT",
    parsedOverride: preview,
    expectedFileHash: preview.fileHash,
    declaredMimeType: "application/pdf",
    actor: "system:daily-sales-email",
  });

  const audit = {
    status: result.idempotent ? "NO_CHANGES" : "UPDATED",
    importedAt: new Date(result.importedAt).toISOString(),
    competence,
    sourceFile: fileName,
    sourcePath: pdfPath,
    importId: result.importId,
    fileHash: result.fileHash,
    fileUrl: result.fileUrl,
    idempotent: result.idempotent,
    rowsInserted: result.rowsInserted,
    valid: result.valid,
    referenceWeek: result.summary.referenceWeek,
    mtdRetailOrder: result.summary.referenceReportedSalesTotal,
    dealerRows: result.summary.dealerRows,
    matchedDealerRows: result.summary.matchedDealerRows,
    unmatchedDealerRows: result.summary.unmatchedDealerRows,
    unmatchedDealers: result.unmatchedDealers,
    regionRows: result.summary.regionRows,
    totalRows: result.summary.totalRows,
    reconciliationPassed: result.summary.reconciliationPassed,
    warnings: result.warnings,
    errors: result.errors,
  };

  await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ outputPath, ...audit })}\n`);
  process.exit(0);
}

main().catch(error => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
