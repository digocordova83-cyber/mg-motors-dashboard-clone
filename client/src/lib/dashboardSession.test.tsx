import { describe, expect, it } from "vitest";
import {
  DASHBOARD_SESSION_EXPIRED_MESSAGE,
  isDashboardSessionExpiredError,
} from "./dashboardSession";

describe("isDashboardSessionExpiredError", () => {
  it("identifica a resposta 401 da sessão local expirada", () => {
    expect(
      isDashboardSessionExpiredError({
        message: DASHBOARD_SESSION_EXPIRED_MESSAGE,
        data: { httpStatus: 401 },
      }),
    ).toBe(true);
  });

  it("não confunde erros do OAuth ou falhas de fonte com sessão do dashboard", () => {
    expect(isDashboardSessionExpiredError({ message: "Please login (10001)" })).toBe(false);
    expect(
      isDashboardSessionExpiredError({
        message: DASHBOARD_SESSION_EXPIRED_MESSAGE,
        data: { httpStatus: 500 },
      }),
    ).toBe(false);
    expect(isDashboardSessionExpiredError(new Error("Windsor.ai respondeu HTTP 503"))).toBe(false);
  });
});
