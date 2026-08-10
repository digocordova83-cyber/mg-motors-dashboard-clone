import { describe, expect, it } from "vitest";
import {
  filterExpectedLeadChannelsByDate,
  filterLeadRowsByChannelLifecycle,
  isLeadChannelActiveOnDate,
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

  it("mantém UOL nas opções de julho e o remove das opções de agosto", () => {
    const channels = ["Site", "Meta", "UOL", "Campanha Urban"];

    expect(filterExpectedLeadChannelsByDate(channels, "2026-07-31")).toContain("UOL");
    expect(filterExpectedLeadChannelsByDate(channels, "2026-08-01")).not.toContain("UOL");
    expect(filterExpectedLeadChannelsByDate(channels, "2026-08-01")).toEqual([
      "Site",
      "Meta",
      "Campanha Urban",
    ]);
  });
});
