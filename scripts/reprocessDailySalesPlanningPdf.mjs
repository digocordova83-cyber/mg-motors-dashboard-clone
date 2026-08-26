import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

async function main() {
  const inputPath = resolve(process.argv[2]);
  const competence = process.argv[3] ?? "2026-08";
  const outputPath = resolve(process.argv[4] ?? `/tmp/daily-sales-planning-reprocess-${Date.now()}.json`);
  if (!process.argv[2]) throw new Error("Uso: pnpm exec tsx scripts/reprocessDailySalesPlanningPdf.mjs <pdf> [competência] [saída-json]");

  const [{ parseWeeklySalesPdf }, { importWeeklySalesCsv }] = await Promise.all([
    import("../server/weeklySalesPdf.ts"),
    import("../server/weeklySalesService.ts"),
  ]);
  const bytes = await readFile(inputPath);
  const preview = await parseWeeklySalesPdf(bytes);
  if (preview.errors.length > 0) throw new Error(`A prévia contém erros: ${preview.errors.join(" | ")}`);
  if (!preview.summary.reconciliationPassed) throw new Error("A prévia não reconciliou dealers, regiões e TOTAL.");
  const result = await importWeeklySalesCsv({
    fileName: basename(inputPath),
    bytes,
    competence,
    competencePolicy: "EXPLICIT",
    parsedOverride: preview,
    expectedFileHash: createHash("sha256").update(bytes).digest("hex"),
    declaredMimeType: "application/pdf",
    actor: "system:dealer-alias-reconciliation",
    reprocessCompleted: true,
  });
  const audit = {
    status: result.idempotent ? "NO_CHANGES" : "REPROCESSED",
    importedAt: new Date(result.importedAt).toISOString(),
    competence,
    sourceFile: basename(inputPath),
    sourcePath: inputPath,
    importId: result.importId,
    fileHash: result.fileHash,
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
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
