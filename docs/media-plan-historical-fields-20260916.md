# Padronização histórica do controle de investimento

## Escopo

O controle mensal do Plano de Mídia passa a usar o mesmo contrato visual e de dados em julho, agosto e setembro de 2026. Após a revisão visual do usuário, o padrão correto dos **quatro cards superiores** foi definido como o exibido em setembro. O PDF diário de Leads não faz parte desta alteração.

| Card superior | Julho | Agosto | Setembro |
|---|---:|---:|---:|
| Plano bruto | R$ 1.050.000,00 | R$ 1.050.000,00 | R$ 799.999,67 |
| Plano líquido de mídia | R$ 1.008.000,00 | R$ 1.008.000,00 | R$ 767.999,68 |
| Leads projetados | 10.000 | 12.000 | 9.998,96 |
| CPL projetado | R$ 100,80 | R$ 84,00 | R$ 76,81 |

## Regra aplicada a julho

Os valores brutos e as premissas de entrega que já estavam registrados no dashboard foram preservados. Como a visualização anterior de julho não continha as colunas financeiras, comissão e líquido foram derivados pela regra de 4% utilizada nas competências posteriores: `comissão = bruto × 4%` e `líquido = bruto − comissão`. Nenhum valor de realizado foi estimado.

O CPL superior segue uma regra única nas três competências: `Plano líquido de mídia ÷ Leads projetados`. Por isso, julho usa R$ 1.008.000,00 ÷ 10.000 = R$ 100,80.

## Regra aplicada a agosto

A meta de 12.000 Leads foi confirmada no arquivo `MGPLANO-AGOSTO(1).xlsx`, abas `Resume Plan` e `Lead Projection`. Os valores financeiros permanecem os valores históricos já aprovados no dashboard: R$ 1.050.000,00 bruto e R$ 1.008.000,00 líquido. O CPL superior padronizado é R$ 1.008.000,00 ÷ 12.000 = R$ 84,00.

## Comportamento da interface

As três competências exibem os mesmos quatro cards superiores: Plano bruto, Plano líquido de mídia, Leads projetados e CPL projetado. Comissão de 4% e investimento realizado continuam disponíveis na conciliação, nos blocos por produto e na tabela detalhada quando aplicáveis. Campos ausentes na fonte são mostrados como `N/D` ou `—`, sem substituição por zero.
