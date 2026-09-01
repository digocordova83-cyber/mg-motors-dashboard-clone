import { readFile, writeFile } from "node:fs/promises";

import { parseWeeklySalesPdf } from "../server/weeklySalesPdf";

const inputPath =
  "/home/ubuntu/upload/pasted_file_PMopUD_260803DailySalesPlanningReport.pdf";
const outputPath = "/tmp/weekly-sales-260803-preview.json";

async function main() {
  const bytes = await readFile(inputPath);
  const preview = await parseWeeklySalesPdf(bytes);
  await writeFile(outputPath, `${JSON.stringify(preview, null, 2)}\n`, "utf8");
  console.log(
    JSON.stringify(
      {
        outputPath,
        valid: preview.errors.length === 0 && preview.summary.reconciliationPassed,
        fileHash: preview.fileHash,
        referenceWeek: preview.summary.referenceWeek,
        dealerRows: preview.summary.dealerRows,
        regionRows: preview.summary.regionRows,
        totalRows: preview.summary.totalRows,
        referenceDealerSalesTotal: preview.summary.referenceDealerSalesTotal,
        referenceRegionSalesTotal: preview.summary.referenceRegionSalesTotal,
        referenceReportedSalesTotal: preview.summary.referenceReportedSalesTotal,
        errors: preview.errors,
        warnings: preview.warnings,
      },
      null,
      2,
    ),
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
