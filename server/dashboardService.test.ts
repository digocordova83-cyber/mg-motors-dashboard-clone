import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getCampaignGoals: vi.fn(),
  getDashboardDataSnapshot: vi.fn(),
  upsertDashboardDataSnapshot: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import {
  buildDashboardData,
  clearDashboardCache,
  filterActiveGoogleAdsRows,
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
  account_id: "535-798-6801",
  account_name: "MG Motors",
  datasource: "google_ads",
};

describe("buildDashboardData", () => {
  it("mantém o histórico completo e separa campanhas cujo status mais recente é ENABLED", () => {
    const rows: GoogleAdsRow[] = [
      { ...baseRow, campaign_id: "active", campaign: "BBRO>MG4_PMax_SP", date: "2026-08-01" },
      { ...baseRow, campaign_id: "active", campaign: "BBRO>MG4_PMax_SP", date: "2026-08-02", spend: 200 },
      { ...baseRow, campaign_id: "removed", campaign: "MG4_PMax_SP", date: "2026-08-01", spend: 300 },
      { ...baseRow, campaign_id: "removed", campaign: "MG4_PMax_SP", date: "2026-08-02", spend: 400, campaign_status: "REMOVED" },
    ];

    const filtered = filterActiveGoogleAdsRows(rows);
    const result = buildDashboardData(
      rows,
      { source: "test", updatedAt: "2026-08-03T00:00:00.000Z", cacheHit: false },
      "2026-08-01",
      "2026-08-02",
    );

    expect(filtered).toHaveLength(2);
    expect(new Set(filtered.map(row => row.campaign_id))).toEqual(new Set(["active"]));
    expect(result.summary.investment).toBe(1_000);
    expect(result.daily.reduce((sum, day) => sum + day.spend, 0)).toBe(1_000);
    expect(result.campaigns).toHaveLength(2);
    expect(result.campaigns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ campaignId: "active", googleStatus: "ENABLED" }),
        expect.objectContaining({ campaignId: "removed", googleStatus: "REMOVED" }),
      ]),
    );
    expect(result.activeCampaigns).toHaveLength(1);
    expect(result.activeCampaigns[0]).toMatchObject({ campaignId: "active", googleStatus: "ENABLED" });
    expect(result.metadata.campaignCount).toBe(2);
    expect(result.metadata.activeCampaignCount).toBe(1);
    expect(result.metadata.rowCount).toBe(4);
    expect(result.metadata.activeRowCount).toBe(2);
  });

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
    expect(result.metadata.lastClosedDate).toBe("2026-07-15");
  });

  it("expõe a última data realmente carregada quando o período solicitado é maior", () => {
    const result = buildDashboardData(
      [{ ...baseRow, date: "2026-07-14" }],
      { source: "test", updatedAt: "2026-07-20T00:00:00.000Z", cacheHit: false },
      "2026-07-14",
      "2026-07-19",
    );

    expect(result.metadata.lastClosedDate).toBe("2026-07-14");
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
    dbMocks.getCampaignGoals.mockReset().mockResolvedValue([]);
    dbMocks.getDashboardDataSnapshot.mockReset().mockResolvedValue(undefined);
    dbMocks.upsertDashboardDataSnapshot.mockReset().mockResolvedValue(undefined);
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

  it("responde pelo snapshot persistente após cold start sem chamar a fonte externa", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      dataThroughDate: "2026-07-14",
      refreshedAt: Date.parse("2026-07-15T08:30:00.000Z"),
      payload: {
        rows: [baseRow],
        updatedAt: "2026-07-15T08:30:00.000Z",
      },
    });

    const result = await getGoogleAdsRows("2026-07-14", "2026-07-14");

    expect(result.source).toBe("persistent-snapshot");
    expect(result.cacheHit).toBe(true);
    expect(result.rows).toEqual([expect.objectContaining(baseRow)]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("consolida três solicitações simultâneas em uma única chamada Windsor", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [baseRow] }),
    } as Response);

    const [first, second, third] = await Promise.all([
      getGoogleAdsRows("2026-07-14", "2026-07-14"),
      getGoogleAdsRows("2026-07-14", "2026-07-14"),
      getGoogleAdsRows("2026-07-14", "2026-07-14"),
    ]);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(first.source).toBe("windsor-live");
    expect(second.cacheHit).toBe(true);
    expect(third.cacheHit).toBe(true);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
  });

  it("ignora snapshots existentes quando o job solicita refresh forçado", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      dataThroughDate: "2026-07-14",
      refreshedAt: Date.parse("2026-07-15T08:30:00.000Z"),
      payload: { rows: [baseRow], updatedAt: "2026-07-15T08:30:00.000Z" },
    });
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [baseRow] }),
    } as Response);

    const result = await getGoogleAdsRows("2026-07-14", "2026-07-14", {
      forceRefresh: true,
    });

    expect(result.source).toBe("windsor-live");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
  });

  it("identifica a conta pelo account_id e aceita a mudança do nome descritivo", async () => {
    const renamedAccountRow = {
      ...baseRow,
      date: "2026-08-15",
      account_name: "MG Motor",
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [renamedAccountRow] }),
    } as Response);

    const result = await getGoogleAdsRows("2026-08-15", "2026-08-15", {
      forceRefresh: true,
    });

    expect(result.source).toBe("windsor-live");
    expect(result.rows).toEqual([expect.objectContaining(renamedAccountRow)]);
    const requestUrl = new URL(String(vi.mocked(fetch).mock.calls[0]?.[0]));
    expect(JSON.parse(requestUrl.searchParams.get("filter") ?? "null")).toEqual([
      ["account_id", "eq", "535-798-6801"],
    ]);
    expect(requestUrl.searchParams.get("fields")).toContain("account_id");
  });

  it("rejeita resposta ao vivo parcial e não substitui o snapshot completo", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ ...baseRow, date: "2026-07-17" }] }),
    } as Response);

    const result = await getGoogleAdsRows("2026-07-17", "2026-07-19", {
      forceRefresh: true,
    });

    expect(result.source).toBe("windsor-snapshot");
    expect(result.rows.length).toBeGreaterThan(0);
    expect(dbMocks.upsertDashboardDataSnapshot).not.toHaveBeenCalled();
  });

  it("carrega 30 dias em cinco blocos semanais e persiste somente o conjunto completo", async () => {
    vi.mocked(fetch).mockImplementation(async input => {
      const requestUrl = new URL(String(input));
      const chunkDateTo = requestUrl.searchParams.get("date_to") ?? "";
      return {
        ok: true,
        json: async () => ({
          data: [
            {
              ...baseRow,
              date: chunkDateTo,
              account_name: "MG Motor",
            },
          ],
        }),
      } as Response;
    });

    const result = await getGoogleAdsRows("2026-07-17", "2026-08-15", {
      forceRefresh: true,
    });

    expect(fetch).toHaveBeenCalledTimes(5);
    expect(result.source).toBe("windsor-live");
    expect(result.rows).toHaveLength(5);
    expect(result.rows.map(row => row.date)).toEqual([
      "2026-07-23",
      "2026-07-30",
      "2026-08-06",
      "2026-08-13",
      "2026-08-15",
    ]);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "GOOGLE_ADS",
        periodFrom: "2026-07-17",
        periodTo: "2026-08-15",
      }),
    );
  });
});
