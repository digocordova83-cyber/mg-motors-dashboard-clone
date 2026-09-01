# Contrato de implementação consolidado

## 1. Princípios

O dashboard continuará como uma aplicação única, servida no runtime gerenciado, sem processos persistentes ou tarefas em segundo plano. Google Ads e Meta Ads serão atualizados sob demanda, com cache em memória e preservação do último resultado válido. O plano de mídia mensal é uma fonte editorial fornecida pelo usuário e não deve ser confundido com entrega real de mídia.

Nenhuma métrica ausente será inventada. Divisões por região do Meta Ads que não retornem leads não exibirão CPL. Alcance não será somado entre dimensões sobrepostas. Todas as permissões sensíveis serão aplicadas no backend e também refletidas na interface.

## 2. Identidade e permissões

### Sessão autenticada

```ts
type DashboardLocale = "pt-BR" | "en-US";

type DashboardPermissions = {
  viewGoogleAds: boolean;
  viewGoogleOptimizations: boolean;
  viewGoogleHistory: boolean;
  viewMetaAds: boolean;
  viewLeads: boolean;
  updateLeadCsv: boolean;
  viewMediaPlan: boolean;
};

type DashboardSession = {
  userId: number;
  username: string;
  displayName: string;
  locale: DashboardLocale;
  permissions: DashboardPermissions;
  expiresAt: number;
};
```

A senha nunca será persistida em texto puro. O hash usará `scrypt` nativo do Node.js, com sal aleatório por usuário e comparação em tempo constante. O JWT conterá apenas `userId`, `username`, escopo e expiração; nome, idioma e permissões serão recarregados do banco em cada leitura de sessão para que revogações tenham efeito imediato.

### Matriz inicial

| Usuário | Idioma | Google Ads | Optimizations | History | Leads | Atualizar CSV | Meta Ads | Plano de mídia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| rodrigo | pt-BR | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| mg motors | en-US | Sim | Não | Não | Sim | Não | Sim | Sim |
| winicius | pt-BR | Sim | Sim | Sim | Sim | Não | Sim | Sim |

O backend terá guardas específicas por permissão. Rotas proibidas responderão `FORBIDDEN`, mesmo quando chamadas fora da interface.

## 3. Persistência nova

### `dashboard_users`

Campos: `id`, `username` único, `displayName`, `passwordHash`, `passwordSalt`, `locale`, `isActive`, sete flags de permissão, `createdAt`, `updatedAt` e `lastSignedInAt`.

### `dashboard_source_updates`

Campos: `id`, `sourceKey` único (`google_ads`, `meta_ads`, `leads_csv`, `media_plan`), `dataThroughDate`, `lastSuccessfulSyncAt`, `lastAttemptAt`, `lastError` e `updatedAt`.

Uma falha altera `lastAttemptAt` e `lastError`, mas nunca substitui `lastSuccessfulSyncAt` ou `dataThroughDate` válidos.

## 4. Meta Ads

### Fonte

Conector Windsor.ai `facebook`, conta `1418731006678061`, nome confirmado `Jul/26 | Jul/26 | FB IG | Cadastro`, fuso `America/Sao_Paulo`. O período padrão será do primeiro dia do mês da última data completa até a própria última data completa.

### Contrato de saída

```ts
type MetaAdsDashboardData = {
  period: { dateFrom: string; dateTo: string; timezone: string };
  summary: {
    spend: number;
    leads: number;
    cpl: number;
    impressions: number;
    reach: number;
    clicks: number;
  };
  daily: Array<{ date: string; spend: number; leads: number; cpl: number; impressions: number; clicks: number }>;
  models: Array<{ model: string; ads: number; spend: number; leads: number; cpl: number }>;
  campaigns: Array<{ id: string; name: string; status: string; spend: number; leads: number; cpl: number }>;
  audiences: Array<{
    id: string;
    name: string;
    status: string;
    spend: number;
    leads: number;
    cpl: number;
    targetingSummary: string[];
  }>;
  creatives: Array<{
    id: string;
    name: string;
    model: string;
    status: string;
    spend: number;
    leads: number;
    cpl: number;
    imageUrl: string | null;
  }>;
  demographics: {
    genders: Array<{ gender: string; spend: number; leads: number; cpl: number; impressions: number }>;
    ages: Array<{ age: string; spend: number; leads: number; cpl: number | null; impressions: number }>;
  };
  regions: Array<{
    region: string;
    spend: number;
    impressions: number;
    reach: number;
    clicks: number;
    leads: null;
    cpl: null;
  }>;
  metadata: {
    accountId: string;
    accountName: string;
    source: "windsor-live" | "cache";
    lastSuccessfulSyncAt: number;
    dataThroughDate: string;
    cacheHit: boolean;
  };
};
```

