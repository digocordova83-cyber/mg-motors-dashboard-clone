import { executeGoogleLeadsAutomation } from "../server/googleLeadsAutomation";

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function valueAfter(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const result = await executeGoogleLeadsAutomation({
    dryRun: hasFlag("--dry-run"),
    outputRoot: valueAfter("--output-root"),
    sourceUrl: valueAfter("--source-url"),
    actor: valueAfter("--actor"),
  });
  console.log(JSON.stringify(result));
  process.exit(0);
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
