# Project TODO

- [x] Reproduzir fielmente a tela de login escura da MG Motors com usuário e senha
- [x] Proteger o dashboard com sessão autenticada e credenciais rodrigo/rodrigo
- [x] Implementar logout e impedir acesso direto ao dashboard sem sessão válida
- [x] Reproduzir o cabeçalho com marca MG Motors, filtros 7d, 14d, 30d, 60d, Mês e intervalo customizado
- [x] Remover completamente qualquer aba ou referência a Leads
- [x] Remover completamente qualquer aba ou referência a Metas
- [x] Exibir banner fixo sobre a Correção de Tag Google de 15/07/2026
- [x] Integrar o servidor aos dados reais de Google Ads da conta MG Motors obtidos via Windsor.ai
- [x] Utilizar obrigatoriamente campaign, campaign_id, date, spend, conversions, clicks, impressions, ctr, cpc, budget_amount, campaign_status, bidding_strategy_type, optimization_score, search_impression_share e search_budget_lost_impression_share
- [x] Implementar cache server-side por conta e intervalo de datas para evitar chamadas repetidas
- [x] Calcular Investimento Total, Conversões, CPA Médio, CTR, Taxa de Conversão e CPC Médio sem duplicação
- [x] Implementar sub-aba Visão Geral com Investimento Diário, Conversões Diárias e CPA Diário
- [x] Marcar Correção de Tag em 15/07/2026 em todos os gráficos temporais da Visão Geral
- [x] Implementar painel de Insights Automáticos com limiar crítico de 2x o CPA médio
- [x] Implementar sub-aba Acompanhamento Diário com spend, conversões, CPA, CTR e CPC por dia
- [x] Marcar Correção de Tag em 15/07/2026 no Acompanhamento Diário
- [x] Implementar sub-aba Investimento com gráfico e tabela por campanha e período
- [x] Marcar Correção de Tag em 15/07/2026 nas séries temporais de Investimento
- [x] Implementar sub-aba Otimizações com campanhas ativas e colunas exigidas
- [x] Implementar busca por campanha e filtros Todas, Crítico, Atenção e Saudável
- [x] Derivar Produto e Tipo de Otimização de forma determinística a partir da campanha
- [x] Calcular status de campanha dinamicamente a partir do CPA médio do período
- [x] Reproduzir cores, tipografia, espaçamento, cards, gráficos, tabelas e estados da referência
- [x] Implementar estados de carregamento, erro e ausência de dados
- [x] Garantir responsividade em desktop e mobile sem perder a estrutura visual
- [x] Escrever testes Vitest para autenticação, cache, agregações e classificação de CPA
- [x] Executar verificação TypeScript, testes e build de produção
- [x] Verificar visualmente login, Visão Geral, Acompanhamento Diário, Investimento e Otimizações
- [x] Revisar todo.md e salvar o checkpoint final do projeto
- [x] Incorporar o arquivo oficial logo-mg-horizontal.svg como ativo externo permanente do projeto
- [x] Substituir a marca temporária da tela de login pelo logo oficial MG
- [x] Substituir a marca temporária do cabeçalho pelo logo oficial MG
- [x] Ajustar tamanho, contraste, proporção e responsividade do logo em desktop, tablet e mobile
- [x] Validar visualmente login e dashboard autenticado com o logo oficial
- [x] Executar tipagem, testes e build após a atualização de marca
- [x] Revisar todo.md e salvar um novo checkpoint com o logo oficial
- [x] Adicionar a meta mensal de mídia de julho/2026 de R$ 397.620,71 como configuração persistente e editável
- [x] Cadastrar metas regionais de leads Google fornecidas para os 21 mercados
- [x] Ampliar a consulta Windsor.ai com campaign_id e campos reais de orçamento disponíveis
- [x] Exibir sempre ID e nome exatos do Google Ads em campanhas, recomendações, tarefas e histórico
- [x] Implementar cálculo de pacing mensal com meta, investido, restante, projeção, dias fechados e ritmo percentual
- [x] Implementar série acumulada Real, Ideal, Projeção e Meta Mensal na aba Investimento
- [x] Exibir ideal diário, média real diária e ideal diário restante no painel de pacing
- [x] Vincular cada campanha a uma região apenas quando o nome permitir correspondência determinística
- [x] Impedir sugestões regionais quando a campanha ou região não puder ser identificada com segurança
- [x] Implementar motor determinístico de ações para campanhas Críticas e em Atenção focado em melhoria de CPA
- [x] Considerar CPA, conversões, investimento, orçamento diário, limitação por orçamento, meta regional e pacing antes de recomendar aumento
- [x] Bloquear ações contraditórias, redundantes ou sem evidência suficiente
- [x] Incluir motivo, evidências, impacto esperado, risco e prioridade em cada recomendação
- [x] Incluir passo a passo específico do Google Ads para executar cada tipo de ação recomendada
- [x] Criar tabela persistente de metas mensais de mídia
- [x] Criar tabela persistente de metas regionais de leads
- [x] Criar tabela persistente de tarefas de otimização por campanha
- [x] Criar tabela persistente de eventos e histórico de cada tarefa
- [x] Registrar usuário criador, responsável, usuário que concluiu e datas de criação/conclusão
- [x] Permitir criar uma tarefa a partir de uma recomendação sem duplicar tarefa aberta equivalente
- [x] Permitir atribuir, iniciar, concluir e reabrir tarefas com observação obrigatória na conclusão
- [x] Exibir histórico separado por campanha e por usuário
- [x] Atualizar a sub-aba Otimizações com recomendações executáveis, filtros e gestão de tarefas
- [x] Adicionar estados de carregamento, erro, ausência de recomendação e ausência de tarefas
- [x] Escrever testes Vitest para pacing, elegibilidade de orçamento, recomendações, deduplicação e transições de tarefas
- [x] Aplicar migração de banco e validar persistência das metas, tarefas e histórico
- [x] Validar visualmente pacing e Otimizações em desktop, tablet e mobile
- [x] Executar tipagem, testes e build após a implementação operacional
- [x] Revisar todo.md e salvar novo checkpoint da versão com pacing e tarefas
- [x] Criar modelo persistente de ciclos de otimização com número, nome, período e status
- [x] Exibir o ciclo ativo na sub-aba Otimizações
- [x] Adicionar botão Gerar Novo Ciclo com confirmação e resumo das pendências transferidas
- [x] Encerrar o ciclo anterior ao gerar um novo ciclo
- [x] Transferir automaticamente todas as tarefas não concluídas para o novo ciclo sem perder autoria ou histórico
- [x] Registrar evento de transferência com ciclo de origem, ciclo de destino, data e usuário
- [x] Impedir duplicação de tarefas ao transferir pendências para o novo ciclo
- [x] Preservar tarefas concluídas exclusivamente no ciclo em que foram finalizadas
- [x] Criar snapshots de desempenho da campanha na criação e na conclusão da tarefa
- [x] Criar snapshot de acompanhamento posterior para medir efeito pós-otimização
- [x] Adicionar a sub-aba Histórico ao módulo de Google Ads
- [x] Exibir histórico filtrável por ciclo, campanha, ID da campanha, usuário, status e tipo de ação
- [x] Comparar CPA, conversões, investimento, CTR e CPC antes e depois da otimização
- [x] Classificar o resultado como Melhorou, Estável, Piorou ou Aguardando dados com critérios explícitos
- [x] Exibir variações absolutas e percentuais sem atribuir causalidade indevida
- [x] Mostrar linha do tempo completa de criação, atribuição, execução, conclusão, transferência e reabertura
- [x] Escrever testes Vitest para criação de ciclo, transferência de pendências, deduplicação e classificação de impacto
- [x] Validar visualmente o botão Novo Ciclo, o ciclo ativo e a aba Histórico em desktop, tablet e mobile
- [x] Adicionar seis cards D-1 para Investimento, Conversões, CPA Médio, CTR, Taxa de Conversão e CPC Médio
- [x] Calcular e exibir variação percentual de D-1 contra D-2 com semântica positiva ou negativa por métrica
- [x] Adicionar tabela Acompanhamento Diário Comparativo com D-1, D-2, variação, sete dias atrás, variação contra sete dias, média 7d e média 30d
- [x] Usar como referência o último dia fechado disponível no Windsor.ai, sem presumir que hoje possui dados completos
- [x] Adicionar tabela Campanhas — Ontem vs Anteontem com ID, nome, orçamento diário, investimento, conversões e CPA
- [x] Calcular variações por campanha de investimento, conversões e CPA entre D-1 e D-2
- [x] Ordenar o comparativo de campanhas por investimento de D-1 e manter busca por ID ou nome
- [x] Exibir indisponível quando não houver amostra real para D-2, sete dias atrás ou médias móveis
- [x] Validar comparativos diários com agregações independentes para evitar dupla contagem de métricas
- [x] Validar visualmente os cards e as duas tabelas comparativas em desktop, tablet e mobile
- [x] Adicionar Top 10 Melhor CPA na Visão Geral com ID, nome, produto, conversões, investimento e CPA reais
- [x] Adicionar Top 10 Pior CPA na Visão Geral com ID, nome, produto, conversões, investimento e CPA reais
- [x] Excluir dos rankings campanhas sem investimento ou sem conversões suficientes para um CPA válido
- [x] Aplicar critério mínimo de amostra e sinalizar campanhas que não podem ser comparadas com segurança
- [x] Adicionar Performance por Produto/Linha com investimento, conversões, participação, CTR e CPA
- [x] Classificar produto por regras determinísticas e agrupar ambiguidades em Não classificada
- [x] Adicionar CPA por Região com investimento, conversões, CPA e desvio percentual contra o CPA médio
- [x] Classificar região somente por correspondência inequívoca no nome da campanha
- [x] Agrupar campanhas nacionais e não identificáveis separadamente sem inventar localização
- [x] Exibir estados favorável, neutro e desfavorável por região com base no desvio do CPA médio
- [x] Validar que totais por produto e região conciliam com os totais gerais do período
- [x] Validar visualmente os quatro novos painéis da Visão Geral em desktop, tablet e mobile
- [x] Comprovar por teste TSX a renderização de variação absoluta e percentual no Histórico, inclusive no estado indisponível e sem linguagem causal
- [x] Permitir abrir diretamente cada aba por `?tab=overview|daily|investment|optimizations|history` para validação responsiva e compartilhamento de contexto
- [x] Corrigir overflow horizontal mobile da tabela Performance por Campanha na Visão Geral, preservando rolagem interna
- [x] Corrigir overflow horizontal mobile do cabeçalho de ciclo em Otimizações e garantir quebra segura de nomes longos
- [x] Remover truncamentos remanescentes para exibir sempre o nome completo da campanha junto do ID nas áreas operacionais
- [x] Adicionar teste de interface que garanta nome completo e ID real visíveis sem depender de tooltip

## Nova área — Leads

- [x] Auditar os quatro prints de referência e documentar a hierarquia visual do módulo de Leads
- [x] Auditar o CSV fornecido, seus cabeçalhos, tipos, datas, canais, modelos, regiões, concessionárias e possíveis duplicidades
- [x] Definir a identidade canônica por arquivo e linha, usando `Data Corrigida` como data de referência e preservando ocorrências repetidas
- [x] Definir o contrato de dados e as regras de normalização sem inventar valores ausentes
- [x] Criar tabela persistente de lotes de importação de CSV com hash, nome, status, contagens, usuário e timestamps
- [x] Criar tabela persistente de registros de leads normalizados e vinculados ao lote de origem
- [x] Criar configuração persistente e editável da meta mensal de Leads, iniciando com 10.000 para julho/2026
- [x] Gerar, revisar e aplicar migração não destrutiva das tabelas do módulo de Leads
- [x] Implementar parser CSV com validação de formato, encoding, datas e campos obrigatórios
- [x] Implementar importação autenticada, atômica e auditável, idempotente apenas para o reprocessamento do mesmo arquivo concluído
- [x] Exibir pré-validação do arquivo com linhas válidas, inválidas, duplicadas e resumo por período antes da confirmação
- [x] Implementar histórico de atualizações com arquivo, hash, usuário, data e resultado do processamento
- [x] Implementar métricas de total de leads, média diária, canal principal e canais ativos
- [x] Implementar pacing mensal com meta, atual, percentual, média/dia, projeção, diferença e dias restantes
- [x] Implementar série diária empilhada por canal e tendência diária total sem dupla contagem
- [x] Implementar distribuição e resumo por canal com leads, média/dia e participação
- [x] Implementar análises por modelo, região e concessionária apenas quando os campos reais permitirem classificação segura
- [x] Criar página/aba navegável `Leads` integrada ao dashboard atual e acessível por `?tab=leads`
- [x] Reproduzir o layout de referência no padrão visual MG Motors, com filtros 7d, 14d, mês e intervalo personalizado
- [x] Adicionar ação Atualizar CSV com seleção, pré-validação, confirmação, progresso, sucesso e erro
- [x] Adicionar edição protegida da meta mensal diretamente no painel de pacing
- [x] Exibir estados de carregamento, erro, arquivo inválido, ausência de dados e análises indisponíveis
- [x] Garantir que valores ausentes apareçam como indisponíveis, sem fabricar canal, modelo, região ou concessionária
- [x] Escrever testes Vitest para parser, datas, preservação de repetições, idempotência por arquivo, pacing e agregações de Leads
- [x] Escrever testes TSX para identidade dos filtros, estados vazios e resumo da pré-validação
- [x] Importar e validar o CSV fornecido preservando todas as 7.071 ocorrências, inclusive 99 repetições internas
- [x] Validar tipagem, suíte completa e build de produção
- [x] Validar visualmente a aba Leads em desktop, tablet e mobile, sem overflow horizontal do documento
- [x] Revisar todo.md e salvar checkpoint da versão com o módulo de Leads
- [x] Inserir a meta inicial de Leads de julho/2026 (`competencia` = `2026-07`, `goalCount` = 10000) no banco sem duplicação
- [x] Implementar helper/procedure autenticado para ler e editar a meta mensal de Leads com persistência auditável
- [x] Definir explicitamente `Data Corrigida`, `Modelo` e `Canal` como campos obrigatórios por linha no parser de Leads
- [x] Adicionar teste Vitest para linhas sem campos obrigatórios e sua contagem como inválidas
- [x] Calcular auditoria por concessionária com volume, participação, média diária, dias com e sem recebimento e primeira/última data no período
- [x] Criar visão navegável por concessionária com busca, ordenação, sinalização de ausência e evolução diária de recebimento
- [x] Separar explicitamente concessionárias indisponíveis/placeholders dos nomes válidos na auditoria
- [x] Adicionar testes de reconciliação da auditoria por concessionária com o total filtrado de Leads
- [x] Documentar comparação verificável entre os quatro prints de referência e a estrutura visual implementada na aba Leads
- [x] Validar o fluxo de sucesso e progresso da atualização CSV pela interface sem deixar dados sanitizados persistidos
- [x] Comprovar por testes os estados de carregamento, erro de consulta e ausência de dados da aba Leads
- [x] Adicionar teste Vitest do caminho transacional completo da importação, incluindo upload mockado, inserções, contagens e conclusão do lote
- [x] Adicionar teste Vitest do bloqueio de importação quando o CSV contém linha inválida
- [x] Validar no navegador a confirmação de um CSV já consolidado, comprovando sucesso idempotente e zero novos Leads persistidos

## Ajuste — preservar duplicatas do CSV

