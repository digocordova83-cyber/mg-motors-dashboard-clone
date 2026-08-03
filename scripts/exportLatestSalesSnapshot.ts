import { and, desc, eq } from "drizzle-orm";
import { weeklySalesImports, weeklySalesRecords } from "../drizzle/schema";
import { getDb } from "../server/db";

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [latestImport] = await db
    .select()
    .from(weeklySalesImports)
    .where(
      and(
        eq(weeklySalesImports.competence, "2026-07"),
        eq(weeklySalesImports.status, "COMPLETED"),
      ),
    )
    .orderBy(desc(weeklySalesImports.completedAt), desc(weeklySalesImports.createdAt))
    .limit(1);

  if (!latestImport) throw new Error("No completed July 2026 sales import");

  const rows = await db
    .select()
    .from(weeklySalesRecords)
    .where(
      and(
        eq(weeklySalesRecords.importId, latestImport.id),
        eq(weeklySalesRecords.rowType, "DEALER"),
      ),
    );

  const week = latestImport.referenceWeek >= 1 && latestImport.referenceWeek <= 5
    ? latestImport.referenceWeek
    : 4;
  const retailKey = `week${week}Retail` as keyof (typeof rows)[number];
  const targetKey = `week${week}Target` as keyof (typeof rows)[number];
  const achievementKey = `week${week}Achievement` as keyof (typeof rows)[number];

  const dealers = rows
    .map(row => ({
      sourceName: row.sourceName,
      dealerName: row.canonicalDealer ?? row.sourceName,
      matchStatus: row.matchStatus,
      target: row[targetKey] === null ? null : Number(row[targetKey]),
      sales: row[retailKey] === null ? null : Number(row[retailKey]),
      achievementPercent:
        row[achievementKey] === null ? null : Number(row[achievementKey]),
    }))
    .sort((a, b) => (b.sales ?? -1) - (a.sales ?? -1) || a.dealerName.localeCompare(b.dealerName));

  const matchedSales = dealers
    .filter(row => row.matchStatus === "MATCHED")
    .reduce((sum, row) => sum + (row.sales ?? 0), 0);
  const unmatchedSales = dealers
    .filter(row => row.matchStatus === "UNMATCHED")
    .reduce((sum, row) => sum + (row.sales ?? 0), 0);

  process.stdout.write(`${JSON.stringify({
    import: latestImport,
    referenceWeek: week,
    summary: {
      dealerRows: dealers.length,
      matchedDealers: dealers.filter(row => row.matchStatus === "MATCHED").length,
      unmatchedDealers: dealers.filter(row => row.matchStatus === "UNMATCHED").length,
      dealersWithoutSales: dealers.filter(row => row.sales === null).length,
      matchedSales,
      unmatchedSales,
      totalDealerSales: matchedSales + unmatchedSales,
      referenceDealerSalesTotal: latestImport.referenceDealerSalesTotal,
      referenceRegionSalesTotal: latestImport.referenceRegionSalesTotal,
      referenceReportedSalesTotal: latestImport.referenceReportedSalesTotal,
    },
    dealers,
  }, null, 2)}\n`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
