# Atualização rápida de Leads — dados até 03/09/2026

**Data de execução:** 04/09/2026  
**Escopo:** somente a base de Leads  
**Rotina utilizada:** `scripts/runGoogleLeadsAutomation.ts`

## Resultado

A base foi consolidada e atualizada pelo fluxo canônico, que mantém a substituição integral transacional e o parser oficial. O total armazenado passou de **26.404 para 26.787 Leads**, com **383 novos registros líquidos** e nenhuma remoção da origem.

| Indicador | Resultado |
| --- | ---: |
| Linhas na origem | 27.545 |
| Linhas válidas no consolidado | 27.525 |
| Duplicatas internas descartadas | 738 |
| Linhas inválidas excluídas | 20 |
| Base antes | 26.404 |
| Novos Leads líquidos | 383 |
| Base depois | **26.787** |
| Última data disponível | 03/09/2026 |
| Leads em 03/09 | **376** |

## Composição do último dia fechado

Em 03/09, a base contém 376 Leads: 144 em **Campanha Urban**, 138 em **Meta** e 94 em **Site**. TikTok Ads e TikTok Live continuam como canais distintos; nenhum dado de mídia, vendas ou apresentação foi processado nesta execução.

## Segurança e idempotência

A primeira rodada oficial atualizou a base para 26.787 registros. A repetição imediata retornou `NO_CHANGES`: 26.787 Leads antes e depois, zero novos, zero removidos e zero linhas gravadas. As 20 linhas inválidas permaneceram excluídas pelo validador canônico, incluindo registros de modelos fora do escopo atual.

## Evidências

- Consolidação/atualização: `/home/ubuntu/mg-leads-automation-output/20260904-090846/`
- Reexecução idempotente: `/home/ubuntu/mg-leads-automation-output/20260904-091046/`
