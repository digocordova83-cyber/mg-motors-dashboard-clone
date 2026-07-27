# Auditoria visual do PDF `260723DailySalesPlanningReport`

## Escopo

Documento analisado: `/home/ubuntu/upload/pasted_file_99vF4K_260723DailySalesPlanningReport.pdf`.

O PDF possui **9 páginas** e está em formato predominantemente visual. Na inspeção das primeiras páginas, a tabela relevante para a importação de **Vendas por concessionária** aparece como **`Weekly Target Achievement - Retail`**.

## Localização da tabela relevante

| Página observada | Título visível | Relevância para importação |
|---|---|---|
| 1 | `Sales Process Management` | Contexto gerencial; não é o modelo principal de importação semanal por concessionária |
| 2 | `Weekly Target Achievement - Retail` | **Tabela-alvo da nova importação** |
| 3 | `Weekly Target Achievement - Registration` | Estrutura semelhante, mas não é a tabela solicitada |
| 4 | `Sales Funnel by Region & Dealer` | Painel analítico; não é arquivo-fonte da importação semanal |
| 5 | `Dealer Index` | Painel analítico; não é arquivo-fonte da importação semanal |

## Estrutura identificada na tabela `Weekly Target Achievement - Retail`

A tabela usa uma coluna principal de hierarquia com o cabeçalho **`Region`** e, à direita, blocos semanais repetidos.

| Ordem | Coluna visual identificada |
|---|---|
| 1 | `Region` |
| 2 | `W1 TGT` |
| 3 | `W1 Retail` |
| 4 | `%W1` |
| 5 | `W2 TGT` |
| 6 | `W2 Retail` |
| 7 | `%W2` |
| 8 | `W3 TGT` |
| 9 | `W3 Retail` |
| 10 | `%W3` |
| 11 | `W4 TGT` |
| 12 | `W4 Retail` |
| 13 | `%W4` |
| 14 | `W5 TGT` |
| 15 | `W5 Retail` |
| 16 | `%W5` |

## Regras visuais que o parser deverá respeitar

A primeira coluna mistura **linhas de região**, **linhas de concessionária** e **linhas de subtotal/total**. Portanto, a leitura não pode tratar toda linha como dealer.

| Tipo de linha | Exemplo observado | Tratamento esperado |
|---|---|---|
| Região | `R01`, `R02` | Usar como contexto/grupo, não importar como concessionária |
| Concessionária | `AUTOBRAND RECIFE`, `DRSUL PORTO ALEGRE`, `TECAR BRASÍLIA` | Importar como dealer real |
| Total geral | `Total` | Ignorar como registro de dealer |
| Subtotal regional | linha agregada logo abaixo do bloco `R01` / `R02` | Ignorar como dealer |

## Concessionárias visíveis na página auditada

Na amostra visual da página 2, foram identificadas concessionárias como `AUTOBRAND RECIFE`, `BALTIC BARUERI`, `DAO SILVEIRA NATAL`, `EUROVILLE BELO HORIZONTE`, `IGUAUTO FORTALEZA`, `INDIANA SALVADOR`, `JRCA MACEIÓ`, `ONNE RIBEIRAO`, `ONNE RIO PRETO`, `SINAL AV EUROPA`, `STEFANINI CAMPINAS`, `TORIBA SÃO PAULO`, `BARIGUI CURITIBA`, `BARIGUI FLORIANOPOLIS`, `DRSUL PORTO ALEGRE`, `LA FONTAINE JOINVILLE`, `ORVEL VITÓRIA`, `POTENZA RIO DE JANEIRO`, `TECAR BRASÍLIA`, `TECAR GOIÂNIA` e `VEGA BELÉM`.

## Comportamentos importantes observados

| Achado | Implicação técnica |
|---|---|
| Há células vazias nas semanas mais recentes, especialmente em `W5 Retail` e `%W5` | O parser deve aceitar semanas não preenchidas sem inventar zeros quando o valor estiver ausente no documento |
| Metas usam casas decimais com vírgula | Será necessário normalizar números em formato pt-BR |
| Percentuais usam símbolo `%` e vírgula decimal | O parser deve limpar `%` e converter para número de forma determinística |
| O layout é tabular e colorido, com grade estável | É viável implementar extração orientada por texto/OCR e validação estrutural por cabeçalhos |
| O documento também contém uma tabela `Registration` muito parecida | O fluxo deve identificar explicitamente `Retail` para evitar importar a tabela errada |

## Hipótese operacional para a importação

A nova entrada deverá aceitar **PDF desse relatório**, localizar a página/tabela `Weekly Target Achievement - Retail`, extrair apenas as linhas de concessionária e converter os campos semanais em registros compatíveis com a base atual de vendas semanais. A compatibilidade com o CSV existente deve ser preservada como caminho alternativo.

## Validação ponta a ponta no importador implementado

Em 24/07/2026, o próprio serviço de prévia do dashboard processou o arquivo real `pasted_file_99vF4K_260723DailySalesPlanningReport.pdf`, sem confirmar ou gravar um lote. A extração final foi comparada visualmente com a página 2 em quatro quadrantes sobrepostos e com um recorte ampliado das células W3–W5.

| Verificação | Resultado |
|---|---:|
| Prévia válida | Sim |
| Linhas estruturadas | 28 |
| Concessionárias | 25 |
| Regiões | 2 (`R01` e `R02`) |
| Totais gerais | 1 |
| Vendas W4 — soma dos dealers | 410 |
| Vendas W4 — soma das regiões | 410 |
| Vendas W4 — Total informado | 410 |
| Concessionárias com W4 Retail vazio | 3 |
| Correspondências com a base de Leads | 21 |
| Sem correspondência na base de Leads | 4 |
| Tempo observado da leitura final | aproximadamente 45,5 s |

As três células W4 Retail vazias foram preservadas como `null` para `HG ARACAJU`, `NISCAR JOAO PESSOA` e `SINAL AV EUROPA`. As quatro concessionárias ainda sem correspondência na base de Leads foram `AUTOBRAND RECIFE`, `HG ARACAJU`, `LA FONTAINE JOINVILLE` e `SINAL AV EUROPA`; isso é uma lacuna de de/para/base conhecida, não uma falha de leitura do PDF.

A inspeção ampliada confirmou uma regra específica do documento: `LA FONTAINE JOINVILLE` exibe meta zero, venda positiva e percentual `0,0%` em W3/W4. O parser preserva essa convenção quando a meta é zero. Para metas positivas, o percentual é conferido contra o intervalo matemático permitido pelo arredondamento visível da meta: meia unidade para valores inteiros de W4 e meia décima para metas com uma casa decimal.
