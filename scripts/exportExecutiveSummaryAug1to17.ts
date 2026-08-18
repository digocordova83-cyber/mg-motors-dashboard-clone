import { loadDashboardData } from "../server/dashboardService";
import { getLeadAnalytics } from "../server/leadsService";
import { loadMetaAdsData } from "../server/metaAdsService";
import { loadTikTokAdsData } from "../server/tiktokAdsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

const DATE_FROM = "2026-08-01";
const DATE_TO = "2026-08-17";

function topBy<T>(rows: T[], selector: (row: T) => number, limit = 5): T[] {
  return [...rows].sort((left, right) => selector(right) - selector(left)).slice(0, limit);
}

async function main() {
  const [leads, sales, google, meta, tiktok] = await Promise.all([
    getLeadAnalytics({ dateFrom: DATE_FROM, dateTo: DATE_TO }),
    getWeeklySalesMetrics("2026-08", { dateFrom: DATE_FROM, dateTo: DATE_TO }),
    loadDashboardData(DATE_FROM, DATE_TO),
    loadMetaAdsData(DATE_FROM, DATE_TO),
    loadTikTokAdsData(DATE_FROM, DATE_TO),
  ]);

  const result = {
    reportingWindow: { dateFrom: DATE_FROM, dateTo: DATE_TO },
    leads: {
      summary: leads.summary,
      pacing: leads.pacing,
      channels: leads.channels,
      models: leads.models,
      topDealers: leads.dealers.slice(0, 10),
      dealerAudit: leads.dealerAudit.summary,
      reconciliation: {
        channelTotal: leads.channels.reduce((sum, item) => sum + item.leads, 0),
        dailyTotal: leads.daily.reduce((sum, item) => sum + item.total, 0),
        modelTotal: leads.models.reduce((sum, item) => sum + item.leads, 0),
        dealerTotal: leads.dealers.reduce((sum, item) => sum + item.leads, 0),
      },
      updatedAt: leads.metadata.updatedAt,
    },
    sales: {
      referenceWeek: sales.referenceWeek,
      import: sales.import,
      summary: sales.summary,
      topDealers: topBy(
        sales.dealers.filter(dealer => dealer.sales !== null),
        dealer => dealer.sales ?? 0,
        10,
      ).map(dealer => ({
        dealerName: dealer.dealerName,
        matchStatus: dealer.matchStatus,
        leads: dealer.leads,
        sales: dealer.sales,
        conversionRatePercent: dealer.conversionRatePercent,
      })),
    },
    googleAds: {
      summary: google.summary,
      topCampaignsByImpressions: topBy(google.campaigns, campaign => campaign.impressions, 10).map(campaign => ({
        campaign: campaign.campaign,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
      })),
      metadata: google.metadata,
    },
    metaAds: {
      summary: meta.summary,
      topCampaignsByImpressions: topBy(meta.campaigns, campaign => campaign.impressions, 10).map(campaign => ({
        campaign: campaign.name,
        impressions: campaign.impressions,
        reach: campaign.reach,
        clicks: campaign.clicks,
        leads: campaign.leads,
      })),
      metadata: meta.metadata,
    },
    tiktokAds: {
      summary: tiktok.summary,
      topCampaignsByImpressions: topBy(tiktok.campaigns, campaign => campaign.impressions, 10).map(campaign => ({
        campaign: campaign.name,
        impressions: campaign.impressions,
        reach: campaign.reach,
        clicks: campaign.clicks,
        leads: campaign.leads,
        engagements: campaign.engagements,
      })),
      metadata: tiktok.metadata,
    },
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
