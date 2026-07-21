import { readFileSync } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { leadImports, leads } from "../drizzle/schema";
import { getDb } from "../server/db";
import { parseLeadCsv } from "../server/leadsCsv";

const DEFAULT_SOURCE = "/home/ubuntu/upload/pasted_file_t3KaKY_LEADSMG_CONSOLIDADO_FIEL-Sheet1.csv";

type ComparableLead = {
  sourceRowNumber: number;
  recordHash: string;
  correctedDate: string;
  correctedDateRaw: string;
  sourceDateRaw: string;
  channelRaw: string;
  channel: string;
  modelRaw: string;
  model: string;
  regionRaw: string;
  region: string;
  cityRaw: string;
  city: string;
  dealerRaw: string;
  dealerName: string;
};

function assertEqual<T>(label: string, expected: T, actual: T, rowNumber: number) {
  if (expected !== actual) {
    throw new Error(`Divergência em ${label} na linha de origem ${rowNumber}.`);
  }
}

async function main() {
  const sourcePath = process.argv[2] ?? DEFAULT_SOURCE;
  const parsed = parseLeadCsv(readFileSync(sourcePath));
  const db = await getDb();
  if (!db) throw new Error("Banco indisponível");

  const [sourceImport] = await db
    .select({ id: leadImports.id, status: leadImports.status })
    .from(leadImports)
    .where(eq(leadImports.fileHash, parsed.fileHash))
    .limit(1);

  if (!sourceImport) throw new Error("Lote do CSV original não encontrado.");
  if (sourceImport.status !== "COMPLETED") throw new Error("Lote do CSV original não está concluído.");

  const stored: ComparableLead[] = await db
    .select({
      sourceRowNumber: leads.sourceRowNumber,
      recordHash: leads.recordHash,
      correctedDate: leads.correctedDate,
      correctedDateRaw: leads.correctedDateRaw,
      sourceDateRaw: leads.sourceDateRaw,
      channelRaw: leads.channelRaw,
      channel: leads.channel,
      modelRaw: leads.modelRaw,
      model: leads.model,
      regionRaw: leads.regionRaw,
      region: leads.region,
      cityRaw: leads.cityRaw,
      city: leads.city,
      dealerRaw: leads.dealerRaw,
      dealerName: leads.dealerName,
    })
    .from(leads)
    .where(eq(leads.importId, sourceImport.id))
    .orderBy(asc(leads.sourceRowNumber));

  if (parsed.invalidRows !== 0) throw new Error("O CSV original passou a conter linhas inválidas.");
  if (parsed.records.length !== stored.length) {
    throw new Error(`Quantidade divergente: CSV=${parsed.records.length}, banco=${stored.length}.`);
  }

  parsed.records.forEach((expected, index) => {
    const actual = stored[index];
    const rowNumber = expected.sourceRowNumber;
    if (!actual) throw new Error(`Linha de origem ${rowNumber} ausente no banco.`);

    assertEqual("sourceRowNumber", rowNumber, actual.sourceRowNumber, rowNumber);
    assertEqual("recordHash", expected.recordHash, actual.recordHash, rowNumber);
    assertEqual("correctedDate", expected.correctedDate, actual.correctedDate, rowNumber);
    assertEqual("correctedDateRaw", expected.correctedDateRaw, actual.correctedDateRaw, rowNumber);
    assertEqual("sourceDateRaw", expected.sourceDateRaw, actual.sourceDateRaw, rowNumber);
    assertEqual("channelRaw", expected.rawPayload.channel, actual.channelRaw, rowNumber);
    assertEqual("channel", expected.channel, actual.channel, rowNumber);
    assertEqual("modelRaw", expected.rawPayload.model, actual.modelRaw, rowNumber);
    assertEqual("model", expected.model, actual.model, rowNumber);
    assertEqual("regionRaw", expected.rawPayload.region, actual.regionRaw, rowNumber);
    assertEqual("region", expected.region, actual.region, rowNumber);
    assertEqual("cityRaw", expected.rawPayload.city, actual.cityRaw, rowNumber);
    assertEqual("city", expected.city, actual.city, rowNumber);
    assertEqual("dealerRaw", expected.rawPayload.dealer, actual.dealerRaw, rowNumber);
    assertEqual("dealerName", expected.dealerName, actual.dealerName, rowNumber);
  });

  const sequentialRows = stored.every((row, index) => row.sourceRowNumber === index + 2);
  if (!sequentialRows) throw new Error("A sequência de sourceRowNumber não corresponde à ordem do CSV.");

  console.log(
    JSON.stringify(
      {
        importId: sourceImport.id,
        fileHash: parsed.fileHash,
        rowsCompared: stored.length,
        firstSourceRowNumber: stored.at(0)?.sourceRowNumber ?? null,
        lastSourceRowNumber: stored.at(-1)?.sourceRowNumber ?? null,
        sequentialRows,
        repeatedRowsPreserved: parsed.duplicateRowsWithinFile,
        distinctContents: parsed.uniqueValidRows,
        result: "CSV e banco reconciliados linha a linha",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
