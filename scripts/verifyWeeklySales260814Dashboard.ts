import { writeFile } from "node:fs/promises";

import { getWeeklySalesMetrics } from "../server/weeklySalesService";

const outputPath = "/tmp/weekly-sales-260814-dashboard-reconciliation.json";

async function verifyPeriod(dateTo: string) {
  const metrics = await getWeeklySalesMetrics("2026-08", {
    dateFrom: "2026-08-01",
    dateTo,
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

  const checks = {
    referenceWeekIs3: metrics.referenceWeek === 3,
    importIs260814: metrics.import?.fileName === "260814DailySalesPlanningReport.pdf",
    totalSalesIs248: metrics.summary.totalSales === 248,
    matchedSalesIs248: metrics.summary.matchedSales === 248,
    unmatchedSalesIsZero: metrics.summary.unmatchedSales === 0,
    matchedDealersAre25: metrics.summary.matchedDealers === 25,
    unmatchedDealersAreZero: metrics.summary.unmatchedDealers === 0,
    noDealerMissingReferenceSales: metrics.summary.dealersWithoutReferenceSales === 0,
    dealerSalesReconcile: dealerSales === metrics.summary.totalSales,
    stateSalesReconcile: stateSales === metrics.summary.totalSales,
    targetSalesReconcile: targetSales === metrics.summary.totalSales,
  };
  if (Object.values(checks).some(check => !check)) {
    throw new Error(`Reconciliação falhou em ${dateTo}: ${JSON.stringify(checks)}`);
  }

  const tecarGoiania = metrics.dealers.find(
    dealer => dealer.sourceName === "TECAR GOIÂNIA",
  );
  if (
    tecarGoiania?.sales !== 2 ||
    tecarGoiania.weeks["2"]?.retail !== 2 ||
    tecarGoiania.weeks["3"]?.retail !== 2
  ) {
    throw new Error(`TECAR GOIÂNIA divergente em ${dateTo}.`);
  }

  return {
    dateFrom: metrics.dateFrom,
    dateTo: metrics.dateTo,
    referenceWeek: metrics.referenceWeek,
    import: metrics.import,
    summary: metrics.summary,
    dealerSales,
    stateSales,
    targetSales,
    tecarGoiania: {
      dealerName: tecarGoiania.dealerName,
      leads: tecarGoiania.leads,
      sales: tecarGoiania.sales,
      conversionRatePercent: tecarGoiania.conversionRatePercent,
      weeks: tecarGoiania.weeks,
    },
    checks,
  };
}

async function main() {
  const output = {
    competence: "2026-08",
    dMinusOne: await verifyPeriod("2026-08-13"),
    throughReportDate: await verifyPeriod("2026-08-14"),
  };
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${outputPath}\n`);
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