- [x] Alterar a identidade persistente da linha para incluir hash do arquivo e número da linha, preservando duplicatas internas e entre arquivos distintos
- [x] Manter a idempotência somente no reprocessamento do mesmo arquivo por `fileHash`
- [x] Tratar linhas repetidas na pré-validação como informativas e importáveis, sem removê-las do total válido
- [x] Recarregar o lote original com todas as 7.071 linhas válidas e reconciliar exatamente a ordem/quantidade do CSV
- [x] Atualizar contagens e textos da interface para não usar “Leads únicos” nem indicar que duplicatas foram removidas
- [x] Ajustar métricas, pacing e auditoria por concessionária para a base integral de 7.071 linhas
- [x] Atualizar testes do parser/importador para preservar as 99 repetições internas e continuar bloqueando reprocessamento do mesmo arquivo
- [x] Validar banco, navegador, tipagem, suíte completa e build após a mudança
- [x] Revisar todo.md e salvar checkpoint da versão que preserva duplicatas
- [x] Comparar CSV e banco por `sourceRowNumber`, conteúdo normalizado e sequência para comprovar a preservação das 7.071 ocorrências
- [x] Executar a reconciliação de ordem/quantidade e registrar o resultado antes do checkpoint

## Reorganização do menu principal

- [x] Criar menu principal com módulos independentes `Google Ads`, `Meta Ads` e `Leads`
- [x] Manter Visão Geral, Acompanhamento Diário, Investimento, Otimizações e Histórico como subnavegação exclusiva de Google Ads
- [x] Transformar Leads em módulo próprio sem subordinação visual ao menu de Google Ads
- [x] Manter o módulo `Meta Ads` navegável com a área de conteúdo completamente vazia nesta etapa
- [x] Preservar URLs compartilháveis e compatibilidade com os parâmetros atuais de abas do Google Ads e de Leads
- [x] Garantir navegação acessível, indicação visual do módulo ativo e comportamento responsivo em mobile
- [x] Adicionar testes TSX para roteamento entre Google Ads, Meta Ads e Leads
- [x] Validar navegador, console, tipagem, suíte completa e build após a reorganização
- [x] Revisar todo.md e salvar checkpoint da nova navegação modular
- [x] Abrir o módulo Leads por padrão do primeiro dia do mês até a última data disponível nos dados
- [x] Adicionar campos próprios de data inicial e data final no módulo Leads, usando `Data Corrigida` como referência
- [x] Aplicar o intervalo manual às métricas, gráficos e auditoria por concessionária, mantendo o pacing mensal pela competência
- [x] Validar e impedir intervalo de Leads com data inicial posterior à data final

## Consulta — Conta Meta via Windsor.ai

- [x] Verificar se há uma conta Meta Ads da MG Motors conectada no Windsor.ai e registrar nome e ID disponíveis

## Ajuste — Simplificação da auditoria de Leads

- [x] Remover o gráfico `Evolução diária por concessionária` da área de auditoria
- [x] Remover o card `Recebendo no último dia` da área de auditoria
- [x] Atualizar testes e validar que o restante do módulo Leads permanece íntegro
- [x] Revisar todo.md e salvar checkpoint do ajuste visual

## Ajuste — Ciclo unificado e conclusão de tarefas

- [x] Remover a seção independente `Recomendações baseadas em evidências`
- [x] Incorporar as recomendações e evidências diretamente nas tarefas do ciclo de otimização
- [x] Remover definição manual de responsável e o botão `Iniciar`
- [x] Permitir que o usuário autenticado conclua diretamente uma tarefa pelo botão `Concluir`
- [x] Registrar automaticamente nome e identificação do usuário que concluir a tarefa
- [x] Exibir três tarefas por linha na grade do ciclo em telas amplas
- [x] Atualizar testes de backend e interface para o novo fluxo de conclusão
- [x] Validar navegador, tipagem, suíte completa e build junto aos ajustes pendentes de Leads
- [x] Revisar todo.md e salvar checkpoint da versão consolidada

## Módulo — Dashboard Meta Ads via Windsor.ai

- [x] Consultar os campos e dimensões Meta Ads disponíveis para a conta `1418731006678061`
- [x] Confirmar o período disponível, a atualização mais recente e a integridade de investimento, leads e CPL
- [x] Mapear campanhas, conjuntos de anúncios, públicos, criativos e imagens acessíveis no Windsor.ai
- [x] Definir um contrato analítico Meta Ads sem área de otimizações
- [x] Implementar backend para consultar e agregar dados reais da conta Meta Ads vinculada
- [x] Aplicar filtro configurável de datas com padrão do primeiro dia do mês até o último dia completo disponível
- [x] Exibir KPIs de investimento, leads e CPL com comparação temporal quando houver dados
- [x] Exibir evolução diária de investimento, leads e CPL sem duplicidade de agregação
- [x] Extrair o modelo do veículo a partir do nome de campanha, conjunto ou criativo e consolidar leads por modelo
- [x] Exibir principais campanhas e conjuntos de anúncios com status e métricas de performance
- [x] Exibir principais públicos e segmentações com investimento, leads e CPL
- [x] Exibir ranking de criativos por performance com nome, métricas e imagem quando disponibilizada pela fonte
- [x] Exibir análise demográfica por gênero e faixa etária
- [x] Exibir análise geográfica por região disponível na fonte
- [x] Criar estados de carregamento, vazio, indisponibilidade e erro sem dados simulados
- [x] Integrar o módulo Meta Ads à navegação existente mantendo a linguagem visual do Google Ads
- [x] Cobrir agregações, rotas e interface com testes Vitest
- [x] Validar dados, responsividade, navegador, tipagem, suíte completa e build
- [x] Revisar todo.md e salvar checkpoint consolidado do dashboard Meta Ads

## Acesso dedicado — MG Motors

- [x] Criar autenticação local segura para o login `mg motors` sem armazenar a senha em texto puro
- [x] Criar o usuário MG Motors com senha criptografada e sessão autenticada compatível com o dashboard
- [x] Definir o idioma inglês como preferência obrigatória desse usuário
- [x] Traduzir integralmente para inglês todos os módulos e estados acessíveis ao usuário MG Motors
- [x] Permitir ao usuário MG Motors acesso a Google Ads, Leads e Meta Ads
- [x] Ocultar e bloquear no backend as áreas Google Ads `Optimizations` e `History` para o usuário MG Motors
- [x] Ocultar e bloquear no backend a atualização/importação CSV de Leads para o usuário MG Motors
- [x] Preservar as permissões e a experiência atuais dos demais usuários
- [x] Cobrir login, senha inválida, sessão, idioma e autorização por testes Vitest
- [x] Validar o acesso MG Motors em desktop e mobile sem expor controles restritos

## Acesso dedicado — winicius

- [x] Criar o usuário `winicius` com autenticação local e senha armazenada somente como hash seguro
- [x] Permitir ao usuário winicius acesso a Google Ads, Meta Ads, Leads, Optimizations e History
- [x] Ocultar e bloquear no backend a atualização/importação CSV de Leads para o usuário winicius
- [x] Preservar o idioma padrão atual para o usuário winicius
- [x] Cobrir autenticação e autorização específicas do usuário winicius com testes Vitest

## Controle — Última atualização do dashboard

- [x] Registrar no backend o instante real da última atualização bem-sucedida das fontes do dashboard
- [x] Exibir data e hora da última atualização ao lado da identificação do usuário no cabeçalho
- [x] Traduzir o rótulo para inglês no acesso MG Motors
- [x] Garantir que falhas de atualização não substituam o último horário válido
- [x] Cobrir formatação, persistência e visibilidade do indicador com testes Vitest

## Módulo — Plano de Mídia Digital

- [x] Inspecionar todas as abas, fórmulas, formatos e valores da planilha de plano de mídia enviada
- [x] Estruturar o plano de julho em um modelo mensal sem alterar os números fornecidos
- [x] Criar o menu `Plano de Mídia Digital` acessível a todos os usuários
- [x] Exibir o menu como `Digital Media Plan` e traduzir seu conteúdo no acesso MG Motors
- [x] Organizar os planos por competência mensal com julho como primeiro mês disponível
- [x] Exibir visão executiva de orçamento, canais, projeções, alocação e demais dimensões existentes na planilha
- [x] Preservar a leitura das fórmulas e totais calculados da planilha como valores consolidados no dashboard
- [x] Criar estados responsivos, vazio e erro para meses sem plano cadastrado
- [x] Cobrir navegação, seleção mensal e cálculos exibidos com testes Vitest
- [x] Validar a representação do plano de julho contra a planilha original

## Normalização — De/para de concessionárias

- [x] Inspecionar todas as abas e linhas da planilha `Delers.xlsx`
- [x] Criar um mapa explícito entre cada grafia de origem e o nome canônico da concessionária
- [x] Normalizar caixa, espaços, acentos e pontuação apenas como apoio à correspondência explícita
- [x] Aplicar o nome canônico antes de todos os agrupamentos, filtros, KPIs, gráficos e tabelas por concessionária
- [x] Preservar a grafia original de cada registro para auditoria
- [x] Não agrupar automaticamente nomes desconhecidos sem correspondência no de/para
- [x] Cobrir aliases, nomes canônicos e valores desconhecidos com testes Vitest
- [x] Validar que os totais gerais permanecem inalterados após a consolidação das concessionárias

## Atualização do de/para — nova base enviada em 21/07/2026

- [x] Inspecionar todas as abas, cabeçalhos e linhas de `pasted_file_5zD9JE_Delears_nova_tratada(1).xlsx`
- [x] Identificar inequivocamente a coluna de grafia de origem e a coluna de nome canônico
- [x] Detectar células vazias, aliases conflitantes e nomes canônicos duplicados antes da aplicação
- [x] Substituir o mapa anterior pela nova base oficial sem inferir correspondências ausentes
- [x] Atualizar os testes Vitest com aliases reais da nova planilha
- [x] Validar que aliases convergem ao nome canônico correto e nomes desconhecidos permanecem separados
- [x] Validar que a consolidação não altera o total geral de Leads nem a grafia original armazenada
- [x] Registrar no código a origem e a data da nova base de de/para para auditoria

## Atualização diária D-1 e revisão de criativos Meta Ads

- [x] Auditar o fluxo atual de consulta, cache e atualização de Google Ads e Meta Ads
- [x] Confirmar os campos reais de ID, nome, imagem, thumbnail e mídia disponíveis para cada criativo Meta Ads
- [x] Configurar execução automática diária às 08:30 no fuso America/Sao_Paulo (GMT-3)
- [x] Atualizar Google Ads e Meta Ads somente com dados completos de D-1
- [x] Registrar sucesso, falha, fonte, período e horário de cada atualização sem apagar o último estado válido
- [x] Garantir idempotência para reexecuções do mesmo D-1 e impedir duplicidade de métricas
- [x] Corrigir a associação entre criativo, imagem e métricas usando identificadores reais da fonte
- [x] Eliminar reutilização indevida da mesma imagem entre criativos diferentes
- [x] Exibir placeholder neutro somente quando a fonte não disponibilizar imagem válida
- [x] Manter o nome e o ID reais do criativo visíveis para auditoria
- [x] Atualizar testes Vitest do agendamento, D-1, idempotência e resolução de imagens
- [x] Validar no navegador os criativos Meta Ads em desktop e mobile
- [x] Inspecionar logs, executar tipagem, suíte completa e build de produção
- [x] Revisar todo.md e salvar checkpoint da correção

## Acessos Daniel e mgmotors

- [x] Auditar as contas persistidas sem expor hashes ou senhas
- [x] Criar ou atualizar o usuário `daniel` com senha armazenada somente como hash seguro
- [x] Conceder ao usuário Daniel acesso total a todos os módulos e operações do dashboard
- [x] Corrigir o login persistido da conta `mgmotors` para aceitar exatamente o usuário informado
- [x] Atualizar com segurança a senha da conta mgmotors sem armazenar texto puro
- [x] Manter o locale `en-US` obrigatório para mgmotors em todos os módulos, estados e mensagens acessíveis
- [x] Preservar para mgmotors as restrições de Otimizações, Histórico e importação CSV já definidas
- [x] Cobrir Daniel e mgmotors com testes de autenticação, idioma e autorização
- [x] Validar os dois logins no navegador e confirmar a matriz de módulos de cada conta
- [x] Remover utilitários temporários e auditar o projeto contra credenciais em texto puro

## Performance — atualizações mais rápidas

- [x] Medir separadamente latência fria e quente de Google Ads, Meta Ads, processamento, banco e renderização
- [x] Identificar chamadas duplicadas, consultas excessivas e etapas que bloqueiam o primeiro conteúdo útil
- [x] Definir metas de desempenho mensuráveis sem reduzir campos nem precisão dos dados D-1
- [x] Persistir ou reaproveitar o último snapshot válido para responder rapidamente após cold start
- [x] Consolidar solicitações simultâneas da mesma fonte e período em uma única atualização
- [x] Evitar reconsultar a fonte externa quando o D-1 já estiver completo e auditado
- [x] Exibir dados válidos já disponíveis enquanto a interface informa claramente o estado da atualização
- [x] Preservar data da fonte, data de atualização, idempotência e reconciliação das métricas
- [x] Adicionar testes Vitest para cache persistente, concorrência, invalidação e fallback em falha
- [x] Comparar benchmarks antes e depois em cenários frio, quente e concorrente
- [x] Inspecionar logs, executar tipagem, suíte completa, build e validação visual
- [x] Revisar todo.md e preparar o checkpoint consolidado da versão otimizada

## Atualização da base de leads — CSV até 20/07/2026

- [x] Auditar delimitador, encoding, cabeçalhos e total de linhas do CSV recebido
- [x] Confirmar o uso de `Data Corrigida` como data de referência e a cobertura máxima em 20/07/2026
- [x] Preservar o campo de concessionária exatamente como recebido no CSV
- [x] Identificar linhas inválidas, vazias, duplicadas e registros posteriores a 20/07/2026
- [x] Registrar contagens e cobertura da base antes da importação
- [x] Validar a chave idempotente e o comportamento de atualização do importador existente
- [x] Executar uma prévia da importação sem gravar dados e revisar aceitos, rejeitados e duplicados
- [x] Substituir a base ativa pelo arquivo consolidado completo, preservando todas as duplicatas presentes no CSV
- [x] Verificar contagens, datas, fontes, veículos, regiões e concessionárias após a importação
- [x] Confirmar no dashboard que os dados de leads chegam até 20/07/2026
- [x] Executar testes, tipagem e build relacionados à importação e analytics de leads
- [x] Revisar todo.md e salvar checkpoint da base atualizada

## Ajustes do novo CSV — concessionária e Webmotors

- [x] Aceitar a coluna K `Concessionarias corrijida` no formato consolidado recebido
- [x] Usar a coluna K como `dealerName` oficial nas métricas e distribuições do dashboard
- [x] Preservar a coluna `Concessionaria` original no payload bruto para auditoria
- [x] Manter exatamente o texto recebido na coluna K, normalizando apenas valores vazios ou placeholders já definidos
- [x] Atualizar testes do parser e persistência e validar preview e agregação por concessionária com a coluna K
- [x] Adicionar alerta visível na área de Leads: dados da Webmotors ainda não foram recebidos
- [x] Garantir que o alerta não remova nem reclassifique os 878 registros históricos da Webmotors
- [x] Validar o alerta em desktop e mobile e confirmar legibilidade nos dois idiomas aplicáveis

## Integridade linha a linha do CSV consolidado

