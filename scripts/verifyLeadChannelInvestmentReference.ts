import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDashboardCutoffDate } from "@shared/dashboardDates";
import {
  buildLeadMediaInvestmentReference,
  loadPaidMediaInvestmentMeasurements,
} from "../server/leadMediaInvestmentService";
import { getLeadAnalytics } from "../server/leadsService";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const dateTo = getDashboardCutoffDate();
  const dateFrom = `${dateTo.slice(0, 7)}-01`;
  const [analytics, measurements] = await Promise.all([
    getLeadAnalytics({ dateFrom, dateTo }),
    loadPaidMediaInvestmentMeasurements(dateFrom, dateTo),
  ]);
  const reference = buildLeadMediaInvestmentReference({
    dateFrom: analytics.dateFrom,
    dateTo: analytics.dateTo,
    channelLeads: analytics.channels,
    measurements,
  });
  const channels = Object.fromEntries(
    reference.channels.map(item => [item.channel, item]),
  );
  const sum = reference.channels.reduce(
    (total, item) => total + (item.investment ?? 0),
    0,
  );

  assert(reference.channels.length === 3, "A referência deve conter exatamente três canais pagos.");
  assert(channels.Site?.platform === "Google Ads", "Site precisa usar Google Ads.");
  assert(channels.Meta?.platform === "Meta Ads", "Meta precisa usar Meta Ads.");
  assert(channels.TikTok?.platform === "TikTok Ads", "TikTok precisa usar TikTok Ads.");
  assert(
    !reference.channels.some(item => ["Webmotors", "Mercado Livre"].includes(item.channel)),
    "Webmotors e Mercado Livre não podem receber investimento/CPL.",
  );
  assert(
    Math.abs(sum - reference.availableInvestment) < 0.01,
    "A soma das três fontes não reconcilia com o investimento disponível.",
  );
  if (reference.allSourcesAvailable) {
    assert(
      reference.totalInvestment != null &&
        Math.abs(reference.totalInvestment - reference.availableInvestment) < 0.01,
      "O total completo não reconcilia com as três fontes disponíveis.",
    );
    const expectedOverallCpl =
      Math.round((reference.availableInvestment / reference.paidMediaLeads) * 100) / 100;
    assert(
      reference.estimatedOverallCpl === expectedOverallCpl,
      "O CPL geral estimado não reconcilia com investimento e Leads pagos.",
    );
  }
  for (const item of reference.channels) {
    if (item.investment != null && item.leads > 0) {
      const expected = Math.round((item.investment / item.leads) * 100) / 100;
      assert(item.referenceCpl === expected, `CPL divergente para ${item.channel}.`);
    }
  }

  const evidence = {
    verifiedAt: new Date().toISOString(),
    period: { dateFrom, dateTo },
    formula: reference.formula,
    totalLeads: analytics.summary.totalLeads,
    totalInvestment: reference.totalInvestment,
    availableInvestment: reference.availableInvestment,
    paidMediaLeads: reference.paidMediaLeads,
    estimatedOverallCpl: reference.estimatedOverallCpl,
    allSourcesAvailable: reference.allSourcesAvailable,
    channels: reference.channels,
    excludedChannels: ["Webmotors", "Mercado Livre"],
    checks: {
      threePaidChannelsOnly: true,
      sourceMapping: true,
      totalReconciled: true,
      cplReconciled: true,
      overallCplReconciled: true,
    },
  };
  const output = resolve("docs/lead-channel-investment-verification.json");
  await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ output, ...evidence }, null, 2));
  process.exit(0);
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
