import ExcelJS from "exceljs";
import path from "node:path";

type RawRow = Record<string, unknown>;
type Metric = { metric: string; value: string | number | null; unit: string; definition: string };

const apiKey = process.env.WINDSOR_API_KEY;
if (!apiKey) throw new Error("WINDSOR_API_KEY não configurada");

const OUTPUT_PATH = "/home/ubuntu/exports/Metricas_30_Principais_Por_Canal_Windsor_15D.xlsx";
const PERIODS = {
  google: { dateFrom: "2026-09-03", dateTo: "2026-09-17" },
  meta: { dateFrom: "2026-09-03", dateTo: "2026-09-17" },
  tiktok: { dateFrom: "2026-08-17", dateTo: "2026-08-31" },
} as const;

const CHANNELS = {
  google: { endpoint: "https://connectors.windsor.ai/google_ads", accountId: "535-798-6801" },
  meta: { endpoint: "https://connectors.windsor.ai/facebook", accountId: "1418731006678061" },
  tiktok: { endpoint: "https://connectors.windsor.ai/tiktok", accountId: "7668787778449719316" },
} as const;

function number(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nullableNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function division(numerator: number, denominator: number): number | null {
  return denominator > 0 ? round(numerator / denominator) : null;
}

function percentage(numerator: number, denominator: number): number | null {
  return denominator > 0 ? round((numerator / denominator) * 100) : null;
}

function sum(rows: RawRow[], key: string): number {
  return rows.reduce((total, row) => total + number(row[key]), 0);
}

function average(values: number[]): number | null {
  return values.length ? round(values.reduce((total, value) => total + value, 0) / values.length) : null;
}

function max(values: number[]): number | null {
  return values.length ? round(Math.max(...values)) : null;
}

function min(values: number[]): number | null {
  return values.length ? round(Math.min(...values)) : null;
}

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.map(value => (value ?? "").trim()).filter(Boolean))];
}

