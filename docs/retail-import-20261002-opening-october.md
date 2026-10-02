# Primeira atualização de MTD Retail Order — outubro de 2026

**Arquivo oficial:** `261002_Daily_Sales_FUP.xlsx`  
**Competência:** outubro de 2026  
**Data de importação:** 02/10/2026, fuso America/Sao_Paulo

## Diagnóstico da prévia

O arquivo contém 9 MTD Retail Orders no `DAILY_FUP`. A planilha inicia a competência de outubro na coluna `W6` do `WEEKLY_RET`, enquanto as colunas `W1`–`W5` ainda estão zeradas. A prévia anterior rejeitava corretamente a divergência formal, mas não reconhecia que essa coluna representa a primeira medição do mês novo.

O parser passou a mapear `W6` para a Semana 1 **somente** quando:

1. o total de `W6` reconcilia exatamente com o MTD Retail do `DAILY_FUP`;
2. não existe semana de `W1` a `W5` que reconcilie com esse MTD; e
3. não há Retail reportado em `W1` a `W5`.

Isso impede que dados de uma semana futura sejam usados indevidamente no fechamento de uma competência já em andamento.

## Resultado importado

| Indicador | Resultado |
|---|---:|
| Referência no dashboard | Semana 1 de outubro |
| MTD Retail Orders | 9 |
| Dealers no arquivo | 26 |
| Dealers correspondentes | 26 |
| Dealers sem correspondência | 0 |
| Linhas regionais reconciliadas | 2 |
| Vendas conciliadas | 9 |
| Leads no período de referência | 202 |
| Conversão Leads → Retail | 4,46% |
| Leads por venda | 22,44 |

A importação criou o lote `930001` com 29 linhas auditáveis. A reexecução retornou `NO_CHANGES`, confirmando idempotência.

## Validações

- Prévia do arquivo: válida, com reconciliação aprovada.
- Testes completos: 355 aprovados.
- TypeScript: aprovado.
- Build de produção: aprovado.
- Concessionárias da planilha não encontradas no dashboard: nenhuma.
