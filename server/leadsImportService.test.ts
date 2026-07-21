import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock, storagePutMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  storagePutMock: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: getDbMock }));
vi.mock("./storage", () => ({ storagePut: storagePutMock }));

import { LeadCsvValidationError } from "./leadsCsv";
import { importLeadCsv } from "./leadsImportService";

const CSV = [
  "Data,Modelo,Região/Estado,Cidade,Concessionaria,Nome,Email,Telefone,Canal,Data Corrigida,Concessionarias corrijida",
  "01/07/2026,MG4,SP,São Paulo,LOJA ORIGINAL,Cliente 1,cliente1@example.com,11999999999,Site,01/07/2026,LOJA TESTE",
  "02/07/2026,MGS5,RJ,Rio de Janeiro,LOJA ORIGINAL 2,Cliente 2,cliente2@example.com,21999999999,Meta,,LOJA TESTE 2",
  "01/07/2026,MG4,SP,São Paulo,LOJA ORIGINAL,Cliente 1,cliente1@example.com,11999999999,Site,01/07/2026,LOJA TESTE",
].join("\n");

describe("serviço de importação de Leads", () => {
  beforeEach(() => {
    getDbMock.mockReset();
    storagePutMock.mockReset();
  });

  it("conclui o caminho transacional com upload, inserts e contagens finais", async () => {
    const leadImportValues = vi.fn().mockResolvedValue(undefined);
    const leadImportInsert = vi.fn().mockReturnValue({ values: leadImportValues });
    const leadValues = vi.fn().mockResolvedValue(undefined);
    const leadIgnore = vi.fn().mockReturnValue({ values: leadValues });
    const txInsert = vi.fn().mockReturnValue({ ignore: leadIgnore });
    const txUpdateWhere = vi.fn().mockResolvedValue(undefined);
    const txUpdateSet = vi.fn().mockReturnValue({ where: txUpdateWhere });
    const txUpdate = vi.fn().mockReturnValue({ set: txUpdateSet });
    const txDeleteWhere = vi.fn().mockResolvedValue(undefined);
    const txDelete = vi.fn().mockReturnValue({ where: txDeleteWhere });
    const txSelect = vi.fn().mockReturnValue({
      from: () => ({ where: async () => [{ id: 101 }, { id: 102 }, { id: 103 }] }),
    });
    const transaction = vi.fn(async callback => callback({
      insert: txInsert,
      select: txSelect,
      update: txUpdate,
      delete: txDelete,
    }));
    const select = vi
      .fn()
      .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: async () => [] }) }) })
      .mockReturnValueOnce({ from: () => ({ where: async () => [] }) })
      .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: async () => [{ id: 7 }] }) }) });

    getDbMock.mockResolvedValue({ select, insert: leadImportInsert, transaction });
    storagePutMock.mockResolvedValue({
      key: "lead-imports/hash/leads-julho.csv",
      url: "https://storage.example/leads-julho.csv",
    });

    const result = await importLeadCsv({
      fileName: "leads-julho.csv",
      bytes: Buffer.from(CSV, "utf8"),
      actor: "auditor",
      fallbackDate: "2026-07-20",
    });

    expect(result.idempotent).toBe(false);
    expect(result.importId).toBe(7);
    expect(result.rowsInserted).toBe(3);
    expect(result.rowsSkipped).toBe(0);
    expect(result.rowsInvalid).toBe(0);
    expect(result.fallbackDateUsed).toBe("2026-07-20");
    expect(result.fallbackDateCount).toBe(1);
    expect(storagePutMock).toHaveBeenCalledOnce();
    expect(leadImportValues).toHaveBeenCalledWith(expect.objectContaining({
      status: "PROCESSING",
      rowsTotal: 3,
      rowsSkipped: 0,
      fallbackDateUsed: "2026-07-20",
      fallbackDateCount: 1,
      importedBy: "auditor",
    }));
    expect(leadValues).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        importId: 7,
        correctedDate: "2026-07-01",
        dealerName: "LOJA TESTE",
        rawPayload: expect.objectContaining({ dealer: "LOJA ORIGINAL", correctedDealer: "LOJA TESTE" }),
      }),
      expect.objectContaining({
        importId: 7,
        correctedDate: "2026-07-20",
        correctedDateRaw: "",
        dealerName: "LOJA TESTE 2",
        rawPayload: expect.objectContaining({ correctedDate: "" }),
      }),
    ]));
    const insertedRecords = leadValues.mock.calls.flatMap(([records]) => records);
    expect(insertedRecords).toHaveLength(3);
    expect(new Set(insertedRecords.map(record => record.recordHash))).toHaveProperty("size", 3);
    expect(txDeleteWhere).toHaveBeenCalledOnce();
    expect(txUpdateSet).toHaveBeenCalledWith(expect.objectContaining({
      status: "COMPLETED",
      rowsInserted: 3,
      rowsSkipped: 0,
      rowsInvalid: 0,
      fallbackDateUsed: "2026-07-20",
      fallbackDateCount: 1,
    }));
    expect(transaction).toHaveBeenCalledOnce();
  });

  it("bloqueia a importação antes do upload quando existe linha inválida", async () => {
    const invalidCsv = `${CSV}\n03/07/2026,,SP,São Paulo,LOJA ORIGINAL 3,Cliente 3,cliente3@example.com,11988888888,Site,03/07/2026,LOJA TESTE 3`;
    const select = vi
      .fn()
      .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: async () => [] }) }) })
      .mockReturnValueOnce({ from: () => ({ where: async () => [] }) });
    const insert = vi.fn();
    const transaction = vi.fn();
    getDbMock.mockResolvedValue({ select, insert, transaction });

    await expect(importLeadCsv({
      fileName: "leads-com-erro.csv",
      bytes: Buffer.from(invalidCsv, "utf8"),
      actor: "auditor",
    })).rejects.toBeInstanceOf(LeadCsvValidationError);

    expect(storagePutMock).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it("retorna o lote concluído por hash sem inserir ou reenviar o mesmo CSV", async () => {
    const completedImport = {
      id: 42,
      fileName: "leads-julho.csv",
      fileHash: "hash-resolvido-pela-consulta",
      fileSizeBytes: Buffer.byteLength(CSV),
      fileKey: "lead-imports/hash/leads-julho.csv",
      fileUrl: "https://storage.example/leads-julho.csv",
      status: "COMPLETED" as const,
      rowsTotal: 3,
      rowsInserted: 3,
      rowsSkipped: 0,
      rowsInvalid: 0,
      fallbackDateUsed: "2026-07-20",
      fallbackDateCount: 1,
      errorSummary: null,
      importedBy: "auditor",
      createdAt: 1_700_000_000_000,
      completedAt: 1_700_000_001_000,
    };

    const selectMock = vi
      .fn()
      .mockReturnValueOnce({
        from: () => ({
          where: () => ({ limit: async () => [completedImport] }),
        }),
      })
      .mockReturnValueOnce({
        from: () => ({
          where: async () => [
            { recordHash: "linha-2" },
            { recordHash: "linha-3" },
            { recordHash: "linha-4" },
          ],
        }),
      });

    getDbMock.mockResolvedValue({ select: selectMock });

    const result = await importLeadCsv({
      fileName: "leads-julho.csv",
      bytes: Buffer.from(CSV, "utf8"),
      actor: "auditor",
      fallbackDate: "2026-07-20",
    });

    expect(result.idempotent).toBe(true);
    expect(result.importId).toBe(42);
    expect(result.status).toBe("COMPLETED");
    expect(result.rowsInserted).toBe(0);
    expect(result.rowsSkipped).toBe(3);
    expect(result.fallbackDateUsed).toBe("2026-07-20");
    expect(result.fallbackDateCount).toBe(1);
    expect(result.alreadyImported).toBe(true);
    expect(storagePutMock).not.toHaveBeenCalled();
  });

  it("preserva a base anterior quando a contagem inserida diverge do CSV", async () => {
    const leadImportValues = vi.fn().mockResolvedValue(undefined);
    const leadImportInsert = vi.fn().mockReturnValue({ values: leadImportValues });
    const leadValues = vi.fn().mockResolvedValue(undefined);
    const txInsert = vi.fn().mockReturnValue({ ignore: () => ({ values: leadValues }) });
    const txDeleteWhere = vi.fn().mockResolvedValue(undefined);
    const txDelete = vi.fn().mockReturnValue({ where: txDeleteWhere });
    const txSelect = vi.fn().mockReturnValue({
      from: () => ({ where: async () => [{ id: 101 }, { id: 102 }] }),
    });
    const transaction = vi.fn(async callback => callback({
      insert: txInsert,
      select: txSelect,
      delete: txDelete,
      update: vi.fn(),
    }));
    const select = vi
      .fn()
      .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: async () => [] }) }) })
      .mockReturnValueOnce({ from: () => ({ where: async () => [] }) })
      .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: async () => [{ id: 9 }] }) }) });
    const failedWhere = vi.fn().mockResolvedValue(undefined);
    const failedSet = vi.fn().mockReturnValue({ where: failedWhere });
    const update = vi.fn().mockReturnValue({ set: failedSet });

    getDbMock.mockResolvedValue({ select, insert: leadImportInsert, transaction, update });
    storagePutMock.mockResolvedValue({
      key: "lead-imports/hash/leads-julho.csv",
      url: "https://storage.example/leads-julho.csv",
    });

    await expect(importLeadCsv({
      fileName: "leads-julho.csv",
      bytes: Buffer.from(CSV, "utf8"),
      actor: "auditor",
    })).rejects.toThrow(/Falha de integridade/);

    expect(txDeleteWhere).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });
});
