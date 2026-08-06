# Regras de ranking de dealers

## Escopo

As regras abaixo se aplicam às visões **MG MOTORS** e **VENDAS** no módulo de Leads/Vendas.

## Elegibilidade

Um dealer participa dos rankings de conversão quando:

1. possui correspondência confirmada com a base de Leads (`MATCHED`);
2. não representa uma categoria de qualificação, indisponibilidade ou ausência de dealer;
3. possui Retail Sales preenchido para a semana selecionada;
4. possui pelo menos um Lead recebido no mesmo recorte.

Não é aplicado um corte arbitrário de volume. A tabela e os cards exibem Leads e Retail Sales para que a base da taxa permaneça visível.

## Cálculo e ordenação

- **Conversão** = Retail Sales acumuladas na semana selecionada ÷ Leads acumulados no mesmo recorte × 100.
- A tabela inicia ordenada por conversão decrescente.
- Empates de conversão são resolvidos por Retail Sales decrescentes, depois Leads decrescentes e, por fim, nome do dealer.
- O Bottom 10 usa a mesma população elegível, em conversão crescente.
- Os controles Week 1 a Week 5 utilizam os valores acumulados já fornecidos pelo serviço de vendas semanais.

## Top Dealers da base de Leads

O quadro Top Dealers por volume continua usando Leads do período filtrado, mas exclui `Leads em qualificação` e qualquer placeholder sem dealer. Esses volumes permanecem disponíveis somente nos indicadores próprios de qualificação.
