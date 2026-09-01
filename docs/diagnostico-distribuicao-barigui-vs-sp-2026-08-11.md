# Diagnóstico de Distribuição de Leads — Barigui Curitiba versus São Paulo

**Período:** 01 a 10 de agosto de 2026  
**Base analisada:** 2.846 Leads, com corte D-1  
**Escopo comparativo:** Barigui Curitiba e os 12 dealers oficiais de São Paulo

## Conclusão executiva

A preocupação levantada pelo Thiago é **correta quando a comparação é feita dealer a dealer**. Barigui Curitiba recebeu **285 Leads**, mais do que qualquer dealer paulista individual. O maior dealer de SP foi Baltic Shopping Tamboré, com 243; Toriba recebeu 113 e a média entre os 12 dealers paulistas foi 56,92.[1]

Entretanto, São Paulo **não recebeu menos Leads como mercado**. Os 12 dealers paulistas somaram **683 Leads**, contra 285 da Barigui Curitiba. A diferença visual surge porque o volume paulista está fragmentado entre 12 unidades, enquanto **172 dos 174 Leads originados no Paraná foram concentrados na Barigui Curitiba**.[1]

O ponto realmente crítico é outro: **113 dos 285 Leads da Barigui, ou 39,65%, vieram de fora do Paraná**. Esses 113 registros foram gerados por Site, Campanha Urban e Mercado Livre; Meta e Webmotors entregaram apenas Leads do PR para a Barigui no período.[1]

> **Diagnóstico:** o excesso da Barigui não é explicado por uma retirada relevante de Leads de SP. Apenas 10 dos 499 Leads originados em SP foram enviados à Barigui. O desequilíbrio resulta da combinação entre concentração natural do Paraná em um único dealer e distribuição nacional/fallback concentrada em Site, Campanha Urban e Mercado Livre.

## Comparação principal

| Indicador | Barigui Curitiba | São Paulo — 12 dealers |
| --- | ---: | ---: |
| Leads | **285** | **683** |
| Média de Leads por dealer | 285,00 | 56,92 |
| Mediana por dealer | 285,00 | 42,50 |
| Leads do próprio estado | 172 | 478 |
| Leads fora do próprio estado | **113** | **205** |
| Parcela fora do estado | **39,65%** | 30,01% |
| Vendas no Varejo — referência S3 | **2** | **43** |
| Conversão Leads → Vendas | **0,70%** | **6,29%** |
| Meta de Vendas — referência S3 | 17,3 | 74,0 |
| Atingimento da meta | **11,5%** | **58,1%** |

Barigui recebeu **5,0 vezes a média paulista** e 17% mais Leads que o maior dealer individual de SP. Ao mesmo tempo, sua conversão ficou em 0,70%, enquanto o agregado paulista ficou em 6,29%.[1][2]

## O efeito da fragmentação de São Paulo

| Dealer de SP | Leads | Vendas S3 | Conversão |
| --- | ---: | ---: | ---: |
| Baltic Shopping Tamboré | 243 | 5 | 2,06% |
| Toriba — Ceasa | 113 | 12 | 10,62% |
| Stefanini — Campinas | 83 | 7 | 8,43% |
| Savol — São Caetano | 68 | 14 | 20,59% |
| Sinal Av. Europa | 60 | 1 | 1,79%* |
| Onne — Ribeirão Preto | 54 | 1 | 1,85% |
| Onne — São José do Rio Preto | 31 | 1 | 3,23% |
| Stefanini — Piracicaba | 22 | 2 | 10,00%* |
| Automec Sorocaba | 3 | — | — |
| Baltic Guarulhos | 3 | — | — |
| Javep/Bauru | 2 | — | — |
| Savol ZL | 1 | — | — |

\*O relatório semanal ainda agrega 56 Leads para Sinal e 20 para Stefanini Piracicaba, enquanto a análise consolidada identifica 60 e 22 após unir variações brutas de nome. Essa diferença não altera a conclusão, mas reforça a necessidade de um de-para único para todos os módulos.

Quatro dealers oficiais paulistas possuem apenas 1 a 3 Leads e não aparecem com métrica de vendas no último relatório. Antes de qualquer redistribuição, é necessário confirmar suas **datas de entrada em operação**. Comparar uma unidade recém-ativada com a Barigui sem essa informação distorce a leitura.[1][2]

## Quais canais explicam a Barigui

| Canal | Barigui — total | Barigui — fora do PR | SP — total |
| --- | ---: | ---: | ---: |
| Site | 116 | **80** | 291 |
| Campanha Urban | 49 | **27** | 103 |
| Meta | 95 | **0** | 215 |
| Webmotors | 9 | **0** | 13 |
| Mercado Livre | 16 | **6** | 61 |
| **Total** | **285** | **113** | **683** |

O Site explica **70,8%** dos Leads fora do PR atribuídos à Barigui; Campanha Urban responde por 23,9% e Mercado Livre por 5,3%. Meta não é a origem do problema geográfico neste recorte.[1]

