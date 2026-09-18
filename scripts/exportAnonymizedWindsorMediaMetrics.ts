import ExcelJS from "exceljs";
import path from "node:path";

type RawRow = Record<string, unknown>;
type Primitive = string | number | boolean | null;
type SheetCell = Primitive | Date;

type PlatformData = {
  platform: "Google Ads" | "Meta Ads" | "TikTok Ads";
  source: "windsor-live";
  dateFrom: string;
  dateTo: string;
  summary: Array<{ metric: string; value: number | null; kind: "currency" | "integer" | "decimal" | "percent" }>;
  dailyColumns: Array<{ key: string; title: string; kind: "date" | "text" | "currency" | "integer" | "decimal" | "percent" }>;
  daily: Array<Record<string, SheetCell>>;
  campaignColumns: Array<{ key: string; title: string; kind: "text" | "currency" | "integer" | "decimal" | "percent" }>;
  campaigns: Array<Record<string, SheetCell>>;
  fieldDefinitions: Array<{ metric: string; definition: string }>;
};

const WINDSOR_API_KEY = process.env.WINDSOR_API_KEY;
if (!WINDSOR_API_KEY) throw new Error("WINDSOR_API_KEY não configurada");

const OUTPUT_PATH = "/home/ubuntu/exports/Metricas_Midia_Anonimizadas_Windsor_15D.xlsx";
const GOOGLE = {
  endpoint: "https://connectors.windsor.ai/google_ads",
  accountId: "535-798-6801",
  dateFrom: "2026-09-03",
  dateTo: "2026-09-17",
};
const META = {
  endpoint: "https://connectors.windsor.ai/facebook",
  accountId: "1418731006678061",
  dateFrom: "2026-09-03",
  dateTo: "2026-09-17",
};
const TIKTOK = {
  endpoint: "https://connectors.windsor.ai/tiktok",
  accountId: "7668787778449719316",
  dateFrom: "2026-08-17",
  dateTo: "2026-08-31",
};

const COLORS = {
  primary: "182234",
  secondary: "26344A",
  accent: "E2212D",
  light: "E8EDF5",
  tint: "F5F7FA",
  white: "FFFFFF",
  text: "172033",
  muted: "5D6B82",
  positive: "17805C",
  border: "D7DEE8",
};

function numeric(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function nullableDivide(numerator: number, denominator: number): number | null {
  return denominator > 0 ? round(numerator / denominator) : null;
}

function percent(numerator: number, denominator: number): number {
  return denominator > 0 ? round((numerator / denominator) * 100) : 0;
}

function isoDate(value: string): Date {
  return new Date(`${value}T12:00:00.000Z`);
}

function assertDateRange(rows: RawRow[], dateFrom: string, dateTo: string, label: string) {
  const dates = rows.map(row => text(row.date)).filter(Boolean);
  if (!dates.length) throw new Error(`${label}: Windsor.ai não retornou dados diários.`);
  if (dates.some(date => !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < dateFrom || date > dateTo)) {
    throw new Error(`${label}: Windsor.ai retornou datas fora do período solicitado.`);
  }
  if (!dates.includes(dateFrom) || !dates.includes(dateTo)) {
    throw new Error(`${label}: a série ao vivo não cobre integralmente o período solicitado.`);
  }
}

async function fetchWindsorRows(input: {
  endpoint: string;
  fields: string[];
  accountId: string;
  dateFrom: string;
  dateTo: string;
  label: string;
}): Promise<RawRow[]> {
  const params = new URLSearchParams({
    api_key: WINDSOR_API_KEY,
    fields: input.fields.join(","),
    date_from: input.dateFrom,
    date_to: input.dateTo,
    filter: JSON.stringify([["account_id", "eq", input.accountId]]),
    _max_rows: "100000",
  });
  const response = await fetch(`${input.endpoint}?${params.toString()}`, {
    signal: AbortSignal.timeout(60_000),
    headers: { "User-Agent": "Anonymized-Media-Metrics-Export/1.0" },
  });
  if (!response.ok) throw new Error(`${input.label}: Windsor.ai respondeu HTTP ${response.status}.`);
  const payload = (await response.json()) as { data?: unknown };
  const rows = Array.isArray(payload.data)
    ? payload.data.filter((row): row is RawRow => Boolean(row) && typeof row === "object")
    : [];
  if (!rows.length) throw new Error(`${input.label}: Windsor.ai não retornou linhas.`);
  return rows;
}

function aggregateByDate(rows: RawRow[], make: (row: RawRow) => Record<string, number>): Array<Record<string, SheetCell>> {
  const values = new Map<string, Record<string, number>>();
  for (const row of rows) {
    const date = text(row.date);
    if (!date) continue;
    const current = values.get(date) ?? {};
    const additions = make(row);
    for (const [key, value] of Object.entries(additions)) current[key] = (current[key] ?? 0) + value;
    values.set(date, current);
  }
  return Array.from(values.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, metrics]) => ({ date: isoDate(date), ...metrics }));
}

