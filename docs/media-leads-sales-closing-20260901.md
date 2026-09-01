# Fechamento Media, Leads & Sales Performance — 01/09/2026

**Fonte de Leads e vendas no dashboard:** [MG Motors Dashboard — Leads](https://mgdashclone-eakebkle.manus.space/?module=leads&tab=leads)  
**Fonte de vendas:** `260831DailySalesPlanningReport.pdf`, SHA-256 `504dbdc008b0260b30c72ed74d06f943424abb3dcd8e6f18aa07a51c5637ec41`.

## Dados confirmados antes da reexecução

| Indicador | Resultado |
| --- | ---: |
| Leads de agosto | 14.237 |
| MTD Retail Order — Semana 5 | 660 |
| Conversão da rede | 4,85% |
| Leads por MTD Retail Order | 20,63 |
| Dealers conciliados no relatório | 26/26 |
| Unmatched | 0 |
| Lote válido existente | 630001 |

## Reexecução do PDF

O PDF de 31/08 foi reenviado pelo campo oficial `Selecionar CSV ou PDF de MTD Retail Order` após a conclusão e apresentação do arquivo. A aplicação entrou no estado **“Lendo PDF — Lendo a tabela Weekly Target Achievement - Retail e validando a reconciliação”** e permaneceu aguardando a resposta do extrator por mais de três minutos. Durante toda a espera, os indicadores persistidos permaneceram em **660 MTD Retail Orders, 4,85% de conversão e zero sem correspondência**, sem alteração visual ou parcial da base.

Após o limite de espera, a página foi recarregada e o histórico oficial `leads.weeklySalesImportHistory` foi consultado. O primeiro e único registro para o hash `504dbdc008b0260b30c72ed74d06f943424abb3dcd8e6f18aa07a51c5637ec41` continua sendo o **lote 630001**, com status `COMPLETED`, 29 linhas inseridas na execução original, 26 linhas de dealers, duas linhas regionais, uma linha total, **26 dealers conciliados**, **zero unmatched**, total de dealers igual a 660, total regional igual a 660 e reconciliação aprovada.

Nenhum novo lote foi criado pela reexecução e os indicadores permaneceram em 660 MTD Retail Orders. A tentativa confirmou o comportamento idempotente do relatório idêntico: **zero novas linhas e nenhuma duplicação na base de vendas**. O extrator demorou além do limite da interface, mas isso não gerou escrita parcial nem alteração do lote válido.

## Apresentação final

O deck **Media, Leads & Sales Performance — August 2026** foi atualizado em 12 páginas e apresentado no URI `manus-slides://eJL85FoEC0M25MGOI6V15l`. O período é 01–31/08/2026, com 14.237 Leads, 660 MTD Retail Orders, conversão de 4,85% e dados finais de Google Ads, Meta Ads e TikTok Ads. A auditoria estática confirmou ausência de conteúdo financeiro operacional, comprovantes, pagamentos e remuneração BBRO.
