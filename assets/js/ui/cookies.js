// Banner de consentimento (LGPD). "Apenas essenciais" não carrega analytics nem anúncios.

import { ativarTerceiros } from './anuncios.js';
import { el } from './render.js';

const CHAVE = 'cf_consent_v1';

function ler() {
  try { return localStorage.getItem(CHAVE); } catch { return null; }
}
function gravar(v) {
  try { localStorage.setItem(CHAVE, v); } catch { /* sem armazenamento: vale só nesta página */ }
}

export function iniciarCookies(cfg) {
  const precisa = !!(cfg.gaId || cfg.adsenseClient);
  const atual = ler();

  if (atual === 'todos') ativarTerceiros(cfg);

  const banner = el('div', { class: 'cookies', role: 'dialog', 'aria-label': 'Preferências de cookies', hidden: true },
    el('div', { class: 'cookies-in' },
      el('p', {}, 'Usamos cookies essenciais para o site funcionar e, com a sua permissão, cookies de estatísticas e de publicidade de terceiros. Os valores que você digita nas calculadoras ficam só no seu navegador. ',
        el('a', { href: '/privacidade/' }, 'Política de privacidade')),
      el('div', { class: 'acoes' },
        el('button', { type: 'button', class: 'btn', onclick: () => escolher('todos') }, 'Aceitar todos'),
        el('button', { type: 'button', class: 'btn-sec', onclick: () => escolher('essenciais') }, 'Apenas essenciais'))));
  document.body.append(banner);

  function escolher(v) {
    const mudouParaEssenciais = ler() === 'todos' && v === 'essenciais';
    gravar(v);
    banner.hidden = true;
    if (v === 'todos') ativarTerceiros(cfg);
    if (mudouParaEssenciais) location.reload();
  }

  if (precisa && atual === null) banner.hidden = false;

  document.querySelectorAll('[data-abrir-cookies]').forEach((b) => {
    b.hidden = !precisa;
    b.addEventListener('click', () => { banner.hidden = false; banner.querySelector('button')?.focus(); });
  });
}
