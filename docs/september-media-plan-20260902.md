# Plano de Mídia — setembro de 2026

**Fonte:** `MG-SetembroMidia(1).xlsx`  
**Data da atualização:** 02/09/2026  
**Escopo:** aba Plano de Mídia do dashboard

## Auditoria da origem

A pasta de trabalho possui seis abas, 1.054 células preenchidas e 556 fórmulas. A inspeção das fórmulas e dos valores calculados não encontrou células com erro. A aba `Media Plan - Digital` é a fonte dos cinco canais e das projeções; as abas `Resume Plan` e `Media SAVE` fornecem os valores complementares.

Textos descritivos da planilha mencionam R$ 1,05 milhão e 12.000 Leads, mas as fórmulas efetivamente calculadas fecham em R$ 799.999,67 brutos e 9.998,96 Leads. O dashboard usa os resultados das fórmulas e não transforma textos divergentes em números.

## Plano digital aplicado

| Canal | Publisher | Bruto | Comissão | Líquido | Leads projetados | CPL líquido |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Google Ads | Google | R$ 279.583,00 | R$ 11.183,32 | R$ 268.399,68 | 3.116,58 | R$ 86,12 |
| Webmotors | Webmotors | R$ 110.416,67 | R$ 4.416,67 | R$ 106.000,00 | 706,67 | R$ 150,00 |
| Publya Programmatic Display | Publya | R$ 30.000,00 | R$ 1.200,00 | R$ 28.800,00 | 335,31 | R$ 85,89 |
| Meta Ads | Publya | R$ 300.000,00 | R$ 12.000,00 | R$ 288.000,00 | 5.328,40 | R$ 54,05 |
| Mercado Livre Ads | Mercado Livre | R$ 80.000,00 | R$ 3.200,00 | R$ 76.800,00 | 512,00 | R$ 150,00 |
| **Total digital** | — | **R$ 799.999,67** | **R$ 31.999,99** | **R$ 767.999,68** | **9.998,96** | **R$ 76,81** |

## Valores complementares

O resumo executivo contém R$ 25.000,00 de Revista e R$ 70.000,00 de Produção. Somados ao digital, esses componentes formam orçamento total de R$ 894.999,67. A reserva tática SAVE de R$ 99.000,00 é exibida separadamente porque não integra as fórmulas do total executivo nem a projeção digital.

## Validação

Setembro tornou-se a competência mais recente e padrão da aba. Agosto e julho permanecem disponíveis no seletor histórico com seus valores anteriores. A inspeção autenticada confirmou o título, os quatro indicadores, cinco canais, gráfico, conciliação, detalhamento e valores complementares sem cortes no desktop.

A validação técnica foi concluída com 53 arquivos e 322 testes aprovados, TypeScript aprovado e build de produção aprovado. Permanecem apenas os avisos não bloqueantes já conhecidos sobre configuração do pnpm e tamanho do chunk do Vite.
