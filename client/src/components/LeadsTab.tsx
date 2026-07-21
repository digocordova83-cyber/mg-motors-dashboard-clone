import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileUp,
  Gauge,
  Loader2,
  PencilLine,
  Search,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AppRouter } from "../../../server/routers";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type LeadAnalytics = RouterOutputs["leads"]["analytics"];
type LeadPreview = RouterOutputs["leads"]["previewCsv"];
type DealerAuditItem = LeadAnalytics["dealerAudit"]["dealers"][number];

type LeadsTabProps = {
  dateFrom: string;
  dateTo: string;
};

type DealerSort = "leads" | "inactiveDays" | "lastReceipt";

const NUMBER = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const INTEGER = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const CHANNEL_COLORS = ["#e2212d", "#38bdf8", "#a78bfa", "#f59e0b", "#10b981", "#f472b6", "#94a3b8"];
const MAX_CSV_SIZE_BYTES = 10 * 1024 * 1024;

function formatDate(value: string | null) {
  if (!value) return "Indisponível";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function formatDateTime(value: number | null) {
  if (!value) return "Em processamento";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${NUMBER.format(value / 1024)} KB`;
  return `${NUMBER.format(value / (1024 * 1024))} MB`;
}

function LeadPanel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 overflow-hidden rounded-xl border border-[#1e293b] bg-[#0d1421] shadow-[0_8px_24px_rgba(0,0,0,0.14)] ${className}`}>
      <header className="flex min-h-16 flex-col items-start justify-between gap-4 border-b border-[#1b2535] px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="break-words text-sm font-semibold text-slate-100">{title}</h2>
          {subtitle ? <p className="mt-1 text-[11px] leading-5 text-slate-600">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function LeadMetricCard({
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
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className="mt-2 truncate text-[22px] font-semibold tracking-tight text-white" title={value}>{value}</p>
          <p className="mt-1 text-[11px] leading-4 text-slate-600">{subtitle}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/5" style={{ color: accent, backgroundColor: `${accent}12` }}>
          {icon}
        </span>
      </div>
    </article>
  );
}

export function LeadsLoading() {
  return (
    <div className="grid min-h-[520px] place-items-center rounded-xl border border-[#1e293b] bg-[#0d1421]">
      <div className="text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#e2212d]" />
        <p className="mt-3 text-xs text-slate-500">Consolidando os Leads do período...</p>
      </div>
    </div>
  );
}

export function LeadsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-xl border border-red-500/20 bg-red-500/[0.04] px-6 text-center">
      <div>
        <AlertTriangle className="mx-auto h-8 w-8 text-red-400" />
        <h2 className="mt-3 text-sm font-semibold text-white">Não foi possível carregar os Leads</h2>
        <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">{message}</p>
        <Button onClick={onRetry} className="mt-5 bg-[#e2212d] hover:bg-[#c91622]">Tentar novamente</Button>
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Não foi possível ler o arquivo."));
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

export function LeadFilterIdentity({ dateFrom, dateTo }: LeadsTabProps) {
  return <span data-testid="lead-filter-identity">Data Corrigida • {formatDate(dateFrom)} a {formatDate(dateTo)}</span>;
}

export function LeadEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-40 place-items-center px-5 text-center">
      <div><AlertTriangle className="mx-auto h-6 w-6 text-slate-700" /><p className="mt-2 text-xs font-medium text-slate-300">{title}</p><p className="mt-1 text-[10px] leading-5 text-slate-600">{description}</p></div>
    </div>
  );
}

export type CsvImportPhase = "IDLE" | "PREVIEWING" | "READY" | "IMPORTING" | "SUCCESS" | "ERROR";

export function resolveCsvImportPhase(input: {
  isPreviewing: boolean;
  isImporting: boolean;
  hasPreview: boolean;
  success: string | null;
  error: string | null;
}): CsvImportPhase {
  if (input.isImporting) return "IMPORTING";
  if (input.isPreviewing) return "PREVIEWING";
  if (input.error) return "ERROR";
  if (input.success) return "SUCCESS";
  if (input.hasPreview) return "READY";
  return "IDLE";
}

