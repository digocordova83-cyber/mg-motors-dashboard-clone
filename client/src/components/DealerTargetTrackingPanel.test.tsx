import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  DealerTargetTrackingPanel,
  sortDealerTargetProgress,
  type DealerTargetProgress,
} from "./DealerTargetTrackingPanel";

const dealers = [
  {
    dealerKey: "DEALER A",
    dealerName: "DEALER A",
    stateCode: "SP",
    leadTarget: 100,
    leadsActual: 80,
    leadAchievementPercent: 80,
    leadGap: 20,
    salesTarget: 10,
    salesActual: 5,
    salesAchievementPercent: 50,
    salesGap: 5,
    targetConversionRatePercent: 10,
    actualConversionRatePercent: 6.25,
    channelTargets: {},
  },
  {
    dealerKey: "DEALER B",
    dealerName: "DEALER B",
    stateCode: "RJ",
    leadTarget: 50,
    leadsActual: 20,
    leadAchievementPercent: 40,
    leadGap: 30,
    salesTarget: 5,
    salesActual: null,
    salesAchievementPercent: null,
    salesGap: null,
    targetConversionRatePercent: 10,
    actualConversionRatePercent: null,
    channelTargets: {},
  },
] as DealerTargetProgress[];

const tracking = {
  competence: "2026-08",
  source: {
    fileName: "metas.xlsx",
    fileHash: "hash",
    importedBy: "rodrigo",
    importedAt: Date.UTC(2026, 7, 12, 12, 0),
  },
  summary: {
    dealers: 2,
    salesReportedDealers: 1,
    leadTarget: 150,
    leadsActual: 100,
    leadAchievementPercent: 66.67,
    leadGap: 50,
    salesTarget: 15,
    salesActual: 5,
    salesAchievementPercent: 33.33,
    salesGap: 10,
    targetConversionRatePercent: 10,
    actualConversionRatePercent: 5,
  },
  dealers,
};

const geographicCpl = {
  dealers: [
    { dealerName: "DEALER A", investment: 1_000, estimatedCpl: 12.5 },
    { dealerName: "DEALER B", investment: 500, estimatedCpl: 25 },
  ],
};

describe("DealerTargetTrackingPanel", () => {
  it("ordena por atingimento e preserva dealers sem MTD Retail Order reportado", () => {
    expect(sortDealerTargetProgress(dealers, "leadAchievement", "asc").map(row => row.dealerName)).toEqual([
      "DEALER B",
      "DEALER A",
    ]);
    expect(sortDealerTargetProgress(dealers, "salesAchievement", "desc").map(row => row.dealerName)).toEqual([
      "DEALER A",
      "DEALER B",
    ]);
  });

  it("renderiza resumo, tabela desktop e cards mobile em português", () => {
    const html = renderToStaticMarkup(<DealerTargetTrackingPanel tracking={tracking as never} geographicCpl={geographicCpl as never} locale="pt-BR" />).replaceAll("\u00a0", " ");

    expect(html).toContain("Acompanhamento das metas por concessionária");
    expect(html).toContain("Leads atribuídos às 2 concessionárias");
    expect(html).not.toContain("31 concessionárias");
    expect(html).toContain("Leads atribuídos / meta");
    expect(html).toContain("Meta de MTD Retail Order");
    expect(html).toContain("Atingimento de MTD Retail Order");
    expect(html).toContain("100 / 150");
    expect(html).toContain("5 / 15");
    expect(html).toContain("66,67%");
    expect(html).toContain('data-testid="dealer-target-table"');
    expect(html).toContain('data-testid="dealer-target-mobile-list"');
    expect(html).toContain("DEALER B");
    expect(html).toContain("Investimento alocado");
    expect(html).toContain("CPL estimado");
    expect(html).toContain("R$ 1.000,00");
    expect(html).toContain("R$ 12,50");
  });

  it("localiza títulos e controles em inglês", () => {
    const html = renderToStaticMarkup(<DealerTargetTrackingPanel tracking={tracking as never} locale="en-US" />);

    expect(html).toContain("Dealer target tracking");
    expect(html).toContain("D-1 Leads assigned to the 2 dealers");
    expect(html).not.toContain("31 dealers");
    expect(html).toContain("Lead achievement");
    expect(html).toContain("MTD Retail Order target");
    expect(html).toContain("MTD Retail Order achievement");
    expect(html).toContain("Search dealer or state");
    expect(html).toContain("dealers reported");
    expect(html).toContain("Allocated investment");
    expect(html).toContain("Estimated CPL");
  });
});
