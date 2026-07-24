import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  isSupportedWeeklySalesFileName,
  WEEKLY_SALES_FILE_ACCEPT,
  WeeklySalesMetricsTable,
  WeeklySalesPeriodIdentity,
  WeeklySalesPreviewSummary,
  WeeklySalesSummaryCards,
  WeeklySalesWeekHistory,
} from "./WeeklySalesPanel";

const dealerWithHistory = {
  sourceName: "BALTIC BARUERI",
  dealerName: "Baltic Shopping Tamboré",
  matchStatus: "MATCHED",
  leads: 100,
  sales: 4,
  conversionRatePercent: 4,
  leadsPerSale: 25,
  estimatedLeadsNeeded: 25,
  weeks: {
    1: { target: 1, leads: 20, retail: 1, achievementPercent: 100 },
    2: { target: 3, leads: 45, retail: 2, achievementPercent: 66.7 },
    3: { target: 6, leads: 70, retail: 3, achievementPercent: 50 },
    4: { target: 8, leads: 100, retail: 4, achievementPercent: 50 },
    5: { target: 10, leads: null, retail: null, achievementPercent: null },
  },
} as never;

const metrics = {
  competence: "2026-07",
  dateFrom: "2026-07-01",
  dateTo: "2026-07-31",
  import: {
    id: 1,
    fileName: "weekly-sales.csv",
    importedBy: "rodrigo",
    importedAt: Date.UTC(2026, 6, 22, 12, 0),
  },
  summary: {
    dealers: 2,
    matchedDealers: 1,
    unmatchedDealers: 1,
    dealersWithoutWeek4Sales: 0,
    totalLeads: 100,
    totalSales: 7,
    matchedSales: 4,
    unmatchedSales: 3,
    conversionRatePercent: 4,
    leadsPerSale: 25,
    estimatedLeadsNeeded: 25,
  },
  dealers: [
    dealerWithHistory,
    {
      sourceName: "DEALER SEM MAPA",
      dealerName: "DEALER SEM MAPA",
      matchStatus: "UNMATCHED",
      leads: 0,
      sales: 3,
      conversionRatePercent: null,
      leadsPerSale: null,
      estimatedLeadsNeeded: null,
      weeks: {},
    },
  ],
} as never;

