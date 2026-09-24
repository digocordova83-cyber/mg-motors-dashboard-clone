# Atualização da base de Leads — carga Webmotors

**Data da atualização:** 24/09/2026, fuso America/Sao_Paulo.  
**Cobertura validada:** até 23/09/2026 (D-1).  
**Escopo:** atualização da base canônica de Leads com a carga Webmotors disponibilizada na fonte oficial.

## Fonte e reconciliação

A sincronização utilizou exclusivamente o consolidador oficial de Leads. A prévia inicial, executada às 09:20, ainda não identificava registros novos. Entre essa prévia e a execução transacional, a fonte oficial recebeu uma nova carga Webmotors. A execução aplicada leu o estado mais recente da fonte e identificou **65 Leads novos**, todos incorporados pelo fluxo idempotente.

| Controle | Resultado |
| --- | ---: |
| Linhas na fonte | 34.354 |
| Linhas válidas consolidadas | 34.334 |
| Registros novos detectados | **65** |
| Duplicatas internas reconciliadas | 779 |
| Linhas fora do catálogo operacional | 20 |
| Remoções de histórico | **0** |
| Base canônica antes | 33.490 |
| Base canônica depois | **33.555** |
| Webmotors (canal operacional) | **3.060** |
| Webmotors (canal de origem) | **3.500** |

As 20 linhas rejeitadas são anteriores e pertencem a registros com modelos fora do catálogo operacional permitido; nenhuma delas decorre da carga Webmotors. Não houve remoção ou reclassificação de histórico, e TikTok Live permaneceu separado de TikTok Ads.

## Resultado no dashboard

A base canônica do dashboard agora contém **33.555 Leads**. No fechamento de 23/09, setembro passou a **7.495 Leads**, equivalentes a **74,95%** da meta mensal de 10.000 Leads. A projeção atual é de 9.776 Leads, sem qualquer estimativa adicionada às métricas de Retail ou mídia.

## Idempotência e validações

A segunda execução retornou `NO_CHANGES`, confirmando que a carga de 65 registros não foi duplicada. A reconciliação analítica fechou com 33.555 registros na base total, na série diária e na auditoria de concessionárias. Foram aprovados 13 testes direcionados de automação, importação e regras de canal, além da checagem TypeScript.

## Artefatos técnicos

| Etapa | Diretório |
| --- | --- |
| Prévia inicial | `/home/ubuntu/mg-leads-automation-output/20260924-092034/` |
| Carga aplicada | `/home/ubuntu/mg-leads-automation-output/20260924-092431/` |
| Reexecução idempotente | `/home/ubuntu/mg-leads-automation-output/20260924-092645/` |

A auditoria analítica da carga aplicada está em `/home/ubuntu/mg-leads-automation-output/20260924-092431/analytics-verification.json`.
