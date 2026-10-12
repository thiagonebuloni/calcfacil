# PRD — Calculadoras Financeiras em Português

> Versão 0.1 · 11/10/2026 · Status: rascunho inicial
> Nome provisório do projeto: **CalcFácil** (trocar após checar disponibilidade de domínio)

---

## 1. Visão geral

Site estático com calculadoras e simuladores financeiros em português do Brasil, otimizado para busca orgânica (SEO) e monetizado com anúncios (Google AdSense) e links de afiliados.

Cada calculadora é uma página própria que responde a uma intenção de busca específica (ex.: "calculadora de rescisão CLT") e combina três coisas: a ferramenta, uma explicação clara do cálculo e perguntas frequentes.

## 2. Problema e oportunidade

- Trabalhadores e consumidores brasileiros precisam fazer contas com regras complexas (rescisão, 13º, férias, financiamento, aposentadoria) e buscam isso no Google com frequência, principalmente em picos sazonais (13º, Imposto de Renda, demissões).
- Muitas ferramentas existentes são lentas, cheias de anúncios, desatualizadas ou não explicam como o resultado foi calculado.
- Nichos financeiros têm CPM acima da média e boas oportunidades de afiliados (cartões, contas, crédito, investimentos).

**Oportunidade:** ferramentas rápidas, corretas, atualizadas todo ano e com explicação transparente, em páginas leves que ranqueiam bem.

## 3. Público-alvo

| Perfil | Necessidade | Calculadoras de maior interesse |
|---|---|---|
| Trabalhador CLT | Saber quanto vai receber (rescisão, 13º, férias) | Rescisão, 13º, férias |
| Consumidor / comprador | Comparar financiamentos e entender juros | Financiamento, juros compostos |
| Poupador / investidor iniciante | Planejar acúmulo e aposentadoria | Juros compostos, aposentadoria |
| Autônomo / MEI que virou ME | Estimar DAS, pró-labore líquido e lucros | Tributos do ME |

## 4. Objetivos e métricas de sucesso

**Objetivos do MVP**
1. Publicar 6 calculadoras corretas e testadas.
2. Obter aprovação no Google AdSense.
3. Ter todas as páginas indexadas no Google.

**Métricas (acompanhar no Search Console e Analytics)**

| Métrica | Meta 3 meses | Meta 6 meses |
|---|---|---|
| Páginas indexadas | 100% do sitemap | 100% + blog |
| Sessões orgânicas/mês | 1.000 | 10.000 |
| Core Web Vitals | "Bom" em todas as páginas | Mantido |
| Taxa de conclusão (cálculo realizado / visita) | 40% | 50% |
| Cliques em afiliados / sessão | 2% | 4% |

> As metas de tráfego são estimativas de planejamento, não garantias. SEO costuma levar de 2 a 6 meses para mostrar resultado.

## 5. Escopo

### 5.1 Dentro do escopo (MVP)

- Página inicial com lista de calculadoras.
- 7 calculadoras: rescisão, 13º salário, férias, financiamento, juros compostos, aposentadoria (estimativa) e tributos do ME (Simples, pró-labore e lucros para quem saiu do MEI).
- Páginas institucionais: Sobre, Contato, Política de Privacidade, Termos de Uso, Aviso Legal.
- Banner de consentimento de cookies (LGPD) integrado a anúncios e analytics.
- Espaços reservados para anúncios e blocos de afiliados.
- SEO técnico: meta tags, dados estruturados, sitemap.xml, robots.txt.
- Blog mínimo (3 a 5 artigos de apoio).

### 5.2 Fora do escopo (por ora)

- Contas de usuário, login, salvamento de dados no servidor.
- Banco de dados e back-end.
- Aplicativo mobile.
- Cálculos tributários complexos (declaração de IR completa, Lucro Presumido/Real).
- Versões em outros idiomas.

## 6. Calculadoras do MVP

Todas as faixas, alíquotas e valores legais ficam em um único arquivo de dados (`data/tabelas.json`), com fonte oficial e data de vigência de cada valor, para atualização anual sem mexer em código.

