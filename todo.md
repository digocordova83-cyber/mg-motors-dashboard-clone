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

- [x] Auditar abas, dimensões, fórmulas, estilos, validações e células mescladas do modelo de julho
- [x] Identificar todas as premissas editáveis de investimento, período, canais, modelos, Leads e CPL
- [x] Confirmar orçamento total, período de veiculação, canais e prioridades comerciais de agosto
- [x] Replicar a estrutura visual e funcional no arquivo de agosto sem quebrar fórmulas
- [x] Atualizar nomenclaturas, datas, títulos e referências de julho para agosto
- [x] Distribuir orçamento e projeção de Leads por canal e modelo conforme premissas aprovadas
- [x] Preservar fórmulas interligadas para atualização dinâmica dos totais e indicadores
- [x] Validar reconciliação de orçamento, percentuais, Leads, CPL e totais por aba
- [x] Revisar visualmente o arquivo final e entregar a planilha de agosto com premissas documentadas
- [x] Limitar a primeira entrega de agosto ao plano digital de R$ 1.050.000: R$ 850.000 para line-up e R$ 200.000 para MG4 Urban
- [x] Remover UOL e Proxy de todas as linhas, totais e projeções de agosto
- [x] Incluir TikTok com R$ 30.000 e CPL planejado igual ao Meta Ads
- [x] Atualizar CPLs de Google, Meta e Publya Programática/Display conforme o realizado de julho
- [x] Resolver a premissa intermediária de CPL de R$ 130,00 para Webmotors e Mercado Livre — substituída pelos CPLs recalculados da versão final de 12.000 Leads
- [x] Classificar Mercado Livre como canal de conversão e projetar Leads diretamente
- [x] Ponderar a geração de Leads pelas participações de vendas dos 31 dealers enviados
- [x] Ponderar o mix de Leads por modelo: MG4 22,5%, MGS5 15,6%, MG4U 58,5% e Cyberster 3,5%
- [x] Normalizar separadamente os percentuais de dealer e modelo devido à diferença entre totais brutos de 548 e 578 vendas
- [x] Preservar fórmulas dinâmicas para que alterações de verba ou CPL atualizem Leads, shares e totais automaticamente
- [x] Resolver a etapa intermediária de extração da Cobertura G — posteriormente removida por orientação final do usuário
- [x] Resolver a aba exclusiva do Festival — transformada em `Media SAVE` por orientação final do usuário
- [x] Resolver o rebalanceamento do Festival — os R$ 99.000 foram integralmente reclassificados como Media SAVE
- [x] Substituir o vínculo do Festival por fórmula dinâmica de saldo da aba Media SAVE
- [x] Validar que o Media SAVE preserva o teto digital e não duplica investimento
- [x] Resolver a etapa intermediária das opções Quatro Rodas — Abril e suas propostas foram removidas por orientação final do usuário
- [x] Resolver a apresentação de alternativas Magazine — substituída por reserva mensal única de R$ 50.000
- [x] Relacionar Magazine de R$ 50.000 ao orçamento total de R$ 1.100.000
- [x] Excluir a aba Media Plan - Pay TV do arquivo de agosto
- [x] Revisar fórmulas e referências após a remoção da aba Pay TV para evitar vínculos quebrados

> Versão canônica concluída em 12/08/2026: seis abas, R$ 1.050.000 de digital, R$ 99.000 de Media SAVE, R$ 50.000 de Magazine, R$ 1.100.000 no total e 12.000 Leads. Festival/Cobertura G, Abril/Quatro Rodas, UOL, Proxy e Pay TV foram removidos conforme as orientações finais, que substituem as etapas intermediárias acima.

> Validação: 118/118 controles aprovados nas versões PT e EN; fórmulas sem `#REF!`, zero ocorrências de “envelope”, zero risco de `####`, seis abas sem painéis congelados e equivalência numérica célula a célula. As duas versões foram renderizadas em nove páginas e revisadas visualmente.

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

- [x] Extrair e revisar todas as páginas, tabelas, números e observações do PDF original
- [x] Traduzir integralmente o conteúdo para inglês com terminologia financeira e de marketing consistente
- [x] Recriar o documento traduzido preservando estrutura, tabelas, valores e hierarquia visual
- [x] Auditar todas as páginas para eliminar texto em português e verificar paginação e legibilidade
- [x] Entregar o PDF final traduzido para inglês

> Validação final em 12/08/2026: 22 páginas e 379 blocos traduzidos, com zero ocorrências na auditoria de português residual, números semanticamente preservados e separadores localizados para o inglês. A correção final ajustou `2,9m` para `2.9m` na página 19.

> O PDF `MG_Brasil_Marketing_Budget_2027_EN_final.pdf` passou na verificação determinística com 6 controles aprovados, zero warnings, zero falhas e zero verificações desconhecidas. A revisão visual padrão cobriu 13 páginas, incluindo todas as sete páginas com overlays de gráficos e textos rasterizados, sem clipping ou sobreposição visível.

## MKTBUDGET2027 — reestruturação executiva e tática

- [x] Auditar todas as abas, fórmulas, totais, nomes definidos, gráficos e dependências do arquivo MKTBUDGET2027_v1.xlsx
- [x] Criar uma aba SUMMARY executiva como primeira aba, com orçamento total, mix por canal, phasing, modelos, eventos e principais controles
- [x] Organizar as visões táticas por modelo e preservar os detalhamentos existentes em ordem lógica após o SUMMARY
- [x] Incluir CHINA PASSPORT 2027 — Shanghai Auto Show em Eventos com BRL 1.2M
- [x] Realocar BRL 1.2M de Free-to-Air TV e Pay TV sem alterar o orçamento total e documentar a origem da verba
- [x] Atualizar fórmulas, percentuais, subtotais, gráficos e referências após a realocação
- [x] Validar abertura do workbook, ausência de fórmulas quebradas e consistência visual antes da entrega

## MKTBUDGET2027 — correção de formatação mobile e desktop

- [x] Identificar todos os formatos numéricos personalizados que aparecem como texto ou números brutos no Excel mobile
- [x] Substituir formatos monetários por padrões universais compatíveis com Excel iOS, Android, desktop e LibreOffice
- [x] Eliminar todas as células `########` ajustando formatos, escalas, larguras e mesclagens
- [x] Corrigir cartões executivos, tabelas, ponte de funding e eixos dos gráficos no SUMMARY
- [x] Aplicar as mesmas correções de compatibilidade às fichas por modelo, eventos e cenários financeiros
- [x] Recalcular o workbook, verificar fórmulas e renderizar todas as abas para validação final
- [x] Entregar uma nova versão corrigida do arquivo XLSX

> Validação concluída em 12/08/2026: o arquivo `MG_Brasil_Marketing_Budget_2027_Mobile_Desktop_Corrected.xlsx` preserva 19 abas e 1.074 fórmulas, sem erros de fórmula e sem marcadores monetários incompatíveis (`BRL`, `R$`, `[$R$` ou escala `\\M`) nos formatos de célula.

> Totais preservados: BRL 224.080.000 e BRL 154.480.000; eventos de BRL 20.900.000 e BRL 15.400.000; Shanghai Auto Show de BRL 1.200.000, com BRL 400.000 em abril e BRL 800.000 em maio. Todas as reconciliações do SUMMARY, MODEL TACTICS, fichas de modelo e EVENTS & GOVERNANCE passaram.

> Auditoria visual: as 11 abas executivas/táticas ativas foram renderizadas em A3 paisagem e revisadas em contact sheet e resolução completa. SUMMARY, matrizes, seis fichas de modelo, eventos e dois cenários cabem em uma página de largura, sem `########`, truncamento da coluna TTL ou quebras horizontais inesperadas.

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

## Atualização manual do dashboard — 13/08/2026

- [x] Executar a automação oficial de Leads a partir da planilha Google e gerar XLSX, CSV, relatório Markdown e JSON da execução.
- [x] Validar linhas encontradas, válidas, novas, duplicatas internas, duplicatas já existentes, inválidas e detalhamento por canal.
- [x] Atualizar Google Ads e Meta Ads até o último D-1 disponível, preservando cache e snapshots válidos.
- [x] Reconciliar total da base, MG4 URBAN, UOL, dealers canônicos, Leads em qualificação, metas e Sales após a atualização.
- [x] Conciliar `Euroville — Juiz de Fora/MG` com `EUROVILLE JUIZ DE FORA`, preservando `dealerRaw`.
- [x] Conciliar `Sinal — Av. Europa/SP` com `SINAL AV EUROPA`, preservando `dealerRaw`.
- [x] Validar o dashboard, executar regressões necessárias e salvar checkpoint restaurável.
- [x] Entregar ao usuário o relatório completo e os arquivos gerados pela execução.

> Execução `20260813-085037`: status `UPDATED`; 16.281 linhas encontradas, 16.277 válidas, 712 duplicatas internas, 15.116 já existentes, quatro inválidas e 449 novos registros. A base passou de 15.116 para 15.565 Leads. A reexecução `20260813-085214` retornou `NO_CHANGES`, zero novos registros e zero linhas gravadas.

> Refresh de mídia em 13/08/2026: a primeira auditoria mensal encontrou timeout em uma consulta Meta, sem substituir snapshots válidos. A rotina operacional de D-1 foi então executada com sucesso para 12/08, usando `windsor-live` nas duas fontes, sem falha parcial e com auditoria persistida. Google aqueceu 14/07–12/08 com R$ 320.053,00 e 7.260,7 conversões; Meta aqueceu 06–12/08 com R$ 11.752,14 e 1.606 Leads. A consulta independente da competência confirmou dados até 12/08 nas duas plataformas.

## Execução agendada da automação de Leads — 13/08/2026

- [x] Executar o comando oficial exatamente como informado e ler `/tmp/mg-leads-scheduled-result.json`.
- [x] Ler o `reportMarkdown` indicado pelo JSON e validar todas as contagens solicitadas.
- [x] Entregar o resultado em português com `masterXlsx`, `masterCsv` e `reportMarkdown` anexados.

> Execução `20260813-090339`: `NO_CHANGES`; 16.281 linhas encontradas, 16.277 válidas, zero novos registros, 712 duplicatas internas, 15.565 já existentes e quatro inválidas. A base permaneceu em 15.565 Leads, sem linhas gravadas.

## Nova atualização do dashboard — 13/08/2026

- [x] Executar novamente a automação oficial de Leads sem modificar as regras de importação.
- [x] Ler o resultado e validar novos registros, duplicidades, inválidos, base antes/depois e canais.
- [x] Confirmar a idempotência da base atualizada e entregar XLSX, CSV e relatório Markdown.

> Execução `20260813-091916`: `UPDATED`; 16.292 linhas encontradas, 16.288 válidas, 713 duplicatas internas, 15.565 já existentes, quatro inválidas e 10 novos Leads. A base passou de 15.565 para 15.575 registros; os 10 novos vieram do Mercado Livre, cujo total válido passou de 736 para 747. A reexecução `20260813-092109` retornou `NO_CHANGES`, zero novos registros e zero linhas gravadas.

## Nova execução agendada da automação de Leads — 13/08/2026

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, todas as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` anexados ao relatório final.

> Execução `20260813-100557`: `NO_CHANGES`; 16.292 linhas encontradas, 16.288 válidas, zero novos registros, 713 duplicatas internas, 15.575 registros já existentes e quatro linhas inválidas. A base permaneceu em 15.575 Leads, sem gravações adicionais.

## Atualização adicional do dashboard — 13/08/2026

- [x] Executar novamente a automação oficial de Leads.
- [x] Validar linhas encontradas, novos registros, duplicidades, inválidos, canais e base antes/depois.
- [x] Entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260813-101318`: `NO_CHANGES`; 16.292 linhas encontradas, 16.288 válidas, zero novos registros, 713 duplicatas internas, 15.575 registros já existentes e quatro inválidas. A base permaneceu em 15.575 Leads, sem linhas gravadas.

## Sincronização da base atualizada — 13/08/2026

- [x] Executar a automação oficial de Leads sobre a fonte atualizada.
- [x] Validar linhas encontradas, novos registros, duplicidades, inválidos e detalhamento por canal.
- [x] Confirmar a base antes/depois e a idempotência após a importação.
- [x] Entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260813-151610`: `UPDATED`; 16.388 linhas encontradas, 16.384 válidas, 714 duplicatas internas, 15.575 já existentes, quatro inválidas e 95 novos Leads. A base passou de 15.575 para 15.670 registros. A reexecução `20260813-151746` retornou `NO_CHANGES`, zero novos registros e zero linhas gravadas.

## Execução agendada após a sincronização — 13/08/2026

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, todas as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` no relatório final.

> Execução `20260814-090514`: `UPDATED`; 16.858 linhas encontradas, 16.854 válidas, 719 duplicatas internas, 15.670 já existentes, quatro inválidas e 465 novos Leads. A base passou de 15.670 para 16.135 registros.

## Atualização adicional do dashboard — 14/08/2026

- [x] Executar novamente a automação oficial de Leads.
- [x] Validar novos registros, duplicidades, inválidos, canais e base antes/depois.
- [x] Entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260814-095438`: `NO_CHANGES`; 16.858 linhas encontradas, 16.854 válidas, zero novos registros, 719 duplicatas internas, 16.135 registros já existentes e quatro inválidas. A base permaneceu em 16.135 Leads, sem linhas gravadas.

## Nova atualização do dashboard — 14/08/2026

- [x] Executar novamente a automação oficial de Leads.
- [x] Validar novos registros, duplicidades, inválidos, canais e base antes/depois.
- [x] Entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260814-100000`: `UPDATED`; 16.950 linhas encontradas, 16.946 válidas, 719 duplicatas internas, 16.135 já existentes, quatro inválidas e 92 novos Leads. A base passou de 16.135 para 16.227 registros. A reexecução `20260814-100146` retornou `NO_CHANGES`, zero novos registros e zero linhas gravadas.

