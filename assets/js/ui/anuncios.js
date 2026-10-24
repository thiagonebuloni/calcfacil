// Scripts de terceiros (Google Analytics e AdSense). Só são chamados DEPOIS do consentimento.

let ativado = false;

function injetar(src, attrs = {}) {
  const sc = document.createElement('script');
  sc.async = true;
  sc.src = src;
  for (const [k, v] of Object.entries(attrs)) sc.setAttribute(k, v);
  document.head.append(sc);
}

export function ativarTerceiros(cfg) {
  if (ativado) return;
  ativado = true;

  if (cfg.gaId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.gaId, { anonymize_ip: true });
    injetar(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.gaId)}`);
  }

  if (cfg.adsenseClient) {
    // O snippet do AdSense ja esta no <head> de todas as paginas
    // (scripts/layout.mjs). O Google exige que ele esteja no HTML servido para
    // verificar o site. Ele e assincrono e nao pede anuncios sozinho: so quando
    // existem elementos <ins class="adsbygoogle"> na pagina e que a requisicao
    // de anuncio acontece. Por isso, os <ins> so sao criados aqui, depois do
    // consentimento de cookies.
    document.querySelectorAll('.ad-slot[data-slot]').forEach((slot) => {
      const id = cfg.adsenseSlots?.[slot.dataset.slot];
      if (!id) return;
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.setAttribute('data-ad-client', cfg.adsenseClient);
      ins.setAttribute('data-ad-slot', id);
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      slot.append(ins);
      slot.hidden = false;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* ignora */ }
    });
  }
}

// Ao recusar (ou trocar para "apenas essenciais"), remove os anuncios ja
// inseridos na pagina. O snippet do AdSense permanece no <head>: ele e
// carregado de forma assincrona e, sem os elementos <ins>, nao faz nenhuma
// requisicao de anuncio.
export function desativarTerceiros() {
  document.querySelectorAll('.ad-slot[data-slot]').forEach((slot) => {
    slot.replaceChildren();
    slot.hidden = true;
  });
  document
    .querySelectorAll('script[src*="googletagmanager"]')
    .forEach((s) => s.remove());
  ativado = false;
}
