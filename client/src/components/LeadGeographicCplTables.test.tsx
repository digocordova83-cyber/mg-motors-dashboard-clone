import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { LeadGeographicCplTables } from "./LeadGeographicCplTables";

type GeographicCplReference = ComponentProps<typeof LeadGeographicCplTables>["reference"];

const reference: GeographicCplReference = {
  dateFrom: "2026-08-01",
  dateTo: "2026-08-17",
  competence: "2026-08",
  formula: "ACTUAL_CHANNEL_SPEND_ALLOCATED_BY_DEALER_CHANNEL_TARGET_SHARE",
  stateDefinition: "DEALER_OPERATIONAL_STATE",
  allSourcesAvailable: true,
  status: "AVAILABLE",
  totalInvestment: 1_300,
  availableInvestment: 1_300,
  paidMediaLeads: 37,
  assignedPaidMediaLeads: 35,
  unavailableDealerPaidMediaLeads: 2,
  unmatchedDealerPaidMediaLeads: 0,
  dealerCoveragePercent: 94.59,
  estimatedOverallCpl: 35.14,
  targetTotals: { Site: 100, Meta: 100, TikTok: 100 },
  channels: [],
  states: [
    {
      stateCode: "SP",
      dealerCount: 1,
      leads: 16,
      investment: 670,
      availableInvestment: 670,
      estimatedCpl: 41.88,
      channelLeads: { Site: 10, Meta: 5, TikTok: 1 },
      channelInvestment: { Site: 600, Meta: 60, TikTok: 10 },
    },
  ],
  dealers: [
    {
      stateCode: "SP",
      dealerName: "DEALER A",
      leads: 16,
      investment: 670,
      availableInvestment: 670,
      estimatedCpl: 41.88,
      channelLeads: { Site: 10, Meta: 5, TikTok: 1 },
      channelInvestment: { Site: 600, Meta: 60, TikTok: 10 },
    },
  ],
};

describe("tabelas de CPL geográfico", () => {
  it("exibe estado, dealer, investimento, CPL e a metodologia estimada", () => {
    const html = renderToStaticMarkup(
      <LeadGeographicCplTables reference={reference} locale="pt-BR" />,
    ).replaceAll("\u00a0", " ");

    expect(html).toContain('data-testid="geographic-cpl-section"');
    expect(html).toContain('data-testid="geographic-cpl-state-table"');
    expect(html).toContain('data-testid="geographic-cpl-dealer-table"');
    expect(html).toContain('data-testid="geographic-cpl-methodology"');
    expect(html).toContain("CPL estimado por estado");
    expect(html).toContain("CPL estimado por dealer");
    expect(html).toContain("DEALER A");
    expect(html).toContain("R$ 670,00");
    expect(html).toContain("R$ 41,88");
    expect(html).toContain("Não é gasto observado diretamente por dealer");
    expect(html).toContain("94,59%");
    expect(html).toContain("max-h-[520px]");
  });
});
