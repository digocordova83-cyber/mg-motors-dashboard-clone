# Atualização do dashboard — 07/10/2026

**Corte solicitado:** dados até 06/10/2026 (D-1)
**Fuso operacional:** America/Sao_Paulo
**Fontes:** planilha oficial de Leads, Windsor.ai e Daily Sales FUP.

## Resultado consolidado

| Área | Situação | Cobertura confirmada |
|---|---|---|
| Leads | Atualizada pela automação oficial | 06/10/2026 |
| Google Ads | Snapshot Windsor atualizado | 06/10/2026 |
| Meta Ads | Snapshot Windsor atualizado | 06/10/2026 |
| TikTok Ads | Snapshot Windsor atualizado, sem métricas no retorno | 06/10/2026 |
| Retail | Último lote oficial preservado | Outubro, Semana 1 |

## Leads

A prévia oficial detectou **330 registros novos**, nenhuma remoção pela fonte e cobertura canônica até **06/10/2026**. A distribuição de outubro no arquivo validado totalizou 1.262 Leads entre 01 e 06/10, incluindo 141 no dia 06/10.

A carga elevou a base canônica de **37.214 para 37.544 Leads**. Os **45 registros de 01/10** que já estavam protegidos pela regra de preservação histórica foram mantidos sem duplicação. O ajuste auditável de competência julho → setembro autorizado anteriormente continua determinístico (250 cópias) e não foi replicado.

A reexecução retornou `NO_CHANGES`. O verificador confirmou **37.544 Leads e 37.544 hashes distintos**, sem duplicidade de identidade. A meta de outubro permanece em 9.500 Leads; até o corte, a base aponta 1.280 Leads no mês e projeção operacional de 6.613, sem inferências além dos dados disponíveis.

## Mídia

Todos os snapshots foram concluídos com status `SUCCESS` e origem `windsor-live` em 06/10:

| Fonte | Cobertura | Evidência operacional do snapshot |
|---|---|---|
| Google Ads | 06/10 | 565 linhas, 32 campanhas, R$ 267.888,64 de investimento e 1.672,1 conversões no recorte retornado |
| Meta Ads | 06/10 | 7 linhas diárias, 6 campanhas, 84 criativos, R$ 21.105,21 de investimento e 1.268 Leads no recorte retornado |
| TikTok Ads | 06/10 | 5 linhas diárias, 1 campanha; retorno sem investimento e sem Leads, preservado como zero informado pela fonte |

Os dados de plataforma foram atualizados pelo Windsor.ai. Não houve criação de estimativas de investimento, receita ou ROAS.

## Retail

Não foi encontrada uma Daily Sales FUP mais nova em Drive, Downloads, uploads ou exports. O dashboard preserva o último lote oficial já conciliado de outubro: `261002_Daily_Sales_FUP.xlsx`, competência outubro, Semana 1, **9 MTD Retail Orders**, 26 concessionárias e conciliação aprovada entre dealers e TOTAL.

O fechamento de setembro permanece preservado separadamente: `261001_Daily_Sales_Planning_Report.pdf`, Semana 5, **641 MTD Retail Orders**, também conciliados em 26 concessionárias.

## Validação

- Prévia oficial de Leads: 330 novos registros, 0 remoções e cobertura até 06/10.
- Importação oficial concluída e reexecução idempotente com `NO_CHANGES`.
- Verificadores analíticos e de importação conciliados; 37.544 hashes distintos.
- Testes direcionados de Leads: **4 arquivos / 15 testes aprovados**.
- Checagem TypeScript e build de produção aprovados.
