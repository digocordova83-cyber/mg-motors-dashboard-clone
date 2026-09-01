import { getLeadAnalytics } from "../server/leadsService";
import {
  applyAugustMetaBudget,
  buildLeadMediaInvestmentReference,
  getAugustMetaBudgetPlan,
  loadPaidMediaInvestmentMeasurements,
} from "../server/leadMediaInvestmentService";

const dateFrom = "2026-08-01";
const dateTo = "2026-08-24";

const analytics = await getLeadAnalytics({ dateFrom, dateTo });
const measurements = await loadPaidMediaInvestmentMeasurements(dateFrom, dateTo);
const metaBudgetPlan = getAugustMetaBudgetPlan(analytics.dateFrom, analytics.dateTo);
const effectiveMeasurements = applyAugustMetaBudget(measurements, metaBudgetPlan);
const mediaInvestment = buildLeadMediaInvestmentReference({
  dateFrom: analytics.dateFrom,
  dateTo: analytics.dateTo,
  channelLeads: analytics.channels,
  measurements: effectiveMeasurements,
  metaBudgetPlan,
});

console.log(
  JSON.stringify(
    {
      period: { dateFrom: analytics.dateFrom, dateTo: analytics.dateTo },
      totalLeads: analytics.summary.totalLeads,
      channels: analytics.channels,
      metaBudgetPlan,
      mediaInvestment: {
        totalInvestment: mediaInvestment.totalInvestment,
        availableInvestment: mediaInvestment.availableInvestment,
        paidMediaLeads: mediaInvestment.paidMediaLeads,
        estimatedOverallCpl: mediaInvestment.estimatedOverallCpl,
        channels: mediaInvestment.channels.map(channel => ({
          channel: channel.channel,
          leads: channel.leads,
          investment: channel.investment,
          referenceCpl: channel.referenceCpl,
          source: channel.source,
          status: channel.status,
          dataThroughDate: channel.dataThroughDate,
        })),
      },
    },
    null,
    2,
  ),
);
