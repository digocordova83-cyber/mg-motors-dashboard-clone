import { describe, expect, it } from "vitest";

import { buildMetaAdsPacing } from "./metaAdsPacing";

describe("pacing de Meta Ads", () => {
  it("calcula orçamento líquido de outubro por dia, realizado, saldo e projeção", () => {
    const result = buildMetaAdsPacing({
      dateFrom: "2026-10-01",
      dateTo: "2026-10-03",
      daily: [
        { date: "2026-10-01", spend: 4_000 },
        { date: "2026-10-03", spend: 8_000 },
      ],
    });

    expect(result).toMatchObject({
      competence: "2026-10",
      monthlyNetBudget: 129_296.43,
      calendarDays: 31,
      coveredDays: 3,
      daysRemaining: 28,
      dataThroughDate: "2026-10-03",
      dailyPlannedSpend: 4_170.85,
      actualSpend: 12_000,
      plannedSpendToDate: 12_512.56,
      varianceToPlan: -512.56,
      pacingPercent: 95.9,
      projectedMonthlySpend: 124_000,
      remainingBudget: 117_296.43,
      requiredDailySpend: 4_189.16,
      status: "ON_TRACK",
      source: "USER_CONFIRMED_NET_BUDGET",
    });
    expect(result?.daily).toEqual([
      {
        date: "2026-10-01",
        actualSpend: 4_000,
        plannedSpend: 4_170.85,
        actualCumulativeSpend: 4_000,
        plannedCumulativeSpend: 4_170.85,
      },
      {
        date: "2026-10-02",
        actualSpend: 0,
        plannedSpend: 4_170.85,
        actualCumulativeSpend: 4_000,
        plannedCumulativeSpend: 8_341.71,
      },
      {
        date: "2026-10-03",
        actualSpend: 8_000,
        plannedSpend: 4_170.85,
        actualCumulativeSpend: 12_000,
        plannedCumulativeSpend: 12_512.56,
      },
    ]);
  });

  it("classifica desvio relevante para cima ou para baixo", () => {
    const ahead = buildMetaAdsPacing({
      dateFrom: "2026-10-01",
      dateTo: "2026-10-01",
      daily: [{ date: "2026-10-01", spend: 5_000 }],
    });
    const behind = buildMetaAdsPacing({
      dateFrom: "2026-10-01",
      dateTo: "2026-10-01",
      daily: [{ date: "2026-10-01", spend: 3_000 }],
    });

    expect(ahead?.status).toBe("AHEAD");
    expect(behind?.status).toBe("BEHIND");
  });

  it("não aplica pacing mensal a período parcial ou competência sem verba confirmada", () => {
    expect(
      buildMetaAdsPacing({
        dateFrom: "2026-10-02",
        dateTo: "2026-10-03",
        daily: [{ date: "2026-10-02", spend: 100 }],
      }),
    ).toBeNull();
    expect(
      buildMetaAdsPacing({
        dateFrom: "2026-09-01",
        dateTo: "2026-09-30",
        daily: [{ date: "2026-09-01", spend: 100 }],
      }),
    ).toBeNull();
  });
});
