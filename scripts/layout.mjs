// Layout compartilhado: cabeçalho, rodapé, <head> com SEO e JSON-LD.

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function jsonld(obj) {
  // "<" escapado para impedir fechamento prematuro do <script>
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
}

export function pagina({ cfg, caminho, titulo, descricao, corpo, ld = [], menuAtual = '', calculadoras, tipoOG = 'website', noindex = false, dataPublicacao = '', dataModificacao = '' }) {
  const url = cfg.url.replace(/\/$/, '') + caminho;
  const siteCfg = {
    adsenseClient: cfg.adsenseClient || '',
    adsenseSlots: cfg.adsenseSlots || {},
    gaId: cfg.gaId || '',
  };
  // Meta tag de verificação do AdSense (o código vem do painel do Google).
  // Aceita o formato completo <meta name="adsense-..." content="..."> ou apenas o par nome/conteudo.
  let metaAdsense = '';
  if (cfg.adsenseVerification) {
    const bruto = String(cfg.adsenseVerification).trim();
    if (/^<meta/i.test(bruto)) metaAdsense = bruto;
    else {
      const m = bruto.match(/name=["']?([^"'\s]+)["']?.*?content=["']?([^"'\s]+)["']?/i);
      metaAdsense = m
        ? `<meta name="${esc(m[1])}" content="${esc(m[2])}">`
        : `<meta name="adsense-account" content="${esc(bruto)}">`;
    }
  }
  // Carregador do AdSense no <head>.
  // O snippet do Google é carregado de forma assíncrona e só entra em execução
  // depois do consentimento de cookies (LGPD), a menos que `adsenseCarregarSempre`
  // esteja ativo no site.config.json.
  function carregadorAdsense(client, sempre) {
    if (!client) return '';
    const url = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    if (sempre) {
      return `<script async src="${url}" crossorigin="anonymous"></script>`;
    }
    return `<script>
(function () {
  var CLIENT = ${JSON.stringify(client)};
  var CHAVE = 'cf_consent_v1';
  function consentiu() {
    try { return localStorage.getItem(CHAVE) === 'todos'; } catch (e) { return false; }
  }
  function carrega() {
    if (document.querySelector('script[data-adsense]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.setAttribute('data-adsense', '');
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(CLIENT);
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }
  if (consentiu()) carrega();
  window.cfAtivarAdsense = carrega;
})();
</script>`;
  }

  const menu = calculadoras
    .map((c) => `<a href="/${c.slug}/"${menuAtual === c.slug ? ' aria-current="page"' : ''}>${esc(c.nomeCurto)}</a>`)
    .join('');
  const nome = esc(cfg.nome);
  const [antes, ...resto] = cfg.nome.split(/(?<=Calc)/);
  const marca = resto.length ? `${esc(antes)}<span>${esc(resto.join(''))}</span>` : nome;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta name="theme-color" content="#0b7557">
<meta name="color-scheme" content="light">
<meta property="og:type" content="${tipoOG}">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${nome}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(cfg.url.replace(/\/$/, '') + '/assets/img/og.png')}">
<meta property="og:image:alt" content="${esc(titulo)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
${tipoOG === 'article' && dataPublicacao ? `<meta property="article:published_time" content="${esc(dataPublicacao)}">\n<meta property="article:modified_time" content="${esc(dataModificacao || dataPublicacao)}">\n` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(descricao)}">
<meta name="twitter:image" content="${esc(cfg.url.replace(/\/$/, '') + '/assets/img/og.png')}">
<meta name="twitter:image:alt" content="${esc(titulo)}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
${metaAdsense}
${carregadorAdsense(cfg.adsenseClient, cfg.adsenseCarregarSempre)}
<link rel="stylesheet" href="/assets/css/base.css">
${ld.map(jsonld).join('\n')}
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="wrap topo-in">
    <a class="marca" href="/" aria-label="${nome}, página inicial">${marca}</a>
    <nav class="menu" aria-label="Calculadoras">${menu}<a href="/blog/"${menuAtual === 'blog' ? ' aria-current="page"' : ''}>Blog</a></nav>
  </div>
</header>
<main id="conteudo" class="wrap">
${corpo}
</main>
<footer class="rodape">
  <div class="wrap rodape-in">
    <nav aria-label="Institucional">
      <a href="/sobre/">Sobre</a>
      <a href="/contato/">Contato</a>
      <a href="/privacidade/">Privacidade</a>
      <a href="/termos/">Termos de uso</a>
      <a href="/aviso-legal/">Aviso legal</a>
      <button type="button" class="link" data-abrir-cookies hidden>Preferências de cookies</button>
    </nav>
    <p>Os resultados são estimativas informativas e não substituem contador, advogado ou consultor financeiro. Este site pode receber comissão por indicações feitas por links de afiliados, sempre identificados como publicidade.</p>
    <p>© ${new Date().getFullYear()} ${nome}. Tabelas de INSS e IRRF vigentes em ${cfg._vigenciaBR}.</p>
  </div>
</footer>
<script type="application/json" id="site-config">${JSON.stringify(siteCfg).replace(/</g, '\\u003c')}</script>
<script type="module" src="/assets/js/ui/app.js"></script>
</body>
</html>
`;
}

export function campoHTML(c) {
  const id = `f-${c.name}`;
  const ajuda = c.ajuda ? `<span class="ajuda" id="ajuda-${c.name}">${esc(c.ajuda)}</span>` : '';
  const erro = `<span class="erro" id="erro-${c.name}" role="alert"></span>`;
  const largo = c.largo ? ' campo-largo' : '';
  const desc = c.ajuda ? ` aria-describedby="ajuda-${c.name}"` : '';
  if (c.tipo === 'calculado') {
    return `<div class="campo${largo}"><label for="${id}">${esc(c.rotulo)}</label><input type="text" inputmode="decimal" autocomplete="off" id="${id}" name="${c.name}" data-tipo="calculado" value="${esc(c.valor ?? '')}"${c.placeholder ? ` placeholder="${esc(c.placeholder)}"` : ''}${desc} readonly aria-readonly="true"><span class="erro" id="erro-${c.name}" role="alert"></span></div>`;
  }
  if (c.tipo === 'checkbox') {
    return `<div class="campo campo-check campo-largo"><input type="checkbox" id="${id}" name="${c.name}" data-tipo="checkbox"${c.valor ? ' checked' : ''}><div><label for="${id}">${esc(c.rotulo)}</label>${c.ajuda ? `<br>${ajuda}` : ''}</div></div>`;
  }
  let controle;
  if (c.tipo === 'select') {
    controle = `<select id="${id}" name="${c.name}" data-tipo="select"${desc}>${c.opcoes
      .map(([v, t]) => `<option value="${esc(v)}"${v === c.valor ? ' selected' : ''}>${esc(t)}</option>`)
      .join('')}</select>`;
  } else if (c.tipo === 'date') {
    controle = `<input type="date" id="${id}" name="${c.name}" data-tipo="date" value="${esc(c.valor ?? '')}"${desc}>`;
  } else {
    const modo = c.tipo === 'number' ? 'numeric' : 'decimal';
    controle = `<input type="text" inputmode="${modo}" autocomplete="off" id="${id}" name="${c.name}" data-tipo="${c.tipo}" value="${esc(c.valor ?? '')}"${c.placeholder ? ` placeholder="${esc(c.placeholder)}"` : ''}${desc}>`;
  }
  return `<div class="campo${largo}"><label for="${id}">${esc(c.rotulo)}</label>${controle}${ajuda}${erro}</div>`;
}
