import { describe, expect, it } from "vitest";
import { buildOptimizationHistory, type OptimizationWorkspaceData } from "./optimizationHistory";

const day = (value: string) => Date.parse(`${value}T12:00:00Z`);

function makeWorkspace(input: {
  followUp?: {
    from: string;
    to: string;
    spend: number;
    conversions: number;
    cpa: number;
    ctr?: number;
    cpc?: number;
  };
  completed?: boolean;
}): OptimizationWorkspaceData {
  const completed = input.completed ?? true;
  const task = {
    id: 1,
    cycleId: 10,
    campaignId: "23906853014",
    campaignName: "Campanha regional de validação",
    region: "Goiás",
    monthlyLeadGoal: 450,
    actionType: "REVIEW_BIDDING",
    description: "Revisar estratégia de lances.",
    rationale: "Validação da análise histórica.",
    evidence: { cpa: 100 },
    steps: ["Revisar campanha"],
    expectedImpact: "Melhorar eficiência.",
    risk: "Resultado sujeito ao leilão.",
    priority: "HIGH",
    status: completed ? "COMPLETED" : "IN_PROGRESS",
    sourceSignature: "history-test",
    sourceTaskId: null,
    createdBy: "criador",
    assignee: "responsável",
    createdAt: day("2026-07-01"),
    updatedAt: day("2026-07-10"),
    startedAt: day("2026-07-08"),
    completedAt: completed ? day("2026-07-10") : null,
  } as const;
  const snapshots = [
    {
      id: 1,
      cycleId: 10,
      taskId: 1,
      campaignId: task.campaignId,
      campaignName: task.campaignName,
      snapshotType: "TASK_CREATED",
      snapshotDate: "2026-07-07",
      windowDateFrom: "2026-07-01",
      windowDateTo: "2026-07-07",
      spend: "700.0000",
      conversions: "7.0000",
      cpa: "100.0000",
      ctr: "5.000000",
      cpc: "2.0000",
      clicks: "350.00",
      impressions: "7000.00",
      dailyBudget: "100.0000",
      optimizationScore: "0.800000",
      searchImpressionShare: "0.600000",
      createdAt: day("2026-07-07"),
    },
    ...(input.followUp
      ? [
          {
            id: 2,
            cycleId: 10,
            taskId: 1,
            campaignId: task.campaignId,
            campaignName: task.campaignName,
            snapshotType: "FOLLOW_UP" as const,
            snapshotDate: input.followUp.to,
            windowDateFrom: input.followUp.from,
            windowDateTo: input.followUp.to,
            spend: input.followUp.spend.toFixed(4),
            conversions: input.followUp.conversions.toFixed(4),
            cpa: input.followUp.cpa.toFixed(4),
            ctr: (input.followUp.ctr ?? 5).toFixed(6),
            cpc: (input.followUp.cpc ?? 2).toFixed(4),
            clicks: "350.00",
            impressions: "7000.00",
            dailyBudget: "100.0000",
            optimizationScore: "0.800000",
            searchImpressionShare: "0.600000",
            createdAt: day(input.followUp.to),
          },
        ]
      : []),
  ];

  return {
    cycles: [
      {
        id: 10,
        cycleNumber: 1,
        name: "Ciclo 1",
        startDate: "2026-07-01",
        endDate: null,
        status: "ACTIVE",
        carriedFromCycleId: null,
        createdBy: "criador",
        closedBy: null,
        createdAt: day("2026-07-01"),
        updatedAt: day("2026-07-01"),
        closedAt: null,
      },
    ],
    tasks: [task],
    events: [],
    completions: completed
      ? [
          {
            id: 1,
            taskId: 1,
            completedBy: "concluidor",
            completedAt: day("2026-07-10"),
            notes: "Alteração concluída e registrada.",
          },
        ]
      : [],
    snapshots,
  } as OptimizationWorkspaceData;
}

describe("histórico de otimizações", () => {
  it("classifica melhora usando CPA e conversões normalizadas por dia", () => {
    const history = buildOptimizationHistory(
      makeWorkspace({
        followUp: {
          from: "2026-07-11",
          to: "2026-07-17",
          spend: 560,
          conversions: 7,
          cpa: 80,
        },
      }),
    );

    expect(history.rows[0].result).toBe("IMPROVED");
    expect(history.rows[0].comparison.cpa?.percent).toBeCloseTo(-20);
    expect(history.rows[0].comparison.conversionsPerDay?.percent).toBeCloseTo(0);
    expect(history.summary).toMatchObject({ improved: 1, worsened: 0, awaitingData: 0 });
    expect(history.cycleSummaries[0].averageCpaChangePercent).toBeCloseTo(-20);
  });

  it("classifica piora quando o CPA sobe pelo menos 10%", () => {
    const history = buildOptimizationHistory(
      makeWorkspace({
        followUp: {
          from: "2026-07-11",
          to: "2026-07-17",
          spend: 840,
          conversions: 7,
          cpa: 120,
        },
      }),
    );
    expect(history.rows[0].result).toBe("WORSENED");
    expect(history.rows[0].resultReason).toContain("CPA subiu");
  });

  it("mantém estável quando as variações ficam dentro da faixa neutra", () => {
    const history = buildOptimizationHistory(
      makeWorkspace({
        followUp: {
          from: "2026-07-11",
          to: "2026-07-17",
          spend: 665,
          conversions: 7,
          cpa: 95,
        },
      }),
    );
    expect(history.rows[0].result).toBe("STABLE");
  });

  it("aguarda dados quando a janela sobrepõe a conclusão ou tem menos de 3 dias", () => {
    const overlapping = buildOptimizationHistory(
      makeWorkspace({
        followUp: {
          from: "2026-07-10",
          to: "2026-07-15",
          spend: 480,
          conversions: 6,
          cpa: 80,
        },
      }),
    );
    expect(overlapping.rows[0].result).toBe("AWAITING_DATA");
    expect(overlapping.rows[0].resultReason).toContain("inclui dias anteriores ou iguais");

    const shortWindow = buildOptimizationHistory(
      makeWorkspace({
        followUp: {
          from: "2026-07-11",
          to: "2026-07-12",
          spend: 160,
          conversions: 2,
          cpa: 80,
        },
      }),
    );
    expect(shortWindow.rows[0].result).toBe("AWAITING_DATA");
    expect(shortWindow.rows[0].resultReason).toContain("ao menos 3 dias fechados");
  });

  it("não atribui causalidade e mantém tarefas em andamento como aguardando", () => {
    const history = buildOptimizationHistory(makeWorkspace({ completed: false }));
    expect(history.rows[0].result).toBe("AWAITING_DATA");
    expect(history.methodology.disclaimer).toContain("não atribui causalidade");
  });
});
