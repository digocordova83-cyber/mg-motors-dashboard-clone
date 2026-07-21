# Otimização de desempenho — 21/07/2026

## Objetivo

Reduzir o tempo percebido de atualização do dashboard sem remover campos, alterar cálculos ou permitir que o job D-1 reutilize dados antigos.

## Arquitetura implementada

O dashboard agora usa três camadas complementares. O cache em memória continua atendendo navegações repetidas no mesmo processo. Uma nova tabela de snapshots persiste o último resultado válido por fonte e período, permitindo resposta rápida após cold start. Solicitações simultâneas idênticas compartilham a mesma promessa em andamento, evitando chamadas duplicadas à Windsor.ai.

O callback diário às 08:30 usa `forceRefresh: true` para ignorar os caches, consultar Google Ads e Meta Ads ao vivo e substituir os snapshots somente após uma resposta completa e validada. Em caso de falha externa, o último snapshot válido permanece disponível.

No módulo Meta Ads, a consulta principal agora começa imediatamente com um intervalo válido de fallback enquanto os limites de data carregam em paralelo. Isso remove o bloqueio sequencial do primeiro conteúdo útil.

## Benchmark comparável

Período medido: **01/07/2026 a 20/07/2026**.

| Cenário | Antes | Depois | Resultado |
|---|---:|---:|---|
| Google Ads após cold start | 16.980 ms | 53 ms | **99,69% mais rápido**, sem chamada externa |
| Meta Ads após cold start | 30.009 ms | 15 ms | **99,95% mais rápido**, sem chamada externa |
| Google Ads — 3 solicitações simultâneas | 3 chamadas externas | 1 chamada externa | **66,67% menos chamadas** |
| Meta Ads — 3 solicitações simultâneas | 18 chamadas externas | 6 chamadas externas | **66,67% menos chamadas** |
| Meta Ads — lote concorrente ao vivo | 11.339 ms | 6.216 ms | **45,18% mais rápido** nesta medição |
| Google Ads em memória | 19 ms | 18 ms | Mantido |
| Meta Ads em memória | 2 ms | 1 ms | Mantido |

Os tempos das chamadas ao vivo variam conforme a fonte externa. O ganho determinístico é que cold starts com snapshot não dependem mais dessas chamadas, e a coalescência limita cada conjunto concorrente a uma única atualização por fonte e período.

## Integridade

Os snapshots preservaram as mesmas contagens do benchmark de referência: **1.360 linhas e 68 campanhas em Google Ads**; em Meta Ads, **7 dias, 1 campanha, 6 conjuntos, 34 criativos, 17 linhas demográficas e 18 regiões**, com dados até **20/07/2026**.

Arquivos de evidência agregada: `performance-baseline.json` e `performance-after.json`.

## Validação visual autenticada

No preview autenticado, o módulo Meta Ads concluiu o carregamento com dados até **20/07/2026**, período de **14/07 a 20/07**, **R$ 13.372,95** de investimento, **1.712 leads** e **34 criativos** preservados no snapshot. A interface exibiu o estado atualizado, filtros, gráficos, campanhas, audiências, imagens específicas e placeholders sem perda de IDs ou métricas.
