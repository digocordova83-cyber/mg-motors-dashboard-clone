import type { Request, Response } from "express";
import {
  addIsoDays,
  DASHBOARD_TIME_ZONE,
  formatIsoDateInTimeZone,
} from "@shared/dashboardDates";
import { loadDashboardData } from "./dashboardService";
import { loadMetaAdsData } from "./metaAdsService";
import { loadTikTokAdsData } from "./tiktokAdsService";
import {
  recordDashboardSourceRefresh,
  type DashboardRefreshSource,
} from "./db";
import { sdk } from "./_core/sdk";

export const DAILY_REFRESH_TIMEZONE = DASHBOARD_TIME_ZONE;
export const GOOGLE_ADS_DEFAULT_WINDOW_DAYS = 30;
export const META_ADS_DEFAULT_WINDOW_DAYS = 7;
export const TIKTOK_ADS_DEFAULT_WINDOW_DAYS = 7;

type SerializableMetadata = Record<string, number | string | boolean | null>;

type SourceRefreshResult = {
  source: DashboardRefreshSource;
  ok: boolean;
  status: "SUCCESS" | "FAILED";
  date: string;
  liveSource: string | null;
  completedAt: string;
  auditPersisted: boolean;
  metadata: SerializableMetadata;
  error: string | null;
};

export type DailyRefreshResult = {
  ok: boolean;
  partialFailure: boolean;
  date: string;
  timezone: typeof DAILY_REFRESH_TIMEZONE;
  startedAt: string;
  completedAt: string;
  taskUid: string;
  googleAds: SourceRefreshResult;
  metaAds: SourceRefreshResult;
  tiktokAds: SourceRefreshResult;
};

type RefreshDependencies = {
  loadGoogleAds: typeof loadDashboardData;
  loadMetaAds: typeof loadMetaAdsData;
  loadTikTokAds: typeof loadTikTokAdsData;
  persistRefresh: typeof recordDashboardSourceRefresh;
  now: () => Date;
};

const defaultDependencies: RefreshDependencies = {
  loadGoogleAds: loadDashboardData,
  loadMetaAds: loadMetaAdsData,
  loadTikTokAds: loadTikTokAdsData,
  persistRefresh: recordDashboardSourceRefresh,
  now: () => new Date(),
};

export function getPreviousCompleteDate(
  now: Date,
  timeZone = DAILY_REFRESH_TIMEZONE,
) {
  return addIsoDays(formatIsoDateInTimeZone(now, timeZone), -1);
}

