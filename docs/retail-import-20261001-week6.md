# Importação de MTD Retail Order — 01/10/2026

**Arquivo oficial:** `261001_Daily_Sales_FUP(1).xlsx`  
**Competência:** outubro de 2026  
**Lote importado:** 900001

## Diagnóstico do bloqueio

A planilha contém colunas de Semana 6. O importador anterior aceitava apenas dados até a Semana 5 e, por isso, marcava como erro todas as linhas com qualquer valor na Semana 6, mesmo quando a referência oficial do arquivo já estava reconciliada.

## Correção aplicada

O parser XLSX agora trata dados de Semana 6 como evidência auditável, preservada no `rawPayload` de cada linha. Esses campos não substituem o indicador de referência quando divergem do `DAILY_FUP`.

Para este arquivo, o `DAILY_FUP` informa **631 MTD Retail Order**, valor que reconcilia integralmente com a **Semana 5** em `WEEKLY_RET`. A Semana 6 apresenta 632 no TOTAL, diferença de uma unidade; portanto, segue registrada como aviso e não é usada para alterar o MTD oficial.

## Resultado da prévia e importação

| Controle | Resultado |
|---|---:|
| Concessionárias no arquivo | 26 |
| Concessionárias conciliadas | 26 |
| Sem correspondência | 0 |
| Linhas inseridas | 29 |
| Semana de referência | 5 |
| MTD Retail Order oficial | 631 |
| Linhas regionais reconciliadas | 2 |
| Dados de Semana 6 preservados | 27 linhas |

A importação foi concluída com o lote **900001**. A reexecução do mesmo arquivo retornou **`NO_CHANGES`**, comprovando idempotência.

## Validações

- Testes direcionados de XLSX, serviço de Retail e interface: **31 aprovados**.
- Suíte determinística completa: **350 testes aprovados em 57 arquivos**.
- Checagem TypeScript e build de produção: aprovados.
