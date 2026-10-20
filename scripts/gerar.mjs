// Gera todas as páginas estáticas a partir de site.config.json, data/tabelas.json e scripts/conteudo.mjs.
// Uso: npm run gerar

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculadoras, blog, institucionais } from './conteudo.mjs';
import { pagina, campoHTML, esc } from './layout.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (p) => JSON.parse(readFileSync(join(raiz, p), 'utf8'));
const escrever = (p, conteudo) => {
  const destino = join(raiz, p);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, conteudo);
};

const cfg = ler('site.config.json');
const tabelas = ler('data/tabelas.json');
const br = (iso) => iso.split('-').reverse().join('/');
const ANO = tabelas.vigencia.slice(0, 4);
cfg._vigenciaBR = br(tabelas.vigencia);
const atualizadoBR = br(tabelas.atualizadoEm);
const base = cfg.url.replace(/\/$/, '');

const tokens = (s) =>
  s.replaceAll('{ANO}', ANO)
    .replaceAll('{NOME}', cfg.nome)
    .replaceAll('{EMAIL}', cfg.email)
    .replaceAll('{DATA}', atualizadoBR)
    .replaceAll('{RESPONSAVEL}', cfg.responsavel || `O titular do ${cfg.nome}`);

const paginas = []; // para o sitemap
const emitir = (caminho, opcoes) => {
  const html = pagina({ cfg, calculadoras, caminho, ...opcoes });
  escrever(caminho === '/' ? 'index.html' : join(caminho, 'index.html'), html);
  if (!opcoes.noindex) paginas.push(caminho);
};

const migalhas = (itens) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: itens.map(([nome, caminho], i) => ({
    '@type': 'ListItem', position: i + 1, name: nome, item: base + caminho,
  })),
});

// ---------- Calculadoras ----------
for (const c of calculadoras) {
  const caminho = `/${c.slug}/`;
  const titulo = tokens(c.titulo), descricao = tokens(c.descricao);
  const rel = c.relacionadas.map((s) => calculadoras.find((x) => x.slug === s));
  const slot = (nome) => `<div class="ad-slot" data-slot="${nome}" hidden></div>`;

  const corpo = `
<nav class="migalhas" aria-label="Você está em"><a href="/">Início</a> / <span>${esc(c.nomeCurto)}</span></nav>
<article>
<h1>${esc(c.h1)}</h1>
<p class="lead">${esc(c.lead)}</p>
<form class="calc" data-calc="${c.slug}" novalidate>
<div class="campos">
${c.campos.map(campoHTML).join('\n')}
</div>
<div class="acoes"><button class="btn" type="submit">Calcular</button><button class="btn-sec" type="reset">Limpar</button></div>
</form>
<section id="resultado" class="resultado" aria-live="polite" tabindex="-1" hidden></section>
${slot('resultado')}
<section class="texto">${tokens(c.comoCalcula)}</section>
${slot('meio')}
<section class="faq">
<h2>Perguntas frequentes</h2>
${c.faq.map(([q, a]) => `<details><summary>${esc(tokens(q))}</summary><p>${esc(tokens(a))}</p></details>`).join('\n')}
</section>
${slot('fim')}
<section class="relacionadas">
<h2>Outras calculadoras</h2>
<ul>${rel.map((r) => `<li><a href="/${r.slug}/">${esc(r.nomeCurto)}<small>${esc(r.resumoLista)}</small></a></li>`).join('')}</ul>
</section>
<aside class="aviso-legal">
<p><strong>Aviso:</strong> resultado estimado, de caráter informativo. Não substitui o cálculo oficial nem a orientação de contador, advogado ou consultor financeiro. <a href="/aviso-legal/">Leia o aviso legal</a>.</p>
<p>Base legal: ${esc(c.lei)}. Tabelas de INSS e IRRF vigentes em ${cfg._vigenciaBR}. Última revisão: ${atualizadoBR}.</p>
</aside>
</article>`;

  emitir(caminho, {
    titulo, descricao, corpo, menuAtual: c.slug,
    ld: [
      {
        '@context': 'https://schema.org', '@type': 'WebApplication', name: c.nome, url: base + caminho,
        description: descricao, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', inLanguage: 'pt-BR',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
      },
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: tokens(q), acceptedAnswer: { '@type': 'Answer', text: tokens(a) } })),
      },
      migalhas([['Início', '/'], [c.nomeCurto, caminho]]),
    ],
  });
}

