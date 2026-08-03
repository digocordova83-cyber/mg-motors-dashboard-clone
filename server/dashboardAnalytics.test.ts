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

  it("mantém o fechamento em D-1 quando ontem não tem linha", () => {
    const pacing = buildPacing(
      [
        row({ date: "2026-07-01", spend: 100 }),
        row({ date: "2026-07-02", spend: 100 }),
      ],
      3_100,
      "2026-07-03",
    );

    expect(pacing?.lastClosedDate).toBe("2026-07-03");
    expect(pacing?.closedDays).toBe(3);
    expect(pacing?.invested).toBe(200);
    expect(pacing?.series[2].real).toBe(200);
    expect(pacing?.series[3].real).toBeNull();
  });

  it("calcula agosto de 2026 com a meta mensal de R$ 412.800", () => {
    const pacing = buildPacing(
      [
        row({ date: "2026-08-01", spend: 10_000 }),
        row({ date: "2026-08-02", spend: 10_000 }),
      ],
      412_800,
    );

    expect(pacing).toMatchObject({
      competencia: "2026-08",
      monthlyGoal: 412_800,
      invested: 20_000,
      remaining: 392_800,
      projected: 310_000,
      totalDays: 31,
      closedDays: 2,
      remainingDays: 29,
      idealDaily: 13_316.13,
      idealDailyRemaining: 13_544.83,
      pacePercent: 75.1,
      achievedPercent: 4.8,
      projectedPercent: 75.1,
    });
    expect(pacing?.series).toHaveLength(31);
    expect(pacing?.series.at(-1)?.monthlyGoal).toBe(412_800);
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

  it("expõe D-1 sem amostra como indisponível em vez de recuar a data", () => {
    const comparison = buildDailyComparison(
      [
        row({ date: "2026-07-01", spend: 80, conversions: 2 }),
        row({ date: "2026-07-02", spend: 100, conversions: 2 }),
      ],
      "2026-07-03",
    );

    expect(comparison.referenceDate).toBe("2026-07-03");
    expect(comparison.previousDate).toBe("2026-07-02");
    expect(comparison.table.find(metric => metric.key === "investment")?.d1).toBeNull();
    expect(comparison.table.find(metric => metric.key === "investment")?.d2).toBe(100);
    expect(comparison.campaigns[0].d1).toBeNull();
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

describe("recomendações profundas", () => {
  const pacing = {
    ...(buildPacing([row({ date: "2026-07-01", spend: 80 })], 3_100)!),
    pacePercent: 80,
  };

  it("gera decisões variadas, específicas e uma única ação por campanha", () => {
    const campaigns = aggregateCampaigns(
      [
        row({
          campaign_id: "measurement",
          campaign: "MG4_PMax_SP",
          spend: 600,
          conversions: 0,
          clicks: 120,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
        }),
        row({
          campaign_id: "traffic",
          campaign: "MGS5_Search_RJ",
          spend: 1_800,
          conversions: 20,
          bidding_strategy_type: "MAXIMIZE_CLICKS",
        }),
        row({
          campaign_id: "target-cpa",
          campaign: "MG4_Search_SP",
          spend: 3_200,
          conversions: 20,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
          search_budget_lost_impression_share: 0.1,
        }),
        row({
          campaign_id: "waste",
          campaign: "MGS5_Search_RJ",
          spend: 1_000,
          conversions: 5,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
          search_budget_lost_impression_share: 0.1,
        }),
        row({
          campaign_id: "value",
          campaign: "MG4_PMax_SP",
          spend: 1_200,
          conversions: 10,
          bidding_strategy_type: "TARGET_ROAS",
        }),
        row({
          campaign_id: "landing",
          campaign: "MG4_PMax_SP",
          spend: 4_000,
          conversions: 20,
          clicks: 1_000,
          impressions: 10_000,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
        }),
        row({
          campaign_id: "creative",
          campaign: "MGS5_PMax_RJ",
          spend: 4_000,
          conversions: 20,
          clicks: 400,
          impressions: 10_000,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
        }),
        row({
          campaign_id: "budget",
          campaign: "MG4_PMax_SP",
          spend: 1_600,
          conversions: 20,
          budget_amount: 120,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
          search_budget_lost_impression_share: 0.3,
        }),
        row({
          campaign_id: "rank",
          campaign: "MGS5_Search_RJ",
          spend: 800,
          conversions: 10,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
          search_impression_share: 0.2,
          search_budget_lost_impression_share: 0.1,
          optimization_score: 0.6,
        }),
      ],
      goals,
      100,
    );

    const result = buildRecommendations(campaigns, 100, pacing);
    const byCampaign = new Map(result.recommendations.map(item => [item.campaignId, item]));

    expect(byCampaign.get("measurement")?.actionType).toBe("AUDIT_MEASUREMENT");
    expect(byCampaign.get("traffic")?.actionType).toBe("SWITCH_BIDDING_STRATEGY");
    expect(byCampaign.get("target-cpa")?.actionType).toBe("SET_TARGET_CPA");
    expect(byCampaign.get("waste")?.actionType).toBe("REDUCE_WASTE");
    expect(byCampaign.get("value")?.actionType).toBe("VALIDATE_VALUE_STRATEGY");
    expect(byCampaign.get("landing")?.actionType).toBe("IMPROVE_CVR");
    expect(byCampaign.get("creative")?.actionType).toBe("REFRESH_CREATIVE");
    expect(byCampaign.get("budget")?.actionType).toBe("INCREASE_BUDGET");
    expect(byCampaign.get("rank")?.actionType).toBe("IMPROVE_AD_RANK");
    expect(new Set(result.recommendations.map(item => item.campaignId)).size).toBe(result.recommendations.length);

    const targetCpa = byCampaign.get("target-cpa");
    expect(targetCpa?.evidence).toMatchObject({
      currentCpa: 160,
      benchmarkCpa: 100,
      recommendedTargetCpa: 136,
      currentStrategy: "MAXIMIZE_CONVERSIONS",
      recommendedStrategy: "TARGET_CPA",
      parameterLabel: "CPA observado → CPA-alvo",
      currentValue: 160,
      recommendedValue: 136,
      parameterFormat: "currency",
    });
    expect(targetCpa?.description).toContain("R$ 136,00");
    expect(targetCpa?.steps.join(" ")).toContain("R$ 136,00");
    expect(targetCpa?.risk).toContain("20%");

    const traffic = byCampaign.get("traffic");
    expect(traffic?.evidence).toMatchObject({
      currentStrategy: "MAXIMIZE_CLICKS",
      recommendedStrategy: "MAXIMIZE_CONVERSIONS",
    });
    expect(traffic?.budgetIncreaseEligible).toBe(false);

    const waste = byCampaign.get("waste");
    expect(waste?.evidence.recommendedTargetCpa).toBeNull();
    expect(waste?.description).toContain("não definir CPA-alvo");

    const landing = byCampaign.get("landing");
    expect(landing?.evidence).toMatchObject({
      currentStrategy: "MAXIMIZE_CONVERSIONS",
      recommendedStrategy: "MAXIMIZE_CONVERSIONS",
      parameterLabel: "Taxa de conversão pós-clique",
      currentValue: 2,
      recommendedValue: 3,
      parameterFormat: "percent",
    });
    expect(landing?.description).toContain("2% para 3%");
    expect(landing?.steps.join(" ")).toContain("100 novos cliques");

    const creative = byCampaign.get("creative");
    expect(creative?.evidence).toMatchObject({
      currentStrategy: "MAXIMIZE_CONVERSIONS",
      recommendedStrategy: "MAXIMIZE_CONVERSIONS",
      parameterLabel: "CTR dos anúncios e recursos",
      currentValue: 4,
      recommendedValue: 6,
      parameterFormat: "percent",
    });
    expect(creative?.description).toContain("4% para 6%");
    expect(creative?.steps.join(" ")).toContain("1.000 novas impressões");

    const budget = byCampaign.get("budget");
    expect(budget?.evidence).toMatchObject({
      currentDailyBudget: 120,
      recommendedDailyBudget: 138,
      budgetChangePercent: 15,
    });
    expect(budget?.budgetIncreaseEligible).toBe(true);
    expect(budget?.description).toContain("R$ 120,00");
    expect(budget?.description).toContain("R$ 138,00");
  });

  it("exige amostra para CPA-alvo e limita a redução a 15% por ciclo", () => {
    const [campaign] = aggregateCampaigns(
      [
        row({
          campaign_id: "sample",
          campaign: "MG4_Search_SP",
          spend: 2_240,
          conversions: 14,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
          search_budget_lost_impression_share: 0.1,
        }),
      ],
      goals,
      100,
    );

    const insufficient = buildRecommendations([campaign], 100, pacing).recommendations[0];
    const sufficient = buildRecommendations(
      [{ ...campaign, spend: 2_400, conversions: 15, cpa: 160 }],
      100,
      pacing,
    ).recommendations[0];

    expect(insufficient.actionType).toBe("REDUCE_WASTE");
    expect(insufficient.evidence.recommendedTargetCpa).toBeNull();
    expect(sufficient.actionType).toBe("SET_TARGET_CPA");
    expect(sufficient.evidence.recommendedTargetCpa).toBe(136);
    expect(Number(sufficient.evidence.recommendedTargetCpa)).toBeGreaterThanOrEqual(160 * 0.85);
  });

  it("limita a soma de aumentos ao headroom diário da conta", () => {
    const campaigns = aggregateCampaigns(
      [
        row({ campaign_id: "scale-sp", campaign: "MG4_PMax_SP", spend: 1_600, conversions: 20 }),
        row({ campaign_id: "scale-rj", campaign: "MGS5_PMax_RJ", spend: 1_800, conversions: 20 }),
      ],
      goals,
      100,
    );
    const limitedPacing = {
      ...pacing,
      averageDaily: 100,
      idealDailyRemaining: 130,
      pacePercent: 80,
    };

    const result = buildRecommendations(campaigns, 100, limitedPacing);
    const increases = result.recommendations.filter(item => item.actionType === "INCREASE_BUDGET");
    const allocated = increases.reduce(
      (total, item) => total + Number(item.evidence.recommendedDailyBudget) - Number(item.evidence.currentDailyBudget),
      0,
    );

    expect(increases).toHaveLength(2);
    expect(allocated).toBe(30);
    expect(result.policy.totalDailyBudgetHeadroom).toBe(30);
    expect(result.policy.allocatedDailyBudgetIncrease).toBe(30);
    expect(result.policy.maximumDailyBudgetIncreasePercent).toBe(15);
  });

  it("inclui parâmetros na assinatura para não deduplicar metas diferentes", () => {
    const [campaign] = aggregateCampaigns(
      [
        row({
          campaign_id: "signature",
          campaign: "MG4_Search_SP",
          spend: 3_200,
          conversions: 20,
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
          search_budget_lost_impression_share: 0.1,
        }),
      ],
      goals,
      100,
    );

    const first = buildRecommendations([campaign], 100, pacing).recommendations[0];
    const second = buildRecommendations([campaign], 130, pacing).recommendations[0];

    expect(first.actionType).toBe("SET_TARGET_CPA");
    expect(second.actionType).toBe("SET_TARGET_CPA");
    expect(first.evidence.recommendedTargetCpa).toBe(136);
    expect(second.evidence.recommendedTargetCpa).toBe(137);
    expect(first.sourceSignature).not.toBe(second.sourceSignature);
  });
});