- [x] Persistir exatamente as 7.611 linhas do arquivo recebido na base ativa
- [x] Preservar todas as ocorrências duplicadas como registros independentes
- [x] Atualizar o requisito: as 224 linhas sem `Data Corrigida` foram confirmadas pelo usuário como pertencentes a 20/07/2026
- [x] Manter `correctedDate` obrigatória após preencher as 224 datas confirmadas
- [x] Não deixar linhas sem data após a correção confirmada, evitando divergência entre total e gráficos
- [x] Confirmar zero registros sem data no CSV canônico
- [x] Garantir que a substituição transacional confirme 7.611 inserções antes de remover a base consolidada anterior
- [x] Adicionar testes para duplicatas, datas corrigidas, contagem exata e rollback de integridade

## Correção confirmada das 224 datas

- [x] Preencher `Data Corrigida` com 20/07/2026 somente nas 224 linhas confirmadas pelo usuário
- [x] Preservar o valor original vazio de `Data Corrigida` em evidência de auditoria
- [x] Gerar um CSV canônico com exatamente 7.611 linhas, sem deduplicação
- [x] Confirmar que o dia 20/07/2026 totaliza 540 linhas após a correção
- [x] Confirmar que o intervalo final permanece de 30/06/2026 a 20/07/2026
- [x] Atualizar a auditoria persistente com a regra de correção informada pelo usuário

## Clareza entre total da base e total filtrado de Leads

- [x] Confirmar no banco que as 20 linhas fora do filtro de julho pertencem a 30/06/2026
- [x] Manter o contrato atual: após a correção, o total integral e o total do período 01/07–20/07 serão ambos 7.611
- [x] Requisito substituído: o usuário confirmou que as 20 linhas de 30/06 pertencem a 01/07, tornando o período 01/07–20/07 igual a 7.611
- [x] Dispensar dois cards após alinhar a data normalizada; base e período padrão terão o mesmo total de 7.611
- [x] Não haverá registros fora do intervalo padrão após a correção confirmada
- [x] Nenhum texto adicional será necessário após corrigir a origem da divergência
- [x] Substituir o cenário obsoleto por validação de 7.611 na base e no período 01/07–20/07
- [x] Validar um único total reconciliado de 7.611 após a correção

## Correção final do intervalo de Leads para 01/07–20/07

- [x] Confirmar que existem exatamente 20 registros normalizados em 30/06/2026 antes da atualização
- [x] Atualizar somente `correctedDate` dessas 20 linhas para 01/07/2026
- [x] Preservar `correctedDateRaw`, `sourceDateRaw`, `rawPayload`, IDs e hashes para auditoria
- [x] Confirmar que nenhuma linha foi adicionada, removida ou deduplicada durante a correção
- [x] Confirmar total de 7.611 registros entre 01/07/2026 e 20/07/2026
- [x] Confirmar zero registros normalizados fora do intervalo 01/07/2026–20/07/2026
- [x] Atualizar a auditoria persistente com a correção de 30/06 para 01/07 informada pelo usuário
- [x] Validar no dashboard que o filtro padrão exibe 7.611 Leads

## Data ausente no CSV — fallback automático para ontem

- [x] Calcular o dia anterior à importação no fuso `America/Sao_Paulo`
- [x] Aplicar o fallback somente quando `Data Corrigida` estiver vazia ou composta apenas por espaços
- [x] Manter datas válidas exatamente como recebidas no CSV
- [x] Continuar rejeitando datas não vazias com formato ou valor inválido
- [x] Preservar o valor original vazio em `correctedDateRaw` e `rawPayload` para auditoria
- [x] Informar na prévia quantas linhas receberam o fallback automático
- [x] Persistir no lote de importação a data de fallback e a quantidade de linhas corrigidas
- [x] Garantir que a prévia e a confirmação da importação usem a mesma data de fallback
- [x] Adicionar testes de virada de dia, mês e ano no fuso de São Paulo
- [x] Adicionar testes que comprovem preservação de duplicatas e contagem integral com datas ausentes
- [x] Validar a mensagem da prévia em português e inglês

## Canal sem Leads no dia — alerta automático de atualização

- [x] Identificar os canais esperados a partir do catálogo da base consolidada, inclusive quando não aparecem no período selecionado
- [x] Completar a série diária de cada canal com zero nos dias sem registros, sem duplicar Leads
- [x] Exibir o estado visual `Em atualização` quando um canal tiver 0 Leads no dia
- [x] Remover automaticamente o alerta quando o canal tiver pelo menos 1 Lead no mesmo dia
- [x] Exibir o texto equivalente `Updating` para a conta `mgmotors`
- [x] Preservar o alerta específico já existente para os dados recentes da Webmotors
- [x] Adicionar testes para canal com zero, canal preenchido e alternância automática do estado
- [x] Validar o alerta no navegador desktop e, no mobile, por estrutura responsiva e testes devido ao isolamento da sessão de captura

## Exceção do alerta diário — Campanha Urban

- [x] Excluir `Campanha Urban` da detecção de canais com 0 Leads no dia
- [x] Garantir que a Campanha Urban nunca exiba `Em atualização`/`Updating` apenas por contagem diária zerada
- [x] Adicionar teste de regressão para a exceção da Campanha Urban

## Ajuste do período padrão — Mês

- [x] Alterar o início padrão do período `Mês` para `30/06/2026`
- [x] Preservar a data final e os demais atalhos de período existentes
- [x] Adicionar teste de regressão para o início padrão em `30/06/2026`
- [x] Validar a identidade visual do filtro após o ajuste

## Remoção do alerta específico da Webmotors

- [x] Remover o aviso fixo de dados recentes pendentes da Webmotors na área de Leads
- [x] Preservar o alerta automático geral para canais com 0 Leads no dia
- [x] Atualizar os testes para comprovar que o aviso específico não é mais renderizado
- [x] Executar tipagem, testes relacionados e build

## Alteração de acesso — mgmotors para mgmotor

- [x] Renomear o login persistido de `mgmotors` para `mgmotor`
- [x] Substituir a senha por um novo hash scrypt correspondente à credencial solicitada
- [x] Preservar locale `en-US`, módulos permitidos e restrições atuais da conta
- [x] Impedir autenticação com o login antigo `mgmotors`
- [x] Atualizar testes de autenticação e autorização sem registrar a senha em texto puro no projeto
- [x] Validar login novo, senha inválida, tipagem, suíte e build

## Aprofundamento da aba Otimizações

- [x] Auditar os tipos de ação gerados atualmente e identificar por que as tarefas se repetem
- [x] Mapear para cada campanha CPA atual, CPA médio de referência, CPA-alvo sugerido, estratégia de lance atual, orçamento, conversões e sinais de limitação
- [x] Criar recomendações variadas e mutuamente exclusivas para CPA-alvo, estratégia de lance, orçamento, segmentação, criativos e medição, somente quando houver evidência suficiente
- [x] Informar valores concretos de origem e destino em cada tarefa, incluindo qual CPA será alterado e para quanto
- [x] Exibir estratégia atual, estratégia recomendada, justificativa, evidências, impacto esperado, risco e passo a passo operacional
- [x] Evitar ações genéricas, repetidas, contraditórias ou que ultrapassem a verba disponível
- [x] Preservar IDs e nomes reais das campanhas e o vínculo com ciclos e histórico
- [x] Tornar o comentário de conclusão opcional no backend e na interface
- [x] Manter registro automático de usuário e horário ao concluir sem comentário
- [x] Atualizar testes do motor, deduplicação, transições e interface
- [x] Validar dados reais, responsividade por estrutura, tipagem, 102 testes, suíte completa e build

## Atualização do Plano de Mídia — nova planilha enviada

- [x] Auditar todas as abas, células preenchidas, fórmulas, mesclagens, formatos e competências do novo arquivo
- [x] Identificar orçamento, canais, produtos, projeções, metas e percentuais presentes, confirmando a ausência de região no arquivo sem inferir valores
- [x] Comparar a nova estrutura com o modelo atual do dashboard e documentar correspondências e diferenças
- [x] Substituir os dados do plano atual pelos valores consolidados da nova planilha
- [x] Confirmar que o arquivo não contém fórmulas e preservar exatamente linhas, subtotais e total geral estáticos, inclusive diferenças mínimas de arredondamento
- [x] Manter a navegação mensal e a versão integral em português e inglês
- [x] Preservar e validar os estados vazios bilíngues para competências sem plano
- [x] Atualizar testes de cálculos, navegação, rótulos e reconciliação
- [x] Validar a interface autenticada em desktop e a estrutura responsiva mobile com tabela em rolagem horizontal, sem overflow destrutivo
- [x] Executar tipagem, suíte completa e build antes do checkpoint

## Totais visíveis no gráfico de Leads por dia e canal

- [x] Exibir o total diário reconciliado acima de cada barra empilhada
- [x] Manter o detalhamento por canal no tooltip sem duplicar contagens
- [x] Reservar espaço vertical para os rótulos sem cortar os maiores valores
- [x] Evitar sobreposição e overflow dos totais em desktop e mobile
- [x] Atualizar testes do gráfico e validar tipagem, suíte e build

## Rótulo de Leads em qualificação

- [x] Substituir `Unavailable` por `Leads em qualificação` somente nas exibições de concessionária
- [x] Preservar a contagem, o percentual, os dados brutos e a reconciliação dos totais
- [x] Aplicar o rótulo no ranking Top dealers e nas demais visualizações por concessionária
- [x] Manter intactos os estados indisponíveis de outras dimensões e erros reais do sistema
- [x] Atualizar testes e validar tipagem, suíte, build e interface mobile

## Reprojeção do Plano de Mídia para 10.000 Leads

- [x] Alterar o total de Leads projetados de 17.000 para 10.000
- [x] Recalcular proporcionalmente os Leads projetados de Line-up e MG4 Urban
- [x] Recalcular proporcionalmente cada inserção do Plano de mídia detalhado com números inteiros
- [x] Garantir que produtos e inserções reconciliem exatamente com 10.000 Leads
- [x] Atualizar CPLs derivados sem alterar investimentos, CPM, impressões, CTR, cliques ou visitas
- [x] Atualizar testes e validar tipagem, suíte completa, build e interface

## Limpeza de duplicidades da base de Leads

- [x] Auditar a definição existente de duplicidade e os campos persistidos de Leads
- [x] Calcular o total atual, os grupos duplicados e a quantidade exata candidata à remoção
- [x] Preservar deterministicamente uma ocorrência por duplicidade exata
- [x] Executar a exclusão em migração controlada e registrar o total removido
- [x] Reconciliar o total posterior, confirmar ausência de duplicidades exatas e preservar registros apenas semelhantes
- [x] Validar testes, tipagem, build e a contagem exibida no módulo de Leads
- [x] Documentar a regra aplicada e informar ao usuário o resultado final

## Popup de Leads por canal na auditoria de concessionárias

- [x] Tornar cada concessionária da auditoria acionável por clique e teclado
- [x] Calcular a distribuição de Leads por canal respeitando filtros, normalização e período ativos
- [x] Exibir no popup quantidade, participação percentual e total da concessionária selecionada
- [x] Reconciliar a soma dos canais com o total exibido para a concessionária
- [x] Tratar concessionárias válidas e o grupo Leads em qualificação sem inventar classificações
- [x] Implementar popup acessível, responsivo e com estados vazio/indisponível
- [x] Atualizar testes unitários e de interface para abertura, fechamento e reconciliação
- [x] Validar tipagem, suíte completa, build e interface em desktop/mobile

## Deduplicação automática em novos uploads de Leads

- [x] Definir uma identidade de conteúdo estável e independente de arquivo, importação e número da linha
- [x] Preservar a primeira ocorrência exata e descartar repetições posteriores no mesmo CSV
- [x] Descartar em novos uploads ocorrências exatas já presentes na base
- [x] Registrar duplicados descartados no resumo auditável de cada importação
- [x] Manter `rowsTotal = inseridos + descartados + inválidos` em toda importação
- [x] Atualizar schema e migração sem perder a rastreabilidade da linha preservada
- [x] Cobrir duplicidades internas e entre arquivos com testes determinísticos
- [x] Validar que Leads apenas semelhantes continuam sendo importados

## Exportação XLSX da base deduplicada

- [x] Extrair todos os Leads consolidados e únicos diretamente do banco
- [x] Preservar as colunas de origem e os campos normalizados relevantes
- [x] Criar aba `Leads únicos` com filtros, cabeçalho fixo, formatos e larguras legíveis
- [x] Criar aba `Resumo` com totais antes/depois, registros removidos e regra de deduplicação
- [x] Validar 7.545 linhas de dados, unicidade canônica e consistência das datas
- [x] Entregar o arquivo XLSX final ao usuário

## Reconciliação dashboard 7.527 × base 7.545

- [x] Auditar os filtros padrão, o período e a consulta que alimentam o total do dashboard
- [x] Identificar exatamente os 18 Leads presentes na base e ausentes do total exibido
- [x] Determinar se a exclusão é intencional ou uma inconsistência da regra
- [x] Confirmar a base completa e o filtro mensal como escopos distintos e corretos
- [x] Reconciliar total geral, série diária, dimensões e auditoria por concessionária
- [x] Validar os totais exibidos e exportados com suas respectivas datas
- [x] Informar ao usuário a causa e os totais finais verificados

## Correção permanente dos 18 Leads do Mercado Livre

- [x] Auditar os campos de origem que distinguem exatamente as 18 ocorrências de 01/06/2026
- [x] Definir regra específica para corrigir essas ocorrências para 01/07/2026 sem afetar outros meses
- [x] Aplicar a correção no parser de todo novo upload antes da deduplicação canônica
- [x] Atualizar o hash canônico após a data corrigida e preservar a unicidade da base
- [x] Corrigir os 18 registros existentes e reconciliar julho em 7.545 Leads
- [x] Confirmar que junho deixa de conter essas ocorrências e que o total geral permanece 7.545
- [x] Cobrir o parser e revalidar as regressões de importação e análise por período
- [x] Validar tipagem, 106 testes, build e total reconciliado do dashboard

## Atualização Google Ads e Meta Ads até 21/07/2026

- [x] Auditar conectores habilitados, contas vinculadas e datas máximas atuais por fonte
- [x] Atualizar Google Ads com dados fechados até 21/07/2026
- [x] Atualizar Meta Ads com dados fechados até 21/07/2026
- [x] Confirmar investimento, conversões/resultados, cliques, impressões e disponibilidade real de ROAS por canal
- [x] Invalidar ou renovar caches sem duplicar dias, campanhas, anúncios ou métricas
- [x] Reconciliar totais e confirmar a data máxima de 21/07/2026 em cada plataforma
- [x] Validar tipagem, suíte completa, build e carregamento dos snapshots persistidos
- [x] Documentar eventuais atrasos, lacunas ou limitações devolvidas pelos conectores

## Auditoria da distribuição por canal até 20/07/2026

- [x] Consultar a base entre 01/07 e 20/07/2026 e agrupar Leads pela mesma normalização do dashboard
- [x] Confirmar o total geral e os volumes de Site, Meta, Webmotors, Campanha Urban, Mercado Livre e UOL
- [x] Recalcular médias diárias sobre 20 dias corridos
- [x] Recalcular participações percentuais sobre o total de 7.545 Leads
- [x] Verificar soma dos canais, soma dos percentuais e ausência de canais omitidos
- [x] Comparar os resultados com os valores exibidos na captura do dashboard
- [x] Documentar o parecer sem modificar a base ou a interface

## Reconciliação Total de Leads 8.099 × Atual/Meta 8.081

