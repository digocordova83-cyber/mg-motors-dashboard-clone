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
  const inactiveCurrentCampaigns = dashboard.activeCampaigns.filter(
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
  const historicalCampaignIds = new Set(
    dashboard.campaigns.map(campaign => campaign.campaignId),
  );
  const rankedCampaignIds = new Set([
    ...dashboard.rankings.best.map(campaign => campaign.campaignId),
    ...dashboard.rankings.worst.map(campaign => campaign.campaignId),
  ]);
  const historicalInactiveCampaignIds = new Set(
    dashboard.campaigns
      .filter(campaign => campaign.googleStatus !== "ENABLED")
      .map(campaign => campaign.campaignId),
  );

  const output = {
    verifiedAt: new Date().toISOString(),
    period,
    source: dashboard.metadata.source,
    updatedAt: dashboard.metadata.updatedAt,
    dataThroughDate: dashboard.metadata.lastClosedDate,
    historical: {
      rowCount: dashboard.metadata.rowCount,
      campaignCount: dashboard.metadata.campaignCount,
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
    },
    current: {
      rowCount: dashboard.metadata.activeRowCount,
      campaignCount: dashboard.metadata.activeCampaignCount,
      inactiveCampaignCount: inactiveCurrentCampaigns.length,
      campaignStatuses: Array.from(
        new Set(dashboard.activeCampaigns.map(campaign => campaign.googleStatus)),
      ),
      campaigns: dashboard.activeCampaigns.map(campaign => ({
        id: campaign.campaignId,
        name: campaign.campaign,
        status: campaign.googleStatus,
        spend: campaign.spend,
      })),
    },
    campaignStatuses: Array.from(
      new Set(dashboard.campaigns.map(campaign => campaign.googleStatus)),
    ),
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
      currentIsHistoricalSubset: dashboard.activeCampaigns.every(campaign =>
        historicalCampaignIds.has(campaign.campaignId),
      ),
      rankingsUseHistoricalUniverse: Array.from(rankedCampaignIds).every(
        campaignId => historicalCampaignIds.has(campaignId),
      ),
      historicalInactiveCampaignsInRankings: Array.from(
        rankedCampaignIds,
      ).filter(campaignId => historicalInactiveCampaignIds.has(campaignId))
        .length,
    },
  };

  if (output.current.inactiveCampaignCount > 0) {
    throw new Error(
      `A área de campanhas atuais ainda contém campanhas inativas: ${inactiveCurrentCampaigns
        .map(campaign => `${campaign.campaignId}:${campaign.googleStatus}`)
        .join(", ")}`,
    );
  }
  if (output.current.campaignCount === 0) {
    throw new Error("A fonte não retornou campanhas ativas para o período");
  }
  if (output.historical.campaignCount < output.current.campaignCount) {
    throw new Error("O histórico não pode conter menos campanhas que o universo atual");
  }
  if (
    !output.reconciled.investment ||
    !output.reconciled.conversions ||
    !output.reconciled.clicks ||
    !output.reconciled.impressions ||
    !output.reconciled.currentIsHistoricalSubset ||
    !output.reconciled.rankingsUseHistoricalUniverse
  ) {
    throw new Error("Os KPIs históricos não reconciliaram com a série diária");
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
