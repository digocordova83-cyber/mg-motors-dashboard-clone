import { getLeadAnalytics } from "../server/leadsService";

async function main() {
  const july = await getLeadAnalytics({ dateFrom: "2026-07-01", dateTo: "2026-07-31" });
  const august = await getLeadAnalytics({ dateFrom: "2026-08-01", dateTo: "2026-08-09" });
  const julyUol = july.channels.find(item => item.value === "UOL")?.leads ?? 0;
  const augustUol = august.channels.find(item => item.value === "UOL")?.leads ?? 0;
  const augustDailyHasUol = august.daily.some(point => Object.hasOwn(point.values, "UOL"));

  const result = {
    july: {
      totalLeads: july.summary.totalLeads,
      uolLeads: julyUol,
      channels: july.channels.map(item => item.value),
    },
    august: {
      totalLeads: august.summary.totalLeads,
      uolLeads: augustUol,
      channels: august.channels.map(item => item.value),
      dailyHasUol: augustDailyHasUol,
      updatingChannels: august.channelUpdate.updatingChannels,
    },
  };

  console.log(JSON.stringify(result, null, 2));
  if (julyUol < 1) throw new Error("UOL não foi preservado em julho.");
  if (augustUol !== 0 || augustDailyHasUol || august.channelUpdate.updatingChannels.includes("UOL")) {
    throw new Error("UOL ainda aparece no recorte de agosto.");
  }
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
