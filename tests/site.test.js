// Verifica o site gerado: metadados, links internos, tokens não substituídos e sitemap.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync('node', [join(raiz, 'scripts/gerar.mjs')], { stdio: 'ignore' });

function paginas(dir = raiz, acc = []) {
  for (const n of readdirSync(dir)) {
    if (['node_modules', 'tests', 'scripts', 'assets', 'data', '.git'].includes(n)) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) paginas(p, acc);
    else if (n.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const todas = paginas();
const rel = (p) => p.slice(raiz.length);

test('existem as páginas esperadas', () => {
  assert.ok(todas.length >= 17, `só ${todas.length} páginas`);
  for (const s of ['rescisao', 'decimo-terceiro', 'ferias', 'financiamento', 'juros-compostos', 'aposentadoria', 'me', 'inss', 'privacidade', 'sobre', 'contato', 'termos', 'aviso-legal', 'blog']) {
    assert.ok(existsSync(join(raiz, s, 'index.html')), `falta /${s}/`);
  }
});

test('cada página tem title, description, canonical e um único h1', () => {
  for (const p of todas) {
    const h = readFileSync(p, 'utf8');
    assert.match(h, /<title>[^<]{10,}<\/title>/, rel(p));
    assert.match(h, /<meta name="description" content="[^"]{40,}/, rel(p));
    assert.match(h, /<link rel="canonical" href="https?:\/\//, rel(p));
    assert.equal((h.match(/<h1[ >]/g) || []).length, 1, `h1 em ${rel(p)}`);
  }
});

test('a navegação agrupa as calculadoras por tema em todas as páginas', () => {
  const grupos = {
    Trabalhista: ['decimo-terceiro', 'ferias', 'rescisao'],
    Finanças: ['juros-compostos', 'financiamento'],
    Aposentadoria: ['aposentadoria', 'inss'],
  };
  for (const p of todas) {
    const h = readFileSync(p, 'utf8');
    const nav = h.match(/<nav class="menu"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav, `navegação ausente em ${rel(p)}`);
    for (const [nome, slugs] of Object.entries(grupos)) {
      const grupo = nav.match(new RegExp(`<details class="menu-grupo[^"]*"[^>]*><summary>${nome}<\\/summary>([\\s\\S]*?)<\\/details>`))?.[1];
      assert.ok(grupo, `grupo ${nome} ausente em ${rel(p)}`);
      for (const slug of slugs) assert.match(grupo, new RegExp(`href="/${slug}/"`), `${slug} fora do grupo ${nome} em ${rel(p)}`);
    }
    assert.doesNotMatch(nav, /<details class="menu-grupo[^"]*" open>/, `grupo aberto por padrão em ${rel(p)}`);
    assert.equal((nav.match(/href="\/(?:decimo-terceiro|ferias|rescisao|juros-compostos|financiamento|aposentadoria|inss)\//g) || []).length, 7, `link duplicado ou ausente na navegação de ${rel(p)}`);
  }
});

test('grupos da navegação abrem e fecham ao passar o mouse', () => {
  const app = readFileSync(join(raiz, 'assets/js/ui/app.js'), 'utf8');
  assert.match(app, /addEventListener\('pointerenter'[\s\S]*?ev\.pointerType === 'mouse'[\s\S]*?grupo\.open = true/);
  assert.match(app, /addEventListener\('pointerleave'[\s\S]*?ev\.pointerType === 'mouse'[\s\S]*?grupo\.open = false/);
});

test('o post de compras internacionais usa o mesmo bloco de publicidade da calculadora', () => {
  const post = readFileSync(join(raiz, 'blog/compras-internacionais-impostos/index.html'), 'utf8');
  const app = readFileSync(join(raiz, 'assets/js/ui/app.js'), 'utf8');
  const afiliados = readFileSync(join(raiz, 'assets/js/ui/afiliados.js'), 'utf8');
  assert.match(post, /<div data-afiliado="importacao"><\/div>/);
  assert.match(app, /querySelectorAll\('\[data-afiliado\]'\)[\s\S]*?blocoAfiliado\(slot\.dataset\.afiliado\)/);
  assert.match(afiliados, /Fones Earfun Clip Hi-Res — open-ear sem fio/);
  assert.match(afiliados, /Earfun Clip — áudio sem fio com microfone/);
  assert.match(afiliados, /Oferta Earfun — fones open-ear para chamadas/);
});

test('nenhum token do gerador ficou sem substituição', () => {
  for (const p of todas) {
    const h = readFileSync(p, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
    assert.doesNotMatch(h, /\{(ANO|NOME|EMAIL|DATA|RESPONSAVEL)\}/, rel(p));
    assert.doesNotMatch(h, /\bundefined\b|\[object Object\]/, rel(p));
  }
});

test('links internos apontam para páginas ou arquivos existentes', () => {
  for (const p of todas) {
    const h = readFileSync(p, 'utf8');
    for (const [, href] of h.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const alvo = href.endsWith('/') ? join(raiz, href, 'index.html') : join(raiz, href);
      assert.ok(existsSync(alvo), `${rel(p)} aponta para ${href}, que não existe`);
    }
  }
});

test('calculadoras: formulário, FAQ, JSON-LD e aviso legal', () => {
  for (const s of ['rescisao', 'decimo-terceiro', 'ferias', 'financiamento', 'juros-compostos', 'aposentadoria', 'me', 'inss']) {
    const h = readFileSync(join(raiz, s, 'index.html'), 'utf8');
    assert.match(h, new RegExp(`<form class="calc" data-calc="${s}"`));
    assert.ok((h.match(/<details><summary>/g) || []).length >= 5, `FAQ curto em ${s}`);
    for (const tipo of ['WebApplication', 'FAQPage', 'BreadcrumbList']) assert.match(h, new RegExp(`"@type":"${tipo}"`), `${tipo} em ${s}`);
    assert.match(h, /class="aviso-legal"/);
    assert.ok(existsSync(join(raiz, 'assets/js/calc', `${s}.js`)));
    // cada campo tem rótulo associado
    for (const [, id] of h.matchAll(/<(?:input|select)[^>]*\sid="(f-[^"]+)"/g)) assert.ok(h.includes(`for="${id}"`), `label de ${id} em ${s}`);
  }
});

test('sitemap lista todas as páginas indexáveis e robots aponta para ele', () => {
  const sm = readFileSync(join(raiz, 'sitemap.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, todas.length - 1); // tudo menos o 404
  assert.match(readFileSync(join(raiz, 'robots.txt'), 'utf8'), /Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test('canonical, og:url e sitemap usam a url base do site.config.json sem barra final', () => {
  const cfgUrl = JSON.parse(readFileSync(join(raiz, 'site.config.json'), 'utf8')).url;
  assert.ok(!cfgUrl.endsWith('/'), 'url do site.config.json não deve terminar com /');
  const base = cfgUrl.replace(/\/$/, '');
  for (const p of todas) {
    const h = readFileSync(p, 'utf8');
    const canon = h.match(/<link rel="canonical" href="([^"]+)"/)[1];
    assert.ok(canon.startsWith(base + '/'), `${rel(p)}: canonical fora da base`);
    const og = h.match(/property="og:url" content="([^"]+)"/)[1];
    assert.equal(og, canon, `og:url ≠ canonical em ${rel(p)}`);
  }
  const sm = readFileSync(join(raiz, 'sitemap.xml'), 'utf8');
  for (const [, loc] of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) assert.ok(loc.startsWith(base + '/'), `sitemap fora da base: ${loc}`);
});

test('twitter card completa em todas as páginas', () => {
  for (const p of todas) {
    const h = readFileSync(p, 'utf8');
    for (const m of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      assert.match(h, new RegExp(`<meta name="${m}" content="[^"]+`), `${m} em ${rel(p)}`);
    }
    assert.match(h, /<meta property="og:image:alt" content="[^"]+/, `og:image:alt em ${rel(p)}`);
  }
});

test('artigos do blog marcam article:published_time e JSON-LD com author', () => {
  for (const a of readdirSync(join(raiz, 'blog'))) {
    if (!statSync(join(raiz, 'blog', a)).isDirectory()) continue; // ignora blog/index.html
    const p = join(raiz, 'blog', a, 'index.html');
    const h = readFileSync(p, 'utf8');
    assert.match(h, /property="article:published_time" content="\d{4}-\d{2}-\d{2}"/, rel(p));
    assert.match(h, /"author":\{"@type":"Organization"/, rel(p));
    assert.match(h, /"datePublished":"\d{4}-\d{2}-\d{2}"/, rel(p));
  }
});

test('vercel.json e _headers refletem a mesma política de headers', () => {
  const vc = JSON.parse(readFileSync(join(raiz, 'vercel.json'), 'utf8'));
  const headersVercel = vc.headers.find((h) => h.source === '/(.*)').headers;
  const keys = headersVercel.map((h) => h.key);
  for (const k of ['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options', 'Content-Security-Policy', 'Permissions-Policy']) {
    assert.ok(keys.includes(k), `falta ${k} no vercel.json`);
  }
  const hdr = readFileSync(join(raiz, '_headers'), 'utf8');
  for (const h of headersVercel) assert.ok(hdr.includes(`${h.key}: ${h.value}`), `${h.key} diverge entre _headers e vercel.json`);
});


test('site.config.json guarda o endereco anterior para o redirect de dominio', () => {
  const cfg = JSON.parse(readFileSync(join(raiz, 'site.config.json'), 'utf8'));
  assert.ok(cfg.urlAnterior, 'falta urlAnterior no site.config.json');
  assert.notEqual(cfg.urlAnterior.replace(/\/$/, ''), cfg.url.replace(/\/$/, ''), 'urlAnterior deve diferir de url');
  assert.match(cfg.urlAnterior, /^https?:\/\//, 'urlAnterior deve ser uma URL absoluta');
});

test('a meta tag do Search Console e gerada quando configurada', () => {
  const cfg = JSON.parse(readFileSync(join(raiz, 'site.config.json'), 'utf8'));
  assert.ok(cfg.searchConsoleVerification, 'falta searchConsoleVerification no site.config.json');
  // Aceita token puro ou o HTML completo da meta tag.
  const token = cfg.searchConsoleVerification.match(/content=["']?([^"'\s]+)["']?/)?.[1]
    || cfg.searchConsoleVerification.trim();
  for (const p of todas) {
    const h = readFileSync(p, 'utf8');
    const head = h.slice(h.indexOf('<head>'), h.indexOf('</head>'));
    assert.match(
      head,
      new RegExp(`<meta name="google-site-verification" content="${token}">`),
      `meta google-site-verification ausente ou incorreta em ${rel(p)}`
    );
  }
});

test('o ads.txt e gerado a partir do adsenseClient', () => {
  const cfg = JSON.parse(readFileSync(join(raiz, 'site.config.json'), 'utf8'));
  const pub = cfg.adsenseClient.replace(/^ca-/, '');
  assert.equal(readFileSync(join(raiz, 'ads.txt'), 'utf8').trim(), `google.com, ${pub}, DIRECT, f08c47fec0942fa0`);
});

test('nenhum valor legal fixo nos módulos de cálculo', () => {
  const proibidos = ['607.2', '2428.8', '8475.55', '0.133145', '978.62', '189.59', '1621'];
  for (const arq of readdirSync(join(raiz, 'assets/js/calc'))) {
    const src = readFileSync(join(raiz, 'assets/js/calc', arq), 'utf8');
    for (const v of proibidos) assert.ok(!src.includes(v), `${arq} contém o valor legal ${v}`);
  }
});
