# Validação visual — Relatório diário de Leads

Data da validação: 16/09/2026.

## Escopo validado

O botão `Gerar PDF diário` foi validado na aba `Leads`, utilizando o período selecionado de 01/09/2026 a 15/09/2026 e os dados reais carregados pelo dashboard. O relatório apresenta **4.721 Leads no período** e **389 Leads no último dia, 15/09/2026**.

O documento foi estruturado em quatro páginas A4 horizontais:

1. resumo executivo, evolução diária e pacing mensal;
2. desempenho por canal, Leads por modelo e MG4 Urban por origem;
3. primeira parte da distribuição por concessionária;
4. continuação da distribuição por concessionária.

## Resultado visual

A revisão autenticada confirmou títulos, datas, KPIs, gráfico, tabelas, cabeçalhos repetidos e numeração `Página X de 4`. A tabela de concessionárias foi dividida explicitamente em duas páginas para evitar cortes de linha e páginas sem cabeçalho.

O PDF contém somente indicadores operacionais de Leads. Não são renderizados investimento, CPL, custo, orçamento ou qualquer outro campo financeiro.

## Validações técnicas

Os 28 testes da aba Leads foram aprovados. A checagem TypeScript e o build de produção também foram concluídos sem erros. O isolamento de impressão remove os demais blocos do dashboard do fluxo impresso, preservando apenas o componente `data-leads-print-root`.