function serializeError(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function persistResult(
  dependencies: RefreshDependencies,
  input: {
    source: DashboardRefreshSource;
    date: string;
    taskUid: string;
    status: "SUCCESS" | "FAILED";
    completedAt: Date;
    liveSource: string | null;
    metadata: SerializableMetadata;
    error: string | null;
  },
) {
  await dependencies.persistRefresh({
    source: input.source,
    refreshDate: input.date,
    periodFrom: input.date,
    periodTo: input.date,
    status: input.status,
    attemptedAt: input.completedAt.getTime(),
    taskUid: input.taskUid,
    liveSource: input.liveSource,
    metadata: input.metadata,
    error: input.error,
  });
}

async function refreshSource(
  dependencies: RefreshDependencies,
  input: {
    source: DashboardRefreshSource;
    date: string;
    taskUid: string;
    load: () => Promise<{
      liveSource: string;
      complete: boolean;
      metadata: SerializableMetadata;
    }>;
  },
): Promise<SourceRefreshResult> {
  let liveSource: string | null = null;
  let metadata: SerializableMetadata = {};
  let status: "SUCCESS" | "FAILED" = "FAILED";
  let errorMessage: string | null = null;

  try {
    const result = await input.load();
    liveSource = result.liveSource;
    metadata = result.metadata;
    if (!result.complete) {
      throw new Error(
        `A fonte ${result.liveSource} não retornou dados completos para ${input.date}`,
      );
    }
    status = "SUCCESS";
  } catch (error) {
    errorMessage = serializeError(error);
  }

  const completedAt = dependencies.now();
  let auditPersisted = true;
  try {
    await persistResult(dependencies, {
      source: input.source,
      date: input.date,
      taskUid: input.taskUid,
      status,
      completedAt,
      liveSource,
      metadata,
      error: errorMessage,
    });
  } catch (auditError) {
    auditPersisted = false;
    const auditMessage = `Falha ao persistir auditoria: ${serializeError(auditError)}`;
    errorMessage = errorMessage ? `${errorMessage}; ${auditMessage}` : auditMessage;
  }

  return {
    source: input.source,
    ok: status === "SUCCESS" && auditPersisted,
    status,
    date: input.date,
    liveSource,
    completedAt: completedAt.toISOString(),
    auditPersisted,
    metadata,
    error: errorMessage,
  };
}

export async function executeDailyRefresh(
  input: { date: string; taskUid: string },
  dependencies: RefreshDependencies = defaultDependencies,
): Promise<DailyRefreshResult> {
  const startedAt = dependencies.now();
  // O job continua validando e auditando D-1, mas busca os mesmos intervalos
  // iniciais da interface. Assim, a chamada diária também aquece o snapshot
  // que atende o primeiro acesso após cold start, sem aumentar o número de
  // consultas externas por fonte.
  const googleDateFrom = addIsoDays(
    input.date,
    -(GOOGLE_ADS_DEFAULT_WINDOW_DAYS - 1),
  );
  const metaDateFrom = addIsoDays(
    input.date,
    -(META_ADS_DEFAULT_WINDOW_DAYS - 1),
  );
  const tiktokDateFrom = addIsoDays(
    input.date,
    -(TIKTOK_ADS_DEFAULT_WINDOW_DAYS - 1),
  );

  const [googleAds, metaAds, tiktokAds] = await Promise.all([
    refreshSource(dependencies, {
      source: "GOOGLE_ADS",
      date: input.date,
      taskUid: input.taskUid,
      load: async () => {
        const data = await dependencies.loadGoogleAds(googleDateFrom, input.date, {
          forceRefresh: true,
        });
        const hasClosedDay = data.daily.some(row => row.date === input.date);
        const liveSource = data.metadata.source;
        return {
          liveSource,
          complete: hasClosedDay && liveSource === "windsor-live",
          metadata: {
            rowCount: data.metadata.rowCount,
            campaignCount: data.metadata.campaignCount,
            dataThroughDate: data.metadata.lastClosedDate ?? null,
            investment: data.summary.investment,
            conversions: data.summary.conversions,
            updatedAt: data.metadata.updatedAt,
            warmedFrom: googleDateFrom,
            warmedTo: input.date,
          },
        };
      },
    }),
    refreshSource(dependencies, {
      source: "META_ADS",
      date: input.date,
      taskUid: input.taskUid,
      load: async () => {
        const data = await dependencies.loadMetaAds(metaDateFrom, input.date, {
          forceRefresh: true,
        });
        const liveSource = data.metadata.source;
        return {
          liveSource,
          complete:
            data.metadata.dataThroughDate === input.date &&
            data.daily.some(row => row.date === input.date) &&
            liveSource === "windsor-live",
          metadata: {
            dailyRows: data.metadata.rowCounts.daily ?? 0,
            campaignRows: data.metadata.rowCounts.campaigns ?? 0,
            creativeRows: data.metadata.rowCounts.creatives ?? 0,
            dataThroughDate: data.metadata.dataThroughDate,
            spend: data.summary.spend,
            leads: data.summary.leads,
            updatedAt: data.metadata.updatedAt,
            warmedFrom: metaDateFrom,
            warmedTo: input.date,
          },
        };
      },
    }),
    refreshSource(dependencies, {
      source: "TIKTOK_ADS",
      date: input.date,
      taskUid: input.taskUid,
      load: async () => {
        const data = await dependencies.loadTikTokAds(tiktokDateFrom, input.date, {
          forceRefresh: true,
        });
        const liveSource = data.metadata.source;
        return {
          liveSource,
          complete:
            data.metadata.dataThroughDate === input.date &&
            data.daily.some(row => row.date === input.date) &&
            liveSource === "windsor-live",
          metadata: {
            dailyRows: data.metadata.rowCounts.daily ?? 0,
            campaignRows: data.metadata.rowCounts.campaigns ?? 0,
            adGroupRows: data.metadata.rowCounts.adGroups ?? 0,
            adRows: data.metadata.rowCounts.ads ?? 0,
            dataThroughDate: data.metadata.dataThroughDate,
            spend: data.summary.spend,
            leads: data.summary.leads,
            updatedAt: data.metadata.updatedAt,
            warmedFrom: tiktokDateFrom,
            warmedTo: input.date,
          },
        };
      },
    }),
  ]);

  const completedAt = dependencies.now();
  const ok = googleAds.ok && metaAds.ok && tiktokAds.ok;
  return {
    ok,
    partialFailure: !ok,
    date: input.date,
    timezone: DAILY_REFRESH_TIMEZONE,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    taskUid: input.taskUid,
    googleAds,
    metaAds,
    tiktokAds,
  };
}

export async function dailyRefreshHandler(req: Request, res: Response) {
  let taskUid: string | null = null;

  try {
    let user;
    try {
      user = await sdk.authenticateRequest(req);
    } catch {
      return res.status(403).json({ error: "cron-only" });
    }

    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }
    taskUid = user.taskUid;

    const date = getPreviousCompleteDate(new Date());
    const result = await executeDailyRefresh({ date, taskUid });

    // Falhas de uma fonte são devolvidas em 200 para evitar retries que
    // repetiriam chamadas externas. A auditoria persiste o estado FAILED e
    // mantém intacto o último sucesso daquele D-1.
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: serializeError(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { url: req.originalUrl, taskUid },
      timestamp: new Date().toISOString(),
    });
  }
}
