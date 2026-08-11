# Notas de leitura — Dossiê Qualidade de Leads MG Barigui

Data da análise: 2026-08-11
Arquivo analisado: `/home/ubuntu/upload/pasted_file_9IsUqv_DossiêQualidadedeleads–ConcessionáriaMGBarigui.pdf`

## Escopo declarado no documento

- Título: **Dossiê: Qualidade de leads – Concessionária MG Barigui**.
- Lojas citadas: **Florianópolis/SC** e **Curitiba/PR**.
- Janela temporal declarada: **Julho e 01 a 09 de Agosto/26**.
- Data do dossiê: **11/08/26**.

## Estrutura observada

- O dossiê é composto por exemplos individuais de Leads, com captura operacional do atendimento e uma tabela com os campos do dashboard/consolidador: data corrigida, canal, modelo, região, cidade, concessionária canônica, concessionária original, nome, email, telefone e data original.
- O material aparenta ter objetivo **ilustrativo/qualitativo**, não estatístico: ele mostra casos específicos para sustentar reclamações de baixa qualidade, e não uma amostra total auditada com denominador explícito.

## Exemplos explícitos identificados nas páginas lidas

1. **Canal não localizado** — Amanda Chrystyanna dos Santos, telefone `(21) 3685-5959`.
2. **Lead de origem Site com mensagem aparentemente sem intenção de compra** — Sheila Souza, MG4, cidade Ferreira Gomes/AP, dealer `BARIGUI - FLORIPA`, ticket `#148272`; a captura mostra texto sobre joia/diamante.
3. **Lead de origem Site atribuído à Barigui Curitiba com geografia distante** — João Vitor, MG4, Águia Branca/ES, ticket `#148430`.
4. **Lead classificado como criança** — Mizael Pereira Ferreira dos Santos, MG4, Brasília/DF, ticket `#149500`.
5. **Outro lead de origem Site com geografia distante** — Pedro Lucas Peixoto, MGS5, Águia Branca/ES, ticket `#149380`.
6. **Duplicidade explícita Site + Campanha Urban** — Clara Keli de Jesus dos Santos, 06/08/2026, Brasiléia/AC, Barigui Curitiba, tickets `#151255` e `#151256`; o dossiê afirma “abriu dois lead”.
7. **Lead com conteúdo infantil/jogo** — MÁRCINHO JUNIOR 5, 08/08/2026, Assis Brasil/AC, ticket `#152016`, mensagem “EU QUERO ROBUX”.
8. **Cliente afirma não ter aberto Lead para compra de carro** — Dos Santos Damico, 09/08/2026, canal `Campanha Urban`, MG4 URBAN, Jales/SP, Barigui Florianópolis, ticket `#152383`.
9. **Número incorreto / duplicidade / interesse em videogame** — conjunto de tickets `#152020`, `#152326`, `#152330`, incluindo Maily Kalapalo em 09/08/2026; o documento aponta “Lead repetido”, “Número incorreto” e “Interesse no jogo e videogame Free Fire”.

## Confirmações visuais adicionais

- A página do ticket `#149380` mostra transcrição indicando resposta infantil (“**Não sei não, moço. Eu só tenho 9 anos.**”), reforçando a classificação de baixa intenção para esse caso.
- O caso de **Clara Keli** aparece visualmente como dois registros no mesmo dia, mesmo nome, mesmo email e mesmo telefone, com diferença apenas no canal (`Site` e `Campanha Urban`), o que sustenta a alegação de duplicidade operacional no ponto de vista da concessionária.
- O ticket `#152016` explicita a mensagem sobre **Robux/Roblox**, reforçando caráter não comercial.
- O ticket `#152383` registra, na captura operacional, a alegação do contato de que **não abriu Lead para compra de carro**, o que é relevante como evidência qualitativa, embora não permita concluir sozinho fraude sistêmica.
- O ticket `#152020` aparece com a classificação **Número incorreto**, reforçando problema de contato inválido.

## Leitura metodológica refinada

- O dossiê combina **prints de CRM/atendimento** com os **campos estruturados do consolidado**, o que aumenta a rastreabilidade de cada caso individual.
- Mesmo assim, o documento segue sendo **casuístico**: ele documenta ocorrências específicas, mas ainda não mede taxa de erro por canal, modelo, período ou concessionária.
- Há um ponto importante de processo: alguns casos ilustram **duplicidade entre canais** e outros ilustram **baixa intenção**. Esses fenômenos não devem ser somados sem segmentação, porque exigem respostas operacionais diferentes.

## Primeiras conclusões de método

- O documento mostra **evidências concretas de casos problemáticos**.
- Até esta etapa, o PDF **não informa o tamanho da amostra total**, a taxa de incidência desses problemas nem um critério consolidado para dizer se eles representam exceção ou padrão.
- Há indícios de três categorias distintas de problema que precisarão ser separadas na análise:
  1. **intenção inválida/fraudulenta**;
  2. **duplicidade**;
  3. **roteamento geográfico/comercial possivelmente inadequado**.

## Pontos a confrontar com o dashboard

- Quantidade real de Leads da Barigui no período julho + 01–09/08.
- Participação de `Site` e `Campanha Urban` no volume da Barigui.
- Frequência de duplicatas detectadas pelo importador.
- Peso de localidades distantes do dealer atribuído.
- Existência de padrões por modelo (MG4, MG4 URBAN, MGS5).
- Compatibilidade entre os tickets citados e as regras já existentes de deduplicação / qualificação.
