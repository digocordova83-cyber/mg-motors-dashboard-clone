import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CampaignIdentity } from "@/components/CampaignIdentity";
import { OptimizationHistoryTab } from "@/components/OptimizationHistoryTab";
import { LeadsTab } from "@/components/LeadsTab";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { isValidLeadDateRange, resolveLeadMonthRange } from "@/lib/leadDateRange";
import {
  buildDashboardSearch,
  resolveDashboardRoute,
  type DashboardModuleId,
  type GoogleAdsTabId,
} from "@/lib/dashboardNavigation";
import type { inferRouterOutputs } from "@trpc/server";
import {
  AlertTriangle,
  ArrowRightLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Coins,
  Eye,
  EyeOff,
  Gauge,
  History,
  Info,
  Loader2,
  LogOut,
  Megaphone,
  MousePointerClick,
  PencilLine,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
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
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AppRouter } from "../../../server/routers";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type DashboardData = RouterOutputs["dashboard"]["getData"];
type DailyPoint = DashboardData["daily"][number];
type Campaign = DashboardData["campaigns"][number];
type OptimizationTask = RouterOutputs["dashboard"]["optimizationWorkspace"]["tasks"][number];
type TaskStatusFilter = "ALL" | OptimizationTask["status"];

const DATA_END = "2026-07-19";
const TAG_CORRECTION_DATE = "2026-07-15";
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUMBER = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

const dashboardModules: Array<{ id: DashboardModuleId; label: string; icon: typeof BarChart3 }> = [
  { id: "google-ads", label: "Google Ads", icon: BarChart3 },
  { id: "meta-ads", label: "Meta Ads", icon: Megaphone },
  { id: "leads", label: "Leads", icon: UsersRound },
];

const googleAdsTabs: Array<{ id: GoogleAdsTabId; label: string; icon: typeof BarChart3 }> = [
  { id: "overview", label: "Visão Geral", icon: BarChart3 },
  { id: "daily", label: "Acompanhamento Diário", icon: Clock3 },
  { id: "investment", label: "Investimento", icon: CircleDollarSign },
  { id: "optimizations", label: "Otimizações", icon: Sparkles },
  { id: "history", label: "Histórico", icon: History },
];

function getRouteFromUrl() {
  return resolveDashboardRoute(typeof window === "undefined" ? "" : window.location.search);
}

function isoDateFromDateEnd(dateEnd: string, days: number) {
  const date = new Date(`${dateEnd}T12:00:00`);
  date.setDate(date.getDate() - (days - 1));
  return date.toISOString().slice(0, 10);
}

function isoDateFromEnd(days: number) {
  return isoDateFromDateEnd(DATA_END, days);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 10_000 ? 1 : 2,
  }).format(value);
}

function formatMetric(value: number, type: "currency" | "number" | "percent") {
  if (type === "currency") return BRL.format(value);
  if (type === "percent") return `${NUMBER.format(value)}%`;
  return NUMBER.format(value);
}

const MG_LOGO_URL = "/manus-storage/logo-mg-horizontal_fb43b204.svg";

function MgLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-16 w-auto max-w-[230px] sm:h-[72px]" : size === "sm" ? "h-8 w-auto max-w-[145px]" : "h-11 w-auto max-w-[180px]";
  return (
    <img
      src={MG_LOGO_URL}
      alt="MG Motors"
      className={`${sizeClass} shrink-0 object-contain drop-shadow-[0_0_22px_rgba(226,33,45,0.16)]`}
      draggable={false}
    />
  );
}