function completeDailySeries(
  rows: Array<Record<string, SheetCell>>,
  dateFrom: string,
  dateTo: string,
): Array<Record<string, SheetCell>> {
  const byDate = new Map(
    rows.map(row => [(row.date as Date).toISOString().slice(0, 10), row] as const),
  );
  const complete: Array<Record<string, SheetCell>> = [];
  for (let current = isoDate(dateFrom); current <= isoDate(dateTo); current.setUTCDate(current.getUTCDate() + 1)) {
    const date = current.toISOString().slice(0, 10);
    const row = byDate.get(date);
    complete.push(row ? { ...row, coverage: "Reported" } : { date: isoDate(date), coverage: "Not returned by source" });
  }
  return complete;
}

function totals(rows: Array<Record<string, SheetCell>>, keys: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const row of rows) {
    for (const key of keys) result[key] = (result[key] ?? 0) + numeric(row[key]);
  }
  return result;
}

function anonymousCampaignName(platform: string, index: number): string {
  return `${platform.replace(" Ads", "")} Campaign ${String(index + 1).padStart(2, "0")}`;
}

async function collectGoogle(): Promise<PlatformData> {
  const fields = [
    "campaign", "campaign_id", "date", "spend", "conversions", "clicks", "impressions", "ctr", "cpc",
    "budget_amount", "campaign_status", "bidding_strategy_type", "optimization_score",
    "search_impression_share", "search_budget_lost_impression_share", "account_id", "datasource",
  ];
  const rows = await fetchWindsorRows({ ...GOOGLE, fields, label: "Google Ads" });
  const scoped = rows.filter(row => text(row.datasource) === "google_ads" && text(row.account_id) === GOOGLE.accountId);
  assertDateRange(scoped, GOOGLE.dateFrom, GOOGLE.dateTo, "Google Ads");

  const daily = completeDailySeries(aggregateByDate(scoped, row => ({
    spend: numeric(row.spend),
    conversions: numeric(row.conversions),
    impressions: numeric(row.impressions),
    clicks: numeric(row.clicks),
  })).map(row => ({
    ...row,
    cpa: nullableDivide(numeric(row.spend), numeric(row.conversions)),
    ctr: percent(numeric(row.clicks), numeric(row.impressions)),
    conversionRate: percent(numeric(row.conversions), numeric(row.clicks)),
    cpc: nullableDivide(numeric(row.spend), numeric(row.clicks)),
  })), GOOGLE.dateFrom, GOOGLE.dateTo);
  const total = totals(daily, ["spend", "conversions", "impressions", "clicks"]);

  const byCampaign = new Map<string, RawRow[]>();
  for (const row of scoped) {
    const key = text(row.campaign_id);
    if (!key) continue;
    byCampaign.set(key, [...(byCampaign.get(key) ?? []), row]);
  }
  const campaigns = Array.from(byCampaign.values())
    .map(rowsForCampaign => {
      const last = [...rowsForCampaign].sort((left, right) => text(left.date).localeCompare(text(right.date))).at(-1)!;
      const spend = rowsForCampaign.reduce((sum, row) => sum + numeric(row.spend), 0);
      const conversions = rowsForCampaign.reduce((sum, row) => sum + numeric(row.conversions), 0);
      const impressions = rowsForCampaign.reduce((sum, row) => sum + numeric(row.impressions), 0);
      const clicks = rowsForCampaign.reduce((sum, row) => sum + numeric(row.clicks), 0);
      return {
        status: text(last.campaign_status) || "UNKNOWN",
        biddingStrategy: text(last.bidding_strategy_type) || "UNKNOWN",
        budget: numeric(last.budget_amount),
        optimizationScore: text(last.optimization_score) ? numeric(last.optimization_score) : null,
        searchImpressionShare: text(last.search_impression_share) ? numeric(last.search_impression_share) : null,
        searchBudgetLostImpressionShare: text(last.search_budget_lost_impression_share) ? numeric(last.search_budget_lost_impression_share) : null,
        spend: round(spend), conversions: round(conversions, 1), impressions: round(impressions), clicks: round(clicks),
        cpa: nullableDivide(spend, conversions), ctr: percent(clicks, impressions), cpc: nullableDivide(spend, clicks), conversionRate: percent(conversions, clicks),
      };
    })
    .sort((left, right) => right.spend - left.spend)
    .map((row, index) => ({ campaign: anonymousCampaignName("Google Ads", index), ...row }));

  return {
    platform: "Google Ads", source: "windsor-live", dateFrom: GOOGLE.dateFrom, dateTo: GOOGLE.dateTo,
    summary: [
      { metric: "Investment", value: round(total.spend), kind: "currency" },
      { metric: "Conversions", value: round(total.conversions, 1), kind: "decimal" },
      { metric: "Cost per Acquisition (CPA)", value: nullableDivide(total.spend, total.conversions), kind: "currency" },
      { metric: "Impressions", value: round(total.impressions), kind: "integer" },
      { metric: "Clicks", value: round(total.clicks), kind: "integer" },
      { metric: "CTR", value: percent(total.clicks, total.impressions), kind: "percent" },
      { metric: "CPC", value: nullableDivide(total.spend, total.clicks), kind: "currency" },
      { metric: "Conversion Rate", value: percent(total.conversions, total.clicks), kind: "percent" },
    ],
    dailyColumns: [
      { key: "date", title: "Date", kind: "date" }, { key: "coverage", title: "Coverage", kind: "text" }, { key: "spend", title: "Investment", kind: "currency" },
      { key: "conversions", title: "Conversions", kind: "decimal" }, { key: "cpa", title: "CPA", kind: "currency" },
      { key: "impressions", title: "Impressions", kind: "integer" }, { key: "clicks", title: "Clicks", kind: "integer" },
      { key: "ctr", title: "CTR", kind: "percent" }, { key: "cpc", title: "CPC", kind: "currency" },
      { key: "conversionRate", title: "Conversion Rate", kind: "percent" },
    ], daily,
    campaignColumns: [
      { key: "campaign", title: "Anonymized Campaign", kind: "text" }, { key: "status", title: "Status", kind: "text" },
      { key: "biddingStrategy", title: "Bidding Strategy", kind: "text" }, { key: "budget", title: "Daily Budget", kind: "currency" },
      { key: "spend", title: "Investment", kind: "currency" }, { key: "conversions", title: "Conversions", kind: "decimal" },
      { key: "cpa", title: "CPA", kind: "currency" }, { key: "impressions", title: "Impressions", kind: "integer" },
      { key: "clicks", title: "Clicks", kind: "integer" }, { key: "ctr", title: "CTR", kind: "percent" },
      { key: "cpc", title: "CPC", kind: "currency" }, { key: "conversionRate", title: "Conversion Rate", kind: "percent" },
      { key: "optimizationScore", title: "Optimization Score", kind: "percent" },
      { key: "searchImpressionShare", title: "Search Impression Share", kind: "percent" },
      { key: "searchBudgetLostImpressionShare", title: "Search Lost IS (Budget)", kind: "percent" },
    ], campaigns,
    fieldDefinitions: [
      { metric: "Investment", definition: "Media spend returned by Windsor.ai." },
      { metric: "Conversions", definition: "Conversions attributed by Google Ads." },
      { metric: "CPA", definition: "Investment divided by conversions." },
      { metric: "CTR", definition: "Clicks divided by impressions." },
      { metric: "Conversion Rate", definition: "Conversions divided by clicks." },
      { metric: "CPC", definition: "Investment divided by clicks." },
      { metric: "Search Impression Share", definition: "Share of eligible Google Search impressions captured." },
      { metric: "Search Lost IS (Budget)", definition: "Estimated eligible Search impressions lost because of budget." },
    ],
  };
}