- [x] Consultar os volumes acumulados até 22/07 e até 23/07/2026
- [x] Confirmar quantos Leads pertencem exclusivamente ao dia 23/07/2026
- [x] Validar que o card Total de Leads inclui 23 dias do período
- [x] Validar que o pacing considera somente dias fechados até 22/07/2026
- [x] Reconciliar matematicamente a diferença de 18 Leads
- [x] Informar a causa sem modificar dados ou regras do dashboard

> Reconciliação verificada em 22/07/2026: 8.080 Leads até 21/07, 8.081 até 22/07, 8.081 até 23/07, 1 Lead exclusivo em 22/07 e 0 em 23/07. A diferença histórica de 18 vinha da inclusão de 30/06 no card, enquanto o pacing era mensal desde 01/07.

## Regra global D-1 em todo o dashboard

- [x] Auditar todos os usos de data atual, data máxima, filtros padrão e períodos enviados ao backend
- [x] Centralizar o cálculo de ontem no fuso `America/Sao_Paulo`
- [x] Permitir armazenamento e importação de dados do dia atual sem exibi-los no mesmo dia
- [x] Limitar Total de Leads, médias, canais, modelos, regiões, concessionárias e série diária até D-1
- [x] Limitar pacing, metas e projeções a dias fechados até D-1
- [x] Fazer o aviso de canais sem Leads verificar sempre D-1, mesmo quando todos estejam zerados
- [x] Aplicar o mesmo limite a Google Ads, Meta Ads e demais módulos temporais
- [x] Impedir que filtros padrão ou personalizados ultrapassem D-1 nas consultas do dashboard
- [x] Atualizar textos de período e estado de atualização para mostrar explicitamente a data de D-1
- [x] Cobrir cenários com dados no dia atual, com dados ontem e sem dados ontem
- [x] Validar tipagem, suíte completa, build e interface desktop/mobile

- [x] Prioridade urgente: unificar todos os valores exibidos em Leads usando o mesmo corte D-1
- [x] Validar que resumo, gráficos, tabelas, auditoria, pacing e alerta de canais retornam o mesmo universo de Leads
- [x] Preparar checkpoint validado para publicação imediata antes da reunião do cliente

## Agrupamento integral de Leads sem concessionária

- [x] Auditar todos os valores atuais que não representam uma concessionária válida
- [x] Reclassificar `Outros`, vazios, indisponíveis e placeholders como `Leads em qualificação`
- [x] Preservar o valor original da planilha para auditoria sem exibi-lo como concessionária válida
- [x] Reconciliar ranking, resumo, auditoria, popup por canal e total geral após o agrupamento
- [x] Atualizar testes e validar tipagem, suíte completa, build e interface
- [x] Salvar checkpoint da versão com o agrupamento corrigido

## Nova exportação da base deduplicada

- [x] Confirmar a mesma identidade canônica e a estrutura XLSX usadas na exportação anterior
- [x] Extrair todos os Leads atuais e únicos diretamente do banco
- [x] Gerar nova aba `Leads únicos` e resumo auditável sem duplicatas
- [x] Validar quantidade, unicidade canônica, intervalo de datas e reconciliação do arquivo
- [x] Entregar o XLSX atualizado ao usuário

## Abertura imediata do calendário nos campos de data

- [x] Localizar todos os campos de data usados em Leads, Google Ads e Meta Ads
- [x] Fazer o clique em qualquer ponto do campo abrir o calendário nativo
- [x] Preservar digitação, teclado, acessibilidade, limites mínimos e corte D-1
- [x] Atualizar testes e validar a interação real no navegador
- [x] Validar tipagem, suíte completa e build
- [x] Salvar checkpoint da alteração de calendário

## Reconciliação Meta Ads × base de Leads

- [x] Confirmar o mesmo período D-1 nos dois totais comparados
- [x] Consultar o total Meta Ads pela conexão nativa e o total equivalente na base
- [x] Isolar os 20 Leads de diferença por data, campanha, canal e regra de atribuição
- [x] Verificar obrigatoriamente a inclusão do canal/campanha `Site`
- [x] Documentar a causa exata sem alterar números antes da comprovação
- [x] Corrigir o painel somente se a reconciliação demonstrar erro de regra ou filtro

## Redistribuição da meta para 10.000 Leads na planilha de mídia

- [x] Auditar todas as abas, fórmulas, totais e células de distribuição do XLSX fornecido
- [x] Confirmar no dashboard as proporções vigentes de distribuição da meta de Leads
- [x] Calcular alocação inteira com soma exata de 10.000 Leads e menor erro proporcional
- [x] Atualizar Total e todas as abas dependentes sem alterar o layout original
- [x] Validar fórmulas, somas, percentuais, estilos, células mescladas e integridade do XLSX
- [x] Entregar a planilha redistribuída ao usuário

## Indicador superior de Leads nas concessionárias

- [x] Confirmar no backend a regra canônica que separa Leads atribuídos a concessionárias de `Leads em qualificação`
- [x] Expor no resumo analítico o total dinâmico de Leads efetivamente atribuídos a concessionárias
- [x] Incluir no topo da aba Leads o card `Total de Leads nas concessionárias` com o mesmo período e filtros ativos
- [x] Ajustar a grade responsiva dos indicadores sem comprometer os cards existentes
- [x] Atualizar testes para reconciliar `Total de Leads = Leads nas concessionárias + Leads em qualificação`
- [x] Validar tipagem, suíte completa, build e interface em desktop e mobile
- [x] Salvar checkpoint da alteração solicitada pelo cliente

## Card superior independente de Leads em qualificação

- [x] Reutilizar `dealerAudit.summary.unavailableLeads` como fonte canônica do novo indicador
- [x] Inserir o card `Leads em qualificação` imediatamente após `Total de Leads nas concessionárias`
- [x] Exibir no novo card quantidade e participação percentual sobre o total filtrado
- [x] Simplificar o subtítulo do card de concessionárias para evitar duplicação da quantidade em qualificação
- [x] Ajustar a grade superior para seis indicadores responsivos em desktop e mobile
- [x] Atualizar testes para os três totais e a reconciliação exata entre eles
- [x] Validar tipagem, suíte completa, build e interface responsiva
- [x] Salvar checkpoint do novo card solicitado
- [x] Exibir o novo card e seus textos integralmente em inglês quando o locale do usuário mgmotor for `en-US`
- [x] Adicionar teste específico para título, descrição e formatação numérica em inglês

## Usuário mgsales e histórico administrativo de acessos

- [x] Auditar o fluxo atual de autenticação local, permissões do mgmotor e navegação exclusiva de administradores
- [x] Criar tabela persistente de eventos de acesso com usuário, resultado, data/hora UTC, IP e user agent, sem armazenar credenciais
- [x] Registrar login bem-sucedido, login recusado e logout sem impedir a autenticação caso a auditoria falhe
- [x] Criar procedimento paginado e protegido para consulta do histórico somente por administradores autorizados
- [x] Criar ou atualizar o usuário `mgsales` com senha armazenada exclusivamente como hash seguro
- [x] Replicar para `mgsales` o locale `en-US`, módulos permitidos e restrições do usuário `mgmotor`
- [x] Impedir que `mgsales` acesse Otimizações, Histórico e importação de CSV, como ocorre com `mgmotor`
- [x] Adicionar ao usuário administrador `rodrigo` a aba `Histórico de acessos`
- [x] Exibir na nova aba usuário, resultado, data/hora local, IP, navegador/dispositivo e filtros úteis
- [x] Ocultar a aba e bloquear a API para mgmotor, mgsales e demais usuários não administradores
- [x] Adicionar testes de autenticação, autorização, persistência, paginação, idioma e ausência de senha nos logs
- [x] Gerar e aplicar migração não destrutiva da tabela de auditoria
- [x] Validar tipagem, suíte completa, build e interface responsiva
- [x] Revisar todo.md e salvar checkpoint da versão com mgsales e auditoria de acessos
- [x] Aplicar a senha curta autorizada somente à conta `mgsales`, mantendo intacta a validação global de mínimo de 8 caracteres
- [x] Comprovar que a credencial de `mgsales` foi persistida apenas como hash scrypt e que autentica corretamente

## Vendas semanais e conversão por concessionária

- [x] Auditar delimitador, encoding, cabeçalhos, semanas, totais e nomes de concessionárias do CSV de vendas recebido
- [x] Confirmar a interpretação da coluna Semana 4 como referência mensal de vendas, sem somar novamente Semanas 1–3
- [x] Preservar o nome original da concessionária e aplicar somente o de/para explícito já usado no dashboard
- [x] Identificar concessionárias sem correspondência, aliases conflitantes, linhas de total e valores inválidos antes da importação
- [x] Definir competência, identidade de arquivo/linha e contrato auditável da base semanal de vendas
- [x] Definir `taxa de conversão = vendas da Semana 4 / Leads do mesmo dealer e competência`
- [x] Definir `Leads por venda = Leads / vendas da Semana 4`, exibindo indisponível quando não houver vendas
- [x] Definir `Leads estimados para uma venda = arredondamento para cima de Leads por venda`, sem apresentar a estimativa como garantia
- [x] Criar tabelas persistentes de lotes e registros semanais de vendas com hash, usuário, contagens e timestamps UTC
- [x] Implementar importação CSV pré-validada, transacional e idempotente para atualização da base de vendas
- [x] Restringir a atualização da base de vendas a usuários com permissão administrativa de importação
- [x] Integrar as vendas da Semana 4 às métricas de cada concessionária sem duplicar Leads ou vendas
- [x] Expor no backend vendas mensais, conversão, Leads por venda e Leads estimados para uma venda
- [x] Incluir no ranking/auditoria por concessionária colunas de vendas, conversão e eficiência de Leads
- [x] Incluir no detalhe de cada concessionária o histórico Semanas 1–4 e a referência mensal da Semana 4
- [x] Criar ação administrativa `Atualizar vendas` com prévia, confirmação, sucesso, erro e histórico do arquivo
- [x] Traduzir integralmente os novos indicadores e estados para `en-US` em mgmotor e mgsales
- [x] Tratar dealers sem vendas, sem Leads ou sem correspondência com estados explícitos e sem divisão por zero
- [x] Adicionar testes de parser, de/para, idempotência, fórmulas, autorização, reconciliação e interface bilíngue
- [x] Gerar e aplicar migração não destrutiva das tabelas de vendas semanais
- [x] Importar o CSV recebido e reconciliar linhas, concessionárias, Semana 4, Leads e totais exibidos
- [x] Validar tipagem, suíte completa, build e interface desktop/mobile
- [x] Revisar todo.md e salvar checkpoint da integração de vendas por concessionária
- [x] Implementar exclusivamente a opção escolhida de upload manual semanal, sem agendamento ou dependência externa
- [x] Incorporar ao de/para de vendas os seis aliases confirmados: Baltic, Indiana, JRCA, Toriba, Potenza e Tecar Brasília
- [x] Gerar ao final a lista das concessionárias do CSV de vendas sem correspondência na base atual de Leads do dashboard

## Correção de consolidação ORVEL — Julho de 2026

- [x] Mapear todas as ocorrências de `orvel_shopping_vitória_-_vitória/es_` no código, na base de Leads e nas métricas exibidas
- [x] Adicionar de/para explícito de `orvel_shopping_vitória_-_vitória/es_` para `ORVEL - VITÓRIA`
- [x] Consolidar registros persistidos no dealer canônico sem duplicar Leads nem alterar totais gerais
- [x] Validar que a interface exibe somente `ORVEL - VITÓRIA` e recalcula as métricas consolidadas corretamente
- [x] Executar testes, checagem de tipos e build após a correção
- [x] Revisar todo.md e salvar checkpoint da consolidação ORVEL

## Histórico de canais na tabela de vendas — Julho de 2026

- [x] Mapear o popup existente de Leads por canal e a fonte de dados usada pela auditoria de concessionárias
- [x] Adicionar botão `Histórico dos canais` ao lado do status `Correspondente` na tabela semanal
- [x] Exibir no popup quantidade, participação e total de Leads por canal para o dealer selecionado
- [x] Respeitar período ativo, normalização canônica, canal `Site`, locale e estados sem dados
- [x] Garantir acessibilidade, responsividade e ausência do botão para dealers sem correspondência
- [x] Adicionar testes e validar tipagem, suíte completa, build e interface
- [x] Revisar todo.md e salvar checkpoint da melhoria

## Leads acumulados nos cards semanais — Julho de 2026

- [x] Confirmar os cortes das Semanas 1–4 e sua relação acumulada com metas e vendas do CSV
- [x] Calcular Leads acumulados por dealer em cada corte semanal, respeitando competência, D-1 e normalização canônica
- [x] Garantir que os Leads da Semana 4 conciliem com o total mensal usado na conversão do dealer
- [x] Expor o campo semanal no contrato da API sem alterar fórmulas ou importações existentes
- [x] Exibir `Leads` em cada card Semana 1–4, com tradução para `en-US` e estado indisponível quando aplicável
- [x] Validar dados reais, reconciliação, acessibilidade e responsividade dos cards
- [x] Adicionar testes e executar tipagem, suíte completa e build
- [x] Revisar todo.md e salvar checkpoint da melhoria

## Recálculo após upload de Leads e remoção da auditoria legada — Julho de 2026

- [x] Auditar a invalidação de consultas após confirmar um upload de CSV de Leads
- [x] Garantir atualização automática da Eficiência de vendas, Leads semanais, conversão e histórico dos canais após cada importação concluída
- [x] Cobrir importações novas e reprocessamentos idempotentes sem exigir novo upload do CSV de vendas
- [x] Remover os cards `Concessionárias válidas`, `Leads atribuídos` e `Leads em qualificação` do bloco legado
- [x] Remover a tabela `Auditoria de recebimento por concessionária` e seus controles da aba Leads
- [x] Preservar a nova tabela de Eficiência de vendas e o popup `Histórico dos canais`
- [x] Atualizar testes e validar o fluxo real de upload, recálculo, tipagem, build e responsividade
- [x] Revisar todo.md e salvar checkpoint das alterações

## Reconciliação DRSUL 632 × 650 — Julho de 2026

- [x] Confirmar o período, corte D-1 e regra canônica que produzem os 632 Leads exibidos para DRSUL - PORTO ALEGRE
- [x] Levantar todas as grafias e aliases DRSUL presentes na base consolidada e nos arquivos importados
- [x] Identificar nominalmente os 18 registros da diferença por data, canal, dealer original, lote e status de deduplicação
- [x] Verificar se os 650 incluem dados fora do período, dia atual, duplicidades ou nomes ainda não mapeados
- [x] Corrigir regra, alias ou dado somente se a reconciliação comprovar erro do dashboard — não aplicável: a auditoria confirmou que o dashboard está correto
- [x] Revalidar total de DRSUL, conversão, Leads semanais e histórico dos canais após a conclusão
- [x] Documentar a causa exata e informar ao usuário sem estimativas
- [x] Revisar todo.md e salvar checkpoint somente se houver alteração no projeto

## Filtro aplicado à Eficiência de vendas e Exportar base — Julho de 2026

- [x] Mapear o intervalo ativo da aba Leads até a consulta de Eficiência de vendas e a futura exportação
- [x] Recalcular Leads, conversão, Leads por venda, estimativa e canais conforme `Data Corrigida` no período selecionado
- [x] Manter vendas da Semana 4 fixas como referência mensal e identificar claramente o período dos Leads
- [x] Implementar endpoint autenticado de exportação disponível a todos os usuários com acesso à aba Leads
- [x] Exportar Excel `.xlsx` com abas `Resumo` e `Base de Leads`, cabeçalhos, filtros, congelamento, larguras e datas formatadas
- [x] Remover repetições exatas somente da exportação, preservando registros distintos por data, canal ou concessionária
- [x] Informar no Resumo as linhas filtradas, as linhas exportadas e as duplicatas removidas
- [x] Adicionar botão `Exportar base` visível para todos os usuários da aba Leads e vinculado ao filtro ativo
- [x] Validar conteúdo do Excel, autorização, filtros de data, recálculo da tabela, idiomas e responsividade
- [x] Executar testes, tipagem, build, revisar todo.md e salvar checkpoint

