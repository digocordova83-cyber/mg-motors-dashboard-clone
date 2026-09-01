# Auditoria do PDF de Vendas — 17/08/2026

Fonte local: `/home/ubuntu/upload/pasted_file_FmTEx5_pdfhandler.pdf`

O documento possui 11 páginas e foi emitido em 17/08/2026 às 10:39:26. A página 1 informa MTD Retail Order de 338 no card executivo, enquanto a tabela por modelo totaliza 346 MTD Retail Order; essa divergência pertence ao próprio documento e não deve ser corrigida por inferência.

A tabela usada pelo importador começa na página 2 com o título `Weekly Target Achievement - Retail`. O cabeçalho contém W1 TGT/Retail, W2 TGT/Retail, W3 TGT/Retail, W4 TGT/Retail e W5 TGT/Retail. A referência comercial atual é W4 Retail, cujo total exibido na página 2 é 338.

Na página 2, o total da região R01 em W4 Retail é 206 e o total da região R02 é 132, somando 338. Entre as linhas visíveis estão SAVOL SÃO CAETANO, TORIBA SÃO PAULO, BARIGUI CURITIBA, BARIGUI FLORIANOPOLIS, DRSUL PORTO ALEGRE, POTENZA RIO DE JANEIRO, TECAR BRASÍLIA, TECAR GOIÂNIA e VEGA BELÉM.

O texto extraído apresenta ruídos Unicode/OCR em alguns nomes e zeros, incluindo caracteres visualmente semelhantes de outros alfabetos em `CURITIBА`, `EUROОРА`, `STEFANINI PIRACICABA` e células zeradas. Esses ruídos são candidatos diretos à falha de correspondência/parsing e devem ser reproduzidos antes de qualquer correção.

Regra de segurança: preservar nomes brutos no registro de auditoria, aplicar normalização apenas na camada analítica e não inventar valores ausentes ou corrigir divergências internas do PDF sem evidência explícita.
