# Validação visual em andamento

- A prévia abriu com sessão autenticada como Rodrigo.
- Cabeçalho, filtros de período, banner da correção de tag e as quatro abas renderizaram no tema escuro existente.
- A consulta do dashboard ainda estava no estado de carregamento nas duas primeiras capturas; é necessário aguardar a conclusão antes de validar a aba Investimento e o novo painel de pacing.

## Pacing da aba Investimento

A aba Investimento carregou com dados reais Windsor.ai e exibiu a meta persistente de **R$ 397.620,71**, o investido de **R$ 230.142,63**, o restante, a projeção, a média real diária, o ideal diário e o ideal restante. O indicador classificou corretamente o ritmo de **94,4%** como abaixo do ideal. O gráfico acumulado mostrou as quatro séries previstas e a referência da correção de tag. O controle **Editar meta** está visível e a tabela de campanhas passou a exibir nome e ID real. O layout de desktop permaneceu legível e coerente com o tema escuro existente.

## Acompanhamento Diário

A aba ampliada renderizou os seis cards de D-1, a matriz comparativa com D-2, sete dias atrás, média de sete dias e média de 30 dias, além da tabela por campanha com orçamento, investimento, conversões, CPA, variações e IDs exatos. As cores de variação respeitam a direção favorável por métrica. A primeira tentativa automatizada de preencher a busca não alterou visualmente o campo; a interação deve ser retestada antes de encerrar a validação da fase.

O reteste com foco explícito confirmou o filtro reativo: ao buscar o ID **23906853014**, a contagem caiu de 68 para uma campanha e a tabela exibiu somente **MG_Marca_SEM_SP**, preservando orçamento, métricas D-1/D-2 e variações. A série de evolução e o histórico diário continuaram renderizados sem duplicação após o filtro.

## Visão Geral ampliada

A prévia autenticada renderizou corretamente os rankings Top 10 de melhor e pior CPA com ID real, nome, produto, conversões, investimento e CPA. O critério mínimo de três conversões aparece no cabeçalho. A análise por produto exibiu gráfico horizontal e tabela conciliada com investimento, participação, conversões, CTR e CPA. A tabela regional mostrou investimento, conversões, CPA, desvio contra a média, estados Favorável/Neutro/Desfavorável e metas mensais apenas nas regiões mapeadas; regiões sem meta foram sinalizadas como **Não mapeada**. O status real da campanha e os IDs também foram adicionados à tabela de performance.

## Otimizações — recomendações e tarefas executáveis

A aba renderizou 21 recomendações primárias baseadas nos dados reais do período, cada uma com ID exato da campanha, prioridade, ação, investimento, conversões, CPA, motivo, impacto esperado, risco e passo a passo específico no Google Ads. O comando **Criar todas as tarefas** criou o primeiro ciclo ativo e persistiu 21 tarefas; após a invalidação do workspace, todas as recomendações passaram a exibir **Tarefa no ciclo** e o painel operacional mostrou 21 pendências, sem duplicação. Os controles de responsável, início e conclusão com notas e snapshot ficaram disponíveis em cada tarefa. Nenhuma tarefa foi iniciada ou concluída durante o teste, pois isso representaria execução real no Google Ads e não deve ser registrado sem que a alteração correspondente tenha sido feita.

## Fase 9 — controles de ciclo e linhagem

Na prévia autenticada, a aba **Otimizações** carregou o ciclo ativo com **21 tarefas**, todas vinculadas às recomendações reais e aos IDs exatos de campanha. O novo botão **Gerar novo ciclo** aparece no cabeçalho do workspace, sem substituir os filtros, a busca ou os controles de execução existentes. A virada ainda não foi efetivada nesta inspeção; o próximo passo visual é abrir o diálogo e validar o resumo de pendências e recomendações antes de cancelar.

A primeira tentativa automatizada de abrir o diálogo pelo índice do botão não alterou o estado visual nem exibiu os controles **Cancelar** e **Confirmar novo ciclo**. Nenhum ciclo foi criado. A interação deve ser retestada por coordenadas antes de concluir a validação visual do diálogo; a cobertura transacional de servidor já passou com rollback automático.

O reteste acionando apenas o gatilho do botão confirmou o diálogo central. Ele identifica o **Ciclo 1**, informa que **21 pendências** serão transferidas sem alterar o ciclo anterior, que **21 recomendações atuais** serão reavaliadas e que tarefas equivalentes não serão duplicadas. Os controles **Cancelar** e **Confirmar novo ciclo** estão visíveis e com hierarquia adequada. A confirmação não foi acionada, preservando o ciclo operacional real; a transação correspondente já foi validada por teste integrado com rollback.

## Histórico — efeito observado e auditoria

A aba **Histórico** carregou com sucesso e refletiu o estado operacional real: **21 tarefas no Ciclo 1, nenhuma concluída e 21 em “Aguardando dados”**. Não foram criados resultados artificiais. O resumo, a comparação por ciclo, os filtros por ciclo, status, resultado, ação, usuário e campanha e os cartões de auditoria foram renderizados com os IDs reais das campanhas.

O botão **Capturar período posterior (0)** permaneceu desabilitado porque não existe tarefa concluída antes da data inicial selecionada, comportamento coerente com a regra temporal. Os cartões exibem a janela de referência persistida, a ausência explícita de acompanhamento posterior e os eventos de criação. A advertência metodológica informa que a comparação é observacional e não atribui causalidade.

## Auditoria responsiva final — 21/07/2026

A auditoria autenticada cobriu as cinco abas em 1440 px, 768 px e 390 px. Todas as 15 combinações abriram a aba solicitada, concluíram o carregamento e apresentaram largura do documento igual à largura do viewport, sem overflow horizontal. Os overflows inicialmente detectados na Visão Geral e em Otimizações foram corrigidos com contenção dos painéis, cabeçalhos empilháveis e quebra segura de nomes longos.

A revisão segmentada dos 53 blocos finais sinalizou um possível problema na análise por produto/região. A inspeção direta dos blocos adjacentes confirmou que os cartões permanecem dentro dos 390 px; o corte visível nas colunas à direita é a rolagem horizontal interna intencional das tabelas analíticas, sem expansão do documento. Assim, o achado foi classificado como falso positivo e nenhuma nova correção é necessária.
