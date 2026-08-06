# Validação visual — Rankings de Dealers

## Visão MG MOTORS

- Aba Leads carregada em inglês com sessão MG Motors e período 01–05/08/2026.
- Top Dealers por volume não exibe `Leads em qualificação`; o card separado de qualificação permanece visível.
- Seletor Week 1–Week 5 aparece antes dos rankings; Week 2 é a referência disponível atual.
- Bottom 10 exibe somente dealers elegíveis, com Retail Sales, Leads e conversão em ordem crescente.
- Tabela completa exibe posição, dealer, Retail Sales, Leads received e Conversion, inicialmente em ordem decrescente de conversão.
- Quatro dealers sem correspondência permanecem auditáveis no alerta, mas não entram no ranking de conversão.
- Layout desktop sem sobreposição aparente no carregamento completo da página.

## Interação semanal

O clique direto em Week 1 foi confirmado após o ciclo de renderização: o seletor, o título do Bottom 10 e a tabela mudaram para Week 1, e o valor da TECAR passou de 8 para 5 Retail Sales. O primeiro clique automatizado no cabeçalho Retail Sales não alterou visualmente a ordem; a ordenação será retestada por acionamento direto antes do checkpoint.

O acionamento direto do cabeçalho Retail Sales reordenou a tabela corretamente: TECAR passou à primeira posição com 5 vendas, seguida pelos dealers com 4 vendas. O ranking Bottom 10 permaneceu inalterado, como esperado, pois continua ordenado por conversão.

## Visão VENDAS

A sessão MG Sales abriu corretamente em inglês e manteve apenas o módulo Leads, confirmando as permissões de somente leitura. A primeira consolidação permaneceu em carregamento após duas verificações; os logs de rede e servidor serão inspecionados para distinguir latência real de erro antes do checkpoint.

Os logs e a inspeção do navegador confirmaram apenas a chamada bem-sucedida de `dashboardAuth.session`; a consulta `leads.analytics` não foi iniciada automaticamente, inclusive após recarga com a sessão já ativa. O endpoint será testado diretamente para isolar se o problema está no frontend ou na autorização do backend.

O endpoint `leads.analytics` respondeu 200 para a sessão MG Sales com os 1.174 Leads reais do período, e o console não apresentou erros. A autorização e o backend estão corretos; o estado de carregamento está restrito à consulta automática do frontend nesta sessão de validação trocada por CDP.

Após uma interação no filtro de data, a consulta automática foi disparada e a visão MG Sales carregou integralmente. O perfil mostrou apenas Leads, sem Export database, Edit goal ou importações, preservando o modo somente leitura. Top Dealers excluiu qualificação, e Bottom 10 e a tabela completa exibiram os mesmos 14 dealers elegíveis da visão MG MOTORS. O botão Week 1 está habilitado e recebeu o evento de clique.

O ciclo de renderização confirmou Week 1 no título do Bottom 10 e da tabela na visão MG Sales. O cabeçalho Leads received está habilitado e recebeu o evento de ordenação, mantendo a experiência de análise disponível mesmo no perfil somente leitura.

A tabela foi confirmada visualmente em ordem decrescente de Leads received: BARIGUI - CURITIBA apareceu primeiro com 144 Leads, seguida por DRSUL com 80. O cabeçalho Conversion também permaneceu habilitado e foi acionado para restaurar a ordenação padrão.

As sessões temporárias de validação foram encerradas pelo fluxo de Sign out, e o navegador retornou à tela de acesso protegido.
