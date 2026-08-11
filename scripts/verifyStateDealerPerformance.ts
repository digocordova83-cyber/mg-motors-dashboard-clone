import { getWeeklySalesMetrics } from "../server/weeklySalesService";

async function main() {
  const metrics = await getWeeklySalesMetrics("2026-08", {
    dateFrom: "2026-08-01",
    dateTo: "2026-08-10",
  });
  const summary = {
    competence: metrics.competence,
    dateFrom: metrics.dateFrom,
    dateTo: metrics.dateTo,
    referenceWeek: metrics.referenceWeek,
    stateCount: metrics.states.length,
    totalStateLeads: metrics.states.reduce((total, state) => total + state.leads, 0),
    totalStateSales: metrics.states.reduce((total, state) => total + state.sales, 0),
    states: metrics.states.map(state => ({
      stateCode: state.stateCode,
      stateName: state.stateName,
      leads: state.leads,
      sales: state.sales,
      conversionRatePercent: state.conversionRatePercent,
      salesCoverageLeads: state.salesCoverageLeads,
      salesCoveragePercent: state.salesCoveragePercent,
      recipientDealers: state.recipientDealers,
      salesReportedDealers: state.salesReportedDealers,
      dealers: state.dealers
        .filter(dealer => dealer.leads > 0 || (dealer.sales ?? 0) > 0)
        .map(dealer => ({
          dealerName: dealer.dealerName,
          leads: dealer.leads,
          sales: dealer.sales,
          conversionRatePercent: dealer.conversionRatePercent,
        })),
    })),
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
