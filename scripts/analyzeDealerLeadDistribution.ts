import { writeFile } from "node:fs/promises";
import { and, gte, lte } from "drizzle-orm";
import { leads } from "../drizzle/schema";
import { getDb } from "../server/db";
import {
  canonicalizeDealerName,
  getOfficialDealers,
  normalizeDealerLookupKey,
} from "../server/dealerNormalization";
import { getLeadDataBounds, isLeadChannelActiveOnDate } from "../server/leadsService";
import { resolveWeeklySalesCanonicalDealer } from "../server/weeklySalesCsv";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

type Counter = Record<string, number>;

type DealerDistribution = {
  dealerName: string;
  operationalArea: string;
  state: string;
  leads: number;
  channels: Counter;
  models: Counter;
  leadRegions: Counter;
  sameStateLeads: number;
  outsideStateLeads: number;
  sameStateChannels: Counter;
  outsideStateChannels: Counter;
  sameStateSharePercent: number;
  outsideStateSharePercent: number;
  weekly: null | {
    referenceWeek: number | null;
    leads: number;
    sales: number | null;
    conversionRatePercent: number | null;
    target: number | null;
    achievementPercent: number | null;
  };
};

type RegionalRouting = {
  sourceRegion: string;
  totalLeads: number;
  assignedToSameState: number;
  assignedToOtherState: number;
  assignedToUnknownDealer: number;
  assignedToBariguiCuritiba: number;
  byDestinationDealer: Counter;
  byChannel: Counter;
};

const ANALYSIS_ONLY_DEALER_ALIASES: Record<string, string> = {
  "BALTIC GUARULHOS GUARULHOS SP": "BALTIC GUARULHOS",
  "JAVEP BAURU SP": "JAVEP/SP",
  "SAVOL ZL SAO PAULO SP": "SAVOL ZL/SP",
  "AUTOMEC SOROCABA SOROCABA SP": "AUTOMEC SOROCABA",
  "SINAL AV EUROPA SAO PAULO SP": "SINAL AV EUROPA",
  "STEFANINI PIRACICABA SP": "STEFANINI PIRACICABA",
};

