import { beforeEach, describe, expect, it, vi } from "vitest";

const llmMocks = vi.hoisted(() => ({
  invokeLLM: vi.fn(),
  listLLMModels: vi.fn(),
}));

vi.mock("./_core/llm", () => llmMocks);

import {
  buildWeeklySalesPreviewFromPdfExtraction,
  parseWeeklySalesPdf,
  type WeeklySalesPdfExtraction,
} from "./weeklySalesPdf";

const PDF = Buffer.from("%PDF-1.7\nweekly-sales-test", "ascii");

function metric(
  target: number,
  retail: number | null,
  achievementPercent: number | null,
) {
  return { target, retail, achievementPercent };
}

function extraction(
  overrides: Partial<WeeklySalesPdfExtraction> = {},
): WeeklySalesPdfExtraction {
  const populated = {
    "1": metric(10.5, 2, 19.05),
    "2": metric(21.25, 5, 23.53),
    "3": metric(31.75, 8, 25.2),
    "4": metric(42.4, 12, 28.3),
    "5": metric(53, null, null),
  };
  return {
    tableTitle: "Weekly Target Achievement - Retail",
    rows: [
      { name: "R01", weeks: populated },
      { name: "BALTIC BARUERI", weeks: populated },
      { name: "Total", weeks: populated },
    ],
    ...overrides,
  };
}

describe("Weekly Target Achievement PDF", () => {
  beforeEach(() => {
    llmMocks.invokeLLM.mockReset();
    llmMocks.listLLMModels.mockResolvedValue({
      data: [{ id: "gemini-3-flash-preview" }],
    });
  });

  it("normaliza a tabela Retail, preserva decimais e células vazias e aplica o de/para", () => {
    const preview = buildWeeklySalesPreviewFromPdfExtraction(PDF, extraction());

    expect(preview.errors).toEqual([]);
    expect(preview.summary).toMatchObject({
      rowsTotal: 3,
      dealerRows: 1,
      regionRows: 1,
      totalRows: 1,
      referenceWeek: 4,
      dealersWithoutReferenceSales: 0,
      referenceDealerSalesTotal: 12,
      referenceRegionSalesTotal: 12,
      referenceReportedSalesTotal: 12,
      week4DealerSalesTotal: 12,
      week4RegionSalesTotal: 12,
      week4ReportedSalesTotal: 12,
      reconciliationPassed: true,
    });
    expect(preview.rows[1]).toMatchObject({
      sourceName: "BALTIC BARUERI",
      rowType: "DEALER",
      canonicalDealer: "Baltic Shopping Tamboré",
      explicitMapping: true,
    });
    expect(preview.rows[1]?.weeks["4"]?.target).toBe(42.4);
    expect(preview.rows[1]?.weeks["5"]).toEqual({
      target: 53,
      retail: null,
      achievementPercent: null,
    });
  });

  it("passa a usar W5 quando o PDF contém Retail reconciliado nessa semana", () => {
    const base = extraction();
    const rows = base.rows.map(row => ({
      ...row,
      weeks: { ...row.weeks, "5": metric(53, 15, 28.3) },
    }));
    const preview = buildWeeklySalesPreviewFromPdfExtraction(PDF, { ...base, rows });

    expect(preview.errors).toEqual([]);
    expect(preview.summary).toMatchObject({
      referenceWeek: 5,
      referenceDealerSalesTotal: 15,
      referenceRegionSalesTotal: 15,
      referenceReportedSalesTotal: 15,
      reconciliationPassed: true,
    });
    expect(preview.rows[1]?.weeks["5"]).toEqual({
      target: 53,
      retail: 15,
      achievementPercent: 28.3,
    });
  });

  it("rejeita a tabela Registration mesmo quando sua estrutura é semelhante", () => {
    const preview = buildWeeklySalesPreviewFromPdfExtraction(
      PDF,
      extraction({ tableTitle: "Weekly Target Achievement - Registration" }),
    );

    expect(preview.errors).toContain(
      "Tabela incorreta: esperada “Weekly Target Achievement - Retail”; encontrada “Weekly Target Achievement - Registration”.",
    );
  });

  it("rejeita duplicatas, percentual inconsistente e totais semanais divergentes", () => {
    const base = extraction();
    const preview = buildWeeklySalesPreviewFromPdfExtraction(PDF, {
      ...base,
      rows: [
        base.rows[0]!,
        base.rows[1]!,
        { ...base.rows[1]!, weeks: { ...base.rows[1]!.weeks, "4": metric(42.4, 1, 90) } },
        base.rows[2]!,
      ],
    });

    expect(preview.errors).toContain("Concessionárias repetidas na tabela Retail: BALTIC BARUERI.");
    expect(preview.errors).toContain(
      "Linha 4 (BALTIC BARUERI): percentual da Semana 4 incompatível com meta e vendas.",
    );
    expect(preview.errors).toContain(
      "A soma das vendas da Semana 4 não reconcilia entre concessionárias, regiões e TOTAL.",
    );
  });

  it("rejeita bytes que não correspondem a um PDF", () => {
    expect(() =>
      buildWeeklySalesPreviewFromPdfExtraction(Buffer.from("not-a-pdf"), extraction()),
    ).toThrow("assinatura PDF válida");
  });

  it("envia o PDF ao modelo multimodal com JSON estrito e valida a resposta antes da prévia", async () => {
    llmMocks.invokeLLM.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(extraction()) } }],
    });

    const preview = await parseWeeklySalesPdf(PDF);

    expect(preview.errors).toEqual([]);
    expect(llmMocks.invokeLLM).toHaveBeenCalledTimes(1);
    const request = llmMocks.invokeLLM.mock.calls[0]?.[0];
    expect(request).toMatchObject({
      response_format: {
        type: "json_schema",
        json_schema: { name: "weekly_target_achievement_retail", strict: true },
      },
    });
    expect(request.messages[1].content[1]).toMatchObject({
      type: "file_url",
      file_url: {
        mime_type: "application/pdf",
        url: expect.stringMatching(/^data:application\/pdf;base64,/),
      },
    });
  });

  it("falha de forma legível quando a saída estruturada do PDF é inválida", async () => {
    llmMocks.invokeLLM.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ tableTitle: "Retail", rows: [] }) } }],
    });

    await expect(parseWeeklySalesPdf(PDF)).rejects.toThrow(
      "Não foi possível validar a tabela Retail extraída do PDF.",
    );
  });
});
