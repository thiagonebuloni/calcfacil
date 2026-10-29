// Links de afiliado: ÚNICO lugar para trocar links e textos.
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
// Chaves aceitas: decimo-terceiro, ferias, rescisao, juros-compostos, financiamento, aposentadoria, me.

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
  'me': []
};

import { el } from './render.js';

export function blocoAfiliado(calc) {
  const ofertas = (AFILIADOS[calc] || []).filter((o) => o && o.url);
  if (!ofertas.length) return null;
  const o = ofertas[0];
  return el('aside', { class: 'afiliado', 'aria-label': 'Publicidade' },
    el('p', { class: 'rotulo' }, 'Publicidade. Podemos receber comissão se você contratar.'),
    el('h3', {}, o.titulo),
    o.texto ? el('p', {}, o.texto) : null,
    el('a', { class: 'btn', href: o.url, target: '_blank', rel: 'sponsored nofollow noopener' }, o.botao || 'Saiba mais'));
}
