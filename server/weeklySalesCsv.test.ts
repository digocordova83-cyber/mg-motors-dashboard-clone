import { describe, expect, it } from "vitest";

import { parseWeeklySalesCsv } from "./weeklySalesCsv";

const HEADER = [
  "REGION",
  "W1 TGT",
  "W1 RETAIL",
  "%W1",
  "W2 TGT",
  "W2 RETAIL",
  "%W2",
  "W3 TGT",
  "W3 RETAIL",
  "%W3",
  "W4 TGT",
  "W4 RETAIL",
  "%W4",
  "W5 TGT",
  "W5 RETAIL",
  "%W5",
].join(",");

function row(name: string, week4Retail: number | null, week4Target = 40) {
  const achievement = week4Retail === null ? "" : `${(week4Retail / week4Target) * 100}%`;
  return [
    name,
    "10",
    "2",
    "20%",
    "20",
    "6",
    "30%",
    "30",
    "9",
    "30%",
    String(week4Target),
    week4Retail === null ? "" : String(week4Retail),
    achievement,
    "",
    "",
    "",
  ].join(",");
}

function csv(...rows: string[]) {
  return Buffer.from([HEADER, ...rows].join("\n"), "utf8");
}

describe("Weekly Target Achievement CSV", () => {
  it("reconcilia a Semana 4 e aplica o de/para confirmado", () => {
    const preview = parseWeeklySalesCsv(
      csv(row("BALTIC BARUERI", 12), row("R1", 12), row("TOTAL", 12)),
    );

    expect(preview.errors).toEqual([]);
    expect(preview.summary).toMatchObject({
      dealerRows: 1,
      regionRows: 1,
      totalRows: 1,
      week4DealerSalesTotal: 12,
      week4RegionSalesTotal: 12,
      week4ReportedSalesTotal: 12,
      reconciliationPassed: true,
    });
    expect(preview.rows[0]).toMatchObject({
      sourceName: "BALTIC BARUERI",
      rowType: "DEALER",
      canonicalDealer: "Baltic Shopping Tamboré",
      explicitMapping: true,
    });
  });

  it("mantém venda ausente como null e emite aviso sem dividir por zero", () => {
    const preview = parseWeeklySalesCsv(
      csv(row("HG ARACAJU", null), row("R1", 0), row("TOTAL", 0)),
    );

    expect(preview.errors).toEqual([]);
    expect(preview.summary.dealersWithoutWeek4Sales).toBe(1);
    expect(preview.rows[0]?.weeks["4"]?.retail).toBeNull();
    expect(preview.warnings).toContain("HG ARACAJU: Semana 4 sem vendas informadas.");
  });

  it("rejeita arquivo cujo total da Semana 4 não reconcilia", () => {
    const preview = parseWeeklySalesCsv(
      csv(row("BALTIC BARUERI", 12), row("R1", 12), row("TOTAL", 13)),
    );

    expect(preview.summary.reconciliationPassed).toBe(false);
    expect(preview.errors).toContain(
      "A soma das vendas da Semana 4 não reconcilia entre concessionárias, regiões e TOTAL.",
    );
  });

  it("rejeita cabeçalho incompatível", () => {
    expect(() => parseWeeklySalesCsv(Buffer.from("dealer,w4\nA,1"))).toThrow(
      "Cabeçalho incompatível",
    );
  });
});
