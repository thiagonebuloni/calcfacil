// Gráfico de linhas em SVG próprio (sem bibliotecas).

import { formatarNumero } from '../core/moeda.js';

const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs = {}, txt) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (txt != null) n.textContent = txt;
  return n;
};

function compacto(v) {
  const abs = Math.abs(v);
  if (abs >= 1e6) return `R$ ${formatarNumero(v / 1e6, abs >= 1e7 ? 0 : 1)} mi`;
  if (abs >= 1e3) return `R$ ${formatarNumero(v / 1e3, 0)} mil`;
  return `R$ ${formatarNumero(v, 0)}`;
}

function rotuloX(valor, formato) {
  if (formato === 'idade') return `${valor} anos`;
  if (valor >= 24) return `${formatarNumero(valor / 12, valor % 12 ? 1 : 0)} anos`;
  return `${valor} ${valor === 1 ? 'mês' : 'meses'}`;
}

export function desenharGrafico(g) {
  // Usa a largura real do contêiner para que o texto do SVG tenha tamanho legível também no celular.
  const alvo = document.getElementById('resultado');
  const W = Math.max(300, Math.min(720, Math.round(alvo?.clientWidth || 640)));
  const H = Math.round(Math.max(220, W * 0.5));
  const ml = 72, mr = 14, mt = 12, mb = 30;
  const todos = g.series.flatMap((x) => x.valores);
  const max = Math.max(...todos, 1);
  const min = 0;
  const x = (i) => ml + (g.x.length === 1 ? 0 : (i / (g.x.length - 1)) * (W - ml - mr));
  const y = (v) => mt + (1 - (v - min) / (max - min)) * (H - mt - mb);

  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${g.titulo}: ${g.series.map((x) => x.nome).join(' e ')}` });
  for (let t = 0; t <= 4; t++) {
    const v = min + ((max - min) * t) / 4;
    svg.append(s('line', { class: 'eixo', x1: ml, x2: W - mr, y1: y(v), y2: y(v) }));
    svg.append(s('text', { x: ml - 8, y: y(v) + 4, 'text-anchor': 'end' }, compacto(v)));
  }
  const marcas = [0, Math.floor((g.x.length - 1) / 2), g.x.length - 1];
  [...new Set(marcas)].forEach((i, k, arr) =>
    svg.append(s('text', { x: x(i), y: H - 8, 'text-anchor': k === 0 ? 'start' : k === arr.length - 1 ? 'end' : 'middle' }, rotuloX(g.x[i], g.formatoX))));
  g.series.forEach((serie, k) => {
    const pts = serie.valores.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    svg.append(s('polyline', { class: `serie s${k}`, points: pts }));
  });

  const caixa = document.createElement('figure');
  caixa.className = 'grafico';
  caixa.style.margin = '1.5rem 0';
  const titulo = document.createElement('h3');
  titulo.textContent = g.titulo;
  const legenda = document.createElement('ul');
  legenda.className = 'legenda';
  g.series.forEach((serie) => { const li = document.createElement('li'); li.textContent = serie.nome; legenda.append(li); });
  caixa.append(titulo, svg, legenda);
  return caixa;
}
