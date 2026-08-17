import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getDashboardDataSnapshot: vi.fn(),
  upsertDashboardDataSnapshot: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import {
  buildTikTokAdsData,
  clearTikTokAdsCache,
  loadTikTokAdsData,
  TIKTOK_ADS_ACCOUNT_ID,
  type TikTokQueryBundle,
} from "./tiktokAdsService";

function sampleBundle(): TikTokQueryBundle {
  return {
    daily: [
      {
        account_id: TIKTOK_ADS_ACCOUNT_ID,
        account_name: "MG TikTok",
        currency: "BRL",
        date: "2026-08-13",
        spend: 100,
        onsite_form: 10,
        conversions: 12,
        impressions: 1_000,
        reach: 900,
        clicks: 50,
        engagements: 100,
        comments: 2,
        shares: 3,
        average_video_play: 2,
      },
      {
        account_id: TIKTOK_ADS_ACCOUNT_ID,
        account_name: "MG TikTok",
        currency: "BRL",
        date: "2026-08-14",
        spend: 200,
        onsite_form: 20,
        conversions: 22,
        impressions: 2_000,
        reach: 1_500,
        clicks: 100,
        engagements: 200,
        comments: 1,
        shares: 4,
        average_video_play: 3,
      },
    ],
    campaignDaily: [
      {
        date: "2026-08-13",
        campaign_id: "campaign-1",
        campaign: "Cadastro MG4 Urban",
        spend: 100,
        onsite_form: 10,
        conversions: 12,
        impressions: 1_000,
        reach: 900,
        clicks: 50,
        engagements: 100,
      },
      {
        date: "2026-08-14",
        campaign_id: "campaign-1",
        campaign: "Cadastro MG4 Urban",
        spend: 200,
        onsite_form: 20,
        conversions: 22,
        impressions: 2_000,
        reach: 1_500,
        clicks: 100,
        engagements: 200,
      },
    ],
    adGroupDaily: [
      {
        date: "2026-08-13",
        campaign_id: "campaign-1",
        campaign: "Cadastro MG4 Urban",
        ad_group_id: "group-1",
        ad_group_name: "25+ Cidades",
        spend: 100,
        onsite_form: 10,
        conversions: 12,
        impressions: 1_000,
        reach: 900,
        clicks: 50,
        engagements: 100,
      },
      {
        date: "2026-08-14",
        campaign_id: "campaign-1",
        campaign: "Cadastro MG4 Urban",
        ad_group_id: "group-1",
        ad_group_name: "25+ Cidades",
        spend: 200,
        onsite_form: 20,
        conversions: 22,
        impressions: 2_000,
        reach: 1_500,
        clicks: 100,
        engagements: 200,
      },
    ],
    campaigns: [
      {
        campaign_id: "campaign-1",
        campaign: "Cadastro MG4 Urban",
        campaign_operation_status: "ENABLE",
        campaign_status: "CAMPAIGN_STATUS_ENABLE",
        spend: 300,
        onsite_form: 30,
        conversions: 34,
        impressions: 3_000,
        reach: 2_400,
        clicks: 150,
        engagements: 300,
      },
    ],
    adGroups: [
      {
        campaign_id: "campaign-1",
        campaign: "Cadastro MG4 Urban",
        ad_group_id: "group-1",
        ad_group_name: "25+ Cidades",
        ad_group_operation_status: "ENABLE",
        adgroup_status: "ADGROUP_STATUS_DELIVERY_OK",
        placement: "PLACEMENT_TYPE_NORMAL",
        bid_strategy: "Cost Cap",
        spend: 300,
        onsite_form: 30,
        conversions: 34,
        impressions: 3_000,
        reach: 2_400,
        clicks: 150,
        engagements: 300,
      },
    ],
    ads: [
      {
        campaign_id: "campaign-1",
        campaign: "Cadastro",
        ad_group_id: "group-1",
        ad_group_name: "25+ Cidades",
        ad_id: "ad-1",
        ad_name: "MG4 - Urban vídeo",
        ad_operation_status: "ENABLE",
        ad_status: "AD_STATUS_DELIVERY_OK",
        video_id: "video-1",
        video_thumbnail_url: "https://example.com/mg4-urban.jpg",
        video_url: "https://example.com/mg4-urban.mp4",
        spend: 300,
        onsite_form: 30,
        conversions: 34,
        impressions: 3_000,
        reach: 2_400,
        clicks: 150,
        engagements: 300,
        shares: 7,
        average_video_play: 2.67,
      },
    ],
    demographics: [
      {
        age: "AGE_35_44",
        gender: "MALE",
        spend: 180,
        conversions: 24,
        impressions: 1_800,
        reach: 1_400,
        clicks: 90,
      },
      {
        age: "AGE_45_54",
        gender: "FEMALE",
        spend: 120,
        conversions: 10,
        impressions: 1_200,
        reach: 1_000,
        clicks: 60,
      },
    ],
    regions: [
      {
        province_name: "Sao Paulo",
        spend: 180,
        conversions: 24,
        impressions: 1_800,
        reach: 1_400,
        clicks: 90,
      },
      {
        province_name: "Minas Gerais",
        spend: 120,
        conversions: 10,
        impressions: 1_200,
        reach: 1_000,
        clicks: 60,
      },
    ],
  };
}

