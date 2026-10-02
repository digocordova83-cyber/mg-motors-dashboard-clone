# Atualização do dashboard — 02/10/2026

**Corte solicitado:** dados até 01/10/2026 (D-1)  
**Fuso operacional:** America/Sao_Paulo  
**Fontes:** Planilha oficial de Leads, Windsor.ai e Daily Sales FUP XLSX.

## Resultado consolidado

| Área | Situação | Cobertura confirmada |
|---|---|---|
| Leads | Atualizada pela automação oficial | 01/10/2026 |
| Google Ads | Snapshot Windsor atualizado | 01/10/2026 |
| Meta Ads | Snapshot Windsor atualizado | 01/10/2026 |
| TikTok Ads | Mantido sem estimativa | 30/09/2026 |
| Retail | Último lote oficial já conciliado | Outubro, Semana 5 |

## Leads

A prévia da planilha oficial encontrou 243 registros novos e nenhuma remoção da fonte. A carga canônica foi aplicada, elevando a base de 36.264 para **36.507 Leads**. A leitura analítica confirmou cobertura até 01/10, com 243 Leads na competência de outubro no primeiro dia disponível.

A reexecução da mesma carga retornou `NO_CHANGES`. A base contém 36.507 hashes distintos para 36.507 registros, sem duplicação. Duas linhas sem modelo informado permanecem excluídas da importação para não criar classificação artificial. O ajuste de competência julho → setembro, previamente autorizado, continua aplicado de forma determinística e não foi replicado na reexecução.

## Mídia

A atualização manual do Windsor confirmou Google Ads e Meta Ads até 01/10. O Meta Ads registrou R$ 2.141,16 de gasto e 137 Leads em 01/10; o painel de pacing de outubro compara esse realizado à verba líquida configurada, sem tratar projeção como gasto efetivo.

O Windsor não retornou TikTok Ads completo para 01/10. O dashboard preserva o último snapshot completo, de 30/09, e não preenche o dia pendente com estimativa. Não há ROAS publicável nesta atualização porque os snapshots dos conectores não trazem valor de receita/conversão atribuída; nenhum ROAS foi inferido.

## Retail

O lote oficial mais recente permanece `261001_Daily_Sales_FUP_1_.xlsx`, para a competência de outubro. A referência do dashboard é a Semana 5, com **631 MTD Retail Orders**. A reconciliação passou: 26 dealers, 26 correspondentes, zero sem correspondência e total de dealers igual ao total reportado.

## Validação

- Testes direcionados de Leads, mídia e serviços: 42 aprovados.
- Checagem TypeScript: aprovada.
- Snapshot e auditoria de fontes registrados sem alterar dados incompletos.
