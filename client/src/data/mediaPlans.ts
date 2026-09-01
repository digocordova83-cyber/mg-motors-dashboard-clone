export type MediaPlanFunnel = "AWARENESS" | "CONSIDERATION" | "CONVERSION";
export type MediaPlanMode = "DELIVERY" | "FINANCIAL";
export type MediaPlanStatus = "PAID" | "PAYABLES" | "NOT_INFORMED";

export type MediaPlanRow = {
  id: string;
  sourceRow: number;
  funnel?: MediaPlanFunnel;
  channel: string;
  publisher?: string;
  product: string;
  objectivePt?: string;
  objectiveEn?: string;
  investment: number;
  commission?: number;
  netInvestment?: number;
  actualInvestment?: number;
  status?: MediaPlanStatus;
  cpm?: number;
  impressions?: number;
  ctr?: number;
  clicks?: number;
  connectRate?: number;
  visits?: number;
  cvr?: number;
  leads?: number | null;
  cpl?: number | null;
};

export type MediaPlanTotal = {
  sourceRow: number;
  label: string;
  product: string | null;
  investment: number;
  commission?: number;
  netInvestment?: number;
  actualInvestment?: number;
  impressions?: number;
  ctr?: number;
  clicks?: number;
  visits?: number;
  cvr?: number;
  leads?: number;
  cpl?: number;
};

export type MonthlyMediaPlan = {
  month: string;
  titlePt: string;
  titleEn: string;
  sourceFile: string;
  sourceSheet: string;
  formulaCount: number;
  updatedAt: string;
  mode: MediaPlanMode;
  sourceNotePt: string;
  sourceNoteEn: string;
  rows: MediaPlanRow[];
  totals: MediaPlanTotal[];
  total: MediaPlanTotal;
};

