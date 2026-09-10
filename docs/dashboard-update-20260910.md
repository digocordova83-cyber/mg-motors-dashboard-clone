# Atualização do dashboard — dados até 09/09/2026

Data de execução: 10/09/2026, horário de Brasília. Corte operacional: D-1, 09/09/2026.

## Leads

A automação oficial foi executada em prévia, substituição canônica transacional e prova de idempotência. O download direto da planilha apresentou um timeout transitório na primeira tentativa; a fonte foi então baixada com tolerância ampliada e processada pelo mesmo fluxo oficial, sem escrita direta no banco.

A fonte continha 29.373 linhas, das quais 29.353 foram consolidadas, 20 foram rejeitadas por modelo inválido ou ausente e 749 duplicatas internas foram descartadas. A base canônica passou de 28.404 para 28.604 Leads, acréscimo líquido de 200 registros. A reexecução retornou `NO_CHANGES`, sem novas gravações.

Em setembro, a base acumula 2.559 Leads até 09/09. No dia 09/09 foram registrados 198 Leads: Meta 90, Campanha Urban 60, Site 38 e Mercado Livre 10.

## Mídia

O refresh D-1 terminou com `SUCCESS` nas três fontes e auditoria persistida. Google Ads, Meta Ads e TikTok Ads apresentam `dataThroughDate` igual a 09/09/2026 e origem `windsor-live`. TikTok Ads permaneceu com investimento e Leads nativos iguais a zero na janela aquecida de 03–09/09, conforme retorno da própria fonte.

## Vendas

Não foi fornecido um novo PDF de vendas nesta atualização. A base comercial permanece no último documento oficial importado: lote 720001, competência 2026-09, semana 2, total de 110 MTD Retail Orders, 26 dealers conciliados e zero não conciliados.

## Validação técnica

A suíte completa foi aprovada com 55 arquivos e 336 testes. TypeScript e build de produção também foram concluídos com sucesso. O build manteve apenas o aviso já conhecido de tamanho de chunk, sem falha de compilação.
