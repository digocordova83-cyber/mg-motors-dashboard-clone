import { describe, expect, it } from "vitest";
import { applySeptemberJulyLeadAdjustment } from "./leadDateAdjustments";
import { parseLeadCsv } from "./leadsCsv";

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

function row(input: { index: number; model: string; channel: string; sourceChannel: string }): string {
  const phone = `11999${String(input.index).padStart(6, "0")}`;
  return [
    "15/07/2026",
    input.model,
    "SP",
    "São Paulo",
    "Concessionária Teste",
    `Contato ${input.index}`,
    `contato${input.index}@example.com`,
    phone,
    input.channel,
    "15/07/2026",
    "Concessionária Teste",
    input.sourceChannel,
  ].join(",");
}

function buildJulyCsv(): Buffer {
  const rows: string[] = [header];
  let index = 1;
  for (let count = 0; count < 90; count += 1) rows.push(row({ index: index++, model: "MG4", channel: "Site", sourceChannel: "Site" }));
  for (let count = 0; count < 10; count += 1) rows.push(row({ index: index++, model: "MG4 Urban", channel: "Site", sourceChannel: "Site" }));
  for (let count = 0; count < 100; count += 1) rows.push(row({ index: index++, model: "MGS5", channel: "Meta", sourceChannel: "Meta" }));
  for (let count = 0; count < 30; count += 1) rows.push(row({ index: index++, model: "MG4", channel: "Webmotors", sourceChannel: "Webmotors" }));
  for (let count = 0; count < 20; count += 1) rows.push(row({ index: index++, model: "MG4", channel: "Mercado Livre", sourceChannel: "Mercado Livre" }));
  for (let count = 0; count < 10; count += 1) rows.push(row({ index: index++, model: "MG4", channel: "UOL", sourceChannel: "UOL" }));
  return Buffer.from(rows.join("\n"), "utf8");
}

describe("ajuste auditável de competência setembro", () => {
  it("mantém julho, preserva origem e distribui 250 cópias nos três últimos dias de setembro", () => {
    const result = applySeptemberJulyLeadAdjustment({ bytes: buildJulyCsv() });
    const parsed = parseLeadCsv(result.bytes, "2026-09-30");
    const septemberRows = parsed.records.filter(record => record.correctedDate.startsWith("2026-09-"));
    const julyRows = parsed.records.filter(record => record.correctedDate.startsWith("2026-07-"));

    expect(result.appliedCount).toBe(250);
    expect(result.channelCounts).toEqual({ Meta: 100, Site: 90, Webmotors: 30, "Mercado Livre": 20, "Campanha Urban": 10 });
    expect(result.sourceChannelCounts).toEqual({ Meta: 100, Site: 100, Webmotors: 30, "Mercado Livre": 20 });
    expect(result.dailyCounts).toEqual({ "2026-09-28": 84, "2026-09-29": 83, "2026-09-30": 83 });
    expect(julyRows).toHaveLength(260);
    expect(septemberRows).toHaveLength(250);
    expect(new Set(septemberRows.map(record => record.sourceChannel))).toEqual(
      new Set(["Site", "Meta", "Webmotors", "Mercado Livre"]),
    );
    expect(septemberRows.some(record => record.sourceChannel === "UOL")).toBe(false);
    expect(parsed.records).toHaveLength(510);
  });
});
