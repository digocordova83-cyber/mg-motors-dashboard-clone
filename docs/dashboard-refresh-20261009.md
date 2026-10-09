# Atualização do dashboard — 09/10/2026

## Escopo e data de corte

Atualização manual executada em **09/10/2026**, com dados fechados até **08/10/2026** (D-1, fuso America/Sao_Paulo). Foram atualizados Leads e snapshots de mídia; Retail foi auditado contra a última fonte oficial disponível.

## Fontes e resultado

| Área | Fonte oficial | Cobertura confirmada | Resultado |
|---|---|---:|---|
| Leads | Planilha-base canônica no Google Workspace | 08/10/2026 | 221 Leads novos incorporados; base passou de 37.877 para **38.098** registros. |
| Google Ads | Windsor.ai | 08/10/2026 | Snapshot atualizado com sucesso; 519 linhas diárias e 32 campanhas no retorno. |
| Meta Ads | Windsor.ai | 08/10/2026 | Snapshot atualizado com sucesso; 7 linhas diárias, 6 campanhas e 59 criativos no retorno. |
| TikTok Ads | Windsor.ai | 08/10/2026 | Snapshot atualizado com sucesso; 6 linhas diárias e cobertura confirmada até D-1. |
| MTD Retail Order | `261007_Daily_Sales_FUP.xlsx` | 07/10/2026 | Último lote oficial vigente: Outubro, Semana 2, **96 MTD Retail Orders**. Nenhum Daily Sales FUP mais novo foi localizado no Drive autorizado. |
| Receita / ROAS | Google Analytics | N/D | Não há conector Google Analytics habilitado nesta sessão; nenhuma receita, ROAS ou projeção financeira foi criada sem fonte oficial. |

## Controle de qualidade dos Leads

- A prévia confirmou a presença de registros até **08/10/2026**, com 230 Leads válidos na data de corte.
- A carga oficial incluiu **221** registros novos, sem remoção de histórico.
- A reexecução retornou `NO_CHANGES`: 38.098 registros canônicos e 38.098 hashes distintos.
- A proteção de histórico preservou os 45 registros Meta de 01/10 ausentes temporariamente na fonte, sem gerar cópias adicionais.
- Linhas sem concessionária de origem continuam rejeitadas pela regra canônica para impedir atribuição indevida. Não houve preenchimento, redistribuição ou estimativa manual.

## Indicadores de outubro após a carga

| Indicador | Valor |
|---|---:|
| Leads acumulados (01–08/10) | 1.834 |
| Meta mensal de Leads | 9.500 |
| Atingimento | 19,31% |
| Média diária realizada | 229,25 |
| Ritmo necessário para a meta | 333,30 Leads/dia |
| Projeção linear do dashboard | 7.107 Leads |
| Diferença projetada vs. meta | -2.393 Leads |

> A projeção é apenas o cálculo de pacing já exibido no dashboard. Não substitui dado realizado.

## Validações executadas

- `pnpm exec tsx scripts/runGoogleLeadsAutomation.ts --dry-run`: prévia oficial aprovada.
- Sincronização oficial aplicada com 221 registros novos.
- Reexecução de idempotência: `NO_CHANGES`.
- `pnpm exec tsx scripts/verifyLeadsAnalytics.ts`: reconciliação da base aprovada.
- `pnpm exec tsx scripts/verifyLeadsImport.ts`: verificação de importação executada.
- Testes direcionados: 4 arquivos / 15 testes aprovados.
- `pnpm run check`: TypeScript aprovado.

## Rastreabilidade

- Carga aplicada: `/home/ubuntu/mg-leads-automation-output/20261009-091147`
- Reexecução idempotente: `/home/ubuntu/mg-leads-automation-output/20261009-091424`
- Snapshots de mídia: rotina `scripts/runManualDashboardRefresh.ts` para 08/10/2026.
