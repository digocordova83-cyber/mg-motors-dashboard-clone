# Reconciliação de Leads — setembro de 2026

**Data da auditoria:** 30/09/2026  
**Período analisado:** 01 a 29/09/2026 (último dia fechado disponível)  
**Fonte:** consolidado oficial de Leads e base canônica do dashboard.

## Resultado consolidado

| Controle | Fonte oficial | Base canônica | Diferença |
| --- | ---: | ---: | ---: |
| Leads válidos de setembro (01–29/09) | **9.659** | **9.659** | **0** |
| Dias com divergência | 0 de 29 | 0 de 29 | **0** |
| Leads válidos não contabilizados | 0 | — | **0** |

A auditoria comparou cada dia de setembro entre o CSV canônico gerado pelo consolidado oficial e a tabela de Leads do dashboard. Os 29 dias fecham no mesmo total; portanto, **não há Lead válido faltando para redistribuir**. Nenhum dado foi deslocado entre datas, pois a data original corrigida da fonte é preservada como registro realizado.

## Reconciliação do dia 29/09

| Visão | Site | Meta | Mercado Livre | Webmotors | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Registros brutos na planilha de origem | **83** | **190** | — | — | — |
| Válidos antes de deduplicação | 67 | 190 | 22 | 44 | 323 |
| Duplicatas internas removidas | 3 | 0 | 0 | 0 | 3 |
| Base por canal de origem | **64** | **190** | **22** | **44** | **320** |

### Site: por que 83 se tornam 64 no dashboard

Os **83** são os registros brutos recebidos no Site em 29/09. Desses, **16** foram rejeitados pelo catálogo operacional porque o modelo informado não corresponde a MG4 Urban, MG4, MGS5 ou Cyberster. Restaram 67 registros válidos; a deduplicação identificou **3 repetidos dentro do próprio Site**, resultando em **64 oportunidades únicas** por origem Site.

Na visão de canal de performance, 26 dessas 64 oportunidades são MG4 Urban e aparecem em **Campanha Urban**. Por isso, o canal final `Site` mostra **38**, enquanto `Site` como origem mostra **64**:

| Corte do Site em 29/09 | Leads |
| --- | ---: |
| Origem Site, únicos e válidos | **64** |
| Reclassificados para Campanha Urban (MG4 Urban) | 26 |
| Permanecem no canal Site | **38** |

### Meta: por que o canal final não mostra todo o volume de origem

Na planilha oficial usada pelo dashboard, Meta possui **190** registros datados de 29/09 — não foram encontrados 200 registros nesse recorte. Os 190 são válidos e únicos. Desses, **112** são MG4 Urban e, pela regra já vigente, são reportados em **Campanha Urban**. Os outros 78 permanecem no canal final Meta:

| Corte da Meta em 29/09 | Leads |
| --- | ---: |
| Origem Meta, válidos e únicos | **190** |
| Reclassificados para Campanha Urban (MG4 Urban) | 112 |
| Permanecem no canal Meta | **78** |

Se houver um relatório externo apontando 200 Meta, ele usa uma base/recorte diferente da planilha oficial de Leads consumida pelo dashboard. O número não foi ajustado manualmente, pois não há 200 registros de Meta em 29/09 na fonte auditada.

## Regras preservadas

- Concessionária permanece exatamente como fornecida na planilha original.
- Registros sem concessionária continuam classificados como oportunidades em qualificação, sem distribuição artificial.
- TikTok Live permanece separado de TikTok Ads.
- Modelos fora do catálogo operacional continuam excluídos até que o catálogo seja oficialmente ampliado.
- Leads não são distribuídos em dias diferentes sem data rastreável na fonte.
