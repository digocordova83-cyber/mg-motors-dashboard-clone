import { describe, expect, it } from "vitest";
import {
  getYesterdayInSaoPaulo,
  LEAD_CSV_HEADERS,
  LeadCsvValidationError,
  parseLeadCsv,
  parseCorrectedLeadDate,
} from "./leadsCsv";
import { decodeLeadCsvBase64, sanitizeLeadCsvFileName } from "./leadsImportService";

const header = LEAD_CSV_HEADERS.join(",");

function csv(...rows: string[]): Buffer {
  return Buffer.from(`\ufeff${header}\n${rows.join("\n")}\n`, "utf-8");
}

describe("parseLeadCsv", () => {
  it("interpreta BOM, aspas e normaliza canal, UF e concessionária sem perder os valores brutos", () => {
    const result = parseLeadCsv(
      csv(
        [
          "2026-07-19T12:30:00",
          "MG4",
          "São Paulo",
          '"São Paulo, Capital"',
          "whatsapp_",
          "Pessoa Teste",
          "TESTE@EXAMPLE.COM",
          '"(11) 99999-0000"',
          "Weebmotors",
          "19/07/2026",
          "MG SUL - MATRIZ",
        ].join(","),
      ),
    );

    expect(result.rowsTotal).toBe(1);
    expect(result.invalidRows).toBe(0);
    expect(result.records[0]).toMatchObject({
      correctedDate: "2026-07-19",
      channel: "Webmotors",
      channelRaw: "Weebmotors",
      region: "SP",
      regionRaw: "São Paulo",
      city: "São Paulo, Capital",
      dealerName: "MG SUL - MATRIZ",
      dealerRaw: "MG SUL - MATRIZ",
      email: "teste@example.com",
      phone: "11999990000",
    });
    expect(result.records[0].rawPayload.dealer).toBe("whatsapp_");
    expect(result.records[0].rawPayload.correctedDealer).toBe("MG SUL - MATRIZ");
  });

  it("corrige para 01/07 somente a assinatura exata dos 18 Leads do Mercado Livre", () => {
    const exactKnownOccurrence = [
      "Tue Jun 01 2026 00:00:00 GMT-0400 (Chile Standard Time)",
      "MG4",
      "SP",
      "São Paulo",
      "Dealer Original",
      "Pessoa A",
      "a@example.com",
      "11999990001",
      "Mercado Livre",
      "01/06/2026",
      "Dealer A",
    ].join(",");
    const differentChannel = [
      "Tue Jun 01 2026 00:00:00 GMT-0400 (Chile Standard Time)",
      "MG4",
      "SP",
      "São Paulo",
      "Dealer Original",
      "Pessoa B",
      "b@example.com",
      "11999990002",
      "Site",
      "01/06/2026",
      "Dealer A",
    ].join(",");
    const differentSourceDate = [
      "Wed Jun 02 2026 00:00:00 GMT-0400 (Chile Standard Time)",
      "MG4",
      "SP",
      "São Paulo",
      "Dealer Original",
      "Pessoa C",
      "c@example.com",
      "11999990003",
      "Mercado Livre",
      "01/06/2026",
      "Dealer A",
    ].join(",");

    const result = parseLeadCsv(csv(exactKnownOccurrence, differentChannel, differentSourceDate));

    expect(result.records.map(record => record.correctedDate)).toEqual([
      "2026-07-01",
      "2026-06-01",
      "2026-06-01",
    ]);
    expect(result.records[0].correctedDateRaw).toBe("01/06/2026");
    expect(result.records[0].rawPayload.correctedDate).toBe("01/06/2026");
    expect(result.dateFrom).toBe("2026-06-01");
    expect(result.dateTo).toBe("2026-07-01");
    expect(new Set(result.records.map(record => record.contentHash))).toHaveProperty("size", 3);
  });

  it("preserva a primeira ocorrência exata e descarta as repetições seguintes", () => {
    const base = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,Pessoa,teste@example.com,11999990000,Site,19/07/2026,Dealer A";
    const rerouted = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,Pessoa,teste@example.com,11999990000,Site,19/07/2026,Dealer B";
    const result = parseLeadCsv(csv(base, base, rerouted));

    expect(result.validRows).toBe(3);
    expect(result.uniqueValidRows).toBe(2);
    expect(result.duplicateRowsWithinFile).toBe(1);
    expect(result.duplicateRowsByChannel).toEqual([{ value: "Site", count: 1 }]);
    expect(result.records.map(record => record.dealerName)).toEqual(["Dealer A", "Dealer B"]);
    expect(new Set(result.records.map(record => record.recordHash))).toHaveProperty("size", 2);
    expect(result.records.every(record => record.recordHash === record.contentHash)).toBe(true);
    expect(result.records[0].sourceRowNumber).toBe(2);
  });

  it("descarta 99 repetições e mantém uma ocorrência importável e auditável", () => {
    const repeated = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,Pessoa,teste@example.com,11999990000,Site,19/07/2026,Dealer A";
    const result = parseLeadCsv(csv(...Array.from({ length: 100 }, () => repeated)));

    expect(result.rowsTotal).toBe(100);
    expect(result.validRows).toBe(100);
    expect(result.invalidRows).toBe(0);
    expect(result.uniqueValidRows).toBe(1);
    expect(result.duplicateRowsWithinFile).toBe(99);
    expect(result.duplicateRowsByChannel).toEqual([{ value: "Site", count: 99 }]);
    expect(result.rowsTotal).toBe(result.uniqueValidRows + result.duplicateRowsWithinFile + result.invalidRows);
    expect(result.records).toHaveLength(1);
    expect(new Set(result.records.map(record => record.recordHash))).toHaveProperty("size", 1);
    expect(new Set(result.records.map(record => record.contentHash))).toHaveProperty("size", 1);
    expect(result.records[0].sourceRowNumber).toBe(2);
  });

  it("contabiliza linhas sem Modelo ou Canal como inválidas", () => {
    const missingModel = "2026-07-19T12:30:00,,SP,São Paulo,Dealer Original,,,,Site,19/07/2026,Dealer A";
    const missingChannel = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,,,,,19/07/2026,Dealer A";
    const valid = "2026-07-20T12:30:00,MGS5,RJ,Rio de Janeiro,Dealer Original,,,,Meta,20/07/2026,Dealer B";
    const result = parseLeadCsv(csv(missingModel, missingChannel, valid));

    expect(result.rowsTotal).toBe(3);
    expect(result.invalidRows).toBe(2);
    expect(result.validRows).toBe(1);
    expect(result.errors.map(error => error.message)).toEqual([
      "Campos obrigatórios ausentes: Modelo.",
      "Campos obrigatórios ausentes: Canal.",
    ]);
  });

  it("aplica uma única data D-1 às linhas sem Data Corrigida e preserva o valor bruto vazio", () => {
    const missingDate = "2026-07-21T12:30:00,MG4,SP,São Paulo,Dealer Original,,,,Site,,Dealer A";
    const explicitDate = "2026-07-19T12:30:00,MGS5,RJ,Rio de Janeiro,Dealer Original,,,,Meta,19/07/2026,Dealer B";
    const result = parseLeadCsv(csv(missingDate, missingDate, explicitDate), "2026-07-20");

    expect(result).toMatchObject({
      rowsTotal: 3,
      validRows: 3,
      invalidRows: 0,
      fallbackDateUsed: "2026-07-20",
      fallbackDateCount: 2,
      dateFrom: "2026-07-19",
      dateTo: "2026-07-20",
    });
    expect(result.records).toHaveLength(2);
    expect(result.records[0]).toMatchObject({
      correctedDate: "2026-07-20",
      correctedDateRaw: "",
      sourceRowNumber: 2,
    });
    expect(result.records[0].rawPayload.correctedDate).toBe("");
    expect(result.duplicateRowsWithinFile).toBe(1);
  });

  it("mantém Data Corrigida inválida como erro em vez de aplicar o fallback", () => {
    const invalid = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,,,,Site,31/02/2026,Dealer A";
    const valid = "2026-07-20T12:30:00,MG4,Rio de Janeiro,Rio de Janeiro,Dealer Original,,,,Meta,20/07/2026,Dealer B";
    const result = parseLeadCsv(csv(invalid, valid));

    expect(result.rowsTotal).toBe(2);
    expect(result.invalidRows).toBe(1);
    expect(result.validRows).toBe(1);
    expect(result.errors).toEqual([
      expect.objectContaining({ rowNumber: 2, message: expect.stringContaining("Data Corrigida") }),
    ]);
    expect(result.dateFrom).toBe("2026-07-20");
  });

  it("rejeita cabeçalhos divergentes", () => {
    const bytes = Buffer.from("Data,Modelo,Canal\n2026-07-19,MG4,Site\n", "utf-8");
    expect(() => parseLeadCsv(bytes)).toThrowError(LeadCsvValidationError);
    expect(() => parseLeadCsv(bytes)).toThrowError(/Cabeçalhos inválidos/);
  });

  it("rejeita arquivos fora de UTF-8", () => {
    const bytes = Buffer.from([0xff, 0xfe, 0xfd]);
    expect(() => parseLeadCsv(bytes)).toThrowError(/UTF-8/);
  });
});

