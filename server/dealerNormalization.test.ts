import { describe, expect, it } from "vitest";
import {
  canonicalizeDealerName,
  getDealerMappingStats,
  isExplicitDealerAlias,
  normalizeDealerLookupKey,
} from "./dealerNormalization";
import { buildLeadAnalytics, type LeadAnalyticsRow } from "./leadsAnalytics";

describe("dealer normalization", () => {
  it("normaliza caixa, acentos e pontuação somente para localizar aliases explícitos", () => {
    expect(normalizeDealerLookupKey("  Savol — São Caetano  ")).toBe("SAVOL SAO CAETANO");
    expect(canonicalizeDealerName("Savol São Caetano - 3966183")).toBe("SAVOL - SÃO CAETANO");
    expect(canonicalizeDealerName("DRSUL POA")).toBe("DRSUL - PORTO ALEGRE");
    expect(canonicalizeDealerName("Barigui Curitiba - 3964357")).toBe("BARIGUI - CURITIBA");
    expect(isExplicitDealerAlias("orvel_shopping_vitória_-_vitória/es_")).toBe(true);
    expect(isExplicitDealerAlias("ligação_")).toBe(false);
  });

  it("preserva grafias desconhecidas sem agrupamento por aproximação", () => {
    expect(canonicalizeDealerName("Nova Concessionária Experimental")).toBe("Nova Concessionária Experimental");
  });

  it("expõe a procedência e a cobertura validada da nova planilha de origem", () => {
    const stats = getDealerMappingStats();
    expect(stats).toMatchObject({
      sourceWorkbook: "pasted_file_5zD9JE_Delears_nova_tratada(1).xlsx",
      sourceSheet: "Página1",
      sourceRowCount: 86,
      mappingCount: 86,
      uniqueAliasCount: 75,
      canonicalCount: 26,
    });
    expect(stats.sourceModifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("consolida aliases antes da auditoria sem alterar o total geral ou os dados de origem", () => {
    const rows: LeadAnalyticsRow[] = [
      { correctedDate: "2026-07-01", channel: "Google", model: "MG4", region: "Sul", dealerName: "Barigui Curitiba" },
      { correctedDate: "2026-07-01", channel: "Meta", model: "MG4", region: "Sul", dealerName: "BARIGUI CURITIBA" },
      { correctedDate: "2026-07-02", channel: "Google", model: "MGS5", region: "Sul", dealerName: "Barigui Curitiba - 3964357" },
    ];

    const analytics = buildLeadAnalytics({
      rows,
      pacingRows: rows,
      dateFrom: "2026-07-01",
      dateTo: "2026-07-02",
      competence: "2026-07",
      goal: null,
    });

    expect(analytics.summary.totalLeads).toBe(3);
    expect(analytics.dealers).toEqual([
      { value: "BARIGUI - CURITIBA", leads: 3, dailyAverage: 1.5, sharePercent: 100 },
    ]);
    expect(analytics.dealerAudit.dealers).toHaveLength(1);
    expect(analytics.dealerAudit.dealers[0]).toMatchObject({ dealerName: "BARIGUI - CURITIBA", leads: 3 });
    expect(rows.map(row => row.dealerName)).toEqual([
      "Barigui Curitiba",
      "BARIGUI CURITIBA",
      "Barigui Curitiba - 3964357",
    ]);
  });
});