describe("vendas semanais na experiência de concessionárias", () => {
  it("aceita CSV e PDF no seletor semanal e rejeita outros formatos", () => {
    expect(WEEKLY_SALES_FILE_ACCEPT).toContain(".csv");
    expect(WEEKLY_SALES_FILE_ACCEPT).toContain(".pdf");
    expect(isSupportedWeeklySalesFileName("weekly-sales.csv")).toBe(true);
    expect(isSupportedWeeklySalesFileName("Daily Sales Planning Report.PDF")).toBe(true);
    expect(isSupportedWeeklySalesFileName("weekly-sales.xlsx")).toBe(false);
  });

  it("identifica o período filtrado dos Leads sem alterar a referência mensal das vendas", () => {
    const pt = renderToStaticMarkup(
      <WeeklySalesPeriodIdentity
        competence="2026-07"
        dateFrom="2026-07-08"
        dateTo="2026-07-22"
      />,
    );
    const en = renderToStaticMarkup(
      <WeeklySalesPeriodIdentity
        competence="2026-07"
        dateFrom="2026-07-08"
        dateTo="2026-07-22"
        locale="en-US"
      />,
    );

    expect(pt).toContain("Leads: 08/07/2026–22/07/2026");
    expect(pt).toContain("Vendas: referência mensal");
    expect(pt).toContain("julho de 2026");
    expect(en).toContain("Leads: 07/08/2026–07/22/2026");
    expect(en).toContain("Sales: monthly reference");
    expect(en).toContain("July 2026");
  });

  it("exibe Semana 4 e fórmulas de eficiência sem somar semanas anteriores", () => {
    const cards = renderToStaticMarkup(<WeeklySalesSummaryCards metrics={metrics} />);
    const table = renderToStaticMarkup(<WeeklySalesMetricsTable metrics={metrics} />);

    expect(cards).toContain("Vendas — Semana 4");
    expect(cards).toContain("Taxa de conversão");
    expect(cards).toContain("Leads por venda");
    expect(cards).toContain("Leads estimados necessários");
    expect(cards).toContain("4%");
    expect(cards).toContain("25");
    expect(table).toContain("A Semana 4 é a referência mensal acumulada");
    expect(table).toContain("não somamos as Semanas 1–4");
    expect(table).toContain("Origem");
    expect(table).not.toContain("CSV:");
  });

  it("exibe o histórico acumulado Semanas 1–4 e marca a Semana 4 como referência mensal", () => {
    const historyPt = renderToStaticMarkup(<WeeklySalesWeekHistory dealer={dealerWithHistory} />);
    const historyEn = renderToStaticMarkup(<WeeklySalesWeekHistory dealer={dealerWithHistory} locale="en-US" />);

    expect(historyPt).toContain("Histórico acumulado por semana");
    expect(historyPt).toContain("Semana 1");
    expect(historyPt).toContain("Semana 4");
    expect(historyPt).toContain("Referência mensal");
    expect(historyPt).toContain("Meta, vendas e Leads são acumulados");
    expect(historyPt).toMatch(/Semana 1[\s\S]*Leads[\s\S]*20/);
    expect(historyPt).toMatch(/Semana 4[\s\S]*Leads[\s\S]*100/);
    expect(historyEn).toContain("Cumulative history by week");
    expect(historyEn).toContain("Week 4");
    expect(historyEn).toContain("Monthly reference");
    expect(historyEn).toContain("Target");
    expect(historyEn).toContain("Sales");
    expect(historyEn).toContain("Achievement");
    expect(historyEn).toContain("Target, sales and Leads are cumulative");
  });

  it("mantém métricas e correspondência integralmente em inglês para mgsales", () => {
    const cards = renderToStaticMarkup(<WeeklySalesSummaryCards metrics={metrics} locale="en-US" />);
    const table = renderToStaticMarkup(<WeeklySalesMetricsTable metrics={metrics} locale="en-US" />);

    expect(cards).toContain("Sales — Week 4");
    expect(cards).toContain("Conversion rate");
    expect(cards).toContain("Leads per sale");
    expect(cards).toContain("Estimated Leads needed");
    expect(table).toContain("Sales efficiency by dealer");
    expect(table).toContain("1 unmatched dealer(s)");
    expect(table).toContain("Matched");
    expect(table).toContain("Unmatched");
    expect(table).not.toContain("Sem correspondência");
  });

  it("oferece histórico dos canais somente para dealers correspondentes com dados no período", () => {
    const channelHistoryDealerNames = new Set(["Baltic Shopping Tamboré"]);
    const pt = renderToStaticMarkup(
      <WeeklySalesMetricsTable
        metrics={metrics}
        channelHistoryDealerNames={channelHistoryDealerNames}
        onViewChannelHistory={() => undefined}
      />,
    );
    const en = renderToStaticMarkup(
      <WeeklySalesMetricsTable
        metrics={metrics}
        locale="en-US"
        channelHistoryDealerNames={channelHistoryDealerNames}
        onViewChannelHistory={() => undefined}
      />,
    );

    expect(pt).toContain("Histórico dos canais");
    expect(pt).toContain("Abrir histórico dos canais de Baltic Shopping Tamboré");
    expect(pt).not.toContain("Abrir histórico dos canais de DEALER SEM MAPA");
    expect(en).toContain("Channel history");
    expect(en).toContain("Open channel history for Baltic Shopping Tamboré");
  });

  it("destaca na prévia os dealers que não existem na base de Leads", () => {
    const preview = {
      fileName: "weekly-sales.csv",
      fileHash: "a".repeat(64),
      competence: "2026-07",
      valid: true,
      errors: [],
      warnings: [],
      summary: {
        rowsTotal: 4,
        dealerRows: 2,
        regionRows: 1,
        totalRows: 1,
        dealersWithoutWeek4Sales: 0,
        week4DealerSalesTotal: 7,
        week4RegionSalesTotal: 7,
        week4ReportedSalesTotal: 7,
        reconciliationPassed: true,
        matchedDealerRows: 1,
        unmatchedDealerRows: 1,
      },
      dealers: [
        {
          sourceRowNumber: 2,
          sourceName: "BALTIC BARUERI",
          canonicalDealer: "Baltic Shopping Tamboré",
          matchStatus: "MATCHED",
          week4Retail: 4,
          week4AchievementPercent: 40,
        },
        {
          sourceRowNumber: 3,
          sourceName: "DEALER SEM MAPA",
          canonicalDealer: "DEALER SEM MAPA",
          matchStatus: "UNMATCHED",
          week4Retail: 3,
          week4AchievementPercent: 30,
        },
      ],
      unmatchedDealers: ["DEALER SEM MAPA"],
    } as never;

    const html = renderToStaticMarkup(<WeeklySalesPreviewSummary preview={preview} />);

    expect(html).toContain("Reconciliação da Semana 4 aprovada");
    expect(html).toContain("Sem correspondência na base de Leads");
    expect(html).toContain("DEALER SEM MAPA");
    expect(html).toContain("Baltic Shopping Tamboré");
  });
});
