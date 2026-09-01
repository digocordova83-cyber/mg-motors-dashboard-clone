import { loadDashboardData } from "../server/dashboardService";
import { getLeadAnalytics } from "../server/leadsService";
import { loadMetaAdsData } from "../server/metaAdsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

const DATE_FROM = "2026-08-01";
const DATE_TO = "2026-08-09";

function topBy<T>(rows: T[], selector: (row: T) => number, limit = 5): T[] {
  return [...rows].sort((left, right) => selector(right) - selector(left)).slice(0, limit);
}

async function main() {
  const [leads, sales, google, meta] = await Promise.all([
    getLeadAnalytics({ dateFrom: DATE_FROM, dateTo: DATE_TO }),
    getWeeklySalesMetrics("2026-08", { dateFrom: DATE_FROM, dateTo: DATE_TO }),
    loadDashboardData(DATE_FROM, DATE_TO),
    loadMetaAdsData(DATE_FROM, DATE_TO),
  ]);

  const result = {
    reportingWindow: { dateFrom: DATE_FROM, dateTo: DATE_TO },
    leads: {
      summary: leads.summary,
      pacing: leads.pacing,
      channels: leads.channels,
      models: leads.models,
      topDealers: leads.dealers.slice(0, 5),
      reconciliation: {
        channelTotal: leads.channels.reduce((sum, item) => sum + item.leads, 0),
        modelTotal: leads.models.reduce((sum, item) => sum + item.leads, 0),
        dealerTotal: leads.dealers.reduce((sum, item) => sum + item.leads, 0),
      },
      updatedAt: leads.metadata.updatedAt,
    },
    sales: {
      referenceWeek: sales.referenceWeek,
      import: sales.import,
      summary: sales.summary,
      topDealers: sales.dealers
        .filter(dealer => dealer.sales !== null)
        .slice(0, 5)
        .map(dealer => ({
          dealerName: dealer.dealerName,
          matchStatus: dealer.matchStatus,
          leads: dealer.leads,
          sales: dealer.sales,
          conversionRatePercent: dealer.conversionRatePercent,
        })),
    },
    googleAds: {
      summary: google.summary,
      topCampaignsByImpressions: topBy(google.campaigns, campaign => campaign.impressions).map(campaign => ({
        campaign: campaign.campaign,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
      })),
      metadata: google.metadata,
    },
    metaAds: {
      summary: meta.summary,
      topCampaignsByImpressions: topBy(meta.campaigns, campaign => campaign.impressions).map(campaign => ({
        campaign: campaign.name,
        impressions: campaign.impressions,
        reach: campaign.reach,
        clicks: campaign.clicks,
        leads: campaign.leads,
      })),
      metadata: meta.metadata,
    },
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
