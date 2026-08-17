import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const trpcMocks = vi.hoisted(() => ({
  bounds: vi.fn(),
  data: vi.fn(),
  refresh: vi.fn(),
  setData: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ tiktokAds: { data: { setData: trpcMocks.setData } } }),
    tiktokAds: {
      bounds: { useQuery: trpcMocks.bounds },
      data: { useQuery: trpcMocks.data },
      refresh: { useMutation: trpcMocks.refresh },
    },
  },
}));
import {
  formatTikTokAge,
  formatTikTokGender,
  formatTikTokRegion,
  formatTikTokStatus,
  TIKTOK_ADS_COPY,
  TikTokAdsError,
  TikTokAdsDashboard,
  TikTokAdsLoading,
} from "./TikTokAdsDashboard";

function dashboardData() {
  const campaign = {
    id: "campaign-1",
    name: "Ago/26 | Cadastro",
    status: "ENABLE",
    deliveryStatus: "CAMPAIGN_STATUS_ENABLE",
    objective: "LEAD_GENERATION",
    spend: 2_077.91,
    leads: 86,
    cpl: 24.16,
    impressions: 181_144,
    reach: 95_100,
    clicks: 734,
    ctr: 0.41,
    engagements: 2_425,
    averageVideoPlay: 2.38,
  };
  const adGroup = {
    id: "group-1",
    campaignId: campaign.id,
    campaignName: campaign.name,
    name: "25+ | Público segmentado | Cidades",
    status: "ENABLE",
    deliveryStatus: "ADGROUP_STATUS_DELIVERY_OK",
    placement: "PLACEMENT_TYPE_NORMAL",
    budget: 0,
    bidStrategy: "Cost Cap",
    spend: campaign.spend,
    leads: campaign.leads,
    cpl: campaign.cpl,
    impressions: campaign.impressions,
    reach: campaign.reach,
    clicks: campaign.clicks,
    ctr: campaign.ctr,
    engagements: campaign.engagements,
    averageVideoPlay: campaign.averageVideoPlay,
  };
  const ad = {
    id: "ad-1",
    campaignId: campaign.id,
    campaignName: campaign.name,
    adGroupId: adGroup.id,
    adGroupName: adGroup.name,
    name: "MG4 - Urban",
    text: "MG4 Urban",
    format: "VIDEO",
    callToAction: "LEARN_MORE",
    status: "ENABLE",
    deliveryStatus: "AD_STATUS_DELIVERY_OK",
    model: "MG4 URBAN",
    videoId: "video-1",
    thumbnailUrl: null,
    videoUrl: null,
    adUrl: null,
    spend: campaign.spend,
    leads: campaign.leads,
    cpl: campaign.cpl,
    impressions: campaign.impressions,
    reach: campaign.reach,
    clicks: campaign.clicks,
    ctr: campaign.ctr,
    engagements: campaign.engagements,
    comments: 0,
    shares: 6,
    averageVideoPlay: campaign.averageVideoPlay,
  };
  const trend = [
    {
      date: "2026-08-16",
      spend: campaign.spend,
      leads: campaign.leads,
      conversions: campaign.leads,
      cpl: campaign.cpl,
      impressions: campaign.impressions,
      reach: campaign.reach,
      clicks: campaign.clicks,
      ctr: campaign.ctr,
      cpc: 2.83,
      cpm: 11.47,
      engagements: campaign.engagements,
      engagementRate: 1.34,
      comments: 0,
      shares: 6,
      averageVideoPlay: campaign.averageVideoPlay,
    },
  ];
  const gender = {
    gender: "MALE",
    key: "MALE",
    spend: 1_200,
    conversions: 50,
    costPerConversion: 24,
    impressions: 100_000,
    reach: 55_000,
    clicks: 400,
    ctr: 0.4,
  };
  const age = { ...gender, age: "AGE_35_44", key: "AGE_35_44" };
  const region = {
    region: "Sao Paulo",
    spend: 758.51,
    conversions: 19,
    costPerConversion: 39.92,
    impressions: 61_044,
    reach: 34_346,
    clicks: 223,
    ctr: 0.37,
  };
  return {
    account: {
      id: "7668787778449719316",
      name: "Ag. BBRO - MG Motor Brasil - AUT",
      currency: "BRL",
      timezone: "America/Sao_Paulo",
      datasource: "tiktok",
    },
    period: { dateFrom: "2026-08-13", dateTo: "2026-08-16" },
    summary: {
      spend: campaign.spend,
      leads: campaign.leads,
      conversions: campaign.leads,
      cpl: campaign.cpl,
      impressions: campaign.impressions,
      reach: campaign.reach,
      clicks: campaign.clicks,
      ctr: campaign.ctr,
      cpc: 2.83,
      cpm: 11.47,
      engagements: campaign.engagements,
      engagementRate: 1.34,
      comments: 0,
      shares: 6,
      averageVideoPlay: campaign.averageVideoPlay,
    },
    daily: trend,
    dailyBreakdown: {
      campaigns: trend.map(item => ({ ...item, campaignId: campaign.id, campaignName: campaign.name })),
      adGroups: trend.map(item => ({ ...item, campaignId: campaign.id, campaignName: campaign.name, adGroupId: adGroup.id, adGroupName: adGroup.name })),
    },
    models: [{ model: "MG4 URBAN", ads: 1, spend: campaign.spend, leads: 86, cpl: 24.16 }],
    campaigns: [campaign],
    adGroups: [adGroup],
    ads: [ad],
    demographics: { genders: [gender], ages: [age] },
    regions: [region],
    highlights: {
      topModel: null,
      topCampaign: campaign,
      topAdGroup: adGroup,
      topAd: ad,
      topGender: gender,
      topAge: age,
      topRegion: region,
    },
    metadata: {
      source: "windsor-live",
      updatedAt: "2026-08-17T19:12:22.286Z",
      cacheHit: false,
      dataThroughDate: "2026-08-16",
      rowCounts: { daily: 4, campaignDaily: 4, adGroupDaily: 4, campaigns: 1, adGroups: 1, ads: 1, demographics: 13, regions: 18 },
      cacheTtlSeconds: 900,
      leadMetric: "onsite_form",
      segmentedResultMetric: "conversions",
      demographicLeadsAvailable: false,
      regionalLeadsAvailable: false,
    },
  };
}

