# Evidências da auditoria de concessionárias — 11/08/2026

## Fonte oficial MG Motor Brasil

A página pública de concessionárias da MG Motor Brasil informa **45 unidades** e lista nomes que não aparecem no arquivo `Dealers_atualizado.xlsx`, entre elas **Baltic Alphaville**, **Inglaterra Salvador**, **Inglaterra Salvador Shopping**, **Canopus Pantanal Shopping**, **Dão Silveira Natal Midway Mall**, **Orvel Shopping Vitória**, **Tecar Bougainville Shopping**, **Niscar Shopping Manaira**, **Autobrand Shopping Riomar**, **Automec Shopping Iguatemi Esplanada** e outras unidades anunciadas como “em breve”.

Fonte: https://mgmotoroficial.com.br/mg-care/concessionarias

## Validação Baltic Alphaville

O site da MG Baltic confirma a unidade na **Alameda Araguaia, 820 — Alphaville Industrial, Barueri/SP**, mesma área operacional descrita no cadastro enviado como `BALTIC BARUERI`. Isso sustenta a equivalência entre variações “Baltic Alphaville/Barueri”, mas não comprova automaticamente a equivalência do nome histórico `MEGAMIT - ALPHAVILLE`.

Fonte: https://balticmg.com.br/

## Implicação para a auditoria

O arquivo `Dealers_atualizado.xlsx` contém 31 registros, mas não representa sozinho toda a nomenclatura de unidades publicada atualmente pela própria MG. Portanto, a cobertura de Leads deve distinguir:

1. aliases comprováveis dos dealers oficiais;
2. unidades oficiais publicadas, mas ausentes da planilha de 31 registros;
3. nomes históricos ou ambíguos que exigem confirmação de de-para;
4. Leads sem dealer, que permanecem em qualificação.

Não é correto declarar 100% de conciliação usando apenas o cadastro de 31 dealers enquanto existirem nomes históricos ou unidades oficiais ausentes desse arquivo.

## Verificação do domínio publicado

Foi tentada a abertura de `https://mgmotors.bbro.com.br/?module=sales` para conferir visualmente o aviso. O navegador retornou uma página em branco e perdeu a navegação para `about:blank`; portanto, essa tentativa não constitui evidência visual do estado publicado. A validação do aviso deve usar a resposta atual do serviço e, depois, uma sessão autenticada funcional.
