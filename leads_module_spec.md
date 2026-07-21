# Especificação do módulo de Leads

## Referência visual confirmada

Os quatro prints descrevem uma página interna em tema escuro intitulada **“Leads — Todos os Canais”**. A hierarquia começa com período selecionado, atalhos de **7d**, **14d** e **Mês**, intervalo personalizado e ação de atualização. A primeira faixa contém quatro indicadores: **Total de Leads**, **Média/Dia**, **Canal Principal** e **Canais Ativos**.

O painel seguinte é **Meta Mensal de Leads**, com meta, atual, média diária, projeção, classificação do ritmo, progresso acumulado e dias restantes. A referência utiliza meta de **10.000 leads** e diferencia visualmente o realizado, a necessidade diária e a projeção.

| Seção | Conteúdo confirmado | Comportamento previsto |
|---|---|---|
| Resumo executivo | Total, média/dia, canal principal e canais ativos | Recalcular conforme o período selecionado |
| Meta mensal | Meta, atual, percentual, média/dia, projeção, diferença e dias restantes | Usar a competência da data final e permitir edição protegida |
| Leads por Canal — Diário | Série temporal por Site, Webmotors, UOL, Mercado Livre, Proxy, Campanha Urban e Meta | Exibir apenas canais presentes nos dados; não criar séries artificiais |
| Distribuição por Canal | Composição proporcional por canal | Conciliar exatamente com o total do período |
| Resumo por Canal | Canal, leads, média/dia e participação | Incluir linha total e ordenar por volume |
| Leads por Modelo | Distribuição por modelo | Exibir indisponível quando o campo estiver ausente |
| Leads por Região | Distribuição regional | Usar apenas Região/Estado real do CSV |
| Tendência Diária | Total de leads por dia em todos os canais | Agregar cada lead uma única vez pela data de referência |
| Concessionárias | Não aparece nos prints, mas existe no CSV fornecido | Adicionar como análise operacional complementar, sem substituir os painéis de referência |

## Decisões de fidelidade

A implementação manterá o padrão visual já adotado pelo dashboard MG Motors, em vez de copiar literalmente dimensões ou elementos acessórios da captura. O controle “Sync” será traduzido para **Atualizar CSV**, com pré-validação e confirmação. Estados sem dados serão explícitos. Canais, modelos, regiões e concessionárias somente serão exibidos quando existirem nos registros importados.

## Elementos não reproduzidos

O selo “Made with Manus” visível no último print pertence ao ambiente da referência e não faz parte do módulo funcional. Áreas vazias dos gráficos foram tratadas como estados sem dados da captura, não como especificação de valores ou escalas fixas.

## Auditoria do CSV fornecido

O arquivo original contém **7.071 registros de dados** e dez colunas exatamente correspondentes a `Data`, `Modelo`, `Região/Estado`, `Cidade`, `Concessionaria`, `Nome`, `Email`, `Telefone`, `Canal` e `Data Corrigida`. O arquivo é UTF-8 com BOM e possui hash SHA-256 `b3780d7afba5b35eaeb80ea64a4004aa258bc7fe52bdc017f76bacddc91f000a`.

| Aspecto | Resultado verificado | Regra de implementação |
|---|---:|---|
| Período por Data Corrigida | 30/06/2026 a 19/07/2026, 20 dias distintos | Usar `Data Corrigida` como data oficial de todos os filtros e agregações |
| Data Corrigida inválida | 0 registros | Rejeitar linhas futuras sem data corrigida válida |
| Canais | 6 valores brutos | Normalizar grafia e capitalização, preservando o valor original para auditoria |
| Modelos | 4 valores, 100% de cobertura | Exibir análise por modelo diretamente |
| Região/Estado | 79,61% de cobertura; 65 grafias brutas | Normalizar nomes de UF de forma determinística e agrupar ausências como Indisponível |
| Cidade | 77,74% de cobertura | Exibir somente quando informada; não inferir pela concessionária |
| Concessionária | 100% preenchida, mas com placeholders operacionais | Classificar `whatsapp_`, `e-mail_` e `CONCESSIONÁRIA NÃO PREENCHIDA` como Indisponível sem apagar o valor bruto |
| Contato | Nome/e-mail/telefone têm cerca de 85% de cobertura | Armazenar normalizado, proteger a exibição e nunca usar contato isolado para contar ou deduplicar leads |
| Duplicatas exatas normalizadas | 99 linhas além da primeira, em 78 grupos | Deduplicar pelo hash de todos os campos normalizados |
| Repetição por contato/dia | Frequente | Preservar, pois pode representar nova conversão, novo canal ou novo roteamento; não deduplicar agressivamente |

Os canais brutos são **Site** (3.452), **Meta** (1.441), **Weebmotors** (878), **Campanha Urban** (847), **Mercado Livre** (325) e **Uol** (128). A interface normalizará `Weebmotors` para **Webmotors** e `Uol` para **UOL**, mantendo o texto bruto no registro importado.

Os modelos reais são **MG4** (5.100), **MG4 URBAN** (849), **MGS5** (658) e **CYBERSTER** (464). A coluna regional possui 1.442 ausências e grafias mistas como siglas, nomes completos e variações de caixa; será aplicada uma tabela fechada de correspondência para as 27 UFs, sem inferência por cidade ou concessionária.

## Contrato preliminar de idempotência

Cada arquivo terá um hash próprio para impedir reprocessamento acidental do mesmo conteúdo. Cada registro terá um `recordHash` calculado sobre os dez campos normalizados. A restrição única de `recordHash` impedirá duplicatas exatas entre o mesmo lote e cargas futuras, ao mesmo tempo que preservará registros semelhantes com timestamp, canal, modelo, região, cidade, concessionária ou contato diferentes.

A coluna `Data` contém formatos heterogêneos: 4.299 timestamps ISO, 878 datas em formato brasileiro, 1.441 datas abreviadas com ano de dois dígitos, 128 textos localizados em português e 325 timestamps textuais com fuso do Chile. Como `Data Corrigida` possui 100% de validade e nenhuma divergência de dia entre os valores diretamente comparáveis, ela será a referência oficial. O importador preservará `Data` integralmente em `sourceDateRaw` e só preencherá `sourceTimestamp` quando um parser determinístico reconhecer o formato sem ambiguidade.
