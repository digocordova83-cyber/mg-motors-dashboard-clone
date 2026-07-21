import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarRange,
  CircleDollarSign,
  Eye,
  FileSpreadsheet,
  Layers3,
  MousePointerClick,
  Target,
  UsersRound,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MEDIA_PLANS, getMediaPlan, type MediaPlanFunnel } from "@/data/mediaPlans";

function formatCurrency(value: number, locale: "pt-BR" | "en-US") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number, locale: "pt-BR" | "en-US") {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number, locale: "pt-BR" | "en-US") {
  return new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(value);
}

function funnelLabel(funnel: MediaPlanFunnel, locale: "pt-BR" | "en-US") {
  const labels = {
    pt: { AWARENESS: "Conhecimento", CONSIDERATION: "Consideração", CONVERSION: "Conversão" },
    en: { AWARENESS: "Awareness", CONSIDERATION: "Consideration", CONVERSION: "Conversion" },
  };
  return locale === "en-US" ? labels.en[funnel] : labels.pt[funnel];
}

export function MediaPlanEmptyState({ locale = "pt-BR" }: { locale?: "pt-BR" | "en-US" }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a111d] px-6 py-14 text-center">
      <CalendarRange className="mx-auto mb-4 h-8 w-8 text-[#e2212d]" />
      <h2 className="text-lg font-semibold text-white">{locale === "en-US" ? "No media plan for this month" : "Nenhum plano disponível para este mês"}</h2>
      <p className="mt-2 text-sm text-slate-500">{locale === "en-US" ? "Select another month to view the approved plan." : "Selecione outra competência para consultar o planejamento aprovado."}</p>
    </div>
  );
}

