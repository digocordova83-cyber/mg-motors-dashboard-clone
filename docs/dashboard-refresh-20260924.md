# Atualização do dashboard — 24/09/2026

**Corte solicitado:** até 23/09/2026 (D-1), fuso America/Sao_Paulo.

## Fontes atualizadas

| Módulo | Fonte | Cobertura confirmada | Resultado |
| --- | --- | --- | --- |
| Leads | Consolidador oficial Google | 23/09/2026 | 332 novos registros importados; base canônica em 33.490 Leads. |
| Google Ads | Windsor.ai ao vivo | 23/09/2026 | Snapshot atualizado; 683 linhas, 32 campanhas e dados completos até o corte. |
| Meta Ads | Windsor.ai ao vivo | 23/09/2026 | Snapshot atualizado; 7 linhas diárias, 6 campanhas e 35 criativos. |
| TikTok Ads | Windsor.ai ao vivo | 23/09/2026 | Snapshot atualizado; 7 linhas diárias e cobertura completa até o corte. |
| MTD Retail Order | Daily Sales FUP oficial | 21/09/2026 | Mantido o último lote oficial disponível, Semana 4, 325 MTD Retail Orders. |

## Leads

A prévia da fonte oficial identificou 332 novos Leads, sem remoções de histórico. A carga elevou a base de 33.158 para **33.490 Leads**. Setembro registrou **7.430 Leads até 23/09**, com 74,30% da meta mensal de 10.000 Leads.

A reexecução retornou `NO_CHANGES`, confirmando que a atualização é idempotente e não duplicou registros. TikTok Live foi preservado separadamente com 468 registros; as regras de visualização mensal de TikTok Ads e Interlagos continuam inalteradas.

## Mídia

A rotina manual de refresh concluiu sem falhas parciais. Google Ads, Meta Ads e TikTok Ads responderam pela Windsor.ai como fontes ao vivo e entregaram séries completas até 23/09. Os snapshots foram persistidos no dashboard para o primeiro acesso do usuário.

## Vendas

A auditoria confirmou que o último arquivo Retail oficial já importado é `260921_Daily_Sales_FUP.xlsx`, competência setembro, Semana 4, com **325 MTD Retail Orders**. O lote possui 26 dealers, duas regiões e uma linha consolidada, todos reconciliados em 325.

Não foi localizado arquivo oficial posterior a 21/09 no conjunto de arquivos disponibilizado nem no Drive conectado. Por isso, a métrica Retail permanece no último dado realizado e conciliado, sem projeção para 22 ou 23/09.

## Validações

A reconciliação analítica de Leads fechou em 33.490 registros, com 95,82% atribuídos a concessionárias válidas. Foram aprovados 18 testes direcionados de sincronização, importação, regras de canal e atualização diária, além da checagem TypeScript.
