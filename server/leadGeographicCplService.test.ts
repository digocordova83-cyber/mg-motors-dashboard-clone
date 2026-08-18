import { describe, expect, it } from "vitest";
import type { LeadDealerAudit } from "./leadsAnalytics";
import {
  buildLeadGeographicCplReference,
  type GeographicCplDealerTarget,
} from "./leadGeographicCplService";
import type { PaidMediaMeasurement } from "./leadMediaInvestmentService";

function measurement(
  channel: "Site" | "Meta" | "TikTok",
  investment: number | null,
  status: "AVAILABLE" | "PARTIAL" | "UNAVAILABLE" = "AVAILABLE",
): PaidMediaMeasurement {
  return {
    channel,
    platform: channel === "Site" ? "Google Ads" : channel === "Meta" ? "Meta Ads" : "TikTok Ads",
    investment,
    source: investment == null ? null : "persistent-snapshot",
    updatedAt: investment == null ? null : "2026-08-18T12:00:00.000Z",
    dataThroughDate: investment == null ? null : "2026-08-17",
    status,
    error: investment == null ? "indisponível" : null,
  };
}

function auditItem(
  dealerName: string,
  channels: Array<{ value: string; leads: number }>,
  isUnavailable = false,
) {
  const leads = channels.reduce((sum, channel) => sum + channel.leads, 0);
  return {
    dealerName,
    leads,
    dailyAverage: leads,
    sharePercent: 0,
    channels: channels.map(channel => ({ ...channel, sharePercent: 0, dailyAverage: channel.leads })),
    activeDays: 1,
    inactiveDays: 0,
    firstReceiptDate: "2026-08-01",
    lastReceiptDate: "2026-08-01",
    latestDayLeads: leads,
    daysSinceLastReceipt: 0,
    isUnavailable,
    receiptStatus: isUnavailable ? "UNAVAILABLE" : "RECEIVING",
  } as LeadDealerAudit["dealers"][number];
}

const targets: GeographicCplDealerTarget[] = [
  {
    canonicalDealer: "DEALER A",
    canonicalDealerKey: "dealer a",
    stateCode: "SP",
    channelTargets: { google: 60, meta: 30, tiktok: 10 },
  },
  {
    canonicalDealer: "DEALER B",
    canonicalDealerKey: "dealer b",
    stateCode: "RJ",
    channelTargets: { google: 40, meta: 70, tiktok: 90 },
  },
];

const dealerAudit = {
  summary: {
    validDealers: 2,
    assignedLeads: 35,
    unavailableLeads: 2,
    assignedSharePercent: 94.59,
    dealersReceivingOnLatestDay: 2,
    latestDay: "2026-08-17",
  },
  dealers: [
    auditItem("DEALER A", [
      { value: "Site", leads: 10 },
      { value: "Meta", leads: 5 },
      { value: "TikTok", leads: 1 },
      { value: "Webmotors", leads: 20 },
    ]),
    auditItem("DEALER B", [
      { value: "Site", leads: 5 },
      { value: "Meta", leads: 10 },
      { value: "TikTok", leads: 4 },
    ]),
  ],
  unavailable: auditItem("Indisponível", [
    { value: "Site", leads: 1 },
    { value: "Meta", leads: 1 },
  ], true),
  daily: [],
} satisfies LeadDealerAudit;

describe("CPL estimado por estado e dealer", () => {
  it("aloca cada canal pelas metas do canal e reconcilia exatamente os centavos", () => {
    const result = buildLeadGeographicCplReference({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-17",
      competence: "2026-08",
      dealerAudit,
      dealerTargets: targets,
      measurements: {
        Site: measurement("Site", 1_000),
        Meta: measurement("Meta", 200),
        TikTok: measurement("TikTok", 100),
      },
    });

    expect(result.totalInvestment).toBe(1_300);
    expect(result.paidMediaLeads).toBe(37);
    expect(result.assignedPaidMediaLeads).toBe(35);
    expect(result.unavailableDealerPaidMediaLeads).toBe(2);
    expect(result.unmatchedDealerPaidMediaLeads).toBe(0);
    expect(result.dealerCoveragePercent).toBe(94.59);
    expect(result.estimatedOverallCpl).toBe(35.14);
    expect(result.dealers).toEqual([
      expect.objectContaining({
        dealerName: "DEALER B",
        stateCode: "RJ",
        leads: 19,
        investment: 630,
        estimatedCpl: 33.16,
        channelInvestment: { Site: 400, Meta: 140, TikTok: 90 },
      }),
      expect.objectContaining({
        dealerName: "DEALER A",
        stateCode: "SP",
        leads: 16,
        investment: 670,
        estimatedCpl: 41.88,
        channelInvestment: { Site: 600, Meta: 60, TikTok: 10 },
      }),
    ]);
    expect(result.dealers.reduce((sum, dealer) => sum + dealer.availableInvestment, 0)).toBe(1_300);
    expect(result.states.reduce((sum, state) => sum + state.availableInvestment, 0)).toBe(1_300);
  });

  it("não publica CPL consolidado quando alguma plataforma tem cobertura parcial", () => {
    const result = buildLeadGeographicCplReference({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-17",
      competence: "2026-08",
      dealerAudit,
      dealerTargets: targets,
      measurements: {
        Site: measurement("Site", 1_000),
        Meta: measurement("Meta", 200, "PARTIAL"),
        TikTok: measurement("TikTok", null, "UNAVAILABLE"),
      },
    });

    expect(result.status).toBe("PARTIAL");
    expect(result.allSourcesAvailable).toBe(false);
    expect(result.availableInvestment).toBe(1_200);
    expect(result.totalInvestment).toBeNull();
    expect(result.estimatedOverallCpl).toBeNull();
    expect(result.dealers.every(dealer => dealer.investment === null && dealer.estimatedCpl === null)).toBe(true);
  });
});
