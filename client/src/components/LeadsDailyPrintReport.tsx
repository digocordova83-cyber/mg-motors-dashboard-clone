import React from "react";
import { Button } from "@/components/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import { Printer } from "lucide-react";
import type { AppRouter } from "../../../server/routers";

type LeadAnalytics = inferRouterOutputs<AppRouter>["leads"]["analytics"];
type Locale = "pt-BR" | "en-US";

function ui(locale: Locale, pt: string, en: string) {
  return locale === "en-US" ? en : pt;
}

function formatInteger(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

function formatDate(value: string | null, locale: Locale) {
  if (!value) return ui(locale, "Indisponível", "Unavailable");
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function formatShortDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function formatCategory(value: string | null | undefined, locale: Locale) {
  const normalized = value?.trim() ?? "";
  return normalized || ui(locale, "Indisponível", "Unavailable");
}

export function LeadsDailyReportButton({
  locale = "pt-BR",
  onPrint,
}: {
  locale?: Locale;
  onPrint: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onPrint}
      className="w-full bg-[#e2212d] text-white hover:bg-[#c91622] sm:w-auto"
      data-testid="leads-daily-report-button"
    >
      <Printer className="mr-2 h-4 w-4" />
      {ui(locale, "Gerar PDF diário", "Generate daily PDF")}
    </Button>
  );
}

export function activateLeadsDailyPrintMode(input: {
  body: { dataset: DOMStringMap };
  print: () => void;
  addAfterPrintListener?: (listener: () => void) => void;
}) {
  input.body.dataset.printMode = "leads-daily";
  const cleanup = () => {
    if (input.body.dataset.printMode === "leads-daily") delete input.body.dataset.printMode;
  };
  input.addAfterPrintListener?.(cleanup);
  input.print();
  return cleanup;
}

function DailyLeadVolumeChart({ daily, locale }: { daily: LeadAnalytics["daily"]; locale: Locale }) {
  const width = 1000;
  const height = 250;
  const padding = { top: 24, right: 20, bottom: 38, left: 52 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...daily.flatMap(point => [point.total, point.rollingAverage7d]), 1);
  const barSlot = plotWidth / Math.max(daily.length, 1);
  const barWidth = Math.max(5, Math.min(24, barSlot * 0.58));
  const x = (index: number) => padding.left + barSlot * index + barSlot / 2;
  const y = (value: number) => padding.top + plotHeight - (value / maxValue) * plotHeight;
  const linePoints = daily.map((point, index) => `${x(index)},${y(point.rollingAverage7d)}`).join(" ");
  const tickStep = Math.max(1, Math.ceil(daily.length / 10));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ui(locale, "Gráfico diário de Leads", "Daily Leads chart")}
      className="h-[250px] w-full"
      data-testid="leads-daily-print-chart"
    >
      <title>{ui(locale, "Volume diário de Leads e média móvel de sete dias", "Daily Leads volume and seven-day rolling average")}</title>
      {[0, 0.25, 0.5, 0.75, 1].map(fraction => {
        const value = maxValue * fraction;
        const gridY = y(value);
        return (
          <g key={fraction}>
            <line x1={padding.left} x2={width - padding.right} y1={gridY} y2={gridY} stroke="#e2e8f0" strokeWidth="1" />
            <text x={padding.left - 8} y={gridY + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {formatInteger(value, locale)}
            </text>
          </g>
        );
      })}
      {daily.map((point, index) => {
        const pointX = x(index);
        const barY = y(point.total);
        const barHeight = padding.top + plotHeight - barY;
        return (
          <g key={point.date}>
            <rect x={pointX - barWidth / 2} y={barY} width={barWidth} height={barHeight} rx="2" fill="#14324a" />
            {index % tickStep === 0 || index === daily.length - 1 ? (
              <text x={pointX} y={height - 14} textAnchor="middle" fontSize="9" fill="#64748b">
                {formatShortDate(point.date, locale)}
              </text>
            ) : null}
          </g>
        );
      })}
      {daily.length > 1 ? <polyline points={linePoints} fill="none" stroke="#e2212d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /> : null}
      <g transform={`translate(${width - 285} 14)`}>
        <rect width="12" height="8" y="-7" rx="1" fill="#14324a" />
        <text x="18" y="0" fontSize="10" fill="#475569">{ui(locale, "Leads/dia", "Leads/day")}</text>
        <line x1="105" x2="125" y1="-3" y2="-3" stroke="#e2212d" strokeWidth="3" />
        <text x="132" y="0" fontSize="10" fill="#475569">{ui(locale, "Média móvel 7d", "7-day average")}</text>
      </g>
    </svg>
  );
}

function PrintMetric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-slate-500">{label}</p>
      <p className="mt-1 text-[22px] font-bold leading-none text-slate-950">{value}</p>
      {detail ? <p className="mt-1.5 text-[9px] text-slate-500">{detail}</p> : null}
    </div>
  );
}