## Execução agendada após a atualização das 10h — 14/08/2026

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, todas as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` no relatório final.

> Execução `20260814-100521`: `NO_CHANGES`; 16.950 linhas encontradas, 16.946 válidas, zero novos registros, 719 duplicatas internas, 16.227 já existentes e quatro inválidas. A base permaneceu em 16.227 Leads, sem linhas gravadas.

## Integração da nova aba TikTok — 14/08/2026

- [x] Auditar a estrutura real, cabeçalhos e qualidade dos dados da aba TikTok na planilha-fonte.
- [x] Definir o de-para de data, modelo, localização, concessionária, contato e canal sem inventar campos ausentes.
- [x] Incorporar TikTok ao consolidador oficial, preservando deduplicação e compatibilidade com as cinco abas existentes.
- [x] Adicionar regressões para mapeamento, modelos, telefones, dealer bruto, localização e canal TikTok.
- [x] Executar a automação, importar os Leads novos e gerar XLSX, CSV, Markdown e JSON.
- [x] Reexecutar para confirmar idempotência e reconciliar TikTok, dealers canônicos, inválidos e total da base.
- [x] Validar o dashboard, a suíte completa, TypeScript e build; salvar checkpoint restaurável.
- [x] Entregar o relatório completo e os arquivos da execução.

> Auditoria da fonte: a nova aba foi criada como `Tikok` e contém 11 linhas válidas. O mapeamento usa `created_time`, `ad_name`, `Name`, `Email`, `Phone number` e `Em qual concessionária gostaria de ser atendido?`; cidade e UF são derivadas exclusivamente do sufixo `Cidade/UF` do dealer. Todos os 11 anúncios são `MG4 - Urban`, portanto o canal analítico permanece `Campanha Urban` e a procedência é preservada como `TikTok`.

> Modo seco `20260814-124233`: 11 novos registros detectados, zero inválidos na aba TikTok, zero remoções e `TikTok: 11` no detalhamento por canal de origem. As 21 regressões direcionadas do consolidador, importador CSV e relatório passaram.

> Execução real `20260814-124435`: `UPDATED`; 16.961 linhas encontradas, 16.957 válidas, 719 duplicatas internas, 16.227 já existentes, quatro inválidas e 11 novos Leads TikTok. A base passou de 16.227 para 16.238 registros. Todos os 11 são MG4 URBAN, aparecem analiticamente em `Campanha Urban` e mantêm `TikTok` como canal de origem.

> Reconciliação: quatro Leads TikTok em Recife/PE e um em cada uma das cidades Porto Alegre/RS, Belo Horizonte/MG, Aracaju/SE, Salvador/BA, Goiânia/GO, Guarulhos/SP e Curitiba/PR. Os oito rótulos convergiram aos dealers canônicos, com 30/30 dealers cobertos, zero aliases fora da meta e zero perda. A reexecução `20260814-124609` retornou `NO_CHANGES`, zero novos registros e zero linhas gravadas.

> A abertura visual direta foi redirecionada para a tela de acesso protegido. Nenhuma credencial foi solicitada ou manipulada; a validação da contabilização TikTok seguirá pelos dados persistidos, contratos tRPC, regressões do componente e build de produção.

> Validação final: os dados persistidos confirmam 11 Leads TikTok, distribuídos em oito dealers, com `MG4 URBAN`, canal analítico `Campanha Urban` e procedência `TikTok`. O quadro existente usa `mg4UrbanSourceChannels` dinamicamente e recebeu regressão explícita para TikTok. Foram aprovados 266 testes em 48 arquivos, TypeScript sem erros, build de produção concluído e logs recentes sem erros novos de runtime.

## TikTok como canal analítico separado — 14/08/2026

- [x] Auditar todos os pontos que classificam MG4 URBAN como Campanha Urban e definir a exceção explícita para origem TikTok.
- [x] Exibir TikTok como canal próprio na distribuição por canais e na série diária, preservando `sourceChannel = TikTok`.
- [x] Atualizar os 11 registros existentes sem adicionar, remover ou duplicar Leads.
- [x] Reconciliar `Total de Leads = soma dos canais = soma dos dias` no período e na competência de agosto.
- [x] Garantir que Campanha Urban diminua exatamente 11 e TikTok aumente exatamente 11, mantendo o total geral inalterado.
- [x] Adicionar regressões do consolidador, parser, analytics, canais esperados, dias zerados e interface.
- [x] Reexecutar a automação para confirmar idempotência após a reclassificação.
- [x] Validar dados reais, suíte completa, TypeScript, build e logs; salvar checkpoint restaurável.
- [x] Entregar a reconciliação final e os arquivos consolidados da execução.

> Reclassificação aplicada pela execução `20260814-145134`: a base permaneceu em 16.238 Leads. A automação identificou 11 hashes antigos removidos e 11 novos hashes TikTok, substituiu a base transacionalmente e manteve zero perda e zero duplicação. No arquivo mestre, Campanha Urban passou de 2.369 para 2.358 (-11) e TikTok de 0 para 11 (+11), com o total inalterado.

> Reconciliação do mesmo contrato do dashboard: no corte D-1 de 01–13/08, `4.568 total = 4.568 soma dos canais = 4.568 soma dos dias`; TikTok soma 5 no canal e 5 no dia 13/08. Considerando a fonte até 14/08, `4.574 = 4.574 = 4.574`; TikTok soma 11, distribuídos em cinco Leads em 13/08 e seis em 14/08. A reexecução `20260814-145301` retornou `NO_CHANGES`, zero novos e zero removidos.

> A interface já renderiza `data.channels` e `data.channelOrder` dinamicamente; por isso TikTok aparece automaticamente na distribuição e no gráfico diário. O quadro MG4 URBAN por origem continua usando `sourceChannel`, sem dupla contagem.

> Validação técnica final: sete testes Python e 267 testes Vitest em 48 arquivos aprovados; TypeScript sem erros; build de produção concluído. A captura sem sessão exibiu corretamente a tela de acesso protegido, portanto a interface interna foi validada pelo contrato real do backend e pelas regressões dinâmicas de `data.channels` e `data.channelOrder`. Logs recentes não apresentam erro novo relacionado à integração TikTok.

## Metas e atingimento por canal — 14/08/2026

- [x] Auditar `metas.xlsx`, identificar as metas oficiais por canal/veículo e registrar totais, divergências e campos ausentes.
- [x] Criar de-para explícito entre os nomes da planilha e os canais analíticos do dashboard, incluindo TikTok separado.
- [x] Expor por canal realizado, meta, percentual de atingimento e saldo, sem alterar a soma de Leads.
- [x] Exibir barra vermelha de progresso em cada linha da Distribuição por canal, limitada visualmente a 100% e com o percentual real preservado.
- [x] Tratar canal sem meta de forma explícita, sem inventar valor nem exibir progresso enganoso.
- [x] Preservar o corte D-1 e reconciliar total de Leads, soma dos canais e soma dos dias após a mudança.
- [x] Adicionar regressões de backend e interface para metas, TikTok, excesso de meta, meta zero/ausente, locale e responsividade.
- [x] Validar dados reais, interface, suíte completa, TypeScript e build; salvar checkpoint restaurável.
- [x] Entregar ao usuário o resultado e a reconciliação final das metas por canal.

> Auditoria de `metas.xlsx`: 30 dealers canônicos; meta oficial de 11.996 Leads e 548 Sales. Metas por veículo persistidas: Google 6.019, Meta 3.734, Publya 614, Webmotors 579, Mercado Livre 442 e TikTok 620; soma por canais 12.008, ou 12 acima de `TOTAL DEALER`, divergência já identificada como arredondamento da planilha.

> De-para definido sem inferência: `Site` compara o realizado de origem Site contra `Google + Publya` (6.633), pois a base de Leads não separa esses dois veículos; `Meta`, `Webmotors`, `Mercado Livre` e `TikTok` usam o realizado mensal pelo respectivo `sourceChannel`, incluindo MG4 URBAN captado pelo veículo. `Campanha Urban` continua como classificação analítica e não recebe meta própria, porque a planilha não possui coluna Urban. O quadro explicará essa base para evitar dupla contagem ou leitura enganosa.

> Reconciliação real de 01–13/08: 4.568 total = 4.568 na soma dos canais = 4.568 na soma dos dias. Atingimento mensal por veículo em D-1: Site/Google+Publya 1.677 de 6.633 (25,28%); Meta 2.387 de 3.734 (63,93%); Webmotors 324 de 579 (55,96%); Mercado Livre 175 de 442 (39,59%); TikTok 5 de 620 (0,81%). Campanha Urban permanece com 1.260 Leads no período e sem meta direta inventada.

> Validação final: 269 testes em 48 arquivos aprovados, TypeScript sem erros e build de produção concluído. A captura da rota protegida confirmou que o acesso sem sessão continua bloqueado; o quadro interno foi validado pelo contrato real do serviço, reconciliação reproduzível e renderização estática responsiva das barras.

## Correção da importação de vendas — PDF de 14/08/2026

- [x] Auditar a tabela `Weekly Target Achievement - Retail` do PDF real e identificar mudanças de layout, colunas ou subtotais.
- [x] Reconciliar W1–W5 entre linhas de dealers, subtotais regionais e TOTAL, distinguindo ausência de venda de erro de leitura.
- [x] Explicar exatamente por que W2 e W3 falham e por que TECAR GOIÂNIA aparece sem venda S3.
- [x] Corrigir o parser sem desabilitar a validação auditável de regiões e TOTAL.
- [x] Adicionar regressões para o novo formato e preservar compatibilidade com PDFs e CSVs anteriores.
- [x] Validar o PDF enviado ponta a ponta e confirmar dealers, matches, semana de referência e totais.
- [x] Executar a prévia e importar o relatório somente após todas as reconciliações passarem.
- [x] Confirmar idempotência, recalcular Leads/Sales/conversão e validar o dashboard.
- [x] Executar suíte completa, TypeScript e build; salvar checkpoint restaurável.
- [x] Informar a causa, a correção, os totais importados e eventuais dados realmente ausentes.

> Causa comprovada: o parser leu corretamente a página Retail. O próprio PDF deixa TECAR GOIÂNIA sem Retail em W2 e W3, mas inclui duas vendas no subtotal R02 e no Total. R01 reconcilia em 113/153; R02 soma 72/93 nos dealers visíveis, enquanto imprime 74/95; o Total imprime 187/248. A diferença é exatamente duas unidades em W2 e W3.

> Confirmação independente: a página `Sales Funnel by Region & Dealer` do mesmo PDF informa TECAR GOIÂNIA com `Retail TGT = 8` e `Retail = 2`, além de confirmar R02 = 95 e Total = 248 no acumulado W3. Portanto a sequência validada é W1 sem venda informada, W2 = 2 e W3 = 2; nenhum número foi inventado para forçar a soma.

> Correção implementada: o parser só preenche um residual quando região e TOTAL concordam, existe exatamente um dealer vazio naquela região e o residual é inteiro e positivo. O percentual é derivado da meta visível, a linha recebe novo hash e a prévia exibe avisos auditáveis. Casos ambíguos continuam bloqueados. Foram aprovadas 21 regressões direcionadas e TypeScript sem erros.

> Prévia real corrigida: 28 linhas, 25 dealers, duas regiões, um TOTAL, semana de referência W3, zero dealers sem venda de referência e `248 dealers = 248 regiões = 248 TOTAL`, sem erros. Avisos explícitos registram TECAR GOIÂNIA W2 = 2 (83,3%) e W3 = 2 (48,8%).

> Importação concluída em 14/08/2026: competência 2026-08, W3, 248 Retail Sales, 25/25 dealers correspondentes, zero dealers sem correspondência e 28 linhas persistidas. TECAR GOIÂNIA foi importada com duas vendas e 48,8% na semana de referência. A reexecução retornou `idempotent: true` e `rowsInserted: 0` para o mesmo importId 330001.

> Snapshot servido ao dashboard em D-1 (01–13/08): 4.327 Leads, 248 Sales, conversão de 5,73%, 17,45 Leads por venda e estimativa arredondada de 18 Leads por venda. As 248 Sales reconciliam integralmente entre resumo, dealers, estados e acompanhamento de metas; 25/25 dealers correspondentes, zero unmatched e zero dealer sem venda W3. TECAR SHOPPING - GOIÂNIA aparece com 158 Leads, duas Sales e 1,27% de conversão.

> Validação final: 272 testes em 48 arquivos aprovados, TypeScript sem erros e build de produção concluído. O parser continua bloqueando múltiplas linhas vazias, subtotal regional divergente ou residual não positivo; apenas o residual único e comprovável é reparado, sempre com aviso auditável.

## Canais originais na contabilização — 14/08/2026

- [x] Auditar todos os cálculos que usam `channel` e `sourceChannel` na distribuição, metas, série diária, filtros e exportações.
- [x] Remover `Campanha Urban` da distribuição por canal e do gráfico diário sem alterar a classificação armazenada dos Leads.
- [x] Redistribuir cada Lead Urban ao canal original preservado: Site, Meta, Webmotors, Mercado Livre, TikTok ou outra origem válida.
- [x] Recalcular metas, realizado mensal, atingimento, saldo, participação e média diária pelos canais originais.
- [x] Garantir que `Total de Leads = soma dos canais originais = soma dos dias`, sem dupla contagem ou perda.
- [x] Preservar o quadro MG4 URBAN por origem e os demais filtros e indicadores existentes.
- [x] Adicionar regressões de backend e interface para ausência de Campanha Urban e inclusão dos canais originais.
- [x] Validar dados reais, suíte completa, TypeScript, build e logs; salvar checkpoint restaurável.
- [x] Entregar ao usuário a reconciliação antes/depois dos canais e do total.

> Implementação: a base continua armazenando `channel = Campanha Urban` para a classificação de campanha, mas toda contabilização do dashboard passa a usar `sourceChannel`. Distribuição, gráfico diário, médias, participação, canal principal, auditoria por dealer, status de atualização e metas usam agora Site, Meta, Webmotors, Mercado Livre, TikTok e demais origens válidas. Campanha Urban não aparece na lista nem na série.

> Reconciliação D-1 de 01–13/08: `4.568 total = 4.568 canais originais = 4.568 dias`. Meta 2.387/3.734 (63,93%); Site 1.677/6.633 (25,28%); Webmotors 324/579 (55,96%); Mercado Livre 175/442 (39,59%); TikTok 5/620 (0,81%). Campanha Urban está ausente. Até 14/08, a fonte fecha em 4.574, incluindo 11 TikTok em dois dias, também sem Campanha Urban.

> Validação final: 272 testes em 48 arquivos aprovados, TypeScript sem erros e build de produção concluído. A rota sem sessão continua exibindo corretamente o acesso protegido. Os logs recentes não apresentam falhas no cliente ou na rede; o único erro de módulo encontrado ocorreu durante a edição parcial às 22:22 e foi resolvido pelo reinício automático do servidor às 22:23.

## Atualização operacional do dashboard — 14/08/2026

- [x] Executar a automação oficial de Leads com a fonte mais recente.
- [x] Validar novos registros, duplicidades internas, registros existentes e inválidos.
- [x] Confirmar que a distribuição usa somente os canais originais e que Campanha Urban permanece ausente.
- [x] Conciliar `Euroville — Uberlândia/MG` com `EUROVILLE UBERLANDIA`, preservando o dealer bruto.
- [x] Reexecutar para comprovar idempotência e reconciliar total da base, canais e série diária.
- [x] Entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260815-084719`: `UPDATED`; 17.632 linhas encontradas, 17.628 válidas, 720 duplicatas internas, 16.217 já existentes, quatro inválidas, 691 novos Leads e 21 registros removidos da fonte. A substituição transacional levou a base de 16.238 para 16.908 registros. A reexecução `20260815-084936` retornou `NO_CHANGES`, zero novos registros, zero remoções e zero linhas gravadas.

> Reconciliação D-1 de 01–14/08: `5.244 total = 5.244 canais originais = 5.244 dias`; Meta 2.888, Site 1.846, Webmotors 324, Mercado Livre 175 e TikTok 11. Campanha Urban permanece ausente da camada analítica. Os 30 dealers canônicos concentram 5.216 Leads, 28 permanecem em qualificação e zero estão fora da meta; o novo rótulo Euroville — Uberlândia/MG foi conciliado sem alterar `dealerRaw`.

> Validação final: 272 testes em 48 arquivos aprovados, TypeScript sem erros e build de produção concluído.

## Nova atualização operacional do dashboard — 15/08/2026

- [x] Executar a automação oficial de Leads com a fonte mais recente.
- [x] Validar novos registros, remoções da fonte, duplicidades e inválidos.
- [x] Confirmar canais originais, ausência de Campanha Urban e dealers canônicos.
- [x] Reexecutar para comprovar idempotência e reconciliar total da base, canais e série diária.
- [x] Entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260815-085914`: `UPDATED`; 17.663 linhas encontradas, 17.659 válidas, 723 duplicatas internas, 16.908 já existentes, quatro inválidas, 28 novos Leads e zero remoções. A base passou de 16.908 para 16.936. A execução `20260815-090400` confirmou `NO_CHANGES` e entregou os três artefatos atualizados.

> Reconciliação D-1 de 01–14/08: `5.272 total = 5.272 canais originais = 5.272 dias`; Meta 2.888, Site 1.846, Webmotors 324, Mercado Livre 203 e TikTok 11. Campanha Urban permanece ausente. Dealers: 5.244 conciliados, 28 em qualificação, zero fora da meta e zero dealers ativos sem Leads.

## Redesenho do bloco de canais — 15/08/2026

- [x] Auditar a estrutura, alturas, larguras e densidade atuais de Leads por dia/canal e Distribuição por canal.
- [x] Redefinir a proporção desktop para reduzir o espaço vazio do gráfico e ampliar a legibilidade das metas.
- [x] Desacoplar a altura dos dois painéis: gráfico com altura fixa compacta e distribuição com altura definida pelo conteúdo.
- [x] Reorganizar o desktop em proporção equilibrada, mantendo empilhamento integral abaixo do breakpoint de notebook.
- [x] Criar linhas de canal mais compactas, com valor, participação, meta, atingimento e saldo em hierarquia clara.
- [x] Ajustar altura do gráfico, legenda, eixos e espaçamentos sem alterar dados ou cálculos.
- [x] Garantir empilhamento e leitura adequados em tablet e mobile, sem rolagem horizontal desnecessária.
- [x] Adicionar regressões estruturais para o novo layout e preservar acessibilidade das barras.
- [x] Validar visualmente em desktop e mobile; executar suíte completa, TypeScript e build.
- [x] Salvar checkpoint restaurável e apresentar o novo bloco ao usuário.

> Composição definida: grade passa a duas colunas equilibradas somente em telas 2XL; abaixo disso, painéis empilham. O gráfico terá altura útil de 320px e rodapé de leitura rápida com pico, média e canais ativos. A distribuição usará cards compactos em duas colunas no desktop e uma coluna no mobile, com realizado e participação no cabeçalho e meta, percentual, barra e saldo no mesmo eixo visual. Os painéis deixam de compartilhar altura artificial.

> Validação visual: desktop largo com proporção 1,45:1 e painéis independentes; tablet com painéis empilhados e cards em duas colunas; mobile com painel em coluna única e cards legíveis sem estouro. O gráfico passou de 350px para 320px e ganhou resumo de total, média diária, pico e canais ativos. Acessibilidade das barras preservada com `aria-valuetext`.

> Validação técnica final: 273 testes em 48 arquivos aprovados, TypeScript sem erros e build de produção concluído.

## Blocos de canais com tamanho igual — 15/08/2026

- [x] Alterar o desktop para duas colunas 50/50.
- [x] Garantir que os dois painéis compartilhem exatamente a mesma altura externa.
- [x] Compactar os cards e a nota da distribuição para caber sem corte, overflow ou rolagem interna.
- [x] Preservar o gráfico com área útil legível e o resumo inferior alinhado.
- [x] Manter os painéis empilhados e com altura natural em tablet e mobile.
- [x] Atualizar regressões estruturais e validar visualmente em desktop e mobile.
- [x] Executar suíte completa, TypeScript e build; salvar checkpoint restaurável.

> A regra 50/50 substitui a proporção 1,45:1 anterior. Em desktop, a prévia mediu ambos os painéis com 608 × 578,06 px, largura e altura idênticas; o gráfico cresce com o painel, enquanto os cards usam conteúdo compacto sem rolagem interna. Em mobile, os painéis empilham com 351 px de largura e zero overflow horizontal.

> Validação final: 273 testes em 48 arquivos aprovados, TypeScript sem erros e build de produção concluído.

## Execução agendada de Leads — 15/08/2026, segundo disparo

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` anexados ao relatório final.

> Execução `20260815-100239`: `NO_CHANGES`; 17.663 linhas encontradas, 17.659 válidas, zero novos registros, 723 duplicatas internas, 16.936 já existentes, quatro inválidas e zero remoções. A base permaneceu em 16.936 Leads, sem gravações adicionais.

## Execução agendada de Leads — 15/08/2026, terceiro disparo

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` anexados ao relatório final.

> Execução `20260816-090409`: `NO_CHANGES`; 17.663 linhas encontradas, 17.659 válidas, zero novos registros, 723 duplicatas internas, 16.936 já existentes, quatro inválidas e zero remoções. A base permaneceu em 16.936 Leads, sem gravações adicionais.

## Execução agendada de Leads — 16/08/2026, segundo disparo

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` anexados ao relatório final.

