# Validação de navegador — 21/07/2026

## Tela de login

A aplicação carregou corretamente no preview após o reinício. A tela de login está responsiva no viewport desktop, com logo MG, campos de usuário e senha, controle de visibilidade da senha e botão de entrada. Não houve tela branca após o carregamento; o primeiro frame em branco ocorreu apenas enquanto o cliente inicializava.

## Conta MG Motors — diagnóstico inicial

A primeira tentativa com o login solicitado `mg motors` foi recusada porque o registro persistido ainda estava sem o espaço previsto no nome de usuário. A conta estava ativa, em `en-US` e com as permissões corretas. O nome de usuário foi corrigido de forma idempotente no banco para `mg motors`, preservando o hash de senha e a matriz de acesso.

A tela de login foi recarregada após a correção do usuário e as credenciais MG Motors foram preenchidas novamente para a segunda validação.

A verificação local confirmou que os hashes das duas contas correspondem às credenciais solicitadas. Nenhuma senha foi exibida, persistida em texto puro ou redefinida. A segunda tentativa havia usado uma grafia diferente; a página foi reamostrada antes do teste correto porque o DOM do formulário mudou após o erro.

O formulário foi preenchido com o usuário `mg motors` e a credencial previamente confirmada pelo hash, sem registrar seu valor no projeto, e ficou pronto para a validação da área autenticada.

## Conta MG Motors — desktop autenticado

O login do usuário `mg motors` foi validado com sucesso usando a credencial armazenada somente como hash. O shell aparece em inglês, identifica o usuário como **MG Motors**, mostra `Active access` e atualiza o cabeçalho com um timestamp real recebido pelos dados. A navegação expõe somente **Google Ads, Meta Ads, Leads e Media Plan**; **Optimizations** e **History** não aparecem. A área Google Ads, seus filtros, abas, cartões, gráficos, rankings, tabelas e estados estão traduzidos para inglês. A moeda de negócio permanece em BRL (`R$`), como esperado.

## Meta Ads — primeira abertura

O módulo Meta Ads foi aberto pela conta MG Motors e exibiu o estado de carregamento em inglês (`Loading live Meta Ads data...`). A consulta não concluiu na primeira espera de aproximadamente 10 segundos; os logs de rede e servidor serão verificados antes de qualquer ajuste.

A chamada autenticada direta ao procedimento `metaAds.data` respondeu **HTTP 200** com dados reais da conta `Ag. BBRO - MG Motor Brasil - AUT` (`1418731006678061`), moeda BRL e período 14–20/07/2026. O resumo retornou investimento de R$ 13.370,12, 1.712 Leads, CPL de R$ 7,81, 594.495 impressões, alcance de 228.372, 20.807 cliques e CTR de 3,5%. Isso confirma que conta, autorização e backend estão corretos; a demora observada ficou restrita ao ciclo inicial da interface.

## Meta Ads — painel carregado

O painel concluiu o carregamento e exibiu a conta Meta correta, filtros 7/14/30/60 dias e mês, datas customizadas, botão de atualização, fonte Windsor.ai, data coberta e timestamp real. Foram validados os seis KPIs principais, séries diárias de investimento/Leads e CPL, desempenho por modelo, campanhas, audiências, criativos reais e análise de público. Os textos operacionais estão em inglês para a conta MG Motors. A primeira abertura levou aproximadamente 47 segundos porque os limites de data consultaram a fonte externa por 18,5 segundos; após o cache do backend, os dados foram entregues normalmente.

## Leads — conta MG Motors

O módulo carregou em inglês, usou o timestamp real do último lote, exibiu 7.051 Leads no período, pacing mensal persistente, gráficos, distribuição, modelos, regiões e auditoria por concessionária. Os nomes canônicos do novo de/para aparecem antes dos agrupamentos (por exemplo, `BARIGUI - CURITIBA`, `DRSUL - PORTO ALEGRE`, `POTENZA - RECREIO`). O histórico de importações, seletor CSV, pré-validação e confirmação **não aparecem** para esta conta. Foi identificado um ajuste de tradução: a categoria de dados ausentes ainda é renderizada como `Indisponível` em alguns rankings, embora os textos explicativos estejam em inglês; ela será apresentada como `Unavailable` apenas na interface, sem alterar o valor bruto.

O rótulo de ausência foi corrigido somente na camada visual: `Unavailable` agora aparece nos rankings de região e concessionária para `en-US`, enquanto os nomes canônicos oficiais e os valores brutos permanecem inalterados.

## Digital Media Plan — conta MG Motors

O módulo foi validado integralmente em inglês. A competência disponível é julho/2026, com investimento líquido de R$ 1.152.000, orçamento bruto de R$ 1.200.000, comissão de R$ 48.000, 17.658 Leads projetados, CPL consolidado de R$ 65, 86.653.037 impressões, 15 inserções, alocação por canal/produto/funil e tabela detalhada. Os valores e a indicação da aba `Página1` correspondem ao plano consolidado; o cabeçalho recebeu o timestamp real do arquivo-fonte.

## Google Ads — conta MG Motors

A navegação mostra somente `Overview`, `Daily Tracking` e `Investment`; `Optimizations` e `History` não aparecem. A Visão Geral e o Acompanhamento Diário foram validados com textos, métricas, filtros, aviso do Tag Fix, tabelas e formatação em inglês. As datas e valores são formatados conforme `en-US`, mantendo BRL como moeda da conta.

## Google Ads — Investment

A aba `Investment` foi validada em inglês com meta mensal persistente de R$ 397.620,71 para julho/2026, investimento realizado de R$ 230.142,63, restante de R$ 167.478,08, projeção de R$ 375.495,87, médias real/ideal/necessária, indicador de 94,4% do ritmo, curva acumulada Real/Ideal/Projection/Monthly target, distribuição por campanha e edição de meta disponível.

## Conta winicius

O login `winicius` foi validado com sucesso. A sessão identifica `Winicius`, mantém `pt-BR` e exibe Google Ads, Meta Ads, Leads, Plano de Mídia, além das abas Google Ads `Otimizações` e `Histórico`. O cabeçalho mostra a última atualização real em português.

Em Leads, a conta winicius visualiza KPIs, pacing, filtros, rankings e auditoria em português, mas não vê importador CSV nem histórico de importações. O timestamp real do último lote continua disponível pelo retorno analítico permitido, sem consultar a rota restrita.

## Otimizações — conta winicius

O ciclo executável foi validado sem seção independente de recomendações, sem seleção manual de responsável e sem botão `Iniciar`. Cada tarefa incorpora motivo, evidências, impacto, risco e instruções; a única ação operacional é `Concluir e registrar snapshot`, com notas obrigatórias e autoria/responsabilidade automáticas da sessão. A grade foi ajustada para `lg:grid-cols-2 xl:grid-cols-3`, garantindo três tarefas por linha em telas amplas.

## Conta MG Motors — mobile autenticado (390 × 844)

A sessão real da conta persistida `mg motors` foi aplicada em navegador Chromium headless com viewport móvel de 390 × 844, sem uso nem armazenamento de senha no utilitário de validação. O shell autenticado carregou em inglês com a identidade MG Motors e navegação limitada aos módulos permitidos, sem Optimizations, History ou controles de importação. A captura `/home/ubuntu/mg-mobile-validation/failure-state.png` comprovou o Google Ads responsivo em coluna única, com cartões legíveis, filtros horizontais e sem overflow lateral visível. O utilitário encerrou com código negativo somente porque aguardava o texto `Operations Dashboard`, omitido pelo cabeçalho compacto móvel; os dados autenticados e os KPIs reais foram carregados corretamente.
