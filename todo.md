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
