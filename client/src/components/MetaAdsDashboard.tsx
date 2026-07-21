import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Eye,
  Gauge,
  ImageIcon,
  Loader2,
  MapPin,
  Megaphone,
  MousePointerClick,
  RefreshCcw,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AppRouter } from "../../../server/routers";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type MetaData = RouterOutputs["metaAds"]["data"];
type Locale = "pt-BR" | "en-US";

type MetaAdsDashboardProps = {
  locale?: Locale;
  onUpdatedAt?: (value: string) => void;
};

const FALLBACK_FROM = "2026-07-01";
const FALLBACK_TO = "2026-07-20";
const MODEL_COLORS: Record<string, string> = {
  MG4: "#e2212d",
  MG5: "#38bdf8",
  Cyberster: "#a78bfa",
  Outros: "#64748b",
};
const GENDER_COLORS = ["#e2212d", "#38bdf8", "#a78bfa", "#64748b"];

export const META_ADS_COPY = {
  "pt-BR": {
    eyebrow: "Meta Ads",
    title: "Performance de Mídia Social",
    period: "Período",
    month: "Mês",
    investment: "Investimento",
    leads: "Leads",
    cpl: "CPL Médio",
    reach: "Alcance",
    ctr: "CTR",
    clicks: "Cliques",
    spendLeadsTitle: "Evolução diária — investimento e Leads",
    spendLeadsSubtitle: "Leitura diária da conta Meta Ads vinculada ao Windsor.ai",
    dailyCplTitle: "Evolução diária do CPL",
    dailyCplSubtitle: "Custo por Lead calculado exclusivamente pela série diária",
    modelsTitle: "Performance por modelo",
    modelsSubtitle: "Modelo identificado no nome dos criativos, conjuntos e campanhas",
    model: "Modelo",
    ads: "Criativos",
    campaignsTitle: "Campanhas",
    campaignsSubtitle: "Ranking por volume de Leads e eficiência no período",
    audiencesTitle: "Principais públicos",
    audiencesSubtitle: "Conjuntos de anúncios, segmentações e desempenho observado",
    creativesTitle: "Criativos com melhor desempenho",
    creativesSubtitle: "Ranking real de anúncios; a imagem é exibida quando a fonte disponibiliza URL válida",
    audienceAnalysisTitle: "Análise do público alcançado",
    audienceAnalysisSubtitle: "Gênero, idade e distribuição regional reportados pelo Meta Ads",
    gender: "Gênero",
    age: "Faixa etária",
    region: "Região",
    impressions: "Impressões",
    audienceMapTitle: "Mapa de segmentações",
    audienceMapSubtitle: "Públicos personalizados, interesses e comportamentos presentes nos conjuntos ativos",
    customAudiences: "Públicos personalizados",
    interests: "Interesses",
    behaviors: "Comportamentos",
    noItems: "Nenhum item disponível para o período.",
    sourceLive: "Windsor.ai atualizado",
    sourceSnapshot: "Snapshot validado",
    through: "Dados até",
    updated: "Última atualização",
    refresh: "Atualizar",
    loading: "Carregando dados reais do Meta Ads...",
    errorTitle: "Não foi possível carregar o Meta Ads",
    errorDescription: "A conexão com o Windsor.ai pode estar temporariamente indisponível.",
    emptyTitle: "Sem dados no período",
    emptyDescription: "Selecione outro intervalo para consultar a conta vinculada.",
    regionalNote: "O detalhamento regional da fonte não disponibiliza Leads por região. Por isso, esta leitura compara alcance, impressões e investimento sem inferir CPL regional.",
    female: "Mulheres",
    male: "Homens",
    unknown: "Não informado",
    active: "Ativa",
    paused: "Pausada",
    unknownStatus: "Status não informado",
    audienceInsight: "Público com mais Leads",
    genderInsight: "Gênero com mais Leads",
    ageInsight: "Faixa com mais Leads",
    regionInsight: "Maior alcance regional",
    creativeInsight: "Criativo líder",
    adId: "ID do anúncio",
    creativeId: "ID do criativo",
    imageUnavailable: "Imagem não disponível na fonte",
  },
  "en-US": {
    eyebrow: "Meta Ads",
    title: "Social Media Performance",
    period: "Period",
    month: "Month",
    investment: "Spend",
    leads: "Leads",
    cpl: "Average CPL",
    reach: "Reach",
    ctr: "CTR",
    clicks: "Clicks",
    spendLeadsTitle: "Daily trend — spend and Leads",
    spendLeadsSubtitle: "Daily reading from the Meta Ads account connected to Windsor.ai",
    dailyCplTitle: "Daily CPL trend",
    dailyCplSubtitle: "Cost per Lead calculated exclusively from the daily series",
    modelsTitle: "Performance by model",
    modelsSubtitle: "Vehicle model identified from creative, ad set and campaign names",
    model: "Model",
    ads: "Creatives",
    campaignsTitle: "Campaigns",
    campaignsSubtitle: "Ranking by Lead volume and efficiency for the selected period",
    audiencesTitle: "Top audiences",
    audiencesSubtitle: "Ad sets, targeting and observed performance",
    creativesTitle: "Top-performing creatives",
    creativesSubtitle: "Actual ad ranking; imagery appears when the source provides a valid URL",
    audienceAnalysisTitle: "Reached audience analysis",
    audienceAnalysisSubtitle: "Gender, age and regional distribution reported by Meta Ads",
    gender: "Gender",
    age: "Age range",
    region: "Region",
    impressions: "Impressions",
    audienceMapTitle: "Targeting map",
    audienceMapSubtitle: "Custom audiences, interests and behaviors configured in active ad sets",
    customAudiences: "Custom audiences",
    interests: "Interests",
    behaviors: "Behaviors",
    noItems: "No items available for this period.",
    sourceLive: "Windsor.ai updated",
    sourceSnapshot: "Validated snapshot",
    through: "Data through",
    updated: "Last updated",
    refresh: "Refresh",
    loading: "Loading live Meta Ads data...",
    errorTitle: "Meta Ads could not be loaded",
    errorDescription: "The Windsor.ai connection may be temporarily unavailable.",
    emptyTitle: "No data for this period",
    emptyDescription: "Select another date range to query the connected account.",
    regionalNote: "The regional source breakdown does not provide Leads by region. This view therefore compares reach, impressions and spend without inferring regional CPL.",
    female: "Women",
    male: "Men",
    unknown: "Not reported",
    active: "Active",
    paused: "Paused",
    unknownStatus: "Status unavailable",
    audienceInsight: "Audience with most Leads",
    genderInsight: "Gender with most Leads",
    ageInsight: "Top Lead age range",
    regionInsight: "Largest regional reach",
    creativeInsight: "Leading creative",
    adId: "Ad ID",
    creativeId: "Creative ID",
    imageUnavailable: "Image unavailable from source",
  },
} as const;

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(
    new Date(`${value}T12:00:00Z`),
  );
}

function formatLongDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatNumber(value: number, locale: Locale, maximumFractionDigits = 1) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

function formatCurrency(value: number, locale: Locale, compact = false) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    notation: compact && Math.abs(value) >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: compact && Math.abs(value) >= 10_000 ? 1 : 2,
  }).format(value);
}

export function formatMetaAdsStatus(status: string, locale: Locale) {
  const t = META_ADS_COPY[locale];
  if (status.includes("ACTIVE")) return t.active;
  if (status.includes("PAUSED")) return t.paused;
  return t.unknownStatus;
}

export function formatMetaAdsGender(gender: string, locale: Locale) {
  const t = META_ADS_COPY[locale];
  if (gender === "female") return t.female;
  if (gender === "male") return t.male;
  return t.unknown;
}

export function translateMetaAdsTargeting(value: string, locale: Locale) {
  if (locale === "pt-BR") return value;
  return value
    .replace(/^Idade /, "Age ")
    .replace(/^Públicos: /, "Audiences: ")
    .replace(/^Semelhantes: /, "Lookalikes: ")
    .replace(/^Exclui: /, "Excludes: ")
    .replace(/^Interesses: /, "Interests: ")
    .replace(/^Comportamentos: /, "Behaviors: ")
    .replace(/ cidades segmentadas$/, " targeted cities")
    .replace(/^Plataformas: /, "Platforms: ");
}

