import { getDashboardCutoffDate } from "../shared/dashboardDates";
import { pathToFileURL } from "node:url";

import { clearDashboardCache, loadDashboardData } from "../server/dashboardService";
import { clearMetaAdsCache, getMetaAdsBounds, loadMetaAdsData } from "../server/metaAdsService";

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function missingDates(dateFrom: string, dateTo: string, available: Set<string>) {
  const missing: string[] = [];
  for (let date = new Date(`${dateFrom}T12:00:00Z`); date.toISOString().slice(0, 10) <= dateTo; date.setUTCDate(date.getUTCDate() + 1)) {
    const iso = date.toISOString().slice(0, 10);
    if (!available.has(iso)) missing.push(iso);
  }
  return missing;
}

export function classifyDateCoverage(dateFrom: string, dateTo: string, dates: string[]) {
  const available = new Set(dates);
  const missing = missingDates(dateFrom, dateTo, available);
  const ordered = Array.from(available).sort();
  const firstDate = ordered[0] ?? null;
  const lastDate = ordered.at(-1) ?? null;
  return {
    firstDate,
    lastDate,
    missingDates: missing,
    leadingMissingDates: firstDate ? missing.filter(date => date < firstDate) : missing,
    internalMissingDates: firstDate && lastDate
      ? missing.filter(date => date > firstDate && date < lastDate)
      : [],
    trailingMissingDates: lastDate ? missing.filter(date => date > lastDate) : [],
  };
}

export function reconcileMetric(summary: number, detail: number, tolerance: number, digits = 2) {
  const delta = detail - summary;
  return {
    summary: round(summary, digits),
    detail: round(detail, digits),
    delta: round(delta, digits),
    tolerance,
    reconciled: Math.abs(delta) <= tolerance + Number.EPSILON,
  };
}

