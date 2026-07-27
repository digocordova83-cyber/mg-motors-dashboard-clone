# Auditoria final do inventário de criativos Meta Ads

**Autor:** Manus AI  
**Data de validação:** 24/07/2026

## Resumo executivo

A entrega foi ajustada ao escopo confirmado pelo usuário: **exibir todos os anúncios Meta acessíveis pela conexão atual e sinalizar que estão desativados no momento**. A implementação do Google Ads foi retirada desta versão e sua auditoria foi preservada apenas como referência futura.

> **Cobertura integral, nesta entrega, significa:** todos os anúncios retornados para a conta Meta conectada, inclusive objetos sem gasto, impressão ou insight no intervalo selecionado. O termo não inclui objetos removidos, contas sem permissão ou mídias que a própria fonte não disponibiliza.

A coleta autenticada retornou **40 anúncios**, associados a **34 IDs de criativo**. Nenhum anúncio possuía campanha, conjunto e anúncio simultaneamente ativos. Todos os 40 tinham pelo menos uma prévia disponível; por isso, a interface informa **40 desativados**, **0 ativos**, **40 com prévia** e **0 sem prévia**.

## Fonte e critério operacional

A conta validada foi **Ag. BBRO - MG Motor Brasil - AUT**, identificador `act_1418731006678061`. A referência do conector Meta documenta os campos de status efetivo, identidade do criativo, imagem, thumbnail, mídia efetiva do Instagram, permalink, prévias e especificação da publicação usados na auditoria.[1]

Um anúncio é classificado como **ativo** somente quando a cadeia inteira está ativa: campanha, conjunto e anúncio. Se qualquer nível estiver pausado, o card recebe o motivo operacional correspondente. Investimento ou impressão no período são métricas históricas e não substituem o status atual.

| Evidência conciliada | Resultado em 24/07/2026 |
| --- | ---: |
| Anúncios acessíveis | 40 |
| IDs de criativo únicos | 34 |
| Cadeia integralmente ativa | 0 |
| Anúncios desativados | 40 |
| Anúncios com prévia | 40 |
| Anúncios sem prévia | 0 |
| Mídia efetiva classificada como imagem | 36 |
| Mídia efetiva classificada como carrossel | 4 |
| Cartões internos identificados sem URL individual | 12 |

A consulta operacional usa inclusão explícita de objetos sem insights e limite elevado de linhas. A deduplicação ocorre por anúncio, preservando anúncios distintos que reutilizam o mesmo `creative_id`. Dessa forma, os **40 anúncios** permanecem auditáveis sem transformar os **34 criativos únicos** em uma contagem artificialmente maior ou menor.

## Implementação entregue

O inventário foi desacoplado dos KPIs históricos do Meta para evitar que um erro de mídia bloqueie o restante do dashboard. O backend possui consulta própria, contrato tipado, cache persistente separado, deduplicação de requisições concorrentes e fallback para o último snapshot validado. A rota é protegida pela autenticação já existente e não expõe credenciais ao navegador.

| Camada | Comportamento entregue |
| --- | --- |
| Coleta | Inclui anúncios sem insights e não depende do intervalo de desempenho |
| Status | Persiste campanha, conjunto e anúncio; deriva um único estado operacional |
| Formato | Usa mídia efetiva e especificação da publicação, sem inferir vídeo por thumbnail |
| Mídia | Preserva capa, permalink e prévias disponíveis; não armazena arquivos localmente |
| Deduplicação | Mantém um registro por anúncio e contabiliza IDs de criativo separadamente |
| Cache | Usa fonte ao vivo quando disponível e snapshot anterior somente como contingência sinalizada |
| Interface | Exibe totais, atualização, busca, filtros, cards progressivos e motivo da desativação |

A interface substitui o ranking limitado anterior pelo **Inventário completo de criativos**. Os cards mostram campanha, conjunto, anúncio, IDs, formato, métricas do período, status e links disponíveis. Quando nenhum item está ativo, o módulo apresenta o aviso geral **“Criativos desativados no momento”**.

## Carrosséis e limitações declaradas

A fonte retornou quatro anúncios classificados como `CAROUSEL_ALBUM`. Os detalhes disponíveis identificaram 12 cartões internos, porém sem URL individual de imagem. A aplicação conserva a capa e o permalink do anúncio, lista os cartões identificáveis e informa a limitação; ela **não duplica a capa** para simular mídias que a fonte não forneceu.

As URLs de prévia podem ser temporárias e alguns formatos não expõem o arquivo original. Se uma futura resposta vier sem URL, o anúncio continuará no inventário e aumentará o indicador **sem prévia**, em vez de desaparecer da contagem.

## Validação autenticada e técnica

A rota `/?module=meta-ads` foi inspecionada com a sessão autenticada. No desktop, o grid renderizou três cards por linha e a primeira página mostrou 12 de 40 anúncios, com carregamento progressivo dos restantes. O fluxo foi acionado até renderizar os **40 links de publicação**.

No viewport móvel isolado de **390 × 844 px**, a largura útil e a largura rolável permaneceram em 380 px, sem overflow horizontal. Cada card ocupou 348 px. Resumo, indicadores, busca e filtros foram reorganizados em coluna, e o filtro `Ativos` apresentou corretamente o estado vazio antes de a visualização completa ser restaurada.

| Verificação | Resultado |
| --- | --- |
| Suítes Vitest | 41 arquivos aprovados |
| Testes automatizados | 218 de 218 aprovados |
| TypeScript | `tsc --noEmit` aprovado |
| Build de produção | Vite e bundle do servidor concluídos |
| Logs após validação | Nenhum erro novo no servidor ou navegador |
| Desktop autenticado | Aprovado |
| Mobile autenticado | Aprovado, sem overflow horizontal |

## Escopo futuro do Google Ads

A auditoria encontrou 66 grupos Performance Max habilitados, mas a conexão atual não expõe os vínculos entre grupos e arquivos visuais. Também não havia campanhas Display ou YouTube ativas na fotografia consultada. Por decisão do usuário, a aba de criativos Google Ads ficou fora desta versão; afirmar cobertura integral com a fonte atual seria incorreto.

## Referências

[1]: https://windsor.ai/data-field/facebook/ "Windsor.ai — Facebook Ads Field Reference"
[2]: https://windsor.ai/connectors/facebook-ads/ "Windsor.ai — Facebook Ads Connector"
