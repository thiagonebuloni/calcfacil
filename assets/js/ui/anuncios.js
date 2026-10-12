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
    injetar(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(cfg.adsenseClient)}`, { crossorigin: 'anonymous' });
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