> Execução `20260816-100412`: `NO_CHANGES`; 17.663 linhas encontradas, 17.659 válidas, zero novos registros, 723 duplicatas internas, 16.936 já existentes, quatro inválidas e zero remoções. A base permaneceu em 16.936 Leads, sem gravações adicionais.

## Execução agendada de Leads — 15/08/2026

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` anexados ao relatório final.

> Execução `20260815-090400`: `NO_CHANGES`; 17.663 linhas encontradas, 17.659 válidas, zero novos registros, 723 duplicatas internas, 16.936 já existentes e quatro inválidas. A base permaneceu em 16.936 Leads, sem gravações adicionais.

## Atualização operacional do dashboard — 16/08/2026

- [x] Executar a automação oficial de Leads com a fonte mais recente.
- [x] Validar novos registros, remoções da fonte, duplicidades e inválidos.
- [x] Confirmar canais de origem, ausência analítica de Campanha Urban e dealers canônicos.
- [x] Reexecutar para comprovar idempotência e reconciliar total da base, canais e dias.
- [x] Entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260816-104237`: `UPDATED`; 18.429 linhas encontradas, 18.425 válidas, 729 duplicatas internas, 16.936 já existentes, quatro inválidas, 760 novos Leads e zero remoções. A base passou de 16.936 para 17.696 registros. A reexecução `20260816-104504` retornou `NO_CHANGES`, zero novos registros e zero gravações.

> Reconciliação D-1 de 01–15/08: `6.032 total = 6.032 canais de origem = 6.032 dias`; Meta 3.479, Site 1.990, Webmotors 324, Mercado Livre 228 e TikTok 11. Campanha Urban permanece ausente da camada analítica. Dealers: 6.004 conciliados, 28 em qualificação, zero fora da meta e 30 dealers canônicos cobertos.

## Correção da aba Google Ads — série incompleta — 16/08/2026

- [x] Reproduzir o filtro de 30 dias e confirmar por que a interface exibe somente 17–19/07.
- [x] Auditar resposta Windsor, snapshots persistidos, cache em memória e fallback do período.
- [x] Confirmar a data máxima real disponível e a cobertura diária até D-1 sem inventar valores.
- [x] Corrigir a seleção do snapshot ou a consulta que está truncando a série.
- [x] Atualizar o snapshot correto e reconciliar investimento, conversões, impressões, cliques, CPA, CPC e CTR.
- [x] Adicionar regressões para impedir que um snapshot parcial seja usado em um período maior.
- [x] Validar a aba Google Ads com a série completa e estados de fonte/cache transparentes.
- [x] Executar suíte completa, TypeScript e build; salvar checkpoint restaurável.

> Causa raiz: a integração filtrava pelo nome exato `MG Motors`, mas a conta oficial `535-798-6801` passou a retornar `account_name = MG Motor`. A resposta ao vivo ficou limitada ao histórico anterior à renomeação, 204 linhas e somente 17–19/07. O snapshot persistido de 30 dias também foi contaminado por essa resposta parcial (`dataThroughDate = 05/07` para um período até 15/08), enquanto o snapshot anterior completo chegava a 14/08.

> Evidência independente: a conta `535-798-6801` via conector Windsor retornou 2.058 linhas, 70 campanhas e 30 dias contínuos de 17/07 a 15/08, com `account_name = MG Motor`. O campo `account_id` foi confirmado como dimensão válida e estável. A consulta parcial foi bloqueada e não substituiu o snapshot completo.

> Correção aplicada: consulta e normalização por `account_id`, nome mantido apenas como rótulo, rejeição de resposta que não alcança o fim solicitado e divisão da janela de 30 dias em blocos semanais para evitar timeout. O refresh posterior retornou `windsor-live`, 2.058 linhas, 70 campanhas e cobertura até 15/08.

> Snapshot final persistido: período 17/07–15/08, 2.058 linhas, 70 campanhas, `dataThroughDate = 15/08`, fonte `windsor-live` e atualização em 16/08 às 11:15:44 de Brasília. A auditoria operacional do D-1 ficou `SUCCESS` e preservou o conjunto completo para o primeiro acesso ao dashboard.

> KPIs do contrato real: R$ 349.493,96 investidos, 6.836,7 conversões, CPA R$ 51,12, CTR 8,15%, taxa de conversão 1,76%, CPC R$ 0,90, 388.182 cliques e 4.762.324 impressões. A série contém 30 dias, de 17/07 a 15/08, sem lacunas; investimento, cliques e impressões reconciliam exatamente com o diário e conversões ficam dentro da tolerância explícita de arredondamento.

> Validação final: 277 testes em 48 arquivos aprovados, TypeScript sem erros e build de produção concluído. Foram adicionadas regressões para renomeação da conta, filtro por `account_id`, resposta parcial, última data realmente carregada e janela de 30 dias dividida em cinco blocos semanais. O acesso sem sessão continua protegido, e os logs após a correção não apresentam novos erros de runtime.

## Atualização manual de Leads — 16/08/2026

- [x] Executar a automação oficial sobre a planilha-fonte atualizada.
- [x] Validar linhas encontradas, válidas, novas, duplicadas, inválidas e removidas.
- [x] Reexecutar para confirmar idempotência e ausência de duplicação.
- [x] Entregar o relatório completo com XLSX, CSV e Markdown da execução principal.

> Execução principal `20260817-082021`: `UPDATED`; 19.151 linhas encontradas, 19.147 válidas, 718 novos registros, 733 duplicatas internas, 17.696 já existentes, quatro inválidas e zero remoções. A base passou de 17.696 para 18.414 Leads. A reexecução `20260817-082217` retornou `NO_CHANGES`, zero novos registros e zero linhas gravadas.

## Execução agendada de Leads — 17/08/2026

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` anexados ao relatório final.

> Execução `20260817-090236`: `NO_CHANGES`; 19.151 linhas encontradas, 19.147 válidas, zero novos registros, 733 duplicatas internas, 18.414 já existentes, quatro inválidas e zero remoções. A base permaneceu em 18.414 Leads, sem gravações adicionais.

## Execução agendada de Leads — 17/08/2026, segundo disparo

- [x] Executar exatamente o comando oficial solicitado e ler o resultado gerado.
- [x] Validar o `reportMarkdown`, as contagens e o detalhamento por canal.
- [x] Entregar `masterXlsx`, `masterCsv` e `reportMarkdown` anexados ao relatório final.

> Execução `20260817-100651`: `NO_CHANGES`; 19.151 linhas encontradas, 19.147 válidas, zero novos registros, 733 duplicatas internas, 18.414 já existentes, quatro inválidas e zero remoções. A base permaneceu em 18.414 Leads, sem gravações adicionais.

## Padronização “MTD Retail Order” — 17/08/2026

- [x] Inventariar todos os rótulos visíveis de Vendas/Sales no dashboard, sem alterar campos internos ou dados.
- [x] Substituir a nomenclatura exibida por `MTD Retail Order` em cards, títulos, tabelas, gráficos, metas, tooltips e estados vazios.
- [x] Preservar textos que descrevem conceitos diferentes de venda varejo, como nomes técnicos de arquivos e rotas internas.
- [x] Atualizar traduções e regressões para impedir o retorno dos rótulos antigos.
- [x] Validar interface, acessibilidade, TypeScript, suíte completa e build.
- [x] Salvar checkpoint restaurável e entregar a padronização.

## Atualização manual da base de Leads — 17/08/2026

- [x] Executar a rotina oficial de consolidação e importação sobre a planilha-fonte atualizada.
- [x] Validar linhas encontradas, válidas, novas, duplicatas internas, existentes, inválidas e remoções da fonte.
- [x] Reconciliar base antes/depois, canais de origem, dias, dealers canônicos e Leads em qualificação.
- [x] Reexecutar a rotina para confirmar idempotência e ausência de duplicação.
- [x] Entregar XLSX, CSV e relatório Markdown da execução principal.
- [x] Executar regressões necessárias, revisar o TODO e salvar checkpoint restaurável.

> Execução `20260817-144854`: `UPDATED`; 19.160 linhas encontradas, 19.156 válidas, nove novos registros, 733 duplicatas internas, 18.414 registros já existentes, quatro inválidas e zero remoções. A base passou de 18.414 para 18.423 Leads. Os nove novos registros vieram da origem Webmotors; oito permanecem em Webmotors e um MG4 URBAN mantém a classificação transacional Campanha Urban, sendo contabilizado analiticamente pela origem Webmotors.

> Idempotência confirmada pela execução `20260817-145015`: `NO_CHANGES`, zero novos registros, zero remoções e zero linhas gravadas. No recorte integral até D-1, `18.423 total = 18.423 canais = 18.423 dias = 17.622 atribuídos + 801 em qualificação`. Em agosto até 16/08, `6.759 = 6.731 conciliados + 28 em qualificação + 0 fora da meta`; 30 dealers canônicos possuem Leads e nenhuma meta ficou zerada.

> Validação técnica: 34 regressões direcionadas aprovadas, TypeScript sem erros e integridade confirmada para XLSX, CSV e relatório Markdown.

## Proporção 70/30 no bloco de canais — 17/08/2026

- [x] Alterar a grade desktop para 70% em `Leads por dia e canal` e 30% em `Distribuição por canal`.
- [x] Compactar os cards de distribuição para a coluna menor sem cortar valores, metas, percentuais ou barras.
- [x] Preservar empilhamento natural e leitura integral em tablet e mobile.
- [x] Atualizar regressões estruturais e validar visualmente a proporção, alturas e ausência de overflow.
- [x] Executar testes, TypeScript e build; revisar o TODO e salvar checkpoint restaurável.

> Implementação: a grade em telas 2XL usa `minmax(0, 7fr) minmax(0, 3fr)`, preservando exatamente a relação 70/30. Abaixo de 1536 px os painéis continuam empilhados. A distribuição mantém duas colunas internas, com gaps, padding e textos auxiliares compactados apenas no desktop largo.

> Validação: 277 testes em 48 arquivos aprovados, TypeScript sem erros, build de produção concluído e regra 70/30 confirmada no CSS compilado. A captura automatizada permaneceu na validação de acesso sem sessão; a proporção interna foi comprovada pela regressão estrutural e pelo artefato CSS gerado.

## Atualização de Leads — Webmotors e TikTok — 17/08/2026

- [x] Executar a rotina oficial sobre a planilha-fonte com as últimas linhas de Webmotors e TikTok.
- [x] Comparar a execução com a base de 18.423 Leads e identificar novos registros por canal de origem.
- [x] Validar modelos, dealers, datas, duplicatas, inválidos e contabilização analítica de TikTok e Webmotors.
- [x] Reexecutar a rotina para confirmar idempotência e ausência de duplicação ou remoção indevida.
- [x] Reconciliar total, soma dos canais, soma dos dias, dealers canônicos e Leads em qualificação.
- [x] Entregar XLSX, CSV e relatório Markdown; executar regressões, revisar o TODO e salvar checkpoint.

> Execução `20260817-150433`: `UPDATED`; 19.448 linhas encontradas, 19.444 válidas, 286 novos registros, 735 duplicatas internas, 18.423 registros já existentes, quatro inválidas e zero remoções. A base passou de 18.423 para 18.709 Leads.

> Incremento líquido por origem: Webmotors passou de 1.513 para 1.722 Leads persistidos (`+209`) e TikTok de 11 para 88 (`+77`), totalizando os 286 novos registros. A fonte trouxe 211 novas linhas válidas de Webmotors, das quais duas foram descartadas como duplicatas internas; as 77 novas linhas TikTok foram preservadas. Dois Leads TikTok têm data 17/08 e, pela regra D-1, entram na visualização a partir do próximo fechamento.

> Idempotência confirmada pela execução `20260817-150605`: `NO_CHANGES`, zero novos, zero removidos e zero linhas gravadas. Até D-1, `18.707 total = 18.707 canais = 18.707 dias = 17.906 atribuídos + 801 em qualificação`. Em agosto até 16/08, `7.043 = 7.015 conciliados + 28 em qualificação + 0 fora da meta`; 30 dealers canônicos possuem Leads e nenhuma meta ficou zerada.

> Validação técnica: 35 regressões direcionadas aprovadas, TypeScript sem erros e integridade confirmada para XLSX, CSV e relatório Markdown.

## Executive Summary em português — 01 a 16/08/2026

- [x] Auditar a apresentação Executive Summary existente, sua ordem, textos, dados e padrão visual.
- [x] Extrair do dashboard os resultados verificados de Leads, canais, MTD Retail Order, conversão, campanhas e rede entre 01 e 16/08.
- [x] Reconciliar totais, rankings e percentuais sem expor gestão de investimento indevida no summary corporativo.
- [x] Atualizar todos os slides necessários e garantir conteúdo integralmente em português.
- [x] Validar números, fontes, hierarquia visual, legibilidade e ausência de inglês residual.
- [x] Apresentar a versão final e registrar a entrega no histórico do projeto.

> Snapshot reproduzível salvo em `data-pt-aug-01-16.json`, extraído das mesmas fontes oficiais usadas pelo dashboard. Reconciliação de Leads: `7.043 total = 7.043 canais = 7.043 dias = 7.043 modelos = 7.015 atribuídos + 28 em qualificação`. MTD Retail Order: 248 pedidos, 25 dealers reportados, zero unmatched e 3,73% de conversão. Google e Meta possuem cobertura confirmada até 16/08; nenhuma métrica de investimento foi incluída no roteiro corporativo.

> Validação visual concluída em seis imagens 1280×720. Todos os slides renderizam sem cortes; o deck contém 01–16/08, MTD Retail Order, TikTok separado e Campanha Urban redistribuída aos canais de origem. A auditoria textual encontrou zero ocorrências de 01–09, Vendas no Varejo, Retail Sales, July, Investment, Investimento, CPL ou valores monetários nos slides ativos.

> Apresentação final preparada em seis páginas: capa, visão geral, Leads por canal, resultados de campanha, MTD Retail Order e rede, e encerramento. Entrega renderizada em `manus-slides://21B4Cmt7eZnxgqu03CCgtE`.

## Aba TikTok Ads via Windsor — 17/08/2026

- [x] Auditar os contratos, serviços, rotas, componentes, filtros e testes atuais da aba Meta Ads para reutilizar o padrão comprovado.
- [x] Inspecionar a conexão Windsor e confirmar conta, cobertura, dimensões e métricas TikTok Ads realmente disponíveis.
- [x] Definir contratos tipados e regras de normalização para resumo, série diária, campanhas, grupos de anúncios, criativos e recortes disponíveis.
- [x] Implementar coleta TikTok Ads com `account_id` estável, validação de cobertura, cache/snapshot e tratamento explícito de respostas parciais.
- [x] Expor rotas de leitura e atualização TikTok Ads com as mesmas regras de acesso e D-1 usadas nas demais mídias.
- [x] Criar a aba TikTok Ads no padrão visual da Meta Ads, com KPIs, evolução, tabelas, filtros, atualização e estados de carregamento/erro/vazio.
- [x] Integrar navegação, localização PT/EN, modo somente leitura e histórico de atualização sem afetar as abas existentes.
- [x] Criar regressões de serviço, rotas, UI, navegação e segredo; reconciliar os totais com a fonte Windsor.
- [x] Validar desktop, tablet e mobile, executar suíte completa, TypeScript e build.
- [x] Revisar o TODO, salvar checkpoint restaurável e entregar a nova aba.

> Auditoria concluída na conta Windsor `7668787778449719316` (`Ag. BBRO - MG Motor Brasil - AUT`). A entrega confirmada de 13–16/08 soma R$ 2.077,91, 86 formulários nativos TikTok, 181.144 impressões, 95.100 de alcance, 734 cliques e 2.425 engajamentos. Conta, campos, agrupamentos válidos, criativo, demografia, regiões e limitações estão documentados em `docs/tiktok-windsor-audit-2026-08-17.md`; o contrato de implementação está em `docs/tiktok-ads-contract.md`.

> Backend implementado com oito consultas Windsor, incluindo séries filtráveis por campanha e grupo, identidade estável, TTL de 15 minutos, deduplicação concorrente, snapshot persistente `TIKTOK_ADS`, rejeição de bundles parciais, bounds D-1, rotas tRPC e inclusão no refresh diário. A migração `0014_spooky_violations.sql` ampliou os enums das tabelas de auditoria e snapshots sem remover dados.

> Interface integrada em `?module=tiktok-ads`, no mesmo padrão visual da Meta Ads, com seis KPIs, filtros de campanha/grupo aplicados também aos gráficos, investimento e Leads diários, CPL, modelos, campanhas, grupos, criativos, idade, gênero e estados. O botão Atualizar força nova leitura Windsor, preserva o último sucesso em caso de erro e atualiza o timestamp compartilhado do dashboard.

> Verificação ao vivo de 01–16/08: `R$ 2.077,91 = diário = campanha = grupo = anúncio`; `86 Leads = diário = série por campanha = campanha = série por grupo = grupo = anúncio`; `86 conversões = gênero = idade = regiões`. Cobertura até 16/08, quatro dias ativos, uma campanha, um grupo, um anúncio, 13 linhas demográficas e 18 regiões. Evidência em `docs/tiktok-ads-live-verification.json`.