async function collectMeta(): Promise<PlatformData> {
  const dailyFields = ["account_id", "date", "spend", "actions_lead", "impressions", "reach", "frequency", "clicks", "cpm", "cpc", "ctr"];
  const campaignFields = ["account_id", "campaign_id", "campaign", "campaign_effective_status", "campaign_status", "campaign_objective", "spend", "actions_lead", "impressions", "reach", "frequency", "clicks", "cpm", "cpc", "ctr"];
  const [dailyRows, campaignRows] = await Promise.all([
    fetchWindsorRows({ ...META, fields: dailyFields, label: "Meta Ads daily" }),
    fetchWindsorRows({ ...META, fields: campaignFields, label: "Meta Ads campaigns" }),
  ]);
  const dailyScoped = dailyRows.filter(row => text(row.account_id) === META.accountId);
  const campaignScoped = campaignRows.filter(row => text(row.account_id) === META.accountId);
  assertDateRange(dailyScoped, META.dateFrom, META.dateTo, "Meta Ads");
  if (!campaignScoped.length) throw new Error("Meta Ads: Windsor.ai não retornou campanhas para o período.");

  const daily = completeDailySeries(aggregateByDate(dailyScoped, row => ({
    spend: numeric(row.spend), leads: numeric(row.actions_lead), impressions: numeric(row.impressions), reach: numeric(row.reach), clicks: numeric(row.clicks),
  })).map(row => ({
    ...row,
    cpl: nullableDivide(numeric(row.spend), numeric(row.leads)),
    cpm: nullableDivide(numeric(row.spend) * 1000, numeric(row.impressions)),
    cpc: nullableDivide(numeric(row.spend), numeric(row.clicks)),
    ctr: percent(numeric(row.clicks), numeric(row.impressions)),
    frequency: nullableDivide(numeric(row.impressions), numeric(row.reach)),
  })), META.dateFrom, META.dateTo);
  const total = totals(daily, ["spend", "leads", "impressions", "reach", "clicks"]);

  const campaigns = campaignScoped
    .map(row => {
      const spend = numeric(row.spend); const leads = numeric(row.actions_lead); const impressions = numeric(row.impressions); const clicks = numeric(row.clicks); const reach = numeric(row.reach);
      return {
        status: text(row.campaign_effective_status || row.campaign_status) || "UNKNOWN",
        objective: text(row.campaign_objective) || "UNKNOWN",
        spend: round(spend), leads: round(leads), cpl: nullableDivide(spend, leads), impressions: round(impressions),
        reach: round(reach), frequency: nullableDivide(impressions, reach), clicks: round(clicks),
        cpm: nullableDivide(spend * 1000, impressions), cpc: nullableDivide(spend, clicks), ctr: percent(clicks, impressions),
      };
    })
    .sort((left, right) => right.spend - left.spend)
    .map((row, index) => ({ campaign: anonymousCampaignName("Meta Ads", index), ...row }));

  return {
    platform: "Meta Ads", source: "windsor-live", dateFrom: META.dateFrom, dateTo: META.dateTo,
    summary: [
      { metric: "Spend", value: round(total.spend), kind: "currency" }, { metric: "Leads", value: round(total.leads), kind: "integer" },
      { metric: "Cost per Lead (CPL)", value: nullableDivide(total.spend, total.leads), kind: "currency" },
      { metric: "Impressions", value: round(total.impressions), kind: "integer" }, { metric: "Reach", value: round(total.reach), kind: "integer" },
      { metric: "Frequency", value: nullableDivide(total.impressions, total.reach), kind: "decimal" }, { metric: "Clicks", value: round(total.clicks), kind: "integer" },
      { metric: "CTR", value: percent(total.clicks, total.impressions), kind: "percent" }, { metric: "CPM", value: nullableDivide(total.spend * 1000, total.impressions), kind: "currency" },
      { metric: "CPC", value: nullableDivide(total.spend, total.clicks), kind: "currency" },
    ],
    dailyColumns: [
      { key: "date", title: "Date", kind: "date" }, { key: "coverage", title: "Coverage", kind: "text" }, { key: "spend", title: "Spend", kind: "currency" }, { key: "leads", title: "Leads", kind: "integer" },
      { key: "cpl", title: "CPL", kind: "currency" }, { key: "impressions", title: "Impressions", kind: "integer" }, { key: "reach", title: "Reach", kind: "integer" },
      { key: "frequency", title: "Frequency", kind: "decimal" }, { key: "clicks", title: "Clicks", kind: "integer" },
      { key: "ctr", title: "CTR", kind: "percent" }, { key: "cpm", title: "CPM", kind: "currency" }, { key: "cpc", title: "CPC", kind: "currency" },
    ], daily,
    campaignColumns: [
      { key: "campaign", title: "Anonymized Campaign", kind: "text" }, { key: "status", title: "Status", kind: "text" }, { key: "objective", title: "Objective", kind: "text" },
      { key: "spend", title: "Spend", kind: "currency" }, { key: "leads", title: "Leads", kind: "integer" }, { key: "cpl", title: "CPL", kind: "currency" },
      { key: "impressions", title: "Impressions", kind: "integer" }, { key: "reach", title: "Reach", kind: "integer" }, { key: "frequency", title: "Frequency", kind: "decimal" },
      { key: "clicks", title: "Clicks", kind: "integer" }, { key: "ctr", title: "CTR", kind: "percent" }, { key: "cpm", title: "CPM", kind: "currency" }, { key: "cpc", title: "CPC", kind: "currency" },
    ], campaigns,
    fieldDefinitions: [
      { metric: "Leads", definition: "Meta action metric actions_lead returned by Windsor.ai." },
      { metric: "CPL", definition: "Spend divided by leads." },
      { metric: "Reach", definition: "Estimated number of unique people reached." },
      { metric: "Frequency", definition: "Impressions divided by reach." },
      { metric: "CPM", definition: "Spend per thousand impressions." },
      { metric: "CPC", definition: "Spend divided by clicks." },
      { metric: "CTR", definition: "Clicks divided by impressions." },
    ],
  };
}

