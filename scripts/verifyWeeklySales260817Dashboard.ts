import { writeFile } from "node:fs/promises";

import { getWeeklySalesMetrics } from "../server/weeklySalesService";

const outputPath = "/tmp/weekly-sales-260817-dashboard-reconciliation.json";

async function main() {
  const metrics = await getWeeklySalesMetrics("2026-08", {
    dateFrom: "2026-08-01",
    dateTo: "2026-08-17",
  });
  const dealerSales = metrics.dealers.reduce(
    (total, dealer) => total + (dealer.sales ?? 0),
    0,
  );
  const stateSales = metrics.states.reduce((total, state) => total + state.sales, 0);
  const targetSales = metrics.targets?.dealers.reduce(
    (total, dealer) => total + (dealer.salesActual ?? 0),
    0,
  );
  const tecarGoiania = metrics.dealers.find(
    dealer => dealer.sourceName === "TECAR GOIÂNIA",
  );

  const checks = {
    referenceWeekIs4: metrics.referenceWeek === 4,
    importIs260817:
      metrics.import?.id === 360001 &&
      metrics.import.fileName === "pasted_file_FmTEx5_pdfhandler.pdf",
    totalSalesIs338: metrics.summary.totalSales === 338,
    matchedSalesIs338: metrics.summary.matchedSales === 338,
    unmatchedSalesIsZero: metrics.summary.unmatchedSales === 0,
    matchedDealersAre26: metrics.summary.matchedDealers === 26,
    unmatchedDealersAreZero: metrics.summary.unmatchedDealers === 0,
    oneDealerMissingReferenceSales: metrics.summary.dealersWithoutReferenceSales === 1,
    dealerSalesReconcile: dealerSales === metrics.summary.totalSales,
    stateSalesReconcile: stateSales === metrics.summary.totalSales,
    targetSalesReconcile: targetSales === metrics.summary.totalSales,
    tecarGoianiaIsMatched: tecarGoiania?.matchStatus === "MATCHED",
    tecarGoianiaHasNoReportedSales: tecarGoiania?.sales === null,
    tecarGoianiaWeek4IsBlank: tecarGoiania?.weeks["4"]?.retail === null,
  };
  if (Object.values(checks).some(check => !check)) {
    throw new Error(`Reconciliação falhou: ${JSON.stringify(checks)}`);
  }

  const output = {
    competence: metrics.competence,
    dateFrom: metrics.dateFrom,
    dateTo: metrics.dateTo,
    referenceWeek: metrics.referenceWeek,
    import: metrics.import,
    summary: metrics.summary,
    dealerSales,
    stateSales,
    targetSales,
    topDealersBySales: [...metrics.dealers]
      .filter(dealer => dealer.sales !== null)
      .sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0) || a.dealerName.localeCompare(b.dealerName))
      .slice(0, 5)
      .map(dealer => ({
        dealerName: dealer.dealerName,
        leads: dealer.leads,
        sales: dealer.sales,
        conversionRatePercent: dealer.conversionRatePercent,
      })),
    tecarGoiania: tecarGoiania
      ? {
          dealerName: tecarGoiania.dealerName,
          matchStatus: tecarGoiania.matchStatus,
          leads: tecarGoiania.leads,
          sales: tecarGoiania.sales,
          weeks: tecarGoiania.weeks,
        }
      : null,
    checks,
  };
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${outputPath}\n`);
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
