import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildDashboardData,
  clearDashboardCache,
  getGoogleAdsRows,
  type GoogleAdsRow,
} from "./dashboardService";

const baseRow: GoogleAdsRow = {
  campaign: "MG4_PMax_SP",
  date: "2026-07-14",
  spend: 100,
  conversions: 10,
  clicks: 50,
  impressions: 500,
  ctr: 0.1,
  cpc: 2,
  budget_amount: 120,
  campaign_status: "ENABLED",
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
      { ...baseRow, campaign: "MG4_PMax_SP", spend: 100, conversions: 10 },
      { ...baseRow, campaign: "MGS5_PMax_SP", spend: 100, conversions: 5 },
      { ...baseRow, campaign: "MGCybester_PMax_SP", spend: 300, conversions: 3 },
    ];

    const result = buildDashboardData(
      rows,
      { source: "test", updatedAt: "2026-07-20T00:00:00.000Z", cacheHit: false },
      "2026-07-14",
      "2026-07-14",
    );

    const critical = result.campaigns.find(item => item.campaign === "MGCybester_PMax_SP");
    expect(critical?.status).toBe("Crítico");
    expect(result.insights.some(item => item.severity === "Crítico")).toBe(true);
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
