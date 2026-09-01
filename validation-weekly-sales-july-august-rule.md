# Validação — histórico de julho e regra de agosto

Data da validação: 03/08/2026.

## Banco e arquivo preservado

O lote `150001`, arquivo `260731_Daily_Sales_Planning_Report.pdf`, permanece armazenado e foi reclassificado de `2026-08` para `2026-07`. Seus 28 registros também estão em `2026-07`. O snapshot histórico selecionado para julho confirma semana de referência 5, 25 concessionárias, 595 vendas reportadas, 567 vendas correspondentes e 28 sem correspondência.

## Consulta de agosto

No período de 01/08/2026 a 02/08/2026, o painel exibe `Conversão de Leads em vendas • agosto de 2026` e o estado vazio `Nenhuma venda semanal importada para esta competência`. O fechamento de julho não é reutilizado em agosto.

## Histórico preservado

Na mesma tela, o histórico lista `260731_Daily_Sales_Planning_Report.pdf` com competência `julho de 2026`, 595 vendas de referência, semana 5, 21 concessionárias correspondentes e 4 sem correspondência.

## Consulta de julho

Ao selecionar 01/07/2026 a 31/07/2026, o painel muda para `Conversão de Leads em vendas • julho de 2026` e mantém o arquivo `260731_Daily_Sales_Planning_Report.pdf` como o lote histórico mais recente de julho.

## Regra implementada

Arquivos com data no nome em `AAMMDD` ou `AAAAMMDD` usam o mês dessa data como competência. Assim, `260731...` permanece em julho e arquivos futuros `2608DD...` são classificados em agosto. Arquivos sem uma data válida mantêm a competência mensal da tela.

## Indicadores históricos carregados em julho

Após o carregamento completo da consulta de 01/07/2026 a 31/07/2026, a interface exibiu o arquivo `260731_Daily_Sales_Planning_Report.pdf`, Semana 5, 595 vendas, 567 correspondentes e 28 sem correspondência. Os indicadores consolidados ficaram em 5,9% de conversão, 16,96 Leads por venda e 17 Leads estimados necessários, confirmando que a pesquisa histórica recupera o lote correto.
