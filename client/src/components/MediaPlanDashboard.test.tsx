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
    expect(plan.updatedAt).toBe("2026-07-21T19:13:56.000Z");
    expect(getMediaPlan("2026-07")).toBe(plan);
    expect(getMediaPlan("2099-12")).toBeNull();
  });

  it("preserva as 15 linhas e reconcilia os produtos com a meta de 10.000 Leads", () => {
    const plan = MEDIA_PLANS[0];
    const rowInvestment = plan.rows.reduce((sum, row) => sum + row.investment, 0);
    const productInvestment = plan.totals.reduce((sum, total) => sum + total.investment, 0);
    const productLeads = plan.totals.reduce((sum, total) => sum + total.leads, 0);

    expect(plan.rows).toHaveLength(15);
    expect(rowInvestment).toBe(1_050_000);
    expect(productInvestment).toBe(plan.total.investment);
    expect(productLeads).toBe(plan.total.leads);
    expect(plan.totals).toEqual([
      expect.objectContaining({ label: "LINE-UP", investment: 850_000, leads: 9_440, cpl: 90.04 }),
      expect.objectContaining({ label: "MG4 URBAN", investment: 200_000, leads: 560, cpl: 357.14 }),
    ]);
    expect(plan.total).toMatchObject({
      label: "GERAL DIGITAL",
      investment: 1_050_000,
      impressions: 81_345_625,
      clicks: 1_432_512,
      visits: 524_968,
      leads: 10_000,
      cpl: 105,
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
      cvr: 0.0396,
      leads: 6_173,
      cpl: 48.6,
    });
    expect(plan.rows.find((row) => row.id === "mg4-mercado-livre")).toMatchObject({
      sourceRow: 22,
      investment: 30_000,
      cvr: 0.0038,
      leads: 55,
      cpl: 545.45,
    });
  });

  it("mantém as diferenças originais de entrega e reconcilia exatamente os Leads reprojectados", () => {
    const plan = MEDIA_PLANS[0];
    const rowImpressions = plan.rows.reduce((sum, row) => sum + row.impressions, 0);
    const rowClicks = plan.rows.reduce((sum, row) => sum + row.clicks, 0);
    const rowLeads = plan.rows.reduce((sum, row) => sum + (row.leads ?? 0), 0);

    expect(rowImpressions).toBe(81_345_627);
    expect(plan.total.impressions).toBe(81_345_625);
    expect(rowClicks).toBe(1_432_513);
    expect(plan.total.clicks).toBe(1_432_512);
    expect(rowLeads).toBe(10_000);
    expect(plan.total.leads).toBe(10_000);

    plan.totals.forEach((total) => {
      const productLeads = plan.rows
        .filter((row) => row.product === total.product)
        .reduce((sum, row) => sum + (row.leads ?? 0), 0);
      expect(productLeads).toBe(total.leads);
      expect(total.cpl).toBeCloseTo(total.investment / total.leads, 2);
    });

    plan.rows.filter((row) => row.leads != null).forEach((row) => {
      expect(row.cpl).toBeCloseTo(row.investment / row.leads!, 2);
      expect(row.cvr).toBeCloseTo(row.leads! / row.visits, 4);
    });
  });

  it("renderiza os rótulos do plano novo em português e inglês", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" />);

    expect(portuguese).toContain("Investimento planejado de mídia");
    expect(portuguese).toContain("Verba dedicada MG4 Urban");
    expect(portuguese).toContain("R$ 1.050.000");
    expect(portuguese).toContain("10.000");
    expect(portuguese).toContain("R$ 105,00");
    expect(portuguese).toContain("R$ 16,82");
    expect(portuguese).toContain("reprojectados proporcionalmente para a meta de 10.000 Leads");
    expect(english).toContain("Planned media investment");
    expect(english).toContain("Dedicated MG4 Urban budget");
    expect(english).toContain("10,000");
    expect(english).toContain("R$105.00");
    expect(english).toContain("R$16.82");
    expect(english).toContain("proportionally revised to a 10,000-Lead target");
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
