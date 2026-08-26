# TikTok Live — evidências da fonte de Leads

Fonte consultada em 25/08/2026: exportação XLSX da planilha Google de Leads `https://docs.google.com/spreadsheets/d/1DnkkrrU3GqcuBd5br_OQDaGMMtA2iN2ik4yEV5-Ggw8/export?format=xlsx`.

A exportação real possui as abas `Site`, `Tiktok - Live`, `Tikok`, `Weebmotors`, `Uol`, `Mercado Livre` e `Meta`.

A aba `Tiktok - Live` possui **31 linhas** e as colunas verificadas são: `Date`, `Time lead was received`, `Name`, `Phone`, `E-mail`, `City`, `State (Province)`, `Modelo`, `Status` e `Status 2 tentativa Telefone`.

A aba `Tikok` possui **198 linhas** e representa o canal TikTok Ads pago, com `created_time`, `ad_name`, `campaign_name`, `Source`, `Source action`, `Email`, `Name`, `Phone number` e concessionária.

Conclusão operacional: `Tiktok - Live` deve ser mapeada como canal independente **TikTok Live**, enquanto `Tikok` continua como **TikTok**. O novo mapeamento deve preservar a origem da aba, usar Date como data, Modelo como modelo, City/State como localização, Name/E-mail/Phone como contato e manter a deduplicação existente.

## Validação de preenchimento

A inspeção linha a linha confirmou que `Tiktok - Live` tem **31/31 datas, nomes, telefones, e-mails, cidades, estados e status preenchidos**, porém apenas **1/31 linhas possui `Modelo` preenchido** e **0/31 linhas possuem coluna de concessionária**. O campo `Status 2 tentativa Telefone` está vazio em 31/31 linhas.

Consequência: não é correto inferir modelo ou concessionária para as 30 linhas sem esses campos. A integração deve preservar esses leads como registros reais com campos ausentes/indisponíveis, desde que a validação atual seja ajustada para aceitar ausência explícita de dealer/modelo para a fonte TikTok Live, sem misturá-los com leads atribuídos a dealers nem fabricar dados.
