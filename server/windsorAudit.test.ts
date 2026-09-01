import { describe, expect, it } from "vitest";

import {
  classifyDateCoverage,
  reconcileMetric,
} from "../scripts/auditWindsorAdsConnections";

describe("auditoria Windsor", () => {
  it("separa ausências iniciais de lacunas internas e finais", () => {
    expect(classifyDateCoverage("2026-08-01", "2026-08-07", [
      "2026-08-03",
      "2026-08-04",
      "2026-08-06",
    ])).toEqual({
      firstDate: "2026-08-03",
      lastDate: "2026-08-06",
      missingDates: ["2026-08-01", "2026-08-02", "2026-08-05", "2026-08-07"],
      leadingMissingDates: ["2026-08-01", "2026-08-02"],
      internalMissingDates: ["2026-08-05"],
      trailingMissingDates: ["2026-08-07"],
    });
  });

  it("aceita somente deltas dentro da tolerância explícita", () => {
    expect(reconcileMetric(133_013.75, 133_013.74, 0.12)).toMatchObject({
      delta: -0.01,
      reconciled: true,
    });
    expect(reconcileMetric(2_245.1, 2_245.2, 0.6, 1)).toMatchObject({
      delta: 0.1,
      reconciled: true,
    });
    expect(reconcileMetric(13_298.72, 13_299.92, 0.5)).toMatchObject({
      delta: 1.2,
      reconciled: false,
    });
  });
});
