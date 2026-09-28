# Sincronização da base de Leads — setembro de 2026

**Data da atualização:** 28/09/2026, fuso America/Sao_Paulo.  
**Cobertura validada:** até 27/09/2026 (D-1).  
**Escopo:** atualização da base canônica de Leads exclusivamente a partir do consolidador oficial.

## Fonte e reconciliação

A prévia oficial identificou **1.071 Leads novos** e não encontrou remoção de registros históricos. A carga transacional incorporou esses registros à base canônica, preservando deduplicação, concessionária, canal de origem e normalização de modelos.

| Controle | Resultado |
| --- | ---: |
| Linhas encontradas na fonte | 35.778 |
| Linhas válidas consolidadas | 35.758 |
| Registros novos detectados | **1.071** |
| Duplicatas internas reconciliadas | 783 |
| Linhas fora do catálogo operacional | 20 |
| Remoções de histórico | **0** |
| Base canônica antes | 33.904 |
| Base canônica depois | **34.975** |
| Cobertura mais recente | **27/09/2026** |
| Leads em 27/09 | 365 |

As 20 linhas rejeitadas são registros com modelos fora do catálogo operacional permitido ou sem modelo. Elas não foram incorporadas, estimadas ou reclassificadas. TikTok Live permanece separado de TikTok Ads e os canais históricos foram preservados.

## Resultado no dashboard

No fechamento de 27/09, setembro passou a **8.915 Leads**, equivalentes a **89,15%** da meta mensal de 10.000 Leads. A série diária, a auditoria por concessionária e a base total reconciliaram em **34.975 registros**. A projeção operacional automática é de 9.906 Leads, identificada como projeção e não como dado realizado.

## Idempotência e validações

A segunda execução retornou `NO_CHANGES`, confirmando que a carga de 1.071 registros não foi duplicada. A importação aplicada registrou 35.758 linhas totais, 34.975 inseridas e 783 duplicatas internas corretamente ignoradas. Foram aprovados 13 testes direcionados de automação, importação e regras de canal, além da checagem TypeScript.

## Artefatos técnicos

| Etapa | Diretório |
| --- | --- |
| Prévia oficial | `/home/ubuntu/mg-leads-automation-output/20260928-091317/` |
| Carga aplicada | `/home/ubuntu/mg-leads-automation-output/20260928-091509/` |
| Reexecução idempotente | `/home/ubuntu/mg-leads-automation-output/20260928-091709/` |

As reconciliações analítica e de importação da carga aplicada estão registradas em `/home/ubuntu/mg-leads-automation-output/20260928-091509/`.
