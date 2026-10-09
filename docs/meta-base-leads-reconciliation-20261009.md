# Reconciliação Meta — planilha-base de Leads

**Data:** 09/10/2026  
**Escopo:** corrigir a divergência entre o volume diário de Leads informado pela operação e o volume exibido na aba **Meta Ads** do dashboard.

## Diagnóstico

A aba Meta Ads usava `actions_lead` da integração Windsor.ai como KPI e como série diária. Esse indicador é de mídia da plataforma e não é equivalente ao volume de registros inseridos na **aba Meta da planilha-base de Leads**.

A base canônica também não é uma fonte adequada para esse card operacional: ela aplica validações de modelo, contato e concessionária. Consequentemente, registros existentes na planilha de origem podem ficar fora da base canônica quando não possuem dados obrigatórios para distribuição na rede.

A reconciliação da planilha-base confirmou os seguintes volumes agregados na competência de outubro, no fuso **America/Sao_Paulo**:

| Data | Leads na aba Meta |
|---|---:|
| 01/10/2026 | 137 |
| 02/10/2026 | 255 |
| 03/10/2026 | 263 |
| 04/10/2026 | 249 |
| 05/10/2026 | 169 |
| 06/10/2026 | 62 |
| 07/10/2026 | **243** |
| 08/10/2026 | **179** |

> A fonte registra 179 linhas em 08/10; portanto, não foi inserido um arredondamento para 180.

## Correção aplicada

1. Criada a tabela `meta_base_lead_daily_metrics`, que armazena somente data, contagem de linhas e identificadores únicos agregados. Nenhum dado pessoal é persistido nessa tabela.
2. A consolidação oficial de Leads agora calcula a série diária da aba Meta por `created_time`, convertendo a competência para o fuso de São Paulo.
3. Cada sincronização oficial persiste a série agregada, inclusive quando a base canônica já está idêntica e retorna `NO_CHANGES`.
4. A aba Meta Ads passou a usar essa série da planilha-base no card **Leads — planilha-base** e no gráfico **Evolução diária de Leads**. Métricas de mídia, campanhas, criativos e públicos continuam provenientes do Windsor.ai e permanecem identificadas como dados de plataforma.

## Integridade da base

- Prévia final: **0** novos registros e **0** remoções na base canônica.
- Sincronização aplicada: `NO_CHANGES`; total canônico preservado em **38.098 Leads**.
- Série Meta agregada persistida: **83 dias**; outubro de 01 a 08/10 soma **1.557 Leads**.
- A correção não altera PII, histórico, origem de canal ou distribuição de Leads da base canônica.

## Validação

- Consolidador Python: 9 testes aprovados.
- Projeto: 64 arquivos de teste / 376 testes aprovados.
- TypeScript e build de produção aprovados.
