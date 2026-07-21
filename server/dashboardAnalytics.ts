import { classifyProduct, classifyRegion } from "./campaignTaxonomy";

export type AnalyticsRow = {
  campaign: string;
  campaign_id: string;
  date: string;
  spend: number;
  conversions: number;
  clicks: number;
  impressions: number;
  budget_amount: number | null;
  campaign_status: string;
  bidding_strategy_type: string;
  optimization_score: number | null;
  search_impression_share: number | null;
  search_budget_lost_impression_share: number | null;
};

export type GoalConfig = {
  goalType: "MEDIA_BUDGET" | "REGIONAL_LEADS";
  scopeKey: string;
  region: string | null;
  monthlyLeadGoal: number | null;
  monthlyBudgetGoal: number | null;
};

export type CampaignHealth = "Saudável" | "Atenção" | "Crítico";

type Totals = {
  spend: number;
  conversions: number;
  clicks: number;
  impressions: number;
};

export type AggregatedCampaign = Totals & {
  campaignId: string;
  campaign: string;
  product: string;
  regionKey: string;
  region: string;
  regionType: "regional" | "national" | "unclassified";
  monthlyLeadGoal: number | null;
  budget: number;
  googleStatus: string;
  biddingStrategyType: string;
  optimizationScore: number | null;
  searchImpressionShare: number | null;
  searchBudgetLostImpressionShare: number | null;
  cpa: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  status: CampaignHealth;
};

const DAY_MS = 86_400_000;
export const MIN_RANKING_CONVERSIONS = 3;

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function safeDivide(numerator: number, denominator: number) {
  return denominator > 0 ? numerator / denominator : 0;
}

function parseUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function formatUtcDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number) {
  return formatUtcDate(new Date(parseUtcDate(date).getTime() + days * DAY_MS));
}

function daysInMonth(date: string) {
  const parsed = parseUtcDate(date);
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth() + 1, 0)).getUTCDate();
}

function summarizeRows(rows: AnalyticsRow[]): Totals {
  return rows.reduce(
    (total, row) => ({
      spend: total.spend + row.spend,
      conversions: total.conversions + row.conversions,
      clicks: total.clicks + row.clicks,
      impressions: total.impressions + row.impressions,
    }),
    { spend: 0, conversions: 0, clicks: 0, impressions: 0 },
  );
}

function metricsFromTotals(total: Totals) {
  return {
    investment: round(total.spend),
    conversions: round(total.conversions, 1),
    cpa: round(safeDivide(total.spend, total.conversions)),
    ctr: round(safeDivide(total.clicks, total.impressions) * 100),
    conversionRate: round(safeDivide(total.conversions, total.clicks) * 100),
    cpc: round(safeDivide(total.spend, total.clicks)),
  };
}

function percentDelta(current: number | null, reference: number | null) {
  if (current == null || reference == null || reference === 0) return null;
  return round(((current - reference) / Math.abs(reference)) * 100, 1);
}

function exactDayMetrics(rows: AnalyticsRow[], date: string) {
  const dayRows = rows.filter(row => row.date === date);
  return dayRows.length > 0 ? metricsFromTotals(summarizeRows(dayRows)) : null;
}

function movingAverageMetrics(rows: AnalyticsRow[], referenceDate: string, windowDays: number) {
  const dateFrom = addDays(referenceDate, -(windowDays - 1));
  const windowRows = rows.filter(row => row.date >= dateFrom && row.date <= referenceDate);
  const coveredDays = new Set(windowRows.map(row => row.date));
  if (coveredDays.size < windowDays) return null;
  const totals = summarizeRows(windowRows);
  const totalMetrics = metricsFromTotals(totals);
  return {
    investment: round(totalMetrics.investment / windowDays),
    conversions: round(totalMetrics.conversions / windowDays, 1),
    cpa: totalMetrics.cpa,
    ctr: totalMetrics.ctr,
    conversionRate: totalMetrics.conversionRate,
    cpc: totalMetrics.cpc,
  };
}

