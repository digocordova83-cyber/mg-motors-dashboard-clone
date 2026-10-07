import { describe, expect, it } from "vitest";
import {
  buildFinanceiroDevicePlanning,
  buildFinanceiroLeadCharts,
  buildFinanceiroPartnerDashboard,
} from "./financeiroService";

describe("painel financeiro de parceiros", () => {
  it("calcula Webmotors com CPM de referência de R$ 50 sobre o plano líquido", () => {
    const result = buildFinanceiroPartnerDashboard({
      partner: "webmotors",
      competence: "2026-10",
      leads: [
        { id: 1, correctedDate: "2026-10-01", model: "MG4", name: "", email: "", phone: "", dealer: "A", city: "A", region: "SP", channel: "Webmotors" },
        { id: 2, correctedDate: "2026-10-02", model: "IM6", name: "", email: "", phone: "", dealer: "B", city: "B", region: "RJ", channel: "Webmotors" },
      ],
    });

    expect(result).toMatchObject({
      plannedGrossInvestment: 125000,
      plannedNetInvestment: 120000,
      actualLeads: 2,
      referenceCpm: 50,
      estimatedImpressions: 2400000,
      referenceCpl: 60000,
    });
  });

  it("calcula Mercado Livre com CPM de referência de R$ 35", () => {
    const result = buildFinanceiroPartnerDashboard({
      partner: "mercado-livre",
      competence: "2026-09",
      leads: [
        { id: 1, correctedDate: "2026-09-10", model: "MG4", name: "", email: "", phone: "", dealer: "A", city: "A", region: "SP", channel: "Mercado Livre" },
        { id: 2, correctedDate: "2026-09-11", model: "MG4", name: "", email: "", phone: "", dealer: "B", city: "B", region: "RJ", channel: "Mercado Livre" },
      ],
    });

    expect(result).toMatchObject({
      plannedGrossInvestment: 80000,
      plannedNetInvestment: 76800,
      actualLeads: 2,
      referenceCpm: 35,
      estimatedImpressions: 2194286,
      referenceCpl: 38400,
    });
  });

  it("não inventa valores financeiros quando não há plano aprovado no mês", () => {
    const result = buildFinanceiroPartnerDashboard({
      partner: "webmotors",
      competence: "2027-01",
      leads: [],
    });

    expect(result.plannedNetInvestment).toBeNull();
    expect(result.referenceCpl).toBeNull();
    expect(result.estimatedImpressions).toBeNull();
  });

  it("preenche a série diária e agrupa os modelos com dados canônicos", () => {
    const charts = buildFinanceiroLeadCharts("2026-10", [
      { id: 1, correctedDate: "2026-10-01", model: "MG4", name: "", email: "", phone: "", dealer: "A", city: "A", region: "SP", channel: "Webmotors" },
      { id: 2, correctedDate: "2026-10-01", model: "MG4", name: "", email: "", phone: "", dealer: "A", city: "A", region: "SP", channel: "Webmotors" },
      { id: 3, correctedDate: "2026-10-03", model: "IM6", name: "", email: "", phone: "", dealer: "B", city: "B", region: "RJ", channel: "Webmotors" },
    ]);

    expect(charts.daily).toHaveLength(31);
    expect(charts.daily.slice(0, 3)).toEqual([
      { date: "2026-10-01", leads: 2 },
      { date: "2026-10-02", leads: 0 },
      { date: "2026-10-03", leads: 1 },
    ]);
    expect(charts.models).toEqual([
      { model: "MG4", leads: 2 },
      { model: "IM6", leads: 1 },
    ]);
  });

  it("mantém perfil de dispositivos explícito por parceiro e competência", () => {
    const webmotorsSeptember = buildFinanceiroDevicePlanning({
      partner: "webmotors",
      competence: "2026-09",
      actualLeads: 100,
      estimatedImpressions: 1_000,
    });
    const mercadoLivreOctober = buildFinanceiroDevicePlanning({
      partner: "mercado-livre",
      competence: "2026-10",
      actualLeads: 100,
      estimatedImpressions: 1_000,
    });

    expect(webmotorsSeptember).toMatchObject({
      status: "ATIVA",
      source: "REFERENCIA_DE_PLANEJAMENTO",
      devices: [
        { device: "Mobile", share: 80, estimatedImpressions: 800, modeledLeads: 80 },
        { device: "Desktop", share: 20, estimatedImpressions: 200, modeledLeads: 20 },
      ],
    });
    expect(mercadoLivreOctober.devices).toEqual([
      { device: "Mobile", share: 83, estimatedImpressions: 830, modeledLeads: 83 },
      { device: "Desktop", share: 17, estimatedImpressions: 170, modeledLeads: 17 },
    ]);
  });
});
