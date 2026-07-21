import { describe, expect, it } from "vitest";
import { buildMetaAdsData } from "./metaAdsService";

describe("metaAdsService", () => {
  it("agrega KPIs diários sem duplicar campanhas e preserva a limitação regional", () => {
    const data = buildMetaAdsData(
      {
        daily: [
          {
            account_name: "MG Meta",
            account_currency: "BRL",
            account_timezone: "America/Sao_Paulo",
            date: "2026-07-01",
            spend: 100,
            actions_lead: 10,
            impressions: 1_000,
            clicks: 50,
          },
          {
            account_name: "MG Meta",
            date: "2026-07-02",
            spend: 200,
            actions_lead: 20,
            impressions: 2_000,
            clicks: 100,
          },
        ],
        campaigns: [
          {
            campaign_id: "campaign-1",
            campaign: "Institucional",
            campaign_effective_status: "ACTIVE",
            spend: 300,
            actions_lead: 30,
            impressions: 3_000,
            reach: 2_400,
            clicks: 150,
          },
        ],
        adsets: [
          {
            campaign_id: "campaign-1",
            campaign: "Institucional",
            adset_id: "adset-1",
            adset_name: "MG4 Prospecting",
            adset_effective_status: "ACTIVE",
            adset_targeting: JSON.stringify({
              age_min: 25,
              age_max: 65,
              custom_audiences: [{ name: "Engajados" }],
              publisher_platforms: ["facebook", "instagram"],
            }),
            spend: 300,
            actions_lead: 30,
            impressions: 3_000,
            reach: 2_400,
            clicks: 150,
          },
        ],
        creatives: [
          {
            campaign_id: "campaign-1",
            campaign: "Institucional",
            adset_id: "adset-1",
            adset_name: "Prospecting",
            ad_id: "ad-1",
            ad_name: "MG4 Lançamento",
            creative_id: "creative-1",
            promoted_post_full_picture: "https://example.com/mg4.jpg",
            spend: 300,
            actions_lead: 30,
            impressions: 3_000,
            reach: 2_400,
            clicks: 150,
          },
        ],
        demographics: [
          {
            age: "25-34",
            gender: "female",
            spend: 180,
            actions_lead: 20,
            impressions: 1_800,
            clicks: 90,
          },
          {
            age: "35-44",
            gender: "male",
            spend: 120,
            actions_lead: 10,
            impressions: 1_200,
            clicks: 60,
          },
        ],
        regions: [
          {
            region: "São Paulo",
            spend: 150,
            impressions: 1_500,
            reach: 1_200,
            clicks: 75,
          },
        ],
      },
      { source: "windsor-live", updatedAt: "2026-07-21T10:00:00.000Z", cacheHit: false },
      "2026-07-01",
      "2026-07-02",
    );

    expect(data.summary).toMatchObject({
      spend: 300,
      leads: 30,
      cpl: 10,
      impressions: 3_000,
      reach: 2_400,
      clicks: 150,
      ctr: 5,
    });
    expect(data.models[0]).toMatchObject({ model: "MG4", spend: 300, leads: 30, cpl: 10 });
    expect(data.creatives[0].imageUrl).toBe("https://example.com/mg4.jpg");
    expect(data.audiences[0].targetingSummary).toContain("Idade 25–65");
    expect(data.audienceCatalog.customAudiences).toEqual(["Engajados"]);
    expect(data.regions[0]).toMatchObject({ region: "São Paulo", leads: null, cpl: null });
    expect(data.metadata.regionalLeadsAvailable).toBe(false);
    expect(data.metadata.dataThroughDate).toBe("2026-07-02");
  });

  it("consolida os modelos exclusivamente pela dimensão de criativo", () => {
    const base = {
      daily: [{ date: "2026-07-01", spend: 90, actions_lead: 9 }],
      campaigns: [{ campaign_id: "1", campaign: "MG", spend: 90, actions_lead: 9, reach: 100 }],
      adsets: [],
      creatives: [
        { ad_id: "1", ad_name: "MG5 Performance", spend: 40, actions_lead: 4 },
        { ad_id: "2", ad_name: "Cyberster Awareness", spend: 30, actions_lead: 3 },
        { ad_id: "3", ad_name: "Brand", adset_name: "MG 4 Retargeting", spend: 20, actions_lead: 2 },
      ],
      demographics: [],
      regions: [],
    };

    const data = buildMetaAdsData(
      base,
      { source: "validated-snapshot", updatedAt: "2026-07-21T10:00:00.000Z", cacheHit: false },
      "2026-07-01",
      "2026-07-01",
    );

    expect(data.models.map(item => item.model)).toEqual(["MG5", "Cyberster", "MG4"]);
    expect(data.models.reduce((sum, item) => sum + item.leads, 0)).toBe(9);
  });
});
