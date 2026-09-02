# Atualização do dashboard — dados até 01/09/2026

**Data de execução:** 02/09/2026  
**Timezone operacional:** America/Sao_Paulo  
**Escopo:** Leads, Google Ads, Meta Ads, TikTok Ads/TikTok Live e MTD Retail Order

## Resumo executivo

A atualização de Leads e vendas foi concluída pelo fluxo oficial e confirmada por reexecução idempotente. Google Ads e TikTok Ads fecharam 01/09 no Windsor e foram atualizados. A Meta Ads ainda não disponibilizou 01/09: duas consultas ao vivo retornaram dados somente até 31/08, e o dashboard manteve o último recorte completo sem declarar sucesso falso para D-1.

| Base | Resultado |
| --- | ---: |
| Leads antes | 26.028 |
| Novos Leads líquidos | 84 |
| Leads depois | **26.112** |
| Leads de 01/09 | **84** |
| MTD Retail Order — semana 5 | **674** |
| Target da semana 5 | 486 |
| Atingimento | 138,7% |
| Dealers conciliados | **25/25** |
| Unmatched | **0** |

## Leads

A planilha oficial continha 26.861 linhas de origem. O consolidado produziu 26.841 linhas válidas, descartou 729 duplicatas internas e excluiu 20 linhas inválidas antes da importação. A análise detectou 84 registros novos e zero remoções. O lote 2160001 substituiu a base integral de forma transacional e levou o total de 26.028 para 26.112 Leads.

Todos os **84 Leads de 01/09** vieram do Site. O arquivo de origem continha 85 linhas para a data, mas uma delas já existia por hash na base; por isso o acréscimo líquido foi 84. A composição bruta do dia era 67 Site e 18 Campanha Urban, com 49 MG4, 18 MG4 Urban, 13 MGS5 e cinco Cyberster.

A reexecução oficial retornou `NO_CHANGES`: 26.112 registros já armazenados, zero novos, zero removidos e zero linhas gravadas. TikTok Live permaneceu separado de TikTok Ads, com 180 e 233 registros na base integral, respectivamente.

## Mídia

| Fonte | Cobertura D-1 | Estado | Indicadores do recorte aquecido |
| --- | --- | --- | --- |
| Google Ads | 01/09 | **SUCCESS** | R$ 487.267,66; 3.361,6 conversões; 100 campanhas |
| TikTok Ads | 01/09 | **SUCCESS** | R$ 2.666,45; 52 Leads; uma campanha |
| Meta Ads | 31/08 | **PARTIAL / FAILED para 01/09** | R$ 24.486,56; 1.474 Leads; cinco campanhas |

O refresh oficial foi auditado para 01/09. Google e TikTok utilizaram `windsor-live` com `dataThroughDate` igual a 01/09. A Meta retornou seis linhas diárias, mas a última data disponível era 31/08; não havia linha de 01/09. Uma segunda consulta isolada confirmou a mesma limitação, portanto nenhum dado foi inventado ou marcado como completo.

## MTD Retail Order

O PDF `260901DailySalesPlanningReport.pdf` foi processado com competência 2026-09 e semana de referência 5. Conforme a regra operacional do dashboard, a fonte é a tabela **Weekly Target Achievement — Retail**, cujo total é 674; o cartão superior do PDF apresenta 687, mas não é usado pelo importador oficial.

O lote 660001 contém 25 dealers, duas regiões e uma linha TOTAL. Dealer, região e TOTAL fecham em 674. Dois nomes compostos do novo relatório foram adicionados ao de-para oficial: `BALTIC BARUERI/GUARULHOS` para Baltic Shopping Tamboré e `SAVOL SÃO CAETANO/ANÁLIA` para SAVOL ZL/SP. Após a correção, a cobertura ficou em 25/25 dealers, zero unmatched e reconciliação aprovada.

A reexecução do mesmo PDF retornou `NO_CHANGES`, lote 660001, zero linhas inseridas e os mesmos 674 MTD Retail Orders.

## Qualidade técnica

A suíte completa foi executada após os novos aliases: **53 arquivos de teste e 318 testes aprovados**. A verificação TypeScript (`tsc --noEmit`) e o build de produção também foram aprovados. O bundle mantém apenas o aviso não bloqueante de tamanho de chunk já conhecido.

## Referências operacionais

- Leads — prévia: `/tmp/mg-leads-update-20260902-preview/20260902-110612/`
- Leads — importação: `/tmp/mg-leads-update-20260902-final/20260902-110844/`
- Leads — idempotência: `/tmp/mg-leads-update-20260902-idempotency/20260902-111040/`
- Vendas — auditoria inicial: `/tmp/sales-import-20260901.json`
- Vendas — idempotência: `/tmp/sales-import-20260901-idempotency.json`
- Qualidade técnica: `/home/ubuntu/terminal_full_output/2026-09-02_14-28-33_820910_1133.txt`