const COMPARISON_METRICS = [
  { key: "investment", label: "Investimento", format: "currency", preference: "contextual" },
  { key: "conversions", label: "Conversões", format: "number", preference: "higher" },
  { key: "cpa", label: "CPA Médio", format: "currency", preference: "lower" },
  { key: "ctr", label: "CTR", format: "percent", preference: "higher" },
  { key: "conversionRate", label: "Taxa de Conversão", format: "percent", preference: "higher" },
  { key: "cpc", label: "CPC Médio", format: "currency", preference: "lower" },
] as const;

export function buildDailyComparison(rows: AnalyticsRow[]) {
  const availableDates = Array.from(new Set(rows.map(row => row.date))).sort();
  const referenceDate = availableDates.at(-1) ?? null;
  if (!referenceDate) {
    return { referenceDate: null, previousDate: null, weekAgoDate: null, cards: [], table: [], campaigns: [] };
  }

  const previousDate = addDays(referenceDate, -1);
  const weekAgoDate = addDays(referenceDate, -7);
  const d1 = exactDayMetrics(rows, referenceDate);
  const d2 = exactDayMetrics(rows, previousDate);
  const weekAgo = exactDayMetrics(rows, weekAgoDate);
  const average7d = movingAverageMetrics(rows, referenceDate, 7);
  const average30d = movingAverageMetrics(rows, referenceDate, 30);

  const table = COMPARISON_METRICS.map(metric => {
    const key = metric.key;
    const currentValue = d1?.[key] ?? null;
    const previousValue = d2?.[key] ?? null;
    const weekAgoValue = weekAgo?.[key] ?? null;
    return {
      ...metric,
      d1: currentValue,
      d2: previousValue,
      deltaVsD2: percentDelta(currentValue, previousValue),
      weekAgo: weekAgoValue,
      deltaVsWeekAgo: percentDelta(currentValue, weekAgoValue),
      average7d: average7d?.[key] ?? null,
      average30d: average30d?.[key] ?? null,
    };
  });

  const campaignMap = new Map<
    string,
    {
      campaignId: string;
      campaign: string;
      budget: number | null;
      d1Rows: AnalyticsRow[];
      d2Rows: AnalyticsRow[];
    }
  >();

  for (const row of rows.filter(item => item.date === referenceDate || item.date === previousDate)) {
    const item = campaignMap.get(row.campaign_id) ?? {
      campaignId: row.campaign_id,
      campaign: row.campaign,
      budget: null,
      d1Rows: [],
      d2Rows: [],
    };
    item.campaign = row.campaign;
    if (row.date === referenceDate) {
      item.d1Rows.push(row);
      item.budget = row.budget_amount ?? item.budget;
    } else {
      item.d2Rows.push(row);
      if (item.budget == null) item.budget = row.budget_amount;
    }
    campaignMap.set(row.campaign_id, item);
  }

  const campaigns = Array.from(campaignMap.values())
    .map(item => {
      const current = item.d1Rows.length > 0 ? metricsFromTotals(summarizeRows(item.d1Rows)) : null;
      const previous = item.d2Rows.length > 0 ? metricsFromTotals(summarizeRows(item.d2Rows)) : null;
      return {
        campaignId: item.campaignId,
        campaign: item.campaign,
        budget: item.budget == null ? null : round(item.budget),
        d1: current
          ? { investment: current.investment, conversions: current.conversions, cpa: current.cpa }
          : null,
        d2: previous
          ? { investment: previous.investment, conversions: previous.conversions, cpa: previous.cpa }
          : null,
        deltas: {
          investment: percentDelta(current?.investment ?? null, previous?.investment ?? null),
          conversions: percentDelta(current?.conversions ?? null, previous?.conversions ?? null),
          cpa: percentDelta(current?.cpa ?? null, previous?.cpa ?? null),
        },
      };
    })
    .sort((left, right) => (right.d1?.investment ?? -1) - (left.d1?.investment ?? -1));

  return {
    referenceDate,
    previousDate,
    weekAgoDate,
    cards: table,
    table,
    campaigns,
  };
}

function averageNullable(values: Array<number | null>) {
  const available = values.filter((value): value is number => value != null);
  return available.length > 0 ? available.reduce((sum, value) => sum + value, 0) / available.length : null;
}

