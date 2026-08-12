import { getDashboardCutoffDate } from "../shared/dashboardDates";
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

async function main() {
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
      missingDates: missingDates(dateFrom, dateTo, googleDates),
      summary: google.summary,
      dailyTotals: Object.fromEntries(Object.entries(googleDailyTotals).map(([key, value]) => [key, round(value)])),
      reconciled: {
        spend: round(googleDailyTotals.spend) === google.summary.investment,
        conversions: round(googleDailyTotals.conversions, 1) === google.summary.conversions,
        clicks: round(googleDailyTotals.clicks) === google.summary.clicks,
        impressions: round(googleDailyTotals.impressions) === google.summary.impressions,
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
      missingDates: missingDates(dateFrom, dateTo, metaDates),
      summary: meta.summary,
      dailyTotals: Object.fromEntries(Object.entries(metaDailyTotals).map(([key, value]) => [key, round(value)])),
      campaignTotals: Object.fromEntries(Object.entries(metaCampaignTotals).map(([key, value]) => [key, round(value)])),
      reconciled: {
        dailySpend: round(metaDailyTotals.spend) === meta.summary.spend,
        dailyLeads: round(metaDailyTotals.leads) === meta.summary.leads,
        dailyClicks: round(metaDailyTotals.clicks) === meta.summary.clicks,
        dailyImpressions: round(metaDailyTotals.impressions) === meta.summary.impressions,
        campaignSpend: round(metaCampaignTotals.spend) === meta.summary.spend,
        campaignLeads: round(metaCampaignTotals.leads) === meta.summary.leads,
      },
    },
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (output.google.source !== "windsor-live") throw new Error(`Google não veio ao vivo: ${output.google.source}`);
  if (output.meta.source !== "windsor-live") throw new Error(`Meta não veio ao vivo: ${output.meta.source}`);
  if (output.google.dataThroughDate !== dateTo) throw new Error(`Google não alcançou D-1: ${output.google.dataThroughDate}`);
  if (output.meta.dataThroughDate !== dateTo) throw new Error(`Meta não alcançou D-1: ${output.meta.dataThroughDate}`);
  if (Object.values(output.google.reconciled).includes(false)) throw new Error("Google não reconciliou seus KPIs");
  if (Object.values(output.meta.reconciled).includes(false)) throw new Error("Meta não reconciliou seus KPIs");
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