Há um comportamento semelhante em Baltic Shopping Tamboré: 154 dos seus 243 Leads estão fora de SP, sendo 136 de Site. Portanto, o fenômeno não é exclusivo da Barigui; há indício de que o **Site usa determinadas concessionárias como destinos de fallback para demanda nacional**.[1]

## A distribuição está retirando Leads de São Paulo?

Dos 499 Leads cuja origem geográfica é SP, **478 permaneceram em dealers de SP**, 21 foram direcionados a outros estados e apenas 10 chegaram à Barigui Curitiba. Assim, **95,79% da demanda paulista permaneceu em São Paulo**, e a Barigui recebeu somente 2,0% dessa origem.[1]

Isso significa que a discussão não deve ser formulada como “Barigui está tomando os Leads de SP”. A formulação correta é:

> Por que Site, Campanha Urban e Mercado Livre estão enviando demanda de vários estados para Barigui Curitiba e Baltic Tamboré, enquanto outros dealers recebem volumes muito menores?

## O papel do dashboard

O dashboard **não escolhe nem distribui a concessionária**. O consolidador preserva exatamente o dealer informado em cada aba de origem e apenas importa esse vínculo.[3] Portanto, a causa precisa ser investigada na captação anterior ao dashboard: formulário do Site, regra de roteamento, dealer escolhido pelo usuário, integração do fornecedor ou fallback aplicado quando não há correspondência territorial.

Também não existe hoje uma meta de Leads por dealer registrada no dashboard. Há uma meta mensal geral de Leads e metas de Vendas no relatório semanal, mas não uma regra que diga quantos Leads cada dealer deveria receber. Sem esse denominador, o sistema mostra o desequilíbrio depois que ele ocorre, mas não consegue apontar automaticamente um desvio de planejamento.

## Cenário indicativo de redistribuição

Somando Barigui e SP, a Barigui recebeu **29,44% dos Leads**, mas representa **18,94% da meta de Vendas S3** e apenas **4,44% das vendas realizadas** nesse universo.[1][2]

Se o volume fosse distribuído apenas de forma proporcional à meta de Vendas — cenário de referência, não regra definitiva — a Barigui teria aproximadamente **183 Leads**, e não 285. Isso indica um excedente direcional de cerca de **102 Leads**, ou volume **55% acima** do esperado por essa proxy.

Esse cenário não deve ser aplicado automaticamente. Capacidade de atendimento, território, data de abertura, estoque, desempenho histórico e estratégia de lançamento precisam entrar na fórmula final.

## Recomendações

### 1. Criar uma meta mensal de Leads por dealer

A alocação deve combinar meta de Vendas, capacidade operacional, território, data de abertura e um fator controlado de desempenho. O planejado e o realizado devem ficar lado a lado no dashboard.

### 2. Separar escolha do cliente de roteamento automático

Adicionar campos distintos para **dealer escolhido**, **dealer atribuído**, **motivo do roteamento** e **regra/fallback aplicada**. Hoje a base recebe apenas o dealer final e não permite reconstruir o algoritmo anterior.

### 3. Corrigir o fallback de Site e Urban

Leads sem dealer territorial válido devem ir para uma fila central de qualificação, não ser concentrados automaticamente em Barigui ou Baltic. O histórico de origem deve ser preservado.

### 4. Aplicar guardrails geográficos

Definir UF/cidade por dealer e criar alertas quando a parcela fora da área superar um limite aprovado. Não é recomendável bloquear automaticamente sem confirmar a política comercial, mas o desvio deve ser visível.

### 5. Confirmar o go-live dos novos dealers de SP

Automec Sorocaba, Baltic Guarulhos, Javep/Bauru e Savol ZL aparecem com volumes mínimos e sem linha de Vendas no relatório de referência. É necessário confirmar se estavam plenamente ativos em todo o período antes de avaliar subalocação.

### 6. Não redistribuir apenas pela conversão atual

O dossiê da Barigui mostrou problemas de qualidade e roteamento. Reduzir volume unicamente por uma conversão de 0,70% pode misturar baixa qualidade, atendimento e maturidade do Lead. A decisão deve usar qualidade validada, SLA, tentativas de contato e capacidade de loja.

## Resposta objetiva ao Thiago

**Sim, Barigui Curitiba está recebendo volume desproporcional quando comparada a um dealer paulista individual.** Porém, São Paulo como mercado recebe mais Leads no total. O que explica a aparente contradição é a fragmentação de SP entre 12 dealers, somada à concentração de quase todo o Paraná na Barigui e a 113 Leads nacionais enviados à Barigui por Site, Urban e Mercado Livre.

A ação prioritária não é simplesmente “tirar Leads da Barigui e mandar para SP”. É corrigir o fallback nacional, implantar meta de Leads por dealer e redistribuir apenas depois de confirmar território, abertura e capacidade dos dealers paulistas.

## Referências

[1]: https://mgmotors.bbro.com.br/?module=leads "MG Motors — Dashboard de Leads"
[2]: https://mgmotors.bbro.com.br/?module=sales "MG Motors — Vendas Semanais"
[3]: file:///home/ubuntu/mg-motors-dashboard-clone/scripts/googleLeadsConsolidator.py "Consolidador oficial de Leads MG"
