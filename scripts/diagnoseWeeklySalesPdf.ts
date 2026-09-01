import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { parseWeeklySalesPdf } from "../server/weeklySalesPdf";

async function main() {
  const inputPath = resolve(process.argv[2] ?? "/home/ubuntu/upload/260814DailySalesPlanningReport.pdf");
  const outputPath = resolve(
    process.argv[3] ?? "/tmp/weekly-sales-pdf-diagnosis-2026-08-14.json",
  );
  const preview = await parseWeeklySalesPdf(readFileSync(inputPath));

  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        inputPath,
        summary: preview.summary,
        errors: preview.errors,
        warnings: preview.warnings,
        rows: preview.rows.map(row => ({
          sourceRowNumber: row.sourceRowNumber,
          rowType: row.rowType,
          sourceName: row.sourceName,
          canonicalDealer: row.canonicalDealer,
          weeks: row.weeks,
        })),
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(outputPath);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
