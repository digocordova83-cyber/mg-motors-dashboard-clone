import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MEDIA_PLANS, getMediaPlan } from "@/data/mediaPlans";
import { MediaPlanDashboard, MediaPlanEmptyState } from "./MediaPlanDashboard";

describe("Plano de Mídia Digital", () => {
  it("oferece setembro como competência mais recente e preserva agosto e julho no histórico", () => {
    const september = MEDIA_PLANS[0];
    const august = getMediaPlan("2026-08");
    const july = getMediaPlan("2026-07");

    expect(MEDIA_PLANS.map((plan) => plan.month)).toEqual(["2026-09", "2026-08", "2026-07"]);
    expect(september).toMatchObject({
      month: "2026-09",
      mode: "HYBRID",
      sourceFile: "MG-SetembroMidia(1).xlsx",
      sourceSheet: "Media Plan - Digital",
      formulaCount: 556,
      updatedAt: "2026-09-02T22:11:44.533Z",
    });
    expect(august?.month).toBe("2026-08");
    expect(august?.mode).toBe("FINANCIAL");
    expect(july?.month).toBe("2026-07");
    expect(july?.mode).toBe("DELIVERY");
    expect(getMediaPlan("2099-12")).toBeNull();
  });

  it("reconcilia exatamente o plano híbrido de setembro por canal", () => {
    const plan = getMediaPlan("2026-09")!;
    const rowGross = plan.rows.reduce((sum, row) => sum + row.investment, 0);
    const rowCommission = plan.rows.reduce((sum, row) => sum + (row.commission ?? 0), 0);
    const rowNet = plan.rows.reduce((sum, row) => sum + (row.netInvestment ?? 0), 0);
    const rowLeads = plan.rows.reduce((sum, row) => sum + (row.leads ?? 0), 0);

    expect(plan.rows).toHaveLength(5);
    expect(rowGross).toBeCloseTo(799_999.67, 2);
    expect(rowCommission).toBeCloseTo(31_999.9868, 4);
    expect(rowNet).toBeCloseTo(767_999.6832, 4);
    expect(rowLeads).toBeCloseTo(9_998.956726, 5);
    expect(plan.total).toMatchObject({
      sourceRow: 13,
      investment: 799_999.67,
      commission: 31_999.9868,
      netInvestment: 767_999.6832,
      leads: 9_998.956726,
      cpl: 76.8079815,
    });
    expect(plan.rows.find((row) => row.id === "sep-google")).toMatchObject({ investment: 279_583, netInvestment: 268_399.68, leads: 3116.577798, cpl: 86.12 });
    expect(plan.rows.find((row) => row.id === "sep-meta")).toMatchObject({ investment: 300_000, netInvestment: 288_000, leads: 5328.39963, cpl: 54.05 });
    expect(plan.contextItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "sep-executive-total", value: 894_999.67 }),
      expect.objectContaining({ id: "sep-save", value: 99_000 }),
    ]));
  });

  it("reconcilia exatamente o plano financeiro de agosto por linha e produto", () => {
    const plan = getMediaPlan("2026-08")!;
    const rowGross = plan.rows.reduce((sum, row) => sum + row.investment, 0);
    const rowCommission = plan.rows.reduce((sum, row) => sum + (row.commission ?? 0), 0);
    const rowNet = plan.rows.reduce((sum, row) => sum + (row.netInvestment ?? 0), 0);
    const rowActual = plan.rows.reduce((sum, row) => sum + (row.actualInvestment ?? 0), 0);

    expect(plan.rows).toHaveLength(13);
    expect(rowGross).toBeCloseTo(1_050_000, 2);
    expect(rowCommission).toBeCloseTo(42_000, 4);
    expect(rowNet).toBeCloseTo(1_008_000, 4);
    expect(rowActual).toBe(0);
    expect(plan.total).toMatchObject({
      sourceRow: 29,
      investment: 1_050_000,
      commission: 42_000,
      netInvestment: 1_008_000,
      actualInvestment: 0,
    });
    expect(plan.totals).toEqual([
      expect.objectContaining({ label: "LINE-UP", investment: 868_555.26, commission: 34_742.2104, netInvestment: 833_813.0496 }),
      expect.objectContaining({ label: "MG4 URBAN", investment: 181_444.74, commission: 7_257.7896, netInvestment: 174_186.9504 }),
    ]);
  });

  it("preserva canais, publishers, valores zero e status informados na aba Agosto", () => {
    const plan = getMediaPlan("2026-08")!;

    expect(plan.rows.find((row) => row.id === "aug-lineup-google")).toMatchObject({
      sourceRow: 10,
      channel: "Google Ads",
      publisher: "Google",
      investment: 350_000,
      commission: 14_000,
      netInvestment: 336_000,
      actualInvestment: 0,
      status: "PAID",
    });
    expect(plan.rows.find((row) => row.id === "aug-lineup-webmotors")).toMatchObject({
      sourceRow: 11,
      investment: 170_846.96,
      commission: 6_833.8784,
      netInvestment: 164_013.0816,
      status: "PAYABLES",
    });
    expect(plan.rows.find((row) => row.id === "aug-lineup-uol")).toMatchObject({
      investment: 0,
      commission: 0,
      netInvestment: 0,
      actualInvestment: 0,
    });
    expect(plan.rows.find((row) => row.id === "aug-urban-webmotors")?.status).toBe("NOT_INFORMED");
    expect(plan.rows.every((row) => row.impressions == null && row.leads == null && row.cpl == null)).toBe(true);
  });

  it("mantém integralmente os dados de entrega da competência julho", () => {
    const plan = getMediaPlan("2026-07")!;
    const rowInvestment = plan.rows.reduce((sum, row) => sum + row.investment, 0);
    const rowImpressions = plan.rows.reduce((sum, row) => sum + (row.impressions ?? 0), 0);
    const rowClicks = plan.rows.reduce((sum, row) => sum + (row.clicks ?? 0), 0);
    const rowLeads = plan.rows.reduce((sum, row) => sum + (row.leads ?? 0), 0);

    expect(plan.rows).toHaveLength(15);
    expect(rowInvestment).toBe(1_050_000);
    expect(rowImpressions).toBe(81_345_627);
    expect(Math.abs(rowImpressions - (plan.total.impressions ?? 0))).toBeLessThanOrEqual(2);
    expect(rowClicks).toBe(1_432_513);
    expect(Math.abs(rowClicks - (plan.total.clicks ?? 0))).toBeLessThanOrEqual(1);
    expect(rowLeads).toBe(10_000);
    expect(plan.total).toMatchObject({ investment: 1_050_000, impressions: 81_345_625, clicks: 1_432_512, visits: 524_968, leads: 10_000, cpl: 105 });
    expect(plan.rows.find((row) => row.id === "lineup-google-pmax")).toMatchObject({ investment: 300_000, cpm: 16.82, impressions: 17_835_910, leads: 6_173, cpl: 48.6 });
    expect(plan.rows.find((row) => row.id === "mg4-mercado-livre")).toMatchObject({ sourceRow: 22, investment: 30_000, leads: 55, cpl: 545.45 });
  });

  it("renderiza setembro em modo híbrido com projeção, conciliação e valores complementares", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" />);

    expect(portuguese).toContain("Plano de Mídia — Setembro de 2026");
    expect(portuguese).toContain("R$ 800.000");
    expect(portuguese).toContain("R$ 768.000");
    expect(portuguese).toContain("9.999");
    expect(portuguese).toContain("R$ 76,81");
    expect(portuguese).toContain("Reserva tática SAVE");
    expect(portuguese).toContain("R$ 99.000");
    expect(portuguese).toContain("Publya Programmatic Display");
    expect(portuguese).toContain("As 556 fórmulas foram auditadas sem erros");
    expect(english).toContain("Media Plan — September 2026");
    expect(english).toContain("Tactical SAVE reserve");
    expect(english).toContain("All 556 formulas were audited with no errors");
  });

  it("renderiza agosto em modo financeiro sem fabricar projeções ausentes", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" initialMonth="2026-08" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" initialMonth="2026-08" />);

    expect(portuguese).toContain("Plano de Mídia Digital — Agosto de 2026");
    expect(portuguese).toContain("Plano bruto");
    expect(portuguese).toContain("Comissão de 4%");
    expect(portuguese).toContain("Plano líquido de mídia");
    expect(portuguese).toContain("R$ 1.050.000");
    expect(portuguese).toContain("R$ 42.000");
    expect(portuguese).toContain("R$ 1.008.000");
    expect(portuguese).toContain("Não informado na planilha de agosto");
    expect(portuguese).toContain("A planilha não informa projeções");
    expect(english).toContain("Digital Media Plan — August 2026");
    expect(english).toContain("Plan gross");
    expect(english).toContain("4% commission");
    expect(english).toContain("R$1,050,000");
    expect(english).toContain("The workbook does not provide projected impressions");
  });

  it("renderiza julho pelo seletor histórico com as métricas de entrega originais", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" initialMonth="2026-07" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" initialMonth="2026-07" />);

    expect(portuguese).toContain("Plano de Mídia Digital — Julho de 2026");
    expect(portuguese).toContain("Investimento planejado de mídia");
    expect(portuguese).toContain("10.000");
    expect(portuguese).toContain("R$ 105,00");
    expect(portuguese).toContain("reprojectados proporcionalmente para a meta de 10.000 Leads");
    expect(english).toContain("Digital Media Plan — July 2026");
    expect(english).toContain("Planned media investment");
    expect(english).toContain("10,000");
    expect(english).toContain("R$105.00");
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
