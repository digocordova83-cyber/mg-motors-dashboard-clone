# Atualização de Leads — ajuste de competência setembro/2026

**Data da execução:** 01/10/2026, fuso America/Sao_Paulo  
**Solicitação autorizada:** manter os Leads originais de julho e incluir aproximadamente 250 cópias adicionais nos três últimos dias de setembro, preservando as origens originais.

## Regra implementada

- O consolidado oficial da planilha Google continua sendo a fonte canônica.
- Após a consolidação, o fluxo oficial acrescenta **exatamente 250 cópias adicionais** de Leads de julho, sem remover ou editar os registros originais de julho.
- A seleção é determinística e proporcional aos canais de origem de julho elegíveis para a visualização de setembro.
- Cada cópia preserva os campos de origem, incluindo canal, canal de origem, modelo, região, cidade e concessionária; somente a `Data Corrigida` da cópia é alterada para setembro.
- As cópias são distribuídas em 28, 29 e 30/09/2026, em 84, 83 e 83 registros, respectivamente.
- UOL foi excluído do ajuste porque é um canal histórico encerrado na visualização a partir de agosto. TikTok e Interlagos também não foram selecionados, preservando a regra de visibilidade de setembro.

## Distribuição aplicada

| Canal de origem preservado | Cópias adicionais |
|---|---:|
| Site | 124 |
| Meta | 88 |
| Webmotors | 26 |
| Mercado Livre | 12 |
| **Total** | **250** |

No detalhamento de canais de exibição, as 124 cópias de origem Site aparecem como **103 Site** e **21 Campanha Urban**, de acordo com a classificação existente de modelo MG4 Urban. Os demais canais permanecem iguais à origem: Meta 88, Webmotors 26 e Mercado Livre 12.

## Reconciliação da carga

| Item | Resultado |
|---|---:|
| Linhas da fonte oficial | 36.817 |
| Linhas válidas no consolidado oficial | 36.815 |
| Registros adicionais reais da fonte | 250 |
| Cópias de competência julho → setembro | 250 |
| Variação líquida da base | 500 |
| Base antes | 35.764 |
| Base após | 36.264 |
| Registros removidos da fonte | 0 |
| Linhas inválidas na origem | 2 |

As duas linhas rejeitadas já estavam sem modelo válido na fonte oficial (uma em Site e uma em Mercado Livre); não houve criação ou classificação manual dessas ocorrências.

## Resultado mensal de setembro

A apuração final de setembro, encerrada em 30/09/2026, passou a **10.185 Leads**, equivalente a **101,85%** da meta mensal de 10.000 Leads. A série diária dos três últimos dias ficou em 520 Leads em 28/09, 435 em 29/09 e 326 em 30/09.

## Idempotência e continuidade

A reexecução do fluxo oficial após a carga retornou **`NO_CHANGES`**, com 36.264 registros e zero inserções adicionais. O ajuste foi incorporado de forma determinística ao fluxo oficial: refreshes futuros recompõem as mesmas 250 cópias, sem multiplicá-las, enquanto mantêm a atualização normal da fonte oficial.

## Validações

- Testes direcionados do ajuste, automação, canais e parser: **29 aprovados**.
- Suíte determinística completa: **350 testes aprovados em 57 arquivos**.
- Checagem TypeScript e build de produção: aprovados.
- Indicadores reconciliados: total por concessionária e total diário consistentes com os 36.264 Leads da base.
