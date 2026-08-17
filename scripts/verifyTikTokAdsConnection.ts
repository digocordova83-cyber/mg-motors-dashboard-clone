import { getDashboardCutoffDate } from "../shared/dashboardDates";
import {
  loadTikTokAdsData,
  TIKTOK_ADS_ACCOUNT_ID,
} from "../server/tiktokAdsService";

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function sum<T>(rows: T[], selector: (row: T) => number) {
  return round(rows.reduce((total, row) => total + selector(row), 0));
}

function assertClose(label: string, actual: number, expected: number, tolerance = 0.02) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: esperado ${expected}, obtido ${actual}`);
  }
}

async function main() {
  const dateTo = getDashboardCutoffDate();
  const dateFrom = `${dateTo.slice(0, 7)}-01`;
  const data = await loadTikTokAdsData(dateFrom, dateTo, { forceRefresh: true });

  if (data.account.id !== TIKTOK_ADS_ACCOUNT_ID) {
    throw new Error(`Conta inesperada: ${data.account.id}`);
  }
  if (data.metadata.source !== "windsor-live") {
    throw new Error(`A auditoria exige fonte ao vivo; recebida ${data.metadata.source}`);
  }
  if (data.metadata.dataThroughDate !== dateTo) {
    throw new Error(
      `Cobertura incompleta: ${data.metadata.dataThroughDate} em vez de ${dateTo}`,
    );
  }

  assertClose("investimento diário", sum(data.daily, row => row.spend), data.summary.spend);
  assertClose("Leads diários", sum(data.daily, row => row.leads), data.summary.leads);
  assertClose(
    "impressões diárias",
    sum(data.daily, row => row.impressions),
    data.summary.impressions,
  );
  assertClose("cliques diários", sum(data.daily, row => row.clicks), data.summary.clicks);
  assertClose(
    "Leads por campanha",
    sum(data.campaigns, row => row.leads),
    data.summary.leads,
  );
  assertClose(
    "Leads na série diária por campanha",
    sum(data.dailyBreakdown.campaigns, row => row.leads),
    data.summary.leads,
  );
  assertClose(
    "Leads por grupo",
    sum(data.adGroups, row => row.leads),
    data.summary.leads,
  );
  assertClose(
    "Leads na série diária por grupo",
    sum(data.dailyBreakdown.adGroups, row => row.leads),
    data.summary.leads,
  );
  assertClose("Leads por anúncio", sum(data.ads, row => row.leads), data.summary.leads);
  assertClose(
    "conversões por gênero",
    sum(data.demographics.genders, row => row.conversions),
    data.summary.conversions,
  );
  assertClose(
    "conversões por idade",
    sum(data.demographics.ages, row => row.conversions),
    data.summary.conversions,
  );
  assertClose(
    "conversões por região",
    sum(data.regions, row => row.conversions),
    data.summary.conversions,
  );

  console.log(
    JSON.stringify(
      {
        status: "OK",
        account: data.account,
        period: data.period,
        summary: data.summary,
        coverage: {
          dataThroughDate: data.metadata.dataThroughDate,
          activeDates: data.daily.map(row => row.date),
          rowCounts: data.metadata.rowCounts,
        },
        reconciliation: {
          dailySpend: sum(data.daily, row => row.spend),
          dailyLeads: sum(data.daily, row => row.leads),
          campaignLeads: sum(data.campaigns, row => row.leads),
          campaignDailyLeads: sum(data.dailyBreakdown.campaigns, row => row.leads),
          adGroupLeads: sum(data.adGroups, row => row.leads),
          adGroupDailyLeads: sum(data.dailyBreakdown.adGroups, row => row.leads),
          adLeads: sum(data.ads, row => row.leads),
          genderConversions: sum(data.demographics.genders, row => row.conversions),
          ageConversions: sum(data.demographics.ages, row => row.conversions),
          regionalConversions: sum(data.regions, row => row.conversions),
        },
        metadata: data.metadata,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
