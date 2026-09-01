import { count, sql } from "drizzle-orm";
import { leadImports, leadMonthlyGoals, leads } from "../drizzle/schema";
import { getDb } from "../server/db";

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");
  const [leadCount] = await db.select({ value: count() }).from(leads);
  const [hashCount] = await db
    .select({ value: sql<number>`count(distinct ${leads.recordHash})` })
    .from(leads);
  const imports = await db.select().from(leadImports);
  const goals = await db.select().from(leadMonthlyGoals);

  console.log(
    JSON.stringify(
      {
        leadCount: leadCount?.value ?? 0,
        distinctRecordHashes: Number(hashCount?.value ?? 0),
        imports: imports.map(item => ({
          id: item.id,
          status: item.status,
          rowsTotal: item.rowsTotal,
          rowsInserted: item.rowsInserted,
          rowsSkipped: item.rowsSkipped,
          rowsInvalid: item.rowsInvalid,
          hasStoredFile: Boolean(item.fileKey && item.fileUrl),
        })),
        goals: goals.map(item => ({ competencia: item.competencia, goalCount: item.goalCount })),
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
