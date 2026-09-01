# Validação visual verificável — módulo de Leads

## Escopo

Esta validação confronta a hierarquia observada nos quatro prints de referência, registrada em `leads_module_spec.md`, com a aba autenticada `?tab=leads` e com o componente `client/src/components/LeadsTab.tsx`. A verificação funcional foi feita com a base real consolidada de 6.972 Leads únicos no período oficial de `Data Corrigida`.

| Elemento da referência | Evidência na implementação | Resultado |
|---|---|---|
| Página interna em tema escuro | A aba usa fundo azul-preto, cartões `#0d1421`, bordas `#1e293b`, tipografia clara e acento vermelho MG, no mesmo shell do dashboard existente | Conforme |
| Atalhos 7d, 14d e Mês, além de intervalo personalizado | Os controles permanecem no cabeçalho compartilhado de `Home.tsx`; a aba aceita `dateFrom` e `dateTo` e identifica o campo oficial como `Data Corrigida` | Conforme, com 30d e 60d adicionais já existentes no produto |
| Ação de sincronização/atualização | O controle foi traduzido para **Atualizar CSV**, com seleção, validação prévia, confirmação e estados explícitos de progresso, sucesso e erro | Conforme à decisão funcional registrada |
| Primeira faixa com quatro KPIs | `LeadsTab.tsx` apresenta **Total de Leads**, **Média diária**, **Canal principal** e **Canais ativos**, em grade responsiva de quatro cartões | Conforme |
| Meta mensal com realizado, meta, progresso e ritmo | O painel **Pacing de Leads** mostra atual/meta, percentual, dias restantes, média real/dia, necessário/dia, projeção, diferença projetada, restante e dias fechados | Conforme e ampliado |
| Leads por canal ao longo do tempo | O painel usa barras diárias empilhadas por canal, calendário completo e linha de média móvel de 7 dias; todas as séries reconciliam com o total filtrado | Conforme e ampliado com tendência |
| Distribuição por canal | O painel lateral lista volume, média diária e participação de cada canal presente no CSV | Conforme |
| Visões por modelo e região | Dois painéis exibem apenas classificações reais; ausências regionais permanecem como **Indisponível** | Conforme |
| Resumo por concessionária | A interface mostra Top concessionárias e adiciona uma auditoria operacional completa com busca, ordenação, dias com/sem recebimento, primeira/última data e evolução diária | Complemento solicitado pelo usuário |
| Estados sem dados | Gráficos, listas, histórico e auditoria exibem mensagens explícitas, sem inventar categoria, valor ou série | Conforme |
| Tabelas extensas em telas estreitas | Auditoria e histórico usam rolagem horizontal interna (`overflow-x-auto`) e largura mínima própria, evitando expansão do documento | Conforme ao requisito responsivo |

## Evidência funcional observada

A aba carregou com **6.972 Leads únicos**, meta persistida de **10.000** para julho de 2026, seis canais ativos e auditoria reconciliada em **92 nomes válidos de concessionária**, **4.861 Leads atribuídos** e **2.111 registros indisponíveis**. A busca por `DRSUL - PORTO ALEGRE` reduziu a tabela de 92 para duas linhas, e a seleção de uma linha atualizou a evolução diária correspondente. A pré-validação de um CSV sanitizado exibiu uma linha válida, uma duplicata exata e uma linha inválida, sem executar a confirmação da importação.

## Divergências intencionais

A implementação preserva o shell real do dashboard MG Motors e, por isso, mantém também os atalhos de 30d e 60d. O texto de referência **Sync** foi substituído por **Atualizar CSV** para deixar a ação operacional inequívoca. A auditoria detalhada por concessionária não aparece nos prints originais; foi acrescentada como bloco complementar após pedido explícito, sem substituir os painéis de referência. O selo externo “Made with Manus” não foi reproduzido por não pertencer ao produto.

## Conclusão

A estrutura, a hierarquia, os cartões, os painéis analíticos, o tema visual e a tabela operacional correspondem à referência dentro do design system já estabelecido no dashboard. As diferenças são funcionais, documentadas e não alteram a leitura principal da página.

## Validação responsiva automatizada

A aba autenticada foi capturada em **390 × 844 px**, **768 × 1.024 px** e **1.440 × 1.000 px**. Nos três viewports, a URL permaneceu em `?tab=leads`, o total de 6.972 Leads e a auditoria por concessionária estavam presentes, e a largura rolável do documento foi exatamente igual à largura do viewport. Portanto, não houve overflow horizontal da página. Em mobile e tablet, três contêineres internos utilizam rolagem horizontal deliberada para preservar a legibilidade das tabelas; no desktop, nenhum contêiner precisou de rolagem.

| Viewport | Largura do documento | Overflow da página | Contêineres internos roláveis |
|---|---:|---|---:|
| Mobile, 390 px | 390 px | Não | 3 |
| Tablet, 768 px | 768 px | Não | 3 |
| Desktop, 1.440 px | 1.440 px | Não | 0 |

As evidências estão em `/home/ubuntu/leads-responsive-evidence/`, com screenshots completos e `responsive-metrics.json`.
