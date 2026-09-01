import { getLeadAnalytics, getLeadDataBounds } from "../server/leadsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

async function main() {
  const bounds = await getLeadDataBounds();
  const leads = await getLeadAnalytics({ dateFrom: bounds.dateFrom, dateTo: bounds.dateTo });
  const competence = bounds.dateFrom.slice(0, 7);
  const sales = await getWeeklySalesMetrics(competence, {
    dateFrom: bounds.dateFrom,
    dateTo: bounds.dateTo,
  });

  const snapshot = {
    generatedAt: new Date().toISOString(),
    period: {
      competence,
      dateFrom: bounds.dateFrom,
      dateTo: bounds.dateTo,
    },
    leads: {
      summary: leads.summary,
      pacing: leads.pacing,
      channels: leads.channels,
      models: leads.models,
      regions: leads.regions,
      dealers: leads.dealers,
      dealerAudit: leads.dealerAudit,
      daily: leads.daily,
    },
    sales: {
      competence: sales.competence,
      dateFrom: sales.dateFrom,
      dateTo: sales.dateTo,
      referenceWeek: sales.referenceWeek,
      import: sales.import,
      summary: sales.summary,
      dealers: sales.dealers,
    },
    reconciliation: {
      leadChannelTotal: leads.channels.reduce((sum, item) => sum + item.leads, 0),
      leadModelTotal: leads.models.reduce((sum, item) => sum + item.leads, 0),
      leadRegionTotal: leads.regions.reduce((sum, item) => sum + item.leads, 0),
      leadDealerTotal: leads.dealers.reduce((sum, item) => sum + item.leads, 0),
      auditedDealerTotal:
        leads.dealerAudit.dealers.reduce((sum, item) => sum + item.leads, 0) +
        (leads.dealerAudit.unavailable?.leads ?? 0),
      matchedAndUnmatchedSales: sales.summary.matchedSales + sales.summary.unmatchedSales,
    },
  };

  process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
