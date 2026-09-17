# Sincronização da base de Leads — setembro de 2026

**Data da atualização:** 17/09/2026 (fuso America/Sao_Paulo).

## Fonte e escopo

A planilha oficial consolidada de Leads foi processada pelo fluxo transacional e idempotente do dashboard. A fonte passou a cobrir dados até **16/09/2026**, que é o último dia fechado (D-1) para a atualização solicitada.

| Controle | Resultado |
| --- | ---: |
| Linhas encontradas na fonte | 31.987 |
| Linhas válidas consolidadas | 31.967 |
| Linhas inválidas excluídas | 20 |
| Duplicatas internas da fonte | 760 |
| Base canônica antes | 31.009 Leads |
| Registros novos detectados | 198 Leads |
| Registros removidos da fonte | 0 |
| Base canônica depois | **31.207 Leads** |

As 20 linhas excluídas já estavam fora do catálogo operacional de modelos aceitos ou sem modelo informado. Nenhuma delas foi inserida na base canônica.

## Cobertura publicada

Setembro passou de 4.949 Leads até 15/09 para **5.147 Leads até 16/09/2026**. A data de fechamento recebeu 56 Leads na origem consolidada, distribuídos entre Site e Campanha Urban; os demais registros novos incluem atualizações publicadas pela fonte para o período já aberto.

O painel de Leads foi reconciliado com a base canônica: o total do período histórico, a série diária e a auditoria de concessionárias retornaram **31.207 Leads**, sem divergências. A regra de visualização de setembro foi preservada: TikTok Live permanece separado e disponível quando houver dados válidos, enquanto TikTok Ads e Interlagos seguem ocultos na interface de setembro.

## Idempotência

Após a carga, a mesma automação foi reexecutada sem alteração da fonte. O resultado foi `NO_CHANGES`, com 0 registros novos, 0 remoções e a base mantida em 31.207 Leads. Isso confirma que a atualização não gerou duplicação.

## Artefatos de execução

Os arquivos técnicos da execução foram gravados em `/home/ubuntu/mg-leads-automation-output/20260917-095948/`. O relatório de revalidação idempotente está em `/home/ubuntu/mg-leads-automation-output/20260917-100143/`.
