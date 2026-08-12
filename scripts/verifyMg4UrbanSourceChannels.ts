import { getLeadAnalytics } from "../server/leadsService";

async function main() {
  const analytics = await getLeadAnalytics({
    dateFrom: "2026-08-01",
    dateTo: "2026-08-11",
  });
  const items = analytics.mg4UrbanSourceChannels;
  const total = items.reduce((sum, item) => sum + item.leads, 0);
  const modelTotal = analytics.models.find(item => item.value === "MG4 URBAN")?.leads ?? 0;

  if (total !== modelTotal) {
    throw new Error(`Origem MG4 URBAN não reconciliada: ${total} de ${modelTotal}.`);
  }
  if (!items.length || items.some(item => !item.value.trim())) {
    throw new Error("A distribuição MG4 URBAN contém origem vazia ou indisponível.");
  }

  console.log(JSON.stringify({
    period: { dateFrom: analytics.dateFrom, dateTo: analytics.dateTo },
    total,
    modelTotal,
    items,
  }, null, 2));
  process.exit(0);
}

main()
  .catch(error => {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exit(1);
  });
