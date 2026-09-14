import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { parseWeeklySalesXlsx } from "./weeklySalesXlsx";

type WorkbookOptions = {
  dailyMtdRetail?: number;
  includeRetailSheet?: boolean;
  week6Retail?: number;
};

async function buildWorkbook(options: WorkbookOptions = {}): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const daily = workbook.addWorksheet("DAILY_FUP");
  daily.addRow([null, "Current Month", null, "Registration Target", "MTD Registration", "Retail", "Test Drive", "Direct Sales", null, "Retail Target", "MTD Retail", null, "WS Target", "MTD WS"]);
  daily.addRow([null, "Volume", null, 20, 10, 8, 1, 1, null, 20, options.dailyMtdRetail ?? 12, null, 15, 9]);

  if (options.includeRetailSheet !== false) {
    const sheet = workbook.addWorksheet("WEEKLY_RET");
    sheet.addRow([
      null,
      "REGION",
      "CUSTOMER",
      "CUSTOMER_NAME",
      "TARGET",
      "W1_TGT",
      "%W1_Ret",
      "W1_Retail",
      "%W1_Others",
      "W2_TGT",
      "%W2_Ret",
      "W2_Retail",
      "%W2_Others",
      "W3_TGT",
      "%W3_Ret",
      "W3_Retail",
      "%W3_Others",
      "W4_TGT",
      "%W4_Ret",
      "W4_Retail",
      "%W4_Others",
      "W5_TGT",
      "%W5_Ret",
      "W5_Retail",
      "%W5_Others",
      "W6_TGT",
      "%W6_Ret",
      "W6_Retail",
      "%W6_Others",
    ]);
    sheet.addRow([null, "R01", 1, "DEALER A", 10, 2, 100, 2, 100, 4, 125, 5, 100, 6, 100, 6, 100, 8, 0, 0, null, 10, 0, 0, null, 0, 0, options.week6Retail ?? 0, null]);
    sheet.addRow([null, "R02", 2, "DEALER B", 10, 2, 50, 1, 100, 4, 75, 3, 100, 6, 100, 6, 100, 8, 0, 0, null, 10, 0, 0, null, 0, 0, 0, null]);
    sheet.addRow([null, null, null, null, 20, 4, 75, 3, 100, 8, 100, 8, 100, 12, 100, 12, 100, 16, 0, 0, null, 20, 0, 0, null, 0, 0, options.week6Retail ?? 0, null]);
  }

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

describe("parser XLSX do Daily Sales FUP", () => {
  it("usa WEEKLY_RET, reconcilia regiões e ignora semanas futuras zeradas", async () => {
    const preview = await parseWeeklySalesXlsx(await buildWorkbook());

    expect(preview.errors).toEqual([]);
    expect(preview.summary).toMatchObject({
      dealerRows: 2,
      regionRows: 2,
      totalRows: 1,
      referenceWeek: 3,
      referenceDealerSalesTotal: 12,
      referenceRegionSalesTotal: 12,
      referenceReportedSalesTotal: 12,
      reconciliationPassed: true,
    });
    expect(preview.rows.find(row => row.rowType === "TOTAL")?.weeks["4"]?.retail).toBeNull();
  });

  it("rejeita divergência entre DAILY_FUP e o TOTAL de WEEKLY_RET", async () => {
    const preview = await parseWeeklySalesXlsx(await buildWorkbook({ dailyMtdRetail: 13 }));

    expect(preview.errors).not.toEqual([]);
    expect(preview.errors.join(" ")).toContain("Nenhuma semana de WEEKLY_RET reconcilia");
  });

  it("rejeita arquivo sem a aba WEEKLY_RET", async () => {
    await expect(
      parseWeeklySalesXlsx(await buildWorkbook({ includeRetailSheet: false })),
    ).rejects.toThrow("precisa conter a aba WEEKLY_RET");
  });

  it("rejeita dados preenchidos na Semana 6 enquanto o contrato suporta cinco semanas", async () => {
    const preview = await parseWeeklySalesXlsx(await buildWorkbook({ week6Retail: 1 }));

    expect(preview.errors).not.toEqual([]);
    expect(preview.errors.join(" ")).toContain("Semana 6 possui dados");
  });
});
