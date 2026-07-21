import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ComparisonMetric } from "./OptimizationHistoryTab";

const NUMBER = (value: number) => value.toFixed(1);

describe("ComparisonMetric", () => {
  it("renderiza antes, depois, variação absoluta e variação percentual sem linguagem causal", () => {
    const html = renderToStaticMarkup(
      <ComparisonMetric
        label="CPA"
        before={100}
        after={80}
        absolute={-20}
        percent={-20}
        format={NUMBER}
        favorableWhenLower
      />,
    );

    expect(html).toContain("Antes");
    expect(html).toContain("100.0");
    expect(html).toContain("Depois");
    expect(html).toContain("80.0");
    expect(html).toContain("Δ abs.");
    expect(html).toContain("-20.0");
    expect(html).toContain("Δ %");
    expect(html).toContain("-20%");
    expect(html.toLowerCase()).not.toContain("causou");
    expect(html.toLowerCase()).not.toContain("provocou");
  });

  it("explicita indisponibilidade quando não há acompanhamento comparável", () => {
    const html = renderToStaticMarkup(
      <ComparisonMetric
        label="CTR"
        before={null}
        after={null}
        absolute={null}
        percent={null}
        format={NUMBER}
      />,
    );

    expect(html).toContain("Δ abs.");
    expect(html).toContain("Δ %");
    expect(html.match(/Indisponível/g)).toHaveLength(2);
  });
});
