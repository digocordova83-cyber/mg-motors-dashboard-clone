# Exportação de contatos de Leads

Data de geração: 16/09/2026.

## Escopo

Foi gerada uma exportação completa da tabela canônica `leads` contendo exclusivamente `Nome`, `E-mail`, `Telefone`, `Cidade` e `Estado`.

## Controles aplicados

| Controle | Resultado |
|---|---:|
| Linhas canônicas de origem | 30.766 |
| Contatos exportados | 25.682 |
| Linhas duplicadas removidas | 5.084 |
| Linhas duplicadas exatas no CSV final | 0 |
| Linhas com cinco colunas | 25.682 |
| Codificação | UTF-8 com BOM |
| Delimitador | `;` |

O CSV mantém uma linha por contato único. A deduplicação considera o conjunto normalizado de nome, e-mail, telefone, cidade e estado. Quando e-mail e telefone não estão disponíveis, o contato é preservado por nome, cidade e estado; campos ausentes na fonte permanecem vazios, sem preenchimento artificial.

## Integridade de campos

Cidade e estado estão preenchidos em todos os 25.682 contatos exportados. Há 19 registros sem nome, 20 sem e-mail e 64 sem telefone porque a informação não existe na base de origem.
