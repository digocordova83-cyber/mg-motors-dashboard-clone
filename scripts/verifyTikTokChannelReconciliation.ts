import { and, asc, gte, lte } from "drizzle-orm";
import { leads } from "../drizzle/schema";
import { getDb } from "../server/db";
import { buildLeadAnalytics, type LeadAnalytics } from "../server/leadsAnalytics";

type Summary = {
  dateFrom: string;
  dateTo: string;
  totalLeads: number;
  channelTotal: number;
  dailyTotal: number;
  tiktokChannel: number;
  tiktokDaily: number;
  campanhaUrban: number;
  tiktokByDay: Array<{ date: string; leads: number }>;
  channels: Array<{ value: string; leads: number }>;
};

function summarize(analytics: LeadAnalytics, dateFrom: string, dateTo: string): Summary {
  const channelTotal = analytics.channels.reduce((sum, item) => sum + item.leads, 0);
  const dailyTotal = analytics.daily.reduce((sum, point) => sum + point.total, 0);
  const tiktokChannel = analytics.channels.find(item => item.value === "TikTok")?.leads ?? 0;
  const tiktokDaily = analytics.daily.reduce(
    (sum, point) => sum + Number(point.values.TikTok ?? 0),
    0,
  );
  const campanhaUrban = analytics.channels.find(item => item.value === "Campanha Urban")?.leads ?? 0;

  if (analytics.summary.totalLeads !== channelTotal) {
    throw new Error(`Soma dos canais (${channelTotal}) diverge do total (${analytics.summary.totalLeads}).`);
  }
  if (analytics.summary.totalLeads !== dailyTotal) {
    throw new Error(`Soma dos dias (${dailyTotal}) diverge do total (${analytics.summary.totalLeads}).`);
  }
  if (tiktokChannel !== tiktokDaily) {
    throw new Error(`TikTok por canal (${tiktokChannel}) diverge do TikTok por dia (${tiktokDaily}).`);
  }
  if (!analytics.channelOrder.includes("TikTok")) {
    throw new Error("TikTok não aparece na ordem de canais do gráfico diário.");
  }

  return {
    dateFrom,
    dateTo,
    totalLeads: analytics.summary.totalLeads,
    channelTotal,
    dailyTotal,
    tiktokChannel,
    tiktokDaily,
    campanhaUrban,
    tiktokByDay: analytics.daily
      .map(point => ({ date: point.date, leads: Number(point.values.TikTok ?? 0) }))
      .filter(point => point.leads > 0),
    channels: analytics.channels.map(item => ({ value: item.value, leads: item.leads })),
  };
}

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  const dateFrom = "2026-08-01";
  const latestSourceDate = "2026-08-14";
  const dashboardCutoff = "2026-08-13";
  const rows = await db
    .select({
      correctedDate: leads.correctedDate,
      channel: leads.channel,
      sourceChannel: leads.sourceChannel,
      model: leads.model,
      region: leads.region,
      dealerName: leads.dealerName,
    })
    .from(leads)
    .where(and(gte(leads.correctedDate, dateFrom), lte(leads.correctedDate, latestSourceDate)))
    .orderBy(asc(leads.correctedDate), asc(leads.id));

  const expectedChannels = Array.from(new Set(rows.map(row => row.channel))).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const build = (periodRows: typeof rows, dateTo: string) =>
    buildLeadAnalytics({
      rows: periodRows,
      pacingRows: periodRows,
      dateFrom,
      dateTo,
      competence: "2026-08",
      goal: null,
      expectedChannels,
    });

  const d1Rows = rows.filter(row => row.correctedDate <= dashboardCutoff);
  const dashboard = summarize(build(d1Rows, dashboardCutoff), dateFrom, dashboardCutoff);
  const sourceThroughLatest = summarize(build(rows, latestSourceDate), dateFrom, latestSourceDate);

  if (sourceThroughLatest.tiktokChannel !== 11) {
    throw new Error(`Esperados 11 Leads TikTok na fonte até 14/08; encontrados ${sourceThroughLatest.tiktokChannel}.`);
  }

  await new Promise<void>((resolve, reject) => {
    process.stdout.write(
      `${JSON.stringify({ dashboard, sourceThroughLatest }, null, 2)}\n`,
      error => (error ? reject(error) : resolve()),
    );
  });
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
