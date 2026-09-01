# Contrato da aba TikTok Ads

## Identidade e fonte

A fonte canônica será o endpoint Windsor `https://connectors.windsor.ai/tiktok`, filtrado exclusivamente pelo `account_id` estável `7668787778449719316`. O nome descritivo da conta é apenas apresentação e não participa da identidade. Todas as consultas respeitam o corte D-1 do dashboard e usam a mesma resolução de período compartilhada por Google Ads e Meta Ads.

## Bundle de consultas

| Chave | Finalidade | Dimensões principais | Métrica canônica de resultado |
|---|---|---|---|
| `daily` | Série, resumo e cobertura | conta, moeda, data | `onsite_form` |
| `campaigns` | Ranking de campanhas | campanha, status e objetivo | `onsite_form` |
| `adGroups` | Públicos e grupos | campanha, grupo, status, placement, orçamento e bid | `onsite_form` |
| `ads` | Criativos e peças | campanha, grupo, anúncio, mídia e status | `onsite_form` |
| `demographics` | Idade e gênero | idade e gênero | `conversions` |
| `regions` | Performance geográfica | `province_name` isolado | `conversions` |

As quebras demográfica e regional não podem ser rotuladas como formulário nativo, porque a API devolve `onsite_form` sem a dimensão e distribui `conversions` nas linhas segmentadas. A interface deve explicar essa diferença e nunca somar métricas de granularidades distintas no mesmo total.

## Saída tipada do serviço

O serviço retorna `account`, `period`, `summary`, `daily`, `models`, `campaigns`, `adGroups`, `ads`, `demographics`, `regions`, `highlights` e `metadata`. O resumo contém investimento, Leads TikTok, CPL, impressões, alcance, cliques, CTR, engajamentos, taxa de engajamento, compartilhamentos, comentários e tempo médio de reprodução. CTR e taxa de engajamento chegam do Windsor em escala decimal e devem ser convertidos para porcentagem apenas na camada de saída.

O campo `metadata` registra fonte (`windsor-live`, `validated-snapshot` ou `persistent-snapshot`), instante de atualização, data máxima, contagem por consulta, TTL, disponibilidade de Leads segmentados e cache hit. `dataThroughDate` deriva exclusivamente da série diária.

## Normalização

Números inválidos tornam-se zero. Campos textuais são aparados. CPL só existe quando há Leads. Os itens são ordenados por Leads e, em caso de empate, investimento. O modelo é extraído deterministamente dos nomes de anúncio, grupo e campanha, priorizando `MG4 URBAN`, `MG4`, `MGS5`, `CYBERSTER` e `Outros`.

Status `ENABLE`, `CAMPAIGN_STATUS_ENABLE`, `ADGROUP_STATUS_DELIVERY_OK` e `AD_STATUS_DELIVERY_OK` são apresentados como ativos/entregando. `DISABLE` é pausado e `FROZEN` é bloqueado. Valores desconhecidos permanecem explicitamente como não informados.

## Cache, snapshot e cobertura

O cache em memória terá TTL de 15 minutos e deduplicação de solicitações simultâneas. O snapshot persistente reutiliza `dashboard_data_snapshots` com a nova origem `TIKTOK_ADS`. Um refresh forçado ignora cache e snapshot na primeira tentativa, mas pode recorrer ao snapshot persistente ou ao snapshot validado se a fonte falhar.

Um bundle ao vivo só é aceito quando `daily`, `campaigns`, `adGroups` e `ads` possuem linhas. Toda linha deve pertencer ao `account_id` configurado. A série deve conter datas dentro do intervalo solicitado e cobrir a data máxima reportada pela fonte; períodos anteriores ao início da entrega podem conter dias sem linha sem serem tratados como lacuna.

## Interface

A aba replica a linguagem visual da Meta Ads, mas usa acento TikTok ciano. Ela contém seis KPIs principais, gráfico combinado investimento/Leads, CPL diário, performance por modelo, campanhas, grupos de anúncios, criativos, análise de idade/gênero, regiões e notas de disponibilidade. Filtros de campanha e grupo afetam os gráficos e tabelas dependentes; os totais do período permanecem claramente identificados.

Datas rápidas de 7, 14, 30 e 60 dias, mês e intervalo personalizado respeitam D-1. O botão Atualizar refaz a consulta do período e preserva o último sucesso em caso de erro. Estados de carregamento, vazio e falha são localizados em português e inglês.

## Permissão e navegação

TikTok Ads reutiliza `canAccessMetaAds`, garantindo acesso imediato aos mesmos perfis de mídia social e preservando `mgsales` como somente Leads. O módulo terá rota `?module=tiktok-ads`, entrada própria na navegação e não altera contratos de Google Ads, Meta Ads, Leads ou Plano de Mídia.