### 6.1 Rescisão trabalhista
- **Entradas:** salário bruto, data de admissão, data de demissão, tipo de rescisão (sem justa causa, pedido de demissão, justa causa, acordo), tipo de aviso prévio (trabalhado, indenizado, dispensado), férias vencidas (sim/não), saldo do FGTS.
- **Saídas:** saldo de salário, aviso prévio, 13º proporcional, férias proporcionais + 1/3, férias vencidas, multa FGTS (quando aplicável), descontos de INSS e IRRF, total bruto e líquido, detalhamento linha a linha.
- **Regras-chave:** verbas variam por tipo de rescisão; aviso prévio proporcional ao tempo de serviço; INSS progressivo; IRRF com dedução simplificada ou legal conforme regra vigente.

### 6.2 13º salário
- **Entradas:** salário bruto, meses trabalhados no ano, média de variáveis (horas extras, comissões), número de dependentes.
- **Saídas:** 1ª parcela, 2ª parcela, descontos (INSS, IRRF), valor líquido total.

### 6.3 Férias
- **Entradas:** salário bruto, dias de férias (até 30), abono pecuniário (venda de 10 dias), dependentes, média de variáveis.
- **Saídas:** valor das férias, 1/3 constitucional, abono, descontos, líquido e data-limite de pagamento (2 dias antes do início).

### 6.4 Financiamento
- **Entradas:** valor do bem, entrada, taxa de juros (mensal ou anual), prazo em meses, sistema de amortização (Price ou SAC).
- **Saídas:** parcela (ou 1ª e última no SAC), total pago, total de juros, tabela de amortização completa (exportável em CSV).

### 6.5 Juros compostos
- **Entradas:** capital inicial, aporte mensal, taxa (mensal/anual), período, opção de descontar IR regressivo (renda fixa).
- **Saídas:** montante final, total investido, total de juros, gráfico de evolução, tabela mês a mês.

### 6.6 Aposentadoria (estimativa)
- **Entradas:** idade atual, idade-alvo, renda mensal desejada, patrimônio atual, aporte mensal, rentabilidade real esperada.
- **Saídas:** patrimônio necessário, aporte necessário ou idade estimada, gráfico de projeção.
- **Observação:** é um planejador de acúmulo, não uma simulação oficial do INSS; o aviso deve ser claro.

## 7. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Cada calculadora calcula e exibe resultado instantaneamente, sem recarregar a página | Alta |
| RF-02 | Validação de campos com mensagens claras em português | Alta |
| RF-03 | Máscara e formatação de moeda e datas no padrão brasileiro (R$ 1.234,56 · dd/mm/aaaa) | Alta |
| RF-04 | Resultado detalhado, mostrando como cada valor foi obtido | Alta |
| RF-05 | Botão para copiar resultado e imprimir (CSS de impressão) | Média |
| RF-06 | Exportar tabelas (financiamento, juros) em CSV | Média |
| RF-07 | Gráficos simples onde fizer sentido (juros compostos, aposentadoria) | Média |
| RF-08 | Bloco "próximo passo" após o resultado, com link de afiliado relevante e rótulo de publicidade | Alta |
| RF-09 | Seção de explicação do cálculo e FAQ em cada página | Alta |
| RF-10 | Link para calculadoras relacionadas ao final de cada página | Média |
| RF-11 | Nenhum dado digitado é enviado a servidor; todo o cálculo ocorre no navegador | Alta |
| RF-12 | Banner de consentimento de cookies com opção de recusar | Alta |

## 8. Requisitos não funcionais

- **Desempenho:** LCP < 2,5 s, CLS < 0,1, INP < 200 ms em celular com conexão 4G. Página sem anúncios abaixo de 100 KB (HTML+CSS+JS comprimidos).
- **Anúncios sem quebrar layout:** reservar altura fixa dos slots para evitar deslocamento de layout.
- **Responsivo:** mobile-first; a maior parte do tráfego virá de celular.
- **Acessibilidade:** WCAG 2.1 AA (rótulos, contraste, navegação por teclado, `aria-live` no resultado).
- **Precisão:** cálculos monetários em centavos inteiros, ou com arredondamento controlado, para evitar erros de ponto flutuante.
- **Manutenibilidade:** regras legais separadas do código; testes automatizados para toda fórmula.
- **Privacidade:** conformidade com a LGPD; analytics e anúncios só carregam conforme o consentimento.
- **Compatibilidade:** últimas 2 versões de Chrome, Safari, Firefox e Edge; Android 9+ e iOS 14+.

## 9. SEO e conteúdo

