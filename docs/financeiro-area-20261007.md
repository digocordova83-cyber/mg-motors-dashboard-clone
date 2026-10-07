# Área Financeira de Parceiros — 07/10/2026

## Escopo entregue

Foi criada a rota protegida **`/finaceiro`**, independente da navegação operacional, para compartilhamento controlado da visão financeira e da base de contatos de **Webmotors** e **Mercado Livre**.

A área possui autenticação própria do dashboard e uma permissão específica, `canAccessFinanceiro`. O perfil dedicado `financeiro` tem acesso somente a esta área; não recebe permissões para Google Ads, Meta Ads, Leads, Plano de Mídia, importações ou histórico de acessos. O administrador `rodrigo` recebeu a nova permissão para supervisão.

## Dados exibidos

Para cada competência disponível (julho a outubro de 2026), a área consulta a mesma base canônica de Leads usada pelo dashboard e apresenta:

- investimento bruto e líquido de plano por parceiro, quando existente no Plano de Mídia aprovado;
- quantidade de Leads efetivamente recebidos na base canônica;
- CPL de referência calculado como investimento líquido dividido pelos Leads recebidos;
- estimativa técnica de impressões por CPM de referência;
- tabela pesquisável de Leads com data, parceiro, nome, e-mail, telefone, modelo, concessionária, cidade e UF.

A tabela é deliberadamente restrita à área autenticada porque contém dados pessoais. Os dados não foram copiados para arquivos estáticos, logs de interface ou módulos públicos.

## Regra de estimativa de impressões

A estimativa é apresentada de forma explícita como referência de planejamento, sem alegar entrega real de mídia:

| Parceiro | CPM de referência | Fórmula |
|---|---:|---|
| Webmotors | R$ 50,00 | Investimento líquido ÷ 50 × 1.000 |
| Mercado Livre | R$ 35,00 | Investimento líquido ÷ 35 × 1.000 |

## Controles e validação

- Novo campo `canAccessFinanceiro` em `dashboard_accounts`, aplicado pela migração `drizzle/0015_familiar_skin.sql`.
- Sessões anteriores foram invalidadas por incremento da versão da sessão; novas sessões carregam a permissão financeira de forma explícita.
- Testes unitários cobrem cálculos dos parceiros e bloqueio/aceite da rota tRPC por permissão.
- Revisão autenticada no navegador confirmou tela de login, filtro mensal, cards financeiros, aviso de estimativa, filtros por parceiro e tabela de contatos.