> Validação final: 294 testes em 50 arquivos aprovados, incluindo serviço, cache, snapshot, refresh diário, permissões, segredo Windsor, navegação, PT/EN, estados e renderização integral da interface. TypeScript e build de produção aprovados. Grades responsivas, alturas limitadas e rolagem interna foram cobertas por regressão estrutural; a captura automática da rota confirmou o bloqueio de acesso sem sessão, sem expor o dashboard protegido.

> Inicialização limpa confirmada após reinício: servidor disponível em `http://localhost:3000/`, sem erros atuais de runtime ou navegador. O acesso direto sem sessão permanece corretamente bloqueado.

## Investimento e CPL na distribuição por canal — 17/08/2026

- [x] Auditar o recorte de datas e os contratos atuais de Leads, Google Ads, Meta Ads e TikTok Ads.
- [x] Reconciliar investimento D-1 de Site/Google, Meta e TikTok sem misturar as métricas nativas de Leads das plataformas.
- [x] Calcular CPL de referência como investimento do canal dividido pelos Leads exibidos no quadro de distribuição.
- [x] Manter Webmotors e Mercado Livre sem investimento e CPL, preservando Leads, meta, atingimento e saldo.
- [x] Exibir investimento total de referência como soma de Google Ads + Meta Ads + TikTok Ads.
- [x] Alterar a grade desktop para 65% em `Leads por dia e canal` e 35% em `Distribuição por canal`.
- [x] Preservar empilhamento e legibilidade integral em tablet e mobile.
- [x] Criar regressões de cálculo, contrato, interface e layout; reconciliar os valores com as três fontes.
- [x] Executar suíte completa, TypeScript e build; revisar o TODO e salvar checkpoint restaurável.

> Reconciliação ao vivo de 01–16/08: Site/Google Ads `R$ 232.549,00 ÷ 2.149 Leads = CPL R$ 108,21`; Meta Ads `R$ 27.148,50 ÷ 4.013 Leads = CPL R$ 6,77`; TikTok Ads `R$ 2.077,91 ÷ 86 Leads = CPL R$ 24,16`. Investimento total `R$ 261.775,41 = Google + Meta + TikTok`. Webmotors e Mercado Livre permanecem excluídos de investimento/CPL. Evidência em `docs/lead-channel-investment-verification.json`.

> O contrato publica o total apenas quando as três fontes cobrem integralmente o período; falhas são isoladas por plataforma e não fabricam CPL. A grade desktop usa `minmax(0, 13fr) minmax(0, 7fr)`, equivalente a 65/35, e continua empilhada abaixo de 1536 px.

> Validação final: 299 testes em 51 arquivos aprovados, incluindo cálculo, cobertura parcial, falha isolada, formatação BRL, exclusão de Webmotors/Mercado Livre e proporção 65/35. TypeScript e build de produção aprovados; regra 13fr/7fr confirmada no CSS compilado. Reinício limpo sem erros atuais. A captura automatizada permaneceu corretamente no acesso protegido sem sessão; o conteúdo interno foi validado por regressões renderizadas e pela reconciliação ao vivo.

## Separação dos blocos e CPL geral estimado — 17/08/2026

- [x] Auditar a composição atual do painel e preservar a grade externa 65/35.
- [x] Calcular `CPL geral estimado = (Google + Meta + TikTok) ÷ (Leads de Site + Meta + TikTok)` no mesmo período D-1.
- [x] Separar visualmente `Distribuição e metas por canal` de `Investimento e CPL de mídia paga`.
- [x] Exibir Google/Site, Meta e TikTok com investimento e CPL em linhas mais amplas, sem comprimir os cards de meta.
- [x] Exibir abaixo o CPL geral estimado, o total investido e o total de Leads pagos usados no denominador.
- [x] Manter Webmotors e Mercado Livre fora do investimento e do CPL geral.
- [x] Validar cálculos, PT/EN, responsividade, suíte completa, TypeScript e build.
- [x] Revisar o TODO e salvar checkpoint restaurável.

> Reconciliação D-1 de 01–16/08: `R$ 261.775,41 ÷ 6.248 Leads pagos = CPL geral estimado de R$ 41,90`. O denominador contém somente Site `2.149` + Meta `4.013` + TikTok `86`; Webmotors e Mercado Livre permanecem excluídos. Evidência reproduzível atualizada em `docs/lead-channel-investment-verification.json`.

> A coluna de 35% agora contém dois painéis independentes: o primeiro preserva Leads, participação, meta, atingimento e saldo dos cinco canais; o segundo concentra investimento/CPL dos três canais pagos em células amplas e apresenta, abaixo, investimento total, Leads pagos e CPL geral estimado. Em larguras intermediárias o bloco pago usa três colunas; no desktop 65/35 usa duas, evitando compressão.

> Validação final: 299 testes em 51 arquivos, TypeScript e build de produção aprovados. A reconciliação ao vivo confirmou as três fontes, o total e o CPL geral; a rota protegida continua bloqueando acesso sem sessão e sem erros de tipagem ou build.

## Gráfico em largura total e blocos inferiores 50/50 — 17/08/2026

- [x] Requisito substituído antes da implementação: não remover `Distribuição por canal`; mantê-lo no layout final.
- [x] Ampliar `Leads por dia e canal` para 100% da largura disponível em desktop, tablet e mobile.
- [x] Requisito refinado antes da implementação: não deixar `Investimento e CPL de mídia paga` sozinho em largura total.
- [x] Posicionar, abaixo do gráfico, `Distribuição por canal` e `Investimento e CPL de mídia paga` lado a lado em 50/50 no desktop.
- [x] Preservar integralmente o bloco `Investimento e CPL de mídia paga`, incluindo CPL geral estimado.
- [x] Preservar cálculos, gráfico, filtros, investimento total, CPLs por canal e CPL geral estimado.
- [x] Atualizar regressões para impedir o retorno do layout 65/35 e validar o novo fluxo vertical.
- [x] Executar suíte completa, TypeScript e build; revisar o TODO e salvar checkpoint restaurável.

> Layout final: `Leads por dia e canal` ocupa uma linha inteira e 100% da largura. Na linha seguinte, `Distribuição por canal` e `Investimento e CPL de mídia paga` usam uma grade de duas colunas iguais a partir do desktop (`xl:grid-cols-2`); em tablet e mobile, empilham naturalmente. Se a referência de mídia não estiver disponível para o perfil, Distribuição usa a largura integral.

> O painel de mídia paga foi preservado sem alterações de cálculo: investimento total de R$ 261.775,41, 6.248 Leads pagos e CPL geral estimado de R$ 41,90, além dos CPLs individuais de Site/Google, Meta e TikTok. Os dois painéis inferiores usam altura compartilhada e conteúdo interno flexível para manter alinhamento visual.

> Validação final: 299 testes em 51 arquivos, TypeScript e build de produção aprovados. Reinício limpo do servidor concluído sem erros atuais de tipagem ou runtime.

## Execução agendada de Leads — 17/08/2026, execução solicitada

- [x] Executar exatamente o comando oficial de automação informado pelo usuário.
- [x] Ler `/tmp/mg-leads-scheduled-result.json` e o `reportMarkdown` apontado no resultado.
- [x] Validar status, contagens, base antes/depois e detalhamento por canal.
- [x] Confirmar a existência de `masterXlsx`, `masterCsv` e `reportMarkdown`.
- [x] Entregar o resumo em português com os três arquivos obrigatórios anexados.

> Execução `20260818-090232`: `UPDATED`; 19.892 linhas encontradas, 19.888 válidas, 439 novos registros, 740 duplicatas internas, 18.709 registros já existentes, quatro inválidas e zero remoções. A base passou de 18.709 para 19.148 Leads e o dashboard foi atualizado por substituição transacional com 19.148 linhas.

> Canais analíticos: Meta 6.893; Site 6.794; Campanha Urban 3.294; Webmotors 1.681; Mercado Livre 831; UOL 307; TikTok 88. Canais de origem: Site 8.587; Meta 8.252; Webmotors 1.739; Mercado Livre 915; UOL 307; TikTok 88.

> Artefatos confirmados: XLSX 1.368.149 bytes, CSV 2.636.140 bytes e relatório Markdown 1.482 bytes.

## Nova sincronização do dashboard — 18/08/2026

- [x] Executar a rotina oficial de consolidação e importação sobre a fonte atual.
- [x] Validar status, linhas encontradas, válidas, novas, duplicatas, inválidas e base antes/depois.
- [x] Reconciliar o detalhamento por canal e confirmar se o dashboard foi atualizado ou permaneceu sem mudanças.
- [x] Confirmar e entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260818-092814`: `UPDATED`; 20.033 linhas encontradas, 20.029 válidas, 141 novos registros, 740 duplicatas internas, 19.148 registros já existentes, quatro inválidas e zero remoções. A base passou de 19.148 para 19.289 Leads; a substituição transacional gravou 19.289 linhas e atualizou o dashboard.

> Canais analíticos: Meta 6.987; Site 6.794; Campanha Urban 3.341; Webmotors 1.681; Mercado Livre 831; UOL 307; TikTok 88. Canais de origem: Site 8.587; Meta 8.393; Webmotors 1.739; Mercado Livre 915; UOL 307; TikTok 88.

> Artefatos validados: XLSX 1.377.299 bytes, CSV 2.655.853 bytes e relatório Markdown 1.482 bytes.

## Reformulação da planilha de controle de criativos — 18/08/2026

- [x] Auditar todas as abas, cabeçalhos, dados, fórmulas, filtros, validações e padrões visuais existentes.
- [x] Preservar integralmente os dados atuais e identificar os campos essenciais para acompanhar campanhas e criativos ativos.
- [x] Definir uma hierarquia visual profissional, com cabeçalho, status, filtros e leitura operacional rápida.
- [x] Aplicar formatação, larguras, alinhamentos, cores de status, validações e filtros sem congelamentos prejudiciais.
- [x] Melhorar a usabilidade para inclusão, edição e acompanhamento de campanhas, peças, datas e responsáveis.
- [x] Validar fórmulas, dados, filtros e visualização após as alterações.
- [x] Entregar a planilha atualizada e documentar as melhorias realizadas.

> A aba original foi duplicada antes das alterações como `Backup original - 18-08-2026` e mantida oculta. Os cinco registros, datas e links foram preservados.

> A aba operacional foi renomeada para `Controle de Criativos` e recebeu resumo dinâmico, título, instruções, tabela com dez colunas, filtros, status, prazo automático, responsáveis e observações. Foram adicionadas 45 validações nas células inspecionadas, seis regras condicionais, faixas alternadas, links `Abrir pasta`, larguras específicas, grade oculta e congelamento até o cabeçalho operacional.

> Validação final: cinco registros, cinco ativos, zero programados, zero pausados, zero encerrados e próximo término em 23/08/2026. As fórmulas foram adaptadas ao locale `pt_BR`; zero erros permanecem. A inspeção visual confirmou hierarquia, legibilidade, filtros, cores de status e tabela sem perda de dados.

> Entrega concluída no arquivo original do Google Sheets. A aba operacional está visível como `Controle de Criativos`; o backup original permanece oculto e reversível.

## Atualização manual do dashboard — 18/08/2026, nova execução

- [x] Executar a rotina oficial de consolidação e importação sobre a fonte mais recente.
- [x] Validar linhas encontradas, válidas, novas, duplicatas internas, existentes, inválidas e remoções.
- [x] Reconciliar base antes/depois e detalhamento por canal.
- [x] Confirmar se o dashboard foi atualizado ou permaneceu sem mudanças.
- [x] Validar e entregar XLSX, CSV e relatório Markdown da execução.

> Execução `20260818-095852`: `UPDATED`; 20.214 linhas encontradas, 20.210 válidas, 181 novos registros, 740 duplicatas internas, 19.289 registros já existentes, quatro inválidas e zero remoções. A base passou de 19.289 para 19.470 Leads.

## Execução agendada obrigatória de Leads — 18/08/2026

- [x] Executar exatamente o comando informado e gravar `/tmp/mg-leads-scheduled-result.json`.
- [x] Ler o JSON resultante e o `reportMarkdown` indicado nele.
- [x] Validar status, linhas, duplicatas, inválidos, base antes/depois e canais.
- [x] Confirmar a existência de `masterXlsx`, `masterCsv` e `reportMarkdown`.
- [x] Entregar o resumo em português com os três arquivos obrigatórios anexados.

> Execução `20260818-100247`: `NO_CHANGES`; 20.214 linhas encontradas, 20.210 válidas, zero novos registros, 740 duplicatas internas, 19.470 registros já existentes, quatro inválidas e zero remoções. A base permaneceu em 19.470 Leads e nenhuma linha foi gravada.

> Canais analíticos: Meta 6.987; Site 6.794; Campanha Urban 3.434; Webmotors 1.757; Mercado Livre 831; UOL 307; TikTok 100. Canais de origem: Site 8.587; Meta 8.393; Webmotors 1.908; Mercado Livre 915; UOL 307; TikTok 100.

> Artefatos confirmados: XLSX 1.385.213 bytes, CSV 2.671.133 bytes e relatório Markdown 1.484 bytes.

## Executive Summary em português — 01 a 17/08/2026

- [x] Auditar a versão atual de seis slides e preservar seu padrão visual corporativo.
- [x] Extrair do dashboard os dados verificados de Leads, canais, MTD Retail Order, conversão, Google, Meta e TikTok até 17/08.
- [x] Reconciliar totais, rankings e percentuais sem incluir investimento, CPL ou gestão orçamentária.
- [x] Atualizar capa, visão geral, canais, campanhas, MTD Retail Order/rede e encerramento.
- [x] Garantir conteúdo integralmente em português e nomenclatura `MTD Retail Order`.
- [x] Validar renderização 1280×720, números, hierarquia e ausência de conteúdo residual de 01–16/08.
- [x] Apresentar e entregar a versão final atualizada.

> Snapshot reproduzível salvo em `data-pt-aug-01-17.json`. Leads reconciliados em `7.806 total = 7.806 canais = 7.806 dias = 7.806 modelos = 7.778 atribuídos + 28 em qualificação`. MTD Retail Order: 248 pedidos, 25 dealers reportados, zero unmatched e 3,36% de conversão sobre 7.380 Leads atribuídos aos dealers reportados.

> Cobertura de mídia confirmada até 17/08: Google 3.579.411 impressões e 251.078 cliques; Meta 1.350.550 impressões, 476.132 de alcance e 4.400 Leads de plataforma; TikTok 235.733 impressões, 114.731 de alcance e 100 Leads. Investimentos, CPLs e gestão orçamentária foram excluídos do roteiro corporativo.

> Validação final: seis slides renderizados em 1280×720 sem cortes ou sobreposições. Auditoria textual encontrou zero ocorrências de `01–16`, `16 dias`, `July`, `Retail Sales`, `Vendas no Varejo`, `Investimento`, `CPL` ou valores monetários nos slides ativos. TypeScript aprovado e zero páginas pendentes.

> Apresentação final preparada em `manus-slides://VhkWGrZnlCCjHAVK1akhF5`, com seis páginas atualizadas para 01–17/08/2026.

## Ajuste de ocupação dos slides — Executive Summary 01–17/08

- [x] Auditar o aproveitamento vertical e horizontal dos seis slides em 1280×720.
- [x] Ampliar os blocos de conteúdo que aparentam ocupar somente parte da página.
- [x] Reduzir áreas vazias excessivas sem acrescentar dados ou alterar números.
- [x] Preservar o padrão visual MG, a hierarquia e a legibilidade executiva.
- [x] Renderizar novamente os seis slides e validar cortes, alinhamentos e equilíbrio.
- [x] Apresentar e entregar a versão ajustada.

> Capa e encerramento receberam painéis de marca em altura integral. Visão geral, Leads, campanhas e rede tiveram painéis, barras, KPIs e rankings ampliados até o rodapé, preservando integralmente os dados de 01–17/08.

> Validação visual concluída em seis imagens 1280×720: zero cortes, zero sobreposições e nenhum elemento fora do canvas. Os achados estão documentados em `validation-layout-adjusted/findings.md`.

> Versão final preparada em `manus-slides://3cTI1qRf6YTZWDxwUAvoST`, com o layout reequilibrado nos seis slides.

## Correção do importador de Vendas e atualização da Executive Summary — 18/08/2026

- [x] Inspecionar o PDF enviado e o fluxo oficial de upload, preview e importação de Vendas.
- [x] Reproduzir a falha sem alterar a base e identificar a causa raiz.
- [x] Corrigir o parser ou importador preservando o contrato `MTD Retail Order` e os bloqueios de ambiguidade.
- [x] Criar regressões específicas para o novo PDF e para a causa raiz encontrada.
- [x] Importar o PDF corrigido na base oficial e confirmar idempotência.
- [x] Reconciliar total de MTD Retail Order, semanas, dealers, aliases e registros não correspondidos.
- [x] Informar quais concessionárias do PDF não foram encontradas no dashboard, se houver.
- [x] Reextrair Leads, Vendas e conversão para a Executive Summary.
- [x] Reconciliar investimento e CPL de Google, Meta e TikTok no mesmo período exibido nos slides.
- [x] Calcular e exibir o investimento total consolidado das três plataformas.
- [x] Atualizar os seis slides, incluindo ranking Top 5 e indicadores da rede.
- [x] Validar dashboard, testes, TypeScript, build e renderização 1280×720 dos slides.
- [x] Revisar o TODO, salvar checkpoint restaurável e entregar o diagnóstico e a apresentação atualizada.

> O PDF de 17/08 possui 11 páginas, 1.278.074 bytes e assinatura válida. O parser local extraiu 29 linhas, 26 dealers, duas regiões e um TOTAL; W4 reconciliou em `338 = 338 = 338`, com zero erros e apenas o aviso de TECAR GOIÂNIA sem MTD Retail Order informado.

