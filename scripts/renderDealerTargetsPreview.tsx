import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { DealerTargetTrackingPanel } from "../client/src/components/DealerTargetTrackingPanel";
import { getWeeklySalesMetrics } from "../server/weeklySalesService";

async function main() {
  const metrics = await getWeeklySalesMetrics("2026-08", {
    dateFrom: "2026-08-01",
    dateTo: "2026-08-11",
  });
  if (!metrics.targets) throw new Error("Metas de agosto não encontradas");
  const assetsDir = path.resolve("dist/public/assets");
  const cssFile = fs.readdirSync(assetsDir).find(file => /^index-.*\.css$/.test(file));
  if (!cssFile) throw new Error("CSS de produção não encontrado");
  const content = renderToStaticMarkup(<DealerTargetTrackingPanel tracking={metrics.targets} locale="pt-BR" />);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="file://${path.join(assetsDir, cssFile)}"><title>Validação de metas</title></head><body style="margin:0;background:#060b14;color:#fff"><main style="max-width:1680px;margin:0 auto;padding:24px">${content}</main></body></html>`;
  fs.writeFileSync("/tmp/dealer-targets-preview.html", html);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
