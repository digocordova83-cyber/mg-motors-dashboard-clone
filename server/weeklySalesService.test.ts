import { describe, expect, it } from "vitest";

import {
  buildCumulativeWeeklyLeadCounts,
  calculateWeeklySalesEfficiency,
  getWeeklyLeadCutoffDates,
} from "./weeklySalesService";

describe("Leads acumulados por semana", () => {
  it("define os cortes nos dias 7, 14, 21 e D-1 da competência", () => {
    expect(getWeeklyLeadCutoffDates("2026-07", "2026-07-22")).toEqual({
      "1": "2026-07-07",
      "2": "2026-07-14",
      "3": "2026-07-21",
      "4": "2026-07-22",
    });
    expect(getWeeklyLeadCutoffDates("2026-07", "2026-07-05")).toEqual({
      "1": "2026-07-05",
      "2": "2026-07-05",
      "3": "2026-07-05",
      "4": "2026-07-05",
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
      },
    );

    expect(result.size).toBe(1);
    expect([...result.values()][0]).toEqual({ "1": 2, "2": 5, "3": 10, "4": 17 });
  });
});

describe("eficiência semanal de vendas", () => {
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
