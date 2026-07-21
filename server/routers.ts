import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  authenticateDashboardCredentials,
  clearDashboardSession,
  type DashboardPermissions,
  readDashboardSession,
  setDashboardSession,
} from "./dashboardAuth";
import { loadDashboardData, MG_MOTORS_ACCOUNT_ID } from "./dashboardService";
import {
  completeOptimizationTask,
  getOptimizationWorkspace,
  OptimizationRecommendationInput,
  reopenOptimizationTask,
  rolloverOptimizationCycle,
  syncOptimizationFollowUps,
  syncRecommendationsToActiveCycle,
  upsertMonthlyBudgetGoal,
} from "./db";
import { buildOptimizationHistory } from "./optimizationHistory";
import { LeadCsvValidationError } from "./leadsCsv";
import {
  decodeLeadCsvBase64,
  getLeadImportHistory,
  importLeadCsv,
  previewLeadCsv,
} from "./leadsImportService";
import {
  getLeadAnalytics,
  getLeadDataBounds,
  getLeadMonthlyGoal,
  upsertLeadMonthlyGoal,
} from "./leadsService";
import { getMetaAdsBounds, loadMetaAdsData } from "./metaAdsService";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const dashboardProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await readDashboardSession(ctx.req);
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida ou expirada" });
  }
  return next({ ctx: { ...ctx, dashboardSession: session } });
});

function createPermissionProcedure(permission: keyof DashboardPermissions) {
  return dashboardProcedure.use(({ ctx, next }) => {
    if (!ctx.dashboardSession.permissions[permission]) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acesso não permitido para este usuário" });
    }
    return next({ ctx });
  });
}

const googleAdsProcedure = createPermissionProcedure("canAccessGoogleAds");
const metaAdsProcedure = createPermissionProcedure("canAccessMetaAds");
const leadsProcedure = createPermissionProcedure("canAccessLeads");
const optimizationsProcedure = createPermissionProcedure("canAccessOptimizations");
const historyProcedure = createPermissionProcedure("canAccessHistory");
const importLeadsProcedure = createPermissionProcedure("canImportLeads");

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida");
const dashboardPeriodSchema = z
  .object({ dateFrom: dateSchema, dateTo: dateSchema })
  .refine(input => input.dateFrom <= input.dateTo, "A data inicial deve anteceder a data final");

const leadCsvUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  base64: z.string().min(4).max(14_100_000, "O arquivo CSV excede o limite de 10 MB"),
  fallbackDate: dateSchema.optional(),
});

async function mapLeadCsvError<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof LeadCsvValidationError) {
      throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
    }
    throw error;
  }
}

function buildTaskSnapshot(
  data: Awaited<ReturnType<typeof loadDashboardData>>,
  campaignId: string,
): OptimizationRecommendationInput["snapshot"] | null {
  const campaign = data.campaigns.find(item => item.campaignId === campaignId);
  if (!campaign) return null;
  return {
    snapshotDate: data.daily.at(-1)?.date ?? data.period.dateTo,
    windowDateFrom: data.period.dateFrom,
    windowDateTo: data.period.dateTo,
    spend: campaign.spend,
    conversions: campaign.conversions,
    cpa: campaign.cpa,
    ctr: campaign.ctr,
    cpc: campaign.cpc,
    clicks: campaign.clicks,
    impressions: campaign.impressions,
    dailyBudget: campaign.budget || null,
    optimizationScore: campaign.optimizationScore,
    searchImpressionShare: campaign.searchImpressionShare,
  };
}

