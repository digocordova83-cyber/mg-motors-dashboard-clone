# Reconciliação visual de Meta no gráfico de Leads — 09/10/2026

## Contexto

A aba **Leads** exibia a série diária exclusivamente a partir da base canônica de contatos. Essa base aplica deduplicação e demais regras de consolidação; portanto, ela não representa necessariamente a geração bruta registrada na aba **Meta** da planilha-base.

A aba **Meta Ads** já usa a série diária agregada da planilha-base para a métrica de geração. O gráfico da aba Leads foi alinhado à mesma regra **somente para a faixa Meta**.

## Regra aplicada

| Elemento do gráfico | Fonte | Critério |
|---|---|---|
| Segmento Meta | Planilha-base de Leads — aba Meta | Contagem diária agregada por `created_time`, convertida para `America/Sao_Paulo` |
| Site, Mercado Livre, Webmotors, TikTok e demais canais | Base canônica de Leads | Regras atuais de consolidação, origem e ciclo de vida dos canais |
| Acumulado e total exibido no gráfico | Composição das duas fontes acima | Soma diária da faixa Meta reconciliada com os demais canais canônicos |
| Cards gerais, concessionárias, modelos e exportação de contatos | Base canônica de Leads | Permanecem inalterados e deduplicados |

O gráfico passou a exibir o selo **“Meta · fonte-base”** e um subtítulo explícito para evitar que a composição seja interpretada como uma nova base de contatos ou uma alteração no histórico canônico.

## Validação do período 01–08/10/2026

| Indicador | Valor |
|---|---:|
| Meta canônica usada anteriormente no gráfico | 1.007 |
| Meta na planilha-base | 1.557 |
| Diferença aplicada à faixa Meta do gráfico | +550 |
| Total anterior do gráfico (base canônica) | 1.834 |
| Total exibido com Meta da fonte-base + demais canais canônicos | 2.384 |
| Meta em 07/10 | 243 |
| Meta em 08/10 | 179 |

A alteração é **apenas visual e de reconciliação de fonte**. A carga oficial final executada em 09/10 retornou `NO_CHANGES`, preservando a base canônica em 38.098 Leads.

## Implementação e qualidade

- `buildDailyWithMetaBase` recompõe apenas o canal Meta, conserva os demais canais e recalcula o total diário e a média móvel de sete dias.
- A API `leads.analytics` retorna a série reconciliada e seus metadados de origem, sem dados pessoais.
- O componente `LeadsTab` usa a série reconciliada no gráfico diário e nos quatro indicadores abaixo dele, mantendo o restante da aba canônico.
- Testes: **64 arquivos / 378 testes** aprovados, além de TypeScript e build de produção.
