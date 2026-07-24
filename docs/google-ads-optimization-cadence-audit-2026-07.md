# Auditoria de cadência das otimizações do Google Ads

**Projeto:** MG Motors — Dashboard Operacional  
**Data da validação:** 24 de julho de 2026  
**Autor:** Manus AI

## Resumo executivo

O feedback do time de operação revelou dois problemas distintos. O primeiro era a repetição de recomendações de CPA em intervalos inferiores a sete dias, inclusive com oscilações relevantes de valor. O segundo era a solicitação de relatórios manuais de palavras-chave negativas mesmo quando o dashboard já orientava a ação.

A causa da cadência curta foi confirmada: o motor exigia uma **janela analítica de sete dias**, mas não impunha sete dias entre a conclusão de uma alteração de CPA e a execução da próxima. Além disso, a deduplicação dependia da assinatura completa da recomendação; quando o valor sugerido ou a evidência mudava, a mesma campanha podia receber outra tarefa da família CPA.

A correção estabelece um **cooldown operacional de sete dias corridos após a conclusão** da última ação de CPA da campanha. A regra é aplicada na geração, transferência, início e conclusão das tarefas, e não apenas na interface. Tarefas legadas já criadas dentro dessa janela foram colocadas em quarentena e consolidadas por campanha e família, sem excluir o histórico. Para as negativas, a conclusão da tarefa agora pode registrar os termos efetivamente aplicados em uma estrutura pesquisável, eliminando a necessidade de um relatório manual separado.[1] [2]

| Resultado | Comportamento final |
|---|---|
| Nova recomendação de CPA antes de sete dias | Permanece em observação e não gera uma nova tarefa executável |
| Tarefa CPA legada criada durante o cooldown | Fica bloqueada até a data de liberação |
| Várias tarefas CPA abertas da mesma campanha | Uma tarefa canônica permanece na fila; as demais são consolidadas apenas visualmente |
| Histórico de tarefas legadas | Continua integralmente auditável |
| Palavra-chave negativa aplicada | É registrada na conclusão com termo, correspondência, campanha, data e responsável |
| Relatório manual de negativas | Não é necessário; o histórico do dashboard passa a ser a fonte operacional |

## Leitura estruturada do feedback operacional

O relato de que um CPA poderia ir para aproximadamente **R$ 20** e, três dias depois, receber referência próxima de **R$ 7** não indicava falha na janela de dados. A janela de sete dias continuava existindo, mas era móvel: três dias depois, o sistema já conseguia analisar outra amostra de sete dias e produzir uma assinatura diferente. Faltava uma regra de estabilidade após a execução.

A auditoria somente de leitura também encontrou exemplos reais de tarefas da família CPA separadas por três dias:

| Campanha auditada | Ação anterior | Nova ação | Intervalo |
|---|---:|---:|---:|
| `MG_Marca_SEM_MG` | CPA-alvo de R$ 27 | CPA-alvo de R$ 21 | 3 dias |
| `MGMotor_Cyberster_SEM-GOIANIA` | CPA-alvo de R$ 21 | CPA-alvo de R$ 18 | 3 dias |

Esse comportamento explica por que a operação recebia novas referências antes de conseguir avaliar de forma estável a mudança anterior. A solução, portanto, precisava distinguir **tempo de amostra** de **tempo desde a última ação concluída**.

## Política de cadência implementada

A família de CPA reúne `SET_TARGET_CPA`, `SWITCH_BIDDING_STRATEGY` e revisões de lance cujo texto ou evidência indiquem CPA. A identidade usada para controle é `campaignId + família CPA`; uma alteração no valor recomendado não cria uma família nova.[1]

| Regra | Aplicação |
|---|---|
| Cooldown | 7 dias corridos, equivalentes a 168 horas após `completedAt` |
| Ponto de partida | Conclusão efetiva da última tarefa CPA da campanha |
| Nova recomendação no período | Estado `COOLDOWN`, com dias restantes e próxima data elegível |
| Tarefa aberta já existente | Estado `OPEN_TASK`; a recomendação não cria outra tarefa |
| Tarefa legada dentro do período | Estado `COOLDOWN`; início e conclusão são rejeitados no servidor |
| Duplicata legada da mesma família | Estado `LEGACY_DUPLICATE`; vinculada à tarefa canônica |
| Ações que não são de CPA | Continuam independentes e executáveis conforme suas regras atuais |

Na transferência de ciclo, uma pendência CPA é identificada pela família, e não somente pela assinatura de origem. Isso preserva a tarefa existente, sua data original e os eventos de transferência, evitando reinício artificial da contagem. A política também é reavaliada dentro das mutações do servidor; remover um botão na interface não seria suficiente para proteger a regra.[1] [4]

## Tratamento das tarefas legadas

A validação sobre a base real mostrou que tarefas geradas antes da nova política continuavam presentes no ciclo ativo. Para não apagar trilha de auditoria nem deixar ações contraditórias disponíveis, a solução classifica todas as tarefas abertas da mesma campanha e família.

A tarefa canônica é escolhida priorizando `IN_PROGRESS`, depois `REOPENED` e, por fim, a pendência mais antiga. As demais permanecem persistidas, mas saem da fila operacional. O histórico não é reescrito nem excluído.[1]

| Caso validado em 24/07/2026 | Tarefa canônica | Estado | Liberação | Duplicatas consolidadas |
|---|---:|---|---|---:|
| `MG_Marca_SEM_SP` | `#1950050` | Cooldown, 5 dias restantes | 28/07/2026 | 3 |
| `MG_Marca_SEM_SCS` | `#1950053` | Cooldown, 4 dias restantes | 28/07/2026 | 3 |

