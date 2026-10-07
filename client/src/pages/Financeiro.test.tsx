import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FINANCEIRO_PARTNERS, summarizeFinanceiroPartners } from "./Financeiro";

const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const financeiroSource = readFileSync(new URL("./Financeiro.tsx", import.meta.url), "utf8");

describe("Portal Financeiro", () => {
  it("mantém visão consolidada e visões individuais com logos dos parceiros", () => {
    expect(FINANCEIRO_PARTNERS.all.label).toBe("Visão geral");
    expect(FINANCEIRO_PARTNERS.webmotors.logo).toContain("webmotors-logo");
    expect(FINANCEIRO_PARTNERS["mercado-livre"].logo).toContain("mercado-livre-logo");
    expect(financeiroSource).toContain("function PartnerMark");
    expect(financeiroSource).toContain("Visões financeiras");
    expect(financeiroSource).toContain("Leads por dia");
    expect(financeiroSource).toContain("Mix de modelos");
  });

  it("calcula os big numbers da visão selecionada sem converter plano ausente em zero", () => {
    expect(summarizeFinanceiroPartners([
      { id: "webmotors", plannedNetInvestment: 120_000, actualLeads: 100, estimatedImpressions: 2_400_000 },
      { id: "mercado-livre", plannedNetInvestment: 67_200, actualLeads: 120, estimatedImpressions: 1_920_000 },
    ])).toEqual({
      plannedNetInvestment: 187_200,
      actualLeads: 220,
      referenceCpl: 850.9090909090909,
      estimatedImpressions: 4_320_000,
    });

    expect(summarizeFinanceiroPartners([
      { id: "webmotors", plannedNetInvestment: null, actualLeads: 4, estimatedImpressions: null },
    ])).toEqual({
      plannedNetInvestment: null,
      actualLeads: 4,
      referenceCpl: null,
      estimatedImpressions: null,
    });
  });

  it("usa /financeiro como endereço oficial e redireciona a URL legada", () => {
    expect(appSource).toContain('<Route path="/financeiro" component={Financeiro} />');
    expect(appSource).toContain('<Route path="/finaceiro"><Redirect to="/financeiro" /></Route>');
  });
});
