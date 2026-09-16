# Correção de marca — PDF diário de Leads

O relatório foi atualizado para remover integralmente a assinatura `Powered by emotion`. O logo MG continua usando o ativo oficial já adotado no dashboard, mas sem o filtro CSS `brightness-0 invert`, que convertia todas as áreas opacas em branco e eliminava os detalhes internos da marca.

Na prévia autenticada, o relatório manteve quatro páginas. A inspeção do DOM confirmou `poweredBy: false`, o ativo `/manus-storage/mg-logo-transparent-exact_cdfbeb6c.png` e a classe `h-[66px] w-[68px] object-contain`, sem filtro de cor ou deformação.

## Revisão visual final

Na revisão em tela da capa e dos cabeçalhos internos, a assinatura removida não voltou a aparecer e o logo MG passou a ser exibido com a marca completa, em vermelho e branco, com proporção consistente no canto superior direito. Os testes direcionados, a checagem de tipos e o build de produção foram reexecutados sem regressões.
