import { beforeEach, describe, expect, it, vi } from "vitest";

const mediaMocks = vi.hoisted(() => ({
  google: vi.fn(),
  meta: vi.fn(),
  tiktok: vi.fn(),
}));

vi.mock("./dashboardService", () => ({ loadDashboardData: mediaMocks.google }));
vi.mock("./metaAdsService", () => ({ loadMetaAdsData: mediaMocks.meta }));
vi.mock("./tiktokAdsService", () => ({ loadTikTokAdsData: mediaMocks.tiktok }));

import {
  applyAugustMetaBudget,
  AUGUST_META_BUDGET_CALENDAR_DAYS,
  AUGUST_META_MONTHLY_BUDGET,
  AUGUST_NET_MEDIA_MONTHLY_TOTAL,
  buildLeadMediaInvestmentReference,
  getAugustMetaBudgetPlan,
  getAugustNetMediaPlan,
  loadPaidMediaInvestmentMeasurements,
  type PaidMediaMeasurement,
} from "./leadMediaInvestmentService";

function measurement(
  channel: "Site" | "Meta" | "TikTok",
  investment: number | null,
  status: "AVAILABLE" | "PARTIAL" | "UNAVAILABLE" = "AVAILABLE",
): PaidMediaMeasurement {
  return {
    channel,
    platform:
      channel === "Site" ? "Google Ads" : channel === "Meta" ? "Meta Ads" : "TikTok Ads",
    investment,
    source: investment == null ? null : "persistent-snapshot",
    updatedAt: investment == null ? null : "2026-08-17T19:00:00.000Z",
    dataThroughDate: investment == null ? null : "2026-08-16",
    status,
    error: investment == null ? "indisponível" : null,
  };
}

