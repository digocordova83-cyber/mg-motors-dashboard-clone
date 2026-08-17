import { loadDashboardData } from "./dashboardService";
import { loadMetaAdsData } from "./metaAdsService";
import { loadTikTokAdsData } from "./tiktokAdsService";

export type PaidMediaChannel = "Site" | "Meta" | "TikTok";
export type PaidMediaSourceStatus = "AVAILABLE" | "PARTIAL" | "UNAVAILABLE";

export type PaidMediaMeasurement = {
  channel: PaidMediaChannel;
  platform: "Google Ads" | "Meta Ads" | "TikTok Ads";
  investment: number | null;
  source: string | null;
  updatedAt: string | null;
  dataThroughDate: string | null;
  status: PaidMediaSourceStatus;
  error: string | null;
};

export type LeadMediaInvestmentReference = {
  dateFrom: string;
  dateTo: string;
  formula: "CHANNEL_INVESTMENT_DIVIDED_BY_CHANNEL_LEADS";
  totalInvestment: number | null;
  availableInvestment: number;
  allSourcesAvailable: boolean;
  channels: Array<
    PaidMediaMeasurement & {
      leads: number;
      referenceCpl: number | null;
    }
  >;
};

type PaidMediaMeasurements = Record<PaidMediaChannel, PaidMediaMeasurement>;

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function unavailableMeasurement(
  channel: PaidMediaChannel,
  platform: PaidMediaMeasurement["platform"],
  error: unknown,
): PaidMediaMeasurement {
  return {
    channel,
    platform,
    investment: null,
    source: null,
    updatedAt: null,
    dataThroughDate: null,
    status: "UNAVAILABLE",
    error: errorMessage(error),
  };
}

function statusForCoverage(dataThroughDate: string | null, dateTo: string): PaidMediaSourceStatus {
  if (!dataThroughDate) return "PARTIAL";
  return dataThroughDate >= dateTo ? "AVAILABLE" : "PARTIAL";
}

export async function loadPaidMediaInvestmentMeasurements(
  dateFrom: string,
  dateTo: string,
): Promise<PaidMediaMeasurements> {
  const [googleResult, metaResult, tiktokResult] = await Promise.allSettled([
    loadDashboardData(dateFrom, dateTo),
    loadMetaAdsData(dateFrom, dateTo),
    loadTikTokAdsData(dateFrom, dateTo),
  ]);

  const google: PaidMediaMeasurement =
    googleResult.status === "fulfilled"
      ? {
          channel: "Site",
          platform: "Google Ads",
          investment: round(googleResult.value.summary.investment),
          source: googleResult.value.metadata.source,
          updatedAt: googleResult.value.metadata.updatedAt,
          dataThroughDate: googleResult.value.metadata.lastClosedDate ?? null,
          status: statusForCoverage(
            googleResult.value.metadata.lastClosedDate ?? null,
            dateTo,
          ),
          error: null,
        }
      : unavailableMeasurement("Site", "Google Ads", googleResult.reason);

  const meta: PaidMediaMeasurement =
    metaResult.status === "fulfilled"
      ? {
          channel: "Meta",
          platform: "Meta Ads",
          investment: round(metaResult.value.summary.spend),
          source: metaResult.value.metadata.source,
          updatedAt: metaResult.value.metadata.updatedAt,
          dataThroughDate: metaResult.value.metadata.dataThroughDate,
          status: statusForCoverage(metaResult.value.metadata.dataThroughDate, dateTo),
          error: null,
        }
      : unavailableMeasurement("Meta", "Meta Ads", metaResult.reason);

  const tiktok: PaidMediaMeasurement =
    tiktokResult.status === "fulfilled"
      ? {
          channel: "TikTok",
          platform: "TikTok Ads",
          investment: round(tiktokResult.value.summary.spend),
          source: tiktokResult.value.metadata.source,
          updatedAt: tiktokResult.value.metadata.updatedAt,
          dataThroughDate: tiktokResult.value.metadata.dataThroughDate,
          status: statusForCoverage(tiktokResult.value.metadata.dataThroughDate, dateTo),
          error: null,
        }
      : unavailableMeasurement("TikTok", "TikTok Ads", tiktokResult.reason);

  return { Site: google, Meta: meta, TikTok: tiktok };
}

export function buildLeadMediaInvestmentReference(input: {
  dateFrom: string;
  dateTo: string;
  channelLeads: Array<{ value: string; leads: number }>;
  measurements: PaidMediaMeasurements;
}): LeadMediaInvestmentReference {
  const leadsByChannel = new Map(input.channelLeads.map(item => [item.value, item.leads]));
  const channels = (["Site", "Meta", "TikTok"] as const).map(channel => {
    const measurement = input.measurements[channel];
    const leads = leadsByChannel.get(channel) ?? 0;
    return {
      ...measurement,
      leads,
      referenceCpl:
        measurement.investment != null && leads > 0
          ? round(measurement.investment / leads)
          : null,
    };
  });
  const availableInvestment = round(
    channels.reduce((sum, item) => sum + (item.investment ?? 0), 0),
  );
  const allSourcesAvailable = channels.every(item => item.status === "AVAILABLE");

  return {
    dateFrom: input.dateFrom,
    dateTo: input.dateTo,
    formula: "CHANNEL_INVESTMENT_DIVIDED_BY_CHANNEL_LEADS",
    totalInvestment: allSourcesAvailable ? availableInvestment : null,
    availableInvestment,
    allSourcesAvailable,
    channels,
  };
}