// ---------- Blog ----------
for (const a of blog) {
  const caminho = `/blog/${a.slug}/`;
  const calc = calculadoras.find((c) => c.slug === a.calc);
  emitir(caminho, {
    titulo: a.titulo, descricao: a.descricao, menuAtual: 'blog', tipoOG: 'article',
    dataPublicacao: a.data, dataModificacao: tabelas.atualizadoEm,
    corpo: `
<nav class="migalhas" aria-label="Você está em"><a href="/">Início</a> / <a href="/blog/">Blog</a> / <span>${esc(a.titulo)}</span></nav>
<article class="artigo">
<h1>${esc(a.titulo)}</h1>
<p class="fonte">Publicado em ${br(a.data)}. Tabelas de INSS e IRRF de ${cfg._vigenciaBR}.</p>
${tokens(a.corpo)}
<p><a class="btn" href="/${calc.slug}/">Abrir a ${esc(calc.nome.toLowerCase())}</a></p>
<div class="ad-slot" data-slot="fim" hidden></div>
<aside class="aviso-legal"><p>Conteúdo informativo. Não substitui a orientação de um profissional. <a href="/aviso-legal/">Aviso legal</a>.</p></aside>
</article>`,
    ld: [
      {
        '@context': 'https://schema.org', '@type': 'Article', headline: a.titulo, description: a.descricao,
        datePublished: a.data, dateModified: tabelas.atualizadoEm, inLanguage: 'pt-BR',
        mainEntityOfPage: base + caminho, image: base + '/assets/img/og.png',
        author: { '@type': 'Organization', name: cfg.nome, url: base + '/' },
        publisher: { '@type': 'Organization', name: cfg.nome },
      },
      migalhas([['Início', '/'], ['Blog', '/blog/'], [a.titulo, caminho]]),
    ],
  });
}
emitir('/blog/', {
  titulo: `Blog ${cfg.nome}: guias de cálculo trabalhista e financeiro`,
  descricao: 'Guias práticos sobre rescisão, 13º salário, férias, financiamento e investimentos, com exemplos numéricos.',
  menuAtual: 'blog',
  corpo: `
<nav class="migalhas" aria-label="Você está em"><a href="/">Início</a> / <span>Blog</span></nav>
<h1>Blog</h1>
<p class="lead">Guias curtos, com exemplos numéricos, para entender as contas por trás das calculadoras.</p>
<ul class="blog-lista">
${blog.map((a) => `<li><a href="/blog/${a.slug}/">${esc(a.titulo)}</a><p>${esc(a.descricao)}</p></li>`).join('\n')}
</ul>`,
  ld: [migalhas([['Início', '/'], ['Blog', '/blog/']])],
});

// ---------- Institucionais ----------
for (const [slug, p] of Object.entries(institucionais)) {
  emitir(`/${slug}/`, {
    titulo: tokens(p.titulo) + (slug === 'sobre' ? '' : ` | ${cfg.nome}`),
    descricao: tokens(p.descricao),
    corpo: `<article class="artigo">${tokens(p.corpo)}</article>`,
    ld: [migalhas([['Início', '/'], [tokens(p.titulo), `/${slug}/`]])],
  });
}

