import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
  getWeeklySalesMetrics: vi.fn(),
  getWeeklySalesImportHistory: vi.fn(),
  previewWeeklySalesCsv: vi.fn(),
  importWeeklySalesCsv: vi.fn(),
}));

vi.mock("./weeklySalesService", () => serviceMocks);

import type { TrpcContext } from "./_core/context";
import {
  createDashboardSession,
  DASHBOARD_SESSION_COOKIE,
  type DashboardIdentity,
} from "./dashboardAuth";
import { appRouter } from "./routers";

const PREVIEW_HASH = "a".repeat(64);

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
  Object.values(serviceMocks).forEach(mock => mock.mockReset());
  serviceMocks.getWeeklySalesMetrics.mockResolvedValue({ competence: "2026-07" });
  serviceMocks.getWeeklySalesImportHistory.mockResolvedValue([]);
  serviceMocks.previewWeeklySalesCsv.mockResolvedValue({ fileHash: PREVIEW_HASH });
  serviceMocks.importWeeklySalesCsv.mockResolvedValue({ idempotent: false, importId: 1 });
});

describe("rotas de vendas semanais", () => {
  it("recusa leitura sem sessão", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.leads.weeklySalesMetrics({ competence: "2026-07" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(serviceMocks.getWeeklySalesMetrics).not.toHaveBeenCalled();
  });

  it("permite métricas a mgsales, mas bloqueia upload e histórico sem canImportLeads", async () => {
    const token = await createToken({
      accountId: 4,
      username: "mgsales",
      displayName: "MG Sales",
      locale: "en-US",
      permissions: basePermissions,
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(
      caller.leads.weeklySalesMetrics({ competence: "2026-07" }),
    ).resolves.toEqual({ competence: "2026-07" });
    await expect(caller.leads.weeklySalesImportHistory({ limit: 10 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(
      caller.leads.previewWeeklySalesCsv({
        fileName: "daily-sales-planning.pdf",
        base64: "JVBERi0=",
        competence: "2026-07",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      caller.leads.importWeeklySalesCsv({
        competence: "2026-07",
        fileName: "daily-sales-planning.pdf",
        base64: "JVBERi0=",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });

    expect(serviceMocks.getWeeklySalesMetrics).toHaveBeenCalledWith("2026-07", {
      dateFrom: undefined,
      dateTo: undefined,
    });
    expect(serviceMocks.previewWeeklySalesCsv).not.toHaveBeenCalled();
    expect(serviceMocks.importWeeklySalesCsv).not.toHaveBeenCalled();
  });

  it("repassa o período filtrado de Leads ao serviço semanal", async () => {
    const token = await createToken({
      accountId: 4,
      username: "mgsales",
      displayName: "MG Sales",
      locale: "en-US",
      permissions: basePermissions,
    });
    const caller = appRouter.createCaller(createContext(token));

    await caller.leads.weeklySalesMetrics({
      competence: "2026-07",
      dateFrom: "2026-07-08",
      dateTo: "2026-07-22",
    });

    expect(serviceMocks.getWeeklySalesMetrics).toHaveBeenCalledWith("2026-07", {
      dateFrom: "2026-07-08",
      dateTo: "2026-07-22",
    });
  });

  it("permite preview, confirmação e histórico a quem possui canImportLeads", async () => {
    const token = await createToken({
      accountId: 1,
      username: "rodrigo",
      displayName: "Rodrigo",
      locale: "pt-BR",
      permissions: { ...basePermissions, canImportLeads: true },
    });
    const caller = appRouter.createCaller(createContext(token));

    await expect(
      caller.leads.previewWeeklySalesCsv({
        fileName: "sales.csv",
        base64: "YQ==",
        competence: "2026-07",
      }),
    ).resolves.toEqual({ fileHash: PREVIEW_HASH });
    await expect(
      caller.leads.importWeeklySalesCsv({
        competence: "2026-07",
        fileName: "sales.csv",
        base64: "YQ==",
        expectedFileHash: PREVIEW_HASH,
      }),
    ).resolves.toEqual({ idempotent: false, importId: 1 });
    await expect(caller.leads.weeklySalesImportHistory({ limit: 25 })).resolves.toEqual([]);

    expect(serviceMocks.previewWeeklySalesCsv).toHaveBeenCalledWith({
      fileName: "sales.csv",
      bytes: Buffer.from("a"),
      declaredMimeType: null,
      competence: "2026-07",
    });
    expect(serviceMocks.importWeeklySalesCsv).toHaveBeenCalledWith({
      competence: "2026-07",
      fileName: "sales.csv",
      bytes: Buffer.from("a"),
      declaredMimeType: null,
      expectedFileHash: PREVIEW_HASH,
      actor: "rodrigo",
    });
    expect(serviceMocks.getWeeklySalesImportHistory).toHaveBeenCalledWith(25);
  });

  it("aceita PDF e repassa seus bytes sem alterar o contrato de prévia e confirmação", async () => {
    const token = await createToken({
      accountId: 1,
      username: "rodrigo",
      displayName: "Rodrigo",
      locale: "pt-BR",
      permissions: { ...basePermissions, canImportLeads: true },
    });
    const caller = appRouter.createCaller(createContext(token));
    const pdfBase64 = `data:application/pdf;base64,${Buffer.from("%PDF-1.7\nretail").toString("base64")}`;

    await caller.leads.previewWeeklySalesCsv({
      fileName: "Daily Sales Planning Report.pdf",
      base64: pdfBase64,
      competence: "2026-07",
    });
    await caller.leads.importWeeklySalesCsv({
      fileName: "Daily Sales Planning Report.pdf",
      base64: pdfBase64,
      competence: "2026-07",
      expectedFileHash: PREVIEW_HASH,
    });

    expect(serviceMocks.previewWeeklySalesCsv).toHaveBeenCalledWith({
      fileName: "Daily Sales Planning Report.pdf",
      bytes: Buffer.from("%PDF-1.7\nretail"),
      declaredMimeType: "application/pdf",
      competence: "2026-07",
    });
    expect(serviceMocks.importWeeklySalesCsv).toHaveBeenCalledWith({
      fileName: "Daily Sales Planning Report.pdf",
      bytes: Buffer.from("%PDF-1.7\nretail"),
      declaredMimeType: "application/pdf",
      competence: "2026-07",
      expectedFileHash: PREVIEW_HASH,
      actor: "rodrigo",
    });
  });
});
