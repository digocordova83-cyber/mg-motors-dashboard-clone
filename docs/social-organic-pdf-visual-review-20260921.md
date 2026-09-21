# Revisão visual — PDF do Social Orgânico

**Data:** 21/09/2026  
**Artefato de validação:** PDF real gerado pelo Chromium em modo de impressão, 16:9, 10 páginas, 1.541.436 bytes.

## Páginas 1–5

As páginas preservam o fundo escuro, os cards, gráficos, barras, cores e hierarquia visual exibidos na aba Social Orgânico. A primeira página inclui cabeçalho, plataforma/período selecionados, metadados da fonte e seis KPIs. As páginas seguintes preservam os gráficos de evolução, engajamento, aquisição diária, composição das interações, análise de crescimento, distribuição por tipo de dia, médias por dia da semana e diagnóstico do último fim de semana.

Não foram observados cortes horizontais, sobreposição de textos, perda de cores ou componentes quebrados. O botão `Exportar PDF` e o botão `Atualizar` são removidos da impressão, mantendo apenas o conteúdo e os controles que identificam o recorte da tela. A faixa `Preview mode` vista no rodapé pertence exclusivamente ao ambiente temporário Manus e não existe nos domínios publicados.

## Páginas 6–10

O diagnóstico, os sinais associados, os picos diários e as leituras do período mantiveram integralmente a mesma estrutura da tela, sem cortes ou sobreposição. O ranking de conteúdos também foi paginado preservando os cards e métricas.

Na primeira renderização automatizada, as áreas de miniatura dos conteúdos apareceram vazias porque as imagens estavam configuradas com carregamento tardio e nunca entraram no viewport antes da impressão headless. Como o relatório deve reproduzir exatamente a tela, a validação identificou a necessidade de carregar as oito miniaturas de forma antecipada antes da exportação. O componente foi ajustado para carregamento antecipado e será revalidado no PDF final.

## Correção e revalidação das miniaturas

O carregamento das miniaturas foi alterado de tardio para antecipado. O PDF regenerado aumentou de 1,54 MB para 3,37 MB e passou a incorporar sete imagens coloridas reais nas páginas 8–10, conforme inspeção com `pdfimages`. O documento manteve 10 páginas no formato 16:9 e o título `MG Motors _ SOCIAL ORGANIC Instagram dashboard_21 Sept`.

## Resultado final

A inspeção visual das páginas 8–10 confirmou que todas as sete miniaturas foram incorporadas, com proporção preservada (`object-contain`), sem cortes, distorção ou sobreposição. O PDF final reproduz integralmente o conteúdo exibido na aba para a plataforma e o período selecionados, em dez páginas 16:9 escuras. Os controles de atualização e exportação são omitidos por não fazerem parte do relatório, enquanto plataforma, período e ordenação selecionada permanecem visíveis para contextualizar o recorte.