function dateList(dateFrom: string, dateTo: string): string[] {
  const result: string[] = [];
  const current = new Date(`${dateFrom}T12:00:00.000Z`);
  const end = new Date(`${dateTo}T12:00:00.000Z`);
  while (current <= end) {
    result.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return result;
}

async function query(input: {
  endpoint: string;
  accountId: string;
  fields: string[];
  dateFrom: string;
  dateTo: string;
  label: string;
}): Promise<RawRow[]> {
  const params = new URLSearchParams({
    api_key: apiKey,
    fields: input.fields.join(","),
    date_from: input.dateFrom,
    date_to: input.dateTo,
    filter: JSON.stringify([["account_id", "eq", input.accountId]]),
    _max_rows: "100000",
  });
  const response = await fetch(`${input.endpoint}?${params.toString()}`, {
    signal: AbortSignal.timeout(60_000),
    headers: { "User-Agent": "Windsor-Top-Metrics-Raw-Export/1.0" },
  });
  if (!response.ok) throw new Error(`${input.label}: Windsor.ai respondeu HTTP ${response.status}`);
  const payload = (await response.json()) as { data?: unknown };
  const rows = Array.isArray(payload.data)
    ? payload.data.filter((item): item is RawRow => Boolean(item) && typeof item === "object")
    : [];
  if (!rows.length) throw new Error(`${input.label}: Windsor.ai não retornou dados.`);
  return rows;
}

function dailySeries(rows: RawRow[], values: string[]) {
  const byDate = new Map<string, Record<string, number>>();
  for (const row of rows) {
    const date = text(row.date);
    if (!date) continue;
    const current = byDate.get(date) ?? {};
    for (const key of values) current[key] = (current[key] ?? 0) + number(row[key]);
    byDate.set(date, current);
  }
  return Array.from(byDate.entries()).map(([date, measures]) => ({ date, ...measures }));
}

function standardPeriodMetrics(dateFrom: string, dateTo: string, availableDates: string[]): Metric[] {
  const requested = dateList(dateFrom, dateTo);
  const missing = requested.filter(date => !availableDates.includes(date));
  return [
    { metric: "Period start", value: dateFrom, unit: "date", definition: "First requested date." },
    { metric: "Period end", value: dateTo, unit: "date", definition: "Last requested date." },
    { metric: "Requested calendar days", value: requested.length, unit: "days", definition: "Inclusive day count for the requested reporting window." },
    { metric: "Reported days", value: availableDates.length, unit: "days", definition: "Dates returned by the live Windsor.ai response." },
    { metric: "Missing source days", value: missing.length, unit: "days", definition: "Requested dates absent from the live source; never treated as zero." },
  ];
}

async function googleMetrics(): Promise<Metric[]> {
  const period = PERIODS.google;
  const fields = [
    "account_id", "datasource", "campaign_id", "date", "spend", "conversions", "clicks", "impressions",
    "budget_amount", "campaign_status", "bidding_strategy_type", "optimization_score",
    "search_impression_share", "search_budget_lost_impression_share",
  ];
  const raw = await query({ ...CHANNELS.google, fields, ...period, label: "Google Ads" });
  const rows = raw.filter(row => text(row.account_id) === CHANNELS.google.accountId && text(row.datasource) === "google_ads");
  if (!rows.length) throw new Error("Google Ads: nenhuma linha válida retornada pelo Windsor.ai.");
  const daily = dailySeries(rows, ["spend", "conversions", "clicks", "impressions"]);
  const dates = daily.map(row => row.date).sort();
  const spend = sum(rows, "spend");
  const conversions = sum(rows, "conversions");
  const clicks = sum(rows, "clicks");
  const impressions = sum(rows, "impressions");
  const campaigns = unique(rows.map(row => text(row.campaign_id)));
  const latestByCampaign = new Map<string, RawRow>();
  for (const row of rows) {
    const id = text(row.campaign_id);
    if (!id || !latestByCampaign.get(id) || text(row.date) >= text(latestByCampaign.get(id)?.date)) latestByCampaign.set(id, row);
  }
  const latest = Array.from(latestByCampaign.values());
  const enabled = latest.filter(row => text(row.campaign_status).toUpperCase() === "ENABLED").length;
  const paused = latest.filter(row => text(row.campaign_status).toUpperCase() === "PAUSED").length;
  const dailySpend = daily.map(row => number(row.spend));
  const dailyConversions = daily.map(row => number(row.conversions));
  const dailyClicks = daily.map(row => number(row.clicks));
  const dailyImpressions = daily.map(row => number(row.impressions));
  const budgets = latest.map(row => nullableNumber(row.budget_amount)).filter((value): value is number => value != null);
  const scores = latest.map(row => nullableNumber(row.optimization_score)).filter((value): value is number => value != null);
  const searchIS = latest.map(row => nullableNumber(row.search_impression_share)).filter((value): value is number => value != null);
  const lostIS = latest.map(row => nullableNumber(row.search_budget_lost_impression_share)).filter((value): value is number => value != null);

  return [
    ...standardPeriodMetrics(period.dateFrom, period.dateTo, dates),
    { metric: "Spend", value: round(spend), unit: "BRL", definition: "Total Google Ads spend returned by Windsor.ai." },
    { metric: "Conversions", value: round(conversions, 1), unit: "count", definition: "Total Google Ads conversions." },
    { metric: "CPA", value: division(spend, conversions), unit: "BRL / conversion", definition: "Spend divided by conversions." },
    { metric: "Impressions", value: round(impressions), unit: "count", definition: "Total delivered impressions." },
    { metric: "Clicks", value: round(clicks), unit: "count", definition: "Total clicks." },
    { metric: "CTR", value: percentage(clicks, impressions), unit: "%", definition: "Clicks divided by impressions." },
    { metric: "CPC", value: division(spend, clicks), unit: "BRL / click", definition: "Spend divided by clicks." },
    { metric: "Conversion rate", value: percentage(conversions, clicks), unit: "%", definition: "Conversions divided by clicks." },
    { metric: "Average daily spend", value: average(dailySpend), unit: "BRL / reported day", definition: "Spend divided by reported days." },
    { metric: "Average daily conversions", value: average(dailyConversions), unit: "conversions / reported day", definition: "Conversions divided by reported days." },
    { metric: "Average daily clicks", value: average(dailyClicks), unit: "clicks / reported day", definition: "Clicks divided by reported days." },
    { metric: "Average daily impressions", value: average(dailyImpressions), unit: "impressions / reported day", definition: "Impressions divided by reported days." },
    { metric: "Highest daily spend", value: max(dailySpend), unit: "BRL", definition: "Maximum spend across reported days." },
    { metric: "Lowest daily spend", value: min(dailySpend), unit: "BRL", definition: "Minimum spend across reported days." },
    { metric: "Highest daily conversions", value: max(dailyConversions), unit: "count", definition: "Maximum conversions across reported days." },
    { metric: "Lowest daily conversions", value: min(dailyConversions), unit: "count", definition: "Minimum conversions across reported days." },
    { metric: "Campaigns", value: campaigns.length, unit: "count", definition: "Distinct campaigns returned, anonymized in this export." },
    { metric: "Enabled campaigns", value: enabled, unit: "count", definition: "Campaigns with latest returned status ENABLED." },
    { metric: "Paused campaigns", value: paused, unit: "count", definition: "Campaigns with latest returned status PAUSED." },
    { metric: "Campaigns with conversions", value: Array.from(latestByCampaign.keys()).filter(id => rows.filter(row => text(row.campaign_id) === id).some(row => number(row.conversions) > 0)).length, unit: "count", definition: "Distinct campaigns with at least one conversion in the period." },
    { metric: "Latest average daily budget", value: average(budgets), unit: "BRL / day", definition: "Average latest campaign budget_amount returned by the source." },
    { metric: "Latest total daily budget", value: round(budgets.reduce((total, value) => total + value, 0)), unit: "BRL / day", definition: "Sum of latest campaign budget_amount values." },
    { metric: "Average optimization score", value: average(scores), unit: "source value", definition: "Average latest optimization_score among campaigns where returned." },
    { metric: "Average Search impression share", value: average(searchIS), unit: "source value", definition: "Average latest search_impression_share as returned by Windsor.ai." },
    { metric: "Average Search lost IS (budget)", value: average(lostIS), unit: "source value", definition: "Average latest search_budget_lost_impression_share as returned by Windsor.ai." },
    { metric: "Bidding strategies", value: unique(latest.map(row => text(row.bidding_strategy_type))).length, unit: "count", definition: "Distinct latest bidding_strategy_type values." },
    { metric: "Campaigns with optimization score", value: scores.length, unit: "count", definition: "Campaigns with a latest optimization_score returned." },
    { metric: "Campaigns with Search IS", value: searchIS.length, unit: "count", definition: "Campaigns with a latest search_impression_share returned." },
  ];
}

async function metaMetrics(): Promise<Metric[]> {
  const period = PERIODS.meta;
  const dailyFields = ["account_id", "date", "spend", "actions_lead", "impressions", "reach", "frequency", "clicks", "cpm", "cpc", "ctr"];
  const campaignFields = ["account_id", "campaign_id", "campaign_effective_status", "campaign_status", "campaign_objective", "spend", "actions_lead", "impressions", "reach", "frequency", "clicks", "cpm", "cpc", "ctr"];
  const [dailyRaw, campaignRaw] = await Promise.all([
    query({ ...CHANNELS.meta, fields: dailyFields, ...period, label: "Meta Ads daily" }),
    query({ ...CHANNELS.meta, fields: campaignFields, ...period, label: "Meta Ads campaigns" }),
  ]);
  const dailyRows = dailyRaw.filter(row => text(row.account_id) === CHANNELS.meta.accountId);
  const campaignRows = campaignRaw.filter(row => text(row.account_id) === CHANNELS.meta.accountId);
  if (!dailyRows.length || !campaignRows.length) throw new Error("Meta Ads: retorno Windsor.ai incompleto.");
  const daily = dailySeries(dailyRows, ["spend", "actions_lead", "impressions", "reach", "clicks"]);
  const dates = daily.map(row => row.date).sort();
  const spend = sum(dailyRows, "spend");
  const leads = sum(dailyRows, "actions_lead");
  const impressions = sum(dailyRows, "impressions");
  const reach = sum(dailyRows, "reach");
  const clicks = sum(dailyRows, "clicks");
  const dailySpend = daily.map(row => number(row.spend));
  const dailyLeads = daily.map(row => number(row.actions_lead));
  const dailyClicks = daily.map(row => number(row.clicks));
  const dailyImpressions = daily.map(row => number(row.impressions));
  const active = campaignRows.filter(row => text(row.campaign_effective_status || row.campaign_status).toUpperCase() === "ACTIVE").length;
  const paused = campaignRows.filter(row => text(row.campaign_effective_status || row.campaign_status).toUpperCase() === "PAUSED").length;
  const campaignSpends = campaignRows.map(row => number(row.spend));
  const campaignLeads = campaignRows.map(row => number(row.actions_lead));
  const campaignCpls = campaignRows.filter(row => number(row.actions_lead) > 0).map(row => division(number(row.spend), number(row.actions_lead))!).filter((value): value is number => value != null);
  const objectives = unique(campaignRows.map(row => text(row.campaign_objective)));

  return [
    ...standardPeriodMetrics(period.dateFrom, period.dateTo, dates),
    { metric: "Spend", value: round(spend), unit: "BRL", definition: "Total Meta Ads spend returned by Windsor.ai." },
    { metric: "Leads", value: round(leads), unit: "count", definition: "Meta actions_lead metric." },
    { metric: "CPL", value: division(spend, leads), unit: "BRL / lead", definition: "Spend divided by actions_lead." },
    { metric: "Impressions", value: round(impressions), unit: "count", definition: "Total delivered impressions." },
    { metric: "Reach", value: round(reach), unit: "count", definition: "Total reach as returned by the daily source." },
    { metric: "Frequency", value: division(impressions, reach), unit: "impressions / reach", definition: "Impressions divided by reach." },
    { metric: "Clicks", value: round(clicks), unit: "count", definition: "Total clicks." },
    { metric: "CTR", value: percentage(clicks, impressions), unit: "%", definition: "Clicks divided by impressions." },
    { metric: "CPM", value: division(spend * 1000, impressions), unit: "BRL / 1,000 impressions", definition: "Spend per thousand impressions." },
    { metric: "CPC", value: division(spend, clicks), unit: "BRL / click", definition: "Spend divided by clicks." },
    { metric: "Average daily spend", value: average(dailySpend), unit: "BRL / reported day", definition: "Spend divided by reported days." },
    { metric: "Average daily leads", value: average(dailyLeads), unit: "leads / reported day", definition: "Leads divided by reported days." },
    { metric: "Average daily clicks", value: average(dailyClicks), unit: "clicks / reported day", definition: "Clicks divided by reported days." },
    { metric: "Average daily impressions", value: average(dailyImpressions), unit: "impressions / reported day", definition: "Impressions divided by reported days." },
    { metric: "Highest daily spend", value: max(dailySpend), unit: "BRL", definition: "Maximum spend across reported days." },
    { metric: "Lowest daily spend", value: min(dailySpend), unit: "BRL", definition: "Minimum spend across reported days." },
    { metric: "Highest daily leads", value: max(dailyLeads), unit: "count", definition: "Maximum leads across reported days." },
    { metric: "Lowest daily leads", value: min(dailyLeads), unit: "count", definition: "Minimum leads across reported days." },
    { metric: "Campaigns", value: campaignRows.length, unit: "count", definition: "Campaign rows returned, anonymized in this export." },
    { metric: "Active campaigns", value: active, unit: "count", definition: "Campaigns with ACTIVE effective/latest returned status." },
    { metric: "Paused campaigns", value: paused, unit: "count", definition: "Campaigns with PAUSED effective/latest returned status." },
    { metric: "Campaigns with leads", value: campaignRows.filter(row => number(row.actions_lead) > 0).length, unit: "count", definition: "Campaign rows with at least one actions_lead result." },
    { metric: "Campaigns without leads", value: campaignRows.filter(row => number(row.actions_lead) === 0).length, unit: "count", definition: "Campaign rows without actions_lead in the period." },
    { metric: "Average campaign spend", value: average(campaignSpends), unit: "BRL / campaign", definition: "Average spend across returned campaign rows." },
    { metric: "Average campaign leads", value: average(campaignLeads), unit: "leads / campaign", definition: "Average actions_lead across returned campaign rows." },
    { metric: "Average campaign CPL", value: average(campaignCpls), unit: "BRL / lead", definition: "Average individual campaign CPL; excludes campaigns with zero leads." },
    { metric: "Lowest campaign CPL", value: min(campaignCpls), unit: "BRL / lead", definition: "Best individual campaign CPL; excludes campaigns with zero leads." },
    { metric: "Highest campaign CPL", value: max(campaignCpls), unit: "BRL / lead", definition: "Highest individual campaign CPL; excludes campaigns with zero leads." },
    { metric: "Objectives", value: objectives.length, unit: "count", definition: "Distinct campaign_objective values returned." },
    { metric: "Lead-objective campaigns", value: campaignRows.filter(row => text(row.campaign_objective).toUpperCase().includes("LEAD")).length, unit: "count", definition: "Campaigns whose returned objective contains LEAD." },
  ];
}

async function tiktokMetrics(): Promise<Metric[]> {
  const period = PERIODS.tiktok;
  const dailyFields = ["account_id", "date", "spend", "onsite_form", "conversions", "impressions", "reach", "clicks", "engagements", "comments", "shares", "average_video_play"];
  const campaignFields = ["account_id", "campaign_id", "campaign_operation_status", "campaign_status", "campaign_optimization_goal", "spend", "onsite_form", "conversions", "impressions", "reach", "clicks", "engagements", "comments", "shares", "average_video_play"];
  const [dailyRaw, campaignRaw] = await Promise.all([
    query({ ...CHANNELS.tiktok, fields: dailyFields, ...period, label: "TikTok Ads daily" }),
    query({ ...CHANNELS.tiktok, fields: campaignFields, ...period, label: "TikTok Ads campaigns" }),
  ]);
  const dailyRows = dailyRaw.filter(row => text(row.account_id) === CHANNELS.tiktok.accountId);
  const campaignRows = campaignRaw.filter(row => text(row.account_id) === CHANNELS.tiktok.accountId);
  if (!dailyRows.length || !campaignRows.length) throw new Error("TikTok Ads: retorno Windsor.ai incompleto.");
  const daily = dailySeries(dailyRows, ["spend", "onsite_form", "conversions", "impressions", "reach", "clicks", "engagements", "comments", "shares"]);
  const dates = daily.map(row => row.date).sort();
  const spend = sum(dailyRows, "spend");
  const leads = sum(dailyRows, "onsite_form");
  const conversions = sum(dailyRows, "conversions");
  const impressions = sum(dailyRows, "impressions");
  const reach = sum(dailyRows, "reach");
  const clicks = sum(dailyRows, "clicks");
  const engagements = sum(dailyRows, "engagements");
  const comments = sum(dailyRows, "comments");
  const shares = sum(dailyRows, "shares");
  const weightedVideoPlay = dailyRows.reduce((total, row) => total + number(row.average_video_play) * number(row.impressions), 0);
  const dailySpend = daily.map(row => number(row.spend));
  const dailyLeads = daily.map(row => number(row.onsite_form));
  const dailyConversions = daily.map(row => number(row.conversions));
  const dailyEngagements = daily.map(row => number(row.engagements));
  const active = campaignRows.filter(row => text(row.campaign_operation_status).toUpperCase() === "ENABLE").length;
  const campaignSpends = campaignRows.map(row => number(row.spend));
  const campaignLeads = campaignRows.map(row => number(row.onsite_form));
  const campaignCpls = campaignRows.filter(row => number(row.onsite_form) > 0).map(row => division(number(row.spend), number(row.onsite_form))!).filter((value): value is number => value != null);
  const deliveryStatuses = unique(campaignRows.map(row => text(row.campaign_status)));
  const objectives = unique(campaignRows.map(row => text(row.campaign_optimization_goal)));

  return [
    ...standardPeriodMetrics(period.dateFrom, period.dateTo, dates),
    { metric: "Spend", value: round(spend), unit: "BRL", definition: "Total TikTok Ads spend returned by Windsor.ai." },
    { metric: "On-site form leads", value: round(leads), unit: "count", definition: "TikTok onsite_form result metric." },
    { metric: "Conversions", value: round(conversions), unit: "count", definition: "TikTok conversions metric, separate from onsite_form." },
    { metric: "CPL", value: division(spend, leads), unit: "BRL / on-site form lead", definition: "Spend divided by onsite_form." },
    { metric: "Impressions", value: round(impressions), unit: "count", definition: "Total delivered impressions." },
    { metric: "Reach", value: round(reach), unit: "count", definition: "Total reach as returned by the daily source." },
    { metric: "Frequency", value: division(impressions, reach), unit: "impressions / reach", definition: "Impressions divided by reach." },
    { metric: "Clicks", value: round(clicks), unit: "count", definition: "Total clicks." },
    { metric: "CTR", value: percentage(clicks, impressions), unit: "%", definition: "Clicks divided by impressions." },
    { metric: "CPM", value: division(spend * 1000, impressions), unit: "BRL / 1,000 impressions", definition: "Spend per thousand impressions." },
    { metric: "CPC", value: division(spend, clicks), unit: "BRL / click", definition: "Spend divided by clicks." },
    { metric: "Engagements", value: round(engagements), unit: "count", definition: "Total engagement actions returned by TikTok." },
    { metric: "Engagement rate", value: percentage(engagements, impressions), unit: "%", definition: "Engagements divided by impressions." },
    { metric: "Comments", value: round(comments), unit: "count", definition: "Total comments." },
    { metric: "Shares", value: round(shares), unit: "count", definition: "Total shares." },
    { metric: "Average video play", value: division(weightedVideoPlay, impressions), unit: "source value", definition: "Impression-weighted average_video_play returned by TikTok." },
    { metric: "Average daily spend", value: average(dailySpend), unit: "BRL / reported day", definition: "Spend divided by reported days." },
    { metric: "Average daily on-site form leads", value: average(dailyLeads), unit: "leads / reported day", definition: "On-site form leads divided by reported days." },
    { metric: "Average daily conversions", value: average(dailyConversions), unit: "conversions / reported day", definition: "Conversions divided by reported days." },
    { metric: "Average daily engagements", value: average(dailyEngagements), unit: "engagements / reported day", definition: "Engagements divided by reported days." },
    { metric: "Highest daily spend", value: max(dailySpend), unit: "BRL", definition: "Maximum spend across reported days." },
    { metric: "Lowest daily spend", value: min(dailySpend), unit: "BRL", definition: "Minimum spend across reported days." },
    { metric: "Highest daily on-site form leads", value: max(dailyLeads), unit: "count", definition: "Maximum onsite_form result across reported days." },
    { metric: "Lowest daily on-site form leads", value: min(dailyLeads), unit: "count", definition: "Minimum onsite_form result across reported days." },
    { metric: "Campaigns", value: campaignRows.length, unit: "count", definition: "Campaign rows returned, anonymized in this export." },
    { metric: "Enabled campaigns", value: active, unit: "count", definition: "Campaign rows with campaign_operation_status ENABLE." },
    { metric: "Campaigns with on-site form leads", value: campaignRows.filter(row => number(row.onsite_form) > 0).length, unit: "count", definition: "Campaign rows with at least one onsite_form result." },
    { metric: "Average campaign spend", value: average(campaignSpends), unit: "BRL / campaign", definition: "Average spend across returned campaign rows." },
    { metric: "Average campaign on-site form leads", value: average(campaignLeads), unit: "leads / campaign", definition: "Average onsite_form across returned campaign rows." },
    { metric: "Average campaign CPL", value: average(campaignCpls), unit: "BRL / lead", definition: "Average individual campaign CPL; excludes campaigns with zero leads." },
    { metric: "Lowest campaign CPL", value: min(campaignCpls), unit: "BRL / lead", definition: "Best individual campaign CPL; excludes campaigns with zero leads." },
    { metric: "Highest campaign CPL", value: max(campaignCpls), unit: "BRL / lead", definition: "Highest individual campaign CPL; excludes campaigns with zero leads." },
    { metric: "Delivery statuses", value: deliveryStatuses.length, unit: "count", definition: "Distinct campaign_status values returned." },
    { metric: "Optimization goals", value: objectives.length, unit: "count", definition: "Distinct campaign_optimization_goal values returned." },
  ];
}

function writeSheet(workbook: ExcelJS.Workbook, sheetName: string, metrics: Metric[]) {
  if (metrics.length < 30) throw new Error(`${sheetName}: são necessárias ao menos 30 métricas; recebidas ${metrics.length}.`);
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = [
    { header: "Metric", key: "metric", width: 34 },
    { header: "Value", key: "value", width: 22 },
    { header: "Unit", key: "unit", width: 28 },
    { header: "Definition", key: "definition", width: 72 },
  ];
  for (const metric of metrics) sheet.addRow([metric.metric, metric.value, metric.unit, metric.definition]);
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = "A1:D" + String(1 + metrics.length);
  sheet.getColumn(2).numFmt = "#,##0.00";
}

async function validate(outputPath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputPath);
  const expected = ["Google Ads", "Meta Ads", "TikTok Ads"];
  if (workbook.worksheets.map(sheet => sheet.name).join("|") !== expected.join("|")) {
    throw new Error("Abas do arquivo final não correspondem aos canais solicitados.");
  }
  const forbidden = ["mg motor", "mg motors", "ag. bbro", "535-798-6801", "1418731006678061", "7668787778449719316"];
  for (const sheet of workbook.worksheets) {
    if (sheet.rowCount < 31) throw new Error(`${sheet.name}: menos de 30 métricas exportadas.`);
    sheet.eachRow(row => row.eachCell(cell => {
      const value = String(cell.value ?? "").toLocaleLowerCase("pt-BR");
      if (forbidden.some(token => value.includes(token))) throw new Error(`${sheet.name}: possível identificador sensível no arquivo.`);
    }));
  }
}

async function main() {
  const [google, meta, tiktok] = await Promise.all([googleMetrics(), metaMetrics(), tiktokMetrics()]);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Manus AI";
  workbook.properties.title = "Raw top media metrics by channel";
  writeSheet(workbook, "Google Ads", google);
  writeSheet(workbook, "Meta Ads", meta);
  writeSheet(workbook, "TikTok Ads", tiktok);
  await workbook.xlsx.writeFile(path.resolve(OUTPUT_PATH));
  await validate(OUTPUT_PATH);
  process.stdout.write(JSON.stringify({
    outputPath: OUTPUT_PATH,
    source: "windsor-live",
    metricCount: { google: google.length, meta: meta.length, tiktok: tiktok.length },
    periods: PERIODS,
    anonymized: true,
  }, null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
