# Correção de Leads recentes — Webmotors e Mercado Livre

## Escopo

Em 14/09/2026, foi auditada a base canônica de Leads após a identificação de ausência de dados recentes de **Webmotors** e **Mercado Livre** na visualização de setembro. A correção utilizou exclusivamente a planilha oficial vigente e o fluxo transacional `runGoogleLeadsAutomation.ts`.

## Diagnóstico da fonte

A prévia encontrou 30.733 linhas na fonte, com 30.713 linhas válidas para consolidação, 753 duplicatas internas e 20 linhas inválidas excluídas conforme as regras existentes. A fonte confirmava cobertura de Webmotors até 13/09 e de Mercado Livre até 09/09.

| Canal | Cobertura confirmada | Evidência recente na fonte |
|---|---|---|
| Webmotors | 13/09/2026 | 35 Leads em 11/09; 54 em 12/09; 93 em 13/09 |
| Mercado Livre | 09/09/2026 | 10 Leads em 07/09; 3 em 08/09; 11 em 09/09 |

## Resultado da atualização

| Indicador | Resultado |
|---|---:|
| Base antes da correção | 29.778 Leads |
| Novos Leads detectados | 182 |
| Base canônica após a correção | 29.960 Leads |
| Leads de setembro, 01–13/09 | 3.915 |
| Webmotors em setembro | 249 |
| Mercado Livre em setembro | 53 |
| Total de Webmotors na base | 2.533 |
| Total de Mercado Livre na base | 968 |

O procedimento substituiu a base de modo transacional, sem escrita SQL direta. Todos os canais foram preservados; não houve linhas removidas da fonte. A reexecução do mesmo arquivo retornou `NO_CHANGES`, com 29.960 registros antes e depois da execução.

## Validação técnica

Após a correção, a suíte completa foi aprovada com 56 arquivos de teste e 341 testes. TypeScript e build de produção foram concluídos sem erros. O aviso de tamanho do bundle é pré-existente e não bloqueia a atualização.

## Limitações de cobertura

Esta atualização não infere Leads após a última data disponível de cada fonte. Webmotors está coberto até 13/09; Mercado Livre está coberto até 09/09. Novas linhas só devem ser incorporadas quando chegarem à planilha oficial.
