import { getWeeklySalesMetrics } from "../server/weeklySalesService";

async function main() {
  const metrics = await getWeeklySalesMetrics("2026-08", {
    dateFrom: "2026-08-01",
    dateTo: "2026-08-11",
  });
  if (!metrics.targets) throw new Error("Metas de agosto não encontradas");
  const targets = metrics.targets;
  const dealerLeadTarget = targets.dealers.reduce((total, row) => total + row.leadTarget, 0);
  const dealerSalesTarget = targets.dealers.reduce((total, row) => total + row.salesTarget, 0);
  const dealerLeadsActual = targets.dealers.reduce((total, row) => total + row.leadsActual, 0);
  const reportedSalesActual = targets.dealers.reduce((total, row) => total + (row.salesActual ?? 0), 0);
  if (targets.dealers.length !== 31) throw new Error(`Esperados 31 dealers; encontrados ${targets.dealers.length}`);
  if (dealerLeadTarget !== targets.summary.leadTarget) throw new Error("Meta de Leads não reconciliada");
  if (dealerSalesTarget !== targets.summary.salesTarget) throw new Error("Meta de Sales não reconciliada");
  if (dealerLeadsActual !== targets.summary.leadsActual) throw new Error("Leads realizados não reconciliados");
  if (reportedSalesActual !== targets.summary.salesActual) throw new Error("Sales realizadas não reconciliadas");
  if (targets.summary.leadTarget !== 11_996 || targets.summary.salesTarget !== 548) {
    throw new Error("Totais oficiais da planilha divergentes");
  }

  const output = {
    competence: metrics.competence,
    leadPeriod: metrics.leadPeriod,
    referenceWeek: metrics.referenceWeek,
    source: targets.source,
    summary: targets.summary,
    dealers: targets.dealers.length,
    salesUnreportedDealers: targets.dealers.filter(row => row.salesActual === null).map(row => row.dealerName),
    lowestLeadAchievement: [...targets.dealers]
      .sort((a, b) => a.leadAchievementPercent - b.leadAchievementPercent)
      .slice(0, 5)
      .map(row => ({ dealer: row.dealerName, actual: row.leadsActual, target: row.leadTarget, achievement: row.leadAchievementPercent, gap: row.leadGap })),
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
