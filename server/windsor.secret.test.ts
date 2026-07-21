import { describe, expect, it } from "vitest";

const WINDSOR_API_URL = "https://connectors.windsor.ai/google_ads";

describe("WINDSOR_API_KEY", () => {
  it(
    "acessa a conta MG Motors no conector Google Ads",
    async () => {
      const apiKey = process.env.WINDSOR_API_KEY;
      expect(apiKey, "WINDSOR_API_KEY deve estar configurada").toBeTruthy();

      const params = new URLSearchParams({
        api_key: apiKey!,
        fields: "account_name,datasource,date",
        date_from: "2026-07-19",
        date_to: "2026-07-19",
        _max_rows: "100",
      });

      const response = await fetch(`${WINDSOR_API_URL}?${params.toString()}`);
      expect(response.ok, `Windsor.ai respondeu HTTP ${response.status}`).toBe(true);

      const payload = (await response.json()) as unknown;
      const rows = Array.isArray(payload)
        ? payload
        : typeof payload === "object" && payload !== null && "data" in payload
          ? (payload as { data?: unknown }).data
          : [];

      expect(Array.isArray(rows)).toBe(true);
      expect(
        (rows as Array<{ account_name?: string; datasource?: string }>).some(
          row => row.account_name === "MG Motors" && row.datasource === "google_ads",
        ),
      ).toBe(true);
    },
    30_000,
  );
});
