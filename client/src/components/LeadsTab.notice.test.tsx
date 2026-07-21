import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChannelUpdatingNotice, WebmotorsPendingNotice } from "./LeadsTab";

describe("ChannelUpdatingNotice", () => {
  it("lista em português somente os canais elegíveis com zero Leads", () => {
    const markup = renderToStaticMarkup(
      <ChannelUpdatingNotice
        locale="pt-BR"
        date="2026-07-20"
        channels={["Meta", "Webmotors", "Campanha Urban"]}
      />,
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain("Em atualização");
    expect(markup).toContain("Meta · 0 Leads");
    expect(markup).toContain("Webmotors · 0 Leads");
    expect(markup).toContain("removido automaticamente");
    expect(markup).not.toContain("Campanha Urban");
  });

  it("mantém a mensagem equivalente em inglês para a conta mgmotors", () => {
    const markup = renderToStaticMarkup(
      <ChannelUpdatingNotice locale="en-US" date="2026-07-20" channels={["Meta"]} />,
    );

    expect(markup).toContain("Updating");
    expect(markup).toContain("0 Leads");
    expect(markup).toContain("removed automatically");
  });

  it("não renderiza alerta quando nenhum canal elegível está zerado", () => {
    expect(
      renderToStaticMarkup(
        <ChannelUpdatingNotice locale="pt-BR" date="2026-07-20" channels={[]} />,
      ),
    ).toBe("");
    expect(
      renderToStaticMarkup(
        <ChannelUpdatingNotice
          locale="pt-BR"
          date="2026-07-20"
          channels={["Campanha Urban"]}
        />,
      ),
    ).toBe("");
  });
});

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
