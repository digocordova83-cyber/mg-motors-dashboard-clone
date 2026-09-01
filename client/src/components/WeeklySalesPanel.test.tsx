import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  buildDealerConversionRanking,
  buildStatePerformanceRanking,
  isSupportedWeeklySalesFileName,
  sortDealerConversionRanking,
  sortStatePerformanceRanking,
  WEEKLY_SALES_FILE_ACCEPT,
  WeeklySalesBottomConversion,
  WeeklySalesMetricsTable,
  WeeklySalesPeriodIdentity,
  WeeklySalesPreviewSummary,
  WeeklySalesStateDealerTable,
  WeeklySalesStateRanking,
  WeeklySalesSummaryCards,
  WeeklySalesTopConversion,
  WeeklySalesWeekHistory,
} from "./WeeklySalesPanel";

const dealerWithHistory = {
  sourceName: "BALTIC BARUERI",
  dealerName: "Baltic Shopping Tamboré",
  matchStatus: "MATCHED",
  leads: 125,
  sales: 5,
  conversionRatePercent: 4,
  leadsPerSale: 25,
  estimatedLeadsNeeded: 25,
  weeks: {
    1: { target: 1, leads: 20, retail: 1, achievementPercent: 100 },
    2: { target: 3, leads: 45, retail: 2, achievementPercent: 66.7 },
    3: { target: 6, leads: 70, retail: 3, achievementPercent: 50 },
    4: { target: 8, leads: 100, retail: 4, achievementPercent: 50 },
    5: { target: 10, leads: 125, retail: 5, achievementPercent: 50 },
  },
} as never;