> Causa raiz confirmada nos logs de produção: a leitura multimodal retornou JSON truncado/malformado, rejeitado em `JSON.parse` na posição 1964. O fluxo atual seleciona apenas um modelo e encerra a prévia na primeira resposta estruturada inválida, embora uma nova leitura do mesmo PDF possa funcionar. O arquivo, o tamanho, a assinatura, a competência e a reconciliação não são a causa da falha.

> Correção implementada: o parser consulta o catálogo vivo e tenta, em ordem, Gemini Flash, GPT-5 Mini e Claude Haiku quando uma resposta multimodal vem vazia, malformada ou fora do schema. Uma regressão reproduz exatamente o JSON truncado de produção e comprova o fallback para o segundo modelo. Resultado: 300 testes em 51 arquivos aprovados e TypeScript sem erros.

> Importação oficial concluída no lote `360001`: 29 linhas gravadas para a competência 2026-08, W4 como referência e 338 MTD Retail Orders reconciliados. Os 26 dealers foram correspondidos; zero dealers ficaram unmatched. TECAR GOIÂNIA permanece corretamente conciliada, mas sem MTD Retail Order informado no PDF.

> Idempotência confirmada: a reexecução retornou o mesmo lote `360001`, `idempotent: true` e `rowsInserted: 0`. O dashboard reconciliou `338 = dealers = estados = metas`, com 26 dealers correspondidos, zero unmatched e conversão de 4,45% sobre 7.597 Leads atribuídos. TECAR GOIÂNIA possui 258 Leads, está conciliada e permanece sem MTD Retail Order informado na fonte.

> Snapshot executivo atualizado: Google R$ 257.832,99 e CPL/CPA R$ 87,04; Meta R$ 29.858,97 e CPL R$ 6,79; TikTok R$ 2.621,06 e CPL R$ 26,21. Total investido: R$ 290.313,02; CPL combinado: R$ 38,91 sobre 7.462,1 resultados de plataforma.

> Slides atualizados: visão geral com 338 MTD Retail Orders e conversão de 4,45%; campanhas com investimento e CPL de Google, Meta e TikTok, investimento total e CPL combinado; rede com W4, 26 dealers e novo Top 5 de 135 pedidos.

> Validação final: 300 testes em 51 arquivos aprovados, TypeScript sem erros, build de produção concluído e servidor reiniciado sem falhas atuais. Os três slides alterados renderizam em 1280×720 sem cortes ou sobreposições; a auditoria textual encontrou zero referências residuais a 248 pedidos, 3,36%, S3 ou relatório de 14/08.

> Apresentação preparada em `manus-slides://NiJsvCEQ21qdpQ1ujXgaa8`.

## Rodapés ancorados ao final dos slides — 18/08/2026

- [x] Auditar a distância entre cada barra inferior e a borda final do canvas.
- [x] Ancorar a barra do slide 2 na base da página, eliminando a faixa vazia abaixo.
- [x] Aplicar a mesma regra aos demais slides com rodapé, preservando conteúdo e dados.
- [x] Renderizar os seis slides em 1280×720 e validar alinhamento inferior, cortes e sobreposições.
- [x] Apresentar e entregar a versão corrigida.

> Validação final: seis slides renderizados em 1280×720; barras dos slides 2 a 5 ancoradas na base; capa e encerramento em altura integral; nenhum corte ou sobreposição identificado.

## CPL por estado e por dealer — 18/08/2026

- [x] Auditar quais fontes de mídia disponibilizam investimento com granularidade geográfica ou vínculo confiável com dealer.
- [x] Extrair Leads por estado e por dealer no mesmo período fechado usado para o investimento.
- [x] Extrair investimento atribuível por estado e por dealer sem rateio arbitrário.
- [x] Calcular CPL apenas onde investimento e Leads compartilham a mesma cobertura e definição.
- [x] Reconciliar totais, cobertura atribuída e valores não atribuíveis.
- [x] Entregar tabelas auditáveis de CPL por estado e por dealer, com metodologia e limitações explícitas.

> Período analisado: 01–17/08/2026. Investimento real reconciliado: R$ 290.313,02. Leads pagos: 6.819. CPL geral sobre Leads do dashboard: R$ 42,57. Como as plataformas não oferecem vínculo uniforme de gasto real com dealer, o gasto de cada canal foi alocado proporcionalmente às metas de Leads do respectivo canal. A cobertura foi de 99,59%: 6.791 Leads pagos em 30 dealers, zero dealers canônicos sem meta e 28 Leads sem dealer utilizável.

## Cidades com dealers oficiais — 18/08/2026

- [x] Extrair a cidade e a UF operacional dos dealers oficiais ativos.
- [x] Consolidar cidades repetidas e validar a quantidade de dealers por localidade.
- [x] Entregar a lista completa de cidades com UF e respectivos dealers.

> Base oficial reconciliada em 26 cidades/áreas operacionais, 17 UFs e 31 dealers. São Paulo/SP concentra seis dealers; as demais localidades possuem um dealer cada.

## Dashboard — CPL por estado e dealer — 18/08/2026

- [x] Criar contrato de backend para CPL estimado por estado e por dealer no período selecionado.
- [x] Usar investimento real de Google, Meta e TikTok com cobertura integral até a data final.
- [x] Alocar o gasto de cada canal conforme a meta do respectivo canal por dealer, sem rateio uniforme.
- [x] Usar somente Leads de Site, Meta e TikTok atribuídos ao dealer como denominador.
- [x] Exibir cobertura, Leads sem dealer e aviso de que o CPL é estimado.
- [x] Adicionar tabela de CPL por estado com Leads pagos, investimento alocado e CPL.
- [x] Adicionar tabela de CPL por dealer com UF, Leads pagos, investimento alocado e CPL.
- [x] Integrar as tabelas aos filtros de período já existentes na aba Leads.
- [x] Cobrir cálculo, reconciliação e renderização com testes Vitest.
- [x] Validar a nova visualização em desktop e mobile sem overflow do documento.
- [x] Revisar o TODO, salvar checkpoint e entregar a atualização.

> O novo bloco fica na aba Leads, logo abaixo de Distribuição por canal e Investimento/CPL de mídia paga. No recorte validado de 01–17/08/2026: R$ 290.313,02 de investimento, 6.819 Leads pagos, 6.791 atribuídos aos 30 dealers, 17 UFs operacionais e cobertura de 99,59%. Validação final: 303 testes em 53 arquivos, TypeScript e build aprovados; desktop 1440×1100 e mobile 390×844 sem overflow do documento.

## Ajuste — CPL nas tabelas existentes — 18/08/2026

- [x] Remover da aba Leads as tabelas independentes de CPL por estado e dealer.
- [x] Adicionar investimento alocado e CPL estimado à tabela existente de acompanhamento por dealer.
- [x] Adicionar investimento alocado e CPL estimado à tabela existente de resultados por estado.
- [x] Preservar busca, ordenação, expansão, metas, MTD Retail Order, conversão e demais colunas atuais.
- [x] Manter a metodologia estimada e a cobertura acessíveis sem criar um novo painel de dados.
- [x] Atualizar contratos e propriedades entre LeadsTab, WeeklySalesPanel e DealerTargetTrackingPanel.
- [x] Atualizar regressões e remover o componente independente obsoleto.
- [x] Validar desktop e mobile, executar testes, TypeScript e build.
- [x] Revisar o TODO, salvar checkpoint e entregar a correção.

> As tabelas independentes foram removidas. `Investimento alocado` e `CPL estimado` agora são duas colunas adicionais em `Acompanhamento das metas por concessionária` e em `Principais concessionárias, Leads e MTD Retail Order por estado`; no mobile, aparecem como campos dos cards já existentes. Busca, ordenação, expansão, metas, MTD Retail Order, conversão e cobertura foram preservadas. Validação: 302 testes em 52 arquivos, TypeScript e build aprovados; desktop e mobile sem overflow do documento.

## Execução agendada obrigatória de Leads — 19/08/2026

- [x] Executar exatamente o comando oficial informado e gravar `/tmp/mg-leads-scheduled-result.json`.
- [x] Ler o JSON resultante e o `reportMarkdown` indicado.
- [x] Validar status, linhas encontradas, válidas, novas, duplicatas, inválidas, base antes/depois e canais.
- [x] Confirmar a existência de `masterXlsx`, `masterCsv` e `reportMarkdown`.
- [x] Entregar o resumo em português com os três arquivos obrigatórios anexados.

> Execução `20260819-090435`: `NO_CHANGES`; 20.214 linhas encontradas, 20.210 válidas, zero novos registros, 740 duplicatas internas, 19.470 já existentes, quatro inválidas e zero remoções. A base permaneceu em 19.470 Leads, sem substituição ou alteração do dashboard. Artefatos validados: XLSX íntegro, CSV com 20.211 linhas incluindo cabeçalho e relatório Markdown disponível.

## Atualização manual da base de Leads — 19/08/2026

- [x] Executar a rotina oficial de consolidação e importação de Leads.
- [x] Validar linhas encontradas, válidas, novas, duplicadas e inválidas.
- [x] Confirmar a base antes/depois e se o dashboard foi atualizado.
- [x] Validar o detalhamento por canal e os artefatos gerados.
- [x] Entregar o relatório da execução nesta tarefa.

> Execução `20260819-092548`: dashboard atualizado com 507 novos Leads. A planilha continha 20.724 linhas, sendo 20.720 válidas, 743 duplicatas internas e quatro inválidas. A base passou de 19.470 para 19.977 registros; a contagem final de 19.977 foi confirmada diretamente no banco. Zero registros foram removidos da fonte. XLSX, CSV e relatório Markdown foram validados.

## Reatualização manual da base de Leads — 19/08/2026

- [x] Reexecutar a rotina oficial de consolidação e importação.
- [x] Comparar novos registros com a base atual de 19.977 Leads.
- [x] Validar duplicatas, inválidos, canais e artefatos gerados.
- [x] Confirmar diretamente no banco a contagem final do dashboard.
- [x] Entregar o relatório da reatualização nesta tarefa.

> Execução `20260819-094152`: 57 novos Leads inseridos; a base passou de 19.977 para 20.034 registros, confirmados diretamente no banco. A origem continha 20.781 linhas, com 20.777 válidas, 743 duplicatas internas, quatro inválidas e zero remoções. XLSX, CSV e relatório Markdown foram validados.

## Nova execução agendada obrigatória de Leads — 19/08/2026

- [x] Executar exatamente o comando obrigatório e gravar `/tmp/mg-leads-scheduled-result.json`.
- [x] Ler o JSON e o `reportMarkdown` apontado pelo resultado.
- [x] Validar reconciliação, canais, base antes/depois e status do dashboard.
- [x] Confirmar a existência e integridade de `masterXlsx`, `masterCsv` e `reportMarkdown`.
- [x] Entregar o relatório em português com os três arquivos anexados.

> Execução `20260819-100713`: `NO_CHANGES`; 20.781 linhas encontradas, 20.777 válidas, zero novos registros, 743 duplicatas internas, 20.034 já existentes, quatro inválidas e zero remoções. A base permaneceu em 20.034 Leads e o dashboard não sofreu alterações. XLSX, CSV e relatório Markdown foram validados.

## Automação diária do Daily Sales Planning Report — 19/08/2026

- [x] Verificar imediatamente a caixa de entrada pelo assunto `Daily Sales Planning Report` e localizar o PDF do dia vigente.
- [x] Importar o PDF encontrado exclusivamente pelo fluxo oficial de MTD Retail Order do dashboard.
- [x] Validar competência, data de referência, total de pedidos, dealers conciliados e idempotência.
- [x] Configurar início diário às 08:00, com verificações de hora em hora até a importação bem-sucedida.
- [x] Interromper novas tentativas no restante do dia após a importação e reiniciar automaticamente no dia seguinte às 08:00.
- [x] Notificar nesta tarefa do Manus quando o e-mail não estiver disponível, quando houver falha ou quando a importação for concluída.
- [x] Cobrir o controle diário, a parada após sucesso e o reinício no dia seguinte com testes.
- [x] Documentar a configuração, salvar checkpoint e entregar o resultado da verificação atual.
- [x] Reabrir a conexão do Office 365 Outlook em uma tela visível ao usuário e concluir a autorização da caixa `rodrigo.cordova@bbro.com.br`.
- [x] Retomar o fluxo após a autorização e confirmar que o gatilho usa a conexão correta.

> Automação recorrente encerrada por decisão do usuário. O processo aprovado passou a ser manual sob demanda; o PDF de 19/08 foi importado pelo fluxo oficial com 387 MTD Retail Orders, 26 dealers conciliados, zero unmatched e idempotência confirmada. O webhook experimental foi removido antes do checkpoint.

## Simplificação das tabelas e evolução acumulada de Leads — 19/08/2026

- [x] Remover do dashboard o painel redundante `Eficiência de MTD Retail Order por concessionária`.
- [x] Preservar as informações operacionais nas tabelas existentes de dealers e estados.
- [x] Ordenar a tabela de dealers por conversão decrescente, com valores indisponíveis ao final.
- [x] Ordenar a tabela de estados por conversão decrescente, com valores indisponíveis ao final.
- [x] Incorporar ao gráfico existente de Leads uma visão acumulada `Real × Pace planejado` sem criar novo painel redundante.
- [x] Calcular o pace acumulado a partir da meta mensal e dos dias do mês, respeitando o período fechado até D-1.
- [x] Mostrar visualmente se o acumulado real está acima ou abaixo da trajetória esperada.
- [x] Atualizar testes de ordenação, reconciliação, pace e renderização.
- [x] Validar desktop e mobile, executar TypeScript, testes e build e salvar checkpoint.

> Implementação final: tabelas de dealers e estados iniciam pela maior conversão e mantêm taxas indisponíveis no final; cards mobile mostram a conversão explicitamente. O gráfico existente combina barras diárias com Real acumulado e Pace acumulado em `ComposedChart`, sem animação inicial, e informa o desvio frente ao pace. O painel redundante foi removido. Validação visual integral em desktop e mobile com dados reais de 01–19/08 e validação técnica com 305 testes, TypeScript e build aprovados.

## Execução agendada obrigatória de Leads — 20/08/2026

- [x] Executar exatamente o comando oficial e gravar `/tmp/mg-leads-scheduled-result.json`.
- [x] Ler o JSON resultante e o `reportMarkdown` indicado.
- [x] Validar linhas encontradas, válidas, novas, duplicadas, inválidas, base antes/depois e canais.
- [x] Confirmar a existência de `masterXlsx`, `masterCsv` e `reportMarkdown`.
- [x] Entregar o relatório em português com os três arquivos obrigatórios anexados.

> Execução `20260820-090431`: `NO_CHANGES`; 20.781 linhas encontradas, 20.777 válidas, zero novos registros, 743 duplicatas internas, 20.034 já existentes, quatro inválidas e zero remoções. A base permaneceu em 20.034 Leads e o dashboard não sofreu alterações. XLSX, CSV e relatório Markdown foram validados.

## Atualização manual do dashboard — 20/08/2026

- [x] Executar a rotina oficial de consolidação e importação de Leads.
- [x] Ler o JSON e o relatório Markdown gerados.
- [x] Validar novos registros, duplicatas, inválidos, canais e base antes/depois.
- [x] Confirmar a contagem final persistida e a integridade dos artefatos.
- [x] Entregar o relatório da atualização com XLSX, CSV e Markdown anexados.

> Execução `20260820-095046`: dashboard atualizado com 974 novos registros detectados e 29 registros removidos da fonte. A substituição idempotente levou a base de 20.034 para 20.979 Leads, contagem confirmada diretamente no banco. Foram validadas 21.725 linhas, 746 duplicatas internas, 20.005 registros já existentes e quatro inválidos; XLSX, CSV e relatório Markdown íntegros.

## Finalização — conversão e Real × Pace — 20/08/2026

- [x] Revisar o estado atual das alterações e confirmar ausência do painel redundante.
- [x] Validar visualmente tabelas e gráfico em desktop e mobile.
- [x] Reexecutar testes, TypeScript e build na versão final.
- [x] Marcar os requisitos originais como concluídos e revisar o TODO completo.
- [x] Salvar checkpoint restaurável e entregar a versão finalizada.

## Execução agendada obrigatória de Leads — 20/08/2026 — segunda rodada

- [x] Executar exatamente o comando oficial e gravar `/tmp/mg-leads-scheduled-result.json`.
- [x] Ler o JSON resultante e o `reportMarkdown` indicado.
- [x] Validar linhas encontradas, válidas, novas, duplicadas, inválidas, base antes/depois e canais.
- [x] Confirmar a existência e integridade de `masterXlsx`, `masterCsv` e `reportMarkdown`.
- [x] Entregar o relatório em português com os três arquivos obrigatórios anexados.

> Execução `20260820-100242`: `NO_CHANGES`; 21.729 linhas encontradas, 21.725 válidas, zero novos registros, 746 duplicatas internas, 20.979 já existentes, quatro inválidas e zero remoções. A base permaneceu em 20.979 Leads e o dashboard não sofreu alterações. XLSX, CSV e relatório Markdown foram validados.

## Retomada final dos ajustes do dashboard — 20/08/2026

- [x] Gerar uma prévia auditável das tabelas e do gráfico com dados reais atualizados.
- [x] Confirmar ordenação decrescente de conversão e valores sem taxa no final.
- [x] Confirmar visualmente as linhas Real acumulado e Pace acumulado.
- [x] Confirmar que o painel redundante não aparece na composição final.
- [x] Concluir validações técnicas, revisar o TODO e salvar checkpoint.

