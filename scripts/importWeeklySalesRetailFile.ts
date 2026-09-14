import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import {
  importWeeklySalesCsv,
  previewWeeklySalesCsv,
} from "../server/weeklySalesService";
import { inferWeeklySalesReportDate } from "../server/weeklySalesUpload";

function inferCompetence(fileName: string): string {
  const reportDate = inferWeeklySalesReportDate(fileName);
  if (!reportDate) {
    throw new Error(
      "Não foi possível inferir a competência pelo nome do arquivo. Informe AAAA-MM como segundo argumento.",
    );
  }
  return reportDate.slice(0, 7);
}

async function main() {
  const args = process.argv.slice(2);
  const previewOnly = args.includes("--preview");
  const positional = args.filter(argument => argument !== "--preview");
  const filePathArgument = positional[0];
  if (!filePathArgument) {
    throw new Error(
      "Uso: pnpm exec tsx scripts/importWeeklySalesRetailFile.ts [--preview] <xlsx|csv|pdf> [competência] [saída-json]",
    );
  }

  const filePath = resolve(filePathArgument);
  const fileName = basename(filePath);
  const competence = positional[1] ?? inferCompetence(fileName);
  const outputPath = resolve(
    positional[2] ?? `/tmp/weekly-sales-retail-${previewOnly ? "preview" : "import"}-${Date.now()}.json`,
  );
  const bytes = await readFile(filePath);
  const preview = await previewWeeklySalesCsv({ fileName, bytes, competence });

  if (previewOnly) {
    const audit = {
      status: "PREVIEW_OK",
      competence,
      sourceFile: fileName,
      sourcePath: filePath,
      fileHash: preview.fileHash,
      valid: preview.valid,
      referenceWeek: preview.summary.referenceWeek,
      mtdRetailOrder: preview.summary.referenceReportedSalesTotal,
      dealerRows: preview.summary.dealerRows,
      matchedDealerRows: preview.summary.matchedDealerRows,
      unmatchedDealerRows: preview.summary.unmatchedDealerRows,
      unmatchedDealers: preview.unmatchedDealers,
      regionRows: preview.summary.regionRows,
      totalRows: preview.summary.totalRows,
      reconciliationPassed: preview.summary.reconciliationPassed,
      warnings: preview.warnings,
      errors: preview.errors,
    };
    await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify({ outputPath, ...audit })}\n`);
    if (!preview.valid) process.exitCode = 2;
    return;
  }

  if (!preview.valid) {
    throw new Error(`A prévia contém erros: ${preview.errors.join(" | ")}`);
  }

  const result = await importWeeklySalesCsv({
    fileName,
    bytes,
    competence,
    competencePolicy: "EXPLICIT",
    expectedFileHash: preview.fileHash,
    actor: "system:retail-file-upload",
  });

  const audit = {
    status: result.idempotent ? "NO_CHANGES" : "UPDATED",
    importedAt: new Date(result.importedAt).toISOString(),
    competence,
    sourceFile: fileName,
    sourcePath: filePath,
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
}

main().catch(error => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
