import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  campaignGoals,
  InsertUser,
  optimizationCycles,
  optimizationTasks,
  performanceSnapshots,
  taskCompletions,
  taskEvents,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getCampaignGoals(accountId: string, competencia: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  return db
    .select()
    .from(campaignGoals)
    .where(
      and(
        eq(campaignGoals.accountId, accountId),
        eq(campaignGoals.competencia, competencia),
        eq(campaignGoals.isActive, true),
      ),
    )
    .orderBy(asc(campaignGoals.goalType), asc(campaignGoals.scopeKey));
}

export async function upsertMonthlyBudgetGoal(input: {
  accountId: string;
  competencia: string;
  amount: number;
  actor: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const now = Date.now();
  const amount = input.amount.toFixed(2);

  await db
    .insert(campaignGoals)
    .values({
      accountId: input.accountId,
      competencia: input.competencia,
      goalType: "MEDIA_BUDGET",
      scopeKey: "ACCOUNT",
      monthlyBudgetGoal: amount,
      isActive: true,
      createdBy: input.actor,
      updatedBy: input.actor,
      createdAt: now,
      updatedAt: now,
    })
    .onDuplicateKeyUpdate({
      set: {
        monthlyBudgetGoal: amount,
        isActive: true,
        updatedBy: input.actor,
        updatedAt: now,
      },
    });

  const rows = await getCampaignGoals(input.accountId, input.competencia);
  return rows.find(goal => goal.goalType === "MEDIA_BUDGET" && goal.scopeKey === "ACCOUNT");
}

export type OptimizationRecommendationInput = {
  sourceSignature: string;
  campaignId: string;
  campaignName: string;
  region: string | null;
  monthlyLeadGoal: number | null;
  actionType: string;
  description: string;
  rationale: string;
  evidence: Record<string, number | string | boolean | null>;
  steps: string[];
  expectedImpact: string;
  risk: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  snapshot: {
    snapshotDate: string;
    windowDateFrom: string;
    windowDateTo: string;
    spend: number;
    conversions: number;
    cpa: number;
    ctr: number;
    cpc: number;
    clicks: number;
    impressions: number;
    dailyBudget: number | null;
    optimizationScore: number | null;
    searchImpressionShare: number | null;
  };
};

export type TaskPerformanceSnapshotInput = OptimizationRecommendationInput["snapshot"] & {
  campaignId: string;
  campaignName: string;
};

export async function getOptimizationWorkspace() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  const cycles = await db.select().from(optimizationCycles).orderBy(desc(optimizationCycles.cycleNumber));
  const tasks = await db
    .select()
    .from(optimizationTasks)
    .orderBy(desc(optimizationTasks.createdAt), asc(optimizationTasks.priority));
  const taskIds = tasks.map(task => task.id);
  const events = taskIds.length
    ? await db.select().from(taskEvents).where(inArray(taskEvents.taskId, taskIds)).orderBy(desc(taskEvents.createdAt))
    : [];
  const completions = taskIds.length
    ? await db
        .select()
        .from(taskCompletions)
        .where(inArray(taskCompletions.taskId, taskIds))
        .orderBy(desc(taskCompletions.completedAt))
    : [];
  const snapshots = taskIds.length
    ? await db
        .select()
        .from(performanceSnapshots)
        .where(inArray(performanceSnapshots.taskId, taskIds))
        .orderBy(desc(performanceSnapshots.createdAt))
    : [];

  return {
    activeCycle: cycles.find(cycle => cycle.status === "ACTIVE") ?? null,
    cycles,
    tasks,
    events,
    completions,
    snapshots,
  };
}

