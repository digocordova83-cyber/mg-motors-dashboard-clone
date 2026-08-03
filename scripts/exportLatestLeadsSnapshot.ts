import { getLeadAnalytics, getLeadDataBounds } from "../server/leadsService";

async function main() {
  const bounds = await getLeadDataBounds();
  const result = await getLeadAnalytics({ dateFrom: bounds.dateFrom, dateTo: bounds.dateTo });
  const snapshot = {
    generatedAt: new Date().toISOString(),
    bounds,
    summary: result.summary,
    pacing: result.pacing,
    channels: result.channels,
    models: result.models,
    regions: result.regions,
    dealers: result.dealers,
    dealerAudit: result.dealerAudit,
    daily: result.daily,
    reconciliation: {
      channels: result.channels.reduce((sum, item) => sum + item.leads, 0),
      models: result.models.reduce((sum, item) => sum + item.leads, 0),
      regions: result.regions.reduce((sum, item) => sum + item.leads, 0),
      dealers: result.dealers.reduce((sum, item) => sum + item.leads, 0),
      auditedDealers:
        result.dealerAudit.dealers.reduce((sum, item) => sum + item.leads, 0) +
        (result.dealerAudit.unavailable?.leads ?? 0),
      daily: result.daily.reduce((sum, item) => sum + item.total, 0),
    },
  };
  process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
