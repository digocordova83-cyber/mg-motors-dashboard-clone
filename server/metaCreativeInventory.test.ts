import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getDashboardDataSnapshot: vi.fn(),
  upsertDashboardDataSnapshot: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import {
  buildMetaCreativeInventory,
  clearMetaCreativeInventoryCache,
  loadMetaCreativeInventory,
} from "./metaCreativeInventory";

const UPDATED_AT = "2026-07-24T14:30:00.000Z";

function baseRow(overrides: Record<string, unknown> = {}) {
  return {
    account_id: "1418731006678061",
    account_name: "MG Motors",
    campaign_id: "campaign-1",
    campaign: "Campanha MG",
    campaign_effective_status: "PAUSED",
    campaign_status: "PAUSED",
    adset_id: "adset-1",
    adset_name: "Conjunto MG",
    adset_effective_status: "CAMPAIGN_PAUSED",
    adset_status: "ACTIVE",
    ad_id: "ad-1",
    ad_name: "MG4 Imagem",
    effective_status: "CAMPAIGN_PAUSED",
    creative_id: "creative-1",
    effective_instagram_media__media_type: "IMAGE",
    effective_instagram_media__media_url: "https://media.example/mg4.jpg",
    effective_instagram_media__permalink: "https://instagram.com/p/mg4",
    ...overrides,
  };
}

function build(rows: Array<Record<string, unknown>>, stories: Array<Record<string, unknown>> = []) {
  return buildMetaCreativeInventory(rows, stories, {
    source: "windsor-live",
    updatedAt: UPDATED_AT,
    cacheHit: false,
    stale: false,
    storyDetailsAvailable: true,
    dateFrom: "2026-06-23",
    dateTo: "2026-07-23",
  });
}

describe("inventário completo de criativos Meta", () => {
  it("deduplica por anúncio, preserva formatos e classifica a cadeia operacional completa", () => {
    const result = build(
      [
        baseRow(),
        baseRow({ thumbnail_url: "https://media.example/mg4-thumb.jpg" }),
        baseRow({
          campaign_id: "campaign-2",
          campaign: "Campanha Vídeo",
          campaign_effective_status: "ACTIVE",
          campaign_status: "ACTIVE",
          adset_id: "adset-2",
          adset_name: "Conjunto Vídeo",
          adset_effective_status: "ACTIVE",
          ad_id: "ad-2",
          ad_name: "MG5 Vídeo",
          effective_status: "PAUSED",
          creative_id: "creative-2",
          effective_instagram_media__media_type: "VIDEO",
          effective_instagram_media__media_url: "https://media.example/mg5.mp4",
          effective_instagram_media__thumbnail_url: "https://media.example/mg5.jpg",
          instream_video_desktop_preview_url: "https://facebook.example/video-preview",
        }),
        baseRow({
          campaign_id: "campaign-3",
          campaign: "Campanha Carrossel",
          campaign_effective_status: "ACTIVE",
          campaign_status: "ACTIVE",
          adset_id: "adset-3",
          adset_name: "Conjunto Carrossel",
          adset_effective_status: "PAUSED",
          adset_status: "PAUSED",
          ad_id: "ad-3",
          ad_name: "Cyberster Carrossel",
          effective_status: "ADSET_PAUSED",
          creative_id: "creative-3",
          effective_instagram_media__media_type: "CAROUSEL_ALBUM",
          effective_instagram_media__media_url: "https://media.example/carousel-cover.jpg",
        }),
        baseRow({
          campaign_id: "campaign-4",
          campaign: "Campanha Ativa",
          campaign_effective_status: "ACTIVE",
          campaign_status: "ACTIVE",
          adset_id: "adset-4",
          adset_name: "Conjunto Ativo",
          adset_effective_status: "ACTIVE",
          adset_status: "ACTIVE",
          ad_id: "ad-4",
          ad_name: "MG4 Ativo",
          effective_status: "ACTIVE",
          creative_id: "creative-4",
          effective_instagram_media__media_type: "IMAGE",
          effective_instagram_media__media_url: "https://media.example/active.jpg",
        }),
      ],
      [
        {
          ad_id: "ad-3",
          creative_id: "creative-3",
          object_story_spec: JSON.stringify({
            link_data: {
              child_attachments: [
                { name: "Frente", link: "https://mg.example/frente", picture: "https://media.example/front.jpg" },
                { name: "Interior", link: "https://mg.example/interior", image_hash: "hash-interior" },
              ],
            },
          }),
        },
      ],
    );

    expect(result.coverage).toMatchObject({
      totalRows: 5,
      totalAds: 4,
      uniqueCreatives: 4,
      activeAds: 1,
      inactiveAds: 3,
      withPreview: 4,
      withoutPreview: 0,
      formats: { IMAGE: 2, VIDEO: 1, CAROUSEL: 1, UNKNOWN: 0 },
      carouselCards: 2,
      carouselCardsWithPreview: 1,
      truncated: false,
    });
    expect(result.creatives[0]).toMatchObject({
      adId: "ad-4",
      operationalStatus: "ACTIVE",
      operationalLabel: "Ativo",
      isActive: true,
    });
    expect(result.creatives.find(item => item.adId === "ad-1")).toMatchObject({
      operationalStatus: "CAMPAIGN_PAUSED",
      operationalLabel: "Campanha pausada",
      previewUrl: "https://media.example/mg4.jpg",
    });
    expect(result.creatives.find(item => item.adId === "ad-2")).toMatchObject({
      operationalStatus: "AD_PAUSED",
      operationalLabel: "Anúncio pausado",
      format: "VIDEO",
      mediaUrl: "https://media.example/mg5.mp4",
    });
    expect(result.creatives.find(item => item.adId === "ad-3")).toMatchObject({
      operationalStatus: "ADSET_PAUSED",
      operationalLabel: "Conjunto pausado",
      format: "CAROUSEL",
      carouselCardCount: 2,
      carouselCardsWithPreview: 1,
      carouselMediaComplete: false,
    });
    expect(result.warnings).toContain(
      "1 cartão(ões) de carrossel possuem identificação, mas não URL individual na fonte.",
    );
  });

  it("declara explicitamente quando todos os anúncios acessíveis estão desativados", () => {
    const result = build([
      baseRow(),
      baseRow({ ad_id: "ad-2", creative_id: "creative-2", ad_name: "MG5 Pausado" }),
    ]);

    expect(result.coverage).toMatchObject({ totalAds: 2, activeAds: 0, inactiveAds: 2 });
    expect(result.creatives.every(item => item.isActive === false)).toBe(true);
    expect(result.warnings).toContain("Todos os criativos retornados estão desativados no momento.");
  });

  it("não fabrica prévia nem formato quando a fonte não fornece mídia", () => {
    const result = build([
      baseRow({
        effective_instagram_media__media_type: null,
        effective_instagram_media__media_url: null,
        effective_instagram_media__permalink: null,
      }),
    ]);

    expect(result.creatives[0]).toMatchObject({
      format: "UNKNOWN",
      mediaType: null,
      previewUrl: null,
      mediaUrl: null,
    });
    expect(result.coverage).toMatchObject({ withPreview: 0, withoutPreview: 1 });
    expect(result.warnings).toContain("1 anúncio(s) não possuem URL de prévia na fonte.");
  });
});

