import { Input } from "@/components/ui/input";
import type { inferRouterOutputs } from "@trpc/server";
import { Search } from "lucide-react";
import React, { type ReactNode, useMemo, useState } from "react";
import type { AppRouter } from "../../../server/routers";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type LeadAnalytics = RouterOutputs["leads"]["analytics"];
type LeadGeographicCpl = NonNullable<LeadAnalytics["geographicCpl"]>;
type LeadGeographicCplDealer = LeadGeographicCpl["dealers"][number];
type Locale = "pt-BR" | "en-US";
type DealerSort = "leads" | "investment" | "cpl";

function ui(locale: Locale, pt: string, en: string) {
  return locale === "en-US" ? en : pt;
}

function formatNumber(value: number, locale: Locale, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

function formatInteger(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function GeographicPanel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#1e293b] bg-[#0d1421] shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
      <header className="flex min-h-16 flex-col items-start justify-between gap-4 border-b border-[#1b2535] px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="break-words text-sm font-semibold text-slate-100">{title}</h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-600">{subtitle}</p>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function LeadGeographicCplTables({
  reference,
  locale = "pt-BR",
}: {
  reference: LeadGeographicCpl;
  locale?: Locale;
}) {
  const [dealerSearch, setDealerSearch] = useState("");
  const [dealerSort, setDealerSort] = useState<DealerSort>("leads");
  const visibleDealers = useMemo(() => {
    const query = dealerSearch.trim().toLocaleLowerCase(locale);
    const rows = reference.dealers.filter(
      dealer =>
        !query ||
        `${dealer.dealerName} ${dealer.stateCode}`.toLocaleLowerCase(locale).includes(query),
    );
    return [...rows].sort((left, right) => {
      if (dealerSort === "investment") {
        return right.availableInvestment - left.availableInvestment || right.leads - left.leads;
      }
      if (dealerSort === "cpl") {
        return (right.estimatedCpl ?? -1) - (left.estimatedCpl ?? -1) || right.leads - left.leads;
      }
      return right.leads - left.leads || left.dealerName.localeCompare(right.dealerName, locale);
    });
  }, [dealerSearch, dealerSort, locale, reference.dealers]);

  const investmentValue = (investment: number | null, availableInvestment: number) =>
    investment == null
      ? `${formatCurrency(availableInvestment, locale)}*`
      : formatCurrency(investment, locale);

  return (
    <section data-testid="geographic-cpl-section" className="space-y-4">
      <div className="grid min-w-0 items-stretch gap-4 xl:grid-cols-2">
        <GeographicPanel
          title={ui(locale, "CPL estimado por estado", "Estimated CPL by state")}
          subtitle={ui(
            locale,
            "UF operacional do dealer, Leads pagos e investimento real alocado no período.",
            "Dealer operational state, paid Leads, and allocated actual investment for the period.",
          )}
          action={(
            <span className="rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-2.5 py-1 text-[9px] font-semibold text-sky-300">
              {reference.states.length} UFs
            </span>
          )}
        >
          <div className="max-w-full flex-1 overflow-x-auto">
            <table data-testid="geographic-cpl-state-table" className="w-full min-w-[620px] text-left">
              <thead className="border-b border-[#1d2737] bg-[#0a111d] text-[9px] uppercase tracking-[0.1em] text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">UF</th>
                  <th className="px-3 py-3 text-right font-semibold">Dealers</th>
                  <th className="px-3 py-3 text-right font-semibold">{ui(locale, "Leads pagos", "Paid Leads")}</th>
                  <th className="px-3 py-3 text-right font-semibold">{ui(locale, "Investimento alocado", "Allocated investment")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{ui(locale, "CPL estimado", "Estimated CPL")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172131]">
                {reference.states.map(state => (
                  <tr key={state.stateCode} className="text-[11px] text-slate-300">
                    <td className="px-4 py-3 font-semibold text-white">{state.stateCode}</td>
                    <td className="px-3 py-3 text-right">{formatInteger(state.dealerCount, locale)}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-100">{formatInteger(state.leads, locale)}</td>
                    <td className="px-3 py-3 text-right">{investmentValue(state.investment, state.availableInvestment)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-300">
                      {state.estimatedCpl == null ? "—" : formatCurrency(state.estimatedCpl, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GeographicPanel>

        <GeographicPanel
          title={ui(locale, "CPL estimado por dealer", "Estimated CPL by dealer")}
          subtitle={ui(
            locale,
            "Ranking operacional com os 30 dealers da base de metas e o período selecionado.",
            "Operational ranking with the 30 dealers in the target database and selected period.",
          )}
          action={(
            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
              {visibleDealers.length} dealers
            </span>
          )}
        >
          <div className="flex flex-col gap-3 border-b border-[#1b2535] p-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
              <Input
                value={dealerSearch}
                onChange={event => setDealerSearch(event.target.value)}
                placeholder={ui(locale, "Buscar dealer ou UF...", "Search dealer or state...")}
                className="h-8 border-[#273247] bg-[#101827] pl-8 text-[10px] text-white placeholder:text-slate-600 focus-visible:border-[#e2212d] focus-visible:ring-[#e2212d]/20"
              />
            </label>
            <label className="flex shrink-0 items-center gap-2 text-[9px] text-slate-500">
              {ui(locale, "Ordenar", "Sort")}
              <select
                value={dealerSort}
                onChange={event => setDealerSort(event.target.value as DealerSort)}
                className="h-8 rounded-md border border-[#273247] bg-[#101827] px-2.5 text-[10px] text-slate-300 outline-none focus:border-[#e2212d]"
              >
                <option value="leads">{ui(locale, "Mais Leads", "Most Leads")}</option>
                <option value="investment">{ui(locale, "Maior investimento", "Highest investment")}</option>
                <option value="cpl">{ui(locale, "Maior CPL", "Highest CPL")}</option>
              </select>
            </label>
          </div>
          <div className="max-h-[520px] max-w-full flex-1 overflow-auto">
            <table data-testid="geographic-cpl-dealer-table" className="w-full min-w-[660px] text-left">
              <thead className="sticky top-0 z-10 border-b border-[#1d2737] bg-[#0a111d] text-[9px] uppercase tracking-[0.1em] text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">UF</th>
                  <th className="px-3 py-3 font-semibold">Dealer</th>
                  <th className="px-3 py-3 text-right font-semibold">{ui(locale, "Leads pagos", "Paid Leads")}</th>
                  <th className="px-3 py-3 text-right font-semibold">{ui(locale, "Investimento alocado", "Allocated investment")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{ui(locale, "CPL estimado", "Estimated CPL")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172131]">
                {visibleDealers.map((dealer: LeadGeographicCplDealer) => (
                  <tr key={dealer.dealerName} className="text-[11px] text-slate-300">
                    <td className="px-4 py-3 font-semibold text-sky-300">{dealer.stateCode}</td>
                    <td className="px-3 py-3 font-medium text-slate-100">{dealer.dealerName}</td>
                    <td className="px-3 py-3 text-right">{formatInteger(dealer.leads, locale)}</td>
                    <td className="px-3 py-3 text-right">{investmentValue(dealer.investment, dealer.availableInvestment)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-300">
                      {dealer.estimatedCpl == null ? "—" : formatCurrency(dealer.estimatedCpl, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GeographicPanel>
      </div>

      <div data-testid="geographic-cpl-methodology" className="grid gap-3 rounded-xl border border-[#1e293b] bg-[#0a111d]/70 p-4 text-[10px] leading-5 text-slate-500 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-semibold uppercase tracking-[0.11em] text-slate-300">{ui(locale, "Como o CPL foi calculado", "How CPL was calculated")}</p>
          <p className="mt-1">
            {ui(
              locale,
              "Investimento real de Google, Meta e TikTok alocado conforme a participação de cada dealer na meta do respectivo canal; dividido pelos Leads atribuídos de Site, Meta e TikTok. Não é gasto observado diretamente por dealer.",
              "Actual Google, Meta, and TikTok investment allocated by each dealer's share of the respective channel target; divided by assigned Site, Meta, and TikTok Leads. This is not spend observed directly by dealer.",
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-[#1b2637] bg-[#0d1624] p-2.5">
            <p className="text-[8px] uppercase tracking-[0.1em] text-slate-600">{ui(locale, "Cobertura", "Coverage")}</p>
            <p className="mt-1 text-sm font-semibold text-white">{formatNumber(reference.dealerCoveragePercent, locale)}%</p>
          </div>
          <div className="rounded-lg border border-[#1b2637] bg-[#0d1624] p-2.5">
            <p className="text-[8px] uppercase tracking-[0.1em] text-slate-600">{ui(locale, "Sem dealer", "No dealer")}</p>
            <p className="mt-1 text-sm font-semibold text-amber-300">{formatInteger(reference.unavailableDealerPaidMediaLeads, locale)}</p>
          </div>
          <div className="rounded-lg border border-[#1b2637] bg-[#0d1624] p-2.5">
            <p className="text-[8px] uppercase tracking-[0.1em] text-slate-600">{ui(locale, "Fora da meta", "Outside targets")}</p>
            <p className="mt-1 text-sm font-semibold text-amber-300">{formatInteger(reference.unmatchedDealerPaidMediaLeads, locale)}</p>
          </div>
        </div>
        {!reference.allSourcesAvailable ? (
          <p className="md:col-span-2 text-amber-300/80">
            * {ui(locale, "Cobertura parcial das plataformas: investimento exibido sem CPL consolidado.", "Partial platform coverage: investment shown without consolidated CPL.")}
          </p>
        ) : null}
      </div>
    </section>
  );
}
