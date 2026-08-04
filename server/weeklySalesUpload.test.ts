import { describe, expect, it } from "vitest";

import {
  decodeWeeklySalesBase64,
  describeWeeklySalesFile,
  inferWeeklySalesReportDate,
  resolveWeeklySalesCompetence,
  resolveWeeklySalesCompetenceWithPolicy,
} from "./weeklySalesUpload";

const PDF_BYTES = Buffer.from("%PDF-1.7\nretail-table");
const CSV_BYTES = Buffer.from("Dealer;W1 TGT;W1 Retail\nDealer A;10;8\n", "utf8");

function asDataUrl(mimeType: string, bytes: Buffer): string {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

describe("upload de vendas semanais CSV/PDF", () => {
  it("decodifica o Data URL PDF real do navegador e preserva MIME e bytes", () => {
    const upload = decodeWeeklySalesBase64(asDataUrl("application/pdf", PDF_BYTES));

    expect(upload.declaredMimeType).toBe("application/pdf");
    expect(upload.bytes).toEqual(PDF_BYTES);
  });

  it("mantém compatibilidade com Base64 CSV sem prefixo", () => {
    const upload = decodeWeeklySalesBase64(CSV_BYTES.toString("base64"));

    expect(upload.declaredMimeType).toBeNull();
    expect(upload.bytes).toEqual(CSV_BYTES);
  });

  it("classifica PDF pela assinatura e sanitiza apenas o nome persistido", () => {
    expect(
      describeWeeklySalesFile({
        fileName: "../../Relatório Diário Retail.pdf",
        bytes: PDF_BYTES,
        declaredMimeType: "application/pdf",
      }),
    ).toEqual({
      fileName: "Relatorio_Diario_Retail.pdf",
      kind: "PDF",
      contentType: "application/pdf",
    });
  });

  it("classifica o relatório fechado em 31/07 como histórico de julho mesmo na tela de agosto", () => {
    expect(inferWeeklySalesReportDate("260731_Daily_Sales_Planning_Report.pdf")).toBe(
      "2026-07-31",
    );
    expect(
      resolveWeeklySalesCompetence(
        "260731_Daily_Sales_Planning_Report.pdf",
        "2026-08",
      ),
    ).toBe("2026-07");
  });

  it.each([
    "260801_Daily_Sales_Planning_Report.pdf",
    "260803_Daily_Sales_Planning_Report.pdf",
    "260815_Daily_Sales_Planning_Report.pdf",
    "20260831_Daily_Sales_Planning_Report.pdf",
  ])("classifica os próximos relatórios datados como agosto: %s", fileName => {
    expect(resolveWeeklySalesCompetence(fileName, "2026-07")).toBe("2026-08");
  });

  it("mantém o relatório 260803 em julho somente quando a política interna é explícita", () => {
    expect(
      resolveWeeklySalesCompetenceWithPolicy(
        "260803_Daily_Sales_Planning_Report.pdf",
        "2026-07",
        "EXPLICIT",
      ),
    ).toBe("2026-07");
    expect(
      resolveWeeklySalesCompetenceWithPolicy(
        "260803_Daily_Sales_Planning_Report.pdf",
        "2026-07",
      ),
    ).toBe("2026-08");
  });

  it("mantém a competência da tela quando o arquivo não possui uma data válida", () => {
    expect(resolveWeeklySalesCompetence("Daily_Sales_Planning_Report.pdf", "2026-08")).toBe(
      "2026-08",
    );
    expect(resolveWeeklySalesCompetence("260231_Daily_Sales_Planning_Report.pdf", "2026-08")).toBe(
      "2026-08",
    );
  });

  it("aceita MIME genérico quando extensão e assinatura PDF são coerentes", () => {
    expect(
      describeWeeklySalesFile({
        fileName: "daily-sales.pdf",
        bytes: PDF_BYTES,
        declaredMimeType: "application/octet-stream",
      }).kind,
    ).toBe("PDF");
  });

  it("classifica CSV textual pelo conteúdo, extensão e MIME", () => {
    expect(
      describeWeeklySalesFile({
        fileName: "weekly-sales.csv",
        bytes: CSV_BYTES,
        declaredMimeType: "text/csv",
      }),
    ).toEqual({
      fileName: "weekly-sales.csv",
      kind: "CSV",
      contentType: "text/csv; charset=utf-8",
    });
  });

  it.each([
    {
      label: "extensão PDF com conteúdo CSV",
      fileName: "weekly-sales.pdf",
      bytes: CSV_BYTES,
      declaredMimeType: "application/pdf",
    },
    {
      label: "extensão CSV com assinatura PDF",
      fileName: "weekly-sales.csv",
      bytes: PDF_BYTES,
      declaredMimeType: "application/pdf",
    },
    {
      label: "MIME CSV com assinatura PDF",
      fileName: "weekly-sales.pdf",
      bytes: PDF_BYTES,
      declaredMimeType: "text/csv",
    },
  ])("rejeita $label com mensagem específica", input => {
    expect(() => describeWeeklySalesFile(input)).toThrow(
      "A extensão, o tipo e o conteúdo do arquivo não correspondem",
    );
  });

  it("rejeita extensão não permitida mesmo quando o conteúdo é textual", () => {
    expect(() =>
      describeWeeklySalesFile({
        fileName: "weekly-sales.txt",
        bytes: CSV_BYTES,
        declaredMimeType: "text/plain",
      }),
    ).toThrow("Selecione um arquivo de vendas no formato CSV ou PDF");
  });

  it("rejeita conteúdo binário disfarçado de CSV", () => {
    expect(() =>
      describeWeeklySalesFile({
        fileName: "weekly-sales.csv",
        bytes: Buffer.from([0, 1, 2, 3]),
        declaredMimeType: "text/csv",
      }),
    ).toThrow("não corresponde a um CSV de texto válido");
  });

  it.each([
    "data:application/pdf;base64,%%%",
    "data:application/pdf,%PDF-1.7",
    "not-base64",
  ])("rejeita payload Base64 corrompido: %s", payload => {
    expect(() => decodeWeeklySalesBase64(payload)).toThrow(/Data URL Base64 válido|corrompido/);
  });
});