### Regras de agregação

Os KPIs principais serão consultados no nível da campanha. Modelos e criativos serão agregados exclusivamente no nível do anúncio, evitando somar novamente os dados de campanha ou conjunto. O modelo será extraído de nomes de anúncios para `MG4`, `MG5` e `Cyberster`, com fallback `Outros` apenas quando o nome realmente não permitir classificação.

A imagem do criativo usará, nesta ordem, `thumbnail_url`, `promoted_post_full_picture`, `image_url`, `placement_ad_thumbnail_url` e `effective_instagram_media__thumbnail_url`. URLs externas serão renderizadas diretamente; falhas mostrarão um placeholder visual sem inventar imagem.

A consulta regional exibirá somente métricas realmente retornadas. Como a fonte não fornece leads nessa quebra, CPL regional ficará explicitamente indisponível.

## 5. Plano de Mídia Digital

O primeiro plano disponível será `2026-07`. A fonte canônica é `media_plan_july_source.json`, gerada da planilha enviada. Os 15 itens e três totais serão servidos pelo backend como dados reais do plano, sem persistência duplicada no banco.

```ts
type MediaPlanMonth = {
  month: string;
  title: string;
  subtitle: string;
  rows: Array<{
    funnel: string;
    channel: string;
    product: string;
    objective: string;
    grossInvestment: string;
    commission: string;
    netInvestment: string;
    cpm: string;
    impressions: number;
    ctr: number;
    clicks: number;
    connectRate: number;
    visits: number;
    cvr: number;
    leads: number | null;
    cpl: string | null;
  }>;
  totals: Array<{
    kind: "SUBTOTAL" | "TOTAL";
    label: string;
    grossInvestment: string | null;
    commission: string | null;
    netInvestment: string;
    impressions: number;
    ctr: number;
    clicks: number;
    visits: number;
    cvr: number;
    leads: number;
    cpl: string;
  }>;
  updatedAt: number;
};
```

O menu será `Plano de Mídia Digital` em português e `Digital Media Plan` para o usuário MG Motors. A tela terá seletor mensal, resumo executivo, subtotais Line-up e MG4 Urban, distribuição por canal/funil/produto e tabela detalhada responsiva. Métricas sem valor aparecerão como traço.

## 6. Última atualização

O cabeçalho exibirá `Última atualização: dd/MM/yyyy HH:mm` ou `Last updated: MMM d, yyyy HH:mm`, usando `dashboard_source_updates.lastSuccessfulSyncAt`. O valor global será o maior horário válido entre as fontes acessíveis ao usuário. O horário exibido será convertido para `America/Sao_Paulo`.

## 7. Ciclo de otimização

A seção independente `Recomendações baseadas em evidências` será removida. As recomendações atuais serão sincronizadas diretamente no ciclo ativo quando a tela de otimizações for carregada ou quando o usuário gerar um novo ciclo. A grade do ciclo passará para três colunas em telas amplas.

A atribuição manual e o botão `Iniciar` serão removidos. Toda tarefa aberta exibirá notas de conclusão e um único botão `Concluir`. Ao concluir:

1. o backend aceita `PENDING`, `REOPENED` ou `IN_PROGRESS`;
2. define `assignee` com o nome do usuário autenticado;
3. define `startedAt` quando ainda estiver vazio;
4. define `completedAt` e status `COMPLETED` na mesma transação;
5. grava `task_completions.completedBy` e evento `COMPLETED` com o usuário autenticado;
6. registra o snapshot de performance quando disponível.

A exigência de observação com ao menos três caracteres permanece para manter a auditoria.

## 8. Navegação, idioma e autorização

A navegação aceitará `google-ads`, `meta-ads`, `leads` e `media-plan`. O roteador normalizará URLs proibidas para o primeiro módulo permitido. No acesso MG Motors, todos os rótulos, estados, mensagens, tabelas, tooltips e vazios das áreas acessíveis serão exibidos em inglês. As abas Google `optimizations` e `history` não serão renderizadas nem aceitas pelo backend para esse usuário.

O controle de atualização CSV será removido da interface de Leads para MG Motors e winicius. A mutação de importação também recusará os dois usuários com `FORBIDDEN`. O usuário rodrigo preservará o fluxo atual.

## 9. Testes obrigatórios

A implementação terá cobertura Vitest para hash e validação de senha, sessão JWT, usuários inativos, matriz de permissões, bloqueio backend, idioma, normalização de rotas, agregações Meta sem duplicidade, fallback de imagem, ausência de CPL regional, plano de julho, última atualização, conclusão direta de tarefas e remoção dos elementos visuais solicitados em Leads.