export function MediaPlanDashboard({ locale = "pt-BR", onUpdatedAt }: { locale?: "pt-BR" | "en-US"; onUpdatedAt?: (updatedAt: string) => void }) {
  const [selectedMonth, setSelectedMonth] = useState(MEDIA_PLANS[0]?.month ?? "");
  const plan = getMediaPlan(selectedMonth);
  const isEnglish = locale === "en-US";

  useEffect(() => {
    if (plan?.updatedAt) onUpdatedAt?.(plan.updatedAt);
  }, [onUpdatedAt, plan?.updatedAt]);

  const channelData = useMemo(() => {
    if (!plan) return [];
    const grouped = new Map<string, { channel: string; investment: number; leads: number }>();
    plan.rows.forEach((row) => {
      const current = grouped.get(row.channel) ?? { channel: row.channel, investment: 0, leads: 0 };
      current.investment += row.netInvestment;
      current.leads += row.leads ?? 0;
      grouped.set(row.channel, current);
    });
    return Array.from(grouped.values()).sort((a, b) => b.investment - a.investment);
  }, [plan]);

  const funnelData = useMemo(() => {
    if (!plan) return [];
    const funnels: MediaPlanFunnel[] = ["AWARENESS", "CONSIDERATION", "CONVERSION"];
    return funnels.map((funnel) => {
      const rows = plan.rows.filter((row) => row.funnel === funnel);
      return {
        funnel,
        investment: rows.reduce((sum, row) => sum + row.netInvestment, 0),
        impressions: rows.reduce((sum, row) => sum + row.impressions, 0),
        visits: rows.reduce((sum, row) => sum + row.visits, 0),
        leads: rows.reduce((sum, row) => sum + (row.leads ?? 0), 0),
      };
    });
  }, [plan]);

  if (!plan) {
    return <main className="mx-auto min-h-[calc(100vh-88px)] max-w-[1680px] px-4 py-8 lg:px-6"><MediaPlanEmptyState locale={locale} /></main>;
  }

  const grossInvestment = plan.rows.reduce((sum, row) => sum + row.grossInvestment, 0);
  const commission = plan.rows.reduce((sum, row) => sum + row.commission, 0);

  const copy = isEnglish
    ? {
        eyebrow: "Official monthly planning",
        description: "Approved channel allocation, delivery assumptions and projected results.",
        month: "Plan month",
        gross: "Gross budget",
        net: "Net media investment",
        leads: "Projected leads",
        cpl: "Projected CPL",
        impressions: "Projected impressions",
        allocation: "Investment allocation by channel",
        allocationDesc: "Net media investment consolidated across products.",
        product: "Plan by product",
        funnel: "Allocation by funnel stage",
        details: "Detailed media plan",
        channel: "Channel",
        objective: "Objective",
        investment: "Net investment",
        visits: "Visits",
        source: "Source: approved July workbook, sheet Página1. Values are displayed exactly as consolidated in the supplied plan.",
        commission: "Agency commission",
      }
    : {
        eyebrow: "Planejamento mensal oficial",
        description: "Alocação aprovada por canal, premissas de entrega e resultados projetados.",
        month: "Competência do plano",
        gross: "Orçamento bruto",
        net: "Investimento líquido de mídia",
        leads: "Leads projetados",
        cpl: "CPL projetado",
        impressions: "Impressões projetadas",
        allocation: "Alocação de investimento por canal",
        allocationDesc: "Investimento líquido de mídia consolidado entre os produtos.",
        product: "Plano por produto",
        funnel: "Alocação por etapa do funil",
        details: "Plano de mídia detalhado",
        channel: "Canal",
        objective: "Objetivo",
        investment: "Investimento líquido",
        visits: "Visitas",
        source: "Fonte: planilha aprovada de julho, aba Página1. Os valores são exibidos conforme consolidados no plano fornecido.",
        commission: "Comissão de agência",
      };

  const kpis = [
    { label: copy.net, value: formatCurrency(plan.total.netInvestment, locale), icon: WalletCards },
    { label: copy.leads, value: formatNumber(plan.total.leads, locale), icon: UsersRound },
    { label: copy.cpl, value: formatCurrency(plan.total.cpl, locale), icon: Target },
    { label: copy.impressions, value: formatNumber(plan.total.impressions, locale), icon: Eye },
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-88px)] max-w-[1680px] px-4 pb-12 pt-6 lg:px-6">
      <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[radial-gradient(circle_at_top_right,rgba(226,33,45,0.12),transparent_38%),linear-gradient(140deg,#0c1422,#080e18)] p-5 shadow-2xl shadow-black/20 sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0525c]"><FileSpreadsheet className="h-4 w-4" />{copy.eyebrow}</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{isEnglish ? plan.titleEn : plan.titlePt}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{copy.description}</p>
          </div>
          <label className="min-w-[240px] text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {copy.month}
            <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#070d16] px-3 text-sm font-medium text-white outline-none focus:border-[#e2212d]/60">
              {MEDIA_PLANS.map((item) => <option key={item.month} value={item.month}>{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${item.month}-01T12:00:00Z`))}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/[0.06] bg-[#070d16]/90 p-4">
              <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">{label}</span><Icon className="h-4 w-4 text-[#e2212d]" /></div>
              <div className="mt-3 text-xl font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500"><span>{copy.gross}: <strong className="text-slate-300">{formatCurrency(grossInvestment, locale)}</strong></span><span>{copy.commission}: <strong className="text-slate-300">{formatCurrency(commission, locale)}</strong></span></div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a111d] p-5">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-semibold text-white">{copy.allocation}</h2><p className="mt-1 text-xs text-slate-500">{copy.allocationDesc}</p></div><BarChart3 className="h-5 w-5 text-[#e2212d]" /></div>
          <div className="mt-5 h-[310px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ top: 2, right: 10, bottom: 2, left: 22 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.08)" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="channel" width={130} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(148,163,184,0.05)" }} contentStyle={{ background: "#0b1320", border: "1px solid rgba(148,163,184,.16)", borderRadius: 12, color: "#e2e8f0", fontSize: 12 }} formatter={(value: number) => formatCurrency(Number(value), locale)} />
                <Bar dataKey="investment" fill="#e2212d" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0a111d] p-5">
            <div className="flex items-center justify-between"><h2 className="text-base font-semibold text-white">{copy.product}</h2><Layers3 className="h-5 w-5 text-[#e2212d]" /></div>
            <div className="mt-4 space-y-3">
              {plan.totals.map((total) => (
                <article key={total.label} className="rounded-xl border border-white/[0.06] bg-[#070d16] p-4">
                  <div className="flex items-center justify-between gap-3"><strong className="text-sm text-white">{total.label}</strong><span className="text-xs font-semibold text-[#f0525c]">{formatPercent(total.netInvestment / plan.total.netInvestment, locale)}</span></div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs"><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">{copy.investment}</span><strong className="mt-1 block text-slate-300">{formatCurrency(total.netInvestment, locale)}</strong></div><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">{copy.leads}</span><strong className="mt-1 block text-slate-300">{formatNumber(total.leads, locale)}</strong></div><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">CPL</span><strong className="mt-1 block text-slate-300">{formatCurrency(total.cpl, locale)}</strong></div></div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0a111d] p-5">
            <h2 className="text-base font-semibold text-white">{copy.funnel}</h2>
            <div className="mt-4 space-y-4">
              {funnelData.map((item) => (
                <div key={item.funnel}>
                  <div className="flex items-center justify-between text-xs"><span className="font-medium text-slate-300">{funnelLabel(item.funnel, locale)}</span><span className="text-slate-500">{formatCurrency(item.investment, locale)}</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-[#9f1520] to-[#ef3340]" style={{ width: `${Math.max(3, (item.investment / plan.total.netInvestment) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a111d]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><div><h2 className="text-base font-semibold text-white">{copy.details}</h2><p className="mt-1 text-xs text-slate-500">{plan.rows.length} {isEnglish ? "planned placements" : "inserções planejadas"}</p></div><CircleDollarSign className="h-5 w-5 text-[#e2212d]" /></div>
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left">
            <thead className="bg-[#070d16] text-[9px] uppercase tracking-[0.13em] text-slate-600"><tr><th className="px-4 py-3">{copy.channel}</th><th className="px-4 py-3">{isEnglish ? "Product" : "Produto"}</th><th className="px-4 py-3">{copy.objective}</th><th className="px-4 py-3 text-right">{copy.investment}</th><th className="px-4 py-3 text-right">CPM</th><th className="px-4 py-3 text-right">{copy.impressions}</th><th className="px-4 py-3 text-right">CTR</th><th className="px-4 py-3 text-right">{isEnglish ? "Clicks" : "Cliques"}</th><th className="px-4 py-3 text-right">{copy.visits}</th><th className="px-4 py-3 text-right">{copy.leads}</th><th className="px-4 py-3 text-right">CPL</th></tr></thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {plan.rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-white/[0.02]"><td className="px-4 py-3"><div className="font-medium text-slate-200">{row.channel}</div><div className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">{funnelLabel(row.funnel, locale)}</div></td><td className="px-4 py-3 text-slate-400">{row.product}</td><td className="px-4 py-3 text-slate-400">{isEnglish ? row.objectiveEn : row.objectivePt}</td><td className="px-4 py-3 text-right font-medium text-slate-200">{formatCurrency(row.netInvestment, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatCurrency(row.cpm, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatNumber(row.impressions, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatPercent(row.ctr, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatNumber(row.clicks, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatNumber(row.visits, locale)}</td><td className="px-4 py-3 text-right text-slate-300">{row.leads == null ? "—" : formatNumber(row.leads, locale)}</td><td className="px-4 py-3 text-right text-slate-300">{row.cpl == null ? "—" : formatCurrency(row.cpl, locale)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-2 border-t border-white/[0.06] px-5 py-4 text-[11px] leading-5 text-slate-600"><MousePointerClick className="mt-0.5 h-4 w-4 shrink-0" /><span>{copy.source}</span></div>
      </section>
    </main>
  );
}