export function CsvImportFeedback({
  isPreviewing,
  isImporting,
  hasPreview = false,
  success,
  error,
}: {
  isPreviewing: boolean;
  isImporting: boolean;
  hasPreview?: boolean;
  success: string | null;
  error: string | null;
}) {
  const phase = resolveCsvImportPhase({ isPreviewing, isImporting, hasPreview, success, error });
  if (phase === "IMPORTING") {
    return <div role="status" className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3 text-xs text-sky-200"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Importando Leads e reconciliando duplicidades...</div>;
  }
  if (phase === "PREVIEWING") {
    return <div role="status" className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3 text-xs text-sky-200"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Pré-validando o arquivo CSV...</div>;
  }
  if (phase === "SUCCESS") {
    return <div role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-xs text-emerald-300">{success}</div>;
  }
  if (phase === "ERROR") {
    return <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-xs text-red-300">{error}</div>;
  }
  return null;
}

export function CsvPreviewSummary({ preview }: { preview: LeadPreview }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#243044] bg-[#0a111d] p-3">
        <p className="break-all text-xs font-medium text-white">{preview.fileName}</p>
        <p className="mt-1 font-mono text-[9px] text-slate-600">SHA-256 {preview.fileHash}</p>
        <p className="mt-1 text-[10px] text-slate-600">{formatBytes(preview.fileSizeBytes)} • {formatDate(preview.dateFrom)} a {formatDate(preview.dateTo)}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Linhas lidas", preview.rowsTotal, "text-white"],
          ["Válidas únicas", preview.uniqueValidRows, "text-emerald-300"],
          ["Duplicadas", preview.duplicateRowsWithinFile + preview.rowsAlreadyStored, "text-amber-300"],
          ["Inválidas", preview.invalidRows, "text-red-300"],
        ].map(([label, value, tone]) => (
          <div key={String(label)} className="rounded-lg border border-[#202b3d] bg-[#101827] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">{label}</p>
            <p className={`mt-1 text-lg font-semibold ${tone}`}>{INTEGER.format(Number(value))}</p>
          </div>
        ))}
      </div>
      {preview.alreadyImported ? <div className="rounded-lg border border-sky-500/20 bg-sky-500/[0.07] px-3 py-2 text-[11px] leading-5 text-sky-200">Este arquivo já foi processado. A confirmação retornará o lote existente sem inserir Leads novamente.</div> : null}
      {preview.errors.length ? <div className="max-h-32 overflow-y-auto rounded-lg border border-red-500/15 bg-red-500/[0.04] p-3 text-[10px] leading-5 text-red-300">{preview.errors.map(error => <p key={`${error.rowNumber}-${error.message}`}>Linha {error.rowNumber}: {error.message}</p>)}</div> : null}
    </div>
  );
}