function LoginScreen() {
  const sessionUtils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = trpc.dashboardAuth.login.useMutation({
    onSuccess: async () => {
      await sessionUtils.dashboardAuth.session.invalidate();
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.mutate({ username, password });
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#070b14] px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_50%_-20%,rgba(226,33,45,0.18),transparent_40%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:auto,42px_42px,42px_42px]" />
      <section className="relative w-full max-w-[420px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <MgLogo size="lg" />
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Dashboard Operacional de Mídia</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#202a3c] bg-[#0d1320]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur md:p-8"
        >
          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck className="h-4 w-4 text-[#e2212d]" />
              Acesso protegido
            </div>
            <p className="text-xs leading-5 text-slate-500">Entre com suas credenciais para acessar os dados de mídia da MG Motors.</p>
          </div>

          <label className="mb-5 block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Usuário</span>
            <Input
              value={username}
              onChange={event => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="Digite seu usuário"
              className="h-11 border-[#283349] bg-[#111a2a] text-sm text-white placeholder:text-slate-600 focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20"
            />
          </label>

          <label className="mb-2 block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Senha</span>
            <span className="relative block">
              <Input
                value={password}
                onChange={event => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                className="h-11 border-[#283349] bg-[#111a2a] pr-11 text-sm text-white placeholder:text-slate-600 focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(value => !value)}
                className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-slate-500 transition-colors hover:text-white"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <div className="min-h-8 py-2 text-xs text-red-400" role="alert">
            {login.error ? "Usuário ou senha inválidos. Verifique os dados e tente novamente." : null}
          </div>

          <Button
            type="submit"
            disabled={login.isPending || !username || !password}
            className="h-11 w-full bg-[#e2212d] font-semibold text-white shadow-[0_10px_30px_rgba(226,33,45,0.2)] hover:bg-[#c91622] active:scale-[0.98]"
          >
            {login.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            Entrar no dashboard
          </Button>
        </form>
        <p className="mt-5 text-center text-[11px] text-slate-700">Acesso restrito • Dados conectados ao Windsor.ai</p>
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#1e293b] bg-[#0d1421] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-transform duration-200 hover:-translate-y-0.5">
      <span className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className="mt-2 text-[22px] font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-[11px] text-slate-600">{subtitle}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/5" style={{ color: accent, backgroundColor: `${accent}12` }}>
          {icon}
        </span>
      </div>
    </article>
  );
}

function Panel({ title, subtitle, action, children, className = "" }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 max-w-full overflow-hidden rounded-xl border border-[#1e293b] bg-[#0d1421] shadow-[0_8px_24px_rgba(0,0,0,0.14)] ${className}`}>
      <header className="flex min-h-16 flex-col items-start justify-between gap-4 border-b border-[#1b2535] px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="break-words text-sm font-semibold text-slate-100">{title}</h2>
          {subtitle ? <p className="mt-1 text-[11px] text-slate-600">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function ChartTooltip({ active, payload, label, type }: { active?: boolean; payload?: Array<{ value?: number; name?: string; color?: string }>; label?: string; type: "currency" | "number" | "percent" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#2a364b] bg-[#0a101b]/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-medium text-slate-300">{label ? formatLongDate(label) : ""}</p>
      {payload.map((item, index) => (
        <p key={`${item.name}-${index}`} style={{ color: item.color ?? "#f8fafc" }}>
          {item.name}: <strong>{formatMetric(Number(item.value ?? 0), type)}</strong>
        </p>
      ))}
    </div>
  );
}

function TimeSeriesChart({
  data,
  title,
  subtitle,
  dataKey,
  type,
  color,
  correctionVisible,
}: {
  data: DailyPoint[];
  title: string;
  subtitle: string;
  dataKey: "spend" | "conversions" | "cpa";
  type: "currency" | "number";
  color: string;
  correctionVisible: boolean;
}) {
  const gradientId = `gradient-${dataKey}`;
  return (
    <Panel title={title} subtitle={subtitle} action={correctionVisible ? <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-300">15/07 • Correção de Tag</span> : null}>
      <div className="h-[270px] px-2 pb-3 pt-5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 12, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#334155" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} />
            <YAxis stroke="#334155" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={48} tickFormatter={value => (type === "currency" ? formatCompactCurrency(Number(value)) : NUMBER.format(Number(value)))} />
            <Tooltip content={<ChartTooltip type={type} />} cursor={{ stroke: "#475569", strokeDasharray: "3 3" }} />
            <Area type="monotone" dataKey={dataKey} name={title.replace(" Diário", "")} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} activeDot={{ r: 4, fill: color, stroke: "#0d1421", strokeWidth: 2 }} />
            {correctionVisible ? <ReferenceLine x={TAG_CORRECTION_DATE} stroke="#fbbf24" strokeDasharray="3 3" strokeWidth={2.5} label={{ value: "Correção de Tag", position: "insideTopLeft", fill: "#fde68a", fontSize: 10, fontWeight: 700 }} /> : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const styles = {
    Saudável: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Atenção: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    Crítico: "border-red-500/20 bg-red-500/10 text-red-400",
  }[status];
  const dot = { Saudável: "bg-emerald-400", Atenção: "bg-amber-300", Crítico: "bg-red-400" }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-52 place-items-center px-6 py-12 text-center">
      <div>
        <Info className="mx-auto h-7 w-7 text-slate-700" />
        <p className="mt-3 text-sm font-medium text-slate-300">{title}</p>
        <p className="mt-1 text-xs text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function OverviewTab({ data, correctionVisible }: { data: DashboardData; correctionVisible: boolean }) {
  const rankingPanels = [
    { title: "Top 10 — Melhor CPA", subtitle: "Menor custo por aquisição entre campanhas elegíveis", rows: data.rankings.best, tone: "emerald" as const },
    { title: "Top 10 — Pior CPA", subtitle: "Maior custo por aquisição entre campanhas elegíveis", rows: data.rankings.worst, tone: "red" as const },
  ];
  const regionStyles: Record<string, string> = {
    Favorável: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    Neutro: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    Desfavorável: "border-red-500/20 bg-red-500/10 text-red-300",
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <TimeSeriesChart data={data.daily} title="Investimento Diário" subtitle="Distribuição do investimento no período" dataKey="spend" type="currency" color="#e2212d" correctionVisible={correctionVisible} />
        <TimeSeriesChart data={data.daily} title="Conversões Diárias" subtitle="Conversões registradas pelo Google Ads" dataKey="conversions" type="number" color="#38bdf8" correctionVisible={correctionVisible} />
        <TimeSeriesChart data={data.daily} title="CPA Diário" subtitle="Custo por aquisição ao longo do tempo" dataKey="cpa" type="currency" color="#a78bfa" correctionVisible={correctionVisible} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {rankingPanels.map(panel => (
          <Panel
            key={panel.title}
            title={panel.title}
            subtitle={panel.subtitle}
            action={<span className="rounded-full border border-[#2b364a] bg-[#111a29] px-2.5 py-1 text-[9px] text-slate-500">mín. {data.rankings.criteria.minimumConversions} conversões</span>}
          >
            {panel.rows.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[690px] text-left text-xs">
                  <thead className="border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.1em] text-slate-600">
                    <tr><th className="px-4 py-3">#</th><th className="px-3 py-3">Campanha</th><th className="px-3 py-3">Produto</th><th className="px-3 py-3 text-right">Conversões</th><th className="px-3 py-3 text-right">Investimento</th><th className="px-4 py-3 text-right">CPA</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#182231]">
                    {panel.rows.map((campaign, index) => (
                      <tr key={campaign.campaignId} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3"><span className={`inline-grid h-6 w-6 place-items-center rounded-md border text-[9px] font-bold ${panel.tone === "emerald" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>{index + 1}</span></td>
                        <td className="max-w-[260px] px-3 py-3" title={`${campaign.campaignId} • ${campaign.campaign}`}><CampaignIdentity name={campaign.campaign} campaignId={campaign.campaignId} /></td>
                        <td className="px-3 py-3 text-slate-500">{campaign.product}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.conversions)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-400">{BRL.format(campaign.spend)}</td>
                        <td className={`px-4 py-3 text-right font-semibold tabular-nums ${panel.tone === "emerald" ? "text-emerald-300" : "text-red-300"}`}>{BRL.format(campaign.cpa)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyState title="Ranking indisponível" description={data.rankings.criteria.message} />}
          </Panel>
        ))}
      </div>

      {data.rankings.excludedCount > 0 ? (
        <details className="group rounded-xl border border-amber-500/15 bg-amber-500/[0.04]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-xs font-medium text-amber-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50">
            <span>{data.rankings.excludedCount} campanha(s) excluída(s) dos rankings por amostra insuficiente</span>
            <span className="text-[10px] text-amber-400/70 transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="overflow-x-auto border-t border-amber-500/10">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-[#0a101b] text-[9px] uppercase tracking-[0.1em] text-slate-600"><tr><th className="px-5 py-3">Campanha</th><th className="px-3 py-3 text-right">Investimento</th><th className="px-3 py-3 text-right">Conversões</th><th className="px-5 py-3">Motivo</th></tr></thead>
              <tbody className="divide-y divide-[#182231]">
                {data.rankings.excluded.map(campaign => (
                  <tr key={campaign.campaignId}>
                    <td className="px-5 py-3"><p className="font-medium text-slate-300">{campaign.campaign}</p><p className="mt-0.5 font-mono text-[9px] text-slate-700">ID {campaign.campaignId}</p></td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-400">{BRL.format(campaign.spend)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.conversions)}</td>
                    <td className="px-5 py-3 text-amber-200/80">{campaign.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}

      <Panel
        title="Performance por Produto"
        subtitle="Investimento, participação, conversões, CTR e CPA por classificação determinística"
        action={data.rankings.excludedCount ? <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[9px] text-amber-300">{data.rankings.excludedCount} fora do ranking por amostra</span> : null}
      >
        <div className="grid xl:grid-cols-[0.9fr_1.1fr]">
          <div className="h-[360px] border-b border-[#1b2535] p-4 xl:border-b-0 xl:border-r">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.productPerformance} margin={{ top: 4, right: 24, left: 12, bottom: 4 }}>
                <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={value => formatCompactCurrency(Number(value))} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="product" width={104} tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={value => BRL.format(Number(value))} contentStyle={{ background: "#0a101b", border: "1px solid #2a364b", borderRadius: 8, fontSize: 11 }} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="spend" name="Investimento" fill="#e2212d" radius={[0, 4, 4, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.1em] text-slate-600">
                <tr><th className="px-5 py-3">Produto</th><th className="px-3 py-3 text-right">Investimento</th><th className="px-3 py-3 text-right">Participação</th><th className="px-3 py-3 text-right">Conversões</th><th className="px-3 py-3 text-right">CTR</th><th className="px-5 py-3 text-right">CPA</th></tr>
              </thead>
              <tbody className="divide-y divide-[#182231]">
                {data.productPerformance.map(product => (
                  <tr key={product.product} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-slate-300">{product.product}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-300">{BRL.format(product.spend)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-500">{NUMBER.format(product.participation)}%</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(product.conversions)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(product.ctr)}%</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-300">{BRL.format(product.cpa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      <Panel title="Performance por Região" subtitle={`Comparação segura com o CPA médio geral de ${BRL.format(data.summary.cpa)} • metas mensais somente quando a região foi identificada`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-xs">
            <thead className="border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.1em] text-slate-600">
              <tr><th className="px-5 py-3">Região</th><th className="px-3 py-3 text-right">Investimento</th><th className="px-3 py-3 text-right">Conversões</th><th className="px-3 py-3 text-right">CPA</th><th className="px-3 py-3 text-right">Desvio vs média</th><th className="px-3 py-3 text-center">Estado</th><th className="px-5 py-3 text-right">Meta mensal leads</th></tr>
            </thead>
            <tbody className="divide-y divide-[#182231]">
              {data.regionPerformance.map(region => (
                <tr key={region.regionKey} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3"><p className="font-medium text-slate-300">{region.region}</p><p className="mt-0.5 font-mono text-[9px] text-slate-700">{region.regionKey}</p></td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-300">{BRL.format(region.spend)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(region.conversions)}</td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-300">{BRL.format(region.cpa)}</td>
                  <td className={`px-3 py-3 text-right font-medium tabular-nums ${region.deviation > 0 ? "text-red-300" : region.deviation < 0 ? "text-emerald-300" : "text-slate-400"}`}>{region.deviation >= 0 ? "+" : ""}{NUMBER.format(region.deviation)}%</td>
                  <td className="px-3 py-3 text-center"><span className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-semibold ${regionStyles[region.classification]}`}>{region.classification}</span></td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-400">{region.monthlyLeadGoal == null ? <span className="italic text-slate-700">Não mapeada</span> : NUMBER.format(region.monthlyLeadGoal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Insights Automáticos"
        subtitle={`Classificação dinâmica: atenção a partir de 1,35x e crítico a partir de 2x o CPA médio de ${BRL.format(data.summary.cpa)}`}
        action={<span className="rounded-full border border-[#2b364a] bg-[#111a29] px-2.5 py-1 text-[10px] text-slate-400">{data.insights.length} alertas</span>}
      >
        {data.insights.length ? (
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
            {data.insights.map(insight => (
              <article key={`${insight.campaignId}-${insight.severity}`} className={`rounded-lg border p-4 ${insight.severity === "Crítico" ? "border-red-500/20 bg-red-500/[0.06]" : "border-amber-500/20 bg-amber-500/[0.06]"}`}>
                <div className="flex items-center justify-between gap-3"><StatusBadge status={insight.severity} /><span className="text-[10px] text-slate-600">{insight.ratio}x média</span></div>
                <CampaignIdentity name={insight.campaign} campaignId={insight.campaignId} nameClassName="mt-3 text-xs font-semibold text-slate-200" />
                <p className="mt-2 text-lg font-semibold text-white">{BRL.format(insight.cpa)}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">{insight.message}</p>
              </article>
            ))}
          </div>
        ) : <EmptyState title="Nenhum alerta no período" description="As campanhas estão dentro da faixa de CPA esperada." />}
      </Panel>

      <Panel title="Performance por Campanha" subtitle="Campanhas ativas ou com investimento, ordenadas pelo gasto do período">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left text-xs">
            <thead className="border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.1em] text-slate-600">
              <tr><th className="px-5 py-3">Saúde</th><th className="px-3 py-3">Google Ads</th><th className="px-3 py-3">Campanha</th><th className="px-3 py-3">Produto</th><th className="px-3 py-3 text-right">Investimento</th><th className="px-3 py-3 text-right">Conversões</th><th className="px-3 py-3 text-right">CPA</th><th className="px-5 py-3 text-right">CTR</th></tr>
            </thead>
            <tbody className="divide-y divide-[#182231]">
              {data.campaigns.slice(0, 15).map(campaign => (
                <tr key={campaign.campaignId} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3"><StatusBadge status={campaign.status} /></td>
                  <td className="px-3 py-3"><span className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-semibold ${campaign.googleStatus === "ENABLED" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-slate-500/20 bg-slate-500/10 text-slate-400"}`}>{campaign.googleStatus === "ENABLED" ? "Ativada" : campaign.googleStatus === "PAUSED" ? "Pausada" : campaign.googleStatus}</span></td>
                  <td className="max-w-[300px] px-3 py-3" title={`${campaign.campaignId} • ${campaign.campaign}`}><CampaignIdentity name={campaign.campaign} campaignId={campaign.campaignId} /></td>
                  <td className="px-3 py-3 text-slate-500">{campaign.product}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-300">{BRL.format(campaign.spend)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.conversions)}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-300">{BRL.format(campaign.cpa)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.ctr)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function NullableMetric({ value, format }: { value: number | null; format: "currency" | "number" | "percent" }) {
  if (value == null) return <span className="text-[10px] italic text-slate-700">Indisponível</span>;
  return <>{formatMetric(value, format)}</>;
}

function ComparisonDelta({ value, preference, suffix = "" }: { value: number | null; preference: "higher" | "lower" | "contextual"; suffix?: string }) {
  if (value == null) return <span className="text-[10px] italic text-slate-700">Indisponível</span>;
  const favorable = preference === "contextual" ? null : preference === "lower" ? value <= 0 : value >= 0;
  const tone = favorable == null ? "border-sky-500/20 bg-sky-500/10 text-sky-300" : favorable ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300";
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold ${tone}`}>{value >= 0 ? "+" : ""}{NUMBER.format(value)}%{suffix ? ` ${suffix}` : ""}</span>;
}

function DailyTab({ data, correctionVisible }: { data: DashboardData; correctionVisible: boolean }) {
  const [campaignSearch, setCampaignSearch] = useState("");
  const comparison = data.dailyComparison;
  const normalizedSearch = campaignSearch.trim().toLowerCase();
  const filteredCampaigns = comparison.campaigns.filter(item =>
    !normalizedSearch || item.campaign.toLowerCase().includes(normalizedSearch) || item.campaignId.includes(normalizedSearch),
  );
  if (!comparison.referenceDate) return <Panel title="Acompanhamento Diário"><EmptyState title="Dados insuficientes" description="Não há um dia fechado disponível no período." /></Panel>;

  const cardIcons: Record<string, ReactNode> = {
    investment: <Coins className="h-4 w-4" />,
    conversions: <Target className="h-4 w-4" />,
    cpa: <Gauge className="h-4 w-4" />,
    ctr: <MousePointerClick className="h-4 w-4" />,
    conversionRate: <TrendingUp className="h-4 w-4" />,
    cpc: <CircleDollarSign className="h-4 w-4" />,
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {comparison.cards.map(card => (
          <article key={card.key} className="rounded-xl border border-[#1e293b] bg-[#0d1421] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between text-slate-600"><p className="text-[9px] font-semibold uppercase tracking-[0.12em]">{card.label} D-1</p>{cardIcons[card.key]}</div>
            <p className="mt-2 text-lg font-semibold text-white"><NullableMetric value={card.d1} format={card.format} /></p>
            <div className="mt-2 flex items-center justify-between gap-2"><ComparisonDelta value={card.deltaVsD2} preference={card.preference} suffix="vs D-2" /><span className="text-[9px] text-slate-700">{formatDate(comparison.referenceDate)}</span></div>
          </article>
        ))}
      </div>

      <Panel title="Acompanhamento Diário — Comparativo" subtitle={`D-1 fechado em ${formatLongDate(comparison.referenceDate)} • referências e médias independentes`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1140px] text-left text-xs">
            <thead className="border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.11em] text-slate-600">
              <tr><th className="px-5 py-3">Métrica</th><th className="px-4 py-3 text-right">D-1</th><th className="px-4 py-3 text-right">D-2</th><th className="px-4 py-3 text-center">Variação</th><th className="px-4 py-3 text-right">7 dias atrás</th><th className="px-4 py-3 text-center">Variação 7d</th><th className="px-4 py-3 text-right">Média 7d</th><th className="px-5 py-3 text-right">Média 30d</th></tr>
            </thead>
            <tbody className="divide-y divide-[#182231]">
              {comparison.table.map(metric => (
                <tr key={metric.key} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3"><p className="font-medium text-slate-300">{metric.label}</p><p className="mt-0.5 text-[9px] text-slate-700">{formatDate(comparison.referenceDate)}</p></td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums text-white"><NullableMetric value={metric.d1} format={metric.format} /></td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400"><NullableMetric value={metric.d2} format={metric.format} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonDelta value={metric.deltaVsD2} preference={metric.preference} /></td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400"><NullableMetric value={metric.weekAgo} format={metric.format} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonDelta value={metric.deltaVsWeekAgo} preference={metric.preference} /></td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400"><NullableMetric value={metric.average7d} format={metric.format} /></td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-400"><NullableMetric value={metric.average30d} format={metric.format} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Campanhas — Ontem vs Anteontem"
        subtitle={`ID e nome exatos • ${formatLongDate(comparison.referenceDate)} contra ${comparison.previousDate ? formatLongDate(comparison.previousDate) : "indisponível"}`}
        action={<span className="hidden rounded-full border border-[#2b364a] bg-[#111a29] px-2.5 py-1 text-[10px] text-slate-400 sm:inline-flex">{filteredCampaigns.length} campanhas</span>}
      >
        <div className="border-b border-[#1b2535] p-4">
          <label className="relative block w-full max-w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <Input value={campaignSearch} onChange={event => setCampaignSearch(event.target.value)} placeholder="Buscar por ID ou nome da campanha..." className="h-9 border-[#273247] bg-[#101827] pl-9 text-xs text-white placeholder:text-slate-600 focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20" />
          </label>
        </div>
        {filteredCampaigns.length ? (
          <div className="max-h-[720px] overflow-auto">
            <table className="w-full min-w-[1420px] text-left text-xs">
              <thead className="sticky top-0 z-10 border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.1em] text-slate-600">
                <tr><th className="px-5 py-3">Campanha</th><th className="px-4 py-3 text-right">Orçamento/dia</th><th className="px-4 py-3 text-right">Inv. D-1</th><th className="px-4 py-3 text-right">Inv. D-2</th><th className="px-4 py-3 text-center">Var. Inv.</th><th className="px-4 py-3 text-right">Conv. D-1</th><th className="px-4 py-3 text-right">Conv. D-2</th><th className="px-4 py-3 text-center">Var. Conv.</th><th className="px-4 py-3 text-right">CPA D-1</th><th className="px-4 py-3 text-right">CPA D-2</th><th className="px-5 py-3 text-center">Var. CPA</th></tr>
              </thead>
              <tbody className="divide-y divide-[#182231]">
                {filteredCampaigns.map(campaign => (
                  <tr key={campaign.campaignId} className="hover:bg-white/[0.02]">
                    <td className="max-w-[320px] px-5 py-3" title={`${campaign.campaignId} • ${campaign.campaign}`}><CampaignIdentity name={campaign.campaign} campaignId={campaign.campaignId} /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-500"><NullableMetric value={campaign.budget} format="currency" /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-300"><NullableMetric value={campaign.d1?.investment ?? null} format="currency" /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-500"><NullableMetric value={campaign.d2?.investment ?? null} format="currency" /></td>
                    <td className="px-4 py-3 text-center"><ComparisonDelta value={campaign.deltas.investment} preference="contextual" /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-300"><NullableMetric value={campaign.d1?.conversions ?? null} format="number" /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-500"><NullableMetric value={campaign.d2?.conversions ?? null} format="number" /></td>
                    <td className="px-4 py-3 text-center"><ComparisonDelta value={campaign.deltas.conversions} preference="higher" /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-300"><NullableMetric value={campaign.d1?.cpa ?? null} format="currency" /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-500"><NullableMetric value={campaign.d2?.cpa ?? null} format="currency" /></td>
                    <td className="px-5 py-3 text-center"><ComparisonDelta value={campaign.deltas.cpa} preference="lower" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="Nenhuma campanha encontrada" description="Ajuste a busca por ID ou nome da campanha." />}
      </Panel>

      <Panel title="Evolução Diária — Investimento e Conversões" subtitle="Série completa do período selecionado" action={correctionVisible ? <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-300">15/07 • Correção de Tag</span> : null}>
        <div className="h-[340px] px-3 pb-4 pt-5">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.daily} margin={{ top: 15, right: 16, left: 2, bottom: 0 }}>
              <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis yAxisId="money" tickFormatter={value => formatCompactCurrency(Number(value))} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={56} />
              <YAxis yAxisId="volume" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip content={<ChartTooltip type="currency" />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              <Bar yAxisId="money" dataKey="spend" name="Investimento" fill="#e2212d" radius={[3, 3, 0, 0]} maxBarSize={26} opacity={0.75} />
              <Line yAxisId="volume" type="monotone" dataKey="conversions" name="Conversões" stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              {correctionVisible ? <ReferenceLine yAxisId="money" x={TAG_CORRECTION_DATE} stroke="#fbbf24" strokeDasharray="3 3" strokeWidth={2.5} label={{ value: "Correção de Tag", position: "insideTopLeft", fill: "#fde68a", fontSize: 10, fontWeight: 700 }} /> : null}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Histórico Diário" subtitle="Spend, conversões, CPA, CTR, CPC e cliques por data">
        <div className="max-h-[620px] overflow-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="sticky top-0 z-10 border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.12em] text-slate-600">
              <tr><th className="px-5 py-3">Data</th><th className="px-4 py-3 text-right">Investimento</th><th className="px-4 py-3 text-right">Conversões</th><th className="px-4 py-3 text-right">CPA</th><th className="px-4 py-3 text-right">CTR</th><th className="px-4 py-3 text-right">CPC</th><th className="px-5 py-3 text-right">Cliques</th></tr>
            </thead>
            <tbody className="divide-y divide-[#182231]">
              {[...data.daily].reverse().map(day => (
                <tr key={day.date} className={day.date === TAG_CORRECTION_DATE ? "bg-amber-500/[0.06]" : "hover:bg-white/[0.02]"}>
                  <td className="px-5 py-3 font-medium text-slate-300">{formatLongDate(day.date)} {day.date === TAG_CORRECTION_DATE ? <span className="ml-2 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300">Correção de Tag</span> : null}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">{BRL.format(day.spend)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(day.conversions)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">{BRL.format(day.cpa)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(day.ctr)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{BRL.format(day.cpc)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-500">{NUMBER.format(day.clicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function InvestmentTab({ data, correctionVisible }: { data: DashboardData; correctionVisible: boolean }) {
  const utils = trpc.useUtils();
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const topCampaigns = data.campaigns.slice(0, 15).map(campaign => ({ ...campaign, shortName: campaign.campaign.length > 27 ? `${campaign.campaign.slice(0, 27)}…` : campaign.campaign }));
  const pacing = data.pacing;
  const updateGoal = trpc.dashboard.updateMonthlyBudgetGoal.useMutation({
    onSuccess: async () => {
      setEditingGoal(false);
      await utils.dashboard.getData.invalidate();
    },
  });

  function openGoalEditor() {
    if (!pacing) return;
    setGoalInput(pacing.monthlyGoal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setEditingGoal(true);
  }

  function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pacing) return;
    const amount = Number(goalInput.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) return;
    updateGoal.mutate({ competencia: pacing.competencia, amount });
  }

  const paceState = !pacing
    ? null
    : pacing.pacePercent > 105
      ? { label: "Acima do ritmo ideal", className: "border-red-500/20 bg-red-500/10 text-red-300", bar: "bg-red-500" }
      : pacing.pacePercent < 95
        ? { label: "Abaixo do ritmo ideal", className: "border-amber-500/20 bg-amber-500/10 text-amber-300", bar: "bg-amber-400" }
        : { label: "Dentro do ritmo ideal", className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300", bar: "bg-emerald-400" };

  return (
    <div className="space-y-4">
      {pacing && paceState ? (
        <>
          <Panel
            title={`Pacing Mensal • ${pacing.competencia.split("-").reverse().join("/")}`}
            subtitle={`Último dia fechado: ${formatLongDate(pacing.lastClosedDate)} • ${pacing.closedDays} de ${pacing.totalDays} dias`}
            action={
              <button type="button" onClick={openGoalEditor} className="inline-flex items-center gap-1.5 rounded-md border border-[#344158] bg-[#111a29] px-2.5 py-2 text-[10px] font-semibold text-slate-300 transition-colors hover:border-[#e2212d]/60 hover:text-white active:scale-[0.97]">
                <PencilLine className="h-3.5 w-3.5 text-[#e2212d]" /> Editar meta
              </button>
            }
          >
            {editingGoal ? (
              <form onSubmit={saveGoal} className="flex flex-col gap-3 border-b border-[#1b2535] bg-[#0a101b]/70 px-5 py-4 sm:flex-row sm:items-end">
                <label className="block flex-1">
                  <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-600">Meta mensal de mídia</span>
                  <Input value={goalInput} onChange={event => setGoalInput(event.target.value)} inputMode="decimal" aria-label="Meta mensal de mídia" className="h-10 border-[#344158] bg-[#101827] text-sm text-white focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20" autoFocus />
                </label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingGoal(false)} className="h-10 border-[#344158] bg-transparent text-xs text-slate-400 hover:bg-white/5 hover:text-white">Cancelar</Button>
                  <Button type="submit" disabled={updateGoal.isPending} className="h-10 bg-[#e2212d] text-xs text-white hover:bg-[#c91622]">{updateGoal.isPending ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}Salvar meta</Button>
                </div>
                {updateGoal.error ? <p className="text-[10px] text-red-400">Não foi possível atualizar a meta. Tente novamente.</p> : null}
              </form>
            ) : null}

            <div className="grid gap-px bg-[#1b2535] sm:grid-cols-2 xl:grid-cols-6">
              {[
                { label: "Meta mensal", value: BRL.format(pacing.monthlyGoal), detail: "configuração persistente" },
                { label: "Investido", value: BRL.format(pacing.invested), detail: `${NUMBER.format(pacing.achievedPercent)}% da meta` },
                { label: "Restante", value: BRL.format(pacing.remaining), detail: `${pacing.remainingDays} dias restantes` },
                { label: "Projeção", value: BRL.format(pacing.projected), detail: `${pacing.projectedDifference >= 0 ? "+" : ""}${BRL.format(pacing.projectedDifference)} vs meta` },
                { label: "Média real/dia", value: BRL.format(pacing.averageDaily), detail: `ideal ${BRL.format(pacing.idealDaily)}` },
                { label: "Ideal restante/dia", value: BRL.format(pacing.idealDailyRemaining), detail: `${NUMBER.format(pacing.pacePercent)}% do ritmo` },
              ].map(item => (
                <article key={item.label} className="bg-[#0d1421] px-5 py-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-600">{item.label}</p>
                  <p className="mt-2 text-base font-semibold tracking-tight text-white">{item.value}</p>
                  <p className="mt-1 text-[10px] text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>

            <div className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-medium text-slate-400">Ritmo acumulado contra o ideal até D-1</p>
                  <p className="mt-1 text-[10px] text-slate-600">100% representa aderência exata ao plano mensal.</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${paceState.className}`}>{paceState.label} • {NUMBER.format(pacing.pacePercent)}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#172132]">
                <div className={`h-full rounded-full ${paceState.bar}`} style={{ width: `${Math.min(pacing.pacePercent, 100)}%` }} />
              </div>
            </div>
          </Panel>

          <Panel title="Pacing Mensal Acumulado" subtitle="Real, ideal, projeção pelo ritmo observado e meta mensal">
            <div className="h-[360px] px-3 pb-4 pt-5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pacing.series} margin={{ top: 15, right: 16, left: 2, bottom: 0 }}>
                  <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={22} />
                  <YAxis tickFormatter={value => formatCompactCurrency(Number(value))} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={62} />
                  <Tooltip content={<ChartTooltip type="currency" />} cursor={{ stroke: "#475569", strokeDasharray: "3 3" }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Line type="monotone" dataKey="real" name="Real" stroke="#e2212d" strokeWidth={2.5} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="ideal" name="Ideal" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="projection" name="Projeção" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" dot={false} />
                  <Line type="linear" dataKey="monthlyGoal" name="Meta mensal" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="2 4" dot={false} />
                  {correctionVisible ? <ReferenceLine x={TAG_CORRECTION_DATE} stroke="#fbbf24" strokeDasharray="3 3" strokeWidth={2} label={{ value: "Correção de Tag", position: "insideTopLeft", fill: "#fde68a", fontSize: 10, fontWeight: 700 }} /> : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </>
      ) : (
        <Panel title="Pacing Mensal"><EmptyState title="Meta mensal não configurada" description="Cadastre uma meta de mídia para calcular ritmo, projeção e necessidade diária." /></Panel>
      )}

      <Panel title="Investimento por Período" subtitle="Série diária com referência da correção de tag" action={correctionVisible ? <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-300">15/07 • Correção de Tag</span> : null}>
        <div className="h-[320px] px-3 pb-4 pt-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.daily} margin={{ top: 15, right: 16, left: 2, bottom: 0 }}>
              <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tickFormatter={value => formatCompactCurrency(Number(value))} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={60} />
              <Tooltip content={<ChartTooltip type="currency" />} />
              <Bar dataKey="spend" name="Investimento" fill="#e2212d" radius={[4, 4, 0, 0]} maxBarSize={30} />
              {correctionVisible ? <ReferenceLine x={TAG_CORRECTION_DATE} stroke="#fbbf24" strokeDasharray="3 3" strokeWidth={2.5} label={{ value: "Correção de Tag", position: "insideTopLeft", fill: "#fde68a", fontSize: 10, fontWeight: 700 }} /> : null}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Distribuição de Orçamento — Top 15 Campanhas" subtitle="Campanhas ordenadas pelo investimento acumulado no período">
        <div className="h-[520px] px-2 py-5 md:px-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCampaigns} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={value => formatCompactCurrency(Number(value))} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="shortName" width={188} tick={{ fill: "#94a3b8", fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value: number) => BRL.format(value)} contentStyle={{ background: "#0a101b", border: "1px solid #2a364b", borderRadius: 8, fontSize: 11 }} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
              <Bar dataKey="spend" name="Investimento" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {topCampaigns.map(campaign => <Cell key={campaign.campaign} fill={campaign.status === "Crítico" ? "#ef4444" : campaign.status === "Atenção" ? "#f59e0b" : "#10b981"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Detalhamento de Orçamento por Campanha" subtitle="Participação, conversões, CPA e eficiência no período">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.12em] text-slate-600">
              <tr><th className="px-5 py-3">Campanha</th><th className="px-4 py-3 text-right">Orçamento Diário</th><th className="px-4 py-3 text-right">Investimento</th><th className="px-4 py-3 text-right">% do Total</th><th className="px-4 py-3 text-right">Conversões</th><th className="px-4 py-3 text-right">CPA</th><th className="px-5 py-3">Eficiência</th></tr>
            </thead>
            <tbody className="divide-y divide-[#182231]">
              {data.campaigns.map(campaign => (
                <tr key={campaign.campaignId} className="hover:bg-white/[0.02]">
                  <td className="max-w-[320px] px-5 py-3" title={`${campaign.campaignId} • ${campaign.campaign}`}><CampaignIdentity name={campaign.campaign} campaignId={campaign.campaignId} /></td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-500">{BRL.format(campaign.budget)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">{BRL.format(campaign.spend)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-500">{data.summary.investment ? NUMBER.format((campaign.spend / data.summary.investment) * 100) : 0}%</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.conversions)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">{BRL.format(campaign.cpa)}</td>
                  <td className="px-5 py-3"><StatusBadge status={campaign.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function OptimizationsTab({ data, dateFrom, dateTo }: { data: DashboardData; dateFrom: string; dateTo: string }) {
  const utils = trpc.useUtils();
  const workspace = trpc.dashboard.optimizationWorkspace.useQuery(undefined, { refetchOnWindowFocus: false });
  const [taskStatus, setTaskStatus] = useState<TaskStatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [assignees, setAssignees] = useState<Record<number, string>>({});
  const [completionNotes, setCompletionNotes] = useState<Record<number, string>>({});

  const invalidateWorkspace = () => utils.dashboard.optimizationWorkspace.invalidate();
  const createTask = trpc.dashboard.createOptimizationTask.useMutation({ onSuccess: invalidateWorkspace });
  const createAll = trpc.dashboard.createAllOptimizationTasks.useMutation({ onSuccess: invalidateWorkspace });
  const assignTask = trpc.dashboard.assignOptimizationTask.useMutation({ onSuccess: invalidateWorkspace });
  const startTask = trpc.dashboard.startOptimizationTask.useMutation({ onSuccess: invalidateWorkspace });
  const completeTask = trpc.dashboard.completeOptimizationTask.useMutation({
    onSuccess: async () => {
      setCompletionNotes({});
      await invalidateWorkspace();
    },
  });
  const rolloverCycle = trpc.dashboard.rolloverOptimizationCycle.useMutation({
    onSuccess: async () => {
      setTaskStatus("ALL");
      setSearch("");
      await invalidateWorkspace();
    },
  });
  const reopenTask = trpc.dashboard.reopenOptimizationTask.useMutation({
    onSuccess: invalidateWorkspace,
  });

  const actionLabels: Record<string, string> = {
    INCREASE_BUDGET: "Aumentar orçamento",
    REDUCE_WASTE: "Reduzir desperdício",
    REVIEW_BIDDING: "Revisar lances",
  };
  const priorityLabels: Record<OptimizationTask["priority"], string> = {
    CRITICAL: "Crítica",
    HIGH: "Alta",
    MEDIUM: "Média",
    LOW: "Baixa",
  };
  const statusLabels: Record<OptimizationTask["status"], string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Concluída",
    REOPENED: "Reaberta",
  };
  const tasks = workspace.data?.tasks ?? [];
  const activeCycle = workspace.data?.activeCycle ?? null;
  const activeTasks = activeCycle ? tasks.filter(task => task.cycleId === activeCycle.id) : [];
  const existingSignatures = new Set(activeTasks.map(task => task.sourceSignature));
  const normalized = search.trim().toLowerCase();
  const filteredTasks = activeTasks.filter(task => {
    const matchesStatus =
      taskStatus === "ALL" ||
      (taskStatus === "PENDING"
        ? task.status === "PENDING" || task.status === "REOPENED"
        : task.status === taskStatus);
    return matchesStatus &&
      (!normalized || task.campaignName.toLowerCase().includes(normalized) || task.campaignId.toLowerCase().includes(normalized));
  });
  const taskCounts = {
    ALL: activeTasks.length,
    PENDING: activeTasks.filter(task => task.status === "PENDING" || task.status === "REOPENED").length,
    IN_PROGRESS: activeTasks.filter(task => task.status === "IN_PROGRESS").length,
    COMPLETED: activeTasks.filter(task => task.status === "COMPLETED").length,
    REOPENED: activeTasks.filter(task => task.status === "REOPENED").length,
  };
  const openTaskCount = activeTasks.filter(task => task.status !== "COMPLETED").length;
  const mutationError =
    createTask.error ??
    createAll.error ??
    assignTask.error ??
    startTask.error ??
    completeTask.error ??
    rolloverCycle.error ??
    reopenTask.error;

  return (
    <div className="space-y-4">
      <Panel
        title="Recomendações baseadas em evidências"
        subtitle={`${data.recommendations.length} ação(ões) primária(s) • uma recomendação por campanha • sem ações contraditórias`}
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => createAll.mutate({ dateFrom, dateTo })}
            disabled={!data.recommendations.length || createAll.isPending}
            className="h-8 bg-[#e2212d] px-3 text-[10px] hover:bg-[#c91622]"
          >
            {createAll.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
            Criar todas as tarefas
          </Button>
        }
      >
        <div className="grid gap-3 p-4 lg:grid-cols-2 2xl:grid-cols-3">
          {data.recommendations.map(recommendation => {
            const exists = existingSignatures.has(recommendation.sourceSignature);
            return (
              <article key={recommendation.sourceSignature} className="rounded-xl border border-[#202b3d] bg-[#0b121e] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CampaignIdentity name={recommendation.campaign} campaignId={recommendation.campaignId} nameClassName="text-xs font-semibold text-white" idClassName="mt-1" />
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-semibold ${recommendation.priority === "CRITICAL" ? "border-red-500/25 bg-red-500/10 text-red-300" : recommendation.priority === "HIGH" ? "border-amber-500/25 bg-amber-500/10 text-amber-300" : "border-sky-500/25 bg-sky-500/10 text-sky-300"}`}>{priorityLabels[recommendation.priority as OptimizationTask["priority"]]}</span>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-200">{actionLabels[recommendation.actionType] ?? recommendation.actionType}</p>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">{recommendation.description}</p>
                <dl className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#080e18] p-3 text-center">
                  <div><dt className="text-[8px] uppercase tracking-wider text-slate-700">Investimento</dt><dd className="mt-1 text-[10px] tabular-nums text-slate-300">{BRL.format(Number(recommendation.evidence.spend ?? 0))}</dd></div>
                  <div><dt className="text-[8px] uppercase tracking-wider text-slate-700">Conversões</dt><dd className="mt-1 text-[10px] tabular-nums text-slate-300">{NUMBER.format(Number(recommendation.evidence.conversions ?? 0))}</dd></div>
                  <div><dt className="text-[8px] uppercase tracking-wider text-slate-700">CPA</dt><dd className="mt-1 text-[10px] tabular-nums text-slate-300">{BRL.format(Number(recommendation.evidence.cpa ?? 0))}</dd></div>
                </dl>
                <details className="mt-3 rounded-lg border border-[#1b2637] bg-[#0a111d]">
                  <summary className="cursor-pointer px-3 py-2 text-[10px] font-medium text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-[#e2212d]/40">Motivo, impacto, risco e passo a passo</summary>
                  <div className="space-y-3 border-t border-[#1b2637] px-3 py-3 text-[10px] leading-5 text-slate-500">
                    <p><strong className="text-slate-300">Motivo:</strong> {recommendation.rationale}</p>
                    <p><strong className="text-emerald-300">Impacto esperado:</strong> {recommendation.expectedImpact}</p>
                    <p><strong className="text-amber-300">Risco:</strong> {recommendation.risk}</p>
                    <ol className="list-decimal space-y-1 pl-4">{recommendation.steps.map(step => <li key={step}>{step}</li>)}</ol>
                  </div>
                </details>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => createTask.mutate({ dateFrom, dateTo, sourceSignature: recommendation.sourceSignature })}
                  disabled={exists || createTask.isPending}
                  className="mt-3 h-8 w-full border-[#2b374b] bg-[#111a29] text-[10px] text-slate-300 hover:bg-[#182338]"
                >
                  {exists ? <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />Tarefa no ciclo</> : <><Target className="mr-1.5 h-3.5 w-3.5" />Criar tarefa</>}
                </Button>
              </article>
            );
          })}
        </div>
        {!data.recommendations.length ? <EmptyState title="Nenhuma recomendação elegível" description={data.recommendationPolicy.message} /> : null}
      </Panel>

      <Panel
        title={activeCycle ? `${activeCycle.name} — tarefas executáveis` : "Ciclo de otimização — tarefas executáveis"}
        subtitle={activeCycle ? `Iniciado em ${formatLongDate(activeCycle.startDate)} • ciclo ativo` : "Crie uma tarefa recomendada para iniciar automaticamente o primeiro ciclo."}
        action={
          <div className="flex max-w-full flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#2b364a] bg-[#111a29] px-2.5 py-1 text-[10px] text-slate-400">{activeTasks.length} tarefa(s)</span>
            {activeCycle ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" size="sm" variant="outline" disabled={rolloverCycle.isPending} className="h-8 max-w-full border-[#e2212d]/30 bg-[#e2212d]/10 px-3 text-[10px] text-[#ff8087] hover:bg-[#e2212d]/15">
                    {rolloverCycle.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />}
                    Gerar novo ciclo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-[#263247] bg-[#0d1522] text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Gerar o próximo ciclo de otimização?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 text-slate-400">
                      <span className="block">Esta ação encerrará <strong className="text-white">{activeCycle.name}</strong> e criará o próximo ciclo com rastreabilidade completa.</span>
                      <span className="block rounded-lg border border-[#273247] bg-[#0a111d] p-3 text-[11px] leading-5">
                        <strong className="text-white">{openTaskCount} pendência(s)</strong> serão transferidas sem alterar o ciclo anterior. As <strong className="text-white">{data.recommendations.length} recomendações atuais</strong> serão reavaliadas e só gerarão tarefas novas quando não houver equivalente transferida.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-[#2b374b] bg-[#111a29] text-slate-300 hover:bg-[#182338] hover:text-white">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => rolloverCycle.mutate({ dateFrom, dateTo })} className="bg-[#e2212d] text-white hover:bg-[#c91622]">Confirmar novo ciclo</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
        }
      >
        {rolloverCycle.data ? (
          <div className="border-b border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-[10px] text-emerald-300">
            {rolloverCycle.data.newCycle.name} criado: {rolloverCycle.data.transferredCount} pendência(s) transferida(s) e {rolloverCycle.data.recommendationCreatedCount} nova(s) tarefa(s) sugerida(s).
          </div>
        ) : null}
        <div className="border-b border-[#1b2535] p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"] as TaskStatusFilter[]).map(item => (
                <button key={item} type="button" onClick={() => setTaskStatus(item)} className={`rounded-md border px-3 py-2 text-[10px] font-medium transition-all active:scale-[0.97] ${taskStatus === item ? "border-[#e2212d] bg-[#e2212d] text-white" : "border-[#273247] bg-[#111927] text-slate-400 hover:border-[#3a465c] hover:text-white"}`}>
                  {item === "ALL" ? "Todas" : statusLabels[item]} <span className="ml-1 opacity-60">{taskCounts[item]}</span>
                </button>
              ))}
            </div>
            <label className="relative block w-full xl:w-[340px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
              <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por ID ou campanha..." className="h-9 border-[#273247] bg-[#101827] pl-9 text-xs text-white placeholder:text-slate-600 focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20" />
            </label>
          </div>
        </div>

        {workspace.isLoading ? (
          <div className="grid min-h-[220px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-[#e2212d]" /></div>
        ) : workspace.error ? (
          <EmptyState title="Não foi possível carregar as tarefas" description={workspace.error.message} />
        ) : filteredTasks.length ? (
          <div className="grid gap-3 p-4 xl:grid-cols-2">
            {filteredTasks.map(task => {
              const assignee = assignees[task.id] ?? task.assignee ?? "";
              const notes = completionNotes[task.id] ?? "";
              const evidence = task.evidence as Record<string, number | string | boolean | null>;
              const sourceTask = task.sourceTaskId ? tasks.find(item => item.id === task.sourceTaskId) : null;
              const sourceCycle = sourceTask
                ? workspace.data?.cycles.find(cycle => cycle.id === sourceTask.cycleId)
                : null;
              return (
                <article key={task.id} className="min-w-0 max-w-full overflow-hidden rounded-xl border border-[#202b3d] bg-[#0b121e] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#2b374b] bg-[#111a29] px-2 py-1 text-[9px] text-slate-400">#{task.id}</span>
                        <span className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${task.status === "COMPLETED" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" : task.status === "IN_PROGRESS" ? "border-sky-500/25 bg-sky-500/10 text-sky-300" : "border-amber-500/25 bg-amber-500/10 text-amber-300"}`}>{statusLabels[task.status]}</span>
                        {task.sourceTaskId ? (
                          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[9px] font-medium text-violet-300">
                            {task.status === "REOPENED" ? "Reaberta" : "Transferida"} • origem #{task.sourceTaskId}{sourceCycle ? ` (${sourceCycle.name})` : ""}
                          </span>
                        ) : null}
                        <span className="text-[9px] font-semibold text-slate-500">Prioridade {priorityLabels[task.priority]}</span>
                      </div>
                      <p className="mt-3 break-words text-xs font-semibold text-white [overflow-wrap:anywhere]" title={task.campaignName}>{task.campaignName}</p>
                      <p className="mt-1 font-mono text-[9px] text-slate-700">ID {task.campaignId}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-medium text-[#f45b65]">{actionLabels[task.actionType] ?? task.actionType}</span>
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-slate-400">{task.description}</p>
                  <p className="mt-2 text-[10px] leading-5 text-slate-600"><strong className="text-slate-400">Motivo da otimização:</strong> {task.rationale}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#080e18] p-3 text-center">
                    <div><p className="text-[8px] uppercase text-slate-700">Investimento</p><p className="mt-1 text-[10px] text-slate-300">{BRL.format(Number(evidence.spend ?? 0))}</p></div>
                    <div><p className="text-[8px] uppercase text-slate-700">Conversões</p><p className="mt-1 text-[10px] text-slate-300">{NUMBER.format(Number(evidence.conversions ?? 0))}</p></div>
                    <div><p className="text-[8px] uppercase text-slate-700">CPA</p><p className="mt-1 text-[10px] text-slate-300">{BRL.format(Number(evidence.cpa ?? 0))}</p></div>
                  </div>
                  <details className="mt-3 rounded-lg border border-[#1b2637] bg-[#0a111d]"><summary className="cursor-pointer px-3 py-2 text-[10px] text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-[#e2212d]/40">Ver impacto, risco e instruções do Google Ads</summary><div className="space-y-3 border-t border-[#1b2637] p-3 text-[10px] leading-5 text-slate-500"><p><strong className="text-emerald-300">Impacto:</strong> {task.expectedImpact}</p><p><strong className="text-amber-300">Risco:</strong> {task.risk}</p><ol className="list-decimal space-y-1 pl-4">{task.steps.map(step => <li key={step}>{step}</li>)}</ol></div></details>

                  {task.status !== "COMPLETED" ? (
                    <div className="mt-4 space-y-3 border-t border-[#1b2637] pt-4">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input value={assignee} onChange={event => setAssignees(current => ({ ...current, [task.id]: event.target.value }))} placeholder="Responsável pela tarefa" className="h-9 flex-1 border-[#273247] bg-[#101827] text-xs text-white placeholder:text-slate-600" />
                        <Button type="button" size="sm" variant="outline" onClick={() => assignTask.mutate({ taskId: task.id, assignee })} disabled={assignee.trim().length < 2 || assignTask.isPending} className="h-9 border-[#2b374b] bg-[#111a29] text-[10px] text-slate-300 hover:bg-[#182338]">Definir responsável</Button>
                        {task.status !== "IN_PROGRESS" ? <Button type="button" size="sm" variant="outline" onClick={() => startTask.mutate({ taskId: task.id })} disabled={!task.assignee || startTask.isPending} className="h-9 border-sky-500/20 bg-sky-500/10 text-[10px] text-sky-300 hover:bg-sky-500/15"><Clock3 className="mr-1.5 h-3.5 w-3.5" />Iniciar</Button> : null}
                      </div>
                      {task.status === "IN_PROGRESS" ? (
                        <>
                          <textarea value={notes} onChange={event => setCompletionNotes(current => ({ ...current, [task.id]: event.target.value }))} placeholder="Notas obrigatórias da execução: o que foi alterado, valor anterior e novo valor..." rows={3} className="w-full resize-y rounded-md border border-[#273247] bg-[#101827] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 focus:border-[#e2212d] focus:ring-2 focus:ring-[#e2212d]/20" />
                          <Button type="button" size="sm" onClick={() => completeTask.mutate({ taskId: task.id, notes, dateFrom, dateTo })} disabled={notes.trim().length < 3 || completeTask.isPending} className="h-9 w-full bg-emerald-600 text-[10px] hover:bg-emerald-500"><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Concluir e registrar snapshot</Button>
                        </>
                      ) : <p className="text-[10px] leading-5 text-slate-600">Defina o responsável e inicie a tarefa antes de registrar a conclusão.</p>}
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-2 text-[10px] text-emerald-300"><CheckCircle2 className="h-4 w-4" />Concluída por {workspace.data?.completions.find(item => item.taskId === task.id)?.completedBy ?? "usuário autenticado"}</div>
                      <Button type="button" size="sm" variant="outline" onClick={() => reopenTask.mutate({ taskId: task.id, dateFrom, dateTo })} disabled={reopenTask.isPending} className="h-9 w-full border-violet-500/20 bg-violet-500/10 text-[10px] text-violet-300 hover:bg-violet-500/15">
                        {reopenTask.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="mr-1.5 h-3.5 w-3.5" />}Reabrir no ciclo ativo
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState title={activeCycle ? "Nenhuma tarefa neste filtro" : "Nenhum ciclo ativo"} description={activeCycle ? "Ajuste o status ou a busca." : "Crie uma tarefa a partir de uma recomendação para iniciar o ciclo."} />
        )}
      </Panel>

      {mutationError ? <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">{mutationError.message}</div> : null}
    </div>
  );
}

function DashboardScreen() {
  const utils = trpc.useUtils();
  const initialRoute = useMemo(getRouteFromUrl, []);
  const [activeModule, setActiveModule] = useState<DashboardModuleId>(initialRoute.module);
  const [activeGoogleTab, setActiveGoogleTab] = useState<GoogleAdsTabId>(initialRoute.googleTab);
  const [googlePreset, setGooglePreset] = useState("30d");
  const [googleDateFrom, setGoogleDateFrom] = useState(isoDateFromEnd(30));
  const [googleDateTo, setGoogleDateTo] = useState(DATA_END);
  const [leadsPreset, setLeadsPreset] = useState("month");
  const [leadsDateFrom, setLeadsDateFrom] = useState(`${DATA_END.slice(0, 7)}-01`);
  const [leadsDateTo, setLeadsDateTo] = useState(DATA_END);
  const [leadsRangeInitialized, setLeadsRangeInitialized] = useState(false);
  const logout = trpc.dashboardAuth.logout.useMutation({
    onSuccess: async () => {
      await utils.dashboardAuth.session.invalidate();
      utils.dashboard.getData.reset();
      utils.leads.analytics.reset();
      utils.leads.bounds.reset();
      utils.leads.importHistory.reset();
    },
  });
  const googleQueryInput = useMemo(
    () => ({ dateFrom: googleDateFrom, dateTo: googleDateTo }),
    [googleDateFrom, googleDateTo],
  );
  const dashboard = trpc.dashboard.getData.useQuery(googleQueryInput, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: activeModule === "google-ads",
  });
  const leadsBounds = trpc.leads.bounds.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: activeModule === "leads",
  });

  useEffect(() => {
    if (leadsRangeInitialized || !leadsBounds.data?.dateFrom || !leadsBounds.data.dateTo) return;
    const range = resolveLeadMonthRange(leadsBounds.data.dateFrom, leadsBounds.data.dateTo);
    setLeadsDateFrom(range.dateFrom);
    setLeadsDateTo(range.dateTo);
    setLeadsPreset("month");
    setLeadsRangeInitialized(true);
  }, [leadsBounds.data, leadsRangeInitialized]);

  function replaceDashboardUrl(module: DashboardModuleId, googleTab: GoogleAdsTabId) {
    if (typeof window === "undefined") return;
    const search = buildDashboardSearch(window.location.search, module, googleTab);
    window.history.replaceState(null, "", `${window.location.pathname}${search}${window.location.hash}`);
  }

  function selectModule(module: DashboardModuleId) {
    setActiveModule(module);
    replaceDashboardUrl(module, activeGoogleTab);
  }

  function selectGoogleTab(tab: GoogleAdsTabId) {
    setActiveGoogleTab(tab);
    setActiveModule("google-ads");
    replaceDashboardUrl("google-ads", tab);
  }

  function applyGooglePreset(preset: string) {
    setGooglePreset(preset);
    setGoogleDateTo(DATA_END);
    if (preset === "month") setGoogleDateFrom(`${DATA_END.slice(0, 7)}-01`);
    else setGoogleDateFrom(isoDateFromEnd(Number.parseInt(preset, 10)));
  }

  function applyLeadsPreset(preset: string) {
    const dataEnd = leadsBounds.data?.dateTo ?? DATA_END;
    const dataStart = leadsBounds.data?.dateFrom ?? `${dataEnd.slice(0, 7)}-01`;
    setLeadsPreset(preset);
    setLeadsDateTo(dataEnd);
    if (preset === "month") {
      const range = resolveLeadMonthRange(dataStart, dataEnd);
      setLeadsDateFrom(range.dateFrom);
      setLeadsDateTo(range.dateTo);
      return;
    }
    const from = isoDateFromDateEnd(dataEnd, Number.parseInt(preset, 10));
    setLeadsDateFrom(from < dataStart ? dataStart : from);
  }

  function updateGoogleDateFrom(value: string) {
    if (!value || value > googleDateTo) return;
    setGooglePreset("custom");
    setGoogleDateFrom(value);
  }

  function updateGoogleDateTo(value: string) {
    if (!value || value < googleDateFrom || value > DATA_END) return;
    setGooglePreset("custom");
    setGoogleDateTo(value);
  }

  function updateLeadsDateFrom(value: string) {
    if (!isValidLeadDateRange(value, leadsDateTo, leadsBounds.data?.dateFrom ?? undefined, leadsBounds.data?.dateTo ?? DATA_END)) return;
    setLeadsPreset("custom");
    setLeadsDateFrom(value);
  }

  function updateLeadsDateTo(value: string) {
    if (!isValidLeadDateRange(leadsDateFrom, value, leadsBounds.data?.dateFrom ?? undefined, leadsBounds.data?.dateTo ?? DATA_END)) return;
    setLeadsPreset("custom");
    setLeadsDateTo(value);
  }

  const data = dashboard.data;
  const isGoogleAds = activeModule === "google-ads";
  const isLeads = activeModule === "leads";
  const correctionVisible = googleDateFrom <= TAG_CORRECTION_DATE && googleDateTo >= TAG_CORRECTION_DATE;
  const activeDateFrom = isLeads ? leadsDateFrom : googleDateFrom;
  const activeDateTo = isLeads ? leadsDateTo : googleDateTo;
  const activePreset = isLeads ? leadsPreset : googlePreset;
  const leadMaxDate = leadsBounds.data?.dateTo ?? DATA_END;
  const leadMinDate = leadsBounds.data?.dateFrom ?? undefined;
  const metricCards = data
    ? [
        { title: "Investimento Total", value: BRL.format(data.summary.investment), subtitle: "Google Ads • período", icon: <Coins className="h-4 w-4" />, accent: "#e2212d" },
        { title: "Conversões", value: NUMBER.format(data.summary.conversions), subtitle: "Ações registradas", icon: <Target className="h-4 w-4" />, accent: "#38bdf8" },
        { title: "CPA Médio", value: BRL.format(data.summary.cpa), subtitle: "Investimento ÷ conversões", icon: <Gauge className="h-4 w-4" />, accent: "#a78bfa" },
        { title: "CTR", value: `${NUMBER.format(data.summary.ctr)}%`, subtitle: `${NUMBER.format(data.summary.clicks)} cliques`, icon: <MousePointerClick className="h-4 w-4" />, accent: "#f59e0b" },
        { title: "Taxa de Conversão", value: `${NUMBER.format(data.summary.conversionRate)}%`, subtitle: "Conversões ÷ cliques", icon: <TrendingUp className="h-4 w-4" />, accent: "#10b981" },
        { title: "CPC Médio", value: BRL.format(data.summary.cpc), subtitle: `${NUMBER.format(data.summary.impressions)} impressões`, icon: <CircleDollarSign className="h-4 w-4" />, accent: "#60a5fa" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100">
      <div className="sticky top-0 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        <header className="border-b border-[#1d2737] bg-[#0a0f1a]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MgLogo size="sm" />
                  <span className="hidden h-5 w-px bg-[#263044] sm:block" />
                  <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 sm:block">Dashboard Operacional</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending} className="border-[#283349] bg-[#111827] text-slate-400 hover:bg-[#182236] hover:text-white lg:hidden">
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>

              <nav className="flex min-w-0 gap-1 overflow-x-auto rounded-xl border border-[#242f42] bg-[#0d1421] p-1" aria-label="Módulos do dashboard">
                {dashboardModules.map(module => {
                  const Icon = module.icon;
                  const isActive = activeModule === module.id;
                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => selectModule(module.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-[11px] font-semibold transition-all active:scale-[0.97] ${isActive ? "bg-[#e2212d] text-white shadow-[0_8px_20px_rgba(226,33,45,0.18)]" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {module.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="hidden items-center gap-3 border-l border-[#263146] pl-4 lg:flex">
              <div className="text-right"><p className="text-[11px] font-medium text-slate-300">Rodrigo</p><p className="text-[9px] text-emerald-500">Acesso ativo</p></div>
              <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending} className="h-8 border-[#283349] bg-[#111827] px-3 text-[10px] text-slate-400 hover:bg-[#182236] hover:text-white"><LogOut className="mr-1.5 h-3.5 w-3.5" />Sair</Button>
            </div>
          </div>
        </header>

        {isGoogleAds ? (
          <div className="border-b border-amber-500/20 bg-[#20170a]/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1680px] items-start gap-3 px-4 py-2.5 lg:px-6">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-[11px] leading-5 text-amber-100/75"><strong className="font-semibold text-amber-300">Correção de Tag Google — 15/07/2026:</strong> os dados de conversão anteriores a esta data podem estar subestimados. A marcação aparece em todas as séries temporais para orientar a leitura do histórico.</p>
            </div>
          </div>
        ) : null}
      </div>

      {activeModule === "meta-ads" ? <main className="mx-auto min-h-[calc(100vh-88px)] max-w-[1680px]" aria-label="Área Meta Ads vazia" /> : (
        <main className="mx-auto max-w-[1680px] px-4 pb-12 pt-5 lg:px-6">
          <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#e2212d]">{isLeads ? <UsersRound className="h-3.5 w-3.5" /> : <BarChart3 className="h-3.5 w-3.5" />}{isLeads ? "Base Comercial" : "Google Ads"}</div>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">{isLeads ? "Gestão e Auditoria de Leads" : "Performance de Mídia"}</h1>
              <p className="mt-1 text-[11px] text-slate-600">MG Motors • {formatLongDate(activeDateFrom)} a {formatLongDate(activeDateTo)}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-[#242f42] bg-[#0d1421] p-1" aria-label={`Atalhos de período de ${isLeads ? "Leads" : "Google Ads"}`}>
                {["7d", "14d", "30d", "60d"].map(preset => (
                  <button key={preset} type="button" onClick={() => isLeads ? applyLeadsPreset(preset) : applyGooglePreset(preset)} className={`shrink-0 rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${activePreset === preset ? "bg-[#e2212d] text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}>{preset}</button>
                ))}
                <button type="button" onClick={() => isLeads ? applyLeadsPreset("month") : applyGooglePreset("month")} className={`shrink-0 rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${activePreset === "month" ? "bg-[#e2212d] text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}>Mês</button>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-[#242f42] bg-[#0d1421] px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                <input
                  aria-label={isLeads ? "Data inicial de Leads" : "Data inicial de Google Ads"}
                  type="date"
                  min={isLeads ? leadMinDate : undefined}
                  max={activeDateTo}
                  value={activeDateFrom}
                  onChange={event => isLeads ? updateLeadsDateFrom(event.target.value) : updateGoogleDateFrom(event.target.value)}
                  className="min-w-0 w-[116px] bg-transparent text-[10px] text-slate-300 outline-none [color-scheme:dark]"
                />
                <span className="text-slate-700">—</span>
                <input
                  aria-label={isLeads ? "Data final de Leads" : "Data final de Google Ads"}
                  type="date"
                  min={activeDateFrom}
                  max={isLeads ? leadMaxDate : DATA_END}
                  value={activeDateTo}
                  onChange={event => isLeads ? updateLeadsDateTo(event.target.value) : updateGoogleDateTo(event.target.value)}
                  className="min-w-0 w-[116px] bg-transparent text-[10px] text-slate-300 outline-none [color-scheme:dark]"
                />
              </div>

              {isGoogleAds && data ? (
                <div className="hidden text-right 2xl:block">
                  <div className="flex items-center justify-end gap-1.5 text-[10px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{data.metadata.source === "windsor-live" ? "Windsor.ai atualizado" : "Windsor.ai • snapshot validado"}</div>
                  <p className="mt-1 text-[9px] text-slate-700">{data.metadata.campaignCount} campanhas • {data.metadata.rowCount} registros {data.metadata.cacheHit ? "• cache" : ""}</p>
                </div>
              ) : null}
            </div>
          </div>

          {isGoogleAds ? (
            <nav className="mb-4 flex gap-1 overflow-x-auto border-b border-[#1d2737]" aria-label="Áreas de Google Ads">
              {googleAdsTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} type="button" onClick={() => selectGoogleTab(tab.id)} aria-current={activeGoogleTab === tab.id ? "page" : undefined} className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-[11px] font-medium transition-colors ${activeGoogleTab === tab.id ? "text-white" : "text-slate-600 hover:text-slate-300"}`}>
                    <Icon className={`h-3.5 w-3.5 ${activeGoogleTab === tab.id ? "text-[#e2212d]" : ""}`} />{tab.label}
                    {activeGoogleTab === tab.id ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#e2212d]" /> : null}
                  </button>
                );
              })}
            </nav>
          ) : null}

          {isLeads ? (
            <LeadsTab dateFrom={leadsDateFrom} dateTo={leadsDateTo} />
          ) : dashboard.isLoading ? (
            <div className="grid min-h-[520px] place-items-center rounded-xl border border-[#1e293b] bg-[#0d1421]">
              <div className="text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-[#e2212d]" /><p className="mt-3 text-xs text-slate-500">Atualizando dados do Google Ads...</p></div>
            </div>
          ) : dashboard.error ? (
            <div className="grid min-h-[420px] place-items-center rounded-xl border border-red-500/20 bg-red-500/[0.04] px-6 text-center">
              <div><AlertTriangle className="mx-auto h-8 w-8 text-red-400" /><h2 className="mt-3 text-sm font-semibold text-white">Não foi possível carregar os dados</h2><p className="mt-1 max-w-md text-xs leading-5 text-slate-500">A conexão pode estar temporariamente indisponível. Tente novamente.</p><Button onClick={() => dashboard.refetch()} className="mt-5 bg-[#e2212d] hover:bg-[#c91622]"><RefreshCcw className="mr-2 h-4 w-4" />Tentar novamente</Button></div>
            </div>
          ) : data && data.daily.length ? (
            <>
              <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {metricCards.map(card => <MetricCard key={card.title} {...card} />)}
              </div>
              {activeGoogleTab === "overview" ? <OverviewTab data={data} correctionVisible={correctionVisible} /> : null}
              {activeGoogleTab === "daily" ? <DailyTab data={data} correctionVisible={correctionVisible} /> : null}
              {activeGoogleTab === "investment" ? <InvestmentTab data={data} correctionVisible={correctionVisible} /> : null}
              {activeGoogleTab === "optimizations" ? <OptimizationsTab data={data} dateFrom={googleDateFrom} dateTo={googleDateTo} /> : null}
              {activeGoogleTab === "history" ? <OptimizationHistoryTab dateFrom={googleDateFrom} dateTo={googleDateTo} /> : null}
            </>
          ) : (
            <Panel title="Google Ads"><EmptyState title="Nenhum dado no período" description="Selecione outro intervalo de datas para continuar." /></Panel>
          )}
        </main>
      )}
    </div>
  );
}

export default function Home() {
  const session = trpc.dashboardAuth.session.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (session.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#070b14]">
        <div className="text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-[#e2212d]" /><p className="mt-3 text-xs text-slate-600">Validando acesso...</p></div>
      </div>
    );
  }

  return session.data ? <DashboardScreen /> : <LoginScreen />;
}
