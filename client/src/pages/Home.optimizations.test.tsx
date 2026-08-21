import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("../../../server/routers.ts", import.meta.url), "utf8");

describe("política de navegação do dashboard", () => {
  it("identifica mgsales e entrega Leads em modo somente leitura", () => {
    expect(homeSource).toContain('return username.trim().toLowerCase() === "mgsales"');
    expect(homeSource).toContain("const leadsReadOnly = isMgSalesReadOnlyUsername(session.username)");
    expect(homeSource).toContain("readOnly={leadsReadOnly}");
    expect(homeSource).toContain("canImportLeads={permissions.canImportLeads && !leadsReadOnly}");
  });
});

describe("interface de campanhas Google Ads ativas", () => {
  it("explicita que a tabela considera somente campanhas ENABLED", () => {
    expect(homeSource).toContain("Performance por Campanha Ativa");
    expect(homeSource).toContain("Somente campanhas ENABLED no Google Ads");
    expect(homeSource).toContain("data.metadata.campaignCount");
  });
});

describe("interface aprofundada de Otimizações", () => {
  it("expõe parâmetros de origem e destino, estratégias, evidências, impacto, risco e execução", () => {
    expect(homeSource).toContain("Alteração recomendada");
    expect(homeSource).toContain("Estratégia atual");
    expect(homeSource).toContain("Estratégia recomendada");
    expect(homeSource).toContain("CPA atual");
    expect(homeSource).toContain("CPA-alvo sugerido");
    expect(homeSource).toContain("Impacto esperado");
    expect(homeSource).toContain("Risco e critério de parada");
    expect(homeSource).toContain("Ver evidências, impacto, risco e passo a passo");
    expect(homeSource).toContain("formatOptimizationValue");
    expect(homeSource).toContain('IMPROVE_CVR: "Melhorar taxa de conversão"');
    expect(homeSource).toContain('REFRESH_CREATIVE: "Renovar criativos"');
    expect(homeSource).toContain("min-w-0 max-w-full overflow-hidden");
    expect(homeSource).toContain("sm:grid-cols-2");
  });

  it("deixa o comentário explicitamente opcional no formulário e no contrato RPC", () => {
    expect(homeSource).toContain("Comentário opcional");
    expect(homeSource).toContain("Você pode concluir sem preencher este campo");
    expect(homeSource).not.toContain("minLength={3}");
    expect(routerSource).toContain('notes: z.string().trim().max(4_000).optional().default("")');
  });

  it("distingue recomendações e tarefas de CPA em observação, consolida legadas e registra negativas aplicadas", () => {
    expect(homeSource).toContain("eligibleRecommendationCount");
    expect(homeSource).toContain("cooldownRecommendations");
    expect(homeSource).toContain("em observação");
    expect(homeSource).toContain("Nova análise elegível em");
    expect(homeSource).toContain("eligibility.daysRemaining");
    expect(homeSource).toContain("taskExecutionEligibility");
    expect(homeSource).toContain('status === "LEGACY_DUPLICATE"');
    expect(homeSource).toContain("tarefa(s) operacional(is)");
    expect(homeSource).toContain("duplicata(s) legada(s) consolidada(s)");
    expect(homeSource).toContain("Quarentena de CPA");
    expect(homeSource).toContain("Execução temporariamente bloqueada");
    expect(homeSource).toContain("isTaskQuarantined ? (");
    expect(homeSource).toContain("toISOString().slice(0, 10)");
    expect(homeSource).not.toContain("formatLongDate(new Date(eligibility.nextEligibleAt).toISOString())");
    expect(homeSource).not.toContain("formatLongDate(new Date(executionEligibility.nextEligibleAt).toISOString())");
    expect(homeSource).toContain("Negativas aplicadas");
    expect(homeSource).toContain("parseNegativeKeywordList");
    expect(homeSource).toContain("negativeKeywordsRecorded");
    expect(homeSource).toContain("somente as");
    expect(homeSource).toContain("elegíveis");
  });
});
