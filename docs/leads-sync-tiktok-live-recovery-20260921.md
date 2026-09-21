# Recuperação de TikTok Live e atualização da base de Leads — setembro de 2026

**Data da recuperação:** 21/09/2026, fuso America/Sao_Paulo.

## Evento identificado

Uma prévia incremental da planilha oficial identificou 231 Leads adicionais, mas a aba `Tiktok - Live` havia sido substituída por 30 registros novos e deixou de incluir os 423 registros históricos que estavam presentes na última fonte consolidada válida. A aplicação dessa prévia removeria o histórico de TikTok Live da base canônica; por esse motivo, a carga foi interrompida antes de qualquer alteração no dashboard.

## Recuperação na fonte oficial

A fonte anterior validada continha 423 registros únicos de TikTok Live. A aba atual continha 30 registros únicos, sem sobreposição exata com aqueles 423 registros. Assim, a fonte oficial foi corrigida por inclusão, preservando as 30 novas linhas e restaurando as 423 históricas. A aba `Tiktok - Live` passou a conter **453 Leads válidos**.

| Controle | Resultado |
| --- | ---: |
| Histórico TikTok Live recuperado | 423 Leads |
| Novos registros TikTok Live já presentes na fonte | 30 Leads |
| Sobreposição exata entre os dois conjuntos | 0 Leads |
| TikTok Live após recuperação | **453 Leads** |
| Linhas adicionadas à aba oficial | 423 |

## Atualização do dashboard

A nova prévia consolidada confirmou 0 remoções da fonte, 231 registros novos e 20 linhas inválidas já excluídas pelo catálogo operacional de modelos. A carga transacional foi então aplicada com segurança.

| Controle | Resultado |
| --- | ---: |
| Base canônica antes da carga | 32.241 Leads |
| Registros novos incorporados | 231 Leads |
| Registros removidos da fonte | 0 Leads |
| Base canônica depois | **32.472 Leads** |
| Setembro até 20/09/2026 | **6.412 Leads** |
| TikTok Live na base canônica | 453 Leads |

A reexecução oficial retornou `NO_CHANGES`, confirmando idempotência, sem duplicação nem remoção. A base integral, série diária e auditoria de concessionárias foram reconciliadas em 32.472 Leads.

## Validação

Foram aprovados os testes direcionados de automação, importação e indicadores de Leads (13 testes), além da verificação TypeScript. A regra de visualização foi preservada: TikTok Live permanece separado; TikTok Ads e Interlagos seguem ocultos somente na visualização mensal de setembro, sem exclusão do histórico canônico.

## Artefatos técnicos

A prévia interrompida foi registrada em `/home/ubuntu/mg-leads-automation-output/20260921-092918/`. A prévia corrigida está em `/home/ubuntu/mg-leads-automation-output/20260921-094301/`, a carga em `/home/ubuntu/mg-leads-automation-output/20260921-094451/` e a revalidação idempotente em `/home/ubuntu/mg-leads-automation-output/20260921-094655/`.
