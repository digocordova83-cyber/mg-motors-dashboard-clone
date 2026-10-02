import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MEDIA_PLANS, getMediaPlan } from "@/data/mediaPlans";
import { MediaPlanDashboard, MediaPlanEmptyState } from "./MediaPlanDashboard";

describe("Plano de Mídia Digital", () => {
  it("oferece outubro como competência mais recente e preserva o histórico", () => {
    const october = MEDIA_PLANS[0];
    const september = getMediaPlan("2026-09");
    const august = getMediaPlan("2026-08");
    const july = getMediaPlan("2026-07");

    expect(MEDIA_PLANS.map((plan) => plan.month)).toEqual(["2026-10", "2026-09", "2026-08", "2026-07"]);
    expect(october).toMatchObject({
      month: "2026-10",
      mode: "HYBRID",
      sourceFile: "Quadros MG MEDIA PLAN | DIGITAL + MG MEDIA PLAN | IM",
      sourceSheet: "Line-up Media + IM6 Media",
    });
    expect(september?.month).toBe("2026-09");
    expect(august?.month).toBe("2026-08");
    expect(august?.mode).toBe("FINANCIAL");
    expect(july?.month).toBe("2026-07");
    expect(july?.mode).toBe("HYBRID");
    expect(getMediaPlan("2099-12")).toBeNull();
  });

  it("reconcilia os planos Line-up e IM6 de outubro na mesma competência", () => {
    const plan = getMediaPlan("2026-10")!;
    const rowGross = plan.rows.reduce((sum, row) => sum + row.investment, 0);
    const rowCommission = plan.rows.reduce((sum, row) => sum + (row.commission ?? 0), 0);
    const rowNet = plan.rows.reduce((sum, row) => sum + (row.netInvestment ?? 0), 0);
    const rowLeads = plan.rows.reduce((sum, row) => sum + (row.leads ?? 0), 0);

    expect(plan.rows).toHaveLength(10);
    expect(rowGross).toBe(1_010_000);
    expect(rowCommission).toBeCloseTo(40_400, 2);
    expect(rowNet).toBeCloseTo(969_600, 2);
    expect(rowLeads).toBe(10_923);
    expect(plan.totals).toEqual([
      expect.objectContaining({ label: "LINE-UP — MEDIA", product: "Line-up", investment: 750_000, netInvestment: 720_000, leads: 8_844 }),
      expect.objectContaining({ label: "IM6 — MEDIA", product: "IM6", investment: 260_000, netInvestment: 249_600, leads: 2_079 }),
    ]);
    expect(plan.total).toMatchObject({ investment: 1_010_000, commission: 40_400, netInvestment: 969_600, leads: 10_923, cpl: 88.7668223 });
    expect(plan.rows.find((row) => row.id === "oct-lineup-meta")).toMatchObject({ investment: 330_000, netInvestment: 316_800, leads: 5_280, cpl: 60 });
    expect(plan.rows.find((row) => row.id === "oct-im6-meta")).toMatchObject({ product: "IM6", investment: 103_907, netInvestment: 99_750.72, leads: 1_814, cpl: 55 });
    expect(plan.rows.find((row) => row.id === "oct-im6-forbes")).toMatchObject({ funnel: "AWARENESS", leads: null, cpl: null });
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
      leads: 12_000,
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
    const rowCommission = plan.rows.reduce((sum, row) => sum + (row.commission ?? 0), 0);
    const rowNet = plan.rows.reduce((sum, row) => sum + (row.netInvestment ?? 0), 0);
    const rowImpressions = plan.rows.reduce((sum, row) => sum + (row.impressions ?? 0), 0);
    const rowClicks = plan.rows.reduce((sum, row) => sum + (row.clicks ?? 0), 0);
    const rowLeads = plan.rows.reduce((sum, row) => sum + (row.leads ?? 0), 0);

    expect(plan.rows).toHaveLength(15);
    expect(rowInvestment).toBe(1_050_000);
    expect(rowCommission).toBe(42_000);
    expect(rowNet).toBe(1_008_000);
    expect(rowImpressions).toBe(81_345_627);
    expect(Math.abs(rowImpressions - (plan.total.impressions ?? 0))).toBeLessThanOrEqual(2);
    expect(rowClicks).toBe(1_432_513);
    expect(Math.abs(rowClicks - (plan.total.clicks ?? 0))).toBeLessThanOrEqual(1);
    expect(rowLeads).toBe(10_000);
    expect(plan.total).toMatchObject({ investment: 1_050_000, commission: 42_000, netInvestment: 1_008_000, impressions: 81_345_625, clicks: 1_432_512, visits: 524_968, leads: 10_000, cpl: 105 });
    expect(plan.rows.find((row) => row.id === "lineup-google-pmax")).toMatchObject({ publisher: "Google", investment: 300_000, commission: 12_000, netInvestment: 288_000, status: "NOT_INFORMED", cpm: 16.82, impressions: 17_835_910, leads: 6_173, cpl: 48.6 });
    expect(plan.rows.find((row) => row.id === "mg4-mercado-livre")).toMatchObject({ sourceRow: 22, investment: 30_000, leads: 55, cpl: 545.45 });
  });

  it("mantém o mesmo contrato financeiro em julho, agosto e setembro", () => {
    for (const plan of MEDIA_PLANS) {
      expect(plan.total.commission).toBeTypeOf("number");
      expect(plan.total.netInvestment).toBeTypeOf("number");
      expect(plan.rows.every((row) => row.publisher && row.commission != null && row.netInvestment != null && row.status)).toBe(true);
    }
  });

  it("renderiza setembro em modo híbrido com projeção, conciliação e valores complementares", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" initialMonth="2026-09" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" initialMonth="2026-09" />);

    expect(portuguese).toContain("Plano de Mídia — Setembro de 2026");
    expect(portuguese).toContain("R$ 800.000");
    expect(portuguese).toContain("R$ 32.000");
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

  it("renderiza agosto com os mesmos quatro cards de setembro e a meta de Leads validada na planilha anexa", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" initialMonth="2026-08" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" initialMonth="2026-08" />);

    expect(portuguese).toContain("Plano de Mídia Digital — Agosto de 2026");
    expect(portuguese).toContain('data-testid="media-plan-kpi-gross"');
    expect(portuguese).toContain('data-testid="media-plan-kpi-net"');
    expect(portuguese).toContain('data-testid="media-plan-kpi-leads"');
    expect(portuguese).toContain('data-testid="media-plan-kpi-cpl"');
    expect(portuguese).toContain("R$ 1.050.000");
    expect(portuguese).toContain("R$ 1.008.000");
    expect(portuguese).toContain("12.000");
    expect(portuguese).toContain("R$ 84,00");
    expect(portuguese).toContain("MGPLANO-AGOSTO(1).xlsx");
    expect(english).toContain("Digital Media Plan — August 2026");
    expect(english).toContain("R$1,050,000");
    expect(english).toContain("12,000");
    expect(english).toContain("R$84.00");
  });

  it("renderiza julho com os mesmos quatro cards de setembro e preserva as métricas históricas", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" initialMonth="2026-07" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" initialMonth="2026-07" />);

    expect(portuguese).toContain("Plano de Mídia Digital — Julho de 2026");
    expect(portuguese).toContain('data-testid="media-plan-kpi-gross"');
    expect(portuguese).toContain('data-testid="media-plan-kpi-net"');
    expect(portuguese).toContain('data-testid="media-plan-kpi-leads"');
    expect(portuguese).toContain('data-testid="media-plan-kpi-cpl"');
    expect(portuguese).toContain("R$ 1.008.000");
    expect(portuguese).toContain("N/D");
    expect(portuguese).toContain("10.000");
    expect(portuguese).toContain("R$ 100,80");
    expect(portuguese).toContain("comissão e plano líquido foram calculados pela mesma regra de 4%");
    expect(english).toContain("Digital Media Plan — July 2026");
    expect(english).toContain("10,000");
    expect(english).toContain("R$100.80");
  });

  it("mantém exatamente os mesmos quatro cards superiores nas três competências", () => {
    for (const month of ["2026-10", "2026-09", "2026-08", "2026-07"]) {
      const html = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" initialMonth={month} />);
      expect(html.match(/data-testid="media-plan-kpi-/g)).toHaveLength(4);
      expect(html).toContain('data-testid="media-plan-kpi-gross"');
      expect(html).toContain('data-testid="media-plan-kpi-net"');
      expect(html).toContain('data-testid="media-plan-kpi-leads"');
      expect(html).toContain('data-testid="media-plan-kpi-cpl"');
    }
  });

  it("renderiza outubro com os dois planos aprovados", () => {
    const portuguese = renderToStaticMarkup(<MediaPlanDashboard locale="pt-BR" initialMonth="2026-10" />);
    const english = renderToStaticMarkup(<MediaPlanDashboard locale="en-US" initialMonth="2026-10" />);

    expect(portuguese).toContain("Plano de Mídia — Outubro de 2026");
    expect(portuguese).toContain("LINE-UP — MEDIA");
    expect(portuguese).toContain("IM6 — MEDIA");
    expect(portuguese).toContain("Forbes — branded content");
    expect(portuguese).toContain("R$ 1.010.000");
    expect(portuguese).toContain("R$ 969.600");
    expect(portuguese).toContain("10.923");
    expect(portuguese).toContain("R$ 88,77");
    expect(english).toContain("Media Plan — October 2026");
    expect(english).toContain("Line-up plan");
    expect(english).toContain("IM6 plan");
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
