import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import dealerTargetAliases from "./data/dealer-target-aliases.json";
import {
  dealerTargetRecordSetsEqual,
  parseDealerTargetsWorkbook,
} from "./dealerTargetsService";

const HEADERS = [
  "DEALER",
  "GOOGLE",
  "META",
  "PUBLYA",
  "WEBMOTORS",
  "MERCADO LIVRE",
  "TIKTOK",
  "TOTAL DEALER",
  "SALES",
  "WEIGHT",
  "CONVERSION INVESTMENT",
];

async function createWorkbook(options: { omitLast?: boolean; duplicateFirst?: boolean } = {}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Página1");
  sheet.addRow(HEADERS);
  const mappings = options.omitLast
    ? dealerTargetAliases.mappings.slice(0, -1)
    : [...dealerTargetAliases.mappings];
  mappings.forEach(mapping => {
    sheet.addRow([mapping.source, 1, 1, 1, 1, 1, 1, 6, 1, 1 / 31, 100]);
  });
  if (options.duplicateFirst) {
    sheet.addRow([dealerTargetAliases.mappings[0].source, 1, 1, 1, 1, 1, 1, 6, 1, 1 / 31, 100]);
  }
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

describe("metas mensais por concessionária", () => {
  it("concilia as 31 abreviações com dealers oficiais únicos", async () => {
    const preview = await parseDealerTargetsWorkbook({
      fileName: "metas.xlsx",
      bytes: await createWorkbook(),
      competence: "2026-08",
    });

    expect(preview.valid).toBe(true);
    expect(preview.summary).toMatchObject({
      rows: 31,
      matchedRows: 31,
      unmatchedRows: 0,
      duplicateDealerKeys: 0,
      missingOfficialDealers: 0,
      totalLeadTarget: 186,
      totalSalesTarget: 31,
      channelDifference: 0,
    });
    expect(new Set(preview.rows.map(row => row.canonicalDealerKey)).size).toBe(31);
    expect(preview.warnings).toContain(
      "O arquivo não informa competência; foi utilizada a competência selecionada no dashboard.",
    );
  });

  it("rejeita arquivo sem meta para um dealer oficial", async () => {
    const preview = await parseDealerTargetsWorkbook({
      fileName: "metas.xlsx",
      bytes: await createWorkbook({ omitLast: true }),
      competence: "2026-08",
    });

    expect(preview.valid).toBe(false);
    expect(preview.summary.missingOfficialDealers).toBe(1);
    expect(preview.errors.join(" ")).toContain("Metas ausentes para");
  });

  it("rejeita chaves canônicas duplicadas", async () => {
    const preview = await parseDealerTargetsWorkbook({
      fileName: "metas.xlsx",
      bytes: await createWorkbook({ duplicateFirst: true }),
      competence: "2026-08",
    });

    expect(preview.valid).toBe(false);
    expect(preview.summary.duplicateDealerKeys).toBe(1);
  });

  it("compara os hashes sem depender da ordem", () => {
    expect(
      dealerTargetRecordSetsEqual(
        [{ recordHash: "a" }, { recordHash: "b" }],
        [{ recordHash: "b" }, { recordHash: "a" }],
      ),
    ).toBe(true);
    expect(
      dealerTargetRecordSetsEqual([{ recordHash: "a" }], [{ recordHash: "b" }]),
    ).toBe(false);
  });
});
