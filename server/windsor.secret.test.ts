import { describe, expect, it } from "vitest";

const WINDSOR_API_URL = "https://connectors.windsor.ai/google_ads";
const WINDSOR_TIKTOK_API_URL = "https://connectors.windsor.ai/tiktok";
const TIKTOK_ACCOUNT_ID = "7668787778449719316";

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

  it(
    "acessa a conta MG Motor Brasil no conector TikTok Ads",
    async () => {
      const apiKey = process.env.WINDSOR_API_KEY;
      expect(apiKey, "WINDSOR_API_KEY deve estar configurada").toBeTruthy();

      const params = new URLSearchParams({
        api_key: apiKey!,
        fields: "account_id,account_name,date,spend",
        date_from: "2026-08-13",
        date_to: "2026-08-13",
        filter: JSON.stringify([["account_id", "eq", TIKTOK_ACCOUNT_ID]]),
        _max_rows: "100",
      });

      const response = await fetch(`${WINDSOR_TIKTOK_API_URL}?${params.toString()}`);
      expect(response.ok, `Windsor.ai TikTok respondeu HTTP ${response.status}`).toBe(true);

      const payload = (await response.json()) as { data?: unknown };
      const rows = Array.isArray(payload.data) ? payload.data : [];
      expect(
        (rows as Array<{ account_id?: string; account_name?: string }>).some(
          row =>
            row.account_id === TIKTOK_ACCOUNT_ID &&
            row.account_name === "Ag. BBRO - MG Motor Brasil - AUT",
        ),
      ).toBe(true);
    },
    30_000,
  );
});
