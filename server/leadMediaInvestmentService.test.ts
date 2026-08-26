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
  buildLeadMediaInvestmentReference,
  getAugustMetaBudgetPlan,
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

  it("calcula CPL sobre os Leads exibidos e soma apenas Google, Meta e TikTok", () => {
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
