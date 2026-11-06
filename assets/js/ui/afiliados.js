// Links de afiliado e banners de anunciantes: ÚNICO lugar para trocar links, textos e HTML.
// Enquanto a lista de uma calculadora estiver vazia, nenhum bloco aparece (não há link quebrado nem espaço vazio).
//
// Exemplo (descomente e preencha depois de ser aprovado em um programa):
//   'decimo-terceiro': [{
//     titulo: 'Quer antecipar o 13º?',
//     texto: 'Compare opções de crédito com desconto em folha.',
//     botao: 'Ver opções',
//     url: 'https://seu-link-de-afiliado.exemplo/...',
//   }],
//
// Chaves aceitas: decimo-terceiro, ferias, rescisao, juros-compostos, financiamento, aposentadoria, me, importacao.
// Opcional: `html` renderiza código HTML bruto do anunciante (ex.: banner com imagem), mantendo o rótulo de publicidade.

export const AFILIADOS = {
  'decimo-terceiro': [
    {
      titulo: 'Mais de 70 formas para economizar',
      texto: 'Dicas práticas e objetivas para reduzir despesas, poupar mais e organizar o dinheiro no dia a dia.',
      botao: 'Ver dicas',
      url: 'https://go.hotmart.com/F108245511X?dp=1',
    },
  ],
  'ferias': [],
  'rescisao': [],
  'juros-compostos': [],
  'financiamento': [],
  'aposentadoria': [
    {
      titulo: 'Mais de 70 formas para economizar',
      texto: 'Dicas práticas e objetivas para reduzir despesas, poupar mais e organizar o dinheiro no dia a dia.',
      botao: 'Ver dicas',
      url: 'https://go.hotmart.com/F108245511X?dp=1',
    },
  ],
  'me': [],
  'importacao': [
    {
      html: `<!-- START ADVERTISER: Earfun, Inc from awin.com -->
<div style="display:flex; gap: 12px; justify-content: space-between; flex-wrap: wrap; margin: 8px 0; width:100%;">
  <div style="display:flex; flex-direction: column; align-items: center; text-align: center; flex: 1 1 200px; min-width: 150px;">
    <a rel="sponsored noopener" target="_blank" href="https://www.awin1.com/cread.php?s=4739995&v=61233&q=601395&r=3132449&ued=https%3A%2F%2Fwww.myearfun.com%2Fheadphones%2Fearfun-clip-hi-res-open-ear-wireless-earbuds-silver-grey" style="display:block; width:100%; margin-bottom: 8px;">
      <img src="https://www.awin1.com/cshow.php?s=4739995&v=61233&q=601395&r=3132449" border="0" style="display:block; width:100%; height:auto;">
    </a>
    <div style="font-size: 13px; line-height: 1.4; color: var(--tinta); font-weight: 600;">Fones Earfun Clip Hi-Res — open-ear sem fio</div>
  </div>
  <div style="display:flex; flex-direction: column; align-items: center; text-align: center; flex: 1 1 200px; min-width: 150px;">
    <a rel="sponsored noopener" target="_blank" href="https://www.awin1.com/cread.php?s=4740418&v=61233&q=601395&r=3132449&ued=https%3A%2F%2Fwww.myearfun.com%2Fheadphones%2Fearfun-clip-hi-res-open-ear-wireless-earbuds-silver-grey" style="display:block; width:100%; margin-bottom: 8px;">
      <img src="https://www.awin1.com/cshow.php?s=4740418&v=61233&q=601395&r=3132449" border="0" style="display:block; width:100%; height:auto;">
    </a>
    <div style="font-size: 13px; line-height: 1.4; color: var(--tinta); font-weight: 600;">Earfun Clip — áudio sem fio com microfone</div>
  </div>
  <div style="display:flex; flex-direction: column; align-items: center; text-align: center; flex: 1 1 200px; min-width: 150px;">
    <a rel="sponsored noopener" target="_blank" href="https://www.awin1.com/cread.php?s=4740420&v=61233&q=601395&r=3132449&ued=https%3A%2F%2Fwww.myearfun.com%2Fheadphones%2Fearfun-clip-hi-res-open-ear-wireless-earbuds-silver-grey" style="display:block; width:100%; margin-bottom: 8px;">
      <img src="https://www.awin1.com/cshow.php?s=4740420&v=61233&q=601395&r=3132449" border="0" style="display:block; width:100%; height:auto;">
    </a>
    <div style="font-size: 13px; line-height: 1.4; color: var(--tinta); font-weight: 600;">Oferta Earfun — fones open-ear para chamadas</div>
  </div>
</div>
<!-- END ADVERTISER: Earfun, Inc from awin.com -->`,
    },
  ],
};

import { el } from './render.js';

export function blocoAfiliado(calc) {
  const ofertas = (AFILIADOS[calc] || []).filter((o) => o && (o.url || o.html));
  if (!ofertas.length) return null;
  const o = ofertas[0];

  const filhos = [
    el('p', { class: 'rotulo' }, 'Publicidade. Podemos receber comissão se você contratar.'),
  ];

  if (o.html) {
    const div = document.createElement('div');
    div.innerHTML = o.html;
    filhos.push(div);
  }

  if (o.url) {
    if (o.titulo) filhos.push(el('h3', {}, o.titulo));
    if (o.texto) filhos.push(el('p', {}, o.texto));
    filhos.push(el('a', { class: 'btn', href: o.url, target: '_blank', rel: 'sponsored nofollow noopener' }, o.botao || 'Saiba mais'));
  }

  return el('aside', { class: 'afiliado', 'aria-label': 'Publicidade' }, ...filhos);
}
