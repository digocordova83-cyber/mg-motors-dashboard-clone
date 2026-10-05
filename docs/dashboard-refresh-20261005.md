# Atualização do dashboard — 05/10/2026

**Corte solicitado:** dados até 04/10/2026 (D-1)  
**Fuso operacional:** America/Sao_Paulo  
**Fontes:** planilha oficial de Leads, Windsor.ai e Daily Sales FUP XLSX.

## Resultado consolidado

| Área | Situação | Cobertura confirmada |
|---|---|---|
| Leads | Atualizada pela automação oficial | 04/10/2026 |
| Google Ads | Snapshot Windsor atualizado | 04/10/2026 |
| Meta Ads | Snapshot Windsor atualizado | 04/10/2026 |
| TikTok Ads | Mantido sem estimativa | 03/10/2026 (último snapshot completo) |
| Retail | Último lote oficial preservado | Outubro, Semana 1 |

## Leads

A planilha oficial trouxe **707 registros novos** para a base. Na comparação com o estado canônico, a origem deixou de entregar **45 Leads de 01/10**, todos atribuídos originalmente à Meta: 38 de MG4 Urban (exibidos como Campanha Urban) e 7 de Cyberster. Não havia uma versão corrigida correspondente na fonte atual.

Para impedir perda de histórico por ausência temporária da fonte, a automação agora preserva registros canônicos ausentes antes da substituição. A regra reconhece correções legítimas pela mesma identidade de origem e não mantém cópia antiga quando uma versão corrigida existe. Nesta execução, os 45 registros foram preservados e a carga passou de **36.507 para 37.214 Leads**. A base permaneceu sem hashes duplicados.

A reexecução retornou `NO_CHANGES`, confirmando que o mecanismo preserva os mesmos registros sem replicá-los. O ajuste de competência julho → setembro previamente autorizado (250 cópias) continua aplicado de forma determinística e não é duplicado. A cobertura analítica é até 04/10, com 950 Leads em outubro no período disponível.

A fonte manteve 346 linhas rejeitadas por dados de origem incompletos ou sem classificação suficiente — incluindo ausência de concessionária e um modelo vazio. Essas linhas seguem fora da base para evitar atribuição artificial.

## Mídia

O Windsor atualizou Google Ads e Meta Ads até 04/10. O snapshot de Meta Ads registrou 1.450 Leads e R$ 25.759,23 no recorte operacional retornado pelo conector; Google Ads retornou 1.772,7 conversões e R$ 299.424,68 de investimento para seu recorte. Estes dados permanecem como dados de plataforma, sem inferência de receita ou ROAS.

O Windsor não retornou TikTok Ads completo para 04/10. O dashboard preserva o último snapshot completo de 03/10 e não preenche 04/10 com estimativas.

## Retail

Não foi identificada uma Daily Sales FUP oficial mais nova durante esta atualização. O dashboard mantém o último lote validado de outubro: `261002_Daily_Sales_FUP.xlsx`, Semana 1, com **9 MTD Retail Orders** conciliados entre TOTAL, regiões e concessionárias.

## Validação

- Prévia oficial aplicada com preservação de histórico auditável.
- Reexecução idempotente: `NO_CHANGES`.
- Validador analítico: 37.214 Leads e 37.214 hashes distintos.
- Suíte determinística: 59 arquivos e **361 testes aprovados**.
- Checagem TypeScript e build de produção aprovados.
