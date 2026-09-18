import ExcelJS from "exceljs";

const files = [
  { path: "/home/ubuntu/exports/Metricas_Google_Ads_Windsor_15D.xlsx", sheet: "Google Ads", columns: 34, periodStart: "2026-09-03", periodEnd: "2026-09-17" },
  { path: "/home/ubuntu/exports/Metricas_Meta_Ads_Windsor_15D.xlsx", sheet: "Meta Ads", columns: 33, periodStart: "2026-09-03", periodEnd: "2026-09-17" },
  { path: "/home/ubuntu/exports/Metricas_TikTok_Ads_Windsor_15D.xlsx", sheet: "TikTok Ads", columns: 38, periodStart: "2026-08-17", periodEnd: "2026-08-31" },
] as const;
const forbidden = ["mg motor", "mg motors", "ag. bbro", "535-798-6801", "1418731006678061", "7668787778449719316"];

async function main() {
  const validations = [];
  for (const file of files) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);
    const sheet = workbook.getWorksheet(file.sheet);
    if (!sheet || workbook.worksheets.length !== 1) throw new Error(`${file.sheet}: aba inválida.`);
    if (sheet.rowCount !== 16 || sheet.columnCount !== file.columns) {
      throw new Error(`${file.sheet}: estrutura esperada 15 linhas diárias / ${file.columns} colunas.`);
    }
    const headers = sheet.getRow(1).values.map(value => String(value ?? ""));
    if (headers[1] !== "Data" || headers[2] !== "Status da fonte") throw new Error(`${file.sheet}: cabeçalhos Data/Status ausentes.`);
    if (String(sheet.getRow(2).getCell(1).value) !== file.periodStart || String(sheet.getRow(16).getCell(1).value) !== file.periodEnd) {
      throw new Error(`${file.sheet}: período diário incorreto.`);
    }
    let hasForbiddenValue = false;
    sheet.eachRow(row => row.eachCell(cell => {
      const value = String(cell.value ?? "").toLocaleLowerCase("pt-BR");
      if (forbidden.some(token => value.includes(token))) hasForbiddenValue = true;
    }));
    if (hasForbiddenValue) throw new Error(`${file.sheet}: identificador sensível encontrado.`);
    validations.push({ sheet: file.sheet, rows: sheet.rowCount - 1, columns: sheet.columnCount, start: file.periodStart, end: file.periodEnd });
  }
  process.stdout.write(JSON.stringify({ status: "OK", validations }, null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
