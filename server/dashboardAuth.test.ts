import type { Request } from "express";
import { beforeAll, describe, expect, it } from "vitest";
import {
  DASHBOARD_SESSION_COOKIE,
  createDashboardSession,
  readDashboardSession,
  validateDashboardCredentials,
} from "./dashboardAuth";

beforeAll(() => {
  process.env.JWT_SECRET ||= "test-secret-with-at-least-32-characters";
});

describe("autenticação do dashboard", () => {
  it("aceita somente rodrigo/rodrigo", () => {
    expect(validateDashboardCredentials("rodrigo", "rodrigo")).toBe(true);
    expect(validateDashboardCredentials("rodrigo", "senha-errada")).toBe(false);
    expect(validateDashboardCredentials("admin", "rodrigo")).toBe(false);
  });

  it("lê uma sessão assinada válida do cookie HTTP-only", async () => {
    const token = await createDashboardSession();
    const req = {
      headers: { cookie: `${DASHBOARD_SESSION_COOKIE}=${token}` },
    } as Request;

    await expect(readDashboardSession(req)).resolves.toMatchObject({ username: "rodrigo" });
  });

  it("rejeita cookie ausente ou adulterado", async () => {
    const missing = { headers: {} } as Request;
    const invalid = {
      headers: { cookie: `${DASHBOARD_SESSION_COOKIE}=token-invalido` },
    } as Request;

    await expect(readDashboardSession(missing)).resolves.toBeNull();
    await expect(readDashboardSession(invalid)).resolves.toBeNull();
  });
});
