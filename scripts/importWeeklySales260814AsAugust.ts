import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import { parseWeeklySalesPdf } from "../server/weeklySalesPdf";
import { importWeeklySalesCsv } from "../server/weeklySalesService";

const pdfPath = resolve(
  process.argv[2] ?? "/home/ubuntu/upload/260814DailySalesPlanningReport.pdf",
);
const outputPath = resolve(
  process.argv[3] ?? "/tmp/weekly-sales-260814-august-import.json",
);

async function main() {
  const bytes = await readFile(pdfPath);
  const preview = await parseWeeklySalesPdf(bytes);

  if (preview.errors.length > 0) {
    throw new Error(`A prévia contém erros: ${preview.errors.join(" | ")}`);
  }
  if (!preview.summary.reconciliationPassed) {
    throw new Error("A prévia não reconciliou concessionárias, regiões e TOTAL.");
  }
  if (preview.summary.referenceWeek !== 3) {
    throw new Error(
      `A semana de referência deveria ser W3, mas foi W${preview.summary.referenceWeek ?? "?"}.`,
    );
  }
  if (preview.summary.referenceReportedSalesTotal !== 248) {
    throw new Error(
      `O total validado deveria ser 248, mas foi ${preview.summary.referenceReportedSalesTotal}.`,
    );
  }
  if (
    preview.summary.dealerRows !== 25 ||
    preview.summary.regionRows !== 2 ||
    preview.summary.totalRows !== 1
  ) {
    throw new Error(
      `Estrutura inesperada: ${preview.summary.dealerRows} dealers, ${preview.summary.regionRows} regiões e ${preview.summary.totalRows} TOTAL.`,
    );
  }

  const tecarGoiania = preview.rows.find(row => row.sourceName === "TECAR GOIÂNIA");
  if (
    tecarGoiania?.weeks["2"]?.retail !== 2 ||
    tecarGoiania.weeks["3"]?.retail !== 2
  ) {
    throw new Error("TECAR GOIÂNIA não foi reconciliada em duas vendas para W2 e W3.");
  }
  if (
    !preview.warnings.some(warning =>
      warning.includes("TECAR GOIÂNIA: Semana 2 reconciliada em 2 vendas"),
    ) ||
    !preview.warnings.some(warning =>
      warning.includes("TECAR GOIÂNIA: Semana 3 reconciliada em 2 vendas"),
    )
  ) {
    throw new Error("Os avisos auditáveis de TECAR GOIÂNIA não foram produzidos.");
  }

  const result = await importWeeklySalesCsv({
    fileName: basename(pdfPath),
    bytes,
    competence: "2026-08",
    competencePolicy: "EXPLICIT",
    parsedOverride: preview,
    expectedFileHash: preview.fileHash,
    declaredMimeType: "application/pdf",
    actor: "system:reconciled-pdf-260814",
  });

  const audit = {
    importedAt: new Date().toISOString(),
    requestedCompetence: "2026-08",
    sourceFile: basename(pdfPath),
    preview: {
      summary: preview.summary,
      warnings: preview.warnings,
      errors: preview.errors,
      tecarGoiania: tecarGoiania.weeks,
    },
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