describe("interface TikTok Ads", () => {
  it("mantém a nomenclatura operacional completa em português e inglês", () => {
    expect(TIKTOK_ADS_COPY["pt-BR"]).toMatchObject({
      title: "Performance de TikTok Ads",
      leads: "Leads TikTok",
      campaignsTitle: "Campanhas",
      groupsTitle: "Grupos de anúncios",
      creativesTitle: "Criativos com melhor desempenho",
      attributedConversions: "Conversões atribuídas",
      cutoff: "Corte D-1",
    });
    expect(TIKTOK_ADS_COPY["en-US"]).toMatchObject({
      title: "TikTok Ads Performance",
      leads: "TikTok Leads",
      campaignsTitle: "Campaigns",
      groupsTitle: "Ad groups",
      creativesTitle: "Top-performing creatives",
      attributedConversions: "Attributed conversions",
      cutoff: "D-1 cutoff",
    });
  });

  it("traduz status, gênero, idade e regiões sem alterar os dados brutos", () => {
    expect(formatTikTokStatus("CAMPAIGN_STATUS_ENABLE", "pt-BR")).toBe("Ativo");
    expect(formatTikTokStatus("AD_STATUS_FROZEN", "en-US")).toBe("Blocked");
    expect(formatTikTokStatus("DISABLE", "en-US")).toBe("Paused");
    expect(formatTikTokGender("MALE", "pt-BR")).toBe("Homens");
    expect(formatTikTokGender("FEMALE", "en-US")).toBe("Women");
    expect(formatTikTokAge("AGE_35_44")).toBe("35–44");
    expect(formatTikTokRegion("Sao Paulo", "pt-BR")).toBe("São Paulo");
    expect(formatTikTokRegion("Sao Paulo", "en-US")).toBe("Sao Paulo");
  });

  it("explica que demografia e região usam conversões, não Leads segmentados", () => {
    expect(TIKTOK_ADS_COPY["pt-BR"].segmentedNote).toContain("não disponibiliza o campo de formulário nativo");
    expect(TIKTOK_ADS_COPY["pt-BR"].segmentedNote).toContain("não são rotulados como Leads");
    expect(TIKTOK_ADS_COPY["en-US"].segmentedNote).toContain("do not calculate segmented CPL");
  });

  it("renderiza carregamento e erro recuperável nos dois idiomas", () => {
    const loadingPt = renderToStaticMarkup(<TikTokAdsLoading locale="pt-BR" />);
    const loadingEn = renderToStaticMarkup(<TikTokAdsLoading locale="en-US" />);
    const error = renderToStaticMarkup(
      <TikTokAdsError locale="pt-BR" onRetry={() => undefined} />,
    );

    expect(loadingPt).toContain("Carregando dados reais do TikTok Ads");
    expect(loadingEn).toContain("Loading live TikTok Ads data");
    expect(error).toContain("Não foi possível carregar o TikTok Ads");
    expect(error).toContain("Atualizar");
  });

  it("preserva grades responsivas, alturas limitadas e rolagem interna das tabelas", () => {
    const source = readFileSync(
      new URL("./TikTokAdsDashboard.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain("sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6");
    expect(source).toContain("xl:grid-cols-[1.35fr_0.65fr]");
    expect(source).toContain("xl:grid-cols-[0.75fr_1.25fr]");
    expect(source).toContain('className="overflow-x-auto"');
    expect(source).toContain('className="h-[350px]');
    expect(source).toContain("data-testid=\"tiktok-ads-dashboard\"");
  });

  it("renderiza KPIs, filtros e todos os painéis com dados reais reconciliados", () => {
    trpcMocks.bounds.mockReturnValue({
      data: { earliestDate: "2026-08-13", latestDate: "2026-08-16" },
      isLoading: false,
    });
    trpcMocks.data.mockReturnValue({
      data: dashboardData(),
      isLoading: false,
      isFetching: false,
      error: null,
    });
    trpcMocks.refresh.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    });

    const html = renderToStaticMarkup(<TikTokAdsDashboard locale="pt-BR" />);

    expect(html).toContain('data-testid="tiktok-ads-dashboard"');
    expect(html).toContain("Performance de TikTok Ads");
    expect(html).toContain("86");
    expect(html).toContain("24,16");
    expect(html).toContain("Todas as campanhas");
    expect(html).toContain("Todos os grupos");
    expect(html).toContain("Evolução diária — investimento e Leads");
    expect(html).toContain("Grupos de anúncios");
    expect(html).toContain("MG4 - Urban");
    expect(html).toContain("Público e distribuição regional");
    expect(html).toContain("não são rotulados como Leads");
  });
});
