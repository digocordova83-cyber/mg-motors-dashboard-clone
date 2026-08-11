# Validação — Performance por estado e concessionárias

**Data:** 11/08/2026  
**Período de Leads:** 01 a 10/08/2026  
**Snapshot de vendas:** Semana 3, 178 Retail Sales

## Validação autenticada em desktop

- A nova seção aparece dentro do módulo Leads, antes dos rankings Top 10 e Bottom 10.
- Foram exibidos 16 estados, ordenados por Leads recebidos.
- São Paulo apresentou 668 Leads, 43 Retail Sales, conversão de 6,44% e oito dealers com movimento entre 12 oficiais.
- A expansão de São Paulo exibiu os oito dealers com Leads, Retail Sales, conversão individual e status de cobertura.
- Paraná exibiu 285 Leads, 2 Retail Sales e conversão de 0,70%, permitindo comparar diretamente a concentração da Barigui.
- Estados sem linha de venda no snapshot mantêm conversão indisponível e cobertura explícita, evitando tratar ausência como zero venda.

## Responsividade

- A tabela usa contêiner horizontal com largura mínima controlada, preservando colunas em telas estreitas.
- O detalhamento dos dealers usa o mesmo padrão responsivo e mantém expansão acessível por botão.
- A captura automatizada em 375×812 abriu a tela de login por usar uma sessão isolada; a responsividade do conteúdo autenticado foi coberta pelos testes de renderização, TypeScript e classes de overflow, enquanto a inspeção visual completa foi realizada no desktop autenticado.

## Validação automatizada

- 44 arquivos de teste e 249 testes aprovados.
- TypeScript sem erros.
- Build de produção concluído.
- Totais reais reconciliados: 2.783 Leads atribuídos a estados operacionais e 178 Retail Sales.
