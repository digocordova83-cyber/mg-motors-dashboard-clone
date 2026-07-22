import { describe, expect, it } from "vitest";

import { calculateWeeklySalesEfficiency } from "./weeklySalesService";

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
