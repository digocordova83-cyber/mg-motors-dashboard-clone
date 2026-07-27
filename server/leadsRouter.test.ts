import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAnonymousContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("rotas protegidas de Leads", () => {
  it("recusa analytics, alteração de meta e importação sem sessão do dashboard", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());

    await expect(caller.leads.bounds()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.leads.updateMonthlyGoal({ competence: "2026-07", goalCount: 10_000 }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.leads.importCsv({ fileName: "leads.csv", base64: "YQ==" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
