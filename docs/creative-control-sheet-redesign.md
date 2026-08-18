# Reformulação — Controle de Criativos MG

## Auditoria inicial

A planilha possui uma única aba (`Página1`), sete colunas e cinco registros. Os dados atuais estão íntegros, incluindo datas e links para pastas do Google Drive. Não há filtro, linhas congeladas, validações de dados, formatação condicional ou hierarquia visual. O cabeçalho `Aitvo` contém erro de digitação.

## Arquitetura aplicada

A aba operacional será renomeada para `Controle de Criativos` e receberá uma área de resumo nas linhas 1–4. A tabela iniciará na linha 6 com dez colunas: `Veículo`, `Ação / Campanha`, `Plataforma`, `Início`, `Final`, `Link do Material`, `Status`, `Prazo`, `Responsável` e `Observações`.

Os cinco registros existentes serão preservados. O campo `Ativo` será convertido em `Status`, com opções `Ativa`, `Programada`, `Pausada` e `Encerrada`. Os registros sem data final receberão `Contínua` em `Prazo`; os demais usarão fórmula dinâmica para mostrar dias restantes ou `Encerrada`.

## Usabilidade

A tabela terá filtro em toda a área operacional, linhas congeladas apenas até o cabeçalho da tabela, larguras específicas por coluna, links clicáveis, datas padronizadas e validações em Veículo, Ação, Plataforma e Status. Cores de status facilitarão a leitura: verde para Ativa, azul para Programada, amarelo para Pausada e cinza/vermelho para Encerrada.

## Segurança

Antes da reformulação, a aba original será duplicada como backup e ocultada. Nenhum registro, data ou link existente será descartado.