export function aggregateCampaigns(rows: AnalyticsRow[], goals: GoalConfig[], averageCpa: number) {
  const regionalGoals = new Map(
    goals
      .filter(goal => goal.goalType === "REGIONAL_LEADS")
      .map(goal => [goal.scopeKey, goal.monthlyLeadGoal] as const),
  );
  const grouped = new Map<string, AnalyticsRow[]>();
  for (const row of rows) grouped.set(row.campaign_id, [...(grouped.get(row.campaign_id) ?? []), row]);

  return Array.from(grouped.entries())
    .map(([campaignId, campaignRows]): AggregatedCampaign => {
      const sortedRows = [...campaignRows].sort((left, right) => left.date.localeCompare(right.date));
      const latest = sortedRows.at(-1)!;
      const totals = summarizeRows(campaignRows);
      const cpa = round(safeDivide(totals.spend, totals.conversions));
      const region = classifyRegion(latest.campaign);
      let status: CampaignHealth = "Saudável";
      if (totals.spend > 0 && totals.conversions <= 0) status = "Crítico";
      else if (averageCpa > 0 && cpa >= averageCpa * 2) status = "Crítico";
      else if (averageCpa > 0 && cpa >= averageCpa * 1.35) status = "Atenção";

      return {
        campaignId,
        campaign: latest.campaign,
        product: classifyProduct(latest.campaign),
        regionKey: region.key,
        region: region.label,
        regionType: region.type,
        monthlyLeadGoal: region.type === "regional" ? (regionalGoals.get(region.key) ?? null) : null,
        budget: round(latest.budget_amount ?? 0),
        googleStatus: latest.campaign_status,
        biddingStrategyType: latest.bidding_strategy_type,
        optimizationScore:
          latest.optimization_score == null ? null : round(latest.optimization_score * 100, 1),
        searchImpressionShare:
          latest.search_impression_share == null ? null : round(latest.search_impression_share * 100, 1),
        searchBudgetLostImpressionShare:
          averageNullable(campaignRows.map(row => row.search_budget_lost_impression_share)) == null
            ? null
            : round(
                (averageNullable(campaignRows.map(row => row.search_budget_lost_impression_share)) ?? 0) *
                  100,
                1,
              ),
        spend: round(totals.spend),
        conversions: round(totals.conversions, 1),
        clicks: round(totals.clicks),
        impressions: round(totals.impressions),
        cpa,
        ctr: round(safeDivide(totals.clicks, totals.impressions) * 100),
        cpc: round(safeDivide(totals.spend, totals.clicks)),
        conversionRate: round(safeDivide(totals.conversions, totals.clicks) * 100),
        status,
      };
    })
    .filter(campaign => campaign.googleStatus === "ENABLED" || campaign.spend > 0)
    .sort((left, right) => right.spend - left.spend);
}

export function buildPacing(rows: AnalyticsRow[], monthlyBudgetGoal: number | null) {
  const availableDates = Array.from(new Set(rows.map(row => row.date))).sort();
  const lastClosedDate = availableDates.at(-1) ?? null;
  if (!lastClosedDate || monthlyBudgetGoal == null || monthlyBudgetGoal <= 0) return null;

  const monthPrefix = lastClosedDate.slice(0, 7);
  const monthRows = rows.filter(row => row.date.startsWith(monthPrefix) && row.date <= lastClosedDate);
  const dailySpend = new Map<string, number>();
  for (const row of monthRows) dailySpend.set(row.date, (dailySpend.get(row.date) ?? 0) + row.spend);

  const totalDays = daysInMonth(lastClosedDate);
  const closedDays = parseUtcDate(lastClosedDate).getUTCDate();
  const remainingDays = Math.max(totalDays - closedDays, 0);
  const invested = round(Array.from(dailySpend.values()).reduce((sum, value) => sum + value, 0));
  const remaining = round(Math.max(monthlyBudgetGoal - invested, 0));
  const idealDaily = round(monthlyBudgetGoal / totalDays);
  const averageDaily = round(safeDivide(invested, closedDays));
  const idealDailyRemaining = remainingDays > 0 ? round(remaining / remainingDays) : 0;
  const projected = round(averageDaily * totalDays);
  const idealToDate = (monthlyBudgetGoal / totalDays) * closedDays;

  let realCumulative = 0;
  const series = Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    const date = `${monthPrefix}-${String(day).padStart(2, "0")}`;
    if (day <= closedDays) realCumulative += dailySpend.get(date) ?? 0;
    return {
      date,
      real: day <= closedDays ? round(realCumulative) : null,
      ideal: round((monthlyBudgetGoal / totalDays) * day),
      projection: round(averageDaily * day),
      monthlyGoal: round(monthlyBudgetGoal),
    };
  });

  return {
    competencia: monthPrefix,
    lastClosedDate,
    monthlyGoal: round(monthlyBudgetGoal),
    invested,
    remaining,
    projected,
    projectedDifference: round(projected - monthlyBudgetGoal),
    closedDays,
    remainingDays,
    totalDays,
    idealDaily,
    averageDaily,
    idealDailyRemaining,
    pacePercent: round(safeDivide(invested, idealToDate) * 100, 1),
    achievedPercent: round(safeDivide(invested, monthlyBudgetGoal) * 100, 1),
    projectedPercent: round(safeDivide(projected, monthlyBudgetGoal) * 100, 1),
    series,
  };
}

