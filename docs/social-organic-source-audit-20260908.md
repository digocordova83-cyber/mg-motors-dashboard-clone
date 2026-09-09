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

- Nova verificação: 08/09/2026, após a sincronização informada pelo usuário.
- O conector `tiktok_organic` passou a retornar a conta `MG Motor Brasil`, identificador `_000Yp1HuE6qKa98yQHXTVpA29y_auJ0C49W`.
- O conector pago permanece separado como `tiktok`, conta `7668787778449719316`. Nenhum dado de TikTok Ads é reutilizado no módulo orgânico.
- Endpoint REST validado para a aplicação: `https://connectors.windsor.ai/tiktok_organic`.
- Campos diários confirmados: `date`, `total_followers_count`, `daily_total_followers`, `followers_count`, `daily_lost_followers`, `unique_video_views`, `video_views`, `engaged_audience`, `likes`, `comments`, `shares`, `profile_views` e `bio_link_clicks`.
- Semântica de seguidores: `daily_total_followers` representa crescimento líquido diário; `followers_count` representa ganhos e `daily_lost_followers` representa perdas. O dashboard usa `daily_total_followers` no comparativo para não rotular ganhos brutos como crescimento.
- Semântica de alcance: `unique_video_views` é a audiência diária alcançada. A soma no período é exibida como alcance diário somado, não como alcance único deduplicado do intervalo.
- Interações: o total diário é calculado exclusivamente como curtidas + comentários + compartilhamentos. `engaged_audience` é preservado como audiência engajada, mas não é somado novamente às interações.
- Perfil: `total_followers_count` e `videos_count` foram confirmados como campos atuais da conta.
- Campos de vídeo catalogados pelo Windsor: `video_id`, `video_caption`, `video_create_datetime`, `video_views_count`, `video_reach`, `video_likes`, `video_comments`, `video_shares`, `video_favorites`, `video_new_followers`, `video_profile_views`, `video_share_url` e `video_thumbnail_url`, entre outros.
- Limitação atual: as consultas por vídeo retornaram somente uma linha nula, embora a conta e as métricas diárias estejam disponíveis. Portanto, o dashboard não fabrica ranking nem thumbnails; exibe um estado transparente e está preparado para preencher a seção automaticamente quando o Windsor liberar linhas por vídeo.
- Validação ao vivo pelo serviço do dashboard, período solicitado 01/09–08/09 com corte D-1 efetivo em 07/09: 117.518 seguidores atuais, crescimento líquido de 266, alcance diário somado de 20.455, 23.819 visualizações, 217 interações e taxa de engajamento de 1,06%. Esses valores são uma verificação técnica pontual e continuarão sendo atualizados pela consulta ao vivo.

## Decisões de produto

- O módulo terá subabas independentes de Instagram e TikTok.
- Instagram exibirá dados reais ao vivo, comparando o período selecionado com o período anterior equivalente.
- TikTok exibirá dados reais ao vivo da conta `tiktok_organic`, comparando o período selecionado com o período anterior equivalente.
- A seção de vídeos do TikTok exibirá ranking e thumbnails somente quando existirem linhas válidas de `video_id`; até lá, mostrará a limitação da fonte sem dados simulados.
- Taxa de engajamento será calculada como interações divididas por alcance diário somado, com ressalva de que o denominador não é alcance único deduplicado do período.
- Rankings de conteúdo serão ordenáveis por alcance e engajamento, usando miniatura apenas quando houver URL válida na origem.
