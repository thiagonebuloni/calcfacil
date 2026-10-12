// Transforma o objeto devolvido por `exibir()` em DOM. Nunca usa innerHTML com dados.

import { desenharGrafico } from './grafico.js';

export function el(tag, attrs = {}, ...filhos) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const f of filhos.flat()) if (f != null) n.append(f.nodeType ? f : document.createTextNode(String(f)));
  return n;
}

function linhaCC(l) {
  return el('div', { class: 'cc-linha' },
    el('span', {}, l.descricao), el('span', { class: 'v' }, l.valor),
    l.referencia ? el('span', { class: 'ref' }, l.referencia) : null);
}

function contracheque(h) {
  const coluna = (titulo, linhas, total) =>
    el('div', { class: 'cc-col' }, el('h4', {}, titulo), linhas.map(linhaCC),
      el('div', { class: 'cc-total' }, el('span', {}, `Total de ${titulo.toLowerCase()}`), el('span', {}, total)));
  return el('div', { class: 'contracheque' },
    el('h3', {}, 'Demonstrativo do cálculo'),
    el('div', { class: 'cc-grade' }, coluna('Proventos', h.proventos, h.totalProventos), coluna('Descontos', h.descontos, h.totalDescontos)),
    el('div', { class: 'cc-liquido' }, el('span', {}, 'Líquido a receber'), el('span', {}, h.liquido)));
}

export function csvDe(tabela) {
  const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const linhas = [tabela.colunas, ...tabela.linhas].map((l) => l.map(q).join(';'));
  return '﻿' + linhas.join('\r\n');
}

function blocoTabela(t) {
  const corpo = el('div', { class: 'tabela-wrap' });
  const baixar = el('button', {
    type: 'button', class: 'btn-sec',
    onclick: () => {
      const url = URL.createObjectURL(new Blob([csvDe(t)], { type: 'text/csv;charset=utf-8' }));
      const a = el('a', { href: url, download: t.arquivo });
      document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    },
  }, 'Baixar em CSV');
  const d = el('details', { class: 'detalhes' }, el('summary', {}, `${t.titulo} (${t.linhas.length} linhas)`), baixar, corpo);
  let pronto = false;
  d.addEventListener('toggle', () => {
    if (!d.open || pronto) return;
    pronto = true;
    const tabela = el('table', {},
      el('thead', {}, el('tr', {}, t.colunas.map((c) => el('th', { scope: 'col' }, c)))),
      el('tbody', {}, t.linhas.map((l) => el('tr', {}, l.map((c) => el('td', {}, c))))));
    corpo.append(tabela);
  });
  return d;
}

/** Monta o resultado completo dentro do contêiner. `extras` são nós adicionais (ex.: bloco de afiliado). */
export function renderizar(container, v, extras = []) {
  container.replaceChildren(...[
    el('h2', { class: 'sr-only' }, 'Resultado'),
    el('dl', { class: 'resumo' }, v.resumo.map((r) =>
      el('div', { class: r.destaque ? 'destaque' : '' }, el('dt', {}, r.rotulo), el('dd', {}, r.valor)))),
    v.holerite ? contracheque(v.holerite) : null,
    v.grafico ? desenharGrafico(v.grafico) : null,
    v.detalhes?.length
      ? el('details', { class: 'detalhes' }, el('summary', {}, 'Ver como o valor foi calculado'),
          el('dl', {}, v.detalhes.map((d) => el('div', {}, el('dt', {}, d.descricao), el('dd', {}, d.valor)))))
      : null,
    v.tabela ? blocoTabela(v.tabela) : null,
    ...extras,
    v.avisos?.length ? el('ul', { class: 'avisos' }, v.avisos.map((a) => el('li', {}, a))) : null,
    el('div', { class: 'ferramentas' },
      el('button', {
        type: 'button', class: 'btn-sec',
        onclick: async (ev) => {
          const b = ev.currentTarget;
          try { await navigator.clipboard.writeText(v.copiar); b.textContent = 'Resultado copiado'; }
          catch { b.textContent = 'Não foi possível copiar'; }
          setTimeout(() => { b.textContent = 'Copiar resultado'; }, 2000);
        },
      }, 'Copiar resultado'),
      el('button', { type: 'button', class: 'btn-sec', onclick: () => window.print() }, 'Imprimir')),
  ].filter(Boolean));
}