export function buildRankings(campaigns: AggregatedCampaign[]) {
  const isEligible = (campaign: AggregatedCampaign) =>
    campaign.spend > 0 && campaign.conversions >= MIN_RANKING_CONVERSIONS && campaign.cpa > 0;
  const eligible = campaigns.filter(isEligible);
  const excluded = campaigns.filter(campaign => !isEligible(campaign));
  const pick = (campaign: AggregatedCampaign) => ({
    campaignId: campaign.campaignId,
    campaign: campaign.campaign,
    product: campaign.product,
    conversions: campaign.conversions,
    spend: campaign.spend,
    cpa: campaign.cpa,
  });
  return {
    criteria: {
      minimumConversions: MIN_RANKING_CONVERSIONS,
      requirePositiveSpend: true,
      message: `Somente campanhas com investimento e ao menos ${MIN_RANKING_CONVERSIONS} conversões entram no ranking.`,
    },
    best: [...eligible].sort((left, right) => left.cpa - right.cpa).slice(0, 10).map(pick),
    worst: [...eligible].sort((left, right) => right.cpa - left.cpa).slice(0, 10).map(pick),
    excludedCount: excluded.length,
    excluded: excluded.map(campaign => ({
      campaignId: campaign.campaignId,
      campaign: campaign.campaign,
      spend: campaign.spend,
      conversions: campaign.conversions,
      reason:
        campaign.spend <= 0
          ? "Sem investimento no período."
          : campaign.conversions < MIN_RANKING_CONVERSIONS
            ? `Abaixo da amostra mínima de ${MIN_RANKING_CONVERSIONS} conversões.`
            : "CPA indisponível para comparação segura.",
    })),
  };
}

function aggregateDimension(
  campaigns: AggregatedCampaign[],
  dimension: (campaign: AggregatedCampaign) => { key: string; label: string },
) {
  const grouped = new Map<string, Totals & { key: string; label: string; monthlyLeadGoal: number }>();
  for (const campaign of campaigns) {
    const item = dimension(campaign);
    const current = grouped.get(item.key) ?? {
      key: item.key,
      label: item.label,
      spend: 0,
      conversions: 0,
      clicks: 0,
      impressions: 0,
      monthlyLeadGoal: 0,
    };
    current.spend += campaign.spend;
    current.conversions += campaign.conversions;
    current.clicks += campaign.clicks;
    current.impressions += campaign.impressions;
    current.monthlyLeadGoal = Math.max(current.monthlyLeadGoal, campaign.monthlyLeadGoal ?? 0);
    grouped.set(item.key, current);
  }
  return Array.from(grouped.values());
}

export function buildProductPerformance(campaigns: AggregatedCampaign[]) {
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  return aggregateDimension(campaigns, campaign => ({ key: campaign.product, label: campaign.product }))
    .map(item => ({
      product: item.label,
      spend: round(item.spend),
      conversions: round(item.conversions, 1),
      participation: round(safeDivide(item.spend, totalSpend) * 100, 1),
      ctr: round(safeDivide(item.clicks, item.impressions) * 100),
      cpa: round(safeDivide(item.spend, item.conversions)),
    }))
    .sort((left, right) => right.spend - left.spend);
}

