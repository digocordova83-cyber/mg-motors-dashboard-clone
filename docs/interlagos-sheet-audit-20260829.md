# Auditoria da aba Interlagos — 29/08/2026

**Fonte:** Google Sheets `1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8`, aba `Interlagos`, `sheetId` 272966393.

## Estrutura observada

A aba contém 30 colunas: `id`, `created_at`, `source`, `form_slug`, `name`, `email`, `phone_e164`, `interest_model`, `version`, `state`, `city_tag`, `city_label`, `dealership_slug`, `dealership_label`, `contact_pref`, `observacao_extra`, `page`, `extra_tags`, `consent`, `consent_at`, `zendesk_ticket_id`, `bbro_lead_id`, `exported_at`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_creative` e `utm_target`.

## Tipos de registro identificados

| Formulário | Dados de localização/dealer | Modelos observados | Observação |
|---|---|---|---|
| `festival-interlagos` | `state`, `city_label` e `dealership_label` preenchidos | `cyberster`, `mg4`, `mg4_urban` | Lead de interesse geral no Festival Interlagos. |
| `agenda-test-drive-interlagos` | localização e dealer vazios na amostra | `xpower`, `im6` | A data/horário do test drive aparece em `observacao_extra`. |

## Mapeamento candidato

| Campo mestre | Coluna Interlagos |
|---|---|
| Data | `created_at` |
| Modelo | `interest_model` |
| Região/Estado | `state` |
| Cidade | `city_label` |
| Concessionária | `dealership_label`, preservada exatamente como na origem |
| Nome | `name` |
| Email | `email` |
| Telefone | `phone_e164` |
| Canal | valor fixo `Interlagos` |

Os valores `xpower` e `im6` precisam ser tratados explicitamente para que os registros de test drive não sejam descartados pela normalização de modelos existente. A amostra também contém múltiplos registros com o mesmo telefone e e-mails diferentes, que devem passar pelas regras oficiais de deduplicação sem tratamento manual.

## Resultado da integração

A aba apresentou **131 linhas**, todas aceitas no consolidador e sem erros próprios. A distribuição consolidada foi: 66 Cyberster, 19 MGS5, 17 MG4, 11 MG4 Urban e 18 registros de agenda sem modelo canônico, classificados como `Indisponível` para preservar os Leads sem inventar uma categoria de produto.

Na base analítica, **Interlagos totalizou 131 Leads**, distribuídos em 4 no dia 26/08, 34 no dia 27/08 e 93 no dia 28/08. Os 11 registros de MG4 Urban mantêm `Interlagos` como canal de origem e são redistribuídos corretamente para Interlagos na visualização por canal. A base do dashboard passou de 24.014 para **24.573 registros**, com 559 novos registros totais detectados na planilha desde a atualização anterior. A segunda execução retornou `NO_CHANGES` e zero novos registros.

A reconciliação do snapshot pós-importação fechou em 24.573 para canais, modelos, regiões, dealers e série diária. A validação técnica foi aprovada com **317 testes**, TypeScript e build de produção.
