import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const refetch = vi.fn();

vi.mock("@/lib/trpc", () => ({
  trpc: {
    accessHistory: {
      list: {
        useQuery: () => ({
          data: {
            items: [
              {
                id: 3,
                accountId: 1,
                username: "rodrigo",
                eventType: "LOGIN_SUCCESS",
                ipAddress: "203.0.113.42",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36",
                occurredAt: Date.UTC(2026, 6, 22, 15, 30, 0),
              },
              {
                id: 2,
                accountId: null,
                username: "unknown-user",
                eventType: "LOGIN_FAILURE",
                ipAddress: null,
                userAgent: null,
                occurredAt: Date.UTC(2026, 6, 22, 15, 0, 0),
              },
              {
                id: 1,
                accountId: 3,
                username: "mgmotor",
                eventType: "LOGOUT",
                ipAddress: "2001:db8::1",
                userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5) Version/17.0 Mobile/15E148 Safari/604.1",
                occurredAt: Date.UTC(2026, 6, 22, 14, 30, 0),
              },
            ],
            total: 3,
            page: 1,
            pageSize: 25,
            totalPages: 1,
          },
          isLoading: false,
          isFetching: false,
          error: null,
          refetch,
        }),
      },
    },
  },
}));

import { AccessHistoryTab, describeUserAgent, formatAccessEventTime } from "./AccessHistoryTab";

describe("AccessHistoryTab", () => {
  it("renderiza a auditoria completa em português sem credenciais", () => {
    const html = renderToStaticMarkup(<AccessHistoryTab locale="pt-BR" />);

    expect(html).toContain("Histórico de acessos");
    expect(html).toContain("Acesso autorizado");
    expect(html).toContain("Acesso recusado");
    expect(html).toContain("Saída");
    expect(html).toContain("rodrigo");
    expect(html).toContain("203.0.113.42");
    expect(html).toContain("Chrome • Computador");
    expect(html).toContain("Safari • iOS");
    expect(html).not.toContain("mgsales1");
    expect(html).not.toContain("current-password");
  });

  it("traduz integralmente a interface administrativa para inglês", () => {
    const html = renderToStaticMarkup(<AccessHistoryTab locale="en-US" />);

    expect(html).toContain("Access history");
    expect(html).toContain("Audit filters");
    expect(html).toContain("Successful login");
    expect(html).toContain("Failed login");
    expect(html).toContain("Browser / device");
    expect(html).toContain("Chrome • Desktop");
    expect(html).toContain("Not provided");
  });

  it("classifica navegadores e formata data/hora no locale solicitado", () => {
    expect(describeUserAgent("Mozilla/5.0 Firefox/128.0", "en-US")).toBe("Firefox • Desktop");
    expect(describeUserAgent(null, "pt-BR")).toBe("Não informado");
    expect(formatAccessEventTime(Date.UTC(2026, 6, 22, 15, 30), "en-US")).toMatch(/2026/);
  });
});
