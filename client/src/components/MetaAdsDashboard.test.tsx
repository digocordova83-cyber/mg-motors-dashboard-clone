import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  formatMetaAdsGender,
  formatMetaAdsPacingStatus,
  formatMetaAdsStatus,
  META_ADS_COPY,
  MetaAdsEmptyState,
  MetaAdsError,
  MetaAdsLoading,
  translateMetaAdsTargeting,
} from "./MetaAdsDashboard";

describe("interface Meta Ads", () => {
  it("mantém os rótulos operacionais completos em português e inglês", () => {
    expect(META_ADS_COPY["pt-BR"]).toMatchObject({
      title: "Performance de Mídia Social",
      campaignsTitle: "Campanhas",
      audiencesTitle: "Principais públicos",
      creativesTitle: "Criativos com melhor desempenho",
      audienceAnalysisTitle: "Análise do público alcançado",
      cutoff: "Corte D-1",
      through: "Dados disponíveis até",
      pacingTitle: "Pacing de orçamento — Meta Ads",
      baseLeads: "Leads — planilha-base",
      baseLeadsSubtitle: "Aba Meta · created_time em horário de Brasília",
    });
    expect(META_ADS_COPY["en-US"]).toMatchObject({
      title: "Social Media Performance",
      campaignsTitle: "Campaigns",
      audiencesTitle: "Top audiences",
      creativesTitle: "Top-performing creatives",
      audienceAnalysisTitle: "Reached audience analysis",
      cutoff: "D-1 cutoff",
      through: "Data available through",
      pacingTitle: "Budget pacing — Meta Ads",
      baseLeads: "Leads — source spreadsheet",
    });
  });

  it("traduz status, gênero e segmentação sem alterar o valor em português", () => {
    expect(formatMetaAdsStatus("ACTIVE", "pt-BR")).toBe("Ativa");
    expect(formatMetaAdsStatus("PAUSED", "en-US")).toBe("Paused");
    expect(formatMetaAdsStatus("UNKNOWN", "en-US")).toBe("Status unavailable");
    expect(formatMetaAdsGender("female", "pt-BR")).toBe("Mulheres");
    expect(formatMetaAdsGender("male", "en-US")).toBe("Men");
    expect(formatMetaAdsGender("unknown", "en-US")).toBe("Not reported");
    expect(formatMetaAdsPacingStatus("ON_TRACK", "pt-BR")).toBe("No ritmo do plano");
    expect(formatMetaAdsPacingStatus("BEHIND", "en-US")).toBe("Behind plan");

    const targeting = "Interesses: veículos elétricos";
    expect(translateMetaAdsTargeting(targeting, "pt-BR")).toBe(targeting);
    expect(translateMetaAdsTargeting(targeting, "en-US")).toBe("Interests: veículos elétricos");
  });

  it("isola valores financeiros no painel explícito de pacing, sem misturá-los às métricas de performance", () => {
    const source = readFileSync(new URL("./MetaAdsDashboard.tsx", import.meta.url), "utf8");

    expect(source).toContain('title: displayedLeadTitle');
    expect(source).toContain("data.baseLeads.daily");
    expect(source).toContain("data.baseLeads.total");
    expect(source).toContain('dataKey="leads"');
    expect(source).toContain("t.pacingTitle");
    expect(source).toContain("pacing.monthlyNetBudget");
    expect(source).not.toContain("t.cpl");
    expect(source).not.toContain('dataKey="spend"');
    expect(source).not.toContain('dataKey="cpl"');
    expect(source).not.toContain("Investimento");
    expect(source).not.toContain("CPL");
  });

  it("renderiza estados explícitos de carregamento em ambos os idiomas", () => {
    const portuguese = renderToStaticMarkup(<MetaAdsLoading locale="pt-BR" />);
    const english = renderToStaticMarkup(<MetaAdsLoading locale="en-US" />);

    expect(portuguese).toContain("Carregando dados reais do Meta Ads");
    expect(english).toContain("Loading live Meta Ads data");
  });

  it("renderiza erro recuperável e estado vazio sem fabricar dados", () => {
    const error = renderToStaticMarkup(<MetaAdsError locale="en-US" onRetry={() => undefined} />);
    const empty = renderToStaticMarkup(
      <MetaAdsEmptyState title="No data for this period" description="Select another date range." />,
    );

    expect(error).toContain("Meta Ads could not be loaded");
    expect(error).toContain("Refresh");
    expect(empty).toContain("No data for this period");
    expect(empty).toContain("Select another date range");
  });
});
