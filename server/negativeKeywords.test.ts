import { describe, expect, it } from "vitest";
import {
  normalizeNegativeKeywordTerm,
  parseNegativeKeywordLine,
  parseNegativeKeywordList,
} from "../shared/negativeKeywords";

describe("palavras-chave negativas aplicadas", () => {
  it("interpreta correspondências ampla, de frase e exata sem alterar o termo exibido", () => {
    expect(parseNegativeKeywordLine("financiamento usado")).toEqual({
      term: "financiamento usado",
      normalizedTerm: "financiamento usado",
      matchType: "BROAD",
    });
    expect(parseNegativeKeywordLine('  "carro usado"  ')).toEqual({
      term: "carro usado",
      normalizedTerm: "carro usado",
      matchType: "PHRASE",
    });
    expect(parseNegativeKeywordLine("[manual grátis]")).toEqual({
      term: "manual grátis",
      normalizedTerm: "manual grátis",
      matchType: "EXACT",
    });
  });

  it("normaliza espaços, caixa e Unicode para deduplicar termos equivalentes por tipo de correspondência", () => {
    expect(normalizeNegativeKeywordTerm("  GRÁTIS   Online  ")).toBe("grátis online");
    expect(
      parseNegativeKeywordList('GRÁTIS   Online\ngrátis online\n"grátis online"\n[GRÁTIS ONLINE]\n\n'),
    ).toEqual([
      { term: "GRÁTIS Online", normalizedTerm: "grátis online", matchType: "BROAD" },
      { term: "grátis online", normalizedTerm: "grátis online", matchType: "PHRASE" },
      { term: "GRÁTIS ONLINE", normalizedTerm: "grátis online", matchType: "EXACT" },
    ]);
  });

  it("ignora linhas vazias e rejeita termos acima do limite", () => {
    expect(parseNegativeKeywordLine("   ")).toBeNull();
    expect(() => parseNegativeKeywordLine("x".repeat(501))).toThrow(
      "Cada palavra-chave negativa deve ter no máximo 500 caracteres.",
    );
  });
});
