# Padronização histórica do controle de investimento

## Escopo

O controle mensal do Plano de Mídia passa a usar o mesmo contrato visual e de dados em julho, agosto e setembro de 2026. O PDF diário de Leads não faz parte desta alteração.

| Campo comum | Julho | Agosto | Setembro |
|---|---:|---:|---:|
| Plano bruto | R$ 1.050.000,00 | R$ 1.050.000,00 | R$ 799.999,67 |
| Comissão de 4% | R$ 42.000,00 | R$ 42.000,00 | R$ 31.999,99 |
| Plano líquido | R$ 1.008.000,00 | R$ 1.008.000,00 | R$ 767.999,68 |
| Investimento realizado | N/D | R$ 0,00 informado na fonte | N/D |

## Regra aplicada a julho

Os valores brutos e as premissas de entrega que já estavam registrados no dashboard foram preservados. Como a visualização anterior de julho não continha as colunas financeiras, comissão e líquido foram derivados pela regra de 4% utilizada nas competências posteriores: `comissão = bruto × 4%` e `líquido = bruto − comissão`. Nenhum valor de realizado foi estimado.

## Comportamento da interface

As três competências exibem agora Plano bruto, Comissão de 4%, Plano líquido, Investimento realizado, Publisher, Produto, Objetivo, Status, Leads e CPL. Campos ausentes na fonte são mostrados como `N/D` ou `—`, sem substituição por zero.
