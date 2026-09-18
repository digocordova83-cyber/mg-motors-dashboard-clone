import ExcelJS from "exceljs";

type RawRow = Record<string, unknown>;
type DailyRow = Record<string, string | number | null>;
type Column = { header: string; key: string; width?: number };

const apiKey = process.env.WINDSOR_API_KEY;
if (!apiKey) throw new Error("WINDSOR_API_KEY não configurada");

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

const OUTPUTS = {
  google: "/home/ubuntu/exports/Metricas_Google_Ads_Windsor_15D.xlsx",
  meta: "/home/ubuntu/exports/Metricas_Meta_Ads_Windsor_15D.xlsx",
  tiktok: "/home/ubuntu/exports/Metricas_TikTok_Ads_Windsor_15D.xlsx",
} as const;

function number(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nullable(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function round(value: number | null, digits = 2): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function ratio(numerator: number | null, denominator: number | null, multiplier = 1): number | null {
  if (numerator == null || denominator == null || denominator <= 0) return null;
  return round((numerator / denominator) * multiplier);
}

function deltaPercent(current: number | null, prior: number | null): number | null {
  if (current == null || prior == null || prior === 0) return null;
  return round(((current - prior) / Math.abs(prior)) * 100);
}

function deltaPoints(current: number | null, prior: number | null): number | null {
  if (current == null || prior == null) return null;
  return round(current - prior);
}

function average(values: Array<number | null>): number | null {
  const existing = values.filter((value): value is number => value != null);
  if (!existing.length) return null;
  return round(existing.reduce((total, value) => total + value, 0) / existing.length);
}

function dateList(dateFrom: string, dateTo: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${dateFrom}T12:00:00.000Z`);
  const end = new Date(`${dateTo}T12:00:00.000Z`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
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
    headers: { "User-Agent": "Windsor-Daily-Metrics-Columns/1.0" },
  });
  if (!response.ok) throw new Error(`${input.label}: Windsor.ai respondeu HTTP ${response.status}.`);
  const payload = (await response.json()) as { data?: unknown };
  const rows = Array.isArray(payload.data)
    ? payload.data.filter((item): item is RawRow => Boolean(item) && typeof item === "object")
    : [];
  if (!rows.length) throw new Error(`${input.label}: Windsor.ai não retornou dados.`);
  return rows;
}

function sum(rows: RawRow[], key: string): number {
  return rows.reduce((total, row) => total + number(row[key]), 0);
}

function countDistinct(rows: RawRow[], key: string): number {
  return new Set(rows.map(row => text(row[key])).filter(Boolean)).size;
}

function groupByDate(rows: RawRow[]): Map<string, RawRow[]> {
  const grouped = new Map<string, RawRow[]>();
  for (const row of rows) {
    const date = text(row.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    grouped.set(date, [...(grouped.get(date) ?? []), row]);
  }
  return grouped;
}

function buildDateRows(period: { dateFrom: string; dateTo: string }, grouped: Map<string, RawRow[]>) {
  return dateList(period.dateFrom, period.dateTo).map(date => ({
    Data: date,
    "Status da fonte": grouped.has(date) ? "Reportado" : "Não retornado pela fonte",
    records: grouped.get(date) ?? [],
  }));
}

function addDerivedChanges(rows: DailyRow[], keys: Array<{ value: string; change: string; kind: "percent" | "points" }>) {
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const prior = rows[index - 1];
    for (const item of keys) {
      const currentValue = typeof row[item.value] === "number" ? row[item.value] as number : null;
      const priorValue = prior && typeof prior[item.value] === "number" ? prior[item.value] as number : null;
      row[item.change] = item.kind === "percent" ? deltaPercent(currentValue, priorValue) : deltaPoints(currentValue, priorValue);
    }
  }
}

function addRolling(rows: DailyRow[], pairs: Array<{ value: string; rolling: string }>) {
  for (let index = 0; index < rows.length; index += 1) {
    const window = rows.slice(Math.max(0, index - 6), index + 1);
    for (const item of pairs) {
      const values = window.map(row => typeof row[item.value] === "number" ? row[item.value] as number : null);
      rows[index][item.rolling] = average(values);
    }
  }
}

function googleColumns(): Column[] {
  return [
    { header: "Data", key: "Data", width: 13 }, { header: "Status da fonte", key: "Status da fonte", width: 24 },
    { header: "Investimento (R$)", key: "Investimento (R$)" }, { header: "Conversões", key: "Conversões" },
    { header: "CPA (R$)", key: "CPA (R$)" }, { header: "Impressões", key: "Impressões" },
    { header: "Cliques", key: "Cliques" }, { header: "CTR (%)", key: "CTR (%)" },
    { header: "CPC (R$)", key: "CPC (R$)" }, { header: "Taxa de conversão (%)", key: "Taxa de conversão (%)" },
    { header: "CPM (R$)", key: "CPM (R$)" }, { header: "Campanhas reportadas", key: "Campanhas reportadas" },
    { header: "Campanhas ativas", key: "Campanhas ativas" }, { header: "Campanhas pausadas", key: "Campanhas pausadas" },
    { header: "Campanhas com conversão", key: "Campanhas com conversão" }, { header: "Orçamento diário total (R$)", key: "Orçamento diário total (R$)" },
    { header: "Orçamento diário médio (R$)", key: "Orçamento diário médio (R$)" }, { header: "Score de otimização médio", key: "Score de otimização médio" },
    { header: "Search IS médio", key: "Search IS médio" }, { header: "Search IS perdido por orçamento médio", key: "Search IS perdido por orçamento médio" },
    { header: "Estratégias de lance", key: "Estratégias de lance" }, { header: "Variação investimento D/D (%)", key: "Variação investimento D/D (%)" },
    { header: "Variação conversões D/D (%)", key: "Variação conversões D/D (%)" }, { header: "Variação CPA D/D (%)", key: "Variação CPA D/D (%)" },
    { header: "Variação impressões D/D (%)", key: "Variação impressões D/D (%)" }, { header: "Variação cliques D/D (%)", key: "Variação cliques D/D (%)" },
    { header: "Variação CTR D/D (p.p.)", key: "Variação CTR D/D (p.p.)" }, { header: "Variação CPC D/D (%)", key: "Variação CPC D/D (%)" },
    { header: "MM7 investimento (R$)", key: "MM7 investimento (R$)" }, { header: "MM7 conversões", key: "MM7 conversões" },
    { header: "MM7 CPA (R$)", key: "MM7 CPA (R$)" }, { header: "MM7 CTR (%)", key: "MM7 CTR (%)" },
    { header: "MM7 CPC (R$)", key: "MM7 CPC (R$)" }, { header: "MM7 taxa de conversão (%)", key: "MM7 taxa de conversão (%)" },
  ];
}

function metaColumns(): Column[] {
  return [
    { header: "Data", key: "Data", width: 13 }, { header: "Status da fonte", key: "Status da fonte", width: 24 },
    { header: "Investimento (R$)", key: "Investimento (R$)" }, { header: "Leads", key: "Leads" },
    { header: "CPL (R$)", key: "CPL (R$)" }, { header: "Impressões", key: "Impressões" },
    { header: "Alcance", key: "Alcance" }, { header: "Frequência", key: "Frequência" },
    { header: "Cliques", key: "Cliques" }, { header: "CTR (%)", key: "CTR (%)" },
    { header: "CPM (R$)", key: "CPM (R$)" }, { header: "CPC (R$)", key: "CPC (R$)" },
    { header: "Taxa de lead por clique (%)", key: "Taxa de lead por clique (%)" }, { header: "Leads por 1.000 impressões", key: "Leads por 1.000 impressões" },
    { header: "Custo por alcance (R$)", key: "Custo por alcance (R$)" }, { header: "Variação investimento D/D (%)", key: "Variação investimento D/D (%)" },
    { header: "Variação leads D/D (%)", key: "Variação leads D/D (%)" }, { header: "Variação CPL D/D (%)", key: "Variação CPL D/D (%)" },
    { header: "Variação impressões D/D (%)", key: "Variação impressões D/D (%)" }, { header: "Variação alcance D/D (%)", key: "Variação alcance D/D (%)" },
    { header: "Variação cliques D/D (%)", key: "Variação cliques D/D (%)" }, { header: "Variação CTR D/D (p.p.)", key: "Variação CTR D/D (p.p.)" },
    { header: "Variação CPM D/D (%)", key: "Variação CPM D/D (%)" }, { header: "Variação CPC D/D (%)", key: "Variação CPC D/D (%)" },
    { header: "MM7 investimento (R$)", key: "MM7 investimento (R$)" }, { header: "MM7 leads", key: "MM7 leads" },
    { header: "MM7 CPL (R$)", key: "MM7 CPL (R$)" }, { header: "MM7 impressões", key: "MM7 impressões" },
    { header: "MM7 alcance", key: "MM7 alcance" }, { header: "MM7 cliques", key: "MM7 cliques" },
    { header: "MM7 CTR (%)", key: "MM7 CTR (%)" }, { header: "MM7 CPM (R$)", key: "MM7 CPM (R$)" },
    { header: "MM7 CPC (R$)", key: "MM7 CPC (R$)" },
  ];
}

function tiktokColumns(): Column[] {
  return [
    { header: "Data", key: "Data", width: 13 }, { header: "Status da fonte", key: "Status da fonte", width: 24 },
    { header: "Investimento (R$)", key: "Investimento (R$)" }, { header: "Leads de formulário", key: "Leads de formulário" },
    { header: "Conversões", key: "Conversões" }, { header: "CPL (R$)", key: "CPL (R$)" },
    { header: "Impressões", key: "Impressões" }, { header: "Alcance", key: "Alcance" },
    { header: "Frequência", key: "Frequência" }, { header: "Cliques", key: "Cliques" },
    { header: "CTR (%)", key: "CTR (%)" }, { header: "CPM (R$)", key: "CPM (R$)" },
    { header: "CPC (R$)", key: "CPC (R$)" }, { header: "Engajamentos", key: "Engajamentos" },
    { header: "Taxa de engajamento (%)", key: "Taxa de engajamento (%)" }, { header: "Comentários", key: "Comentários" },
    { header: "Compartilhamentos", key: "Compartilhamentos" }, { header: "Reprodução média de vídeo", key: "Reprodução média de vídeo" },
    { header: "Taxa de conversão (conv./lead) (%)", key: "Taxa de conversão (conv./lead) (%)" }, { header: "Leads por 1.000 impressões", key: "Leads por 1.000 impressões" },
    { header: "Taxa de compartilhamento (%)", key: "Taxa de compartilhamento (%)" }, { header: "Taxa de comentário (%)", key: "Taxa de comentário (%)" },
    { header: "Variação investimento D/D (%)", key: "Variação investimento D/D (%)" }, { header: "Variação leads D/D (%)", key: "Variação leads D/D (%)" },
    { header: "Variação conversões D/D (%)", key: "Variação conversões D/D (%)" }, { header: "Variação CPL D/D (%)", key: "Variação CPL D/D (%)" },
    { header: "Variação impressões D/D (%)", key: "Variação impressões D/D (%)" }, { header: "Variação cliques D/D (%)", key: "Variação cliques D/D (%)" },
    { header: "Variação CTR D/D (p.p.)", key: "Variação CTR D/D (p.p.)" }, { header: "Variação engajamentos D/D (%)", key: "Variação engajamentos D/D (%)" },
    { header: "MM7 investimento (R$)", key: "MM7 investimento (R$)" }, { header: "MM7 leads de formulário", key: "MM7 leads de formulário" },
    { header: "MM7 CPL (R$)", key: "MM7 CPL (R$)" }, { header: "MM7 impressões", key: "MM7 impressões" },
    { header: "MM7 cliques", key: "MM7 cliques" }, { header: "MM7 CTR (%)", key: "MM7 CTR (%)" },
    { header: "MM7 engajamentos", key: "MM7 engajamentos" }, { header: "MM7 taxa de engajamento (%)", key: "MM7 taxa de engajamento (%)" },
  ];
}

async function googleRows(): Promise<DailyRow[]> {
  const period = PERIODS.google;
  const fields = [
    "account_id", "datasource", "campaign_id", "date", "spend", "conversions", "clicks", "impressions",
    "budget_amount", "campaign_status", "bidding_strategy_type", "optimization_score",
    "search_impression_share", "search_budget_lost_impression_share",
  ];
  const raw = await query({ ...CHANNELS.google, fields, ...period, label: "Google Ads" });
  const rows = raw.filter(row => text(row.account_id) === CHANNELS.google.accountId && text(row.datasource) === "google_ads");
  if (!rows.length) throw new Error("Google Ads: nenhuma linha válida retornada pelo Windsor.ai.");
  const result = buildDateRows(period, groupByDate(rows)).map(({ Data, "Status da fonte": status, records }) => {
    if (!records.length) return { Data, "Status da fonte": status } as DailyRow;
    const investment = round(sum(records, "spend"));
    const conversions = round(sum(records, "conversions"));
    const impressions = round(sum(records, "impressions"));
    const clicks = round(sum(records, "clicks"));
    const budgets = records.map(row => nullable(row.budget_amount));
    const scores = records.map(row => nullable(row.optimization_score));
    const searchIs = records.map(row => nullable(row.search_impression_share));
    const lostIs = records.map(row => nullable(row.search_budget_lost_impression_share));
    return {
      Data, "Status da fonte": status,
      "Investimento (R$)": investment, "Conversões": conversions, "CPA (R$)": ratio(investment, conversions),
      "Impressões": impressions, "Cliques": clicks, "CTR (%)": ratio(clicks, impressions, 100), "CPC (R$)": ratio(investment, clicks),
      "Taxa de conversão (%)": ratio(conversions, clicks, 100), "CPM (R$)": ratio(investment, impressions, 1000),
      "Campanhas reportadas": countDistinct(records, "campaign_id"),
      "Campanhas ativas": new Set(records.filter(row => text(row.campaign_status).toUpperCase() === "ENABLED").map(row => text(row.campaign_id))).size,
      "Campanhas pausadas": new Set(records.filter(row => text(row.campaign_status).toUpperCase() === "PAUSED").map(row => text(row.campaign_id))).size,
      "Campanhas com conversão": new Set(records.filter(row => number(row.conversions) > 0).map(row => text(row.campaign_id))).size,
      "Orçamento diário total (R$)": round(budgets.reduce((total, value) => total + (value ?? 0), 0)),
      "Orçamento diário médio (R$)": average(budgets), "Score de otimização médio": average(scores),
      "Search IS médio": average(searchIs), "Search IS perdido por orçamento médio": average(lostIs),
      "Estratégias de lance": new Set(records.map(row => text(row.bidding_strategy_type)).filter(Boolean)).size,
    } as DailyRow;
  });
  addDerivedChanges(result, [
    { value: "Investimento (R$)", change: "Variação investimento D/D (%)", kind: "percent" }, { value: "Conversões", change: "Variação conversões D/D (%)", kind: "percent" },
    { value: "CPA (R$)", change: "Variação CPA D/D (%)", kind: "percent" }, { value: "Impressões", change: "Variação impressões D/D (%)", kind: "percent" },
    { value: "Cliques", change: "Variação cliques D/D (%)", kind: "percent" }, { value: "CTR (%)", change: "Variação CTR D/D (p.p.)", kind: "points" },
    { value: "CPC (R$)", change: "Variação CPC D/D (%)", kind: "percent" },
  ]);
  addRolling(result, [
    { value: "Investimento (R$)", rolling: "MM7 investimento (R$)" }, { value: "Conversões", rolling: "MM7 conversões" },
    { value: "CPA (R$)", rolling: "MM7 CPA (R$)" }, { value: "CTR (%)", rolling: "MM7 CTR (%)" },
    { value: "CPC (R$)", rolling: "MM7 CPC (R$)" }, { value: "Taxa de conversão (%)", rolling: "MM7 taxa de conversão (%)" },
  ]);
  return result;
}

async function metaRows(): Promise<DailyRow[]> {
  const period = PERIODS.meta;
  const fields = ["account_id", "date", "spend", "actions_lead", "impressions", "reach", "frequency", "clicks", "cpm", "cpc", "ctr"];
  const raw = await query({ ...CHANNELS.meta, fields, ...period, label: "Meta Ads" });
  const rows = raw.filter(row => text(row.account_id) === CHANNELS.meta.accountId);
  if (!rows.length) throw new Error("Meta Ads: nenhuma linha válida retornada pelo Windsor.ai.");
  const result = buildDateRows(period, groupByDate(rows)).map(({ Data, "Status da fonte": status, records }) => {
    if (!records.length) return { Data, "Status da fonte": status } as DailyRow;
    const investment = round(sum(records, "spend"));
    const leads = round(sum(records, "actions_lead"));
    const impressions = round(sum(records, "impressions"));
    const reach = round(sum(records, "reach"));
    const clicks = round(sum(records, "clicks"));
    return {
      Data, "Status da fonte": status,
      "Investimento (R$)": investment, Leads: leads, "CPL (R$)": ratio(investment, leads), "Impressões": impressions,
      "Alcance": reach, "Frequência": ratio(impressions, reach), "Cliques": clicks, "CTR (%)": ratio(clicks, impressions, 100),
      "CPM (R$)": ratio(investment, impressions, 1000), "CPC (R$)": ratio(investment, clicks),
      "Taxa de lead por clique (%)": ratio(leads, clicks, 100), "Leads por 1.000 impressões": ratio(leads, impressions, 1000),
      "Custo por alcance (R$)": ratio(investment, reach),
    } as DailyRow;
  });
  addDerivedChanges(result, [
    { value: "Investimento (R$)", change: "Variação investimento D/D (%)", kind: "percent" }, { value: "Leads", change: "Variação leads D/D (%)", kind: "percent" },
    { value: "CPL (R$)", change: "Variação CPL D/D (%)", kind: "percent" }, { value: "Impressões", change: "Variação impressões D/D (%)", kind: "percent" },
    { value: "Alcance", change: "Variação alcance D/D (%)", kind: "percent" }, { value: "Cliques", change: "Variação cliques D/D (%)", kind: "percent" },
    { value: "CTR (%)", change: "Variação CTR D/D (p.p.)", kind: "points" }, { value: "CPM (R$)", change: "Variação CPM D/D (%)", kind: "percent" },
    { value: "CPC (R$)", change: "Variação CPC D/D (%)", kind: "percent" },
  ]);
  addRolling(result, [
    { value: "Investimento (R$)", rolling: "MM7 investimento (R$)" }, { value: "Leads", rolling: "MM7 leads" },
    { value: "CPL (R$)", rolling: "MM7 CPL (R$)" }, { value: "Impressões", rolling: "MM7 impressões" },
    { value: "Alcance", rolling: "MM7 alcance" }, { value: "Cliques", rolling: "MM7 cliques" },
    { value: "CTR (%)", rolling: "MM7 CTR (%)" }, { value: "CPM (R$)", rolling: "MM7 CPM (R$)" }, { value: "CPC (R$)", rolling: "MM7 CPC (R$)" },
  ]);
  return result;
}

async function tiktokRows(): Promise<DailyRow[]> {
  const period = PERIODS.tiktok;
  const fields = ["account_id", "date", "spend", "onsite_form", "conversions", "impressions", "reach", "clicks", "engagements", "comments", "shares", "average_video_play"];
  const raw = await query({ ...CHANNELS.tiktok, fields, ...period, label: "TikTok Ads" });
  const rows = raw.filter(row => text(row.account_id) === CHANNELS.tiktok.accountId);
  if (!rows.length) throw new Error("TikTok Ads: nenhuma linha válida retornada pelo Windsor.ai.");
  const result = buildDateRows(period, groupByDate(rows)).map(({ Data, "Status da fonte": status, records }) => {
    if (!records.length) return { Data, "Status da fonte": status } as DailyRow;
    const investment = round(sum(records, "spend"));
    const leads = round(sum(records, "onsite_form"));
    const conversions = round(sum(records, "conversions"));
    const impressions = round(sum(records, "impressions"));
    const reach = round(sum(records, "reach"));
    const clicks = round(sum(records, "clicks"));
    const engagements = round(sum(records, "engagements"));
    const comments = round(sum(records, "comments"));
    const shares = round(sum(records, "shares"));
    const weightedVideoPlay = records.reduce((total, row) => total + number(row.average_video_play) * number(row.impressions), 0);
    return {
      Data, "Status da fonte": status,
      "Investimento (R$)": investment, "Leads de formulário": leads, "Conversões": conversions, "CPL (R$)": ratio(investment, leads),
      "Impressões": impressions, "Alcance": reach, "Frequência": ratio(impressions, reach), "Cliques": clicks,
      "CTR (%)": ratio(clicks, impressions, 100), "CPM (R$)": ratio(investment, impressions, 1000), "CPC (R$)": ratio(investment, clicks),
      Engajamentos: engagements, "Taxa de engajamento (%)": ratio(engagements, impressions, 100), "Comentários": comments,
      "Compartilhamentos": shares, "Reprodução média de vídeo": ratio(weightedVideoPlay, impressions),
      "Taxa de conversão (conv./lead) (%)": ratio(conversions, leads, 100), "Leads por 1.000 impressões": ratio(leads, impressions, 1000),
      "Taxa de compartilhamento (%)": ratio(shares, impressions, 100), "Taxa de comentário (%)": ratio(comments, impressions, 100),
    } as DailyRow;
  });
  addDerivedChanges(result, [
    { value: "Investimento (R$)", change: "Variação investimento D/D (%)", kind: "percent" }, { value: "Leads de formulário", change: "Variação leads D/D (%)", kind: "percent" },
    { value: "Conversões", change: "Variação conversões D/D (%)", kind: "percent" }, { value: "CPL (R$)", change: "Variação CPL D/D (%)", kind: "percent" },
    { value: "Impressões", change: "Variação impressões D/D (%)", kind: "percent" }, { value: "Cliques", change: "Variação cliques D/D (%)", kind: "percent" },
    { value: "CTR (%)", change: "Variação CTR D/D (p.p.)", kind: "points" }, { value: "Engajamentos", change: "Variação engajamentos D/D (%)", kind: "percent" },
  ]);
  addRolling(result, [
    { value: "Investimento (R$)", rolling: "MM7 investimento (R$)" }, { value: "Leads de formulário", rolling: "MM7 leads de formulário" },
    { value: "CPL (R$)", rolling: "MM7 CPL (R$)" }, { value: "Impressões", rolling: "MM7 impressões" },
    { value: "Cliques", rolling: "MM7 cliques" }, { value: "CTR (%)", rolling: "MM7 CTR (%)" },
    { value: "Engajamentos", rolling: "MM7 engajamentos" }, { value: "Taxa de engajamento (%)", rolling: "MM7 taxa de engajamento (%)" },
  ]);
  return result;
}

function writeFile(name: string, columns: Column[], rows: DailyRow[], outputPath: string) {
  if (columns.length < 30) throw new Error(`${name}: menos de 30 métricas em colunas.`);
  if (rows.length !== 15) throw new Error(`${name}: período diário incompleto (${rows.length} linhas).`);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Manus AI";
  workbook.properties.title = `${name} — daily raw metrics`;
  const sheet = workbook.addWorksheet(name);
  sheet.columns = columns.map(column => ({ header: column.header, key: column.key, width: column.width ?? 18 }));
  for (const row of rows) sheet.addRow(row);
  sheet.views = [{ state: "frozen", ySplit: 1, xSplit: 1 }];
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: rows.length + 1, column: columns.length } };
  for (let columnIndex = 3; columnIndex <= columns.length; columnIndex += 1) {
    sheet.getColumn(columnIndex).numFmt = '#,##0.00';
  }
  return workbook.xlsx.writeFile(outputPath);
}

async function validate(outputPath: string, expectedSheet: string, expectedColumns: number) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputPath);
  if (workbook.worksheets.length !== 1 || workbook.worksheets[0]?.name !== expectedSheet) {
    throw new Error(`${expectedSheet}: estrutura de abas inválida.`);
  }
  const sheet = workbook.worksheets[0];
  if (sheet.rowCount !== 16 || sheet.columnCount !== expectedColumns) {
    throw new Error(`${expectedSheet}: esperado 15 linhas diárias e ${expectedColumns} colunas; encontrado ${sheet.rowCount - 1} linhas e ${sheet.columnCount} colunas.`);
  }
  const forbidden = ["mg motor", "mg motors", "ag. bbro", "535-798-6801", "1418731006678061", "7668787778449719316"];
  sheet.eachRow(row => row.eachCell(cell => {
    const value = String(cell.value ?? "").toLocaleLowerCase("pt-BR");
    if (forbidden.some(token => value.includes(token))) throw new Error(`${expectedSheet}: identificador sensível no arquivo.`);
  }));
}

async function main() {
  const [google, meta, tiktok] = await Promise.all([googleRows(), metaRows(), tiktokRows()]);
  await Promise.all([
    writeFile("Google Ads", googleColumns(), google, OUTPUTS.google),
    writeFile("Meta Ads", metaColumns(), meta, OUTPUTS.meta),
    writeFile("TikTok Ads", tiktokColumns(), tiktok, OUTPUTS.tiktok),
  ]);
  await Promise.all([
    validate(OUTPUTS.google, "Google Ads", googleColumns().length),
    validate(OUTPUTS.meta, "Meta Ads", metaColumns().length),
    validate(OUTPUTS.tiktok, "TikTok Ads", tiktokColumns().length),
  ]);
  process.stdout.write(JSON.stringify({
    source: "windsor-live",
    files: OUTPUTS,
    dailyRows: { google: google.length, meta: meta.length, tiktok: tiktok.length },
    columns: { google: googleColumns().length, meta: metaColumns().length, tiktok: tiktokColumns().length },
    periods: PERIODS,
    anonymized: true,
  }, null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
