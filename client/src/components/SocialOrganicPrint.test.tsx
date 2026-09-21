import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  activateSocialOrganicPrintMode,
  buildSocialOrganicPdfTitle,
  SocialOrganicPdfButton,
} from "./SocialOrganicPrint";

describe("exportação PDF do Social Orgânico", () => {
  it("renderiza o botão nos dois idiomas", () => {
    const pt = renderToStaticMarkup(
      <SocialOrganicPdfButton locale="pt-BR" onPrint={() => undefined} />,
    );
    const en = renderToStaticMarkup(
      <SocialOrganicPdfButton locale="en-US" onPrint={() => undefined} />,
    );

    expect(pt).toContain("Exportar PDF");
    expect(en).toContain("Export PDF");
    expect(pt).toContain('data-testid="social-organic-pdf-button"');
  });

  it("gera nome de arquivo por plataforma e data de Brasília", () => {
    const generatedAt = new Date("2026-09-21T13:00:00.000Z");

    expect(buildSocialOrganicPdfTitle("instagram", generatedAt)).toBe(
      "MG Motors _ SOCIAL ORGANIC Instagram dashboard_21 Sept",
    );
    expect(buildSocialOrganicPdfTitle("tiktok", generatedAt)).toBe(
      "MG Motors _ SOCIAL ORGANIC TikTok dashboard_21 Sept",
    );
  });

  it("ativa o modo de impressão e restaura estado e título após afterprint", () => {
    const body = { dataset: {} as DOMStringMap };
    const page = { title: "MG Motors | Dashboard Operacional" };
    let printCalls = 0;
    let afterPrint: (() => void) | undefined;

    activateSocialOrganicPrintMode({
      body,
      page,
      pdfTitle: "MG Motors _ SOCIAL ORGANIC Instagram dashboard_21 Sept",
      print: () => {
        printCalls += 1;
      },
      addAfterPrintListener: listener => {
        afterPrint = listener;
      },
    });

    expect(body.dataset.printMode).toBe("social-organic");
    expect(page.title).toBe("MG Motors _ SOCIAL ORGANIC Instagram dashboard_21 Sept");
    expect(printCalls).toBe(1);

    afterPrint?.();
    expect(body.dataset.printMode).toBeUndefined();
    expect(page.title).toBe("MG Motors | Dashboard Operacional");
  });
});
