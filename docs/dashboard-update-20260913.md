# Atualização operacional do dashboard — 13/09/2026

## Escopo

Atualização manual D-1 concluída em 14/09/2026 para o corte de 13/09/2026. Foram processados Leads pela fonte oficial vigente, Google Ads, Meta Ads e TikTok Ads pelo Windsor e o lote Retail mais recente da fonte Daily Sales FUP.

## Leads canônicos

| Indicador | Resultado |
|---|---:|
| Base antes da atualização | 28.774 |
| Base após a atualização | 29.778 |
| Inclusões líquidas | 1.004 |
| Linhas brutas na fonte | 30.551 |
| Linhas inválidas excluídas | 20 |
| Duplicidades internas tratadas | 753 |
| Última data na base | 13/09/2026 |
| Leads em 13/09 | 247 |
| Leads de setembro até 13/09 | 3.733 |

Em 13/09, a distribuição por canal foi Meta com 131 Leads, Campanha Urban com 71 e Site com 45. A reexecução da mesma fonte devolveu `NO_CHANGES`, sem novas gravações.

## Mídia

Google Ads, Meta Ads e TikTok Ads foram atualizados por dados ao vivo do Windsor, todos com cobertura até 13/09/2026. O refresh foi concluído sem falhas parciais. O TikTok Ads não registrou investimento nem Leads no recorte retornado pela fonte; nenhum valor foi estimado.

## Retail

O dashboard mantém o lote `750001` da planilha Daily Sales FUP como o lote Retail mais recente para setembro. A referência é a Semana 3, com 192 MTD Retail Orders, 26 de 26 dealers correspondidos, zero não correspondentes e reconciliação entre dealers, regiões e TOTAL aprovada.

## Validação técnica

A base foi conferida no banco, a idempotência de Leads foi comprovada e a suíte técnica foi concluída com 56 arquivos de teste e 341 testes aprovados. TypeScript e build de produção também foram aprovados.
