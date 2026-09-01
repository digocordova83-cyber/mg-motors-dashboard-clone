import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("consolidador da aba TikTok", () => {
  it("preserva dealer bruto, deriva cidade/UF e mantém a procedência TikTok", () => {
    const verifier = path.resolve(process.cwd(), "scripts/verifyTikTokLeadConsolidator.py");
    expect(() =>
      execFileSync("python3", [verifier], {
        cwd: path.dirname(verifier),
        stdio: "pipe",
      }),
    ).not.toThrow();
  });
});