## Remoção de Canal principal e Canais ativos — Julho de 2026

- [x] Remover os cards `Canal principal` e `Canais ativos` do topo da aba Leads
- [x] Reajustar a grade dos indicadores restantes em desktop e mobile
- [x] Atualizar testes para garantir a ausência dos dois cards
- [x] Validar tipagem, testes, build e interface responsiva
- [x] Revisar todo.md e salvar checkpoint consolidado

## Indicadores de Leads e acesso exclusivo do mgsales — Julho de 2026

- [x] Atualizar o título `Leads em qualificação` para incluir `/ sem cobertura de PDV` em português
- [x] Exibir `/ no POS coverage` no título equivalente para usuários `en-US`
- [x] Ocultar o card `Média diária` e reorganizar os três indicadores restantes em desktop e mobile
- [x] Restringir o usuário `mgsales` exclusivamente ao módulo Leads
- [x] Tornar a experiência de `mgsales` somente leitura, ocultando importações, exportação e demais ações de alteração
- [x] Bloquear no backend o acesso direto de `mgsales` a módulos e operações não permitidos
- [x] Atualizar testes de locale, layout, navegação, autorização e modo somente leitura
- [x] Validar tipagem, suíte completa, build e interface em desktop e mobile
- [x] Revisar todo.md e salvar checkpoint consolidado

## Importação PDF Weekly Target Achievement - Retail — Julho de 2026

- [x] Auditar no PDF real a tabela `Weekly Target Achievement - Retail`, suas páginas, regiões, dealers e colunas semanais
- [x] Mapear `W1–W5 TGT`, `W1–W5 Retail` e percentuais sem tratar subtotais regionais ou Total como concessionárias
- [x] Definir a competência e as regras para semanas ainda não preenchidas sem fabricar valores
- [x] Implementar extração estruturada do PDF rasterizado com validação determinística de título, linhas, percentuais e reconciliação
- [x] Preservar compatibilidade integral com o importador CSV semanal existente
- [x] Integrar seleção de PDF, pré-validação, confirmação e mensagens bilíngues ao fluxo `Atualizar vendas`
- [x] Manter autorização administrativa e impedir importação pelo usuário `mgsales`
- [x] Cobrir com Vitest variações de espaçamento, casas decimais, células vazias, totais e regressões CSV, além de validar o PDF real ponta a ponta
- [x] Validar a prévia do arquivo enviado e o caminho transacional/idempotente sem duplicar lotes ou vendas e sem gravar o relatório de referência
- [x] Executar tipagem, suíte completa, build e validação responsiva
- [x] Revisar todo.md e salvar checkpoint consolidado

## Última semana preenchida como referência de vendas — Julho de 2026

- [x] Mapear todos os usos fixos de Semana 4 no parser, serviço, métricas, exportação e interface
- [x] Definir a última semana preenchida como a maior W1–W5 com Retail informado no Total do arquivo
- [x] Impedir que semanas futuras, vazias ou apenas com meta sejam escolhidas como referência
- [x] Persistir e expor a semana de referência do lote sem perder importações CSV/PDF existentes
- [x] Recalcular vendas, conversão, Leads por venda e estimativa pela semana de referência dinâmica
- [x] Atualizar textos, cards, tabela, histórico e prévia para identificar a semana realmente utilizada
- [x] Preservar todas as semanas importadas, competência, de/para, autorização e idempotência
- [x] Cobrir W1, W2, W3, W4 e W5, células vazias, arquivos legados e regressões CSV/PDF com Vitest
- [x] Validar tipagem, suíte completa, build e interface responsiva
- [x] Revisar todo.md e salvar checkpoint consolidado

## Correção do reconhecimento de PDF no upload de vendas — Julho de 2026

- [x] Reproduzir o erro que encaminha um PDF ao parser CSV e rastrear nome, MIME e bytes entre navegador, tRPC e serviço
- [x] Detectar PDF pela assinatura `%PDF-` além da extensão e do MIME, sem confiar apenas no nome do arquivo
- [x] Encaminhar PDFs válidos ao parser `Weekly Target Achievement - Retail` e manter CSV no parser existente
- [x] Rejeitar arquivos com extensão, MIME e assinatura conflitantes com uma mensagem específica e segura
- [x] Preservar a última semana preenchida, competência, autorização, idempotência e limite de upload
- [x] Cobrir PDF real/assinado, nomes sanitizados, CSV válido e formatos inválidos com Vitest
- [x] Validar tipagem, suíte completa, build e interface
- [x] Revisar todo.md e salvar checkpoint consolidado

## Cadência de CPA e histórico de negativas — feedback operacional de Julho de 2026

- [x] Auditar onde o dashboard calcula a janela de sete dias e identifica a última otimização por campanha
- [x] Reproduzir os casos Sem Marca relatados em que uma nova troca de CPA surge após três dias, incluindo as identidades encontradas na base real
- [x] Definir cooldown mínimo de sete dias corridos após uma ação de CPA efetivamente concluída
- [x] Manter recomendações pendentes no ciclo seguinte sem duplicá-las nem reiniciar sua data de origem
- [x] Exibir quantos dias faltam e a data da próxima elegibilidade quando uma campanha estiver em cooldown
- [x] Bloquear oscilações de CPA causadas por amostras inferiores a sete dias, inclusive mudanças de R$ 20 para R$ 7
- [x] Identificar e remover tarefas redundantes de gerar relatório quando os mesmos dados já estão no dashboard
- [x] Registrar palavras-chave negativas aplicadas com conta, campanha, termo, data, origem e responsável
- [x] Expor histórico filtrável de negativas sem exigir relatório manual separado
- [x] Preservar negativações normais, tarefas pendentes, histórico de otimizações, orçamento e permissões
- [x] Cobrir cooldown, carry-over, deduplicação, casos Sem Marca encontrados na base e histórico de negativas com Vitest
- [x] Validar tipagem, suíte completa, build e interface responsiva
- [x] Revisar todo.md e salvar checkpoint consolidado

## Correção adicional — quarentena operacional de tarefas CPA legadas

- [x] Decorar tarefas abertas de CPA do ciclo ativo com elegibilidade, cooldown, data de liberação e duplicidade por família
- [x] Consolidar visualmente duplicatas legadas por campanha+família sem apagar histórico persistido
- [x] Bloquear no servidor início e conclusão de tarefa CPA durante os sete dias ou quando ela for duplicata legada
- [x] Exibir tarefas canônicas em observação com dias restantes e próxima data elegível, sem botão executável
- [x] Cobrir a cronologia real Sem Marca SP/SCS e a quarentena de tarefas legadas com Vitest
- [x] Revalidar Otimizações e Histórico autenticados em desktop e mobile
- [x] Executar suíte completa, TypeScript, build, revisar todo.md e salvar checkpoint consolidado
- [x] Corrigir o erro `Invalid time value` ao formatar a data de liberação do cooldown e cobrir a regressão

## Cobertura de criativos ativos — Meta Ads e Google Ads

- [x] Auditar a fonte atual dos criativos do Meta e confirmar conta, paginação, status efetivo e formatos disponíveis
- [x] Validar a cobertura real de imagens, vídeos, carrosséis e demais variações do Meta sem limitar a primeira página
- [x] Auditar a fonte do Google Ads e confirmar disponibilidade de ativos de Performance Max, YouTube e Display
- [x] Definir de forma explícita o que significa `rodando ativo` em campanha, grupo/conjunto, anúncio e ativo
- [x] Implementar contratos tipados, paginação completa, deduplicação e cache seguro para criativos do Meta
- [x] Retirar os contratos e a interface de criativos Google desta versão por decisão do usuário
- [x] Garantir prévias reais de imagem e vídeo sem armazenar mídia localmente nem expor credenciais
- [x] Substituir o requisito de apenas ativos pelo escopo confirmado de todos os criativos Meta acessíveis, com status operacional
- [x] Retirar a aba Google Ads `Criativos` desta versão por decisão do usuário
- [x] Preservar a auditoria de Google Ads para uma implementação futura com fonte de mídia compatível
- [x] Informar na interface a data da atualização, a cobertura retornada e eventuais mídias sem URL disponível na fonte
- [x] Cobrir paginação, atividade, deduplicação, formatos, autorização e estados indisponíveis com Vitest
- [x] Validar os totais contra a fonte Meta real e revisar casos sem prévia para não afirmar cobertura inexistente
- [x] Validar a experiência Meta autenticada em desktop e mobile, sem overflow e com carregamento progressivo
- [x] Executar suíte completa, TypeScript, build, revisar todo.md e salvar checkpoint consolidado

## Escopo confirmado — cobertura integral de criativos Meta

- [x] Consultar todos os anúncios acessíveis da conta Meta, inclusive objetos sem insights no período, sem depender de gasto ou impressão
- [x] Reconciliar a cobertura do backend com a listagem operacional da conta e declarar total, ativos, pausados e itens sem prévia
- [x] Persistir no contrato os status efetivos de campanha, conjunto e anúncio e derivar um estado operacional único
- [x] Identificar imagem, carrossel e vídeo pelos campos próprios da fonte, sem inferir formato apenas por thumbnail
- [x] Preservar capa, permalink, prévias de vídeo e metadados dos cartões de carrossel quando disponíveis
- [x] Deduplicar por anúncio e criativo sem ocultar peças diferentes nem multiplicar linhas de desempenho
- [x] Exibir aviso geral de que os criativos estão desativados no momento quando não houver cadeia efetivamente ativa
- [x] Marcar cada card como `Desativado`, `Campanha pausada`, `Conjunto pausado` ou `Anúncio pausado`, conforme o status real
- [x] Informar a data de atualização, a cobertura retornada e qualquer limitação de mídia diretamente na interface
- [x] Cobrir coleta completa, deduplicação, formatos, status, cobertura e interface com Vitest
- [x] Validar os totais e formatos contra a conta real e inspecionar a experiência autenticada em desktop e mobile
- [x] Executar suíte completa, TypeScript e build; revisar todo.md e salvar checkpoint consolidado

## Duplicações por canal no fluxo Atualizar CSV — Julho de 2026

- [x] Auditar a pré-validação, a confirmação e o banner final do botão `Atualizar CSV`
- [x] Preservar a identidade canônica e a contagem integral de linhas do CSV durante a classificação
- [x] Calcular duplicatas internas do arquivo por canal normalizado
- [x] Calcular duplicatas já existentes na base por canal normalizado
- [x] Reconciliar por canal e no total: linhas do arquivo = inseridas + duplicadas internas + duplicadas da base + inválidas
- [x] Expor o detalhamento tipado por canal na pré-validação e no resultado persistido da importação
- [x] Exibir no modal de confirmação os canais com duplicações e suas duas origens
- [x] Exibir após a importação o resumo por canal junto ao total de linhas inseridas
- [x] Tratar canal vazio ou não reconhecido como categoria explícita, sem ocultar duplicações
- [x] Preservar permissões, idempotência, exportação, recálculos e mensagens atuais de sucesso/erro
- [x] Cobrir classificação, reconciliação, contrato e interface com Vitest
- [x] Validar o fluxo autenticado em desktop e mobile com uma fixture determinística
- [x] Executar suíte completa, TypeScript e build; revisar todo.md e salvar checkpoint consolidado

## Apresentação de resultados para reunião do cliente — Julho de 2026

- [x] Consolidar o recorte D-1 até 27/07/2026 e o período de 27 dias de entrega
- [x] Extrair o plano de mídia e calcular o orçamento projetado proporcional aos 27 dias
- [x] Extrair investimento realizado por canal via Windsor.ai
- [x] Reconciliar Leads da base com os canais de mídia e calcular CPL realizado
- [x] Comparar projetado versus realizado para UOL, Webmotors e Mercado Livre (MELI)
- [x] Preparar visão consolidada por canal, incluindo Meta Ads, Google Ads e demais canais disponíveis
- [x] Preparar quebras de Leads por modelo e concessionária
- [x] Preparar visão de vendas, conversão e eficiência por concessionária
- [x] Escrever narrativa executiva e recomendações para aproximadamente 10 slides
- [x] Gerar apresentação com visual clean, gráficos legíveis e identificação clara do período
- [x] Validar todas as reconciliações, fontes e arredondamentos antes da entrega
- [x] Consolidar PMAX, Search, Demand Gen e YouTube em um único canal principal `Google Ads` em todos os comparativos projetado × realizado
- [x] Tratar `Proxy` como canal não veiculado, com investimento realizado de R$ 0,00 e CPL não aplicável; separar eventuais Leads registrados sem mídia no período
- [x] Incluir investimento realizado informado de `Publya Display` em R$ 79.717,57 como mídia programática separada
- [x] Somar investimento realizado informado de `Publya Meta` em R$ 95.698,73 ao canal consolidado `Meta Ads`, mantendo a origem explícita e sem dupla contagem
- [x] Usar a nomenclatura final `Publya Programática/Display` para o investimento realizado de R$ 79.717,57, sem criar linhas separadas de Programática e Display
- [x] Usar planejamento acumulado de 27 dias de R$ 94.499,58 para `Publya Programática/Display`
- [x] Usar planejamento acumulado de 27 dias de R$ 126.300,42 para `Meta Ads`

## Complemento da apresentação — correção de tags Google Ads

- [x] Localizar a data exata e o contexto operacional da correção das tags de conversão
- [x] Extrair investimento, conversões reportadas e CPA do Google Ads por dia antes e depois da correção
- [x] Extrair Leads reais da base por dia no mesmo recorte para comparação de mensuração
- [x] Separar conversões de plataforma de Leads efetivamente registrados, evitando tratar eventos incorretos como demanda real
- [x] Quantificar o impacto da correção em CPA, volume reportado e aderência entre Google Ads e a base
- [x] Escrever uma narrativa executiva cronológica sobre problema, correção e efeito observado
- [x] Adicionar novos slides mantendo o padrão visual aprovado da apresentação
- [x] Validar números, fontes, arredondamentos e legibilidade da versão ampliada

## Correção da apresentação — CPL planejado da planilha oficial

- [x] Auditar todas as abas, fórmulas e células preenchidas do arquivo `MGBrazil-DigitalMediaPlanJul26(EN)08-07.xlsx`
- [x] Identificar os valores oficiais de investimento, Leads e CPL planejado por canal
- [x] Reconciliar a nomenclatura da planilha com Google Ads, Meta Ads, Publya Programática/Display, UOL, Webmotors, Mercado Livre e Proxy
- [x] Substituir na apresentação qualquer CPL planejado derivado de fonte diferente da planilha oficial
- [x] Atualizar os deltas de eficiência e as mensagens executivas afetadas
- [x] Regenerar gráficos ou tabelas que dependam dos CPLs planejados corrigidos
- [x] Validar os números corrigidos contra as fórmulas e células da planilha
- [x] Revisar visualmente os slides alterados e entregar a versão final atualizada

## Ajuste final da apresentação — CPLs e encerramento

