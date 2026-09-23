# Sincronização da base de Leads — setembro de 2026

**Data da atualização:** 23/09/2026, fuso America/Sao_Paulo.  
**Cobertura validada:** até 22/09/2026 (D-1).

## Fonte e prévia

A prévia oficial consolidou 33.935 registros válidos na fonte e identificou **351 novos Leads** para a base canônica. Não houve remoção de histórico. A fonte preservou **468 registros de TikTok Live**, separados de TikTok Ads conforme a regra operacional vigente.

A carga tem cobertura temporal máxima em 22/09/2026, com 345 Leads no dia de corte e 7.147 registros de setembro na fonte consolidada. As 20 linhas rejeitadas permanecem fora da carga por não atenderem ao catálogo operacional de modelos; as 777 duplicatas internas foram reconciliadas pelo fluxo oficial.

## Atualização da base canônica

| Controle | Resultado |
| --- | ---: |
| Base canônica antes da carga | 32.807 Leads |
| Registros novos incorporados | 351 Leads |
| Registros removidos da fonte | 0 |
| Base canônica depois da carga | **33.158 Leads** |
| Setembro até 22/09/2026 | **7.098 Leads** |
| TikTok Live preservado | 468 Leads |
| Canais ativos | 8 |

A segunda execução do fluxo oficial retornou `NO_CHANGES`, confirmando idempotência: não houve duplicação nem remoção de registros após a atualização.

## Reconciliação e validação

A reconciliação analítica fechou em 33.158 Leads na base integral, na série diária e na auditoria de concessionárias. A cobertura de concessionárias em 22/09 foi de 39 pontos de atendimento com recebimento, com 95,78% dos Leads atribuídos a uma concessionária válida.

Foram aprovados 13 testes direcionados de automação, importação e indicadores de Leads, além da checagem TypeScript. As regras de visualização mensal de setembro foram preservadas: TikTok Live permanece distinto; TikTok Ads e Interlagos continuam ocultos apenas na visualização mensal, sem exclusão de histórico canônico.

## Artefatos técnicos

A prévia está em `/home/ubuntu/mg-leads-automation-output/20260923-093026/`, a carga aplicada em `/home/ubuntu/mg-leads-automation-output/20260923-093232/` e a reexecução idempotente em `/home/ubuntu/mg-leads-automation-output/20260923-093440/`.
