# Contrato analítico — Social Orgânico

## Escopo do período

O usuário seleciona `dateFrom` e `dateTo`, respeitando o corte D-1 do dashboard. O servidor calcula um período anterior de igual duração: `previousDateTo` é o dia imediatamente anterior a `dateFrom` e `previousDateFrom` recua a mesma quantidade de dias inclusivos. A resposta sempre informa os dois intervalos para que a interface não compare janelas diferentes silenciosamente.

| Campo | Instagram | TikTok Orgânico | Tratamento comparativo |
|---|---|---|---|
| `newFollowers` | Soma de `follower_count_1d`; representa novos seguidores, não crescimento líquido | Soma de `daily_total_followers`; representa ganhos menos perdas | Soma do período atual versus período anterior equivalente |
| `followersCurrent` | `followers_count` atual do perfil | `total_followers_count` atual do perfil | Exibido como estoque atual; não calcular variação a partir desse valor |
| `dailyReach` | Soma de `reach_1d` | Soma de `unique_video_views` | Comparação entre somas diárias; não rotular como alcance único deduplicado do período |
| `views` | Soma de `views` | Soma de `video_views` | Soma do período atual versus período anterior equivalente |
| `interactions` | Soma de `total_interactions` | Curtidas + comentários + compartilhamentos da série diária | Soma do período atual versus período anterior equivalente |
| `engagementRate` | `interactions / dailyReach × 100` | `interactions / dailyReach × 100` | Recalculada separadamente em cada período; o denominador é alcance diário somado |
| `accountsEngaged` | Soma de `accounts_engaged` quando disponível | Soma de `engaged_audience` | Métrica informativa, sem ser adicionada novamente ao total de interações |
| `profileViews` | Zero quando não fornecido no contrato atual | Soma de `profile_views` | Comparação entre somas diárias |
| Interações detalhadas | Conteúdos publicados fornecem curtidas, comentários, salvamentos e compartilhamentos | Série diária fornece curtidas, comentários e compartilhamentos; favoritos dependem da tabela de vídeos | Soma independente por período, sem dupla contagem adicional no cliente |

## Variações

Cada métrica comparável retorna valor atual, valor anterior, diferença absoluta e diferença percentual. Quando o período anterior é zero e o atual é positivo, a diferença absoluta permanece disponível e a variação percentual é `null`, evitando percentuais infinitos ou artificiais. Quando ambos são zero, a diferença percentual é zero.

## Conteúdos

O ranking usa linhas de mídia publicadas dentro do período selecionado. No Instagram, o servidor preserva os campos `media_*`. No TikTok, os campos `video_*` são normalizados para o mesmo contrato apenas quando existe `video_id` válido. `engagementRate` de conteúdo é `media_engagement / media_reach × 100`. A miniatura usa a URL HTTP(S) válida fornecida pela origem e é exibida com encaixe integral, sem recorte. O cliente nunca inventa imagem nem ranking quando a fonte não entrega linhas por conteúdo.

## Plataformas e conexão

| Plataforma | Estado inicial | Comportamento |
|---|---|---|
| Instagram | Conectado | Dados ao vivo pelo conector `instagram`, conta `mgmotorbrasil` |
| TikTok | Conectado | Dados ao vivo pelo conector `tiktok_organic`, conta `MG Motor Brasil`; nunca reutilizar TikTok Ads |

## Cache e auditabilidade

As consultas possuem cache em memória por plataforma e intervalo, além de deduplicação de requisições concorrentes. O retorno informa `platform`, `source`, `updatedAt`, `dataThroughDate`, contagens de linhas, definições de métricas e disponibilidade por plataforma. Na ausência de série diária para a plataforma selecionada, o servidor retorna erro explícito. Se o TikTok não entregar linhas por vídeo, o retorno mantém os KPIs de conta e apresenta `contents` vazio, sem dados simulados.
