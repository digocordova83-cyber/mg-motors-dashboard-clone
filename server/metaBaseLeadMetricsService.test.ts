import { describe, expect, it } from "vitest";
import {
  META_BASE_TIME_ZONE,
  normalizeMetaBaseDailyMetrics,
} from "./metaBaseLeadMetricsService";

describe("métricas diárias da aba Meta", () => {
  it("normaliza, ordena e conserva somente contagens agregadas", () => {
    expect(
      normalizeMetaBaseDailyMetrics([
        { date: "2026-10-08", sourceRows: 179.8, uniqueLeadIds: 179.2 },
        { date: "2026-10-07", sourceRows: 243, uniqueLeadIds: 243 },
        { date: "2026-10-08", sourceRows: 179, uniqueLeadIds: 179 },
      ]),
    ).toEqual([
      { date: "2026-10-07", sourceRows: 243, uniqueLeadIds: 243 },
      { date: "2026-10-08", sourceRows: 179, uniqueLeadIds: 179 },
    ]);
    expect(META_BASE_TIME_ZONE).toBe("America/Sao_Paulo");
  });

  it("rejeita métricas impossíveis ou datas não ISO", () => {
    expect(() =>
      normalizeMetaBaseDailyMetrics([
        { date: "08/10/2026", sourceRows: 179, uniqueLeadIds: 179 },
      ]),
    ).toThrow("AAAA-MM-DD");
    expect(() =>
      normalizeMetaBaseDailyMetrics([
        { date: "2026-10-08", sourceRows: 100, uniqueLeadIds: 101 },
      ]),
    ).toThrow("Identificadores únicos");
  });
});
