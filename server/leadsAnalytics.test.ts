import { describe, expect, it } from "vitest";
import {
  LEADS_UNAVAILABLE,
  buildLeadAnalytics,
  type LeadAnalyticsRow,
} from "./leadsAnalytics";

function row(
  correctedDate: string,
  channel: string,
  dealerName: string,
  model = "MG4",
  region = "SP",
): LeadAnalyticsRow {
  return { correctedDate, channel, dealerName, model, region };
}

describe("buildLeadAnalytics", () => {
  it("calcula totais e série empilhada sem dupla contagem, incluindo dias zerados", () => {
    const rows = [
      row("2026-07-01", "Site", "Dealer A"),
      row("2026-07-01", "Meta", "Dealer A"),
      row("2026-07-02", "Site", "Dealer B"),
      row("2026-07-03", "Site", "Dealer A"),
      row("2026-07-03", "Meta", LEADS_UNAVAILABLE),
    ];
    const result = buildLeadAnalytics({
      rows,
      pacingRows: rows,
      dateFrom: "2026-07-01",
      dateTo: "2026-07-04",
      competence: "2026-07",
      goal: 100,
    });

    expect(result.summary).toMatchObject({
      totalLeads: 5,
      dailyAverage: 1.25,
      primaryChannel: "Site",
      primaryChannelLeads: 3,
      activeChannels: 2,
      calendarDays: 4,
    });
    expect(result.daily).toHaveLength(4);
    expect(result.daily.at(-1)).toMatchObject({ date: "2026-07-04", total: 0 });
    expect(result.daily.reduce((sum, point) => sum + point.total, 0)).toBe(5);
    expect(result.channels.reduce((sum, item) => sum + item.leads, 0)).toBe(5);
  });

  it("reconcilia auditoria por concessionária e separa registros indisponíveis", () => {
    const rows = [
      row("2026-07-01", "Site", "Dealer A"),
      row("2026-07-01", "Meta", "Dealer A"),
      row("2026-07-02", "Site", "Dealer B"),
      row("2026-07-03", "Site", "Dealer A"),
      row("2026-07-03", "Meta", LEADS_UNAVAILABLE),
    ];
    const result = buildLeadAnalytics({
      rows,
      pacingRows: rows,
      dateFrom: "2026-07-01",
      dateTo: "2026-07-03",
      competence: "2026-07",
      goal: 100,
    });

    expect(result.dealerAudit.summary).toEqual({
      validDealers: 2,
      assignedLeads: 4,
      unavailableLeads: 1,
      assignedSharePercent: 80,
      dealersReceivingOnLatestDay: 1,
      latestDay: "2026-07-03",
    });
    expect(result.dealerAudit.dealers).toEqual([
      expect.objectContaining({
        dealerName: "Dealer A",
        leads: 3,
        activeDays: 2,
        inactiveDays: 1,
        firstReceiptDate: "2026-07-01",
        lastReceiptDate: "2026-07-03",
        latestDayLeads: 1,
        daysSinceLastReceipt: 0,
        receiptStatus: "RECEIVING",
      }),
      expect.objectContaining({
        dealerName: "Dealer B",
        leads: 1,
        activeDays: 1,
        inactiveDays: 2,
        lastReceiptDate: "2026-07-02",
        latestDayLeads: 0,
        daysSinceLastReceipt: 1,
        receiptStatus: "NO_RECEIPT",
      }),
    ]);
    expect(result.dealerAudit.unavailable).toEqual(
      expect.objectContaining({
        dealerName: LEADS_UNAVAILABLE,
        leads: 1,
        isUnavailable: true,
        receiptStatus: "UNAVAILABLE",
      }),
    );

    const auditedTotal =
      result.dealerAudit.dealers.reduce((sum, item) => sum + item.leads, 0) +
      (result.dealerAudit.unavailable?.leads ?? 0);
    expect(auditedTotal).toBe(result.summary.totalLeads);
    expect(result.dealerAudit.daily.reduce((sum, point) => sum + point.leads, 0)).toBe(
      result.summary.totalLeads,
    );
  });

  it("calcula pacing mensal pelo último dia com dados do próprio mês", () => {
    const pacingRows = Array.from({ length: 19 }, (_, day) =>
      Array.from({ length: 10 }, () => ({ correctedDate: `2026-07-${String(day + 1).padStart(2, "0")}` })),
    ).flat();
    const result = buildLeadAnalytics({
      rows: [],
      pacingRows,
      dateFrom: "2026-07-13",
      dateTo: "2026-07-19",
      competence: "2026-07",
      goal: 310,
    });

    expect(result.pacing).toMatchObject({
      goal: 310,
      current: 190,
      closedDays: 19,
      daysInMonth: 31,
      daysRemaining: 12,
      averagePerDay: 10,
      requiredPerDay: 10,
      projection: 310,
      projectedDifference: 0,
      remainingToGoal: 120,
      asOfDate: "2026-07-19",
      status: "ON_TRACK",
    });
    expect(result.pacing.progressPercent).toBeCloseTo(61.29, 2);
  });
});
