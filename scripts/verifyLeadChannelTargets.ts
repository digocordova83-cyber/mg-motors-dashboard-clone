import { getLeadAnalytics } from "../server/leadsService";

async function main() {
  const analytics = await getLeadAnalytics({
    dateFrom: "2026-08-01",
    dateTo: "2026-08-13",
  });

  const channelTotal = analytics.channels.reduce((sum, item) => sum + item.leads, 0);
  const dailyTotal = analytics.daily.reduce((sum, item) => sum + item.total, 0);
  if (channelTotal !== analytics.summary.totalLeads) {
    throw new Error(`Soma dos canais ${channelTotal} diverge do total ${analytics.summary.totalLeads}.`);
  }
  if (dailyTotal !== analytics.summary.totalLeads) {
    throw new Error(`Soma dos dias ${dailyTotal} diverge do total ${analytics.summary.totalLeads}.`);
  }

  const expected = {
    Site: { target: 6633, targetActual: 1677 },
    Meta: { target: 3734, targetActual: 2387 },
    Webmotors: { target: 579, targetActual: 324 },
    "Mercado Livre": { target: 442, targetActual: 175 },
    TikTok: { target: 620, targetActual: 5 },
  } as const;
  for (const [channel, values] of Object.entries(expected)) {
    const item = analytics.channels.find(candidate => candidate.value === channel);
    if (!item) throw new Error(`Canal ${channel} não encontrado.`);
    if (item.target !== values.target || item.targetActual !== values.targetActual) {
      throw new Error(
        `${channel}: esperado ${values.targetActual}/${values.target}; recebido ${item.targetActual}/${item.target}.`,
      );
    }
  }
  const urban = analytics.channels.find(item => item.value === "Campanha Urban");
  if (!urban || urban.target !== null || urban.targetActual !== null) {
    throw new Error("Campanha Urban recebeu meta direta indevida.");
  }
  if (
    analytics.channelTargetSummary?.totalLeadTarget !== 11996 ||
    analytics.channelTargetSummary.totalChannelTarget !== 12008 ||
    analytics.channelTargetSummary.channelDifference !== 12
  ) {
    throw new Error("Resumo de metas por canal diverge da planilha oficial.");
  }

  const output = {
    period: { dateFrom: analytics.dateFrom, dateTo: analytics.dateTo },
    reconciliation: {
      totalLeads: analytics.summary.totalLeads,
      channelTotal,
      dailyTotal,
    },
    channelTargetSummary: analytics.channelTargetSummary,
    channels: analytics.channels.map(item => ({
      channel: item.value,
      periodLeads: item.leads,
      monthlyVehicleActual: item.targetActual,
      target: item.target,
      achievementPercent: item.achievementPercent,
      remainingToTarget: item.remainingToTarget,
      targetLabel: item.targetLabel,
    })),
  };
  await new Promise<void>((resolve, reject) => {
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`, error =>
      error ? reject(error) : resolve(),
    );
  });
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
