import { and, asc, count, gte, lte } from "drizzle-orm";

import { leads } from "../drizzle/schema";
import {
  canonicalizeDealerForAnalytics,
  isDealerQualificationPlaceholder,
  normalizeDealerLookupKey,
} from "../server/dealerNormalization";
import { getDealerTargetsForCompetence } from "../server/dealerTargetsService";
import { getDb } from "../server/db";

async function main() {
  const competence = process.argv[2] ?? "2026-08";
  const dateFrom = process.argv[3] ?? `${competence}-01`;
  const dateTo = process.argv[4] ?? "2026-08-11";
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");

  const targets = await getDealerTargetsForCompetence(competence);
  const targetByKey = new Map(targets.map(target => [target.canonicalDealerKey, target] as const));
  const rawGroups = await db
    .select({
      dealerRaw: leads.dealerRaw,
      dealerName: leads.dealerName,
      total: count(),
    })
    .from(leads)
    .where(and(gte(leads.correctedDate, dateFrom), lte(leads.correctedDate, dateTo)))
    .groupBy(leads.dealerRaw, leads.dealerName)
    .orderBy(asc(leads.dealerRaw));

  const matchedByTarget = new Map<string, Array<{ dealerRaw: string; dealerName: string; canonical: string; leads: number }>>();
  const unmatched: Array<{ dealerRaw: string; dealerName: string; canonical: string; canonicalKey: string; leads: number }> = [];
  let qualificationLeads = 0;

  for (const row of rawGroups) {
    const leadsCount = Number(row.total);
    const raw = row.dealerName || row.dealerRaw;
    if (isDealerQualificationPlaceholder(raw)) {
      qualificationLeads += leadsCount;
      continue;
    }
    const canonical = canonicalizeDealerForAnalytics(raw);
    const canonicalKey = normalizeDealerLookupKey(canonical);
    const target = targetByKey.get(canonicalKey);
    if (!target) {
      unmatched.push({ dealerRaw: row.dealerRaw, dealerName: row.dealerName, canonical, canonicalKey, leads: leadsCount });
      continue;
    }
    const rows = matchedByTarget.get(canonicalKey) ?? [];
    rows.push({ dealerRaw: row.dealerRaw, dealerName: row.dealerName, canonical, leads: leadsCount });
    matchedByTarget.set(canonicalKey, rows);
  }

  const targetCoverage = targets.map(target => {
    const aliases = (matchedByTarget.get(target.canonicalDealerKey) ?? []).sort((a, b) => b.leads - a.leads);
    return {
      sourceDealer: target.sourceDealer,
      canonicalDealer: target.canonicalDealer,
      canonicalDealerKey: target.canonicalDealerKey,
      leadTarget: target.leadTarget,
      leads: aliases.reduce((sum, row) => sum + row.leads, 0),
      aliases,
    };
  });

  const totalRows = rawGroups.reduce((sum, row) => sum + Number(row.total), 0);
  const matchedLeads = targetCoverage.reduce((sum, row) => sum + row.leads, 0);
  const unmatchedLeads = unmatched.reduce((sum, row) => sum + row.leads, 0);

  const output = {
    competence,
    period: { dateFrom, dateTo },
    totals: {
      leads: totalRows,
      matchedLeads,
      qualificationLeads,
      unmatchedLeads,
      reconciled: totalRows === matchedLeads + qualificationLeads + unmatchedLeads,
    },
    targets: targetCoverage,
    zeroTargets: targetCoverage.filter(row => row.leads === 0),
    unmatched: unmatched.sort((a, b) => b.leads - a.leads),
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
