# Validação visual do dashboard

## Login

A tela foi validada em 1280 × 720. Fundo escuro integral, card central, marca MG, campos de usuário e senha e CTA vermelho aparecem corretamente. O botão só habilita após o preenchimento dos dois campos e o acesso com `rodrigo/rodrigo` funcionou.

## Visão Geral

A visão autenticada carregou o conjunto real validado do Windsor.ai para 20/06/2026–19/07/2026, com 2.040 registros e 68 campanhas. Os seis KPIs exibidos foram: Investimento R$ 482.920,45; Conversões 21.878,9; CPA R$ 22,07; CTR 9,1%; Taxa de Conversão 5,1%; CPC R$ 1,14. O cabeçalho, os presets, o período customizado, o aviso da Correção de Tag, as quatro sub-abas, três séries temporais, insights dinâmicos e tabela de campanhas estão visíveis e alinhados ao layout escuro de referência.

A fonte exibida foi `Windsor.ai • snapshot validado`, comportamento esperado quando a chamada ao endpoint público não conclui dentro do tempo; o servidor usa o snapshot real da mesma conta como fallback e o cache evita repetição da consulta.

## Acompanhamento Diário

A sub-aba foi validada com seis cards D-1, variações versus D-2 com semântica de cor, gráfico combinado de investimento e conversões e tabela diária completa. A linha de 15/07/2026 está destacada na tabela com o selo “Correção de Tag”; a referência também está configurada na série temporal.

## Investimento

A sub-aba foi validada com série de barras por dia, distribuição horizontal das 15 principais campanhas com cores por eficiência e tabela completa de orçamento diário, investimento, participação, conversões, CPA e status. Os valores coincidem com os KPIs globais e derivam do mesmo conjunto agregado, sem duplicação.

## Otimizações

A sub-aba foi validada com as nove colunas solicitadas, 68 campanhas ativas, busca textual e filtros segmentados. A distribuição calculada para o período foi 4 Críticas, 17 em Atenção e 47 Saudáveis. O filtro “Crítico” reduziu corretamente a tabela para quatro campanhas, mantendo Produto, Tipo de Otimização, Orçamento Diário, Investimento, Conversões, CPA e CTR.

## Fonte validada

Aplicação inspecionada em `https://3000-ilpwlhhroq573depyl3y7-82f471c4.us2.manus.computer/`, utilizando a integração server-side Windsor.ai e seu snapshot real validado da conta MG Motors como contingência.

## Correção de Tag — comprovação visual

Após substituir o componente intermediário por `ReferenceLine` nativa, a Visão Geral foi reinspecionada. Os três gráficos — Investimento Diário, Conversões Diárias e CPA Diário — exibem linha vertical amarela pontilhada, rótulo “Correção de Tag” na coordenada de 15/07/2026 e selo “15/07 • Correção de Tag” no cabeçalho de cada painel. A evidência visual foi capturada em `/home/ubuntu/screenshots/3000-ilpwlhhroq573de_2026-07-21_00-09-17_5993.webp`.

## Correção de Tag em Investimento e filtro de período

A série temporal da sub-aba Investimento foi reinspecionada e exibe a linha vertical amarela pontilhada em 15/07/2026, o rótulo no gráfico e o selo no cabeçalho; evidência em `/home/ubuntu/screenshots/3000-ilpwlhhroq573de_2026-07-21_00-09-47_3868.webp`. O preset de 7 dias também foi acionado com sucesso e atualizou o intervalo para 13/07/2026–19/07/2026, iniciando nova consulta agregada para o período.

## Filtro dinâmico de 7 dias

A atualização foi concluída para 13/07/2026–19/07/2026: 476 registros reais, investimento de R$ 79.784,32, 2.296,2 conversões e CPA médio de R$ 34,75. A tabela, o gráfico e a classificação das campanhas foram recalculados, confirmando que o filtro não é apenas visual. A tentativa de redimensionar a janela autenticada por script foi bloqueada pelo navegador; a responsividade será verificada com captura dedicada em viewport móvel e inspeção estática dos breakpoints.

## Windsor.ai ao vivo

