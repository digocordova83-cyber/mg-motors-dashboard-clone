# Auditoria da automação de Leads

## Fonte Google Sheets

- URL: https://docs.google.com/spreadsheets/d/1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8/edit?gid=0#gid=0
- ID: `1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8`
- Título: `LEADS MG - Base`
- Fuso configurado: `America/Sao_Paulo`
- Exportação XLSX pública confirmada em `https://docs.google.com/spreadsheets/d/1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8/export?format=xlsx`

| Aba | Linhas configuradas | Colunas configuradas |
| --- | ---: | ---: |
| Site | 19.984 | 24 |
| Weebmotors | 1.222 | 26 |
| Uol | 999 | 26 |
| Mercado Livre | 1.001 | 14 |
| Meta | 4.525 | 30 |

## Fluxo manual obrigatório

O processo automático deve gerar o mesmo CSV canônico do upload manual e chamar `previewLeadCsv` / `importLeadCsv` de `server/leadsImportService.ts`. Esse fluxo:

- classifica duplicatas internas e já armazenadas por canal;
- reconcilia linhas prontas, duplicadas e inválidas com o total lido;
- bloqueia arquivos com qualquer linha inválida;
- trata reimportação idêntica como sucesso idempotente;
- armazena o CSV confirmado;
- substitui a base consolidada dentro de uma única transação e restaura a base anterior em caso de falha;
- persiste linhas inseridas, ignoradas e inválidas no lote de importação.

## Arquitetura escolhida

O usuário escolheu uma tarefa agendada no Manus. Um único cron deverá executar diariamente às 09:20 e 10:20 no horário de Brasília, rodar o script determinístico do projeto e publicar no Manus o relatório de cada execução.
