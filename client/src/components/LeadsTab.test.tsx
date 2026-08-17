import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CsvDuplicateChannelBreakdown,
  CsvImportFeedback,
  CsvPreviewSummary,
  ChannelMediaReference,
  ChannelTargetProgress,
  DealerAudit,
  LeadEmptyState,
  LeadFilterIdentity,
  LeadSummaryCards,
  LeadsExportButton,
  LeadsError,
  formatDailyBarTotal,
  formatDealerLabel,
  invalidateLeadImportCaches,
  isQualificationDealerValue,
  LeadsLoading,
  resolveCsvImportPhase,
  resolveLeadsActionVisibility,
} from "./LeadsTab";

describe("interface de Leads", () => {
  it("exibe Leads em qualificação para concessionárias sem identificação e placeholders", () => {
    for (const value of ["Indisponível", "Unavailable", "Outros", "Outro", "N/A", "Não informado", "Sem concessionária", "  "]) {
      expect(formatDealerLabel(value)).toBe("Leads em qualificação");
      expect(isQualificationDealerValue(value)).toBe(true);
    }
    expect(formatDealerLabel("BARIGUI - CURITIBA")).toBe("BARIGUI - CURITIBA");
    expect(isQualificationDealerValue("BARIGUI - CURITIBA")).toBe(false);
  });

  it("remove os blocos geográficos duplicados e preserva a visão cruzada semanal", () => {
    const source = readFileSync(new URL("./LeadsTab.tsx", import.meta.url), "utf8");

    expect(source).not.toContain('"Leads por região"');
    expect(source).not.toContain('"Top concessionárias"');
    expect(source).toContain("<WeeklySalesPanel");
  });

  it("preenche o espaço ao lado de Leads por modelo com MG4 URBAN por origem", () => {
    const source = readFileSync(new URL("./LeadsTab.tsx", import.meta.url), "utf8");

    expect(source).toContain('className="grid gap-4 lg:grid-cols-2"');
    expect(source).toContain('"MG4 URBAN por canal de origem"');
    expect(source).toContain("data.mg4UrbanSourceChannels");
    expect(source).toContain('accent="#38bdf8"');
  });

  it("renderiza dinamicamente TikTok na distribuição por canal e na série diária", () => {
    const source = readFileSync(new URL("./LeadsTab.tsx", import.meta.url), "utf8");

    expect(source).toContain("data.channels.map");
    expect(source).toContain("data.channelOrder.map");
    expect(source).toContain('dataKey={channel}');
  });

  it("usa composição 65/35 no desktop com painéis de mesma altura e conteúdo responsivo", () => {
    const source = readFileSync(new URL("./LeadsTab.tsx", import.meta.url), "utf8");

    expect(source).toContain('data-testid="channel-overview-layout"');
    expect(source).toContain("grid items-start gap-4 2xl:auto-rows-fr 2xl:grid-cols-[minmax(0,13fr)_minmax(0,7fr)] 2xl:items-stretch");
    expect(source).toContain('className="flex h-full flex-col"');
    expect(source).toContain('data-testid="daily-channel-summary"');
    expect(source).toContain('data-testid="channel-target-grid"');
    expect(source).toContain('data-testid="channel-target-card"');
    expect(source).toContain("h-[320px] min-w-[720px] flex-1");
    expect(source).toContain("grid flex-1 content-start gap-2 p-3 sm:grid-cols-2 2xl:gap-1.5 2xl:p-2");
    expect(source).not.toContain("self-start");
    expect(source).not.toContain("2xl:grid-cols-2 2xl:items-stretch");
    expect(source).not.toContain("xl:grid-cols-[1.7fr_1fr]");
    expect(source).not.toContain("h-[350px] min-w-[760px]");
  });

  it("exibe investimento e CPL somente para Site/Google, Meta e TikTok, além do total de referência", () => {
    const source = readFileSync(new URL("./LeadsTab.tsx", import.meta.url), "utf8");

    expect(source).toContain('data-testid="paid-media-investment-total"');
    expect(source).toContain('data-testid="channel-media-reference"');
    expect(source).toContain("Google Ads + Meta Ads + TikTok Ads");
    expect(source).toContain('item.value as "Site" | "Meta" | "TikTok"');
    expect(source).toContain("Site usa o investimento de Google Ads");
    expect(source).toContain("CPL de referência = investimento do canal no período ÷ Leads exibidos no canal");
    expect(source).toContain("Webmotors e Mercado Livre permanecem sem investimento/CPL");
  });

  it("renderiza investimento e CPL de referência com moeda brasileira", () => {
    const html = renderToStaticMarkup(
      <ChannelMediaReference
        locale="pt-BR"
        reference={{
          channel: "Site",
          platform: "Google Ads",
          investment: 232_549,
          source: "persistent-snapshot",
          updatedAt: "2026-08-17T11:36:15.632Z",
          dataThroughDate: "2026-08-16",
          status: "AVAILABLE",
          error: null,
          leads: 2_149,
          referenceCpl: 108.21,
        }}
      />,
    ).replaceAll("\u00a0", " ");

    expect(html).toContain('data-channel="Site"');
    expect(html).toContain("Investimento · Google Ads");
    expect(html).toContain("R$ 232.549,00");
    expect(html).toContain("CPL de referência");
    expect(html).toContain("R$ 108,21");
  });

  it("exibe meta, percentual, saldo e barra vermelha sem inventar meta para origens não mapeadas", () => {
    const withTarget = renderToStaticMarkup(
      <ChannelTargetProgress
        locale="pt-BR"
        item={{
          value: "TikTok",
          leads: 5,
          dailyAverage: 0.38,
          sharePercent: 0.11,
          target: 620,
          targetActual: 11,
          achievementPercent: 1.77,
          remainingToTarget: 609,
          targetLabel: "TikTok",
        }}
      />,
    );
    expect(withTarget).toContain("Meta TikTok");
    expect(withTarget).toContain("11 / 620");
    expect(withTarget).toContain("1,77%");
    expect(withTarget).toContain("609 para a meta");
    expect(withTarget).toContain('role="progressbar"');
    expect(withTarget).toContain('aria-valuetext="1,77% · 609 para a meta"');
    expect(withTarget).toContain("bg-[#e2212d]");

    const withoutTarget = renderToStaticMarkup(
      <ChannelTargetProgress
        locale="en-US"
        item={{
          value: "Canal sem meta",
          leads: 1260,
          dailyAverage: 96.92,
          sharePercent: 27.58,
          target: null,
          targetActual: null,
          achievementPercent: null,
          remainingToTarget: null,
          targetLabel: null,
        }}
      />,
    );
    expect(withoutTarget).toContain("No direct spreadsheet target for this source channel");
    expect(withoutTarget).not.toContain('role="progressbar"');
  });

  it("expõe ações acessíveis para abrir os Leads por canal de cada concessionária", () => {
    const dealer = {
      dealerName: "Dealer A",
      leads: 3,
      dailyAverage: 1,
      sharePercent: 75,
      channels: [
        { value: "Site", leads: 2, dailyAverage: 0.67, sharePercent: 66.67 },
        { value: "Meta", leads: 1, dailyAverage: 0.33, sharePercent: 33.33 },
      ],
      activeDays: 2,
      inactiveDays: 1,
      firstReceiptDate: "2026-07-01",
      lastReceiptDate: "2026-07-03",
      latestDayLeads: 1,
      daysSinceLastReceipt: 0,
      isUnavailable: false,
      receiptStatus: "RECEIVING",
    };
    const unavailable = {
      ...dealer,
      dealerName: "Indisponível",
      leads: 1,
      sharePercent: 25,
      channels: [{ value: "Meta", leads: 1, dailyAverage: 0.33, sharePercent: 100 }],
      isUnavailable: true,
      receiptStatus: "UNAVAILABLE",
    };
    const analytics = {
      dealerAudit: {
        summary: {
          validDealers: 1,
          assignedLeads: 3,
          unavailableLeads: 1,
          assignedSharePercent: 75,
          dealersReceivingOnLatestDay: 1,
          latestDay: "2026-07-03",
        },
        dealers: [dealer],
        unavailable,
        daily: [],
      },
    } as never;

    const html = renderToStaticMarkup(<DealerAudit analytics={analytics} />);

    expect(html).toContain("Ver Leads por canal de Dealer A");
    expect(html).toContain("Ver Leads em qualificação por canal");
    expect(html).toContain("Dealer A");
    expect(html).toContain("Ver canais");
  });

  it("mantém a Eficiência de vendas e remove a auditoria legada da aba Leads", () => {
    const source = readFileSync(new URL("./LeadsTab.tsx", import.meta.url), "utf8");

    expect(source).toContain("<WeeklySalesPanel");
    expect(source).toContain("<DealerChannelDialog");
    expect(source).not.toContain("<DealerAudit analytics={data}");
    expect(source).toContain("weeklySalesMetrics: () => utils.leads.weeklySalesMetrics.invalidate()");
  });

  it("exibe no topo os três indicadores solicitados sem cards auxiliares", () => {
    const summary = {
      totalLeads: 8080,
      dailyAverage: 384.76,
      primaryChannel: "Site",
      primaryChannelLeads: 3866,
      activeChannels: 7,
      calendarDays: 21,
    };
    const dealerSummary = {
      validDealers: 38,
      assignedLeads: 7041,
      unavailableLeads: 1039,
      assignedSharePercent: 87.14,
      dealersReceivingOnLatestDay: 35,
      latestDay: "2026-07-21",
    };

    const html = renderToStaticMarkup(
      <LeadSummaryCards summary={summary} dealerSummary={dealerSummary} />,
    );

    expect(dealerSummary.assignedLeads + dealerSummary.unavailableLeads).toBe(summary.totalLeads);
    expect(html).toContain("md:grid-cols-3");
    expect(html).toContain("Total de Leads nas concessionárias");
    expect(html).toContain("Leads em qualificação / sem cobertura de PDV");
    expect(html.indexOf("Total de Leads nas concessionárias")).toBeLessThan(html.indexOf("Leads em qualificação"));
    expect(html).toContain("7.041");
    expect(html).toContain("1.039");
    expect(html).toContain("87,14% do total");
    expect(html).toContain("12,86% do total");
    expect(html).not.toContain("1.039 em qualificação");
    expect(html).not.toContain("Canal principal");
    expect(html).not.toContain("Canais ativos");
    expect(html).not.toContain("Média diária");
  });

  it("mantém o novo card integralmente em inglês para o locale en-US do usuário mgmotor", () => {
    const summary = {
      totalLeads: 8080,
      dailyAverage: 384.76,
      primaryChannel: "Site",
      primaryChannelLeads: 3866,
      activeChannels: 7,
      calendarDays: 21,
    };
    const dealerSummary = {
      validDealers: 38,
      assignedLeads: 7041,
      unavailableLeads: 1039,
      assignedSharePercent: 87.14,
      dealersReceivingOnLatestDay: 35,
      latestDay: "2026-07-21",
    };

    const html = renderToStaticMarkup(
      <LeadSummaryCards summary={summary} dealerSummary={dealerSummary} locale="en-US" />,
    );

    expect(html).toContain("Total Leads in dealerships");
    expect(html).toContain("Leads in qualification / no POS coverage");
    expect(html).toContain("7,041");
    expect(html).toContain("1,039");
    expect(html).toContain("87.14% of total");
    expect(html).toContain("12.86% of total");
    expect(html).not.toContain("Leads em qualificação");
    expect(html).not.toContain("do total");
    expect(html).not.toContain("Top channel");
    expect(html).not.toContain("Active channels");
    expect(html).not.toContain("Daily average");
  });

  it("formata o total reconciliado exibido acima de cada barra diária", () => {
    expect(formatDailyBarTotal(265, "pt-BR")).toBe("265");
    expect(formatDailyBarTotal(1234, "pt-BR")).toBe("1.234");
    expect(formatDailyBarTotal(1234, "en-US")).toBe("1,234");
    expect(formatDailyBarTotal(0, "pt-BR")).toBe("0");
    expect(formatDailyBarTotal("indisponível", "pt-BR")).toBe("");
  });

  it("mantém a exportação visível, bilíngue e com estado de carregamento", () => {
    const pt = renderToStaticMarkup(
      <LeadsExportButton isPending={false} onExport={() => undefined} />,
    );
    const en = renderToStaticMarkup(
      <LeadsExportButton locale="en-US" isPending={false} onExport={() => undefined} />,
    );
    const pending = renderToStaticMarkup(
      <LeadsExportButton isPending onExport={() => undefined} />,
    );

    expect(pt).toContain("Exportar base");
    expect(en).toContain("Export database");
    expect(pending).toContain("Gerando Excel...");
    expect(pending).toContain("disabled");
  });

  it("oculta todas as ações mutáveis no modo somente leitura de mgsales", () => {
    expect(resolveLeadsActionVisibility({ readOnly: true, canImportLeads: true })).toEqual({
      canExport: false,
      canImport: false,
      canEditGoal: false,
    });
    expect(resolveLeadsActionVisibility({ readOnly: false, canImportLeads: false })).toEqual({
      canExport: true,
      canImport: false,
      canEditGoal: true,
    });
  });

  it("identifica o período filtrado pelo campo Data Corrigida", () => {
    const html = renderToStaticMarkup(
      <LeadFilterIdentity dateFrom="2026-07-01" dateTo="2026-07-19" />,
    );

    expect(html).toContain("Data Corrigida");
    expect(html).toContain("01/07/2026");
    expect(html).toContain("19/07/2026");
  });

  it("explica o estado vazio sem fabricar classificação", () => {
    const html = renderToStaticMarkup(
      <LeadEmptyState
        title="Nenhuma concessionária encontrada"
        description="Ajuste a busca para voltar à lista auditável."
      />,
    );

    expect(html).toContain("Nenhuma concessionária encontrada");
    expect(html).toContain("lista auditável");
  });

  it("renderiza estados explícitos de carregamento, erro e ausência de dados", () => {
    const loading = renderToStaticMarkup(<LeadsLoading />);
    const error = renderToStaticMarkup(<LeadsError message="Falha controlada da consulta." onRetry={() => undefined} />);
    const empty = renderToStaticMarkup(<LeadEmptyState title="Nenhum Lead no período" description="Selecione outro intervalo." />);

    expect(loading).toContain("Consolidando os Leads do período");
    expect(error).toContain("Não foi possível carregar os Leads");
    expect(error).toContain("Falha controlada da consulta");
    expect(error).toContain("Tentar novamente");
    expect(empty).toContain("Nenhum Lead no período");
  });

  it("modela a sequência completa de atualização CSV sem persistir dados de teste", () => {
    expect(resolveCsvImportPhase({ isPreviewing: false, isImporting: false, hasPreview: false, success: null, error: null })).toBe("IDLE");
    expect(resolveCsvImportPhase({ isPreviewing: true, isImporting: false, hasPreview: false, success: null, error: null })).toBe("PREVIEWING");
    expect(resolveCsvImportPhase({ isPreviewing: false, isImporting: false, hasPreview: true, success: null, error: null })).toBe("READY");
    expect(resolveCsvImportPhase({ isPreviewing: false, isImporting: true, hasPreview: true, success: null, error: null })).toBe("IMPORTING");
    expect(resolveCsvImportPhase({ isPreviewing: false, isImporting: false, hasPreview: false, success: "Arquivo processado.", error: null })).toBe("SUCCESS");
    expect(resolveCsvImportPhase({ isPreviewing: false, isImporting: false, hasPreview: false, success: null, error: "Arquivo inválido." })).toBe("ERROR");
  });

  it("atualiza também a Eficiência de vendas após importações novas ou idempotentes", async () => {
    const invalidated: string[] = [];

    await invalidateLeadImportCaches({
      analytics: async () => invalidated.push("analytics"),
      bounds: async () => invalidated.push("bounds"),
      importHistory: async () => invalidated.push("importHistory"),
      weeklySalesMetrics: async () => invalidated.push("weeklySalesMetrics"),
    });

    expect(invalidated).toEqual([
      "analytics",
      "bounds",
      "importHistory",
      "weeklySalesMetrics",
    ]);
  });

  it("expõe progresso e resultados do fluxo CSV sem depender de persistência", () => {
    const result = {
      fileName: "leads-julho.csv",
      fileHash: "abc123",
      fileSizeBytes: 4096,
      rowsTotal: 100,
      validRows: 98,
      invalidRows: 2,
      fallbackDateUsed: "2026-07-20",
      fallbackDateCount: 2,
      uniqueValidRows: 95,
      duplicateRowsWithinFile: 3,
      duplicateRowsByChannel: [
        { channel: "Meta", withinFile: 2, alreadyStored: 1, total: 3 },
        { channel: "Site", withinFile: 1, alreadyStored: 2, total: 3 },
      ],
      rowsAlreadyStored: 3,
      rowsReadyToInsert: 92,
      dateFrom: "2026-07-01",
      dateTo: "2026-07-20",
      channels: [],
      models: [],
      regions: [],
      errors: [],
      alreadyImported: false,
      existingImport: null,
      importId: 7,
      status: "COMPLETED" as const,
      rowsInserted: 92,
      rowsSkipped: 6,
      rowsInvalid: 2,
      idempotent: false,
      fileUrl: "https://storage.example/leads-julho.csv",
      importedAt: 1_700_000_000_000,
    };
    const previewing = renderToStaticMarkup(<CsvImportFeedback isPreviewing isImporting={false} success={null} error={null} />);
    const importing = renderToStaticMarkup(<CsvImportFeedback isPreviewing={false} isImporting success={null} error={null} />);
    const success = renderToStaticMarkup(<CsvImportFeedback isPreviewing={false} isImporting={false} success="92 linhas de Leads inseridas com sucesso." result={result} error={null} />);
    const failure = renderToStaticMarkup(<CsvImportFeedback isPreviewing={false} isImporting={false} success={null} error="Arquivo inválido." />);

    expect(previewing).toContain("Pré-validando o arquivo CSV");
    expect(importing).toContain("Importando Leads únicos e descartando duplicidades exatas");
    expect(success).toContain("92 linhas de Leads inseridas com sucesso");
    expect(success).toContain("Duplicações por canal");
    expect(success).toContain("No CSV");
    expect(success).toContain("Já na base");
    expect(success).toContain("Meta");
    expect(success).toContain("Site");
    expect(failure).toContain("Arquivo inválido");
  });

  it("resume linhas válidas, repetições, inválidas e a aplicação de D-1 antes da importação", () => {
    const preview = {
      fileName: "leads-julho.csv",
      fileHash: "abc123",
      fileSizeBytes: 4096,
      rowsTotal: 100,
      validRows: 98,
      invalidRows: 2,
      uniqueValidRows: 95,
      duplicateRowsWithinFile: 3,
      duplicateRowsByChannel: [
        { channel: "Meta", withinFile: 2, alreadyStored: 1, total: 3 },
        { channel: "Site", withinFile: 1, alreadyStored: 2, total: 3 },
      ],
      rowsAlreadyStored: 3,
      rowsReadyToInsert: 92,
      dateFrom: "2026-07-01",
      dateTo: "2026-07-20",
      fallbackDateUsed: "2026-07-20",
      fallbackDateCount: 2,
      channels: [],
      models: [],
      regions: [],
      errors: [{ rowNumber: 14, message: "Canal obrigatório ausente." }],
      alreadyImported: false,
      existingImport: null,
    };
    const html = renderToStaticMarkup(<CsvPreviewSummary preview={preview} />);
    const english = renderToStaticMarkup(<CsvPreviewSummary preview={preview} locale="en-US" />);

    expect(html).toContain("leads-julho.csv");
    expect(html).toContain("Linhas lidas");
    expect(html).toContain("100");
    expect(html).toContain("Linhas válidas");
    expect(html).toContain("98");
    expect(html).toContain("Duplicadas (descartadas)");
    expect(html).toContain("6");
    expect(html).toContain("Duplicações por canal");
    expect(html).toContain("No CSV");
    expect(html).toContain("Já na base");
    expect(html).toContain("Meta");
    expect(html).toContain("Site");
    expect(html).toContain("Duplicidades exatas serão descartadas automaticamente");
    expect(html).toContain("primeira ocorrência válida");
    expect(html).toContain("Inválidas");
    expect(html).toContain("Linha 14");
    expect(html).toContain("Canal obrigatório ausente");
    expect(html).toContain("2 linha(s) sem Data Corrigida");
    expect(html).toContain("20/07/2026");
    expect(html).toContain("valor original vazio continuará preservado");
    expect(english).toContain("2 row(s) without Corrected Date");
    expect(english).toContain("original blank value will remain preserved");
    expect(english).toContain("Duplicates by channel");
  });

  it("classifica canal não reconhecido sem ocultar duplicações", () => {
    const html = renderToStaticMarkup(
      <CsvDuplicateChannelBreakdown
        items={[{ channel: "INDISPONIVEL", withinFile: 1, alreadyStored: 2, total: 3 }]}
      />,
    );

    expect(html).toContain("Duplicações por canal");
    expect(html).toContain("Indisponível");
    expect(html).toContain("3 duplicada(s)");
  });
});
