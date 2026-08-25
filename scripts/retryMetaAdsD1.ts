import { loadMetaAdsData } from "../server/metaAdsService";

const dateFrom = process.argv[2] ?? "2026-08-17";
const dateTo = process.argv[3] ?? "2026-08-23";

async function main() {
  const data = await loadMetaAdsData(dateFrom, dateTo, { forceRefresh: true });
  const complete = data.metadata.source === "windsor-live" && data.metadata.dataThroughDate === dateTo && data.daily.some(row => row.date === dateTo);
  const result = {
    ok: complete,
    period: { dateFrom, dateTo },
    source: data.metadata.source,
    cacheHit: data.metadata.cacheHit,
    dataThroughDate: data.metadata.dataThroughDate,
    rowCounts: data.metadata.rowCounts,
    summary: data.summary,
    updatedAt: data.metadata.updatedAt,
    complete,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!complete) process.exitCode = 2;
}

main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