function PrintReportHeader({ dateFrom, dateTo, locale }: { dateFrom: string; dateTo: string; locale: Locale }) {
  return (
    <header className="mb-5 flex items-end justify-between border-b-4 border-[#e2212d] pb-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e2212d]">MG Motor Brasil</p>
        <h1 className="mt-1 text-[26px] font-bold leading-none text-slate-950">{ui(locale, "Relatório diário de Leads", "Daily Leads Report")}</h1>
      </div>
      <div className="text-right text-[10px] leading-4 text-slate-600">
        <p className="font-bold text-slate-900">{formatDate(dateFrom, locale)} — {formatDate(dateTo, locale)}</p>
        <p>{ui(locale, "Base consolidada pelo campo Data Corrigida", "Database consolidated by Corrected Date")}</p>
      </div>
    </header>
  );
}

function PrintPageFooter({ page, locale }: { page: number; locale: Locale }) {
  return (
    <footer className="mt-4 flex items-center justify-between border-t border-slate-200 pt-2 text-[8px] text-slate-500">
      <span>{ui(locale, "Uso interno — relatório operacional de Leads", "Internal use — operational Leads report")}</span>
      <span>{ui(locale, `Página ${page} de 4`, `Page ${page} of 4`)}</span>
    </footer>
  );
}

