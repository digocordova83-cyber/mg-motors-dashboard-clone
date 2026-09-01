import { and, eq } from "drizzle-orm";

import { weeklySalesRecords } from "../drizzle/schema";
import { getOfficialDealers } from "../server/dealerNormalization";
import { getDb } from "../server/db";
import {
  buildOfficialWeeklyDealerKeys,
  resolveOfficialWeeklyDealerMatchStatus,
} from "../server/weeklySalesService";

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  const officialDealerKeys = buildOfficialWeeklyDealerKeys(getOfficialDealers());
  const rows = await db
    .select({
      id: weeklySalesRecords.id,
      sourceName: weeklySalesRecords.sourceName,
      canonicalDealerKey: weeklySalesRecords.canonicalDealerKey,
      matchStatus: weeklySalesRecords.matchStatus,
    })
    .from(weeklySalesRecords)
    .where(
      and(
        eq(weeklySalesRecords.competence, "2026-08"),
        eq(weeklySalesRecords.rowType, "DEALER"),
      ),
    );

  const changes = rows
    .map(row => ({
      ...row,
      targetStatus: resolveOfficialWeeklyDealerMatchStatus(
        row.canonicalDealerKey,
        officialDealerKeys,
      ),
    }))
    .filter(row => row.matchStatus !== row.targetStatus);

  await db.transaction(async tx => {
    for (const row of changes) {
      await tx
        .update(weeklySalesRecords)
        .set({ matchStatus: row.targetStatus })
        .where(eq(weeklySalesRecords.id, row.id));
    }
  });

  console.log(
    JSON.stringify(
      {
        competence: "2026-08",
        officialDealers: officialDealerKeys.size,
        dealerRowsChecked: rows.length,
        rowsUpdated: changes.length,
        changes: changes.map(row => ({
          id: row.id,
          dealer: row.sourceName,
          from: row.matchStatus,
          to: row.targetStatus,
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
