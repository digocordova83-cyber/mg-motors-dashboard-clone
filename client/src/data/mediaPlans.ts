export type MediaPlanFunnel = "AWARENESS" | "CONSIDERATION" | "CONVERSION";

export type MediaPlanRow = {
  id: string;
  funnel: MediaPlanFunnel;
  channel: string;
  product: string;
  objectivePt: string;
  objectiveEn: string;
  grossInvestment: number;
  commission: number;
  netInvestment: number;
  cpm: number;
  impressions: number;
  ctr: number;
  clicks: number;
  connectRate: number;
  visits: number;
  cvr: number;
  leads: number | null;
  cpl: number | null;
};

export type MediaPlanTotal = {
  label: string;
  product: string | null;
  netInvestment: number;
  impressions: number;
  ctr: number;
  clicks: number;
  visits: number;
  cvr: number;
  leads: number;
  cpl: number;
};

export type MonthlyMediaPlan = {
  month: string;
  titlePt: string;
  titleEn: string;
  sourceSheet: string;
  updatedAt: string;
  rows: MediaPlanRow[];
  totals: MediaPlanTotal[];
  total: MediaPlanTotal;
};

export const MEDIA_PLANS: MonthlyMediaPlan[] = [
  {
    month: "2026-07",
    titlePt: "Plano de Mídia Digital — Julho de 2026",
    titleEn: "Digital Media Plan — July 2026",
    sourceSheet: "Página1",
    updatedAt: "2026-07-21T04:36:21.430Z",
    rows: [
      { id: "lineup-pmax", funnel: "CONVERSION", channel: "Google PMAX", product: "Line-up", objectivePt: "Leads / Conversão", objectiveEn: "Leads / Conversion", grossInvestment: 450000, commission: 18000, netInvestment: 432000, cpm: 16.82, impressions: 25683710, ctr: 0.025, clicks: 642093, connectRate: 0.35, visits: 224732, cvr: 0.0727, leads: 10892, cpl: 39.66 },
      { id: "lineup-search", funnel: "CONVERSION", channel: "Google Search", product: "Line-up", objectivePt: "Leads / Intenção", objectiveEn: "Leads / Intent", grossInvestment: 70000, commission: 2800, netInvestment: 67200, cpm: 33.33, impressions: 2016202, ctr: 0.05, clicks: 100810, connectRate: 0.4, visits: 40324, cvr: 0.0333, leads: 1343, cpl: 50.05 },
      { id: "lineup-webmotors", funnel: "CONVERSION", channel: "Webmotors", product: "Line-up", objectivePt: "Leads / Inventário", objectiveEn: "Leads / Inventory", grossInvestment: 100000, commission: 4000, netInvestment: 96000, cpm: 15, impressions: 6400000, ctr: 0.012, clicks: 76800, connectRate: 0.4, visits: 30720, cvr: 0.0234, leads: 719, cpl: 133.55 },
      { id: "lineup-uol", funnel: "CONVERSION", channel: "UOL / Quatro Rodas", product: "Line-up", objectivePt: "Leads / Contextual", objectiveEn: "Leads / Contextual", grossInvestment: 50000, commission: 2000, netInvestment: 48000, cpm: 12, impressions: 4000000, ctr: 0.012, clicks: 48000, connectRate: 0.4, visits: 19200, cvr: 0.0188, leads: 361, cpl: 132.98 },
      { id: "lineup-proxy", funnel: "CONVERSION", channel: "Proxy Media", product: "Line-up", objectivePt: "Leads / Afiliados", objectiveEn: "Leads / Affiliates", grossInvestment: 30000, commission: 1200, netInvestment: 28800, cpm: 11.43, impressions: 2519685, ctr: 0.012, clicks: 30236, connectRate: 0.4, visits: 12094, cvr: 0.0179, leads: 216, cpl: 133.03 },
      { id: "lineup-publya", funnel: "CONVERSION", channel: "Publya (Programmatic)", product: "Line-up", objectivePt: "Leads / Geolocalização", objectiveEn: "Leads / Geolocation", grossInvestment: 150000, commission: 6000, netInvestment: 144000, cpm: 12, impressions: 12000000, ctr: 0.015, clicks: 180000, connectRate: 0.35, visits: 63000, cvr: 0.022, leads: 1386, cpl: 103.9 },
      { id: "lineup-meta", funnel: "CONVERSION", channel: "Meta Ads (via Publya)", product: "Line-up", objectivePt: "Leads / Social", objectiveEn: "Leads / Social", grossInvestment: 80000, commission: 3200, netInvestment: 76800, cpm: 10, impressions: 7680000, ctr: 0.02, clicks: 153600, connectRate: 0.38, visits: 58368, cvr: 0.03, leads: 1751, cpl: 43.86 },
      { id: "lineup-demandgen", funnel: "CONSIDERATION", channel: "Google Demand Gen", product: "Line-up", objectivePt: "Tráfego / Consideração", objectiveEn: "Traffic / Consideration", grossInvestment: 30000, commission: 1200, netInvestment: 28800, cpm: 8.33, impressions: 3457383, ctr: 0.015, clicks: 51861, connectRate: 0.4, visits: 20744, cvr: 0, leads: null, cpl: null },
      { id: "lineup-mercadolivre", funnel: "CONSIDERATION", channel: "Mercado Livre Ads", product: "Line-up", objectivePt: "Tráfego / Marketplace", objectiveEn: "Traffic / Marketplace", grossInvestment: 40000, commission: 1600, netInvestment: 38400, cpm: 10, impressions: 3840000, ctr: 0.012, clicks: 46080, connectRate: 0.4, visits: 18432, cvr: 0, leads: null, cpl: null },
      { id: "mg4-youtube", funnel: "AWARENESS", channel: "YouTube Video", product: "MG4 Urban", objectivePt: "Visualizações / Lançamento", objectiveEn: "Views / Launch", grossInvestment: 45000, commission: 1800, netInvestment: 43200, cpm: 6, impressions: 7200000, ctr: 0.006, clicks: 43200, connectRate: 0.2, visits: 8640, cvr: 0, leads: null, cpl: null },
      { id: "mg4-demandgen", funnel: "CONSIDERATION", channel: "Google Demand Gen", product: "MG4 Urban", objectivePt: "Tráfego / Descoberta", objectiveEn: "Traffic / Discovery", grossInvestment: 30000, commission: 1200, netInvestment: 28800, cpm: 8, impressions: 3600000, ctr: 0.015, clicks: 54000, connectRate: 0.4, visits: 21600, cvr: 0, leads: null, cpl: null },
      { id: "mg4-pmax", funnel: "CONVERSION", channel: "Google PMAX", product: "MG4 Urban", objectivePt: "Leads / Pré-venda", objectiveEn: "Leads / Pre-sale", grossInvestment: 50000, commission: 2000, netInvestment: 48000, cpm: 15, impressions: 3200000, ctr: 0.025, clicks: 80000, connectRate: 0.35, visits: 28000, cvr: 0.02, leads: 560, cpl: 85.71 },
      { id: "mg4-search", funnel: "CONVERSION", channel: "Google Search", product: "MG4 Urban", objectivePt: "Leads / Intenção", objectiveEn: "Leads / Intent", grossInvestment: 20000, commission: 800, netInvestment: 19200, cpm: 33.33, impressions: 576058, ctr: 0.05, clicks: 28803, connectRate: 0.4, visits: 11521, cvr: 0.0133, leads: 153, cpl: 125.3 },
      { id: "mg4-webmotors", funnel: "CONVERSION", channel: "Webmotors", product: "MG4 Urban", objectivePt: "Leads / Inventário", objectiveEn: "Leads / Inventory", grossInvestment: 25000, commission: 1000, netInvestment: 24000, cpm: 15, impressions: 1600000, ctr: 0.012, clicks: 19200, connectRate: 0.4, visits: 7680, cvr: 0.0234, leads: 180, cpl: 133.55 },
      { id: "mg4-mercadolivre", funnel: "CONSIDERATION", channel: "Mercado Livre Ads", product: "MG4 Urban", objectivePt: "Tráfego / Marketplace", objectiveEn: "Traffic / Marketplace", grossInvestment: 30000, commission: 1200, netInvestment: 28800, cpm: 10, impressions: 2880000, ctr: 0.012, clicks: 34560, connectRate: 0.4, visits: 13824, cvr: 0.007, leads: 97, cpl: 297.62 },
    ],
    totals: [
      { label: "LINE-UP", product: "Line-up", netInvestment: 960000, impressions: 67596979, ctr: 0.0197, clicks: 1329480, visits: 487615, cvr: 0.0342, leads: 16668, cpl: 57.59 },
      { label: "MG4 URBAN", product: "MG4 Urban", netInvestment: 192000, impressions: 19056058, ctr: 0.0136, clicks: 259763, visits: 91265, cvr: 0.0108, leads: 990, cpl: 194 },
    ],
    total: { label: "GERAL DIGITAL", product: null, netInvestment: 1152000, impressions: 86653037, ctr: 0.0183, clicks: 1589243, visits: 578880, cvr: 0.0305, leads: 17658, cpl: 65.24 },
  },
];

export function getMediaPlan(month: string): MonthlyMediaPlan | null {
  return MEDIA_PLANS.find((plan) => plan.month === month) ?? null;
}
