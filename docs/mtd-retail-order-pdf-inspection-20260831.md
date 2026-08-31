# Inspeção visual do Daily Sales Planning Report — 31/08/2026

O PDF enviado possui 11 páginas. A página 2 contém a tabela **Weekly Target Achievement - Retail**, usada como fonte de MTD Retail Order no dashboard.

| Campo | Valor confirmado |
|---|---:|
| Competência | Aug/26 |
| Semana de referência | W5 |
| W5 target acumulado | 493,0 |
| W5 Retail acumulado | 660 |
| W5 achievement | 133,9% |
| Regiões | R01 e R02 |
| Dealer rows | 26 |

A primeira tentativa do importador oficial recebeu uma resposta JSON incompleta do extrator estruturado. Nenhuma alteração de dados foi aplicada por essa tentativa. A validação visual confirmou que a tabela contém os dados completos, e a importação alternativa deve preservar os mesmos 26 dealers, 2 regiões e uma linha TOTAL antes de gravar qualquer registro.

## Transcrição confirmada — R01 / W5

| Linha | W5 target | W5 Retail |
|---|---:|---:|
| R01 | 275,0 | 416 |
| AUTOBRAND RECIFE | 7,0 | 7 |
| AUTOMEC SOROCABA | 7,0 | 5 |
| BALTIC BARUERI | 16,0 | 20 |
| DAO SILVEIRA NATAL | 11,0 | 27 |
| EUROVILLE BELO HORIZONTE | 32,0 | 50 |
| HG ARACAJU | 7,0 | 7 |
| IGUAUTO FORTALEZA | 19,0 | 16 |
| INDIANA SALVADOR | 27,0 | 41 |
| JRCA MACEIÓ | 13,0 | 40 |
| NISCAR JOAO PESSOA | 7,0 | 23 |
| ONNE RIBEIRAO | 17,0 | 19 |
| ONNE RIO PRETO | 13,0 | 15 |
| SAVOL SÃO CAETANO | 22,0 | 43 |
| SINAL AV EUROPA | 8,0 | 16 |
| STEFANINI CAMPINAS | 23,0 | 40 |
| STEFANINI PIRACICABA | 16,0 | 14 |
| TORIBA SÃO PAULO | 30,0 | 33 |

## Transcrição confirmada — R02 e TOTAL / W5

| Linha | W5 target | W5 Retail |
|---|---:|---:|
| R02 | 218,0 | 244 |
| BARIGUI CURITIBA | 34,0 | 20 |
| BARIGUI FLORIANÓPOLIS | 26,0 | 31 |
| DRSUL PORTO ALEGRE | 37,0 | 53 |
| LA FONTAINE JOINVILLE | 7,0 | 13 |
| ORVEL VITÓRIA | 17,0 | 4 |
| POTENZA RIO DE JANEIRO | 32,0 | 34 |
| TECAR BRASÍLIA | 47,0 | 63 |
| TECAR GOIÂNIA | 8,0 | 16 |
| VEGA BELÉM | 10,0 | 10 |
| TOTAL | 493,0 | 660 |

Os subtotais regionais reconciliam o total geral: 416 (R01) + 244 (R02) = 660 MTD Retail Orders. Os targets também reconciliam: 275,0 (R01) + 218,0 (R02) = 493,0.

## Resultado da importação alternativa

O PDF foi importado na competência `2026-08` pelo lote **630001**, usando a transcrição visual auditada da página 2 para W5 e preservando as métricas W1–W4 da última importação reconciliada. A prévia foi validada sem erros ou avisos, com 26 dealers conciliados, 0 unmatched e 29 registros inseridos.

A reexecução da mesma transcrição retornou o mesmo `importId` 630001, `idempotent: true` e `rowsInserted: 0`, confirmando que o PDF não foi duplicado.
