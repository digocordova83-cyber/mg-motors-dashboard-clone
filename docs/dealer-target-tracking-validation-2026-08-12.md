# Validação — acompanhamento de metas por concessionária

**Competência:** agosto de 2026  
**Período de Leads:** 01 a 11/08/2026  
**Referência de Retail:** Semana 3

## Reconciliação real

| Indicador | Realizado | Meta | Atingimento | Gap |
| --- | ---: | ---: | ---: | ---: |
| Leads atribuídos às 31 concessionárias | 3.255 | 11.996 | 27,13% | 8.741 |
| Sales reportadas | 178 | 548 | 32,48% | 370 |
| Conversão | 5,47% | 4,57% | 119,69% da referência | — |

As 31 linhas de meta estão conciliadas. O PDF semanal contém Sales para 24 dealers; os sete restantes aparecem como **não reportados**, nunca como zero. O realizado de Leads não inclui Leads em qualificação ou sem concessionária.

## Interface

Em desktop, quatro indicadores executivos aparecem acima da tabela por dealer. A tabela permite busca por concessionária/UF e ordenação por atingimento ou gap de Leads e Sales. Valores realizados e metas são mostrados lado a lado; conversão real e meta permanecem separadas.

Em mobile, a tabela desktop fica oculta e 31 cards responsivos são renderizados, cada um com Leads, Sales, atingimento e gap. A validação DOM confirmou `desktopTableVisible: none`, 31 cards e o resumo executivo em uma grade de duas colunas de 174,5 px dentro do canvas de 375 px.

## Permissões

O botão **Atualizar metas** é exibido apenas para usuários com `canImportLeads`. A conta `mgsales` permanece somente leitura; preview e confirmação são bloqueados pelo servidor. A importação possui hash esperado, preview auditável, storage e idempotência por competência.
