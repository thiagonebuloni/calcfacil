// Inicia o Vercel Web Analytics
// Para sites estáticos, o script é carregado diretamente pela Vercel quando deployado
// Este arquivo cria a função de fila que será usada pelo script principal

(function() {
  // Inicializa a fila de eventos antes do script principal carregar
  if (window.va) return;
  window.va = function va(...params) {
    if (!window.vaq) window.vaq = [];
    window.vaq.push(params);
  };
  
  // Carrega o script de analytics da Vercel
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  script.dataset.sdkn = '@vercel/analytics';
  script.dataset.sdkv = '2.0.1';
  
  script.onerror = () => {
    console.log('[Vercel Web Analytics] Failed to load script. Be sure to enable Web Analytics for your project and deploy to Vercel.');
  };
  
  document.head.appendChild(script);
})();
