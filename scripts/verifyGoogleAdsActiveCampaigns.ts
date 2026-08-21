import { pathToFileURL } from "node:url";

import { loadDashboardData } from "../server/dashboardService";

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultPeriod() {
  const lastClosed = new Date();
  lastClosed.setUTCDate(lastClosed.getUTCDate() - 1);
  const dateTo = toIsoDate(lastClosed);
  return { dateFrom: `${dateTo.slice(0, 7)}-01`, dateTo };
}

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export async function verifyGoogleAdsActiveCampaigns(
  period = defaultPeriod(),
) {
  const dashboard = await loadDashboardData(period.dateFrom, period.dateTo, {
    forceRefresh: true,
  });
  const inactiveCampaigns = dashboard.campaigns.filter(
    campaign => campaign.googleStatus !== "ENABLED",
  );
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
    period,
    source: dashboard.metadata.source,
    updatedAt: dashboard.metadata.updatedAt,
    dataThroughDate: dashboard.metadata.lastClosedDate,
    rowCount: dashboard.metadata.rowCount,
    campaignCount: dashboard.metadata.campaignCount,
    inactiveCampaignCount: inactiveCampaigns.length,
    campaignStatuses: Array.from(
      new Set(dashboard.campaigns.map(campaign => campaign.googleStatus)),
    ),
    campaigns: dashboard.campaigns.map(campaign => ({
      id: campaign.campaignId,
      name: campaign.campaign,
      status: campaign.googleStatus,
      spend: campaign.spend,
    })),
    summary: dashboard.summary,
    reconciled: {
      investment:
        Math.abs(dashboard.summary.investment - round(dailyTotals.investment)) <=
        0.31,
      conversions:
        Math.abs(
          dashboard.summary.conversions - round(dailyTotals.conversions, 1),
        ) <= 1.55,
      clicks: dashboard.summary.clicks === round(dailyTotals.clicks),
      impressions:
        dashboard.summary.impressions === round(dailyTotals.impressions),
    },
  };

  if (output.inactiveCampaignCount > 0) {
    throw new Error(
      `A aba ainda contém campanhas inativas: ${inactiveCampaigns
        .map(campaign => `${campaign.campaignId}:${campaign.googleStatus}`)
        .join(", ")}`,
    );
  }
  if (output.campaignCount === 0) {
    throw new Error("A fonte não retornou campanhas ativas para o período");
  }
  if (Object.values(output.reconciled).some(value => !value)) {
    throw new Error("Os KPIs ativos não reconciliaram com a série diária");
  }

  return output;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyGoogleAdsActiveCampaigns()
    .then(output => {
      process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
      process.exit(0);
    })
    .catch(error => {
      console.error(error instanceof Error ? error.stack ?? error.message : error);
      process.exit(1);
    });
}