Com o filtro `MG_Marca_SEM`, a aba **Otimizações** mostrou apenas os dois cards canônicos. Ambos exibiram a quarentena e a data de liberação, sem textarea ou botão de conclusão. Já a aba **Histórico** retornou 20 registros relacionados entre 388 tarefas, incluindo as duplicatas legadas e os ciclos anteriores. Portanto, a consolidação altera a operação diária, mas preserva a rastreabilidade.[5]

## Histórico de palavras-chave negativas

O dashboard agora trata o registro das negativas como parte da conclusão de `REDUCE_WASTE`. O operador informa apenas os termos efetivamente aplicados no Google Ads, um por linha. Colchetes indicam correspondência exata, aspas indicam correspondência de frase e o texto sem delimitadores indica correspondência ampla. Espaços, caixa e Unicode são normalizados para evitar duplicidades equivalentes.[3]

| Campo persistido | Finalidade |
|---|---|
| Conta, campanha e nome da campanha | Identificar onde a negativa foi aplicada |
| Termo e termo normalizado | Exibir a entrada original e deduplicar variações equivalentes |
| Tipo de correspondência | `BROAD`, `PHRASE` ou `EXACT` |
| Tarefa e ciclo | Vincular a negativa à decisão operacional |
| Origem | Distinguir conclusão de tarefa de eventual registro manual |
| Responsável e data de aplicação | Manter autoria e cronologia |

A unicidade é garantida por tarefa, termo normalizado e tipo de correspondência. A aba **Histórico** oferece busca por termo, campanha ou responsável e filtro por período. Passos que pediam “gerar”, “criar”, “exportar” ou “preencher” relatório de negativas foram substituídos pela orientação de registrar somente o que foi efetivamente aplicado.[1] [2] [3]

> O dashboard **não aplica negativas automaticamente no Google Ads**. Ele registra a execução informada pelo operador e mantém o histórico operacional. Essa distinção evita afirmar uma integração que não existe.

## Experiência operacional validada

Na sessão autenticada, a fila foi reduzida de 148 tarefas persistidas para **110 tarefas operacionais**, porque 38 duplicatas legadas foram consolidadas. O resumo apresentou **101 executáveis**, **6 em observação** e 3 concluídas no ciclo. As campanhas SP e SCS exibiram “Execução temporariamente bloqueada” e não ofereceram controles de conclusão.[5]

A validação móvel foi executada com viewport CSS de 390 × 844 px. O documento apresentou largura útil de 380 px e largura rolável também de 380 px, sem overflow horizontal. Com o filtro Sem Marca, os dois cards permaneceram visíveis, com duas mensagens de bloqueio, zero botões de conclusão e zero textareas.[5]

Durante a primeira inspeção foi detectada uma regressão de formatação da data de liberação. O timestamp completo estava sendo enviado a uma função que esperava `YYYY-MM-DD`, resultando em `Invalid time value`. A conversão foi corrigida e coberta por teste; não houve novos erros de navegador ou servidor após a correção.[5]

## Validação técnica

| Verificação | Resultado |
|---|---|
| Vitest | 39 arquivos e 209 testes aprovados |
| TypeScript | `tsc --noEmit` aprovado |
| Build de produção | Vite e bundle do servidor concluídos |
| Higiene do diff | `git diff --check` sem inconsistências |
| Logs pós-correção | Nenhum novo erro após 17:27 de 24/07/2026 |
| Banco real | Cooldown, tarefa canônica e duplicatas confirmados para SP e SCS |

Os testes cobrem a política pura, o workflow transacional, a rejeição de início e conclusão durante o cooldown, a consolidação de duplicatas, a preservação de ações não-CPA, o parser de negativas, a persistência do histórico e os elementos obrigatórios da interface.[4]

## Orientação para o time de operação

A operação deve continuar executando as negativações normalmente no Google Ads e registrar no dashboard apenas os termos realmente aplicados. Não é necessário produzir um segundo relatório manual. Para CPA, a referência diária pode continuar mudando, mas uma nova ação só ficará executável após a janela de estabilidade. Durante o cooldown, o card serve como informação de observação e informa a data de liberação.

Se houver uma necessidade excepcional de antecipar uma mudança de CPA, a recomendação é registrar a justificativa e tratar a exceção como decisão de governança, em vez de contornar a regra por tarefa duplicada. O fluxo padrão permanece protegido no servidor.

## Conclusão

A melhoria resolve a diferença entre **analisar sete dias** e **aguardar sete dias depois de agir**. O dashboard agora evita oscilações prematuras de CPA, consolida pendências legadas sem perda histórica e transforma as palavras-chave negativas em um registro operacional pesquisável. O resultado reduz trabalho redundante, preserva auditoria e fornece uma cadência mais estável para o time.

## Referências

[1]: ../server/optimizationPolicy.ts "Política de cadência, deduplicação e normalização de tarefas"
[2]: ../drizzle/schema.ts "Schema do histórico de palavras-chave negativas"
[3]: ../shared/negativeKeywords.ts "Normalização e parsing das palavras-chave negativas"
[4]: ../server/optimizationWorkflow.test.ts "Testes transacionais do workflow de otimizações"
[5]: ./optimization-visual-validation-2026-07-24.md "Evidências da validação autenticada e responsiva"
