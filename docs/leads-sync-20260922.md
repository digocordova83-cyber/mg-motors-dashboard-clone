# Sincronização da base de Leads — setembro de 2026

**Data da atualização:** 22/09/2026, fuso America/Sao_Paulo.  
**Cobertura validada:** até 21/09/2026 (D-1).

## Fonte e proteção do histórico

A primeira prévia oficial identificou **335 novos Leads**, mas também indicou a remoção indevida de **423 registros históricos de TikTok Live**, pois a aba `Tiktok - Live` continha somente 45 registros correntes. A importação foi interrompida antes de qualquer alteração na base canônica.

O histórico oficial previamente validado foi reconciliado com a aba corrente. Não havia sobreposição exata entre os 45 registros atuais e os 423 registros históricos; por isso, os 423 registros ausentes foram restaurados por inclusão, sem exclusão ou sobrescrita. A aba oficial passou a conter **468 Leads de TikTok Live**.

| Controle da recuperação | Resultado |
| --- | ---: |
| Registros correntes na aba TikTok Live | 45 |
| Histórico restaurado | 423 |
| Sobreposição exata | 0 |
| TikTok Live após recuperação | **468** |

## Atualização da base canônica

Após a recuperação, uma nova prévia confirmou cobertura máxima em 21/09/2026, **335 novos registros** e **zero remoções**. A carga transacional foi aplicada pelo fluxo oficial.

| Controle da carga | Resultado |
| --- | ---: |
| Base canônica antes | 32.472 Leads |
| Novos registros incorporados | 335 Leads |
| Registros removidos | 0 |
| Base canônica depois | **32.807 Leads** |
| Setembro até 21/09/2026 | **6.747 Leads** |
| TikTok Live na base canônica | 468 Leads |
| Canais ativos | 8 |

A fonte consolidada continha 20 linhas rejeitadas pelas regras vigentes de modelo e 775 duplicatas internas; nenhuma dessas linhas foi incorporada indevidamente. O histórico, a concessionária, o canal de origem e a classificação de Campanha Urban foram preservados.

## Validação

A segunda execução oficial retornou `NO_CHANGES`, com zero registros novos e zero removidos, confirmando idempotência. A reconciliação analítica fechou em 32.807 Leads na base integral, na série diária e na auditoria de concessionárias. O período de setembro contém 6.747 Leads, com data máxima em 21/09/2026.

Foram aprovados 13 testes direcionados de automação, importação e indicadores de Leads, além da checagem TypeScript. TikTok Live permanece separado de TikTok Ads; as regras de visualização mensal existentes não foram alteradas.

## Artefatos técnicos

A prévia interrompida está em `/home/ubuntu/mg-leads-automation-output/20260922-093302/`. A prévia corrigida está em `/home/ubuntu/mg-leads-automation-output/20260922-093620/`, a carga aplicada em `/home/ubuntu/mg-leads-automation-output/20260922-093854/` e a reexecução idempotente em `/home/ubuntu/mg-leads-automation-output/20260922-094104/`.
