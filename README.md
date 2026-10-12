# CalcFácil — Calculadoras Financeiras em Português

Site estático com calculadoras e simuladores financeiros para o Brasil: rescisão, 13º salário, férias, financiamento, juros compostos e aposentadoria. Monetizado com Google AdSense e links de afiliados.

> Este README é o guia de execução do projeto. O escopo completo está no [PRD.md](PRD.md). Marque os itens `[ ]` conforme avançar.

---

## Índice

1. [Visão rápida](#1-visão-rápida)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Passo a passo](#3-passo-a-passo)
4. [Estrutura do projeto](#4-estrutura-do-projeto)
5. [Rodando localmente](#5-rodando-localmente)
6. [Testes](#6-testes)
7. [Atualização anual das tabelas](#7-atualização-anual-das-tabelas)
8. [Checklist de lançamento](#8-checklist-de-lançamento)
9. [Checklist do AdSense](#9-checklist-do-adsense)
10. [Afiliados](#10-afiliados)
11. [Padrão de página de calculadora](#11-padrão-de-página-de-calculadora)
12. [Convenções de código](#12-convenções-de-código)
13. [Aviso legal](#13-aviso-legal)

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

- [ ] Node.js 20+ (apenas para testes e servidor local)
- [ ] Git e conta no GitHub
- [ ] Conta na Cloudflare (ou Vercel/Netlify)
- [ ] Conta Google (Search Console, AdSense, Analytics)
- [ ] Cartão ou Pix para registrar o domínio

## 3. Passo a passo

### Fase 0 — Preparação (semana 1)

- [ ] Escolher o nome definitivo e checar disponibilidade no [Registro.br](https://registro.br) e em um registrador .com
- [ ] Registrar o domínio
- [ ] Criar o repositório no GitHub e clonar
- [ ] Criar conta no Google Search Console
- [ ] Pesquisar programas de afiliados (ver [seção 10](#10-afiliados)) e preparar o cadastro

### Fase 1 — Fundação (semanas 1–2)

- [ ] Criar a estrutura de pastas (ver [seção 4](#4-estrutura-do-projeto))
- [ ] Criar `assets/css/base.css` (variáveis, tipografia, layout responsivo, estilos de impressão)
- [ ] Criar módulos em `assets/js/core/`: `moeda.js`, `datas.js`, `validacao.js`
- [ ] Criar `data/tabelas.json` com INSS, IRRF, salário mínimo, **fonte e data de vigência de cada valor**
- [ ] Criar o cabeçalho, o rodapé e a navegação padrão
- [ ] Publicar páginas institucionais: Sobre, Contato, Privacidade, Termos
- [ ] Implementar o banner de consentimento de cookies

### Fase 2 — Calculadoras (semanas 2–4)

Ordem sugerida (sazonalidade e complexidade):

- [ ] 13º salário
- [ ] Férias
- [ ] Rescisão
- [ ] Juros compostos
- [ ] Financiamento (Price e SAC)
- [ ] Aposentadoria (estimativa)

Para **cada** calculadora:

1. Escrever a função pura em `assets/js/calc/<nome>.js`
2. Escrever os testes em `tests/<nome>.test.js` com casos conferidos manualmente em fontes oficiais
3. Montar a página seguindo o [padrão da seção 11](#11-padrão-de-página-de-calculadora)
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
- [ ] Instalar analytics (respeitando o consentimento)

### Fase 4 — Monetização (semanas 5–6)

- [ ] Conferir o [checklist do AdSense](#9-checklist-do-adsense) e solicitar a aprovação
- [ ] Após aprovado, adicionar o script do AdSense e o arquivo `ads.txt`
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

## 4. Estrutura do projeto

```
/
├── index.html
├── rescisao/index.html
├── decimo-terceiro/index.html
├── ferias/index.html
├── financiamento/index.html
├── juros-compostos/index.html
├── aposentadoria/index.html
├── blog/
├── sobre/  contato/  privacidade/  termos/
├── assets/
│   ├── css/base.css
│   ├── js/
│   │   ├── core/      # moeda, datas, validação
│   │   ├── calc/      # funções puras de cálculo
│   │   └── ui/        # formulários, cookies, anúncios
│   └── img/
├── data/tabelas.json
├── tests/
├── sitemap.xml
├── robots.txt
├── ads.txt            # após aprovação do AdSense
├── README.md
└── PRD.md
```

## 5. Rodando localmente

Como o projeto usa módulos ES, é preciso servir os arquivos por HTTP (não abra o `index.html` direto):

```bash
npx serve .
```

Depois abra o endereço indicado no terminal (normalmente `http://localhost:3000`).

## 6. Testes

As funções de cálculo são puras, então os testes não precisam de navegador:

```bash
node --test tests/
```

Regras para os testes:

- Cada calculadora precisa de pelo menos 5 casos: típico, valor mínimo, valor máximo, borda de faixa de imposto e entrada inválida.
- Compare os resultados com uma fonte oficial (por exemplo, a Calculadora do Cidadão do Banco Central para financiamento e juros) ou com um cálculo manual documentado no próprio teste.
- Nunca altere o resultado esperado de um teste só para ele passar; investigue a diferença.

## 7. Atualização anual das tabelas

Todos os valores legais ficam em `data/tabelas.json`. Estrutura sugerida:

```json
{
  "vigencia": "2026-01-01",
  "salarioMinimo": { "valor": 0, "fonte": "URL oficial" },
  "inss": {
    "fonte": "URL oficial",
    "faixas": [{ "ate": 0, "aliquota": 0 }]
  },
  "irrf": {
    "fonte": "URL oficial",
    "faixas": [{ "ate": 0, "aliquota": 0, "deducao": 0 }],
    "deducaoPorDependente": 0
  }
}
```

> Os zeros acima são **marcadores**. Preencha com os valores vigentes consultando as fontes oficiais (Receita Federal, Ministério da Previdência, Planalto) antes de publicar qualquer calculadora que dependa deles.

Roteiro de atualização:

1. Consultar as fontes oficiais.
2. Atualizar o JSON e a data de vigência.
3. Rodar `node --test tests/` e ajustar os casos de teste que dependem das faixas.
4. Atualizar a data de "última atualização" nas páginas.
5. Fazer o deploy.

## 8. Checklist de lançamento

- [ ] Todos os testes passam
- [ ] Lighthouse mobile: Performance ≥ 90, Acessibilidade ≥ 90, SEO ≥ 95
- [ ] Cada página tem `title`, `meta description`, H1 único e `canonical`
- [ ] Open Graph e imagem de compartilhamento configurados
- [ ] JSON-LD (WebApplication, FAQPage, BreadcrumbList) validado
- [ ] Páginas institucionais publicadas e linkadas no rodapé
- [ ] Banner de cookies funciona (recusar bloqueia analytics e anúncios)
- [ ] Aviso legal visível nas calculadoras
- [ ] Testado em celular real (Android e iOS)
- [ ] `sitemap.xml` enviado ao Search Console

## 9. Checklist do AdSense

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

- [ ] Criar `ads.txt` na raiz com a linha fornecida pelo AdSense
- [ ] Não clicar nos próprios anúncios e não pedir cliques a visitantes (risco de banimento)

## 10. Afiliados

1. Escolha plataformas e programas relevantes para o público (cartões, contas, crédito, corretoras, previdência).
2. Cadastre-se e leia as regras de cada programa (palavras proibidas, uso de marca, anúncios pagos).
3. Gere os links e coloque-os em `assets/js/ui/afiliados.js` (um único lugar para trocar links e rótulos).
4. Mostre o bloco **depois** do resultado da calculadora, com o rótulo "Publicidade" ou "Links de afiliado".
5. Mantenha no rodapé o aviso de que o site pode receber comissão.
6. Acompanhe cliques e conversões e remova o que não converte.

Mapa inicial (validar com os programas disponíveis):

| Calculadora | Tipo de oferta |
|---|---|
| Rescisão, 13º, férias | Conta digital, crédito, corretoras |
| Financiamento | Simulação de crédito imobiliário/veicular |
| Juros compostos, aposentadoria | Corretoras, bancos digitais, previdência |

## 11. Padrão de página de calculadora

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

## 12. Convenções de código

- Cálculos de dinheiro em **centavos inteiros** ou com arredondamento explícito em `moeda.js`; nunca somar decimais de ponto flutuante direto.
- Funções de cálculo **puras**: recebem um objeto, devolvem um objeto, sem tocar no DOM.
- Nenhum valor legal dentro das fórmulas; sempre ler de `data/tabelas.json`.
- Textos em português do Brasil; datas `dd/mm/aaaa` e moeda `R$ 1.234,56`.
- CSS mobile-first; slots de anúncio com `min-height` definido.
- Scripts de terceiros (anúncios, analytics) só carregam depois do consentimento.
- Commits curtos e no imperativo (ex.: `Adiciona calculadora de 13º`).

## 13. Aviso legal

Os resultados são **estimativas informativas** e não substituem o cálculo oficial, nem a orientação de contador, advogado ou consultor financeiro. O site não oferece aconselhamento financeiro, jurídico ou de investimento. Este texto deve aparecer, de forma resumida, em todas as páginas de calculadora.
