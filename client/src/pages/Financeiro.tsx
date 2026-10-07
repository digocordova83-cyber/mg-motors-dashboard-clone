import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  BadgeDollarSign,
  Building2,
  CircleDollarSign,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUMBER = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

type PartnerFilter = "all" | "webmotors" | "mercado-livre";

function formatMonth(competence: string) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
    .format(new Date(`${competence}-01T12:00:00`))
    .replace(/^./, letter => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
    .format(new Date(`${value}T12:00:00`));
}

function formatCurrency(value: number | null) {
  return value == null ? "—" : BRL.format(value);
}

function SummaryMetric({
  label,
  value,
  detail,
  icon: Icon,
  accent = "text-[#e2212d]",
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof CircleDollarSign;
  accent?: string;
}) {
  return (
    <section className="rounded-2xl border border-[#243047] bg-[#101827] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-[10px] text-slate-500">{detail}</p>
        </div>
        <span className={`grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] ${accent}`}><Icon className="h-4 w-4" /></span>
      </div>
    </section>
  );
}

function FinanceiroLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = trpc.dashboardAuth.login.useMutation({ onSuccess: onAuthenticated });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.mutate({ username, password });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#080c15] px-5 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-[#273247] bg-[#101827] p-7 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e2212d]/10 text-[#ff5360]"><LockKeyhole className="h-5 w-5" /></span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e2212d]">MG Motors</p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-white">Área Financeira</h1>
          </div>
        </div>
        <p className="mb-6 text-sm leading-6 text-slate-400">Acesse a visão de Webmotors e Mercado Livre. Esta área contém informações de contatos e é restrita a usuários autorizados.</p>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Usuário</span>
            <Input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required className="h-11 border-[#2a364c] bg-[#0b111d] text-white placeholder:text-slate-700" placeholder="Digite seu usuário" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Senha</span>
            <span className="relative block">
              <Input value={password} onChange={event => setPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="current-password" required className="h-11 border-[#2a364c] bg-[#0b111d] pr-11 text-white placeholder:text-slate-700" placeholder="Digite sua senha" />
              <button type="button" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 hover:text-white">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
          {login.error ? <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2 text-xs text-red-300">{login.error.message}</p> : null}
          <Button type="submit" disabled={login.isPending} className="h-11 w-full bg-[#e2212d] font-semibold text-white hover:bg-[#c91825]">
            {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Entrar na área financeira
          </Button>
        </form>
      </section>
    </main>
  );
}

function FinanceiroContent() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const session = trpc.dashboardAuth.session.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const canAccess = Boolean(session.data?.permissions.canAccessFinanceiro);
  const months = trpc.financeiro.months.useQuery(undefined, { enabled: canAccess, staleTime: 5 * 60 * 1000 });
  const [competence, setCompetence] = useState("");
  const [partnerFilter, setPartnerFilter] = useState<PartnerFilter>("all");
  const [search, setSearch] = useState("");
  const data = trpc.financeiro.dashboard.useQuery({ competence }, {
    enabled: canAccess && /^\d{4}-\d{2}$/.test(competence),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const logout = trpc.dashboardAuth.logout.useMutation({
    onSuccess: async () => {
      await utils.dashboardAuth.session.invalidate();
      setLocation("/finaceiro");
    },
  });

  useEffect(() => {
    if (!competence && months.data?.[0]) setCompetence(months.data[0]);
  }, [competence, months.data]);

  const visiblePartners = useMemo(() => {
    if (!data.data) return [];
    return partnerFilter === "all" ? data.data.partners : data.data.partners.filter(partner => partner.id === partnerFilter);
  }, [data.data, partnerFilter]);
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const leadRows = useMemo(() => visiblePartners.flatMap(partner => partner.leads.map(lead => ({ ...lead, partner: partner.label })))
    .filter(lead => !normalizedSearch || [lead.name, lead.email, lead.phone, lead.dealer, lead.city, lead.model, lead.partner].some(value => value.toLocaleLowerCase("pt-BR").includes(normalizedSearch))), [visiblePartners, normalizedSearch]);

  if (session.isLoading) {
    return <main className="grid min-h-screen place-items-center bg-[#080c15]"><Loader2 className="h-7 w-7 animate-spin text-[#e2212d]" /></main>;
  }
  if (!session.data) return <FinanceiroLogin onAuthenticated={() => session.refetch()} />;
  if (!canAccess) {
    return <main className="grid min-h-screen place-items-center bg-[#080c15] p-5 text-slate-100"><section className="max-w-md rounded-2xl border border-red-500/20 bg-[#101827] p-7 text-center"><LockKeyhole className="mx-auto h-7 w-7 text-red-400" /><h1 className="mt-4 text-lg font-semibold">Acesso não autorizado</h1><p className="mt-2 text-sm leading-6 text-slate-400">Este usuário não possui acesso à Área Financeira.</p><Button onClick={() => logout.mutate()} variant="outline" className="mt-5 border-[#324058] bg-[#111827] text-slate-200">Sair</Button></section></main>;
  }

  return (
    <main className="min-h-screen bg-[#080c15] text-slate-100">
      <header className="border-b border-[#1d2737] bg-[#0b111d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e2212d] text-white"><BadgeDollarSign className="h-5 w-5" /></span>
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#e2212d]">MG Motors</p><h1 className="text-lg font-semibold tracking-tight text-white">Área Financeira • Parceiros</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-xs font-medium text-slate-300">{session.data.displayName}</p><p className="mt-0.5 text-[10px] text-emerald-400">Acesso financeiro autorizado</p></div>
            <Button onClick={() => logout.mutate()} disabled={logout.isPending} variant="outline" size="sm" className="border-[#2a364a] bg-[#101827] text-slate-300 hover:bg-[#172033] hover:text-white"><LogOut className="mr-1.5 h-3.5 w-3.5" />Sair</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1680px] px-5 py-6 lg:px-7">
        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#253149] bg-[#101827] p-4 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e2212d]">Visão mensal</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Webmotors e Mercado Livre</h2><p className="mt-1 text-xs text-slate-500">Investimentos líquidos de plano, Leads canônicos e CPL calculado pela base real.</p></div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-[#2a364a] bg-[#0b111d] px-3 py-2 text-xs text-slate-400"><span>Competência</span><select aria-label="Competência" value={competence} onChange={event => setCompetence(event.target.value)} className="bg-transparent text-xs font-semibold text-white outline-none">{(months.data ?? []).map(month => <option key={month} value={month} className="bg-[#101827]">{formatMonth(month)}</option>)}</select></label>
            <Button onClick={() => data.refetch()} disabled={data.isFetching || !competence} variant="outline" size="sm" className="h-auto border-[#2a364a] bg-[#0b111d] text-slate-300 hover:bg-[#172033] hover:text-white">{data.isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />} Atualizar</Button>
          </div>
        </section>

        {data.isLoading || !data.data ? <section className="grid min-h-[420px] place-items-center rounded-2xl border border-[#243047] bg-[#101827]"><div className="text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-[#e2212d]" /><p className="mt-3 text-sm text-slate-500">Carregando visão financeira...</p></div></section> : data.error ? <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-7 text-center"><h2 className="font-semibold text-white">Não foi possível carregar os dados</h2><p className="mt-2 text-sm text-red-200/70">{data.error.message}</p></section> : <>
          <div className="mb-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryMetric label="Investimento líquido" value={formatCurrency(data.data.total.plannedNetInvestment)} detail="Soma dos planos aprovados" icon={CircleDollarSign} />
            <SummaryMetric label="Leads recebidos" value={NUMBER.format(data.data.total.actualLeads)} detail="Base canônica dos dois parceiros" icon={UsersRound} accent="text-sky-300" />
            <SummaryMetric label="CPL de referência" value={formatCurrency(data.data.total.referenceCpl)} detail="Líquido ÷ Leads recebidos" icon={TrendingUp} accent="text-amber-300" />
            <SummaryMetric label="Impressões estimadas" value={data.data.total.estimatedImpressions == null ? "—" : NUMBER.format(data.data.total.estimatedImpressions)} detail="Estimativa técnica por CPM de referência" icon={Eye} accent="text-violet-300" />
          </div>
          <p className="mb-6 rounded-xl border border-amber-400/15 bg-amber-400/[0.045] px-4 py-3 text-[11px] leading-5 text-amber-100/75"><strong className="font-semibold text-amber-300">Impressões estimadas:</strong> cálculo técnico de plano sobre investimento líquido: Webmotors usa CPM de R$ 50 e Mercado Livre CPM de R$ 35. Não representa entrega real dos veículos.</p>

          <div className="mb-6 grid gap-4 xl:grid-cols-2">
            {data.data.partners.map(partner => <section key={partner.id} className="overflow-hidden rounded-2xl border border-[#243047] bg-[#101827]">
              <div className="flex items-start justify-between gap-4 border-b border-[#223047] px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.05] text-[#e2212d]"><Building2 className="h-4 w-4" /></span><div><h3 className="text-sm font-semibold text-white">{partner.label}</h3><p className="mt-0.5 text-[10px] text-slate-500">CPM de referência: {BRL.format(partner.referenceCpm)}</p></div></div><span className="rounded-full border border-[#334159] bg-[#172033] px-2.5 py-1 text-[10px] font-semibold text-slate-300">{NUMBER.format(partner.actualLeads)} Leads</span></div>
              <div className="grid grid-cols-2 divide-x divide-[#223047] sm:grid-cols-4"><div className="p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">Investimento líquido</p><p className="mt-1 text-sm font-semibold text-white">{formatCurrency(partner.plannedNetInvestment)}</p></div><div className="p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">Leads reais</p><p className="mt-1 text-sm font-semibold text-white">{NUMBER.format(partner.actualLeads)}</p></div><div className="p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">CPL de referência</p><p className="mt-1 text-sm font-semibold text-white">{formatCurrency(partner.referenceCpl)}</p></div><div className="p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">Impressões estimadas</p><p className="mt-1 text-sm font-semibold text-white">{partner.estimatedImpressions == null ? "—" : NUMBER.format(partner.estimatedImpressions)}</p></div></div>
            </section>)}
          </div>

          <section className="overflow-hidden rounded-2xl border border-[#243047] bg-[#101827]">
            <div className="flex flex-col gap-4 border-b border-[#223047] p-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e2212d]">Base de contatos</p><h2 className="mt-1 text-base font-semibold text-white">Leads por parceiro</h2><p className="mt-1 text-xs text-slate-500">Dados pessoais disponíveis somente nesta área autorizada.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="flex rounded-lg border border-[#2a364a] bg-[#0b111d] p-1">{(["all", "webmotors", "mercado-livre"] as const).map(id => <button key={id} type="button" onClick={() => setPartnerFilter(id)} className={`rounded-md px-3 py-1.5 text-[10px] font-semibold transition-colors ${partnerFilter === id ? "bg-[#e2212d] text-white" : "text-slate-500 hover:text-slate-200"}`}>{id === "all" ? "Todos" : id === "webmotors" ? "Webmotors" : "Mercado Livre"}</button>)}</div><label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" /><Input aria-label="Buscar Lead" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar contato ou dealer" className="h-9 min-w-[220px] border-[#2a364a] bg-[#0b111d] pl-9 text-xs text-white placeholder:text-slate-700" /></label></div></div>
            <div className="max-h-[620px] overflow-auto"><table className="min-w-[1180px] w-full text-left"><thead className="sticky top-0 z-10 bg-[#111a29]"><tr className="border-b border-[#263348] text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">{["Data", "Parceiro", "Nome", "E-mail", "Telefone", "Modelo", "Concessionária", "Cidade", "UF"].map(label => <th key={label} className="whitespace-nowrap px-4 py-3">{label}</th>)}</tr></thead><tbody>{leadRows.map(lead => <tr key={`${lead.partner}-${lead.id}`} className="border-b border-[#1d283a] text-xs text-slate-300 hover:bg-white/[0.025]"><td className="whitespace-nowrap px-4 py-3 font-medium text-slate-400">{formatDate(lead.correctedDate)}</td><td className="whitespace-nowrap px-4 py-3"><span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] font-semibold text-slate-300">{lead.partner}</span></td><td className="whitespace-nowrap px-4 py-3 font-medium text-white"><span className="inline-flex items-center gap-1.5"><UserRound className="h-3 w-3 text-slate-600" />{lead.name || "—"}</span></td><td className="whitespace-nowrap px-4 py-3 text-slate-400"><span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3 text-slate-600" />{lead.email || "—"}</span></td><td className="whitespace-nowrap px-4 py-3 text-slate-400"><span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-600" />{lead.phone || "—"}</span></td><td className="whitespace-nowrap px-4 py-3">{lead.model}</td><td className="whitespace-nowrap px-4 py-3">{lead.dealer || "—"}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-600" />{lead.city || "—"}</span></td><td className="whitespace-nowrap px-4 py-3 text-slate-400">{lead.region || "—"}</td></tr>)}{!leadRows.length ? <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">Nenhum Lead encontrado para este filtro.</td></tr> : null}</tbody></table></div>
          </section>
        </>}
      </div>
    </main>
  );
}

export default function Financeiro() {
  return <FinanceiroContent />;
}