export function buildRegionPerformance(campaigns: AggregatedCampaign[], averageCpa: number) {
  return aggregateDimension(campaigns, campaign => ({ key: campaign.regionKey, label: campaign.region }))
    .map(item => {
      const cpa = round(safeDivide(item.spend, item.conversions));
      const deviation = averageCpa > 0 ? round(((cpa - averageCpa) / averageCpa) * 100, 1) : 0;
      return {
        regionKey: item.key,
        region: item.label,
        spend: round(item.spend),
        conversions: round(item.conversions, 1),
        cpa,
        deviation,
        monthlyLeadGoal: item.monthlyLeadGoal || null,
        classification: deviation <= -15 ? "Favorável" : deviation >= 15 ? "Desfavorável" : "Neutro",
      };
    })
    .sort((left, right) => right.spend - left.spend);
}

function googleAdsSteps(actionType: string, campaign: AggregatedCampaign) {
  const base = [
    "Abra o Google Ads e selecione a conta 535-798-6801 — MG Motors.",
    `Localize a campanha pelo ID ${campaign.campaignId} e confirme o nome ${campaign.campaign}.`,
  ];
  if (actionType === "INCREASE_BUDGET") {
    return [
      ...base,
      "Acesse Campanhas > Orçamento e abra a edição do orçamento diário.",
      "Aplique um aumento gradual de até 10%, sem ultrapassar a verba mensal restante indicada no pacing.",
      "Salve, anote o valor anterior e monitore CPA, conversões e perda de impressões por orçamento por 3 dias fechados.",
    ];
  }
  if (actionType === "REDUCE_WASTE") {
    return [
      ...base,
      "Acesse Insights e relatórios > Termos de pesquisa, recursos e grupos de recursos, conforme o tipo da campanha.",
      "Identifique termos, recursos ou segmentos com gasto e ausência de conversões; não altere itens sem volume suficiente.",
      "Exclua ou restrinja somente os itens ineficientes confirmados e registre cada alteração na observação da tarefa.",
      "Mantenha o orçamento atual até haver 3 dias fechados para reavaliar o CPA.",
    ];
  }
  return [
    ...base,
    "Abra Configurações > Lances e confirme a estratégia atual antes de editar.",
    "Revise sinais, segmentação, recursos e meta de conversão que possam explicar o CPA acima da média.",
    "Faça uma única mudança por vez e registre o valor anterior, o novo valor e a justificativa.",
    "Aguarde ao menos 3 dias fechados antes de concluir o efeito da alteração.",
  ];
}

