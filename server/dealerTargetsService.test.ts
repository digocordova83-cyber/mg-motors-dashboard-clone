import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import dealerTargetAliases from "./data/dealer-target-aliases.json";
import {
  dealerTargetRecordSetsEqual,
  parseDealerTargetsWorkbook,
  sanitizeDealerTargetStorageFileName,
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

async function createWorkbook(options: { omitLast?: boolean; duplicateFirst?: boolean; omitOptionalChannels?: boolean } = {}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Página1");
  const headers = options.omitOptionalChannels
    ? HEADERS.filter(header => header !== "PUBLYA" && header !== "TIKTOK")
    : HEADERS;
  sheet.addRow(headers);
  const mappings = options.omitLast
    ? dealerTargetAliases.mappings.slice(0, -1)
    : [...dealerTargetAliases.mappings];
  mappings.forEach(mapping => {
    const values: Record<string, string | number> = {
      DEALER: mapping.source, GOOGLE: 1, META: 1, PUBLYA: 1, WEBMOTORS: 1,
      "MERCADO LIVRE": 1, TIKTOK: 1, "TOTAL DEALER": 6, SALES: 1,
      WEIGHT: 1 / 31, "CONVERSION INVESTMENT": 100,
    };
    sheet.addRow(headers.map(header => values[header]));
  });
  if (options.duplicateFirst) {
    const values: Record<string, string | number> = {
      DEALER: dealerTargetAliases.mappings[0].source, GOOGLE: 1, META: 1, PUBLYA: 1, WEBMOTORS: 1,
      "MERCADO LIVRE": 1, TIKTOK: 1, "TOTAL DEALER": 6, SALES: 1,
      WEIGHT: 1 / 31, "CONVERSION INVESTMENT": 100,
    };
    sheet.addRow(headers.map(header => values[header]));
  }
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

describe("metas mensais por concessionária", () => {
  it("sanitiza nomes acentuados apenas para o caminho de armazenamento", () => {
    expect(sanitizeDealerTargetStorageFileName("Planilhasemtítulo.xlsx")).toBe("Planilhasemtitulo.xlsx");
    expect(sanitizeDealerTargetStorageFileName("C:\\metas\\Outubro 2026.xlsx")).toBe("Outubro_2026.xlsx");
  });

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

  it("aceita Publya e TikTok ausentes como metas de canal zero", async () => {
    const preview = await parseDealerTargetsWorkbook({
      fileName: "metas-sem-canais-opcionais.xlsx",
      bytes: await createWorkbook({ omitOptionalChannels: true }),
      competence: "2026-10",
    });

    expect(preview.valid).toBe(true);
    expect(preview.rows.every(row => row.channelTargets.publya === 0 && row.channelTargets.tiktok === 0)).toBe(true);
    expect(preview.summary.channelDifference).toBe(-62);
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
