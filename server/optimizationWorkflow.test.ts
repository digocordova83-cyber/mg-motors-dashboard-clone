import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { and, eq, inArray } from "drizzle-orm";
import {
  assignOptimizationTask,
  completeOptimizationTask,
  getDb,
  getOptimizationWorkspace,
  reopenOptimizationTaskInTransaction,
  rolloverOptimizationCycleInTransaction,
  startOptimizationTask,
  syncOptimizationFollowUpsInTransaction,
  syncRecommendationsToActiveCycle,
} from "./db";
import { optimizationCycles, optimizationTasks, performanceSnapshots, taskEvents } from "../drizzle/schema";

const signature = `vitest-optimization-${Date.now()}`;
const actor = "vitest-operador";
let taskId: number | null = null;
let testCreatedCycleId: number | null = null;

describe.sequential("workflow integrado de otimização", () => {
  beforeAll(async () => {
    const workspace = await getOptimizationWorkspace();
    if (!workspace.activeCycle) testCreatedCycleId = -1;
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;
    await db.delete(optimizationTasks).where(eq(optimizationTasks.sourceSignature, signature));
    if (testCreatedCycleId && testCreatedCycleId > 0) {
      await db.delete(optimizationCycles).where(eq(optimizationCycles.id, testCreatedCycleId));
    }
  });

  it(
    "deduplica a recomendação e preserva criador, responsável, concluidor e timestamps",
    async () => {
      const recommendation = {
        sourceSignature: signature,
        campaignId: "vitest-campaign-id",
        campaignName: "Campanha de validação automatizada",
        region: "Não classificada",
        monthlyLeadGoal: null,
        actionType: "REVIEW_BIDDING" as const,
        description: "Validar o workflow transacional sem executar alteração em mídia.",
        rationale: "Teste integrado do contrato persistente.",
        evidence: { spend: 100, conversions: 5, cpa: 20 },
        steps: ["Validar o registro transacional."],
        expectedImpact: "Confirmar integridade do workflow.",
        risk: "Nenhuma alteração é enviada ao Google Ads.",
        priority: "LOW" as const,
        snapshot: {
          snapshotDate: "2026-07-19",
          windowDateFrom: "2026-07-13",
          windowDateTo: "2026-07-19",
          spend: 100,
          conversions: 5,
          cpa: 20,
          ctr: 8,
          cpc: 1.25,
          clicks: 80,
          impressions: 1_000,
          dailyBudget: 50,
          optimizationScore: 0.8,
          searchImpressionShare: 0.6,
        },
      };

      const first = await syncRecommendationsToActiveCycle({ recommendations: [recommendation], actor });
      if (testCreatedCycleId === -1) testCreatedCycleId = first.activeCycle.id;
      expect(first.createdCount).toBe(1);
      expect(first.skippedCount).toBe(0);

      const second = await syncRecommendationsToActiveCycle({ recommendations: [recommendation], actor });
      expect(second.createdCount).toBe(0);
      expect(second.skippedCount).toBe(1);

      let workspace = await getOptimizationWorkspace();
      const matching = workspace.tasks.filter(task => task.sourceSignature === signature);
      expect(matching).toHaveLength(1);
      taskId = matching[0].id;
      expect(matching[0].createdBy).toBe(actor);
      expect(matching[0].createdAt).toBeGreaterThan(0);

      await expect(startOptimizationTask({ taskId, actor })).rejects.toThrow(
        "Defina um responsável antes de iniciar a tarefa",
      );
      await assignOptimizationTask({ taskId, assignee: "Responsável Vitest", actor });
      await expect(
        completeOptimizationTask({
          taskId,
          actor,
          notes: "Conclusão antecipada que deve ser bloqueada.",
          snapshot: null,
        }),
      ).rejects.toThrow("Inicie a tarefa antes de concluí-la");
      await startOptimizationTask({ taskId, actor });
      await expect(
        completeOptimizationTask({
          taskId,
          actor,
          notes: "  ",
          snapshot: null,
        }),
      ).rejects.toThrow("Informe uma observação de conclusão com ao menos 3 caracteres");
      await completeOptimizationTask({
        taskId,
        actor,
        notes: "Conclusão automatizada para validar o histórico transacional.",
        snapshot: {
          campaignId: recommendation.campaignId,
          campaignName: recommendation.campaignName,
          ...recommendation.snapshot,
        },
      });

      workspace = await getOptimizationWorkspace();
      const completed = workspace.tasks.find(task => task.id === taskId);
      const completion = workspace.completions.find(item => item.taskId === taskId);
      expect(completed).toMatchObject({
        createdBy: actor,
        assignee: "Responsável Vitest",
        status: "COMPLETED",
      });
      expect(completed?.startedAt).toBeGreaterThan(0);
      expect(completed?.completedAt).toBeGreaterThan(0);
      expect(completion).toMatchObject({ completedBy: actor });
      expect(completion?.notes).toContain("histórico transacional");
      const taskSnapshots = workspace.snapshots.filter(snapshot => snapshot.taskId === taskId);
      expect(taskSnapshots.map(snapshot => snapshot.snapshotType)).toEqual(
        expect.arrayContaining(["TASK_CREATED", "TASK_COMPLETED"]),
      );
    },
    30_000,
  );

  it(
    "persiste o acompanhamento posterior uma única vez e usa a identidade canônica da tarefa",
    async () => {
      const db = await getDb();
      if (!db) throw new Error("Banco de dados indisponível para o teste integrado");
      const rollbackMarker = `rollback-follow-up-${Date.now()}`;
      let assertionsCompleted = false;

      try {
        await db.transaction(async tx => {
          const [activeCycle] = await tx
            .select()
            .from(optimizationCycles)
            .where(eq(optimizationCycles.status, "ACTIVE"))
            .limit(1);
          if (!activeCycle) throw new Error("Ciclo ativo necessário para o teste");

          const now = Date.now();
          const followUpSignature = `${signature}-follow-up`;
          await tx.insert(optimizationTasks).values({
            cycleId: activeCycle.id,
            campaignId: "vitest-follow-up-campaign",
            campaignName: "Campanha de acompanhamento Vitest",
            region: "Não classificada",
            monthlyLeadGoal: null,
            actionType: "REVIEW_BIDDING",
            description: "Validar snapshot posterior.",
            rationale: "Cobertura integrada do acompanhamento pós-otimização.",
            evidence: { spend: 100, conversions: 5, cpa: 20 },
            steps: ["Validar persistência única."],
            expectedImpact: "Confirmar histórico posterior.",
            risk: "Sem alteração em mídia.",
            priority: "LOW",
            sourceSignature: followUpSignature,
            status: "COMPLETED",
            createdBy: actor,
            createdAt: now - 10_000,
            completedAt: now - 5_000,
            updatedAt: now - 5_000,
          });
          const [task] = await tx
            .select()
            .from(optimizationTasks)
            .where(eq(optimizationTasks.sourceSignature, followUpSignature))
            .limit(1);

          const followUp = {
            taskId: task.id,
            campaignId: "identidade-externa-deve-ser-substituida",
            campaignName: "Nome externo deve ser substituído",
            snapshotDate: "2026-07-23",
            windowDateFrom: "2026-07-21",
            windowDateTo: "2026-07-23",
            spend: 240,
            conversions: 12,
            cpa: 20,
            ctr: 9,
            cpc: 1.1,
            clicks: 218,
            impressions: 2_422,
            dailyBudget: 80,
            optimizationScore: 0.85,
            searchImpressionShare: 0.65,
          };
          const first = await syncOptimizationFollowUpsInTransaction(tx, {
            snapshots: [followUp],
            now,
          });
          const second = await syncOptimizationFollowUpsInTransaction(tx, {
            snapshots: [followUp],
            now: now + 1_000,
          });
          expect(first).toEqual({ createdCount: 1, skippedCount: 0 });
          expect(second).toEqual({ createdCount: 0, skippedCount: 1 });

          const persisted = await tx
            .select()
            .from(performanceSnapshots)
            .where(
              and(
                eq(performanceSnapshots.taskId, task.id),
                eq(performanceSnapshots.snapshotType, "FOLLOW_UP"),
              ),
            );
          expect(persisted).toHaveLength(1);
          expect(persisted[0]).toMatchObject({
            cycleId: activeCycle.id,
            taskId: task.id,
            campaignId: task.campaignId,
            campaignName: task.campaignName,
            windowDateFrom: "2026-07-21",
            windowDateTo: "2026-07-23",
            createdAt: now,
          });
          assertionsCompleted = true;
          throw new Error(rollbackMarker);
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(rollbackMarker);
      }

      expect(assertionsCompleted).toBe(true);
    },
    30_000,
  );

  it(
    "fecha o ciclo, transfere pendências uma única vez, preserva concluídas e reabre com vínculo",
    async () => {
      const db = await getDb();
      if (!db) throw new Error("Banco de dados indisponível para o teste integrado");
      const rollbackMarker = `rollback-cycle-${Date.now()}`;
      let assertionsCompleted = false;

      try {
        await db.transaction(async tx => {
          const [activeCycle] = await tx
            .select()
            .from(optimizationCycles)
            .where(eq(optimizationCycles.status, "ACTIVE"))
            .limit(1);
          if (!activeCycle) throw new Error("Ciclo ativo necessário para o teste");

          const now = Date.now();
          const pendingSignature = `${signature}-rollover-pending`;
          const completedSignature = `${signature}-rollover-completed`;
          const newRecommendationSignature = `${signature}-rollover-new`;
          const baseTask = {
            cycleId: activeCycle.id,
            campaignName: "Campanha de rollover Vitest",
            region: "Não classificada",
            monthlyLeadGoal: null,
            actionType: "REVIEW_BIDDING",
            description: "Validar virada transacional de ciclo.",
            rationale: "Cobertura integrada da transferência.",
            evidence: { spend: 100, conversions: 5, cpa: 20 },
            steps: ["Validar o novo ciclo."],
            expectedImpact: "Confirmar integridade do ciclo.",
            risk: "Sem alteração em mídia.",
            priority: "LOW" as const,
            createdBy: "autor-original",
            createdAt: now,
            updatedAt: now,
          };
          await tx.insert(optimizationTasks).values([
            {
              ...baseTask,
              campaignId: "vitest-rollover-pending",
              sourceSignature: pendingSignature,
              status: "IN_PROGRESS" as const,
              assignee: "Responsável original",
              startedAt: now,
            },
            {
              ...baseTask,
              campaignId: "vitest-rollover-completed",
              sourceSignature: completedSignature,
              status: "COMPLETED" as const,
              completedAt: now,
            },
          ]);
          const sourceTasks = await tx
            .select()
            .from(optimizationTasks)
            .where(inArray(optimizationTasks.sourceSignature, [pendingSignature, completedSignature]));
          const pendingSource = sourceTasks.find(task => task.sourceSignature === pendingSignature)!;
          const completedSource = sourceTasks.find(task => task.sourceSignature === completedSignature)!;

          const snapshot = {
            snapshotDate: "2026-07-19",
            windowDateFrom: "2026-07-13",
            windowDateTo: "2026-07-19",
            spend: 100,
            conversions: 5,
            cpa: 20,
            ctr: 8,
            cpc: 1.25,
            clicks: 80,
            impressions: 1_000,
            dailyBudget: 50,
            optimizationScore: 0.8,
            searchImpressionShare: 0.6,
          };
          const rollover = await rolloverOptimizationCycleInTransaction(tx, {
            actor,
            now: now + 1_000,
            campaignSnapshots: [
              { ...snapshot, campaignId: pendingSource.campaignId, campaignName: pendingSource.campaignName },
            ],
            recommendations: [
              {
                sourceSignature: pendingSignature,
                campaignId: pendingSource.campaignId,
                campaignName: pendingSource.campaignName,
                region: pendingSource.region,
                monthlyLeadGoal: pendingSource.monthlyLeadGoal,
                actionType: pendingSource.actionType,
                description: pendingSource.description,
                rationale: pendingSource.rationale,
                evidence: pendingSource.evidence,
                steps: pendingSource.steps,
                expectedImpact: pendingSource.expectedImpact,
                risk: pendingSource.risk,
                priority: pendingSource.priority,
                snapshot,
              },
              {
                sourceSignature: newRecommendationSignature,
                campaignId: "vitest-rollover-new",
                campaignName: "Nova recomendação Vitest",
                region: null,
                monthlyLeadGoal: null,
                actionType: "REDUCE_WASTE",
                description: "Nova recomendação sem equivalente transferida.",
                rationale: "Validar criação adicional.",
                evidence: { spend: 120, conversions: 3, cpa: 40 },
                steps: ["Validar criação única."],
                expectedImpact: "Confirmar deduplicação.",
                risk: "Sem alteração em mídia.",
                priority: "MEDIUM",
                snapshot,
              },
            ],
          });

          expect(rollover.previousCycle.id).toBe(activeCycle.id);
          expect(rollover.newCycle.carriedFromCycleId).toBe(activeCycle.id);
          expect(rollover.recommendationCreatedCount).toBe(1);
          expect(rollover.recommendationSkippedCount).toBe(1);
          const [closedCycle] = await tx
            .select()
            .from(optimizationCycles)
            .where(eq(optimizationCycles.id, activeCycle.id))
            .limit(1);
          expect(closedCycle).toMatchObject({
            status: "CLOSED",
            closedBy: actor,
            closedAt: now + 1_000,
          });

          const testTasksInNewCycle = await tx
            .select()
            .from(optimizationTasks)
            .where(
              and(
                eq(optimizationTasks.cycleId, rollover.newCycle.id),
                inArray(optimizationTasks.campaignId, [
                  pendingSource.campaignId,
                  completedSource.campaignId,
                  "vitest-rollover-new",
                ]),
              ),
            );
          const transferred = testTasksInNewCycle.filter(task => task.campaignId === pendingSource.campaignId);
          expect(transferred).toHaveLength(1);
          expect(transferred[0]).toMatchObject({
            sourceTaskId: pendingSource.id,
            createdBy: "autor-original",
            assignee: "Responsável original",
            status: "PENDING",
          });
          expect(testTasksInNewCycle.some(task => task.campaignId === completedSource.campaignId)).toBe(false);
          expect(testTasksInNewCycle.filter(task => task.campaignId === "vitest-rollover-new")).toHaveLength(1);

          const transferEvents = await tx
            .select()
            .from(taskEvents)
            .where(inArray(taskEvents.taskId, [pendingSource.id, transferred[0].id]));
          expect(transferEvents.map(event => event.eventType)).toEqual(
            expect.arrayContaining(["TRANSFERRED_OUT", "TRANSFERRED_IN"]),
          );
          const transferredOut = transferEvents.find(event => event.eventType === "TRANSFERRED_OUT");
          const transferredIn = transferEvents.find(event => event.eventType === "TRANSFERRED_IN");
          expect(transferredOut).toMatchObject({ actor, createdAt: now + 1_000 });
          expect(transferredOut?.metadata).toMatchObject({
            fromCycleId: activeCycle.id,
            toCycleId: rollover.newCycle.id,
            targetTaskId: transferred[0].id,
          });
          expect(transferredIn).toMatchObject({ actor, createdAt: now + 1_000 });
          expect(transferredIn?.metadata).toMatchObject({
            fromCycleId: activeCycle.id,
            toCycleId: rollover.newCycle.id,
            sourceTaskId: pendingSource.id,
          });
          const transferredSnapshots = await tx
            .select()
            .from(performanceSnapshots)
            .where(eq(performanceSnapshots.taskId, transferred[0].id));
          expect(transferredSnapshots.map(snapshotItem => snapshotItem.snapshotType)).toContain("CYCLE_START");

          const firstReopen = await reopenOptimizationTaskInTransaction(tx, {
            taskId: completedSource.id,
            actor,
            now: now + 2_000,
            snapshot: { ...snapshot, campaignId: completedSource.campaignId, campaignName: completedSource.campaignName },
          });
          expect(firstReopen.created).toBe(true);
          expect(firstReopen.task).toMatchObject({
            cycleId: rollover.newCycle.id,
            sourceTaskId: completedSource.id,
            status: "REOPENED",
          });
          const secondReopen = await reopenOptimizationTaskInTransaction(tx, {
            taskId: completedSource.id,
            actor,
            now: now + 3_000,
            snapshot: null,
          });
          expect(secondReopen.created).toBe(false);
          expect(secondReopen.task.id).toBe(firstReopen.task.id);

          const reopenEvents = await tx
            .select()
            .from(taskEvents)
            .where(inArray(taskEvents.taskId, [completedSource.id, firstReopen.task.id]));
          expect(reopenEvents.filter(event => event.eventType === "REOPENED")).toHaveLength(2);
          assertionsCompleted = true;
          throw new Error(rollbackMarker);
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(rollbackMarker);
      }

      expect(assertionsCompleted).toBe(true);
    },
    30_000,
  );
});
