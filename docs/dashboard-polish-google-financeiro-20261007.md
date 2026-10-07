# Aperfeiçoamento visual — Google Ads e Portal Financeiro

**Data:** 07/10/2026  
**Escopo:** visualizações adicionais no dashboard operacional, sem alterar as bases canônicas de Leads, investimentos ou permissões.

## Entregas

### Google Ads

- Adicionado o painel **Impressões por Dispositivo** na visão geral de Google Ads.
- A distribuição usa consulta real ao Windsor.ai, filtrada pela conta MG Motors e pelo período selecionado no dashboard.
- A consulta usa os campos `device`, `impressions`, `clicks`, `spend`, `conversions` e `date`.
- O painel mostra gráfico de rosca, participação por dispositivo, impressões totais, dispositivo líder e cliques. Não há percentuais inventados.
- Para a validação de 01 a 06/10/2026, o Windsor retornou 930.977 impressões, com Mobile em 84,6%, Desktop em 10,3%, TV conectada em 3,4% e Tablet em 1,7%.
- O retorno fica em cache por até 10 minutos somente para evitar consultas repetidas; o indicador visual identifica quando o resultado é ao vivo ou cacheado.

### Portal Financeiro (`/financeiro`)

- Mantidos os logos, a visão consolidada e as abas individuais de Webmotors e Mercado Livre.
- Adicionados, para cada parceiro selecionado:
  - gráfico de barras de **Leads por dia** na competência escolhida;
  - gráfico horizontal de **mix de modelos**;
  - estado vazio explícito quando o canal não possui Leads na competência, sem preencher dados artificiais.
- As séries são calculadas a partir da mesma base canônica de Leads do dashboard e preservam o filtro de mês já existente.
- Os gráficos não expõem PII: nome, e-mail, telefone e demais dados pessoais permanecem somente na tabela protegida pelo acesso financeiro.

## Cobertura e validação

- Criados testes para agregação de dispositivos Google Ads, séries mensais e mix de modelos no Portal Financeiro, além da presença dos novos painéis na interface.
- Validação completa aprovada: **63 arquivos de teste / 373 testes**, TypeScript e build de produção.
- O painel Google Ads foi validado contra a resposta real do Windsor.ai; a área Financeira mantém o controle de sessão e permissão já configurado.
