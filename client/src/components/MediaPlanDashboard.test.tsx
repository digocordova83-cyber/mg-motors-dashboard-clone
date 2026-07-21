import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MEDIA_PLANS, getMediaPlan } from "@/data/mediaPlans";
import { MediaPlanDashboard, MediaPlanEmptyState } from "./MediaPlanDashboard";

describe("Plano de Mídia Digital", () => {
  it("usa julho de 2026 e registra a procedência da nova planilha", () => {
    const plan = MEDIA_PLANS[0];

    expect(plan.month).toBe("2026-07");
    expect(plan.sourceFile).toBe("Planilhasemtítulo.xlsx");
    expect(plan.sourceSheet).toBe("Página1");
    expect(plan.formulaCount).toBe(0);
    expect(plan.updatedAt).toBe("2026-07-21T19:00:00.000Z");
    expect(getMediaPlan("2026-07")).toBe(plan);
    expect(getMediaPlan("2099-12")).toBeNull();
  });

  it("preserva as 15 linhas, os subtotais e o total geral recebidos", () => {
    const plan = MEDIA_PLANS[0];
    const rowInvestment = plan.rows.reduce((sum, row) => sum + row.investment, 0);
    const productInvestment = plan.totals.reduce((sum, total) => sum + total.investment, 0);
    const productLeads = plan.totals.reduce((sum, total) => sum + total.leads, 0);

    expect(plan.rows).toHaveLength(15);
    expect(rowInvestment).toBe(1_050_000);
    expect(productInvestment).toBe(plan.total.investment);
    expect(productLeads).toBe(plan.total.leads);
    expect(plan.totals).toEqual([
      expect.objectContaining({ label: "LINE-UP", investment: 850_000, leads: 16_048, cpl: 52.97 }),
      expect.objectContaining({ label: "MG4 URBAN", investment: 200_000, leads: 952, cpl: 210.13 }),
    ]);
    expect(plan.total).toMatchObject({
      label: "GERAL DIGITAL",
      investment: 1_050_000,
      impressions: 81_345_625,
      clicks: 1_432_512,
      visits: 524_968,
      leads: 17_000,
      cpl: 61.76,
    });
  });

  it("mantém os parâmetros exatos de cada inserção do arquivo novo", () => {
    const plan = MEDIA_PLANS[0];

    expect(plan.rows.find((row) => row.id === "lineup-google-pmax")).toMatchObject({
      sourceRow: 5,
      investment: 300_000,
      cpm: 16.82,
      impressions: 17_835_910,
      ctr: 0.025,
      clicks: 445_898,
      connectRate: 0.35,
      visits: 156_064,
      cvr: 0.0672,
      leads: 10_493,
      cpl: 28.59,
    });
    expect(plan.rows.find((row) => row.id === "mg4-mercado-livre")).toMatchObject({
      sourceRow: 22,
      investment: 30_000,
      leads: 93,
      cpl: 322.4,
    });
  });

  it("não corrige silenciosamente as pequenas diferenças de arredondamento da planilha", () => {
    const plan = MEDIA_PLANS[0];
    const rowImpressions = plan.rows.reduce((sum, row) => sum + row.impressions, 0);
    const rowClicks = plan.rows.reduce((sum, row) => sum + row.clicks, 0);
    const rowLeads = plan.rows.reduce((sum, row) => sum + (row.leads ?? 0), 0);

    expect(rowImpressions).toBe(81_345_627);
    expect(plan.total.impressions).toBe(81_345_625);
    expect(rowClicks).toBe(1_432_513);
    expect(plan.total.clicks).toBe(1_432_512);
    expect(rowLeads).toBe(16_999);
    expect(plan.total.leads).toBe(17_000);
  });

  it("renderiza os rótulos do plano novo em português e inglês", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" />);

    expect(portuguese).toContain("Investimento planejado de mídia");
    expect(portuguese).toContain("Verba dedicada MG4 Urban");
    expect(portuguese).toContain("R$ 1.050.000");
    expect(portuguese).toContain("R$ 61,76");
    expect(portuguese).toContain("R$ 16,82");
    expect(english).toContain("Planned media investment");
    expect(english).toContain("Dedicated MG4 Urban budget");
    expect(english).toContain("R$61.76");
    expect(english).toContain("R$16.82");
  });

  it("renderiza estado vazio responsivo em português e inglês", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanEmptyState locale="pt-BR" />);
    const english = renderToStaticMarkup(<MediaPlanEmptyState locale="en-US" />);

    expect(portuguese).toContain("Nenhum plano disponível para este mês");
    expect(portuguese).toContain("Selecione outra competência");
    expect(english).toContain("No media plan for this month");
    expect(english).toContain("Select another month");
  });
});
