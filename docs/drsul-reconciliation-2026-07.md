# Reconciliação de Leads — DRSUL - PORTO ALEGRE

**Data da auditoria:** 23/07/2026  
**Período validado:** 01/07/2026 a 22/07/2026, conforme `Data Corrigida` e corte D-1  
**Fonte auditada:** arquivo consolidado mais recente processado pelo próprio parser canônico da aplicação

## Conclusão

O total correto de **DRSUL - PORTO ALEGRE** no período é **632 Leads**. A diferença entre as 650 ocorrências brutas do CSV e as 632 linhas exibidas não decorre de erro de normalização, perda de registros ou falha de consulta. Ela é integralmente explicada por **16 ocorrências duplicadas exatas**, identificadas pelo mesmo `contentHash`, e **2 registros únicos com `Data Corrigida` em 30/06/2026**, fora do intervalo mensal selecionado.

> **Reconciliação:** 650 linhas brutas − 16 repetições exatas − 2 linhas fora do período = **632 Leads válidos**.

| Etapa | Linhas | Regra aplicada |
| --- | ---: | --- |
| Ocorrências brutas de DRSUL no CSV | 650 | Grafia de origem `DRSUL - PORTO ALEGRE` |
| Ocorrências duplicadas exatas | 16 | Mesmo `contentHash`; apenas a primeira ocorrência é preservada |
| Registros únicos após deduplicação | 634 | Conteúdos distintos preservados |
| Registros fora de 01/07–22/07 | 2 | `Data Corrigida` igual a 30/06/2026 |
| Total válido no período | **632** | Base exibida e usada nas métricas |

## Métricas revalidadas

A interface autenticada e a auditoria do arquivo apresentaram os mesmos valores. Não foi necessária qualquer correção no banco, no parser ou nas fórmulas.

| Indicador | Valor validado |
| --- | ---: |
| Leads DRSUL no período | 632 |
| Vendas acumuladas — Semana 4 | 34 |
| Conversão | 5,38% |
| Leads por venda | 18,59 |
| Estimativa arredondada para uma venda | 19 |
| Atingimento da meta mensal de 25 vendas | 136,2% |

## Histórico acumulado

| Semana | Meta | Leads acumulados | Vendas acumuladas | Atingimento |
| --- | ---: | ---: | ---: | ---: |
| 1 | 2,3 | 65 | 3 | 129,3% |
| 2 | 7,4 | 189 | 8 | 108,7% |
| 3 | 15,4 | 588 | 34 | 221,4% |
| 4 — referência mensal | 25 | 632 | 34 | 136,2% |

## Distribuição por canal

| Canal | Leads | Participação |
| --- | ---: | ---: |
| Site | 307 | 48,58% |
| Meta | 217 | 34,34% |
| Webmotors | 73 | 11,55% |
| Mercado Livre | 19 | 3,01% |
| UOL | 16 | 2,53% |
| **Total reconciliado** | **632** | **100,00%** |

## Decisão técnica

Como o total, o histórico semanal, a conversão e a distribuição por canal reconciliam integralmente com as regras canônicas da aplicação, **nenhuma alteração corretiva foi aplicada**. Modificar o total para 650 reintroduziria repetições exatas e incluiria registros de junho em um filtro iniciado em julho, tornando a métrica incorreta.