describe("tiktokAdsService", () => {
  it("reconcilia KPIs diários e usa onsite_form como Lead canônico", () => {
    const data = buildTikTokAdsData(
      sampleBundle(),
      {
        source: "windsor-live",
        updatedAt: "2026-08-17T08:30:00.000Z",
        cacheHit: false,
      },
      "2026-08-13",
      "2026-08-14",
    );

    expect(data.summary).toMatchObject({
      spend: 300,
      leads: 30,
      conversions: 34,
      cpl: 10,
      impressions: 3_000,
      reach: 2_400,
      clicks: 150,
      ctr: 5,
      cpc: 2,
      cpm: 100,
      engagements: 300,
      engagementRate: 10,
      comments: 3,
      shares: 7,
      averageVideoPlay: 2.67,
    });
    expect(data.daily.reduce((sum, row) => sum + row.leads, 0)).toBe(30);
    expect(data.dailyBreakdown.campaigns).toHaveLength(2);
    expect(data.dailyBreakdown.adGroups).toHaveLength(2);
    expect(data.metadata.leadMetric).toBe("onsite_form");
    expect(data.metadata.dataThroughDate).toBe("2026-08-14");
  });

  it("preserva a separação entre formulários e conversões segmentadas", () => {
    const data = buildTikTokAdsData(
      sampleBundle(),
      {
        source: "windsor-live",
        updatedAt: "2026-08-17T08:30:00.000Z",
        cacheHit: false,
      },
      "2026-08-13",
      "2026-08-14",
    );

    expect(data.demographics.genders.reduce((sum, row) => sum + row.conversions, 0)).toBe(34);
    expect(data.regions.reduce((sum, row) => sum + row.conversions, 0)).toBe(34);
    expect(data.metadata.segmentedResultMetric).toBe("conversions");
    expect(data.metadata.demographicLeadsAvailable).toBe(false);
    expect(data.metadata.regionalLeadsAvailable).toBe(false);
  });

  it("classifica MG4 URBAN pelo anúncio e preserva URLs reais do vídeo", () => {
    const data = buildTikTokAdsData(
      sampleBundle(),
      {
        source: "windsor-live",
        updatedAt: "2026-08-17T08:30:00.000Z",
        cacheHit: false,
      },
      "2026-08-13",
      "2026-08-14",
    );

    expect(data.models[0]).toMatchObject({ model: "MG4 URBAN", ads: 1, leads: 30 });
    expect(data.ads[0]).toMatchObject({
      id: "ad-1",
      model: "MG4 URBAN",
      thumbnailUrl: "https://example.com/mg4-urban.jpg",
      videoUrl: "https://example.com/mg4-urban.mp4",
    });
  });
});