export async function syncRecommendationsToActiveCycle(input: {
  recommendations: OptimizationRecommendationInput[];
  actor: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);

  return db.transaction(async tx => {
    let [activeCycle] = await tx
      .select()
      .from(optimizationCycles)
      .where(eq(optimizationCycles.status, "ACTIVE"))
      .orderBy(desc(optimizationCycles.cycleNumber))
      .limit(1);

    if (!activeCycle) {
      const [latestCycle] = await tx
        .select({ cycleNumber: optimizationCycles.cycleNumber })
        .from(optimizationCycles)
        .orderBy(desc(optimizationCycles.cycleNumber))
        .limit(1);
      const cycleNumber = (latestCycle?.cycleNumber ?? 0) + 1;
      await tx.insert(optimizationCycles).values({
        cycleNumber,
        name: `Ciclo ${cycleNumber}`,
        startDate: today,
        status: "ACTIVE",
        createdBy: input.actor,
        createdAt: now,
        updatedAt: now,
      });
      [activeCycle] = await tx
        .select()
        .from(optimizationCycles)
        .where(eq(optimizationCycles.cycleNumber, cycleNumber))
        .limit(1);
    }

    if (!activeCycle) throw new Error("Não foi possível criar o ciclo ativo");

    const existing = await tx
      .select({ sourceSignature: optimizationTasks.sourceSignature })
      .from(optimizationTasks)
      .where(eq(optimizationTasks.cycleId, activeCycle.id));
    const existingSignatures = new Set(existing.map(item => item.sourceSignature));
    const missing = input.recommendations.filter(item => !existingSignatures.has(item.sourceSignature));

    if (missing.length) {
      await tx.insert(optimizationTasks).values(
        missing.map(item => ({
          cycleId: activeCycle.id,
          campaignId: item.campaignId,
          campaignName: item.campaignName,
          region: item.region,
          monthlyLeadGoal: item.monthlyLeadGoal,
          actionType: item.actionType,
          description: item.description,
          rationale: item.rationale,
          evidence: item.evidence,
          steps: item.steps,
          expectedImpact: item.expectedImpact,
          risk: item.risk,
          priority: item.priority,
          status: "PENDING" as const,
          sourceSignature: item.sourceSignature,
          createdBy: input.actor,
          createdAt: now,
          updatedAt: now,
        })),
      );

      const createdTasks = await tx
        .select()
        .from(optimizationTasks)
        .where(
          and(
            eq(optimizationTasks.cycleId, activeCycle.id),
            inArray(
              optimizationTasks.sourceSignature,
              missing.map(item => item.sourceSignature),
            ),
          ),
        );
      const recommendationBySignature = new Map(missing.map(item => [item.sourceSignature, item]));

      await tx.insert(taskEvents).values(
        createdTasks.map(task => ({
          taskId: task.id,
          cycleId: activeCycle.id,
          eventType: "CREATED" as const,
          actor: input.actor,
          notes: "Tarefa criada a partir de recomendação baseada nos dados reais do período selecionado.",
          metadata: { sourceSignature: task.sourceSignature },
          createdAt: now,
        })),
      );

      await tx.insert(performanceSnapshots).values(
        createdTasks.map(task => {
          const recommendation = recommendationBySignature.get(task.sourceSignature)!;
          const snapshot = recommendation.snapshot;
          return {
            cycleId: activeCycle.id,
            taskId: task.id,
            campaignId: task.campaignId,
            campaignName: task.campaignName,
            snapshotType: "TASK_CREATED" as const,
            snapshotDate: snapshot.snapshotDate,
            windowDateFrom: snapshot.windowDateFrom,
            windowDateTo: snapshot.windowDateTo,
            spend: snapshot.spend.toFixed(4),
            conversions: snapshot.conversions.toFixed(4),
            cpa: snapshot.cpa.toFixed(4),
            ctr: snapshot.ctr.toFixed(6),
            cpc: snapshot.cpc.toFixed(4),
            clicks: snapshot.clicks.toFixed(2),
            impressions: snapshot.impressions.toFixed(2),
            dailyBudget: snapshot.dailyBudget == null ? null : snapshot.dailyBudget.toFixed(4),
            optimizationScore:
              snapshot.optimizationScore == null ? null : snapshot.optimizationScore.toFixed(6),
            searchImpressionShare:
              snapshot.searchImpressionShare == null ? null : snapshot.searchImpressionShare.toFixed(6),
            createdAt: now,
          };
        }),
      );
    }

    return { activeCycle, createdCount: missing.length, skippedCount: input.recommendations.length - missing.length };
  });
}

async function getTaskForUpdate(
  tx: Parameters<Parameters<NonNullable<Awaited<ReturnType<typeof getDb>>>["transaction"]>[0]>[0],
  taskId: number,
) {
  const [task] = await tx.select().from(optimizationTasks).where(eq(optimizationTasks.id, taskId)).limit(1);
  if (!task) throw new Error("Tarefa não encontrada");
  return task;
}

