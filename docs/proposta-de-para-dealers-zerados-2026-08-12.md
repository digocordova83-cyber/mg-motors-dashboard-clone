# Proposta de de-para — dealers com Leads zerados

**Status:** somente para validação; nenhuma alteração aplicada.  
**Período auditado:** 01 a 11/08/2026.  
**Critério:** correspondência explícita de marca/unidade + cidade/UF; nomes brutos permanecem preservados na base.

| Dealer da meta | Nome bruto existente na base | Cidade/UF comprovada | Leads recuperáveis | Confiança |
| --- | --- | --- | ---: | --- |
| AUTOBRAND RECIFE | `Autobrand Recife - Recife/PE` | Recife/PE no próprio nome | 91 | Alta |
| AUTOMEC SOROCABA | `automec_sorocaba_-_sorocaba/sp` | Sorocaba/SP | 9 | Alta |
| AUTOMEC SOROCABA | `Automec Sorocaba - Sorocaba/SP` | Sorocaba/SP no próprio nome | 1 | Alta |
| BALTIC GUARULHOS | `baltic_guarulhos_-_guarulhos/sp` | Guarulhos/SP | 7 | Alta |
| EUROVILLE JUIZ DE FORA | `euroville_juiz_de_fora_-_juiz_de_fora/mg` | Juiz de Fora/MG | 11 | Alta |
| EUROVILLE UBERLANDIA | `euroville_uberlandia_-_uberlândia/mg` | Uberlândia/MG | 6 | Alta |
| HG ARACAJU | `hg_aracaju_-_aracaju/se` | Aracaju/SE | 22 | Alta |
| JAVEP/SP | `javep_-_bauru/sp` | Bauru/SP | 11 | Alta |
| LA FONTAINE JOINVILLE | `la_fontaine_joinville_-_joinville/sc` | Joinville/SC | 7 | Alta |
| SAVOL ZL/SP | `savol_zl_-_são_paulo/sp` | São Paulo/SP | 3 | Alta |

## Impacto esperado se aprovado

Os nove dealers deixam de aparecer zerados. O total conciliado aumenta em **168 Leads**, de **3.255 para 3.423**, e o atingimento geral de Leads passa de **27,13% para 28,53%**. Sales e metas não são alteradas.

| Dealer | Leads atuais | Leads após de-para | Meta | Atingimento esperado |
| --- | ---: | ---: | ---: | ---: |
| AUTOBRAND RECIFE | 0 | 91 | 153 | 59,47% |
| AUTOMEC SOROCABA | 0 | 10 | 153 | 6,53% |
| BALTIC GUARULHOS | 0 | 7 | 153 | 4,57% |
| EUROVILLE JUIZ DE FORA | 0 | 11 | 153 | 7,18% |
| EUROVILLE UBERLANDIA | 0 | 6 | 153 | 3,92% |
| HG ARACAJU | 0 | 22 | 153 | 14,37% |
| JAVEP/SP | 0 | 11 | 153 | 7,18% |
| LA FONTAINE JOINVILLE | 0 | 7 | 153 | 4,57% |
| SAVOL ZL/SP | 0 | 3 | 153 | 1,96% |

> A proposta altera somente a camada de conciliação analítica. Os valores originais de `Concessionária`/`dealerRaw` não serão reescritos.
