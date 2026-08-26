import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  formatMetaAdsGender,
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
    });
    expect(META_ADS_COPY["en-US"]).toMatchObject({
      title: "Social Media Performance",
      campaignsTitle: "Campaigns",
      audiencesTitle: "Top audiences",
      creativesTitle: "Top-performing creatives",
      audienceAnalysisTitle: "Reached audience analysis",
      cutoff: "D-1 cutoff",
      through: "Data available through",
    });
  });

  it("traduz status, gênero e segmentação sem alterar o valor em português", () => {
    expect(formatMetaAdsStatus("ACTIVE", "pt-BR")).toBe("Ativa");
    expect(formatMetaAdsStatus("PAUSED", "en-US")).toBe("Paused");
    expect(formatMetaAdsStatus("UNKNOWN", "en-US")).toBe("Status unavailable");
    expect(formatMetaAdsGender("female", "pt-BR")).toBe("Mulheres");
    expect(formatMetaAdsGender("male", "en-US")).toBe("Men");
    expect(formatMetaAdsGender("unknown", "en-US")).toBe("Not reported");

    const targeting = "Interesses: veículos elétricos";
    expect(translateMetaAdsTargeting(targeting, "pt-BR")).toBe(targeting);
    expect(translateMetaAdsTargeting(targeting, "en-US")).toBe("Interests: veículos elétricos");
  });

  it("não mantém investimento ou CPL na aba Meta, somente métricas de volume e entrega", () => {
    const source = readFileSync(new URL("./MetaAdsDashboard.tsx", import.meta.url), "utf8");

    expect(source).toContain('title: t.leads');
    expect(source).toContain('dataKey="leads"');
    expect(source).not.toContain("t.investment");
    expect(source).not.toContain("t.cpl");
    expect(source).not.toContain('dataKey="spend"');
    expect(source).not.toContain('dataKey="cpl"');
    expect(source).not.toContain("formatCurrency");
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
