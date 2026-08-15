import { describe, expect, it } from "vitest";
import {
  canonicalizeDealerForAnalytics,
  canonicalizeDealerName,
  getDealerMappingStats,
  getOfficialDealerDirectoryStats,
  getOfficialLeadDealers,
  getOfficialDealers,
  isDealerQualificationPlaceholder,
  isExplicitDealerAlias,
  normalizeDealerLookupKey,
} from "./dealerNormalization";
import { buildLeadAnalytics, type LeadAnalyticsRow } from "./leadsAnalytics";

describe("dealer normalization", () => {
  it("normaliza caixa, acentos e pontuação somente para localizar aliases explícitos", () => {
    expect(normalizeDealerLookupKey("  Savol — São Caetano  ")).toBe("SAVOL SAO CAETANO");
    expect(canonicalizeDealerName("Savol São Caetano - 3966183")).toBe("SAVOL ZL/SP");
    expect(canonicalizeDealerName("DRSUL POA")).toBe("DRSUL - PORTO ALEGRE");
    expect(canonicalizeDealerName("Barigui Curitiba - 3964357")).toBe("BARIGUI - CURITIBA");
    expect(isExplicitDealerAlias("orvel_shopping_vitória_-_vitória/es_")).toBe(true);
    expect(canonicalizeDealerName("orvel_shopping_vitória_-_vitória/es_")).toBe("ORVEL - VITÓRIA");
    expect(canonicalizeDealerName("mg_inglaterra_salvador_shopping_-_salvador/ba_")).toBe("Indiana Salvador - 3966031");
    expect(canonicalizeDealerName("MEGAMIT - ALPHAVILLE")).toBe("Baltic Shopping Tamboré");
    expect(canonicalizeDealerName("DS AUTOMOTOR")).toBe("DÃO SILVEIRA NATAL");
    expect(canonicalizeDealerName("Baltic — Alphaville/SP")).toBe("Baltic Shopping Tamboré");
    expect(canonicalizeDealerForAnalytics("Euroville — Juiz de Fora/MG")).toBe("EUROVILLE JUIZ DE FORA");
    expect(canonicalizeDealerForAnalytics("Euroville — Uberlândia/MG")).toBe("EUROVILLE UBERLANDIA");
    expect(canonicalizeDealerForAnalytics("Sinal — Av. Europa/SP")).toBe("SINAL AV EUROPA");
    expect(isExplicitDealerAlias("ligação_")).toBe(false);
  });

  it("preserva grafias desconhecidas sem agrupamento por aproximação", () => {
    expect(canonicalizeDealerName("Nova Concessionária Experimental")).toBe("Nova Concessionária Experimental");
    expect(canonicalizeDealerForAnalytics("Nova Concessionária Experimental")).toBe("Nova Concessionária Experimental");
  });

  it("agrupa Outros, vazios e placeholders como Leads em qualificação sem alterar nomes válidos", () => {
    for (const value of ["Outros", "Outro", "Unavailable", "Indisponível", "N/A", "Não informado", "Sem concessionária", "ig", "fb", "<test lead: dummy data for em_qual_concessionária_gostaria_de_ser_atendido?_>", "  "]) {
      expect(isDealerQualificationPlaceholder(value)).toBe(true);
      expect(canonicalizeDealerForAnalytics(value)).toBe("Indisponível");
    }
    expect(isDealerQualificationPlaceholder("BARIGUI - CURITIBA")).toBe(false);
    expect(canonicalizeDealerForAnalytics("BARIGUI - CURITIBA")).toBe("BARIGUI - CURITIBA");
  });

  it("expõe a procedência e a cobertura validada da nova planilha de origem", () => {
    const stats = getDealerMappingStats();
    expect(stats).toMatchObject({
      sourceWorkbook: "pasted_file_5zD9JE_Delears_nova_tratada(1).xlsx",
      sourceSheet: "Página1",
      sourceRowCount: 86,
      mappingCount: 86,
      uniqueAliasCount: 75,
      canonicalCount: 25,
    });
    expect(stats.sourceModifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("expõe o cadastro oficial atualizado com os 31 dealers e os quatro nomes antes não correspondidos", () => {
    const stats = getOfficialDealerDirectoryStats();
    expect(stats).toMatchObject({
      sourceWorkbook: "Dealers_atualizado.xlsx",
      sourceSheet: "Página1",
      dealerCount: 31,
    });
    expect(stats.sourceSha256).toMatch(/^[a-f0-9]{64}$/);

    const byName = new Map(getOfficialDealers().map(dealer => [dealer.name, dealer]));
    expect(byName.get("HG ARACAJU")).toMatchObject({ code: "271959", operationalArea: "ARACAJU/SE" });
    expect(byName.get("LA FONTAINE JOINVILLE")).toMatchObject({ code: "272046", operationalArea: "JOINVILLE/SC" });
    expect(byName.get("AUTOBRAND RECIFE")).toMatchObject({ code: "272056", operationalArea: "RECIFE/PE" });
    expect(byName.get("SINAL AV EUROPA")).toMatchObject({ code: "271958", operationalArea: "SAO PAULO/SP" });
  });

  it("combina o cadastro oficial e a unidade pública auditada com área operacional para análises geográficas", () => {
    const byName = new Map(getOfficialLeadDealers().map(dealer => [dealer.name, dealer]));

    expect(byName.size).toBe(32);
    expect(byName.get("CANOPUS PANTANAL SHOPPING")).toMatchObject({
      code: null,
      operationalArea: "CUIABA/MT",
    });
    expect(byName.get("BARIGUI CURITIBA")).toMatchObject({ operationalArea: "CURITIBA/PR" });
  });

  it("consolida placeholders e aliases antes da auditoria sem alterar o total geral ou os dados de origem", () => {
    const rows: LeadAnalyticsRow[] = [
      { correctedDate: "2026-07-01", channel: "Google", model: "MG4", region: "Sul", dealerName: "Barigui Curitiba" },
      { correctedDate: "2026-07-01", channel: "Meta", model: "MG4", region: "Sul", dealerName: "BARIGUI CURITIBA" },
      { correctedDate: "2026-07-02", channel: "Google", model: "MGS5", region: "Sul", dealerName: "Barigui Curitiba - 3964357" },
      { correctedDate: "2026-07-02", channel: "Meta", model: "MGS5", region: "Sul", dealerName: "Outros" },
      { correctedDate: "2026-07-02", channel: "Site", model: "MGS5", region: "Sul", dealerName: "Unavailable" },
    ];

    const analytics = buildLeadAnalytics({
      rows,
      pacingRows: rows,
      dateFrom: "2026-07-01",
      dateTo: "2026-07-02",
      competence: "2026-07",
      goal: null,
    });

    expect(analytics.summary.totalLeads).toBe(5);
    expect(analytics.dealers).toEqual([
      { value: "BARIGUI - CURITIBA", leads: 3, dailyAverage: 1.5, sharePercent: 60 },
      { value: "Indisponível", leads: 2, dailyAverage: 1, sharePercent: 40 },
    ]);
    expect(analytics.dealerAudit.dealers).toHaveLength(1);
    expect(analytics.dealerAudit.dealers[0]).toMatchObject({ dealerName: "BARIGUI - CURITIBA", leads: 3 });
    expect(analytics.dealerAudit.unavailable).toMatchObject({
      dealerName: "Indisponível",
      leads: 2,
      isUnavailable: true,
    });
    expect(analytics.dealerAudit.summary).toMatchObject({ assignedLeads: 3, unavailableLeads: 2 });
    expect(rows.map(row => row.dealerName)).toEqual([
      "Barigui Curitiba",
      "BARIGUI CURITIBA",
      "Barigui Curitiba - 3964357",
      "Outros",
      "Unavailable",
    ]);
  });
});
