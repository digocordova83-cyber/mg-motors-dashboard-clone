import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

import { parseWeeklySalesPdf } from "../server/weeklySalesPdf";
import { importWeeklySalesCsv } from "../server/weeklySalesService";

const pdfPath = resolve(
  process.argv[2] ?? "/home/ubuntu/upload/pasted_file_FmTEx5_pdfhandler.pdf",
);
const outputPath = resolve(
  process.argv[3] ?? "/tmp/weekly-sales-260817-august-import.json",
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
  if (preview.summary.referenceWeek !== 4) {
    throw new Error(
      `A semana de referência deveria ser W4, mas foi W${preview.summary.referenceWeek ?? "?"}.`,
    );
  }
  if (preview.summary.referenceReportedSalesTotal !== 338) {
    throw new Error(
      `O total validado deveria ser 338, mas foi ${preview.summary.referenceReportedSalesTotal}.`,
    );
  }
  if (
    preview.summary.dealerRows !== 26 ||
    preview.summary.regionRows !== 2 ||
    preview.summary.totalRows !== 1
  ) {
    throw new Error(
      `Estrutura inesperada: ${preview.summary.dealerRows} dealers, ${preview.summary.regionRows} regiões e ${preview.summary.totalRows} TOTAL.`,
    );
  }

  const tecarGoiania = preview.rows.find(row => row.sourceName === "TECAR GOIÂNIA");
  if (!tecarGoiania || tecarGoiania.weeks["4"]?.retail !== null) {
    throw new Error("TECAR GOIÂNIA deveria permanecer sem MTD Retail Order informado em W4.");
  }
  if (
    !preview.warnings.some(warning =>
      warning.includes("TECAR GOIÂNIA: Semana 4 sem MTD Retail Order informado"),
    )
  ) {
    throw new Error("O aviso auditável de TECAR GOIÂNIA em W4 não foi produzido.");
  }

  const result = await importWeeklySalesCsv({
    fileName: basename(pdfPath),
    bytes,
    competence: "2026-08",
    competencePolicy: "EXPLICIT",
    parsedOverride: preview,
    expectedFileHash: preview.fileHash,
    declaredMimeType: "application/pdf",
    actor: "system:reconciled-pdf-260817",
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
  console.log(outputPath);
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
