# Revisão visual — Social Orgânico

## Instagram desktop

A página foi revisada autenticada em 1.440 px de largura com dados Windsor reais do intervalo de 30 dias encerrado em D-1. A navegação, os seis indicadores, as variações contra o período anterior, os três gráficos, a composição de interações, os insights determinísticos e oito cards de conteúdo foram renderizados sem cortes ou sobreposições.

As miniaturas de imagens, carrosséis e Reels foram exibidas corretamente usando as URLs fornecidas pelo Instagram. Os cards mantêm legenda limitada, métricas de alcance, engajamento e taxa, além de link para a publicação. A hierarquia, as cores e a densidade são compatíveis com o padrão escuro já utilizado pelo dashboard da MG.

O intervalo atual apresentou dados reais, enquanto novos seguidores do período anterior permaneceram explicitamente sem comparação percentual por causa da limitação de histórico do Instagram. Alcance, visualizações, interações e taxa de engajamento exibiram comparativos equivalentes normalmente.

## TikTok Orgânico conectado

A subaba TikTok foi reativada após a conexão de `tiktok_organic` no Windsor. A revisão autenticada confirmou seguidores atuais, crescimento líquido, alcance diário somado, visualizações, interações, taxa de engajamento, comparativos equivalentes, séries diárias e destaques determinísticos. O módulo permanece totalmente separado de TikTok Ads.

O Windsor ainda não retorna linhas válidas por vídeo. Por isso, o painel de vídeos informa a limitação da fonte e não fabrica ranking, links ou thumbnails. A interface está preparada para exibir as miniaturas completas assim que `video_id` e `video_thumbnail_url` forem fornecidos.

## Instagram mobile

A versão mobile foi revisada em 390 px. Os filtros mantêm rolagem interna, os indicadores são empilhados em uma coluna, os gráficos preservam largura legível e os conteúdos passam para um card por linha. Não houve overflow horizontal do documento, cortes em legendas essenciais ou sobreposição de elementos.

## Resultado

As vistas de risco — Instagram desktop/mobile e TikTok Orgânico desktop/mobile — foram aprovadas. As capturas foram movidas para fora do projeto e não integram o pacote de produção.

## Revisão adicional — thumbnails sem recorte

Após solicitação do usuário, a área de imagem dos cards foi ampliada para 220 px e alterada de preenchimento com corte para encaixe proporcional integral. A revisão autenticada confirmou que imagens verticais, quadradas e horizontais agora aparecem completas, centralizadas e sem distorção; as áreas excedentes utilizam o fundo escuro do card.

Em desktop, os oito conteúdos do Instagram permanecem alinhados no grid de quatro colunas. Em mobile, o grid passa para uma coluna, preserva as imagens completas e não apresenta overflow horizontal. A subaba TikTok voltou a ser exibida e usa o mesmo componente de imagem proporcional; o ranking permanecerá vazio até a origem fornecer vídeos válidos.
