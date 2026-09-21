# Social Orgânico — análise de crescimento de seguidores

**Data da implementação e validação:** 21/09/2026.  
**Fonte:** Windsor.ai, conector `instagram`, conta `mgmotorbrasil`.  
**Período validado:** 22/08/2026 a 20/09/2026.

## Objetivo

A aba Social Orgânico foi ampliada para responder se o ganho de seguidores em fins de semana difere do comportamento de segunda a sexta, identificar picos estatísticos e apresentar sinais que ajudem a investigar o contexto sem afirmar causalidade.

## Dados reais observados

| Indicador | Resultado |
| --- | ---: |
| Seguidores atuais reportados | 50.360 |
| Novos seguidores no período | 2.265 |
| Média por dia útil | 76,6 |
| Mediana por dia útil | 59,5 |
| Média por dia de fim de semana, excluindo data pendente | 81,6 |
| Mediana por dia de fim de semana | 60,0 |
| Diferença fim de semana vs dia útil | +6,5% |
| Último sábado, 19/09 | 54 seguidores reportados |
| Domingo, 20/09 | Em apuração no Windsor |

O último fim de semana não foi classificado como pico ou queda, pois o domingo tinha alcance, interações e visualizações, mas ainda retornava zero novos seguidores. O painel informa explicitamente que o volume de 54 seguidores é parcial e que a série de seguidores está fechada somente até 19/09.

Os picos estatísticos do intervalo foram 31/08 (235), 30/08 (165), 26/08 (147), 29/08 (136) e 01/09 (102). A maior associação linear observada entre novos seguidores e os sinais diários foi com visualizações (`r = 0,91`), apresentada apenas como correlação, não como causa. Para o fim de semana de 19–20/09, o painel relaciona os conteúdos publicados em 17 e 18/09, preservando alcance, engajamento, seguidores atribuídos e links reais.

## Componentes implementados

O novo bloco inclui médias e medianas por tipo de dia, diferença percentual entre fins de semana e dias úteis, gráfico diário com cores distintas para dias úteis, fins de semana, picos e datas pendentes, média por dia da semana, diagnóstico do último fim de semana, comparação de alcance/visualizações/interações com fins de semana anteriores, conteúdos próximos ao período e ranking de picos diários.

A análise detecta datas finais ainda em apuração quando o Instagram retorna zero seguidores, mas mantém atividade em outras métricas. Essa regra não é aplicada ao TikTok porque seu campo representa crescimento líquido e zero pode ser um resultado válido.

## Revisão visual

A nova seção foi revisada no dashboard autenticado em desktop. O layout mantém o padrão escuro MG, não apresenta overflow horizontal e separa claramente os cards executivos, o gráfico diário, as médias por dia da semana, o diagnóstico, os sinais associados, os conteúdos e os picos. A mensagem de dados pendentes ficou visível antes do diagnóstico para evitar interpretação incorreta do domingo ainda não fechado.
