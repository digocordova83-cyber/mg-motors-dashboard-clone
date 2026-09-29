# Atualização do dashboard — 29/09/2026

**Corte solicitado:** até 28/09/2026 (D-1), fuso America/Sao_Paulo.

## Fontes atualizadas

| Módulo | Fonte | Cobertura confirmada | Resultado |
| --- | --- | --- | --- |
| Leads | Consolidador oficial Google | 28/09/2026 | 414 novos registros válidos; base canônica em 35.389 Leads. |
| Google Ads | Windsor.ai ao vivo | 28/09/2026 | Snapshot atualizado com 628 linhas e 32 campanhas; série completa até o corte. |
| Meta Ads | Windsor.ai ao vivo | 28/09/2026 | Snapshot atualizado com 7 linhas diárias, 6 campanhas e 35 criativos. |
| TikTok Ads | Windsor.ai ao vivo | 27/09/2026 | A fonte não retornou 28/09 completo; o dashboard preserva o último dia fechado disponível, sem estimativa. |
| MTD Retail Order | Daily Sales FUP oficial | Semana 5 de setembro | Mantido o último lote oficial: 466 MTD Retail Orders, 26 dealers e totais conciliados. |

## Leads

A prévia oficial identificou **414 Leads novos**, sem remoções históricas. A carga elevou a base canônica de 34.975 para **35.389 Leads**. Setembro registrou **9.329 Leads até 28/09**, equivalentes a **93,29%** da meta mensal de 10.000 Leads.

A reexecução retornou `NO_CHANGES`, confirmando que a atualização é idempotente e não duplicou registros. TikTok Live permanece separado de TikTok Ads. A fonte apresentou 32 linhas fora do catálogo operacional de modelos; essas linhas seguem excluídas da base canônica, sem reclassificação ou estimativa.

## Mídia

A rotina manual consultou as três fontes via Windsor.ai. Google Ads e Meta Ads concluíram com cobertura D-1 e snapshots persistidos. TikTok Ads retornou dados somente até 27/09; a execução registrou a pendência de 28/09 e não substituiu o dado realizado por estimativa. A atualização deve ser reexecutada quando a fonte disponibilizar o dia fechado.

## Vendas

A auditoria encontrou como último lote oficial Retail o import `840001`, competência setembro, Semana 5, concluído em 28/09/2026 às 13:48 (Brasília), com **466 MTD Retail Orders**. O lote contém 26 dealers, duas regiões sintetizadas e uma linha TOTAL; os três totais conciliam em 466.

Não foi localizado arquivo Daily Sales FUP posterior nas áreas disponibilizadas nem no Drive conectado. Por isso, a métrica Retail permanece no último dado realizado e conciliado, sem projeção adicional.

## Validações

A reconciliação analítica de Leads fechou em 35.389 registros na base, na série diária e na auditoria de concessionárias; 96,04% estão atribuídos a concessionárias válidas. Foram aprovados 18 testes direcionados de sincronização, importação, regras de canal e atualização diária, além da checagem TypeScript.

## Artefatos técnicos

| Etapa | Diretório |
| --- | --- |
| Prévia de Leads | `/home/ubuntu/mg-leads-automation-output/20260929-092504/` |
| Carga aplicada | `/home/ubuntu/mg-leads-automation-output/20260929-092727/` |
| Reexecução idempotente | `/home/ubuntu/mg-leads-automation-output/20260929-092945/` |

As reconciliações analítica e de importação da carga aplicada estão em `/home/ubuntu/mg-leads-automation-output/20260929-092727/`.