function mapRecommendationToTask(
  data: Awaited<ReturnType<typeof loadDashboardData>>,
  sourceSignature: string,
): OptimizationRecommendationInput {
  const recommendation = data.recommendations.find(item => item.sourceSignature === sourceSignature);
  if (!recommendation) throw new TRPCError({ code: "NOT_FOUND", message: "Recomendação não encontrada no período" });
  const snapshot = buildTaskSnapshot(data, recommendation.campaignId);
  if (!snapshot) throw new TRPCError({ code: "NOT_FOUND", message: "Campanha não encontrada no período" });
  return {
    sourceSignature: recommendation.sourceSignature,
    campaignId: recommendation.campaignId,
    campaignName: recommendation.campaign,
    region: recommendation.region,
    monthlyLeadGoal: recommendation.monthlyLeadGoal,
    actionType: recommendation.actionType,
    description: recommendation.description,
    rationale: recommendation.rationale,
    evidence: recommendation.evidence,
    steps: recommendation.steps,
    expectedImpact: recommendation.expectedImpact,
    risk: recommendation.risk,
    priority: recommendation.priority as OptimizationRecommendationInput["priority"],
    snapshot,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  dashboardAuth: router({
    session: publicProcedure.query(async ({ ctx }) => readDashboardSession(ctx.req)),
    login: publicProcedure
      .input(
        z.object({
          username: z.string().trim().min(1).max(64),
          password: z.string().min(1).max(200),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const identity = await authenticateDashboardCredentials(input.username, input.password);
        if (!identity) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos" });
        }
        await setDashboardSession(ctx.res, ctx.req, identity);
        return { success: true as const, ...identity };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearDashboardSession(ctx.res, ctx.req);
      return { success: true } as const;
    }),
  }),
  leads: router({
    bounds: leadsProcedure.query(() => getLeadDataBounds()),
    analytics: leadsProcedure
      .input(dashboardPeriodSchema)
      .query(({ input }) => getLeadAnalytics(input)),
    monthlyGoal: leadsProcedure
      .input(z.object({ competence: z.string().regex(/^\d{4}-\d{2}$/, "Competência inválida") }))
      .query(({ input }) => getLeadMonthlyGoal(input.competence)),
    updateMonthlyGoal: leadsProcedure
      .input(
        z.object({
          competence: z.string().regex(/^\d{4}-\d{2}$/, "Competência inválida"),
          goalCount: z.number().int().positive().max(100_000_000),
        }),
      )
      .mutation(({ ctx, input }) =>
        upsertLeadMonthlyGoal({ ...input, actor: ctx.dashboardSession.username }),
      ),
    importHistory: leadsProcedure
      .input(z.object({ limit: z.number().int().min(1).max(100).default(20) }).optional())
      .query(({ input }) => getLeadImportHistory(input?.limit ?? 20)),
    previewCsv: importLeadsProcedure.input(leadCsvUploadSchema).mutation(({ input }) =>
      mapLeadCsvError(() =>
        previewLeadCsv({
          fileName: input.fileName,
          bytes: decodeLeadCsvBase64(input.base64),
          fallbackDate: input.fallbackDate,
        }),
      ),
    ),
    importCsv: importLeadsProcedure.input(leadCsvUploadSchema).mutation(({ ctx, input }) =>
      mapLeadCsvError(() =>
        importLeadCsv({
          fileName: input.fileName,
          bytes: decodeLeadCsvBase64(input.base64),
          actor: ctx.dashboardSession.username,
          fallbackDate: input.fallbackDate,
        }),
      ),
    ),
  }),
  metaAds: router({
    bounds: metaAdsProcedure.query(() => getMetaAdsBounds()),
    data: metaAdsProcedure
      .input(dashboardPeriodSchema)
      .query(({ input }) => loadMetaAdsData(input.dateFrom, input.dateTo)),
  }),
  dashboard: router({
    getData: googleAdsProcedure
      .input(dashboardPeriodSchema)
      .query(({ input }) => loadDashboardData(input.dateFrom, input.dateTo)),
    updateMonthlyBudgetGoal: googleAdsProcedure
      .input(
        z.object({
          competencia: z.string().regex(/^\d{4}-\d{2}$/, "Competência inválida"),
          amount: z.number().finite().positive().max(100_000_000),
        }),
      )
      .mutation(({ ctx, input }) =>
        upsertMonthlyBudgetGoal({
          accountId: MG_MOTORS_ACCOUNT_ID,
          competencia: input.competencia,
          amount: input.amount,
          actor: ctx.dashboardSession.username,
        }),
      ),
    optimizationWorkspace: optimizationsProcedure.query(() => getOptimizationWorkspace()),
    optimizationHistory: historyProcedure.query(async () =>
      buildOptimizationHistory(await getOptimizationWorkspace()),
    ),
    captureOptimizationFollowUps: historyProcedure
      .input(dashboardPeriodSchema)
      .mutation(async ({ input }) => {
        const workspace = await getOptimizationWorkspace();
        const data = await loadDashboardData(input.dateFrom, input.dateTo);
        const eligibleTasks = workspace.tasks.filter(task => {
          if (task.status !== "COMPLETED" || !task.completedAt) return false;
          const completedDate = new Date(task.completedAt).toISOString().slice(0, 10);
          return input.dateFrom > completedDate;
        });
        const snapshots = eligibleTasks.flatMap(task => {
          const snapshot = buildTaskSnapshot(data, task.campaignId);
          return snapshot
            ? [{ ...snapshot, taskId: task.id, campaignId: task.campaignId, campaignName: task.campaignName }]
            : [];
        });
        const result = await syncOptimizationFollowUps({ snapshots });
        return {
          ...result,
          eligibleTaskCount: eligibleTasks.length,
          unavailableCampaignCount: eligibleTasks.length - snapshots.length,
        } as const;
      }),
    createOptimizationTask: optimizationsProcedure
      .input(dashboardPeriodSchema.and(z.object({ sourceSignature: z.string().min(3).max(255) })))
      .mutation(async ({ ctx, input }) => {
        const data = await loadDashboardData(input.dateFrom, input.dateTo);
        const recommendation = mapRecommendationToTask(data, input.sourceSignature);
        return syncRecommendationsToActiveCycle({
          recommendations: [recommendation],
          actor: ctx.dashboardSession.username,
        });
      }),
    createAllOptimizationTasks: optimizationsProcedure
      .input(dashboardPeriodSchema)
      .mutation(async ({ ctx, input }) => {
        const data = await loadDashboardData(input.dateFrom, input.dateTo);
        return syncRecommendationsToActiveCycle({
          recommendations: data.recommendations.map(recommendation =>
            mapRecommendationToTask(data, recommendation.sourceSignature),
          ),
          actor: ctx.dashboardSession.username,
        });
      }),
    completeOptimizationTask: optimizationsProcedure
      .input(
        dashboardPeriodSchema.and(
          z.object({
            taskId: z.number().int().positive(),
            notes: z.string().trim().max(4_000).optional().default(""),
          }),
        ),
      )
      .mutation(async ({ ctx, input }) => {
        const workspace = await getOptimizationWorkspace();
        const task = workspace.tasks.find(item => item.id === input.taskId);
        if (!task) throw new TRPCError({ code: "NOT_FOUND", message: "Tarefa não encontrada" });
        const data = await loadDashboardData(input.dateFrom, input.dateTo);
        const snapshot = buildTaskSnapshot(data, task.campaignId);
        return completeOptimizationTask({
          taskId: task.id,
          notes: input.notes,
          actor: ctx.dashboardSession.username,
          snapshot: snapshot ? { ...snapshot, campaignId: task.campaignId, campaignName: task.campaignName } : null,
        });
      }),
    rolloverOptimizationCycle: optimizationsProcedure
      .input(dashboardPeriodSchema)
      .mutation(async ({ ctx, input }) => {
        const data = await loadDashboardData(input.dateFrom, input.dateTo);
        const campaignSnapshots = data.campaigns.flatMap(campaign => {
          const snapshot = buildTaskSnapshot(data, campaign.campaignId);
          return snapshot
            ? [{ ...snapshot, campaignId: campaign.campaignId, campaignName: campaign.campaign }]
            : [];
        });
        return rolloverOptimizationCycle({
          actor: ctx.dashboardSession.username,
          recommendations: data.recommendations.map(recommendation =>
            mapRecommendationToTask(data, recommendation.sourceSignature),
          ),
          campaignSnapshots,
        });
      }),
    reopenOptimizationTask: optimizationsProcedure
      .input(dashboardPeriodSchema.and(z.object({ taskId: z.number().int().positive() })))
      .mutation(async ({ ctx, input }) => {
        const workspace = await getOptimizationWorkspace();
        const task = workspace.tasks.find(item => item.id === input.taskId);
        if (!task) throw new TRPCError({ code: "NOT_FOUND", message: "Tarefa não encontrada" });
        const data = await loadDashboardData(input.dateFrom, input.dateTo);
        const snapshot = buildTaskSnapshot(data, task.campaignId);
        return reopenOptimizationTask({
          taskId: task.id,
          actor: ctx.dashboardSession.username,
          snapshot: snapshot ? { ...snapshot, campaignId: task.campaignId, campaignName: task.campaignName } : null,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