const metrics = {
  competence: "2026-07",
  dateFrom: "2026-07-01",
  dateTo: "2026-07-31",
  referenceWeek: 5,
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
    dealersWithoutReferenceSales: 0,
    dealersWithoutWeek4Sales: 0,
    totalLeads: 125,
    totalSales: 8,
    matchedSales: 5,
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

const stateMetrics = {
  ...(metrics as any),
  states: [
    {
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
      weeks: {
        5: { leads: 90, sales: 5, conversionRatePercent: 10, salesCoverageLeads: 50, salesCoveragePercent: 55.56, recipientDealers: 2, salesReportedDealers: 1 },
      },
      dealers: [
        {
          dealerName: "SAVOL - SÃO CAETANO",
          stateCode: "SP",
          leads: 50,
          sales: 5,
          salesReported: true,
          conversionRatePercent: 10,
          weeks: { 5: { leads: 50, sales: 5, conversionRatePercent: 10 } },
        },
        {
          dealerName: "SINAL AV EUROPA",
          stateCode: "SP",
          leads: 40,
          sales: null,
          salesReported: false,
          conversionRatePercent: null,
          weeks: { 5: { leads: 40, sales: null, conversionRatePercent: null } },
        },
      ],
    },
    {
      stateCode: "PR",
      stateName: "Paraná",
      leads: 30,
      sales: 2,
      conversionRatePercent: 6.67,
      salesCoverageLeads: 30,
      salesCoveragePercent: 100,
      officialDealers: 1,
      recipientDealers: 1,
      salesReportedDealers: 1,
      weeks: {
        5: { leads: 30, sales: 2, conversionRatePercent: 6.67, salesCoverageLeads: 30, salesCoveragePercent: 100, recipientDealers: 1, salesReportedDealers: 1 },
      },
      dealers: [],
    },
  ],
} as never;

function metricsWithDealers(dealers: unknown[]) {
  return {
    competence: "2026-07",
    dateFrom: "2026-07-01",
    dateTo: "2026-07-31",
    referenceWeek: 5,
    import: {
      id: 1,
      fileName: "weekly-sales.csv",
      importedBy: "rodrigo",
      importedAt: Date.UTC(2026, 6, 22, 12, 0),
    },
    summary: {
      dealers: dealers.length,
      matchedDealers: dealers.length,
      unmatchedDealers: 0,
      dealersWithoutReferenceSales: 0,
      dealersWithoutWeek4Sales: 0,
      totalLeads: 0,
      totalSales: 0,
      matchedSales: 0,
      unmatchedSales: 0,
      conversionRatePercent: null,
      leadsPerSale: null,
      estimatedLeadsNeeded: null,
    },
    dealers,
  } as never;
}

describe("vendas semanais na experiência de concessionárias", () => {
  it("aceita CSV e PDF no seletor semanal e rejeita outros formatos", () => {
    expect(WEEKLY_SALES_FILE_ACCEPT).toContain(".csv");
    expect(WEEKLY_SALES_FILE_ACCEPT).toContain(".pdf");
    expect(isSupportedWeeklySalesFileName("weekly-sales.csv")).toBe(true);
    expect(isSupportedWeeklySalesFileName("Daily Sales Planning Report.PDF")).toBe(true);
    expect(isSupportedWeeklySalesFileName("weekly-sales.xlsx")).toBe(false);
  });

  it("identifica o período filtrado dos Leads e a última semana preenchida", () => {
    const pt = renderToStaticMarkup(
      <WeeklySalesPeriodIdentity
        competence="2026-07"
        dateFrom="2026-07-08"
        dateTo="2026-07-22"
        referenceWeek={5}
      />,
    );
    const en = renderToStaticMarkup(
      <WeeklySalesPeriodIdentity
        competence="2026-07"
        dateFrom="2026-07-08"
        dateTo="2026-07-22"
        referenceWeek={5}
        locale="en-US"
      />,
    );

    expect(pt).toContain("Leads: 08/07/2026–22/07/2026");
    expect(pt).toContain("MTD Retail Order: referência acumulada");
    expect(pt).toContain("A Semana 5 é a última semana com MTD Retail Order preenchido");
    expect(pt).toContain("julho de 2026");
    expect(en).toContain("Leads: 07/08/2026–07/22/2026");
    expect(en).toContain("MTD Retail Order: cumulative reference");
    expect(en).toContain("Week 5 is the latest week with MTD Retail Order filled");
    expect(en).toContain("July 2026");
  });

  it("exibe a última semana preenchida e fórmulas de eficiência sem somar semanas anteriores", () => {
    const cards = renderToStaticMarkup(<WeeklySalesSummaryCards metrics={metrics} />);
    const table = renderToStaticMarkup(<WeeklySalesMetricsTable metrics={metrics} />);

    expect(cards).toContain("MTD Retail Order — Semana 5");
    expect(cards).toContain("Taxa de conversão");
    expect(cards).toContain("Leads por MTD Retail Order");
    expect(cards).toContain("Leads estimados necessários");
    expect(cards).toContain("4%");
    expect(cards).toContain("25");
    expect(table).toContain("Semana 5: ranking acumulado");
    expect(table).toContain("MTD Retail Order");
    expect(table).toContain("Leads recebidos");
    expect(table).toContain("Origem");
    expect(table).not.toContain("CSV:");
  });

  it("ordena estados por Leads e preserva conversão baseada somente na cobertura reportada", () => {
    const rows = buildStatePerformanceRanking(stateMetrics, 5);

    expect(sortStatePerformanceRanking(rows, "leads", "desc").map(row => row.stateCode)).toEqual(["SP", "PR"]);
    expect(rows[0]).toMatchObject({
      stateCode: "SP",
      leads: 90,
      sales: 5,
      conversionRatePercent: 10,
      salesCoverageLeads: 50,
      salesCoveragePercent: 55.56,
    });
  });

  it("ordena estados por melhor conversão e mantém valores indisponíveis no final", () => {
    const rows = [
      { stateCode: "SP", stateName: "São Paulo", leads: 100, sales: 10, conversionRatePercent: 10 },
      { stateCode: "PR", stateName: "Paraná", leads: 100, sales: 5, conversionRatePercent: 5 },
      { stateCode: "XX", stateName: "Sem taxa", leads: 100, sales: 0, conversionRatePercent: null },
    ] as any;

    expect(sortStatePerformanceRanking(rows, "conversion", "desc").map(row => row.stateCode)).toEqual(["SP", "PR", "XX"]);
    expect(sortStatePerformanceRanking(rows, "conversion", "asc").map(row => row.stateCode)).toEqual(["PR", "SP", "XX"]);
  });

  it("remove o painel redundante da composição final do dashboard", () => {
    const source = readFileSync(new URL("./WeeklySalesPanel.tsx", import.meta.url), "utf8");

    expect(source).not.toContain("<WeeklySalesMetricsTable");
    expect(source).toContain("<DealerTargetTrackingPanel");
    expect(source).toContain("<WeeklySalesStateRanking");
  });

  it("renderiza o ranking estadual e a abertura dos dealers com status de cobertura", () => {
    const geographicCpl = {
      states: [
        { stateCode: "SP", investment: 5_000, estimatedCpl: 55.56 },
        { stateCode: "PR", investment: 2_000, estimatedCpl: 40 },
      ],
    };
    const ranking = renderToStaticMarkup(
      <WeeklySalesStateRanking metrics={stateMetrics} selectedWeek={5} geographicCpl={geographicCpl as never} />,
    ).replaceAll("\u00a0", " ");
    const dealers = renderToStaticMarkup(
      <WeeklySalesStateDealerTable state={(stateMetrics as any).states[0]} selectedWeek={5} />,
    );

    expect(ranking).toContain("Principais concessionárias, Leads e MTD Retail Order por estado");
    expect(ranking).toContain("São Paulo");
    expect(ranking).toContain("50 de 90 Leads");
    expect(ranking).toContain("55,56%");
    expect(ranking).toContain("Investimento alocado");
    expect(ranking).toContain("CPL estimado");
    expect(ranking).toContain("R$ 5.000,00");
    expect(ranking).toContain("R$ 55,56");
    expect(dealers).toContain("SAVOL - SÃO CAETANO");
    expect(dealers).toContain("SINAL AV EUROPA");
    expect(dealers).toContain("Sem linha no arquivo");
  });

  it("localiza o título e o subtítulo da visão estadual em inglês", () => {
    const ranking = renderToStaticMarkup(
      <WeeklySalesStateRanking metrics={stateMetrics} selectedWeek={5} locale="en-US" />,
    );

    expect(ranking).toContain("Top Dealers, Leads and MTD Retail Order by State");
    expect(ranking).toContain("Week 5: one view of Leads, MTD Retail Order, and conversion");
    expect(ranking).not.toContain("Principais concessionárias, Leads e vendas por estado");
  });

  it("exibe o histórico acumulado W1–W5 e marca a última semana como referência", () => {
    const historyPt = renderToStaticMarkup(
      <WeeklySalesWeekHistory dealer={dealerWithHistory} referenceWeek={5} />,
    );
    const historyEn = renderToStaticMarkup(
      <WeeklySalesWeekHistory dealer={dealerWithHistory} referenceWeek={5} locale="en-US" />,
    );

    expect(historyPt).toContain("Histórico acumulado por semana");
    expect(historyPt).toContain("Semana 1");
    expect(historyPt).toContain("Semana 4");
    expect(historyPt).toContain("Semana 5");
    expect(historyPt).toContain("Referência mensal");
    expect(historyPt).toContain("Meta, MTD Retail Order e Leads são acumulados");
    expect(historyPt).toMatch(/Semana 1[\s\S]*Leads[\s\S]*20/);
    expect(historyPt).toMatch(/Semana 4[\s\S]*Leads[\s\S]*100/);
    expect(historyPt).toMatch(/Semana 5[\s\S]*Leads[\s\S]*125/);
    expect(historyEn).toContain("Cumulative history by week");
    expect(historyEn).toContain("Week 5");
    expect(historyEn).toContain("Monthly reference");
    expect(historyEn).toContain("Target");
    expect(historyEn).toContain("MTD Retail Order");
    expect(historyEn).toContain("Achievement");
    expect(historyEn).toContain("Target, MTD Retail Order, and Leads are cumulative");
  });

  it("mantém métricas e correspondência integralmente em inglês para mgsales", () => {
    const cards = renderToStaticMarkup(<WeeklySalesSummaryCards metrics={metrics} locale="en-US" />);
    const table = renderToStaticMarkup(<WeeklySalesMetricsTable metrics={metrics} locale="en-US" />);

    expect(cards).toContain("MTD Retail Order — Week 5");
    expect(cards).toContain("Conversion rate");
    expect(cards).toContain("Leads per MTD Retail Order");
    expect(cards).toContain("Estimated Leads needed");
    expect(table).toContain("MTD Retail Order efficiency by dealer");
    expect(table).toContain("1 unmatched dealer(s)");
    expect(table).toContain("Week 5: cumulative ranking");
    expect(table).toContain("Leads received");
    expect(table).not.toContain("Sem correspondência");
  });

  it("oculta um resumo antigo quando a lista atual está integralmente conciliada", () => {
    const currentMetrics = metricsWithDealers([dealerWithHistory]) as any;
    const staleSummaryMetrics = {
      ...currentMetrics,
      summary: {
        ...currentMetrics.summary,
        matchedDealers: 0,
        unmatchedDealers: 4,
      },
    } as never;

    const table = renderToStaticMarkup(
      <WeeklySalesMetricsTable metrics={staleSummaryMetrics} locale="pt-BR" />,
    );

    expect(table).not.toContain("4 concessionária(s) sem correspondência");
    expect(table).not.toContain("Os registros de MTD Retail Order permanecem auditáveis");
  });

  it("exclui qualificação e dealers sem correspondência dos rankings de conversão", () => {
    const eligibilityMetrics = metricsWithDealers([
      dealerWithHistory,
      {
        sourceName: "Leads em qualificação",
        dealerName: "Leads em qualificação",
        matchStatus: "MATCHED",
        leads: 876,
        sales: 0,
        conversionRatePercent: 0,
        leadsPerSale: null,
        estimatedLeadsNeeded: null,
        weeks: { 5: { target: null, leads: 876, retail: 0, achievementPercent: null } },
      },
      {
        sourceName: "DEALER SEM MAPA",
        dealerName: "DEALER SEM MAPA",
        matchStatus: "UNMATCHED",
        leads: 0,
        sales: 3,
        conversionRatePercent: null,
        leadsPerSale: null,
        estimatedLeadsNeeded: null,
        weeks: { 5: { target: null, leads: null, retail: 3, achievementPercent: null } },
      },
    ]);

    const rows = buildDealerConversionRanking(eligibilityMetrics, 5);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ dealerName: "Baltic Shopping Tamboré", sales: 5, leads: 125, conversionRatePercent: 4 });

    const bottom = renderToStaticMarkup(<WeeklySalesBottomConversion metrics={eligibilityMetrics} selectedWeek={5} />);
    const top = renderToStaticMarkup(<WeeklySalesTopConversion metrics={eligibilityMetrics} selectedWeek={5} />);
    expect(bottom).toContain("Bottom 10 — Conversão");
    expect(top).toContain("Top 10 — Conversão");
    expect(bottom).toContain("Baltic Shopping Tamboré");
    expect(top).toContain("Baltic Shopping Tamboré");
    expect(bottom).not.toContain("Leads em qualificação");
    expect(top).not.toContain("Leads em qualificação");
    expect(bottom).not.toContain("DEALER SEM MAPA");
    expect(top).not.toContain("DEALER SEM MAPA");
  });

  it("recalcula a conversão por semana e ordena por conversão, vendas ou Leads", () => {
    const secondDealer = {
      sourceName: "TECAR BRASILIA",
      dealerName: "Tecar — SIA Brasília",
      matchStatus: "MATCHED",
      leads: 200,
      sales: 20,
      conversionRatePercent: 10,
      leadsPerSale: 10,
      estimatedLeadsNeeded: 10,
      weeks: {
        1: { target: 2, leads: 50, retail: 2, achievementPercent: 100 },
        2: { target: 6, leads: 90, retail: 6, achievementPercent: 100 },
        3: { target: 10, leads: 120, retail: 10, achievementPercent: 100 },
        4: { target: 15, leads: 160, retail: 15, achievementPercent: 100 },
        5: { target: 20, leads: 200, retail: 20, achievementPercent: 100 },
      },
    } as never;
    const rankingMetrics = metricsWithDealers([dealerWithHistory, secondDealer]);

    const week1 = buildDealerConversionRanking(rankingMetrics, 1);
    const week5 = buildDealerConversionRanking(rankingMetrics, 5);
    expect(week1.find(row => row.dealerName === "Baltic Shopping Tamboré")?.conversionRatePercent).toBe(5);
    expect(week5.find(row => row.dealerName === "Tecar — SIA Brasília")?.conversionRatePercent).toBe(10);
    expect(sortDealerConversionRanking(week5, "conversion", "desc").map(row => row.dealerName)).toEqual([
      "Tecar — SIA Brasília",
      "Baltic Shopping Tamboré",
    ]);
    expect(sortDealerConversionRanking(week5, "leads", "asc").map(row => row.dealerName)).toEqual([
      "Baltic Shopping Tamboré",
      "Tecar — SIA Brasília",
    ]);

    const top = renderToStaticMarkup(<WeeklySalesTopConversion metrics={rankingMetrics} selectedWeek={5} locale="en-US" />);
    const bottom = renderToStaticMarkup(<WeeklySalesBottomConversion metrics={rankingMetrics} selectedWeek={5} locale="en-US" />);
    expect(top).toContain("Top 10 — Conversion");
    expect(bottom).toContain("Bottom 10 — Conversion");
    expect(top.indexOf("Tecar — SIA Brasília")).toBeLessThan(top.indexOf("Baltic Shopping Tamboré"));
    expect(bottom.indexOf("Baltic Shopping Tamboré")).toBeLessThan(bottom.indexOf("Tecar — SIA Brasília"));
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
        referenceWeek: 5,
        dealersWithoutReferenceSales: 0,
        referenceDealerSalesTotal: 8,
        referenceRegionSalesTotal: 8,
        referenceReportedSalesTotal: 8,
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
          referenceRetail: 5,
          referenceAchievementPercent: 50,
          week4Retail: 4,
          week4AchievementPercent: 40,
        },
        {
          sourceRowNumber: 3,
          sourceName: "DEALER SEM MAPA",
          canonicalDealer: "DEALER SEM MAPA",
          matchStatus: "UNMATCHED",
          referenceRetail: 3,
          referenceAchievementPercent: 30,
          week4Retail: 3,
          week4AchievementPercent: 30,
        },
      ],
      unmatchedDealers: ["DEALER SEM MAPA"],
    } as never;

    const html = renderToStaticMarkup(<WeeklySalesPreviewSummary preview={preview} />);

    expect(html).toContain("Reconciliação da Semana 5 aprovada");
    expect(html).toContain("MTD Retail Order S5");
    expect(html).toContain("Sem correspondência na base de Leads");
    expect(html).toContain("DEALER SEM MAPA");
    expect(html).toContain("Baltic Shopping Tamboré");
  });
});
