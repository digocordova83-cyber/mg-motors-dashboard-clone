import { loadDashboardData } from "../server/dashboardService";

const dateFrom = process.argv[2] ?? "2026-08-01";
const dateTo = process.argv[3] ?? "2026-08-23";

async function main() {
  const dashboard = await loadDashboardData(dateFrom, dateTo, { forceRefresh: true });
  const dates = dashboard.daily.map(row => row.date).sort();
  const result = {
    period: { dateFrom, dateTo },
    source: dashboard.metadata.source,
    updatedAt: dashboard.metadata.updatedAt,
    cacheHit: dashboard.metadata.cacheHit,
    rowCount: dashboard.metadata.rowCount,
    historyRowCount: dashboard.metadata.historyRowCount,
    campaignCount: dashboard.metadata.campaignCount,
    activeCampaignCount: dashboard.metadata.activeCampaignCount,
    firstDate: dates[0] ?? null,
    lastDate: dates.at(-1) ?? null,
    lastClosedDate: dashboard.metadata.lastClosedDate,
    summary: dashboard.summary,
    dailyCount: dashboard.daily.length,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.source !== "windsor-live" || result.lastClosedDate !== dateTo || result.lastDate !== dateTo) {
    process.exitCode = 2;
  }
}

main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
