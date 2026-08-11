# Análise Executiva — Dossiê de Qualidade de Leads MG Barigui

**Autor:** Manus AI  
**Data:** 11 de agosto de 2026  
**Escopo:** MG Barigui Curitiba e Florianópolis; julho e 1º a 9 de agosto de 2026

## Conclusão executiva

O dossiê deve ser tratado como um **alerta operacional legítimo**, porque apresenta capturas de atendimento, tickets e dados estruturados que permitem rastrear casos concretos de contato inválido, baixa intenção, duplicidade e possível roteamento geográfico inadequado.[1] Entretanto, ele **não comprova sozinho uma deterioração sistêmica da qualidade dos Leads**, pois foi montado com casos selecionados, sem informar o total auditado, a regra de seleção, o número de tentativas de contato ou a taxa de incidência de cada problema.

O confronto com o dashboard confirmou **12 registros relacionados aos contatos exibidos**, sendo **11 atribuídos à Barigui** e um à DRSul. Todos os exemplos principais foram localizados na base. Os 11 registros Barigui representam **0,49%** dos 2.221 Leads atribuídos ao grupo no período; oito deles estão em agosto e equivalem a **1,98%** dos 403 Leads Barigui entre 1º e 9 de agosto.[2] Esses percentuais são apenas a participação dos exemplos apresentados, e **não uma taxa de Leads ruins**, porque o dossiê não declara ter auditado a população inteira.

> **Síntese:** os problemas mostrados são reais; a generalização para toda a operação ainda não é estatisticamente sustentada.

## O que o documento comprova

O material contém evidências suficientes para validar quatro tipos de ocorrência. Elas devem ser tratadas separadamente, pois possuem causas e soluções distintas.

| Categoria | Evidência observada | Avaliação |
| --- | --- | --- |
| **Baixa intenção ou uso indevido** | Mensagens sobre joia/diamante, Robux/Roblox e Free Fire; contato de criança; cliente alegando não ter solicitado compra de veículo | **Comprovada nos casos documentados** |
| **Contato inválido** | Ticket classificado como número incorreto | **Comprovado no caso documentado** |
| **Duplicidade operacional** | Mesmo contato, data, telefone e email em Site e Campanha Urban | **Comprovada no caso documentado** |
| **Roteamento geográfico** | Leads de AP, ES, DF, AC, SP, AL e AM atribuídos à Barigui Curitiba/Florianópolis | **Comprovado como distribuição fora de PR/SC; inadequação depende da política de roteamento** |

O caso de duplicidade entre Site e Campanha Urban permanece como duas oportunidades na base porque a identidade técnica atual considera, entre outros campos, **modelo e canal**. Assim, duas linhas com o mesmo contato podem ser mantidas quando chegam por canais/modelos diferentes.[4] Isso é coerente com a deduplicação exata implementada, mas não cobre a necessidade comercial de sinalizar **duplicidade provável entre canais**.

## O que o documento não comprova

O dossiê não informa quantos Leads foram efetivamente contatados, quantos tiveram retorno válido, qual foi o tempo de atendimento ou qual critério formal separa “sem resposta”, “número incorreto”, “sem intenção”, “menor de idade”, “duplicado” e “roteamento inadequado”. Também não apresenta taxa de problema por canal nem compara a Barigui com a rede.

Por isso, não é possível concluir a partir desse material que **Site**, **Campanha Urban** ou qualquer outro canal tenha qualidade inferior. O Site aparece na maior parte dos exemplos, mas também é o principal canal da Barigui no período. Sem um denominador de ocorrências por canal, a comparação seria enviesada.

## Confronto com o dashboard

Entre 1º de julho e 9 de agosto, o dashboard contém **2.221 Leads atribuídos à Barigui**: 1.818 em julho e 403 entre 1º e 9 de agosto.[2]

| Canal | Leads no período completo | Leads de 1º a 9 de agosto |
| --- | ---: | ---: |
| Site | 1.159 | 161 |
| Meta | 704 | 150 |
| Campanha Urban | 89 | 58 |
| Webmotors | 152 | 17 |
| Mercado Livre | 67 | 17 |
| UOL | 50 | 0 |
| **Total** | **2.221** | **403** |

No período completo, Site representa **52,18%** dos Leads da Barigui, Meta **31,69%** e Campanha Urban **4,00%**. No recorte de agosto, Site responde por **39,95%**, Meta por **37,22%** e Campanha Urban por **14,39%**.[2]