async function collectTikTok(): Promise<PlatformData> {
  const dailyFields = ["account_id", "date", "spend", "onsite_form", "conversions", "impressions", "reach", "clicks", "engagements", "comments", "shares", "average_video_play"];
  const campaignFields = ["account_id", "campaign_id", "campaign", "campaign_operation_status", "campaign_status", "campaign_optimization_goal", "spend", "onsite_form", "conversions", "impressions", "reach", "clicks", "engagements", "comments", "shares", "average_video_play"];
  const [dailyRows, campaignRows] = await Promise.all([
    fetchWindsorRows({ ...TIKTOK, fields: dailyFields, label: "TikTok Ads daily" }),
    fetchWindsorRows({ ...TIKTOK, fields: campaignFields, label: "TikTok Ads campaigns" }),
  ]);
  const dailyScoped = dailyRows.filter(row => text(row.account_id) === TIKTOK.accountId);
  const campaignScoped = campaignRows.filter(row => text(row.account_id) === TIKTOK.accountId);
  assertDateRange(dailyScoped, TIKTOK.dateFrom, TIKTOK.dateTo, "TikTok Ads");
  if (!campaignScoped.length) throw new Error("TikTok Ads: Windsor.ai não retornou campanhas para o período.");

  const daily = completeDailySeries(aggregateByDate(dailyScoped, row => ({
    spend: numeric(row.spend), leads: numeric(row.onsite_form), conversions: numeric(row.conversions), impressions: numeric(row.impressions),
    reach: numeric(row.reach), clicks: numeric(row.clicks), engagements: numeric(row.engagements), comments: numeric(row.comments), shares: numeric(row.shares),
    weightedVideoPlay: numeric(row.average_video_play) * numeric(row.impressions),
  })).map(row => ({
    ...row,
    cpl: nullableDivide(numeric(row.spend), numeric(row.leads)), cpm: nullableDivide(numeric(row.spend) * 1000, numeric(row.impressions)),
    cpc: nullableDivide(numeric(row.spend), numeric(row.clicks)), ctr: percent(numeric(row.clicks), numeric(row.impressions)),
    engagementRate: percent(numeric(row.engagements), numeric(row.impressions)), averageVideoPlay: nullableDivide(numeric(row.weightedVideoPlay), numeric(row.impressions)),
  })), TIKTOK.dateFrom, TIKTOK.dateTo);
  const total = totals(daily, ["spend", "leads", "conversions", "impressions", "reach", "clicks", "engagements", "comments", "shares", "weightedVideoPlay"]);

  const campaigns = campaignScoped
    .map(row => {
      const spend = numeric(row.spend); const leads = numeric(row.onsite_form); const impressions = numeric(row.impressions); const clicks = numeric(row.clicks);
      const engagements = numeric(row.engagements);
      return {
        status: text(row.campaign_operation_status) || "UNKNOWN", deliveryStatus: text(row.campaign_status) || "UNKNOWN", objective: text(row.campaign_optimization_goal) || "UNKNOWN",
        spend: round(spend), leads: round(leads), conversions: round(numeric(row.conversions)), cpl: nullableDivide(spend, leads), impressions: round(impressions), reach: round(numeric(row.reach)),
        clicks: round(clicks), ctr: percent(clicks, impressions), engagements: round(engagements), engagementRate: percent(engagements, impressions),
        comments: round(numeric(row.comments)), shares: round(numeric(row.shares)), averageVideoPlay: round(numeric(row.average_video_play)),
      };
    })
    .sort((left, right) => right.spend - left.spend)
    .map((row, index) => ({ campaign: anonymousCampaignName("TikTok Ads", index), ...row }));

  return {
    platform: "TikTok Ads", source: "windsor-live", dateFrom: TIKTOK.dateFrom, dateTo: TIKTOK.dateTo,
    summary: [
      { metric: "Spend", value: round(total.spend), kind: "currency" }, { metric: "On-site Form Leads", value: round(total.leads), kind: "integer" },
      { metric: "Conversions", value: round(total.conversions), kind: "integer" }, { metric: "CPL", value: nullableDivide(total.spend, total.leads), kind: "currency" },
      { metric: "Impressions", value: round(total.impressions), kind: "integer" }, { metric: "Reach", value: round(total.reach), kind: "integer" }, { metric: "Clicks", value: round(total.clicks), kind: "integer" },
      { metric: "CTR", value: percent(total.clicks, total.impressions), kind: "percent" }, { metric: "CPM", value: nullableDivide(total.spend * 1000, total.impressions), kind: "currency" },
      { metric: "CPC", value: nullableDivide(total.spend, total.clicks), kind: "currency" }, { metric: "Engagements", value: round(total.engagements), kind: "integer" },
      { metric: "Engagement Rate", value: percent(total.engagements, total.impressions), kind: "percent" }, { metric: "Comments", value: round(total.comments), kind: "integer" },
      { metric: "Shares", value: round(total.shares), kind: "integer" }, { metric: "Average Video Play", value: nullableDivide(total.weightedVideoPlay, total.impressions), kind: "decimal" },
    ],
    dailyColumns: [
      { key: "date", title: "Date", kind: "date" }, { key: "coverage", title: "Coverage", kind: "text" }, { key: "spend", title: "Spend", kind: "currency" }, { key: "leads", title: "On-site Form Leads", kind: "integer" }, { key: "conversions", title: "Conversions", kind: "integer" },
      { key: "cpl", title: "CPL", kind: "currency" }, { key: "impressions", title: "Impressions", kind: "integer" }, { key: "reach", title: "Reach", kind: "integer" }, { key: "clicks", title: "Clicks", kind: "integer" },
      { key: "ctr", title: "CTR", kind: "percent" }, { key: "cpm", title: "CPM", kind: "currency" }, { key: "cpc", title: "CPC", kind: "currency" }, { key: "engagements", title: "Engagements", kind: "integer" },
      { key: "engagementRate", title: "Engagement Rate", kind: "percent" }, { key: "comments", title: "Comments", kind: "integer" }, { key: "shares", title: "Shares", kind: "integer" }, { key: "averageVideoPlay", title: "Average Video Play", kind: "decimal" },
    ], daily,
    campaignColumns: [
      { key: "campaign", title: "Anonymized Campaign", kind: "text" }, { key: "status", title: "Operation Status", kind: "text" }, { key: "deliveryStatus", title: "Delivery Status", kind: "text" }, { key: "objective", title: "Optimization Goal", kind: "text" },
      { key: "spend", title: "Spend", kind: "currency" }, { key: "leads", title: "On-site Form Leads", kind: "integer" }, { key: "conversions", title: "Conversions", kind: "integer" }, { key: "cpl", title: "CPL", kind: "currency" },
      { key: "impressions", title: "Impressions", kind: "integer" }, { key: "reach", title: "Reach", kind: "integer" }, { key: "clicks", title: "Clicks", kind: "integer" }, { key: "ctr", title: "CTR", kind: "percent" },
      { key: "engagements", title: "Engagements", kind: "integer" }, { key: "engagementRate", title: "Engagement Rate", kind: "percent" }, { key: "comments", title: "Comments", kind: "integer" }, { key: "shares", title: "Shares", kind: "integer" }, { key: "averageVideoPlay", title: "Average Video Play", kind: "decimal" },
    ], campaigns,
    fieldDefinitions: [
      { metric: "On-site Form Leads", definition: "TikTok onsite_form result returned by Windsor.ai." },
      { metric: "Conversions", definition: "TikTok conversions metric returned separately from onsite_form." },
      { metric: "CPL", definition: "Spend divided by on-site form leads." },
      { metric: "Engagements", definition: "Total engagement actions returned by TikTok." },
      { metric: "Engagement Rate", definition: "Engagements divided by impressions." },
      { metric: "Average Video Play", definition: "Average video play metric returned by TikTok." },
    ],
  };
}

