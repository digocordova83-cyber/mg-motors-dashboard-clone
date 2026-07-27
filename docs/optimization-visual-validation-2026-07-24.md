# Validação visual — Cadência de otimizações e negativas

Data: 24/07/2026
Ambiente: prévia autenticada do projeto, conta administrativa `rodrigo`

## Otimizações — desktop

- A aba `Otimizações` abre autenticada e preserva o cabeçalho, filtros e cards existentes.
- O cabeçalho do ciclo exibe simultaneamente o total de tarefas (`148 tarefa(s)`) e a nova contagem de elegibilidade (`34 elegível(is)`).
- A grade de cards permanece em três colunas no viewport desktop, sem overflow horizontal do documento na área inicialmente visível.
- Os controles `Sincronizar tarefas sugeridas`, `Gerar novo ciclo`, filtros por status e busca continuam visíveis e utilizáveis.
- A prévia real não mostrou `Em observação` nos cards Sem Marca. A auditoria somente leitura do banco confirmou que isso não era ausência de dado: `MG_Marca_SEM_SP` teve uma ação de CPA concluída em 21/07/2026 às 17:50 UTC e `MG_Marca_SEM_SCS` em 21/07/2026 às 16:35 UTC, mas novas tarefas CPA foram abertas em 22/07, 23/07 e 24/07 e continuaram executáveis no ciclo ativo.
- No ciclo ativo existem quatro pendências da família CPA para cada campanha Sem Marca, resultantes de assinaturas/valores sucessivos e transferências legadas. O histórico deve ser preservado, porém a fila operacional precisa mostrar apenas uma tarefa canônica por campanha+família e colocá-la em quarentena até 28/07/2026; as demais devem ser tratadas como duplicatas legadas não executáveis.
- A lacuna estava entre as camadas: o payload de recomendações calculava cooldown, enquanto o workspace de tarefas abertas não expunha elegibilidade e os endpoints de início/conclusão não aplicavam a regra.
- Após a correção, a auditoria real classificou `MG_Marca_SEM_SP` com a tarefa canônica `#1950050` em `COOLDOWN`, 5 dias restantes, bloqueada pela conclusão `#1`, e três duplicatas legadas (`#1950095`, `#1950132`, `#1950148`). `MG_Marca_SEM_SCS` ficou com a tarefa canônica `#1950053` em `COOLDOWN`, 4 dias restantes, bloqueada pela conclusão `#2`, e três duplicatas legadas (`#1950097`, `#1950135`, `#1950150`).
- As duplicatas continuam persistidas para auditoria no Histórico, mas foram marcadas como `LEGACY_DUPLICATE`; apenas o card canônico permanece na fila operacional, sem controles de execução até o término da janela.
- Validação autenticada pós-correção: a aba renderizou sem erros e resumiu `110 tarefa(s) operacional(is)`, `101 tarefa(s) executável(is)`, `6 em observação` e `38 duplicata(s) legada(s) consolidada(s)`.
- Ao filtrar `MG_Marca_SEM`, a fila mostrou somente os cards canônicos `#1950053` (SCS, 4 dias) e `#1950050` (SP, 5 dias), ambos liberados em 28/07/2026. Os cards exibem `Quarentena de CPA` e `Execução temporariamente bloqueada`; não há textarea nem botão `Concluir e registrar snapshot` nesses dois cards.
- A primeira tentativa autenticada detectou uma regressão `RangeError: Invalid time value` porque o formatador de datas diárias recebia uma ISO completa. O timestamp agora é reduzido a `YYYY-MM-DD` antes da formatação; a página foi recarregada e validada com sucesso.
- A aba Histórico autenticada continuou renderizando os 388 registros persistidos, com eventos, ciclos e métricas observacionais intactos. A seção `Negativas efetivamente aplicadas` permanece separada, filtrável por termo/campanha/responsável e período, e explica que o registro é criado na conclusão da tarefa sem exigir relatório manual separado.
- O filtro `MG_Marca_SEM` retornou 20 de 388 tarefas, incluindo as variações legadas `#1950095` (SP), `#1950097` (SCS), `#1950132` (SP) e `#1950135` (SCS), além dos registros canônicos e dos ciclos anteriores. Isso confirma que a consolidação afeta somente a fila operacional e não apaga a trilha de auditoria.
- O redimensionamento direto da janela de automação preservou `innerWidth=1280`; portanto, ele não foi usado como evidência mobile. A inspeção móvel foi feita em um iframe autenticado isolado com `innerWidth=390` e `innerHeight=844`.
- No contexto móvel, `documentClientWidth=380`, `documentScrollWidth=380` e `horizontalOverflow=false`; o cabeçalho, filtros, cards e faixa de observação se reorganizaram em uma coluna sem ampliar a largura do documento.
- Com o filtro `MG_Marca_SEM` aplicado no viewport móvel, SP e SCS permaneceram visíveis; o DOM apresentou duas mensagens `Execução temporariamente bloqueada`, zero botões `Concluir e registrar snapshot`, zero textareas e continuou sem overflow horizontal.

## Evidências

- Captura de Otimizações autenticada: `/home/ubuntu/screenshots/3000-ilpwlhhroq573de_2026-07-24_17-11-27_7907.webp`.
- Conteúdo extraído da página: `/home/ubuntu/page_texts/3000-ilpwlhhroq573depyl3y7-82f471c4.us2.manus.computer__tab_optimizations.md`.
