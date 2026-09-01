# Auditoria da planilha de metas por concessionária

**Arquivo:** `/home/ubuntu/upload/metas.xlsx`  
**Aba:** Página1  
**Data da auditoria:** 12/08/2026

## Estrutura

A planilha possui **31 concessionárias** e 11 colunas: DEALER, GOOGLE, META, PUBLYA, WEBMOTORS, MERCADO LIVRE, TIKTOK, TOTAL DEALER, SALES, WEIGHT e CONVERSION INVESTMENT. Não há coluna, aba, nome ou metadado explícito de competência. O arquivo também não contém fórmulas; todos os valores estão gravados como constantes.

## Totais observados

| Indicador | Total |
| --- | ---: |
| TOTAL DEALER | 11.996 |
| SALES | 548 |
| WEIGHT | 100,02% |
| CONVERSION INVESTMENT | R$ 916.000,02 |
| Soma das metas por canal | 12.008 |

Totais por canal: Google 6.019; Meta 3.734; Publya 614; Webmotors 579; Mercado Livre 442; TikTok 620.

## Alertas de qualidade

A soma das colunas de canal excede TOTAL DEALER em **12 Leads**, por arredondamentos distribuídos em várias linhas. Portanto, **TOTAL DEALER deve ser tratado como a meta oficial de Leads por concessionária**, sem recalculá-lo pela soma dos canais. A coluna SALES totaliza 548 e será tratada como a meta oficial de vendas.

Como o arquivo não informa competência, a importação precisa receber explicitamente o mês `AAAA-MM`. Para esta entrega, a competência será vinculada ao mês selecionado no dashboard; o histórico deve ser preservado por competência para futuras atualizações.

## Match esperado

As 31 linhas correspondem à rede oficial atual, mas usam abreviações e nomes históricos, como BDG, Inglaterra, Genial, Orletti, Baltic GUA, Barigui/PR e Tecar/GO. O match deve reutilizar o cadastro oficial, os aliases auditados e a chave canônica do painel de Vendas Semanais. Nenhuma meta deve ser associada por similaridade aproximada sem de-para explícito.
