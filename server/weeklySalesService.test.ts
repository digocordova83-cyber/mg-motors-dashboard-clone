import { describe, expect, it } from "vitest";

import {
  buildOfficialWeeklyDealerKeys,
  buildCumulativeWeeklyLeadCounts,
  buildWeeklySalesStateMetrics,
  calculateWeeklySalesEfficiency,
  getWeeklyLeadCutoffDates,
  resolveDealerStateCode,
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

  it("extrai a UF da área operacional sem inferir quando o cadastro está incompleto", () => {
    expect(resolveDealerStateCode("CURITIBA/PR")).toBe("PR");
    expect(resolveDealerStateCode("SAO PAULO/SP")).toBe("SP");
    expect(resolveDealerStateCode(null)).toBeNull();
    expect(resolveDealerStateCode("SEM UF")).toBeNull();
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

  it("agrupa Leads e vendas por estado e explicita a cobertura parcial do arquivo de vendas", () => {
    const zero = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    const leadCountsByWeek = new Map([
      [normalizeDealerLookupKey("BARIGUI - CURITIBA"), { ...zero, "2": 30 }],
      [normalizeDealerLookupKey("SAVOL - SÃO CAETANO"), { ...zero, "2": 50 }],
      [normalizeDealerLookupKey("SINAL AV EUROPA"), { ...zero, "2": 40 }],
    ]);
    const dealerMetrics = [
      {
        sourceName: "BARIGUI - CURITIBA",
        dealerName: "BARIGUI - CURITIBA",
        matchStatus: "MATCHED",
        leads: 30,
        sales: 2,
        conversionRatePercent: 6.67,
        leadsPerSale: 15,
        estimatedLeadsNeeded: 15,
        weeks: { "2": { target: 2, retail: 2, achievementPercent: 100, leads: 30 } },
      },
      {
        sourceName: "SAVOL - SÃO CAETANO",
        dealerName: "SAVOL - SÃO CAETANO",
        matchStatus: "MATCHED",
        leads: 50,
        sales: 5,
        conversionRatePercent: 10,
        leadsPerSale: 10,
        estimatedLeadsNeeded: 10,
        weeks: { "2": { target: 5, retail: 5, achievementPercent: 100, leads: 50 } },
      },
    ];

    const states = buildWeeklySalesStateMetrics({
      officialDealers: [
        { name: "BARIGUI - CURITIBA", operationalArea: "CURITIBA/PR" },
        { name: "SAVOL - SÃO CAETANO", operationalArea: "SAO CAETANO/SP" },
        { name: "SINAL AV EUROPA", operationalArea: "SAO PAULO/SP" },
      ],
      leadCountsByWeek,
      dealerMetrics: dealerMetrics as never,
      referenceWeek: 2,
    });

    expect(states.map(state => state.stateCode)).toEqual(["SP", "PR"]);
    expect(states[0]).toMatchObject({
      stateCode: "SP",
      stateName: "São Paulo",
      leads: 90,
      sales: 5,
      conversionRatePercent: 10,
      salesCoverageLeads: 50,
      salesCoveragePercent: 55.56,
      officialDealers: 2,
      recipientDealers: 2,
      salesReportedDealers: 1,
    });
    expect(states[0].dealers).toEqual([
      expect.objectContaining({ dealerName: "SAVOL - SÃO CAETANO", leads: 50, sales: 5 }),
      expect.objectContaining({ dealerName: "SINAL AV EUROPA", leads: 40, sales: null }),
    ]);
    expect(states[1]).toMatchObject({ stateCode: "PR", leads: 30, sales: 2, conversionRatePercent: 6.67 });
  });
});
