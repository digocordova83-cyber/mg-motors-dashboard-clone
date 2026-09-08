# Auditoria de acesso — usuário BBRO

Data da execução: 08/09/2026, horário de Brasília.

O usuário `bbro` foi provisionado como conta ativa, com nome de exibição `BBRO`, idioma `pt-BR` e a mesma matriz de permissões efetiva do usuário Daniel. O perfil possui acesso a Google Ads, Meta Ads, Leads, Plano de Mídia, Otimizações e Histórico, incluindo importação de Leads. O Histórico de Acessos permanece restrito, exatamente como no perfil de Daniel.

A senha foi armazenada exclusivamente como hash `scrypt`, utilizando os mesmos parâmetros de segurança do fluxo nativo do dashboard. A autenticação foi validada pelo serviço real e retornou a identidade `bbro` com correspondência integral das permissões. O teste automatizado de autenticação foi executado com oito casos aprovados. Nenhuma senha ou hash foi incluído neste documento.
