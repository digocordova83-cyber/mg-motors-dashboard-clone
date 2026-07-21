import snapshotRows from "./data/mg-motors-google-ads.json" with { type: "json" };
import {
  addDays,
  aggregateCampaigns,
  buildDailyComparison,
  buildPacing,
  buildProductPerformance,
  buildRankings,
  buildRecommendations,
  buildRegionPerformance,
  type AnalyticsRow,
  type CampaignHealth,
  type GoalConfig,
} from "./dashboardAnalytics";
import { getCampaignGoals } from "./db";

export const MG_MOTORS_ACCOUNT_ID = "535-798-6801";
export const MG_MOTORS_ACCOUNT_NAME = "MG Motors";
export const TAG_CORRECTION_DATE = "2026-07-15";
const WINDSOR_API_URL = "https://connectors.windsor.ai/google_ads";
const CACHE_TTL_MS = 10 * 60 * 1000;

export type GoogleAdsRow = AnalyticsRow & {
  ctr: number | null;
  cpc: number | null;
  account_name: string;
  datasource: string;
};

export type { CampaignHealth };

type CacheEntry = {
  expiresAt: number;
  rows: GoogleAdsRow[];
  source: "windsor-live" | "windsor-snapshot";
  updatedAt: string;
};

const cache = new Map<string, CacheEntry>();

