# Validação de carregamento — Google Ads e Meta Ads

## Google Ads

Em 07/08/2026, após login válido da conta Rodrigo, a aba Google Ads carregou corretamente no ambiente de prévia. O recorte exibido foi de 08/07/2026 a 06/08/2026 (D-1), com investimento de R$ 315.781,39, 11.345,4 conversões e CPA médio de R$ 27,83.

## Diagnóstico aplicado

As fontes Google Ads e Meta Ads responderam HTTP 200 ao recorte D-1. A falha observada ocorria quando a sessão local do dashboard expirava: as chamadas protegidas retornavam 401, mas a interface permanecia no estado de erro. A correção reconhece especificamente essa resposta e recarrega a aplicação para exibir o login local.

## Meta Ads — investigação complementar

No mesmo acesso autenticado, a aba Meta Ads permaneceu inicialmente no estado `Carregando dados reais do Meta Ads...` enquanto a fonte ao vivo era consultada. A consulta principal (`bounds` + `data`) concluiu com HTTP 200 em 17.053 ms e o inventário de criativos concluiu com HTTP 200 em 12.198 ms. Ao final, a aba exibiu normalmente os dados de 01/08/2026 a 06/08/2026: investimento de R$ 4.853,99, 676 Leads, CPL médio de R$ 7,18, 132.289 de alcance e 8.511 cliques.
