// Conteúdo editorial das páginas. Tokens: {ANO} (ano de vigência das tabelas) e {NOME} (nome do site).
// Os exemplos numéricos abaixo são os mesmos casos verificados em tests/.

const salario = { name: 'salario', rotulo: 'Salário bruto mensal (R$)', tipo: 'money', valor: '3.000,00' };
const media = { name: 'media', rotulo: 'Média de horas extras e comissões (R$)', tipo: 'money', valor: '', placeholder: '0,00', ajuda: 'Opcional. Média mensal dos valores variáveis.' };
const dependentes = { name: 'dependentes', rotulo: 'Dependentes no Imposto de Renda', tipo: 'number', valor: '0' };

export const calculadoras = [
  {
    slug: 'decimo-terceiro',
    nome: 'Calculadora de 13º salário',
    nomeCurto: '13º salário',
    titulo: 'Calculadora de 13º salário {ANO}: 1ª e 2ª parcela líquidas',
    descricao: 'Calcule o 13º salário com INSS e IRRF de {ANO}: valor da 1ª e da 2ª parcela, proporcional aos meses trabalhados, com média de horas extras e dependentes.',
    resumoLista: 'Valor das duas parcelas, já com INSS e IR.',
    h1: 'Calculadora de 13º salário',
    lead: 'Informe o salário e os meses trabalhados no ano. Você vê quanto recebe em cada parcela e como os descontos foram calculados.',
    campos: [
      salario, media,
      { name: 'meses', rotulo: 'Meses trabalhados no ano', tipo: 'number', valor: '12', ajuda: 'Conta como mês inteiro quem trabalhou 15 dias ou mais nele.' },
      dependentes,
    ],
    lei: 'Lei 4.090/1962 e Lei 4.749/1965',
    relacionadas: ['ferias', 'rescisao', 'juros-compostos'],
    comoCalcula: `
<h2>Como o 13º salário é calculado</h2>
<p>O 13º equivale a 1/12 da remuneração por mês trabalhado no ano. Cada mês em que você trabalhou 15 dias ou mais conta como mês inteiro. Quem trabalhou o ano todo recebe um salário extra completo.</p>
<p class="formula">13º bruto = (salário + média de variáveis) ÷ 12 × meses trabalhados</p>
<h3>As duas parcelas</h3>
<ul>
<li><strong>1ª parcela:</strong> 50% do valor bruto, sem descontos, paga entre 1º de fevereiro e 30 de novembro.</li>
<li><strong>2ª parcela:</strong> paga até 20 de dezembro. Sobre o total do 13º incidem INSS e IRRF, e o que você já recebeu na 1ª parcela é abatido.</li>
</ul>
<h3>Descontos</h3>
<p>O INSS segue a tabela progressiva de {ANO}, calculada sobre o 13º separadamente do salário do mês. Para o IRRF vale a tabela própria do 13º — os limites e a parcela da tabela mensal divididos por 2 (Lei 7.713/1988, art. 12, §1º) — com a dedução mais vantajosa entre INSS mais dependentes e o desconto simplificado. A redução do IR de 2026 (Lei 15.270/2025, art. 3º-A, §3º) também se aplica ao 13º.</p>
<h3>Exemplo</h3>
<p>Salário de R$ 3.000,00 e 12 meses trabalhados: 13º bruto de R$ 3.000,00, INSS de R$ 248,60 e IRRF zero. O líquido é R$ 2.751,40, pago em R$ 1.500,00 na 1ª parcela e R$ 1.251,40 na 2ª.</p>`,
    faq: [
      ['Quem tem direito ao 13º salário?', 'Empregados com carteira assinada (incluindo domésticos e temporários), trabalhadores avulsos, aposentados e pensionistas do INSS. Servidores públicos seguem a lei do seu ente.'],
      ['Quando o 13º é pago?', 'A 1ª parcela entre 1º de fevereiro e 30 de novembro. A 2ª até 20 de dezembro.'],
      ['Quem trabalhou menos de 15 dias em um mês perde esse mês?', 'Sim. Cada mês só conta se você trabalhou 15 dias ou mais nele. Por isso quem foi admitido no dia 20 não ganha 1/12 daquele mês.'],
      ['Horas extras e comissões entram no 13º?', 'Entram. A média dos valores variáveis integra a base. Use o campo de média para incluí-los.'],
      ['O 13º tem desconto de INSS e Imposto de Renda?', 'Tem, e os dois incidem sobre o valor total do 13º, descontados na 2ª parcela. A 1ª parcela vem sem descontos.'],
      ['Posso receber a 1ª parcela junto com as férias?', 'Pode. O empregado precisa pedir por escrito em janeiro do mesmo ano, e a empresa paga a 1ª parcela no mês das férias.'],
    ],
  },
  {
    slug: 'ferias',
    nome: 'Calculadora de férias',
    nomeCurto: 'Férias',
    titulo: 'Calculadora de férias {ANO}: valor com 1/3 e abono pecuniário',
    descricao: 'Calcule o valor líquido das suas férias com 1/3 constitucional, venda de 10 dias (abono pecuniário), INSS, IRRF e a data limite de pagamento.',
    resumoLista: 'Férias com 1/3, abono e a data limite de pagamento.',
    h1: 'Calculadora de férias',
    lead: 'Veja quanto você recebe nas férias, com o terço constitucional, a opção de vender 10 dias e os descontos de INSS e Imposto de Renda.',
    campos: [
      salario, media,
      { name: 'dias', rotulo: 'Dias de férias a gozar', tipo: 'number', valor: '30', ajuda: 'De 5 a 30 dias.' },
      { name: 'abono', rotulo: 'Vender 10 dias (abono pecuniário)', tipo: 'checkbox', valor: false, ajuda: 'Com o abono, você descansa 20 dias e recebe 10 em dinheiro.' },
      dependentes,
      { name: 'inicio', rotulo: 'Início das férias (opcional)', tipo: 'date', valor: '', ajuda: 'Usado para calcular a data limite de pagamento.' },
    ],
    lei: 'CLT, arts. 129 a 145, e Constituição Federal, art. 7º, XVII',
    relacionadas: ['decimo-terceiro', 'rescisao', 'juros-compostos'],
    comoCalcula: `
<h2>Como as férias são calculadas</h2>
<p>O valor das férias é o salário proporcional aos dias de descanso, acrescido de 1/3 (terço constitucional).</p>
<p class="formula">férias = (salário + média de variáveis) ÷ 30 × dias de férias<br>1/3 constitucional = férias ÷ 3</p>
<h3>Abono pecuniário</h3>
<p>Você pode converter até 1/3 das férias (10 dias) em dinheiro. O abono vale o salário de 10 dias mais 1/3: o valor do abono sofre INSS, e abono e 1/3 entram na base do Imposto de Renda. O pedido precisa ser feito até 15 dias antes do fim do período aquisitivo.</p>
<h3>Descontos e prazo</h3>
<p>O IRRF incide sobre as férias mais o 1/3; o INSS incide só sobre as férias — o 1/3 constitucional é isento desde 2020 (Lei 8.212/1991, art. 28, §9º, IV). As alíquotas são as tabelas de {ANO}. O pagamento deve ser feito até 2 dias antes do início do descanso.</p>
<h3>Fracionamento</h3>
<p>As férias podem ser divididas em até 3 períodos, desde que você concorde: um deles com pelo menos 14 dias corridos e os demais com pelo menos 5 dias cada.</p>
<h3>Exemplo</h3>
<p>Salário de R$ 3.000,00 e 30 dias: férias de R$ 3.000,00 mais R$ 1.000,00 de terço, total bruto de R$ 4.000,00. O INSS é R$ 248,60 e o IRRF é zero, então o líquido é R$ 3.751,40.</p>`,
    faq: [
      ['Quando tenho direito a tirar férias?', 'Depois de 12 meses de trabalho (período aquisitivo). A empresa tem os 12 meses seguintes (período concessivo) para conceder o descanso.'],
      ['Quem escolhe a época das férias?', 'O empregador define, de acordo com o interesse da empresa. Ele precisa avisar com pelo menos 30 dias de antecedência.'],
      ['As faltas reduzem os dias de férias?', 'Reduzem. Com até 5 faltas injustificadas no período, são 30 dias. De 6 a 14 faltas, 24 dias. De 15 a 23, 18 dias. De 24 a 32, 12 dias. Acima de 32, você perde o direito.'],
      ['Posso vender todas as férias?', 'Não. O limite do abono pecuniário é de 1/3, ou seja, 10 dias.'],
      ['O que acontece se a empresa não conceder as férias a tempo?', 'Ela precisa pagar as férias em dobro, com o 1/3.'],
      ['Horas extras e comissões entram no cálculo?', 'Entram. A média dos valores variáveis recebidos no período integra a base das férias.'],
    ],
  },
  {
    slug: 'rescisao',
    nome: 'Calculadora de rescisão trabalhista',
    nomeCurto: 'Rescisão',
    titulo: 'Calculadora de rescisão trabalhista {ANO} (CLT): sem justa causa, pedido e acordo',
    descricao: 'Simule sua rescisão CLT: saldo de salário, aviso prévio, 13º e férias proporcionais, multa do FGTS, INSS e IRRF. Sem justa causa, pedido de demissão, justa causa ou acordo.',
    resumoLista: 'Saldo, aviso, 13º, férias e multa do FGTS por tipo de saída.',
    h1: 'Calculadora de rescisão trabalhista',
    lead: 'Informe as datas, o tipo de saída e o salário. Você vê cada verba da rescisão, os descontos e a multa do FGTS.',
    campos: [
      { ...salario, name: 'salario' },
      { name: 'admissao', rotulo: 'Data de admissão', tipo: 'date', valor: '' },
      { name: 'demissao', rotulo: 'Data de demissão', tipo: 'date', valor: '', ajuda: 'Último dia de trabalho registrado na carteira.' },
      { name: 'tipo', rotulo: 'Tipo de rescisão', tipo: 'select', valor: 'sem_justa_causa', opcoes: [['sem_justa_causa', 'Dispensa sem justa causa'], ['pedido_demissao', 'Pedido de demissão'], ['justa_causa', 'Dispensa por justa causa'], ['acordo', 'Acordo entre as partes (art. 484-A)']] },
      { name: 'aviso', rotulo: 'Aviso prévio', tipo: 'select', valor: 'indenizado', ajuda: 'No pedido de demissão, não cumprir o aviso gera desconto de 30 dias de salário.', opcoes: [['trabalhado', 'Trabalhado'], ['indenizado', 'Não trabalhado (indenizado)'], ['dispensado', 'Dispensado pelo empregador (pedido de demissão)']] },
      { name: 'saldoFgts', rotulo: 'Saldo atual do FGTS (R$)', tipo: 'money', valor: '', placeholder: '0,00', ajuda: 'Veja no app FGTS. Serve para calcular a multa.' },
      dependentes,
      { name: 'feriasVencidas', rotulo: 'Tenho um período de férias vencidas e não gozadas', tipo: 'checkbox', valor: false },
    ],
    lei: 'CLT (arts. 477, 484-A e 487), Lei 12.506/2011 e Lei 8.036/1990',
    relacionadas: ['ferias', 'decimo-terceiro', 'juros-compostos'],
    comoCalcula: `
<h2>Como a rescisão é calculada</h2>
<p>As verbas dependem de como o contrato termina. A tabela resume o que cada tipo de saída paga.</p>
<div class="tabela-wrap"><table>
<thead><tr><th scope="col">Verba</th><th scope="col">Sem justa causa</th><th scope="col">Pedido de demissão</th><th scope="col">Justa causa</th><th scope="col">Acordo</th></tr></thead>
<tbody>
<tr><td>Saldo de salário</td><td>Sim</td><td>Sim</td><td>Sim</td><td>Sim</td></tr>
<tr><td>Aviso prévio indenizado</td><td>Sim</td><td>Não (pode ser descontado)</td><td>Não</td><td>50%</td></tr>
<tr><td>13º proporcional</td><td>Sim</td><td>Sim</td><td>Não</td><td>Sim</td></tr>
<tr><td>Férias proporcionais + 1/3</td><td>Sim</td><td>Sim</td><td>Não</td><td>Sim</td></tr>
<tr><td>Férias vencidas + 1/3</td><td>Sim</td><td>Sim</td><td>Sim</td><td>Sim</td></tr>
<tr><td>Multa do FGTS</td><td>40%</td><td>Não</td><td>Não</td><td>20%</td></tr>
<tr><td>Saque do FGTS</td><td>Total</td><td>Não</td><td>Não</td><td>Até 80%</td></tr>
<tr><td>Seguro-desemprego</td><td>Sim*</td><td>Não</td><td>Não</td><td>Não</td></tr>
</tbody></table></div>
<p class="fonte">*Se cumprir os requisitos do programa.</p>
<h3>Cada verba</h3>
<ul>
<li><strong>Saldo de salário:</strong> salário ÷ 30 × dias trabalhados no mês da saída.</li>
<li><strong>Aviso prévio:</strong> 30 dias mais 3 dias por ano completo de serviço, no máximo 90 dias (Lei 12.506/2011). O aviso indenizado conta como tempo de serviço e soma meses ao 13º e às férias proporcionais.</li>
<li><strong>13º proporcional:</strong> salário ÷ 12 × meses trabalhados no ano, contando o mês com 15 dias ou mais.</li>
<li><strong>Férias proporcionais:</strong> salário ÷ 12 × meses desde o último aniversário de admissão, mais 1/3.</li>
<li><strong>FGTS:</strong> o empregador deposita 8% sobre as verbas de natureza salarial (saldo, aviso indenizado, 13º e férias com o 1/3 — Lei 8.036, art. 15). A multa é de 40% (ou 20% no acordo) sobre o saldo total, incluindo esse depósito. Ela é paga pelo empregador e não sai do seu saldo.</li>
</ul>
<h3>Descontos</h3>
<p>INSS e IRRF incidem sobre o saldo de salário e sobre o 13º, calculados separadamente. O aviso prévio indenizado e as férias indenizadas, com o 1/3, não sofrem INSS; o aviso indenizado, porém, entra na base do IRRF, enquanto as férias indenizadas são isentas dele. No pedido de demissão sem cumprir o aviso, o empregador pode descontar 30 dias de salário.</p>
<h3>Prazo de pagamento</h3>
<p>O pagamento deve ocorrer em até 10 dias corridos depois do término do contrato.</p>
<h3>Exemplo</h3>
<p>Salário de R$ 3.000,00, admissão em 01/03/2022, demissão sem justa causa em 15/09/2026 com aviso indenizado e FGTS de R$ 10.000,00. O aviso é de 42 dias (30 + 3 × 4 anos) e projeta o contrato até 27/10/2026. Saldo de salário de R$ 1.500,00, aviso de R$ 4.200,00, 13º de 10/12 (R$ 2.500,00) e férias de 8/12 (R$ 2.000,00 mais R$ 666,67 de terço). O bruto é R$ 10.866,67, os descontos somam R$ 585,29 e o líquido é R$ 10.281,38. A multa do FGTS é de R$ 4.347,73.</p>`,
    faq: [
      ['Em quanto tempo a empresa precisa pagar a rescisão?', 'Em até 10 dias corridos contados do término do contrato, qualquer que seja o tipo de aviso prévio.'],
      ['Qual a diferença entre aviso trabalhado e indenizado?', 'No trabalhado, você cumpre o aviso na empresa, com redução de 2 horas por dia ou de 7 dias corridos. No indenizado, a empresa dispensa você de trabalhar e paga o valor do aviso.'],
      ['Quem pede demissão recebe multa do FGTS?', 'Não. Quem pede demissão não recebe a multa nem saca o FGTS, mas recebe saldo de salário, 13º e férias proporcionais e férias vencidas, se houver.'],
      ['O que é a demissão por acordo?', 'É a rescisão prevista no art. 484-A da CLT, em que empregado e empresa combinam a saída. Paga metade do aviso indenizado, multa de 20% e permite sacar até 80% do FGTS, sem seguro-desemprego.'],
      ['Esta calculadora inclui horas extras, comissões e adicionais?', 'Não. Se você recebe valores variáveis, adicionais ou tem estabilidade, a rescisão real pode ser maior. Use o salário médio ou confira com o RH.'],
      ['A homologação no sindicato ainda é obrigatória?', 'Não. Desde a reforma trabalhista de 2017, a homologação da rescisão no sindicato deixou de ser obrigatória.'],
      ['O valor que recebi foi diferente. O que faço?', 'Peça o demonstrativo à empresa e compare as verbas. Se houver divergência, procure o sindicato da categoria ou um advogado trabalhista.'],
    ],
  },
  {
    slug: 'juros-compostos',
    nome: 'Calculadora de juros compostos',
    nomeCurto: 'Juros compostos',
    titulo: 'Calculadora de juros compostos com aportes mensais e IR',
    descricao: 'Simule o crescimento de um investimento com juros compostos e aportes mensais. Taxa mensal ou anual, gráfico, tabela mês a mês e desconto do IR regressivo.',
    resumoLista: 'Quanto seu dinheiro rende com aportes e tempo.',
    h1: 'Calculadora de juros compostos',
    lead: 'Informe o capital, o aporte mensal, a taxa e o prazo. Veja o montante, quanto veio de juros e a evolução mês a mês.',
    campos: [
      { name: 'capital', rotulo: 'Capital inicial (R$)', tipo: 'money', valor: '10.000,00' },
      { name: 'aporte', rotulo: 'Aporte mensal (R$)', tipo: 'money', valor: '500,00' },
      { name: 'taxa', rotulo: 'Taxa de juros (%)', tipo: 'percent', valor: '0,9' },
      { name: 'periodoTaxa', rotulo: 'A taxa é', tipo: 'select', valor: 'mensal', opcoes: [['mensal', 'Ao mês'], ['anual', 'Ao ano']] },
      { name: 'prazo', rotulo: 'Prazo', tipo: 'number', valor: '10' },
      { name: 'unidadePrazo', rotulo: 'Unidade do prazo', tipo: 'select', valor: 'anos', opcoes: [['anos', 'Anos'], ['meses', 'Meses']] },
      { name: 'ir', rotulo: 'Descontar IR regressivo da renda fixa', tipo: 'checkbox', valor: false, ajuda: 'Alíquotas de 22,5% a 15%, conforme o tempo de cada aporte.' },
    ],
    lei: 'Lei 11.033/2004 (IR sobre renda fixa)',
    relacionadas: ['aposentadoria', 'financiamento', 'decimo-terceiro'],
    comoCalcula: `
<h2>Como os juros compostos são calculados</h2>
<p>Nos juros compostos, o rendimento de cada período é somado ao saldo e passa a render também. É o efeito "juros sobre juros".</p>
<p class="formula">M = C × (1 + i)^n + PMT × ((1 + i)^n − 1) ÷ i</p>
<p>M é o montante, C o capital inicial, PMT o aporte mensal, i a taxa mensal e n o número de meses. Os aportes são considerados no fim de cada mês.</p>
<h3>Taxa ao ano ou ao mês</h3>
<p>Uma taxa anual não vira mensal dividindo por 12. A conversão correta é a equivalência composta: i = (1 + taxa anual)^(1/12) − 1. Uma taxa de 12% ao ano equivale a cerca de 0,9489% ao mês.</p>
<h3>Imposto de Renda regressivo</h3>
<p>Na renda fixa, o IR incide só sobre o rendimento, com alíquota que cai com o tempo de aplicação: 22,5% até 180 dias, 20% de 181 a 360 dias, 17,5% de 361 a 720 dias e 15% acima de 720 dias. Cada aporte tem o seu próprio prazo, e a calculadora trata um a um.</p>
<h3>Exemplos</h3>
<ul>
<li>R$ 1.000,00 de capital e R$ 500,00 por mês a 1% ao mês durante 12 meses: você investe R$ 7.000,00 e chega a cerca de R$ 7.468,08.</li>
<li>R$ 10.000,00 a 12% ao ano por 10 anos, sem aportes: cerca de R$ 31.058,48.</li>
</ul>`,
    faq: [
      ['Qual a diferença entre juros simples e compostos?', 'Nos juros simples, o rendimento incide sempre sobre o capital inicial. Nos compostos, incide sobre o saldo atualizado. Com o tempo, a diferença cresce muito.'],
      ['Devo informar a taxa ao mês ou ao ano?', 'Tanto faz, desde que você marque qual é. A calculadora converte pela equivalência composta, sem dividir por 12.'],
      ['O resultado considera a inflação?', 'Não. O valor é nominal. Para ter uma ideia do poder de compra, use uma taxa real, que é a taxa menos a inflação.'],
      ['O rendimento futuro é garantido?', 'Não. A simulação mostra o que aconteceria se a taxa informada se mantivesse. Rentabilidade passada ou projetada não é garantia de resultado.'],
      ['O IR regressivo vale para qualquer investimento?', 'Vale para boa parte da renda fixa, como CDB e Tesouro Direto. Alguns produtos têm isenção (como LCI e LCA) e fundos têm regras próprias. Confira as do seu investimento.'],
      ['Por que o prazo faz tanta diferença?', 'Porque os juros incidem sobre juros anteriores. Os últimos anos de uma aplicação costumam render mais que os primeiros.'],
    ],
  },
  {
    slug: 'financiamento',
    nome: 'Simulador de financiamento',
    nomeCurto: 'Financiamento',
    titulo: 'Simulador de financiamento Price e SAC com tabela de amortização',
    descricao: 'Simule um financiamento nos sistemas Price e SAC: parcela, total de juros, saldo devedor e tabela de amortização completa para baixar em CSV.',
    resumoLista: 'Price ou SAC, com tabela de amortização.',
    h1: 'Simulador de financiamento: Price e SAC',
    lead: 'Informe o valor do bem, a entrada, a taxa e o prazo. Compare as parcelas e o total de juros nos dois sistemas.',
    campos: [
      { name: 'valor', rotulo: 'Valor do bem (R$)', tipo: 'money', valor: '300.000,00' },
      { name: 'entrada', rotulo: 'Entrada (R$)', tipo: 'money', valor: '60.000,00' },
      { name: 'taxa', rotulo: 'Taxa de juros (%)', tipo: 'percent', valor: '0,9' },
      { name: 'periodoTaxa', rotulo: 'A taxa é', tipo: 'select', valor: 'mensal', opcoes: [['mensal', 'Ao mês'], ['anual', 'Ao ano']] },
      { name: 'prazo', rotulo: 'Prazo (meses)', tipo: 'number', valor: '360', ajuda: 'Até 600 meses.' },
      { name: 'sistema', rotulo: 'Sistema de amortização', tipo: 'select', valor: 'price', opcoes: [['price', 'Price (parcelas fixas)'], ['sac', 'SAC (parcelas decrescentes)']] },
    ],
    lei: 'Matemática financeira (sem tabelas legais)',
    relacionadas: ['juros-compostos', 'aposentadoria', 'decimo-terceiro'],
    comoCalcula: `
<h2>Como o financiamento é calculado</h2>
<p>Em qualquer sistema, cada parcela tem duas partes: os juros do mês, que incidem sobre o saldo devedor, e a amortização, que reduz a dívida.</p>
<h3>Price (Tabela Price)</h3>
<p>As parcelas são iguais do início ao fim. No começo, a maior parte paga juros, e a amortização cresce ao longo do tempo.</p>
<p class="formula">parcela = valor financiado × i ÷ (1 − (1 + i)^−n)</p>
<h3>SAC (Sistema de Amortização Constante)</h3>
<p>A amortização é a mesma todo mês (valor financiado ÷ n). Como os juros caem junto com o saldo, as parcelas diminuem. A primeira é a mais alta.</p>
<p class="formula">parcela do mês k = amortização + saldo devedor × i</p>
<h3>Qual escolher</h3>
<p>O SAC costuma custar menos juros no total, mas exige uma parcela inicial maior. O Price cabe melhor em um orçamento apertado no começo, com um custo total maior.</p>
<h3>Exemplo</h3>
<p>R$ 100.000,00 a 1% ao mês em 12 meses. No Price, a parcela é de R$ 8.884,88 e os juros somam R$ 6.618,53. No SAC, a primeira parcela é de R$ 9.333,33, a última de R$ 8.416,70 e os juros somam R$ 6.500,00.</p>
<h3>O que esta simulação não inclui</h3>
<p>Seguros, tarifas, IOF, correção monetária (como TR ou IPCA) e o Custo Efetivo Total (CET). A parcela do contrato real costuma ser maior. Peça o CET ao banco antes de comparar propostas.</p>`,
    faq: [
      ['Price ou SAC: qual compensa mais?', 'Em juros totais, o SAC compensa mais. Se o orçamento do começo for apertado, o Price pode ser a opção possível. A melhor escolha depende da sua renda e do prazo.'],
      ['O que é o CET?', 'É o Custo Efetivo Total: soma juros, tarifas, seguros e impostos em uma única taxa anual. É o número certo para comparar propostas.'],
      ['Como converter a taxa anual em mensal?', 'Pela equivalência composta: (1 + taxa anual)^(1/12) − 1. Dividir por 12 só dá certo para taxas nominais.'],
      ['Vale a pena amortizar antecipadamente?', 'Em geral, sim, porque reduz o saldo sobre o qual os juros incidem. Pergunte ao banco se o abatimento reduz a parcela ou o prazo.'],
      ['Uma entrada maior reduz os juros?', 'Reduz. Quanto menor o valor financiado, menores os juros em reais, mesmo com a mesma taxa.'],
      ['A parcela do meu contrato ficou diferente da simulação. Por quê?', 'Provavelmente por seguros, tarifas, correção do saldo ou uma taxa diferente da informada. Compare com o CET e com a planilha de evolução do contrato.'],
    ],
  },
  {
    slug: 'aposentadoria',
    nome: 'Calculadora de aposentadoria',
    nomeCurto: 'Aposentadoria',
    titulo: 'Calculadora de aposentadoria: quanto preciso juntar para viver de renda',
    descricao: 'Descubra quanto patrimônio você precisa acumular para viver de renda, quanto precisa investir por mês e em que idade atinge a meta.',
    resumoLista: 'Patrimônio e aporte para viver de renda.',
    h1: 'Calculadora de aposentadoria',
    lead: 'Diga a renda mensal que você quer e a idade em que pretende parar de trabalhar. Você vê o patrimônio necessário e quanto investir por mês.',
    campos: [
      { name: 'idadeAtual', rotulo: 'Idade atual', tipo: 'number', valor: '30' },
      { name: 'idadeAlvo', rotulo: 'Idade para se aposentar', tipo: 'number', valor: '60' },
      { name: 'renda', rotulo: 'Renda mensal desejada, em valores de hoje (R$)', tipo: 'money', valor: '5.000,00', largo: true },
      { name: 'patrimonio', rotulo: 'Patrimônio atual investido (R$)', tipo: 'money', valor: '0,00' },
      { name: 'aporte', rotulo: 'Aporte mensal (R$)', tipo: 'money', valor: '1.000,00' },
      { name: 'rentabilidade', rotulo: 'Rentabilidade real ao ano (%)', tipo: 'percent', valor: '4,00', ajuda: 'Acima da inflação. Algo entre 3% e 6% é uma hipótese comum.' },
    ],
    lei: 'Matemática financeira (planejamento; não é simulação do INSS)',
    relacionadas: ['juros-compostos', 'financiamento', 'ferias'],
    comoCalcula: `
<h2>Como calculamos a aposentadoria</h2>
<p>Esta é uma calculadora de planejamento financeiro, não uma simulação do benefício do INSS. Ela responde: quanto preciso ter investido para viver só dos rendimentos?</p>
<p class="formula">patrimônio necessário = renda mensal ÷ rentabilidade real mensal</p>
<p>A ideia é que o patrimônio renda, depois de descontada a inflação, o suficiente para pagar a sua renda sem consumir o principal. Com 4% reais ao ano, isso equivale a juntar cerca de 25 vezes o gasto anual.</p>
<h3>Aporte necessário</h3>
<p>Para chegar à meta na idade escolhida, o aporte mensal é a parcela que, somada ao patrimônio atual e aos juros, atinge o valor necessário:</p>
<p class="formula">aporte = (meta − patrimônio × (1 + i)^n) × i ÷ ((1 + i)^n − 1)</p>
<h3>Por que usar valores reais</h3>
<p>Se você informar a renda em valores de hoje e a rentabilidade acima da inflação, o resultado já está corrigido. Assim, o patrimônio necessário mantém o poder de compra no futuro.</p>
<h3>Exemplo</h3>
<p>Quem tem 30 anos e quer R$ 5.000,00 por mês aos 60, com 4% reais ao ano, precisa de cerca de R$ 1.527.305,26. Investindo R$ 1.000,00 por mês a partir do zero, chega a cerca de R$ 685.270,56 nesse prazo. Para atingir a meta, o aporte teria de ser de aproximadamente R$ 2.228,76 por mês.</p>`,
    faq: [
      ['Isto simula a aposentadoria do INSS?', 'Não. Para estimar o benefício do INSS, use o Meu INSS (site ou aplicativo). Esta calculadora trata da renda que você constrói com investimentos próprios.'],
      ['O que é rentabilidade real?', 'É o rendimento acima da inflação. Se o investimento rende 10% e a inflação é de 5%, o ganho real é de cerca de 4,8%.'],
      ['Por que a meta supõe não consumir o patrimônio?', 'Porque, assim, a renda dura para sempre e pode ser deixada para a família. Se aceitar consumir o patrimônio até uma certa idade, a meta necessária é menor.'],
      ['O resultado considera a inflação?', 'Sim, se você usar uma renda em valores de hoje e uma rentabilidade real. Não coloque a rentabilidade nominal.'],
      ['Qual rentabilidade real devo usar?', 'Escolha uma hipótese prudente. Algo entre 3% e 6% ao ano acima da inflação é comum, mas não há garantia de que o mercado entregue esse valor.'],
      ['E se eu quiser me aposentar mais cedo?', 'Mude a idade para se aposentar. Você vai ver o aporte mensal subir, porque há menos anos de juros e a meta chega mais cedo.'],
    ],
  },
];

