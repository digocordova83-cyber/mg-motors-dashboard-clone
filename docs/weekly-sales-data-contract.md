# Contrato de dados — vendas semanais por concessionária

## Fonte e interpretação

O arquivo de referência é `pasted_file_naFyvz_basevendaMG-WeeklyTargetAchievement.csv`. Ele contém 28 linhas de dados: 25 concessionárias, duas regiões agregadas (`R01` e `R02`) e uma linha `Total`. O parser deve preservar todas as linhas e seus nomes originais. Linhas regionais e a linha total servem apenas à reconciliação; não entram novamente no agregado por concessionária.

A coluna **W4 Retail** é o valor acumulado de vendas usado como referência mensal. As Semanas 1–3 são preservadas para histórico, mas não são somadas à Semana 4. No arquivo auditado, a soma dos 25 dealers, a soma de R01/R02 e a linha Total reconciliam em **373 vendas** na Semana 4. A Semana 5 possui metas, mas não possui vendas preenchidas.

Como o CSV não contém data explícita, cada importação exige uma `competence` no formato `YYYY-MM`. A interface sugere o mês de D-1 e o administrador confirma ou altera antes de gravar. O `referenceDate` do lote é D-1 da data da importação, e os Leads usados nas métricas são filtrados de `competence-01` até esse `referenceDate`.

## Identidade, auditoria e atualização

| Elemento | Regra |
|---|---|
| Arquivo | SHA-256 dos bytes originais |
| Lote | `competence + sourceSha256` |
| Linha | `importId + sourceRowNumber` |
| Reimportação idêntica | Idempotente; retorna o lote já concluído |
| Novo arquivo na mesma competência | Cria novo lote e só substitui o snapshot ativo após concluir a transação |
| Falha de validação/importação | Preserva o snapshot ativo anterior |
| Duplicidade de dealer canônico | Preserva as linhas na prévia e bloqueia a confirmação até correção; nunca remove silenciosamente |
| Auditoria | Nome do arquivo, hash, usuário, contagens, timestamps UTC, competência e referência D-1 |

A atualização é exclusivamente manual. Um usuário com permissão administrativa seleciona o CSV, revisa a prévia e confirma a importação. Não há agendamento nem dependência externa.

## De/para confirmado para o arquivo de vendas

| Nome original no CSV | Nome canônico no dashboard |
|---|---|
| BALTIC BARUERI | Baltic Shopping Tamboré |
| INDIANA SALVADOR | Indiana Salvador - 3966031 |
| JRCA MACEIÓ | JRCA |
| TORIBA SÃO PAULO | TORIBA - CEASA |
| POTENZA RIO DE JANEIRO | POTENZA - RECREIO |
| TECAR BRASÍLIA | TECAR - SIA BRASILIA |

Os demais nomes passam primeiro pelo de/para explícito já existente no dashboard. Sem correspondência explícita, o nome original é preservado e a linha recebe o estado `UNMATCHED_LEADS_DEALER`; nenhuma associação aproximada é criada.

## Fórmulas

Para cada concessionária canônica e competência, considere `L` como o total de Leads do início do mês até `referenceDate` e `V` como `W4 Retail` do snapshot ativo.

| Indicador | Fórmula | Estado indisponível |
|---|---|---|
| Vendas do mês | `V` | Quando W4 Retail estiver vazio |
| Taxa de conversão | `(V / L) × 100` | Quando `L = 0` ou W4 Retail estiver vazio |
| Leads por venda | `L / V` | Quando `V ≤ 0` ou W4 Retail estiver vazio |
| Leads estimados para uma venda | `ceil(L / V)` | Quando Leads por venda estiver indisponível |
| Atingimento W4 | `(W4 Retail / W4 TGT) × 100` | Quando W4 TGT estiver vazio ou for zero |

**Leads estimados para uma venda** é uma leitura histórica baseada no período selecionado, não uma garantia de resultado. O dashboard deve comunicar essa limitação em português e inglês.

## Estados de qualidade

| Estado | Significado |
|---|---|
| `MATCHED` | Dealer de vendas associado explicitamente a um dealer com Leads |
| `UNMATCHED_LEADS_DEALER` | Dealer de vendas válido, mas sem dealer correspondente na base de Leads |
| `MISSING_W4_RETAIL` | Semana 4 sem venda preenchida |
| `NO_LEADS` | Há vendas, mas nenhum Lead correspondente no período |
| `ZERO_SALES` | Há Leads e W4 Retail igual a zero |

No arquivo inicial, `HG ARACAJU`, `NISCAR JOÃO PESSOA` e `SINAL AV EUROPA` não possuem W4 Retail preenchido. Essa ausência deve aparecer como indisponível, nunca como zero inventado.
