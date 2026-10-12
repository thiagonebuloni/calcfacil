# CalcFácil — Calculadoras Financeiras em Português

Site estático com calculadoras e simuladores financeiros para o Brasil: rescisão, 13º salário, férias, financiamento, juros compostos e aposentadoria. Monetizado com Google AdSense e links de afiliados.

> Este README é o guia de execução do projeto. O escopo completo está no [PRD.md](PRD.md). Marque os itens `[ ]` conforme avançar.

---

## Índice

1. [Visão rápida](#1-visão-rápida)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Antes de publicar: o que preencher](#3-antes-de-publicar-o-que-preencher)
4. [Passo a passo](#4-passo-a-passo)
5. [Estrutura do projeto](#5-estrutura-do-projeto)
6. [Rodando localmente](#6-rodando-localmente)
7. [Testes](#7-testes)
8. [Atualização anual das tabelas](#8-atualização-anual-das-tabelas)
9. [Checklist de lançamento](#9-checklist-de-lançamento)
10. [Checklist do AdSense](#10-checklist-do-adsense)
11. [Afiliados](#11-afiliados)
12. [Padrão de página de calculadora](#12-padrão-de-página-de-calculadora)
13. [Convenções de código](#13-convenções-de-código)
14. [Aviso legal](#14-aviso-legal)

---

## 1. Visão rápida

| Item | Decisão |
|---|---|
| Tipo | Site estático (HTML + CSS + JS), sem back-end |
| Hospedagem | Cloudflare Pages (alternativas: Vercel, Netlify) |
| Domínio | Próprio (.com.br ou .com), exigência prática do AdSense |
| Dados do usuário | Nada é enviado a servidor; cálculo 100% no navegador |
| Monetização | AdSense + afiliados |
| Custo inicial | Apenas o domínio (≈ R$ 40–60/ano) |

## 2. Pré-requisitos

- [x] Node.js 20+ (apenas para testes e servidor local)
- [ ] Git e conta no GitHub
- [ ] Conta na Cloudflare (ou Vercel/Netlify)
- [ ] Conta Google (Search Console, AdSense, Analytics)
- [ ] Cartão ou Pix para registrar o domínio

## 3. Antes de publicar: o que preencher

Em `site.config.json`:

| Campo | O que colocar |
|---|---|
| `url` | O endereço final com https, sem barra no fim (ex.: `https://www.meusite.com.br`). Vale para canonical, sitemap e dados estruturados |
| `email` | O e-mail de contato real (aparece em Contato e Privacidade) |
| `responsavel` | Seu nome ou razão social, para a política de privacidade |
| `nome` | O nome definitivo do site |
| `adsenseClient`, `adsenseSlots` | Preencher só depois da aprovação do AdSense |
| `gaId` | ID do Google Analytics 4, se quiser usar |

Depois: `npm run gerar`, `node --test` e publicar.

## 4. Passo a passo

### Fase 0 — Preparação (semana 1)

- [ ] Escolher o nome definitivo e checar disponibilidade no [Registro.br](https://registro.br) e em um registrador .com
- [ ] Registrar o domínio
- [ ] Criar o repositório no GitHub e clonar
- [ ] Criar conta no Google Search Console
- [ ] Pesquisar programas de afiliados (ver [seção 11](#11-afiliados)) e preparar o cadastro

### Fase 1 — Fundação (semanas 1–2)

- [x] Criar a estrutura de pastas (ver [seção 5](#5-estrutura-do-projeto))
- [x] Criar `assets/css/base.css` (variáveis, tipografia, layout responsivo, estilos de impressão)
- [x] Criar módulos em `assets/js/core/`: `moeda.js`, `datas.js`, `validacao.js`
- [x] Criar `data/tabelas.json` com INSS, IRRF, salário mínimo, **fonte e data de vigência de cada valor** (conferir valores nas fontes antes de publicar)
- [x] Criar o cabeçalho, o rodapé e a navegação padrão
- [x] Páginas institucionais criadas (Sobre, Contato, Privacidade, Termos, Aviso legal). Revise os textos, preencha e-mail e responsável em `site.config.json` e, de preferência, peça uma revisão jurídica da privacidade e dos termos
- [x] Implementar o banner de consentimento de cookies

### Fase 2 — Calculadoras (semanas 2–4)

Ordem sugerida (sazonalidade e complexidade):

- [x] 13º salário
- [x] Férias
- [x] Rescisão
- [x] Juros compostos
- [x] Financiamento (Price e SAC)
- [x] Aposentadoria (estimativa)

Para **cada** calculadora:

1. Escrever a função pura em `assets/js/calc/<nome>.js`
2. Escrever os testes em `tests/<nome>.test.js` com casos conferidos manualmente em fontes oficiais
3. Montar a página seguindo o [padrão da seção 12](#12-padrão-de-página-de-calculadora)
4. Escrever o texto "Como é calculado" e o FAQ
5. Adicionar dados estruturados (JSON-LD)
6. Rodar o Lighthouse e corrigir
7. Adicionar a página ao `sitemap.xml`

### Fase 3 — Publicação (semana 4)

- [ ] Conectar o repositório à Cloudflare Pages (diretório de saída: raiz do projeto, sem comando de build)
- [ ] Apontar o domínio para a hospedagem e confirmar HTTPS
- [ ] Gerar e publicar `sitemap.xml` e `robots.txt`
- [ ] Verificar o site no Search Console e enviar o sitemap
- [ ] Solicitar indexação das páginas principais
- [ ] Preencher `gaId` em `site.config.json` para ativar o Analytics (só carrega com consentimento)

### Fase 4 — Monetização (semanas 5–6)

- [ ] Conferir o [checklist do AdSense](#10-checklist-do-adsense) e solicitar a aprovação
- [ ] Após aprovado, preencher `adsenseClient` e `adsenseSlots` em `site.config.json` e rodar `npm run gerar` (o `ads.txt` é criado sozinho; os blocos de anúncio só aparecem depois do consentimento de cookies)
- [ ] Posicionar os slots com altura reservada (evitar deslocamento de layout)
- [ ] Inserir os blocos de afiliados com rótulo de publicidade
- [ ] Verificar Core Web Vitals depois de ativar os anúncios

### Fase 5 — Crescimento (contínuo)

- [ ] Escrever artigos de apoio (blog) ligados às calculadoras
- [ ] Acompanhar consultas e posições no Search Console e melhorar títulos e textos das páginas com muitas impressões e poucos cliques
- [ ] Criar novas calculadoras a partir das buscas observadas (ex.: seguro-desemprego, FGTS, salário líquido, reajuste, MEI)
- [ ] Testar posições de anúncio e blocos de afiliados

### Fase 6 — Manutenção

- [ ] **Todo janeiro:** atualizar `data/tabelas.json` e rodar os testes
- [ ] Revisar o conteúdo quando houver mudança de lei
- [ ] Revisar o aviso de "última atualização" nas páginas

## 5. Estrutura do projeto

```
/
├── site.config.json          # nome, URL, e-mail, IDs de AdSense e Analytics
├── scripts/
│   ├── gerar.mjs             # gera todas as páginas HTML (npm run gerar)
│   ├── conteudo.mjs          # textos, campos dos formulários, FAQ, blog, institucionais
│   └── layout.mjs            # cabeçalho, rodapé, SEO e JSON-LD
├── assets/
│   ├── css/base.css
│   ├── js/
│   │   ├── core/             # moeda, datas, validação
│   │   ├── calc/             # funções puras de cálculo (uma por calculadora + impostos.js)
│   │   └── ui/               # formulários, resultado, gráfico, cookies, anúncios, afiliados
│   └── img/              # favicon.svg e og.png (imagem de compartilhamento 1200×630)
├── data/tabelas.json         # INSS, IRRF, FGTS, aviso prévio, IR regressivo
├── tests/                    # node --test
├── index.html                # páginas abaixo são GERADAS: não edite à mão
├── rescisao/ decimo-terceiro/ ferias/ financiamento/ juros-compostos/ aposentadoria/
├── blog/  sobre/  contato/  privacidade/  termos/  aviso-legal/
├── 404.html  sitemap.xml  robots.txt  _headers
├── ads.txt                   # gerado quando adsenseClient estiver preenchido
├── README.md
└── PRD.md
```

## 6. Rodando localmente

Como o projeto usa módulos ES, é preciso servir os arquivos por HTTP (não abra o `index.html` direto):

```bash
npm run gerar   # gera as páginas a partir do conteúdo e da configuração
npm run serve   # servidor local (ou: python3 -m http.server 8000)
```

Depois abra o endereço indicado no terminal. Sempre que editar `site.config.json`, `scripts/conteudo.mjs` ou `data/tabelas.json`, rode `npm run gerar` e publique os arquivos gerados junto com o resto.

## 7. Testes

As funções de cálculo são puras, então os testes não precisam de navegador (hoje são 50 testes, incluindo verificações das próprias páginas geradas):

```bash
node --test
```

Regras para os testes:

- Cada calculadora precisa de pelo menos 5 casos: típico, valor mínimo, valor máximo, borda de faixa de imposto e entrada inválida.
- Compare os resultados com uma fonte oficial (por exemplo, a Calculadora do Cidadão do Banco Central para financiamento e juros) ou com um cálculo manual documentado no próprio teste.
- Nunca altere o resultado esperado de um teste só para ele passar; investigue a diferença.

## 8. Atualização anual das tabelas

Todos os valores legais ficam em `data/tabelas.json`: salário mínimo, faixas e teto do INSS, tabela do IRRF (com desconto simplificado, dedução por dependente e a redução da Lei 15.270/2025), aviso prévio, FGTS e IR regressivo. Cada bloco traz `fonte` e `url`, e o arquivo traz `vigencia` e `atualizadoEm`, que aparecem no rodapé e nas páginas.

> Os valores atuais são os de 2026 e **devem ser conferidos** nas fontes oficiais (Receita Federal, Ministério da Previdência, Planalto) antes da publicação e a cada janeiro. O teste `site.test.js` impede que algum valor legal seja colado dentro das fórmulas.

Roteiro de atualização:

1. Consultar as fontes oficiais.
2. Atualizar o JSON, `vigencia` e `atualizadoEm`.
3. Rodar `node --test` e ajustar os casos de teste que dependem das faixas (`tests/impostos.test.js`, `ferias.test.js`, `rescisao.test.js`, `decimo-terceiro.test.js`), conferindo os novos valores esperados por um cálculo independente.
4. Rodar `npm run gerar` (atualiza as datas nas páginas e no sitemap).
5. Fazer o deploy.

## 9. Checklist de lançamento

- [x] Todos os testes passam
- [x] Lighthouse mobile: Performance ≥ 90, Acessibilidade ≥ 90, SEO ≥ 95
- [x] Cada página tem `title`, `meta description`, H1 único e `canonical`
- [x] Open Graph e imagem de compartilhamento configurados (`assets/img/og.png`)
- [ ] JSON-LD (WebApplication, FAQPage, BreadcrumbList) validado
- [x] Páginas institucionais publicadas e linkadas no rodapé
- [x] Banner de cookies funciona (recusar bloqueia analytics e anúncios)
- [x] Aviso legal visível nas calculadoras
- [ ] Testado em celular real (Android e iOS)
- [ ] `sitemap.xml` enviado ao Search Console

## 10. Checklist do AdSense

As regras mudam; confirme sempre na Central de Ajuda do AdSense antes de enviar.

- [ ] Domínio próprio com HTTPS
- [ ] Conteúdo original e útil em todas as páginas (não só formulário: explicação, exemplo, FAQ)
- [ ] Política de Privacidade mencionando cookies e anúncios de terceiros
- [ ] Páginas Sobre e Contato
- [ ] Navegação clara e site sem links quebrados
- [ ] Nenhum conteúdo copiado
- [ ] Algumas semanas de existência e já indexado no Google (ajuda na análise)
- [ ] Idade mínima e dados de pagamento da conta em ordem

Depois da aprovação:

- [ ] Conferir se o `ads.txt` gerado na raiz está acessível em `/ads.txt`
- [ ] Não clicar nos próprios anúncios e não pedir cliques a visitantes (risco de banimento)

## 11. Afiliados

1. Escolha plataformas e programas relevantes para o público (cartões, contas, crédito, corretoras, previdência).
2. Cadastre-se e leia as regras de cada programa (palavras proibidas, uso de marca, anúncios pagos).
3. Gere os links e coloque-os em `assets/js/ui/afiliados.js` (um único lugar para trocar links e rótulos). Enquanto a lista de uma calculadora estiver vazia, nenhum bloco aparece.
4. Mostre o bloco **depois** do resultado da calculadora, com o rótulo "Publicidade" ou "Links de afiliado".
5. Mantenha no rodapé o aviso de que o site pode receber comissão.
6. Acompanhe cliques e conversões e remova o que não converte.

Mapa inicial (validar com os programas disponíveis):

| Calculadora | Tipo de oferta |
|---|---|
| Rescisão, 13º, férias | Conta digital, crédito, corretoras |
| Financiamento | Simulação de crédito imobiliário/veicular |
| Juros compostos, aposentadoria | Corretoras, bancos digitais, previdência |

## 12. Padrão de página de calculadora

Ordem dos blocos em cada página:

1. Cabeçalho e breadcrumb
2. **H1** com a palavra-chave principal
3. Resumo de 1 a 2 linhas ("Calcule X em segundos")
4. Formulário da calculadora
5. Resultado detalhado (com `aria-live="polite"`)
6. Bloco de próximo passo / afiliado
7. Slot de anúncio 1
8. Seção "Como é calculado", com fórmulas e exemplo numérico
9. Slot de anúncio 2
10. FAQ (5 a 8 perguntas)
11. Calculadoras relacionadas
12. Aviso legal, fonte da legislação e data da última atualização
13. Rodapé

## 13. Convenções de código

- Cálculos de dinheiro em **centavos inteiros** ou com arredondamento explícito em `moeda.js`; nunca somar decimais de ponto flutuante direto.
- Funções de cálculo **puras**: recebem um objeto, devolvem um objeto, sem tocar no DOM.
- Nenhum valor legal dentro das fórmulas; sempre ler de `data/tabelas.json`.
- Textos em português do Brasil; datas `dd/mm/aaaa` e moeda `R$ 1.234,56`.
- CSS mobile-first; slots de anúncio com `min-height` definido.
- Scripts de terceiros (anúncios, analytics) só carregam depois do consentimento.
- Commits curtos e no imperativo (ex.: `Adiciona calculadora de 13º`).

## 14. Aviso legal

Os resultados são **estimativas informativas** e não substituem o cálculo oficial, nem a orientação de contador, advogado ou consultor financeiro. O site não oferece aconselhamento financeiro, jurídico ou de investimento. Este texto deve aparecer, de forma resumida, em todas as páginas de calculadora.
