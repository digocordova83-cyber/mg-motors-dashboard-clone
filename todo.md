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
