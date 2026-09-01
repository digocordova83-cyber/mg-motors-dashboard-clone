import fs from "node:fs/promises";
import path from "node:path";

import { and, asc, gte, lte } from "drizzle-orm";

import { leads } from "../drizzle/schema";
import { getDb } from "../server/db";
import {
  canonicalizeDealerForAnalytics,
  normalizeDealerLookupKey,
} from "../server/dealerNormalization";
import { getDealerTargetsForCompetence } from "../server/dealerTargetsService";
import { loadPaidMediaInvestmentMeasurements } from "../server/leadMediaInvestmentService";
import { resolveLeadReportingChannel } from "../server/leadsAnalytics";

const DATE_FROM = process.argv[2] ?? "2026-08-01";
const DATE_TO = process.argv[3] ?? "2026-08-17";
const COMPETENCE = DATE_TO.slice(0, 7);
const OUTPUT_DIR = path.resolve(process.argv[4] ?? "/home/ubuntu/cpl-analysis");
const PAID_CHANNELS = ["Site", "Meta", "TikTok"] as const;

type PaidChannel = (typeof PAID_CHANNELS)[number];

type DealerLeadCounts = Record<PaidChannel, number> & {
  totalPaid: number;
};

type DealerResult = {
  dealer: string;
  state: string;
  leadsSite: number;
  leadsMeta: number;
  leadsTikTok: number;
  paidLeads: number;
  googleInvestment: number;
  metaInvestment: number;
  tiktokInvestment: number;
  totalInvestment: number;
  googleCpl: number | null;
  metaCpl: number | null;
  tiktokCpl: number | null;
  estimatedCpl: number | null;
};

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function divide(numerator: number, denominator: number): number | null {
  return denominator > 0 ? round(numerator / denominator) : null;
}

