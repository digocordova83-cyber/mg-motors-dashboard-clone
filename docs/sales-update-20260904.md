# Atualização exclusiva de vendas — relatório de 04/09/2026

## Fonte e regra aplicada

O arquivo `pasted_file_KHvDme_260904DailySalesPlanningReport.pdf` foi processado somente pelo importador oficial `importDailySalesPlanningPdf.ts`, com competência explícita `2026-09`. A métrica adotada foi a tabela **Weekly Target Achievement — Retail**; valores de resumo do cabeçalho não foram usados como substituto do MTD Retail Order.

## Resultado do lote

| Métrica | Resultado |
|---|---:|
| Lote oficial | 690001 |
| Status | COMPLETED |
| Semana de referência | 1 |
| MTD Retail Orders | 48 |
| Registros persistidos | 29 |
| Linhas de concessionárias | 26 |
| Linhas de regiões | 2 |
| Linha TOTAL | 1 |
| Concessionárias conciliadas | 26/26 |
| Concessionárias sem correspondência | 0 |
| Total concessionárias | 48 |
| Total regiões | 48 |
| TOTAL do relatório | 48 |

## Exceções documentadas

Seis concessionárias constam na tabela sem MTD Retail Order informado na semana 1: EUROVILLE BELO HORIZONTE, NISCAR JOAO PESSOA, TORIBA SÃO PAULO, BARIGUI FLORIANOPOLIS, TECAR GOIÂNIA e VEGA BELÉM. Elas foram preservadas como avisos do relatório, sem impedir a reconciliação consolidada de 48 pedidos.

## Idempotência

O reprocessamento do mesmo PDF retornou **NO_CHANGES**, com 0 registros adicionais persistidos. O hash do arquivo foi mantido como `fb5e3f4b655edf8da14478af28664d10ec89efef03a85c961f7824e72e1f0553`.

## Artefatos operacionais

| Artefato | Caminho |
|---|---|
| Resultado da importação | `/tmp/daily-sales-planning-import-20260904.json` |
| Resultado da reexecução | `/tmp/daily-sales-planning-rerun-20260904.json` |