function increment(counter: Counter, key: string) {
  counter[key] = (counter[key] ?? 0) + 1;
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function stateFromOperationalArea(value: string) {
  return value.split("/").at(-1)?.trim().toLocaleUpperCase("pt-BR") ?? "";
}

function resolveAnalysisDealerKey(value: string) {
  const rawKey = normalizeDealerLookupKey(value);
  const explicitOfficial = ANALYSIS_ONLY_DEALER_ALIASES[rawKey];
  if (explicitOfficial) {
    return normalizeDealerLookupKey(
      resolveWeeklySalesCanonicalDealer(explicitOfficial).canonicalDealer,
    );
  }
  return normalizeDealerLookupKey(canonicalizeDealerName(value));
}

async function main() {
  const output = process.argv[2] ?? "/tmp/dealer-lead-distribution-august.json";
  const bounds = await getLeadDataBounds();
  const dateFrom = "2026-08-01";
  const dateTo = bounds.dateTo ?? "2026-08-10";
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  const rows = await db
    .select({
      correctedDate: leads.correctedDate,
      channel: leads.channel,
      model: leads.model,
      region: leads.region,
      dealerName: leads.dealerName,
    })
    .from(leads)
    .where(and(gte(leads.correctedDate, dateFrom), lte(leads.correctedDate, dateTo)));

  const official = getOfficialDealers();
  const officialByKey = new Map(
    official.map(dealer => [
      normalizeDealerLookupKey(resolveWeeklySalesCanonicalDealer(dealer.name).canonicalDealer),
      {
        state: stateFromOperationalArea(dealer.operationalArea),
        operationalArea: dealer.operationalArea,
        dealerName: resolveWeeklySalesCanonicalDealer(dealer.name).canonicalDealer,
      },
    ]),
  );
  const selected = official.filter(dealer => {
    const state = stateFromOperationalArea(dealer.operationalArea);
    return state === "SP" || dealer.name === "BARIGUI CURITIBA";
  });
  const distributions = new Map<string, DealerDistribution>();

  for (const dealer of selected) {
    const canonical = resolveWeeklySalesCanonicalDealer(dealer.name).canonicalDealer;
    const key = normalizeDealerLookupKey(canonical);
    distributions.set(key, {
      dealerName: canonical,
      operationalArea: dealer.operationalArea,
      state: stateFromOperationalArea(dealer.operationalArea),
      leads: 0,
      channels: {},
      models: {},
      leadRegions: {},
      sameStateLeads: 0,
      outsideStateLeads: 0,
      sameStateChannels: {},
      outsideStateChannels: {},
      sameStateSharePercent: 0,
      outsideStateSharePercent: 0,
      weekly: null,
    });
  }

  const regionalRouting = new Map<string, RegionalRouting>(
    ["SP", "PR"].map(sourceRegion => [
      sourceRegion,
      {
        sourceRegion,
        totalLeads: 0,
        assignedToSameState: 0,
        assignedToOtherState: 0,
        assignedToUnknownDealer: 0,
        assignedToBariguiCuritiba: 0,
        byDestinationDealer: {},
        byChannel: {},
      },
    ]),
  );

  for (const row of rows) {
    if (!isLeadChannelActiveOnDate(row.channel, row.correctedDate)) continue;
    const canonical = canonicalizeDealerName(row.dealerName);
    const canonicalKey = resolveAnalysisDealerKey(row.dealerName);
    const routing = regionalRouting.get(row.region);
    if (routing) {
      const destination = officialByKey.get(canonicalKey);
      routing.totalLeads += 1;
      increment(routing.byDestinationDealer, destination?.dealerName ?? canonical);
      increment(routing.byChannel, row.channel);
      if (!destination) routing.assignedToUnknownDealer += 1;
      else if (destination.state === routing.sourceRegion) routing.assignedToSameState += 1;
      else routing.assignedToOtherState += 1;
      if (
        canonicalKey ===
        normalizeDealerLookupKey(resolveWeeklySalesCanonicalDealer("BARIGUI CURITIBA").canonicalDealer)
      ) {
        routing.assignedToBariguiCuritiba += 1;
      }
    }
    const distribution = distributions.get(canonicalKey);
    if (!distribution) continue;
    distribution.leads += 1;
    increment(distribution.channels, row.channel);
    increment(distribution.models, row.model);
    increment(distribution.leadRegions, row.region);
    if (row.region === distribution.state) {
      distribution.sameStateLeads += 1;
      increment(distribution.sameStateChannels, row.channel);
    } else {
      distribution.outsideStateLeads += 1;
      increment(distribution.outsideStateChannels, row.channel);
    }
  }

  const weekly = await getWeeklySalesMetrics("2026-08", { dateFrom, dateTo });
  const weeklyByDealer = new Map(
    weekly.dealers.map(dealer => [normalizeDealerLookupKey(dealer.dealerName), dealer]),
  );
  for (const [key, distribution] of distributions.entries()) {
    distribution.sameStateSharePercent = distribution.leads
      ? round((distribution.sameStateLeads / distribution.leads) * 100)
      : 0;
    distribution.outsideStateSharePercent = distribution.leads
      ? round((distribution.outsideStateLeads / distribution.leads) * 100)
      : 0;
    const metric = weeklyByDealer.get(key);
    if (!metric) continue;
    const referenceWeek = weekly.referenceWeek;
    const week = referenceWeek ? metric.weeks[String(referenceWeek) as keyof typeof metric.weeks] : null;
    distribution.weekly = {
      referenceWeek,
      leads: metric.leads,
      sales: metric.sales,
      conversionRatePercent: metric.conversionRatePercent,
      target: week?.target ?? null,
      achievementPercent: week?.achievementPercent ?? null,
    };
  }

  const dealers = Array.from(distributions.values()).sort(
    (left, right) => right.leads - left.leads || left.dealerName.localeCompare(right.dealerName, "pt-BR"),
  );
  const spDealers = dealers.filter(dealer => dealer.state === "SP");
  const barigui = dealers.find(dealer => dealer.dealerName.includes("BARIGUI") && dealer.state === "PR") ?? null;
  const spTotals = spDealers.reduce(
    (totals, dealer) => {
      totals.leads += dealer.leads;
      totals.sameStateLeads += dealer.sameStateLeads;
      totals.outsideStateLeads += dealer.outsideStateLeads;
      totals.sales += dealer.weekly?.sales ?? 0;
      totals.target += dealer.weekly?.target ?? 0;
      for (const [channel, count] of Object.entries(dealer.channels)) {
        totals.channels[channel] = (totals.channels[channel] ?? 0) + count;
      }
      return totals;
    },
    { leads: 0, sameStateLeads: 0, outsideStateLeads: 0, sales: 0, target: 0, channels: {} as Counter },
  );

  const result = {
    generatedAt: new Date().toISOString(),
    period: { dateFrom, dateTo },
    sourceRowsInPeriod: rows.length,
    officialNetwork: {
      totalDealers: official.length,
      spDealers: spDealers.length,
    },
    barigui,
    spTotals: {
      ...spTotals,
      averageLeadsPerDealer: spDealers.length ? round(spTotals.leads / spDealers.length) : 0,
      medianLeadsPerDealer: (() => {
        const values = spDealers.map(dealer => dealer.leads).sort((a, b) => a - b);
        if (!values.length) return 0;
        const middle = Math.floor(values.length / 2);
        return values.length % 2 ? values[middle] : round((values[middle - 1] + values[middle]) / 2);
      })(),
      sameStateSharePercent: spTotals.leads ? round((spTotals.sameStateLeads / spTotals.leads) * 100) : 0,
      outsideStateSharePercent: spTotals.leads ? round((spTotals.outsideStateLeads / spTotals.leads) * 100) : 0,
    },
    regionalRouting: Object.fromEntries(
      Array.from(regionalRouting.entries()).map(([region, routing]) => [
        region,
        {
          ...routing,
          sameStateSharePercent: routing.totalLeads
            ? round((routing.assignedToSameState / routing.totalLeads) * 100)
            : 0,
          otherStateSharePercent: routing.totalLeads
            ? round((routing.assignedToOtherState / routing.totalLeads) * 100)
            : 0,
          unknownDealerSharePercent: routing.totalLeads
            ? round((routing.assignedToUnknownDealer / routing.totalLeads) * 100)
            : 0,
          bariguiCuritibaSharePercent: routing.totalLeads
            ? round((routing.assignedToBariguiCuritiba / routing.totalLeads) * 100)
            : 0,
        },
      ]),
    ),
    dealers,
    weeklySummary: weekly.summary,
    weeklyImport: weekly.import,
  };

  await writeFile(output, JSON.stringify(result, null, 2), "utf8");
  console.log(JSON.stringify({ output, period: result.period, dealers: dealers.length }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
