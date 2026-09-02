import { describe, expect, it } from "vitest";

import {
  parseWeeklySalesCsv,
  resolveWeeklySalesCanonicalDealer,
  type WeeklySalesWeek,
} from "./weeklySalesCsv";

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

const TARGETS = [10, 20, 30, 40, 50];
const RETAILS = [2, 6, 9, 12, 15];

function row(name: string, retails: Array<number | null>) {
  return [
    name,
    ...TARGETS.flatMap((target, index) => {
      const retail = retails[index] ?? null;
      return [
        String(target),
        retail === null ? "" : String(retail),
        retail === null ? "" : `${(retail / target) * 100}%`,
      ];
    }),
  ].join(",");
}

function retailsThrough(referenceWeek: WeeklySalesWeek) {
  return RETAILS.map((retail, index) => (index + 1 <= referenceWeek ? retail : null));
}

function csv(...rows: string[]) {
  return Buffer.from([HEADER, ...rows].join("\n"), "utf8");
}

describe("Weekly Target Achievement CSV", () => {
  it.each([1, 2, 3, 4, 5] as WeeklySalesWeek[])(
    "usa a Semana %s como referência quando ela é a última com Retail no TOTAL",
    referenceWeek => {
      const weeklyRetail = retailsThrough(referenceWeek);
      const preview = parseWeeklySalesCsv(
        csv(
          row("BALTIC BARUERI", weeklyRetail),
          row("R1", weeklyRetail),
          row("TOTAL", weeklyRetail),
        ),
      );

      expect(preview.errors).toEqual([]);
      expect(preview.summary).toMatchObject({
        dealerRows: 1,
        regionRows: 1,
        totalRows: 1,
        referenceWeek,
        dealersWithoutReferenceSales: 0,
        referenceDealerSalesTotal: RETAILS[referenceWeek - 1],
        referenceRegionSalesTotal: RETAILS[referenceWeek - 1],
        referenceReportedSalesTotal: RETAILS[referenceWeek - 1],
        reconciliationPassed: true,
      });
      expect(preview.rows[0]).toMatchObject({
        sourceName: "BALTIC BARUERI",
        rowType: "DEALER",
        canonicalDealer: "Baltic Shopping Tamboré",
        explicitMapping: true,
      });
      for (let week = referenceWeek + 1; week <= 5; week += 1) {
        expect(preview.rows[0]?.weeks[String(week)]).toMatchObject({
          target: TARGETS[week - 1],
          retail: null,
          achievementPercent: null,
        });
      }
    },
  );

  it("mantém venda ausente como null e avisa na semana de referência sem dividir por zero", () => {
    const preview = parseWeeklySalesCsv(
      csv(
        row("HG ARACAJU", [2, 6, 9, null, null]),
        row("R1", [2, 6, 9, 0, null]),
        row("TOTAL", [2, 6, 9, 0, null]),
      ),
    );

    expect(preview.errors).toEqual([]);
    expect(preview.summary.referenceWeek).toBe(4);
    expect(preview.summary.dealersWithoutReferenceSales).toBe(1);
    expect(preview.summary.dealersWithoutWeek4Sales).toBe(1);
    expect(preview.rows[0]?.weeks["4"]?.retail).toBeNull();
    expect(preview.warnings).toContain("HG ARACAJU: Semana 4 sem MTD Retail Order informado.");
  });

  it("concilia o nome de origem IGUATU FORTALEZA ao canonical do dashboard", () => {
    expect(resolveWeeklySalesCanonicalDealer("IGUATU FORTALEZA")).toEqual({
      canonicalDealer: "IGUALTO - MG FORTALEZA",
      explicitMapping: true,
    });
  });

  it.each([
    ["BALTIC BARUERI/GUARULHOS", "Baltic Shopping Tamboré"],
    ["SAVOL SÃO CAETANO/ANÁLIA", "SAVOL ZL/SP"],
  ])("concilia o nome composto %s ao canonical %s", (sourceName, canonicalDealer) => {
    expect(resolveWeeklySalesCanonicalDealer(sourceName)).toEqual({
      canonicalDealer,
      explicitMapping: true,
    });
  });

  it("rejeita arquivo cujo total da última semana preenchida não reconcilia", () => {
    const preview = parseWeeklySalesCsv(
      csv(
        row("BALTIC BARUERI", [2, 6, 9, 12, 15]),
        row("R1", [2, 6, 9, 12, 15]),
        row("TOTAL", [2, 6, 9, 12, 16]),
      ),
    );

    expect(preview.summary.referenceWeek).toBe(5);
    expect(preview.summary.reconciliationPassed).toBe(false);
    expect(preview.errors).toContain(
      "O total de MTD Retail Order da Semana 5 não reconcilia entre concessionárias, regiões e TOTAL.",
    );
  });

  it("rejeita semana parcial quando dealers têm Retail e o TOTAL está vazio", () => {
    const preview = parseWeeklySalesCsv(
      csv(
        row("BALTIC BARUERI", [2, 6, 9, 12, 1]),
        row("R1", [2, 6, 9, 12, 1]),
        row("TOTAL", [2, 6, 9, 12, null]),
      ),
    );

    expect(preview.summary.referenceWeek).toBe(4);
    expect(preview.errors).toContain(
      "A Semana 5 possui MTD Retail Order em concessionárias ou regiões, mas o campo MTD Retail Order do TOTAL está vazio.",
    );
  });

  it("rejeita arquivo sem nenhum Retail preenchido no TOTAL", () => {
    const emptyRetail = [null, null, null, null, null];
    const preview = parseWeeklySalesCsv(
      csv(row("BALTIC BARUERI", emptyRetail), row("R1", emptyRetail), row("TOTAL", emptyRetail)),
    );

    expect(preview.summary.referenceWeek).toBeNull();
    expect(preview.summary.reconciliationPassed).toBe(false);
    expect(preview.errors).toContain(
      "A linha TOTAL não possui MTD Retail Order preenchido em nenhuma semana.",
    );
  });

  it("rejeita cabeçalho incompatível", () => {
    expect(() => parseWeeklySalesCsv(Buffer.from("dealer,w4\nA,1"))).toThrow(
      "Cabeçalho incompatível",
    );
  });
});