function setCellFormat(cell: ExcelJS.Cell, kind: string) {
  if (kind === "currency") cell.numFmt = 'R$ #,##0.00';
  else if (kind === "integer") cell.numFmt = '#,##0';
  else if (kind === "decimal") cell.numFmt = '#,##0.00';
  else if (kind === "percent") cell.numFmt = '0.00"%"';
  else if (kind === "date") cell.numFmt = 'dd/mm/yyyy';
}

function addTitle(sheet: ExcelJS.Worksheet, title: string, subtitle: string, lastColumn: number) {
  const end = sheet.getColumn(lastColumn).letter;
  sheet.mergeCells(`B2:${end}2`);
  sheet.getCell("B2").value = title;
  sheet.getCell("B2").font = { name: "Georgia", size: 20, bold: true, color: { argb: COLORS.white } };
  sheet.getCell("B2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.primary } };
  sheet.getCell("B2").alignment = { vertical: "middle" };
  sheet.getRow(2).height = 30;
  sheet.mergeCells(`B3:${end}3`);
  sheet.getCell("B3").value = subtitle;
  sheet.getCell("B3").font = { name: "Calibri", size: 10, italic: true, color: { argb: COLORS.muted } };
  sheet.getCell("B3").alignment = { vertical: "middle", wrapText: true };
  sheet.getRow(3).height = 28;
}

function addSectionHeader(sheet: ExcelJS.Worksheet, row: number, label: string, lastColumn: number) {
  const end = sheet.getColumn(lastColumn).letter;
  sheet.mergeCells(`B${row}:${end}${row}`);
  const cell = sheet.getCell(`B${row}`);
  cell.value = label;
  cell.font = { name: "Georgia", size: 11, bold: true, color: { argb: COLORS.primary } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.light } };
  cell.alignment = { vertical: "middle" };
  sheet.getRow(row).height = 21;
}