describe("referência de investimento e CPL por canal", () => {
  it("aplica os sete valores líquidos aprovados e reconcilia o total de agosto", () => {
    const netPlan = getAugustNetMediaPlan("2026-08-01", "2026-08-31");
    expect(AUGUST_NET_MEDIA_MONTHLY_TOTAL).toBe(1_008_000);
    expect(netPlan).not.toBeNull();
    expect(netPlan?.periodNetInvestment).toBe(1_008_000);
    expect(netPlan?.channels).toEqual([
      expect.objectContaining({ channel: "Site", monthlyNetInvestment: 412_800, periodNetInvestment: 412_800 }),
      expect.objectContaining({ channel: "Meta", monthlyNetInvestment: 187_200, periodNetInvestment: 187_200 }),
      expect.objectContaining({ channel: "TikTok", monthlyNetInvestment: 28_800, periodNetInvestment: 28_800 }),
      expect.objectContaining({ channel: "Display", monthlyNetInvestment: 98_599.97, periodNetInvestment: 98_599.97 }),
      expect.objectContaining({ channel: "YouTube", monthlyNetInvestment: 25_386.95, periodNetInvestment: 25_386.95 }),
      expect.objectContaining({ channel: "Webmotors", monthlyNetInvestment: 178_413.08, periodNetInvestment: 178_413.08 }),
      expect.objectContaining({ channel: "Mercado Livre", monthlyNetInvestment: 76_800, periodNetInvestment: 76_800 }),
    ]);

    const result = buildLeadMediaInvestmentReference({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-31",
      channelLeads: [
        { value: "Site", leads: 3_498 },
        { value: "Meta", leads: 8_215 },
        { value: "TikTok", leads: 233 },
        { value: "TikTok Live", leads: 180 },
        { value: "Webmotors", leads: 1_470 },
        { value: "Mercado Livre", leads: 464 },
        { value: "Interlagos", leads: 326 },
      ],
      measurements: {
        Site: measurement("Site", 1),
        Meta: measurement("Meta", 1),
        TikTok: measurement("TikTok", 1),
      },
      netMediaPlan: netPlan,
    });

    expect(result.formula).toBe("AUGUST_NET_MEDIA_PLAN_RATE_DIVIDED_BY_CALENDAR_DAYS");
    expect(result.totalInvestment).toBe(1_008_000);
    expect(result.availableInvestment).toBe(1_008_000);
    expect(result.attributableInvestment).toBe(884_013.08);
    expect(result.paidMediaLeads).toBe(13_880);
    expect(result.estimatedOverallCpl).toBe(63.69);
    expect(result.channels).toHaveLength(7);
    expect(result.channels.find(item => item.channel === "Site")).toMatchObject({ leads: 3_498, referenceCpl: 118.01 });
    expect(result.channels.find(item => item.channel === "Meta")).toMatchObject({ leads: 8_215, referenceCpl: 22.79 });
    expect(result.channels.find(item => item.channel === "TikTok")).toMatchObject({ leads: 233, referenceCpl: 123.61 });
    expect(result.channels.find(item => item.channel === "Webmotors")).toMatchObject({ leads: 1_470, referenceCpl: 121.37 });
    expect(result.channels.find(item => item.channel === "Mercado Livre")).toMatchObject({ leads: 464, referenceCpl: 165.52 });
    expect(result.channels.find(item => item.channel === "Display")).toMatchObject({ leadChannel: null, leads: 0, referenceCpl: null });
    expect(result.channels.find(item => item.channel === "YouTube")).toMatchObject({ leadChannel: null, leads: 0, referenceCpl: null });
  });

  it("rateia BRL 187.200,00 por 31 dias e acumula somente até o D-1", () => {
    const plan = getAugustMetaBudgetPlan("2026-08-01", "2026-08-24");
    expect(AUGUST_META_MONTHLY_BUDGET).toBe(187_200);
    expect(AUGUST_META_BUDGET_CALENDAR_DAYS).toBe(31);
    expect(plan).toMatchObject({
      competence: "2026-08",
      elapsedDays: 24,
      dailyBudget: 6038.71,
      periodBudget: 144929.03,
    });

    const measurements = {
      Site: measurement("Site", 10_000),
      Meta: measurement("Meta", 5_000),
      TikTok: measurement("TikTok", 2_000),
    };
    const effective = applyAugustMetaBudget(measurements, plan);
    expect(effective.Meta).toMatchObject({
      investment: 144929.03,
      source: "august-meta-budget-plan",
      dataThroughDate: "2026-08-24",
      status: "AVAILABLE",
    });

    const result = buildLeadMediaInvestmentReference({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-24",
      channelLeads: [
        { value: "Site", leads: 1_000 },
        { value: "Meta", leads: 2_000 },
        { value: "TikTok", leads: 500 },
      ],
      measurements: effective,
      metaBudgetPlan: plan,
    });
    expect(result.formula).toBe("AUGUST_META_MONTHLY_BUDGET_RATE_DIVIDED_BY_CALENDAR_DAYS");
    expect(result.channels.find(item => item.channel === "Meta")).toMatchObject({
      leads: 2_000,
      referenceCpl: 72.46,
    });
    expect(result.metaBudgetPlan).toEqual(plan);
  });

  beforeEach(() => {
    mediaMocks.google.mockReset();
    mediaMocks.meta.mockReset();
    mediaMocks.tiktok.mockReset();
  });

  it("mantém o cálculo ao vivo restrito a Google, Meta e TikTok fora do plano líquido", () => {
    const result = buildLeadMediaInvestmentReference({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-16",
      channelLeads: [
        { value: "Site", leads: 2_149 },
        { value: "Meta", leads: 4_013 },
        { value: "TikTok", leads: 86 },
        { value: "Webmotors", leads: 542 },
        { value: "Mercado Livre", leads: 253 },
      ],
      measurements: {
        Site: measurement("Site", 232_549),
        Meta: measurement("Meta", 27_148.5),
        TikTok: measurement("TikTok", 2_077.91),
      },
    });

    expect(result.totalInvestment).toBe(261_775.41);
    expect(result.availableInvestment).toBe(261_775.41);
    expect(result.paidMediaLeads).toBe(6_248);
    expect(result.estimatedOverallCpl).toBe(41.9);
    expect(result.channels).toEqual([
      expect.objectContaining({ channel: "Site", leads: 2_149, referenceCpl: 108.21 }),
      expect.objectContaining({ channel: "Meta", leads: 4_013, referenceCpl: 6.77 }),
      expect.objectContaining({ channel: "TikTok", leads: 86, referenceCpl: 24.16 }),
    ]);
    expect(result.channels.some(item => item.channel === ("Webmotors" as never))).toBe(false);
  });

  it("não publica um total completo quando alguma fonte está parcial ou indisponível", () => {
    const result = buildLeadMediaInvestmentReference({
      dateFrom: "2026-08-01",
      dateTo: "2026-08-16",
      channelLeads: [
        { value: "Site", leads: 2_149 },
        { value: "Meta", leads: 4_013 },
        { value: "TikTok", leads: 86 },
      ],
      measurements: {
        Site: measurement("Site", 232_549),
        Meta: measurement("Meta", 27_148.5, "PARTIAL"),
        TikTok: measurement("TikTok", null, "UNAVAILABLE"),
      },
    });

    expect(result.totalInvestment).toBeNull();
    expect(result.availableInvestment).toBe(259_697.5);
    expect(result.paidMediaLeads).toBe(6_248);
    expect(result.estimatedOverallCpl).toBeNull();
    expect(result.allSourcesAvailable).toBe(false);
    expect(result.channels.find(item => item.channel === "TikTok")?.referenceCpl).toBeNull();
  });

  it("consulta as três fontes no mesmo período e preserva falhas de forma independente", async () => {
    mediaMocks.google.mockResolvedValue({
      summary: { investment: 232_549 },
      metadata: {
        source: "persistent-snapshot",
        updatedAt: "2026-08-17T11:36:15.632Z",
        lastClosedDate: "2026-08-16",
      },
    });
    mediaMocks.meta.mockRejectedValue(new Error("Meta temporariamente indisponível"));
    mediaMocks.tiktok.mockResolvedValue({
      summary: { spend: 2_077.91 },
      metadata: {
        source: "windsor-live",
        updatedAt: "2026-08-17T19:12:22.286Z",
        dataThroughDate: "2026-08-16",
      },
    });

    const result = await loadPaidMediaInvestmentMeasurements("2026-08-01", "2026-08-16");

    expect(mediaMocks.google).toHaveBeenCalledWith("2026-08-01", "2026-08-16");
    expect(mediaMocks.meta).toHaveBeenCalledWith("2026-08-01", "2026-08-16");
    expect(mediaMocks.tiktok).toHaveBeenCalledWith("2026-08-01", "2026-08-16");
    expect(result.Site).toMatchObject({ investment: 232_549, status: "AVAILABLE" });
    expect(result.Meta).toMatchObject({ investment: null, status: "UNAVAILABLE" });
    expect(result.TikTok).toMatchObject({ investment: 2_077.91, status: "AVAILABLE" });
  });
});
