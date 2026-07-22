import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  listDashboardAccessEvents: vi.fn(),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    listDashboardAccessEvents: dbMocks.listDashboardAccessEvents,
  };
});

import type { TrpcContext } from "./_core/context";
import {
  createDashboardSession,
  DASHBOARD_SESSION_COOKIE,
  type DashboardIdentity,
} from "./dashboardAuth";
import { appRouter } from "./routers";

const basePermissions = {
  canAccessGoogleAds: true,
  canAccessMetaAds: true,
  canAccessLeads: true,
  canAccessMediaPlan: true,
  canAccessOptimizations: false,
  canAccessHistory: false,
  canImportLeads: false,
  canAccessAccessHistory: false,
};

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

async function createToken(identity: DashboardIdentity) {
  return createDashboardSession(identity);
}

beforeEach(() => {
  process.env.JWT_SECRET ||= "test-secret-with-at-least-32-characters";
  dbMocks.listDashboardAccessEvents.mockReset();
  dbMocks.listDashboardAccessEvents.mockResolvedValue({
    items: [],
    total: 0,
    page: 1,
    pageSize: 25,
    totalPages: 1,
  });
});

describe("histórico administrativo de acessos", () => {
  it("recusa chamadas sem sessão", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.accessHistory.list({ page: 1, pageSize: 25 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(dbMocks.listDashboardAccessEvents).not.toHaveBeenCalled();
  });

  it("recusa mgsales mesmo com sessão válida", async () => {
    const token = await createToken({
      accountId: 4,
      username: "mgsales",
      displayName: "MG Sales",
      locale: "en-US",
      permissions: basePermissions,
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(caller.accessHistory.list({ page: 1, pageSize: 25 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMocks.listDashboardAccessEvents).not.toHaveBeenCalled();
  });

  it("permite rodrigo e encaminha filtros paginados ao banco", async () => {
    const token = await createToken({
      accountId: 1,
      username: "rodrigo",
      displayName: "Rodrigo",
      locale: "pt-BR",
      permissions: { ...basePermissions, canAccessAccessHistory: true },
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(caller.accessHistory.list({
      page: 2,
      pageSize: 10,
      username: "mgsales",
      eventType: "LOGIN_SUCCESS",
      occurredFrom: 1_700_000_000_000,
      occurredTo: 1_800_000_000_000,
    })).resolves.toEqual({ items: [], total: 0, page: 1, pageSize: 25, totalPages: 1 });

    expect(dbMocks.listDashboardAccessEvents).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      username: "mgsales",
      eventType: "LOGIN_SUCCESS",
      occurredFrom: 1_700_000_000_000,
      occurredTo: 1_800_000_000_000,
    });
  });
});
