# Atualização do dashboard — 08/10/2026

**Corte solicitado:** dados até 07/10/2026 (D-1)  
**Fuso operacional:** America/Sao_Paulo  
**Fontes atualizadas:** planilha oficial de Leads e Windsor.ai.  
**Fontes preservadas:** Daily Sales FUP já importada.

## Resultado consolidado

| Área | Situação | Cobertura confirmada |
|---|---|---|
| Leads | Atualizada pela automação oficial | 07/10/2026 |
| Google Ads | Snapshot Windsor atualizado | 07/10/2026 |
| Meta Ads | Snapshot Windsor atualizado | 07/10/2026 |
| TikTok Ads | Snapshot Windsor atualizado, sem entrega no retorno | 07/10/2026 |
| Retail | Último lote oficial preservado | Outubro, Semana 2 |
| Google Analytics | Não conectado nesta sessão | Sem atualização de receita/ROAS |

## Leads

A prévia oficial confirmou cobertura temporal até **07/10/2026**, detectou **333 registros novos** e não identificou remoções na fonte. A carga elevou a base canônica de **37.544 para 37.877 Leads**.

A reconciliação analítica confirmou **37.877 registros e 37.877 hashes distintos**, sem duplicidade de identidade. A regra já aprovada de preservação histórica permaneceu ativa: 45 registros de Meta ausentes temporariamente na fonte de 01/10 continuam preservados, sem gerar cópias adicionais. O ajuste auditável de competência julho → setembro também permaneceu determinístico e não foi repetido.

No corte, outubro contabiliza **1.613 Leads** frente à meta de 9.500 (16,98%). A projeção matemática do ritmo atual é de 7.143 Leads; é um indicador de pacing, não uma estimativa de fonte externa.

## Mídia

Os snapshots de mídia foram executados com status `SUCCESS` e origem `windsor-live`:

| Fonte | Cobertura | Evidência operacional do snapshot |
|---|---:|---|
| Google Ads | 07/10 | 542 linhas, 32 campanhas, R$ 248.681,91 de investimento e 1.572,4 conversões no recorte retornado |
| Meta Ads | 07/10 | 7 linhas diárias, 6 campanhas, 59 criativos, R$ 23.646,37 de investimento e 1.382 Leads |
| TikTok Ads | 07/10 | 5 linhas diárias, 1 campanha; retorno com investimento e Leads iguais a zero |

Google Analytics não está habilitado nos conectores desta sessão. Portanto, não foram criadas métricas de receita, ROAS ou projeções financeiras sem fonte oficial.

## Retail

Não foi identificado um novo Daily Sales FUP posterior ao lote já carregado. O dashboard preserva o último lote oficial de outubro: `261007_Daily_Sales_FUP.xlsx`, competência outubro, **Semana 2**, **96 MTD Retail Orders** e conciliação aprovada entre dealers, regiões e TOTAL.

O fechamento de setembro permanece preservado separadamente com 641 MTD Retail Orders conciliados.

## Validação

- Prévia de Leads: 333 novos registros, 0 remoções e cobertura até 07/10.
- Importação oficial concluída; a reexecução retornou `NO_CHANGES`.
- Verificadores analítico e de importação conciliados; 37.877 hashes distintos.
- Testes direcionados de Leads: **4 arquivos / 15 testes aprovados**.
- Checagem TypeScript aprovada.
