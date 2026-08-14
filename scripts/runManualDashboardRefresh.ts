import { pathToFileURL } from "node:url";

import {
  executeDailyRefresh,
  getPreviousCompleteDate,
} from "../server/scheduledRefresh";

export async function runManualDashboardRefresh() {
  const date = getPreviousCompleteDate(new Date());
  return executeDailyRefresh({
    date,
    taskUid: `manual-dashboard-refresh-${date}`,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runManualDashboardRefresh()
    .then(result => {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(result.ok ? 0 : 2);
    })
    .catch(error => {
      console.error(error instanceof Error ? error.stack ?? error.message : error);
      process.exit(1);
    });
}