- **Uma página por intenção de busca**, com título, descrição e H1 próprios.
- **Estrutura padrão de página de calculadora:**
  1. H1 com palavra-chave principal
  2. Ferramenta acima da dobra
  3. Resultado detalhado
  4. "Como é calculado" (com fórmulas e exemplo numérico)
  5. Bloco de afiliado / próximo passo
  6. FAQ (5 a 8 perguntas)
  7. Calculadoras relacionadas
  8. Data da última atualização e fonte da legislação
- **Dados estruturados (JSON-LD):** `WebApplication`/`SoftwareApplication`, `FAQPage`, `BreadcrumbList`.
- **Técnico:** `sitemap.xml`, `robots.txt`, URLs limpas, canonical, Open Graph, HTTPS.
- **Palavras-chave iniciais (validar volume no Google Keyword Planner / Search Console):**
  - calculadora de rescisão CLT, simulador de rescisão
  - calculadora de 13º salário, calcular décimo terceiro
  - calculadora de férias, calcular férias com 1/3
  - simulador de financiamento Price e SAC
  - calculadora de juros compostos
  - simulador de aposentadoria, quanto preciso para me aposentar
- **Blog (fase 1.5):** artigos como "Como calcular rescisão sem justa causa", "Price ou SAC: qual compensa?", "Quando o 13º é pago?".

## 10. Monetização

| Fonte | Quando | Observação |
|---|---|---|
| Google AdSense | Após publicar e ter conteúdo suficiente | Requer domínio próprio, política de privacidade, páginas institucionais e conteúdo original |
| Afiliados (Lomadee, Awin, programas diretos) | Desde o lançamento, nas páginas relevantes | Rotular como publicidade; respeitar regras de cada programa |
| Rede de maior RPM (Ezoic/Mediavine/Raptive) | Quando houver tráfego mínimo exigido | Conferir requisitos vigentes |

**Posicionamento dos anúncios (inicial):** 1 slot abaixo do resultado, 1 no meio do conteúdo explicativo, 1 no final. Evitar anúncios acima da ferramenta e formatos intrusivos (pop-ups, popunders).

**Mapeamento calculadora → afiliado (a validar):**
- Rescisão / 13º / férias → conta digital, antecipação, crédito consignado ou pessoal, corretoras
- Financiamento → simuladores de crédito imobiliário/veicular, comparadores
- Juros compostos / aposentadoria → corretoras, bancos digitais, plataformas de investimento, previdência privada

## 11. Requisitos legais e de conformidade

- **LGPD:** política de privacidade clara, banner de consentimento, nenhum dado pessoal sensível coletado.
- **Aviso legal:** os resultados são estimativas informativas; não substituem contador, advogado ou o cálculo oficial. Não é aconselhamento financeiro, jurídico ou de investimento.
- **Transparência de afiliados:** aviso visível de que o site pode receber comissão.
- **Políticas do AdSense:** conteúdo original, navegação clara, sem cliques induzidos, sem incentivo a clicar nos anúncios.
- **Legislação:** citar a fonte e a data de vigência das tabelas (INSS, IRRF, salário mínimo, CLT).

## 12. Arquitetura técnica

**Decisão:** site estático puro (HTML, CSS e JavaScript), sem back-end e sem etapa de build no MVP.

