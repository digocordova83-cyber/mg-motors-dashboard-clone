import { getLeadAnalytics } from "../server/leadsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

const dateFrom = process.argv[2] ?? "2026-08-01";
const dateTo = process.argv[3] ?? "2026-08-23";
const competence = dateTo.slice(0, 7);

async function main() {
  const [leads, sales] = await Promise.all([
    getLeadAnalytics({ dateFrom, dateTo }),
    getWeeklySalesMetrics(competence, { dateFrom, dateTo }),
  ]);

  const leadChannelTotal = leads.channels.reduce((sum, channel) => sum + channel.leads, 0);
  const leadModelTotal = leads.models.reduce((sum, model) => sum + model.leads, 0);
  const leadRegionTotal = leads.regions.reduce((sum, region) => sum + region.leads, 0);
  const leadDealerTotal = leads.dealers.reduce((sum, dealer) => sum + dealer.leads, 0);
  const salesDealerTotal = sales.dealers.reduce((sum, dealer) => sum + (dealer.sales ?? 0), 0);
  const salesStateTotal = sales.states.reduce((sum, state) => sum + state.sales, 0);

  const result = {
    period: { competence, dateFrom, dateTo },
    leads: {
      summary: leads.summary,
      channels: leads.channels,
      totals: {
        channel: leadChannelTotal,
        model: leadModelTotal,
        region: leadRegionTotal,
        dealer: leadDealerTotal,
      },
      updatedAt: leads.metadata.updatedAt,
    },
    sales: {
      import: sales.import,
      referenceWeek: sales.referenceWeek,
      summary: sales.summary,
      totals: {
        dealer: salesDealerTotal,
        state: salesStateTotal,
      },
      states: sales.states.map(state => ({
        stateCode: state.stateCode,
        stateName: state.stateName,
        leads: state.leads,
        sales: state.sales,
        conversionRatePercent: state.conversionRatePercent,
        dealers: state.dealers.map(dealer => ({
          dealerName: dealer.dealerName,
          leads: dealer.leads,
          sales: dealer.sales,
          conversionRatePercent: dealer.conversionRatePercent,
        })),
      })),
    },
    reconciliation: {
      leadsByChannelModelRegionAgree:
        leadChannelTotal === leadModelTotal && leadModelTotal === leadRegionTotal,
      salesDealerAndStateAgree:
        salesDealerTotal === sales.summary.totalSales && salesStateTotal === sales.summary.totalSales,
      salesMatchedPlusUnmatchedAgree:
        sales.summary.matchedSales + sales.summary.unmatchedSales === sales.summary.totalSales,
      noUnmatchedDealers: sales.summary.unmatchedDealers === 0,
    },
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.reconciliation.leadsByChannelModelRegionAgree || !result.reconciliation.salesDealerAndStateAgree || !result.reconciliation.salesMatchedPlusUnmatchedAgree || !result.reconciliation.noUnmatchedDealers) {
    process.exitCode = 2;
  }
}

main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
