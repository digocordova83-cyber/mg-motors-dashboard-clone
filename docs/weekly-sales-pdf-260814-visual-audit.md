# Auditoria visual — PDF 260814 Daily Sales Planning Report

## Quadrantes superiores da página Retail

A página 2 contém a tabela correta **Weekly Target Achievement - Retail**. As colunas W1–W5 estão alinhadas e as linhas superiores da região R01 foram extraídas corretamente. O subtotal R01 mostra Retail de 31 em W1, 113 em W2 e 153 em W3; esses valores reconciliam exatamente com a soma visual dos dealers de R01. Não há evidência de mudança de coluna ou deslocamento nas linhas superiores.

As células vazias de Retail e percentual são visualmente distintas de valores zero: quando há zero, o PDF imprime `0` e `0,0%`; quando não há venda informada, ambas as células ficam vazias. Essa distinção deve ser preservada pelo parser.

## Região R02 e TECAR GOIÂNIA

A inspeção em resolução completa confirma que as células Retail e percentual de **TECAR GOIÂNIA** estão visualmente vazias em W1, W2 e W3; portanto o parser não deslocou nem omitiu um número impresso nessa linha. Entretanto, a soma dos sete dealers de R02 com valores visíveis resulta em 72 para W2 e 93 para W3, enquanto o subtotal R02 imprime 74 e 95. A linha TOTAL também imprime 187 em W2 e 248 em W3, exatamente alinhada aos subtotais regionais.

Assim, a divergência de dois veículos em W2 e W3 está no próprio relatório: os subtotais/Total incluem duas vendas que não aparecem em nenhuma linha de dealer visível. A diferença é integralmente concentrada na única linha de R02 com Retail vazio, TECAR GOIÂNIA, mas qualquer preenchimento automático exige confirmação independente em outra seção do mesmo PDF; não deve ser inferido apenas para fazer a soma fechar.

## Confirmação na página Sales Funnel

A página **Sales Funnel by Region & Dealer** confirma independentemente o mesmo acumulado Retail de W3: R01 = 153, R02 = 95 e Total = 248. A tabela de dealers dessa página usa uma coluna Retail própria, permitindo verificar se TECAR GOIÂNIA recebe as duas unidades ausentes sem depender dos subtotais da página Retail.

Na linha **TECAR GOIÂNIA**, a página Sales Funnel mostra `Retail TGT = 8` e `Retail = 2`, confirmando que o acumulado correto de W3 é duas vendas. A página Retail deixou essa célula vazia, mas incluiu as duas unidades no subtotal R02 e no Total. Como W2 também apresenta um residual exclusivo de duas unidades na mesma linha e W3 é acumulado, a sequência reconciliada é: W1 sem venda informada, W2 = 2 e W3 = 2.

O tratamento seguro é preencher somente um residual positivo quando: subtotal regional e Total concordam; existe exatamente uma linha de dealer vazia dentro da região; e a diferença entre subtotal e dealers conhecidos é um inteiro positivo. O reparo deve gerar aviso auditável e recalcular o hash da linha. Casos com mais de uma linha vazia, subtotal divergente ou residual não positivo continuam bloqueados ou permanecem vazios.
