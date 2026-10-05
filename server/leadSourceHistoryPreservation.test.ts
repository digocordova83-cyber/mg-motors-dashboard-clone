import { describe, expect, it } from "vitest";

import { parseLeadCsv } from "./leadsCsv";
import { mergeMissingCanonicalLeads } from "./leadSourceHistoryPreservation";

const header = [
  "Data",
  "Modelo",
  "Região/Estado",
  "Cidade",
  "Concessionaria",
  "Nome",
  "Email",
  "Telefone",
  "Canal",
  "Data Corrigida",
  "Concessionarias corrijida",
  "Canal de Origem",
].join(",");

function csv(rows: string[]): Buffer {
  return Buffer.from(`\uFEFF${header}\n${rows.join("\n")}\n`, "utf8");
}

function storedFrom(bytes: Buffer) {
  return parseLeadCsv(bytes, "2026-10-04").records.map(record => ({
    contentHash: record.contentHash,
    correctedDate: record.correctedDate,
    channel: record.channel,
    sourceChannel: record.sourceChannel,
    model: record.model,
    sourceDateRaw: record.sourceDateRaw,
    dealerName: record.dealerName,
    contactName: record.contactName,
    email: record.email,
    phone: record.phone,
    rawPayload: record.rawPayload,
  }));
}

describe("preservação canônica de histórico de Leads", () => {
  it("reinsere somente Leads históricos que desapareceram integralmente da fonte", () => {
    const original = csv([
      "2026-10-01,MG4,SP,São Paulo,Dealer A,Ana,ana@example.com,11990000001,Meta,01/10/2026,Dealer A,Meta",
      "2026-10-01,MG4 URBAN,SP,São Paulo,Dealer B,Bruno,bruno@example.com,11990000002,Meta,01/10/2026,Dealer B,Meta",
    ]);
    const candidate = csv([
      "2026-10-01,MG4,SP,São Paulo,Dealer A,Ana,ana@example.com,11990000001,Meta,01/10/2026,Dealer A,Meta",
    ]);

    const result = mergeMissingCanonicalLeads({
      bytes: candidate,
      storedLeads: storedFrom(original),
      fallbackDate: "2026-10-04",
    });

    const merged = parseLeadCsv(result.bytes, "2026-10-04");
    expect(result).toMatchObject({
      preservedCount: 1,
      sourceCorrectionCount: 0,
      preservedByChannel: { "Campanha Urban": 1 },
      preservedBySourceChannel: { Meta: 1 },
      preservedDateFrom: "2026-10-01",
      preservedDateTo: "2026-10-01",
    });
    expect(merged.records).toHaveLength(2);
  });

  it("não preserva uma cópia quando a fonte entrega a mesma identidade com correção", () => {
    const original = csv([
      "2026-10-01,CYBERSTER,SP,São Paulo,Dealer A,Ana,ana@example.com,11990000001,Meta,01/10/2026,Dealer A,Meta",
    ]);
    const candidate = csv([
      "2026-10-01,CYBERSTER,SP,São Paulo,Dealer A,Ana,ana@example.com,11990000001,Meta,04/10/2026,Dealer A,Meta",
    ]);

    const result = mergeMissingCanonicalLeads({
      bytes: candidate,
      storedLeads: storedFrom(original),
      fallbackDate: "2026-10-04",
    });

    const merged = parseLeadCsv(result.bytes, "2026-10-04");
    expect(result).toMatchObject({ preservedCount: 0, sourceCorrectionCount: 1 });
    expect(merged.records).toHaveLength(1);
    expect(merged.records[0]?.correctedDate).toBe("2026-10-04");
  });
});
