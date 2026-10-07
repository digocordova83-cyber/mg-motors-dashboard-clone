import { beforeEach, describe, expect, it, vi } from "vitest";

const financeMocks = vi.hoisted(() => ({
  getFinanceiroAvailableMonths: vi.fn(),
  getFinanceiroDashboard: vi.fn(),
}));

vi.mock("./financeiroService", () => financeMocks);

import type { TrpcContext } from "./_core/context";
import { createDashboardSession, DASHBOARD_SESSION_COOKIE } from "./dashboardAuth";
import { appRouter } from "./routers";

function createContext(token?: string): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: token ? { cookie: `${DASHBOARD_SESSION_COOKIE}=${token}` } : {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const basePermissions = {
  canAccessGoogleAds: false,
  canAccessMetaAds: false,
  canAccessLeads: false,
  canAccessMediaPlan: false,
  canAccessOptimizations: false,
  canAccessHistory: false,
  canImportLeads: false,
  canAccessAccessHistory: false,
  canAccessFinanceiro: false,
};

describe("rota financeira protegida", () => {
  beforeEach(() => {
    process.env.JWT_SECRET ||= "test-secret-with-at-least-32-characters";
    financeMocks.getFinanceiroAvailableMonths.mockReset();
    financeMocks.getFinanceiroDashboard.mockReset();
    financeMocks.getFinanceiroAvailableMonths.mockResolvedValue(["2026-10", "2026-09"]);
    financeMocks.getFinanceiroDashboard.mockResolvedValue({ competence: "2026-10" });
  });

  it("recusa a consulta sem sessão ou sem a permissão financeira", async () => {
    await expect(appRouter.createCaller(createContext()).financeiro.months()).rejects.toMatchObject({ code: "UNAUTHORIZED" });

    const denied = await createDashboardSession({ accountId: 1, username: "sem-financeiro", displayName: "Sem Financeiro", locale: "pt-BR", permissions: basePermissions });
    await expect(appRouter.createCaller(createContext(denied)).financeiro.dashboard({ competence: "2026-10" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(financeMocks.getFinanceiroDashboard).not.toHaveBeenCalled();
  });

  it("expõe somente a consulta financeira ao usuário autorizado", async () => {
    const token = await createDashboardSession({ accountId: 9, username: "financeiro", displayName: "Financeiro", locale: "pt-BR", permissions: { ...basePermissions, canAccessFinanceiro: true } });
    const caller = appRouter.createCaller(createContext(token));

    await expect(caller.financeiro.months()).resolves.toEqual(["2026-10", "2026-09"]);
    await expect(caller.financeiro.dashboard({ competence: "2026-10" })).resolves.toEqual({ competence: "2026-10" });
    expect(financeMocks.getFinanceiroDashboard).toHaveBeenCalledWith("2026-10");
    await expect(caller.leads.bounds()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
