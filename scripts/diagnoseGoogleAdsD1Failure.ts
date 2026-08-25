import { loadDashboardData } from "../server/dashboardService";

const dateFrom = process.argv[2] ?? "2026-08-01";
const dateTo = process.argv[3] ?? "2026-08-24";

async function main() {
  const dashboard = await loadDashboardData(dateFrom, dateTo, { forceRefresh: true });
  const result = {
    period: { dateFrom, dateTo },
    source: dashboard.metadata.source,
    updatedAt: dashboard.metadata.updatedAt,
    cacheHit: dashboard.metadata.cacheHit,
    rowCount: dashboard.metadata.rowCount,
    historyRowCount: dashboard.metadata.historyRowCount,
    campaignCount: dashboard.metadata.campaignCount,
    activeCampaignCount: dashboard.metadata.activeCampaignCount,
    dailyCount: dashboard.daily.length,
    firstDate: dashboard.daily[0]?.date ?? null,
    lastDate: dashboard.daily.at(-1)?.date ?? null,
    lastClosedDate: dashboard.metadata.lastClosedDate,
    summary: dashboard.summary,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
