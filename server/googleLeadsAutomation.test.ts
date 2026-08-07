import { describe, expect, it, vi } from "vitest";
import { writeFile } from "node:fs/promises";
import {
  executeGoogleLeadsAutomation,
  formatGoogleLeadsAutomationReport,
  type GoogleLeadsAutomationResult,
  type GoogleLeadsConsolidationReport,
} from "./googleLeadsAutomation";
import type { LeadCsvCurrentBaseAnalysis, LeadCsvImportResult } from "./leadsImportService";

const consolidation: GoogleLeadsConsolidationReport = {
  sourceFile: "/tmp/source.xlsx",
  masterCsv: "/tmp/master.csv",
  masterXlsx: "/tmp/master.xlsx",
  importCsv: "/tmp/import.csv",
  rowsSourceTotal: 12,
  rowsMasterOutput: 11,
  rowsImportReady: 11,
  rowsExcludedFromImport: 1,
  issuesTotal: 1,
  rowsWithIssues: 1,
  channels: { Site: 5, Meta: 4, UOL: 2 },
  models: { MG4: 7, MGS5: 4 },
  sheets: [],
  issues: [
    {
      sheet: "Site",
      source_row: 9,
      field: "Modelo",
      value: "outro",
      message: "Modelo fora da lista permitida.",
    },
  ],
};

function analysis(overrides: Partial<LeadCsvCurrentBaseAnalysis> = {}): LeadCsvCurrentBaseAnalysis {
  return {
    fileName: "import.csv",
    fileHash: "hash",
    fileSizeBytes: 1,
    rowsTotal: 11,
    validRows: 11,
    invalidRows: 0,
    fallbackDateUsed: "2026-08-05",
    fallbackDateCount: 0,
    uniqueValidRows: 11,
    duplicateRowsWithinFile: 0,
    duplicateRowsByChannel: [],
    rowsAlreadyStored: 10,
    rowsReadyToInsert: 1,
    dateFrom: "2026-07-01",
    dateTo: "2026-08-05",
    channels: [{ value: "Site", count: 5 }],
    models: [{ value: "MG4", count: 7 }],
    regions: [{ value: "SP", count: 7 }],
    errors: [],
    alreadyImported: false,
    existingImport: null,
    currentBaseRows: 10,
    rowsRemovedFromSource: 0,
    hasChanges: true,
    ...overrides,
  };
}

function imported(): LeadCsvImportResult {
  return {
    ...analysis(),
    importId: 81,
    status: "COMPLETED",
    rowsInserted: 11,
    rowsSkipped: 0,
    rowsInvalid: 0,
    idempotent: false,
    fileUrl: "/manus-storage/import.csv",
    importedAt: 1_700_000_000_000,
  };
}

describe("automação da planilha Google de Leads", () => {
  it("não importa quando a base já reflete integralmente a planilha", async () => {
    const runPython = vi.fn().mockImplementation(async input => {
      await writeFile(input.reportPath, "{}");
      await writeFile(consolidation.importCsv, "csv");
      return consolidation;
    });
    const analyze = vi.fn().mockResolvedValue(
      analysis({
        rowsAlreadyStored: 11,
        rowsReadyToInsert: 0,
        currentBaseRows: 11,
        hasChanges: false,
      }),
    );
    const importCsv = vi.fn();

    const result = await executeGoogleLeadsAutomation({
      outputRoot: "/tmp/google-leads-no-change",
      now: new Date("2026-08-05T12:20:00Z"),
      dependencies: { runPython, analyze, importCsv },
    });

    expect(result.status).toBe("NO_CHANGES");
    expect(result.dashboardRowsAfter).toBe(11);
    expect(importCsv).not.toHaveBeenCalled();
  });

  it("força a substituição pelo mesmo importador manual quando há mudança", async () => {
    const runPython = vi.fn().mockImplementation(async input => {
      await writeFile(input.reportPath, "{}");
      await writeFile(consolidation.importCsv, "csv");
      return consolidation;
    });
    const analyze = vi.fn().mockResolvedValue(analysis());
    const importCsv = vi.fn().mockResolvedValue(imported());

    const result = await executeGoogleLeadsAutomation({
      outputRoot: "/tmp/google-leads-updated",
      now: new Date("2026-08-05T13:20:00Z"),
      dependencies: { runPython, analyze, importCsv },
    });

    expect(result.status).toBe("UPDATED");
    expect(result.newRowsDetected).toBe(1);
    expect(result.sourceInvalidRows).toBe(1);
    expect(importCsv).toHaveBeenCalledWith(
      expect.objectContaining({
        actor: "scheduled-manus-google-leads",
        forceReplace: true,
      }),
    );
  });

  it("gera um relatório completo de duplicatas, inválidos e canais", () => {
    const report = formatGoogleLeadsAutomationReport({
      status: "UPDATED",
      runLabel: "20260805-102000",
      runDirectory: "/tmp/run",
      reportJson: "/tmp/run/report.json",
      reportMarkdown: "/tmp/run/report.md",
      masterCsv: "/tmp/run/master.csv",
      masterXlsx: "/tmp/run/master.xlsx",
      importCsv: "/tmp/run/import.csv",
      sourceRows: 12,
      masterRows: 11,
      sourceInvalidRows: 1,
      duplicateRowsWithinFile: 2,
      duplicateRowsAlreadyStored: 8,
      newRowsDetected: 1,
      rowsRemovedFromSource: 0,
      dashboardRowsBefore: 10,
      dashboardRowsAfter: 11,
      rowsInsertedByReplacement: 11,
      channelCounts: { Meta: 4, Site: 5, UOL: 2 },
      invalidIssues: consolidation.issues,
      importId: 81,
      importFileUrl: "/manus-storage/import.csv",
    } satisfies GoogleLeadsAutomationResult);

    expect(report).toContain("Dashboard atualizado");
    expect(report).toContain("Duplicatas internas do arquivo: 2");
    expect(report).toContain("Registros já existentes na base: 8");
    expect(report).toContain("Site: 5");
    expect(report).toContain("Site, linha 9");
  });
});
