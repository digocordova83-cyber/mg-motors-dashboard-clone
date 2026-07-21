import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChannelUpdatingNotice } from "./LeadsTab";

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

describe("Área de avisos de Leads", () => {
  it("não mantém o aviso específico da Webmotors e preserva o alerta geral", () => {
    const source = readFileSync(new URL("./LeadsTab.tsx", import.meta.url), "utf8");

    expect(source).not.toContain("WebmotorsPendingNotice");
    expect(source).not.toContain("webmotors-pending-notice");
    expect(source).not.toContain("Dados recentes da Webmotors pendentes");
    expect(source).toContain("<ChannelUpdatingNotice");
  });
});
