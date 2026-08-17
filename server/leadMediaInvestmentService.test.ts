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
  buildLeadMediaInvestmentReference,
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
