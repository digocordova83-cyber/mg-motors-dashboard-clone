# Sincronização da base de Leads — setembro de 2026

**Data da atualização:** 25/09/2026, fuso America/Sao_Paulo.  
**Cobertura validada:** até 24/09/2026 (D-1).  
**Escopo:** atualização da base canônica de Leads exclusivamente a partir do consolidador oficial.

## Fonte e reconciliação

A prévia oficial consolidou a fonte disponível na manhã de 25/09 e identificou **349 Leads novos**, sem remoção de registros históricos. A carga transacional incorporou os novos registros à base canônica, preservando as regras de deduplicação, concessionária, canal de origem e normalização de modelos.

| Controle | Resultado |
| --- | ---: |
| Linhas encontradas na fonte | 34.703 |
| Linhas válidas consolidadas | 34.683 |
| Registros novos detectados | **349** |
| Duplicatas internas reconciliadas | 779 |
| Linhas fora do catálogo operacional | 20 |
| Remoções de histórico | **0** |
| Base canônica antes | 33.555 |
| Base canônica depois | **33.904** |
| Cobertura mais recente | **24/09/2026** |
| Leads em 24/09 | 340 |

As 20 linhas rejeitadas contêm modelos fora do catálogo operacional permitido ou sem modelo e não foram incorporadas à base canônica. Elas não foram estimadas nem reclassificadas. TikTok Live permaneceu separado de TikTok Ads e nenhum canal histórico foi removido.

## Resultado no dashboard

No fechamento de 24/09, setembro passou a **7.844 Leads**, equivalentes a **78,44%** da meta mensal de 10.000 Leads. A série diária, a auditoria por concessionária e a base total reconciliaram no mesmo total de **33.904 registros**. A projeção automática do dashboard é de 9.805 Leads; ela permanece identificada como projeção operacional e não como dado realizado.

## Idempotência e validações

A segunda execução retornou `NO_CHANGES`, confirmando que a carga de 349 registros não foi duplicada. A verificação de importação confirmou **33.904 hashes distintos para 33.904 Leads**, sem duplicidade de registro. Foram aprovados 13 testes direcionados de automação, importação e regras de canal, além da checagem TypeScript.

## Artefatos técnicos

| Etapa | Diretório |
| --- | --- |
| Prévia oficial | `/home/ubuntu/mg-leads-automation-output/20260925-091818/` |
| Carga aplicada | `/home/ubuntu/mg-leads-automation-output/20260925-092110/` |
| Reexecução idempotente | `/home/ubuntu/mg-leads-automation-output/20260925-092334/` |

As reconciliações analítica e de importação da carga aplicada estão registradas em `/home/ubuntu/mg-leads-automation-output/20260925-092110/`.
