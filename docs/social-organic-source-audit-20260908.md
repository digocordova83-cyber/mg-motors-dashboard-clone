# Auditoria de fontes — Social Orgânico

Data de verificação: 08/09/2026. Corte operacional do dashboard: D-1.

## Instagram

- Conector Windsor: `instagram`.
- Conta identificada pelo conector integrado: `mgmotorbrasil`.
- Identificador retornado pelo endpoint usado pela aplicação: `28842093312063059`.
- Identificador exibido pelo catálogo MCP da mesma conta: `17841475843605752`. A implementação deve filtrar pelo identificador aceito pelo endpoint REST da aplicação.
- Endpoint já compatível com a arquitetura do dashboard: `https://connectors.windsor.ai/instagram`.
- Campos diários confirmados: `date`, `follower_count_1d`, `reach_1d`, `total_interactions`, `accounts_engaged`, `likes`, `comments`, `saves`, `shares`, `replies`, `reposts`, `profile_links_taps` e `views`.
- Campos de perfil confirmados: `username`, `followers_count` e `media_count`. `followers_count` representa o total atual e não possui histórico.
- Campos de conteúdo confirmados: `media_id`, `timestamp`, `media_caption`, `media_type`, `media_product_type`, `media_permalink`, `media_url`, `media_thumbnail_url`, `media_reach`, `media_views`, `media_engagement`, `media_like_count`, `media_comments_count`, `media_saved`, `media_shares` e `media_follows`.
- Observação metodológica: `follower_count_1d` representa novos seguidores diários, não necessariamente crescimento líquido. `reach_1d` é alcance diário e sua soma no período não deve ser rotulada como alcance único deduplicado do intervalo.
- Miniaturas: `media_url` é utilizável para imagens e carrosséis; `media_thumbnail_url` é a fonte preferencial para vídeos quando disponível.
- Compatibilidade do endpoint: o endpoint REST retorna a conta correta, mas a aplicação de `filter` em consultas de mídia gera resposta vazia. A implementação consulta os registros com `account_id` e aplica a filtragem estrita no servidor antes da normalização.
- Limitação de campos: o endpoint REST usado pela aplicação retorna `total_interactions` e `views` na série diária, mas não retorna a série quando campos como `likes` ou `accounts_engaged` são adicionados. A decomposição de curtidas, comentários, salvamentos e compartilhamentos é, portanto, calculada exclusivamente a partir dos conteúdos publicados no período.

## TikTok

- O conector atualmente ligado à MG é `tiktok`, correspondente a TikTok Ads, conta `7668787778449719316`.
- O conector correto para métricas orgânicas é `tiktok_organic` e não possui conta conectada no momento da auditoria.
- O Windsor retornou erro explícito de ausência de conta ao consultar os campos de `tiktok_organic`.
- Fluxo oficial de autorização informado pelo Windsor: `https://onboard.windsor.ai/connect?connector=tiktok_organic&next=/tiktok_organic/authorize`.
- A interface deve exibir estado de conexão pendente e nunca apresentar TikTok Ads como se fosse TikTok Orgânico.

## Decisões de produto

- O módulo terá subabas independentes de Instagram e TikTok.
- Instagram exibirá dados reais ao vivo, comparando o período selecionado com o período anterior equivalente.
- TikTok exibirá estado indisponível enquanto `tiktok_organic` não estiver conectado, com orientação bilíngue e sem dados simulados.
- Taxa de engajamento será calculada como interações divididas por alcance diário somado, com ressalva de que o denominador não é alcance único deduplicado do período.
- Rankings de conteúdo serão ordenáveis por alcance e engajamento, usando miniatura apenas quando houver URL válida na origem.