// ---------- Página inicial ----------
emitir('/', {
  titulo: `${cfg.nome}: calculadoras de rescisão, 13º, férias, financiamento e mais`,
  descricao: `${cfg.slogan}. Rescisão, 13º salário, férias, financiamento, juros compostos e aposentadoria, com INSS e IRRF de ${ANO} e a conta explicada.`,
  corpo: `
<section class="hero">
<h1>${esc(cfg.slogan)}</h1>
<p class="lead">Cálculos com as tabelas de ${ANO}, o passo a passo à vista e seus dados só no seu navegador.</p>
</section>
<ul class="lista-calcs">
${calculadoras.map((c) => `<li><a href="/${c.slug}/"><strong>${esc(c.nome)}</strong><span>${esc(c.resumoLista)}</span><span class="seta" aria-hidden="true">›</span></a></li>`).join('\n')}
</ul>
<section class="texto">
<h2>Por que confiar nos cálculos</h2>
<ul>
<li>As faixas de INSS e IRRF vêm de um arquivo único, com a fonte oficial e a data de vigência (${cfg._vigenciaBR}).</li>
<li>Cada fórmula tem testes automatizados, conferidos contra um cálculo independente.</li>
<li>Toda página mostra a fórmula, um exemplo numérico e as perguntas mais comuns.</li>
<li>Nada do que você digita sai do seu navegador.</li>
</ul>
<h2>Guias</h2>
<ul>
${blog.map((a) => `<li><a href="/blog/${a.slug}/">${esc(a.titulo)}</a></li>`).join('\n')}
</ul>
</section>
<aside class="aviso-legal"><p>Os resultados são estimativas informativas e não substituem a orientação de um profissional. <a href="/aviso-legal/">Aviso legal</a>.</p></aside>`,
  ld: [{
    '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.nome, url: base + '/', inLanguage: 'pt-BR', description: cfg.slogan,
  }],
});

// ---------- 404 ----------
escrever('404.html', pagina({
  cfg, calculadoras, caminho: '/404.html', noindex: true,
  titulo: `Página não encontrada | ${cfg.nome}`, descricao: 'A página que você procurou não existe ou mudou de endereço. Escolha uma das calculadoras do site.',
  corpo: `<h1>Página não encontrada</h1><p class="lead">O endereço pode ter mudado ou estar digitado errado. Escolha uma calculadora:</p>
<ul class="lista-calcs">${calculadoras.map((c) => `<li><a href="/${c.slug}/"><strong>${esc(c.nome)}</strong><span>${esc(c.resumoLista)}</span><span class="seta" aria-hidden="true">›</span></a></li>`).join('')}</ul>`,
}));

// ---------- Sitemap, robots, ads.txt, headers, favicon ----------
escrever('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map((p) => `  <url><loc>${esc(base + p)}</loc><lastmod>${tabelas.atualizadoEm}</lastmod></url>`).join('\n')}
</urlset>
`);
escrever('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

if (cfg.adsenseClient) {
  const pub = cfg.adsenseClient.replace(/^ca-/, '');
  escrever('ads.txt', `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
} else if (existsSync(join(raiz, 'ads.txt'))) {
  rmSync(join(raiz, 'ads.txt'));
}

// Headers de segurança e cache - fonte única para _headers (Cloudflare/Netlify) e vercel.json (Vercel).
// A Vercel exige padrão `/(.*)`; o formato _headers usa `/*`.
const paraVercel = (source) => source.replace(/\/\*$/, '/(.*)');
const cabecalhos = [
  { source: '/*', lines: ['X-Content-Type-Options: nosniff', 'Referrer-Policy: strict-origin-when-cross-origin', "X-Frame-Options: DENY", "Content-Security-Policy: frame-ancestors 'none'", 'Permissions-Policy: camera=(), geolocation=(), microphone=()'] },
  { source: '/assets/*', lines: ['Cache-Control: public, max-age=3600'] },
  { source: '/data/*', lines: ['Cache-Control: public, max-age=3600'] },
];
escrever('_headers', cabecalhos.map((c) => `${c.source}\n${c.lines.map((l) => `  ${l}`).join('\n')}`).join('\n\n') + '\n');
escrever('vercel.json', JSON.stringify({
  headers: cabecalhos.map((c) => ({
    source: paraVercel(c.source),
    headers: c.lines.map((l) => {
      const i = l.indexOf(':');
      return { key: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
    }),
  })),
}, null, 2) + '\n');

escrever('assets/img/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0b7557"/><rect x="8" y="10" width="16" height="3.5" rx="1.5" fill="#fff"/><rect x="8" y="18.5" width="16" height="3.5" rx="1.5" fill="#ffe58a"/></svg>
`);

console.log(`Geradas ${paginas.length} páginas indexáveis (+404). Vigência das tabelas: ${tabelas.vigencia}.`);