function numberOrZero(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function numberOrNull(value: unknown) {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeRows(payload: unknown): GoogleAdsRow[] {
  const rawRows = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && "data" in payload
      ? (payload as { data?: unknown }).data
      : [];

  if (!Array.isArray(rawRows)) return [];

  return rawRows
    .filter(row => typeof row === "object" && row !== null)
    .map(row => {
      const item = row as Record<string, unknown>;
      return {
        campaign: String(item.campaign ?? "Campanha sem nome"),
        campaign_id: String(item.campaign_id ?? ""),
        date: String(item.date ?? ""),
        spend: numberOrZero(item.spend),
        conversions: numberOrZero(item.conversions),
        clicks: numberOrZero(item.clicks),
        impressions: numberOrZero(item.impressions),
        ctr: numberOrNull(item.ctr),
        cpc: numberOrNull(item.cpc),
        budget_amount: numberOrNull(item.budget_amount),
        campaign_status: String(item.campaign_status ?? "UNKNOWN"),
        bidding_strategy_type: String(item.bidding_strategy_type ?? "UNKNOWN"),
        optimization_score: numberOrNull(item.optimization_score),
        search_impression_share: numberOrNull(item.search_impression_share),
        search_budget_lost_impression_share: numberOrNull(
          item.search_budget_lost_impression_share,
        ),
        account_name: String(item.account_name ?? ""),
        datasource: String(item.datasource ?? ""),
      } satisfies GoogleAdsRow;
    })
    .filter(
      row =>
        row.campaign_id.length > 0 &&
        row.date.length === 10 &&
        row.account_name === MG_MOTORS_ACCOUNT_NAME &&
        row.datasource === "google_ads",
    );
}

const normalizedSnapshot = normalizeRows(snapshotRows);

function filterByDate(rows: GoogleAdsRow[], dateFrom: string, dateTo: string) {
  return rows.filter(row => row.date >= dateFrom && row.date <= dateTo);
}

async function fetchWindsorRows(dateFrom: string, dateTo: string) {
  const apiKey = process.env.WINDSOR_API_KEY;
  if (!apiKey) throw new Error("WINDSOR_API_KEY não configurada");

  const params = new URLSearchParams({
    api_key: apiKey,
    fields:
      "campaign,campaign_id,date,spend,conversions,clicks,impressions,ctr,cpc,budget_amount,campaign_status,bidding_strategy_type,optimization_score,search_impression_share,search_budget_lost_impression_share,account_name,datasource",
    date_from: dateFrom,
    date_to: dateTo,
    filter: JSON.stringify([["account_name", "eq", MG_MOTORS_ACCOUNT_NAME]]),
    _max_rows: "100000",
  });

  const response = await fetch(`${WINDSOR_API_URL}?${params.toString()}`, {
    signal: AbortSignal.timeout(25_000),
    headers: { "User-Agent": "MG-Motors-Dashboard/1.0" },
  });

  if (!response.ok) throw new Error(`Windsor.ai respondeu HTTP ${response.status}`);
  const rows = normalizeRows(await response.json());
  if (rows.length === 0) throw new Error("Windsor.ai não retornou linhas para o período");
  return rows;
}

export async function getGoogleAdsRows(dateFrom: string, dateTo: string) {
  const cacheKey = `${dateFrom}:${dateTo}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return { ...cached, cacheHit: true };

  try {
    const rows = await fetchWindsorRows(dateFrom, dateTo);
    const entry: CacheEntry = {
      rows,
      source: "windsor-live",
      updatedAt: new Date().toISOString(),
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    cache.set(cacheKey, entry);
    return { ...entry, cacheHit: false };
  } catch (error) {
    console.warn("[Windsor] Usando snapshot validado:", error instanceof Error ? error.message : error);
    const entry: CacheEntry = {
      rows: filterByDate(normalizedSnapshot, dateFrom, dateTo),
      source: "windsor-snapshot",
      updatedAt: "2026-07-21T00:45:58.000Z",
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    cache.set(cacheKey, entry);
    return { ...entry, cacheHit: false };
  }
}

export function clearDashboardCache() {
  cache.clear();
}

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function safeDivide(numerator: number, denominator: number) {
  return denominator > 0 ? numerator / denominator : 0;
}

function getOptimizationType(campaign: string) {
  const normalized = campaign.toUpperCase();
  if (normalized.includes("SEM") || normalized.includes("SEARCH")) return "Otimizar termos de busca";
  if (normalized.includes("PMAX")) return "Ajustar Performance Max";
  return "Revisar estratégia de lances";
}

export function buildDashboardData(
  rows: GoogleAdsRow[],
  metadata: { source: string; updatedAt: string; cacheHit: boolean },
  dateFrom: string,
  dateTo: string,
  goals: GoalConfig[] = [],
  historyRows: GoogleAdsRow[] = rows,
) {
  const totals = rows.reduce(
    (acc, row) => {
      acc.spend += row.spend;
      acc.conversions += row.conversions;
      acc.clicks += row.clicks;
      acc.impressions += row.impressions;
      return acc;
    },
    { spend: 0, conversions: 0, clicks: 0, impressions: 0 },
  );

  const summary = {
    investment: round(totals.spend),
    conversions: round(totals.conversions, 1),
    cpa: round(safeDivide(totals.spend, totals.conversions)),
    ctr: round(safeDivide(totals.clicks, totals.impressions) * 100),
    conversionRate: round(safeDivide(totals.conversions, totals.clicks) * 100),
    cpc: round(safeDivide(totals.spend, totals.clicks)),
    clicks: round(totals.clicks),
    impressions: round(totals.impressions),
  };

  const dailyMap = new Map<string, typeof totals>();
  for (const row of rows) {
    const current = dailyMap.get(row.date) ?? { spend: 0, conversions: 0, clicks: 0, impressions: 0 };
    current.spend += row.spend;
    current.conversions += row.conversions;
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    dailyMap.set(row.date, current);
  }

  const daily = Array.from(dailyMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, value]) => ({
      date,
      spend: round(value.spend),
      conversions: round(value.conversions, 1),
      cpa: round(safeDivide(value.spend, value.conversions)),
      ctr: round(safeDivide(value.clicks, value.impressions) * 100),
      cpc: round(safeDivide(value.spend, value.clicks)),
      clicks: round(value.clicks),
      impressions: round(value.impressions),
      conversionRate: round(safeDivide(value.conversions, value.clicks) * 100),
    }));

  const campaignAnalytics = aggregateCampaigns(rows, goals, summary.cpa);
  const campaigns = campaignAnalytics.map(campaign => ({
    ...campaign,
    optimizationType: getOptimizationType(campaign.campaign),
  }));

  const statusOrder: Record<CampaignHealth, number> = { Crítico: 0, Atenção: 1, Saudável: 2 };
  const insights = campaigns
    .filter(campaign => campaign.status !== "Saudável")
    .sort((left, right) => statusOrder[left.status] - statusOrder[right.status] || right.cpa - left.cpa)
    .slice(0, 8)
    .map(campaign => ({
      severity: campaign.status,
      campaignId: campaign.campaignId,
      campaign: campaign.campaign,
      cpa: campaign.cpa,
      averageCpa: summary.cpa,
      ratio: summary.cpa > 0 ? round(campaign.cpa / summary.cpa, 1) : 0,
      message:
        campaign.status === "Crítico"
          ? `CPA em ${summary.cpa > 0 ? round(campaign.cpa / summary.cpa, 1) : 0}x a média do período.`
          : "CPA acima da faixa de atenção do período.",
    }));

  const mediaGoal = goals.find(goal => goal.goalType === "MEDIA_BUDGET" && goal.scopeKey === "ACCOUNT");
  const pacing = buildPacing(historyRows, mediaGoal?.monthlyBudgetGoal ?? null);
  const dailyComparison = buildDailyComparison(historyRows);
  const rankings = buildRankings(campaignAnalytics);
  const productPerformance = buildProductPerformance(campaignAnalytics);
  const regionPerformance = buildRegionPerformance(campaignAnalytics, summary.cpa);
  const recommendationEngine = buildRecommendations(campaignAnalytics, summary.cpa, pacing);

  return {
    account: { id: MG_MOTORS_ACCOUNT_ID, name: MG_MOTORS_ACCOUNT_NAME, datasource: "google_ads" },
    period: { dateFrom, dateTo },
    correctionDate: TAG_CORRECTION_DATE,
    summary,
    daily,
    campaigns,
    insights,
    pacing,
    dailyComparison,
    rankings,
    productPerformance,
    regionPerformance,
    recommendations: recommendationEngine.recommendations,
    recommendationPolicy: recommendationEngine.policy,
    goals: {
      competencia: pacing?.competencia ?? dailyComparison.referenceDate?.slice(0, 7) ?? dateTo.slice(0, 7),
      monthlyBudget: mediaGoal?.monthlyBudgetGoal ?? null,
      regional: goals
        .filter(goal => goal.goalType === "REGIONAL_LEADS")
        .map(goal => ({
          scopeKey: goal.scopeKey,
          region: goal.region,
          monthlyLeadGoal: goal.monthlyLeadGoal,
        })),
    },
    metadata: {
      ...metadata,
      rowCount: rows.length,
      historyRowCount: historyRows.length,
      campaignCount: campaigns.length,
      lastClosedDate: dailyComparison.referenceDate,
      cacheTtlSeconds: CACHE_TTL_MS / 1000,
    },
  };
}

function getHistoricalStart(dateFrom: string, dateTo: string) {
  return [dateFrom, addDays(dateTo, -29), `${dateTo.slice(0, 7)}-01`].sort()[0];
}

async function loadGoals(competencia: string): Promise<GoalConfig[]> {
  try {
    const goals = await getCampaignGoals(MG_MOTORS_ACCOUNT_ID, competencia);
    return goals.map(goal => ({
      goalType: goal.goalType,
      scopeKey: goal.scopeKey,
      region: goal.region,
      monthlyLeadGoal: goal.monthlyLeadGoal,
      monthlyBudgetGoal:
        goal.monthlyBudgetGoal == null ? null : numberOrNull(goal.monthlyBudgetGoal),
    }));
  } catch (error) {
    console.warn("[Goals] Metas persistentes indisponíveis:", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function loadDashboardData(dateFrom: string, dateTo: string) {
  const historyDateFrom = getHistoricalStart(dateFrom, dateTo);
  const result = await getGoogleAdsRows(historyDateFrom, dateTo);
  const rows = filterByDate(result.rows, dateFrom, dateTo);
  const lastClosedDate = result.rows.map(row => row.date).sort().at(-1);
  const goals = await loadGoals(lastClosedDate?.slice(0, 7) ?? dateTo.slice(0, 7));

  return buildDashboardData(
    rows,
    { source: result.source, updatedAt: result.updatedAt, cacheHit: result.cacheHit },
    dateFrom,
    dateTo,
    goals,
    result.rows,
  );
}
