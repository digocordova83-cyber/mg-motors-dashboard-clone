import { mkdir, writeFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { loadDashboardData } from "/home/ubuntu/mg-motors-dashboard-clone/server/dashboardService.ts";
import { loadMetaAdsData } from "/home/ubuntu/mg-motors-dashboard-clone/server/metaAdsService.ts";
import { loadTikTokAdsData } from "/home/ubuntu/mg-motors-dashboard-clone/server/tiktokAdsService.ts";

const OUTPUT_DIR = "/home/ubuntu/mg-lead-funnel-august-2026";
const DATE_FROM = "2026-08-01";
const DATE_TO = "2026-08-31";

await mkdir(OUTPUT_DIR, { recursive: true });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está disponível no ambiente.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [leadRows] = await connection.query(
  `SELECT correctedDate, model, channel, sourceChannel, dealerName, region
     FROM leads
    WHERE correctedDate BETWEEN ? AND ?
    ORDER BY correctedDate, id`,
  [DATE_FROM, DATE_TO],
);

const [salesImports] = await connection.query(
  `SELECT id, fileName, competence, referenceWeek, status,
          dealerRows, matchedDealerRows, unmatchedDealerRows,
          referenceDealerSalesTotal, referenceRegionSalesTotal,
          referenceReportedSalesTotal, reconciliationPassed, createdAt
     FROM weekly_sales_imports
    WHERE competence = '2026-08' AND status = 'COMPLETED'
    ORDER BY referenceWeek DESC, createdAt DESC`,
);

await connection.end();

const [google, meta, tiktok] = await Promise.all([
  loadDashboardData(DATE_FROM, DATE_TO),
  loadMetaAdsData(DATE_FROM, DATE_TO),
  loadTikTokAdsData(DATE_FROM, DATE_TO),
]);

const inspection = {
  period: { dateFrom: DATE_FROM, dateTo: DATE_TO },
  leadCount: leadRows.length,
  leadKeys: leadRows[0] ? Object.keys(leadRows[0]) : [],
  salesImports,
  googleKeys: Object.keys(google),
  googleOverview: google.overview,
  googleMetadata: google.metadata,
  googleProductPerformance: google.productPerformance,
  googleCampaignSample: google.campaigns?.slice(0, 3),
  metaKeys: Object.keys(meta),
  metaOverview: meta.overview,
  metaMetadata: meta.metadata,
  metaModels: meta.models,
  metaCampaignSample: meta.campaigns?.slice(0, 3),
  tiktokKeys: Object.keys(tiktok),
  tiktokOverview: tiktok.overview,
  tiktokMetadata: tiktok.metadata,
  tiktokModels: tiktok.models,
  tiktokCampaignSample: tiktok.campaigns?.slice(0, 3),
};

await writeFile(`${OUTPUT_DIR}/inspection.json`, JSON.stringify(inspection, null, 2));
await writeFile(`${OUTPUT_DIR}/leads_raw.json`, JSON.stringify(leadRows, null, 2));
await writeFile(`${OUTPUT_DIR}/google_dashboard.json`, JSON.stringify(google, null, 2));
await writeFile(`${OUTPUT_DIR}/meta_dashboard.json`, JSON.stringify(meta, null, 2));
await writeFile(`${OUTPUT_DIR}/tiktok_dashboard.json`, JSON.stringify(tiktok, null, 2));

console.log(JSON.stringify({ outputDir: OUTPUT_DIR, inspection }, null, 2));
