# Atualização da base operacional — 15/09/2026

## Escopo

Atualização manual solicitada para os dados de setembro. A base canônica de Leads foi sincronizada pela planilha oficial vigente. Os snapshots de mídia foram atualizados até o corte D-1 de 14/09/2026. O Retail permaneceu no último Daily Sales FUP oficial disponível, com competência de setembro e semana 3.

## Leads

| Controle | Resultado |
| --- | ---: |
| Linhas na fonte | 31.145 |
| Linhas válidas consolidadas | 31.125 |
| Linhas inválidas excluídas | 20 |
| Duplicatas internas da fonte | 758 |
| Leads novos detectados | 78 |
| Base antes da sincronização | 30.289 |
| Base após a sincronização | 30.367 |
| Leads de setembro, 01–14/09 | 4.322 |
| Leads do dia 14/09 | 347 |

A reexecução retornou `NO_CHANGES`, confirmando idempotência. A base de setembro fechou com cobertura até 14/09 em todos os cinco canais publicados.

| Canal | Leads setembro, 01–14/09 | Última data |
| --- | ---: | --- |
| Meta | 1.580 | 14/09/2026 |
| Campanha Urban | 1.373 | 14/09/2026 |
| Site | 941 | 14/09/2026 |
| Webmotors | 324 | 14/09/2026 |
| Mercado Livre | 104 | 14/09/2026 |

## Mídia paga — corte D-1

| Fonte | Cobertura | Situação | Indicadores do refresh |
| --- | --- | --- | --- |
| Google Ads | 14/09/2026 | Atualizado via Windsor-live | R$ 486.504,40 de investimento e 2.176 conversões no intervalo aquecido de 16/08 a 14/09 |
| Meta Ads | 14/09/2026 | Atualizado via Windsor-live em tentativa isolada após timeout da atualização agregada | R$ 19.913,23 de gasto e 1.200 Leads de 08/09 a 14/09 |
| TikTok Ads | 14/09/2026 | Atualizado via Windsor-live | R$ 0,00 de gasto e 0 Leads de 08/09 a 14/09 |

## Retail

O último arquivo oficial disponível é `pasted_file_xbtn7s_260913_Daily_Sales_FUP.xlsx`, já importado como lote **750001**, competência setembro, semana 3. O lote permanece conciliado com **192 MTD Retail Orders**, 26 de 26 dealers correspondidos e zero não correspondentes. Nenhuma fonte Retail posterior foi fornecida nesta atualização.

## Regras de integridade aplicadas

Não foram criados Leads, valores de mídia ou Retail por estimativa. A sincronização de Leads utilizou o fluxo transacional oficial e substituiu apenas a base canônica por uma versão validada da fonte. As linhas inválidas da origem foram mantidas fora da importação, sem alteração da regra de classificação de modelos.

## Validação técnica

Foram executados `pnpm test`, `pnpm check` e `pnpm build` após a atualização. Resultado: **56 arquivos de teste e 341 testes aprovados**, TypeScript sem erros e build concluído. O build emitiu apenas o alerta não bloqueante de tamanho de chunk do bundle de frontend.
