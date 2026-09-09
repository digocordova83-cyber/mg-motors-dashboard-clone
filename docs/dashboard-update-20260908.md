# Atualização do dashboard — 08/09/2026

## Escopo e corte

Esta execução atualizou o dashboard operacional com dados fechados até **08/09/2026**. A rotina respeitou o corte D-1 no fuso `America/Sao_Paulo` e manteve separados os universos de Leads, plataformas de mídia e MTD Retail Order.

## Leads canônicos

| Indicador | Resultado |
|---|---:|
| Linhas na fonte | 29.172 |
| Leads canônicos após tratamento | 29.152 |
| Duplicatas internas descartadas | 748 |
| Linhas inválidas excluídas | 20 |
| Base anterior | 27.759 |
| Novos Leads líquidos | 645 |
| Base canônica final | 28.404 |
| Leads acumulados de setembro, 01–08/09 | 2.359 |
| Leads em 08/09 | 264 |

Em 08/09, a distribuição por canal foi: Meta 112, Campanha Urban 88, Site 61 e Mercado Livre 3. A atualização foi executada pelo fluxo transacional canônico de Leads. A segunda execução retornou `NO_CHANGES`, com base final preservada em 28.404 registros.

## Mídia paga

As três fontes concluíram atualização pelo Windsor com cobertura declarada até 08/09: Google Ads, Meta Ads e TikTok Ads. Google Ads retornou 1.172 linhas e 107 campanhas no intervalo técnico aquecido de 10/08 a 08/09. Meta Ads retornou sete linhas diárias, quatro campanhas e 25 criativos para a janela de 02–08/09. TikTok Ads retornou sete linhas diárias, uma campanha, um grupo de anúncios e um anúncio para a mesma janela, sem investimento e sem Leads no recorte.

Os valores técnicos retornados pelas fontes não substituem plano de mídia, comprovantes financeiros ou atribuição de vendas. Cada fonte foi registrada como `SUCCESS` com cobertura até 08/09.

## MTD Retail Order

O PDF `pasted_file_2MhVQz_260908DailySalesPlanningReport.pdf` foi validado na tabela **Weekly Target Achievement — Retail**. A referência é a semana 2, com **110 MTD Retail Orders**, meta de 145,2 e atingimento de 75,8% conforme a fonte.

| Controle | Resultado |
|---|---:|
| Lote importado | 720001 |
| Linhas persistidas | 29 |
| Dealers do arquivo | 26 |
| Dealers conciliados | 26/26 |
| Dealers não conciliados | 0 |
| Regiões | 2 |
| Linhas TOTAL | 1 |
| Reprocessamento | `NO_CHANGES` |

Cinco dealers permanecem sem MTD Retail Order individual informado na semana 2: Euroville Belo Horizonte, Niscar João Pessoa, Toriba São Paulo, Tecar Goiânia e Vega Belém. O total, as regiões e os dealers reportados reconciliaram em 110.

## Recuperação de importação

A importação padrão encontrou resposta estruturada truncada no segundo processamento do PDF. Como a prévia oficial anterior já havia sido bem-sucedida, reconciliada e registrada, a recuperação reconstruiu a extração exclusivamente a partir dessa prévia, conferiu o hash contra os bytes do PDF enviado e chamou `importWeeklySalesCsv` com `parsedOverride` e `expectedFileHash`. Não houve escrita SQL direta nem inferência de valores. O lote foi persistido e a reexecução confirmou idempotência.

## Validação

Foram concluídos **55 arquivos de teste / 336 testes**, TypeScript sem erros e build de produção aprovado. O aviso de tamanho do bundle existente não impede a compilação; nenhuma falha de dados foi registrada nesta execução.