function Panel({ title, subtitle, action, children, className = "" }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-[#1d2737] bg-[#0d1421] shadow-[0_18px_45px_rgba(0,0,0,0.16)] ${className}`}>
      <header className="flex min-h-[70px] flex-col gap-3 border-b border-[#1b2535] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-100">{title}</h2>
          {subtitle ? <p className="mt-1 text-[10px] leading-4 text-slate-600">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function MetricCard({ title, value, subtitle, icon, accent }: { title: string; value: string; subtitle: string; icon: ReactNode; accent: string }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[#1d2737] bg-[#0d1421] p-4 shadow-[0_14px_35px_rgba(0,0,0,0.16)]">
      <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">{title}</p>
          <p className="mt-2 truncate text-[22px] font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-1 truncate text-[9px] text-slate-600">{subtitle}</p>
        </div>
        <span className="rounded-xl border p-2.5" style={{ borderColor: `${accent}28`, backgroundColor: `${accent}12`, color: accent }}>{icon}</span>
      </div>
    </article>
  );
}

export function MetaAdsEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-[320px] place-items-center px-6 text-center">
      <div><BarChart3 className="mx-auto h-8 w-8 text-slate-700" /><h2 className="mt-3 text-sm font-semibold text-white">{title}</h2><p className="mt-1 text-xs text-slate-600">{description}</p></div>
    </div>
  );
}

function CreativeImage({ src, alt, fallbackLabel }: { src: string | null; alt: string; fallbackLabel: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="grid aspect-[1.6] place-items-center bg-[#111a29] px-6 text-center"><div><ImageIcon className="mx-auto h-7 w-7 text-slate-700" /><p className="mt-2 text-[9px] text-slate-600">{fallbackLabel}</p></div></div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="aspect-[1.6] w-full object-cover" />;
}

function MetaTooltip({ active, payload, label, locale }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string }>; label?: string; locale: Locale }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#2a364b] bg-[#080d16]/95 p-3 text-[10px] shadow-2xl backdrop-blur">
      {label ? <p className="mb-2 font-semibold text-slate-300">{/^\d{4}-\d{2}-\d{2}$/.test(label) ? formatLongDate(label, locale) : label}</p> : null}
      <div className="space-y-1.5">
        {payload.map(item => {
          const currencyMetric = item.name?.toLowerCase().includes("invest") || item.name?.toLowerCase().includes("spend") || item.name?.includes("CPL");
          return <div key={`${item.name}-${item.value}`} className="flex items-center justify-between gap-5"><span style={{ color: item.color }}>{item.name}</span><strong className="text-slate-200">{currencyMetric ? formatCurrency(Number(item.value ?? 0), locale) : formatNumber(Number(item.value ?? 0), locale)}</strong></div>;
        })}
      </div>
    </div>
  );
}

function InsightCard({ label, value, metric, icon }: { label: string; value: string; metric: string; icon: ReactNode }) {
  return (
    <article className="rounded-xl border border-[#202b3d] bg-[#0a101b] p-4">
      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">{icon}{label}</div>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] text-emerald-400">{metric}</p>
    </article>
  );
}

