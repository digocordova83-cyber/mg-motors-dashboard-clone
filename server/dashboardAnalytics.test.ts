import { describe, expect, it } from "vitest";
import {
  aggregateCampaigns,
  buildDailyComparison,
  buildPacing,
  buildProductPerformance,
  buildRankings,
  buildRecommendations,
  buildRegionPerformance,
  type AnalyticsRow,
  type GoalConfig,
} from "./dashboardAnalytics";
import { classifyProduct, classifyRegion } from "./campaignTaxonomy";

const goals: GoalConfig[] = [
  {
    goalType: "MEDIA_BUDGET",
    scopeKey: "ACCOUNT",
    region: null,
    monthlyLeadGoal: null,
    monthlyBudgetGoal: 3_100,
  },
  {
    goalType: "REGIONAL_LEADS",
    scopeKey: "SAO_PAULO_SP",
    region: "São Paulo/SP",
    monthlyLeadGoal: 2_145,
    monthlyBudgetGoal: null,
  },
  {
    goalType: "REGIONAL_LEADS",
    scopeKey: "RIO_DE_JANEIRO_RJ",
    region: "Rio de Janeiro/RJ",
    monthlyLeadGoal: 863,
    monthlyBudgetGoal: null,
  },
];

function row(overrides: Partial<AnalyticsRow> = {}): AnalyticsRow {
  return {
    campaign: "MG4_PMax_SP",
    campaign_id: "1001",
    date: "2026-07-01",
    spend: 100,
    conversions: 2,
    clicks: 20,
    impressions: 200,
    budget_amount: 120,
    campaign_status: "ENABLED",
    bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
    optimization_score: 0.8,
    search_impression_share: 0.4,
    search_budget_lost_impression_share: 0.3,
    ...overrides,
  };
}

describe("taxonomia determinística", () => {
  it("classifica apenas regiões inequívocas e separa casos não identificáveis", () => {
    expect(classifyRegion("MG4_PMax_SP")).toEqual({
      key: "SAO_PAULO_SP",
      label: "São Paulo/SP",
      type: "regional",
    });
    expect(classifyRegion("MG4_PMax_CUIABA").label).toBe("Cuiabá/MT");
    expect(classifyRegion("Campanha sem sufixo regional").type).toBe("unclassified");
    expect(classifyProduct("MGCybester_PMax_RJ")).toBe("MG Cyberster");
    expect(classifyProduct("Institucional sem modelo")).toBe("Não classificada");
  });
});

describe("pacing mensal", () => {
  it("usa o último dia fechado e projeta sem presumir dados do dia atual", () => {
    const rows = [
      row({ date: "2026-07-01", spend: 100 }),
      row({ date: "2026-07-02", spend: 100 }),
      row({ date: "2026-07-03", spend: 100 }),
    ];
    const pacing = buildPacing(rows, 3_100);

    expect(pacing?.lastClosedDate).toBe("2026-07-03");
    expect(pacing?.invested).toBe(300);
    expect(pacing?.idealDaily).toBe(100);
    expect(pacing?.averageDaily).toBe(100);
    expect(pacing?.projected).toBe(3_100);
    expect(pacing?.pacePercent).toBe(100);
    expect(pacing?.series).toHaveLength(31);
    expect(pacing?.series[3].real).toBeNull();
  });
});

describe("comparativos diários", () => {
  it("compara D-1 com D-2 e sinaliza referências sem amostra como indisponíveis", () => {
    const comparison = buildDailyComparison([
      row({ date: "2026-07-01", spend: 80, conversions: 2 }),
      row({ date: "2026-07-02", spend: 100, conversions: 2 }),
      row({ date: "2026-07-03", spend: 120, conversions: 3 }),
    ]);

    expect(comparison.referenceDate).toBe("2026-07-03");
    expect(comparison.previousDate).toBe("2026-07-02");
    expect(comparison.cards.find(metric => metric.key === "investment")?.deltaVsD2).toBe(20);
    expect(comparison.cards.find(metric => metric.key === "cpa")?.weekAgo).toBeNull();
    expect(comparison.cards.find(metric => metric.key === "ctr")?.average7d).toBeNull();
    expect(comparison.campaigns[0].campaignId).toBe("1001");
  });
});

