import { describe, expect, it } from "vitest";
import {
  DASHBOARD_UPDATE_COPY,
  formatDashboardUpdatedAt,
  isValidDashboardUpdatedAt,
  preserveLastSuccessfulUpdate,
} from "./dashboardUpdate";

describe("indicador de última atualização", () => {
  it("expõe rótulos e estados de espera nos dois idiomas", () => {
    expect(DASHBOARD_UPDATE_COPY["pt-BR"]).toEqual({
      label: "Última atualização",
      waiting: "Aguardando dados",
    });
    expect(DASHBOARD_UPDATE_COPY["en-US"]).toEqual({
      label: "Last updated",
      waiting: "Waiting for data",
    });
  });

  it("formata o mesmo instante conforme o idioma da sessão", () => {
    const updatedAt = "2026-07-21T04:36:21.430Z";

    expect(formatDashboardUpdatedAt(updatedAt, "pt-BR")).toMatch(/21\/07\/2026/);
    expect(formatDashboardUpdatedAt(updatedAt, "en-US")).toMatch(/7\/21\/26|7\/21\/2026/);
    expect(formatDashboardUpdatedAt(null, "pt-BR")).toBe("Aguardando dados");
    expect(formatDashboardUpdatedAt(null, "en-US")).toBe("Waiting for data");
  });

  it("aceita somente timestamps válidos e não substitui o último sucesso em falhas", () => {
    const previous = "2026-07-20T18:00:00.000Z";
    const next = "2026-07-21T04:36:21.430Z";

    expect(isValidDashboardUpdatedAt(next)).toBe(true);
    expect(isValidDashboardUpdatedAt("valor-inválido")).toBe(false);
    expect(preserveLastSuccessfulUpdate(previous, next)).toBe(next);
    expect(preserveLastSuccessfulUpdate(previous, null)).toBe(previous);
    expect(preserveLastSuccessfulUpdate(previous, "valor-inválido")).toBe(previous);
  });
});
