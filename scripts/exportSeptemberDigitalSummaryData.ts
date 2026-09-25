import { and, gte, lte, sql } from "drizzle-orm";
import { leads as leadsTable } from "../drizzle/schema";
import { getMediaPlan } from "../client/src/data/mediaPlans";
import { loadDashboardData } from "../server/dashboardService";
import { getDb } from "../server/db";
import { getLeadAnalytics } from "../server/leadsService";
import { loadMetaAdsData } from "../server/metaAdsService";
import { loadTikTokAdsData } from "../server/tiktokAdsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";
import { writeFile } from "node:fs/promises";

const dateFrom = "2026-09-01";
const dateTo = "2026-09-23";
const output = "/home/ubuntu/mg-september-digital-summary-data.json";

const db = await getDb();
if (!db) throw new Error("Banco de dados indisponível");

const [google, meta, tiktok, leadAnalytics, retail, matrixRows] = await Promise.all([
  loadDashboardData(dateFrom, dateTo),
  loadMetaAdsData(dateFrom, dateTo),
  loadTikTokAdsData(dateFrom, dateTo),
  getLeadAnalytics({ dateFrom, dateTo }),
  getWeeklySalesMetrics("2026-09", { dateFrom, dateTo }),
  db
    .select({
      channel: leadsTable.sourceChannel,
      model: leadsTable.model,
      count: sql<number>`count(*)`,
    })
    .from(leadsTable)
    .where(and(gte(leadsTable.correctedDate, dateFrom), lte(leadsTable.correctedDate, dateTo)))
    .groupBy(leadsTable.sourceChannel, leadsTable.model),
]);

const mediaPlan = getMediaPlan("2026-09");
if (!mediaPlan) throw new Error("Plano de mídia de setembro indisponível");

const matrix: Record<string, Record<string, number>> = {};
for (const row of matrixRows) {
  const channel = (row.channel ?? "Indisponível").trim() || "Indisponível";
  const model = (row.model ?? "Indisponível").trim() || "Indisponível";
  matrix[channel] ??= {};
  matrix[channel][model] = Number(row.count ?? 0);
}

const selectedPlanRows = mediaPlan.rows.map(row => ({
  channel: row.channel,
  publisher: row.publisher,
  gross: row.investment,
  net: row.netInvestment ?? null,
  projectedLeads: row.leads,
  projectedCpl: row.cpl,
}));

const topGoogle = google.campaigns
  .slice()
  .sort((a, b) => b.spend - a.spend)
  .slice(0, 5)
  .map(item => ({
    campaign: item.campaign,
    spend: item.spend,
    conversions: item.conversions,
    cpa: item.cpa,
    clicks: item.clicks,
  }));

const topMeta = meta.campaigns
  .slice()
  .sort((a, b) => b.leads - a.leads)
  .slice(0, 5)
  .map(item => ({
    campaign: item.name,
    spend: item.spend,
    leads: item.leads,
    cpl: item.cpl,
    clicks: item.clicks,
    impressions: item.impressions,
  }));

const topDealers = retail.dealers
  .filter(item => item.matchStatus === "MATCHED" && item.sales !== null)
  .slice()
  .sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0) || b.leads - a.leads)
  .slice(0, 5)
  .map(item => ({
    dealer: item.dealerName,
    leads: item.leads,
    sales: item.sales,
    conversionRatePercent: item.conversionRatePercent,
  }));

const topStates = retail.states
  .slice()
  .sort((a, b) => b.sales - a.sales || b.leads - a.leads)
  .slice(0, 5)
  .map(item => ({
    state: item.stateCode,
    leads: item.leads,
    sales: item.sales,
    conversionRatePercent: item.conversionRatePercent,
  }));

const result = {
  period: { dateFrom, dateTo, retailThrough: "2026-09-21" },
  mediaPlan: {
    gross: mediaPlan.total.investment,
    commission: mediaPlan.total.commission,
    net: mediaPlan.total.netInvestment,
    projectedLeads: mediaPlan.total.leads,
    projectedCpl: mediaPlan.total.cpl,
    rows: selectedPlanRows,
  },
  google: {
    summary: google.summary,
    products: google.productPerformance,
    topCampaigns: topGoogle,
    dataThroughDate: google.metadata.lastClosedDate,
  },
  meta: {
    summary: meta.summary,
    models: meta.models,
    topCampaigns: topMeta,
    highlights: meta.highlights,
    dataThroughDate: meta.metadata.dataThroughDate,
  },
  tiktok: {
    summary: tiktok.summary,
    dataThroughDate: tiktok.metadata.dataThroughDate,
  },
  leads: {
    summary: leadAnalytics.summary,
    pacing: leadAnalytics.pacing,
    channels: leadAnalytics.channels,
    models: leadAnalytics.models,
    daily: leadAnalytics.daily,
    matrix,
  },
  retail: {
    referenceWeek: retail.referenceWeek,
    summary: retail.summary,
    topDealers,
    topStates,
    fileName: retail.import?.fileName ?? null,
  },
};

await writeFile(output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ output, leads: result.leads.summary.totalLeads, webmotors: result.leads.channels.find(item => item.value === "Webmotors")?.leads ?? 0, retail: result.retail.summary, mediaPlan: result.mediaPlan }, null, 2)}\n`);
process.exit(0);
