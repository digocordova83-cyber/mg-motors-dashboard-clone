import fs from "node:fs/promises";
import path from "node:path";

import ExcelJS from "exceljs";

import dealerTargetAliases from "../server/data/dealer-target-aliases.json";
import { getOfficialDealers, normalizeDealerLookupKey } from "../server/dealerNormalization";
import { resolveDealerStateCode } from "../server/weeklySalesService";
import { resolveWeeklySalesCanonicalDealer } from "../server/weeklySalesCsv";

type AuditRow = {
  sourceRow: number;
  sourceDealer: string;
  officialName: string | null;
  canonicalDealer: string | null;
  canonicalDealerKey: string | null;
  stateCode: string | null;
  totalDealer: number;
  sales: number;
  status: "MATCHED" | "UNMATCHED";
};

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "result" in value) return String(value.result ?? "").trim();
  return String(value).trim();
}

function numericValue(value: ExcelJS.CellValue): number {
  if (typeof value === "number") return value;
  const parsed = Number(cellText(value).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

async function main() {
  const workbookPath = process.argv[2];
  const outputPath = process.argv[3] ?? "/tmp/dealer-targets-match-audit.json";
  if (!workbookPath) throw new Error("Uso: tsx scripts/auditDealerTargetsMatch.ts <arquivo.xlsx> [saida.json]");

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.resolve(workbookPath));
  const sheet = workbook.getWorksheet(dealerTargetAliases.sourceSheet) ?? workbook.worksheets[0];
  if (!sheet) throw new Error("A planilha não possui abas legíveis.");

  const headerIndex = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, column) => headerIndex.set(cellText(cell.value).toUpperCase(), column));
  const required = ["DEALER", "TOTAL DEALER", "SALES"];
  for (const header of required) {
    if (!headerIndex.has(header)) throw new Error(`Cabeçalho obrigatório ausente: ${header}`);
  }

  const aliasBySource = new Map(
    dealerTargetAliases.mappings.map(mapping => [normalizeDealerLookupKey(mapping.source), mapping.officialName]),
  );
  const officialByName = new Map(
    getOfficialDealers().map(dealer => [normalizeDealerLookupKey(dealer.name), dealer] as const),
  );
  const rows: AuditRow[] = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const sourceDealer = cellText(row.getCell(headerIndex.get("DEALER")!).value);
    if (!sourceDealer) continue;
    const mappedOfficialName = aliasBySource.get(normalizeDealerLookupKey(sourceDealer)) ?? null;
    const official = mappedOfficialName
      ? officialByName.get(normalizeDealerLookupKey(mappedOfficialName)) ?? null
      : null;
    const canonicalDealer = official
      ? resolveWeeklySalesCanonicalDealer(official.name).canonicalDealer
      : null;
    rows.push({
      sourceRow: rowNumber,
      sourceDealer,
      officialName: official?.name ?? null,
      canonicalDealer,
      canonicalDealerKey: canonicalDealer ? normalizeDealerLookupKey(canonicalDealer) : null,
      stateCode: official ? resolveDealerStateCode(official.operationalArea) : null,
      totalDealer: numericValue(row.getCell(headerIndex.get("TOTAL DEALER")!).value),
      sales: numericValue(row.getCell(headerIndex.get("SALES")!).value),
      status: official && canonicalDealer ? "MATCHED" : "UNMATCHED",
    });
  }

  const matched = rows.filter(row => row.status === "MATCHED");
  const unmatched = rows.filter(row => row.status === "UNMATCHED");
  const duplicateKeys = [...new Set(
    matched
      .map(row => row.canonicalDealerKey)
      .filter((key): key is string => Boolean(key))
      .filter((key, index, keys) => keys.indexOf(key) !== index),
  )];
  const report = {
    workbook: path.resolve(workbookPath),
    sheet: sheet.name,
    rows: rows.length,
    matched: matched.length,
    unmatched: unmatched.length,
    duplicateCanonicalKeys: duplicateKeys,
    totalLeadTarget: rows.reduce((sum, row) => sum + row.totalDealer, 0),
    totalSalesTarget: rows.reduce((sum, row) => sum + row.sales, 0),
    details: rows,
  };
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({
    matched: report.matched,
    unmatched: report.unmatched,
    duplicateCanonicalKeys: report.duplicateCanonicalKeys,
    totalLeadTarget: report.totalLeadTarget,
    totalSalesTarget: report.totalSalesTarget,
  }));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
