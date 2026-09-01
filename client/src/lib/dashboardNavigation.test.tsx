import { describe, expect, it } from "vitest";
import { buildDashboardSearch, resolveDashboardRoute } from "./dashboardNavigation";
import { isValidLeadDateRange, resolveLeadMonthRange } from "./leadDateRange";

function params(search: string) {
  return Object.fromEntries(new URLSearchParams(search).entries());
}

describe("navegação modular do dashboard", () => {
  it("mantém compatibilidade com a URL histórica de Leads", () => {
    expect(resolveDashboardRoute("?tab=leads")).toEqual({
      module: "leads",
      googleTab: "overview",
    });
  });

  it("resolve Meta Ads como módulo próprio sem subaba", () => {
    expect(resolveDashboardRoute("?module=meta-ads")).toEqual({
      module: "meta-ads",
      googleTab: "overview",
    });
  });

  it("resolve TikTok Ads como módulo próprio sem subaba", () => {
    expect(resolveDashboardRoute("?module=tiktok-ads")).toEqual({
      module: "tiktok-ads",
      googleTab: "overview",
    });
  });

  it("resolve o histórico administrativo como módulo próprio sem subaba", () => {
    expect(resolveDashboardRoute("?module=access-history&tab=history")).toEqual({
      module: "access-history",
      googleTab: "history",
    });

    expect(params(buildDashboardSearch("?tab=history&campaign=123", "access-history", "history"))).toEqual({
      campaign: "123",
      module: "access-history",
    });
  });

  it("mantém as subabas exclusivas dentro de Google Ads", () => {
    expect(resolveDashboardRoute("?module=google-ads&tab=history")).toEqual({
      module: "google-ads",
      googleTab: "history",
    });
  });

  it("gera URLs compartilháveis para cada módulo sem perder parâmetros não relacionados", () => {
    expect(params(buildDashboardSearch("?tab=history&campaign=123", "leads", "history"))).toEqual({
      tab: "leads",
      campaign: "123",
      module: "leads",
    });

    expect(params(buildDashboardSearch("?tab=history&campaign=123", "meta-ads", "history"))).toEqual({
      campaign: "123",
      module: "meta-ads",
    });

    expect(params(buildDashboardSearch("?tab=history&campaign=123", "tiktok-ads", "history"))).toEqual({
      campaign: "123",
      module: "tiktok-ads",
    });

    expect(params(buildDashboardSearch("?campaign=123", "google-ads", "investment"))).toEqual({
      campaign: "123",
      module: "google-ads",
      tab: "investment",
    });
  });
});

describe("período próprio de Leads", () => {
  it("abre o período Mês no dia 01 da competência até D-1", () => {
    expect(resolveLeadMonthRange("2026-01-01", "2026-07-19")).toEqual({
      dateFrom: "2026-07-01",
      dateTo: "2026-07-19",
    });
  });

  it("respeita o início real da base quando o mês está incompleto", () => {
    expect(resolveLeadMonthRange("2026-07-08", "2026-07-19")).toEqual({
      dateFrom: "2026-07-08",
      dateTo: "2026-07-19",
    });
  });

  it("aceita intervalo manual válido e rejeita inversão ou datas fora da base", () => {
    expect(isValidLeadDateRange("2026-07-05", "2026-07-12", "2026-01-01", "2026-07-19")).toBe(true);
    expect(isValidLeadDateRange("2026-07-12", "2026-07-05", "2026-01-01", "2026-07-19")).toBe(false);
    expect(isValidLeadDateRange("2025-12-31", "2026-07-05", "2026-01-01", "2026-07-19")).toBe(false);
    expect(isValidLeadDateRange("2026-07-05", "2026-07-20", "2026-01-01", "2026-07-19")).toBe(false);
  });
});