- [x] Definir CPL planejado de R$ 130,00 para Mercado Livre, UOL e Webmotors
- [x] Recalcular os deltas de CPL e atualizar todas as ocorrências afetadas
- [x] Confirmar se o CPL consolidado permanece inalterado ou precisa de nova referência
- [x] Substituir o slide final de recomendações por um encerramento institucional sem recomendações
- [x] Preservar o padrão visual aprovado no novo slide final
- [x] Validar números, textos, ordem e legibilidade da apresentação atualizada

## Ajuste final da apresentação — logotipo MG

- [x] Incorporar o arquivo oficial `logo-mg-horizontal.svg` aos ativos permanentes da apresentação
- [x] Localizar todos os slides que utilizam o logotipo anterior
- [x] Substituir e redimensionar o logotipo na capa e no encerramento
- [x] Validar contraste, proporção e legibilidade do novo logotipo no canvas 16:9
- [x] Apresentar a versão final com CPLs corrigidos e encerramento sem recomendações

## Plano de mídia digital — Agosto de 2026

- [ ] Auditar abas, dimensões, fórmulas, estilos, validações e células mescladas do modelo de julho
- [ ] Identificar todas as premissas editáveis de investimento, período, canais, modelos, Leads e CPL
- [ ] Confirmar orçamento total, período de veiculação, canais e prioridades comerciais de agosto
- [ ] Replicar a estrutura visual e funcional no arquivo de agosto sem quebrar fórmulas
- [ ] Atualizar nomenclaturas, datas, títulos e referências de julho para agosto
- [ ] Distribuir orçamento e projeção de Leads por canal e modelo conforme premissas aprovadas
- [ ] Preservar fórmulas interligadas para atualização dinâmica dos totais e indicadores
- [ ] Validar reconciliação de orçamento, percentuais, Leads, CPL e totais por aba
- [ ] Revisar visualmente o arquivo final e entregar a planilha de agosto com premissas documentadas
- [ ] Limitar a primeira entrega de agosto ao plano digital de R$ 1.050.000: R$ 850.000 para line-up e R$ 200.000 para MG4 Urban
- [ ] Remover UOL e Proxy de todas as linhas, totais e projeções de agosto
- [ ] Incluir TikTok com R$ 30.000 e CPL planejado igual ao Meta Ads
- [ ] Atualizar CPLs de Google, Meta e Publya Programática/Display conforme o realizado de julho
- [ ] Manter CPL planejado de R$ 130,00 para Webmotors e Mercado Livre
- [ ] Classificar Mercado Livre como canal de conversão e projetar Leads diretamente
- [ ] Ponderar a geração de Leads pelas participações de vendas dos 31 dealers enviados
- [ ] Ponderar o mix de Leads por modelo: MG4 22,5%, MGS5 15,6%, MG4U 58,5% e Cyberster 3,5%
- [ ] Normalizar separadamente os percentuais de dealer e modelo devido à diferença entre totais brutos de 548 e 578 vendas
- [ ] Preservar fórmulas dinâmicas para que alterações de verba ou CPL atualizem Leads, shares e totais automaticamente
- [ ] Extrair do PDF o preço, as entregas, a vigência e as condições comerciais da Cobertura G do Festival de Interlagos
- [ ] Incluir a Cobertura G do Festival de Interlagos em uma aba exclusiva no plano de agosto
- [ ] Rebalancear as demais verbas digitais para absorver integralmente o Festival de Interlagos sem ultrapassar R$ 1.050.000
- [ ] Vincular o valor da aba do Festival de Interlagos ao resumo e ao orçamento total por fórmula dinâmica
- [ ] Validar que a inclusão do Festival não altera o teto total nem duplica investimento em outras abas
- [ ] Extrair do PDF Quatro Rodas as duas opções comerciais e usar os preços específicos para não clientes Abril
- [ ] Apresentar as duas opções na aba Magazine como alternativas não cumulativas
- [ ] Relacionar cada opção de Magazine à verba de revista e exibir diferença para o orçamento disponível
- [ ] Excluir a aba Media Plan - Pay TV do arquivo de agosto
- [ ] Revisar fórmulas e referências após a remoção da aba Pay TV para evitar vínculos quebrados

## Atualização do deck — pagamentos e digital line-up

- [x] Atualizar o slide de digital line-up com os valores completos da nova tabela fornecida pelo usuário
- [x] Inserir um slide em inglês com o resumo de pagamentos: Google Ads já pago, veículos/sites pendentes de BRL 378,750.00, agency fee de BRL 64,552.00 e total payable to BBRO de BRL 443,302.00
- [x] Inserir o segundo slide solicitado em inglês e posicionar os dois novos slides de forma coerente no deck
- [x] Auditar os novos slides em 1280×720, reconciliar totais e reapresentar o deck atualizado

## Atualização do deck — leads e vendas do dashboard

- [x] Extrair do dashboard recém-atualizado os totais atuais de leads e vendas, com o período efetivo de cobertura
- [x] Validar a reconciliação por canal, modelo e concessionária sem inventar dados ausentes
- [x] Recalcular CPL, pacing, participação por modelo, conversão e atingimento de meta com os novos totais
- [x] Atualizar em inglês todos os slides afetados de resumo, leads, mix, dealers e vendas
- [x] Renderizar e auditar os slides atualizados em 1280×720 antes de apresentar a nova versão

## Tradução — MG Brasil Marketing Budget 2027 Draft BBRO

- [ ] Extrair e revisar todas as páginas, tabelas, números e observações do PDF original
- [ ] Traduzir integralmente o conteúdo para inglês com terminologia financeira e de marketing consistente
- [ ] Recriar o documento traduzido preservando estrutura, tabelas, valores e hierarquia visual
- [ ] Auditar todas as páginas para eliminar texto em português e verificar paginação e legibilidade
- [ ] Entregar o PDF final traduzido para inglês

## MKTBUDGET2027 — reestruturação executiva e tática

- [x] Auditar todas as abas, fórmulas, totais, nomes definidos, gráficos e dependências do arquivo MKTBUDGET2027_v1.xlsx
- [x] Criar uma aba SUMMARY executiva como primeira aba, com orçamento total, mix por canal, phasing, modelos, eventos e principais controles
- [x] Organizar as visões táticas por modelo e preservar os detalhamentos existentes em ordem lógica após o SUMMARY
- [x] Incluir CHINA PASSPORT 2027 — Shanghai Auto Show em Eventos com BRL 1.2M
- [x] Realocar BRL 1.2M de Free-to-Air TV e Pay TV sem alterar o orçamento total e documentar a origem da verba
- [x] Atualizar fórmulas, percentuais, subtotais, gráficos e referências após a realocação
- [x] Validar abertura do workbook, ausência de fórmulas quebradas e consistência visual antes da entrega

## MKTBUDGET2027 — correção de formatação mobile e desktop

- [ ] Identificar todos os formatos numéricos personalizados que aparecem como texto ou números brutos no Excel mobile
- [ ] Substituir formatos monetários por padrões universais compatíveis com Excel iOS, Android, desktop e LibreOffice
- [ ] Eliminar todas as células `########` ajustando formatos, escalas, larguras e mesclagens
- [ ] Corrigir cartões executivos, tabelas, ponte de funding e eixos dos gráficos no SUMMARY
- [ ] Aplicar as mesmas correções de compatibilidade às fichas por modelo, eventos e cenários financeiros
- [ ] Recalcular o workbook, verificar fórmulas e renderizar todas as abas para validação final
- [ ] Entregar uma nova versão corrigida do arquivo XLSX

## Atualização da meta mensal — Google Ads

- [x] Localizar a fonte da meta mensal de investimento do Google Ads e todos os indicadores dependentes
- [x] Atualizar a meta mensal de investimento do Google Ads para R$ 412.800
- [x] Validar pacing, percentuais, projeções e formatação monetária após a alteração
- [x] Executar testes automatizados e conferir visualmente o dashboard atualizado

## Histórico de vendas de julho e regra de agosto — 03/08/2026

- [x] Auditar o último arquivo/lote de vendas e a competência atualmente atribuída
- [x] Preservar o arquivo enviado em 03/08/2026 como histórico de julho/2026 com fechamento em 31/07
- [x] Corrigir os registros e indicadores que exibem esse lote incorretamente como agosto
- [x] Implementar regra determinística para classificar os próximos arquivos de vendas como agosto/2026
- [x] Garantir que consultas por julho e agosto usem os respectivos históricos sem sobrescrita
- [x] Adicionar testes de regressão para competência, histórico e novos uploads
- [x] Validar banco, interface, tipagem e testes antes do checkpoint

## Recalculo da meta de Leads para 958 — 03/08/2026

- [x] Auditar todas as abas, fórmulas, estilos e a lógica de distribuição da planilha enviada
- [x] Identificar o total atual e as proporções usadas em cada dimensão da meta
- [x] Recalcular a distribuição com números inteiros e soma exata de 958 Leads
- [x] Atualizar as células de entrada e manter fórmulas, estilos e estrutura do arquivo
- [x] Validar subtotais, percentuais, arredondamentos e ausência de fórmulas quebradas
- [x] Conferir visualmente todas as abas e entregar a versão final pronta para o cliente

## Projeção por modelo com MG4 Urban — 03/08/2026

- [x] Auditar abas, modelos, total geral, CPLs, fórmulas e estilos do novo arquivo enviado
- [x] Identificar a lógica proporcional atual de divisão entre modelos
- [x] Reservar R$ 14.000 exclusivamente para MG4 Urban sem alterar o total geral
- [x] Redistribuir proporcionalmente o saldo entre os demais modelos e reconciliar arredondamentos
- [x] Atualizar a planilha por modelo preservando fórmulas, estilos e estrutura
- [x] Validar total de verba, total de Leads, subtotais e ausência de fórmulas quebradas
- [x] Conferir visualmente todas as abas e entregar a versão pronta para o cliente

## Correção de CPL para metas iguais por cidade — 03/08/2026

- [x] Auditar todas as ocorrências em que metas iguais têm investimentos ou CPLs diferentes
- [x] Padronizar o investimento para metas iguais dentro de cada modelo
- [x] Garantir CPL idêntico para cidades com a mesma meta de Leads no mesmo modelo
- [x] Preservar 958 Leads, R$ 114.960 totais e R$ 14.000 exclusivos do MG4 Urban
- [x] Validar fórmulas, caches, totais por modelo e compatibilidade com o sistema do cliente
- [x] Conferir visualmente e entregar a nova versão corrigida

## Atualização do fechamento de vendas de julho — relatório 260803

- [x] Auditar o PDF 260803 e confirmar os totais e a estrutura da tabela de vendas
- [x] Consultar o lote atual de julho e preservar o histórico anterior antes da nova importação
- [x] Importar o relatório 260803 com competência explícita de julho/2026
- [x] Garantir que o nome 260803 não altere a regra automática dos próximos uploads de agosto
- [x] Validar vendas por concessionária, correspondências, conversão e indicadores consolidados de julho
- [x] Executar testes, conferir a interface e salvar um checkpoint restaurável

## Plano de Mídia — Competência Agosto de 2026

- [x] Auditar a planilha `controle-financeiro.xlsx` e identificar as abas, fórmulas e valores aplicáveis a agosto.
- [x] Mapear a implementação atual do Plano de Mídia, o schema e a carga de julho usada como referência.
- [x] Reconciliar investimento total, produtos, canais, etapas do funil, leads projetados, CPL e impressões de agosto.
- [x] Persistir agosto como nova competência, preservando integralmente julho e o histórico mensal.
- [x] Atualizar a interface apenas se necessário para suportar ou exibir corretamente os dados de agosto.
- [x] Criar ou atualizar testes Vitest para validar agosto, julho e a alternância pelo seletor de competência.
- [x] Conferir visualmente os cards, gráficos e totais de agosto e comparar julho após a alteração.
- [x] Executar testes e TypeScript, revisar o todo.md e salvar um checkpoint restaurável.

## Rankings de Dealers — Visões MG MOTORS e VENDAS

- [x] Auditar os componentes e serviços atuais de Top Dealers, períodos, semanas e conversão nas visões MG MOTORS e VENDAS.
- [x] Excluir “Leads em qualificação” e qualquer categoria sem dealer dos rankings Top e Bottom, mantendo-a apenas nos indicadores próprios de qualificação.
- [x] Definir um critério único de elegibilidade para ranking de conversão e documentar como empates e bases mínimas são tratados.
- [x] Adicionar um quadro Bottom 10 ordenado da menor para a maior conversão, exibindo dealer, leads, Retail Sales e taxa.
- [x] Criar uma tabela completa de ranking com posição, dealer, Retail Sales, leads recebidos e conversão.
- [x] Permitir ordenar a tabela por conversão, Retail Sales e leads recebidos, com ordenação inicial por maior conversão.
- [x] Garantir que Top Dealers, Bottom 10 e tabela respeitem os filtros de data e Week 1, Week 2 e demais recortes semanais.
- [x] Aplicar os novos componentes nas visões de usuário MG MOTORS e VENDAS sem alterar permissões ou outras experiências.
- [x] Criar ou atualizar testes Vitest para exclusão de qualificação, ordenação, elegibilidade e filtros de período.
- [x] Validar visualmente Top, Bottom e tabela nas duas visões e em pelo menos dois recortes semanais.
- [x] Executar testes, TypeScript, revisar todo.md e salvar um checkpoint restaurável.

## Top 10 e Bottom 10 de Conversão — Lado a lado

- [x] Revisar o componente atual de Bottom 10 e reutilizar a mesma população elegível e a semana selecionada.
- [x] Adicionar um box Top 10 ordenado da maior para a menor conversão com dealer, Retail Sales, Leads e taxa.
- [x] Manter o box Bottom 10 ordenado da menor para a maior conversão com os mesmos campos.
- [x] Exibir Top 10 e Bottom 10 lado a lado em desktop e empilhados em telas menores.
- [x] Aplicar rótulos e cores bilíngues consistentes nas visões MG MOTORS e VENDAS.
- [x] Atualizar testes Vitest para Top 10, Bottom 10, semana selecionada e layout responsivo.
- [x] Validar visualmente as duas visões, executar testes e TypeScript e salvar checkpoint restaurável.

## Automação diária da consolidação e importação de Leads

- [x] Definir a arquitetura como tarefa agendada no Manus, com um cron diário às 09:20 e 10:20 no horário de Brasília.
- [x] Auditar as abas e cabeçalhos reais da planilha Google informada, incluindo variações e campos opcionais.
- [x] Auditar o fluxo manual atual de pré-validação, duplicatas, inválidos, confirmação e recálculo do dashboard.
- [x] Consolidar Site, Meta, Webmotors, Mercado Livre e UOL em Data, Modelo, Região ou Estado, Cidade, Concessionaria, Nome, Email, Telefone e Canal.
- [x] Classificar Site como Campanha Urban quando Canal/Campanha contiver Urban e como Site nos demais casos.
- [x] Mapear Meta, Webmotors, Mercado Livre e UOL exatamente conforme o briefing, preservando o vínculo linha a linha.
- [x] Padronizar Modelo somente como MG4 URBAN, MG4, MGS5 ou CYBERSTER e limpar telefone removendo `p:` e `+`.
- [x] Preservar o nome da Concessionaria exatamente como vem da aba original, sem padronização.
- [x] Gerar arquivos XLSX e CSV consolidados a cada execução.
- [x] Reutilizar o mesmo serviço de importação manual para validação, deduplicação, inválidos, reconciliação e inserção.
- [x] Importar automaticamente somente quando houver mudança e manter o processo idempotente em reexecuções.
- [x] Produzir relatório completo por execução com linhas, inseridos, duplicatas internas, duplicatas da base, inválidos e detalhamento por canal.
- [x] Cobrir mapeamentos, telefones, modelos, duplicatas, arquivos e atualização da base com Vitest e testes Python.
- [x] Executar uma consolidação e importação controlada com a planilha real e validar uma reexecução sem mudanças.
- [x] Criar os agendamentos diários de 09:20 e 10:20 no horário de Brasília.
- [x] Enviar no Manus o relatório de cada execução, inclusive quando não houver novos Leads.
- [x] Revisar todo.md, executar testes e TypeScript e salvar checkpoint restaurável.

