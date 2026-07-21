export type MediaPlanFunnel = "AWARENESS" | "CONSIDERATION" | "CONVERSION";

export type MediaPlanRow = {
  id: string;
  sourceRow: number;
  funnel: MediaPlanFunnel;
  channel: string;
  product: string;
  objectivePt: string;
  objectiveEn: string;
  investment: number;
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
  sourceRow: number;
  label: string;
  product: string | null;
  investment: number;
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
  sourceFile: string;
  sourceSheet: string;
  formulaCount: number;
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
    sourceFile: "Planilhasemtítulo.xlsx",
    sourceSheet: "Página1",
    formulaCount: 0,
    updatedAt: "2026-07-21T19:00:00.000Z",
    rows: [
      { id: "lineup-google-pmax", sourceRow: 5, funnel: "CONVERSION", channel: "Google PMAX", product: "Line-up", objectivePt: "Leads / Conversão", objectiveEn: "Leads / Conversion", investment: 300000, cpm: 16.82, impressions: 17835910, ctr: 0.025, clicks: 445898, connectRate: 0.35, visits: 156064, cvr: 0.0672, leads: 10493, cpl: 28.59 },
      { id: "lineup-google-search", sourceRow: 6, funnel: "CONVERSION", channel: "Google Search", product: "Line-up", objectivePt: "Leads / Intenção", objectiveEn: "Leads / Intent", investment: 70000, cpm: 33.33, impressions: 2100210, ctr: 0.05, clicks: 105011, connectRate: 0.4, visits: 42004, cvr: 0.0307, leads: 1291, cpl: 54.21 },
      { id: "lineup-webmotors", sourceRow: 7, funnel: "CONVERSION", channel: "Webmotors", product: "Line-up", objectivePt: "Leads / Inventário", objectiveEn: "Leads / Inventory", investment: 100000, cpm: 15, impressions: 6666667, ctr: 0.012, clicks: 80000, connectRate: 0.4, visits: 32000, cvr: 0.0216, leads: 691, cpl: 144.66 },
      { id: "lineup-uol-quatro-rodas", sourceRow: 8, funnel: "CONVERSION", channel: "UOL / Quatro Rodas", product: "Line-up", objectivePt: "Leads / Contextual", objectiveEn: "Leads / Contextual", investment: 50000, cpm: 12, impressions: 4166667, ctr: 0.012, clicks: 50000, connectRate: 0.4, visits: 20000, cvr: 0.0174, leads: 347, cpl: 144.04 },
      { id: "lineup-proxy-media", sourceRow: 9, funnel: "CONVERSION", channel: "Proxy Media", product: "Line-up", objectivePt: "Leads / Afiliados", objectiveEn: "Leads / Affiliates", investment: 30000, cpm: 11.43, impressions: 2624672, ctr: 0.012, clicks: 31496, connectRate: 0.4, visits: 12598, cvr: 0.0165, leads: 208, cpl: 144.1 },
      { id: "lineup-publya", sourceRow: 10, funnel: "CONVERSION", channel: "Publya (Programmatic)", product: "Line-up", objectivePt: "Leads / Geolocalização", objectiveEn: "Leads / Geolocation", investment: 150000, cpm: 12, impressions: 12500000, ctr: 0.015, clicks: 187500, connectRate: 0.35, visits: 65625, cvr: 0.0203, leads: 1333, cpl: 112.54 },
      { id: "lineup-meta-via-publya", sourceRow: 11, funnel: "CONVERSION", channel: "Meta Ads (via Publya)", product: "Line-up", objectivePt: "Leads / Social", objectiveEn: "Leads / Social", investment: 80000, cpm: 10, impressions: 8000000, ctr: 0.02, clicks: 160000, connectRate: 0.38, visits: 60800, cvr: 0.0277, leads: 1684, cpl: 47.51 },
      { id: "lineup-google-demand-gen", sourceRow: 12, funnel: "CONSIDERATION", channel: "Google Demand Gen", product: "Line-up", objectivePt: "Tráfego / Consideração", objectiveEn: "Traffic / Consideration", investment: 30000, cpm: 8.33, impressions: 3601441, ctr: 0.015, clicks: 54022, connectRate: 0.4, visits: 21609, cvr: 0, leads: null, cpl: null },
      { id: "lineup-mercado-livre", sourceRow: 13, funnel: "CONSIDERATION", channel: "Mercado Livre Ads", product: "Line-up", objectivePt: "Tráfego / Marketplace", objectiveEn: "Traffic / Marketplace", investment: 40000, cpm: 10, impressions: 4000000, ctr: 0.012, clicks: 48000, connectRate: 0.4, visits: 19200, cvr: 0, leads: null, cpl: null },
      { id: "mg4-youtube-video", sourceRow: 17, funnel: "AWARENESS", channel: "YouTube Video", product: "MG4 Urban", objectivePt: "Visualizações / Lançamento", objectiveEn: "Views / Launch", investment: 45000, cpm: 6, impressions: 7500000, ctr: 0.006, clicks: 45000, connectRate: 0.2, visits: 9000, cvr: 0, leads: null, cpl: null },
      { id: "mg4-google-demand-gen", sourceRow: 18, funnel: "CONSIDERATION", channel: "Google Demand Gen", product: "MG4 Urban", objectivePt: "Tráfego / Descoberta", objectiveEn: "Traffic / Discovery", investment: 30000, cpm: 8, impressions: 3750000, ctr: 0.015, clicks: 56250, connectRate: 0.4, visits: 22500, cvr: 0, leads: null, cpl: null },
      { id: "mg4-google-pmax", sourceRow: 19, funnel: "CONVERSION", channel: "Google PMAX", product: "MG4 Urban", objectivePt: "Leads / Pré-venda", objectiveEn: "Leads / Pre-sale", investment: 50000, cpm: 15, impressions: 3333333, ctr: 0.025, clicks: 83333, connectRate: 0.35, visits: 29167, cvr: 0.0185, leads: 539, cpl: 92.84 },
      { id: "mg4-google-search", sourceRow: 20, funnel: "CONVERSION", channel: "Google Search", product: "MG4 Urban", objectivePt: "Leads / Intenção", objectiveEn: "Leads / Intent", investment: 20000, cpm: 33.33, impressions: 600060, ctr: 0.05, clicks: 30003, connectRate: 0.4, visits: 12001, cvr: 0.0123, leads: 147, cpl: 135.72 },
      { id: "mg4-webmotors", sourceRow: 21, funnel: "CONVERSION", channel: "Webmotors", product: "MG4 Urban", objectivePt: "Leads / Inventário", objectiveEn: "Leads / Inventory", investment: 25000, cpm: 15, impressions: 1666667, ctr: 0.012, clicks: 20000, connectRate: 0.4, visits: 8000, cvr: 0.0216, leads: 173, cpl: 144.66 },
      { id: "mg4-mercado-livre", sourceRow: 22, funnel: "CONSIDERATION", channel: "Mercado Livre Ads", product: "MG4 Urban", objectivePt: "Tráfego / Marketplace", objectiveEn: "Traffic / Marketplace", investment: 30000, cpm: 10, impressions: 3000000, ctr: 0.012, clicks: 36000, connectRate: 0.4, visits: 14400, cvr: 0.0065, leads: 93, cpl: 322.4 },
    ],
    totals: [
      { sourceRow: 14, label: "LINE-UP", product: "Line-up", investment: 850000, impressions: 61495565, ctr: 0.0189, clicks: 1161926, visits: 429900, cvr: 0.0373, leads: 16048, cpl: 52.97 },
      { sourceRow: 23, label: "MG4 URBAN", product: "MG4 Urban", investment: 200000, impressions: 19850060, ctr: 0.0136, clicks: 270586, visits: 95068, cvr: 0.01, leads: 952, cpl: 210.13 },
    ],
    total: { sourceRow: 25, label: "GERAL DIGITAL", product: null, investment: 1050000, impressions: 81345625, ctr: 0.0176, clicks: 1432512, visits: 524968, cvr: 0.0324, leads: 17000, cpl: 61.76 },
  },
];

export function getMediaPlan(month: string): MonthlyMediaPlan | null {
  return MEDIA_PLANS.find((plan) => plan.month === month) ?? null;
}
