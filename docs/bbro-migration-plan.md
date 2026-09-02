# Plano de migração do dashboard MG Motors para infraestrutura BBRO

**Status:** plano técnico concluído; implantação externa não iniciada  
**Data:** 02/09/2026  
**Autor:** Manus AI

> **Regra de segurança:** a produção atual permanecerá ativa durante a construção e a validação do novo ambiente. Nenhuma alteração de DNS, encerramento de serviço ou migração final de escrita está autorizada neste momento.

## Resumo executivo

O dashboard pode ser migrado sem reescrever suas regras de negócio. O frontend React, o servidor Express/tRPC, a camada Drizzle, os importadores e as integrações Windsor são portáveis. O trabalho principal é substituir quatro serviços hoje gerenciados: banco, armazenamento, autenticação/OAuth e agendamento. O projeto já possui scripts de build e execução para Node e uma suíte automatizada de referência, o que reduz o risco técnico da portabilidade.[1]

A migração deve ocorrer em paralelo. Primeiro será criado um ambiente externo de staging; depois, schema, dados e arquivos serão copiados e reconciliados; em seguida, as atualizações D-1 rodarão nos dois ambientes por pelo menos sete dias fechados. Somente após a equivalência de login, Leads, Google, Meta, TikTok, vendas, métricas e idempotência poderá ser solicitada autorização para o cutover. A produção anterior deverá permanecer disponível para rollback por pelo menos 72 horas.

## Inventário verificado

| Componente | Situação atual | Requisito externo |
| --- | --- | --- |
| Aplicação | React 19, Vite, Express, tRPC, TypeScript e Node | Node 22, processo de aplicação persistente e build com pnpm |
| Banco | MySQL/TiDB acessado por `DATABASE_URL` e Drizzle | MySQL 8 compatível, TLS, usuário exclusivo e backups automáticos |
| Volume do banco | 19 tabelas, aproximadamente 32,8 mil linhas, 6,50 MB de dados e 6,49 MB de índices | Capacidade pequena; prioridade para consistência e restauração |
| Leads | 26.112 registros na fotografia de 02/09; importação integral transacional | Preservar parser canônico, lotes, hashes, duplicatas válidas e auditoria |
| Vendas | Importação de PDF por hash e competência | Preservar lotes, aliases de dealers e idempotência |
| Mídia | Google, Meta e TikTok consultados pelo Windsor | `WINDSOR_API_KEY`, saída HTTPS e tratamento independente por fonte |
| Autenticação | Contas locais com hash `scrypt`, cookie/JWT e camada OAuth gerenciada | Manter contas locais; escolher se haverá SSO/OAuth corporativo |
| Storage | Upload assinado e download por `/manus-storage` | Bucket privado S3 compatível e URLs assinadas próprias[3] |
| Agendamento | Callback para `/api/scheduled/daily-refresh` | Cron, timer do sistema ou scheduler da plataforma com segredo[4] |
| Domínios | Domínios BBRO já atendem a produção atual | Criar staging separado e manter DNS de produção até aprovação |