function styleHeaderRow(sheet: ExcelJS.Worksheet, row: number, startColumn: number, endColumn: number) {
  for (let column = startColumn; column <= endColumn; column += 1) {
    const cell = sheet.getRow(row).getCell(column);
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLORS.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.secondary } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = { bottom: { style: "medium", color: { argb: COLORS.primary } } };
  }
  sheet.getRow(row).height = 30;
}

function styleTable(sheet: ExcelJS.Worksheet, startRow: number, endRow: number, startColumn: number, endColumn: number, columns: Array<{ key: string; kind: string }>) {
  for (let row = startRow; row <= endRow; row += 1) {
    for (let column = startColumn; column <= endColumn; column += 1) {
      const cell = sheet.getRow(row).getCell(column);
      const kind = columns[column - startColumn]?.kind ?? "text";
      cell.font = { name: "Calibri", size: 10, color: { argb: COLORS.text } };
      cell.alignment = { vertical: "middle", horizontal: kind === "text" ? "left" : "right", wrapText: kind === "text" };
      setCellFormat(cell, kind);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: row % 2 === 0 ? COLORS.white : COLORS.tint } };
      cell.border = { bottom: { style: "hair", color: { argb: COLORS.border } } };
    }
    sheet.getRow(row).height = 18;
  }
}

