# Contrato analítico — Social Orgânico

## Escopo do período

O usuário seleciona `dateFrom` e `dateTo`, respeitando o corte D-1 do dashboard. O servidor calcula um período anterior de igual duração: `previousDateTo` é o dia imediatamente anterior a `dateFrom` e `previousDateFrom` recua a mesma quantidade de dias inclusivos. A resposta sempre informa os dois intervalos para que a interface não compare janelas diferentes silenciosamente.

| Campo | Definição | Tratamento comparativo |
|---|---|---|
| `newFollowers` | Soma de `follower_count_1d`; representa novos seguidores, não crescimento líquido | Soma do período atual versus soma do período anterior equivalente |
| `followersCurrent` | `followers_count` disponível no dia da consulta | Sem variação histórica; a fonte não entrega série do total de seguidores |
| `dailyReach` | Soma de `reach_1d` | Comparação entre somas diárias; não rotular como alcance único deduplicado do período |
| `views` | Soma de `views` | Soma do período atual versus período anterior equivalente |
| `interactions` | Soma de `total_interactions` | Soma do período atual versus período anterior equivalente |
| `engagementRate` | `interactions / dailyReach × 100` | Recalculada separadamente em cada período; o denominador é alcance diário somado |
| `accountsEngaged` | Soma de `accounts_engaged` | Comparação entre somas diárias; não corresponde necessariamente a contas únicas no período |
| `likes`, `comments`, `saves`, `shares`, `replies`, `reposts` | Interações reportadas pela origem | Soma independente por período, sem dupla contagem adicional no cliente |

## Variações

Cada métrica comparável retorna valor atual, valor anterior, diferença absoluta e diferença percentual. Quando o período anterior é zero e o atual é positivo, a diferença absoluta permanece disponível e a variação percentual é `null`, evitando percentuais infinitos ou artificiais. Quando ambos são zero, a diferença percentual é zero.

## Conteúdos

O ranking usa linhas de mídia publicadas dentro do período selecionado. O servidor preserva alcance, visualizações, engajamento, curtidas, comentários, salvamentos, compartilhamentos e seguidores atribuídos ao conteúdo conforme a origem. `engagementRate` de conteúdo é `media_engagement / media_reach × 100`. A miniatura segue a ordem `media_thumbnail_url` e depois `media_url`, desde que seja uma URL HTTP(S) válida. O cliente nunca inventa imagem para conteúdo sem mídia válida.

## Plataformas e conexão

| Plataforma | Estado inicial | Comportamento |
|---|---|---|
| Instagram | Conectado | Dados ao vivo pelo conector `instagram`, conta `mgmotorbrasil` |
| TikTok | Pendente | O conector `tiktok_organic` não está autorizado; exibir orientação bilíngue e não reutilizar TikTok Ads |

## Cache e auditabilidade

As consultas possuem cache em memória por intervalo e deduplicação de requisições concorrentes. O retorno informa `source`, `updatedAt`, `dataThroughDate`, contagens de linhas, definições de métricas e disponibilidade por plataforma. Na ausência de dados do Instagram, o servidor retorna erro explícito. Para TikTok Orgânico pendente, retorna estado estruturado de conexão, não erro genérico e não dados simulados.
