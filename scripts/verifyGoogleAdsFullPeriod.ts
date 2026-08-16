import { pathToFileURL } from "node:url";

import { loadDashboardData } from "../server/dashboardService";

const DATE_FROM = "2026-07-17";
const DATE_TO = "2026-08-15";

function expectedDates(dateFrom: string, dateTo: string) {
  const dates: string[] = [];
  const cursor = new Date(`${dateFrom}T12:00:00Z`);
  while (cursor.toISOString().slice(0, 10) <= dateTo) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export async function verifyGoogleAdsFullPeriod() {
  const dashboard = await loadDashboardData(DATE_FROM, DATE_TO);
  const dates = dashboard.daily.map(row => row.date).sort();
  const expected = expectedDates(DATE_FROM, DATE_TO);
  const available = new Set(dates);
  const missingDates = expected.filter(date => !available.has(date));
  const dailyTotals = dashboard.daily.reduce(
    (totals, row) => ({
      investment: totals.investment + row.spend,
      conversions: totals.conversions + row.conversions,
      clicks: totals.clicks + row.clicks,
      impressions: totals.impressions + row.impressions,
    }),
    { investment: 0, conversions: 0, clicks: 0, impressions: 0 },
  );

  const output = {
    verifiedAt: new Date().toISOString(),
    period: { dateFrom: DATE_FROM, dateTo: DATE_TO },
    source: dashboard.metadata.source,
    updatedAt: dashboard.metadata.updatedAt,
    rowCount: dashboard.metadata.rowCount,
    campaignCount: dashboard.metadata.campaignCount,
    dataThroughDate: dashboard.metadata.lastClosedDate,
    dailyCount: dashboard.daily.length,
    firstDate: dates[0] ?? null,
    lastDate: dates.at(-1) ?? null,
    missingDates,
    summary: dashboard.summary,
    dailyTotals: {
      investment: round(dailyTotals.investment),
      conversions: round(dailyTotals.conversions, 1),
      clicks: dailyTotals.clicks,
      impressions: dailyTotals.impressions,
    },
    reconciled: {
      investment: Math.abs(dashboard.summary.investment - dailyTotals.investment) <= 0.31,
      conversions: Math.abs(dashboard.summary.conversions - dailyTotals.conversions) <= 1.55,
      clicks: dashboard.summary.clicks === dailyTotals.clicks,
      impressions: dashboard.summary.impressions === dailyTotals.impressions,
    },
  };

  if (output.rowCount !== 2058) throw new Error(`Quantidade de linhas inesperada: ${output.rowCount}`);
  if (output.campaignCount !== 70) {
    throw new Error(`Quantidade de campanhas inesperada: ${output.campaignCount}`);
  }
  if (output.dailyCount !== 30 || output.missingDates.length > 0) {
    throw new Error(`Cobertura diária incompleta: ${JSON.stringify(output.missingDates)}`);
  }
  if (output.dataThroughDate !== DATE_TO || output.lastDate !== DATE_TO) {
    throw new Error(`Google Ads não alcançou ${DATE_TO}: ${output.dataThroughDate}`);
  }
  if (Object.values(output.reconciled).some(value => !value)) {
    throw new Error("Os KPIs do resumo não reconciliaram com a série diária");
  }

  return output;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyGoogleAdsFullPeriod()
    .then(output => {
      process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
      process.exit(0);
    })
    .catch(error => {
      console.error(error instanceof Error ? error.stack ?? error.message : error);
      process.exit(1);
    });
}