function DataTable({ columns, rows, emptyLabel }: { columns: string[]; rows: ReactNode[][]; emptyLabel: string }) {
  if (!rows.length) return <div className="grid min-h-[180px] place-items-center text-xs text-slate-600">{emptyLabel}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-[10px]">
        <thead className="bg-[#0a101b] text-[8px] uppercase tracking-[0.12em] text-slate-600"><tr>{columns.map(column => <th key={column} className="px-4 py-3 font-semibold">{column}</th>)}</tr></thead>
        <tbody className="divide-y divide-[#192334]">{rows.map((row, index) => <tr key={index} className="transition-colors hover:bg-white/[0.02]">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 text-slate-400">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function MetaAdsLoading({ locale = "pt-BR" }: { locale?: Locale }) {
  const t = META_ADS_COPY[locale];
  return <main className="mx-auto grid min-h-[620px] max-w-[1680px] place-items-center px-4"><div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-[#e2212d]" /><p className="mt-3 text-xs text-slate-500">{t.loading}</p></div></main>;
}

export function MetaAdsError({ locale = "pt-BR", onRetry }: { locale?: Locale; onRetry: () => void }) {
  const t = META_ADS_COPY[locale];
  return <main className="mx-auto max-w-[1680px] px-4 py-8"><div className="grid min-h-[480px] place-items-center rounded-2xl border border-red-500/20 bg-red-500/[0.04] px-6 text-center"><div><AlertTriangle className="mx-auto h-9 w-9 text-red-400" /><h1 className="mt-3 text-base font-semibold text-white">{t.errorTitle}</h1><p className="mt-1 text-xs text-slate-500">{t.errorDescription}</p><Button onClick={onRetry} className="mt-5 bg-[#e2212d] hover:bg-[#c91622]"><RefreshCcw className="mr-2 h-4 w-4" />{t.refresh}</Button></div></div></main>;
}

export function MetaAdsDashboard({ locale = "pt-BR", onUpdatedAt }: MetaAdsDashboardProps) {
  const t = META_ADS_COPY[locale];
  const bounds = trpc.metaAds.bounds.useQuery(undefined, { retry: 1, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false });
  const [dateFrom, setDateFrom] = useState(FALLBACK_FROM);
  const [dateTo, setDateTo] = useState(FALLBACK_TO);
  const [preset, setPreset] = useState("month");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || !bounds.data) return;
    const latest = bounds.data.latestDate;
    setDateFrom(`${latest.slice(0, 7)}-01` < bounds.data.earliestDate ? bounds.data.earliestDate : `${latest.slice(0, 7)}-01`);
    setDateTo(latest);
    setInitialized(true);
  }, [bounds.data, initialized]);

  const queryInput = useMemo(() => ({ dateFrom, dateTo }), [dateFrom, dateTo]);
  const query = trpc.metaAds.data.useQuery(queryInput, {
    enabled: initialized || bounds.isError,
    retry: 1,
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const data = query.data;

  useEffect(() => {
    if (data?.metadata.updatedAt) onUpdatedAt?.(data.metadata.updatedAt);
  }, [data?.metadata.updatedAt, onUpdatedAt]);

  const currencySubtitle = data ? `${formatNumber(data.summary.impressions, locale)} ${t.impressions.toLowerCase()}` : "Meta Ads";

  function applyPreset(value: string) {
    const latest = bounds.data?.latestDate ?? FALLBACK_TO;
    const earliest = bounds.data?.earliestDate ?? FALLBACK_FROM;
    setPreset(value);
    setDateTo(latest);
    if (value === "month") {
      const monthStart = `${latest.slice(0, 7)}-01`;
      setDateFrom(monthStart < earliest ? earliest : monthStart);
      return;
    }
    const start = addDays(latest, -(Number.parseInt(value, 10) - 1));
    setDateFrom(start < earliest ? earliest : start);
  }

  function updateFrom(value: string) {
    if (!value || value > dateTo || (bounds.data && value < bounds.data.earliestDate)) return;
    setPreset("custom");
    setDateFrom(value);
  }

  function updateTo(value: string) {
    if (!value || value < dateFrom || (bounds.data && value > bounds.data.latestDate)) return;
    setPreset("custom");
    setDateTo(value);
  }

  if ((bounds.isLoading && !initialized) || query.isLoading) {
    return <MetaAdsLoading locale={locale} />;
  }

  if (query.error) {
    return <MetaAdsError locale={locale} onRetry={() => query.refetch()} />;
  }

  if (!data?.daily.length) return <main className="mx-auto max-w-[1680px] px-4 py-8"><Panel title={t.title}><MetaAdsEmptyState title={t.emptyTitle} description={t.emptyDescription} /></Panel></main>;

  const metricCards = [
    { title: t.investment, value: formatCurrency(data.summary.spend, locale), subtitle: `${data.account.name} • ${t.period.toLowerCase()}`, icon: <CircleDollarSign className="h-4 w-4" />, accent: "#e2212d" },
    { title: t.leads, value: formatNumber(data.summary.leads, locale), subtitle: "actions_lead", icon: <Target className="h-4 w-4" />, accent: "#38bdf8" },
    { title: t.cpl, value: formatCurrency(data.summary.cpl, locale), subtitle: `${t.investment} ÷ ${t.leads}`, icon: <Gauge className="h-4 w-4" />, accent: "#a78bfa" },
    { title: t.reach, value: formatNumber(data.summary.reach, locale), subtitle: currencySubtitle, icon: <Eye className="h-4 w-4" />, accent: "#10b981" },
    { title: t.ctr, value: `${formatNumber(data.summary.ctr, locale, 2)}%`, subtitle: `${formatNumber(data.summary.clicks, locale)} ${t.clicks.toLowerCase()}`, icon: <MousePointerClick className="h-4 w-4" />, accent: "#f59e0b" },
    { title: t.clicks, value: formatNumber(data.summary.clicks, locale), subtitle: `${formatNumber(data.summary.impressions, locale)} ${t.impressions.toLowerCase()}`, icon: <TrendingUp className="h-4 w-4" />, accent: "#60a5fa" },
  ];

  const insightCards = [
    data.highlights.topAudience ? { label: t.audienceInsight, value: data.highlights.topAudience.name, metric: `${formatNumber(data.highlights.topAudience.leads, locale)} ${t.leads} • CPL ${data.highlights.topAudience.cpl == null ? "—" : formatCurrency(data.highlights.topAudience.cpl, locale)}`, icon: <UsersRound className="h-3.5 w-3.5 text-[#e2212d]" /> } : null,
    data.highlights.topGender ? { label: t.genderInsight, value: formatMetaAdsGender(data.highlights.topGender.gender, locale), metric: `${formatNumber(data.highlights.topGender.leads, locale)} ${t.leads}`, icon: <UsersRound className="h-3.5 w-3.5 text-[#38bdf8]" /> } : null,
    data.highlights.topAge ? { label: t.ageInsight, value: data.highlights.topAge.age, metric: `${formatNumber(data.highlights.topAge.leads, locale)} ${t.leads}`, icon: <BarChart3 className="h-3.5 w-3.5 text-[#a78bfa]" /> } : null,
    data.highlights.topRegionByReach ? { label: t.regionInsight, value: data.highlights.topRegionByReach.region, metric: `${formatNumber(data.highlights.topRegionByReach.reach, locale)} ${t.reach.toLowerCase()}`, icon: <MapPin className="h-3.5 w-3.5 text-[#10b981]" /> } : null,
    data.highlights.topCreative ? { label: t.creativeInsight, value: data.highlights.topCreative.name, metric: `${formatNumber(data.highlights.topCreative.leads, locale)} ${t.leads} • CPL ${data.highlights.topCreative.cpl == null ? "—" : formatCurrency(data.highlights.topCreative.cpl, locale)}`, icon: <ImageIcon className="h-3.5 w-3.5 text-[#f59e0b]" /> } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; metric: string; icon: ReactNode }>;

  return (
    <main className="mx-auto max-w-[1680px] px-4 pb-12 pt-5 lg:px-6">
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#e2212d]"><Megaphone className="h-3.5 w-3.5" />{t.eyebrow}</div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">{t.title}</h1>
          <p className="mt-1 text-[11px] text-slate-600">MG Motors • {formatLongDate(dateFrom, locale)} — {formatLongDate(dateTo, locale)}</p>
        </div>
        <div className="flex flex-col gap-2 xl:items-end">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-[#242f42] bg-[#0d1421] p-1" aria-label={t.period}>
              {["7", "14", "30", "60"].map(value => <button key={value} type="button" onClick={() => applyPreset(value)} className={`shrink-0 rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${preset === value ? "bg-[#e2212d] text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}>{value}d</button>)}
              <button type="button" onClick={() => applyPreset("month")} className={`shrink-0 rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${preset === "month" ? "bg-[#e2212d] text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}>{t.month}</button>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#242f42] bg-[#0d1421] px-3 py-1.5"><CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-600" /><input aria-label={`${t.period} start`} type="date" min={bounds.data?.earliestDate} max={dateTo} value={dateFrom} onChange={event => updateFrom(event.target.value)} className="w-[116px] min-w-0 bg-transparent text-[10px] text-slate-300 outline-none [color-scheme:dark]" /><span className="text-slate-700">—</span><input aria-label={`${t.period} end`} type="date" min={dateFrom} max={bounds.data?.latestDate} value={dateTo} onChange={event => updateTo(event.target.value)} className="w-[116px] min-w-0 bg-transparent text-[10px] text-slate-300 outline-none [color-scheme:dark]" /></div>
            <Button variant="outline" size="sm" onClick={() => query.refetch()} disabled={query.isFetching} className="h-8 border-[#283349] bg-[#111827] text-[10px] text-slate-400 hover:bg-[#182236] hover:text-white"><RefreshCcw className={`mr-1.5 h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}`} />{t.refresh}</Button>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-slate-600"><span className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{data.metadata.source === "windsor-live" ? t.sourceLive : t.sourceSnapshot}</span><span>{t.through}: {formatLongDate(data.metadata.dataThroughDate, locale)}</span><span>{t.updated}: {new Date(data.metadata.updatedAt).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })}</span></div>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{metricCards.map(card => <MetricCard key={card.title} {...card} />)}</div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title={t.spendLeadsTitle} subtitle={t.spendLeadsSubtitle}>
          <div className="h-[350px] px-2 pb-4 pt-5 sm:px-4"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data.daily} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}><CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickFormatter={value => formatDate(value, locale)} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} /><YAxis yAxisId="money" tickFormatter={value => formatCurrency(Number(value), locale, true)} tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} width={68} /><YAxis yAxisId="leads" orientation="right" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} width={38} /><Tooltip content={<MetaTooltip locale={locale} />} /><Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} /><Bar yAxisId="money" dataKey="spend" name={t.investment} fill="#e2212d" radius={[4, 4, 0, 0]} maxBarSize={26} /><Line yAxisId="leads" type="monotone" dataKey="leads" name={t.leads} stroke="#38bdf8" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} /></ComposedChart></ResponsiveContainer></div>
        </Panel>
        <Panel title={t.dailyCplTitle} subtitle={t.dailyCplSubtitle}>
          <div className="h-[350px] px-2 pb-4 pt-5 sm:px-4"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.daily} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}><defs><linearGradient id="meta-cpl-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.35} /><stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tickFormatter={value => formatDate(value, locale)} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} /><YAxis tickFormatter={value => formatCurrency(Number(value), locale, true)} tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} width={68} /><Tooltip content={<MetaTooltip locale={locale} />} /><Area type="monotone" dataKey="cpl" name="CPL" stroke="#a78bfa" strokeWidth={2.5} fill="url(#meta-cpl-gradient)" connectNulls /></AreaChart></ResponsiveContainer></div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title={t.modelsTitle} subtitle={t.modelsSubtitle}>
          <div className="h-[340px] px-2 pb-4 pt-5"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.models} layout="vertical" margin={{ top: 0, right: 24, left: 12, bottom: 0 }}><CartesianGrid stroke="#1d2737" strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} /><YAxis type="category" dataKey="model" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} axisLine={false} width={72} /><Tooltip content={<MetaTooltip locale={locale} />} /><Bar dataKey="leads" name={t.leads} radius={[0, 5, 5, 0]} maxBarSize={28}>{data.models.map(item => <Cell key={item.model} fill={MODEL_COLORS[item.model] ?? MODEL_COLORS.Outros} />)}</Bar></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title={t.campaignsTitle} subtitle={t.campaignsSubtitle}>
          <DataTable emptyLabel={t.noItems} columns={[t.campaignsTitle, t.investment, t.leads, "CPL", t.reach, "Status"]} rows={data.campaigns.slice(0, 10).map(item => [<div><p className="max-w-[320px] truncate font-medium text-slate-200">{item.name}</p><p className="mt-0.5 text-[8px] text-slate-700">{item.objective || item.id}</p></div>, formatCurrency(item.spend, locale), formatNumber(item.leads, locale), item.cpl == null ? "—" : formatCurrency(item.cpl, locale), formatNumber(item.reach, locale), <span className={`rounded-full border px-2 py-1 text-[8px] font-semibold ${item.status.includes("ACTIVE") ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-slate-600/30 bg-slate-500/10 text-slate-500"}`}>{formatMetaAdsStatus(item.status, locale)}</span>])} />
        </Panel>
      </div>

      <Panel title={t.audiencesTitle} subtitle={t.audiencesSubtitle} className="mt-4">
        <DataTable emptyLabel={t.noItems} columns={[t.audiencesTitle, t.investment, t.leads, "CPL", t.reach, t.period]} rows={data.audiences.slice(0, 12).map(item => [<div className="max-w-[470px]"><p className="font-medium text-slate-200">{item.name}</p><p className="mt-1 line-clamp-2 text-[8px] leading-4 text-slate-600">{item.targetingSummary.map(summary => translateMetaAdsTargeting(summary, locale)).join(" • ") || t.unknown}</p></div>, formatCurrency(item.spend, locale), formatNumber(item.leads, locale), item.cpl == null ? "—" : formatCurrency(item.cpl, locale), formatNumber(item.reach, locale), item.status.includes("ACTIVE") ? t.active : formatMetaAdsStatus(item.status, locale)])} />
      </Panel>

      <Panel title={t.creativesTitle} subtitle={t.creativesSubtitle} className="mt-4">
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{data.creatives.slice(0, 9).map(creative => <article key={creative.id} className="overflow-hidden rounded-xl border border-[#202b3d] bg-[#0a101b]"><CreativeImage src={creative.imageUrl} alt={creative.name} fallbackLabel={t.imageUnavailable} /><div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs font-semibold text-white" title={creative.name}>{creative.name}</p><p className="mt-1 truncate text-[9px] text-slate-600">{creative.model} • {creative.adsetName || creative.campaignName}</p><p className="mt-2 break-all font-mono text-[8px] leading-3.5 text-slate-700">{t.adId}: {creative.adId || "—"}<br />{t.creativeId}: {creative.creativeId || "—"}</p></div><span className="shrink-0 rounded-full border border-[#e2212d]/20 bg-[#e2212d]/10 px-2 py-1 text-[8px] font-semibold text-[#f87171]">{creative.model}</span></div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#1b2535] pt-3 text-center"><div><p className="text-[8px] uppercase text-slate-700">{t.leads}</p><p className="mt-1 text-xs font-semibold text-slate-200">{formatNumber(creative.leads, locale)}</p></div><div><p className="text-[8px] uppercase text-slate-700">CPL</p><p className="mt-1 text-xs font-semibold text-slate-200">{creative.cpl == null ? "—" : formatCurrency(creative.cpl, locale)}</p></div><div><p className="text-[8px] uppercase text-slate-700">{t.investment}</p><p className="mt-1 text-xs font-semibold text-slate-200">{formatCurrency(creative.spend, locale, true)}</p></div></div></div></article>)}</div>
      </Panel>

      <Panel title={t.audienceAnalysisTitle} subtitle={t.audienceAnalysisSubtitle} className="mt-4">
        <div className="grid gap-3 border-b border-[#1b2535] p-4 sm:grid-cols-2 xl:grid-cols-5">{insightCards.map(card => <InsightCard key={card.label} {...card} />)}</div>
        <div className="grid xl:grid-cols-3">
          <div className="min-h-[340px] border-b border-[#1b2535] p-4 xl:border-b-0 xl:border-r"><h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t.gender}</h3><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.demographics.genders} dataKey="leads" nameKey="gender" innerRadius={62} outerRadius={95} paddingAngle={3}>{data.demographics.genders.map((item, index) => <Cell key={item.gender} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />)}</Pie><Tooltip formatter={(value, _name, item) => [formatNumber(Number(value), locale), formatMetaAdsGender(String(item.payload.gender), locale)]} contentStyle={{ background: "#080d16", border: "1px solid #2a364b", borderRadius: 8, fontSize: 10 }} /><Legend formatter={value => formatMetaAdsGender(String(value), locale)} wrapperStyle={{ fontSize: 10 }} /></PieChart></ResponsiveContainer></div></div>
          <div className="min-h-[340px] border-b border-[#1b2535] p-4 xl:border-b-0 xl:border-r"><h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t.age}</h3><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.demographics.ages}><CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="age" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} width={36} /><Tooltip content={<MetaTooltip locale={locale} />} /><Bar dataKey="leads" name={t.leads} fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={30} /></BarChart></ResponsiveContainer></div></div>
          <div className="min-h-[340px] p-4"><h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t.region}</h3><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.regions.slice(0, 8)} layout="vertical" margin={{ left: 10, right: 20 }}><CartesianGrid stroke="#1d2737" strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tickFormatter={value => formatNumber(Number(value), locale)} tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} /><YAxis type="category" dataKey="region" width={88} tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} /><Tooltip formatter={value => formatNumber(Number(value), locale)} contentStyle={{ background: "#080d16", border: "1px solid #2a364b", borderRadius: 8, fontSize: 10 }} /><Bar dataKey="reach" name={t.reach} fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={20} /></BarChart></ResponsiveContainer></div></div>
        </div>
        <div className="flex items-start gap-2 border-t border-amber-500/15 bg-amber-500/[0.04] px-4 py-3 text-[10px] leading-5 text-amber-100/70"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />{t.regionalNote}</div>
      </Panel>

      <Panel title={t.audienceMapTitle} subtitle={t.audienceMapSubtitle} className="mt-4">
        <div className="grid gap-5 p-4 lg:grid-cols-3">{[{ label: t.customAudiences, values: data.audienceCatalog.customAudiences, color: "#e2212d" }, { label: t.interests, values: data.audienceCatalog.interests, color: "#38bdf8" }, { label: t.behaviors, values: data.audienceCatalog.behaviors, color: "#a78bfa" }].map(group => <div key={group.label}><h3 className="mb-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">{group.label}</h3><div className="flex flex-wrap gap-2">{group.values.length ? group.values.slice(0, 18).map(value => <span key={value} className="rounded-full border px-2.5 py-1 text-[9px]" style={{ borderColor: `${group.color}30`, backgroundColor: `${group.color}0d`, color: group.color }}>{value}</span>) : <span className="text-[10px] text-slate-700">{t.noItems}</span>}</div></div>)}</div>
      </Panel>
    </main>
  );
}
