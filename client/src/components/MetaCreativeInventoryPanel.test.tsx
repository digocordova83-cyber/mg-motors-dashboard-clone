import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useQueryMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/trpc", () => ({
  trpc: {
    metaAds: {
      creativeInventory: {
        useQuery: useQueryMock,
      },
    },
  },
}));

import { MetaCreativeInventoryPanel } from "./MetaCreativeInventoryPanel";

function inventoryData(overrides: Record<string, unknown> = {}) {
  return {
    metadata: {
      source: "windsor-live",
      updatedAt: "2026-07-24T14:30:00.000Z",
      cacheHit: false,
      stale: false,
      accountId: "1418731006678061",
      accountName: "MG Motors",
      maxRows: 100_000,
      includeObjectsWithoutInsights: true,
      inventoryDateFrom: "2026-06-23",
      inventoryDateTo: "2026-07-23",
      storyDetailsAvailable: true,
    },
    coverage: {
      totalRows: 40,
      totalAds: 40,
      uniqueCreatives: 40,
      activeAds: 0,
      inactiveAds: 40,
      withPreview: 40,
      withoutPreview: 0,
      formats: { IMAGE: 30, VIDEO: 7, CAROUSEL: 3, UNKNOWN: 0 },
      carouselCards: 12,
      carouselCardsWithPreview: 9,
      storyDetailsAvailable: true,
      duplicateRowsRemoved: 0,
      truncated: false,
      scope: "A fonte retornou 40 linhas, consolidadas em 40 anúncios únicos, inclusive objetos sem insights, com limite de 100.000 linhas.",
    },
    creatives: [
      {
        id: "ad-1",
        adId: "ad-1",
        creativeId: "creative-1",
        name: "MG4 Cold | Público Segmentado",
        campaignId: "campaign-1",
        campaignName: "MG Motors Julho",
        adsetId: "adset-1",
        adsetName: "Lookalike Base Clientes",
        campaignStatus: "PAUSED",
        adsetStatus: "ACTIVE",
        adStatus: "PAUSED",
        campaignEffectiveStatus: "PAUSED",
        adsetEffectiveStatus: "CAMPAIGN_PAUSED",
        adEffectiveStatus: "CAMPAIGN_PAUSED",
        operationalStatus: "CAMPAIGN_PAUSED",
        operationalLabel: "Campanha pausada",
        isActive: false,
        format: "IMAGE",
        mediaType: "IMAGE",
        previewUrl: "https://media.example/mg4.jpg",
        mediaUrl: "https://media.example/mg4.jpg",
        thumbnailUrl: "https://media.example/mg4-thumb.jpg",
        permalinkUrl: "https://instagram.com/p/mg4",
        videoPreviewUrl: null,
        cards: [],
        carouselCardCount: 0,
        carouselCardsWithPreview: 0,
        carouselMediaComplete: true,
      },
      {
        id: "ad-2",
        adId: "ad-2",
        creativeId: "creative-2",
        name: "MG5 Carrossel",
        campaignId: "campaign-2",
        campaignName: "MG5 Julho",
        adsetId: "adset-2",
        adsetName: "Público Quente",
        campaignStatus: "PAUSED",
        adsetStatus: "PAUSED",
        adStatus: "PAUSED",
        campaignEffectiveStatus: "PAUSED",
        adsetEffectiveStatus: "CAMPAIGN_PAUSED",
        adEffectiveStatus: "CAMPAIGN_PAUSED",
        operationalStatus: "CAMPAIGN_PAUSED",
        operationalLabel: "Campanha pausada",
        isActive: false,
        format: "CAROUSEL",
        mediaType: "CAROUSEL_ALBUM",
        previewUrl: "https://media.example/mg5-cover.jpg",
        mediaUrl: "https://media.example/mg5-cover.jpg",
        thumbnailUrl: null,
        permalinkUrl: null,
        videoPreviewUrl: null,
        cards: [
          {
            position: 1,
            name: "Frente",
            description: null,
            link: "https://mg.example/frente",
            previewUrl: "https://media.example/front.jpg",
            videoId: null,
            imageHash: null,
            hasPreview: true,
          },
        ],
        carouselCardCount: 1,
        carouselCardsWithPreview: 1,
        carouselMediaComplete: true,
      },
    ],
    warnings: ["Todos os criativos retornados estão desativados no momento."],
    ...overrides,
  };
}

describe("MetaCreativeInventoryPanel", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  it("explica a cobertura completa e sinaliza que todos os criativos estão desativados", () => {
    useQueryMock.mockReturnValue({
      data: inventoryData(),
      isLoading: false,
      error: null,
    });

    const html = renderToStaticMarkup(
      <MetaCreativeInventoryPanel
        locale="pt-BR"
        performanceCreatives={[
          { adId: "ad-1", creativeId: "creative-1", spend: 972.81, leads: 113, cpl: 8.61 },
        ] as never}
      />,
    );

    expect(html).toContain("Inventário completo de criativos");
    expect(html).toContain("Criativos desativados no momento");
    expect(html).toContain("40 anúncios");
    expect(html).toContain(">40<");
    expect(html).toContain("Ativos");
    expect(html).toContain("Desativados");
    expect(html).toContain("Imagem");
    expect(html).toContain("Vídeo");
    expect(html).toContain("Carrossel");
    expect(html).toContain("Campanha pausada");
    expect(html).toContain("MG4 Cold | Público Segmentado");
    expect(html).toContain("R$ 972,81");
    expect(html).toContain("Abrir publicação");
    expect(html).toContain("Ver cartões do carrossel");
    expect(html).toContain("A fonte retornou 40 linhas, consolidadas em 40 anúncios únicos");
    expect(html).toContain("objetos sem insights");
    expect(html).toContain("100.000 linhas");
  });

  it("expõe aviso de snapshot quando a fonte ao vivo está indisponível", () => {
    useQueryMock.mockReturnValue({
      data: inventoryData({
        metadata: {
          ...inventoryData().metadata,
          source: "persistent-snapshot",
          stale: true,
        },
        warnings: ["A fonte ao vivo falhou; exibindo o último snapshot persistente disponível."],
      }),
      isLoading: false,
      error: null,
    });

    const html = renderToStaticMarkup(
      <MetaCreativeInventoryPanel locale="pt-BR" performanceCreatives={[] as never} />,
    );

    expect(html).toContain("Snapshot anterior");
    expect(html).toContain("A fonte ao vivo falhou");
  });

  it("renderiza estados explícitos de carregamento e erro", () => {
    useQueryMock.mockReturnValueOnce({ data: undefined, isLoading: true, error: null });
    const loadingHtml = renderToStaticMarkup(
      <MetaCreativeInventoryPanel locale="pt-BR" performanceCreatives={[] as never} />,
    );
    expect(loadingHtml).toContain("Carregando o inventário completo do Meta Ads");

    useQueryMock.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: new Error("indisponível"),
    });
    const errorHtml = renderToStaticMarkup(
      <MetaCreativeInventoryPanel locale="pt-BR" performanceCreatives={[] as never} />,
    );
    expect(errorHtml).toContain("Não foi possível carregar o inventário de criativos");
    expect(errorHtml).toContain("A conexão pode estar temporariamente indisponível");
  });
});
