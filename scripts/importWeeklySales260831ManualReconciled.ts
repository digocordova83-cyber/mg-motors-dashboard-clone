import { basename } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

import { and, desc, eq } from "drizzle-orm";

import { weeklySalesImports, weeklySalesRecords } from "../drizzle/schema";
import { getDb } from "../server/db";
import { buildWeeklySalesPreviewFromPdfExtraction } from "../server/weeklySalesPdf";
import { importWeeklySalesCsv } from "../server/weeklySalesService";
import type { WeeklySalesWeekMetrics } from "../server/weeklySalesCsv";

const pdfPath = "/home/ubuntu/upload/pasted_file_44boJh_260831DailySalesPlanningReport.pdf";
const outputPath = "/tmp/mtd-retail-order-20260831-manual.json";
const competence = "2026-08";

const week5ByName = new Map<string, WeeklySalesWeekMetrics>([
  ["R01", { target: 275, retail: 416, achievementPercent: 151.3 }],
  ["AUTOBRAND RECIFE", { target: 7, retail: 7, achievementPercent: 100 }],
  ["AUTOMEC SOROCABA", { target: 7, retail: 5, achievementPercent: 71.4 }],
  ["BALTIC BARUERI", { target: 16, retail: 20, achievementPercent: 125 }],
  ["DAO SILVEIRA NATAL", { target: 11, retail: 27, achievementPercent: 245.5 }],
  ["EUROVILLE BELO HORIZONTE", { target: 32, retail: 50, achievementPercent: 156.3 }],
  ["HG ARACAJU", { target: 7, retail: 7, achievementPercent: 100 }],
  ["IGUATU FORTALEZA", { target: 19, retail: 16, achievementPercent: 84.2 }],
  ["INDIANA SALVADOR", { target: 27, retail: 41, achievementPercent: 151.9 }],
  ["JRCA MACEIÓ", { target: 13, retail: 40, achievementPercent: 307.7 }],
  ["NISCAR JOAO PESSOA", { target: 7, retail: 23, achievementPercent: 328.6 }],
  ["ONNE RIBEIRAO", { target: 17, retail: 19, achievementPercent: 111.8 }],
  ["ONNE RIO PRETO", { target: 13, retail: 15, achievementPercent: 115.4 }],
  ["SAVOL SÃO CAETANO", { target: 22, retail: 43, achievementPercent: 195.5 }],
  ["SINAL AV EUROPA", { target: 8, retail: 16, achievementPercent: 200 }],
  ["STEFANINI CAMPINAS", { target: 23, retail: 40, achievementPercent: 173.9 }],
  ["STEFANINI PIRACICABA", { target: 16, retail: 14, achievementPercent: 87.5 }],
  ["TORIBA SÃO PAULO", { target: 30, retail: 33, achievementPercent: 110 }],
  ["R02", { target: 218, retail: 244, achievementPercent: 111.9 }],
  ["BARIGUI CURITIBA", { target: 34, retail: 20, achievementPercent: 58.8 }],
  ["BARIGUI FLORIANOPOLIS", { target: 26, retail: 31, achievementPercent: 119.2 }],
  ["DRSUL PORTO ALEGRE", { target: 37, retail: 53, achievementPercent: 143.2 }],
  ["LA FONTAINE JOINVILLE", { target: 7, retail: 13, achievementPercent: 185.7 }],
  ["ORVEL VITÓRIA", { target: 17, retail: 4, achievementPercent: 23.5 }],
  ["POTENZA RIO DE JANEIRO", { target: 32, retail: 34, achievementPercent: 106.3 }],
  ["TECAR BRASÍLIA", { target: 47, retail: 63, achievementPercent: 134 }],
  ["TECAR GOIÂNIA", { target: 8, retail: 16, achievementPercent: 200 }],
  ["VEGA BELÉM", { target: 10, retail: 10, achievementPercent: 100 }],
  ["Total", { target: 493, retail: 660, achievementPercent: 133.9 }],
]);

function metric(
  target: unknown,
  retail: unknown,
  achievementPercent: unknown,
): WeeklySalesWeekMetrics {
  return {
    target: target === null ? null : Number(target),
    retail: retail === null ? null : Number(retail),
    achievementPercent: achievementPercent === null ? null : Number(achievementPercent),
  };
}

async function main() {
  const [bytes, db] = await Promise.all([readFile(pdfPath), getDb()]);
  const [previousImport] = await db
    .select()
    .from(weeklySalesImports)
    .where(
      and(
        eq(weeklySalesImports.competence, competence),
        eq(weeklySalesImports.status, "COMPLETED"),
      ),
    )
    .orderBy(desc(weeklySalesImports.createdAt))
    .limit(1);

  if (!previousImport) throw new Error("Não há importação anterior conciliada para reaproveitar W1–W4.");

  const previousRows = await db
    .select()
    .from(weeklySalesRecords)
    .where(eq(weeklySalesRecords.importId, previousImport.id))
    .orderBy(weeklySalesRecords.sourceRowNumber);

  if (previousRows.length !== 29) {
    throw new Error(`A importação anterior deveria ter 29 linhas, mas retornou ${previousRows.length}.`);
  }

  const missingNames = previousRows
    .map(row => row.sourceName)
    .filter(name => !week5ByName.has(name));
  if (missingNames.length) {
    throw new Error(`A transcrição W5 não contém: ${missingNames.join(", ")}.`);
  }

  const extraction = {
    tableTitle: "Weekly Target Achievement - Retail",
    rows: previousRows.map(row => ({
      name: row.sourceName,
      weeks: {
        "1": metric(row.week1Target, row.week1Retail, row.week1Achievement),
        "2": metric(row.week2Target, row.week2Retail, row.week2Achievement),
        "3": metric(row.week3Target, row.week3Retail, row.week3Achievement),
        "4": metric(row.week4Target, row.week4Retail, row.week4Achievement),
        "5": week5ByName.get(row.sourceName)!,
      },
    })),
  };

  const preview = buildWeeklySalesPreviewFromPdfExtraction(bytes, extraction);
  if (preview.errors.length || !preview.summary.reconciliationPassed) {
    throw new Error(
      `A prévia manual não reconciliou: ${[...preview.errors, ...preview.warnings].join(" | ")}`,
    );
  }
  if (preview.summary.referenceWeek !== 5 || preview.summary.referenceReportedSalesTotal !== 660) {
    throw new Error(
      `Esperado W5 e 660 MTD Retail Orders; recebido W${preview.summary.referenceWeek} e ${preview.summary.referenceReportedSalesTotal}.`,
    );
  }

  const result = await importWeeklySalesCsv({
    fileName: basename(pdfPath),
    bytes,
    competence,
    competencePolicy: "EXPLICIT",
    parsedOverride: preview,
    expectedFileHash: preview.fileHash,
    declaredMimeType: "application/pdf",
    actor: "system:manual-pdf-visual-reconciliation",
  });

  const audit = {
    importedAt: new Date().toISOString(),
    competence,
    sourceFile: basename(pdfPath),
    sourceMethod: "Visual transcription of Weekly Target Achievement - Retail page 2; W1–W4 from latest reconciled import.",
    validatedSalesTotal: preview.summary.referenceReportedSalesTotal,
    validatedTarget: 493,
    preview: {
      errors: preview.errors,
      warnings: preview.warnings,
      summary: preview.summary,
    },
    result,
  };
  await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(audit, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
