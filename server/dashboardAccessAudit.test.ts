import type { Request } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  recordDashboardAccessEvent: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import {
  getDashboardAccessMetadata,
  recordDashboardAccessSafely,
} from "./dashboardAccessAudit";

function request(overrides: Partial<Request> = {}) {
  return {
    headers: {
      "x-forwarded-for": "203.0.113.8, 10.0.0.1",
      "user-agent": "Mozilla/5.0 Test Browser",
    },
    ip: "::ffff:127.0.0.1",
    socket: { remoteAddress: "::ffff:127.0.0.2" },
    ...overrides,
  } as Request;
}

describe("auditoria de acessos do dashboard", () => {
  beforeEach(() => {
    dbMocks.recordDashboardAccessEvent.mockReset().mockResolvedValue(undefined);
  });

  it("usa o primeiro IP encaminhado e registra apenas metadados mínimos", async () => {
    const req = request();

    expect(getDashboardAccessMetadata(req)).toEqual({
      ipAddress: "203.0.113.8",
      userAgent: "Mozilla/5.0 Test Browser",
    });

    await recordDashboardAccessSafely({
      req,
      username: "MGSALES",
      accountId: 5,
      eventType: "LOGIN_SUCCESS",
    });

    expect(dbMocks.recordDashboardAccessEvent).toHaveBeenCalledWith({
      accountId: 5,
      username: "MGSALES",
      eventType: "LOGIN_SUCCESS",
      ipAddress: "203.0.113.8",
      userAgent: "Mozilla/5.0 Test Browser",
    });
    expect(JSON.stringify(dbMocks.recordDashboardAccessEvent.mock.calls)).not.toContain("password");
  });

  it("remove o prefixo IPv6 quando não há proxy e tolera ausência de user agent", () => {
    const req = request({
      headers: {},
      ip: "::ffff:192.0.2.44",
    });

    expect(getDashboardAccessMetadata(req)).toEqual({
      ipAddress: "192.0.2.44",
      userAgent: null,
    });
  });

  it("não interrompe login ou logout quando a gravação da auditoria falha", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    dbMocks.recordDashboardAccessEvent.mockRejectedValueOnce(new Error("banco indisponível"));

    await expect(
      recordDashboardAccessSafely({
        req: request(),
        username: "rodrigo",
        accountId: 1,
        eventType: "LOGOUT",
      }),
    ).resolves.toBeUndefined();
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining("Não foi possível registrar LOGOUT"),
    );

    warning.mockRestore();
  });
});