export async function assignOptimizationTask(input: { taskId: number; assignee: string; actor: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const now = Date.now();
  return db.transaction(async tx => {
    const task = await getTaskForUpdate(tx, input.taskId);
    if (task.status === "COMPLETED") throw new Error("Tarefa concluída não pode ser reatribuída");
    await tx
      .update(optimizationTasks)
      .set({ assignee: input.assignee, updatedAt: now })
      .where(eq(optimizationTasks.id, task.id));
    await tx.insert(taskEvents).values({
      taskId: task.id,
      cycleId: task.cycleId,
      eventType: "ASSIGNED",
      actor: input.actor,
      notes: `Responsável definido como ${input.assignee}.`,
      metadata: { assignee: input.assignee },
      createdAt: now,
    });
    return { success: true } as const;
  });
}

export async function startOptimizationTask(input: { taskId: number; actor: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const now = Date.now();
  return db.transaction(async tx => {
    const task = await getTaskForUpdate(tx, input.taskId);
    if (task.status === "COMPLETED") throw new Error("Tarefa concluída não pode ser iniciada");
    if (!task.assignee?.trim()) throw new Error("Defina um responsável antes de iniciar a tarefa");
    if (task.status === "IN_PROGRESS") return { success: true } as const;
    await tx
      .update(optimizationTasks)
      .set({ status: "IN_PROGRESS", startedAt: task.startedAt ?? now, updatedAt: now })
      .where(eq(optimizationTasks.id, task.id));
    await tx.insert(taskEvents).values({
      taskId: task.id,
      cycleId: task.cycleId,
      eventType: "STARTED",
      actor: input.actor,
      notes: "Execução iniciada.",
      createdAt: now,
    });
    return { success: true } as const;
  });
}

export async function completeOptimizationTask(input: {
  taskId: number;
  notes: string;
  actor: string;
  snapshot: TaskPerformanceSnapshotInput | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const notes = input.notes.trim();
  if (notes.length < 3) throw new Error("Informe uma observação de conclusão com ao menos 3 caracteres");
  const now = Date.now();
  return db.transaction(async tx => {
    const task = await getTaskForUpdate(tx, input.taskId);
    if (task.status === "COMPLETED") throw new Error("Tarefa já concluída");
    if (!task.assignee?.trim()) throw new Error("Defina um responsável antes de concluir a tarefa");
    if (task.status !== "IN_PROGRESS") throw new Error("Inicie a tarefa antes de concluí-la");
    await tx
      .update(optimizationTasks)
      .set({ status: "COMPLETED", completedAt: now, updatedAt: now })
      .where(eq(optimizationTasks.id, task.id));
    await tx.insert(taskCompletions).values({
      taskId: task.id,
      completedBy: input.actor,
      completedAt: now,
      notes,
    });
    await tx.insert(taskEvents).values({
      taskId: task.id,
      cycleId: task.cycleId,
      eventType: "COMPLETED",
      actor: input.actor,
      notes,
      createdAt: now,
    });
    if (input.snapshot) {
      const snapshot = input.snapshot;
      await tx.insert(performanceSnapshots).values({
        cycleId: task.cycleId,
        taskId: task.id,
        campaignId: task.campaignId,
        campaignName: task.campaignName,
        snapshotType: "TASK_COMPLETED",
        snapshotDate: snapshot.snapshotDate,
        windowDateFrom: snapshot.windowDateFrom,
        windowDateTo: snapshot.windowDateTo,
        spend: snapshot.spend.toFixed(4),
        conversions: snapshot.conversions.toFixed(4),
        cpa: snapshot.cpa.toFixed(4),
        ctr: snapshot.ctr.toFixed(6),
        cpc: snapshot.cpc.toFixed(4),
        clicks: snapshot.clicks.toFixed(2),
        impressions: snapshot.impressions.toFixed(2),
        dailyBudget: snapshot.dailyBudget == null ? null : snapshot.dailyBudget.toFixed(4),
        optimizationScore: snapshot.optimizationScore == null ? null : snapshot.optimizationScore.toFixed(6),
        searchImpressionShare:
          snapshot.searchImpressionShare == null ? null : snapshot.searchImpressionShare.toFixed(6),
        createdAt: now,
      });
    }
    return { success: true } as const;
  });
}


type OptimizationTransaction = Parameters<
  Parameters<NonNullable<Awaited<ReturnType<typeof getDb>>>["transaction"]>[0]
>[0];

function snapshotInsertValues(input: {
  cycleId: number;
  taskId: number;
  snapshotType: "CYCLE_START" | "TASK_CREATED" | "TASK_COMPLETED" | "FOLLOW_UP";
  snapshot: TaskPerformanceSnapshotInput;
  createdAt: number;
}) {
  return {
    cycleId: input.cycleId,
    taskId: input.taskId,
    campaignId: input.snapshot.campaignId,
    campaignName: input.snapshot.campaignName,
    snapshotType: input.snapshotType,
    snapshotDate: input.snapshot.snapshotDate,
    windowDateFrom: input.snapshot.windowDateFrom,
    windowDateTo: input.snapshot.windowDateTo,
    spend: input.snapshot.spend.toFixed(4),
    conversions: input.snapshot.conversions.toFixed(4),
    cpa: input.snapshot.cpa.toFixed(4),
    ctr: input.snapshot.ctr.toFixed(6),
    cpc: input.snapshot.cpc.toFixed(4),
    clicks: input.snapshot.clicks.toFixed(2),
    impressions: input.snapshot.impressions.toFixed(2),
    dailyBudget: input.snapshot.dailyBudget == null ? null : input.snapshot.dailyBudget.toFixed(4),
    optimizationScore:
      input.snapshot.optimizationScore == null ? null : input.snapshot.optimizationScore.toFixed(6),
    searchImpressionShare:
      input.snapshot.searchImpressionShare == null
        ? null
        : input.snapshot.searchImpressionShare.toFixed(6),
    createdAt: input.createdAt,
  };
}

export type RolloverOptimizationCycleInput = {
  actor: string;
  recommendations: OptimizationRecommendationInput[];
  campaignSnapshots: TaskPerformanceSnapshotInput[];
  now?: number;
};

export async function rolloverOptimizationCycleInTransaction(
  tx: OptimizationTransaction,
  input: RolloverOptimizationCycleInput,
) {
  const now = input.now ?? Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  const [activeCycle] = await tx
    .select()
    .from(optimizationCycles)
    .where(eq(optimizationCycles.status, "ACTIVE"))
    .orderBy(desc(optimizationCycles.cycleNumber))
    .limit(1);
  if (!activeCycle) throw new Error("Não há ciclo ativo para encerrar");

  const [latestCycle] = await tx
    .select({ cycleNumber: optimizationCycles.cycleNumber })
    .from(optimizationCycles)
    .orderBy(desc(optimizationCycles.cycleNumber))
    .limit(1);
  const nextCycleNumber = (latestCycle?.cycleNumber ?? activeCycle.cycleNumber) + 1;

  await tx
    .update(optimizationCycles)
    .set({ status: "CLOSED", endDate: today, closedBy: input.actor, closedAt: now, updatedAt: now })
    .where(eq(optimizationCycles.id, activeCycle.id));
  await tx.insert(optimizationCycles).values({
    cycleNumber: nextCycleNumber,
    name: `Ciclo ${nextCycleNumber}`,
    startDate: today,
    status: "ACTIVE",
    carriedFromCycleId: activeCycle.id,
    createdBy: input.actor,
    createdAt: now,
    updatedAt: now,
  });

  const [newCycle] = await tx
    .select()
    .from(optimizationCycles)
    .where(eq(optimizationCycles.cycleNumber, nextCycleNumber))
    .limit(1);
  if (!newCycle) throw new Error("Não foi possível criar o novo ciclo");

  const pendingTasks = await tx
    .select()
    .from(optimizationTasks)
    .where(
      and(
        eq(optimizationTasks.cycleId, activeCycle.id),
        inArray(optimizationTasks.status, ["PENDING", "IN_PROGRESS", "REOPENED"]),
      ),
    );
  const uniquePendingBySignature = new Map(pendingTasks.map(task => [task.sourceSignature, task]));
  const pendingToTransfer = Array.from(uniquePendingBySignature.values());

  if (pendingToTransfer.length) {
    await tx.insert(optimizationTasks).values(
      pendingToTransfer.map(task => ({
        cycleId: newCycle.id,
        campaignId: task.campaignId,
        campaignName: task.campaignName,
        region: task.region,
        monthlyLeadGoal: task.monthlyLeadGoal,
        actionType: task.actionType,
        description: task.description,
        rationale: task.rationale,
        evidence: task.evidence,
        steps: task.steps,
        expectedImpact: task.expectedImpact,
        risk: task.risk,
        priority: task.priority,
        status: "PENDING" as const,
        sourceSignature: task.sourceSignature,
        sourceTaskId: task.id,
        createdBy: task.createdBy,
        assignee: task.assignee,
        createdAt: now,
        updatedAt: now,
      })),
    );
  }

  const transferredTasks = pendingToTransfer.length
    ? await tx
        .select()
        .from(optimizationTasks)
        .where(
          and(
            eq(optimizationTasks.cycleId, newCycle.id),
            inArray(
              optimizationTasks.sourceSignature,
              pendingToTransfer.map(task => task.sourceSignature),
            ),
          ),
        )
    : [];
  const transferredBySignature = new Map(transferredTasks.map(task => [task.sourceSignature, task]));

  if (pendingToTransfer.length) {
    await tx.insert(taskEvents).values(
      pendingToTransfer.flatMap(sourceTask => {
        const targetTask = transferredBySignature.get(sourceTask.sourceSignature);
        if (!targetTask) return [];
        return [
          {
            taskId: sourceTask.id,
            cycleId: activeCycle.id,
            eventType: "TRANSFERRED_OUT" as const,
            actor: input.actor,
            notes: `Pendência transferida para ${newCycle.name}.`,
            metadata: {
              fromCycleId: activeCycle.id,
              toCycleId: newCycle.id,
              targetTaskId: targetTask.id,
            } as Record<string, number | string | boolean | null>,
            createdAt: now,
          },
          {
            taskId: targetTask.id,
            cycleId: newCycle.id,
            eventType: "TRANSFERRED_IN" as const,
            actor: input.actor,
            notes: `Pendência herdada de ${activeCycle.name}.`,
            metadata: {
              fromCycleId: activeCycle.id,
              toCycleId: newCycle.id,
              sourceTaskId: sourceTask.id,
            } as Record<string, number | string | boolean | null>,
            createdAt: now,
          },
        ];
      }),
    );
  }

  const snapshotByCampaign = new Map(input.campaignSnapshots.map(snapshot => [snapshot.campaignId, snapshot]));
  const transferredSnapshotValues = transferredTasks.flatMap(task => {
    const snapshot = snapshotByCampaign.get(task.campaignId);
    return snapshot
      ? [snapshotInsertValues({ cycleId: newCycle.id, taskId: task.id, snapshotType: "CYCLE_START", snapshot, createdAt: now })]
      : [];
  });
  if (transferredSnapshotValues.length) await tx.insert(performanceSnapshots).values(transferredSnapshotValues);

  const signaturesInNewCycle = new Set(transferredTasks.map(task => task.sourceSignature));
  const uniqueRecommendations = new Map(input.recommendations.map(item => [item.sourceSignature, item]));
  const recommendationsToCreate = Array.from(uniqueRecommendations.values()).filter(
    item => !signaturesInNewCycle.has(item.sourceSignature),
  );

  if (recommendationsToCreate.length) {
    await tx.insert(optimizationTasks).values(
      recommendationsToCreate.map(item => ({
        cycleId: newCycle.id,
        campaignId: item.campaignId,
        campaignName: item.campaignName,
        region: item.region,
        monthlyLeadGoal: item.monthlyLeadGoal,
        actionType: item.actionType,
        description: item.description,
        rationale: item.rationale,
        evidence: item.evidence,
        steps: item.steps,
        expectedImpact: item.expectedImpact,
        risk: item.risk,
        priority: item.priority,
        status: "PENDING" as const,
        sourceSignature: item.sourceSignature,
        createdBy: input.actor,
        createdAt: now,
        updatedAt: now,
      })),
    );

    const createdRecommendationTasks = await tx
      .select()
      .from(optimizationTasks)
      .where(
        and(
          eq(optimizationTasks.cycleId, newCycle.id),
          inArray(
            optimizationTasks.sourceSignature,
            recommendationsToCreate.map(item => item.sourceSignature),
          ),
        ),
      );
    const recommendationBySignature = new Map(
      recommendationsToCreate.map(item => [item.sourceSignature, item]),
    );
    await tx.insert(taskEvents).values(
      createdRecommendationTasks.map(task => ({
        taskId: task.id,
        cycleId: newCycle.id,
        eventType: "CREATED" as const,
        actor: input.actor,
        notes: "Nova tarefa sugerida pelos dados reais no início do ciclo.",
        metadata: { sourceSignature: task.sourceSignature },
        createdAt: now,
      })),
    );
    await tx.insert(performanceSnapshots).values(
      createdRecommendationTasks.map(task => {
        const recommendation = recommendationBySignature.get(task.sourceSignature)!;
        return snapshotInsertValues({
          cycleId: newCycle.id,
          taskId: task.id,
          snapshotType: "TASK_CREATED",
          snapshot: { ...recommendation.snapshot, campaignId: task.campaignId, campaignName: task.campaignName },
          createdAt: now,
        });
      }),
    );
  }

  return {
    previousCycle: activeCycle,
    newCycle,
    transferredCount: transferredTasks.length,
    recommendationCreatedCount: recommendationsToCreate.length,
    recommendationSkippedCount: input.recommendations.length - recommendationsToCreate.length,
  };
}

export async function rolloverOptimizationCycle(input: RolloverOptimizationCycleInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.transaction(tx => rolloverOptimizationCycleInTransaction(tx, input));
}

export type ReopenOptimizationTaskInput = {
  taskId: number;
  actor: string;
  snapshot: TaskPerformanceSnapshotInput | null;
  now?: number;
};

export async function reopenOptimizationTaskInTransaction(
  tx: OptimizationTransaction,
  input: ReopenOptimizationTaskInput,
) {
  const now = input.now ?? Date.now();
  const sourceTask = await getTaskForUpdate(tx, input.taskId);
  if (sourceTask.status !== "COMPLETED") throw new Error("Somente tarefas concluídas podem ser reabertas");

  const [activeCycle] = await tx
    .select()
    .from(optimizationCycles)
    .where(eq(optimizationCycles.status, "ACTIVE"))
    .orderBy(desc(optimizationCycles.cycleNumber))
    .limit(1);
  if (!activeCycle) throw new Error("Não há ciclo ativo para receber a tarefa reaberta");

  const activeTasks = await tx
    .select()
    .from(optimizationTasks)
    .where(eq(optimizationTasks.cycleId, activeCycle.id));
  const equivalentOpenTask = activeTasks.find(
    task =>
      task.campaignId === sourceTask.campaignId &&
      task.actionType === sourceTask.actionType &&
      task.status !== "COMPLETED",
  );
  if (equivalentOpenTask) return { created: false, task: equivalentOpenTask, activeCycle };

  const sourceSignature = `${sourceTask.sourceSignature}:reopen:${sourceTask.id}`;
  await tx.insert(optimizationTasks).values({
    cycleId: activeCycle.id,
    campaignId: sourceTask.campaignId,
    campaignName: sourceTask.campaignName,
    region: sourceTask.region,
    monthlyLeadGoal: sourceTask.monthlyLeadGoal,
    actionType: sourceTask.actionType,
    description: sourceTask.description,
    rationale: sourceTask.rationale,
    evidence: sourceTask.evidence,
    steps: sourceTask.steps,
    expectedImpact: sourceTask.expectedImpact,
    risk: sourceTask.risk,
    priority: sourceTask.priority,
    status: "REOPENED",
    sourceSignature,
    sourceTaskId: sourceTask.id,
    createdBy: input.actor,
    assignee: sourceTask.assignee,
    createdAt: now,
    updatedAt: now,
  });
  const [reopenedTask] = await tx
    .select()
    .from(optimizationTasks)
    .where(and(eq(optimizationTasks.cycleId, activeCycle.id), eq(optimizationTasks.sourceSignature, sourceSignature)))
    .limit(1);
  if (!reopenedTask) throw new Error("Não foi possível reabrir a tarefa");

  await tx.insert(taskEvents).values([
    {
      taskId: sourceTask.id,
      cycleId: sourceTask.cycleId,
      eventType: "REOPENED",
      actor: input.actor,
      notes: `Tarefa reaberta como #${reopenedTask.id} em ${activeCycle.name}.`,
      metadata: { sourceTaskId: sourceTask.id, reopenedTaskId: reopenedTask.id, toCycleId: activeCycle.id },
      createdAt: now,
    },
    {
      taskId: reopenedTask.id,
      cycleId: activeCycle.id,
      eventType: "REOPENED",
      actor: input.actor,
      notes: `Reaberta a partir da tarefa #${sourceTask.id}.`,
      metadata: { sourceTaskId: sourceTask.id, fromCycleId: sourceTask.cycleId },
      createdAt: now,
    },
  ]);
  if (input.snapshot) {
    await tx.insert(performanceSnapshots).values(
      snapshotInsertValues({
        cycleId: activeCycle.id,
        taskId: reopenedTask.id,
        snapshotType: "CYCLE_START",
        snapshot: input.snapshot,
        createdAt: now,
      }),
    );
  }

  return { created: true, task: reopenedTask, activeCycle };
}

export async function reopenOptimizationTask(input: ReopenOptimizationTaskInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.transaction(tx => reopenOptimizationTaskInTransaction(tx, input));
}

export type OptimizationFollowUpInput = TaskPerformanceSnapshotInput & {
  taskId: number;
};

export async function syncOptimizationFollowUpsInTransaction(
  tx: OptimizationTransaction,
  input: { snapshots: OptimizationFollowUpInput[]; now?: number },
) {
  const uniqueByIdentity = new Map(
    input.snapshots.map(snapshot => [
      `${snapshot.taskId}:${snapshot.windowDateFrom}:${snapshot.windowDateTo}`,
      snapshot,
    ]),
  );
  const uniqueSnapshots = Array.from(uniqueByIdentity.values());
  if (!uniqueSnapshots.length) return { createdCount: 0, skippedCount: 0 } as const;

  const taskIds = uniqueSnapshots.map(snapshot => snapshot.taskId);
  const completedTasks = await tx
    .select()
    .from(optimizationTasks)
    .where(
      and(
        inArray(optimizationTasks.id, taskIds),
        eq(optimizationTasks.status, "COMPLETED"),
      ),
    );
  const completedById = new Map(completedTasks.map(task => [task.id, task]));
  const existingFollowUps = await tx
    .select()
    .from(performanceSnapshots)
    .where(
      and(
        inArray(performanceSnapshots.taskId, taskIds),
        eq(performanceSnapshots.snapshotType, "FOLLOW_UP"),
      ),
    );
  const existingIdentities = new Set(
    existingFollowUps.map(snapshot =>
      `${snapshot.taskId}:${snapshot.windowDateFrom}:${snapshot.windowDateTo}`,
    ),
  );

  const snapshotsToCreate = uniqueSnapshots.filter(snapshot => {
    const identity = `${snapshot.taskId}:${snapshot.windowDateFrom}:${snapshot.windowDateTo}`;
    return completedById.has(snapshot.taskId) && !existingIdentities.has(identity);
  });

  if (snapshotsToCreate.length) {
    await tx.insert(performanceSnapshots).values(
      snapshotsToCreate.map(snapshot => {
        const task = completedById.get(snapshot.taskId)!;
        return snapshotInsertValues({
          cycleId: task.cycleId,
          taskId: task.id,
          snapshotType: "FOLLOW_UP",
          snapshot: {
            ...snapshot,
            campaignId: task.campaignId,
            campaignName: task.campaignName,
          },
          createdAt: input.now ?? Date.now(),
        });
      }),
    );
  }

  return {
    createdCount: snapshotsToCreate.length,
    skippedCount: uniqueSnapshots.length - snapshotsToCreate.length,
  } as const;
}

export async function syncOptimizationFollowUps(input: { snapshots: OptimizationFollowUpInput[] }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.transaction(tx => syncOptimizationFollowUpsInTransaction(tx, input));
}
