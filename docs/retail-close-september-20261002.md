# Fechamento de MTD Retail Order — setembro de 2026

**Data da atualização:** 02/10/2026, fuso America/Sao_Paulo  
**Fonte oficial enviada:** `261001DailySalesPlanningReport.pdf`  
**Competência aplicada:** setembro de 2026

## Validação da fonte

Foi usada exclusivamente a tabela **Weekly Target Achievement - Retail** do relatório. A extração estruturada conciliou a soma das 26 concessionárias, as duas regiões e a linha TOTAL, sem erros ou avisos de correção.

| Verificação | Resultado |
|---|---:|
| Concessionárias no relatório | 26 |
| Concessionárias correspondidas no dashboard | 26 |
| Concessionárias não encontradas | 0 |
| Regiões | 2 |
| Semana de referência | 5 |
| MTD Retail Order final | 641 |

## Evolução semanal acumulada

| Semana | MTD Retail Order |
|---|---:|
| Semana 1 | 140 |
| Semana 2 | 259 |
| Semana 3 | 390 |
| Semana 4 | 555 |
| Semana 5 | 641 |

O lote final foi importado como **960001**, com 29 registros persistidos: 26 concessionárias, duas regiões e uma linha TOTAL. A competência foi informada explicitamente como `2026-09`, pois o arquivo foi emitido em 01/10, mas consolida o fechamento de setembro.

A reexecução do mesmo PDF retornou `NO_CHANGES`, confirmando a idempotência. Os testes de PDF, importação, serviço Retail e XLSX foram aprovados (29 testes), assim como a checagem TypeScript.