export function LeadsDailyPrintReport({
  analytics,
  dateFrom,
  dateTo,
  locale = "pt-BR",
}: {
  analytics: LeadAnalytics;
  dateFrom: string;
  dateTo: string;
  locale?: Locale;
}) {
  const paceStatus = analytics.pacing.status === "AHEAD"
    ? ui(locale, "Acima do ritmo", "Ahead of pace")
    : analytics.pacing.status === "BEHIND"
      ? ui(locale, "Abaixo do ritmo", "Behind pace")
      : analytics.pacing.status === "ON_TRACK"
        ? ui(locale, "No ritmo", "On pace")
        : ui(locale, "Sem referência", "No benchmark");
  const peak = analytics.daily.reduce((value, point) => Math.max(value, point.total), 0);
  const latestDay = analytics.daily.at(-1)?.total ?? 0;
  const qualificationShare = analytics.summary.totalLeads
    ? (analytics.dealerAudit.summary.unavailableLeads / analytics.summary.totalLeads) * 100
    : 0;
  const dealerPageSize = Math.ceil(analytics.dealerAudit.dealers.length / 2);
  const dealerPages = [
    analytics.dealerAudit.dealers.slice(0, dealerPageSize),
    analytics.dealerAudit.dealers.slice(dealerPageSize),
  ];

  return (
    <section data-leads-print-root data-testid="leads-daily-print-report" className="bg-white text-slate-900">
      <article className="leads-print-page">
        <PrintReportHeader dateFrom={dateFrom} dateTo={dateTo} locale={locale} />
        <div className="grid grid-cols-5 gap-2">
          <PrintMetric label={ui(locale, "Leads no período", "Period Leads")} value={formatInteger(analytics.summary.totalLeads, locale)} detail={`${analytics.summary.calendarDays} ${ui(locale, "dia(s)", "day(s)")}`} />
          <PrintMetric label={ui(locale, "Leads no último dia", "Latest-day Leads")} value={formatInteger(latestDay, locale)} detail={formatDate(dateTo, locale)} />
          <PrintMetric label={ui(locale, "Média diária", "Daily average")} value={formatNumber(analytics.summary.dailyAverage, locale)} detail={ui(locale, "Leads por dia", "Leads per day")} />
          <PrintMetric label={ui(locale, "Pico diário", "Daily peak")} value={formatInteger(peak, locale)} detail={ui(locale, "Maior volume no período", "Highest period volume")} />
          <PrintMetric label={ui(locale, "Canais ativos", "Active channels")} value={formatInteger(analytics.summary.activeChannels, locale)} detail={ui(locale, "Com pelo menos 1 Lead", "With at least 1 Lead")} />
        </div>
        <div className="mt-4 grid grid-cols-[1.7fr_1fr] gap-4">
          <section className="border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div><h2 className="text-[13px] font-bold text-slate-950">{ui(locale, "Evolução diária", "Daily evolution")}</h2><p className="text-[9px] text-slate-500">{ui(locale, "Volume diário e média móvel de sete dias", "Daily volume and seven-day rolling average")}</p></div>
              <span className="text-[9px] font-bold text-[#e2212d]">{paceStatus}</span>
            </div>
            <DailyLeadVolumeChart daily={analytics.daily} locale={locale} />
          </section>
          <section className="border border-slate-200 p-4">
            <h2 className="text-[13px] font-bold text-slate-950">{ui(locale, "Pacing mensal", "Monthly pacing")}</h2>
            <p className="mt-1 text-[9px] text-slate-500">{analytics.pacing.competence} · {ui(locale, "fechado até", "closed through")} {formatDate(analytics.pacing.asOfDate, locale)}</p>
            <div className="mt-4 border-b border-slate-200 pb-3"><p className="text-[9px] uppercase text-slate-500">{ui(locale, "Atual / meta", "Current / goal")}</p><p className="mt-1 text-[24px] font-bold text-slate-950">{formatInteger(analytics.pacing.current, locale)} <span className="text-[13px] text-slate-400">/ {analytics.pacing.goal == null ? "—" : formatInteger(analytics.pacing.goal, locale)}</span></p></div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[9px]">
              <div><dt className="text-slate-500">{ui(locale, "Progresso", "Progress")}</dt><dd className="mt-0.5 font-bold text-slate-900">{analytics.pacing.progressPercent == null ? "—" : `${formatNumber(analytics.pacing.progressPercent, locale)}%`}</dd></div>
              <div><dt className="text-slate-500">{ui(locale, "Projeção", "Projection")}</dt><dd className="mt-0.5 font-bold text-slate-900">{formatInteger(analytics.pacing.projection, locale)}</dd></div>
              <div><dt className="text-slate-500">{ui(locale, "Média/dia", "Average/day")}</dt><dd className="mt-0.5 font-bold text-slate-900">{formatNumber(analytics.pacing.averagePerDay, locale)}</dd></div>
              <div><dt className="text-slate-500">{ui(locale, "Necessário/dia", "Required/day")}</dt><dd className="mt-0.5 font-bold text-slate-900">{analytics.pacing.requiredPerDay == null ? "—" : formatNumber(analytics.pacing.requiredPerDay, locale)}</dd></div>
              <div><dt className="text-slate-500">{ui(locale, "Restante", "Remaining")}</dt><dd className="mt-0.5 font-bold text-slate-900">{analytics.pacing.remainingToGoal == null ? "—" : formatInteger(analytics.pacing.remainingToGoal, locale)}</dd></div>
              <div><dt className="text-slate-500">{ui(locale, "Dias restantes", "Days remaining")}</dt><dd className="mt-0.5 font-bold text-slate-900">{formatInteger(analytics.pacing.daysRemaining, locale)}</dd></div>
            </dl>
          </section>
        </div>
        <PrintPageFooter page={1} locale={locale} />
      </article>

      <article className="leads-print-page">
        <PrintReportHeader dateFrom={dateFrom} dateTo={dateTo} locale={locale} />
        <h2 className="text-[14px] font-bold text-slate-950">{ui(locale, "Desempenho por canal", "Performance by channel")}</h2>
        <table className="mt-2 w-full border-collapse text-[9px]">
          <thead><tr className="bg-[#14324a] text-white"><th className="px-3 py-2 text-left">{ui(locale, "Canal", "Channel")}</th><th className="px-3 py-2 text-right">Leads</th><th className="px-3 py-2 text-right">{ui(locale, "Participação", "Share")}</th><th className="px-3 py-2 text-right">{ui(locale, "Média/dia", "Average/day")}</th><th className="px-3 py-2 text-right">{ui(locale, "Meta", "Target")}</th><th className="px-3 py-2 text-right">{ui(locale, "Atingimento", "Achievement")}</th><th className="px-3 py-2 text-right">{ui(locale, "Saldo", "Gap")}</th></tr></thead>
          <tbody>{analytics.channels.map((channel, index) => <tr key={channel.value} className={index % 2 ? "bg-slate-50" : "bg-white"}><td className="border-b border-slate-200 px-3 py-2 font-semibold">{formatCategory(channel.value, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right font-bold">{formatInteger(channel.leads, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right">{formatNumber(channel.sharePercent, locale)}%</td><td className="border-b border-slate-200 px-3 py-2 text-right">{formatNumber(channel.dailyAverage, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right">{channel.target == null ? "—" : formatInteger(channel.target, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right">{channel.achievementPercent == null ? "—" : `${formatNumber(channel.achievementPercent, locale)}%`}</td><td className="border-b border-slate-200 px-3 py-2 text-right">{channel.remainingToTarget == null ? "—" : formatInteger(channel.remainingToTarget, locale)}</td></tr>)}</tbody>
        </table>
        <div className="mt-5 grid grid-cols-2 gap-5">
          <section><h2 className="text-[14px] font-bold text-slate-950">{ui(locale, "Leads por modelo", "Leads by model")}</h2><table className="mt-2 w-full text-[9px]"><thead><tr className="bg-slate-200"><th className="px-3 py-2 text-left">{ui(locale, "Modelo", "Model")}</th><th className="px-3 py-2 text-right">Leads</th><th className="px-3 py-2 text-right">%</th></tr></thead><tbody>{analytics.models.slice(0, 10).map(item => <tr key={item.value}><td className="border-b border-slate-200 px-3 py-2">{formatCategory(item.value, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right font-bold">{formatInteger(item.leads, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right">{formatNumber(item.sharePercent, locale)}%</td></tr>)}</tbody></table></section>
          <section><h2 className="text-[14px] font-bold text-slate-950">{ui(locale, "MG4 Urban por origem", "MG4 Urban by source")}</h2><table className="mt-2 w-full text-[9px]"><thead><tr className="bg-slate-200"><th className="px-3 py-2 text-left">{ui(locale, "Origem", "Source")}</th><th className="px-3 py-2 text-right">Leads</th><th className="px-3 py-2 text-right">%</th></tr></thead><tbody>{analytics.mg4UrbanSourceChannels.length ? analytics.mg4UrbanSourceChannels.map(item => <tr key={item.value}><td className="border-b border-slate-200 px-3 py-2">{formatCategory(item.value, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right font-bold">{formatInteger(item.leads, locale)}</td><td className="border-b border-slate-200 px-3 py-2 text-right">{formatNumber(item.sharePercent, locale)}%</td></tr>) : <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-500">{ui(locale, "Sem registros no período", "No records in this period")}</td></tr>}</tbody></table></section>
        </div>
        <PrintPageFooter page={2} locale={locale} />
      </article>

      {dealerPages.map((dealers, dealerPageIndex) => (
        <article className="leads-print-page" key={`dealer-page-${dealerPageIndex + 1}`}>
          <PrintReportHeader dateFrom={dateFrom} dateTo={dateTo} locale={locale} />
          {dealerPageIndex === 0 ? (
            <div className="grid grid-cols-4 gap-2">
              <PrintMetric label={ui(locale, "Concessionárias", "Dealers")} value={formatInteger(analytics.dealerAudit.summary.validDealers, locale)} />
              <PrintMetric label={ui(locale, "Leads atribuídos", "Assigned Leads")} value={formatInteger(analytics.dealerAudit.summary.assignedLeads, locale)} detail={`${formatNumber(analytics.dealerAudit.summary.assignedSharePercent, locale)}% ${ui(locale, "do total", "of total")}`} />
              <PrintMetric label={ui(locale, "Em qualificação", "In qualification")} value={formatInteger(analytics.dealerAudit.summary.unavailableLeads, locale)} detail={`${formatNumber(qualificationShare, locale)}% ${ui(locale, "do total", "of total")}`} />
              <PrintMetric label={ui(locale, "Recebendo no último dia", "Receiving on latest day")} value={formatInteger(analytics.dealerAudit.summary.dealersReceivingOnLatestDay, locale)} detail={formatDate(analytics.dealerAudit.summary.latestDay, locale)} />
            </div>
          ) : null}
          <h2 className={`${dealerPageIndex === 0 ? "mt-5" : "mt-2"} text-[14px] font-bold text-slate-950`}>
            {dealerPageIndex === 0
              ? ui(locale, "Distribuição por concessionária", "Distribution by dealer")
              : ui(locale, "Distribuição por concessionária — continuação", "Distribution by dealer — continued")}
          </h2>
          <table className="mt-2 w-full border-collapse text-[8px]">
            <thead><tr className="bg-[#14324a] text-white"><th className="px-2 py-2 text-left">{ui(locale, "Concessionária", "Dealer")}</th><th className="px-2 py-2 text-right">Leads</th><th className="px-2 py-2 text-right">%</th><th className="px-2 py-2 text-right">{ui(locale, "Média/dia", "Average/day")}</th><th className="px-2 py-2 text-right">{ui(locale, "Dias com Lead", "Days with Leads")}</th><th className="px-2 py-2 text-right">{ui(locale, "Último dia", "Latest day")}</th><th className="px-2 py-2 text-left">{ui(locale, "Último recebimento", "Latest receipt")}</th></tr></thead>
            <tbody>{dealers.map((dealer, index) => <tr key={dealer.dealerName} className={index % 2 ? "bg-slate-50" : "bg-white"}><td className="border-b border-slate-200 px-2 py-1.5 font-semibold">{dealer.dealerName}</td><td className="border-b border-slate-200 px-2 py-1.5 text-right font-bold">{formatInteger(dealer.leads, locale)}</td><td className="border-b border-slate-200 px-2 py-1.5 text-right">{formatNumber(dealer.sharePercent, locale)}%</td><td className="border-b border-slate-200 px-2 py-1.5 text-right">{formatNumber(dealer.dailyAverage, locale)}</td><td className="border-b border-slate-200 px-2 py-1.5 text-right">{formatInteger(dealer.activeDays, locale)}</td><td className="border-b border-slate-200 px-2 py-1.5 text-right">{formatInteger(dealer.latestDayLeads, locale)}</td><td className="border-b border-slate-200 px-2 py-1.5">{formatDate(dealer.lastReceiptDate, locale)}</td></tr>)}</tbody>
          </table>
          <PrintPageFooter page={dealerPageIndex + 3} locale={locale} />
        </article>
      ))}
    </section>
  );
}