describe("segmentações e rankings", () => {
  it("concilia totais e exclui CPA sem amostra mínima", () => {
    const campaigns = aggregateCampaigns(
      [
        row({ campaign_id: "1001", campaign: "MG4_PMax_SP", spend: 300, conversions: 6 }),
        row({ campaign_id: "1002", campaign: "MGS5_PMax_RJ", spend: 240, conversions: 4 }),
        row({ campaign_id: "1003", campaign: "Institucional", spend: 50, conversions: 1 }),
      ],
      goals,
      55,
    );
    const rankings = buildRankings(campaigns);
    const products = buildProductPerformance(campaigns);
    const regions = buildRegionPerformance(campaigns, 55);

    expect(rankings.best).toHaveLength(2);
    expect(rankings.excludedCount).toBe(1);
    expect(products.reduce((sum, item) => sum + item.spend, 0)).toBe(590);
    expect(regions.reduce((sum, item) => sum + item.spend, 0)).toBe(590);
    expect(regions.find(item => item.regionKey === "UNCLASSIFIED")).toBeDefined();
  });
});

describe("recomendações", () => {
  it("gera uma única ação por campanha e bloqueia aumento sem todas as evidências", () => {
    const campaigns = aggregateCampaigns(
      [
        row({
          campaign_id: "1001",
          campaign: "MG4_PMax_SP",
          spend: 300,
          conversions: 10,
          search_budget_lost_impression_share: 0.3,
        }),
        row({
          campaign_id: "1002",
          campaign: "MGS5_PMax_RJ",
          spend: 300,
          conversions: 1,
          search_budget_lost_impression_share: 0.5,
        }),
        row({
          campaign_id: "1003",
          campaign: "MGS5_PMax_CUIABA",
          spend: 100,
          conversions: 4,
          search_budget_lost_impression_share: 0.5,
        }),
      ],
      goals,
      100,
    );
    const pacing = {
      ...(buildPacing([row({ date: "2026-07-01", spend: 80 })], 3_100)!),
      pacePercent: 80,
    };
    const result = buildRecommendations(campaigns, 100, pacing);

    const sp = result.recommendations.find(item => item.campaignId === "1001");
    const rj = result.recommendations.find(item => item.campaignId === "1002");
    const cuiaba = result.recommendations.find(item => item.campaignId === "1003");
    expect(sp?.actionType).toBe("INCREASE_BUDGET");
    expect(rj?.actionType).toBe("REVIEW_BIDDING");
    expect(rj?.budgetIncreaseEligible).toBe(false);
    expect(cuiaba).toBeUndefined();
    expect(new Set(result.recommendations.map(item => item.campaignId)).size).toBe(
      result.recommendations.length,
    );
  });

  it("explicita a elegibilidade de orçamento e cada bloqueio operacional", () => {
    const [base] = aggregateCampaigns(
      [
        row({
          campaign_id: "budget-test",
          campaign: "MG4_PMax_SP",
          spend: 200,
          conversions: 10,
          search_budget_lost_impression_share: 0.3,
        }),
      ],
      goals,
      100,
    );
    const pacing = {
      ...(buildPacing([row({ date: "2026-07-01", spend: 80 })], 3_100)!),
      pacePercent: 80,
    };

    const eligible = buildRecommendations([base], 100, pacing).recommendations[0];
    expect(eligible).toMatchObject({
      actionType: "INCREASE_BUDGET",
      budgetIncreaseEligible: true,
      budgetIncreaseBlockedReasons: [],
    });

    const scenarios: Array<{
      overrides: Partial<typeof base>;
      pacePercent?: number;
      reason: string;
    }> = [
      {
        overrides: { googleStatus: "PAUSED" },
        reason: "A campanha não está ativa no Google Ads.",
      },
      {
        overrides: {},
        pacePercent: 100,
        reason: "A conta não está abaixo do ritmo ideal de investimento.",
      },
      {
        overrides: { cpa: 130 },
        reason: "O CPA não está dentro da faixa eficiente para escalar.",
      },
      {
        overrides: { regionType: "unclassified", monthlyLeadGoal: null },
        reason: "A região ou a meta regional não foi identificada com segurança.",
      },
      {
        overrides: { searchBudgetLostImpressionShare: null },
        reason: "A perda de impressões por orçamento está indisponível.",
      },
      {
        overrides: { searchBudgetLostImpressionShare: 10 },
        reason: "A perda de impressões por orçamento é inferior a 20%.",
      },
      {
        overrides: { conversions: 2 },
        reason: "A amostra de conversões é insuficiente.",
      },
    ];

    for (const scenario of scenarios) {
      const [recommendation] = buildRecommendations(
        [{ ...base, ...scenario.overrides, status: "Atenção" as const }],
        100,
        { ...pacing, pacePercent: scenario.pacePercent ?? pacing.pacePercent },
      ).recommendations;
      expect(recommendation.budgetIncreaseEligible).toBe(false);
      expect(recommendation.budgetIncreaseBlockedReasons).toContain(scenario.reason);
      expect(recommendation.actionType).not.toBe("INCREASE_BUDGET");
    }
  });
});
