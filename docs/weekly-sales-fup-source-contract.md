# Contrato da nova fonte oficial de Retail — Daily Sales FUP

## Arquivo analisado

Fonte fornecida pelo usuário: `260913_Daily_Sales_FUP.xlsx`.

A pasta de trabalho possui três abas:

| Aba | Uso |
|---|---|
| `DAILY_FUP` | Resumo mensal por modelo e visão consolidada de Registration, Retail e Wholesale. |
| `WEEKLY_RET` | Fonte autoritativa de MTD Retail por dealer, com metas e acumulados semanais. |
| `WEEKLY_REG` | Registro/emplacamento semanal; não deve alimentar MTD Retail. |

## Métrica autoritativa

O dashboard deve ler exclusivamente `WEEKLY_RET` para MTD Retail. A planilha contém 26 dealers, duas regiões (`R01` e `R02`) e uma linha agregada final. No arquivo analisado, a última semana preenchida é a Semana 3, com **192 MTD Retail Orders**. O mesmo total aparece no resumo `DAILY_FUP` em `MTD Retail`, permitindo uma validação cruzada opcional.

## Estrutura de `WEEKLY_RET`

A linha de cabeçalho contém `REGION`, `CUSTOMER`, `CUSTOMER_NAME`, `TARGET` e grupos semanais de Semana 1 a Semana 6. Cada grupo contém meta acumulada, percentual de atingimento Retail, MTD Retail e percentual de outros. O parser deve:

1. identificar a linha de cabeçalho pelos nomes normalizados;
2. usar `CUSTOMER_NAME` como dealer de origem e `REGION` para as linhas regionais;
3. mapear, por semana, o alvo acumulado, o MTD Retail e o percentual de atingimento;
4. selecionar como referência a última semana cujo total agregado possua MTD Retail preenchido;
5. reconciliar a soma dos 26 dealers com a linha agregada final;
6. rejeitar arquivos sem `WEEKLY_RET`, sem linha agregada ou com divergência no total da semana de referência.

## Resultado observado no arquivo inicial

| Indicador | Valor |
|---|---:|
| Dealers | 26 |
| Semana de referência | 3 |
| MTD Retail | 192 |
| Meta mensal Retail (`TARGET`) | 493 |
| Dealers sem MTD Retail na semana 3 | 0 |

## Transição operacional

Esta planilha substitui o PDF como fonte oficial de Retail. O fluxo deve manter o contrato já usado pelas tabelas `weeklySalesImports` e `weeklySalesRecords`, preservando histórico, métricas por semana, reconciliação de dealers, conversão com Leads e idempotência por hash do arquivo + competência.

O upload direto continuará sendo uma ação manual autenticada. O sistema deve oferecer prévia e exigir confirmação antes da importação. A automação programática por linha de comando é mantida como alternativa operacional para contingência e auditoria.

## Implementação concluída

O parser `weeklySalesXlsx.ts` valida a assinatura XLSX, localiza a aba `WEEKLY_RET`, normaliza os nomes dos dealers e produz o mesmo contrato interno usado historicamente pelos arquivos Retail. Semanas futuras preenchidas com zeros não são consideradas como fechamento: a referência é a última semana com MTD Retail positivo no total agregado e reconciliado com `DAILY_FUP`.

Como `WEEKLY_RET` contém a região em cada linha de dealer, mas não possui linhas regionais explícitas, o parser sintetiza os agregados `R01` e `R02`. Dessa forma, dealers, regiões e TOTAL reconciliam no mesmo valor, preservando as validações já existentes do dashboard.

O upload direto aceita `.xlsx`, `.csv` e `.pdf`, mantendo os formatos históricos como contingência. Para a nova fonte oficial, a interface identifica `Daily Sales FUP (.xlsx)`, gera uma prévia auditável, mostra correspondências e exige confirmação antes da escrita. A permissão continua restrita a usuários com `canImportLeads`, a mesma autorização administrativa já aplicada ao módulo.

O novo script `scripts/importWeeklySalesRetailFile.ts` oferece prévia e importação para XLSX, CSV e PDF. Ele deve ser o ponto de entrada programático para novos arquivos Retail; os scripts específicos de PDFs antigos permanecem apenas para reprodutibilidade histórica.

## Primeira importação oficial

O arquivo fornecido foi importado como lote `750001`, competência `2026-09`, Semana 3 e total de **192 MTD Retail Orders**. Foram gravadas 29 linhas: 26 dealers, duas regiões sintetizadas e uma linha TOTAL. Todos os 26 dealers foram correspondidos e não houve dealer ausente no dashboard.

A soma dos dealers, a soma das regiões e o TOTAL reportado resultaram em 192. A reexecução do mesmo arquivo retornou `NO_CHANGES`, com zero linhas adicionais, confirmando idempotência por hash do arquivo e competência.

## Qualidade e revisão

A suíte completa foi aprovada com 56 arquivos e 341 testes. TypeScript e build de produção também foram concluídos com sucesso. A prévia foi revisada visualmente em desktop e mobile, com leitura integral dos totais, alertas, correspondências e rolagem do modal.
