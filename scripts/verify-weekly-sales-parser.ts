import fs from "node:fs";

import { parseWeeklySalesCsv } from "../server/weeklySalesCsv";

const source = fs.readFileSync(
  "/home/ubuntu/upload/pasted_file_naFyvz_basevendaMG-WeeklyTargetAchievement.csv",
);
const preview = parseWeeklySalesCsv(source);
console.log(
  JSON.stringify(
    {
      summary: preview.summary,
      errors: preview.errors,
      warnings: preview.warnings,
      aliases: preview.rows
        .filter(row => row.rowType === "DEALER")
        .map(row => ({ source: row.sourceName, canonical: row.canonicalDealer })),
    },
    null,
    2,
  ),
);