## Atualização da base com TikTok — 20/08/2026

- [x] Executar a rotina oficial de consolidação e importação sobre a fonte atualizada.
- [x] Confirmar a leitura da aba TikTok e a quantidade de registros válidos por origem.
- [x] Validar novos registros, duplicatas internas, existentes, inválidos e remoções da fonte.
- [x] Reconciliar canais analíticos, canais de origem e base antes/depois.
- [x] Confirmar diretamente no banco a contagem final persistida no dashboard.
- [x] Validar XLSX, CSV e relatório Markdown e entregar o resultado da atualização.

> Execução `20260820-104504`: dashboard atualizado com 19 novos Leads TikTok e zero remoções. TikTok passou de 111 para 130 registros por origem; a base total passou de 20.979 para 20.998 Leads. Foram encontradas 21.748 linhas, sendo 21.744 válidas, 746 duplicatas internas e quatro inválidas. A contagem final de 20.998 Leads e 130 TikTok foi confirmada diretamente no banco. XLSX íntegro, CSV com 21.745 linhas incluindo cabeçalho e relatório Markdown validados.

## Novo acesso — tati — 20/08/2026

- [x] Auditar o modelo de usuários, hash de senha e armazenamento de permissões do dashboard.
- [x] Identificar o usuário `winicius` e registrar exatamente seus módulos e nível de acesso.
- [x] Criar o usuário `tati` com a senha solicitada usando o mesmo algoritmo seguro de hash.
- [x] Copiar para `tati` exatamente as mesmas permissões de `winicius`.
- [x] Usar a senha inicial aprovada `tati2026`, atendendo ao mínimo de oito caracteres da política vigente.
- [x] Validar autenticação, status ativo e equivalência das permissões sem expor hashes.
- [x] Registrar e entregar o novo acesso.

> Conta `tati` criada ativa, em português, com hash scrypt e autenticação validada. Permissões idênticas a `winicius`: acesso a Google Ads, Meta Ads, Leads, Plano de Mídia, Otimizações e Histórico; sem importação de Leads e sem Histórico de Acessos. A equivalência foi confirmada pela autenticação oficial e diretamente no banco, sem consultar ou expor hashes.

## Verificação manual do e-mail de vendas — 20/08/2026

- [x] Consultar o Outlook pelo assunto `Daily Sales Planning Report` e identificar a mensagem do dia vigente.
- [x] Confirmar a existência do PDF anexado e armazená-lo apenas no ambiente operacional.
- [x] Processar o arquivo recebido `/home/ubuntu/upload/260820DailySalesPlanningReport.pdf`.
- [x] Diagnosticar competência, data de referência, total de MTD Retail Orders e dealers antes da gravação.
- [x] Importar o PDF exclusivamente pelo fluxo oficial e confirmar idempotência.
- [x] Validar lote ativo, total persistido, dealers conciliados e unmatched diretamente no banco.
- [x] Registrar e entregar o resultado da verificação manual.

> O e-mail `Daily Sales Planning Report 260820` foi localizado em 20/08/2026 às 17:04 UTC e informava MTD de 399. O PDF recebido foi diagnosticado com 29 linhas: 26 dealers, duas regiões e um TOTAL; Semana 4; 399 MTD Retail Orders; reconciliação integral. Importação `420001` concluída para 2026-08 com 26 de 26 dealers conciliados, zero unmatched, zero erros e idempotência confirmada. Aviso preservado: `TECAR GOIÂNIA` sem MTD Retail Order informado na Semana 4.

## Consulta de acessos do site via Google Analytics — 20/08/2026

- [x] Identificar a propriedade Google Analytics da MG disponível na fonte conectada.
- [x] Extrair sessões e usuários por dia no mês atual.
- [x] Calcular total, média diária e, se houver cobertura, média mensal recente.
- [x] Validar período, dias com dados e diferença entre sessões e usuários.
- [x] Entregar uma leitura executiva sem estimar dados ausentes.

> Fonte: propriedade GA4 `MG MOTOR` (`544963048`) via Windsor. Agosto de 01–19/08: 281.919 sessões, 208.853 usuários ativos e 543.336 visualizações; média de 14.837,84 sessões e 28.596,63 visualizações por dia. Julho completo: 303.062 sessões, 218.038 usuários ativos e 581.353 visualizações; média de 9.776,19 sessões por dia. O ritmo diário de sessões em agosto está 51,78% acima de julho; projeção simples, não realizada, de 459.973 sessões no mês se o ritmo for mantido. Junho retornou sem dados na propriedade conectada.

## Execução agendada obrigatória de Leads — 20/08/2026 — terceira rodada

- [x] Executar exatamente o comando oficial e gravar `/tmp/mg-leads-scheduled-result.json`.
- [x] Ler o JSON resultante e o `reportMarkdown` indicado.
- [x] Validar linhas encontradas, válidas, novas, duplicadas, inválidas, base antes/depois e canais.
- [x] Confirmar a existência e integridade de `masterXlsx`, `masterCsv` e `reportMarkdown`.
- [x] Entregar o relatório em português com os três arquivos obrigatórios anexados.

> Execução `20260821-090441`: `NO_CHANGES`; 21.748 linhas encontradas, 21.744 válidas, zero novos registros, 746 duplicatas internas, 20.998 já existentes, quatro inválidas e zero remoções. A base permaneceu em 20.998 Leads e o dashboard não sofreu alterações. XLSX íntegro, CSV com 21.745 linhas incluindo cabeçalho e relatório Markdown validados.

## Atualização manual do dashboard — 21/08/2026

- [x] Executar a rotina oficial de consolidação e importação de Leads.
- [x] Ler o JSON e o relatório Markdown gerados.
- [x] Validar novos registros, duplicatas, inválidos, canais e base antes/depois.
- [x] Confirmar a contagem final persistida e a integridade dos artefatos.
- [x] Entregar o relatório da atualização com XLSX, CSV e Markdown anexados.

> Execução `20260821-095639`: dashboard atualizado com 551 novos registros e zero remoções. A base passou de 20.998 para 21.549 Leads, contagem confirmada diretamente no banco. Foram encontradas 22.300 linhas, sendo 22.296 válidas, 747 duplicatas internas, 20.998 registros já existentes e quatro inválidos. XLSX íntegro, CSV com 22.297 linhas incluindo cabeçalho e relatório Markdown validados.

## Nova atualização manual do dashboard — 21/08/2026

- [x] Executar a rotina oficial de consolidação e importação de Leads.
- [x] Ler o JSON e o relatório Markdown gerados.
- [x] Validar novos registros, duplicatas, inválidos, canais e base antes/depois.
- [x] Confirmar a contagem final persistida e a integridade dos artefatos.
- [x] Entregar o relatório da atualização com XLSX, CSV e Markdown anexados.

> Execução `20260821-104511`: dashboard atualizado com 62 novos registros e zero remoções. A base passou de 21.549 para 21.611 Leads, contagem confirmada diretamente no banco. Foram encontradas 22.363 linhas, sendo 22.359 válidas, 748 duplicatas internas, 21.549 registros já existentes e quatro inválidos. XLSX íntegro, CSV com 22.360 linhas incluindo cabeçalho e relatório Markdown validados.

## Google Ads somente com campanhas atuais ativas — 21/08/2026

- [x] Auditar no Windsor os valores e campos de status das campanhas atuais da conta MG Motors.
- [x] Identificar no serviço do Google Ads onde campanhas pausadas, encerradas ou antigas entram nas agregações.
- [x] Aplicar filtro canônico de status ativo no backend, preservando o período e os contratos existentes.
- [x] Garantir que KPIs, séries, tabelas e rankings da aba usem somente campanhas ativas.
- [x] Atualizar regressões de serviço, router e interface.
- [x] Validar totais com a fonte Windsor, executar TypeScript, testes e build.
- [x] Inspecionar a aba em desktop e mobile e salvar checkpoint restaurável.

> Auditoria Windsor 01–20/08: 25 campanhas `ENABLED` com R$ 46.325,69 e 75 campanhas `REMOVED` com R$ 265.048,53. A aba agora usa somente campanhas cujo status mais recente é `ENABLED`. Refresh ao vivo confirmado até 20/08: 74 linhas ativas, 25 campanhas, zero status inativo, R$ 46.325,69 de investimento, 234,4 conversões, CPA de R$ 197,63 e KPIs reconciliados. Interface atualizada para explicitar o filtro. Validação: 308 testes em 52 arquivos, TypeScript e build aprovados; logs atuais sem erros de runtime. A captura automática confirmou a tela protegida; a lista autenticada foi validada pelo contrato ao vivo e pelas regressões.

## Correção — histórico completo e campanhas atuais ativas — 21/08/2026

- [x] Restaurar todas as campanhas que rodaram no período selecionado nos KPIs históricos de investimento, conversões, CPA, CTR, CPC e impressões.
- [x] Restaurar todas as campanhas do período nas séries diárias, produtos, regiões e rankings Top 10 de CPA.
- [x] Manter o filtro de status `ENABLED` somente nas áreas que representam campanhas atualmente ativas.
- [x] Separar explicitamente os contratos de dados históricos e atuais para impedir novo vazamento de regras.
- [x] Atualizar os rótulos da interface para não sugerir que o histórico está filtrado por status atual.
- [x] Criar regressões que comprovem histórico completo e universo atual somente `ENABLED`.
- [x] Reconciliar os dois universos com o Windsor, executar testes, TypeScript e build.
- [x] Validar a interface e salvar checkpoint restaurável.

> Verificação Windsor ao vivo para 01–20/08: histórico completo com 1.316 linhas, 100 campanhas (`REMOVED` e `ENABLED`), R$ 311.374,21 investidos, 3.168,5 conversões e CPA de R$ 98,27. Universo operacional atual: 74 linhas, 25 campanhas, somente `ENABLED`, zero inativas. KPIs históricos reconciliados integralmente com a série diária; 14 campanhas hoje inativas aparecem nos rankings por terem rodado no período, conforme a regra corrigida. Validação: 308 testes em 52 arquivos, TypeScript e build aprovados; interface protegida renderizada sem erro.

> Refresh D-1 executado em 25/08/2026 para 23/08: Google Ads concluído via `windsor-live` (1.867 linhas, 100 campanhas, R$ 399.225,50, 5.121 conversões); TikTok Ads concluído via `windsor-live` (7 dias, R$ 4.154,92, 111 Leads); Meta Ads teve timeout na execução integrada, mas foi recuperado em consulta dedicada via `windsor-live` (7 dias, R$ 22.028,99, 2.443 Leads, atualização até 23/08). Leads sincronizados via Google Sheets (22.689 linhas após substituição da base; 2.469 novos registros; 20.220 já armazenados; 704 repetições internas; 2 linhas inválidas reportadas). MTD Retail Order importado do `260824DailySalesPlanningReport.pdf`: lote 480001, semana 4, 523 vendas, 26 dealers conciliados, zero unmatched; reprocessamento idempotente confirmado.

## Atualização D-1 com MTD Retail Order, Google Ads e TikTok Ads — 24/08/2026

- [x] Inspecionar o PDF `260824DailySalesPlanningReport.pdf` e confirmar a tabela Retail, competência, semana e data de referência.
- [x] Executar a prévia oficial do importador e validar linhas, totais, regiões, dealers e eventuais avisos.
- [x] Atualizar Google Ads até o último dia fechado disponível, preservando histórico completo e restringindo apenas as áreas operacionais a campanhas `ENABLED`.
- [x] Atualizar TikTok Ads até o último dia fechado disponível, sem aceitar resposta parcial ou inventar métricas.
- [x] Importar o PDF de MTD Retail Order somente após reconciliação e confirmar idempotência.
- [x] Reconciliar Leads, MTD Retail Order, Google Ads, TikTok Ads, investimento/CPL e última atualização do dashboard.
- [x] Executar testes, TypeScript, build e validação da interface; registrar os resultados e salvar checkpoint restaurável.
- [x] Entregar relatório consolidado com contagens, fontes, cobertura D-1 e eventuais limitações reais.

- [x] Recuperar a atualização D-1 de Meta Ads após o timeout da consulta integrada, sem substituir o snapshot válido anterior.


## Atualização D-1 e diagnóstico do Google Ads — 25/08/2026

> Diagnóstico confirmado: ao solicitar 01–24/08, a Windsor retornou dados somente até 23/08. O contrato rejeitou corretamente a série parcial; como não havia snapshot persistente exato da janela 01–24/08, o fallback antigo retornava zero linhas e a aba ficava vazia. A correção recupera o snapshot persistente mais recente com sobreposição, serve os dados reais até 23/08 e mantém explícita a cobertura parcial; o refresh continua `FAILED` até a fonte entregar 24/08, evitando declarar uma atualização inexistente.

- [x] Registrar o incidente de Google Ads sem dados e identificar o último snapshot válido.
- [x] Revisar configuração da fonte Windsor, logs, cache, intervalo D-1 e contratos de importação do Google Ads.
- [x] Executar refresh D-1 de Google Ads, Meta Ads e TikTok Ads e separar falha da fonte de falha de montagem da interface.
- [x] Corrigir a causa identificada ou preservar explicitamente o snapshot anterior sem substituir dados válidos por resposta parcial.
- [x] Validar Leads, MTD Retail Order, anúncios, dashboard, TypeScript, testes e build.
- [x] Registrar o diagnóstico e salvar checkpoint restaurável antes da entrega.
- [x] Quando o Google ao vivo retornar somente até o último dia fechado, servir o snapshot persistente mais recente ao período solicitado, preservando a indicação de cobertura parcial e mantendo o refresh como falho até D-1 completo.


## Correção do logo MG — 25/08/2026

- [x] Armazenar a imagem MG enviada como asset persistente do dashboard.
- [x] Substituir a referência quebrada do logo no cabeçalho e manter alt text acessível.
- [x] Validar a renderização do logo no dashboard, executar testes e build e salvar checkpoint.


## Fundo transparente do logo MG — 25/08/2026

- [x] Gerar uma cópia transparente do logo MG enviado, preservando o desenho vermelho e removendo somente o fundo branco.
- [x] Armazenar o novo asset transparente e substituir a referência no dashboard.
- [x] Validar visualmente login e cabeçalho, executar testes e build e salvar checkpoint.


## Atualização integral da base até D-1 — 25/08/2026

- [x] Executar sincronização oficial de Leads via Google Sheets, com deduplicação e relatório de alterações.
- [x] Atualizar Google Ads, Meta Ads e TikTok Ads até o último dia fechado disponível, preservando snapshots válidos quando houver defasagem. Google ficou com snapshot real até 23/08 porque a Windsor não disponibilizou 24/08; Meta e TikTok concluíram 24/08.
- [x] Conferir o último MTD Retail Order disponível e importar somente arquivo novo ou idempotente. Lote 480001 de 24/08 já estava importado e permaneceu idempotente.
- [x] Reconciliar totais, datas de cobertura, dealers, estados, investimento, CPL e ROAS disponível por canal. ROAS financeiro não foi calculado porque as fontes desta rotina não fornecem receita atribuída; nenhum valor foi inferido.
- [x] Validar dashboard, testes, TypeScript e build; registrar o resultado e salvar checkpoint restaurável. Validação final: 309 testes, TypeScript e build aprovados.


## Favicon com logo MG — 25/08/2026

- [x] Localizar a configuração atual de favicon e confirmar o asset transparente persistente.
- [x] Aplicar o logo MG transparente como favicon do dashboard com referência acessível.
- [x] Validar carregamento no navegador, executar testes e build e salvar checkpoint. HTML e asset responderam corretamente, captura visual concluída, 309 testes, TypeScript e build aprovados.


## Atualização da base de vendas — Daily Sales Planning Report 25/08/2026

- [x] Inspecionar o PDF recebido e confirmar competência, semana de referência e tabela Retail. Relatório 25/08, Semana 5, MTD Retail Order 549.
- [x] Executar a prévia oficial, validando linhas, totais, dealers conciliados e avisos. Prévia sem erros e reconciliação aprovada; o alias de IGUATU FORTALEZA foi corrigido antes do reprocessamento.
- [x] Importar o lote de MTD Retail Order e confirmar idempotência em uma segunda execução. Lote 510001, 29 linhas, reprocessado com zero unmatched após a correção de alias.
- [x] Reconciliar o total de vendas por dealer/estado e validar o dashboard, testes e build. 549 vendas, 26 dealers matched, 2 regiões e total por dealer/estado reconciliado.
- [x] Registrar o resultado e salvar checkpoint restaurável.
- [x] Corrigir o alias de origem `IGUATU FORTALEZA` para o dealer oficial `IGUAUTO FORTALEZA`, reprocessar o lote com segurança e confirmar zero unmatched. Canonical final do dashboard: `IGUALTO - MG FORTALEZA`; lote 510001 com 26/26 dealers matched.


## Atualização de Leads e novo canal TikTok Live — 25/08/2026

- [x] Confirmar como `TikTok Live` aparece na fonte de Leads e distinguir o canal da mídia TikTok Ads paga. A fonte real possui a aba `Tiktok - Live` com 31 linhas; `Tikok` permanece TikTok Ads com 198 linhas.
- [x] Atualizar tipos, normalização e contagens de canais para aceitar `TikTok Live` sem quebrar canais existentes.
- [x] Executar a sincronização oficial de Leads com deduplicação e registrar novos, existentes, inválidos e duplicados. Resultado: 31 novos, 22.921 existentes na primeira execução; segunda execução idempotente com zero novos.
- [x] Garantir que TikTok Live entre nos totais, séries diárias, distribuição, filtros e tabelas sem duplicação. Reconciliação de 01–24/08: 11.310 Leads, TikTok Live 31, TikTok Ads 198 e totais por canal/modelo/região/dealer iguais.
- [x] Validar dashboard, testes, TypeScript e build e salvar checkpoint restaurável. 52 arquivos e 311 testes aprovados; TypeScript e build aprovados.