function csvCell(value: string | number | null): string {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv<T extends Record<string, string | number | null>>(
  rows: T[],
  columns: Array<{ key: keyof T; label: string }>,
): string {
  const header = columns.map(column => csvCell(column.label)).join(",");
  const body = rows.map(row => columns.map(column => csvCell(row[column.key])).join(","));
  return [header, ...body].join("\n") + "\n";
}

function brl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function number(value: number): string {
  return value.toLocaleString("pt-BR");
}

function cpl(value: number | null): string {
  return value == null ? "—" : brl(value);
}

async function main() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE_FROM) || !/^\d{4}-\d{2}-\d{2}$/.test(DATE_TO)) {
    throw new Error("Datas inválidas. Use AAAA-MM-DD.");
  }

  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  const [leadRows, targets, measurements] = await Promise.all([
    db
      .select({
        correctedDate: leads.correctedDate,
        channel: leads.channel,
        sourceChannel: leads.sourceChannel,
        dealerName: leads.dealerName,
      })
      .from(leads)
      .where(and(gte(leads.correctedDate, DATE_FROM), lte(leads.correctedDate, DATE_TO)))
      .orderBy(asc(leads.correctedDate), asc(leads.id)),
    getDealerTargetsForCompetence(COMPETENCE),
    loadPaidMediaInvestmentMeasurements(DATE_FROM, DATE_TO),
  ]);

  if (!targets.length) throw new Error(`Sem metas de dealer para ${COMPETENCE}.`);

  const investments = {
    Site: measurements.Site.investment ?? 0,
    Meta: measurements.Meta.investment ?? 0,
    TikTok: measurements.TikTok.investment ?? 0,
  } satisfies Record<PaidChannel, number>;
  const totalInvestment = round(Object.values(investments).reduce((sum, value) => sum + value, 0));

  const leadsByDealerKey = new Map<string, DealerLeadCounts>();
  const dealerNameByKey = new Map<string, string>();
  let unavailableDealerPaidLeads = 0;

  for (const row of leadRows) {
    const channel = resolveLeadReportingChannel(row);
    if (!PAID_CHANNELS.includes(channel as PaidChannel)) continue;
    const canonicalDealer = canonicalizeDealerForAnalytics(row.dealerName);
    const dealerKey = normalizeDealerLookupKey(canonicalDealer);
    if (!dealerKey || canonicalDealer === "Indisponível") {
      unavailableDealerPaidLeads += 1;
      continue;
    }
    const counts = leadsByDealerKey.get(dealerKey) ?? {
      Site: 0,
      Meta: 0,
      TikTok: 0,
      totalPaid: 0,
    };
    counts[channel as PaidChannel] += 1;
    counts.totalPaid += 1;
    leadsByDealerKey.set(dealerKey, counts);
    dealerNameByKey.set(dealerKey, canonicalDealer);
  }

  const targetTotals = targets.reduce(
    (acc, target) => {
      acc.Site += Number(target.channelTargets.google ?? 0);
      acc.Meta += Number(target.channelTargets.meta ?? 0);
      acc.TikTok += Number(target.channelTargets.tiktok ?? 0);
      return acc;
    },
    { Site: 0, Meta: 0, TikTok: 0 } satisfies Record<PaidChannel, number>,
  );

  const targetKeys = new Set(targets.map(target => target.canonicalDealerKey));
  const unmatchedLeadDealers = Array.from(leadsByDealerKey.entries())
    .filter(([key]) => !targetKeys.has(key))
    .map(([key, counts]) => ({
      dealer: dealerNameByKey.get(key) ?? key,
      dealerKey: key,
      paidLeads: counts.totalPaid,
      channels: { Site: counts.Site, Meta: counts.Meta, TikTok: counts.TikTok },
    }))
    .sort((left, right) => right.paidLeads - left.paidLeads || left.dealer.localeCompare(right.dealer, "pt-BR"));

  const dealerResults: DealerResult[] = targets
    .map(target => {
      const counts = leadsByDealerKey.get(target.canonicalDealerKey) ?? {
        Site: 0,
        Meta: 0,
        TikTok: 0,
        totalPaid: 0,
      };
      const googleInvestment = targetTotals.Site
        ? round(investments.Site * (Number(target.channelTargets.google ?? 0) / targetTotals.Site))
        : 0;
      const metaInvestment = targetTotals.Meta
        ? round(investments.Meta * (Number(target.channelTargets.meta ?? 0) / targetTotals.Meta))
        : 0;
      const tiktokInvestment = targetTotals.TikTok
        ? round(investments.TikTok * (Number(target.channelTargets.tiktok ?? 0) / targetTotals.TikTok))
        : 0;
      const allocatedInvestment = round(googleInvestment + metaInvestment + tiktokInvestment);
      return {
        dealer: target.canonicalDealer,
        state: target.stateCode,
        leadsSite: counts.Site,
        leadsMeta: counts.Meta,
        leadsTikTok: counts.TikTok,
        paidLeads: counts.totalPaid,
        googleInvestment,
        metaInvestment,
        tiktokInvestment,
        totalInvestment: allocatedInvestment,
        googleCpl: divide(googleInvestment, counts.Site),
        metaCpl: divide(metaInvestment, counts.Meta),
        tiktokCpl: divide(tiktokInvestment, counts.TikTok),
        estimatedCpl: divide(allocatedInvestment, counts.totalPaid),
      };
    })
    .sort((left, right) => right.paidLeads - left.paidLeads || left.dealer.localeCompare(right.dealer, "pt-BR"));

  const stateMap = new Map<string, Omit<DealerResult, "dealer" | "state"> & { state: string; dealers: number }>();
  for (const dealer of dealerResults) {
    const current = stateMap.get(dealer.state) ?? {
      state: dealer.state,
      dealers: 0,
      leadsSite: 0,
      leadsMeta: 0,
      leadsTikTok: 0,
      paidLeads: 0,
      googleInvestment: 0,
      metaInvestment: 0,
      tiktokInvestment: 0,
      totalInvestment: 0,
      googleCpl: null,
      metaCpl: null,
      tiktokCpl: null,
      estimatedCpl: null,
    };
    current.dealers += 1;
    current.leadsSite += dealer.leadsSite;
    current.leadsMeta += dealer.leadsMeta;
    current.leadsTikTok += dealer.leadsTikTok;
    current.paidLeads += dealer.paidLeads;
    current.googleInvestment += dealer.googleInvestment;
    current.metaInvestment += dealer.metaInvestment;
    current.tiktokInvestment += dealer.tiktokInvestment;
    current.totalInvestment += dealer.totalInvestment;
    stateMap.set(dealer.state, current);
  }

  const stateResults = Array.from(stateMap.values())
    .map(state => ({
      ...state,
      googleInvestment: round(state.googleInvestment),
      metaInvestment: round(state.metaInvestment),
      tiktokInvestment: round(state.tiktokInvestment),
      totalInvestment: round(state.totalInvestment),
      googleCpl: divide(state.googleInvestment, state.leadsSite),
      metaCpl: divide(state.metaInvestment, state.leadsMeta),
      tiktokCpl: divide(state.tiktokInvestment, state.leadsTikTok),
      estimatedCpl: divide(state.totalInvestment, state.paidLeads),
    }))
    .sort((left, right) => right.paidLeads - left.paidLeads || left.state.localeCompare(right.state));

  const dealerPaidLeads = dealerResults.reduce((sum, dealer) => sum + dealer.paidLeads, 0);
  const unmatchedPaidLeads = unmatchedLeadDealers.reduce((sum, dealer) => sum + dealer.paidLeads, 0);
  const totalPaidLeads = dealerPaidLeads + unmatchedPaidLeads + unavailableDealerPaidLeads;
  const allocatedTotal = round(dealerResults.reduce((sum, dealer) => sum + dealer.totalInvestment, 0));
  const overallLeadCpl = divide(totalInvestment, totalPaidLeads);
  const allocatedDealerCpl = divide(allocatedTotal, dealerPaidLeads);

  const suffix = `${DATE_FROM}_a_${DATE_TO}`;
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const dealerCsvRows = dealerResults.map(row => ({
    Estado: row.state,
    Dealer: row.dealer,
    Leads_Site: row.leadsSite,
    Leads_Meta: row.leadsMeta,
    Leads_TikTok: row.leadsTikTok,
    Leads_Pagos_Total: row.paidLeads,
    Investimento_Google_Alocado: row.googleInvestment,
    Investimento_Meta_Alocado: row.metaInvestment,
    Investimento_TikTok_Alocado: row.tiktokInvestment,
    Investimento_Total_Alocado: row.totalInvestment,
    CPL_Google_Estimado: row.googleCpl,
    CPL_Meta_Estimado: row.metaCpl,
    CPL_TikTok_Estimado: row.tiktokCpl,
    CPL_Total_Estimado: row.estimatedCpl,
  }));
  const stateCsvRows = stateResults.map(row => ({
    Estado: row.state,
    Dealers: row.dealers,
    Leads_Site: row.leadsSite,
    Leads_Meta: row.leadsMeta,
    Leads_TikTok: row.leadsTikTok,
    Leads_Pagos_Total: row.paidLeads,
    Investimento_Google_Alocado: row.googleInvestment,
    Investimento_Meta_Alocado: row.metaInvestment,
    Investimento_TikTok_Alocado: row.tiktokInvestment,
    Investimento_Total_Alocado: row.totalInvestment,
    CPL_Google_Estimado: row.googleCpl,
    CPL_Meta_Estimado: row.metaCpl,
    CPL_TikTok_Estimado: row.tiktokCpl,
    CPL_Total_Estimado: row.estimatedCpl,
  }));

  const dealerColumns = Object.keys(dealerCsvRows[0] ?? {}).map(key => ({
    key: key as keyof (typeof dealerCsvRows)[number],
    label: key,
  }));
  const stateColumns = Object.keys(stateCsvRows[0] ?? {}).map(key => ({
    key: key as keyof (typeof stateCsvRows)[number],
    label: key,
  }));

  const dealerCsvPath = path.join(OUTPUT_DIR, `cpl_por_dealer_${suffix}.csv`);
  const stateCsvPath = path.join(OUTPUT_DIR, `cpl_por_estado_${suffix}.csv`);
  const auditPath = path.join(OUTPUT_DIR, `auditoria_cpl_${suffix}.json`);
  const reportPath = path.join(OUTPUT_DIR, `relatorio_cpl_estado_dealer_${suffix}.md`);

  await fs.writeFile(dealerCsvPath, toCsv(dealerCsvRows, dealerColumns), "utf8");
  await fs.writeFile(stateCsvPath, toCsv(stateCsvRows, stateColumns), "utf8");

  const audit = {
    period: { dateFrom: DATE_FROM, dateTo: DATE_TO, competence: COMPETENCE },
    methodology: {
      investment: "Gasto real de Google, Meta e TikTok no período.",
      allocation: "Gasto de cada plataforma alocado por dealer proporcionalmente à meta de Leads do respectivo canal na competência.",
      denominator: "Leads do dashboard atribuídos ao dealer nos canais Site, Meta e TikTok.",
      stateDefinition: "UF operacional do dealer na base oficial de metas.",
      caveat: "CPL estimado; as plataformas não fornecem vínculo direto e uniforme entre gasto real e dealer.",
    },
    sources: measurements,
    investments,
    totals: {
      totalInvestment,
      allocatedTotal,
      totalPaidLeads,
      dealerPaidLeads,
      unmatchedPaidLeads,
      unavailableDealerPaidLeads,
      overallLeadCpl,
      allocatedDealerCpl,
      dealerCoveragePercent: totalPaidLeads ? round((dealerPaidLeads / totalPaidLeads) * 100) : 0,
    },
    targetTotals,
    unmatchedLeadDealers,
    dealers: dealerResults,
    states: stateResults,
  };
  await fs.writeFile(auditPath, JSON.stringify(audit, null, 2) + "\n", "utf8");

  const stateTable = stateResults
    .map(row => `| ${row.state} | ${row.dealers} | ${number(row.paidLeads)} | ${brl(row.totalInvestment)} | ${cpl(row.estimatedCpl)} |`)
    .join("\n");
  const dealerTable = dealerResults
    .map(row => `| ${row.state} | ${row.dealer} | ${number(row.paidLeads)} | ${brl(row.totalInvestment)} | ${cpl(row.estimatedCpl)} |`)
    .join("\n");

  const markdown = `# CPL estimado por estado e dealer\n\n` +
    `**Período:** ${DATE_FROM} a ${DATE_TO}  \n` +
    `**Investimento real considerado:** ${brl(totalInvestment)}  \n` +
    `**Leads pagos no dashboard:** ${number(totalPaidLeads)}  \n` +
    `**CPL geral de referência:** ${cpl(overallLeadCpl)}\n\n` +
    `> O CPL abaixo é **estimado**, não observado diretamente por dealer. O gasto real de cada plataforma foi distribuído conforme a participação de cada dealer na meta do canal correspondente. O denominador usa somente Leads de Site, Meta e TikTok atribuídos no dashboard.\n\n` +
    `## CPL por estado\n\n| Estado | Dealers | Leads pagos | Investimento alocado | CPL estimado |\n|---|---:|---:|---:|---:|\n${stateTable}\n\n` +
    `## CPL por dealer\n\n| Estado | Dealer | Leads pagos | Investimento alocado | CPL estimado |\n|---|---|---:|---:|---:|\n${dealerTable}\n\n` +
    `## Auditoria e limitações\n\n` +
    `O investimento alocado soma ${brl(allocatedTotal)}. A cobertura de Leads atribuídos aos 30 dealers da base de metas é de ${audit.totals.dealerCoveragePercent.toLocaleString("pt-BR")}% (${number(dealerPaidLeads)} de ${number(totalPaidLeads)} Leads pagos). ` +
    `${number(unmatchedPaidLeads)} Leads estão em dealers canônicos sem linha na base de metas e ${number(unavailableDealerPaidLeads)} não possuem dealer utilizável. Esses Leads não recebem rateio de investimento por dealer.\n\n` +
    `A UF apresentada é a **UF operacional do dealer**. Ela não representa necessariamente o estado declarado pelo Lead.\n`;
  await fs.writeFile(reportPath, markdown, "utf8");

  console.log(JSON.stringify({
    reportPath,
    dealerCsvPath,
    stateCsvPath,
    auditPath,
    totalInvestment,
    totalPaidLeads,
    overallLeadCpl,
    dealerCoveragePercent: audit.totals.dealerCoveragePercent,
    unmatchedLeadDealers: unmatchedLeadDealers.length,
  }, null, 2));
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
