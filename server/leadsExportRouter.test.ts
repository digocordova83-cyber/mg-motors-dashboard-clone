import { beforeEach, describe, expect, it, vi } from "vitest";

const exportMocks = vi.hoisted(() => ({
  exportLeadsBase: vi.fn(),
}));

vi.mock("./leadsExportService", () => exportMocks);

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

const exportResult = {
  fileName: "mg-motors-leads-2026-07-01-a-2026-07-22.xlsx",
  mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  base64: "UEsDBAoAAAAA",
  dateFrom: "2026-07-01",
  dateTo: "2026-07-22",
  filteredRows: 100,
  exportedRows: 98,
  duplicatesRemoved: 2,
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
  exportMocks.exportLeadsBase.mockReset();
  exportMocks.exportLeadsBase.mockResolvedValue(exportResult);
});

describe("rota de exportação da base de Leads", () => {
  it("recusa exportação sem sessão autenticada", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.leads.exportBase({
        dateFrom: "2026-07-01",
        dateTo: "2026-07-22",
        locale: "pt-BR",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(exportMocks.exportLeadsBase).not.toHaveBeenCalled();
  });

  it("permite exportação a mgsales mesmo sem canImportLeads", async () => {
    const token = await createToken({
      accountId: 4,
      username: "mgsales",
      displayName: "MG Sales",
      locale: "en-US",
      permissions: basePermissions,
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(
      caller.leads.exportBase({
        dateFrom: "2026-07-01",
        dateTo: "2026-07-22",
        locale: "en-US",
      }),
    ).resolves.toEqual(exportResult);
    expect(exportMocks.exportLeadsBase).toHaveBeenCalledWith({
      dateFrom: "2026-07-01",
      dateTo: "2026-07-22",
      locale: "en-US",
    });
  });

  it("bloqueia perfil sem acesso à aba Leads", async () => {
    const token = await createToken({
      accountId: 9,
      username: "sem-leads",
      displayName: "Sem Leads",
      locale: "pt-BR",
      permissions: { ...basePermissions, canAccessLeads: false },
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(
      caller.leads.exportBase({
        dateFrom: "2026-07-01",
        dateTo: "2026-07-22",
        locale: "pt-BR",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(exportMocks.exportLeadsBase).not.toHaveBeenCalled();
  });

  it("rejeita período invertido antes de gerar o arquivo", async () => {
    const token = await createToken({
      accountId: 4,
      username: "mgsales",
      displayName: "MG Sales",
      locale: "en-US",
      permissions: basePermissions,
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(
      caller.leads.exportBase({
        dateFrom: "2026-07-22",
        dateTo: "2026-07-01",
        locale: "en-US",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(exportMocks.exportLeadsBase).not.toHaveBeenCalled();
  });
});
