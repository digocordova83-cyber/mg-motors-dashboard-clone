import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildDashboardData,
  clearDashboardCache,
  getGoogleAdsRows,
  type GoogleAdsRow,
} from "./dashboardService";

const baseRow: GoogleAdsRow = {
  campaign: "MG4_PMax_SP",
  campaign_id: "1001",
  date: "2026-07-14",
  spend: 100,
  conversions: 10,
  clicks: 50,
  impressions: 500,
  ctr: 0.1,
  cpc: 2,
  budget_amount: 120,
  campaign_status: "ENABLED",
  bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
  optimization_score: 0.82,
  search_impression_share: 0.34,
  account_name: "MG Motors",
  datasource: "google_ads",
};

describe("buildDashboardData", () => {
  it("calcula métricas ponderadas sem somar CTR ou CPC de linhas", () => {
    const rows: GoogleAdsRow[] = [
      baseRow,
      {
        ...baseRow,
        campaign: "MGS5_PMax_RJ",
        campaign_id: "1002",
        date: "2026-07-15",
        spend: 300,
        conversions: 10,
        clicks: 50,
        impressions: 1_500,
        ctr: 0.0333,
        cpc: 6,
      },
    ];

    const result = buildDashboardData(
      rows,
      { source: "test", updatedAt: "2026-07-20T00:00:00.000Z", cacheHit: false },
      "2026-07-14",
      "2026-07-15",
    );

    expect(result.summary.investment).toBe(400);
    expect(result.summary.conversions).toBe(20);
    expect(result.summary.cpa).toBe(20);
    expect(result.summary.ctr).toBe(5);
    expect(result.summary.cpc).toBe(4);
    expect(result.daily).toHaveLength(2);
  });

  it("classifica CPA a partir da média geral, usando 2x para crítico", () => {
    const rows: GoogleAdsRow[] = [
      { ...baseRow, campaign: "MG4_PMax_SP", campaign_id: "1001", spend: 100, conversions: 10 },
      { ...baseRow, campaign: "MGS5_PMax_SP", campaign_id: "1002", spend: 100, conversions: 5 },
      {
        ...baseRow,
        campaign: "MGCybester_PMax_SP",
        campaign_id: "1003",
        spend: 300,
        conversions: 3,
      },
    ];

    const result = buildDashboardData(
      rows,
      { source: "test", updatedAt: "2026-07-20T00:00:00.000Z", cacheHit: false },
      "2026-07-14",
      "2026-07-14",
    );

    const critical = result.campaigns.find(item => item.campaign === "MGCybester_PMax_SP");
    expect(critical?.campaignId).toBe("1003");
    expect(critical?.status).toBe("Crítico");
    expect(critical?.optimizationScore).toBe(82);
    expect(critical?.searchImpressionShare).toBe(34);
    expect(result.insights.some(item => item.campaignId === "1003" && item.severity === "Crítico")).toBe(
      true,
    );
  });
});

describe("cache Windsor.ai", () => {
  beforeEach(() => {
    clearDashboardCache();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("indisponível")));
  });

  afterEach(() => vi.unstubAllGlobals());

  it("usa o snapshot real como fallback e atende a segunda leitura pelo cache", async () => {
    const first = await getGoogleAdsRows("2026-07-13", "2026-07-19");
    const second = await getGoogleAdsRows("2026-07-13", "2026-07-19");

    expect(first.source).toBe("windsor-snapshot");
    expect(first.rows.length).toBeGreaterThan(0);
    expect(first.cacheHit).toBe(false);
    expect(second.cacheHit).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