function writePlatformSheet(workbook: ExcelJS.Workbook, data: PlatformData) {
  const sheet = workbook.addWorksheet(data.platform, { views: [{ showGridLines: false }] });
  sheet.getColumn(1).width = 3;
  const tableWidth = Math.max(data.dailyColumns.length, data.campaignColumns.length, 6);
  addTitle(
    sheet,
    `${data.platform} — Anonymized Metrics`,
    `Source: Windsor.ai live API | Period: ${data.dateFrom} to ${data.dateTo} | Client, account, campaign and ID values have been removed.`,
    tableWidth + 1,
  );

  addSectionHeader(sheet, 5, "PERIOD SUMMARY", 3);
  sheet.getCell("B6").value = "Metric";
  sheet.getCell("C6").value = "Value";
  styleHeaderRow(sheet, 6, 2, 3);
  data.summary.forEach((item, index) => {
    const row = 7 + index;
    sheet.getCell(row, 2).value = item.metric;
    sheet.getCell(row, 3).value = item.value;
    styleTable(sheet, row, row, 2, 3, [{ key: "metric", kind: "text" }, { key: "value", kind: item.kind }]);
  });

  const dailySectionRow = 8 + data.summary.length;
  addSectionHeader(sheet, dailySectionRow, "DAILY RESULTS", data.dailyColumns.length + 1);
  const dailyHeaderRow = dailySectionRow + 1;
  data.dailyColumns.forEach((column, index) => { sheet.getCell(dailyHeaderRow, index + 2).value = column.title; });
  styleHeaderRow(sheet, dailyHeaderRow, 2, data.dailyColumns.length + 1);
  data.daily.forEach((row, index) => {
    data.dailyColumns.forEach((column, columnIndex) => { sheet.getCell(dailyHeaderRow + 1 + index, columnIndex + 2).value = row[column.key] ?? null; });
  });
  const dailyEndRow = dailyHeaderRow + data.daily.length;
  styleTable(sheet, dailyHeaderRow + 1, dailyEndRow, 2, data.dailyColumns.length + 1, data.dailyColumns);
  sheet.autoFilter = { from: { row: dailyHeaderRow, column: 2 }, to: { row: dailyEndRow, column: data.dailyColumns.length + 1 } };

  const campaignSectionRow = dailyEndRow + 3;
  addSectionHeader(sheet, campaignSectionRow, "CAMPAIGN RESULTS — ANONYMIZED", data.campaignColumns.length + 1);
  const campaignHeaderRow = campaignSectionRow + 1;
  data.campaignColumns.forEach((column, index) => { sheet.getCell(campaignHeaderRow, index + 2).value = column.title; });
  styleHeaderRow(sheet, campaignHeaderRow, 2, data.campaignColumns.length + 1);
  data.campaigns.forEach((row, index) => {
    data.campaignColumns.forEach((column, columnIndex) => { sheet.getCell(campaignHeaderRow + 1 + index, columnIndex + 2).value = row[column.key] ?? null; });
  });
  const campaignEndRow = campaignHeaderRow + data.campaigns.length;
  styleTable(sheet, campaignHeaderRow + 1, campaignEndRow, 2, data.campaignColumns.length + 1, data.campaignColumns);
  sheet.autoFilter = { from: { row: campaignHeaderRow, column: 2 }, to: { row: campaignEndRow, column: data.campaignColumns.length + 1 } };

  const definitionSectionRow = campaignEndRow + 3;
  addSectionHeader(sheet, definitionSectionRow, "METRIC DEFINITIONS", 3);
  sheet.getCell(definitionSectionRow + 1, 2).value = "Metric";
  sheet.getCell(definitionSectionRow + 1, 3).value = "Definition";
  styleHeaderRow(sheet, definitionSectionRow + 1, 2, 3);
  data.fieldDefinitions.forEach((item, index) => {
    const row = definitionSectionRow + 2 + index;
    sheet.getCell(row, 2).value = item.metric;
    sheet.getCell(row, 3).value = item.definition;
  });
  styleTable(sheet, definitionSectionRow + 2, definitionSectionRow + 1 + data.fieldDefinitions.length, 2, 3, [{ key: "metric", kind: "text" }, { key: "definition", kind: "text" }]);

  sheet.views = [{ state: "frozen", ySplit: dailyHeaderRow, xSplit: 1, showGridLines: false }];
  for (let column = 2; column <= Math.max(data.dailyColumns.length + 1, data.campaignColumns.length + 1); column += 1) {
    const header = text(sheet.getRow(dailyHeaderRow).getCell(column).value);
    sheet.getColumn(column).width = Math.min(Math.max(header.length + 4, column === 2 ? 18 : 14), 32);
  }
  sheet.getColumn(2).width = 24;
  sheet.getColumn(3).width = Math.max(sheet.getColumn(3).width, 20);
}

