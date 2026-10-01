/* ══════════════════════════════════════════════════════
   ACESSIBILIDADE — VLIBRAS (Governo Federal)
   Tradutor de português para Libras: adiciona o botão azul
   flutuante na lateral da tela em todas as páginas que incluem
   este arquivo. Documentação oficial: https://vlibras.gov.br

   Basta incluir no fim do <body>:
   <script src="caminho/para/assets/acessibilidade/vlibras.js" defer></script>
══════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const VLIBRAS_APP = 'https://vlibras.gov.br/app';

    // Evita carregar o plugin duas vezes se o arquivo for incluido de novo.
    if (window.VLibras && window.VLibras.Widget) return;

    const script = document.createElement('script');
    script.src = VLIBRAS_APP + '/vlibras-plugin.js';
    script.async = true;
    script.onload = function () {
        // O plugin cria o proprio botao (num Shadow DOM, sem conflitar com o
        // CSS do site). position "R" = lado direito da tela; "L" = esquerdo.
        // avatar: "icaro", "hosana", "guga" ou "random".
        new window.VLibras.Widget({
            rootPath: VLIBRAS_APP,
            personalization: 'https://vlibras.gov.br/config/default_logo.json',
            avatar: 'random',
            position: 'R'
        });
    };
    document.head.appendChild(script);
}());
