# Atualização do dashboard — dados até 02/09/2026

**Data da execução:** 03/09/2026  
**Timezone operacional:** America/Sao_Paulo  
**Escopo:** Leads, Google Ads, Meta Ads, TikTok Ads/TikTok Live e MTD Retail Order

## Resumo executivo

A atualização D-1 foi concluída com cobertura real até 02/09 para Leads, Google Ads, Meta Ads e TikTok Ads. A base de Leads passou de 26.112 para 26.404 registros, acréscimo líquido de 292. O dia 02/09 contém 275 Leads. As três fontes de mídia retornaram sucesso pelo Windsor e foram reexecutadas sem duplicar snapshots. Não havia Daily Sales Planning Report posterior ao arquivo de 01/09 disponível no ambiente; por isso as vendas permaneceram no último lote oficial válido, sem estimativa ou substituição indevida.

| Base | Resultado |
| --- | ---: |
| Leads antes | 26.112 |
| Novos Leads líquidos | 292 |
| Leads depois | **26.404** |
| Leads de 02/09 | **275** |
| MTD Retail Order preservado | **674** |
| Dealers conciliados | **25/25** |
| Unmatched | **0** |

## Leads

A origem continha 27.156 linhas. O consolidado oficial produziu 27.136 linhas válidas, descartou 732 duplicatas internas e excluiu 20 linhas inválidas antes do importador. Não houve remoção de registros existentes. O lote 2190001 realizou a substituição integral transacional e levou a base de 26.112 para 26.404 Leads.

Em 02/09 foram armazenados 275 Leads: 111 em Campanha Urban, 88 em Meta, 73 em Site e três em Mercado Livre. Pela origem bruta, o dia contém 161 Meta, 107 Site e sete Mercado Livre. A composição por produto é 135 MG4, 111 MG4 Urban, 20 MGS5 e nove Cyberster.

A reexecução oficial retornou `NO_CHANGES`: 26.404 registros antes e depois, zero novos, zero removidos e zero linhas gravadas. TikTok Ads e TikTok Live permaneceram separados na base integral, com 233 e 180 registros, respectivamente.

## Mídia paga

| Fonte | Cobertura | Estado | Janela aquecida e indicadores |
| --- | --- | --- | --- |
| Google Ads | 02/09 | **SUCCESS** | 04/08–02/09; R$ 497.724,69; 3.189,9 conversões; 107 campanhas |
| Meta Ads | 02/09 | **SUCCESS** | 27/08–02/09; R$ 22.759,09; 1.388 Leads; cinco campanhas |
| TikTok Ads | 02/09 | **SUCCESS** | 27/08–02/09; R$ 2.205,57; 42 Leads; uma campanha |

As três fontes usaram `windsor-live` e retornaram `dataThroughDate` igual a 02/09. A reexecução utilizou a mesma identidade por fonte e data. A tabela de auditoria manteve uma única linha por fonte em 02/09, incrementando apenas `attemptCount`, e cada período permaneceu com um único snapshot. Não foi calculado ROAS porque o dashboard não possui receita atribuída por plataforma; apresentar um valor nesse contexto seria metodologicamente incorreto.

## MTD Retail Order

O arquivo mais recente disponível continuava sendo `260901DailySalesPlanningReport.pdf`, lote 660001, competência 2026-09 e semana 5. Como não havia PDF posterior no ambiente, nenhum novo lote foi criado.

O último valor oficial permanece em 674 MTD Retail Orders, com 25 dealers conciliados, zero unmatched e fechamento de 674 tanto por dealer quanto por estado. A fonte segue sendo a tabela Weekly Target Achievement — Retail do relatório oficial.

## Reconciliação e qualidade

Para 01–02/09, Leads por canal, modelo, região e dealer reconciliam em 359 registros. Vendas por dealer e estado reconciliam em 674, matched mais unmatched fecha no total e não existem dealers sem correspondência.

A validação técnica foi concluída com **53 arquivos de teste e 322 testes aprovados**, TypeScript aprovado e build de produção aprovado. Permanecem apenas os avisos não bloqueantes já conhecidos sobre configuração do pnpm e tamanho do chunk do Vite.

## Referências operacionais

- Leads — prévia: `/tmp/mg-leads-update-20260903-preview/20260903-092821/`
- Leads — atualização: `/tmp/mg-leads-update-20260903-final/20260903-093026/`
- Leads — idempotência: `/tmp/mg-leads-update-20260903-idempotency/20260903-093224/`
- Mídia — atualização: `/tmp/mg-media-refresh-20260902.json`
- Mídia — reexecução: `/tmp/mg-media-refresh-20260902-idempotency.json`
- Qualidade técnica: `/home/ubuntu/terminal_full_output/2026-09-03_12-39-18_990317_1133.txt`
