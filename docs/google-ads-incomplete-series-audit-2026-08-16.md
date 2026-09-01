# Auditoria da série incompleta do Google Ads — 16/08/2026

## Sintoma

O filtro de 30 dias para `2026-07-17` a `2026-08-15` exibia somente três dias, de 17 a 19 de julho, com 204 linhas.

## Causa raiz confirmada

O serviço filtrava a integração pelo nome exato `MG Motors`. A conta oficial continua com o ID estável `535-798-6801`, mas o campo retornado atualmente pela fonte é `MG Motor` no singular. Como `account_name` é descritivo e não único, a consulta pelo nome recuperou apenas o histórico anterior à mudança de rótulo. A normalização também descartava linhas cujo nome não fosse exatamente `MG Motors`.

## Evidência independente

A conta `535-798-6801`, consultada diretamente pelo conector Windsor para `2026-07-17` a `2026-08-15`, retornou:

| Controle | Resultado |
|---|---:|
| Linhas | 2.058 |
| Dias distintos | 30 |
| Primeira data | 17/07/2026 |
| Última data | 15/08/2026 |
| Campanhas | 70 |
| Investimento | R$ 349.551,4642 |
| Conversões | 6.836,6921 |
| Cliques | 388.234 |
| Impressões | 4.762.301 |
| `account_name` retornado | `MG Motor` |
| `datasource` | `google_ads` |

O catálogo de campos confirmou que `account_id` é um campo válido e representa o identificador da conta Google Ads. A correção deve usar esse identificador estável, aceitar o nome apenas como metadado e rejeitar respostas cuja data máxima não alcance o fim solicitado.

## Controles obrigatórios da correção

1. Consultar e filtrar pela conta `535-798-6801` usando `account_id`.
2. Preservar `account_name` como rótulo, sem utilizá-lo como chave de identidade.
3. Validar a cobertura de datas antes de persistir ou apresentar uma resposta ao vivo.
4. Não substituir snapshot completo por resposta parcial.
5. Adicionar regressões para mudança de nome e resposta truncada.
