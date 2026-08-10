import { describe, expect, it } from "vitest";

import {
  buildOfficialWeeklyDealerKeys,
  buildCumulativeWeeklyLeadCounts,
  calculateWeeklySalesEfficiency,
  getWeeklyLeadCutoffDates,
  resolveOfficialWeeklyDealerMatchStatus,
  selectWeeklySalesReference,
} from "./weeklySalesService";
import { getOfficialDealers, normalizeDealerLookupKey } from "./dealerNormalization";

describe("cadastro oficial de dealers nas Vendas Semanais", () => {
  it("reconhece os 31 dealers oficiais usando o mesmo de-para do parser semanal", () => {
    const keys = buildOfficialWeeklyDealerKeys(getOfficialDealers());

    expect(keys.size).toBe(31);
    for (const dealer of [
      "HG ARACAJU",
      "LA FONTAINE JOINVILLE",
      "AUTOBRAND RECIFE",
      "SINAL AV EUROPA",
    ]) {
      expect(keys.has(normalizeDealerLookupKey(dealer))).toBe(true);
    }

    expect(keys.has(normalizeDealerLookupKey("Baltic Shopping Tamboré"))).toBe(true);
    expect(keys.has(normalizeDealerLookupKey("TECAR - SIA BRASILIA"))).toBe(true);

    expect(resolveOfficialWeeklyDealerMatchStatus("HG ARACAJU", keys)).toBe("MATCHED");
    expect(resolveOfficialWeeklyDealerMatchStatus("DEALER FORA DO CADASTRO", keys)).toBe("UNMATCHED");
    expect(resolveOfficialWeeklyDealerMatchStatus(null, keys)).toBe("UNMATCHED");
  });
});

describe("Leads acumulados por semana", () => {
  it("define os cortes acumulados W1–W5, com W4 no dia 28 e W5 no fim do período", () => {
    expect(getWeeklyLeadCutoffDates("2026-07", "2026-07-22")).toEqual({
      "1": "2026-07-07",
      "2": "2026-07-14",
      "3": "2026-07-21",
      "4": "2026-07-22",
      "5": "2026-07-22",
    });
    expect(getWeeklyLeadCutoffDates("2026-07", "2026-07-05")).toEqual({
      "1": "2026-07-05",
      "2": "2026-07-05",
      "3": "2026-07-05",
      "4": "2026-07-05",
      "5": "2026-07-05",
    });
    expect(getWeeklyLeadCutoffDates("2026-07", "2026-07-31")).toEqual({
      "1": "2026-07-07",
      "2": "2026-07-14",
      "3": "2026-07-21",
      "4": "2026-07-28",
      "5": "2026-07-31",
    });
  });

  it("acumula Leads por dealer, consolida aliases e ignora Leads em qualificação", () => {
    const result = buildCumulativeWeeklyLeadCounts(
      [
        { dealerName: "ORVEL - VITÓRIA", correctedDate: "2026-07-03", count: 2 },
        {
          dealerName: "orvel_shopping_vitória_-_vitória/es_",
          correctedDate: "2026-07-10",
          count: 3,
        },
        { dealerName: "ORVEL - VITÓRIA", correctedDate: "2026-07-20", count: 5 },
        { dealerName: "ORVEL - VITÓRIA", correctedDate: "2026-07-22", count: 7 },
        { dealerName: "Indisponível", correctedDate: "2026-07-04", count: 11 },
      ],
      {
        "1": "2026-07-07",
        "2": "2026-07-14",
        "3": "2026-07-21",
        "4": "2026-07-22",
        "5": "2026-07-22",
      },
    );

    expect(result.size).toBe(1);
    expect([...result.values()][0]).toEqual({
      "1": 2,
      "2": 5,
      "3": 10,
      "4": 17,
      "5": 17,
    });
  });
});

describe("eficiência semanal de vendas", () => {
  it("seleciona Leads e vendas da última semana preenchida informada pelo lote", () => {
    const weeks = {
      "1": { target: 2, retail: 1, achievementPercent: 50, leads: 10 },
      "2": { target: 4, retail: 2, achievementPercent: 50, leads: 20 },
      "3": { target: 6, retail: 3, achievementPercent: 50, leads: 30 },
      "4": { target: 8, retail: 4, achievementPercent: 50, leads: 40 },
      "5": { target: 10, retail: 5, achievementPercent: 50, leads: 50 },
    };

    expect(selectWeeklySalesReference(weeks, 5)).toEqual({ leads: 50, sales: 5 });
    expect(selectWeeklySalesReference(weeks, 3)).toEqual({ leads: 30, sales: 3 });
  });

  it("calcula conversão, leads por venda e arredondamento da necessidade", () => {
    expect(calculateWeeklySalesEfficiency(101, 4)).toEqual({
      conversionRatePercent: 3.96,
      leadsPerSale: 25.25,
      estimatedLeadsNeeded: 26,
    });
  });

  it("mantém 0% de conversão quando há leads e nenhuma venda", () => {
    expect(calculateWeeklySalesEfficiency(100, 0)).toEqual({
      conversionRatePercent: 0,
      leadsPerSale: null,
      estimatedLeadsNeeded: null,
    });
  });

  it.each([
    { leads: 0, sales: 4 },
    { leads: 100, sales: null },
  ])("retorna métricas nulas para $leads leads e $sales vendas", ({ leads, sales }) => {
    expect(calculateWeeklySalesEfficiency(leads, sales)).toEqual({
      conversionRatePercent: null,
      leadsPerSale: null,
      estimatedLeadsNeeded: null,
    });
  });
});
