import type { Request } from "express";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getDashboardAccountByUsername: vi.fn(),
  updateDashboardAccountLastSignIn: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import {
  authenticateDashboardCredentials,
  createDashboardSession,
  DASHBOARD_SESSION_COOKIE,
  hashDashboardPassword,
  readDashboardSession,
  verifyDashboardPassword,
  type DashboardIdentity,
} from "./dashboardAuth";

const testPassword = "senha-de-teste-segura";
let testPasswordHash = "";

const mgMotorsIdentity: DashboardIdentity = {
  accountId: 2,
  username: "mgmotors",
  displayName: "MG Motors",
  locale: "en-US",
  permissions: {
    canAccessGoogleAds: true,
    canAccessMetaAds: true,
    canAccessLeads: true,
    canAccessMediaPlan: true,
    canAccessOptimizations: false,
    canAccessHistory: false,
    canImportLeads: false,
  },
};

const danielIdentity: DashboardIdentity = {
  accountId: 3,
  username: "daniel",
  displayName: "Daniel",
  locale: "pt-BR",
  permissions: {
    canAccessGoogleAds: true,
    canAccessMetaAds: true,
    canAccessLeads: true,
    canAccessMediaPlan: true,
    canAccessOptimizations: true,
    canAccessHistory: true,
    canImportLeads: true,
  },
};

function accountFromIdentity(identity: DashboardIdentity, overrides: Record<string, unknown> = {}) {
  return {
    id: identity.accountId,
    username: identity.username,
    displayName: identity.displayName,
    passwordHash: testPasswordHash,
    locale: identity.locale,
    ...identity.permissions,
    isActive: true,
    lastSignInAt: null,
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
}

beforeAll(async () => {
  process.env.JWT_SECRET ||= "test-secret-with-at-least-32-characters";
  testPasswordHash = await hashDashboardPassword(testPassword);
});

beforeEach(() => {
  dbMocks.getDashboardAccountByUsername.mockReset();
  dbMocks.updateDashboardAccountLastSignIn.mockReset();
  dbMocks.updateDashboardAccountLastSignIn.mockResolvedValue(undefined);
});

describe("autenticação do dashboard", () => {
  it("gera hash scrypt não reversível e valida apenas a senha correta", async () => {
    expect(testPasswordHash).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(testPasswordHash).not.toContain(testPassword);
    await expect(verifyDashboardPassword(testPassword, testPasswordHash)).resolves.toBe(true);
    await expect(verifyDashboardPassword("senha-incorreta", testPasswordHash)).resolves.toBe(false);
    await expect(verifyDashboardPassword(testPassword, "hash-invalido")).resolves.toBe(false);
  });

  it("autentica uma conta ativa e devolve idioma e permissões sem expor o hash", async () => {
    dbMocks.getDashboardAccountByUsername.mockResolvedValue(accountFromIdentity(mgMotorsIdentity));

    await expect(authenticateDashboardCredentials("mgmotors", testPassword)).resolves.toEqual(mgMotorsIdentity);
    expect(dbMocks.getDashboardAccountByUsername).toHaveBeenCalledWith("mgmotors");
    expect(dbMocks.updateDashboardAccountLastSignIn).toHaveBeenCalledWith(2);
  });

  it("autentica Daniel com acesso integral a todos os módulos e operações", async () => {
    dbMocks.getDashboardAccountByUsername.mockResolvedValue(accountFromIdentity(danielIdentity));

    const identity = await authenticateDashboardCredentials("daniel", testPassword);

    expect(identity).toEqual(danielIdentity);
    expect(identity?.permissions).toEqual({
      canAccessGoogleAds: true,
      canAccessMetaAds: true,
      canAccessLeads: true,
      canAccessMediaPlan: true,
      canAccessOptimizations: true,
      canAccessHistory: true,
      canImportLeads: true,
    });
    expect(dbMocks.getDashboardAccountByUsername).toHaveBeenCalledWith("daniel");
    expect(dbMocks.updateDashboardAccountLastSignIn).toHaveBeenCalledWith(3);
  });

  it("rejeita senha inválida, conta ausente e conta inativa", async () => {
    dbMocks.getDashboardAccountByUsername.mockResolvedValueOnce(accountFromIdentity(mgMotorsIdentity));
    await expect(authenticateDashboardCredentials("mgmotors", "senha-incorreta")).resolves.toBeNull();

    dbMocks.getDashboardAccountByUsername.mockResolvedValueOnce(null);
    await expect(authenticateDashboardCredentials("desconhecido", testPassword)).resolves.toBeNull();

    dbMocks.getDashboardAccountByUsername.mockResolvedValueOnce(
      accountFromIdentity(mgMotorsIdentity, { isActive: false }),
    );
    await expect(authenticateDashboardCredentials("mg motors", testPassword)).resolves.toBeNull();
    expect(dbMocks.updateDashboardAccountLastSignIn).not.toHaveBeenCalled();
  });

  it("lê uma sessão assinada com identidade, idioma e matriz de permissões", async () => {
    const token = await createDashboardSession(mgMotorsIdentity);
    const req = {
      headers: { cookie: `${DASHBOARD_SESSION_COOKIE}=${token}` },
    } as Request;

    await expect(readDashboardSession(req)).resolves.toMatchObject(mgMotorsIdentity);
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
