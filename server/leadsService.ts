import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { leadImports, leadMonthlyGoals, leads, type LeadMonthlyGoal } from "../drizzle/schema";
import { getDb } from "./db";
import {
  buildLeadAnalytics,
  endOfUtcMonth,
  startOfUtcMonth,
  type LeadAnalytics,
  type LeadAnalyticsRow,
} from "./leadsAnalytics";

const MAX_ANALYTICS_RANGE_DAYS = 370;

function assertDateRange(dateFrom: string, dateTo: string): void {
  const from = new Date(`${dateFrom}T00:00:00.000Z`);
  const to = new Date(`${dateTo}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(dateFrom) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateTo) ||
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime()) ||
    from.toISOString().slice(0, 10) !== dateFrom ||
    to.toISOString().slice(0, 10) !== dateTo
  ) {
    throw new Error("Informe datas válidas no formato AAAA-MM-DD.");
  }
  const days = Math.floor((to.getTime() - from.getTime()) / 86_400_000) + 1;
  if (days < 1) throw new Error("A data inicial precisa ser anterior ou igual à data final.");
  if (days > MAX_ANALYTICS_RANGE_DAYS) {
    throw new Error(`O intervalo máximo para análise é de ${MAX_ANALYTICS_RANGE_DAYS} dias.`);
  }
}

export async function getLeadDataBounds(): Promise<{
  dateFrom: string | null;
  dateTo: string | null;
  totalLeads: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [row] = await db
    .select({
      dateFrom: sql<string | null>`min(${leads.correctedDate})`,
      dateTo: sql<string | null>`max(${leads.correctedDate})`,
      totalLeads: sql<number>`count(*)`,
    })
    .from(leads);
  return {
    dateFrom: row?.dateFrom ?? null,
    dateTo: row?.dateTo ?? null,
    totalLeads: Number(row?.totalLeads ?? 0),
  };
}

export async function getLeadMonthlyGoal(competence: string): Promise<LeadMonthlyGoal | null> {
  if (!/^\d{4}-\d{2}$/.test(competence)) throw new Error("Competência mensal inválida.");
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [goal] = await db
    .select()
    .from(leadMonthlyGoals)
    .where(eq(leadMonthlyGoals.competencia, competence))
    .limit(1);
  return goal ?? null;
}

export async function upsertLeadMonthlyGoal(input: {
  competence: string;
  goalCount: number;
  actor: string;
}): Promise<LeadMonthlyGoal> {
  if (!/^\d{4}-\d{2}$/.test(input.competence)) throw new Error("Competência mensal inválida.");
  if (!Number.isInteger(input.goalCount) || input.goalCount < 1 || input.goalCount > 100_000_000) {
    throw new Error("A meta mensal precisa ser um inteiro entre 1 e 100.000.000.");
  }
  const actor = input.actor.trim();
  if (!actor) throw new Error("Usuário responsável pela alteração não identificado.");
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const now = Date.now();

  await db
    .insert(leadMonthlyGoals)
    .values({
      competencia: input.competence,
      goalCount: input.goalCount,
      createdBy: actor,
      updatedBy: actor,
      createdAt: now,
      updatedAt: now,
    })
    .onDuplicateKeyUpdate({
      set: {
        goalCount: input.goalCount,
        updatedBy: actor,
        updatedAt: now,
      },
    });

  const goal = await getLeadMonthlyGoal(input.competence);
  if (!goal) throw new Error("Não foi possível salvar a meta mensal de Leads.");
  return goal;
}

async function getLeadRows(dateFrom: string, dateTo: string): Promise<LeadAnalyticsRow[]> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db
    .select({
      correctedDate: leads.correctedDate,
      channel: leads.channel,
      model: leads.model,
      region: leads.region,
      dealerName: leads.dealerName,
    })
    .from(leads)
    .where(and(gte(leads.correctedDate, dateFrom), lte(leads.correctedDate, dateTo)))
    .orderBy(asc(leads.correctedDate), asc(leads.id));
}

async function getExpectedLeadChannels(): Promise<string[]> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .selectDistinct({ channel: leads.channel })
    .from(leads)
    .orderBy(asc(leads.channel));
  return rows.map(row => row.channel.trim()).filter(Boolean);
}

async function getLatestLeadImportAt(): Promise<string | null> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const [latestImport] = await db
    .select({ createdAt: leadImports.createdAt, completedAt: leadImports.completedAt })
    .from(leadImports)
    .orderBy(desc(leadImports.createdAt))
    .limit(1);
  const latestAt = latestImport?.completedAt ?? latestImport?.createdAt;
  return latestAt ? new Date(latestAt).toISOString() : null;
}

export async function getLeadAnalytics(input: {
  dateFrom: string;
  dateTo: string;
}): Promise<LeadAnalytics & { dateFrom: string; dateTo: string; metadata: { updatedAt: string | null } }> {
  assertDateRange(input.dateFrom, input.dateTo);
  const competence = input.dateTo.slice(0, 7);
  const monthStart = startOfUtcMonth(input.dateTo);
  const monthEnd = endOfUtcMonth(input.dateTo);
  const [rows, pacingRows, goal, updatedAt, expectedChannels] = await Promise.all([
    getLeadRows(input.dateFrom, input.dateTo),
    getLeadRows(monthStart, monthEnd),
    getLeadMonthlyGoal(competence),
    getLatestLeadImportAt(),
    getExpectedLeadChannels(),
  ]);

  return {
    dateFrom: input.dateFrom,
    dateTo: input.dateTo,
    metadata: { updatedAt },
    ...buildLeadAnalytics({
      rows,
      pacingRows,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      competence,
      goal: goal?.goalCount ?? null,
      expectedChannels,
    }),
  };
}
