import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock, parseWeeklySalesPdfMock, storagePutMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  parseWeeklySalesPdfMock: vi.fn(),
  storagePutMock: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: getDbMock }));
vi.mock("./storage", () => ({ storagePut: storagePutMock }));
vi.mock("./weeklySalesPdf", () => ({ parseWeeklySalesPdf: parseWeeklySalesPdfMock }));

import type { WeeklySalesCsvPreview, WeeklySalesWeekMetrics } from "./weeklySalesCsv";
import { importWeeklySalesCsv } from "./weeklySalesService";

function metric(
  target: number,
  retail: number | null,
  achievementPercent: number | null,
): WeeklySalesWeekMetrics {
  return { target, retail, achievementPercent };
}

function weeks(retail: number): Record<string, WeeklySalesWeekMetrics> {
  return {
    "1": metric(1, retail, retail * 100),
    "2": metric(2, retail, retail * 50),
    "3": metric(3, retail, Number(((retail / 3) * 100).toFixed(1))),
    "4": metric(4, retail, retail * 25),
    "5": metric(5, retail, retail * 20),
  };
}

const parsedPdf: WeeklySalesCsvPreview = {
  fileHash: "pdf-retail-hash",
  rows: [
    {
      sourceRowNumber: 2,
      rowType: "REGION",
      sourceName: "R01",
      sourceKey: "R01",
      canonicalDealer: null,
      canonicalDealerKey: null,
      explicitMapping: false,
      recordHash: "region-hash",
      tokens: [],
      referenceRetail: 2,
      referenceAchievementPercent: 40,
      weeks: weeks(2),
    },
    {
      sourceRowNumber: 3,
      rowType: "DEALER",
      sourceName: "BALTIC BARUERI",
      sourceKey: "BALTIC BARUERI",
      canonicalDealer: "Baltic Shopping Tamboré",
      canonicalDealerKey: "BALTIC SHOPPING TAMBORE",
      explicitMapping: true,
      recordHash: "dealer-hash",
      tokens: [],
      referenceRetail: 2,
      referenceAchievementPercent: 40,
      weeks: weeks(2),
    },
    {
      sourceRowNumber: 4,
      rowType: "TOTAL",
      sourceName: "Total",
      sourceKey: "TOTAL",
      canonicalDealer: null,
      canonicalDealerKey: null,
      explicitMapping: false,
      recordHash: "total-hash",
      tokens: [],
      referenceRetail: 2,
      referenceAchievementPercent: 40,
      weeks: weeks(2),
    },
  ],
  errors: [],
  warnings: [],
  summary: {
    rowsTotal: 3,
    dealerRows: 1,
    regionRows: 1,
    totalRows: 1,
    referenceWeek: 5,
    dealersWithoutReferenceSales: 0,
    referenceDealerSalesTotal: 2,
    referenceRegionSalesTotal: 2,
    referenceReportedSalesTotal: 2,
    dealersWithoutWeek4Sales: 0,
    week4DealerSalesTotal: 2,
    week4RegionSalesTotal: 2,
    week4ReportedSalesTotal: 2,
    reconciliationPassed: true,
  },
};

describe("importação semanal por PDF", () => {
  beforeEach(() => {
    getDbMock.mockReset();
    parseWeeklySalesPdfMock.mockReset();
    storagePutMock.mockReset();
  });

  it("grava o PDF uma vez e retorna o mesmo lote sem reenviar nem duplicar linhas", async () => {
    const bytes = Buffer.from("%PDF-1.7\nweekly retail", "utf8");
    const processingImport = { id: 77, status: "PROCESSING" as const };
    const completedImport = {
      id: 77,
      status: "COMPLETED" as const,
      fileUrl: "/manus-storage/weekly-sales/retail.pdf",
      createdAt: 1_700_000_000_000,
      completedAt: 1_700_000_001_000,
    };

    const importValues = vi.fn().mockResolvedValue(undefined);
    const insert = vi.fn().mockReturnValue({ values: importValues });
    const select = vi
      .fn()
      .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: async () => [] }) }) })
      .mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: async () => [processingImport] }) }),
      })
      .mockReturnValueOnce({
        from: () => ({ where: () => ({ limit: async () => [completedImport] }) }),
      });
    const selectDistinct = vi.fn().mockReturnValue({
      from: async () => [{ dealerName: "Baltic Shopping Tamboré" }],
    });

    const recordValues = vi.fn().mockResolvedValue(undefined);
    const txInsert = vi.fn().mockReturnValue({ values: recordValues });
    const txDeleteWhere = vi.fn().mockResolvedValue(undefined);
    const txDelete = vi.fn().mockReturnValue({ where: txDeleteWhere });
    const txSelect = vi.fn().mockReturnValue({
      from: () => ({ where: async () => [{ count: 3 }] }),
    });
    const txUpdateWhere = vi.fn().mockResolvedValue(undefined);
    const txUpdateSet = vi.fn().mockReturnValue({ where: txUpdateWhere });
    const txUpdate = vi.fn().mockReturnValue({ set: txUpdateSet });
    const transaction = vi.fn(async callback =>
      callback({ insert: txInsert, delete: txDelete, select: txSelect, update: txUpdate }),
    );

    getDbMock.mockResolvedValue({ select, selectDistinct, insert, transaction });
    parseWeeklySalesPdfMock.mockResolvedValue(parsedPdf);
    storagePutMock.mockResolvedValue({
      key: "weekly-sales/2026-07/pdf-retail-hash/retail.pdf",
      url: "/manus-storage/weekly-sales/retail.pdf",
    });

    const first = await importWeeklySalesCsv({
      fileName: "Daily Sales Planning Report.PDF",
      bytes,
      competence: "2026-07",
      actor: "admin@mgmotors.com.br",
      expectedFileHash: parsedPdf.fileHash,
    });
    const repeated = await importWeeklySalesCsv({
      fileName: "Daily Sales Planning Report.PDF",
      bytes,
      competence: "2026-07",
      actor: "admin@mgmotors.com.br",
      expectedFileHash: parsedPdf.fileHash,
    });

    expect(first).toEqual(
      expect.objectContaining({
        importId: 77,
        status: "COMPLETED",
        idempotent: false,
        rowsInserted: 3,
        fileName: "Daily_Sales_Planning_Report.PDF",
      }),
    );
    expect(repeated).toEqual(
      expect.objectContaining({
        importId: 77,
        status: "COMPLETED",
        idempotent: true,
        rowsInserted: 0,
      }),
    );
    expect(recordValues).toHaveBeenCalledOnce();
    expect(recordValues.mock.calls[0]?.[0]).toHaveLength(3);
    expect(importValues).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceWeek: 5,
        referenceDealerSalesTotal: 2,
        referenceRegionSalesTotal: 2,
        referenceReportedSalesTotal: 2,
      }),
    );
    expect(txUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({ status: "COMPLETED", rowsInserted: 3 }),
    );
    expect(storagePutMock).toHaveBeenCalledOnce();
    expect(transaction).toHaveBeenCalledOnce();
    expect(parseWeeklySalesPdfMock).toHaveBeenCalledTimes(2);
  });
});
