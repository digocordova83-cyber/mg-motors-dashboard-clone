import { describe, expect, it } from "vitest";
import {
  CPA_COOLDOWN_MS,
  eligibleRecommendations,
  evaluateRecommendationCadence,
  evaluateTaskExecutionCadence,
  isCpaOptimization,
  normalizeNegativeKeywordTaskSteps,
  optimizationActionFamily,
  uniqueOptimizationItems,
} from "./optimizationPolicy";

const DAY = 24 * 60 * 60 * 1_000;
const NOW = Date.UTC(2026, 6, 24, 12);

function recommendation(overrides: Record<string, unknown> = {}) {
  return {
    sourceSignature: "sem-marca-sp-cpa-20",
    campaignId: "sem-marca-sp",
    campaignName: "Sem Marca SP",
    actionType: "SET_TARGET_CPA",
    description: "Ajustar CPA-alvo para R$ 20,00.",
    evidence: { currentCpa: 28, suggestedTargetCpa: 20 },
    ...overrides,
  };
}

function task(overrides: Record<string, unknown> = {}) {
  return {
    id: 101,
    cycleId: 1,
    campaignId: "sem-marca-sp",
    campaignName: "Sem Marca SP",
    actionType: "SET_TARGET_CPA",
    sourceSignature: "sem-marca-sp-cpa-anterior",
    status: "COMPLETED",
    createdAt: NOW - 5 * DAY,
    completedAt: NOW - 3 * DAY,
    description: "Ajustar CPA-alvo anterior.",
    evidence: { suggestedTargetCpa: 20 },
    ...overrides,
  };
}

