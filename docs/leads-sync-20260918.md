# Sincronização da base de Leads — setembro de 2026

**Data da atualização:** 18/09/2026, fuso America/Sao_Paulo.

## Fonte e resultado

A planilha oficial consolidada de Leads foi atualizada pelo fluxo transacional e idempotente do dashboard. A fonte possui cobertura até **17/09/2026**, correspondente ao D-1 da data de execução.

| Controle | Resultado |
| --- | ---: |
| Linhas encontradas na fonte | 32.169 |
| Linhas válidas consolidadas | 32.149 |
| Linhas inválidas excluídas | 20 |
| Duplicatas internas da fonte | 765 |
| Base canônica antes | 31.207 Leads |
| Registros novos detectados | 177 Leads |
| Registros removidos da fonte | 0 |
| Base canônica depois | **31.384 Leads** |

As 20 linhas excluídas já estavam fora do catálogo operacional de modelos ou sem modelo informado. Não houve novas linhas inválidas na carga e nenhuma delas foi persistida.

## Cobertura publicada

Setembro totaliza **5.324 Leads entre 01 e 17/09/2026**. O dia 17/09 recebeu 70 Leads, sendo 44 da origem Site e 26 classificados como Campanha Urban. Os demais registros refletiram publicações e ajustes da fonte oficial dentro do período aberto.

A base integral, a série diária e a auditoria por concessionária foram reconciliadas em **31.384 Leads**, sem divergência. A regra de visualização de setembro permaneceu inalterada: TikTok Live segue separado e disponível quando houver dados válidos; TikTok Ads e Interlagos seguem ocultos apenas na interface do mês, preservados no histórico canônico.

## Idempotência

A fonte foi reexecutada após a carga. O resultado foi `NO_CHANGES`, com 0 registros novos, 0 remoções e base mantida em 31.384 Leads. A atualização não gerou duplicação.

## Artefatos técnicos

A execução de carga foi registrada em `/home/ubuntu/mg-leads-automation-output/20260918-094334/`. A revalidação idempotente foi registrada em `/home/ubuntu/mg-leads-automation-output/20260918-094529/`.
