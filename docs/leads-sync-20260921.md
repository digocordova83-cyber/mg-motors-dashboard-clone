# Sincronização da base de Leads — setembro de 2026

**Data da atualização:** 21/09/2026, fuso America/Sao_Paulo.

## Fonte e resultado

A planilha oficial consolidada de Leads foi processada pelo fluxo transacional e idempotente do dashboard. A fonte possui cobertura até **20/09/2026**, correspondente ao D-1 da data de execução.

| Controle | Resultado |
| --- | ---: |
| Linhas encontradas na fonte | 33.031 |
| Linhas válidas consolidadas | 33.011 |
| Linhas inválidas excluídas | 20 |
| Duplicatas internas da fonte | 770 |
| Base canônica antes | 31.384 Leads |
| Registros novos detectados | 857 Leads |
| Registros removidos da fonte | 0 |
| Base canônica depois | **32.241 Leads** |

As 20 linhas excluídas permanecem fora do catálogo operacional de modelos ou sem modelo informado; nenhuma foi persistida. O processamento manteve a origem de canal e aplicou a deduplicação canônica por hash.

## Cobertura publicada

Setembro totaliza **6.181 Leads entre 01 e 20/09/2026**. O controle de pacing utiliza a meta mensal configurada de 10.000 Leads: 61,81% realizado em 20 dias fechados, saldo de 3.819 Leads e projeção de 9.272 Leads no ritmo observado. A leitura permanece como `BEHIND`, sem alterar metas, plano ou registros históricos.

A base integral, a série diária e a auditoria de concessionárias foram reconciliadas em **32.241 Leads**, sem divergência. A regra de visualização de setembro foi preservada: TikTok Live segue separado e disponível quando houver dados válidos; TikTok Ads e Interlagos continuam ocultos somente na interface mensal, preservados no histórico canônico.

## Idempotência e validação

A fonte foi reexecutada após a carga. O resultado foi `NO_CHANGES`, com 0 registros novos, 0 remoções e base mantida em 32.241 Leads. A atualização não gerou duplicação.

As validações direcionadas de automação, importação e serviço de Leads foram aprovadas (13 testes), assim como a checagem TypeScript.

## Artefatos técnicos

A execução de carga foi registrada em `/home/ubuntu/mg-leads-automation-output/20260921-085728/`. A revalidação idempotente foi registrada em `/home/ubuntu/mg-leads-automation-output/20260921-085932/`.