describe("política de cadência das otimizações", () => {
  it("classifica todas as ações de lance/CPA na mesma família sem afetar ações não relacionadas", () => {
    expect(isCpaOptimization(recommendation())).toBe(true);
    expect(
      isCpaOptimization(
        recommendation({ actionType: "SWITCH_BIDDING_STRATEGY", description: "Migrar estratégia" }),
      ),
    ).toBe(true);
    expect(
      isCpaOptimization(
        recommendation({
          actionType: "REVIEW_BIDDING",
          description: "Revisar estratégia",
          evidence: { recommendedAction: "MAXIMIZE_CONVERSIONS com TARGET_CPA" },
        }),
      ),
    ).toBe(true);
    expect(
      isCpaOptimization(
        recommendation({
          actionType: "REVIEW_BIDDING",
          description: "Revisar lances mantendo o orçamento até o CPA melhorar.",
          evidence: { cpa: 50.93 },
        }),
      ),
    ).toBe(true);
    expect(
      isCpaOptimization(
        recommendation({ actionType: "REVIEW_BIDDING", description: "Revisar lances", evidence: { cpa: 20 } }),
      ),
    ).toBe(false);
    expect(
      optimizationActionFamily(
        recommendation({ actionType: "REDUCE_WASTE", description: "Negativar buscas sem intenção" }),
      ),
    ).toBe("REDUCE_WASTE");
  });

  it("deduplica CPA por campanha e família mesmo quando o valor e a assinatura oscilam de R$ 20 para R$ 7", () => {
    const items = uniqueOptimizationItems([
      recommendation(),
      recommendation({
        sourceSignature: "sem-marca-sp-cpa-7",
        description: "Ajustar CPA-alvo para R$ 7,00.",
        evidence: { currentCpa: 20, suggestedTargetCpa: 7 },
      }),
      recommendation({
        sourceSignature: "sem-marca-sp-negativas",
        actionType: "REDUCE_WASTE",
        description: "Adicionar negativas.",
      }),
    ]);

    expect(items.map(item => item.sourceSignature)).toEqual([
      "sem-marca-sp-cpa-20",
      "sem-marca-sp-negativas",
    ]);
  });

  it("mantém a pendência original de CPA e bloqueia uma nova assinatura na mesma campanha", () => {
    const eligibility = evaluateRecommendationCadence({
      recommendations: [recommendation({ campaignId: "sem-marca-scs", campaignName: "Sem Marca SCS" })],
      tasks: [
        task({
          id: 202,
          campaignId: "sem-marca-scs",
          campaignName: "Sem Marca SCS",
          status: "IN_PROGRESS",
          createdAt: NOW - 10 * DAY,
          completedAt: null,
        }),
      ],
      now: NOW,
    })[0];

    expect(eligibility).toMatchObject({
      status: "OPEN_TASK",
      eligible: false,
      actionFamily: "CPA",
      blockingTaskId: 202,
      blockingTaskCreatedAt: NOW - 10 * DAY,
      daysRemaining: 0,
    });
    expect(eligibility.reason).toContain("pendente");
  });

  it("bloqueia nova troca de CPA três dias após a conclusão e informa quatro dias restantes", () => {
    const eligibility = evaluateRecommendationCadence({
      recommendations: [
        recommendation({
          sourceSignature: "sem-marca-sp-cpa-7",
          description: "Ajustar CPA-alvo para R$ 7,00.",
        }),
      ],
      tasks: [task()],
      now: NOW,
    })[0];

    expect(eligibility).toMatchObject({
      status: "COOLDOWN",
      eligible: false,
      daysRemaining: 4,
      nextEligibleAt: NOW + 4 * DAY,
      blockingTaskId: 101,
      lastCompletedAt: NOW - 3 * DAY,
    });
    expect(eligibility.nextEligibleAt).toBe((task().completedAt as number) + CPA_COOLDOWN_MS);
  });

  it("coloca a tarefa canônica em quarentena e consolida variações legadas sem apagar a cronologia", () => {
    const activeCycleId = 7;
    const openTasks = [
      task({
        id: 201,
        cycleId: activeCycleId,
        status: "PENDING",
        createdAt: NOW - 2 * DAY,
        completedAt: null,
        sourceSignature: "sem-marca-sp-cpa-43",
        description: "Definir CPA desejado em R$ 43,00.",
      }),
      task({
        id: 202,
        cycleId: activeCycleId,
        status: "PENDING",
        createdAt: NOW - DAY,
        completedAt: null,
        sourceSignature: "sem-marca-sp-cpa-42",
        description: "Definir CPA desejado em R$ 42,00.",
      }),
      task({
        id: 203,
        cycleId: activeCycleId,
        status: "PENDING",
        createdAt: NOW,
        completedAt: null,
        sourceSignature: "sem-marca-sp-cpa-39",
        description: "Definir CPA desejado em R$ 39,00.",
      }),
      task({
        id: 204,
        cycleId: activeCycleId,
        actionType: "REDUCE_WASTE",
        status: "PENDING",
        createdAt: NOW,
        completedAt: null,
        sourceSignature: "sem-marca-sp-negativas",
        description: "Adicionar negativas.",
      }),
    ];

    const eligibility = evaluateTaskExecutionCadence({
      tasks: [task(), ...openTasks],
      activeCycleId,
      now: NOW,
    });
    const byId = new Map(eligibility.map(item => [item.taskId, item]));

    expect(byId.get(201)).toMatchObject({
      status: "COOLDOWN",
      eligible: false,
      daysRemaining: 4,
      nextEligibleAt: NOW + 4 * DAY,
      canonicalTaskId: 201,
      duplicateCount: 2,
      duplicateTaskIds: [202, 203],
      blockingTaskId: 101,
    });
    expect(byId.get(202)).toMatchObject({
      status: "LEGACY_DUPLICATE",
      eligible: false,
      canonicalTaskId: 201,
      blockingTaskId: 201,
    });
    expect(byId.get(203)).toMatchObject({
      status: "LEGACY_DUPLICATE",
      eligible: false,
      canonicalTaskId: 201,
    });
    expect(byId.get(204)).toMatchObject({ status: "EXECUTABLE", eligible: true });
  });

  it("libera CPA no sétimo dia completo e mantém recomendações não-CPA elegíveis durante o cooldown", () => {
    const completedAt = NOW - 7 * DAY;
    const recommendations = [
      recommendation(),
      recommendation({
        sourceSignature: "sem-marca-sp-negativas",
        actionType: "REDUCE_WASTE",
        description: "Adicionar negativas.",
      }),
    ];
    const eligibility = evaluateRecommendationCadence({
      recommendations,
      tasks: [task({ completedAt })],
      now: NOW,
    });

    expect(eligibility).toEqual([
      expect.objectContaining({ status: "ELIGIBLE", eligible: true, lastCompletedAt: completedAt }),
      expect.objectContaining({ status: "ELIGIBLE", eligible: true, actionFamily: "REDUCE_WASTE" }),
    ]);
    expect(eligibleRecommendations({ recommendations, tasks: [task({ completedAt })], now: NOW })).toHaveLength(2);
  });

  it("remove somente pedidos de relatório manual e preserva a execução das negativas", () => {
    expect(
      normalizeNegativeKeywordTaskSteps([
        "Gerar relatório de palavras-chave negativas no Edge.",
        "Adicionar como negativas os termos sem intenção comercial.",
        "Exportar relatório dos termos negativados.",
        "Adicionar como negativas os termos sem intenção comercial.",
      ]),
    ).toEqual([
      "Registrar no histórico do dashboard somente as palavras-chave negativas efetivamente aplicadas; não gerar relatório separado.",
      "Adicionar como negativas os termos sem intenção comercial.",
    ]);
  });
});
