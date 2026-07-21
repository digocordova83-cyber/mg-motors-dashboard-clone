# Auditoria da atualização de Leads — 21/07/2026

## Escopo

O arquivo recebido é `pasted_file_4I0tJY_LEADSMG_CONSOLIDADO_FIEL-Sheet1.csv`, com SHA-256 `3e913d3fc98245eb3510b24eaf0fa1f8d1177f424ee95659f37122c80c48d1c0`, 1.160.655 bytes, 11 colunas e 7.611 linhas de dados. A auditoria foi feita somente com contagens agregadas; nomes, e-mails e telefones não foram expostos.

| Verificação | Resultado |
|---|---:|
| Linhas totais | 7.611 |
| Linhas válidas após a correção confirmada | 7.611 |
| Linhas corrigidas para 20/07/2026 | 224 |
| Linhas inválidas no CSV canônico | 0 |
| Ocorrências repetidas após a correção, preservadas como leads legítimos | 103 |
| Menor `Data Corrigida` válida | 30/06/2026 |
| Maior `Data Corrigida` válida | 20/07/2026 |
| Linhas em 20/07/2026 | 540 |
| Linhas posteriores a 20/07/2026 | 0 |

As **224 linhas originalmente sem `Data Corrigida`** pertencem ao canal `Site` e têm `########` na coluna `Data`. O usuário confirmou em 21/07/2026 que todas pertencem a **20/07/2026**. O CSV canônico preenche somente essas 224 células com `20/07/2026`, preserva todas as 7.611 linhas e não deduplica nenhuma ocorrência. Após a correção, o parser reconhece 7.611 linhas válidas, 0 inválidas e 540 registros no dia 20/07.

## Concessionárias

A coluna K, `Concessionarias corrijida`, está preenchida nas 7.611 linhas. Ela difere da coluna original `Concessionaria` em 3.689 linhas e contém 27 valores distintos. Os maiores volumes brutos são BARIGUI - CURITIBA (793), CONCESSIONÁRIA NÃO PREENCHIDA (772), DRSUL - PORTO ALEGRE (552), POTENZA - RECREIO (468) e INGLATERRA SHOPPING - SALVADOR/BA (428). O placeholder `CONCESSIONÁRIA NÃO PREENCHIDA` continuará sendo convertido para `Indisponível` na dimensão analítica.

Conforme orientação do usuário, a coluna K será a fonte canônica de `dealerName` e `dealerRaw` para a distribuição no dashboard. A coluna original será preservada em `rawPayload.dealer`, e o valor da coluna K também será mantido em `rawPayload.correctedDealer` para auditoria.

## Base anterior e estratégia de atualização

Antes da importação, a base ativa contém 7.071 leads, de 30/06/2026 a 19/07/2026, provenientes de um lote concluído. As contagens por data do novo CSV coincidem com a base anterior em todos os dias existentes e acrescentam 540 leads em 20/07/2026, incluindo as 224 datas confirmadas pelo usuário. Entretanto, como a coluna K corrige concessionárias em milhares de linhas, uma importação aditiva geraria dupla contagem.

A atualização será tratada como **substituição transacional da base consolidada**. O novo lote será validado e inserido integralmente; somente após confirmar as 7.611 inserções, os leads do lote anterior serão removidos dentro da mesma transação. Qualquer falha reverte toda a operação e mantém a base anterior. O arquivo anterior permanece preservado no histórico de importações e no armazenamento de origem.

## Webmotors

O dashboard manterá os registros históricos já existentes e exibirá um alerta explícito de que os dados da Webmotors ainda não foram recebidos para a atualização mais recente. O alerta não reclassifica nem remove leads históricos.

## Validação visual no preview

Fonte verificada: `https://3000-ilpwlhhroq573depyl3y7-82f471c4.us2.manus.computer/?module=leads` em 21/07/2026.

A interface autenticada exibiu **7.611 Leads na base ativa**, com cobertura de **30/06/2026 a 20/07/2026**. O filtro padrão do mês permaneceu de 01/07 a 20/07 e, por isso, mostrou 7.591 leads; os 20 registros restantes pertencem a 30/06. O alerta em inglês informou que os dados recentes da Webmotors ainda não foram recebidos e que os 878 registros históricos continuam visíveis. A distribuição por concessionária refletiu a coluna K, com 26 nomes válidos no período filtrado mais o grupo `Unavailable`, totalizando os 27 valores distintos da base.

## Validação móvel autenticada

Em viewport real de **390 × 844 px**, a sessão `mgmotors` exibiu o módulo Leads em inglês com `scrollWidth = clientWidth = 390`, confirmando ausência de overflow horizontal. O card da base mostrou **7.611 Leads** e cobertura até **20/07/2026**. O alerta `Recent Webmotors data pending` permaneceu legível e informou que os registros históricos continuam visíveis. A captura interna foi salva em `/home/ubuntu/webdev-static-assets/leads-webmotors-mobile-validation.png`.

## Correção final do intervalo — confirmação do usuário

Em 21/07/2026, o usuário confirmou que **todos os registros do arquivo pertencem ao intervalo de 01/07/2026 a 20/07/2026**. Por essa razão, as 20 linhas cuja data normalizada estava em 30/06/2026 foram corrigidas exclusivamente no campo `correctedDate` para 01/07/2026. Os valores brutos (`correctedDateRaw`, `sourceDateRaw` e `rawPayload`), IDs e hashes foram preservados para auditoria.

A reconciliação imediatamente posterior confirmou: **7.611 registros totais**, intervalo normalizado de **01/07/2026 a 20/07/2026**, **7.611 registros dentro do período** e **zero registros fora do intervalo**. Nenhuma linha foi adicionada, removida ou deduplicada.

## Validação visual após correção do intervalo

O preview autenticado em inglês foi validado novamente após a atualização das 20 datas. A área de Leads passou a exibir **7.611 Leads na base**, intervalo **01/07/2026 a 20/07/2026**, filtro padrão no mesmo período e card **Total Leads = 7.611**. O pacing mensal também reconciliou em **7.611 / 10.000**, sem registros fora do intervalo.
