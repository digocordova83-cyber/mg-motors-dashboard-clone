import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WebmotorsPendingNotice } from "./LeadsTab";

describe("WebmotorsPendingNotice", () => {
  it("informa em português que os dados recentes ainda não chegaram e preserva o histórico", () => {
    const markup = renderToStaticMarkup(<WebmotorsPendingNotice locale="pt-BR" />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain("Dados recentes da Webmotors pendentes");
    expect(markup).toContain("ainda não foram recebidos");
    expect(markup).toContain("registros históricos permanecem visíveis");
  });

  it("mantém a mesma informação na interface em inglês", () => {
    const markup = renderToStaticMarkup(<WebmotorsPendingNotice locale="en-US" />);

    expect(markup).toContain("Recent Webmotors data pending");
    expect(markup).toContain("has not yet been received");
    expect(markup).toContain("Historical records remain visible");
  });
});
