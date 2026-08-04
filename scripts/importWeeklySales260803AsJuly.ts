import { readFile, writeFile } from "node:fs/promises";

import type { WeeklySalesCsvPreview } from "../server/weeklySalesCsv";
import { importWeeklySalesCsv } from "../server/weeklySalesService";

const pdfPath = "/home/ubuntu/upload/pasted_file_PMopUD_260803DailySalesPlanningReport.pdf";
const previewPath = "/tmp/weekly-sales-260803-preview.json";
const outputPath = "/tmp/weekly-sales-260803-july-import.json";

async function main() {
  const [bytes, previewJson] = await Promise.all([
    readFile(pdfPath),
    readFile(previewPath, "utf8"),
  ]);
  const preview = JSON.parse(previewJson) as WeeklySalesCsvPreview;

  if (preview.errors.length > 0) {
    throw new Error(`A prévia validada contém erros: ${preview.errors.join(" | ")}`);
  }
  if (!preview.summary.reconciliationPassed) {
    throw new Error("A prévia validada não reconciliou o total de concessionárias, regiões e relatório.");
  }
  if (preview.summary.referenceReportedSalesTotal !== 606) {
    throw new Error(
      `O total validado deveria ser 606, mas foi ${preview.summary.referenceReportedSalesTotal}.`,
    );
  }

  const result = await importWeeklySalesCsv({
    fileName: "260803_Daily_Sales_Planning_Report.pdf",
    bytes,
    competence: "2026-07",
    competencePolicy: "EXPLICIT",
    parsedOverride: preview,
    expectedFileHash: preview.fileHash,
    declaredMimeType: "application/pdf",
    actor: "system:explicit-july-close",
  });

  const audit = {
    importedAt: new Date().toISOString(),
    requestedCompetence: "2026-07",
    explicitOverride: true,
    sourceFile: "260803_Daily_Sales_Planning_Report.pdf",
    validatedSalesTotal: preview.summary.referenceReportedSalesTotal,
    result,
  };
  await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(audit, null, 2));
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
