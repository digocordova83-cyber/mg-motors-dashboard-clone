import { writeFile } from "node:fs/promises";

import {
  getWeeklySalesImportHistory,
  getWeeklySalesMetrics,
} from "../server/weeklySalesService";

const outputPath = "/home/ubuntu/mg-motors-dashboard-clone/validation-weekly-sales-260803.json";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const [history, july, august] = await Promise.all([
    getWeeklySalesImportHistory(100),
    getWeeklySalesMetrics("2026-07"),
    getWeeklySalesMetrics("2026-08"),
  ]);
  const julyHistory = history.filter(item => item.competence === "2026-07");
  const latestJuly = julyHistory.find(item => item.status === "COMPLETED");
  const julyFileNames = julyHistory.map(item => item.fileName);
  const unmatchedDealers = july.dealers
    .filter(dealer => dealer.matchStatus === "UNMATCHED")
    .map(dealer => dealer.sourceName)
    .sort((left, right) => left.localeCompare(right, "pt-BR"));

  assert(july.import?.id === 180001, `O dashboard selecionou o lote ${july.import?.id ?? "nulo"}, não o 180001.`);
  assert(july.import.fileName === "260803_Daily_Sales_Planning_Report.pdf", "O arquivo mais recente de julho está incorreto.");
  assert(july.referenceWeek === 5, "A referência deveria permanecer na semana 5.");
  assert(july.summary.totalSales === 606, `O total de vendas deveria ser 606, mas foi ${july.summary.totalSales}.`);
  assert(july.summary.matchedSales === 588, `As vendas correspondidas deveriam ser 588, mas foram ${july.summary.matchedSales}.`);
  assert(july.summary.unmatchedSales === 18, `As vendas não correspondidas deveriam ser 18, mas foram ${july.summary.unmatchedSales}.`);
  assert(july.summary.dealers === 23, `O total de concessionárias deveria ser 23, mas foi ${july.summary.dealers}.`);
  assert(july.summary.matchedDealers === 21, "Deveriam existir 21 concessionárias correspondidas.");
  assert(july.summary.unmatchedDealers === 2, "Deveriam existir 2 concessionárias não correspondidas.");
  assert(
    JSON.stringify(unmatchedDealers) === JSON.stringify(["AUTOBRAND RECIFE", "HG ARACAJU"]),
    `Não correspondidas inesperadas: ${unmatchedDealers.join(", ")}.`,
  );
  assert(latestJuly?.id === 180001, "O histórico não posicionou o novo lote como fechamento mais recente de julho.");
  assert(julyFileNames.includes("260731_Daily_Sales_Planning_Report.pdf"), "O fechamento anterior de 31/07 não foi preservado.");
  assert(julyHistory.length >= 7, `Esperava ao menos 7 lotes de julho, mas encontrei ${julyHistory.length}.`);
  assert(august.import === null, "Agosto recebeu indevidamente um lote de julho.");

  const audit = {
    validatedAt: new Date().toISOString(),
    july: {
      competence: july.competence,
      dateFrom: july.dateFrom,
      dateTo: july.dateTo,
      referenceWeek: july.referenceWeek,
      import: july.import,
      summary: july.summary,
      unmatchedDealers,
      historyCount: julyHistory.length,
      previousClosingPreserved: true,
    },
    august: {
      competence: august.competence,
      import: august.import,
      summary: august.summary,
    },
    checks: {
      newJulyClosingSelected: true,
      previousJulyHistoryPreserved: true,
      automaticAugustRuleUnchanged: true,
      totalsReconciled: true,
    },
  };
  await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(audit, null, 2));
  process.exit(0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
