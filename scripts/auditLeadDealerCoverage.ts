import { sql } from "drizzle-orm";

import { leads } from "../drizzle/schema";
import {
  canonicalizeDealerName,
  getAdditionalOfficialLeadDealerKeys,
  getOfficialDealers,
  isDealerQualificationPlaceholder,
  normalizeDealerLookupKey,
} from "../server/dealerNormalization";
import { getDb } from "../server/db";
import {
  buildOfficialWeeklyDealerKeys,
  getWeeklySalesMetrics,
} from "../server/weeklySalesService";
import { resolveWeeklySalesCanonicalDealer } from "../server/weeklySalesCsv";

type DealerGroup = {
  dealerName: string | null;
  count: number;
  augustCount: number;
  firstDate: string | null;
  lastDate: string | null;
};

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  const rows = await db
    .select({
      dealerName: leads.dealerName,
      count: sql<number>`count(*)`,
      augustCount: sql<number>`sum(case when ${leads.correctedDate} >= '2026-08-01' then 1 else 0 end)`,
      firstDate: sql<string | null>`min(${leads.correctedDate})`,
      lastDate: sql<string | null>`max(${leads.correctedDate})`,
    })
    .from(leads)
    .groupBy(leads.dealerName);

  const officialDealerDirectoryKeys = buildOfficialWeeklyDealerKeys(getOfficialDealers());
  const officialDealerKeys = new Set([
    ...officialDealerDirectoryKeys,
    ...getAdditionalOfficialLeadDealerKeys(),
  ]);
  const officialDealers = getOfficialDealers().map(dealer => {
    const canonicalName = resolveWeeklySalesCanonicalDealer(dealer.name).canonicalDealer;
    return {
      officialName: dealer.name,
      canonicalName,
      canonicalKey: normalizeDealerLookupKey(canonicalName),
      operationalArea: dealer.operationalArea,
    };
  });
  const matched: DealerGroup[] = [];
  const qualification: DealerGroup[] = [];
  const unmatched: Array<DealerGroup & { canonicalName: string; canonicalKey: string }> = [];

  for (const row of rows) {
    const count = Number(row.count ?? 0);
    const dealerName = row.dealerName ?? "";
    const normalizedRow = {
      dealerName: row.dealerName,
      count,
      augustCount: Number(row.augustCount ?? 0),
      firstDate: row.firstDate,
      lastDate: row.lastDate,
    };
    if (isDealerQualificationPlaceholder(dealerName)) {
      qualification.push(normalizedRow);
      continue;
    }

    const canonicalName = canonicalizeDealerName(dealerName);
    const canonicalKey = normalizeDealerLookupKey(canonicalName);
    if (officialDealerKeys.has(canonicalKey)) {
      matched.push(normalizedRow);
    } else {
      unmatched.push({ ...normalizedRow, canonicalName, canonicalKey });
    }
  }

  const sum = (items: DealerGroup[]) => items.reduce((total, item) => total + item.count, 0);
  const totalLeads = sum(
    rows.map(row => ({
      ...row,
      count: Number(row.count ?? 0),
      augustCount: Number(row.augustCount ?? 0),
    })),
  );
  const matchedLeads = sum(matched);
  const qualificationLeads = sum(qualification);
  const unmatchedLeads = sum(unmatched);
  const assignedLeads = matchedLeads + unmatchedLeads;
  const assignedCoveragePercent =
    assignedLeads === 0 ? 100 : Number(((matchedLeads / assignedLeads) * 100).toFixed(4));
  const assignedShareOfBasePercent =
    totalLeads === 0 ? 0 : Number(((assignedLeads / totalLeads) * 100).toFixed(4));

  const weeklySales = await getWeeklySalesMetrics("2026-08", {
    dateFrom: "2026-08-01",
    dateTo: "2026-08-09",
  });

  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        officialDealerCount: officialDealerDirectoryKeys.size,
        verifiedLeadDealerKeyCount: officialDealerKeys.size,
        officialDealers,
        leadBase: {
          totalLeads,
          assignedLeads,
          matchedLeads,
          qualificationLeads,
          unmatchedLeads,
          assignedCoveragePercent,
          assignedShareOfBasePercent,
          distinctRawDealerNames: rows.length,
          matchedRawDealerNames: matched.length,
          qualificationRawDealerNames: qualification.length,
          unmatchedRawDealerNames: unmatched.length,
        },
        unmatchedNames: unmatched.sort((left, right) => right.count - left.count),
        qualificationNames: qualification.sort((left, right) => right.count - left.count),
        weeklySales: weeklySales.summary,
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
