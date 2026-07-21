import snapshotRows from "./data/mg-motors-google-ads.json" with { type: "json" };

export const MG_MOTORS_ACCOUNT_ID = "535-798-6801";
export const MG_MOTORS_ACCOUNT_NAME = "MG Motors";
export const TAG_CORRECTION_DATE = "2026-07-15";
const WINDSOR_API_URL = "https://connectors.windsor.ai/google_ads";
const CACHE_TTL_MS = 10 * 60 * 1000;

export type GoogleAdsRow = {
  campaign: string;
  date: string;
  spend: number;
  conversions: number;
  clicks: number;
  impressions: number;
  ctr: number | null;
  cpc: number | null;
  budget_amount: number | null;
  campaign_status: string;
  account_name: string;
  datasource: string;
};

export type CampaignHealth = "Saudável" | "Atenção" | "Crítico";

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
        date: String(item.date ?? ""),
        spend: numberOrZero(item.spend),
        conversions: numberOrZero(item.conversions),
        clicks: numberOrZero(item.clicks),
        impressions: numberOrZero(item.impressions),
        ctr: item.ctr == null ? null : numberOrZero(item.ctr),
        cpc: item.cpc == null ? null : numberOrZero(item.cpc),
        budget_amount: item.budget_amount == null ? null : numberOrZero(item.budget_amount),
        campaign_status: String(item.campaign_status ?? "UNKNOWN"),
        account_name: String(item.account_name ?? ""),
        datasource: String(item.datasource ?? ""),
      } satisfies GoogleAdsRow;
    })
    .filter(
      row =>
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
      "campaign,date,spend,conversions,clicks,impressions,ctr,cpc,budget_amount,campaign_status,account_name,datasource",
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
      updatedAt: "2026-07-20T23:50:24.000Z",
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

function getProduct(campaign: string) {
  const normalized = campaign.toUpperCase();
  if (normalized.includes("CYB")) return "MG Cyberster";
  if (normalized.includes("MGS5") || normalized.includes("MG_S5")) return "MG S5";
  if (normalized.includes("MG4")) return "MG4";
  if (normalized.includes("MARCA")) return "Marca MG";
  return "Portfólio MG";
}

function getOptimizationType(campaign: string) {
  const normalized = campaign.toUpperCase();
  if (normalized.includes("SEM") || normalized.includes("SEARCH")) return "Otimizar termos de busca";
  if (normalized.includes("PMAX")) return "Ajustar Performance Max";
  return "Revisar estratégia de lances";
}

function classifyCampaign(cpa: number, conversions: number, spend: number, averageCpa: number): CampaignHealth {
  if (spend > 0 && conversions <= 0) return "Crítico";
  if (averageCpa <= 0) return "Saudável";
  if (cpa >= averageCpa * 2) return "Crítico";
  if (cpa >= averageCpa * 1.35) return "Atenção";
  return "Saudável";
}

export function buildDashboardData(rows: GoogleAdsRow[], metadata: { source: string; updatedAt: string; cacheHit: boolean }, dateFrom: string, dateTo: string) {
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
  const campaignMap = new Map<
    string,
    typeof totals & { budget: number; campaignStatus: string; lastDate: string }
  >();

  for (const row of rows) {
    const daily = dailyMap.get(row.date) ?? { spend: 0, conversions: 0, clicks: 0, impressions: 0 };
    daily.spend += row.spend;
    daily.conversions += row.conversions;
    daily.clicks += row.clicks;
    daily.impressions += row.impressions;
    dailyMap.set(row.date, daily);

    const campaign = campaignMap.get(row.campaign) ?? {
      spend: 0,
      conversions: 0,
      clicks: 0,
      impressions: 0,
      budget: 0,
      campaignStatus: row.campaign_status,
      lastDate: "",
    };
    campaign.spend += row.spend;
    campaign.conversions += row.conversions;
    campaign.clicks += row.clicks;
    campaign.impressions += row.impressions;
    if (row.date >= campaign.lastDate) {
      campaign.budget = row.budget_amount ?? campaign.budget;
      campaign.campaignStatus = row.campaign_status;
      campaign.lastDate = row.date;
    }
    campaignMap.set(row.campaign, campaign);
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

  const campaigns = Array.from(campaignMap.entries())
    .filter(([, value]) => value.campaignStatus === "ENABLED" || value.spend > 0)
    .map(([campaign, value]) => {
      const cpa = round(safeDivide(value.spend, value.conversions));
      return {
        campaign,
        product: getProduct(campaign),
        optimizationType: getOptimizationType(campaign),
        budget: round(value.budget),
        spend: round(value.spend),
        conversions: round(value.conversions, 1),
        cpa,
        ctr: round(safeDivide(value.clicks, value.impressions) * 100),
        cpc: round(safeDivide(value.spend, value.clicks)),
        clicks: round(value.clicks),
        impressions: round(value.impressions),
        googleStatus: value.campaignStatus,
        status: classifyCampaign(cpa, value.conversions, value.spend, summary.cpa),
      };
    })
    .sort((left, right) => right.spend - left.spend);

  const statusOrder: Record<CampaignHealth, number> = { Crítico: 0, Atenção: 1, Saudável: 2 };
  const insights = campaigns
    .filter(campaign => campaign.status !== "Saudável")
    .sort((left, right) => statusOrder[left.status] - statusOrder[right.status] || right.cpa - left.cpa)
    .slice(0, 8)
    .map(campaign => ({
      severity: campaign.status,
      campaign: campaign.campaign,
      cpa: campaign.cpa,
      averageCpa: summary.cpa,
      ratio: summary.cpa > 0 ? round(campaign.cpa / summary.cpa, 1) : 0,
      message:
        campaign.status === "Crítico"
          ? `CPA em ${summary.cpa > 0 ? round(campaign.cpa / summary.cpa, 1) : 0}x a média do período.`
          : "CPA acima da faixa de atenção do período.",
    }));

  return {
    account: { id: MG_MOTORS_ACCOUNT_ID, name: MG_MOTORS_ACCOUNT_NAME, datasource: "google_ads" },
    period: { dateFrom, dateTo },
    correctionDate: TAG_CORRECTION_DATE,
    summary,
    daily,
    campaigns,
    insights,
    metadata: {
      ...metadata,
      rowCount: rows.length,
      campaignCount: campaigns.length,
      cacheTtlSeconds: CACHE_TTL_MS / 1000,
    },
  };
}

export async function loadDashboardData(dateFrom: string, dateTo: string) {
  const result = await getGoogleAdsRows(dateFrom, dateTo);
  return buildDashboardData(
    result.rows,
    { source: result.source, updatedAt: result.updatedAt, cacheHit: result.cacheHit },
    dateFrom,
    dateTo,
  );
}
