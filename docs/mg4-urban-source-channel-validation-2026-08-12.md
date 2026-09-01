# Validação — MG4 URBAN por canal de origem

**Data:** 12/08/2026  
**Período validado:** 01 a 11/08/2026  
**Base após reprocessamento:** 15.083 Leads

## Reconciliação real

O novo quadro usa a aba/canal original preservado antes da regra que classifica o modelo MG4 URBAN como Campanha Urban. O total do quadro reconcilia integralmente com o total de MG4 URBAN no período.

| Origem | Leads | Média diária | Participação |
| --- | ---: | ---: | ---: |
| Site | 397 | 36,09 | 53,87% |
| Meta | 340 | 30,91 | 46,13% |
| **Total** | **737** | **67,00** | **100,00%** |

O canal normalizado dos 737 registros continua sendo Campanha Urban. Nenhum Lead foi criado ou removido para produzir a nova quebra. A automação substituiu a base apenas para preencher a procedência e a segunda execução retornou `NO_CHANGES`.

## Validação técnica

Foram aprovados seis testes Python, 47 testes direcionados e 251 testes determinísticos da suíte, além de TypeScript e build de produção. O único teste externo excluído da suíte determinística foi `windsor.secret.test.ts`, que permaneceu indisponível por `ECONNRESET` antes da negociação TLS com o conector Windsor; essa falha não participa da base de Leads nem do novo quadro.

O layout usa duas colunas no desktop e empilha os quadros no mobile. O estado sem MG4 URBAN reutiliza a mensagem bilíngue de indisponibilidade já existente.
