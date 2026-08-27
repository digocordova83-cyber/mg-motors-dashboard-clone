import { and, gte, lte, sql } from "drizzle-orm";

import { leads as leadsTable } from "../drizzle/schema";
import { getDashboardDataSnapshot, getDb, getLatestDashboardDataSnapshot } from "../server/db";
import { getDealerTargetsForCompetence } from "../server/dealerTargetsService";
import { resolveLeadReportingChannel } from "../server/leadsAnalytics";
import { getLeadAnalytics } from "../server/leadsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

const DATE_FROM = process.argv[2] ?? "2026-08-01";
const DATE_TO = process.argv[3] ?? "2026-08-26";

type SnapshotPayload = { rows?: unknown[]; updatedAt?: string };

async function readSnapshot(source: "GOOGLE_ADS" | "META_ADS" | "TIKTOK_ADS") {
  const exact = await getDashboardDataSnapshot<SnapshotPayload>({
    source,
    periodFrom: DATE_FROM,
    periodTo: DATE_TO,
  });
  const snapshot = exact ?? await getLatestDashboardDataSnapshot<SnapshotPayload>({
    source,
    periodFrom: DATE_FROM,
    periodTo: DATE_TO,
  });
  return snapshot
    ? {
        periodFrom: snapshot.periodFrom,
        periodTo: snapshot.periodTo,
        dataThroughDate: snapshot.dataThroughDate,
        sourceName: snapshot.sourceName,
        refreshedAt: snapshot.refreshedAt,
        payload: snapshot.payload,
      }
    : null;
}

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [leadAnalytics, sales, targets, channelModelRows, google, meta, tiktok] = await Promise.all([
    getLeadAnalytics({ dateFrom: DATE_FROM, dateTo: DATE_TO }),
    getWeeklySalesMetrics("2026-08", { dateFrom: DATE_FROM, dateTo: DATE_TO }),
    getDealerTargetsForCompetence("2026-08"),
    db
      .select({
        channel: leadsTable.channel,
        sourceChannel: leadsTable.sourceChannel,
        model: leadsTable.model,
        count: sql<number>`count(*)`,
      })
      .from(leadsTable)
      .where(and(gte(leadsTable.correctedDate, DATE_FROM), lte(leadsTable.correctedDate, DATE_TO)))
      .groupBy(leadsTable.channel, leadsTable.sourceChannel, leadsTable.model),
    readSnapshot("GOOGLE_ADS"),
    readSnapshot("META_ADS"),
    readSnapshot("TIKTOK_ADS"),
  ]);

  const channelModel: Record<string, Record<string, number>> = {};
  for (const row of channelModelRows) {
    const channel = resolveLeadReportingChannel({ channel: row.channel, sourceChannel: row.sourceChannel });
    const model = row.model || "Indisponível";
    channelModel[channel] ??= {};
    channelModel[channel][model] = Number(row.count ?? 0);
  }

  const salesTarget = targets.reduce((sum, item) => sum + item.salesTarget, 0);
  const output = {
    generatedAt: new Date().toISOString(),
    reportingWindow: { dateFrom: DATE_FROM, dateTo: DATE_TO },
    leads: { summary: leadAnalytics.summary, pacing: leadAnalytics.pacing, channels: leadAnalytics.channels, models: leadAnalytics.models, daily: leadAnalytics.daily, channelModel, metadata: leadAnalytics.metadata },
    sales: { referenceWeek: sales.referenceWeek, import: sales.import, summary: sales.summary, salesTarget, achievementPercent: salesTarget > 0 ? (sales.summary.totalSales / salesTarget) * 100 : null, dealers: sales.dealers, states: sales.states },
    snapshots: { google, meta, tiktok },
    reconciliation: {
      channelTotal: leadAnalytics.channels.reduce((sum, item) => sum + item.leads, 0),
      modelTotal: leadAnalytics.models.reduce((sum, item) => sum + item.leads, 0),
      dailyTotal: leadAnalytics.daily.reduce((sum, item) => sum + item.total, 0),
      salesMatchedAndUnmatched: sales.summary.matchedSales + sales.summary.unmatchedSales,
    },
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
