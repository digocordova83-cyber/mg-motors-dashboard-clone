# Fontes operacionais confirmadas

## Meta mensal de mídia

Fonte: usuário, mensagem e referência visual `pasted_file_dNeeto_image.png`.

| Competência | Meta mensal |
|---|---:|
| 2026-07 | R$ 397.620,71 |

## Metas de leads Google por mercado

Fonte: tabela enviada pelo usuário em `pasted_file_fwT5hc_image.png`. Os nomes abaixo são normalizados apenas para correspondência determinística com campanhas; os valores não foram alterados.

| Mercado | Meta de leads |
|---|---:|
| São Paulo/SP | 2.145 |
| Brasília/DF | 1.393 |
| Porto Alegre/RS | 1.003 |
| Curitiba/PR | 975 |
| Belo Horizonte/MG | 947 |
| Rio de Janeiro/RJ | 863 |
| Salvador/BA | 780 |
| Florianópolis/SC | 752 |
| Campinas/SP | 668 |
| Fortaleza/CE | 557 |
| Ribeirão Preto/SP | 474 |
| Vitória/ES | 473 |
| Piracicaba/SP | 446 |
| São José do Rio Preto/SP | 362 |
| Natal/RN | 306 |
| Maceió/AL | 306 |
| Belém/PA | 279 |
| Aracaju/SE | 195 |
| João Pessoa/PB | 195 |
| Recife/PE | 195 |
| Goiânia/GO | 195 |

## Windsor.ai / Google Ads

Fonte: servidor Windsor.ai configurado na sessão, consulta de conectores em 2026-07-21.

| Item | Valor confirmado |
|---|---|
| Conector | `google_ads` |
| Conta | MG Motors |
| ID da conta | `535-798-6801` |

Campos oficiais confirmados no catálogo `get_fields` do Windsor.ai: `campaign`, `campaign_id`, `date`, `spend`, `conversions`, `clicks`, `impressions`, `ctr`, `cpc`, `budget_amount`, `campaign_status`, `bidding_strategy_type`, `optimization_score`, `search_impression_share`, `search_budget_lost_impression_share`, `account_name` e `datasource`.

> O sistema não deve executar alterações no Google Ads. As recomendações serão convertidas em tarefas auditáveis com instruções manuais. Campanha, ID, orçamento, desempenho e estratégia só podem ser exibidos quando retornados pela fonte real.

## Métrica de limitação por orçamento

O campo `search_budget_lost_impression_share` foi validado em uma extração real da conta MG Motors para 2026-07-13 a 2026-07-19. Ele representa a parcela estimada de impressões elegíveis de Pesquisa perdida por orçamento insuficiente, em escala de `0` a `0,9`; valores acima de 90% são reportados como `0,9001`. O motor deve usar esse campo diretamente para sinalizar limitação por orçamento, sem inferir o estado apenas pela relação entre gasto e orçamento diário.