export const blog = [
  {
    slug: 'como-calcular-rescisao-sem-justa-causa',
    titulo: 'Como calcular a rescisão sem justa causa, passo a passo',
    descricao: 'Aprenda a calcular cada verba da rescisão sem justa causa: saldo de salário, aviso prévio, 13º, férias e multa de 40% do FGTS, com um exemplo numérico.',
    data: '2026-10-12',
    calc: 'rescisao',
    corpo: `
<p>Quando uma empresa dispensa um empregado sem justa causa, ele recebe o maior conjunto de verbas previsto na CLT. Veja como cada uma é calculada.</p>
<h2>1. Saldo de salário</h2>
<p>É o pagamento dos dias trabalhados no mês da saída. Divida o salário por 30 e multiplique pelos dias trabalhados. Com salário de R$ 3.000,00 e saída no dia 15, o saldo é de R$ 1.500,00.</p>
<h2>2. Aviso prévio</h2>
<p>São 30 dias, mais 3 dias por ano completo de serviço, até 90 dias. Quem tem 4 anos de casa tem 42 dias. Se a empresa dispensa você de trabalhar, paga o aviso em dinheiro (indenizado): R$ 3.000,00 ÷ 30 × 42 = R$ 4.200,00.</p>
<p>O aviso indenizado conta como tempo de serviço. Isso aumenta os meses de 13º e de férias proporcionais.</p>
<h2>3. 13º proporcional</h2>
<p>Salário ÷ 12 × meses trabalhados no ano, contando o mês com 15 dias ou mais. Se o contrato se estende até 27/10 com o aviso, são 10 meses: R$ 2.500,00.</p>
<h2>4. Férias proporcionais e 1/3</h2>
<p>Salário ÷ 12 × meses desde o último aniversário de admissão, mais 1/3. Com 8 meses, são R$ 2.000,00 mais R$ 666,67. Se houver férias vencidas, elas são pagas à parte, também com 1/3.</p>
<h2>5. FGTS e multa</h2>
<p>A empresa deposita 8% sobre as verbas rescisórias e paga multa de 40% sobre o saldo total do FGTS. Você pode sacar todo o saldo e ainda tem direito ao seguro-desemprego, se cumprir os requisitos.</p>
<h2>6. Descontos</h2>
<p>INSS e Imposto de Renda incidem sobre o saldo de salário e sobre o 13º. O aviso indenizado e as férias com 1/3 não sofrem INSS: o aviso indenizado entra apenas na base do Imposto de Renda, e as férias indenizadas são isentas dele.</p>
<p>A empresa tem até 10 dias corridos depois do fim do contrato para pagar.</p>
<p>Para fazer o cálculo com os seus dados, use a <a href="/rescisao/">calculadora de rescisão</a>.</p>`,
  },
  {
    slug: 'price-ou-sac-qual-compensa',
    titulo: 'Price ou SAC: qual sistema de financiamento compensa mais?',
    descricao: 'Entenda a diferença entre Tabela Price e SAC, com exemplo numérico, e saiba qual sistema cobra menos juros e qual cabe melhor no seu orçamento.',
    data: '2026-10-11',
    calc: 'financiamento',
    corpo: `
<p>Ao financiar um imóvel ou um carro, o banco oferece, em geral, um de dois sistemas de amortização: Price ou SAC. A taxa de juros pode ser a mesma, mas o custo total e o formato das parcelas mudam.</p>
<h2>Como funciona a Tabela Price</h2>
<p>As parcelas são fixas. No começo, a maior parte de cada parcela paga juros, e só uma fatia pequena reduz a dívida. Com o tempo, a amortização cresce.</p>
<h2>Como funciona o SAC</h2>
<p>A amortização é igual em todos os meses, e os juros incidem sobre o saldo devedor, que cai a cada mês. Por isso a parcela diminui ao longo do tempo.</p>
<h2>Comparação com números</h2>
<p>Financiando R$ 100.000,00 a 1% ao mês, em 12 meses:</p>
<ul>
<li><strong>Price:</strong> 12 parcelas de R$ 8.884,88. Juros totais: R$ 6.618,53.</li>
<li><strong>SAC:</strong> primeira parcela de R$ 9.333,33 e última de R$ 8.416,70. Juros totais: R$ 6.500,00.</li>
</ul>
<p>O SAC cobra menos juros porque abate a dívida mais rápido. Em prazos longos, como 30 anos, a diferença em reais é bem maior.</p>
<h2>Qual escolher</h2>
<ul>
<li>Se a renda comporta a parcela inicial maior, o SAC custa menos.</li>
<li>Se a parcela inicial precisa ser menor para caber no orçamento, o Price pode ser a saída. Nesse caso, vale amortizar com recursos extras quando possível.</li>
<li>Em ambos, compare o CET (Custo Efetivo Total), e não só a taxa de juros.</li>
</ul>
<p>Para simular o seu caso e baixar a tabela de amortização, use o <a href="/financiamento/">simulador de financiamento</a>.</p>`,
  },
  {
    slug: 'quando-o-13o-e-pago',
    titulo: 'Quando o 13º é pago? Datas, parcelas e como calcular',
    descricao: 'Veja as datas de pagamento da 1ª e da 2ª parcela do 13º salário, quem tem direito e como calcular o valor proporcional e os descontos.',
    data: '2026-10-11',
    calc: 'decimo-terceiro',
    corpo: `
<p>O 13º salário é pago em duas parcelas, com datas previstas em lei.</p>
<h2>Datas de pagamento</h2>
<ul>
<li><strong>1ª parcela:</strong> entre 1º de fevereiro e 30 de novembro. A maioria das empresas paga em novembro. O valor é 50% do bruto, sem descontos.</li>
<li><strong>2ª parcela:</strong> até 20 de dezembro. É paga com os descontos de INSS e Imposto de Renda sobre o total do 13º.</li>
</ul>
<h2>Quem tem direito</h2>
<p>Empregados com carteira assinada, trabalhadores domésticos e avulsos, aposentados e pensionistas do INSS. Quem trabalhou parte do ano recebe o valor proporcional.</p>
<h2>Como calcular</h2>
<p>Divida o salário por 12 e multiplique pelos meses trabalhados. Conta como mês inteiro aquele em que você trabalhou 15 dias ou mais. Se você recebe horas extras ou comissões, use a média do ano.</p>
<p>Exemplo: salário de R$ 3.000,00 e ano completo. O bruto é de R$ 3.000,00. O INSS é de R$ 248,60 e não há Imposto de Renda. A 1ª parcela é de R$ 1.500,00 e a 2ª, de R$ 1.251,40.</p>
<h2>Posso receber antes?</h2>
<p>Você pode pedir a 1ª parcela junto com as férias, desde que faça o pedido por escrito em janeiro. Fora isso, a empresa não é obrigada a adiantar.</p>
<p>Calcule o seu valor na <a href="/decimo-terceiro/">calculadora de 13º salário</a>.</p>`,
  },
];

