# Constatações iniciais — PDF 260824DailySalesPlanningReport

Fonte: `/home/ubuntu/upload/260824DailySalesPlanningReport.pdf`

## Metadados

- Data de criação/modificação do PDF: 24/08/2026 22:10:54 UTC.
- Total de páginas: 10.
- Tamanho do arquivo: 1.267.658 bytes.
- Formato visual: relatório em slides 960x540.

## Páginas 1–4 revisadas visualmente

### Página 1 — Sales Process Management

- KPI de **MTD Retail Order** exibido: **525**.
- KPI de **MTD Registration** exibido: **317**.
- Há tabela por modelo com coluna de **MTD Retail Order** e total na base.
- O total da primeira página é coerente com o bloco executivo do relatório, mas não substitui a tabela oficial semanal para importação.

### Página 2 — Weekly Target Achievement - Retail

- Esta é a tabela operacional principal para a importação.
- O total da linha final mostra:
  - **W1 Retail = 54**
  - **W2 Retail = 199**
  - **W3 Retail = 343**
  - **W4 Retail = 523**
- A coluna de **W5 Retail** aparece vazia na captura, mas a meta W5 total exibida é **493,0**.
- Totais regionais visíveis:
  - **R01 W4 Retail = 335**
  - **R02 W4 Retail = 188**
  - Soma regional = **523**, reconciliando com o total.
- Dealers visíveis em R02 incluem **BARIGUI CURITIBA, BARIGUI FLORIANOPOLIS, DRSUL PORTO ALEGRE, LA FONTAINE JOINVILLE, ORVEL VITÓRIA, POTENZA RIO DE JANEIRO, TECAR BRASÍLIA, TECAR GOIÂNIA, VEGA BELÉM**.
- **TECAR GOIÂNIA** aparece com **W1 Retail = 0**, **W2 Retail = 2**, **W3 Retail = 5** e **W4 Retail = 10**.

### Página 3 — Weekly Target Achievement - Registration

- Trata de Registration, não da tabela principal de importação de vendas.
- Pode ser usada como apoio de auditoria, não como fonte primária do MTD Retail Order.

### Página 4 — Weekly MG4 Urban Share - Retail

- Tabela auxiliar de share do MG4 Urban em Retail.
- Não é a tabela principal de importação, mas serve como apoio para conferência contextual.

## Próxima etapa recomendada

Executar a prévia oficial do importador com este PDF para confirmar:

- competência e semana de referência;
- total oficial importável de MTD Retail Order;
- quantidade de dealers conciliados;
- existência de warnings ou unmatched;
- idempotência do lote.