O dado quantitativo que mais merece investigação é a geografia. Dos 2.221 Leads, **735 (33,09%)** estão fora de PR/SC. Entre 1º e 9 de agosto, são **136 de 403 (33,74%)**.[2] Isso não prova erro automaticamente: pode refletir uma regra comercial de distribuição nacional. Porém, se a Barigui só deveria receber sua área de atuação, há um problema de roteamento relevante e mensurável.

O relatório semanal mais recente registra **14 Vendas no Varejo para Barigui Florianópolis e 2 para Barigui Curitiba na Semana 2**, totalizando 16.[3] Não foi calculada uma taxa de conversão específica neste documento porque a janela de vendas e a janela de Leads não são perfeitamente equivalentes; misturá-las geraria uma conclusão imprecisa.

## Limitações metodológicas

| Limitação | Consequência |
| --- | --- |
| Casos selecionados sem regra de amostragem | Não permite estimar incidência populacional |
| Ausência do total de Leads trabalhados no CRM | Não permite calcular taxa válida ou inválida |
| Motivos de perda não padronizados | Mistura causas diferentes em “Lead ruim” |
| Sem taxa por canal, modelo e dealer | Não permite responsabilizar uma fonte específica |
| Sem registro de tentativas e SLA | Não permite separar qualidade de Lead de qualidade de atendimento |
| Geografia sem política de distribuição declarada | Não permite classificar automaticamente toda distância como erro |

## Recomendações práticas

### 1. Implantar uma taxonomia única de qualidade

Cada Lead trabalhado pela concessionária deve terminar com um motivo estruturado: **válido/com interesse**, **sem resposta**, **número incorreto**, **nega interesse**, **menor/jogo/spam**, **duplicado**, **fora da área**, **já cliente** ou **outro com justificativa**. Texto livre deve ser complementar, não o único registro.

### 2. Medir taxa de qualidade com denominador completo

A Barigui deve devolver o status de **todos os 403 Leads de 1º a 9 de agosto**, e não apenas os casos negativos. A taxa deverá ser calculada por canal, modelo, loja e motivo. Até essa devolutiva completa, os exemplos devem ser tratados como **ocorrências confirmadas**, não como percentual de qualidade.

### 3. Criar uma sinalização de duplicidade provável

Além da deduplicação exata atual, recomenda-se criar uma camada de auditoria que sinalize o mesmo telefone ou email em uma janela de até sete dias, especialmente quando aparecer em Site e Campanha Urban. A sinalização deve **preservar os registros de origem** e não apagar automaticamente oportunidades, pois contatos iguais podem representar intenções distintas.

### 4. Revisar a política de roteamento geográfico

É necessário confirmar se a distribuição nacional para Barigui é intencional. Se não for, deve-se definir uma matriz oficial de UF/cidade por dealer e medir semanalmente a taxa de Leads fora da área. O dashboard já possui região, cidade e dealer suficientes para essa auditoria.[2]

### 5. Adicionar um painel de qualidade ao dashboard

O painel deve mostrar, por dealer e canal, volume bruto, Leads trabalhados, Leads válidos, taxa de contato, motivos de invalidação, duplicidade provável, fora da área e conversão. A recomendação é exibir **volume bruto e volume qualificado lado a lado**, sem apagar retroativamente a origem.

## Próximo passo recomendado

Solicitar à Barigui uma planilha estruturada dos 403 Leads de agosto com **ticket, data, dealer, canal, telefone/email mascarados, número de tentativas, status final e motivo padronizado**. Com essa base, será possível calcular uma taxa real de qualidade e determinar se o problema está concentrado em Site, Campanha Urban, geografia, formulário ou tratamento comercial.

Até essa etapa, a resposta correta é reconhecer os casos, abrir uma auditoria conjunta e evitar conclusões como “os Leads da campanha são ruins” ou reduzir mídia com base apenas no dossiê.

## Referências

[1]: file:///home/ubuntu/upload/pasted_file_9IsUqv_DossiêQualidadedeleads–ConcessionáriaMGBarigui.pdf "Dossiê: Qualidade de Leads — Concessionária MG Barigui"
[2]: https://mgmotors.bbro.com.br/?module=leads "MG Motors — Dashboard de Leads"
[3]: https://mgmotors.bbro.com.br/?module=sales "MG Motors — Vendas Semanais"
[4]: file:///home/ubuntu/mg-motors-dashboard-clone/server/leadsCsv.ts "Regra de normalização e deduplicação de Leads"
