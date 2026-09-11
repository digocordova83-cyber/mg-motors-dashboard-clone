# Atualização do dashboard — dados até 10/09/2026

Data de execução: 11/09/2026, horário de Brasília. Corte operacional: D-1, 10/09/2026.

## Leads

A automação oficial foi executada em prévia, substituição canônica transacional e prova de idempotência. A fonte continha 29.444 linhas, das quais 29.424 foram consolidadas, 20 foram rejeitadas por modelo inválido ou ausente e 749 duplicatas internas foram descartadas.

A base canônica passou de 28.604 para 28.675 Leads, acréscimo líquido de 71 registros. A reexecução retornou `NO_CHANGES`, sem novas gravações. Em setembro, a base acumula 2.630 Leads até 10/09. No dia 10/09 foram registrados 71 Leads: Site 49 e Campanha Urban 22.

## Mídia

Google Ads e TikTok Ads concluíram com `SUCCESS`, origem `windsor-live` e cobertura até 10/09/2026. TikTok Ads permaneceu com investimento e Leads nativos iguais a zero na janela de 04–10/09, conforme a própria fonte.

Meta Ads respondeu por `windsor-live`, mas o último dia disponível permaneceu em 09/09/2026. O refresh de 10/09 foi registrado como `FAILED` por cobertura incompleta, sem substituir o último snapshot íntegro. Uma consulta isolada posterior excedeu o tempo de resposta e foi interrompida com segurança. Portanto, o dashboard preserva Meta Ads até 09/09 e não simula dados de 10/09.

## Vendas

Não foi fornecido um novo PDF de vendas nesta atualização. A base comercial permanece no último documento oficial importado: lote 720001, competência 2026-09, semana 2, total de 110 MTD Retail Orders, 26 dealers conciliados e zero não conciliados.

## Validação técnica

A suíte completa foi aprovada com 55 arquivos e 336 testes. TypeScript e build de produção também foram concluídos com sucesso. O build manteve apenas o aviso já conhecido de tamanho de chunk, sem falha de compilação.
