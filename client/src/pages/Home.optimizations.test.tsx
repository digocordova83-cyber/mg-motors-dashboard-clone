import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("../../../server/routers.ts", import.meta.url), "utf8");

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
});