const AUGUST_2026: MonthlyMediaPlan = {
  month: "2026-08",
  titlePt: "Plano de Mídia Digital — Agosto de 2026",
  titleEn: "Digital Media Plan — August 2026",
  sourceFile: "controle-financeiro.xlsx",
  sourceSheet: "Agosto",
  formulaCount: 51,
  updatedAt: "2026-08-05T14:26:45.000Z",
  mode: "FINANCIAL",
  sourceNotePt: "Fonte: controle-financeiro.xlsx, aba Agosto, recebida em 5 de agosto de 2026. Foram preservados PLAN GROSS, comissão de 4%, NET, investimento realizado e status. A planilha não informa projeções de impressões, cliques, visitas, leads, CPL ou etapas do funil.",
  sourceNoteEn: "Source: controle-financeiro.xlsx, August sheet, received on August 5, 2026. PLAN GROSS, 4% commission, NET, actual investment and status were preserved. The workbook does not provide projected impressions, clicks, visits, leads, CPL or funnel stages.",
  rows: [
    { id: "aug-lineup-google", sourceRow: 10, channel: "Google Ads", publisher: "Google", product: "Line-up", investment: 350000, commission: 14000, netInvestment: 336000, actualInvestment: 0, status: "PAID" },
    { id: "aug-lineup-webmotors", sourceRow: 11, channel: "Webmotors", publisher: "Webmotors", product: "Line-up", investment: 170846.96, commission: 6833.8784, netInvestment: 164013.0816, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-lineup-uol", sourceRow: 12, channel: "UOL / Quatro Rodas", publisher: "UOL", product: "Line-up", investment: 0, commission: 0, netInvestment: 0, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-lineup-tiktok", sourceRow: 13, channel: "TikTok", publisher: "Publya", product: "Line-up", investment: 30000, commission: 1200, netInvestment: 28800, actualInvestment: 0, status: "NOT_INFORMED" },
    { id: "aug-lineup-display", sourceRow: 14, channel: "Display", publisher: "Publya", product: "Line-up", investment: 96250, commission: 3850, netInvestment: 92400, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-lineup-meta", sourceRow: 15, channel: "Meta", publisher: "Publya", product: "Line-up", investment: 150000, commission: 6000, netInvestment: 144000, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-lineup-youtube", sourceRow: 16, channel: "YouTube", publisher: "Publya", product: "Line-up", investment: 0, commission: 0, netInvestment: 0, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-lineup-mercado-livre", sourceRow: 17, channel: "Mercado Livre", publisher: "Mercado Livre", product: "Line-up", investment: 71458.3, commission: 2858.332, netInvestment: 68599.968, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-urban-google", sourceRow: 22, channel: "Google Ads", publisher: "Google", product: "MG4 Urban", investment: 80000, commission: 3200, netInvestment: 76800, actualInvestment: 0, status: "PAID" },
    { id: "aug-urban-youtube", sourceRow: 23, channel: "YouTube", publisher: "Publya", product: "MG4 Urban", investment: 26444.74, commission: 1057.7896, netInvestment: 25386.9504, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-urban-meta", sourceRow: 24, channel: "Meta", publisher: "Publya", product: "MG4 Urban", investment: 45000, commission: 1800, netInvestment: 43200, actualInvestment: 0, status: "PAYABLES" },
    { id: "aug-urban-webmotors", sourceRow: 25, channel: "Webmotors", publisher: "Webmotors", product: "MG4 Urban", investment: 15000, commission: 600, netInvestment: 14400, actualInvestment: 0, status: "NOT_INFORMED" },
    { id: "aug-urban-mercado-livre", sourceRow: 26, channel: "Mercado Livre", publisher: "Mercado Livre", product: "MG4 Urban", investment: 15000, commission: 600, netInvestment: 14400, actualInvestment: 0, status: "NOT_INFORMED" },
  ],
  totals: [
    { sourceRow: 18, label: "LINE-UP", product: "Line-up", investment: 868555.26, commission: 34742.2104, netInvestment: 833813.0496, actualInvestment: 0 },
    { sourceRow: 27, label: "MG4 URBAN", product: "MG4 Urban", investment: 181444.74, commission: 7257.7896, netInvestment: 174186.9504, actualInvestment: 0 },
  ],
  total: { sourceRow: 29, label: "GERAL DIGITAL", product: null, investment: 1050000, commission: 42000, netInvestment: 1008000, actualInvestment: 0 },
};

const JULY_2026: MonthlyMediaPlan = {
  month: "2026-07",
  titlePt: "Plano de Mídia Digital — Julho de 2026",
  titleEn: "Digital Media Plan — July 2026",
  sourceFile: "Planilhasemtítulo.xlsx",
  sourceSheet: "Página1",
  formulaCount: 0,
  updatedAt: "2026-07-21T19:13:56.000Z",
  mode: "DELIVERY",
  sourceNotePt: "Fonte: planilha enviada em 21 de julho de 2026, aba Página1. Investimentos e premissas de entrega foram preservados; Leads projetados e CPL foram reprojectados proporcionalmente para a meta de 10.000 Leads.",
  sourceNoteEn: "Source: workbook supplied on July 21, 2026, sheet Página1. Investment and delivery assumptions are preserved; projected Leads and CPL were proportionally revised to a 10,000-Lead target.",
  rows: [
    { id: "lineup-google-pmax", sourceRow: 5, funnel: "CONVERSION", channel: "Google PMAX", product: "Line-up", objectivePt: "Leads / Conversão", objectiveEn: "Leads / Conversion", investment: 300000, cpm: 16.82, impressions: 17835910, ctr: 0.025, clicks: 445898, connectRate: 0.35, visits: 156064, cvr: 0.0396, leads: 6173, cpl: 48.6 },
    { id: "lineup-google-search", sourceRow: 6, funnel: "CONVERSION", channel: "Google Search", product: "Line-up", objectivePt: "Leads / Intenção", objectiveEn: "Leads / Intent", investment: 70000, cpm: 33.33, impressions: 2100210, ctr: 0.05, clicks: 105011, connectRate: 0.4, visits: 42004, cvr: 0.0181, leads: 759, cpl: 92.23 },
    { id: "lineup-webmotors", sourceRow: 7, funnel: "CONVERSION", channel: "Webmotors", product: "Line-up", objectivePt: "Leads / Inventário", objectiveEn: "Leads / Inventory", investment: 100000, cpm: 15, impressions: 6666667, ctr: 0.012, clicks: 80000, connectRate: 0.4, visits: 32000, cvr: 0.0127, leads: 407, cpl: 245.7 },
    { id: "lineup-uol-quatro-rodas", sourceRow: 8, funnel: "CONVERSION", channel: "UOL / Quatro Rodas", product: "Line-up", objectivePt: "Leads / Contextual", objectiveEn: "Leads / Contextual", investment: 50000, cpm: 12, impressions: 4166667, ctr: 0.012, clicks: 50000, connectRate: 0.4, visits: 20000, cvr: 0.0102, leads: 204, cpl: 245.1 },
    { id: "lineup-proxy-media", sourceRow: 9, funnel: "CONVERSION", channel: "Proxy Media", product: "Line-up", objectivePt: "Leads / Afiliados", objectiveEn: "Leads / Affiliates", investment: 30000, cpm: 11.43, impressions: 2624672, ctr: 0.012, clicks: 31496, connectRate: 0.4, visits: 12598, cvr: 0.0097, leads: 122, cpl: 245.9 },
    { id: "lineup-publya", sourceRow: 10, funnel: "CONVERSION", channel: "Publya (Programmatic)", product: "Line-up", objectivePt: "Leads / Geolocalização", objectiveEn: "Leads / Geolocation", investment: 150000, cpm: 12, impressions: 12500000, ctr: 0.015, clicks: 187500, connectRate: 0.35, visits: 65625, cvr: 0.0119, leads: 784, cpl: 191.33 },
    { id: "lineup-meta-via-publya", sourceRow: 11, funnel: "CONVERSION", channel: "Meta Ads (via Publya)", product: "Line-up", objectivePt: "Leads / Social", objectiveEn: "Leads / Social", investment: 80000, cpm: 10, impressions: 8000000, ctr: 0.02, clicks: 160000, connectRate: 0.38, visits: 60800, cvr: 0.0163, leads: 991, cpl: 80.73 },
    { id: "lineup-google-demand-gen", sourceRow: 12, funnel: "CONSIDERATION", channel: "Google Demand Gen", product: "Line-up", objectivePt: "Tráfego / Consideração", objectiveEn: "Traffic / Consideration", investment: 30000, cpm: 8.33, impressions: 3601441, ctr: 0.015, clicks: 54022, connectRate: 0.4, visits: 21609, cvr: 0, leads: null, cpl: null },
    { id: "lineup-mercado-livre", sourceRow: 13, funnel: "CONSIDERATION", channel: "Mercado Livre Ads", product: "Line-up", objectivePt: "Tráfego / Marketplace", objectiveEn: "Traffic / Marketplace", investment: 40000, cpm: 10, impressions: 4000000, ctr: 0.012, clicks: 48000, connectRate: 0.4, visits: 19200, cvr: 0, leads: null, cpl: null },
    { id: "mg4-youtube-video", sourceRow: 17, funnel: "AWARENESS", channel: "YouTube Video", product: "MG4 Urban", objectivePt: "Visualizações / Lançamento", objectiveEn: "Views / Launch", investment: 45000, cpm: 6, impressions: 7500000, ctr: 0.006, clicks: 45000, connectRate: 0.2, visits: 9000, cvr: 0, leads: null, cpl: null },
    { id: "mg4-google-demand-gen", sourceRow: 18, funnel: "CONSIDERATION", channel: "Google Demand Gen", product: "MG4 Urban", objectivePt: "Tráfego / Descoberta", objectiveEn: "Traffic / Discovery", investment: 30000, cpm: 8, impressions: 3750000, ctr: 0.015, clicks: 56250, connectRate: 0.4, visits: 22500, cvr: 0, leads: null, cpl: null },
    { id: "mg4-google-pmax", sourceRow: 19, funnel: "CONVERSION", channel: "Google PMAX", product: "MG4 Urban", objectivePt: "Leads / Pré-venda", objectiveEn: "Leads / Pre-sale", investment: 50000, cpm: 15, impressions: 3333333, ctr: 0.025, clicks: 83333, connectRate: 0.35, visits: 29167, cvr: 0.0109, leads: 317, cpl: 157.73 },
    { id: "mg4-google-search", sourceRow: 20, funnel: "CONVERSION", channel: "Google Search", product: "MG4 Urban", objectivePt: "Leads / Intenção", objectiveEn: "Leads / Intent", investment: 20000, cpm: 33.33, impressions: 600060, ctr: 0.05, clicks: 30003, connectRate: 0.4, visits: 12001, cvr: 0.0072, leads: 86, cpl: 232.56 },
    { id: "mg4-webmotors", sourceRow: 21, funnel: "CONVERSION", channel: "Webmotors", product: "MG4 Urban", objectivePt: "Leads / Inventário", objectiveEn: "Leads / Inventory", investment: 25000, cpm: 15, impressions: 1666667, ctr: 0.012, clicks: 20000, connectRate: 0.4, visits: 8000, cvr: 0.0127, leads: 102, cpl: 245.1 },
    { id: "mg4-mercado-livre", sourceRow: 22, funnel: "CONSIDERATION", channel: "Mercado Livre Ads", product: "MG4 Urban", objectivePt: "Tráfego / Marketplace", objectiveEn: "Traffic / Marketplace", investment: 30000, cpm: 10, impressions: 3000000, ctr: 0.012, clicks: 36000, connectRate: 0.4, visits: 14400, cvr: 0.0038, leads: 55, cpl: 545.45 },
  ],
  totals: [
    { sourceRow: 14, label: "LINE-UP", product: "Line-up", investment: 850000, impressions: 61495565, ctr: 0.0189, clicks: 1161926, visits: 429900, cvr: 0.022, leads: 9440, cpl: 90.04 },
    { sourceRow: 23, label: "MG4 URBAN", product: "MG4 Urban", investment: 200000, impressions: 19850060, ctr: 0.0136, clicks: 270586, visits: 95068, cvr: 0.0059, leads: 560, cpl: 357.14 },
  ],
  total: { sourceRow: 25, label: "GERAL DIGITAL", product: null, investment: 1050000, impressions: 81345625, ctr: 0.0176, clicks: 1432512, visits: 524968, cvr: 0.019, leads: 10000, cpl: 105 },
};

export const MEDIA_PLANS: MonthlyMediaPlan[] = [AUGUST_2026, JULY_2026];

export function getMediaPlan(month: string): MonthlyMediaPlan | null {
  return MEDIA_PLANS.find((plan) => plan.month === month) ?? null;
}
