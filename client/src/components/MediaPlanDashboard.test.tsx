import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MEDIA_PLANS, getMediaPlan } from "@/data/mediaPlans";
import { MediaPlanEmptyState } from "./MediaPlanDashboard";

describe("Plano de Mídia Digital", () => {
  it("usa julho de 2026 como primeira competência e preserva a procedência da planilha", () => {
    const plan = MEDIA_PLANS[0];

    expect(plan.month).toBe("2026-07");
    expect(plan.sourceSheet).toBe("Página1");
    expect(plan.updatedAt).toBe("2026-07-21T04:36:21.430Z");
    expect(getMediaPlan("2026-07")).toBe(plan);
    expect(getMediaPlan("2099-12")).toBeNull();
  });

  it("preserva os totais consolidados e a soma das linhas aprovadas", () => {
    const plan = MEDIA_PLANS[0];
    const netInvestment = plan.rows.reduce((sum, row) => sum + row.netInvestment, 0);
    const productInvestment = plan.totals.reduce((sum, total) => sum + total.netInvestment, 0);
    const productLeads = plan.totals.reduce((sum, total) => sum + total.leads, 0);

    expect(plan.rows).toHaveLength(15);
    expect(netInvestment).toBe(1_152_000);
    expect(productInvestment).toBe(plan.total.netInvestment);
    expect(productLeads).toBe(plan.total.leads);
    expect(plan.total).toMatchObject({
      label: "GERAL DIGITAL",
      netInvestment: 1_152_000,
      impressions: 86_653_037,
      leads: 17_658,
      cpl: 65.24,
    });
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
