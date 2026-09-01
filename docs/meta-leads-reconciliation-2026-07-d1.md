# Reconciliação Meta Ads × base de Leads — julho de 2026, corte D-1

## Escopo e fontes

A reconciliação foi executada para a conta **Ag. BBRO - MG Motor Brasil - AUT** (`act_1418731006678061`), no período de **1º a 21 de julho de 2026**, correspondente ao fechamento D-1 disponível em 22 de julho. O total do Meta Ads foi consultado pela conexão nativa da plataforma e usa a métrica oficial **Leads** (`actions:lead`). O total da base foi apurado diretamente na tabela `leads`, usando `correctedDate` como data de referência e `channel = 'Meta'` como recorte equivalente.

> A definição oficial retornada pela conexão nativa descreve **Leads** como o número de leads atribuído aos anúncios, com base nas informações recebidas das Ferramentas Comerciais da Meta conectadas ou em eventos ocorridos diretamente nas tecnologias da Meta.

A API nativa não retornou dados entre 1º e 13 de julho. Os dois conjuntos comparáveis começam em 14 de julho, eliminando a hipótese de que a diferença decorra de períodos distintos.

## Reconciliação diária

| Data | Base de Leads — canal Meta | Meta Ads — Leads | Diferença base − Meta Ads |
|---|---:|---:|---:|
| 14/07/2026 | 74 | 71 | +3 |
| 15/07/2026 | 108 | 110 | −2 |
| 16/07/2026 | 141 | 126 | +15 |
| 17/07/2026 | 327 | 320 | +7 |
| 18/07/2026 | 441 | 442 | −1 |
| 19/07/2026 | 350 | 357 | −7 |
| 20/07/2026 | 290 | 286 | +4 |
| 21/07/2026 | 278 | 277 | +1 |
| **Total** | **2.009** | **1.989** | **+20** |

A diferença de 20 não está concentrada em um único dia. Ela resulta do saldo de diferenças positivas e negativas ao longo dos oito dias comparáveis, com maior contribuição líquida em 16 e 17 de julho.

## Campanha e regra de atribuição

O detalhamento nativo retornou **uma única campanha** no período: `Jul/26 | Jul/26 | FB IG | Cadastro` (`120249360911300303`), responsável pelos **1.989 Leads** atribuídos. A base de Leads não contém `campaign_id`, nome de campanha, conjunto, anúncio ou identificador do evento Meta em seu `rawPayload`; ela contém apenas data, canal, modelo, localidade, concessionária e dados de contato. Portanto, os 2.009 registros recebidos no CRM não podem ser associados individualmente à campanha sem uma chave compartilhada — qualquer tentativa de fazê-lo seria uma inferência não comprovada.

A causa comprovável é uma **diferença de escopo de mensuração**. O Meta Ads contabiliza eventos atribuídos aos anúncios conforme sua regra de atribuição, enquanto a base contabiliza linhas de Leads recebidas e classificadas pelo canal informado na origem. Esses universos são próximos, mas não são registros transacionalmente conciliáveis sem `lead_id` ou `event_id` compartilhado.

## Verificação obrigatória do canal Site

No mesmo período, a base contém **3.866 registros no canal `Site`**, mantidos separadamente dos **2.009 registros no canal `Meta`**. A campanha nativa do Meta Ads não aparece como dimensão na base e, por isso, não existe evidência que autorize somar `Site` ao total Meta. A análise agregada encontrou 87 registros Meta com email ou telefone também presentes em registros Site; esse volume não corresponde à diferença de 20 e não sustenta uma reclassificação.

Também foram testadas duplicidades internas no canal Meta. Há 26 linhas excedentes quando se deduplica por par email–telefone em todo o período e 9 linhas excedentes quando a deduplicação é limitada ao mesmo dia. Como nenhum desses valores corresponde a 20, a discrepância não pode ser explicada por uma regra simples de deduplicação.

## Decisão para o painel

Não foi demonstrado erro de filtro, período ou soma no painel. Por isso, **nenhum número foi alterado**. O painel deve continuar exibindo cada fonte segundo sua própria semântica: **1.989 Leads atribuídos no Meta Ads** e **2.009 registros recebidos na base com canal Meta**, com diferença líquida de **20** no período. Uma reconciliação individual exigirá que a próxima exportação da base inclua ao menos `campaign_id` e um identificador compartilhado de lead ou evento.

## Evidências técnicas

| Evidência | Resultado |
|---|---|
| Conta Meta selecionada nativamente | `act_1418731006678061` |
| Período D-1 | 01/07/2026 a 21/07/2026 |
| Métrica nativa | **Leads** (`actions:lead`) |
| Total nativo por campanha | 1 campanha; 1.989 Leads |
| Total da base, canal Meta | 2.009 registros |
| Total da base, canal Site | 3.866 registros |
| Diferença reconciliada | +20 registros na base |
| Chave individual compartilhada | Ausente |
| Alteração de código necessária | Não |