## Meta sem investimento e CPL; novo orçamento de Leads em agosto — 25/08/2026

- [x] Localizar todos os campos de investimento e CPL exibidos ou calculados na aba Meta.
- [x] Retirar da aba Meta investimento, custo e CPL, mantendo somente volume e métricas de entrega não financeiras. A aba principal e o inventário de criativos mostram somente volume/entrega.
- [x] Atualizar a configuração de agosto para investimento total de BRL 187.200,00, distribuído uniformemente em 31 dias. Diária: BRL 6.038,71; 01–24/08: BRL 144.929,03.
- [x] Recalcular o investimento acumulado e o CPL da aba Leads sempre até o último dia fechado D-1, sem alterar o volume real de Leads. Meta usa o orçamento planejado acumulado por dias do período; volumes permanecem reais.
- [x] Validar reconciliação, testes, TypeScript, build, interface e salvar checkpoint restaurável. 314 testes, TypeScript, build, captura visual e auditoria de rótulos financeiros aprovados.


## Novo refresh integral da base até D-1 — 26/08/2026

- [x] Executar a automação oficial de Leads com deduplicação e relatório de alterações. Execução 20260826-090040: 23.914 linhas-fonte, 23.912 válidas, 255 novos registros, 705 duplicidades internas, 22.952 já existentes e 2 inválidos; base passou para 23.207 Leads.
- [x] Atualizar Google Ads, Meta Ads e TikTok Ads até o último dia fechado disponível, preservando snapshots válidos e a regra histórica/operacional do Google. Meta e TikTok concluíram até 25/08; Google preservou snapshot real até 23/08 porque a fonte não entregou cobertura completa de 25/08.
- [x] Conferir o último MTD Retail Order disponível e importar somente lote novo ou idempotente. Lote 510001 de 25/08 permaneceu ativo e idempotente.
- [x] Reconciliar totais, canais, TikTok Live, datas de cobertura, dealers, estados, investimento/CPL planejado e alertas de fonte. Período 01–25/08: 11.565 Leads; Meta 6.807, Site 2.681, Webmotors 1.466, Mercado Livre 382, TikTok 198 e TikTok Live 31. MTD Retail Order: 549 vendas, 26 dealers matched e zero unmatched.
- [x] Validar dashboard, testes, TypeScript e build; salvar checkpoint restaurável e entregar o resumo. 314 testes, TypeScript e build aprovados.


## Refresh da base com dados mais recentes — 26/08/2026

- [x] Executar a sincronização oficial de Leads, mantendo deduplicação e TikTok Live separado. Execução 20260826-102212: 16 novos, 23.207 existentes, 705 duplicidades internas, 2 inválidos; base final 23.223 Leads.
- [x] Atualizar Google Ads, Meta Ads e TikTok Ads e registrar a data efetiva de cada fonte. Meta e TikTok concluíram 25/08; Google preservou snapshot até 23/08 por falta de cobertura Windsor para 25/08.
- [x] Conferir o último MTD Retail Order disponível, importando apenas lote novo ou idempotente. Lote 510001 de 25/08 confirmado sem nova gravação e idempotente.
- [x] Reconciliar totais por período, canal, dealer e estado, sem estimar dados ausentes. 01–25/08: 11.565 Leads e 549 MTD Retail Orders; soma por canal/modelo/região e vendas por dealer/estado conciliadas, zero unmatched.
- [x] Validar testes, TypeScript, build e salvar checkpoint restaurável. 314 testes, TypeScript e build aprovados.


## Atualização de Resultados de mídia, Leads e vendas — Agosto de 2026

- [x] Localizar a planilha-base/estrutura de julho e validar quais dados reais de agosto estão disponíveis. Base: July digital plan reference plus the supplied August harmonized workbook.
- [x] Separar a seção financeira em Digital Line-up, Digital Urban, Off — Magazine e Consolidated Summary.
- [x] Atualizar títulos, período, valores, fórmulas, status e referências de agosto sem inventar dados. August workbook values preserved; Actual Investment remains blank because no payment/proof data was supplied.
- [x] Reconciliar subtotais, comissão, net, actual investment e total consolidado entre os quatro blocos. Gross: Line-up BRL 751,000; Urban BRL 200,000; Magazine BRL 50,000; Media Save BRL 99,000; consolidated gross BRL 1,100,000; commission BRL 40,040; net BRL 1,059,960.
- [x] Validar visualmente a planilha e entregar a versão atualizada em Excel, preservando a estrutura original. PDF render validated without cuts in the four financial blocks; formulas, widths and notes verified.


## Separação da apresentação e limpeza do dashboard — 26/08/2026

- [x] Manter a estrutura financeira de agosto exclusivamente na apresentação independente. Presentation created with the approved visual standard.
- [x] Após a validação final do deck, remover do projeto do dashboard os scripts, exports e documentos financeiros criados somente para essa entrega. Temporary scripts and artifacts removed.
- [x] Confirmar que a remoção não afeta o runtime, os dados operacionais, as permissões ou as integrações do dashboard. Dashboard operational state preserved.
- [x] Aplicar em todos os slides o padrão visual aprovado: fundo branco, cabeçalhos navy, acentos vermelho MG, tabelas financeiras limpas e consistência com o PDF de julho e o Executive Summary. Presentation `qC9VVlEaOpbd5AcqFdA52e` ready.

## Correção fiel do layout do Executive Summary — 26/08/2026

- [x] Comparar cada slide de agosto com a página correspondente do PPTX original de julho em alta resolução.
- [x] Replicar grid, proporções, tipografia, cores, cabeçalhos, rodapés e densidade visual sem reinterpretar o template.
- [x] Preservar somente os dados atualizados de agosto, mantendo títulos e estrutura visual compatíveis com julho.
- [x] Validar visualmente todas as páginas lado a lado com a referência e corrigir qualquer desalinhamento ou overflow. Seis páginas renderizadas em 1280 × 720 sem cortes ou sobreposições.
- [x] Apresentar o deck completo corrigido com todos os slides da estrutura original.

## Ampliação do Summary final com Financial Check — 26/08/2026

- [x] Manter os seis slides de resultados mensais no layout fiel ao PPTX de julho.
- [x] Adicionar um slide consolidado de Financial Check com gross, comissão, net e status de actual investment.
- [x] Adicionar um slide financeiro separado para Digital Line-up.
- [x] Adicionar um slide financeiro separado para Digital Urban.
- [x] Adicionar um slide financeiro separado para Off — Magazine.
- [x] Reforçar a apresentação com dados de mídia, Leads, MTD Retail Order, rede e metodologia sem sobrecarregar o layout.
- [x] Validar a soma financeira dos quatro blocos e a consistência visual de todo o deck final. Dez páginas renderizadas em 1280 × 720; gross R$ 1.100.000, comissão R$ 40.040 e net R$ 1.059.960 reconciliados.

## Réplica integral do relatório de julho para agosto — 26/08/2026

- [x] Mapear visualmente e textualmente as 15 páginas do PDF `Resultados_de_mídia,_Leads_e_vendas_—_Julho_de_2026.pdf`.
- [x] Reproduzir a mesma ordem editorial, grids, fontes, cores, tabelas, gráficos, barras e rodapés, com duas páginas financeiras adicionais solicitadas para Digital Urban e Off — Magazine.
- [x] Substituir somente os dados de julho pelos resultados completos e auditados de agosto, fechados até 25/08/2026.
- [x] Incorporar o Financial Check no mesmo sistema visual, sem descaracterizar a estrutura do relatório mensal.
- [x] Comparar página por página com o PDF definitivo e corrigir a composição do encerramento para o campo navy integral da referência.
- [x] Validar as 17 páginas em 1280 × 720, sem cortes, sobreposições ou conteúdo fora do canvas, antes da apresentação final.

## Atualização da base do dashboard — 26/08/2026

- [x] Executar a sincronização oficial de Leads com deduplicação, mantendo TikTok Live separado. Execução 20260827-091634: 376 novos Leads, 713 duplicidades internas, 6 inválidos e base atualizada para 23.599 registros.
- [x] Atualizar Google Ads, Meta Ads e TikTok Ads para o último dia fechado disponível e registrar a cobertura real. As três fontes retornaram dados Windsor-live até 26/08/2026.
- [x] Conferir o último MTD Retail Order disponível e importar somente lote novo ou idempotente. O PDF de 26/08 foi importado no lote 540001 e a reexecução confirmou idempotência.
- [x] Reconciliar Leads, MTD Retail Order, canais, dealers, estados, CPL planejado e alertas de cobertura. 01–26/08: 11.957 Leads, 560 MTD Retail Orders, 26 dealers conciliados e zero unmatched.
- [x] Validar testes, TypeScript e build, salvar checkpoint restaurável e entregar o resumo. Validação: 314 testes, TypeScript e build aprovados.

## MTD Retail Order — Daily Sales Planning Report 26/08/2026

- [x] Inspecionar o PDF recebido e confirmar competência, semana, totais e dealers da tabela Retail. Competência 2026-08, semana 5 e 560 MTD Retail Orders.
- [x] Executar a prévia oficial antes da escrita e validar eventuais dealers unmatched. Reconciliação aprovada, 26/26 dealers matched e zero avisos.
- [x] Importar ou reprocessar o lote somente com reconciliação aprovada e confirmar idempotência. Lote 540001, 29 linhas inseridas; segunda execução NO_CHANGES.
- [x] Reconciliar o MTD Retail Order com Leads e vendas por dealer/estado no dashboard atualizado. Totais por dealer e estado conciliados com 560 MTD Retail Orders.

## Correção da seção financeira do deck — 27/08/2026

- [x] Usar exclusivamente os três prints financeiros confirmados como fonte dos valores e status do deck.
- [x] Remover toda referência a Media Save/Saving da apresentação de agosto.
- [x] Corrigir Google Ads para status PAID no bloco Digital Line-up e no bloco Digital Urban.
- [x] Atualizar o consolidado para Digital Total + Off: BRL 1.067.804,20 gross, BRL 41.741,67 commission e BRL 1.001.800,03 net.
- [x] Otimizar `cover.html` em uma única edição completa, preservando o template do relatório de julho.
- [x] Renderizar e validar o deck completo antes da apresentação final. As 17 páginas foram renderizadas em 1280 × 720 e o Financial Check foi corrigido sem overflow na coluna Status.

## Atualização integral do deck pelo último dashboard — 27/08/2026

- [x] Exportar um snapshot auditável do dashboard atualizado, incluindo Leads, MTD Retail Order, mídia, canais, modelos, dealers e cobertura por fonte.
- [x] Comparar cada métrica do deck com o snapshot e mapear as páginas que precisam de atualização.
- [x] Atualizar todos os slides afetados mantendo o template do relatório de julho e os valores financeiros aprovados pelo usuário.
- [x] Otimizar `sales.html` em uma única edição HTML completa, sem múltiplas edições no arquivo.
- [x] Renderizar as páginas atualizadas, validar totais/layout e apresentar o deck completo.

## Consolidação financeira Line-up + Urban — 27/08/2026

- [x] Consolidar Digital Line-up e Digital Urban em um único slide financeiro no padrão visual do print de referência, preservando todos os valores e status aprovados.
- [x] Remover a página financeira individual de Digital Urban e reorganizar a sequência do deck; o Financial Check permanece com os valores e a nomenclatura dos prints aprovados, sem alteração de base.
- [x] Renderizar e validar o deck reorganizado, incluindo a apresentação integral das páginas restantes.

## Recalibração de Digital Total Gross — 27/08/2026

- [x] Atualizar o slide consolidado Digital Line-up + Urban para Digital Total Gross de BRL 1.050.000,00, alocando integralmente a diferença em Publya Display.
- [x] Recalcular no próprio slide a comissão de 4% e o net, mantendo todos os demais canais e valores inalterados.
- [x] Renderizar, validar a coerência financeira e reapresentar o deck completo.

## Resumo de remuneração BBRO — 27/08/2026

- [x] Incluir no slide financeiro consolidado os campos Mídia Total, Comissão Total, Recebíveis em Aberto, Agency Fee e Total Payment BBRO.
- [x] Deixar explícito que Total Payment BBRO corresponde ao Agency Fee mensal somado à Comissão Total.
- [x] Validar o novo resumo financeiro, atualizar a apresentação completa e entregar a versão final.

## Coerência financeira do Executive Summary — 27/08/2026

- [x] Atualizar o Executive Summary para eliminar valores financeiros anteriores e refletir a recalibração do escopo Digital.
- [x] Manter a separação entre a remuneração BBRO, os recebíveis em aberto e os indicadores operacionais de Leads e MTD Retail Order.
- [x] Validar visualmente, reapresentar o deck completo e entregar a versão coerente.

## Correção do Agency Fee — 27/08/2026

- [x] Alterar o Agency Fee mensal de BRL 64.552,00 para BRL 64.551,95 nos slides financeiros e alinhar o Executive Summary ao pagamento BBRO arredondado.
- [x] Atualizar o Total Payment BBRO para BRL 106.551,95, mantendo a comissão digital de BRL 42.000,00.
- [x] Validar e reapresentar o deck completo com os valores corrigidos.

## Solicitação de adiantamento Google Ads — 27/08/2026

- [x] Inserir um slide executivo solicitando adiantamento de R$ 295.000 para Google Ads antes da virada de mês.
- [x] Explicitar que o objetivo é preservar a continuidade das campanhas sem caracterizar o valor como investimento realizado.
- [x] Validar a nova página, reapresentar o deck completo e entregar a versão final.

## Remoção de Off — Magazine — 27/08/2026

- [x] Remover o slide Off — Magazine e qualquer referência a Off dos resumos financeiros do deck.
- [x] Atualizar o Financial Check e o Executive Summary para apresentarem exclusivamente Digital Total Gross, comissão e net.
- [x] Validar a sequência revisada, concluir o pedido de adiantamento Google Ads e reapresentar o deck completo.

## Atualização de Leads e MTD Retail Order — 27/08/2026

- [x] Revisar os procedimentos oficiais de sincronização da base de Leads e de prévia/importação de MTD Retail Order.
- [x] Executar a sincronização oficial da base de Leads, registrar novos registros, duplicidades, inválidos e idempotência.
- [x] Validar e importar o PDF `260827DailySalesPlanningReport.pdf`, conferindo competência, semana, total, dealers e conciliação.
- [x] Reconciliar o dashboard, executar testes e entregar o relatório final da atualização.

## Remuneração BBRO por canal — 28/08/2026

- [x] Reorganizar o resumo do slide Digital Line-up por canal e remover todas as menções a Total Outstanding Receivables de BRL 25.512,17; o agrupamento final solicitado foi por publisher.
- [x] Exibir a remuneração BBRO como Agency Fee mensal mais comissão digital, deduzindo explicitamente a comissão Google Ads já paga.
- [x] Validar o novo total pendente de BBRO, renderizar o slide e reapresentar o deck completo.

- [x] Corrigir o agrupamento solicitado: apresentar o resumo financeiro por publisher, e não por channel.

## Réplica dos slides financeiros do mês anterior — 28/08/2026

- [x] Recriar o slide Digital Line-up com a mesma estrutura visual do mês anterior, mantendo o detalhamento por publisher e os valores atuais de agosto.
- [x] Recriar o Payment Summary com a mesma equação visual, excluindo Google já pago e sem reintroduzir o saldo removido de BRL 25.512,17.
- [x] Renderizar as duas páginas, validar layout e cálculos e reapresentar o deck completo.

## Ajuste da carga inicial Google — 28/08/2026

- [x] Registrar a carga inicial de R$ 30.000 e a comissão histórica de 4% (R$ 1.200) não cobrada no mês anterior.
- [x] Reduzir o valor líquido disponível para nova carga Google de R$ 412.800 para R$ 411.600, mantendo a comissão regular de agosto separada.
- [x] Atualizar a remuneração BBRO para incluir o ajuste histórico, validar os dois slides e reapresentar o deck completo.

## Pagamento líquido aos veículos — 28/08/2026

- [x] Recolocar no Payment Summary o valor líquido devido aos publishers não pagos, seguindo a estrutura visual do mês anterior.
- [x] Separar BRL 595.200,00 para veículos e BRL 90.551,95 de remuneração BBRO, evitando dupla contagem das comissões.
- [x] Atualizar o total geral a pagar para BRL 685.751,95, renderizar e reapresentar o deck completo.

## Adiantamento Google para setembro — 28/08/2026

- [x] Alterar o valor solicitado para Google em setembro de R$ 295.000 para R$ 279.853.
- [x] Atualizar todas as referências do slide de continuidade sem modificar os valores financeiros de agosto.
- [x] Renderizar, validar e reapresentar o deck completo.

## Summary de mídia sem comprovantes financeiros — 28/08/2026

- [x] Criar uma versão independente e concisa da apresentação contendo somente resultados de mídia, Leads e MTD Retail Order.
- [x] Excluir slides de pagamento, comprovantes, remuneração BBRO, valores a veículos e solicitações de adiantamento.
- [x] Reconciliar o recorte mais recente disponível, renderizar, validar e apresentar o summary completo.

## Summary exclusivo de comprovantes financeiros — 28/08/2026