export function buildRecommendations(
  campaigns: AggregatedCampaign[],
  averageCpa: number,
  pacing: ReturnType<typeof buildPacing>,
) {
  const recommendations = campaigns
    .map(campaign => {
      const budgetLoss = campaign.searchBudgetLostImpressionShare;
      const underPace = pacing != null && pacing.pacePercent < 95;
      const efficient = averageCpa > 0 && campaign.cpa > 0 && campaign.cpa <= averageCpa * 1.15;
      const hasRegionalEvidence = campaign.regionType === "regional" && campaign.monthlyLeadGoal != null;
      const canIncreaseBudget =
        campaign.googleStatus === "ENABLED" &&
        underPace &&
        efficient &&
        hasRegionalEvidence &&
        budgetLoss != null &&
        budgetLoss >= 20 &&
        campaign.conversions >= MIN_RANKING_CONVERSIONS;

      let actionType: "INCREASE_BUDGET" | "REDUCE_WASTE" | "REVIEW_BIDDING" | null = null;
      if (campaign.status === "Crítico") actionType = campaign.conversions <= 0 ? "REDUCE_WASTE" : "REVIEW_BIDDING";
      else if (campaign.status === "Atenção") actionType = "REVIEW_BIDDING";
      else if (canIncreaseBudget) actionType = "INCREASE_BUDGET";
      if (!actionType) return null;

      const budgetIncreaseBlockedReasons = canIncreaseBudget
        ? []
        : [
            campaign.googleStatus !== "ENABLED" ? "A campanha não está ativa no Google Ads." : null,
            !underPace ? "A conta não está abaixo do ritmo ideal de investimento." : null,
            !efficient ? "O CPA não está dentro da faixa eficiente para escalar." : null,
            !hasRegionalEvidence ? "A região ou a meta regional não foi identificada com segurança." : null,
            budgetLoss == null ? "A perda de impressões por orçamento está indisponível." : null,
            budgetLoss != null && budgetLoss < 20 ? "A perda de impressões por orçamento é inferior a 20%." : null,
            campaign.conversions < MIN_RANKING_CONVERSIONS ? "A amostra de conversões é insuficiente." : null,
          ].filter((reason): reason is string => reason != null);

      const priority = campaign.status === "Crítico" ? "CRITICAL" : actionType === "INCREASE_BUDGET" ? "MEDIUM" : "HIGH";
      const description =
        actionType === "INCREASE_BUDGET"
          ? "Aumentar gradualmente o orçamento diário e monitorar eficiência."
          : actionType === "REDUCE_WASTE"
            ? "Reduzir desperdício antes de qualquer aumento de orçamento."
            : "Revisar lances, sinais e segmentação mantendo o orçamento até o CPA melhorar.";
      const rationale =
        actionType === "INCREASE_BUDGET"
          ? `CPA eficiente, ${budgetLoss}% de perda de impressões por orçamento, meta regional identificada e pacing abaixo do ideal.`
          : campaign.conversions <= 0
            ? "Há investimento real sem conversões no período; escalar orçamento aumentaria o risco de desperdício."
            : `CPA de R$ ${campaign.cpa.toFixed(2)} está acima da referência de R$ ${averageCpa.toFixed(2)} do período.`;

      return {
        sourceSignature: `${campaign.campaignId}:${actionType}`,
        campaignId: campaign.campaignId,
        campaign: campaign.campaign,
        product: campaign.product,
        region: campaign.regionType === "regional" ? campaign.region : null,
        monthlyLeadGoal: hasRegionalEvidence ? campaign.monthlyLeadGoal : null,
        actionType,
        description,
        rationale,
        evidence: {
          status: campaign.status,
          spend: campaign.spend,
          conversions: campaign.conversions,
          cpa: campaign.cpa,
          averageCpa,
          dailyBudget: campaign.budget,
          searchBudgetLostImpressionShare: budgetLoss,
          pacingPercent: pacing?.pacePercent ?? null,
          monthlyLeadGoal: hasRegionalEvidence ? campaign.monthlyLeadGoal : null,
        },
        expectedImpact:
          actionType === "INCREASE_BUDGET"
            ? "Capturar demanda perdida por orçamento preservando o CPA dentro da faixa eficiente."
            : "Reduzir gasto ineficiente e aproximar o CPA da média da conta sem escalar verba prematuramente.",
        risk:
          actionType === "INCREASE_BUDGET"
            ? "O CPA pode subir após a expansão; interromper novos aumentos se a eficiência piorar."
            : "Alterações simultâneas podem impedir a leitura do efeito; executar uma mudança por vez.",
        priority,
        steps: googleAdsSteps(actionType, campaign),
        budgetIncreaseEligible: canIncreaseBudget,
        budgetIncreaseBlockedReasons,
      };
    })
    .filter((recommendation): recommendation is NonNullable<typeof recommendation> => recommendation != null)
    .sort((left, right) => {
      const order: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return order[left.priority] - order[right.priority] || right.evidence.spend - left.evidence.spend;
    });

  return {
    recommendations,
    policy: {
      onePrimaryActionPerCampaign: true,
      minimumConversionsForScaling: MIN_RANKING_CONVERSIONS,
      minimumBudgetLossForScaling: 20,
      requiresRegionalGoalForScaling: true,
      message:
        "Aumentos de orçamento só são sugeridos com CPA eficiente, pacing abaixo do ideal, meta regional inequívoca, amostra mínima e perda real de impressões por orçamento.",
    },
  };
}