describe("datas e envelope do upload", () => {
  it("valida datas reais em formatos brasileiro e ISO", () => {
    expect(parseCorrectedLeadDate("29/02/2024")).toBe("2024-02-29");
    expect(parseCorrectedLeadDate("2026-07-19T23:59:00")).toBe("2026-07-19");
    expect(parseCorrectedLeadDate("29/02/2026")).toBeNull();
  });

  it("calcula ontem pelo calendário de São Paulo inclusive nas viradas de mês e ano", () => {
    expect(getYesterdayInSaoPaulo(new Date("2026-08-01T03:30:00.000Z"))).toBe("2026-07-31");
    expect(getYesterdayInSaoPaulo(new Date("2026-01-01T03:30:00.000Z"))).toBe("2025-12-31");
    expect(getYesterdayInSaoPaulo(new Date("2026-08-01T02:30:00.000Z"))).toBe("2026-07-30");
  });

  it("rejeita uma data de fallback inválida ou fora do formato ISO canônico", () => {
    const row = "2026-07-21T12:30:00,MG4,SP,São Paulo,Dealer Original,,,,Site,,Dealer A";
    expect(() => parseLeadCsv(csv(row), "31/07/2026")).toThrowError(/fallback/);
    expect(() => parseLeadCsv(csv(row), "2026-02-31")).toThrowError(/fallback/);
  });

  it("decodifica base64 estrito e sanitiza o nome do arquivo", () => {
    const source = csv("2026-07-19,MG4,SP,São Paulo,Dealer Original,,,,Site,19/07/2026,Dealer A");
    expect(decodeLeadCsvBase64(source.toString("base64"))).toEqual(source);
    expect(sanitizeLeadCsvFileName("C:\\dados\\Leads Julho 2026.csv")).toBe("Leads-Julho-2026.csv");
    expect(() => decodeLeadCsvBase64("isso-nao-e-base64")).toThrowError(/corrompido/);
    expect(() => sanitizeLeadCsvFileName("leads.xlsx")).toThrowError(/\.csv/);
  });
});
