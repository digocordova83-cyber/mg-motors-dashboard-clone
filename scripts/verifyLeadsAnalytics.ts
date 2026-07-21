import { getLeadAnalytics, getLeadDataBounds } from "../server/leadsService";

async function main() {
  const bounds = await getLeadDataBounds();
  if (!bounds.dateFrom || !bounds.dateTo) throw new Error("Não há Leads para validar.");
  const result = await getLeadAnalytics({ dateFrom: bounds.dateFrom, dateTo: bounds.dateTo });
  const dealerReconciliation =
    result.dealerAudit.dealers.reduce((sum, dealer) => sum + dealer.leads, 0) +
    (result.dealerAudit.unavailable?.leads ?? 0);

  console.log(
    JSON.stringify(
      {
        bounds,
        summary: result.summary,
        pacing: result.pacing,
        primaryChannels: result.channels.slice(0, 6),
        dealerAudit: result.dealerAudit.summary,
        dealerReconciliation,
        dailyReconciliation: result.daily.reduce((sum, point) => sum + point.total, 0),
        topDealers: result.dealerAudit.dealers.slice(0, 5).map(dealer => ({
          dealerName: dealer.dealerName,
          leads: dealer.leads,
          activeDays: dealer.activeDays,
          inactiveDays: dealer.inactiveDays,
          latestDayLeads: dealer.latestDayLeads,
          receiptStatus: dealer.receiptStatus,
        })),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
