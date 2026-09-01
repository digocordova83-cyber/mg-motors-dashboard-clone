# Validação da navegação modular

Data da verificação: 21/07/2026.

## Leads

A URL compartilhável `?module=leads&tab=leads` abriu o módulo **Leads** como item principal ativo, sem subordinação visual às subabas de Google Ads. O período padrão foi resolvido para `01/07/2026` a `19/07/2026`, usando a última `Data Corrigida` disponível. Os campos nativos de data inicial e final foram exibidos com esses valores, e as métricas, gráficos, pacing e auditoria por concessionária carregaram para o mesmo intervalo.

## Meta Ads

O clique no item principal **Meta Ads** atualizou a URL para `?module=meta-ads`, manteve o item ativo no cabeçalho e exibiu somente a área vazia solicitada, sem cards, dados simulados, mensagem provisória ou subnavegação de Google Ads.

## Google Ads

O item principal **Google Ads** abriu `?module=google-ads&tab=overview` e exibiu exclusivamente suas cinco subáreas: Visão Geral, Acompanhamento Diário, Investimento, Otimizações e Histórico. Seu período próprio permaneceu em `20/06/2026` a `19/07/2026`.

## Independência dos períodos

Ao retornar a **Leads**, o período foi restaurado para `01/07/2026` a `19/07/2026`, confirmando que o mês padrão e os campos de data desse módulo são independentes do período de Google Ads.

## Teste do intervalo manual

O campo nativo **Data inicial de Leads** aceitou programaticamente o valor `10/07/2026` e disparou os eventos reais de entrada e alteração do navegador.

### Resultado da recomposição

O intervalo manual ficou visível como **10/07/2026 a 19/07/2026** e recompôs os componentes vinculados ao recorte: **5.075 leads** em 10 dias, média diária de **507,5**, canal principal Site com **2.414 leads**, **5 canais ativos**, gráfico limitado às dez datas, distribuição por canal recalculada, **90 concessionárias válidas**, 3.735 leads atribuídos e 1.340 sem concessionária. A primeira linha da auditoria mudou para BARIGUI - CURITIBA com **338 leads**, média **33,8**, 10 dias com lead e recebimentos entre 10/07 e 19/07.

O painel **Pacing de Leads — 2026-07** permaneceu conscientemente mensal, com o acumulado de julho até 19/07 (**7.051 / 10.000**), em vez de tratar o recorte parcial de dez dias como cumprimento da meta mensal. Isso mantém a meta e a projeção semanticamente consistentes enquanto os KPIs, gráficos, distribuições e auditoria seguem o filtro manual.

## Responsividade

A sessão autenticada foi emulada diretamente nos viewports **mobile (375 × 812)** e **tablet (768 × 1024)**, com capturas e medições do DOM. Nos dois tamanhos, a largura total do documento coincidiu com a largura do viewport e **não houve overflow horizontal da página**.

No mobile, o menu principal ocupa 343 px e usa rolagem horizontal própria para acomodar os três módulos; Google Ads, Meta Ads e Leads permanecem acessíveis, com Leads visivelmente ativo. O título, atalhos de período, campos de data, estado da base, ação de CSV e cards empilham em uma coluna legível. No tablet, os três módulos cabem integralmente sem rolagem, os atalhos e datas ficam lado a lado e os quatro KPIs se organizam em duas colunas. A inspeção visual não mostrou cortes, sobreposições ou texto fora dos painéis.

As tabelas extensas mantêm contêineres locais com `overflow-x-auto`, preservando o layout da página em telas estreitas. Evidências geradas: `/home/ubuntu/mg-responsive-validation/mobile-375x812.png`, `/home/ubuntu/mg-responsive-validation/tablet-768x1024.png` e `/home/ubuntu/mg-responsive-validation/report.json`.

## Validação integral

A verificação TypeScript (`tsc --noEmit`), os **54 testes Vitest em 15 arquivos** e o build de produção foram concluídos com sucesso. O build apresentou apenas o aviso informativo já conhecido sobre tamanho de chunk, sem erro de compilação.

O log do navegador continha um erro transitório de HMR às 03:44:38 (`getTabFromUrl is not defined`) ocorrido durante a edição da navegação. Após a correção, novas sessões e todas as verificações realizadas entre 03:49 e 03:57 não registraram erros, exceções não tratadas ou falhas de renderização. A resposta HTTP 400 encontrada no histórico de rede corresponde ao teste intencional de pré-validação de um CSV com cabeçalhos inválidos, e não a uma falha da aplicação.
