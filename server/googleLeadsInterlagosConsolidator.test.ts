import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("consolidador da aba Interlagos", () => {
  it("preserva a origem e aceita registros de agenda sem dealer ou modelo canônico", () => {
    const verifier = path.resolve(process.cwd(), "scripts/verifyInterlagosLeadConsolidator.py");
    expect(() =>
      execFileSync("python3", [verifier], {
        cwd: path.dirname(verifier),
        stdio: "pipe",
      }),
    ).not.toThrow();
  });
});
