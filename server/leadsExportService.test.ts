import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import {
  buildLeadsExportWorkbook,
  deduplicateLeadExportRows,
  type LeadExportRow,
} from "./leadsExportService";

const ROWS: LeadExportRow[] = [
  {
    id: 10,
    contentHash: "hash-a",
    correctedDate: "2026-07-01",
    channel: "Google Ads",
    model: "MG4",
    region: "Sudeste",
    city: "Vitória",
    dealerName: "ORVEL - VITÓRIA",
    dealerRaw: "orvel_shopping_vitória_-_vitória/es_",
    contactName: "Primeiro Contato",
    email: "primeiro@example.com",
    phone: "+55 27 99999-0001",
    sourceDateRaw: "01/07/2026 08:30",
  },
  {
    id: 11,
    contentHash: "hash-a",
    correctedDate: "2026-07-01",
    channel: "Google Ads",
    model: "MG4",
    region: "Sudeste",
    city: "Vitória",
    dealerName: "ORVEL - VITÓRIA",
    dealerRaw: "orvel_shopping_vitória_-_vitória/es_",
    contactName: "Duplicata exata",
    email: "duplicata@example.com",
    phone: "+55 27 99999-0002",
    sourceDateRaw: "01/07/2026 08:31",
  },
  {
    id: 12,
    contentHash: "hash-b",
    correctedDate: "2026-07-02",
    channel: "Meta Ads",
    model: "MG ZS",
    region: "Sul",
    city: "Curitiba",
    dealerName: "DEALER B",
    dealerRaw: "Dealer B original",
    contactName: "Contato Distinto",
    email: "distinto@example.com",
    phone: "+55 41 99999-0003",
    sourceDateRaw: "02/07/2026 09:00",
  },
];

describe("exportação Excel da base de Leads", () => {
  it("preserva a primeira ocorrência de cada contentHash e mantém conteúdos distintos", () => {
    const unique = deduplicateLeadExportRows(ROWS);

    expect(unique.map(row => row.id)).toEqual([10, 12]);
  });

  it("gera Resumo e Base de Leads com contagens, filtros, congelamento e datas formatadas", async () => {
    const { buffer, summary } = await buildLeadsExportWorkbook({
      rows: ROWS,
      dateFrom: "2026-07-01",
      dateTo: "2026-07-22",
      locale: "pt-BR",
      generatedAt: new Date("2026-07-23T12:00:00.000Z"),
    });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const summarySheet = workbook.getWorksheet("Resumo");
    const dataSheet = workbook.getWorksheet("Base de Leads");

    expect(summary).toEqual({
      dateFrom: "2026-07-01",
      dateTo: "2026-07-22",
      filteredRows: 3,
      exportedRows: 2,
      duplicatesRemoved: 1,
    });
    expect(summarySheet).toBeDefined();
    expect(dataSheet).toBeDefined();
    expect(summarySheet?.getCell("B5").value).toBe(3);
    expect(summarySheet?.getCell("B6").value).toBe(2);
    expect(summarySheet?.getCell("B7").value).toBe(1);
    expect(summarySheet?.views[0]).toMatchObject({ state: "frozen", ySplit: 1 });
    expect(dataSheet?.views[0]).toMatchObject({ state: "frozen", ySplit: 1 });
    expect(dataSheet?.autoFilter).toBe("A1:K3");
    expect(dataSheet?.rowCount).toBe(3);
    expect(dataSheet?.getCell("A2").value).toBeInstanceOf(Date);
    expect(dataSheet?.getCell("A2").numFmt).toBe("dd/mm/yyyy");
    expect(dataSheet?.getCell("F2").value).toBe("ORVEL - VITÓRIA");
    expect(dataSheet?.getCell("G2").value).toBe("orvel_shopping_vitória_-_vitória/es_");
    expect(dataSheet?.getCell("H2").value).toBe("Primeiro Contato");
    expect(dataSheet?.getCell("H3").value).toBe("Contato Distinto");
  });

  it("localiza os nomes das abas e cabeçalhos para usuários em inglês", async () => {
    const { buffer } = await buildLeadsExportWorkbook({
      rows: ROWS.slice(0, 1),
      dateFrom: "2026-07-01",
      dateTo: "2026-07-01",
      locale: "en-US",
      generatedAt: new Date("2026-07-23T12:00:00.000Z"),
    });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    expect(workbook.worksheets.map(sheet => sheet.name)).toEqual(["Summary", "Leads Database"]);
    expect(workbook.getWorksheet("Leads Database")?.getRow(1).values).toContain("Corrected Date");
    expect(workbook.getWorksheet("Leads Database")?.getRow(1).values).toContain("Canonical Dealer");
  });
});
