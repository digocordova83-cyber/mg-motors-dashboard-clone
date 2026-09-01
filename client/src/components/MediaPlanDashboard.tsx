import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarRange,
  CircleDollarSign,
  Eye,
  FileSpreadsheet,
  Layers3,
  MousePointerClick,
  ReceiptText,
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
import {
  MEDIA_PLANS,
  getMediaPlan,
  type MediaPlanFunnel,
  type MediaPlanStatus,
} from "@/data/mediaPlans";

function formatCurrency(value: number, locale: "pt-BR" | "en-US", fractionDigits = 0) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function formatNumber(value: number, locale: "pt-BR" | "en-US") {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number, locale: "pt-BR" | "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}

function funnelLabel(funnel: MediaPlanFunnel, locale: "pt-BR" | "en-US") {
  const labels = {
    pt: { AWARENESS: "Conhecimento", CONSIDERATION: "Consideração", CONVERSION: "Conversão" },
    en: { AWARENESS: "Awareness", CONSIDERATION: "Consideration", CONVERSION: "Conversion" },
  };
  return locale === "en-US" ? labels.en[funnel] : labels.pt[funnel];
}

function statusLabel(status: MediaPlanStatus | undefined, locale: "pt-BR" | "en-US") {
  const labels = {
    pt: { PAID: "Pago", PAYABLES: "A pagar", NOT_INFORMED: "Não informado" },
    en: { PAID: "Paid", PAYABLES: "Payables", NOT_INFORMED: "Not informed" },
  };
  const key = status ?? "NOT_INFORMED";
  return locale === "en-US" ? labels.en[key] : labels.pt[key];
}

export function MediaPlanEmptyState({ locale = "pt-BR" }: { locale?: "pt-BR" | "en-US" }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a111d] px-6 py-14 text-center">
      <CalendarRange className="mx-auto mb-4 h-8 w-8 text-[#e2212d]" />
      <h2 className="text-lg font-semibold text-white">
        {locale === "en-US" ? "No media plan for this month" : "Nenhum plano disponível para este mês"}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {locale === "en-US" ? "Select another month to view the approved plan." : "Selecione outra competência para consultar o planejamento aprovado."}
      </p>
    </div>
  );
}

