import { and, gte, lte, sql } from "drizzle-orm";

import { leads as leadsTable } from "../drizzle/schema";
import { loadDashboardData } from "../server/dashboardService";
import { getDb } from "../server/db";
import { getDealerTargetsForCompetence } from "../server/dealerTargetsService";
import {
  applyAugustMetaBudget,
  buildLeadMediaInvestmentReference,
  getAugustMetaBudgetPlan,
  loadPaidMediaInvestmentMeasurements,
} from "../server/leadMediaInvestmentService";
import { resolveLeadReportingChannel } from "../server/leadsAnalytics";
import { getLeadAnalytics } from "../server/leadsService";
import { loadMetaAdsData } from "../server/metaAdsService";
import { loadTikTokAdsData } from "../server/tiktokAdsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

const DATE_FROM = process.argv[2] ?? "2026-08-01";
const DATE_TO = process.argv[3] ?? "2026-08-25";

function topBy<T>(rows: T[], selector: (row: T) => number, limit = 5): T[] {
  return [...rows].sort((a, b) => selector(b) - selector(a)).slice(0, limit);
}

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [leadAnalytics, sales, google, meta, tiktok, targets, channelModelRows, measurements] =
    await Promise.all([
      getLeadAnalytics({ dateFrom: DATE_FROM, dateTo: DATE_TO }),
      getWeeklySalesMetrics("2026-08", { dateFrom: DATE_FROM, dateTo: DATE_TO }),
      loadDashboardData(DATE_FROM, DATE_TO),
      loadMetaAdsData(DATE_FROM, DATE_TO),
      loadTikTokAdsData(DATE_FROM, DATE_TO),
      getDealerTargetsForCompetence("2026-08"),
      db
        .select({
          channel: leadsTable.channel,
          sourceChannel: leadsTable.sourceChannel,
          model: leadsTable.model,
          count: sql<number>`count(*)`,
        })
        .from(leadsTable)
        .where(
          and(
            gte(leadsTable.correctedDate, DATE_FROM),
            lte(leadsTable.correctedDate, DATE_TO),
          ),
        )
        .groupBy(leadsTable.channel, leadsTable.sourceChannel, leadsTable.model),
      loadPaidMediaInvestmentMeasurements(DATE_FROM, DATE_TO),
    ]);

  const metaBudgetPlan = getAugustMetaBudgetPlan(DATE_FROM, DATE_TO);
  const plannedMeasurements = applyAugustMetaBudget(measurements, metaBudgetPlan);
  const mediaReference = buildLeadMediaInvestmentReference({
    dateFrom: DATE_FROM,
    dateTo: DATE_TO,
    channelLeads: leadAnalytics.channels,
    measurements: plannedMeasurements,
    metaBudgetPlan,
  });

  const channelModel: Record<string, Record<string, number>> = {};
  for (const row of channelModelRows) {
    const channel = resolveLeadReportingChannel({
      channel: row.channel,
      sourceChannel: row.sourceChannel,
    });
    const model = row.model || "Indisponível";
    channelModel[channel] ??= {};
    channelModel[channel][model] = Number(row.count ?? 0);
  }

  const eligibleDealers = sales.dealers
    .filter(
      dealer =>
        dealer.matchStatus === "MATCHED" &&
        dealer.leads >= 100 &&
        dealer.sales != null &&
        dealer.conversionRatePercent != null,
    )
    .map(dealer => ({
      dealerName: dealer.dealerName,
      leads: dealer.leads,
      sales: dealer.sales,
      conversionRatePercent: dealer.conversionRatePercent,
    }));

  const dealerTop = [...eligibleDealers]
    .sort((a, b) => b.conversionRatePercent! - a.conversionRatePercent!)
    .slice(0, 5);
  const dealerBottom = [...eligibleDealers]
    .sort((a, b) => a.conversionRatePercent! - b.conversionRatePercent!)
    .slice(0, 5);
  const salesLeaders = topBy(
    sales.dealers.filter(dealer => dealer.sales != null),
    dealer => dealer.sales ?? 0,
    5,
  ).map(dealer => ({
    dealerName: dealer.dealerName,
    leads: dealer.leads,
    sales: dealer.sales,
    conversionRatePercent: dealer.conversionRatePercent,
  }));

  const salesTarget = targets.reduce((sum, target) => sum + target.salesTarget, 0);
  const leadTarget = targets.reduce((sum, target) => sum + target.leadTarget, 0);
  const channelTarget = targets.reduce((sum, target) => sum + target.totalChannelTarget, 0);

  const output = {
    generatedAt: new Date().toISOString(),
    reportingWindow: { dateFrom: DATE_FROM, dateTo: DATE_TO },
    leads: {
      summary: leadAnalytics.summary,
      pacing: leadAnalytics.pacing,
      channels: leadAnalytics.channels,
      models: leadAnalytics.models,
      daily: leadAnalytics.daily,
      channelModel,
      targets: { dealerLeadTarget: leadTarget, dealerChannelTarget: channelTarget },
      metadata: leadAnalytics.metadata,
    },
    sales: {
      referenceWeek: sales.referenceWeek,
      import: sales.import,
      summary: sales.summary,
      salesTarget,
      achievementPercent: salesTarget > 0 ? (sales.summary.totalSales / salesTarget) * 100 : null,
      topDealersByConversion: dealerTop,
      bottomDealersByConversion: dealerBottom,
      salesLeaders,
      eligibleDealerCount: eligibleDealers.length,
      states: sales.states,
    },
    googleAds: {
      summary: google.summary,
      metadata: google.metadata,
      topCampaignsByImpressions: topBy(google.campaigns, campaign => campaign.impressions, 10),
    },
    metaAds: {
      summary: meta.summary,
      metadata: meta.metadata,
      topCampaignsByImpressions: topBy(meta.campaigns, campaign => campaign.impressions, 10),
    },
    tiktokAds: {
      summary: tiktok.summary,
      metadata: tiktok.metadata,
      topCampaignsByImpressions: topBy(tiktok.campaigns, campaign => campaign.impressions, 10),
    },
    leadMediaReference: mediaReference,
    reconciliation: {
      channelTotal: leadAnalytics.channels.reduce((sum, item) => sum + item.leads, 0),
      modelTotal: leadAnalytics.models.reduce((sum, item) => sum + item.leads, 0),
      dailyTotal: leadAnalytics.daily.reduce((sum, item) => sum + item.total, 0),
      salesMatchedAndUnmatched: sales.summary.matchedSales + sales.summary.unmatchedSales,
    },
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