export const institucionais = {
  sobre: {
    titulo: 'Sobre o {NOME}',
    descricao: 'Conheça o {NOME}: calculadoras financeiras e trabalhistas gratuitas, com a conta explicada e tabelas oficiais atualizadas.',
    corpo: `
<h1>Sobre o {NOME}</h1>
<p>O {NOME} reúne calculadoras de rescisão, 13º salário, férias, financiamento, juros compostos e aposentadoria, em português e de graça.</p>
<h2>Como trabalhamos</h2>
<ul>
<li><strong>Conta explicada.</strong> Cada calculadora mostra as fórmulas, um exemplo numérico e as regras que usou.</li>
<li><strong>Tabelas atualizadas.</strong> As faixas de INSS e IRRF ficam em um único arquivo, com a fonte e a data de vigência, e são revisadas todo ano.</li>
<li><strong>Cálculos testados.</strong> Cada fórmula tem testes automatizados, conferidos com um cálculo independente.</li>
<li><strong>Privacidade.</strong> Os valores digitados ficam no seu navegador. Não enviamos esses dados a nenhum servidor.</li>
</ul>
<h2>Como o site se mantém</h2>
<p>O {NOME} exibe anúncios e, em alguns casos, links de afiliados, que são sempre identificados como publicidade. Isso não altera os resultados das calculadoras.</p>
<h2>Limites</h2>
<p>Os resultados são estimativas. Eles não substituem contador, advogado ou consultor financeiro. Veja o <a href="/aviso-legal/">aviso legal</a>.</p>
<p>Encontrou um erro ou tem uma sugestão? Fale pela página de <a href="/contato/">contato</a>.</p>`,
  },
  contato: {
    titulo: 'Contato',
    descricao: 'Fale com a equipe do {NOME}: sugestões, dúvidas e relatos de erro nos cálculos.',
    corpo: `
<h1>Contato</h1>
<p>Escreva para <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
<h2>Para agilizar a resposta</h2>
<ul>
<li>Se encontrou um erro de cálculo, diga qual calculadora, os valores que digitou e o resultado que você esperava, com a fonte.</li>
<li>Se tem uma sugestão de calculadora, descreva a conta que gostaria de fazer.</li>
<li>Não enviamos orientação jurídica, contábil ou financeira individual. Para isso, procure um profissional.</li>
</ul>
<p>Respondemos assim que possível.</p>`,
  },
  privacidade: {
    titulo: 'Política de privacidade',
    descricao: 'Como o {NOME} trata dados pessoais, cookies, anúncios e estatísticas, conforme a LGPD.',
    corpo: `
<h1>Política de privacidade</h1>
<p>Última atualização: {DATA}. Esta política explica quais dados o {NOME} trata, para quê e quais são os seus direitos, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
<h2>Quem é o responsável</h2>
<p>{RESPONSAVEL} é responsável pelo tratamento de dados neste site. Contato: <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
<h2>Dados que você digita nas calculadoras</h2>
<p>Salários, datas, valores e demais dados digitados nas calculadoras são processados no seu navegador e <strong>não são enviados aos nossos servidores</strong> nem armazenados por nós.</p>
<h2>Cookies e tecnologias semelhantes</h2>
<ul>
<li><strong>Essenciais:</strong> guardam a sua escolha sobre cookies no armazenamento local do navegador.</li>
<li><strong>Estatísticas:</strong> se você permitir, usamos o Google Analytics para entender quais páginas são mais usadas. Ele coleta dados como páginas visitadas, tipo de dispositivo e localização aproximada, sem identificar você pelo nome.</li>
<li><strong>Publicidade:</strong> se você permitir, o Google AdSense e seus parceiros exibem anúncios e podem usar cookies para personalizá-los e medir o desempenho. Veja como o Google usa dados em <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">policies.google.com/technologies/partner-sites</a>.</li>
</ul>
<p>Estatísticas e publicidade só são carregadas depois que você clica em "Aceitar todos". Você pode mudar de ideia em "Preferências de cookies", no rodapé, ou apagando os dados do site no navegador. Também pode gerenciar anúncios personalizados em <a href="https://adssettings.google.com" rel="noopener">adssettings.google.com</a>.</p>
<h2>Links de afiliados</h2>
<p>Alguns links levam a sites de parceiros e são identificados como publicidade. Ao clicar, o parceiro pode registrar a origem do acesso para fins de comissão e tratar os seus dados conforme a política dele.</p>
<h2>Mensagens que você nos envia</h2>
<p>Se você escrever para nós, usaremos o seu e-mail e o conteúdo da mensagem só para responder.</p>
<h2>Seus direitos</h2>
<p>Pela LGPD, você pode pedir confirmação do tratamento, acesso, correção, eliminação de dados, informação sobre compartilhamento e revogação do consentimento. Escreva para o e-mail acima.</p>
<h2>Alterações</h2>
<p>Podemos atualizar esta política. A data de revisão fica no início da página.</p>`,
  },
  termos: {
    titulo: 'Termos de uso',
    descricao: 'Condições de uso do {NOME}: natureza informativa dos cálculos, limites de responsabilidade e propriedade do conteúdo.',
    corpo: `
<h1>Termos de uso</h1>
<p>Última atualização: {DATA}. Ao usar o {NOME}, você concorda com estes termos.</p>
<h2>Uso do site</h2>
<p>As calculadoras e os textos são gratuitos e destinados a uso pessoal e informativo. Você não deve usar o site de forma que prejudique o funcionamento dele ou de terceiros.</p>
<h2>Natureza dos resultados</h2>
<p>Os resultados são estimativas feitas com base na legislação e nas tabelas indicadas em cada página. Convenções coletivas, parcelas variáveis, mudanças recentes na lei e situações específicas podem alterar o valor final. Os resultados não constituem aconselhamento jurídico, contábil, tributário ou de investimento.</p>
<h2>Limitação de responsabilidade</h2>
<p>Fazemos o possível para manter as informações corretas e atualizadas, mas não garantimos que estejam isentas de erros. O {NOME} não responde por decisões tomadas com base nos resultados. Confirme valores importantes com um profissional ou com o órgão competente.</p>
<h2>Publicidade e links de terceiros</h2>
<p>O site exibe anúncios e links de terceiros, alguns de afiliados. Não controlamos esses sites e não nos responsabilizamos pelo conteúdo ou pelas práticas deles.</p>
<h2>Propriedade do conteúdo</h2>
<p>Textos, layout e código do site são protegidos por direitos autorais. Você pode citar trechos curtos com link para a página de origem.</p>
<h2>Alterações</h2>
<p>Podemos alterar estes termos. O uso continuado do site depois da alteração significa que você concorda com a nova versão.</p>`,
  },
  'aviso-legal': {
    titulo: 'Aviso legal',
    descricao: 'Aviso legal do {NOME}: os resultados das calculadoras são estimativas informativas e não substituem a orientação de um profissional.',
    corpo: `
<h1>Aviso legal</h1>
<p>As informações e os resultados do {NOME} têm finalidade exclusivamente informativa e educacional.</p>
<ul>
<li>Os valores são <strong>estimativas</strong> e podem diferir do cálculo oficial feito pela empresa, pelo órgão público ou pela instituição financeira.</li>
<li>Nada neste site é <strong>aconselhamento</strong> jurídico, contábil, tributário, financeiro ou de investimento.</li>
<li>Rentabilidades futuras <strong>não são garantidas</strong>. Investimentos têm riscos.</li>
<li>As tabelas de INSS e IRRF seguem a vigência indicada no rodapé. Elas mudam por lei, e a atualização do site pode levar alguns dias.</li>
<li>Antes de tomar uma decisão importante, consulte um contador, um advogado ou um consultor financeiro habilitado.</li>
</ul>
<h2>Publicidade</h2>
<p>O site pode exibir anúncios e links de afiliados, sempre identificados. A empresa anunciante ou parceira pode pagar comissão ao {NOME}. Isso não altera os resultados das calculadoras.</p>`,
  },
};
