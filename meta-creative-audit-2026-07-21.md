# Auditoria de criativos Meta Ads — 21/07/2026

**Fonte:** endpoint público autenticado do conector Windsor.ai para Facebook Ads: `https://connectors.windsor.ai/facebook`.

**Conta:** `1418731006678061` — Ag. BBRO - MG Motor Brasil - AUT.

**Período consultado:** 01/07/2026 a 20/07/2026.

**Campos consultados:** `campaign_id`, `campaign`, `adset_id`, `adset_name`, `ad_id`, `ad_name`, `creative_id`, `thumbnail_url`, `image_url`, `promoted_post_full_picture`, `placement_ad_thumbnail_url`, `effective_instagram_media__thumbnail_url`, `spend`, `actions_lead`, `impressions`, `reach` e `clicks`.

| Verificação | Resultado |
|---|---:|
| Linhas de anúncios | 34 |
| `ad_id` distintos | 34 |
| `creative_id` distintos | 28 |
| Linhas sem `ad_id` | 0 |
| Linhas sem `creative_id` | 0 |
| Linhas com `thumbnail_url` | 34 |
| Linhas com `promoted_post_full_picture` | 4 |
| Linhas com `placement_ad_thumbnail_url` | 6 |
| Linhas com `image_url` | 0 |
| Linhas com `effective_instagram_media__thumbnail_url` | 0 |

A consulta confirmou que vários `thumbnail_url` têm **o mesmo arquivo canônico** para `creative_id` diferentes, embora a query string temporária varie. Por exemplo, anúncios de Cyberster, MG4 e MG5 apontavam para o caminho canônico `/v/t45.1600-4/747840167_27346033295088017_7528282025462060129_n.png`. O mesmo padrão ocorreu com imagens de perfil no caminho `/v/t39.30808-1/742338722_122144181927272885_761830039122972966_n.jpg`.

Isso comprova que comparar a URL completa é insuficiente: parâmetros temporários mascaram a reutilização do mesmo asset. A regra implementada usa o caminho canônico da URL, associa-o ao `creative_id`, prioriza campos de mídia mais específicos e rejeita imagens cujo asset canônico apareça em múltiplos `creative_id`. Nesses casos, o dashboard exibe placeholder neutro, mantendo `ad_id`, `creative_id` e nome real visíveis para auditoria.

> Nenhuma credencial ou valor de chave de API foi registrado neste documento.

## Validação visual — sessão `mgmotors`

Em 21/07/2026, o preview foi aberto com a conta `mgmotors`. O cabeçalho, navegação, filtros, métricas, estados de carregamento e textos do módulo Meta Ads apareceram em **inglês**. A navegação visível continha Google Ads, Meta Ads, Leads e Media Plan, sem expor os módulos restritos de otimizações e histórico.

No ranking **Top-performing creatives**, os cards exibiram `Ad ID` e `Creative ID` reais. A imagem específica do criativo `MG 4 Hot | Lookalike do Form...` foi exibida; cards cuja única mídia disponível era um asset genérico compartilhado mostraram o placeholder localizado `Image unavailable from source`. Outros criativos com mídia específica válida, como `MG 4 Cold | Lookalike do Form...` e `Cyberster Hot | Lookalike do Form...`, exibiram imagens diferentes e coerentes. Não foi observada repetição indevida da mesma imagem entre `creative_id` distintos nos nove cards visíveis.

A tentativa de redimensionar a janela interativa via JavaScript foi bloqueada pelo ambiente do navegador, que permaneceu em `1280 × 1100`. A sessão autenticada e o conteúdo Meta Ads permaneceram estáveis durante a tentativa. A checagem móvel foi então encaminhada para a captura dedicada com viewport móvel, em vez de inferir responsividade por zoom ou largura artificial de elemento.

## Validação móvel autenticada — 390 × 844

Uma sessão assinada temporária foi gerada a partir da identidade persistida de `mgmotors`, **sem usar nem transmitir a senha**, e aberta em Chromium headless com emulação móvel real de `390 × 844`. O resultado confirmou `locale: en-US`, presença de `Ad ID` e `Creative ID`, largura do documento igual à viewport (`390 px`) e ausência de overflow horizontal.

Na captura, os cards aparecem em **coluna única**, com a imagem específica do primeiro criativo, nome, modelo, IDs e métricas legíveis. O criativo seguinte exibe o placeholder localizado `Image unavailable from source`, sem herdar indevidamente a imagem anterior. A navegação móvel permanece acessível e o módulo Meta Ads aparece selecionado.

Evidência visual: `/home/ubuntu/webdev-static-assets/mg-meta-creatives-mobile-validation.png`.