export function MediaPlanDashboard({
  locale = "pt-BR",
  onUpdatedAt,
  initialMonth,
}: {
  locale?: "pt-BR" | "en-US";
  onUpdatedAt?: (updatedAt: string) => void;
  initialMonth?: string;
}) {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth ?? MEDIA_PLANS[0]?.month ?? "");
  const plan = getMediaPlan(selectedMonth);
  const isEnglish = locale === "en-US";
  const isFinancial = plan?.mode === "FINANCIAL";

  useEffect(() => {
    if (plan?.updatedAt) onUpdatedAt?.(plan.updatedAt);
  }, [onUpdatedAt, plan?.updatedAt]);

  const channelData = useMemo(() => {
    if (!plan) return [];
    const grouped = new Map<string, { channel: string; investment: number }>();
    plan.rows.forEach((row) => {
      const current = grouped.get(row.channel) ?? { channel: row.channel, investment: 0 };
      current.investment += row.investment;
      grouped.set(row.channel, current);
    });
    return Array.from(grouped.values()).sort((a, b) => b.investment - a.investment);
  }, [plan]);

  const funnelData = useMemo(() => {
    if (!plan || plan.mode !== "DELIVERY") return [];
    const funnels: MediaPlanFunnel[] = ["AWARENESS", "CONSIDERATION", "CONVERSION"];
    return funnels.map((funnel) => {
      const rows = plan.rows.filter((row) => row.funnel === funnel);
      return {
        funnel,
        investment: rows.reduce((sum, row) => sum + row.investment, 0),
      };
    });
  }, [plan]);

  if (!plan) {
    return (
      <main className="mx-auto min-h-[calc(100vh-88px)] max-w-[1680px] px-4 py-8 lg:px-6">
        <MediaPlanEmptyState locale={locale} />
      </main>
    );
  }

  const copy = isEnglish
    ? {
        eyebrow: "Official monthly planning",
        deliveryDescription: "Approved channel allocation, delivery assumptions and projected results.",
        financialDescription: "Approved gross allocation, commission, net media and actual investment recorded in the workbook.",
        month: "Plan month",
        totalInvestment: "Planned media investment",
        leads: "Projected leads",
        cpl: "Projected CPL",
        impressions: "Projected impressions",
        gross: "Plan gross",
        commission: "4% commission",
        net: "Net media plan",
        actual: "Actual investment",
        allocation: "Investment allocation by channel",
        grossAllocation: "Gross allocation by channel",
        allocationDesc: "Planned investment consolidated across products.",
        product: "Plan by product",
        funnel: "Allocation by funnel stage",
        reconciliation: "Financial reconciliation",
        details: "Detailed media plan",
        channel: "Channel",
        publisher: "Publisher",
        productColumn: "Product",
        objective: "Objective",
        investment: "Investment",
        visits: "Visits",
        status: "Status",
        unavailable: "Not provided in the August workbook",
      }
    : {
        eyebrow: "Planejamento mensal oficial",
        deliveryDescription: "Alocação aprovada por canal, premissas de entrega e resultados projetados.",
        financialDescription: "Alocação bruta aprovada, comissão, mídia líquida e investimento realizado registrados na planilha.",
        month: "Competência do plano",
        totalInvestment: "Investimento planejado de mídia",
        leads: "Leads projetados",
        cpl: "CPL projetado",
        impressions: "Impressões projetadas",
        gross: "Plano bruto",
        commission: "Comissão de 4%",
        net: "Plano líquido de mídia",
        actual: "Investimento realizado",
        allocation: "Alocação de investimento por canal",
        grossAllocation: "Alocação bruta por canal",
        allocationDesc: "Investimento planejado consolidado entre os produtos.",
        product: "Plano por produto",
        funnel: "Alocação por etapa do funil",
        reconciliation: "Conciliação financeira",
        details: "Plano de mídia detalhado",
        channel: "Canal",
        publisher: "Publisher",
        productColumn: "Produto",
        objective: "Objetivo",
        investment: "Investimento",
        visits: "Visitas",
        status: "Status",
        unavailable: "Não informado na planilha de agosto",
      };

  const kpis = isFinancial
    ? [
        { label: copy.gross, value: formatCurrency(plan.total.investment, locale), icon: WalletCards },
        { label: copy.commission, value: formatCurrency(plan.total.commission ?? 0, locale), icon: ReceiptText },
        { label: copy.net, value: formatCurrency(plan.total.netInvestment ?? 0, locale), icon: CircleDollarSign },
        { label: copy.actual, value: formatCurrency(plan.total.actualInvestment ?? 0, locale), icon: Target },
      ]
    : [
        { label: copy.totalInvestment, value: formatCurrency(plan.total.investment, locale), icon: WalletCards },
        { label: copy.leads, value: formatNumber(plan.total.leads ?? 0, locale), icon: UsersRound },
        { label: copy.cpl, value: formatCurrency(plan.total.cpl ?? 0, locale, 2), icon: Target },
        { label: copy.impressions, value: formatNumber(plan.total.impressions ?? 0, locale), icon: Eye },
      ];

  const financialReconciliation = [
    { label: copy.gross, value: plan.total.investment },
    { label: copy.commission, value: plan.total.commission ?? 0 },
    { label: copy.net, value: plan.total.netInvestment ?? 0 },
    { label: copy.actual, value: plan.total.actualInvestment ?? 0 },
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-88px)] max-w-[1680px] px-4 pb-12 pt-6 lg:px-6">
      <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[radial-gradient(circle_at_top_right,rgba(226,33,45,0.12),transparent_38%),linear-gradient(140deg,#0c1422,#080e18)] p-5 shadow-2xl shadow-black/20 sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0525c]"><FileSpreadsheet className="h-4 w-4" />{copy.eyebrow}</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{isEnglish ? plan.titleEn : plan.titlePt}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{isFinancial ? copy.financialDescription : copy.deliveryDescription}</p>
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
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
          <span>{isEnglish ? "Line-up gross budget" : "Verba bruta Line-up"}: <strong className="text-slate-300">{formatCurrency(plan.totals[0]?.investment ?? 0, locale)}</strong></span>
          <span>{isEnglish ? "Dedicated MG4 Urban gross budget" : "Verba bruta dedicada MG4 Urban"}: <strong className="text-slate-300">{formatCurrency(plan.totals[1]?.investment ?? 0, locale)}</strong></span>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a111d] p-5">
          <div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-semibold text-white">{isFinancial ? copy.grossAllocation : copy.allocation}</h2><p className="mt-1 text-xs text-slate-500">{copy.allocationDesc}</p></div><BarChart3 className="h-5 w-5 text-[#e2212d]" /></div>
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
                  <div className="flex items-center justify-between gap-3"><strong className="text-sm text-white">{total.label}</strong><span className="text-xs font-semibold text-[#f0525c]">{formatPercent(total.investment / plan.total.investment, locale)}</span></div>
                  {isFinancial ? (
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs"><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">{copy.gross}</span><strong className="mt-1 block text-slate-300">{formatCurrency(total.investment, locale)}</strong></div><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">{copy.commission}</span><strong className="mt-1 block text-slate-300">{formatCurrency(total.commission ?? 0, locale)}</strong></div><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">{copy.net}</span><strong className="mt-1 block text-slate-300">{formatCurrency(total.netInvestment ?? 0, locale)}</strong></div></div>
                  ) : (
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs"><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">{copy.investment}</span><strong className="mt-1 block text-slate-300">{formatCurrency(total.investment, locale)}</strong></div><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">{copy.leads}</span><strong className="mt-1 block text-slate-300">{formatNumber(total.leads ?? 0, locale)}</strong></div><div><span className="block text-[9px] uppercase tracking-wider text-slate-600">CPL</span><strong className="mt-1 block text-slate-300">{formatCurrency(total.cpl ?? 0, locale, 2)}</strong></div></div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0a111d] p-5">
            <h2 className="text-base font-semibold text-white">{isFinancial ? copy.reconciliation : copy.funnel}</h2>
            <div className="mt-4 space-y-4">
              {isFinancial ? financialReconciliation.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs"><span className="font-medium text-slate-300">{item.label}</span><span className="text-slate-500">{formatCurrency(item.value, locale)}</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-[#9f1520] to-[#ef3340]" style={{ width: `${item.value === 0 ? 0 : Math.max(3, (item.value / plan.total.investment) * 100)}%` }} /></div>
                </div>
              )) : funnelData.map((item) => (
                <div key={item.funnel}>
                  <div className="flex items-center justify-between text-xs"><span className="font-medium text-slate-300">{funnelLabel(item.funnel, locale)}</span><span className="text-slate-500">{formatCurrency(item.investment, locale)}</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-[#9f1520] to-[#ef3340]" style={{ width: `${Math.max(3, (item.investment / plan.total.investment) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a111d]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><div><h2 className="text-base font-semibold text-white">{copy.details}</h2><p className="mt-1 text-xs text-slate-500">{plan.rows.length} {isEnglish ? "planned placements" : "inserções planejadas"}</p></div><CircleDollarSign className="h-5 w-5 text-[#e2212d]" /></div>
        <div className="overflow-x-auto">
          {isFinancial ? (
            <table className="min-w-[980px] w-full text-left">
              <thead className="bg-[#070d16] text-[9px] uppercase tracking-[0.13em] text-slate-600"><tr><th className="px-4 py-3">{copy.channel}</th><th className="px-4 py-3">{copy.publisher}</th><th className="px-4 py-3">{copy.productColumn}</th><th className="px-4 py-3 text-right">{copy.gross}</th><th className="px-4 py-3 text-right">{copy.commission}</th><th className="px-4 py-3 text-right">{copy.net}</th><th className="px-4 py-3 text-right">{copy.actual}</th><th className="px-4 py-3">{copy.status}</th></tr></thead>
              <tbody className="divide-y divide-white/[0.05] text-xs">
                {plan.rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/[0.02]"><td className="px-4 py-3 font-medium text-slate-200">{row.channel}</td><td className="px-4 py-3 text-slate-400">{row.publisher ?? "—"}</td><td className="px-4 py-3 text-slate-400">{row.product}</td><td className="px-4 py-3 text-right font-medium text-slate-200">{formatCurrency(row.investment, locale, 2)}</td><td className="px-4 py-3 text-right text-slate-400">{formatCurrency(row.commission ?? 0, locale, 2)}</td><td className="px-4 py-3 text-right text-slate-400">{formatCurrency(row.netInvestment ?? 0, locale, 2)}</td><td className="px-4 py-3 text-right text-slate-400">{formatCurrency(row.actualInvestment ?? 0, locale, 2)}</td><td className="px-4 py-3 text-slate-300">{statusLabel(row.status, locale)}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-[1180px] w-full text-left">
              <thead className="bg-[#070d16] text-[9px] uppercase tracking-[0.13em] text-slate-600"><tr><th className="px-4 py-3">{copy.channel}</th><th className="px-4 py-3">{copy.productColumn}</th><th className="px-4 py-3">{copy.objective}</th><th className="px-4 py-3 text-right">{copy.investment}</th><th className="px-4 py-3 text-right">CPM</th><th className="px-4 py-3 text-right">{copy.impressions}</th><th className="px-4 py-3 text-right">CTR</th><th className="px-4 py-3 text-right">{isEnglish ? "Clicks" : "Cliques"}</th><th className="px-4 py-3 text-right">{copy.visits}</th><th className="px-4 py-3 text-right">{copy.leads}</th><th className="px-4 py-3 text-right">CPL</th></tr></thead>
              <tbody className="divide-y divide-white/[0.05] text-xs">
                {plan.rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/[0.02]"><td className="px-4 py-3"><div className="font-medium text-slate-200">{row.channel}</div><div className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">{row.funnel ? funnelLabel(row.funnel, locale) : "—"}</div></td><td className="px-4 py-3 text-slate-400">{row.product}</td><td className="px-4 py-3 text-slate-400">{isEnglish ? row.objectiveEn : row.objectivePt}</td><td className="px-4 py-3 text-right font-medium text-slate-200">{formatCurrency(row.investment, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatCurrency(row.cpm ?? 0, locale, 2)}</td><td className="px-4 py-3 text-right text-slate-400">{formatNumber(row.impressions ?? 0, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatPercent(row.ctr ?? 0, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatNumber(row.clicks ?? 0, locale)}</td><td className="px-4 py-3 text-right text-slate-400">{formatNumber(row.visits ?? 0, locale)}</td><td className="px-4 py-3 text-right text-slate-300">{row.leads == null ? "—" : formatNumber(row.leads, locale)}</td><td className="px-4 py-3 text-right text-slate-300">{row.cpl == null ? "—" : formatCurrency(row.cpl, locale, 2)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {isFinancial && <div className="border-t border-white/[0.06] px-5 py-3 text-[11px] text-slate-600">{copy.unavailable}: CPM, impressões, CTR, cliques, visitas, leads, CPL e etapa do funil.</div>}
        <div className="flex items-start gap-2 border-t border-white/[0.06] px-5 py-4 text-[11px] leading-5 text-slate-600"><MousePointerClick className="mt-0.5 h-4 w-4 shrink-0" /><span>{isEnglish ? plan.sourceNoteEn : plan.sourceNotePt}</span></div>
      </section>
    </main>
  );
}
