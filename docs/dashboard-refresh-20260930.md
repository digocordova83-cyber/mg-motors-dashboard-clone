# Atualização do dashboard — 30/09/2026

**Corte solicitado:** até 29/09/2026 (D-1), fuso America/Sao_Paulo.

## Fontes atualizadas

| Módulo | Fonte | Cobertura confirmada | Resultado |
| --- | --- | --- | --- |
| Leads | Consolidador oficial Google | 29/09/2026 | 330 novos registros válidos; base canônica em 35.719 Leads. |
| Google Ads | Windsor.ai ao vivo | 29/09/2026 | Snapshot atualizado com 612 linhas e 32 campanhas; série completa até o corte. |
| Meta Ads | Windsor.ai ao vivo | 29/09/2026 | Snapshot atualizado com 7 linhas diárias, 6 campanhas e 35 criativos. |
| TikTok Ads | Windsor.ai ao vivo | 27/09/2026 | A fonte não retornou 28 ou 29/09 completos; o dashboard preserva o último dia fechado disponível, sem estimativa. |
| MTD Retail Order | Daily Sales FUP oficial | Semana 5 de setembro | Último lote oficial: 529 MTD Retail Orders, 26 dealers e totais conciliados. |

## Leads

A prévia da fonte oficial identificou **330 Leads novos**, sem remoções históricas. A carga elevou a base canônica de 35.389 para **35.719 Leads**. Setembro registrou **9.659 Leads até 29/09**, equivalentes a **96,59%** da meta mensal de 10.000 Leads.

A reexecução retornou `NO_CHANGES`, confirmando idempotência e ausência de duplicidade. TikTok Live continua separado de TikTok Ads. A fonte apresentou 48 linhas fora do catálogo operacional de modelos; elas permanecem excluídas da base canônica, sem reclassificação ou estimativa.

## Mídia

A rotina manual consultou Google Ads, Meta Ads e TikTok Ads pela Windsor.ai. Google e Meta concluíram com cobertura D-1 e snapshots persistidos. TikTok retornou somente até 27/09; as referências de 28 e 29/09 foram registradas como incompletas e não substituíram o realizado por dados estimados. A sincronização deve ser reexecutada quando a fonte fechar os dois dias pendentes.

## Vendas

A auditoria confirmou o lote Retail oficial `870001`, competência setembro, Semana 5, concluído em 29/09/2026 às 10:35 (Brasília), com **529 MTD Retail Orders**. O lote possui 26 dealers, duas regiões sintetizadas e uma linha TOTAL; os três totais conciliam em 529.

Nenhum arquivo Retail adicional posterior foi localizado nas áreas de trabalho ou no Drive conectado. A métrica Retail, portanto, permanece no último realizado oficialmente importado, sem projeção.

## Validações

A reconciliação de Leads fechou em 35.719 registros na base, na série diária e na auditoria por concessionária; 96,08% estão atribuídos a concessionárias válidas. Foram aprovados 18 testes direcionados de sincronização, importação, regras de canal e atualização diária, além da checagem TypeScript.

## Artefatos técnicos

| Etapa | Diretório |
| --- | --- |
| Prévia de Leads | `/home/ubuntu/mg-leads-automation-output/20260930-092813/` |
| Carga aplicada | `/home/ubuntu/mg-leads-automation-output/20260930-093101/` |
| Reexecução idempotente | `/home/ubuntu/mg-leads-automation-output/20260930-093311/` |

As reconciliações analítica e de importação da carga aplicada estão em `/home/ubuntu/mg-leads-automation-output/20260930-092813/`.