describe("cache persistente e validação TikTok Ads", () => {
  const cachedBundle = sampleBundle();
  const liveRow = {
    account_id: TIKTOK_ADS_ACCOUNT_ID,
    account_name: "MG TikTok",
    currency: "BRL",
    date: "2026-08-14",
    campaign_id: "campaign-1",
    campaign: "Cadastro MG4 Urban",
    ad_group_id: "group-1",
    ad_group_name: "25+ Cidades",
    ad_id: "ad-1",
    ad_name: "MG4 Urban",
    province_name: "Sao Paulo",
    age: "AGE_35_44",
    gender: "MALE",
    spend: 100,
    onsite_form: 10,
    conversions: 10,
    impressions: 1_000,
    reach: 800,
    clicks: 50,
    engagements: 100,
  };

  beforeEach(() => {
    clearTikTokAdsCache();
    dbMocks.getDashboardDataSnapshot.mockReset().mockResolvedValue(undefined);
    dbMocks.upsertDashboardDataSnapshot.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [liveRow] }),
      } as Response),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("responde pelo snapshot persistente após cold start", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      dataThroughDate: "2026-08-14",
      refreshedAt: Date.parse("2026-08-15T08:30:00.000Z"),
      payload: {
        bundle: cachedBundle,
        updatedAt: "2026-08-15T08:30:00.000Z",
      },
    });

    const result = await loadTikTokAdsData("2026-08-13", "2026-08-14");

    expect(result.metadata.source).toBe("persistent-snapshot");
    expect(result.metadata.cacheHit).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("consolida três solicitações simultâneas nas mesmas oito consultas", async () => {
    const [first, second, third] = await Promise.all([
      loadTikTokAdsData("2026-08-14", "2026-08-14"),
      loadTikTokAdsData("2026-08-14", "2026-08-14"),
      loadTikTokAdsData("2026-08-14", "2026-08-14"),
    ]);

    expect(fetch).toHaveBeenCalledTimes(8);
    expect(first.metadata.source).toBe("windsor-live");
    expect(second.metadata.cacheHit).toBe(true);
    expect(third.metadata.cacheHit).toBe(true);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
  });

  it("filtra todas as consultas pelo account_id estável", async () => {
    await loadTikTokAdsData("2026-08-14", "2026-08-14", { forceRefresh: true });

    for (const call of vi.mocked(fetch).mock.calls) {
      const request = new URL(String(call[0]));
      expect(request.pathname).toBe("/tiktok");
      expect(request.searchParams.get("filter")).toContain(TIKTOK_ADS_ACCOUNT_ID);
    }
  });

  it("rejeita bundle parcial e não persiste resultado incompleto", async () => {
    vi.mocked(fetch).mockImplementation(async input => {
      const request = new URL(String(input));
      const fields = request.searchParams.get("fields") ?? "";
      return {
        ok: true,
        json: async () => ({ data: fields.includes("ad_group_id") ? [] : [liveRow] }),
      } as Response;
    });

    await expect(
      loadTikTokAdsData("2026-08-14", "2026-08-14", { forceRefresh: true }),
    ).rejects.toThrow("dados TikTok Ads completos");
    expect(dbMocks.upsertDashboardDataSnapshot).not.toHaveBeenCalled();
  });

  it("ignora snapshot existente quando o refresh é forçado e persiste a leitura ao vivo", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      dataThroughDate: "2026-08-14",
      refreshedAt: Date.parse("2026-08-15T08:30:00.000Z"),
      payload: {
        bundle: cachedBundle,
        updatedAt: "2026-08-15T08:30:00.000Z",
      },
    });

    const result = await loadTikTokAdsData("2026-08-14", "2026-08-14", {
      forceRefresh: true,
    });

    expect(result.metadata.source).toBe("windsor-live");
    expect(fetch).toHaveBeenCalledTimes(8);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
  });
});
