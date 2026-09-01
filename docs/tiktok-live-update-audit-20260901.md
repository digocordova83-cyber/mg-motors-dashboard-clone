# Auditoria da atualização TikTok Live — 01/09/2026

**Execução oficial:** 01/09/2026 às 14:49 (GMT-3)  
**Importação:** lote 2130001  
**Ator:** `manus-tiktok-live-manual-update`

## Resultado executivo

A planilha oficial de Leads foi consolidada e submetida ao fluxo transacional de substituição integral. O canal **TikTok Live permaneceu separado de TikTok Ads** em todas as dimensões persistidas. A base passou de **25.879 para 26.028 Leads únicos**, variação líquida de **149 registros**.

| Indicador | Resultado |
| --- | ---: |
| Linhas encontradas na fonte | 26.776 |
| Linhas válidas no arquivo mestre | 26.756 |
| Duplicatas internas descartadas | 728 |
| Registros novos detectados | 150 |
| Registros removidos da fonte | 1 |
| Variação líquida da base | **+149** |
| Base antes | 25.879 |
| Base depois | **26.028** |
| Linhas inválidas excluídas na origem | 20 |
| Linhas inválidas no CSV canônico | 0 |

## TikTok Live

O TikTok Live aumentou de **31 para 180 Leads**, exatamente **149 registros líquidos adicionais**. O TikTok Ads permaneceu com **233 Leads**, comprovando que os dois canais não foram combinados.

| Canal | Antes | Depois | Variação |
| --- | ---: | ---: | ---: |
| TikTok Live | 31 | **180** | **+149** |
| TikTok Ads | 233 | **233** | 0 |

| Modelo em TikTok Live | Leads |
| --- | ---: |
| Indisponível | 162 |
| MG4 Urban | 15 |
| MGS5 | 2 |
| MG4 | 1 |
| **Total** | **180** |

Os registros TikTok Live estão distribuídos entre 24 e 30/08: 31, 30, 38, 21, 21, 8 e 31 Leads por dia, respectivamente. Em 31/08, o dashboard possui **198 Leads totais**, sem novos registros TikTok Live ou TikTok Ads nessa data.

## Duplicidades e inválidos

As **728 duplicatas internas** foram descartadas pelo mesmo mecanismo de hash usado no upload manual. As **20 linhas inválidas da origem** permaneceram fora do CSV canônico: 19 registros da aba Site com modelo vazio, XPOWER ou IM6 e um registro do Mercado Livre sem modelo mapeado. Nenhuma linha inválida chegou ao importador.

## Idempotência

A mesma sincronização foi executada novamente às 14:52. O resultado foi `NO_CHANGES`, com **26.028 registros já existentes**, **zero novos**, **zero removidos** e **zero linhas gravadas**. Os totais permaneceram em 180 TikTok Live, 233 TikTok Ads e 26.028 Leads na base integral.

## Arquivos de auditoria

- Primeira execução: `/tmp/mg-tiktoklive-update-20260901-live/20260901-144927/`
- Reexecução idempotente: `/tmp/mg-tiktoklive-update-20260901-idempotency/20260901-145208/`
- Arquivo persistido: `/manus-storage/lead-imports/5e000fb1fa75/leads-mg-import-20260901-144927_8b3259bc.csv`