describe("carregamento e cache do inventário Meta", () => {
  beforeEach(() => {
    clearMetaCreativeInventoryCache();
    dbMocks.getDashboardDataSnapshot.mockReset().mockResolvedValue(undefined);
    dbMocks.upsertDashboardDataSnapshot.mockReset().mockResolvedValue(undefined);
    process.env.WINDSOR_API_KEY = "test-key";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("usa snapshot persistente recente sem consultar a fonte externa", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      refreshedAt: Date.now(),
      payload: {
        capturedAt: UPDATED_AT,
        inventoryRows: [baseRow()],
        storyRows: [],
        storyDetailsAvailable: true,
      },
    });
    vi.stubGlobal("fetch", vi.fn());

    const result = await loadMetaCreativeInventory();

    expect(result.coverage.totalAds).toBe(1);
    expect(result.metadata).toMatchObject({
      source: "persistent-snapshot",
      cacheHit: true,
      stale: false,
      includeObjectsWithoutInsights: true,
      maxRows: 100_000,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("consolida solicitações simultâneas em duas consultas completas e persiste um snapshot", async () => {
    const fetchMock = vi.fn().mockImplementation(async (input: string | URL | Request) => {
      const url = new URL(String(input));
      const fields = url.searchParams.get("fields") ?? "";
      expect(url.searchParams.get("_max_rows")).toBe("100000");
      expect(url.searchParams.get("include_objects_without_insights")).toBe("true");
      expect(url.searchParams.get("filter")).toContain("1418731006678061");
      return {
        ok: true,
        json: async () => ({
          data: fields.includes("object_story_spec") ? [] : [baseRow()],
        }),
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);

    const [first, second, third] = await Promise.all([
      loadMetaCreativeInventory(),
      loadMetaCreativeInventory(),
      loadMetaCreativeInventory(),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(first.coverage.totalAds).toBe(1);
    expect(first.metadata.source).toBe("windsor-live");
    expect(second.metadata.cacheHit).toBe(true);
    expect(third.metadata.cacheHit).toBe(true);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledTimes(1);
    expect(dbMocks.upsertDashboardDataSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "META_ADS",
        periodFrom: "1900-01-01",
        periodTo: "1900-01-01",
        sourceName: "windsor-live-creative-inventory",
      }),
    );
  });

  it("recorre ao snapshot anterior e sinaliza dado stale quando a fonte ao vivo falha", async () => {
    dbMocks.getDashboardDataSnapshot.mockResolvedValue({
      refreshedAt: Date.now() - 60 * 60 * 1000,
      payload: {
        capturedAt: UPDATED_AT,
        inventoryRows: [baseRow()],
        storyRows: [],
        storyDetailsAvailable: true,
      },
    });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));

    const result = await loadMetaCreativeInventory();

    expect(result.metadata).toMatchObject({
      source: "persistent-snapshot",
      cacheHit: true,
      stale: true,
    });
    expect(result.coverage.totalAds).toBe(1);
  });
});
