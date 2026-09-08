import { describe, expect, it } from "vitest";
import {
  filterExpectedLeadChannelsByDate,
  filterLeadRowsByChannelLifecycle,
  isLeadChannelActiveOnDate,
  SEPTEMBER_LEAD_CHANNEL_HIDE_FROM,
  UOL_LEAD_CHANNEL_LAST_ACTIVE_DATE,
} from "./leadsService";

describe("ciclo de vida dos canais de Leads", () => {
  it("mantém UOL até 31/07/2026 e o encerra em 01/08/2026", () => {
    expect(UOL_LEAD_CHANNEL_LAST_ACTIVE_DATE).toBe("2026-07-31");
    expect(isLeadChannelActiveOnDate("UOL", "2026-07-31")).toBe(true);
    expect(isLeadChannelActiveOnDate(" uol ", "2026-08-01")).toBe(false);
    expect(isLeadChannelActiveOnDate("Meta", "2026-08-01")).toBe(true);
  });

  it("preserva o histórico UOL de julho e remove somente as linhas UOL de agosto em diante", () => {
    const rows = [
      { correctedDate: "2026-07-31", channel: "UOL", id: "uol-july" },
      { correctedDate: "2026-08-01", channel: "UOL", id: "uol-august" },
      { correctedDate: "2026-08-01", channel: "Site", id: "site-august" },
    ];

    expect(filterLeadRowsByChannelLifecycle(rows).map(row => row.id)).toEqual([
      "uol-july",
      "site-august",
    ]);
  });

  it("mantém UOL em julho, remove-o em agosto e nunca expõe Campanha Urban", () => {
    const channels = ["Site", "Meta", "UOL", "Campanha Urban"];

    expect(filterExpectedLeadChannelsByDate(channels, "2026-07-31")).toContain("UOL");
    expect(filterExpectedLeadChannelsByDate(channels, "2026-08-01")).not.toContain("UOL");
    expect(filterExpectedLeadChannelsByDate(channels, "2026-08-01")).toEqual([
      "Site",
      "Meta",
    ]);
    expect(filterExpectedLeadChannelsByDate(channels, "2026-07-31")).not.toContain("Campanha Urban");
  });

  it("oculta TikTok, TikTok Live e Interlagos somente a partir de setembro, sem afetar agosto", () => {
    expect(SEPTEMBER_LEAD_CHANNEL_HIDE_FROM).toBe("2026-09-01");
    expect(isLeadChannelActiveOnDate("TikTok", "2026-08-31")).toBe(true);
    expect(isLeadChannelActiveOnDate("TikTok Live", "2026-08-31")).toBe(true);
    expect(isLeadChannelActiveOnDate("Interlagos", "2026-08-31")).toBe(true);
    expect(isLeadChannelActiveOnDate("TikTok", "2026-09-01")).toBe(false);
    expect(isLeadChannelActiveOnDate("TikTok Live", "2026-09-01")).toBe(false);
    expect(isLeadChannelActiveOnDate("Interlagos", "2026-09-01")).toBe(false);
  });

  it("remove os canais ocultos dos indicadores de setembro usando o canal de origem quando houver", () => {
    const rows = [
      { correctedDate: "2026-09-01", channel: "TikTok", id: "tiktok" },
      { correctedDate: "2026-09-01", channel: "TikTok Live", id: "tiktok-live" },
      { correctedDate: "2026-09-01", channel: "Interlagos", id: "interlagos" },
      { correctedDate: "2026-09-01", channel: "Campanha Urban", sourceChannel: "TikTok", id: "urban-tiktok" },
      { correctedDate: "2026-09-01", channel: "Meta", id: "meta" },
      { correctedDate: "2026-08-31", channel: "TikTok", id: "tiktok-august" },
    ];

    expect(filterLeadRowsByChannelLifecycle(rows).map(row => row.id)).toEqual([
      "meta",
      "tiktok-august",
    ]);
  });

  it("não inclui os canais ocultos como canais esperados em setembro", () => {
    const channels = ["Site", "Meta", "TikTok", "TikTok Live", "Interlagos", "UOL"];

    expect(filterExpectedLeadChannelsByDate(channels, "2026-09-06")).toEqual(["Site", "Meta"]);
  });
});
