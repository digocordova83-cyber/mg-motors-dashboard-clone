import { readFile, writeFile } from "node:fs/promises";

import { buildWeeklySalesPreviewFromPdfExtraction } from "../server/weeklySalesPdf";

const pdfPath = "/home/ubuntu/upload/pasted_file_PMopUD_260803DailySalesPlanningReport.pdf";
const upperPath = "/home/ubuntu/tmp-sales-260803/retail-transcription-upper.tsv";
const lowerPath = "/home/ubuntu/tmp-sales-260803/retail-transcription-lower.tsv";
const outputPath = "/tmp/weekly-sales-260803-preview.json";

const weeks = ["1", "2", "3", "4", "5"] as const;

type WeekKey = (typeof weeks)[number];

type Metric = {
  target: number | null;
  retail: number | null;
  achievementPercent: number | null;
};

function parseNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed);
}

function parseTsv(tsv: string) {
  const lines = tsv.trimEnd().split("\n");
  const headers = lines[0].split("\t");
  return lines.slice(1).map(line => {
    const values = line.split("\t");
    while (values.length < headers.length) values.push("");
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    const weekMetrics = Object.fromEntries(
      weeks.map(week => [
        week,
        {
          target: parseNullableNumber(record[`w${week}_target`]),
          retail: parseNullableNumber(record[`w${week}_retail`]),
          achievementPercent: parseNullableNumber(record[`w${week}_percent`]),
        } satisfies Metric,
      ]),
    ) as Record<WeekKey, Metric>;
    return { name: record.name.trim(), weeks: weekMetrics };
  });
}

async function main() {
  const [pdfBytes, upper, lower] = await Promise.all([
    readFile(pdfPath),
    readFile(upperPath, "utf8"),
    readFile(lowerPath, "utf8"),
  ]);
  const extraction = {
    tableTitle: "Weekly Target Achievement - Retail",
    rows: [...parseTsv(upper), ...parseTsv(lower)],
  };
  const preview = buildWeeklySalesPreviewFromPdfExtraction(pdfBytes, extraction);
  await writeFile(outputPath, `${JSON.stringify(preview, null, 2)}\n`, "utf8");
  const audit = {
    outputPath,
    fileHash: preview.fileHash,
    valid: preview.errors.length === 0 && preview.summary.reconciliationPassed,
    errors: preview.errors,
    warnings: preview.warnings,
    summary: preview.summary,
  };
  console.log(JSON.stringify(audit, null, 2));
  if (!audit.valid) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
