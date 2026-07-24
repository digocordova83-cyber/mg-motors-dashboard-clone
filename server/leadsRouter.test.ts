import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  createDashboardSession,
  DASHBOARD_SESSION_COOKIE,
} from "./dashboardAuth";

function createContext(token?: string): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: token ? { cookie: `${DASHBOARD_SESSION_COOKIE}=${token}` } : {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("rotas protegidas de Leads", () => {
  it("recusa analytics, alteração de meta e importação sem sessão do dashboard", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.leads.bounds()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.leads.updateMonthlyGoal({ competence: "2026-07", goalCount: 10_000 }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.leads.importCsv({ fileName: "leads.csv", base64: "YQ==" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("permite leitura de Leads, mas bloqueia alteração de meta para mgsales", async () => {
    process.env.JWT_SECRET ||= "test-secret-with-at-least-32-characters";
    const token = await createDashboardSession({
      accountId: 4,
      username: "mgsales",
      displayName: "MG Sales",
      locale: "en-US",
      permissions: {
        canAccessGoogleAds: true,
        canAccessMetaAds: true,
        canAccessLeads: true,
        canAccessMediaPlan: true,
        canAccessOptimizations: true,
        canAccessHistory: true,
        canImportLeads: true,
        canAccessAccessHistory: true,
      },
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(caller.leads.updateMonthlyGoal({
      competence: "2026-07",
      goalCount: 10_000,
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.dashboard.getData({
      dateFrom: "2026-07-01",
      dateTo: "2026-07-22",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.metaAds.bounds()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
