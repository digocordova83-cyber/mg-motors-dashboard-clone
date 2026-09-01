# Auditoria da atualização do dashboard — 01/09/2026

**Responsável pelo relatório:** Manus AI  
**Execução:** 01/09/2026, 13:35 (GMT-3)  
**Escopo:** base de Leads do dashboard MG Motors; MTD Retail Order preservado no último relatório válido.

## Resultado executivo

A planilha oficial de Leads foi consolidada duas vezes de forma isolada, produzindo arquivos canônicos idênticos, com SHA-256 `2342112eec2ada6874fc2ae10b1da1d71168f3d7c134b13f35a2f5e79a8d0dfd`. A atualização foi executada pelo fluxo administrativo oficial da aplicação publicada, após pré-validação e confirmação transacional.[1] [2]

A base ativa aumentou de **25.670 para 25.879 Leads únicos**, acréscimo líquido de **209 registros** e **zero remoções**. A pré-validação do importador leu **26.607 linhas canônicas válidas**, descartou **728 duplicatas internas** e encontrou **zero linhas inválidas no arquivo canônico**. Antes dessa etapa, o consolidado de origem excluiu **20 linhas com modelo inválido ou não mapeado**, mantendo-as fora do CSV de importação conforme a regra existente.

| Indicador | Antes | Depois | Variação/resultado |
| --- | ---: | ---: | ---: |
| Base integral de Leads únicos | 25.670 | 25.879 | **+209** |
| Leads de agosto no corte D-1 | 14.028 | 14.237 | **+209** |
| Linhas canônicas lidas | — | 26.607 | 100% válidas no importador |
| Duplicatas internas descartadas | — | 728 | Não inseridas |
| Inválidas no importador | — | 0 | Nenhuma |
| Inválidas excluídas na consolidação de origem | — | 20 | Não enviadas ao importador |
| Remoções em relação à base anterior | — | 0 | Nenhuma |

## Duplicidades por canal

As **728 duplicatas exatas** foram descartadas automaticamente, preservando a primeira ocorrência válida de cada Lead. O relatório oficial da prévia apresentou a seguinte distribuição.

| Canal no arquivo canônico | Duplicatas internas |
| --- | ---: |
| Site | 565 |
| Mercado Livre | 84 |
| Campanha Urban | 38 |
| Webmotors | 24 |
| UOL | 15 |
| Interlagos | 2 |
| **Total** | **728** |

## Reconciliação do período de agosto

O total de **14.237 Leads** do período está integralmente reconciliado por canal e por modelo. A distribuição por concessionária também fecha exatamente: **14.057 Leads atribuídos a dealers + 180 Leads em qualificação = 14.237**, equivalentes a **98,74%** e **1,26%** do total, respectivamente. Os 180 registros em qualificação representam o tratamento operacional previsto e não uma perda de dados.

| Canal de origem | Leads em agosto |
| --- | ---: |
| Meta | 8.215 |
| Site | 3.498 |
| Webmotors | 1.470 |
| Mercado Livre | 464 |
| Interlagos | 326 |
| TikTok | 233 |
| TikTok Live | 31 |
| **Total** | **14.237** |

| Modelo | Leads em agosto |
| --- | ---: |
| MG4 | 7.312 |
| MG4 Urban | 4.815 |
| MGS5 | 1.094 |
| Cyberster | 864 |
| Indisponível | 152 |
| **Total** | **14.237** |

O detalhamento de **MG4 Urban** preservou a origem: Meta 2.880, Site 1.112, Webmotors 399, TikTok 233, Mercado Livre 171 e Interlagos 20, totalizando exatamente **4.815 Leads**. Dessa forma, Interlagos continua como canal de origem separado e TikTok permanece distinto de TikTok Live.

## Idempotência

O mesmo arquivo foi submetido novamente após a atualização. A aplicação reconheceu o lote já processado e retornou **zero inserções**, classificando as **25.879 linhas únicas como já existentes** e mantendo as **728 duplicatas internas**. O total de 26.607 linhas foi reconciliado como `25.879 existentes + 728 duplicatas internas`, sem alterar a base. A atualização é, portanto, **idempotente**.

## MTD Retail Order

Nenhum novo PDF de vendas foi fornecido nesta execução. A base de **MTD Retail Order permanece em 660 pedidos**, referente ao relatório válido de 31/08/2026, com **26 de 26 dealers do documento conciliados** e **zero unmatched**. No período de agosto, a taxa exibida após a atualização de Leads é **4,85%**, calculada sobre 660 pedidos e 14.237 Leads.

## Observação de infraestrutura

O mecanismo gerenciado recuperou o checkout Git e o executor TypeScript após a atualização operacional. Entretanto, o diretório local continua incompleto: `server/leadsImportService.ts`, `server/db.ts` e `server/storage.ts` permanecem ausentes. A atualização operacional foi concluída no ambiente publicado pelo fluxo administrativo oficial, com prévia, confirmação transacional e reexecução idempotente. A restauração integral desses serviços permanece como tarefa técnica separada e não altera os números já persistidos no dashboard.

## Referências

[1]: https://docs.google.com/spreadsheets/d/1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8/edit "Planilha oficial de Leads MG"
[2]: https://mgdashclone-eakebkle.manus.space/?module=leads&tab=leads "Dashboard operacional MG Motors — Leads"
