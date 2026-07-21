# Integração Windsor.ai

A API oficial usa a base `https://connectors.windsor.ai` e autenticação por parâmetro `api_key`. Uma leitura de Google Ads segue `GET /google_ads` com `fields`, `date_from`, `date_to` e a chave. Os campos selecionados para este projeto são `campaign,date,spend,conversions,clicks,impressions,ctr,cpc,budget_amount,campaign_status,account_name,datasource`.

A conta validada no conector é **MG Motors**, ID `535-798-6801`, e os registros retornam `datasource=google_ads`. A API aceita filtros de data explícitos e parâmetros de atualização como `refresh_since=3d` e `refresh_interval=6h`. O backend deverá manter a chave somente no servidor, aplicar um cache por intervalo e usar o snapshot real validado como fallback quando a chave não estiver configurada ou a API estiver temporariamente indisponível.

## Fontes oficiais

1. [Windsor.ai Connectors API Documentation](https://windsor.ai/api-documentation/)
2. [How to integrate data into Python with Windsor.ai](https://windsor.ai/documentation/how-to-integrate-data-into-python/)
3. [Applying Filters to Queries](https://windsor.ai/applying-filters-to-queries/)