O runtime atual utiliza `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `WINDSOR_API_KEY`, além de variáveis específicas dos serviços gerenciados. A configuração externa deve eliminar a necessidade de `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID` e `VITE_APP_ID`, salvo se a BBRO optar por manter algum serviço equivalente.[2]

## Dependências a substituir

| Dependência gerenciada atual | Equivalente para o ambiente BBRO |
| --- | --- |
| Banco provisionado pela plataforma | MySQL 8 gerenciado ou instância MySQL dedicada |
| Presign e proxy de storage | SDK S3 compatível, bucket privado e rota de download autorizada |
| Agendamento Heartbeat | Cron do host, `systemd timer` ou scheduler da PaaS |
| OAuth da plataforma | Login local atual ou provedor de identidade escolhido pela BBRO |
| Gestão de secrets | Secret manager ou arquivo de ambiente protegido fora do repositório |
| Checkpoint e rollback | Git, tag de release, imagem versionada e retenção de deploys |
| Notificação gerenciada | SMTP, Google/Microsoft Workspace, Teams, Slack ou webhook corporativo |

O código da rotina D-1 já expõe um ponto de entrada HTTP em `/api/scheduled/daily-refresh`.[5] No ambiente externo, essa rota deverá exigir um segredo próprio, aceitar somente chamadas internas ou allowlisted e registrar um identificador único por execução.

## Opções de implantação

| Approach | Tradeoffs | Cost | Setup Complexity |
| --- | --- | --- | --- |
| **Servidor BBRO com Docker**: aplicação Node, proxy HTTPS e serviços auxiliares em containers; banco e bucket preferencialmente externos | Maior controle e portabilidade. A BBRO assume patching, observabilidade, backups, certificados e incidentes | Infraestrutura própria, storage e backup | **Média/alta** |
| **Plataforma gerenciada**: container da aplicação, MySQL gerenciado, object storage e scheduler do provedor | Menor carga operacional e rollback de deploy mais simples. Depende dos limites e preços do provedor | Mensalidade por aplicação, banco, storage e tráfego | **Média** |
| **Ponte de transição**: manter a produção atual nos domínios BBRO enquanto o ambiente externo é preparado | Menor risco imediato e nenhuma interrupção. Não conclui a migração; serve apenas como fase paralela | Mantém os custos dos dois ambientes durante a validação | **Baixa** |

A escolha entre servidor Docker e plataforma gerenciada depende do contrato da BBRO. Em ambos os cenários, o banco não deve residir dentro do container efêmero da aplicação, e os arquivos devem ficar em object storage, não no disco local do servidor.

## Arquitetura-alvo

A arquitetura externa deve conter uma aplicação Node 22 versionada; MySQL 8 com TLS; bucket privado S3 compatível; proxy HTTPS; gestão de segredos; scheduler diário; logs centralizados; health checks; monitoramento; e backups automatizados. A implantação deve ter dois endpoints distintos: produção e staging.

O job diário começará às **08:00 no fuso America/Sao_Paulo**, calculará D-1 e executará a rotina oficial. Cada fonte manterá status próprio. Se uma fonte estiver atrasada, o job registrará falha parcial e preservará o último snapshot válido, sem copiar valores de outro dia nem declarar sucesso. A confirmação diária deve informar data processada, cobertura, total antes/depois, novos, duplicados, inválidos, reconciliation, idempotência e erros.

O fluxo de Leads continuará obrigatoriamente usando o parser canônico e a substituição integral transacional. O fluxo de vendas continuará lendo a tabela Weekly Target Achievement — Retail do Daily Sales Planning Report, usando hash do PDF, competência e aliases oficiais. TikTok Live permanecerá separado de TikTok Ads. Nenhuma dessas regras deve ser reimplementada em scripts paralelos.

## Segredos e acessos

O ambiente externo exigirá, no mínimo, `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `WINDSOR_API_KEY`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` e `SCHEDULE_SECRET`. Os nomes podem ser adaptados ao padrão da BBRO, mas nenhum valor deverá entrar no Git.

Se a BBRO quiser leitura automática de Google Sheets ou Gmail, será necessário fornecer credenciais OAuth ou service account próprias e autorizar explicitamente os escopos. Os conectores internos da infraestrutura atual não devem ser considerados portáveis. Caso essas credenciais não sejam fornecidas, Leads continuarão sendo consolidados pelo fluxo já aprovado e o PDF de vendas continuará sendo importado manualmente.

## Migração paralela e gates

| Gate | Atividade | Critério de aprovação |
| --- | --- | --- |
| **G0 — Decisão** | Confirmar provedor, acesso, banco, storage, DNS, SSL e responsáveis | Arquitetura escolhida e responsabilidades registradas |
| **G1 — Portabilidade** | Criar adaptadores externos de auth, storage e scheduler | `pnpm check`, `pnpm test` e `pnpm build` aprovados |
| **G2 — Infraestrutura** | Criar staging, banco, bucket, secrets, logs e health checks | Ambiente saudável sem tocar na produção |
| **G3 — Cópia inicial** | Exportar schema/dados e copiar arquivos | Contagens, somatórios e hashes reconciliados |
| **G4 — Validação funcional** | Testar login, módulos, filtros, Leads, mídia, vendas e permissões | Matriz de aceite sem bloqueadores |
| **G5 — Paralelo D-1** | Rodar atualizações nos dois ambientes por pelo menos sete dias fechados | Equivalência diária por fonte e zero duplicação |
| **G6 — Delta final** | Gerar backup, aplicar somente alterações posteriores e congelar escrita por janela curta | Zero divergência em tabelas críticas |
| **G7 — Cutover** | Alterar DNS após autorização explícita | Novo ambiente saudável e rollback pronto |
| **G8 — Observação** | Monitorar por pelo menos 72 horas e três ciclos D-1 | Operação estável e confirmação diária entregue |

## Matriz de aceite

A validação deverá comparar quantidade total, menor e maior data, somatórios de métricas, hashes de arquivos, IDs e status por fonte. A fotografia inicial deve reconciliar as 19 tabelas, os 26.112 Leads existentes em 02/09, os lotes de importação, os registros semanais de vendas, os snapshots de mídia e as contas locais. O número de Leads é uma referência de partida; qualquer alteração posterior será capturada pelo delta final.

Os testes mínimos incluem login válido e inválido; permissões de `mgmotor`, `daniel`, `winicius`, `tati` e demais contas persistidas; Google, Meta e TikTok; TikTok Live separado; importação de Leads; importação e reprocessamento de PDF; metas; histórico; storage; scheduler; fallback após falha de fonte; e recuperação do banco. A referência atual é de **53 arquivos de teste e 318 testes aprovados**.

## Backup, monitoramento e operação

O banco deverá ter backup diário criptografado, retenção mínima de 30 dias e restauração testada mensalmente. Antes de cada deploy crítico e do cutover, deverá existir um snapshot manual adicional. O bucket deverá manter versionamento e política de ciclo de vida. Os logs da aplicação e dos jobs deverão ser retidos por pelo menos 30 dias e conter `correlation_id`, fonte, competência, início, término e resultado.

O monitoramento mínimo abrangerá `/health`, `/ready`, conectividade com o banco, latência, taxa de erro, disponibilidade do storage, certificado TLS e atraso de cada fonte. A BBRO deverá definir quem recebe alertas, quem faz a primeira análise e quem pode executar rollback.

## Rollback

Durante a janela de observação, a produção anterior permanecerá disponível. Se houver divergência de dados, falha de autenticação, perda de arquivos, atraso recorrente ou erro crítico, o DNS voltará para a produção anterior. O scheduler externo será pausado para impedir gravação dupla e o banco novo será preservado para diagnóstico. A retomada exigirá correção, novo delta e repetição dos gates de aceite afetados.

## Informações pendentes da BBRO

| Tema | Confirmação necessária |
| --- | --- |
| Hospedagem | VM/VPS com SSH, Docker, PaaS, cPanel ou outro modelo |
| Capacidade | Sistema operacional, CPU, memória, disco e versão do runtime |
| Banco | Disponibilidade de MySQL 8, TLS, backups, retenção e responsável |
| Storage | Bucket S3 compatível, política de acesso e versionamento |
| Rede | Saída HTTPS, IP fixo, allowlist e regras de firewall |
| Domínio | Responsável por DNS/SSL e subdomínio de staging |
| Integrações | Titularidade das credenciais Windsor e, se desejado, Google/Gmail |
| Alertas | E-mail, Teams, Slack ou outro canal operacional |
| Identidade | Manter login local ou adotar SSO/OAuth corporativo |

## Próxima decisão

Quando a BBRO confirmar os itens acima, será possível preparar os artefatos específicos: `Dockerfile` e `docker-compose` para uma VM, ou manifestos equivalentes para uma plataforma gerenciada; template de variáveis sem segredos; scripts de exportação, restauração e delta; adaptador S3; proteção do endpoint agendado; pipeline de testes; e runbook de deploy. A troca de DNS continuará bloqueada até autorização explícita.

## Referências internas

[1]: ../package.json "Scripts e dependências do dashboard"
[2]: ../server/_core/env.ts "Variáveis de infraestrutura atuais"
[3]: ../server/storage.ts "Implementação atual de armazenamento"
[4]: ../server/_core/heartbeat.ts "Agendamento gerenciado atual"
[5]: ../server/_core/index.ts "Registro do endpoint diário"
[6]: ../server/scheduledRefresh.ts "Orquestração do refresh D-1"
[7]: ../scripts/runGoogleLeadsAutomation.ts "Automação oficial de Leads"
[8]: ../scripts/importDailySalesPlanningPdf.ts "Importador oficial de vendas"
