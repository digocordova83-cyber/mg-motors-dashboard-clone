# Plano de Mídia e metas de concessionárias — outubro de 2026

**Atualização:** 02/10/2026, fuso America/Sao_Paulo  
**Competência:** outubro de 2026

## Plano de Mídia

A aba **Plano de Mídia** passou a abrir outubro por padrão e mantém na mesma competência as duas frentes aprovadas: **Line-up** e **IM6**. Os valores foram transcritos dos quadros enviados, sem estimativa de realizado.

| Frente | Plano bruto | Comissão | Plano líquido | Leads projetados | CPL projetado |
|---|---:|---:|---:|---:|---:|
| Line-up — Media | R$ 750.000,00 | R$ 30.000,00 | R$ 720.000,00 | 8.844 | R$ 81,41 |
| IM6 — Media | R$ 260.000,00 | R$ 10.400,00 | R$ 249.600,00 | 2.079 | R$ 120,06 |
| **Total Digital + IM6** | **R$ 1.010.000,00** | **R$ 40.400,00** | **R$ 969.600,00** | **10.923** | **R$ 88,77** |

A frente Line-up contém Google Ads, Globo, Webmotors, Meta Ads via Publya e Mercado Livre Ads. A frente IM6 contém Forbes branded content, CNN TV, Meta Ads, Google Search e Webmotors. Forbes e CNN ficam corretamente sem projeção de Leads/CPL, porque a fonte define objetivos de autoridade e alcance, não geração de Leads.

## Metas por concessionária

A planilha `Planilhasemtítulo.xlsx` não possui as colunas Publya e TikTok. O importador foi ajustado para tratá-las como canais **opcionais**: se não forem informadas, entram como meta zero — sem inventar distribuição e sem impedir a importação de Google, Meta, Webmotors e Mercado Livre.

| Indicador | Resultado |
|---|---:|
| Linhas da fonte | 31 |
| Dealers ativos consolidados | 30 |
| Dealers sem correspondência | 0 |
| Meta total de Leads | 10.579 |
| Meta total de Retail | 591 |
| Meta Google | 2.237 |
| Meta Meta | 7.092 |
| Meta Webmotors | 796 |
| Meta Mercado Livre | 450 |
| Meta Publya | 0 |
| Meta TikTok | 0 |

A soma dos canais ficou quatro Leads abaixo do `TOTAL DEALER` por arredondamento presente na planilha de origem; o aviso permanece transparente na prévia. A primeira importação criou 30 registros consolidados e a reexecução retornou `NO_CHANGES`.

## Validações

- 359 testes automatizados aprovados.
- TypeScript aprovado.
- Build de produção aprovado.
- Totais de Line-up, IM6 e consolidado reconciliados com os quadros enviados.
