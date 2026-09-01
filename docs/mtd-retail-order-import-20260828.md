# Importação de MTD Retail Order — 28/08/2026

## Resultado da importação

O arquivo `260828DailySalesPlanningReport.pdf` foi validado e importado na competência `2026-08` como lote **600001**. O relatório identificou a **Semana 5** e **598 MTD Retail Orders**.

| Verificação | Resultado |
|---|---:|
| Linhas de concessionárias | 26 |
| Concessionárias conciliadas | 26 |
| Concessionárias sem conciliação | 0 |
| Linhas de região | 2 |
| Linhas TOTAL | 1 |
| Registros inseridos | 29 |
| Reconciliação | Aprovada |

## Idempotência

O banco confirmou um único registro concluído para o hash SHA-256 `69b21ab73f008f21f63f4d4c308e45ba264ef638866f67b7098d1c4e39d0862a` na competência `2026-08`, com 26 registros de dealer, 2 regionais e 1 TOTAL. A restrição única de hash e competência evita uma segunda importação do mesmo PDF.

> A reexecução de conferência encontrou uma resposta estruturada incompleta do extrator de PDF antes da checagem de hash. A importação original não foi afetada; a unicidade foi validada diretamente no registro persistido.
