import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getDashboardDataSnapshot: vi.fn(),
  upsertDashboardDataSnapshot: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import {
  buildMetaAdsData,
  clearMetaAdsCache,
  loadMetaAdsData,
} from "./metaAdsService";

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

type MetaBundle = Parameters<typeof buildMetaAdsData>[0];
type CreativeRow = Record<string, unknown>;

function makeCreativeBundle(creatives: CreativeRow[]): MetaBundle {
  return {
    daily: [
      {
        account_name: "MG Motors",
        account_currency: "BRL",
        account_timezone: "America/Sao_Paulo",
        date: "2026-07-20",
        spend: 100,
        actions_lead: 10,
        impressions: 1_000,
        clicks: 100,
      },
    ],
    campaigns: [
      {
        campaign_id: "campaign-1",
        campaign: "Campanha MG",
        reach: 800,
        spend: 100,
        actions_lead: 10,
      },
    ],
    adsets: [],
    creatives,
    demographics: [],
    regions: [],
  };
}

function buildCreativeResult(creatives: CreativeRow[]) {
  return buildMetaAdsData(
    makeCreativeBundle(creatives),
    {
      source: "windsor-live",
      updatedAt: "2026-07-21T11:30:00.000Z",
      cacheHit: false,
    },
    "2026-07-20",
    "2026-07-20",
  );
}

describe("associação de imagens aos criativos Meta Ads", () => {
  it("rejeita o mesmo asset canônico reutilizado por creative_ids diferentes e preserva os IDs reais", () => {
    const result = buildCreativeResult([
      {
        ad_id: "ad-cyberster",
        creative_id: "creative-cyberster",
        ad_name: "Cyberster Cold",
        thumbnail_url: "https://scontent-a.example/v/t45.1600-4/generic.png?token=one",
        spend: 40,
        actions_lead: 4,
      },
      {
        ad_id: "ad-mg4",
        creative_id: "creative-mg4",
        ad_name: "MG 4 Hot",
        thumbnail_url: "https://scontent-b.example/v/t45.1600-4/generic.png?token=two",
        spend: 30,
        actions_lead: 3,
      },
    ]);

    expect(result.creatives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "ad-cyberster",
          adId: "ad-cyberster",
          creativeId: "creative-cyberster",
          name: "Cyberster Cold",
          imageUrl: null,
          imageSource: null,
        }),
        expect.objectContaining({
          id: "ad-mg4",
          adId: "ad-mg4",
          creativeId: "creative-mg4",
          name: "MG 4 Hot",
          imageUrl: null,
          imageSource: null,
        }),
      ]),
    );
  });

  it("prioriza uma mídia específica do anúncio sobre um thumbnail genérico não confiável", () => {
    const result = buildCreativeResult([
      {
        ad_id: "ad-unique",
        creative_id: "creative-unique",
        ad_name: "MG5 Placement",
        placement_ad_thumbnail_url: "https://media.example/placements/mg5-vertical.jpg?expires=1",
        thumbnail_url: "https://scontent.example/v/t45.1600-4/generic.png?token=one",
        spend: 50,
        actions_lead: 5,
      },
      {
        ad_id: "ad-other",
        creative_id: "creative-other",
        ad_name: "Cyberster Other",
        thumbnail_url: "https://cdn.example/v/t45.1600-4/generic.png?token=two",
        spend: 20,
        actions_lead: 2,
      },
    ]);

    expect(result.creatives.find(item => item.adId === "ad-unique")).toMatchObject({
      imageUrl: "https://media.example/placements/mg5-vertical.jpg?expires=1",
      imageSource: "placement_ad_thumbnail_url",
    });
  });

  it("permite o mesmo asset quando ele pertence ao mesmo creative_id", () => {
    const result = buildCreativeResult([
      {
        ad_id: "ad-a",
        creative_id: "creative-shared",
        ad_name: "MG4 Creative — A",
        thumbnail_url: "https://scontent-a.example/assets/mg4.jpg?token=one",
        spend: 20,
        actions_lead: 2,
      },
      {
        ad_id: "ad-b",
        creative_id: "creative-shared",
        ad_name: "MG4 Creative — B",
        thumbnail_url: "https://scontent-b.example/assets/mg4.jpg?token=two",
        spend: 10,
        actions_lead: 1,
      },
    ]);

    expect(result.creatives).toHaveLength(2);
    expect(result.creatives.every(item => item.imageUrl?.includes("/assets/mg4.jpg"))).toBe(true);
    expect(result.creatives.every(item => item.imageSource === "thumbnail_url")).toBe(true);
  });
});


describe("cache persistente e concorrência Meta Ads", () => {
  const cachedBundle = makeCreativeBundle([]);
  const liveRow = {
    account_name: "MG Motors",
    account_currency: "BRL",
    account_timezone: "America/Sao_Paulo",
    date: "2026-07-20",
    spend: 100,
    actions_lead: 10,
    impressions: 1_000,
    clicks: 100,
  };

  beforeEach(() => {
    clearMetaAdsCache();
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

  it("responde pelo snapshot persistente após cold start sem consultar a fonte externa", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      dataThroughDate: "2026-07-20",
      refreshedAt: Date.parse("2026-07-21T08:30:00.000Z"),
      payload: {
        bundle: cachedBundle,
        updatedAt: "2026-07-21T08:30:00.000Z",
      },
    });

    const result = await loadMetaAdsData("2026-07-20", "2026-07-20");

    expect(result.metadata.source).toBe("persistent-snapshot");
    expect(result.metadata.cacheHit).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("consolida três solicitações simultâneas nas mesmas seis consultas Windsor", async () => {
    const [first, second, third] = await Promise.all([
      loadMetaAdsData("2026-07-20", "2026-07-20"),
      loadMetaAdsData("2026-07-20", "2026-07-20"),
      loadMetaAdsData("2026-07-20", "2026-07-20"),
    ]);

    expect(fetch).toHaveBeenCalledTimes(6);
    expect(first.metadata.source).toBe("windsor-live");
    expect(second.metadata.cacheHit).toBe(true);
    expect(third.metadata.cacheHit).toBe(true);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
  });

  it("ignora o snapshot existente quando o job diário solicita refresh forçado", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      dataThroughDate: "2026-07-20",
      refreshedAt: Date.parse("2026-07-21T08:30:00.000Z"),
      payload: {
        bundle: cachedBundle,
        updatedAt: "2026-07-21T08:30:00.000Z",
      },
    });

    const result = await loadMetaAdsData("2026-07-20", "2026-07-20", {
      forceRefresh: true,
    });

    expect(result.metadata.source).toBe("windsor-live");
    expect(fetch).toHaveBeenCalledTimes(6);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
  });
});
