import ExcelJS from "exceljs";
import fs from "node:fs/promises";

const sourcePath = "/home/ubuntu/exports/Metricas_30_Principais_Por_Canal_Windsor_15D.xlsx";
const outputs = [
  { sheetName: "Google Ads", path: "/home/ubuntu/exports/Metricas_Google_Ads_Windsor_15D.xlsx" },
  { sheetName: "Meta Ads", path: "/home/ubuntu/exports/Metricas_Meta_Ads_Windsor_15D.xlsx" },
  { sheetName: "TikTok Ads", path: "/home/ubuntu/exports/Metricas_TikTok_Ads_Windsor_15D.xlsx" },
] as const;

async function main() {
  await fs.access(sourcePath);
  const source = new ExcelJS.Workbook();
  await source.xlsx.readFile(sourcePath);

  for (const output of outputs) {
    const sourceSheet = source.getWorksheet(output.sheetName);
    if (!sourceSheet) throw new Error(`Aba ${output.sheetName} não encontrada.`);

    const target = new ExcelJS.Workbook();
    const sheet = target.addWorksheet(output.sheetName);
    sheet.columns = [
      { header: "Metric", key: "metric", width: 34 },
      { header: "Value", key: "value", width: 22 },
      { header: "Unit", key: "unit", width: 28 },
      { header: "Definition", key: "definition", width: 72 },
    ];

    for (let rowNumber = 2; rowNumber <= sourceSheet.rowCount; rowNumber += 1) {
      const row = sourceSheet.getRow(rowNumber);
      sheet.addRow([row.getCell(1).value, row.getCell(2).value, row.getCell(3).value, row.getCell(4).value]);
    }
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = `A1:D${sheet.rowCount}`;
    sheet.getColumn(2).numFmt = "#,##0.00";
    await target.xlsx.writeFile(output.path);

    const validation = new ExcelJS.Workbook();
    await validation.xlsx.readFile(output.path);
    const createdSheet = validation.getWorksheet(output.sheetName);
    if (!createdSheet || validation.worksheets.length !== 1 || createdSheet.rowCount < 31) {
      throw new Error(`Arquivo ${output.path} não foi criado corretamente.`);
    }
  }

  process.stdout.write(JSON.stringify({
    sourcePath,
    outputs: outputs.map(output => output.path),
    status: "OK",
  }, null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