function writeOverview(workbook: ExcelJS.Workbook, platforms: PlatformData[]) {
  const sheet = workbook.addWorksheet("Overview", { views: [{ showGridLines: false }] });
  sheet.getColumn(1).width = 3;
  sheet.getColumn(2).width = 22;
  sheet.getColumn(3).width = 27;
  sheet.getColumn(4).width = 19;
  sheet.getColumn(5).width = 19;
  sheet.getColumn(6).width = 22;
  addTitle(
    sheet,
    "Cross-platform Media Metrics — Anonymized Example",
    "Real results collected live via Windsor.ai. The workbook is designed to map common reporting fields without exposing client, account, campaign, ad group, creative or identifier information.",
    6,
  );

  addSectionHeader(sheet, 5, "SCOPE AND PRIVACY", 6);
  const notes = [
    ["Source", "Windsor.ai live API only. No direct Meta, Google or TikTok connector data was used."],
    ["Reporting windows", "Google Ads and Meta Ads: 03–17 Sep 2026 (15 closed days). TikTok Ads: 17–31 Aug 2026 (15 days of the prior month)."],
    ["Anonymization", "Account names/IDs, campaign names/IDs, ad group names/IDs, creative names/IDs, geographic client references and URLs were removed. Campaigns are numbered by spend."],
    ["Interpretation", "Platform definitions and attribution models differ. Compare trends within each platform; do not treat identical labels as automatically equivalent across platforms."],
  ];
  notes.forEach(([label, value], index) => {
    const row = 6 + index;
    sheet.getCell(row, 2).value = label;
    sheet.getCell(row, 3).value = value;
    sheet.mergeCells(`C${row}:F${row}`);
    sheet.getCell(row, 2).font = { name: "Calibri", size: 10, bold: true, color: { argb: COLORS.primary } };
    sheet.getCell(row, 3).font = { name: "Calibri", size: 10, color: { argb: COLORS.text } };
    sheet.getCell(row, 3).alignment = { wrapText: true, vertical: "middle" };
    sheet.getRow(row).height = 32;
  });

  addSectionHeader(sheet, 12, "WORKBOOK INDEX", 6);
  const indexHeaders = ["Sheet", "Tool", "Period", "Metric scope", "Data source"];
  indexHeaders.forEach((header, index) => { sheet.getCell(13, index + 2).value = header; });
  styleHeaderRow(sheet, 13, 2, 6);
  platforms.forEach((platform, index) => {
    const row = 14 + index;
    const tab = sheet.getCell(row, 2);
    tab.value = { text: platform.platform, hyperlink: `#'${platform.platform}'!B2` };
    tab.font = { name: "Calibri", size: 10, color: { argb: COLORS.accent }, underline: true };
    sheet.getCell(row, 3).value = platform.platform;
    sheet.getCell(row, 4).value = `${platform.dateFrom} to ${platform.dateTo}`;
    sheet.getCell(row, 5).value = `${platform.summary.length} summary metrics + daily and campaign views`;
    sheet.getCell(row, 6).value = "Windsor.ai live";
  });
  styleTable(sheet, 14, 13 + platforms.length, 2, 6, indexHeaders.map((key, index) => ({ key, kind: index === 3 ? "text" : "text" })));

  addSectionHeader(sheet, 19, "METRICS AVAILABLE BY PLATFORM", 6);
  const metricHeaders = ["Metric family", "Google Ads", "Meta Ads", "TikTok Ads", "Notes"];
  metricHeaders.forEach((header, index) => { sheet.getCell(20, index + 2).value = header; });
  styleHeaderRow(sheet, 20, 2, 6);
  const availability = [
    ["Investment & delivery", "Investment, impressions, clicks", "Spend, impressions, reach, frequency, clicks", "Spend, impressions, reach, clicks", "Core delivery fields available across all three."],
    ["Traffic efficiency", "CTR, CPC", "CTR, CPM, CPC", "CTR, CPM, CPC", "Formulas are calculated from live totals in this workbook."],
    ["Outcome", "Conversions, CPA, conversion rate", "Leads, CPL", "On-site form leads, conversions, CPL", "The platform-specific conversion event is explicitly labelled."],
    ["Campaign controls", "Status, bidding strategy, budget, optimization score, Search IS", "Status, objective", "Operation/delivery status, optimization goal", "Control fields vary by platform."],
    ["Engagement & video", "Not included in current export", "Not included in current export", "Engagements, engagement rate, comments, shares, average video play", "TikTok includes additional video/engagement fields."],
  ];
  availability.forEach((values, index) => values.forEach((value, column) => { sheet.getCell(21 + index, column + 2).value = value; }));
  styleTable(sheet, 21, 25, 2, 6, metricHeaders.map((key, index) => ({ key, kind: "text" })));
  sheet.views = [{ showGridLines: false }];
}

async function validateWorkbook(outputPath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputPath);
  const expectedSheets = ["Overview", "Google Ads", "Meta Ads", "TikTok Ads"];
  const actualSheets = workbook.worksheets.map(sheet => sheet.name);
  if (JSON.stringify(actualSheets) !== JSON.stringify(expectedSheets)) {
    throw new Error(`Estrutura inválida do Excel: ${actualSheets.join(", ")}`);
  }
  const forbidden = ["mg motor", "mg motors", "ag. bbro", "bbro -", "535-798-6801", "1418731006678061", "7668787778449719316"];
  for (const sheet of workbook.worksheets) {
    let populated = 0;
    sheet.eachRow(row => row.eachCell(cell => {
      if (cell.value == null || cell.value === "") return;
      populated += 1;
      const content = String(cell.value).toLocaleLowerCase("pt-BR");
      if (forbidden.some(token => content.includes(token))) {
        throw new Error(`Validação de anonimização falhou na aba ${sheet.name}.`);
      }
    }));
    if (populated < 15) throw new Error(`Aba ${sheet.name} sem conteúdo suficiente.`);
  }
}

async function main() {
  const [google, meta, tiktok] = await Promise.all([collectGoogle(), collectMeta(), collectTikTok()]);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Manus AI";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.properties.title = "Anonymized Cross-platform Media Metrics";
  workbook.properties.subject = "Windsor.ai live data — Google Ads, Meta Ads and TikTok Ads";
  workbook.properties.company = "Anonymized";

  writeOverview(workbook, [google, meta, tiktok]);
  writePlatformSheet(workbook, google);
  writePlatformSheet(workbook, meta);
  writePlatformSheet(workbook, tiktok);
  await workbook.xlsx.writeFile(path.resolve(OUTPUT_PATH));
  await validateWorkbook(OUTPUT_PATH);

  process.stdout.write(JSON.stringify({
    outputPath: OUTPUT_PATH,
    source: "windsor-live",
    periods: {
      google: `${google.dateFrom} to ${google.dateTo}`,
      meta: `${meta.dateFrom} to ${meta.dateTo}`,
      tiktok: `${tiktok.dateFrom} to ${tiktok.dateTo}`,
    },
    rows: {
      googleDaily: google.daily.length,
      googleCampaigns: google.campaigns.length,
      metaDaily: meta.daily.length,
      metaCampaigns: meta.campaigns.length,
      tiktokDaily: tiktok.daily.length,
      tiktokCampaigns: tiktok.campaigns.length,
    },
    anonymized: true,
  }, null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
