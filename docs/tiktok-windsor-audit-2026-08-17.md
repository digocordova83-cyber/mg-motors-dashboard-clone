# Auditoria Windsor — TikTok Ads

Data da auditoria: 17/08/2026. Fonte: conector `tiktok` do Windsor.ai, consultado por operações de descoberta de conectores, campos, opções e dados. Conta conectada: `7668787778449719316` — `Ag. BBRO - MG Motor Brasil - AUT`.

## Cobertura confirmada

No intervalo consultado de 01 a 16/08/2026, a fonte retornou quatro dias com entrega: 13, 14, 15 e 16/08. A soma diária reconciliada é de **R$ 2.077,91** de investimento, **86 formulários TikTok (`onsite_form`)**, **86 conversões**, **181.144 impressões**, **95.100 de alcance**, **734 cliques de destino** e **2.425 engajamentos**. O CPM agregado retornado é 11,471; o CPC, 2,8309; e o CTR, 0,0041 em escala decimal, portanto a interface deve exibir 0,41%.

| Data | Investimento | Leads TikTok | Impressões | Alcance | Cliques |
|---|---:|---:|---:|---:|---:|
| 13/08 | R$ 338,35 | 5 | 28.401 | 28.119 | 76 |
| 14/08 | R$ 592,79 | 30 | 52.211 | 32.509 | 235 |
| 15/08 | R$ 565,76 | 21 | 46.743 | 31.000 | 197 |
| 16/08 | R$ 581,01 | 30 | 53.789 | 33.750 | 226 |

## Estrutura disponível

Foi confirmada uma campanha ativa, `Ago/26 | Ago/26 | Cadastro (Formulário)`, ID `1873414857483281`, com uma linha de performance integral. O grupo ativo é `HM | 25+ | Público Segmentado| Cidades SP, Curitiba, Florianópolis, Porto Alegre, Belo Horizonte, Fortaleza, Salvador, Vitória, Rio de Janeiro (cidade), Goiânia, Brasília, Belém, Natal, Maceió, Cuiabá, Várzea Grande, Aracaju, João Pessoa`, ID `1873415008094258`, status `ADGROUP_STATUS_DELIVERY_OK`, placement selecionado e estratégia `Cost Cap`.

O anúncio ativo é `MG4 - Urban_2HYO06v5.mp4_MG4 - Urban`, ID `1873415862170769`, com vídeo ID `v10033g50000d9ussu7og65sk7opiung`. O Windsor disponibiliza `video_thumbnail_url` e `video_url`, mas ambas são URLs assinadas e temporárias; a UI deve usar a miniatura somente quando válida e sempre manter fallback textual.

## Campos validados para o contrato

| Consulta | Dimensões | Métricas |
|---|---|---|
| Diário | `account_id`, `account_name`, `currency`, `date` | `spend`, `onsite_form`, `conversions`, `impressions`, `reach`, `clicks`, `cpm`, `cpc`, `ctr`, `engagements`, `engagement_rate`, `comments`, `shares`, `average_video_play` |
| Campanhas | `campaign_id`, `campaign`, `campaign_operation_status`, `campaign_status`, `campaign_optimization_goal` | mesmos KPIs principais |
| Grupos | `campaign_id`, `campaign`, `ad_group_id`, `ad_group_name`, `ad_group_operation_status`, `adgroup_status`, `placement`, `placement_type`, `budget`, `bid_strategy` | mesmos KPIs principais |
| Anúncios | IDs e nomes de campanha/grupo/anúncio, status, texto, formato, CTA, `video_id`, `video_thumbnail_url`, `video_url`, `image_url`, `ad_url` | mesmos KPIs principais, engajamentos, comentários, compartilhamentos e tempo médio de vídeo |
| Demografia | `age`, `gender` | `spend`, `conversions`, `impressions`, `reach`, `clicks`, `ctr` |
| Região | `province_name` isolado | `spend`, `conversions`, `impressions`, `reach`, `clicks`, `ctr` |

## Restrições verificadas

`onsite_form` representa o Lead do formulário nativo TikTok e é a métrica canônica para o resumo, diário, campanhas, grupos e anúncios. Na quebra de idade/gênero, a API retorna os 86 `onsite_form` em uma linha sem dimensão e distribui 86 `conversions` nas combinações demográficas; portanto a aba deve rotular a métrica demográfica como conversões atribuídas, não como formulários nativos. Para região, a combinação `country_code` + `province_id` foi rejeitada pela API; `province_name` isolado funciona e distribui as 86 conversões. Referência de agrupamento informada no erro da fonte: https://business-api.tiktok.com/portal/docs?id=1751454103714818.

Não há entrega antes de 13/08 no período auditado. Consultas e cache devem manter corte D-1, identidade por `account_id`, validação de cobertura e rejeição de bundles sem linhas diárias ou campanhas.

## Evidências locais

- Catálogo integral de campos: `/home/ubuntu/.mcp/tool-results/2026-08-17_18-43-03.903850276_windsor-ai_get_fields_6cf347e4.json`
- Série diária: `/home/ubuntu/.mcp/tool-results/2026-08-17_18-44-01.504104114_windsor-ai_get_data_c4184e56.json`
- Campanha: `/home/ubuntu/.mcp/tool-results/2026-08-17_18-44-14.954961873_windsor-ai_get_data_4b985170.json`
- Grupo: `/home/ubuntu/.mcp/tool-results/2026-08-17_18-44-31.717949857_windsor-ai_get_data_ade4ca7c.json`
- Anúncio/criativo: `/home/ubuntu/.mcp/tool-results/2026-08-17_18-44-51.202012693_windsor-ai_get_data_afca8f88.json`
- Demografia: `/home/ubuntu/.mcp/tool-results/2026-08-17_18-45-21.468520204_windsor-ai_get_data_a98e2a3d.json`
- Região válida: `/home/ubuntu/.mcp/tool-results/2026-08-17_18-45-56.130628266_windsor-ai_get_data_c3a8558e.json`
