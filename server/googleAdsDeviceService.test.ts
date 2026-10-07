import { describe, expect, it } from "vitest";
import { buildGoogleAdsDeviceMix, type GoogleAdsDeviceRow } from "./googleAdsDeviceService";

const row = (overrides: Partial<GoogleAdsDeviceRow> = {}): GoogleAdsDeviceRow => ({
  device: "MOBILE",
  date: "2026-10-01",
  impressions: 1_000,
  clicks: 50,
  spend: 200,
  conversions: 5,
  account_id: "535-798-6801",
  datasource: "google_ads",
  ...overrides,
});

describe("mix de dispositivos do Google Ads", () => {
  it("consolida impressões reais por dispositivo e calcula participação", () => {
    const result = buildGoogleAdsDeviceMix(
      [
        row({ device: "MOBILE", impressions: 700, clicks: 70, spend: 140, conversions: 7 }),
        row({ device: "DESKTOP", impressions: 250, clicks: 25, spend: 50, conversions: 2 }),
        row({ device: "MOBILE", date: "2026-10-02", impressions: 300, clicks: 30, spend: 60, conversions: 3 }),
        row({ device: "TABLET", date: "2026-09-30", impressions: 999 }),
      ],
      "2026-10-01",
      "2026-10-02",
    );

    expect(result.totals).toEqual({ impressions: 1_250, clicks: 125, spend: 250, conversions: 12 });
    expect(result.dataThroughDate).toBe("2026-10-02");
    expect(result.devices).toEqual([
      expect.objectContaining({ device: "MOBILE", label: "Mobile", impressions: 1_000, impressionShare: 80 }),
      expect.objectContaining({ device: "DESKTOP", label: "Desktop", impressions: 250, impressionShare: 20 }),
    ]);
  });

  it("não divide por zero quando não há impressões", () => {
    const result = buildGoogleAdsDeviceMix(
      [row({ impressions: 0, clicks: 0, spend: 0, conversions: 0 })],
      "2026-10-01",
      "2026-10-01",
    );

    expect(result.devices[0]).toMatchObject({ impressionShare: 0 });
  });
});
