import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import dealerTargetAliases from "./data/dealer-target-aliases.json";
import {
  dealerTargetRecordSetsEqual,
  parseDealerTargetsWorkbook,
  summarizeDealerChannelTargets,
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
  it("concilia as 31 linhas em 30 dealers ativos únicos", async () => {
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
    expect(new Set(preview.rows.map(row => row.canonicalDealerKey)).size).toBe(30);
    expect(preview.rows).toHaveLength(30);
    expect(preview.rows.find(row => row.canonicalDealerKey === "SAVOL ZL SP")).toMatchObject({
      sourceDealerName: "SAVOL/SP + SAVOL ZL/SP",
      leadTarget: 12,
      salesTarget: 2,
    });
    expect(preview.warnings).toContain("Linhas consolidadas no mesmo dealer ativo: SAVOL ZL SP.");
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

  it("rejeita linhas fonte duplicadas mesmo quando o dealer canônico é consolidável", async () => {
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

  it("soma as metas canônicas por canal e explicita a diferença contra TOTAL DEALER", () => {
    const summary = summarizeDealerChannelTargets([
      {
        leadTarget: 100,
        channelTargets: { google: 50, meta: 30, publya: 5, webmotors: 5, mercadoLivre: 5, tiktok: 7 },
      },
      {
        leadTarget: 50,
        channelTargets: { google: 25, meta: 15, publya: 2, webmotors: 3, mercadoLivre: 2, tiktok: 3 },
      },
    ]);

    expect(summary).toEqual({
      dealerCount: 2,
      totalLeadTarget: 150,
      totalChannelTarget: 152,
      channelDifference: 2,
      channelTargets: {
        google: 75,
        meta: 45,
        publya: 7,
        webmotors: 8,
        mercadoLivre: 7,
        tiktok: 10,
      },
    });
  });
});