O HTTP 403 foi isolado ao parâmetro `refresh_interval=6h`, indisponível no plano BASIC. Esses parâmetros de atualização horária foram removidos sem alterar os campos nem o filtro da conta. Após reinício por hot reload, a consulta de 30 dias retornou diretamente da API oficial e a interface exibiu **“Windsor.ai atualizado”**, com 68 campanhas e 2.040 registros. O snapshot real continua apenas como fallback resiliente. Evidência visual em `/home/ubuntu/screenshots/3000-ilpwlhhroq573de_2026-07-21_00-12-26_5214.webp`.

## Filtro de 60 dias

O preset de 60 dias atualizou o intervalo para 21/05/2026–19/07/2026 e retornou diretamente do Windsor.ai **3.175 registros reais e 70 campanhas**, com métricas e classificações recalculadas. A marcação de 15/07/2026 permaneceu presente nas três séries da Visão Geral. A escala elevada do CPA em dias anteriores evidencia o problema de conversões subestimadas explicado pelo aviso de correção de tag.

## Preset Mês

O preset **Mês** utilizou corretamente 01/07/2026–19/07/2026 (D-1), retornando diretamente do Windsor.ai 1.292 registros e 68 campanhas. Cards, gráficos, insights e tabela foram recalculados; a marcação de 15/07/2026 permaneceu visível em todas as séries temporais.

## Intervalo customizado

A seleção manual de 10/07/2026–16/07/2026 disparou nova consulta ao Windsor.ai, retornando 476 registros e 68 campanhas. Todos os cards e painéis foram recalculados, e a marcação de 15/07 permaneceu corretamente posicionada dentro do intervalo.

## Cache de navegação e logout

O retorno ao preset de 30 dias reutilizou imediatamente os dados já carregados, enquanto o cache server-side permanece coberto pelo teste automatizado específico. O botão **Sair** removeu a sessão HTTP-only e devolveu a aplicação à tela de login; o conteúdo protegido deixou de ser exibido, confirmando o bloqueio de acesso após logout.

## Credenciais inválidas

A submissão de usuário e senha incorretos foi rejeitada sem criar sessão nem exibir o dashboard. A tela apresentou a mensagem explícita **“Usuário ou senha inválidos. Verifique os dados e tente novamente.”**, mantendo o formulário acessível para nova tentativa.

## Sessão restaurada e cache confirmado

Após a validação negativa, o acesso com `rodrigo/rodrigo` foi restaurado normalmente. O período padrão de 30 dias abriu com **2.040 registros • cache**, comprovando visualmente a reutilização do cache server-side sem nova consulta ao Windsor.ai.

## Auditoria móvel autenticada

A **Visão Geral** foi capturada em 390 px: cabeçalho, filtros, aviso, cards, três gráficos, insights e tabela mantiveram hierarquia legível; tabelas largas permanecem contidas em rolagem horizontal. Na captura de **Acompanhamento Diário**, foi identificado um erro de runtime do Recharts: uma `ReferenceLine` estava associada ao `yAxisId="number"` indisponível naquele gráfico. A correção precisa ser aplicada antes da aprovação responsiva.

## Mobile — Acompanhamento Diário e Investimento

Após vincular a linha de correção ao eixo monetário, **Acompanhamento Diário** foi recapturado em 390 px sem erro: cards D-1 empilham corretamente, o gráfico composto permanece legível e a tabela fica contida com rolagem horizontal. A área **Investimento** também foi validada em 390 px: série temporal, gráfico de barras e detalhamento de campanhas mantêm a hierarquia; o conteúdo tabular largo fica contido, sem ampliar a página horizontalmente.

## Mobile — Otimizações e tablet

A área **Otimizações** foi validada em 390 px: filtros quebram em linhas sem colisão, a busca ocupa a largura disponível e a tabela permanece contida com rolagem horizontal; status e nomes continuam legíveis. A **Visão Geral** foi validada em 768 px: cards formam duas colunas, gráficos ocupam toda a largura, insights formam grade de duas colunas e a tabela mantém contenção. Não foram observados cortes, sobreposições ou expansão horizontal da página nos breakpoints auditados.
