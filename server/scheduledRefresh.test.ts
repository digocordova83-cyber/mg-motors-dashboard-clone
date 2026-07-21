import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./_core/sdk", () => ({
  sdk: {
    authenticateRequest: vi.fn(),
  },
}));

import { sdk } from "./_core/sdk";
import {
  dailyRefreshHandler,
  executeDailyRefresh,
  getPreviousCompleteDate,
} from "./scheduledRefresh";

const googleSuccess = {
  daily: [{ date: "2026-07-20" }],
  summary: { investment: 100, conversions: 5 },
  metadata: {
    source: "windsor-live",
    updatedAt: "2026-07-21T11:30:00.000Z",
    rowCount: 3,
    campaignCount: 2,
    lastClosedDate: "2026-07-20",
  },
};

const metaSuccess = {
  daily: [{ date: "2026-07-20" }],
  summary: { spend: 80, leads: 4 },
  metadata: {
    source: "windsor-live",
    updatedAt: "2026-07-21T11:30:00.000Z",
    dataThroughDate: "2026-07-20",
    rowCounts: { daily: 1, campaigns: 2, creatives: 3 },
  },
};

function buildDependencies(overrides: Record<string, unknown> = {}) {
  return {
    loadGoogleAds: vi.fn(async () => googleSuccess as never),
    loadMetaAds: vi.fn(async () => metaSuccess as never),
    persistRefresh: vi.fn(async () => undefined as never),
    now: () => new Date("2026-07-21T11:30:00.000Z"),
    ...overrides,
  };
}

describe("daily scheduled D-1 refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calcula D-1 pelo calendário de America/Sao_Paulo", () => {
    expect(getPreviousCompleteDate(new Date("2026-07-21T11:30:00.000Z"))).toBe(
      "2026-07-20",
    );
    expect(getPreviousCompleteDate(new Date("2026-07-21T01:00:00.000Z"))).toBe(
      "2026-07-19",
    );
  });

  it("atualiza as duas fontes para o mesmo D-1 e persiste uma identidade por fonte/data", async () => {
    const dependencies = buildDependencies();

    const result = await executeDailyRefresh(
      { date: "2026-07-20", taskUid: "task_daily" },
      dependencies as never,
    );

    expect(result.ok).toBe(true);
    expect(result.partialFailure).toBe(false);
    expect(dependencies.loadGoogleAds).toHaveBeenCalledWith(
      "2026-07-20",
      "2026-07-20",
    );
    expect(dependencies.loadMetaAds).toHaveBeenCalledWith(
      "2026-07-20",
      "2026-07-20",
    );
    expect(dependencies.persistRefresh).toHaveBeenCalledTimes(2);
    expect(dependencies.persistRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "GOOGLE_ADS",
        refreshDate: "2026-07-20",
        status: "SUCCESS",
        taskUid: "task_daily",
      }),
    );
    expect(dependencies.persistRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "META_ADS",
        refreshDate: "2026-07-20",
        status: "SUCCESS",
        taskUid: "task_daily",
      }),
    );
  });

  it("registra falha parcial sem apagar o sucesso independente da outra fonte", async () => {
    const dependencies = buildDependencies({
      loadGoogleAds: vi.fn(async () => ({
        ...googleSuccess,
        daily: [],
        metadata: { ...googleSuccess.metadata, source: "windsor-snapshot" },
      }) as never),
    });

    const result = await executeDailyRefresh(
      { date: "2026-07-20", taskUid: "task_daily" },
      dependencies as never,
    );

    expect(result.ok).toBe(false);
    expect(result.partialFailure).toBe(true);
    expect(result.googleAds.status).toBe("FAILED");
    expect(result.metaAds.status).toBe("SUCCESS");
    expect(dependencies.persistRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "GOOGLE_ADS",
        status: "FAILED",
      }),
    );
  });

  it("bloqueia requisições que não estejam autenticadas como cron", async () => {
    vi.mocked(sdk.authenticateRequest).mockRejectedValueOnce(new Error("forbidden"));
    const status = vi.fn().mockReturnThis();
    const json = vi.fn().mockReturnThis();

    await dailyRefreshHandler(
      { originalUrl: "/api/scheduled/daily-refresh", headers: {} } as never,
      { status, json } as never,
    );

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ error: "cron-only" });
  });
});
