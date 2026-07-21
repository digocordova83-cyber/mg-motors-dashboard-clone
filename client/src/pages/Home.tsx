import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import {
  AlertTriangle,
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
  Info,
  Loader2,
  LogOut,
  MousePointerClick,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
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
type TabId = "overview" | "daily" | "investment" | "optimizations";
type StatusFilter = "Todas" | Campaign["status"];

const DATA_END = "2026-07-19";
const TAG_CORRECTION_DATE = "2026-07-15";
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUMBER = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

const tabs: Array<{ id: TabId; label: string; icon: typeof BarChart3 }> = [
  { id: "overview", label: "Visão Geral", icon: BarChart3 },
  { id: "daily", label: "Acompanhamento Diário", icon: Clock3 },
  { id: "investment", label: "Investimento", icon: CircleDollarSign },
  { id: "optimizations", label: "Otimizações", icon: Sparkles },
];

function isoDateFromEnd(days: number) {
  const date = new Date(`${DATA_END}T12:00:00`);
  date.setDate(date.getDate() - (days - 1));
  return date.toISOString().slice(0, 10);
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

function MgLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-20 w-20 text-xl" : size === "sm" ? "h-9 w-9 text-[11px]" : "h-12 w-12 text-sm";
  return (
    <div
      className={`${sizeClass} grid shrink-0 place-items-center rounded-full border-2 border-[#e2212d] bg-[#0c111e] font-black tracking-[-0.08em] text-white shadow-[0_0_28px_rgba(226,33,45,0.2)]`}
      aria-label="MG Motors"
    >
      MG
    </div>
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
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">MG Motors</h1>
          <p className="mt-1 text-sm text-slate-500">Dashboard Operacional de Mídia</p>
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
    <section className={`rounded-xl border border-[#1e293b] bg-[#0d1421] shadow-[0_8px_24px_rgba(0,0,0,0.14)] ${className}`}>
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-[#1b2535] px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
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
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <TimeSeriesChart data={data.daily} title="Investimento Diário" subtitle="Distribuição do investimento no período" dataKey="spend" type="currency" color="#e2212d" correctionVisible={correctionVisible} />
        <TimeSeriesChart data={data.daily} title="Conversões Diárias" subtitle="Conversões registradas pelo Google Ads" dataKey="conversions" type="number" color="#38bdf8" correctionVisible={correctionVisible} />
        <TimeSeriesChart data={data.daily} title="CPA Diário" subtitle="Custo por aquisição ao longo do tempo" dataKey="cpa" type="currency" color="#a78bfa" correctionVisible={correctionVisible} />
      </div>

      <Panel
        title="Insights Automáticos"
        subtitle={`Classificação dinâmica: atenção a partir de 1,35x e crítico a partir de 2x o CPA médio de ${BRL.format(data.summary.cpa)}`}
        action={<span className="rounded-full border border-[#2b364a] bg-[#111a29] px-2.5 py-1 text-[10px] text-slate-400">{data.insights.length} alertas</span>}
      >
        {data.insights.length ? (
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
            {data.insights.map(insight => (
              <article key={`${insight.campaign}-${insight.severity}`} className={`rounded-lg border p-4 ${insight.severity === "Crítico" ? "border-red-500/20 bg-red-500/[0.06]" : "border-amber-500/20 bg-amber-500/[0.06]"}`}>
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={insight.severity} />
                  <span className="text-[10px] text-slate-600">{insight.ratio}x média</span>
                </div>
                <p className="mt-3 truncate text-xs font-semibold text-slate-200" title={insight.campaign}>{insight.campaign}</p>
                <p className="mt-2 text-lg font-semibold text-white">{BRL.format(insight.cpa)}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">{insight.message}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum alerta no período" description="As campanhas estão dentro da faixa de CPA esperada." />
        )}
      </Panel>

      <Panel title="Performance por Campanha" subtitle="Campanhas ativas ordenadas por investimento">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.12em] text-slate-600">
              <tr><th className="px-5 py-3">Status</th><th className="px-4 py-3">Campanha</th><th className="px-4 py-3">Produto</th><th className="px-4 py-3 text-right">Investimento</th><th className="px-4 py-3 text-right">Conversões</th><th className="px-4 py-3 text-right">CPA</th><th className="px-5 py-3 text-right">CTR</th></tr>
            </thead>
            <tbody className="divide-y divide-[#182231]">
              {data.campaigns.slice(0, 15).map(campaign => (
                <tr key={campaign.campaign} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3"><StatusBadge status={campaign.status} /></td>
                  <td className="max-w-[280px] truncate px-4 py-3 font-medium text-slate-300" title={campaign.campaign}>{campaign.campaign}</td>
                  <td className="px-4 py-3 text-slate-500">{campaign.product}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">{BRL.format(campaign.spend)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.conversions)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">{BRL.format(campaign.cpa)}</td>
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

function ChangeValue({ current, previous, inverse = false, suffix = "" }: { current: number; previous: number; inverse?: boolean; suffix?: string }) {
  const variation = previous ? ((current - previous) / previous) * 100 : 0;
  const positive = inverse ? variation <= 0 : variation >= 0;
  return (
    <span className={`text-[10px] ${positive ? "text-emerald-400" : "text-red-400"}`}>
      {variation >= 0 ? "+" : ""}{NUMBER.format(variation)}% {suffix}
    </span>
  );
}

function DailyTab({ data, correctionVisible }: { data: DashboardData; correctionVisible: boolean }) {
  const latest = data.daily.at(-1);
  const previous = data.daily.at(-2);
  if (!latest || !previous) return <Panel title="Acompanhamento Diário"><EmptyState title="Dados insuficientes" description="Selecione um período com pelo menos dois dias." /></Panel>;

  const dailyCards = [
    { title: "Investimento D-1", value: BRL.format(latest.spend), current: latest.spend, previous: previous.spend, inverse: true, icon: <Coins className="h-4 w-4" /> },
    { title: "Conversões D-1", value: NUMBER.format(latest.conversions), current: latest.conversions, previous: previous.conversions, icon: <Target className="h-4 w-4" /> },
    { title: "CPA D-1", value: BRL.format(latest.cpa), current: latest.cpa, previous: previous.cpa, inverse: true, icon: <Gauge className="h-4 w-4" /> },
    { title: "CTR D-1", value: `${NUMBER.format(latest.ctr)}%`, current: latest.ctr, previous: previous.ctr, icon: <MousePointerClick className="h-4 w-4" /> },
    { title: "CPC D-1", value: BRL.format(latest.cpc), current: latest.cpc, previous: previous.cpc, inverse: true, icon: <CircleDollarSign className="h-4 w-4" /> },
    { title: "Taxa de Conv. D-1", value: `${NUMBER.format(latest.conversionRate)}%`, current: latest.conversionRate, previous: previous.conversionRate, icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {dailyCards.map(card => (
          <article key={card.title} className="rounded-xl border border-[#1e293b] bg-[#0d1421] p-4">
            <div className="flex items-center justify-between text-slate-600"><p className="text-[9px] font-semibold uppercase tracking-[0.12em]">{card.title}</p>{card.icon}</div>
            <p className="mt-2 text-lg font-semibold text-white">{card.value}</p>
            <div className="mt-1 flex items-center justify-between"><ChangeValue current={card.current} previous={card.previous} inverse={card.inverse} suffix="vs D-2" /><span className="text-[9px] text-slate-700">{formatDate(latest.date)}</span></div>
          </article>
        ))}
      </div>

      <Panel title="Evolução Diária — Investimento e Conversões" subtitle="Comparativo completo do período selecionado" action={correctionVisible ? <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-300">15/07 • Correção de Tag</span> : null}>
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

      <Panel title="Acompanhamento Diário — Comparativo" subtitle="Spend, conversões, CPA, CTR e CPC por dia">
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
  const topCampaigns = data.campaigns.slice(0, 15).map(campaign => ({ ...campaign, shortName: campaign.campaign.length > 27 ? `${campaign.campaign.slice(0, 27)}…` : campaign.campaign }));
  return (
    <div className="space-y-4">
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
                <tr key={campaign.campaign} className="hover:bg-white/[0.02]">
                  <td className="max-w-[300px] truncate px-5 py-3 font-medium text-slate-300" title={campaign.campaign}>{campaign.campaign}</td>
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

function OptimizationsTab({ data }: { data: DashboardData }) {
  const [status, setStatus] = useState<StatusFilter>("Todas");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return data.campaigns.filter(campaign => (status === "Todas" || campaign.status === status) && (!normalized || campaign.campaign.toLowerCase().includes(normalized)));
  }, [data.campaigns, search, status]);

  const counts = useMemo(() => ({
    Todas: data.campaigns.length,
    Crítico: data.campaigns.filter(item => item.status === "Crítico").length,
    Atenção: data.campaigns.filter(item => item.status === "Atenção").length,
    Saudável: data.campaigns.filter(item => item.status === "Saudável").length,
  }), [data.campaigns]);

  return (
    <Panel
      title="Campanhas Ativas — Otimizações"
      subtitle={`Status calculado pelo CPA médio do período (${BRL.format(data.summary.cpa)})`}
      action={<span className="hidden rounded-full border border-[#2b364a] bg-[#111a29] px-2.5 py-1 text-[10px] text-slate-400 sm:inline-flex">{filtered.length} campanhas</span>}
    >
      <div className="border-b border-[#1b2535] p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["Todas", "Crítico", "Atenção", "Saudável"] as StatusFilter[]).map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-md border px-3 py-2 text-[11px] font-medium transition-all active:scale-[0.97] ${status === item ? "border-[#e2212d] bg-[#e2212d] text-white" : "border-[#273247] bg-[#111927] text-slate-400 hover:border-[#3a465c] hover:text-white"}`}
              >
                {item} <span className={`ml-1 ${status === item ? "text-white/70" : "text-slate-600"}`}>{counts[item]}</span>
              </button>
            ))}
          </div>
          <label className="relative block w-full xl:w-[340px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar campanha..." className="h-9 border-[#273247] bg-[#101827] pl-9 text-xs text-white placeholder:text-slate-600 focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20" />
          </label>
        </div>
      </div>

      {filtered.length ? (
        <div className="max-h-[760px] overflow-auto">
          <table className="w-full min-w-[1220px] text-left text-xs">
            <thead className="sticky top-0 z-10 border-b border-[#1b2535] bg-[#0a101b] text-[9px] uppercase tracking-[0.12em] text-slate-600">
              <tr><th className="px-5 py-3">Status</th><th className="px-4 py-3">Campanha</th><th className="px-4 py-3">Produto</th><th className="px-4 py-3">Tipo de Otimização</th><th className="px-4 py-3 text-right">Orçamento Diário</th><th className="px-4 py-3 text-right">Investimento</th><th className="px-4 py-3 text-right">Conversões</th><th className="px-4 py-3 text-right">CPA</th><th className="px-5 py-3 text-right">CTR</th></tr>
            </thead>
            <tbody className="divide-y divide-[#182231]">
              {filtered.map(campaign => (
                <tr key={campaign.campaign} className="transition-colors hover:bg-white/[0.025]">
                  <td className="px-5 py-3"><StatusBadge status={campaign.status} /></td>
                  <td className="max-w-[280px] truncate px-4 py-3 font-medium text-slate-300" title={campaign.campaign}>{campaign.campaign}</td>
                  <td className="px-4 py-3 text-slate-500">{campaign.product}</td>
                  <td className="px-4 py-3 text-slate-400">{campaign.optimizationType}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-500">{BRL.format(campaign.budget)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-300">{BRL.format(campaign.spend)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.conversions)}</td>
                  <td className={`px-4 py-3 text-right font-medium tabular-nums ${campaign.status === "Crítico" ? "text-red-400" : campaign.status === "Atenção" ? "text-amber-300" : "text-slate-300"}`}>{BRL.format(campaign.cpa)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-400">{NUMBER.format(campaign.ctr)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Nenhuma campanha encontrada" description="Ajuste o filtro de status ou o termo de busca." />
      )}
    </Panel>
  );
}

function DashboardScreen() {
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [activePreset, setActivePreset] = useState("30d");
  const [dateFrom, setDateFrom] = useState(isoDateFromEnd(30));
  const [dateTo, setDateTo] = useState(DATA_END);
  const logout = trpc.dashboardAuth.logout.useMutation({
    onSuccess: async () => {
      await utils.dashboardAuth.session.invalidate();
      utils.dashboard.getData.reset();
    },
  });
  const queryInput = useMemo(() => ({ dateFrom, dateTo }), [dateFrom, dateTo]);
  const dashboard = trpc.dashboard.getData.useQuery(queryInput, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  function applyPreset(preset: string) {
    setActivePreset(preset);
    setDateTo(DATA_END);
    if (preset === "month") setDateFrom("2026-07-01");
    else setDateFrom(isoDateFromEnd(Number.parseInt(preset, 10)));
  }

  function updateDateFrom(value: string) {
    setActivePreset("custom");
    setDateFrom(value);
  }

  function updateDateTo(value: string) {
    setActivePreset("custom");
    setDateTo(value);
  }

  const data = dashboard.data;
  const correctionVisible = dateFrom <= TAG_CORRECTION_DATE && dateTo >= TAG_CORRECTION_DATE;
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
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MgLogo size="sm" />
                <div>
                  <p className="text-sm font-semibold tracking-tight text-white">MG Motors</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-600">Dashboard Operacional</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending} className="border-[#283349] bg-[#111827] text-slate-400 hover:bg-[#182236] hover:text-white lg:hidden">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-wrap gap-1 rounded-lg border border-[#242f42] bg-[#0d1421] p-1">
                {["7d", "14d", "30d", "60d"].map(preset => (
                  <button key={preset} type="button" onClick={() => applyPreset(preset)} className={`rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${activePreset === preset ? "bg-[#e2212d] text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}>{preset}</button>
                ))}
                <button type="button" onClick={() => applyPreset("month")} className={`rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${activePreset === "month" ? "bg-[#e2212d] text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}>Mês</button>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-[#242f42] bg-[#0d1421] px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                <input aria-label="Data inicial" type="date" max={dateTo} value={dateFrom} onChange={event => updateDateFrom(event.target.value)} className="w-[112px] bg-transparent text-[10px] text-slate-300 outline-none [color-scheme:dark]" />
                <span className="text-slate-700">—</span>
                <input aria-label="Data final" type="date" min={dateFrom} max={DATA_END} value={dateTo} onChange={event => updateDateTo(event.target.value)} className="w-[112px] bg-transparent text-[10px] text-slate-300 outline-none [color-scheme:dark]" />
              </div>

              <div className="hidden items-center gap-3 border-l border-[#263146] pl-4 lg:flex">
                <div className="text-right"><p className="text-[11px] font-medium text-slate-300">Rodrigo</p><p className="text-[9px] text-emerald-500">Acesso ativo</p></div>
                <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending} className="h-8 border-[#283349] bg-[#111827] px-3 text-[10px] text-slate-400 hover:bg-[#182236] hover:text-white"><LogOut className="mr-1.5 h-3.5 w-3.5" />Sair</Button>
              </div>
            </div>
          </div>
        </header>

        <div className="border-b border-amber-500/20 bg-[#20170a]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1680px] items-start gap-3 px-4 py-2.5 lg:px-6">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-[11px] leading-5 text-amber-100/75"><strong className="font-semibold text-amber-300">Correção de Tag Google — 15/07/2026:</strong> os dados de conversão anteriores a esta data podem estar subestimados. A marcação aparece em todas as séries temporais para orientar a leitura do histórico.</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1680px] px-4 pb-12 pt-5 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#e2212d]"><BarChart3 className="h-3.5 w-3.5" />Google Ads</div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">Performance de Mídia</h1>
            <p className="mt-1 text-[11px] text-slate-600">Conta MG Motors • {formatLongDate(dateFrom)} a {formatLongDate(dateTo)}</p>
          </div>
          {data ? (
            <div className="hidden text-right md:block">
              <div className="flex items-center justify-end gap-1.5 text-[10px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{data.metadata.source === "windsor-live" ? "Windsor.ai atualizado" : "Windsor.ai • snapshot validado"}</div>
              <p className="mt-1 text-[9px] text-slate-700">{data.metadata.campaignCount} campanhas • {data.metadata.rowCount} registros {data.metadata.cacheHit ? "• cache" : ""}</p>
            </div>
          ) : null}
        </div>

        <nav className="mb-4 flex gap-1 overflow-x-auto border-b border-[#1d2737]" aria-label="Áreas do Google Ads">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-[11px] font-medium transition-colors ${activeTab === tab.id ? "text-white" : "text-slate-600 hover:text-slate-300"}`}>
                <Icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? "text-[#e2212d]" : ""}`} />{tab.label}
                {activeTab === tab.id ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#e2212d]" /> : null}
              </button>
            );
          })}
        </nav>

        {dashboard.isLoading ? (
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
            {activeTab === "overview" ? <OverviewTab data={data} correctionVisible={correctionVisible} /> : null}
            {activeTab === "daily" ? <DailyTab data={data} correctionVisible={correctionVisible} /> : null}
            {activeTab === "investment" ? <InvestmentTab data={data} correctionVisible={correctionVisible} /> : null}
            {activeTab === "optimizations" ? <OptimizationsTab data={data} /> : null}
          </>
        ) : (
          <Panel title="Google Ads"><EmptyState title="Nenhum dado no período" description="Selecione outro intervalo de datas para continuar." /></Panel>
        )}
      </main>
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
