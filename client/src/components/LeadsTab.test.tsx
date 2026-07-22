import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CsvImportFeedback,
  CsvPreviewSummary,
  DealerAudit,
  LeadEmptyState,
  LeadFilterIdentity,
  LeadSummaryCards,
  LeadsError,
  formatDailyBarTotal,
  formatDealerLabel,
  LeadsLoading,
  resolveCsvImportPhase,
} from "./LeadsTab";

describe("interface de Leads", () => {
  it("exibe Leads em qualificação para concessionárias sem identificação e placeholders", () => {
    for (const value of ["Indisponível", "Unavailable", "Outros", "Outro", "N/A", "Não informado", "Sem concessionária", "  "]) {
      expect(formatDealerLabel(value)).toBe("Leads em qualificação");
    }
    expect(formatDealerLabel("BARIGUI - CURITIBA")).toBe("BARIGUI - CURITIBA");
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

  it("exibe no topo o total de Leads nas concessionárias reconciliado com os Leads em qualificação", () => {
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
    expect(html).toContain("Total de Leads nas concessionárias");
    expect(html).toContain("7.041");
    expect(html).toContain("1.039 em qualificação");
    expect(html).toContain("87,14% do total");
  });

  it("formata o total reconciliado exibido acima de cada barra diária", () => {
    expect(formatDailyBarTotal(265, "pt-BR")).toBe("265");
    expect(formatDailyBarTotal(1234, "pt-BR")).toBe("1.234");
    expect(formatDailyBarTotal(1234, "en-US")).toBe("1,234");
    expect(formatDailyBarTotal(0, "pt-BR")).toBe("0");
    expect(formatDailyBarTotal("indisponível", "pt-BR")).toBe("");
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

  it("expõe progresso e resultados do fluxo CSV sem depender de persistência", () => {
    const previewing = renderToStaticMarkup(<CsvImportFeedback isPreviewing isImporting={false} success={null} error={null} />);
    const importing = renderToStaticMarkup(<CsvImportFeedback isPreviewing={false} isImporting success={null} error={null} />);
    const success = renderToStaticMarkup(<CsvImportFeedback isPreviewing={false} isImporting={false} success="Arquivo já processado: nenhuma linha foi inserida novamente." error={null} />);
    const failure = renderToStaticMarkup(<CsvImportFeedback isPreviewing={false} isImporting={false} success={null} error="Arquivo inválido." />);

    expect(previewing).toContain("Pré-validando o arquivo CSV");
    expect(importing).toContain("Importando Leads únicos e descartando duplicidades exatas");
    expect(success).toContain("Arquivo já processado");
    expect(success).toContain("nenhuma linha foi inserida novamente");
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
      rowsAlreadyStored: 0,
      rowsReadyToInsert: 95,
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
    expect(html).toContain("3");
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
  });
});
