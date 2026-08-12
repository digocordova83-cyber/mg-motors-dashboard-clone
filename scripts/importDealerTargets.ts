import fs from "node:fs/promises";
import path from "node:path";

import { importDealerTargets } from "../server/dealerTargetsService";

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const file = argument("file");
  const competence = argument("competence");
  const actor = argument("actor") ?? "manus";
  if (!file || !competence) {
    throw new Error("Uso: tsx scripts/importDealerTargets.ts --file <metas.xlsx> --competence AAAA-MM [--actor nome]");
  }
  const resolved = path.resolve(file);
  const bytes = await fs.readFile(resolved);
  const result = await importDealerTargets({
    fileName: path.basename(resolved),
    bytes,
    competence,
    actor,
  });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
