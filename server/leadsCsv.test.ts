import { describe, expect, it } from "vitest";
import {
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

  it("preserva linhas integralmente repetidas e mantém a repetição apenas como informação", () => {
    const base = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,Pessoa,teste@example.com,11999990000,Site,19/07/2026,Dealer A";
    const rerouted = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,Pessoa,teste@example.com,11999990000,Site,19/07/2026,Dealer B";
    const result = parseLeadCsv(csv(base, base, rerouted));

    expect(result.validRows).toBe(3);
    expect(result.uniqueValidRows).toBe(2);
    expect(result.duplicateRowsWithinFile).toBe(1);
    expect(result.records.map(record => record.dealerName)).toEqual(["Dealer A", "Dealer A", "Dealer B"]);
    expect(new Set(result.records.map(record => record.recordHash))).toHaveProperty("size", 3);
    expect(result.records[0].contentHash).toBe(result.records[1].contentHash);
  });

  it("preserva 99 repetições como 100 ocorrências importáveis e auditáveis", () => {
    const repeated = "2026-07-19T12:30:00,MG4,SP,São Paulo,Dealer Original,Pessoa,teste@example.com,11999990000,Site,19/07/2026,Dealer A";
    const result = parseLeadCsv(csv(...Array.from({ length: 100 }, () => repeated)));

    expect(result.rowsTotal).toBe(100);
    expect(result.validRows).toBe(100);
    expect(result.invalidRows).toBe(0);
    expect(result.uniqueValidRows).toBe(1);
    expect(result.duplicateRowsWithinFile).toBe(99);
    expect(result.records).toHaveLength(100);
    expect(new Set(result.records.map(record => record.recordHash))).toHaveProperty("size", 100);
    expect(new Set(result.records.map(record => record.contentHash))).toHaveProperty("size", 1);
    expect(result.records.at(0)?.sourceRowNumber).toBe(2);
    expect(result.records.at(-1)?.sourceRowNumber).toBe(101);
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

  it("marca Data Corrigida inválida por linha e mantém as linhas válidas para pré-validação", () => {
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

  it("decodifica base64 estrito e sanitiza o nome do arquivo", () => {
    const source = csv("2026-07-19,MG4,SP,São Paulo,Dealer Original,,,,Site,19/07/2026,Dealer A");
    expect(decodeLeadCsvBase64(source.toString("base64"))).toEqual(source);
    expect(sanitizeLeadCsvFileName("C:\\dados\\Leads Julho 2026.csv")).toBe("Leads-Julho-2026.csv");
    expect(() => decodeLeadCsvBase64("isso-nao-e-base64")).toThrowError(/corrompido/);
    expect(() => sanitizeLeadCsvFileName("leads.xlsx")).toThrowError(/\.csv/);
  });
});
