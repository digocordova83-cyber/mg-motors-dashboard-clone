import { describe, expect, it } from "vitest";
import { buildFinanceiroPartnerDashboard } from "./financeiroService";

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
});
