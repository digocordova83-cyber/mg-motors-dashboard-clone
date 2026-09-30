# Catálogo de modelos de Leads — IM6 e XPower

**Data:** 30/09/2026, fuso America/Sao_Paulo  
**Escopo:** catálogo canônico de modelos, consolidação oficial de Leads e taxonomia de produtos de mídia.

## Regra aprovada

| Valor recebido na fonte | Classificação canônica | Tratamento no dashboard |
| --- | --- | --- |
| `IM6`, `IM 6`, `MG IM6` | `IM6` | Novo modelo independente nos indicadores de Leads; `MG IM6` na taxonomia de campanhas de mídia. |
| `XPower`, `X Power`, `MG4 XPower` | `MG4` | Incluído no agregado de MG4; não cria um modelo separado. |

A normalização guarda o valor bruto do modelo para rastreabilidade. O campo de concessionária também permanece preservado no arquivo consolidado de origem; a camada analítica continua utilizando sua normalização existente apenas para agrupamento seguro.

## Reprocessamento oficial

A automação oficial foi reexecutada a partir da fonte Google consolidada, sem alterar datas ou redistribuir registros.

| Indicador | Resultado |
| --- | ---: |
| Linhas da fonte | 36.566 |
| Registros válidos no mestre | 36.564 |
| Linhas sem modelo e ainda rejeitadas | 2 |
| Registros recuperados pela nova regra | 46 |
| Base canônica antes | 35.719 |
| Base canônica depois | 35.764 |
| Variação líquida | +45 |
| Reexecução de idempotência | `NO_CHANGES` |

A diferença entre os 46 registros agora elegíveis e os 45 Leads líquidos decorre da deduplicação canônica de uma identidade já presente. Não foi inserido dado estimado ou manualmente distribuído.

## Resultado do catálogo

Na fonte consolidada, o IM6 passa a ter **75 registros** classificados. Em setembro, até 29/09, o dashboard apresenta **26 Leads IM6**; XPower está agregado a MG4, preservando a base de comparação do modelo.

## Validações

- Teste do consolidado Python: **7 aprovados**.
- Teste do consolidado Interlagos: aprovado, com XPower classificado como MG4.
- Suíte determinística: **56 arquivos / 349 testes aprovados**.
- TypeScript: aprovado.
- Build de produção: aprovado.
- Reconciliação analítica: total da base, distribuição diária e auditoria por concessionária reconciliam em **35.764 Leads**.

## Limites preservados

- Os dois registros com modelo vazio seguem rejeitados para não inventar classificação.
- TikTok Live permanece separado de TikTok Ads.
- Não houve alteração de origem de canal, data corrigida ou distribuição de Leads por concessionária.