export async function auditWindsorAdsConnections() {
  const dateTo = getDashboardCutoffDate();
  const dateFrom = `${dateTo.slice(0, 7)}-01`;
  clearDashboardCache();
  clearMetaAdsCache();

  const googleStarted = Date.now();
  const google = await loadDashboardData(dateFrom, dateTo, { forceRefresh: true });
  const googleDurationMs = Date.now() - googleStarted;

  const metaStarted = Date.now();
  const [meta, metaBounds] = await Promise.all([
    loadMetaAdsData(dateFrom, dateTo, { forceRefresh: true }),
    getMetaAdsBounds(),
  ]);
  const metaDurationMs = Date.now() - metaStarted;

  const googleDates = new Set(google.daily.map(row => row.date));
  const metaDates = new Set(meta.daily.map(row => row.date));
  const googleCoverage = classifyDateCoverage(dateFrom, dateTo, Array.from(googleDates));
  const metaCoverage = classifyDateCoverage(dateFrom, dateTo, Array.from(metaDates));
  const googleDailyTotals = google.daily.reduce((sum, row) => ({
    spend: sum.spend + row.spend,
    conversions: sum.conversions + row.conversions,
    clicks: sum.clicks + row.clicks,
    impressions: sum.impressions + row.impressions,
  }), { spend: 0, conversions: 0, clicks: 0, impressions: 0 });
  const metaDailyTotals = meta.daily.reduce((sum, row) => ({
    spend: sum.spend + row.spend,
    leads: sum.leads + row.leads,
    clicks: sum.clicks + row.clicks,
    impressions: sum.impressions + row.impressions,
  }), { spend: 0, leads: 0, clicks: 0, impressions: 0 });
  const metaCampaignTotals = meta.campaigns.reduce((sum, row) => ({
    spend: sum.spend + row.spend,
    leads: sum.leads + row.leads,
    clicks: sum.clicks + row.clicks,
    impressions: sum.impressions + row.impressions,
  }), { spend: 0, leads: 0, clicks: 0, impressions: 0 });

  const output = {
    auditedAt: new Date().toISOString(),
    period: { dateFrom, dateTo },
    google: {
      durationMs: googleDurationMs,
      source: google.metadata.source,
      updatedAt: google.metadata.updatedAt,
      cacheHit: google.metadata.cacheHit,
      account: google.account,
      dataThroughDate: google.metadata.lastClosedDate,
      rowCount: google.metadata.rowCount,
      campaignCount: google.metadata.campaignCount,
      dailyCount: google.daily.length,
      dateCoverage: googleCoverage,
      summary: google.summary,
      dailyTotals: Object.fromEntries(Object.entries(googleDailyTotals).map(([key, value]) => [key, round(value)])),
      reconciled: {
        spend: reconcileMetric(google.summary.investment, googleDailyTotals.spend, google.daily.length * 0.01 + 0.01),
        conversions: reconcileMetric(google.summary.conversions, googleDailyTotals.conversions, google.daily.length * 0.05 + 0.05, 1),
        clicks: reconcileMetric(google.summary.clicks, googleDailyTotals.clicks, 0),
        impressions: reconcileMetric(google.summary.impressions, googleDailyTotals.impressions, 0),
      },
    },
    meta: {
      durationMs: metaDurationMs,
      source: meta.metadata.source,
      updatedAt: meta.metadata.updatedAt,
      cacheHit: meta.metadata.cacheHit,
      account: meta.account,
      bounds: metaBounds,
      dataThroughDate: meta.metadata.dataThroughDate,
      rowCounts: meta.metadata.rowCounts,
      dailyCount: meta.daily.length,
      dateCoverage: metaCoverage,
      summary: meta.summary,
      dailyTotals: Object.fromEntries(Object.entries(metaDailyTotals).map(([key, value]) => [key, round(value)])),
      campaignTotals: Object.fromEntries(Object.entries(metaCampaignTotals).map(([key, value]) => [key, round(value)])),
      reconciled: {
        dailySpend: reconcileMetric(meta.summary.spend, metaDailyTotals.spend, meta.daily.length * 0.01 + 0.01),
        dailyLeads: reconcileMetric(meta.summary.leads, metaDailyTotals.leads, 0),
        dailyClicks: reconcileMetric(meta.summary.clicks, metaDailyTotals.clicks, 0),
        dailyImpressions: reconcileMetric(meta.summary.impressions, metaDailyTotals.impressions, 0),
        campaignSpend: reconcileMetric(meta.summary.spend, metaCampaignTotals.spend, 0.5),
        campaignLeads: reconcileMetric(meta.summary.leads, metaCampaignTotals.leads, 0),
        campaignClicks: reconcileMetric(meta.summary.clicks, metaCampaignTotals.clicks, 1),
        campaignImpressions: reconcileMetric(meta.summary.impressions, metaCampaignTotals.impressions, 10),
      },
    },
  };

  if (output.google.source !== "windsor-live") throw new Error(`Google não veio ao vivo: ${output.google.source}`);
  if (output.meta.source !== "windsor-live") throw new Error(`Meta não veio ao vivo: ${output.meta.source}`);
  if (output.google.dataThroughDate !== dateTo) throw new Error(`Google não alcançou D-1: ${output.google.dataThroughDate}`);
  if (output.meta.dataThroughDate !== dateTo) throw new Error(`Meta não alcançou D-1: ${output.meta.dataThroughDate}`);
  if (output.google.dateCoverage.internalMissingDates.length || output.google.dateCoverage.trailingMissingDates.length) {
    throw new Error("Google possui lacunas internas ou finais no período");
  }
  if (output.meta.dateCoverage.internalMissingDates.length || output.meta.dateCoverage.trailingMissingDates.length) {
    throw new Error("Meta possui lacunas internas ou finais no período");
  }
  if (Object.values(output.google.reconciled).some(metric => !metric.reconciled)) throw new Error("Google não reconciliou seus KPIs");
  if (Object.values(output.meta.reconciled).some(metric => !metric.reconciled)) throw new Error("Meta não reconciliou seus KPIs");
  return output;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  auditWindsorAdsConnections()
    .then(output => {
      process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
      process.exit(0);
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