- [x] Criar uma apresentação independente contendo somente controles, pagamentos e comprovantes financeiros aprovados.
- [x] Incluir Digital Total, detalhamento por publisher, pagamentos líquidos aos veículos, remuneração BBRO, ajuste histórico Google e carga de setembro.
- [x] Excluir Leads, MTD Retail Order e métricas de performance de mídia; renderizar, validar e apresentar o summary financeiro.

## Integração da aba Interlagos — 29/08/2026

- [x] Inspecionar a estrutura e os registros da nova aba Interlagos na planilha oficial de Leads.
- [x] Implementar o mapeamento da aba na rotina oficial, preservando concessionária de origem e regras de modelo, telefone e deduplicação.
- [x] Executar a atualização, reconciliar o novo canal Interlagos, validar idempotência e testar o dashboard.

## Digital Summary completo até 28/08/2026 — 29/08/2026

- [x] Atualizar e reconciliar Google Ads, Meta Ads, TikTok Ads, Leads e MTD Retail Order no recorte até 28/08/2026.
- [x] Criar uma versão client-ready mais completa, com investimento, entrega, cliques, conversões, eficiência, campanhas, canais, modelos, dealers e resultado comercial.
- [x] Excluir comprovantes, pagamentos, remuneração BBRO e demais controles financeiros; renderizar, validar e apresentar o deck completo.

## Memória dos padrões de apresentação — 29/08/2026

- [x] Registrar Digital Summary como o padrão client-ready de resultados sem comprovantes ou controles financeiros.
- [x] Registrar Digital Check como o padrão financeiro separado, baseado somente em valores e comprovantes aprovados.
- [x] Documentar regras de conteúdo, cálculo, nomenclatura, cobertura e sistema visual para reutilização nas próximas apresentações.

## Atualização manual de Leads — 29/08/2026

- [x] Executar a sincronização oficial da base de Leads e registrar novos registros, duplicidades e linhas inválidas.
- [x] Reexecutar a rotina para confirmar idempotência e reconciliar os totais do dashboard.
- [x] Validar o resultado e comunicar a atualização concluída.

## Atualização de MTD Retail Order — 28/08/2026

- [x] Validar o PDF `260828DailySalesPlanningReport.pdf`, incluindo competência, lote, semana, totais e dealers.
- [x] Importar o relatório no dashboard e confirmar reconciliação de concessionárias.
- [x] Reexecutar a importação para idempotência, validar o resultado e comunicar a atualização.

## Atualização manual de Leads — 30/08/2026

- [x] Executar a sincronização oficial da base de Leads e registrar novos registros, duplicidades e linhas inválidas.
- [x] Reexecutar a rotina para confirmar idempotência e reconciliar os totais do dashboard.
- [x] Validar o resultado e comunicar a atualização concluída.

## Atualização manual de Leads — 31/08/2026

- [x] Executar a sincronização oficial da base de Leads e registrar novos registros, duplicidades e linhas inválidas.
- [x] Reexecutar a rotina para confirmar idempotência e reconciliar os totais do dashboard.
- [x] Validar o resultado e comunicar a atualização concluída.

## Atualização de MTD Retail Order — 31/08/2026

- [x] Validar o PDF `260831DailySalesPlanningReport.pdf`, incluindo competência, lote, semana, totais e dealers.
- [x] Importar o relatório no dashboard e confirmar reconciliação de concessionárias.
- [x] Confirmar idempotência, validar o resultado e comunicar a atualização.

- [x] Executar uma importação alternativa auditável com a tabela W5 validada visualmente, preservando as semanas 1–4 da última importação conciliada.

## Atualização manual da base de Leads — 01/09/2026

- [x] Executar a sincronização oficial da base de Leads e registrar novos registros, duplicidades e linhas inválidas.
- [x] Reexecutar a rotina para confirmar idempotência e reconciliar os totais do dashboard.
- [x] Validar o resultado e comunicar a atualização concluída.

## Recuperação e atualização completa do dashboard — 01/09/2026

- [x] Restaurar dependências e arquivos de projeto ausentes após a reinicialização do ambiente.
- [x] Executar a rotina oficial de atualização da base de Leads e validar a substituição transacional.
- [x] Confirmar idempotência, reconciliação e estabilidade do dashboard antes de comunicar o resultado.

## Off Media Check — 01/09/2026

- [x] Criar uma apresentação financeira independente para Off, mantendo o padrão visual aprovado do Digital Check.
- [x] Incluir exclusivamente Globo Magazine, Gross BRL 24.262,50, comissão de 4%, net e fee mensal Off de BRL 91.500,00.
- [x] Separar pagamento líquido ao veículo de remuneração BBRO, validar a equação e apresentar o Off Media Check completo.

## Atualização imediata do dashboard — 01/09/2026

- [x] Verificar o estado atual dos serviços, dependências e módulos de importação após a reinicialização do ambiente.
- [x] Restaurar o fluxo necessário e executar a atualização oficial das bases disponíveis.
- [x] Confirmar reconciliação, idempotência e estabilidade antes de comunicar o resultado.

## Digital Summary — fechamento de agosto de 2026

- [x] Auditar o deck client-ready aprovado e preservar exatamente seu padrão visual e sua separação de conteúdo financeiro.
- [x] Coletar e reconciliar os dados finais de Google Ads, Meta Ads, TikTok Ads, Leads e MTD Retail Order até 31/08/2026.
- [x] Atualizar todos os slides afetados com os números de fechamento mensal, campanhas, canais, modelos, dealers e estados.
- [x] Validar consistência numérica, legibilidade e ausência de comprovantes, pagamentos ou remuneração BBRO.
- [x] Apresentar a versão final do Digital Summary de agosto ao usuário.

## Reprocessamento de MTD Retail Order após o fechamento do summary

- [x] Validar o PDF `260831DailySalesPlanningReport.pdf` anexado como fonte final de agosto.
- [x] Usar os 660 MTD Retail Orders reconciliados no fechamento da apresentação.
- [x] Reprocessar o PDF no dashboard somente após concluir e apresentar o arquivo.
- [x] Confirmar 26/26 dealers conciliados, zero unmatched e nenhuma duplicação na reexecução.

## Prestação de contas de marketplaces no summary — 01/09/2026

- [x] Reconciliar as entregas mensais de Webmotors e Mercado Livre por volume, participação e modelo.
- [x] Adicionar ao deck uma página específica comprovando as entregas dos dois canais.
- [x] Validar os totais contra os 14.237 Leads de agosto e excluir conteúdo financeiro.
- [x] Apresentar a versão revisada do Media, Leads & Sales Performance.

## Investigação do valor de 26 mil no Digital Check — 01/09/2026

- [x] Localizar todas as referências ao valor de 26 mil no Digital Check e identificar o slide afetado.
- [x] Reconciliar o valor com os dados financeiros aprovados e documentar sua origem.
- [x] Corrigir a apresentação se o valor estiver incorreto ou ambíguo.
- [x] Validar e apresentar a conclusão ao usuário.

## Remoção integral do ajuste Google de R$ 1.200 — 01/09/2026

- [x] Mapear e remover todas as referências ao ajuste de R$ 1.200 no Digital Check.
- [x] Recalcular remuneração BBRO, total a pagar e saldo Google sem o ajuste histórico.
- [x] Confirmar que não havia slide específico do ajuste e que nenhuma renumeração era necessária.
- [x] Deixar explícito que a comissão Google de R$ 17.200 já foi paga.
- [x] Validar e apresentar a versão final corrigida.

## Atualização do valor Google do próximo mês — 01/09/2026

- [x] Localizar todas as referências a R$ 279.853 no Digital Check.
- [x] Substituir o valor solicitado por R$ 279.583,00 sem alterar a reconciliação de agosto.
- [x] Validar a ausência do valor anterior e apresentar a versão final.

## Atualização imediata da base TikTok Live — 01/09/2026

- [x] Verificar a fonte TikTok Live e o estado do fluxo oficial de Leads.
- [x] Executar a sincronização oficial sem combinar TikTok Live com TikTok Ads.
- [x] Reconciliar novos registros, duplicidades, inválidos e os totais por canal.
- [x] Reexecutar a mesma sincronização para confirmar idempotência.
- [x] Registrar e comunicar o resultado auditado da atualização.

## Summary com todas as origens e check-ins de veículos — 01/09/2026

- [x] Reconciliar todas as origens de Leads de agosto após a atualização TikTok Live.
- [x] Atualizar os slides de Leads com todos os canais e totais finais.
- [x] Criar uma seção de check-ins/evidências para Google, Meta e Webmotors.
- [x] Exibir no Google a informação auditável de cerca de 700 anúncios.
- [x] Inserir os prints enviados sem distorção e com identificação da fonte.
- [x] Substituir 660 por 646 vendas e recalcular atingimento, diferença versus target e conversão.
- [x] Validar a apresentação completa e excluir conteúdo financeiro.
- [x] Apresentar a versão final revisada ao usuário.

## Relatório pocket de mídia — 17 a 28/08/2026

- [x] Consultar Google Ads, Meta Ads e TikTok Ads no período exato de 17 a 28/08/2026.
- [x] Reconciliar investimento, impressões, cliques, resultados e indicadores de eficiência.
- [x] Criar uma apresentação pocket em português, sem projeções ou dados mensais reaproveitados.
- [x] Validar o recorte temporal, os cálculos e a legibilidade de todos os slides.
- [x] Apresentar a versão final ao usuário.

## Digital Summary integralmente em inglês e novos investimentos — 01/09/2026

- [x] Auditar todos os 17 slides e mapear textos em português e métricas dependentes.
- [x] Atualizar Meta para R$ 187.200, TikTok para R$ 28.000, Mercado Livre para R$ 76.800 e Webmotors para R$ 178.413.
- [x] Recalcular CPL e demais indicadores derivados com os volumes reais de Leads.
- [x] Converter 100% do conteúdo visível para inglês, preservando design, estrutura e identidade MG.
- [x] Editar cada slide afetado uma única vez e otimizar `cover.html` em uma única operação.
- [x] Validar cálculos, idioma, legibilidade e consistência da apresentação completa.
- [x] Apresentar a versão final com todos os slides do outline original.

## Digital Summary com plano NET de R$ 1.008.000 — 01/09/2026

- [x] Mapear todos os slides que usam investimento, CPA, CPL, CPC, CPM ou participação.
- [x] Aplicar exatamente os valores NET do print: Google, Meta, TikTok, Display, YouTube, Webmotors e Mercado Livre.
- [x] Recalcular todas as métricas dependentes e o total líquido de R$ 1.008.000,00.
- [x] Remover qualquer referência aos valores aprovados anteriores ou ao realizado Windsor quando usado como investimento.
- [x] Validar idioma, números, layout e reconciliação do deck completo.
- [x] Apresentar a versão final atualizada ao usuário.

## Recriação do PPTX no padrão Digital Check — 01/09/2026

- [x] Tarefa pausada por solicitação explícita do usuário antes da execução; a análise integral do PPTX não foi concluída.
- [x] Referência visual do Digital Check identificada, sem prosseguir para a adaptação enquanto a tarefa estiver pausada.
- [x] Mapeamento página a página adiado até novo pedido explícito do usuário.
- [x] Recriação dos slides não executada, conforme pausa solicitada.
- [x] Validação visual e numérica não aplicável enquanto o trabalho permanecer pausado.
- [x] Entrega final não aplicável; retomar somente após nova autorização do usuário.

## Recriação ativa do novo PPTX no padrão Digital Check — 01/09/2026

- [x] Analisar integralmente `pasted_file_LXwB84_Prestaçãodecontas-MG.pptx`, incluindo conteúdo, design, notas e ativos.
- [x] Comparar cada página com o padrão visual oficial do Digital Check.
- [x] Mapear e preservar todos os valores, comprovantes, legendas e informações do arquivo original.
- [x] Recriar todas as páginas com a identidade visual, hierarquia e composição do Digital Check.
- [x] Validar reconciliação numérica, legibilidade e consistência visual do deck completo.
- [x] Apresentar a versão final ao usuário.

## Ajustes finais da prestação de contas — 01/09/2026

- [x] Restaurar o projeto de slides e localizar as páginas Google e BBRO afetadas.
- [x] Remover todas as menções à diferença documental de R$ 0,05.
- [x] Retirar a explicação de que a recarga Google ocorreu em dois pagamentos.
- [x] Não adicionar justificativa técnica e preservar todos os valores e comprovantes originais.
- [x] Validar e apresentar a versão final ajustada.

## Prestação de contas integralmente em inglês — 02/09/2026

- [x] Auditar os dez slides e mapear todo o texto editorial em português.
- [x] Traduzir títulos, tabelas, indicadores, notas, legendas e rodapés para inglês.
- [x] Preservar todos os valores, datas, notas fiscais e comprovantes originais.
- [x] Validar ausência de texto editorial em português e consistência visual.
- [x] Apresentar a versão final em inglês ao usuário.

## Atualização da planilha MG para agosto — 02/09/2026

- [x] Auditar todas as abas, fórmulas, células mescladas e elementos visuais do arquivo `MG-JULHO-AGENCIA.xlsx`.
- [x] Identificar os campos de período, total de Leads, investimento e métricas dependentes.
- [x] Atualizar o período para agosto, Leads para 883 e investimento total para R$ 106.000,00.
- [x] Recalcular CPL e demais indicadores afetados, preservando fórmulas e formatação.
- [x] Validar o arquivo final, ausência de erros e consistência entre abas.
- [x] Entregar a planilha atualizada ao usuário.

## Atualização do arquivo correto de projeção — agosto de 2026

- [x] Auditar todas as abas, fórmulas, distribuição por mercado e canal e formatação do arquivo correto.
- [x] Identificar como o total de Leads e investimento alimentam projeções, percentuais e CPLs.
- [x] Atualizar o período para agosto, total de Leads para 883 e investimento para R$ 106.000,00.
- [x] Recalcular e reconciliar todas as métricas e distribuições dependentes.
- [x] Validar o arquivo final visual e programaticamente, sem alterar a estrutura aprovada.
- [x] Entregar a versão correta atualizada ao usuário.

## Migração do dashboard para hospedagem externa BBRO — 02/09/2026

- [x] Inventariar aplicação, banco, armazenamento, autenticação, integrações, domínios e rotinas agendadas atuais.
- [x] Identificar dependências específicas da infraestrutura Manus e equivalentes necessários no ambiente BBRO.
- [ ] Confirmar requisitos da hospedagem BBRO: sistema operacional, Docker, banco, armazenamento, domínio, SSL e execução contínua.
- [x] Definir opções de arquitetura externa, estratégia de migração paralela, backups e rollback.
- [ ] Preparar configuração portátil, variáveis de ambiente, scripts de build, execução, migração e atualização diária.
- [ ] Validar em ambiente paralelo login, dashboard, Google/Meta/TikTok, Leads, vendas e tarefas agendadas.
- [x] Documentar operação, monitoramento, alertas, recuperação e responsabilidades da BBRO.
- [ ] Executar a troca de DNS somente após validação e autorização explícita do usuário.

## Atualização do dashboard até 01/09/2026 — 02/09/2026

- [x] Verificar o estado atual das rotinas oficiais de Leads, Google Ads, Meta Ads, TikTok Ads e vendas.
- [x] Executar a prévia e a sincronização oficial de Leads com cobertura até 01/09/2026.
- [x] Atualizar Google Ads e TikTok Ads com dados fechados D-1 e auditar a indisponibilidade da Meta em 01/09.
- [x] Verificar se existe Daily Sales Planning Report posterior ao último lote válido antes de alterar MTD Retail Order.
- [x] Reconciliar totais, duplicidades, inválidos, cobertura por fonte e eventuais falhas parciais.
- [x] Reexecutar as rotinas aplicáveis para confirmar idempotência.
- [x] Registrar o resultado auditável e comunicar a atualização ao usuário.
- [x] Extrair e validar o `260901DailySalesPlanningReport.pdf`, incluindo total MTD Retail Order, target, semana e cobertura dos dealers.
- [x] Importar o PDF de 01/09 pelo fluxo oficial somente após a reconciliação completa.
- [x] Reprocessar o mesmo PDF para confirmar idempotência e ausência de novo lote ou linhas duplicadas.
- [x] Conciliar `BALTIC BARUERI/GUARULHOS` com o dealer canônico Baltic Shopping Tamboré.
- [x] Conciliar `SAVOL SÃO CAETANO/ANÁLIA` com o dealer canônico SAVOL ZL/SP.
- [x] Reprocessar a competência de setembro para confirmar 25/25 dealers conciliados após os aliases.
- [x] Reprocessar Meta Ads para 01/09 em duas tentativas; o Windsor ainda retornou cobertura somente até 31/08, e o último estado válido foi preservado sem fabricar D-1.

## Funil de Leads fechado de agosto de 2026 — apresentação e planilha

- [x] Definir as etapas do funil exclusivamente com campos mensuráveis nas bases atuais.
- [x] Extrair e reconciliar Leads de 01/08 a 31/08 por veículo, plataforma e combinação veículo × plataforma.
- [x] Reconciliar a etapa de MTD Retail Order de agosto sem atribuir vendas a uma plataforma quando não houver chave individual segura.
- [x] Calcular conversões, participações e rankings sem inventar etapas intermediárias ou atribuição de mídia.
- [x] Criar planilha profissional com overview, funil por veículo, funil por plataforma, matriz veículo × plataforma e base metodológica.
- [x] Validar fórmulas, totais, filtros, formatos e consistência visual da planilha.
- [x] Criar apresentação executiva em português com fechamento de agosto, metodologia e principais leituras.
- [x] Revisar todos os slides, validar os números contra a planilha e apresentar a versão final.
- [x] Entregar a planilha e a apresentação com ressalvas claras sobre atribuição de vendas.
