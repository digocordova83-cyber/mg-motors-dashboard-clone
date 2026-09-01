import { and, gte, lte, sql } from "drizzle-orm";
import { leads } from "../drizzle/schema";
import { getDb } from "../server/db";

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const dateFrom = "2026-07-01";
  const dateTo = "2026-07-30";
  const rows = await db
    .select({
      channel: leads.channel,
      model: leads.model,
      count: sql<number>`count(*)`,
    })
    .from(leads)
    .where(and(gte(leads.correctedDate, dateFrom), lte(leads.correctedDate, dateTo)))
    .groupBy(leads.channel, leads.model);

  const matrix: Record<string, Record<string, number>> = {};
  let total = 0;
  for (const row of rows) {
    const count = Number(row.count ?? 0);
    matrix[row.channel] ??= {};
    matrix[row.channel][row.model] = count;
    total += count;
  }
  process.stdout.write(`${JSON.stringify({ dateFrom, dateTo, total, matrix }, null, 2)}\n`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
