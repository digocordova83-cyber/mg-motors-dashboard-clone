# Entrega — Módulo de Leads e Auditoria por Concessionária

**Projeto:** MG Motors — Dashboard Operacional  
**Rota:** `?tab=leads`  
**Data da validação:** 21/07/2026  
**Autor:** Manus AI

## Resultado entregue

A nova área **Leads** foi integrada ao dashboard existente e segue o padrão visual escuro da MG Motors. O módulo usa o campo **Data Corrigida** como referência oficial, permite filtros por período, exibe indicadores operacionais e inclui atualização autenticada por CSV com pré-validação, confirmação, histórico e proteção contra duplicidades.

A visão solicitada para auditoria por concessionária está disponível na mesma aba. Ela combina indicadores consolidados, evolução diária da concessionária selecionada e uma tabela pesquisável e ordenável, sem atribuir registros ausentes a nomes inventados.

| Capacidade | Implementação |
| --- | --- |
| Base consolidada | 6.972 Leads únicos persistidos |
| Arquivo de origem | 7.071 linhas; 6.972 únicas; 99 duplicatas exatas; 0 inválidas |
| Deduplicação | SHA-256 do registro normalizado e idempotência por hash do arquivo |
| Data oficial | `Data Corrigida` em filtros, métricas e gráficos |
| Meta mensal | 10.000 Leads para julho/2026, persistente e editável |
| Atualização CSV | Pré-validação, confirmação, progresso, sucesso/erro e histórico auditável |
| Segurança | Consultas e mutações protegidas pela sessão do dashboard |

## Indicadores reconciliados

No filtro validado de **20/06/2026 a 19/07/2026**, a aba apresenta 6.972 Leads e média de 232,4 por dia, considerando os 30 dias corridos e incluindo dias zerados. O canal principal é Site, com 3.452 Leads, e há seis canais ativos.

Para julho de 2026, foram reconciliados 6.954 Leads até 19/07, equivalentes a 69,54% da meta de 10.000. A média realizada é de 366 Leads por dia, a necessidade restante é de 253,83 por dia e a projeção é de 11.346 Leads, ou 1.346 acima da meta caso o ritmo observado se mantenha.

| Indicador de pacing | Valor validado |
| --- | ---: |
| Atual | 6.954 |
| Meta | 10.000 |
| Atingimento | 69,54% |
| Média real/dia | 366 |
| Necessário/dia | 253,83 |
| Projeção | 11.346 |
| Diferença projetada | +1.346 |
| Dias fechados | 19 de 31 |
| Dias restantes | 12 |

## Auditoria por concessionária

A auditoria separa nomes identificáveis de registros sem concessionária válida. Foram encontradas **92 concessionárias válidas**, responsáveis por 4.861 Leads, ou 69,72% do total filtrado. Outros 2.111 Leads, equivalentes a 30,28%, permanecem corretamente sinalizados como **Indisponível**. Na data mais recente do período, 63 concessionárias registraram recebimento.

| Campo por concessionária | Finalidade de auditoria |
| --- | --- |
| Leads | Volume recebido no período filtrado |
| Participação | Parcela da concessionária no total filtrado |
| Média/dia | Ritmo médio considerando todos os dias do filtro |
| Dias com lead | Frequência efetiva de recebimento |
| Dias sem lead | Lacunas observadas no intervalo |
| Primeiro recebimento | Início da presença no período |
| Último recebimento | Recência do recebimento |
| Situação no último dia | Volume recebido ou quantidade de dias sem lead |
| Evolução diária | Série completa, inclusive datas zeradas, da linha selecionada |

A interface permite busca por nome e ordenação por maior volume, maior quantidade de dias sem lead ou recebimento mais antigo. O texto operacional esclarece que ausência de lead no último dia é um sinal para investigação, não uma conclusão automática sobre falha de distribuição.

## Validação concluída

| Verificação | Resultado |
| --- | --- |
| TypeScript | Aprovado |
| Vitest | 14 arquivos e 46 testes aprovados |
| Build de produção | Aprovado |
| Parser CSV | BOM, UTF-8, cabeçalhos, datas, obrigatoriedade e duplicatas cobertos |
| Importador | Sucesso transacional, bloqueio por linha inválida e idempotência cobertos |
| Banco após reprocessamento | 6.972 Leads e 6.972 hashes distintos |
| Reprocessamento pela interface | Lote existente reconhecido; zero novos Leads persistidos |
| Responsividade | 390 px, 768 px e 1.440 px sem overflow horizontal do documento |
| Console do navegador | Sem erros após carregamento e reprocessamento |
| Auditoria visual | Comparação com os quatro prints registrada em `leads_visual_validation.md` |

O build emitiu apenas o aviso não bloqueante de tamanho do bundle principal acima de 500 kB. A aplicação compilou normalmente e o servidor de produção foi gerado.

## Arquivos principais

| Área | Arquivos |
| --- | --- |
| Interface | `client/src/components/LeadsTab.tsx`, `client/src/pages/Home.tsx` |
| APIs | `server/routers.ts` |
| Analytics | `server/leadsAnalytics.ts`, `server/leadsService.ts` |
| Importação | `server/leadsCsv.ts`, `server/leadsImportService.ts` |
| Persistência | `drizzle/schema.ts`, `drizzle/0002_married_manta.sql` |
| Testes | `server/leads*.test.ts`, `client/src/components/LeadsTab.test.tsx` |
| Auditoria | `leads_module_spec.md`, `leads_visual_validation.md` |