**Justificativa:** custo zero de hospedagem, velocidade máxima, SEO simples e manutenção barata. Se o número de páginas crescer, migrar para um gerador estático (Astro ou Eleventy) para reaproveitar layout e componentes.

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
├── sobre/ contato/ privacidade/ termos/
├── assets/
│   ├── css/
│   ├── js/
│   │   ├── core/        # formatação, validação, moeda, datas
│   │   ├── calc/        # uma função pura por calculadora
│   │   └── ui/          # ligação formulário ↔ cálculo, banner de cookies, anúncios
│   └── img/
├── data/tabelas.json    # INSS, IRRF, salário mínimo, vigência e fontes
├── tests/               # testes das funções de cálculo (Node)
├── sitemap.xml
├── robots.txt
├── ads.txt              # após aprovação do AdSense
├── README.md
└── PRD.md
```

**Princípios de código**
- Funções de cálculo puras (entrada → saída), sem acesso ao DOM, para poderem ser testadas.
- Dinheiro em centavos inteiros ou com arredondamento explícito.
- Tabelas legais carregadas do JSON; nunca fixas dentro das fórmulas.

**Stack sugerida**
- Front: HTML, CSS (variáveis, mobile-first), JavaScript ES modules.
- Gráficos: Chart.js ou SVG próprio, carregado só nas páginas que precisam.
- Testes: `node --test` (sem dependências).
- Hospedagem: Cloudflare Pages (ou Vercel/Netlify) com domínio próprio.
- Analytics: Google Analytics 4 ou alternativa leve (Plausible/Umami), conforme consentimento.

## 13. Roadmap

| Fase | Entregas | Prazo estimado |
|---|---|---|
| 0. Preparação | Nome, domínio, repositório, contas (Search Console, AdSense, afiliados) | Semana 1 |
| 1. Fundação | Layout base, design system, módulos `core`, `tabelas.json`, páginas institucionais | Semana 1–2 |
| 2. Calculadoras | 6 calculadoras com testes, textos SEO e FAQ | Semana 2–4 |
| 3. Publicação | Deploy, domínio, sitemap, Search Console, banner de cookies | Semana 4 |
| 4. Monetização | Pedido de AdSense, afiliados, slots de anúncio | Semana 5–6 |
| 5. Crescimento | Blog, novas calculadoras, melhoria por dados do Search Console | Contínuo |
| 6. Manutenção | Atualização anual das tabelas (janeiro) e revisão de conteúdo | Anual |

## 14. Critérios de aceite do MVP

- [x] Todas as 6 calculadoras passam nos testes automatizados com casos de referência conferidos manualmente.
- [x] Nenhum valor legal está fixo no código; tudo vem de `data/tabelas.json` com fonte e vigência.
- [x] Lighthouse mobile: Performance ≥ 90, SEO ≥ 95, Acessibilidade ≥ 90.
- [x] Páginas institucionais e política de privacidade publicadas.
- [x] Banner de consentimento funcional.
- [ ] Sitemap enviado e páginas indexadas no Search Console.
- [ ] Aviso legal e rótulo de afiliado visíveis onde aplicável.

## 15. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Erro de cálculo | Perda de confiança e de ranking | Testes, conferência com fontes oficiais, aviso legal, canal de reporte de erros |
| Tabelas desatualizadas | Resultado incorreto | Dados centralizados, tarefa anual de atualização em janeiro, data de vigência visível |
| Reprovação no AdSense | Atraso na monetização | Conteúdo original e substancial, páginas institucionais, navegação limpa; reenviar após ajustes |
| SEO lento ou concorrência forte | Pouco tráfego | Focar em buscas específicas (long tail), conteúdo útil, melhoria contínua |
| Baixo CPM (tráfego brasileiro) | Receita menor | Priorizar afiliados, nicho financeiro, melhorar RPM com bons posicionamentos |
| Mudança de regras de programas | Perda de receita | Diversificar fontes de receita |
| Anúncios prejudicando UX/Core Web Vitals | Queda de ranking | Slots com altura reservada, carregamento tardio, poucos anúncios |

## 16. Custos estimados

| Item | Custo |
|---|---|
| Domínio (.com.br ou .com) | ≈ R$ 40–60 por ano |
| Hospedagem (Cloudflare Pages/Vercel/Netlify, plano gratuito) | R$ 0 |
| Analytics (GA4 ou Umami self-hosted) | R$ 0 |
| Ferramentas de SEO (opcional) | R$ 0 no início |

## 17. Perguntas em aberto

1. Nome final e domínio.
2. Escolha de analytics (GA4 vs. alternativa leve).
3. Programas de afiliados prioritários e condições vigentes.
4. Ordem de lançamento das calculadoras (sugestão: 13º, férias, rescisão, juros compostos, financiamento, aposentadoria — a ordem segue sazonalidade e complexidade).
5. Nível de detalhe jurídico aceitável na rescisão (casos especiais: estabilidade, comissões, insalubridade).

## 18. Referências a consultar durante o desenvolvimento

- Receita Federal: tabela de IRRF e regras de dedução vigentes.
- Ministério da Previdência / INSS: tabela de contribuição vigente.
- Planalto: CLT, Lei 4.090/62 (13º), Lei 8.036/90 (FGTS), Lei 12.506/11 (aviso prévio proporcional).
- Banco Central: Calculadora do Cidadão, para conferir cálculos de financiamento e juros.
- Políticas do Google AdSense e Central de Ajuda da Pesquisa Google.
