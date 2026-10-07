import { loadDashboardData } from "../server/dashboardService";
import { getDb } from "../server/db";
import { getLeadAnalytics } from "../server/leadsService";
import { loadMetaAdsData } from "../server/metaAdsService";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";
import { MEDIA_PLANS } from "../client/src/data/mediaPlans";
import { writeFile } from "node:fs/promises";

async function main() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  // Dados consolidados do trimestre para a apresentação
  // Julho: 1 a 31
  // Agosto: 1 a 31
  // Setembro: 1 a 30

  // 1. Leads Analytics Totais do trimestre
  const leadsQ3 = await getLeadAnalytics({ dateFrom: "2026-07-01", dateTo: "2026-09-30" });
  const leadsJuly = await getLeadAnalytics({ dateFrom: "2026-07-01", dateTo: "2026-07-31" });
  const leadsAugust = await getLeadAnalytics({ dateFrom: "2026-08-01", dateTo: "2026-08-31" });
  const leadsSeptember = await getLeadAnalytics({ dateFrom: "2026-09-01", dateTo: "2026-09-30" });

  // 2. Planos de Mídia (Investimentos)
  const planJuly = MEDIA_PLANS.find(p => p.month === "2026-07");
  const planAugust = MEDIA_PLANS.find(p => p.month === "2026-08");
  const planSeptember = MEDIA_PLANS.find(p => p.month === "2026-09");

  const invJuly = planJuly?.total.netInvestment || 0;
  const invAugust = planAugust?.total.netInvestment || 0;
  const invSeptember = planSeptember?.total.netInvestment || 0;
  const totalInvestment = invJuly + invAugust + invSeptember;

  // 3. Retail (Vendas MTD)
  // Utilizamos a foto final de cada mês
  const retailJuly = await getWeeklySalesMetrics("2026-07", { dateFrom: "2026-07-01", dateTo: "2026-07-31" });
  const retailAugust = await getWeeklySalesMetrics("2026-08", { dateFrom: "2026-08-01", dateTo: "2026-08-31" });
  const retailSeptember = await getWeeklySalesMetrics("2026-09", { dateFrom: "2026-09-01", dateTo: "2026-09-30" });
  
  // Total Q3 Vendas (se houver snapshot, se não usa-se 0)
  const salesJuly = retailJuly.summary.totalSales || 0;
  const salesAugust = retailAugust.summary.totalSales || 0;
  const salesSeptember = retailSeptember.summary.totalSales || 0;
  const totalSales = salesJuly + salesAugust + salesSeptember;

  const result = {
    period: { q3: "Jul 1 - Sep 30, 2026" },
    investment: {
      total: totalInvestment,
      months: [
        { month: "Julho", value: invJuly },
        { month: "Agosto", value: invAugust },
        { month: "Setembro", value: invSeptember }
      ]
    },
    leads: {
      total: leadsQ3.summary.totalLeads,
      months: [
        { month: "Julho", value: leadsJuly.summary.totalLeads },
        { month: "Agosto", value: leadsAugust.summary.totalLeads },
        { month: "Setembro", value: leadsSeptember.summary.totalLeads }
      ]
    },
    retail: {
      total: totalSales,
      months: [
        { month: "Julho", value: salesJuly },
        { month: "Agosto", value: salesAugust },
        { month: "Setembro", value: salesSeptember }
      ]
    }
  };

  await writeFile("/home/ubuntu/q3-summary-data.json", JSON.stringify(result, null, 2), "utf8");
  console.log("Arquivo salvo com sucesso!");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