function CsvPreviewDialog({
  preview,
  open,
  isImporting,
  onOpenChange,
  onConfirm,
}: {
  preview: LeadPreview | null;
  open: boolean;
  isImporting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-[#263247] bg-[#0d1522] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-emerald-400" />Pré-validação do CSV</DialogTitle>
          <DialogDescription className="text-slate-500">Revise o resultado antes de confirmar. Nenhuma linha é gravada nesta etapa.</DialogDescription>
        </DialogHeader>
        {preview ? <CsvPreviewSummary preview={preview} /> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#2b374b] bg-[#111a29] text-slate-300 hover:bg-[#182338] hover:text-white">Cancelar</Button>
          <Button onClick={onConfirm} disabled={!preview || isImporting} className="bg-[#e2212d] text-white hover:bg-[#c91622]">
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
            {preview?.alreadyImported ? "Confirmar arquivo existente" : "Confirmar importação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GoalDialog({
  analytics,
  open,
  isSaving,
  error,
  onOpenChange,
  onSave,
}: {
  analytics: LeadAnalytics;
  open: boolean;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: number) => void;
}) {
  const [value, setValue] = useState(String(analytics.pacing.goal ?? ""));
  useEffect(() => setValue(String(analytics.pacing.goal ?? "")), [analytics.pacing.goal, open]);
  const parsed = Number.parseInt(value.replace(/\D/g, ""), 10);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#263247] bg-[#0d1522] text-white">
        <DialogHeader>
          <DialogTitle>Editar meta mensal de Leads</DialogTitle>
          <DialogDescription className="text-slate-500">Competência {analytics.pacing.competence}. A alteração fica registrada com o usuário autenticado.</DialogDescription>
        </DialogHeader>
        <label className="block">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Meta de Leads</span>
          <Input value={value} onChange={event => setValue(event.target.value.replace(/\D/g, ""))} inputMode="numeric" className="border-[#283349] bg-[#111a2a] text-white focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20" />
        </label>
        {error ? <p className="text-xs text-red-300">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#2b374b] bg-[#111a29] text-slate-300 hover:bg-[#182338] hover:text-white">Cancelar</Button>
          <Button onClick={() => onSave(parsed)} disabled={isSaving || !Number.isInteger(parsed) || parsed < 1} className="bg-[#e2212d] text-white hover:bg-[#c91622]">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Salvar meta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DealerAudit({ analytics }: { analytics: LeadAnalytics }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<DealerSort>("leads");
  const [selectedDealer, setSelectedDealer] = useState<string | null>(analytics.dealerAudit.dealers[0]?.dealerName ?? null);

  useEffect(() => {
    if (!selectedDealer || !analytics.dealerAudit.dealers.some(item => item.dealerName === selectedDealer)) {
      setSelectedDealer(analytics.dealerAudit.dealers[0]?.dealerName ?? null);
    }
  }, [analytics.dealerAudit.dealers, selectedDealer]);

  const visibleDealers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    const rows = analytics.dealerAudit.dealers.filter(item => !query || item.dealerName.toLocaleLowerCase("pt-BR").includes(query));
    return [...rows].sort((a, b) => {
      if (sort === "inactiveDays") return b.inactiveDays - a.inactiveDays || b.leads - a.leads;
      if (sort === "lastReceipt") return (a.lastReceiptDate ?? "").localeCompare(b.lastReceiptDate ?? "") || b.leads - a.leads;
      return b.leads - a.leads || a.dealerName.localeCompare(b.dealerName, "pt-BR");
    });
  }, [analytics.dealerAudit.dealers, search, sort]);

  const selectedSeries = useMemo(() => {
    if (!selectedDealer) return [];
    const byDate = new Map(
      analytics.dealerAudit.daily
        .filter(item => item.dealerName === selectedDealer)
        .map(item => [item.date, item.leads]),
    );
    return analytics.daily.map(item => ({ date: item.date, leads: byDate.get(item.date) ?? 0 }));
  }, [analytics.daily, analytics.dealerAudit.daily, selectedDealer]);

  const summary = analytics.dealerAudit.summary;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <LeadMetricCard title="Concessionárias válidas" value={INTEGER.format(summary.validDealers)} subtitle="Nomes identificados no período" icon={<Building2 className="h-4 w-4" />} accent="#38bdf8" />
        <LeadMetricCard title="Leads atribuídos" value={INTEGER.format(summary.assignedLeads)} subtitle={`${NUMBER.format(summary.assignedSharePercent)}% do total filtrado`} icon={<CheckCircle2 className="h-4 w-4" />} accent="#10b981" />
        <LeadMetricCard title="Sem concessionária" value={INTEGER.format(summary.unavailableLeads)} subtitle="Separados da auditoria nominal" icon={<AlertTriangle className="h-4 w-4" />} accent="#f59e0b" />
        <LeadMetricCard title="Recebendo no último dia" value={INTEGER.format(summary.dealersReceivingOnLatestDay)} subtitle={`Referência ${formatDate(summary.latestDay)}`} icon={<CalendarCheck2 className="h-4 w-4" />} accent="#a78bfa" />
      </div>

      <LeadPanel
        title="Evolução diária por concessionária"
        subtitle="Selecione uma linha da auditoria para conferir os recebimentos dia a dia, inclusive datas zeradas."
        action={
          <span className="max-w-full rounded-full border border-[#2b374b] bg-[#111a29] px-3 py-1 text-[10px] text-slate-300">
            {selectedDealer ?? "Nenhuma concessionária"}
          </span>
        }
      >
        {selectedSeries.length ? (
          <div className="h-[250px] px-2 pb-3 pt-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedSeries} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickFormatter={formatShortDate} stroke="#334155" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis allowDecimals={false} stroke="#334155" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={38} />
                <Tooltip contentStyle={{ background: "#0a101b", border: "1px solid #2a364b", borderRadius: 8, fontSize: 11 }} labelFormatter={value => formatDate(String(value))} formatter={value => [INTEGER.format(Number(value)), "Leads"]} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#e2212d" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#e2212d", stroke: "#0d1421", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <div className="grid min-h-48 place-items-center text-xs text-slate-600">Nenhuma concessionária válida no período.</div>}
      </LeadPanel>

      <LeadPanel
        title="Auditoria de recebimento por concessionária"
        subtitle="Volume, frequência e última data recebida. “Sem lead no último dia” é um sinal operacional, não uma conclusão sobre falha de distribuição."
        action={<span className="text-[10px] text-slate-600">{visibleDealers.length} de {summary.validDealers}</span>}
      >
        <div className="flex flex-col gap-3 border-b border-[#1b2535] p-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar concessionária..." className="h-9 border-[#273247] bg-[#101827] pl-9 text-xs text-white placeholder:text-slate-600 focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20" />
          </label>
          <label className="flex items-center gap-2 text-[10px] text-slate-500">
            Ordenar por
            <select value={sort} onChange={event => setSort(event.target.value as DealerSort)} className="h-9 rounded-md border border-[#273247] bg-[#101827] px-3 text-xs text-slate-300 outline-none focus:border-[#e2212d]">
              <option value="leads">Maior volume</option>
              <option value="inactiveDays">Mais dias sem lead</option>
              <option value="lastReceipt">Recebimento mais antigo</option>
            </select>
          </label>
        </div>

        {analytics.dealerAudit.unavailable ? (
          <div className="border-b border-amber-500/15 bg-amber-500/[0.04] px-4 py-3 text-[10px] leading-5 text-amber-200/80">
            <strong className="text-amber-300">Registros não atribuídos:</strong> {INTEGER.format(analytics.dealerAudit.unavailable.leads)} Leads ({NUMBER.format(analytics.dealerAudit.unavailable.sharePercent)}%) permanecem como “Indisponível” e não foram associados a nenhuma concessionária.
          </div>
        ) : null}

        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left">
            <thead className="border-b border-[#1d2737] bg-[#0a111d] text-[9px] uppercase tracking-[0.1em] text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Concessionária</th>
                <th className="px-3 py-3 text-right font-semibold">Leads</th>
                <th className="px-3 py-3 text-right font-semibold">Participação</th>
                <th className="px-3 py-3 text-right font-semibold">Média/dia</th>
                <th className="px-3 py-3 text-right font-semibold">Dias com lead</th>
                <th className="px-3 py-3 text-right font-semibold">Dias sem lead</th>
                <th className="px-3 py-3 font-semibold">Primeiro recebimento</th>
                <th className="px-3 py-3 font-semibold">Último recebimento</th>
                <th className="px-4 py-3 font-semibold">Situação no último dia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172131]">
              {visibleDealers.map(dealer => (
                <DealerRow key={dealer.dealerName} dealer={dealer} selected={dealer.dealerName === selectedDealer} onSelect={() => setSelectedDealer(dealer.dealerName)} />
              ))}
            </tbody>
          </table>
          {!visibleDealers.length ? <LeadEmptyState title="Nenhuma concessionária encontrada" description="Ajuste a busca para voltar à lista auditável." /> : null}
        </div>
      </LeadPanel>
    </div>
  );
}

function DealerRow({ dealer, selected, onSelect }: { dealer: DealerAuditItem; selected: boolean; onSelect: () => void }) {
  const receiving = dealer.receiptStatus === "RECEIVING";
  return (
    <tr onClick={onSelect} className={`cursor-pointer text-[10px] transition-colors ${selected ? "bg-[#e2212d]/[0.07]" : "hover:bg-white/[0.025]"}`}>
      <td className="px-4 py-3"><span className="font-medium text-slate-200">{dealer.dealerName}</span></td>
      <td className="px-3 py-3 text-right font-semibold text-white">{INTEGER.format(dealer.leads)}</td>
      <td className="px-3 py-3 text-right text-slate-400">{NUMBER.format(dealer.sharePercent)}%</td>
      <td className="px-3 py-3 text-right text-slate-400">{NUMBER.format(dealer.dailyAverage)}</td>
      <td className="px-3 py-3 text-right text-emerald-300">{INTEGER.format(dealer.activeDays)}</td>
      <td className="px-3 py-3 text-right text-amber-300">{INTEGER.format(dealer.inactiveDays)}</td>
      <td className="px-3 py-3 text-slate-400">{formatDate(dealer.firstReceiptDate)}</td>
      <td className="px-3 py-3 text-slate-300">{formatDate(dealer.lastReceiptDate)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-medium ${receiving ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${receiving ? "bg-emerald-400" : "bg-amber-300"}`} />
          {receiving ? `${dealer.latestDayLeads} recebido(s)` : `${dealer.daysSinceLastReceipt ?? "—"} dia(s) sem lead`}
        </span>
      </td>
    </tr>
  );
}

function BreakdownList({ title, subtitle, items, accent }: { title: string; subtitle: string; items: LeadAnalytics["models"]; accent: string }) {
  const max = Math.max(...items.map(item => item.leads), 1);
  return (
    <LeadPanel title={title} subtitle={subtitle}>
      <div className="space-y-3 p-4">
        {items.slice(0, 8).map(item => (
          <div key={item.value}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px]">
              <span className="min-w-0 truncate font-medium text-slate-300" title={item.value}>{item.value}</span>
              <span className="shrink-0 text-slate-500">{INTEGER.format(item.leads)} • {NUMBER.format(item.sharePercent)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#172131]"><span className="block h-full rounded-full" style={{ width: `${(item.leads / max) * 100}%`, backgroundColor: accent }} /></div>
          </div>
        ))}
        {!items.length ? <p className="py-10 text-center text-xs text-slate-600">Indisponível no período.</p> : null}
      </div>
    </LeadPanel>
  );
}

export function LeadsTab({ dateFrom, dateTo }: LeadsTabProps) {
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryInput = useMemo(() => ({ dateFrom, dateTo }), [dateFrom, dateTo]);
  const analytics = trpc.leads.analytics.useQuery(queryInput, { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false, retry: 1 });
  const bounds = trpc.leads.bounds.useQuery(undefined, { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false });
  const history = trpc.leads.importHistory.useQuery({ limit: 6 }, { staleTime: 60 * 1000, refetchOnWindowFocus: false });
  const [upload, setUpload] = useState<{ fileName: string; base64: string } | null>(null);
  const [preview, setPreview] = useState<LeadPreview | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [clientUploadError, setClientUploadError] = useState<string | null>(null);

  const previewMutation = trpc.leads.previewCsv.useMutation({
    onSuccess: data => {
      setPreview(data);
      setPreviewOpen(true);
      setClientUploadError(null);
    },
  });
  const importMutation = trpc.leads.importCsv.useMutation({
    onSuccess: async result => {
      setPreviewOpen(false);
      setUploadMessage(result.idempotent ? "Arquivo já processado: nenhum Lead foi duplicado." : `${INTEGER.format(result.rowsInserted)} Leads inseridos com sucesso.`);
      setUpload(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await Promise.all([
        utils.leads.analytics.invalidate(),
        utils.leads.bounds.invalidate(),
        utils.leads.importHistory.invalidate(),
      ]);
    },
  });
  const goalMutation = trpc.leads.updateMonthlyGoal.useMutation({
    onSuccess: async () => {
      setGoalOpen(false);
      await utils.leads.analytics.invalidate(queryInput);
    },
  });

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setUploadMessage(null);
    setClientUploadError(null);
    previewMutation.reset();
    importMutation.reset();
    if (!file) return;
    if (!file.name.toLocaleLowerCase("pt-BR").endsWith(".csv")) {
      setClientUploadError("Selecione um arquivo com extensão .csv.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_CSV_SIZE_BYTES) {
      setClientUploadError("O arquivo excede o limite de 10 MB.");
      event.target.value = "";
      return;
    }
    try {
      const base64 = await readFileAsDataUrl(file);
      const nextUpload = { fileName: file.name, base64 };
      setUpload(nextUpload);
      previewMutation.mutate(nextUpload);
    } catch (error) {
      setClientUploadError(error instanceof Error ? error.message : "Não foi possível ler o arquivo.");
    }
  }

  function confirmImport() {
    if (upload) importMutation.mutate(upload);
  }

  if (analytics.isLoading) return <LeadsLoading />;
  if (analytics.error) return <LeadsError message={analytics.error.message} onRetry={() => analytics.refetch()} />;
  if (!analytics.data) return <LeadsError message="A análise retornou sem dados." onRetry={() => analytics.refetch()} />;

  const data = analytics.data;
  const stackedDaily = data.daily.map(point => ({ date: point.date, total: point.total, media7d: point.rollingAverage7d, ...point.values }));
  const uploadError = clientUploadError ?? previewMutation.error?.message ?? importMutation.error?.message ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-[#1e293b] bg-[#0d1421] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.14)] lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Base de Leads ativa</div>
          <p className="mt-1 text-xs text-slate-500">{bounds.data?.totalLeads ? `${INTEGER.format(bounds.data.totalLeads)} Leads únicos • ${formatDate(bounds.data.dateFrom)} a ${formatDate(bounds.data.dateTo)}` : "Aguardando consolidação da base"}</p>
          <p className="mt-1 text-[10px] text-slate-700"><LeadFilterIdentity dateFrom={dateFrom} dateTo={dateTo} /></p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" aria-label="Selecionar arquivo CSV de Leads" />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={previewMutation.isPending || importMutation.isPending} className="border-[#e2212d]/30 bg-[#e2212d]/10 text-[#ff8c93] hover:bg-[#e2212d]/15 hover:text-white">
            {previewMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}Atualizar CSV
          </Button>
        </div>
      </div>

      <CsvImportFeedback
        isPreviewing={previewMutation.isPending}
        isImporting={importMutation.isPending}
        hasPreview={Boolean(preview)}
        success={uploadMessage}
        error={uploadError}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <LeadMetricCard title="Total de Leads" value={INTEGER.format(data.summary.totalLeads)} subtitle={`${data.summary.calendarDays} dia(s) no período`} icon={<UsersRound className="h-4 w-4" />} accent="#e2212d" />
        <LeadMetricCard title="Média diária" value={NUMBER.format(data.summary.dailyAverage)} subtitle="Dias corridos, inclusive zeros" icon={<Gauge className="h-4 w-4" />} accent="#38bdf8" />
        <LeadMetricCard title="Canal principal" value={data.summary.primaryChannel ?? "Indisponível"} subtitle={`${INTEGER.format(data.summary.primaryChannelLeads)} Leads`} icon={<TrendingUp className="h-4 w-4" />} accent="#10b981" />
        <LeadMetricCard title="Canais ativos" value={INTEGER.format(data.summary.activeChannels)} subtitle="Canais identificados no período" icon={<BarChart3 className="h-4 w-4" />} accent="#a78bfa" />
      </div>

      <LeadPanel
        title={`Pacing de Leads — ${data.pacing.competence}`}
        subtitle={`Dados fechados até ${formatDate(data.pacing.asOfDate)} • meta persistente e auditável`}
        action={<Button type="button" size="sm" variant="outline" onClick={() => setGoalOpen(true)} className="h-8 border-[#2b374b] bg-[#111a29] text-[10px] text-slate-300 hover:bg-[#182338] hover:text-white"><PencilLine className="mr-1.5 h-3.5 w-3.5" />Editar meta</Button>}
      >
        <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr_2fr]">
          <div className="rounded-xl border border-[#202b3d] bg-[#0a111d] p-4">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">Atual / meta</p><p className="mt-2 text-2xl font-semibold text-white">{INTEGER.format(data.pacing.current)} <span className="text-sm font-medium text-slate-600">/ {data.pacing.goal ? INTEGER.format(data.pacing.goal) : "Indisponível"}</span></p></div>
              <span className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${data.pacing.status === "AHEAD" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : data.pacing.status === "BEHIND" ? "border-amber-500/20 bg-amber-500/10 text-amber-300" : "border-slate-500/20 bg-slate-500/10 text-slate-300"}`}>{data.pacing.status === "AHEAD" ? "Acima do ritmo" : data.pacing.status === "BEHIND" ? "Abaixo do ritmo" : data.pacing.status === "ON_TRACK" ? "No ritmo" : "Sem referência"}</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#1a2434]"><span className="block h-full rounded-full bg-gradient-to-r from-[#e2212d] to-[#ff6f76]" style={{ width: `${Math.min(100, data.pacing.progressPercent ?? 0)}%` }} /></div>
            <div className="mt-2 flex justify-between text-[9px] text-slate-600"><span>{NUMBER.format(data.pacing.progressPercent ?? 0)}% alcançado</span><span>{data.pacing.daysRemaining} dias restantes</span></div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ["Média real/dia", NUMBER.format(data.pacing.averagePerDay)],
              ["Necessário/dia", data.pacing.requiredPerDay == null ? "Indisponível" : NUMBER.format(data.pacing.requiredPerDay)],
              ["Projeção", INTEGER.format(data.pacing.projection)],
              ["Diferença projetada", data.pacing.projectedDifference == null ? "Indisponível" : `${data.pacing.projectedDifference >= 0 ? "+" : ""}${INTEGER.format(data.pacing.projectedDifference)}`],
              ["Restante da meta", data.pacing.remainingToGoal == null ? "Indisponível" : INTEGER.format(data.pacing.remainingToGoal)],
              ["Dias fechados", `${data.pacing.closedDays} de ${data.pacing.daysInMonth}`],
            ].map(([label, value]) => <div key={label} className="rounded-lg border border-[#202b3d] bg-[#101827] p-3"><p className="text-[8px] uppercase tracking-[0.1em] text-slate-600">{label}</p><p className="mt-1.5 text-sm font-semibold text-slate-200">{value}</p></div>)}
          </div>
        </div>
      </LeadPanel>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <LeadPanel title="Leads por dia e canal" subtitle="Barras empilhadas reconciliadas com o total diário; linha mostra a média móvel de 7 dias.">
          {data.daily.length ? (
            <div className="h-[330px] px-2 pb-3 pt-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedDaily} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#1d2737" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatShortDate} stroke="#334155" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis allowDecimals={false} stroke="#334155" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={42} />
                  <Tooltip contentStyle={{ background: "#0a101b", border: "1px solid #2a364b", borderRadius: 8, fontSize: 11 }} labelFormatter={value => formatDate(String(value))} formatter={(value, name) => [INTEGER.format(Number(value)), String(name)]} />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#94a3b8", paddingTop: 10 }} />
                  {data.channelOrder.map((channel, index) => <Bar key={channel} dataKey={channel} name={channel} stackId="channels" fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} radius={index === data.channelOrder.length - 1 ? [3, 3, 0, 0] : 0} />)}
                  <Line type="monotone" dataKey="media7d" name="Média móvel 7d" stroke="#f8fafc" strokeWidth={2} dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="grid min-h-[260px] place-items-center text-xs text-slate-600">Nenhum Lead no período.</div>}
        </LeadPanel>

        <LeadPanel title="Distribuição por canal" subtitle="Volume, média diária e participação no período.">
          <div className="divide-y divide-[#172131]">
            {data.channels.map((item, index) => (
              <div key={item.value} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 text-[10px]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CHANNEL_COLORS[index % CHANNEL_COLORS.length] }} />
                <div className="min-w-0"><p className="truncate font-medium text-slate-300" title={item.value}>{item.value}</p><p className="mt-0.5 text-[9px] text-slate-600">{NUMBER.format(item.dailyAverage)} por dia</p></div>
                <div className="text-right"><p className="font-semibold text-white">{INTEGER.format(item.leads)}</p><p className="mt-0.5 text-[9px] text-slate-600">{NUMBER.format(item.sharePercent)}%</p></div>
              </div>
            ))}
            {!data.channels.length ? <div className="grid min-h-48 place-items-center text-xs text-slate-600">Indisponível no período.</div> : null}
          </div>
        </LeadPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BreakdownList title="Leads por modelo" subtitle="Classificação preservada do CSV." items={data.models} accent="#e2212d" />
        <BreakdownList title="Leads por região" subtitle="Ausências permanecem como Indisponível." items={data.regions} accent="#38bdf8" />
        <BreakdownList title="Top concessionárias" subtitle="Prévia por volume; auditoria completa abaixo." items={data.dealers} accent="#10b981" />
      </div>

      <DealerAudit analytics={data} />

      <LeadPanel title="Histórico de atualizações" subtitle="Arquivos processados com hash, usuário e resultado auditável.">
        {history.isLoading ? <div className="grid min-h-32 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-[#e2212d]" /></div> : history.data?.length ? (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="border-b border-[#1d2737] bg-[#0a111d] text-[9px] uppercase tracking-[0.1em] text-slate-600"><tr><th className="px-4 py-3">Arquivo</th><th className="px-3 py-3">Processado por</th><th className="px-3 py-3">Data</th><th className="px-3 py-3 text-right">Lidas</th><th className="px-3 py-3 text-right">Inseridas</th><th className="px-3 py-3 text-right">Ignoradas</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody className="divide-y divide-[#172131]">
                {history.data.map(item => <tr key={item.id} className="text-[10px] hover:bg-white/[0.02]"><td className="px-4 py-3"><p className="max-w-[260px] truncate font-medium text-slate-300" title={item.fileName}>{item.fileName}</p><p className="mt-0.5 font-mono text-[8px] text-slate-700">{item.fileHash.slice(0, 16)}…</p></td><td className="px-3 py-3 text-slate-400">{item.importedBy}</td><td className="px-3 py-3 text-slate-400">{formatDateTime(item.completedAt ?? item.createdAt)}</td><td className="px-3 py-3 text-right text-slate-400">{INTEGER.format(item.rowsTotal)}</td><td className="px-3 py-3 text-right text-emerald-300">{INTEGER.format(item.rowsInserted)}</td><td className="px-3 py-3 text-right text-amber-300">{INTEGER.format(item.rowsSkipped + item.rowsInvalid)}</td><td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 text-[9px] font-medium ${item.status === "COMPLETED" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : item.status === "FAILED" ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-sky-500/20 bg-sky-500/10 text-sky-300"}`}>{item.status === "COMPLETED" ? "Concluído" : item.status === "FAILED" ? "Falhou" : "Processando"}</span></td></tr>)}
              </tbody>
            </table>
          </div>
        ) : <div className="grid min-h-32 place-items-center text-xs text-slate-600">Nenhuma atualização registrada.</div>}
      </LeadPanel>

      <CsvPreviewDialog preview={preview} open={previewOpen} isImporting={importMutation.isPending} onOpenChange={setPreviewOpen} onConfirm={confirmImport} />
      <GoalDialog analytics={data} open={goalOpen} isSaving={goalMutation.isPending} error={goalMutation.error?.message ?? null} onOpenChange={setGoalOpen} onSave={goal => goalMutation.mutate({ competence: data.pacing.competence, goalCount: goal })} />
    </div>
  );
}