## Reprogramação da automação de Leads — 09:00 e 10:00

- [x] Substituir os disparos de 09:20 e 10:20 por 09:00 e 10:00 no horário de Brasília.
- [x] Preservar no agendamento o comando atual, a consolidação, a importação idempotente e os relatórios com anexos no Manus.
- [x] Validar o cron, o fuso `America/Sao_Paulo`, o status ativo e os próximos disparos da rotina.
- [x] Atualizar o histórico do projeto e informar ao usuário a nova cadência diária confirmada.

> Agendamento anterior de 09:20/10:20 substituído em 07/08/2026 pelo cron `0 0 9,10 * * *`, com fuso `America/Sao_Paulo` e status ativo.

## Correção — carregamento de Google Ads e Meta Ads

- [x] Reproduzir a falha de carregamento das abas Google Ads e Meta Ads e registrar erros de interface, rede e servidor.
- [x] Auditar consultas, cache persistente, recorte D-1 e credenciais/conectores usados por cada fonte sem modificar dados.
- [x] Corrigir a causa encontrada preservando métricas, permissões, snapshots válidos e o comportamento dos demais módulos.
- [x] Adicionar ou atualizar testes Vitest de sucesso, indisponibilidade e erro para evitar regressão.
- [x] Validar os dois módulos autenticados no navegador com uma sessão de usuário válida e salvar um checkpoint restaurável.

> Diagnóstico em 07/08/2026: Google Ads e Meta Ads responderam HTTP 200 ao recorte D-1; o bloqueio vinha de respostas 401 da sessão local do dashboard. A recuperação agora recarrega a aplicação e exibe o login local, em vez de manter dados analíticos em estado de erro.

## Classificação global — MG4 URBAN em Campanha Urban

- [x] Auditar a classificação atual de canal no consolidador e identificar todas as origens que podem trazer MG4 URBAN.
- [x] Classificar como `Campanha Urban` todo Lead cujo modelo padronizado seja `MG4 URBAN`, independentemente da aba ou canal original.
- [x] Preservar as regras existentes para os demais modelos, a concessionária de origem, telefones, duplicatas e inválidos.
- [x] Adicionar testes para MG4 URBAN em Site, Meta, Webmotors, Mercado Livre e UOL, incluindo variações de escrita do modelo.
- [x] Reprocessar a planilha real e atualizar a base do dashboard com a nova classificação.
- [x] Validar a reconciliação, a distribuição por canal, a idempotência e salvar checkpoint restaurável.

> Validação em 10/08/2026: o arquivo mestre contém 1.395 linhas MG4 URBAN, todas em Campanha Urban; após deduplicação, o banco contém 1.362 Leads MG4 URBAN e todos estão exclusivamente em Campanha Urban. A base total permaneceu em 13.994 registros e a segunda execução retornou `NO_CHANGES`.

## Corte temporal do canal UOL — julho preservado, agosto removido

- [x] Auditar as datas dos Leads UOL e os pontos que montam os canais no consolidador, importador e dashboard.
- [x] Preservar todos os registros UOL com competência até julho de 2026.
- [x] Excluir da base e das opções de canal os registros UOL com data a partir de 01/08/2026.
- [x] Adicionar testes de fronteira para 31/07/2026 e 01/08/2026 sem afetar as demais origens.
- [x] Reprocessar a fonte real, validar julho versus agosto e confirmar idempotência.
- [x] Revisar o acompanhamento, executar testes e salvar checkpoint restaurável.

> Validação real em 10/08/2026: julho preserva 292 Leads UOL entre 11.664 Leads; agosto contém 2.400 Leads, zero UOL, nenhuma série diária UOL e nenhuma opção/aviso UOL. O reprocessamento retornou `NO_CHANGES`, mantendo 14.064 registros na base.

## Executive Summary — resultados de 01 a 09/08/2026

- [x] Auditar a estrutura atual do deck executivo e identificar os slides de concorrentes e Instagram.
- [x] Consolidar no dashboard os resultados reais de Leads e Vendas entre 01 e 09/08/2026.
- [x] Atualizar títulos, período, métricas, rankings e mensagens executivas para agosto.
- [x] Remover integralmente a projeção de mídia dos concorrentes e a parte de Instagram.
- [x] Revisar consistência visual, fontes, cálculos e texto em inglês do Summary.
- [x] Apresentar a versão final atualizada e registrar o resultado no histórico do projeto.

> Versão apresentada em 10/08/2026 com seis slides ativos: capa, visão geral, Leads por canal, campanhas Google/Meta, Retail & Network e encerramento. Período 01–09/08/2026; slides de concorrentes e Instagram excluídos.

## Cadastro oficial de dealers — Dealers_atualizado.xlsx

- [x] Auditar a estrutura e os nomes da planilha oficial enviada pelo usuário.
- [x] Comparar o cadastro com HG ARACAJU, LA FONTAINE JOINVILLE, AUTOBRAND RECIFE e SINAL AV EUROPA.
- [x] Implementar o de-para necessário sem alterar os nomes originais dos Leads.
- [x] Reprocessar o relatório semanal de agosto e reconciliar as 85 Retail Sales.
- [x] Atualizar métricas de conversão e o Summary caso os totais correspondidos mudem.
- [x] Executar testes, validar o dashboard e salvar checkpoint restaurável.

> Auditoria inicial: a planilha contém 31 dealers oficiais e inclui os quatro nomes não correspondidos do relatório semanal. Nenhum dos quatro possui Leads na base de agosto; a correção deve reconhecê-los como dealers válidos sem atribuir Leads inexistentes.

> Conciliação aplicada aos dois lotes de agosto: oito linhas atualizadas de `UNMATCHED` para `MATCHED`, correspondentes aos quatro dealers oficiais em cada lote. Os nomes originais e os volumes foram preservados.

> Resultado recalculado: 25 de 25 dealers correspondidos, 85 de 85 Retail Sales correspondidas, zero vendas não correspondidas, conversão de rede de 4,78% e 20,91 Leads por venda. A segunda execução atualizou zero linhas.

## Summary — reorganização do slide Overall Results

- [x] Remover todas as referências visuais e textuais a `unmatched` do slide Overall Results.
- [x] Reorganizar o bloco de Retail Sales para destacar 85 vendas, 100% de cobertura e conversão de 4,78%.
- [x] Reequilibrar espaçamento, hierarquia e alinhamento entre os blocos de Leads e Retail.
- [x] Incluir no slide Retail & Network os 1.777 Leads atribuídos e a taxa de conversão de 4,78% em posição de destaque.
- [x] Retirar também do slide Retail & Network todo o bloco e as referências a `unmatched`.
- [x] Validar o slide renderizado e reapresentar o Summary atualizado.

> Layout final: Overall Results reorganizado em demanda e funil comercial; Retail & Network destaca 85 Retail Sales, 1.777 Leads atribuídos, conversão de 4,78%, 20,91 Leads por venda e 100% de cobertura oficial, sem qualquer referência a `unmatched`.

## Summary — Leads e conversão por dealer no Top 5

- [x] Remover do slide Retail & Network o destaque do total geral de 1.777 Leads.
- [x] Adicionar ao ranking Top 5 o total de Leads recebido por cada dealer.
- [x] Adicionar ao ranking Top 5 a taxa de conversão individual de cada dealer.
- [x] Validar os cálculos Retail ÷ Leads e reapresentar o Summary atualizado.

> Ranking final: Tecar 145 Leads / 12 Retail / 8,28%; DRSUL 149 / 11 / 7,38%; Savol 54 / 11 / 20,37%; Barigui 114 / 10 / 8,77%; Dão Silveira 85 / 6 / 7,06%. O total geral de Leads e a conversão agregada foram removidos desse slide.

## Auditoria integral — concessionárias da base de Leads

- [x] Reconciliar todos os nomes de concessionária da base de Leads com o cadastro oficial de 31 dealers.
- [x] Separar Leads conciliados, Leads em qualificação/sem dealer e nomes realmente fora do cadastro.
- [x] Confirmar novamente os 25 dealers e as 85 Retail Sales do relatório semanal de agosto.
- [x] Corrigir aliases ou regras caso existam nomes oficiais ainda não reconhecidos.
- [x] Remover o aviso de quatro concessionárias sem correspondência somente se a auditoria comprovar cobertura correta.
- [x] Validar percentuais, testes, dashboard e salvar checkpoint restaurável.

> Auditoria inicial: 14.064 Leads; 770 em qualificação/sem dealer; 13.294 com dealer informado; 10.998 conciliados; 2.296 em 39 nomes fora do cadastro oficial; cobertura atribuída de 82,7291%. Vendas Semanais: 25/25 dealers, 85/85 Retail Sales e zero não correspondidas.

> Auditoria final: 14.064 Leads; 13.279 com dealer atribuído e 100% desses conciliados; 785 em qualificação/sem dealer; zero nomes de dealer fora da rede validada. Assim, 94,4184% da base total possui dealer atribuído e conciliado. Vendas Semanais permanecem em 25/25 dealers e 85/85 Retail Sales conciliadas, sem alerta de correspondência.

> Validação técnica: 44 arquivos e 244 testes aprovados, TypeScript sem erros, build de produção concluído e auditoria final reproduzível. A prévia visual abriu no login por ausência de sessão, portanto a ausência do aviso foi comprovada pelo serviço atual e pelo teste de regressão do componente.

## Executive Summary — versão em português

- [x] Auditar os seis slides atuais e mapear todos os textos em inglês.
- [x] Traduzir títulos, rótulos, notas, fontes e mensagens executivas para português.
- [x] Preservar integralmente os dados, cálculos, ranking Top 5 e período de 01 a 09/08/2026.
- [x] Revisar quebras de linha, hierarquia e espaçamento após a tradução.
- [x] Validar que não restaram textos em inglês e reapresentar o Summary em português.

> Versão em português apresentada em 11/08/2026 com seis slides ativos e os mesmos dados aprovados do período de 01 a 09/08/2026.

## Dossiê de qualidade de Leads — MG Barigui

- [x] Extrair e revisar integralmente o dossiê recebido da concessionária MG Barigui.
- [x] Identificar período, amostra, critérios de qualidade, evidências e conclusões apresentadas.
- [x] Verificar consistência matemática, limitações metodológicas e possíveis vieses do documento.
- [x] Comparar os achados com Leads, canais, vendas e conversão da MG Barigui no dashboard.
- [x] Separar problemas comprovados, hipóteses e pontos que exigem dados adicionais.
- [x] Entregar resumo executivo com recomendações operacionais e próximos passos.

> Conclusão em 11/08/2026: os casos são rastreáveis e comprovam ocorrências reais, mas o dossiê é casuístico e não permite estimar taxa sistêmica. O dashboard contém 2.221 Leads Barigui no período; 11 registros Barigui estão ligados aos exemplos apresentados. O principal risco quantitativo a investigar é a distribuição geográfica: 33,09% dos Leads Barigui estão fora de PR/SC.

## Dossiê Barigui — cruzamento de emails com origem

- [x] Consolidar os emails visíveis no dossiê e o telefone do caso sem email legível.
- [x] Localizar cada contato na base de Leads por email exato, usando telefone somente como chave auxiliar.
- [x] Confirmar data, canal normalizado, canal original, modelo, cidade/UF e dealer atribuído.
- [x] Identificar contatos com mais de uma origem ou mais de um registro.
- [x] Entregar uma tabela com emails mascarados, correspondências e exceções.

> Resultado: dez contatos localizados em doze registros — dez de Site e dois de Campanha Urban. Clara Keli aparece em Site e Campanha Urban; Maily Kalapalo aparece duas vezes no Site, atribuída a Barigui Florianópolis e DRSul Porto Alegre. Amanda, descrita no dossiê como canal não localizado, consta na base como Site.

## Dossiê Barigui — origem bruta dos dois Leads Urban

- [x] Identificar os dois registros Campanha Urban pelo email, data e telefone.
- [x] Localizar cada registro na aba original da planilha Google fonte.
- [x] Confirmar os campos brutos que provocaram a classificação Campanha Urban.
- [x] Explicar a diferença entre aba de origem, canal original e canal normalizado.

> Confirmação: Clara Keli e Dos Santos Damico vieram da aba Site, com `Canal / Campanha = site`. Ambos foram classificados como Campanha Urban porque o modelo bruto era `mg4_urban`. Clara possui ainda um segundo ticket Site/MG4 criado 46 segundos depois.

## Auditoria de distribuição — Barigui Curitiba versus São Paulo

- [x] Definir o recorte mais recente de agosto e identificar os dealers oficiais do estado de São Paulo.
- [x] Comparar volume de Leads por dealer, canal, modelo e origem geográfica.
- [x] Medir quanto cada dealer recebe dentro e fora de sua área operacional.
- [x] Comparar Leads recebidos, metas disponíveis e Retail Sales por dealer.
- [x] Identificar se o desequilíbrio vem de Site, Meta, Campanha Urban ou regras de roteamento.
- [x] Entregar diagnóstico objetivo e proposta de redistribuição sem alterar o dashboard.

> Resultado de 01 a 10/08/2026: Barigui Curitiba recebeu 285 Leads versus 683 nos 12 dealers de SP. A Barigui supera qualquer dealer paulista individual, mas apenas 10 Leads originados em SP foram enviados a ela. O excesso é explicado por 172 Leads do PR concentrados na Barigui e 113 Leads de outros estados, gerados por Site (80), Campanha Urban (27) e Mercado Livre (6). Nenhuma alteração foi aplicada ao dashboard.

## Dashboard — performance por estado e dealers

- [x] Auditar os contratos atuais de Leads, Vendas Semanais, período selecionado e de-para de dealers.
- [x] Definir a reconciliação entre estado operacional do dealer, Leads recebidos e Vendas no Varejo.
- [x] Criar agregação por estado com Leads, Vendas no Varejo e taxa de conversão.
- [x] Incluir abertura expansível dos dealers de cada estado com os mesmos indicadores.
- [x] Garantir que o cálculo respeite o período selecionado e o último snapshot de vendas disponível.
- [x] Adicionar estados de carregamento, vazio e erro, além de ordenação clara do ranking.
- [x] Criar testes de backend e frontend para totais, conversão, aliases e expansão.
- [x] Validar em desktop e mobile, revisar todo.md e salvar checkpoint restaurável.

> Validação em 11/08/2026: 16 estados exibidos no recorte 01–10/08; São Paulo 668 Leads / 43 Retail / 6,44%; Paraná 285 / 2 / 0,70%. A expansão de SP mostrou oito dealers. Foram aprovados 249 testes, TypeScript e build. A visualização mobile usa tabela horizontal; a captura automatizada isolada permaneceu no login.

## Dashboard — visualização geográfica unificada

- [x] Auditar os blocos atuais de Leads por região, Top concessionárias e Performance por estado para preservar todos os indicadores úteis.
- [x] Exibir uma única visualização expansível estado → dealers com Leads, Retail Sales, conversão e cobertura do snapshot.
- [x] Posicionar a visualização consolidada no resumo principal de Leads, respeitando o período selecionado e o corte D-1.
- [x] Remover os blocos redundantes de Leads por região e Top concessionárias sem alterar os dados ou rankings comerciais.
- [x] Refinar o layout mobile para leitura direta, sem exigir navegar entre blocos separados.
- [x] Atualizar testes de renderização e regressão para garantir que não existam visualizações geográficas duplicadas.
- [x] Validar dados reais, desktop, mobile, TypeScript, suíte completa e build; salvar checkpoint restaurável.

> Implementação: a visualização “Leads e vendas por estado e concessionária” passou a ser o único cruzamento geográfico. No mobile, estados e dealers usam cards expansíveis com Leads, Retail, conversão e cobertura; no desktop, a tabela ordenável foi preservada.

> Validação final em 11/08/2026: os textos “Leads por região” e “Top concessionárias” não aparecem mais no painel autenticado. A única visão geográfica preservou São Paulo em 668 Leads / 43 Retail / 6,44% e Paraná em 285 / 2 / 0,70%. Foram aprovados 249 testes, TypeScript e build de produção.

> Auditoria em 11/08/2026: Leads por região e Top concessionárias repetem volumes já cobertos pela tabela Performance por estado e concessionárias. A tabela consolidada preserva Leads, Retail Sales, conversão, cobertura do arquivo, total de dealers e abertura individual por dealer.

## Dashboard — MG4 URBAN por canal de origem

- [x] Auditar onde o canal bruto/original de cada Lead é persistido e como ele entra no analytics filtrado por Data Corrigida.
- [x] Preservar a aba/canal original de captação no arquivo de importação e no banco sem alterar o canal normalizado Campanha Urban.
- [x] Reprocessar a base atual para preencher a procedência histórica de MG4 URBAN a partir das abas reais da planilha-fonte.
- [x] Agregar somente MG4 URBAN por canal original, com volume, média diária e participação no período selecionado.
- [x] Diferenciar claramente canal de origem de canal normalizado Campanha Urban para evitar interpretação incorreta.
- [x] Exibir o novo quadro ao lado de Leads por modelo no desktop e empilhado no mobile, eliminando o espaço vazio.
- [x] Adicionar estados vazio/indisponível e manter português/inglês conforme o perfil.
- [x] Criar testes de backend e frontend para total reconciliado, ordenação, rótulos e layout responsivo.
- [x] Validar com dados reais, TypeScript, suíte completa, build e checkpoint restaurável.

> Auditoria em 12/08/2026: o banco atual possui 737 Leads MG4 URBAN no recorte 01–11/08, mas `channel` e `channelRaw` estão ambos como Campanha Urban porque o consolidador substitui o canal antes da importação. Para exibir Site, Meta e outras origens sem inventar dados, a aba original precisa ser preservada e a base reprocessada pela automação oficial.

> Desenho aprovado: o Excel/CSV mestre mantém as nove colunas entregáveis. Somente o CSV canônico interno recebe `Canal de Origem`; uploads manuais antigos de 11 colunas continuam compatíveis por fallback. A identidade/deduplicação do Lead não muda. Uma nova coluna `sourceChannel` persiste Site, Meta, Webmotors, Mercado Livre ou UOL e diferenças nesse metadado forçam substituição idempotente da base.

> Implementação validada: migração `0012_marvelous_malcolm_colcord.sql` aplicada; seis testes Python e 20 testes direcionados Vitest aprovados; TypeScript sem erros. O hash de identidade permanece inalterado e apenas a procedência passa a ser comparada para decidir a substituição idempotente.

> Reprocessamento em 12/08/2026: a automação oficial substituiu 15.083 registros sem criar ou remover Leads e preencheu `sourceChannel` em 100% da base. No recorte 01–11/08, os 737 MG4 URBAN reconciliaram em 397 Site e 340 Meta. A segunda execução retornou `NO_CHANGES`.

> Quadro implementado: “MG4 URBAN por canal de origem” aparece ao lado de “Leads por modelo” em desktop e abaixo em mobile. O subtítulo esclarece que a origem antecede a classificação Campanha Urban. Foram aprovados 47 testes direcionados e TypeScript.

> Validação final em 12/08/2026: 737 MG4 URBAN reconciliados em 397 Site (53,87%) e 340 Meta (46,13%), sem origem vazia. Foram aprovados 251 testes determinísticos, TypeScript e build. O teste externo Windsor permaneceu bloqueado por `ECONNRESET`, sem relação com Leads ou com o novo quadro.

## Dashboard — tradução do título estadual

- [x] Exibir “Leads e vendas por estado e concessionária” para usuários em português.
- [x] Exibir “Leads and Retail Sales by state and dealer” para usuários em inglês.
- [x] Localizar também o subtítulo e preservar os indicadores, a expansão e o layout existentes.
- [x] Atualizar testes bilíngues, executar TypeScript/build e salvar checkpoint restaurável.

> Validação em 12/08/2026: 13 testes do painel semanal aprovados, incluindo título e subtítulo em inglês; TypeScript e build de produção concluídos sem erros.

## Dashboard — título Top Dealers por estado

- [x] Exibir “Principais concessionárias, Leads e vendas por estado” em português.
- [x] Exibir “Top Dealers, Leads and Sales by State” em inglês.
- [x] Atualizar testes bilíngues, executar TypeScript/build e salvar checkpoint restaurável.

> Validação em 12/08/2026: 13 testes do painel semanal, TypeScript e build de produção aprovados após a renomeação.

## Dashboard — metas Total Dealer e Sales por concessionária

- [x] Auditar a estrutura, competência, totais e fórmulas de `metas.xlsx` sem presumir campos ausentes.
- [x] Conciliar cada nome da planilha com o cadastro oficial e os aliases atuais, listando matches, ambiguidades e ausências.
- [x] Modelar metas por competência e concessionária, preservando histórico e origem do arquivo.
- [x] Criar importação idempotente com preview, validação de totais e proteção de permissões.
- [x] Calcular meta, realizado, atingimento, gap e status por dealer usando o snapshot semanal vigente.
- [x] Exibir resumo Total Dealer e tabela por concessionária com ordenação, filtros e layout responsivo.
- [x] Permitir atualizar a planilha de metas sem alterar Leads ou vendas já importados.
- [x] Adicionar testes de match, persistência, cálculos, interface, permissões e idempotência.
- [x] Validar com dados reais, TypeScript, suíte completa, build e checkpoint restaurável.

> Auditoria em 12/08/2026: 31 linhas; TOTAL DEALER 11.996; SALES 548; WEIGHT 100,02%; investimento R$ 916.000,02. O arquivo não possui fórmulas nem competência explícita. As metas por canal somam 12.008, 12 acima do TOTAL DEALER por arredondamento; o acompanhamento usará TOTAL DEALER e SALES como metas oficiais.

> Match validado em 12/08/2026: 31/31 linhas conciliadas, zero ambiguidades, zero ausências e zero chaves canônicas duplicadas. O de-para explícito cobre abreviações e nomes históricos como BDG, Inglaterra, Genial, Orletti, Baltic GUA e Tecar/GO, sempre apontando para o cadastro oficial e para a mesma chave usada no realizado semanal.

> Persistência concluída: tabela `dealer_monthly_targets` criada pela migração 0013; `metas.xlsx` importada para 2026-08 com 31 registros, meta de 11.996 Leads e 548 vendas. Arquivo arquivado no storage e segunda execução confirmada como `NO_CHANGES`, sem linhas duplicadas.

> Cálculos validados: Leads realizados seguem o período D-1 selecionado; vendas realizadas usam a última semana do PDF vigente. Dealers sem linha de vendas permanecem como não reportados, não como zero. Resumo e tabela calculam atingimento e gap separados para Leads e Sales, além de conversão meta versus real. Foram aprovados 15 testes direcionados e TypeScript.

> Interface concluída: resumo de Leads, Sales, conversão e cobertura; tabela desktop e cards mobile por concessionária; busca e ordenação por atingimento/gap. O botão “Atualizar metas” possui prévia auditável e só aparece para usuários com permissão de importação. Foram aprovados 36 testes direcionados e TypeScript.

> Validação final em 12/08/2026: 3.255 Leads atribuídos de meta 11.996 (27,13%); 178 Sales de meta 548 (32,48%); conversão real 5,47% versus meta 4,57%; 31/31 metas conciliadas e 24/31 dealers com Retail reportado na Semana 3. Desktop e mobile validados com dados reais. Foram aprovados 261 testes, TypeScript e build.

## Auditoria — Google Ads, Meta Ads e conexão Windsor

- [x] Revisar configuração, período D-1, contratos e políticas de cache/snapshot das duas fontes.
- [x] Testar a conexão Windsor de Google Ads e Meta Ads sem expor credenciais.
- [x] Confirmar data máxima disponível e detectar atraso, ausência ou duplicidade de dias.
- [x] Reconciliar investimento, impressões, cliques, Leads/conversões e KPIs derivados entre fonte e dashboard.
- [x] Confirmar se cada aba está em dados ao vivo, cache de processo ou snapshot persistente.
- [x] Corrigir inconsistências e adicionar observabilidade explícita se necessário.
- [x] Executar regressões, TypeScript/build, validar as duas abas e registrar diagnóstico auditável.

> Configuração revisada em 12/08/2026: conector Windsor.ai ativo. Google usa cache de processo de 10 min, snapshot persistente e fallback validado de julho; Meta usa cache de 15 min, snapshot persistente e fallback somente para o recorte exato do snapshot. As duas fontes aplicam o corte D-1 pelo resolvedor compartilhado.

> Auditoria ao vivo em 12/08/2026: Google e Meta responderam pela fonte `windsor-live` até D-1 11/08. Google retornou 758 linhas, 70 campanhas e todos os 11 dias de agosto; Meta retornou nove dias, de 03 a 11/08, sem lacunas internas ou finais — 01 e 02/08 são ausência inicial de atividade, não atraso de carga.

> KPIs reconciliados: Google R$ 133.013,75, 2.245,1 conversões, 155.854 cliques e 1.992.972 impressões; Meta R$ 13.298,72, 1.820 Leads, 21.405 cliques e 659.782 impressões. As diferenças entre total e detalhamento foram apenas arredondamentos de R$ 0,01/0,1 no Google e R$ 0,20/5 impressões na quebra de campanhas Meta, dentro das tolerâncias explícitas; os totais diários Meta conciliam exatamente.

> Observabilidade validada no dashboard autenticado: ambas as abas mostram corte D-1 e atualização de 12/08 às 18:48; Meta informa dados disponíveis até 11/08 e `Snapshot validado`, pois o acesso da interface reutiliza o snapshot persistente recém-gravado pela consulta Windsor ao vivo. A tentativa automática de Meta às 08:32 falhou por timeout, mas o refresh manual posterior concluiu ao vivo e atualizou o snapshot até D-1.

> Diagnóstico reproduzível: `scripts/auditWindsorAdsConnections.ts` agora classifica ausências iniciais versus lacunas internas/finais e compara total versus detalhamento com tolerâncias explícitas de arredondamento. Foram aprovados 264 testes em 47 arquivos, TypeScript sem erros e build de produção concluído.

## Dashboard — conciliação dos dealers com Leads zerados

- [x] Listar todas as metas com Leads realizados iguais a zero no período atual.
- [x] Cruzar cada zero com nomes brutos, aliases, cidade, UF e chave canônica da base de Leads.
- [x] Diferenciar ausência real de Leads de falha de alias ou chave divergente.
- [x] Aplicar somente de-paras comprovados, preservando o nome original de cada Lead.
- [x] Recalcular meta, realizado, atingimento, gap e conversão após a conciliação.
- [x] Manter zero apenas quando a consulta integral confirmar ausência real no período.
- [x] Adicionar regressões e validar dados reais, TypeScript, suíte completa, build e checkpoint.

> Restrição inicial substituída pela orientação posterior do usuário: a planilha de metas define os dealers ativos e todos os aliases comprováveis devem convergir para uma linha única por dealer.

> Proposta preparada: os nove zeros são falhas de alias, não ausência de Leads. Foram identificadas dez variações brutas com 168 Leads no período, todas com correspondência explícita de unidade e cidade/UF. Nenhum alias foi aplicado.

## Dashboard — cadastro canônico pelos dealers ativos da meta

- [x] Tratar as 31 linhas de `metas.xlsx` como o conjunto canônico de dealers ativos para agosto.
- [x] Inventariar 100% dos nomes brutos de dealer em Leads e Sales no período e atribuir cada alias comprovável a uma única linha da meta.
- [x] Detectar e eliminar colisões em que dois nomes canônicos representam a mesma concessionária.
- [x] Consolidar `SAVOL - SÃO CAETANO` e suas variações em `SAVOL ZL/SP`, conforme orientação do usuário.
- [x] Preservar `dealerRaw` e nomes de origem; alterar somente a camada analítica de conciliação.
- [x] Reconciliar o total de Leads antes/depois para garantir zero perda e zero dupla contagem.
- [x] Reconciliar Sales do PDF com as mesmas 31 linhas canônicas e diferenciar não reportado de zero.
- [x] Exibir uma única linha por dealer ativo com meta, Leads, Sales, atingimento, gap e conversão.
- [x] Fazer futuras planilhas de metas atualizarem o cadastro canônico da competência sem criar aliases duplicados.
- [x] Adicionar regressões de colisão, idempotência e totais; validar dados reais, TypeScript, suíte completa e build.
- [x] Substituir o texto residual fixo de 31 concessionárias pela contagem canônica dinâmica em português e inglês.

> Auditoria integral em 12/08/2026: 3.452 Leads no período, sendo 3.255 conciliados, 19 em qualificação e 178 distribuídos em 12 variações de nomes ainda sem alias. Todas as 12 variações correspondem explicitamente a dealers ativos da meta; após o de-para, a expectativa é 3.433 conciliados, 19 em qualificação e zero nomes de dealer não conciliados.

> Colisão confirmada pelo usuário: `SAVOL/SP` e `SAVOL ZL/SP` representam o mesmo dealer. A linha única `SAVOL ZL/SP` deverá consolidar meta de 679 Leads e 31 Sales, além de todas as variações atuais de “Savol São Caetano” e “Savol ZL”.

> Canonicalização aplicada em 12/08/2026: 30 dealers únicos, zero linhas de meta sem Leads, zero nomes de dealer fora da meta e 3.433 Leads conciliados; os 19 restantes são Leads em qualificação. A meta total permaneceu em 11.996 Leads e 548 Sales. A linha única SAVOL ZL/SP soma meta 679/31 e realizado 77 Leads/14 Sales.

> Sales preservadas: as linhas do PDF que convergem ao mesmo dealer agora são somadas por semana sem duplicar Leads. O total permaneceu em 178 Sales, com 24 dealers reportados e seis corretamente marcados como não reportados.

> Validação visual autenticada em desktop: o painel mostra 30/30 concessionárias conciliadas, 3.433/11.996 Leads, 178/548 Sales, conversão real de 5,18% e uma única linha `SAVOL ZL/SP` com 77 Leads e 14 Sales. A lista semanal também exibe Savol apenas uma vez e mantém 178 Sales no total.

> Idempotência confirmada: a reimportação de `metas.xlsx` retornou `NO_CHANGES`, `idempotent: true` e `rowsInserted: 0`; a prévia manteve 31/31 linhas-fonte conciliadas, zero duplicidades canônicas e a consolidação Savol em uma única chave.

> Validação técnica final: auditoria reconciliada com 3.452 = 3.433 conciliados + 19 em qualificação + 0 fora da meta; 30 dealers canônicos, 24 com Sales reportadas, 178 Sales preservadas, 262 testes aprovados, TypeScript sem erros e build de produção concluído.
