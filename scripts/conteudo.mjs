// Conteúdo editorial das páginas. Tokens: {ANO} (ano de vigência das tabelas) e {NOME} (nome do site).
// Os exemplos numéricos abaixo são os mesmos casos verificados em tests/.

const autor = 'Thiago Ribeiro';
const salario = { name: 'salario', rotulo: 'Salário bruto mensal (R$)', tipo: 'money', valor: '3.000,00' };
const media = { name: 'media', rotulo: 'Média de horas extras e comissões (R$)', tipo: 'money', valor: '', placeholder: '0,00', ajuda: 'Opcional. Média mensal dos valores variáveis.' };
const dependentes = { name: 'dependentes', rotulo: 'Dependentes no Imposto de Renda', tipo: 'number', valor: '0' };

export const calculadoras = [
  {
    slug: 'decimo-terceiro',
    nome: 'Calculadora de 13º salário',
    nomeCurto: '13º salário',
    autor: 'Thiago Ribeiro',
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
<p>O 13º salário equivale a um salário extra pago por ano, dividido em duas parcelas. Cada mês em que você trabalhou 15 dias ou mais conta como um mês inteiro no cálculo.</p>
<p class="formula">13º bruto = (salário mensal + média de horas extras e comissões) ÷ 12 × meses trabalhados no ano</p>
<h3>O que conta como mês trabalhado</h3>
<p>Conta como mês completo todo mês em que você esteve ao serviço por pelo menos 15 dias. Faltas e faltas justificadas não reduzem o mês, mas afastamentos pagos pelo INSS (como auxílio-doença e acidente) não contam como tempo de serviço para o 13º.</p>
<h3>As duas parcelas</h3>
<ul>
<li><strong>1ª parcela:</strong> corresponde a 50% do valor bruto, sem descontos de INSS ou Imposto de Renda. Deve ser paga entre 1º de fevereiro e 30 de novembro de cada ano.</li>
<li><strong>2ª parcela:</strong> corresponde aos outros 50% brutos, com os descontos de INSS e IRRF aplicados sobre o valor total do 13º (descontados apenas nesta parcela). Deve ser paga até 20 de dezembro. O valor já recebido na 1ª parcela é abatido do líquido final.</li>
</ul>
<h3>Descontos (INSS e IRRF)</h3>
<p>O INSS incide sobre o 13º seguindo a tabela progressiva de {ANO}, calculada separadamente do salário do mês. Para o IRRF, vale a tabela própria do 13º: os limites e a parcela a deduzir da tabela mensal são divididos por 2 (Lei 7.713/1988, art. 12, §1º). Você pode escolher a dedução mais vantajosa entre o desconto simplificado e a dedução por dependentes. A redução do Imposto de Renda de 2026 (Lei 15.270/2025, art. 3º-A) também se aplica ao 13º.</p>
<h3>Proporcional ao tempo de serviço</h3>
<p>Se você entrou ou saiu no meio do ano, o 13º é proporcional aos meses trabalhados. Cada mês com 15 dias ou mais conta como um mês cheio. Exemplo: quem trabalhou 8 meses recebe 8/12 do valor anual.</p>
<h3>Exemplo numérico</h3>
<p>Salário de R$ 3.000,00 e 12 meses trabalhados: 13º bruto de R$ 3.000,00. Com INSS de R$ 248,60 e IRRF zero (após dedução simplificada), o líquido é de R$ 2.751,40. Isso se paga em R$ 1.500,00 na 1ª parcela e R$ 1.251,40 na 2ª parcela (já descontada).</p>`,
    faq: [
      ['Quem tem direito ao 13º salário?', 'Empregados com carteira assinada (incluindo domésticos e temporários), trabalhadores avulsos, aposentados e pensionistas do INSS. Servidores públicos seguem a lei do seu ente.'],
      ['Quando o 13º é pago?', 'A 1ª parcela entre 1º de fevereiro e 30 de novembro. A 2ª até 20 de dezembro.'],
      ['Quem trabalhou menos de 15 dias em um mês perde esse mês?', 'Sim. Cada mês só conta se você trabalhou 15 dias ou mais nele. Por isso quem foi admitido no dia 20 não ganha 1/12 daquele mês.'],
      ['Horas extras e comissões entram no 13º?', 'Entram. A média dos valores variáveis integra a base. Use o campo de média para incluí-los.'],
      ['O 13º tem desconto de INSS e Imposto de Renda?', 'Tem, e os dois incidem sobre o valor total do 13º, descontados na 2ª parcela. A 1ª parcela vem sem descontos.'],
      ['Posso receber a 1ª parcela junto com as férias?', 'Pode. O empregado precisa pedir por escrito em janeiro do mesmo ano, e a empresa paga a 1ª parcela no mês das férias.'],
['Como economizar com o que tenho?', "Para economizar no 13º, aprove a parte de cada parcela para pagar dívidas, montar reserva ou investir em algo que caiba no seu bolso. O guia Mais de 70 formas para economizar traz dicas práticas para reduzir gastos e poupar mais. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
  {
    slug: 'ferias',
    nome: 'Calculadora de férias',
    nomeCurto: 'Férias',
    autor: 'Thiago Ribeiro',
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
<p>O valor das férias corresponde ao salário proporcional aos dias de descanso, acrescido do terço constitucional (1/3). As férias são um direito anual do trabalhador após 12 meses de contrato.</p>
<p class="formula">férias = (salário + média de variáveis) ÷ 30 × dias de férias<br>1/3 constitucional = valor das férias ÷ 3</p>
<h3>O que entra no cálculo</h3>
<p>Integram a base das férias o salário mensal e a média dos valores variáveis recebidos no período (horas extras, comissões, adicionais). O 1/3 constitucional é pago sobre o valor das férias e não sofre desconto de INSS desde 2020 (Lei 8.212/1991, art. 28, §9º, IV).</p>
<h3>Abono pecuniário (venda de 10 dias)</h3>
<p>Você pode converter até 1/3 das férias (10 dias) em dinheiro. O abono vale o salário de 10 dias mais o 1/3 sobre eles. O valor do abono sofre desconto de INSS, e tanto o abono quanto o 1/3 entram na base de cálculo do Imposto de Renda. O pedido pode ser feito a qualquer tempo dentro do período concessivo.</p>
<h3>Descontos e prazo de pagamento</h3>
<p>O IRRF incide sobre as férias mais o 1/3; o INSS incide somente sobre as férias (o 1/3 é isento). As alíquotas seguem as tabelas de {ANO}. O pagamento das férias deve ser feito até 2 dias antes do início do descanso.</p>
<h3>Fracionamento das férias</h3>
<p>As férias podem ser divididas em até 3 períodos, desde que haja concordância entre empregado e empregador: um período deve ter pelo menos 14 dias corridos e os demais, pelo menos 5 dias cada.</p>
<h3>Se a empresa não conceder as férias a tempo</h3>
<p>O empregador tem 12 meses (período concessivo) para conceder as férias depois do término do período aquisitivo. Se não o fizer, deve pagar as férias em dobro, com o respectivo 1/3 constitucional.</p>
<h3>Exemplo numérico</h3>
<p>Salário de R$ 3.000,00 e 30 dias de férias: férias de R$ 3.000,00 mais R$ 1.000,00 de terço, total bruto de R$ 4.000,00. Com INSS de R$ 248,60 (sobre as férias) e IRRF zero, o líquido é de R$ 3.751,40.</p>`,
    faq: [
      ['Quando tenho direito a tirar férias?', 'Depois de 12 meses de trabalho (período aquisitivo). A empresa tem os 12 meses seguintes (período concessivo) para conceder o descanso.'],
      ['Quem escolhe a época das férias?', 'O empregador define, de acordo com o interesse da empresa. Ele precisa avisar com pelo menos 30 dias de antecedência.'],
      ['As faltas reduzem os dias de férias?', 'Reduzem. Com até 5 faltas injustificadas no período, são 30 dias. De 6 a 14 faltas, 24 dias. De 15 a 23, 18 dias. De 24 a 32, 12 dias. Acima de 32, você perde o direito.'],
      ['Posso vender todas as férias?', 'Não. O limite do abono pecuniário é de 1/3, ou seja, 10 dias.'],
      ['O que acontece se a empresa não conceder as férias a tempo?', 'Ela precisa pagar as férias em dobro, com o 1/3.'],
      ['Horas extras e comissões entram no cálculo?', 'Entram. A média dos valores variáveis recebidos no período integra a base das férias.'],
['Como economizar com o que tenho?', "Para economizar nas férias, compare passagens, hospedagem e projetos, e evite compras de impulso. O guia Mais de 70 formas para economizar oferece dicas práticas para reduzir custos e poupar mais. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
  {
    slug: 'rescisao',
    nome: 'Calculadora de rescisão trabalhista',
    nomeCurto: 'Rescisão',
    autor: 'Thiago Ribeiro',
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
<li><strong>FGTS:</strong> o empregador deposita 8% sobre as verbas de natureza salarial (saldo, aviso indenizado, 13º e férias com o 1/3 - Lei 8.036, art. 15). A multa é de 40% (ou 20% no acordo) sobre o saldo total, incluindo esse depósito. Ela é paga pelo empregador e não sai do seu saldo.</li>
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
['Como economizar com o que tenho?', "Na hora da rescisão, não gaste o dinheiro sem um plano. A calculadora mostra cada verba; use parte para pagar dívidas, outra para reserva. O guia Mais de 70 formas para economizar ajuda a organizar o dinheiro. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
  {
    slug: 'juros-compostos',
    nome: 'Calculadora de juros compostos',
    nomeCurto: 'Juros compostos',
    autor: 'Thiago Ribeiro',
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
<p>Nos juros compostos, o rendimento de cada período é somado ao saldo e passa a render também. É o efeito "juros sobre juros", que faz o dinheiro crescer mais rápido quanto maior o tempo de aplicação.</p>
<p class="formula">M = C × (1 + i)^n + PMT × ((1 + i)^n − 1) ÷ i</p>
<p>M é o montante final, C o capital inicial, PMT o aporte mensal, i a taxa mensal e n o número de meses. Os aportes são considerados no fim de cada mês.</p>
<h3>Taxa ao ano ou ao mês</h3>
<p>Uma taxa anual não se converte em mensal dividindo por 12. A conversão correta usa a equivalência composta: i = (1 + taxa anual)^(1/12) − 1. Uma taxa de 12% ao ano equivale a cerca de 0,9489% ao mês.</p>
<h3>Regra do 72</h3>
<p>Uma forma rápida de estimar o tempo para dobrar o dinheiro é dividir 72 pela taxa mensal (ou anual, desde que use a mesma unidade). A 1% ao mês, o capital dobra em cerca de 72 meses (6 anos).</p>
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
['Como economizar com o que tenho?', "Para melhorar os juros compostos, aumente a economia, reduza dívidas que engatem juros e mantenha o capital aplicado. O guia Mais de 70 formas para economizar traz passos práticos. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
  {
    slug: 'financiamento',
    nome: 'Simulador de financiamento',
    nomeCurto: 'Financiamento',
    autor: 'Thiago Ribeiro',
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
<p>Em qualquer sistema, cada parcela tem duas partes: os juros do mês, que incidem sobre o saldo devedor, e a amortização, que reduz a dívida. À medida que o saldo cai, os juros mensais também caem.</p>
<h3>Price (Tabela Price)</h3>
<p>As parcelas são iguais do início ao fim. No começo, a maior parte da parcela paga juros, e a amortização cresce ao longo do tempo.</p>
<p class="formula">parcela = valor financiado × i ÷ (1 − (1 + i)^−n)</p>
<h3>SAC (Sistema de Amortização Constante)</h3>
<p>A amortização é a mesma todo mês (valor financiado ÷ n). Como os juros caem junto com o saldo, as parcelas diminuem mês a mês. A primeira é a mais alta.</p>
<p class="formula">parcela do mês k = amortização + saldo devedor × i</p>
<h3>Qual escolher</h3>
<p>O SAC costuma custar menos juros no total, mas exige uma parcela inicial maior. O Price cabe melhor em um orçamento apertado no começo, com um custo total maior ao final.</p>
<h3>O que esta simulação não inclui</h3>
<p>Seguros, tarifas, IOF, correção monetária (como TR ou IPCA) e o Custo Efetivo Total (CET). A parcela do contrato real costuma ser maior. Peça o CET ao banco antes de comparar propostas — ele soma juros, tarifas, seguros e impostos em uma única taxa anual.</p>
<h3>Dicas para reduzir o custo</h3>
<ul>
<li><strong>Entrada maior:</strong> quanto menor o valor financiado, menores os juros em reais, mesmo com a mesma taxa.</li>
<li><strong>Amortização antecipada:</strong> reduz o saldo sobre o qual os juros incidem. Pergunte ao banco se o abatimento reduz a parcela ou o prazo.</li>
<li><strong>Pesquise o CET:</strong> não compare apenas a taxa de juros; compare o Custo Efetivo Total de cada proposta.</li>
</ul>
<h3>Exemplo</h3>
<p>R$ 100.000,00 a 1% ao mês em 12 meses. No Price, a parcela é de R$ 8.884,88 e os juros somam R$ 6.618,53. No SAC, a primeira parcela é de R$ 9.333,33, a última de R$ 8.416,70 e os juros somam R$ 6.500,00.</p>`,
    faq: [
      ['Price ou SAC: qual compensa mais?', 'Em juros totais, o SAC compensa mais. Se o orçamento do começo for apertado, o Price pode ser a opção possível. A melhor escolha depende da sua renda e do prazo.'],
      ['O que é o CET?', 'É o Custo Efetivo Total: soma juros, tarifas, seguros e impostos em uma única taxa anual. É o número certo para comparar propostas.'],
      ['Como converter a taxa anual em mensal?', 'Pela equivalência composta: (1 + taxa anual)^(1/12) − 1. Dividir por 12 só dá certo para taxas nominais.'],
      ['Vale a pena amortizar antecipadamente?', 'Em geral, sim, porque reduz o saldo sobre o qual os juros incidem. Pergunte ao banco se o abatimento reduz a parcela ou o prazo.'],
      ['Uma entrada maior reduz os juros?', 'Reduz. Quanto menor o valor financiado, menores os juros em reais, mesmo com a mesma taxa.'],
      ['A parcela do meu contrato ficou diferente da simulação. Por quê?', 'Provavelmente por seguros, tarifas, correção do saldo ou uma taxa diferente da informada. Compare com o CET e com a planilha de evolução do contrato.'],
['Como economizar com o que tenho?', "Para economizar no financiamento, busque melhor taxa, faça entrada e evite compras no cartão nas datas difíceis. O guia Mais de 70 formas para economizar mostra como melhorar o controle do bolso. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
  {
    slug: 'aposentadoria',
    nome: 'Calculadora de aposentadoria',
    nomeCurto: 'Aposentadoria',
    autor: 'Thiago Ribeiro',
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
    relacionadas: ['juros-compostos', 'financiamento', 'inss'],
    comoCalcula: `
<h2>Como calculamos a aposentadoria</h2>
<p>Esta é uma calculadora de planejamento financeiro, não uma simulação do benefício do INSS. Ela responde: quanto preciso ter investido para viver só dos rendimentos?</p>
<p class="formula">patrimônio necessário = renda mensal ÷ rentabilidade real mensal</p>
<p>A ideia é que o patrimônio renda, depois de descontada a inflação, o suficiente para pagar a sua renda sem consumir o principal. Com 4% reais ao ano, isso equivale a juntar cerca de 25 vezes o gasto anual — conhecida como "regra dos 25" ou regra de 4% para saques seguros.</p>
<h3>Aporte necessário</h3>
<p>Para chegar à meta na idade escolhida, o aporte mensal é a parcela que, somada ao patrimônio atual e aos juros, atinge o valor necessário:</p>
<p class="formula">aporte = (meta − patrimônio × (1 + i)^n) × i ÷ ((1 + i)^n − 1)</p>
<h3>Por que usar valores reais</h3>
<p>Se você informar a renda em valores de hoje e a rentabilidade acima da inflação, o resultado já está corrigido. Assim, o patrimônio necessário mantém o poder de compra no futuro, independentemente da inflação acumulada até a aposentadoria.</p>
<h3>O tempo é seu maior aliado</h3>
<p>Quanto mais cedo você começa a investir, menor o aporte mensal necessário. Isso acontece porque os juros compostos agem sobre um período maior e os aportes dos primeiros anos têm mais tempo para render. Adiar o investimento em 5 ou 10 anos pode dobrar o valor que você precisaria poupar todo mês.</p>
<h3>Exemplo</h3>
<p>Quem tem 30 anos e quer R$ 5.000,00 por mês aos 60, com 4% reais ao ano, precisa de cerca de R$ 1.527.305,26. Investindo R$ 1.000,00 por mês a partir do zero, chega a cerca de R$ 685.270,56 nesse prazo. Para atingir a meta, o aporte teria de ser de aproximadamente R$ 2.228,76 por mês.</p>`,
    faq: [
      ['Isto simula a aposentadoria do INSS?', 'Não. Use a calculadora de aposentadoria do INSS deste site para estimar quando você se aposenta e quanto vai receber. Esta página trata da renda que você constrói com investimentos próprios, que pode complementar o benefício.'],
      ['O que é rentabilidade real?', 'É o rendimento acima da inflação. Se o investimento rende 10% e a inflação é de 5%, o ganho real é de cerca de 4,8%.'],
      ['Por que a meta supõe não consumir o patrimônio?', 'Porque, assim, a renda dura para sempre e pode ser deixada para a família. Se aceitar consumir o patrimônio até uma certa idade, a meta necessária é menor.'],
      ['O resultado considera a inflação?', 'Sim, se você usar uma renda em valores de hoje e uma rentabilidade real. Não coloque a rentabilidade nominal.'],
      ['Qual rentabilidade real devo usar?', 'Escolha uma hipótese prudente. Algo entre 3% e 6% ao ano acima da inflação é comum, mas não há garantia de que o mercado entregue esse valor.'],
      ['E se eu quiser me aposentar mais cedo?', 'Mude a idade para se aposentar. Você vai ver o aporte mensal subir, porque há menos anos de juros e a meta chega mais cedo.'],
['Como economizar com o que tenho?', "Para o futuro, crie metas de economia, reduza despesas superficiais e mantenha reserva. O guia Mais de 70 formas para economizar traz dicas práticas. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
  {
    slug: 'me',
    nome: 'Otimizador pró-labore × lucros (ME)',
    nomeCurto: 'ME pró-labore × lucros',
    autor: 'Thiago Ribeiro',
    titulo: 'Pró-labore ou lucros na ME {ANO}: otimizador do Simples Nacional',
    descricao: 'Informe a meta líquida, o faturamento e a folha. O otimizador varre o pró-labore, aplica o Fator R e recomenda a divisão com menos imposto, com as tabelas de {ANO}.',
    resumoLista: 'Meta líquida, Fator R e a divisão com menos imposto.',
    h1: 'Pró-labore × lucros: quanto retirar da ME',
    lead: 'Diga quanto quer no bolso e como está a empresa. O otimizador testa o pró-labore do mínimo ao teto, aplica o Fator R e recomenda a divisão que atinge a meta com menos imposto.',
    campos: [
      { name: 'meta', rotulo: 'Quanto quer receber líquido por mês (R$)', tipo: 'money', valor: '8.000,00', ajuda: 'No bolso, depois dos impostos pessoais.' },
      { name: 'atividade', rotulo: 'Atividade principal', tipo: 'select', valor: 'intelectual', opcoes: [['comercio', 'Comércio (Anexo I)'], ['industria', 'Indústria (Anexo II)'], ['servicos', 'Serviços em geral (Anexo III)'], ['construcao', 'Construção, limpeza, vigilância (Anexo IV)'], ['intelectual', 'TI, consultoria, marketing, engenharia, design… (Fator R)']] },
      { name: 'receitaMensal', rotulo: 'Faturamento mensal esperado (R$)', tipo: 'money', valor: '20.000,00' },
      { name: 'rbt12', rotulo: 'Faturamento dos últimos 12 meses - RBT12 (R$)', tipo: 'money', valor: '200.000,00', ajuda: 'Inclui o período como MEI. Empresa nova: use a média mensal × 12.' },
      { name: 'dataMigracao', rotulo: 'Data da migração MEI → ME (opcional)', tipo: 'date', valor: '' },
      { name: 'despesas', rotulo: 'Despesas e custos mensais, sem impostos nem pró-labore (R$)', tipo: 'money', valor: '2.000,00' },
      { name: 'folhaMensal', rotulo: 'Folha de funcionários no mês, com encargos (R$)', tipo: 'money', valor: '0,00' },
      { name: 'folha12', rotulo: 'Folha total dos últimos 12 meses, para o Fator R (R$)', tipo: 'money', valor: '0,00', ajuda: 'Só salários e encargos já pagos. O pró-labore entra na projeção automaticamente.' },
      { name: 'semHistorico', rotulo: 'Ainda não tenho histórico de folha', tipo: 'checkbox', valor: false, ajuda: 'Marca quando a empresa é nova e não tem 12 meses de folha.' },
      { name: 'escrituracao', rotulo: 'Tem contabilidade completa com balanço', tipo: 'checkbox', valor: false, ajuda: 'Com balanço, todo o lucro pode ser distribuído com isenção.' },
      { name: 'numSocios', rotulo: 'Número de sócios', tipo: 'number', valor: '1' },
      { name: 'participacao', rotulo: 'Sua participação no lucro (%)', tipo: 'number', valor: '100' },
      { name: 'metaPorSocio', rotulo: 'A meta é por sócio', tipo: 'checkbox', valor: false, ajuda: 'Com mais de um sócio, a empresa precisa gerar a meta para cada um.' },
      { name: 'outrasRendas', rotulo: 'Outras rendas tributáveis mensais - CLT, aluguel, autônomo (R$)', tipo: 'money', valor: '0,00' },
      { name: 'inssOutro', rotulo: 'Base mensal no outro vínculo para o teto do INSS (R$)', tipo: 'money', valor: '0,00', ajuda: 'O teto é compartilhado: o pró-labore usa só a folga.' },
      { name: 'dependentes', rotulo: 'Número de dependentes', tipo: 'number', valor: '0' },
      { name: 'pensao', rotulo: 'Pensão alimentícia paga (R$)', tipo: 'money', valor: '0,00' },
      { name: 'outrosDividendos', rotulo: 'Outros dividendos recebidos de outras empresas (R$)', tipo: 'money', valor: '0,00' },
      { name: 'acimaMinimo', rotulo: 'Quero contribuir acima do mínimo para a aposentadoria', tipo: 'checkbox', valor: false },
      { name: 'prolaboreMin', rotulo: 'Pró-labore mínimo desejado (R$)', tipo: 'money', valor: '1.621,00', ajuda: 'Padrão: 1 salário mínimo. O sócio administrador tem piso obrigatório.' },
    ],
    lei: 'LC 123/2006 (Simples Nacional), Lei 8.212/1991 (INSS do sócio) e Lei 15.270/2025 (IR vigente)',
    relacionadas: ['juros-compostos', 'financiamento', 'aposentadoria'],
    comoCalcula: `
<h2>Como o otimizador calcula</h2>
<p>Você informa a meta líquida e a situação da empresa. O otimizador testa o pró-labore do mínimo ao teto, em passos de R$ 50, e para cada valor calcula DAS, INSS com o teto compartilhado, IRRF marginal e o lucro que sobra. Entre os valores que atingem a meta, vence o de menor imposto total.</p>
<p class="formula">alíquota efetiva = (RBT12 × nominal − parcela) ÷ RBT12 · DAS = receita × efetiva</p>
<h3>Fator R</h3>
<p>Atividades intelectuais pagam pelo Anexo III quando a folha de 12 meses chega a 28% do faturamento, e pelo Anexo V abaixo disso. O realizado usa a folha já paga; a varredura usa o projetado - (funcionários + pró-labore) × 12 sobre o maior entre o RBT12 e a receita anualizada. O enquadramento oficial usa os últimos 12 meses, então o DAS menor pode demorar até um ano para aparecer.</p>
<h3>Pró-labore</h3>
<p>INSS de 11% até o teto, descontando o que já foi pago em outro vínculo, mais IRRF pela tabela mensal com o redutor vigente. Outras rendas entram na conta porque empurram a faixa do IR: o custo atribuído ao pró-labore é a parcela marginal. Gera aposentadoria, auxílio-doença e salário-maternidade, e o mínimo é obrigatório para o sócio administrador.</p>
<h3>Distribuição de lucros</h3>
<p>Lucro disponível = receita − DAS − despesas − folha − pró-labore. Sem contabilidade completa, a isenção limita-se ao lucro presumido do setor (cerca de 32% da receita em serviços, 8% em comércio e indústria); acima disso, ou acima de R$ 50 mil por mês de uma só fonte, há retenção de 10% sobre o excedente.</p>
<h3>Cenários comparados</h3>
<ul>
<li><strong>(A) pró-labore mínimo</strong> - maximiza o lucro isento quando o anexo não muda.</li>
<li><strong>(B) ponto do Fator R</strong> - o pró-labore exato que entrega 28% na projeção.</li>
<li><strong>(C) ótimo</strong> - o que atinge a meta com menos imposto.</li>
<li><strong>(D) tudo como pró-labore</strong> - sem distribuição, para comparar o pior caso.</li>
</ul>
<h3>Folha mensal de pagamentos</h3>
<p>O DAS vence no dia 20. O INSS do pró-labore vai na GPS do dia 20 do mês seguinte. Emita a folha de pró-labore e recolha corretamente.</p>
<p class="fonte">Parâmetros editáveis: salário mínimo de {ANO}, teto do INSS, tabelas do Simples (Anexos I a V), IRRF com redutor, dedução por dependente e limite de dividendos. Simulação - valide com o contador antes de colocar em prática.</p>`,
    faq: [
      ['Como o otimizador escolhe o pró-labore ideal?', 'Ele testa valores do mínimo ao teto e, entre os que atingem a sua meta líquida, recomenda o de menor imposto total (DAS + INSS + IRRF + IR dos lucros). A retirada de lucro é o complemento para fechar a meta.'],
      ['O que é o Fator R e quanto falta para 28%?', 'É a folha dos últimos 12 meses dividida pelo faturamento dos últimos 12 meses. A partir de 28%, serviços intelectuais pagam pelo Anexo III; abaixo, pelo Anexo V. O resultado mostra o realizado, o projetado e quanto de folha falta.'],
      ['Por que o benefício do Fator R pode demorar?', 'Porque o enquadramento oficial usa os últimos 12 meses pagos. Subir o pró-labore hoje só reflete no DAS quando a folha nova compõe o período - até um ano.'],
      ['Quando o lucro distribuído paga Imposto de Renda?', 'Sem contabilidade completa, acima do lucro presumido do setor; acima de R$ 50 mil por mês de uma só fonte, com retenção de 10% sobre o excedente. Com escrituração e balanço, a retenção é dispensada.'],
      ['E se a meta não couber no faturamento?', 'O otimizador marca como inviável, mostra o melhor cenário possível e estima o faturamento mínimo necessário para atingir a meta.'],
      ['O que muda perto do teto de ME?', 'ME fatura até R$ 360 mil por ano. Perto do teto o otimizador avisa; acima dele a empresa vira EPP, ainda no Simples, com alíquotas maiores.'],
      ['Preciso de contador mesmo com a simulação?', 'Sim. É uma estimativa com as tabelas vigentes: o contador valida o anexo, a folha de pró-labore e os recolhimentos antes de colocar em prática.'],
['Como economizar com o que tenho?', "Na ME, economize controlando lançamentos e monetizando bens. O guia Mais de 70 formas para economizar ajuda no dia a dia. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
  {
    slug: 'inss',
    nome: 'Calculadora de aposentadoria do INSS',
    nomeCurto: 'INSS',
    autor: 'Thiago Ribeiro',
    titulo: 'Calculadora de aposentadoria do INSS {ANO}: quando vou me aposentar e quanto vou receber',
    descricao: 'Estime quando você se aposenta pelo INSS e o valor do benefício: regra permanente, transição por pontos, idade mínima progressiva e pedágio de 100%.',
    resumoLista: 'Quando aposenta e valor do benefício.',
    h1: 'Calculadora de aposentadoria do INSS',
    lead: 'Informe sexo, nascimento, tempo de contribuição e média salarial. Você vê em qual regra se aposenta primeiro e quanto deve receber.',
    campos: [
      { name: 'sexo', rotulo: 'Sexo', tipo: 'select', valor: 'mulher', opcoes: [['mulher', 'Mulher'], ['homem', 'Homem']], ajuda: 'As idades e os tempos mínimos são diferentes para homens e mulheres.' },
      { name: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', valor: '' },
      { name: 'tempoAnos', rotulo: 'Tempo de contribuição: anos', tipo: 'number', valor: '20' },
      { name: 'tempoMeses', rotulo: 'Tempo de contribuição: meses', tipo: 'number', valor: '0', ajuda: 'De 0 a 11, além dos anos.' },
      { name: 'media', rotulo: 'Média dos salários desde 07/1994 (R$)', tipo: 'money', valor: '3.000,00', largo: true, ajuda: 'Veja no Meu INSS, em Extrato de Contribuição (CNIS). Sem o extrato, use o salário atual como aproximação.' },
      { name: 'salarioAtual', rotulo: 'Salário atual (R$)', tipo: 'money', valor: '', placeholder: '0,00', ajuda: 'Opcional. Usado para projetar a média até a concessão. Vazio = igual à média.' },
      { name: 'em2019', rotulo: 'Contribuição em 11/2019 (anos)', tipo: 'number', valor: '', placeholder: '0', ajuda: 'Opcional. Só para o pedágio de 100%. Vazio = supõe contribuição contínua desde 2019.' },
    ],
    lei: 'Emenda Constitucional 103/2019 (reforma da Previdência)',
    relacionadas: ['aposentadoria', 'me', 'juros-compostos'],
    comoCalcula: `
<h2>Como estimamos a aposentadoria do INSS</h2>
<p>Esta calculadora testa 4 regras da reforma de 2019 e mostra em qual delas você se aposenta primeiro, com o valor estimado do benefício. É uma estimativa: sem o seu CNIS completo, usamos a média que você informa e a projetamos com o salário atual até a data da concessão.</p>
<p class="formula">benefício = média projetada × coeficiente (limitado ao piso e ao teto)</p>
<h3>As 4 regras testadas</h3>
<ul>
<li><strong>Permanente:</strong> mulher 62 anos + 15 de contribuição; homem 65 anos + 20.</li>
<li><strong>Pontos:</strong> idade + contribuição somando 93 (mulher) ou 103 (homem) em {ANO}, subindo 1 ponto por ano; exige 30/35 de contribuição.</li>
<li><strong>Idade progressiva:</strong> 59,5 (mulher) ou 64,5 (homem) em {ANO}, subindo 6 meses por ano; exige 30/35 de contribuição.</li>
<li><strong>Pedágio de 100%:</strong> 57 (mulher) ou 60 (homem) + 30/35 de contribuição + o dobro do tempo que faltava em 11/2019. Paga 100% da média.</li>
</ul>
<h3>O coeficiente</h3>
<p>Nas três primeiras regras, o benefício é 60% da média mais 2% por ano de contribuição além de 15 (mulher) ou 20 (homem), até 100%. No pedágio de 100%, o coeficiente é 100% direto. O resultado respeita o piso (salário mínimo) e o teto do INSS.</p>
<h3>Exemplo</h3>
<p>Mulher nascida em 01/03/1971, com 27 anos de contribuição, média de R$ 4.000,00 e salário atual de R$ 4.500,00: pela transição da idade mínima, aposenta-se em março de 2033 com cerca de 96% da média projetada. O pedágio de 100% pagaria 100% da média, mas chegaria bem depois.</p>
<h3>O que fica de fora</h3>
<p>Pedágio de 50% (com fator previdenciário) e direito adquirido anterior a 11/2019. Para esses casos - e para o valor oficial com o seu CNIS - use o simulador do Meu INSS.</p>`,
    faq: [
      ['De onde tiro a média dos salários?', 'No Meu INSS, em Extrato de Contribuição (CNIS): some os salários desde julho de 1994 e divida pela quantidade de meses. Sem o extrato, informe o salário atual como aproximação - o resultado fica menos preciso.'],
      ['Por que o resultado pode diferir do Meu INSS?', 'Porque o INSS usa todos os seus salários corrigidos mês a mês, e aqui usamos uma média única projetada. É uma estimativa para planejar, não o valor oficial da concessão.'],
      ['Qual regra chega primeiro no meu caso?', 'O resultado mostra as 4 regras lado a lado, com o tempo que falta em cada uma. Em geral, quem tem muito tempo de contribuição chega pelos pontos; quem tem mais idade, pela permanente ou pela idade progressiva.'],
      ['O que é o pedágio de 100%?', 'Para quem já contribuía antes da reforma: é preciso pagar em dobro o tempo que faltava em 11/2019 para 30/35 anos, além de ter 57/60 anos de idade. Em troca, o benefício é 100% da média, sem o redutor do coeficiente.'],
      ['Aposentadoria do INSS tem piso e teto?', 'Tem. Nenhum benefício fica abaixo do salário mínimo nem acima do teto do INSS. A calculadora já aplica os dois.'],
      ['E se eu quiser complementar a renda?', 'Use a calculadora de aposentadoria privada do site: informe a renda total que você quer e descubra quanto precisa investir por mês para completar o que o INSS vai pagar.'],
['Como economizar com o que tenho?', "Na aposentadoria do INSS, economize planejando os rendimentos, evitando dívidas e aumentando a reserva. O guia Mais de 70 formas para economizar traz dicas úteis. Acesse <a href='https://go.hotmart.com/F108245511X?dp=1' rel='noopener' target='_blank'>aqui</a>."],
    ],
  },
];

export const blog = [
  {
    slug: 'inss-pedagio-100-vale-a-pena',
    titulo: 'Pedágio de 100% do INSS: quando pagar o dobro do tempo vale a pena',
    descricao: 'O pedágio de 100% paga 100% da média, mas exige contribuir o dobro do que faltava em 2019. Veja em quais casos ele vence - e quando é uma cilada.',
    data: '2026-10-20',
    calc: 'inss',
    corpo: `
<p>De todas as regras da reforma, o pedágio de 100% é a que mais parece um bom negócio - e a que mais engana. "100% da média" soa imbatível. Só que o preço é salgado: contribuir <strong>o dobro</strong> do tempo que faltava em novembro de 2019. Para alguns, é a melhor porta. Para a maioria, é a mais lenta. A diferença está nos números.</p>
<h2>Como funciona, sem juridiquês</h2>
<p>Valia para quem já contribuía antes da reforma. A conta: pegue quanto faltava em 11/2019 para completar 30 anos (mulher) ou 35 (homem), multiplique por dois e some ao que você já tinha. Além disso, é preciso ter 57 anos (mulher) ou 60 (homem). Em troca, o benefício é <strong>100% da média</strong> - sem o redutor de 60% + 2% ao ano das outras regras.</p>
<h2>Paula: o caso em que o pedágio vence</h2>
<p>Paula tem 57 anos, 29 de contribuição e já tinha 27 em 2019 - faltava 1 ano, então o pedágio cobra 2. Ela se aposenta em outubro de 2030 com R$ 6.060,61 (100% da média projetada de R$ 6.000,00 com salário atual de R$ 6.500,00). A idade progressiva liberaria só em dezembro de 2030, com 96% da média (R$ 5.820,30). Aqui o pedágio ganha duas vezes: <strong>chega 2 meses antes e paga R$ 240 a mais por mês</strong>. Quando faltava pouco em 2019, o preço do pedágio é baixo - e ele vence.</p>
<h2>Marcos: a cilada dos R$ 228</h2>
<p>Marcos tem 60 anos, 34 de contribuição, mas só 27 em 2019 - faltavam 8 anos, e o pedágio cobra 16. Resultado: o pedágio só libera em outubro de 2035, com R$ 4.604,65. A regra permanente libera em abril de 2031, com R$ 4.376,10. Ou seja: <strong>esperar 4 anos e meio a mais por R$ 228 mensais</strong> - e abrir mão de 54 meses de benefício (mais de R$ 236 mil). Para o Marcos, o "100%" é o pior negócio da lista.</p>
<h2>Renata: longe demais para fazer sentido</h2>
<p>Renata tem 50 anos, 25 de contribuição e 18 em 2019 - faltavam 12 anos, o pedágio cobra 24. Ele só chegaria em outubro de 2043, mais de 5 anos depois da permanente (março de 2038), por uma diferença de R$ 18 por mês. Quando faltava muito em 2019, o pedágio nem entra na conversa.</p>
<h2>A regra de bolso</h2>
<p>O padrão é claro: o pedágio de 100% só compete quando <strong>faltava pouco tempo em 2019</strong> - algo como 1 a 3 anos. Acima disso, o dobro do tempo empurra a concessão para tão longe que nenhuma diferença de coeficiente compensa os anos de benefício perdido. E tem o detalhe final: quem tem salário alto sente mais o efeito dos 100%, porque o redutor do coeficiente morde mais quem ganha mais.</p>
<p>Quer saber de que lado você está? Informe o seu tempo de contribuição em 11/2019 na <a href="/inss/">calculadora de aposentadoria do INSS</a> - ela compara o pedágio com as outras três regras, lado a lado, com data e valor. E se o seu caso envolve pedágio de 50% ou direito adquirido anterior a 2019, o caminho é o simulador do Meu INSS com o CNIS completo.</p>`,
  },

  {
    slug: 'inss-qual-regra-chega-primeiro',
    titulo: 'INSS: qual regra de aposentadoria chega primeiro no seu caso',
    descricao: 'Permanente, pontos, idade progressiva ou pedágio de 100%? Entenda as 4 regras do INSS com exemplos reais e descubra qual libera a sua aposentadoria antes.',
    data: '2026-10-20',
    calc: 'inss',
    corpo: `
<p>Você abre o simulador do INSS, responde meia dúzia de perguntas e recebe uma data. Mas <em>por que</em> aquela regra, e não outra? E será que esperar mais um ano por uma regra diferente não pagaria um benefício maior? Quem entende as quatro portas de saída consegue escolher - em vez de apenas aceitar a primeira que abre.</p>
<p>Vamos passar pelas quatro regras com três pessoas fictícias, mas com contas reais - todas rodadas na nossa calculadora. Depois, um passo a passo para descobrir a sua.</p>
<h2>As quatro portas, em linguagem simples</h2>
<div class="tabela-wrap"><table>
<thead><tr><th scope="col">Regra</th><th scope="col">Mulher</th><th scope="col">Homem</th><th scope="col">Quanto paga</th></tr></thead>
<tbody>
<tr><td>Permanente</td><td>62 anos + 15 de contribuição</td><td>65 anos + 20 de contribuição</td><td>60% + 2% ao ano além de 15/20</td></tr>
<tr><td>Pontos</td><td>93 pontos + 30 de contribuição</td><td>103 pontos + 35 de contribuição</td><td>Mesmo coeficiente acima</td></tr>
<tr><td>Idade progressiva</td><td>59,5 anos + 30 de contribuição</td><td>64,5 anos + 35 de contribuição</td><td>Mesmo coeficiente acima</td></tr>
<tr><td>Pedágio de 100%</td><td>57 anos + dobro do que faltava em 2019</td><td>60 anos + dobro do que faltava em 2019</td><td>100% da média</td></tr>
</tbody></table></div>
<p>Pontos, vale lembrar, é a soma da sua idade com o tempo de contribuição. E as metas de pontos e idade progressiva sobem todo ano - os valores acima são os de 2026.</p>
<h2>Ana, 52 anos: a idade decide</h2>
<p>Ana contribui há 28 anos, com média de R$ 3.500,00. Faltam 2 anos de contribuição para os 30 - parece que os pontos vão resolver, certo? Errado: com 52 anos, ela soma 80 pontos hoje, longe dos 93. O que chega primeiro é a <strong>idade progressiva</strong> (junto com a permanente): aposentadoria em maio de 2036, com coeficiente já no teto de 100% pelos 37 anos de contribuição - benefício estimado em R$ 3.576,50. O pedágio de 100% pagaria um pouco mais (R$ 3.584,62), mas só em outubro de 2037: um ano e meio esperando por R$ 8 a mais por mês não compensa.</p>
<h2>Carlos, 58 anos: o pedágio que não vale o pedágio</h2>
<p>Carlos tem 33 anos de contribuição e média de R$ 5.000,00. A permanente e a idade progressiva liberam em fevereiro de 2033, com 98% da média - cerca de R$ 4.978,90. O pedágio de 100% daria os 100% cheios (R$ 5.125,00), mas só em outubro de 2037, quase 5 anos depois. Faça a conta: R$ 146 a mais por mês contra 56 meses de benefício perdido (mais de R$ 278 mil deixados na mesa). Para o Carlos, a regra "pior" no papel é a melhor no bolso.</p>
<h2>A jovem de 30 anos: os pontos vencem no longo prazo</h2>
<p>Com 8 anos de contribuição e média de R$ 3.000,00, ela se aposenta pelos <strong>pontos</strong> em setembro de 2057 - onze meses antes da permanente. Repare: com 39 anos de contribuição na concessão, o coeficiente já bateu no teto de 100% em qualquer regra. No longo prazo, as diferenças de valor somem; o que resta é a data.</p>
<h2>Descubra a sua regra em 3 passos</h2>
<p>Primeiro, pegue o seu <strong>tempo total de contribuição</strong> - vale contar carteira assinada, carnê, serviço militar e tempo rural comprovado. Segundo, calcule a sua <strong>média salarial desde julho de 1994</strong> no extrato do Meu INSS (sem ele, use o salário atual como aproximação). Terceiro, jogue tudo na <a href="/inss/">calculadora de aposentadoria do INSS</a>: ela testa as 4 regras, mostra o tempo que falta em cada uma e diz qual abre primeiro - com o valor estimado lado a lado.</p>
<p>E lembre-se do que a calculadora não faz: pedágio de 50% e direito adquirido anterior a 2019 ficam de fora, e o valor oficial só o INSS calcula com o seu CNIS completo. Use a estimativa para planejar - e confirme no Meu INSS antes de pedir.</p>`,
  },

  {
    slug: 'fator-r-como-folha-e-prolabore-mudam-o-das',
    titulo: 'Fator R: como a folha e o pró-labore mudam o DAS da ME no Simples',
    descricao: 'Entenda o Fator R do Simples Nacional: a conta de 28% da folha sobre o faturamento, o que entra no cálculo e um exemplo com o DAS no Anexo V e no Anexo III.',
    data: '2026-10-17',
    calc: 'me',
    corpo: `
<p>Se você é PJ em TI, consultoria, marketing ou engenharia, existe um número que pode cortar seu imposto quase pela metade - e a maioria dos contadores só comenta por alto: o Fator R. Entender essa conta é a diferença entre pagar 6% e 15,5% sobre o mesmo faturamento.</p>
<p>A regra é direta: some tudo que a empresa gastou com folha nos últimos 12 meses - salários <em>e</em> pró-labore, com encargos - e divida pelo faturamento do mesmo período. Se o resultado bater 28% ou mais, você cai no Anexo III, bem mais barato. Abaixo disso, vai para o Anexo V. Não tem meio-termo.</p>
<h2>Quanto isso representa em reais?</h2>
<p>Pegue uma consultoria faturando R$ 12.000,00 por mês (R$ 144.000,00 em 12 meses), sem funcionários. Com pró-labore mínimo, ela fica no Anexo V: alíquota efetiva de 15,50%, DAS de R$ 1.860,00 por mês. Subindo o pró-labore para R$ 3.360,00 - exatamente os 28% - ela migra para o Anexo III: 6%, DAS de R$ 720,00. Economia de R$ 1.140,00 todo mês, R$ 13.680,00 no ano.</p>
<h2>O custo de atravessar a linha</h2>
<p>Claro que aumentar o pró-labore tem preço: sair de R$ 1.621,00 para R$ 3.360,00 eleva o INSS do sócio de R$ 178,31 para R$ 369,60 mensais, e a base maior pode alcançar faixa tributável de IRRF - embora, com o redutor do IR de {ANO}, o imposto siga zerado nesse patamar. A conta final continua amplamente favorável: o custo extra é uma fração da economia no DAS.</p>
<p>Só que o enquadramento oficial olha os últimos 12 meses pagos - a mudança não aparece no DAS do mês seguinte. É um planejamento de médio prazo, não um truque de última hora. O otimizador da <a href="/me/">calculadora de tributos do ME</a> testa o pró-labore do mínimo ao teto e aponta o ponto exato onde a troca compensa no seu caso.</p>`,
  },
  {
    slug: 'quanto-guardar-aos-30-40-e-50-anos',
    titulo: 'Quanto guardar por mês aos 30, 40 e 50 anos para se aposentar',
    descricao: 'Mesma meta, prazos diferentes: veja quanto é preciso investir por mês aos 30, 40 e 50 anos para alcançar uma renda de R$ 5.000 aos 60, com 4% reais ao ano.',
    data: '2026-10-17',
    calc: 'aposentadoria',
    corpo: `
<p>Aos 30, aposentadoria parece ficção científica. Aos 40, vira uma preocupação de domingo à noite. Aos 50, vira urgência. A matemática por trás é a mesma nas três idades - o que muda é o preço do atraso. E ele é mais salgado do que a intuição sugere.</p>
<p>Vamos fixar o alvo: renda de R$ 5.000,00 por mês aos 60 anos, com hipótese de 4% reais ao ano. O patrimônio necessário é sempre R$ 1.527.305,26 - ele depende da renda e da rentabilidade, não da sua idade. O que a idade decide é em quantas mensalidades você divide o esforço.</p>
<h2>O preço de cada década de atraso</h2>
<div class="tabela-wrap"><table>
<thead><tr><th scope="col">Começando aos</th><th scope="col">Tempo de aporte</th><th scope="col">Aporte mensal necessário</th></tr></thead>
<tbody>
<tr><td>30 anos</td><td>30 anos</td><td>R$ 2.228,76</td></tr>
<tr><td>40 anos</td><td>20 anos</td><td>R$ 4.197,72</td></tr>
<tr><td>50 anos</td><td>10 anos</td><td>R$ 10.411,37</td></tr>
</tbody></table></div>
<p>Dez anos de atraso quase dobram a mensalidade. Vinte anos quase quintuplicam. E veja o outro lado: aplicando só R$ 1.000,00 por mês, quem começa aos 30 chega a R$ 685.270,56; aos 40, a R$ 363.841,73; aos 50, a R$ 146.695,92. Os juros compostos trabalham para quem tem tempo - não para quem aplica mais.</p>
<h2>Três alavancas para quem começou tarde</h2>
<p>Primeiro, confira a hipótese: rentabilidade sempre <em>acima da inflação</em> - usar taxa nominal cria uma meta de mentira. Segundo, abata o que você já tem investido: a calculadora parte do zero, mas qualquer reserva existente reduz o aporte. Terceiro, mexa nas duas pontas da meta: adiar a idade-alvo em poucos anos ou aceitar uma renda inicial menor derruba o patrimônio necessário rapidamente.</p>
<p>Monte o seu cenário real - sua idade, sua meta, sua hipótese - na <a href="/aposentadoria/">calculadora de aposentadoria</a>. O melhor dia para começar foi há dez anos; o segundo melhor é hoje.</p>`,
  },
  {
    slug: 'decimo-terceiro-de-quem-sai-no-meio-do-ano',
    titulo: '13º de quem sai no meio do ano: como é calculado na rescisão',
    descricao: 'Quem é demitido no meio do ano recebe o 13º proporcional aos meses trabalhados. Veja como contar os avos, o efeito do aviso prévio e um exemplo numérico.',
    data: '2026-10-17',
    calc: 'decimo-terceiro',
    corpo: `
<p>Ser demitido em agosto e ouvir que "tem 13º proporcional" tranquiliza - até chegar a hora de conferir o valor. Quantos meses contam, afinal? Janeiro com admissão no dia 20 entra? O aviso indenizado muda alguma coisa? É aqui que a conta costuma sair errada, para os dois lados.</p>
<p>O princípio é simples: o 13º vale 1/12 do salário por mês trabalhado no ano. Mas cada mês só conta se você trabalhou <strong>15 dias ou mais</strong> nele. Essa régua de 15 dias é a juíza de todas as admissões e saídas no meio do mês.</p>
<h2>Dois casos que mostram como a régua funciona</h2>
<p>Demissão em 20/08/2026 com aviso indenizado de 36 dias, sobre salário de R$ 3.000,00: o aviso projeta o contrato até 25/09, então contam janeiro a setembro - 9 avos, R$ 2.250,00. Sem a projeção do aviso, setembro ficaria de fora.</p>
<p>Agora o caso traiçoeiro: admissão em 20/01 e saída em 05/12/2026, com aviso de 30 dias. Janeiro não conta - foram só 12 dias, abaixo dos 15. Mas o aviso projeta o fim para 04/01/2027, e dezembro entra na conta: 11 avos, R$ 2.750,00. Sem a projeção, dezembro também cairia fora e seriam só 10 avos. Uma diferença de R$ 250,00 decidida por dias.</p>
<h2>Na rescisão, o desconto vem junto</h2>
<p>Diferente do 13º de dezembro - cuja primeira parcela sai limpa -, na rescisão o 13º proporcional já vem com INSS e Imposto de Renda descontados, tudo na mesma folha. Não estranhe se o líquido parecer menor que "tantos doze avos" redondos: os descontos já foram mordidos.</p>
<p>Conte os seus meses e confira cada desconto na <a href="/decimo-terceiro/">calculadora de 13º salário</a> e na <a href="/rescisao/">calculadora de rescisão</a> antes de assinar o termo.</p>`,
  },
  {
    slug: 'seguro-desemprego-2026-quem-tem-direito',
    titulo: 'Seguro-desemprego em 2026: quem tem direito, quantas parcelas e quanto recebe',
    descricao: 'Regras do seguro-desemprego em 2026: número de parcelas conforme o tempo de trabalho, valores mínimo e máximo do ano, quem não tem direito e como solicitar.',
    data: '2026-10-17',
    calc: 'rescisao',
    corpo: `
<p>Perder o emprego já é duro; descobrir depois que perdeu um direito por falta de informação é pior ainda. O seguro-desemprego existe para segurar as pontas entre um trabalho e outro - mas ele tem regras de entrada, valores atualizados todo ano e um relógio correndo. Vamos ao que vale em 2026.</p>
<p>Quem tem direito? Empregados CLT dispensados <strong>sem justa causa</strong> - incluindo domésticos - e casos de dispensa indireta, quando a falta grave é do empregador. Também entram contrato suspenso para qualificação, pescador no defeso e trabalhador resgatado de condição análoga à escravidão.</p>
<h2>Quem fica de fora (e surpreende muita gente)</h2>
<p>Não dá direito: acordo entre as partes, justa causa, pedido de demissão, quem já recebe benefício continuado da Previdência (salvo auxílio-acidente e pensão por morte) e quem tem participação societária em empresa. Muita gente só descobre a exclusão do acordo na hora do requerimento - tarde demais para renegociar a saída.</p>
<h2>Quantas parcelas e de quanto</h2>
<p>O número de parcelas segue o tempo de trabalho comprovado: ao menos 6 meses rendem 3 parcelas, ao menos 12 meses rendem 4, e mais de 24 meses rendem 5. O valor parte da média dos três últimos salários, pela tabela anual do Ministério do Trabalho - com piso de R$ 1.621,00 (o mínimo de {ANO}, ninguém recebe menos que isso) e teto de R$ 3.703,99 para médias acima de R$ 3.564,96.</p>
<h2>Como pedir sem errar</h2>
<p>O pedido sai pelo aplicativo da Carteira de Trabalho Digital, pelo portal gov.br ou presencialmente nas Superintendências Regionais (agende pelo 158). E atenção ao detalhe que corta o benefício: conseguir um emprego com carteira assinada no meio do recebimento suspende as parcelas restantes.</p>
<p>Se a sua saída foi combinada com a empresa, confira antes o que muda no aviso e no FGTS na <a href="/rescisao/">calculadora de rescisão</a> - e confirme se o tipo de saída escolhido mantém o seu acesso ao benefício.</p>`,
  },
  {
    slug: 'quanto-precisa-para-viver-de-renda',
    titulo: 'Quanto preciso juntar para viver de renda? Faça as contas',
    descricao: 'Planejamento de aposentadoria particular: quanto patrimônio você precisa para retirar uma renda mensal sem consumir o principal, com exemplo numérico.',
    data: '2026-10-17',
    calc: 'aposentadoria',
    corpo: `
<p>Pare um minuto e faça a pergunta que quase ninguém faz em voz alta: quanto dinheiro eu precisaria ter investido para parar de trabalhar e viver só dos rendimentos? A resposta assusta no início - mas ter o número na cabeça muda completamente a forma de planejar.</p>
<p>A lógica é mais simples do que parece. Se o seu patrimônio rende, acima da inflação, o suficiente para cobrir o seu custo de vida todo mês, você nunca precisa mexer no principal - a renda dura para sempre e ainda pode ficar para a família. Com uma hipótese de 4% reais ao ano, isso equivale a juntar cerca de 25 vezes o seu gasto anual. Para R$ 5.000,00 por mês, falamos de algo em torno de R$ 1,5 milhão.</p>
<h2>Um exemplo com começo, meio e fim</h2>
<p>Quem tem 30 anos e mira R$ 5.000,00 mensais aos 60, com 4% reais ao ano, precisa acumular R$ 1.527.305,26. Aplicando R$ 1.000,00 por mês desde zero, chega a R$ 685.270,56 - faltam R$ 842.034,70. Para fechar a conta, o aporte teria de ser de R$ 2.228,76 por mês.</p>
<p>Repare no que o exemplo ensina: o patrimônio-alvo não depende da sua idade, e sim da renda que você quer e da rentabilidade que assume. A idade só decide em quantas parcelas mensais você divide o esforço.</p>
<h2>O erro que estraga a conta: usar rentabilidade nominal</h2>
<p>Se você projeta com 10% ao ano "porque é o que a renda fixa paga", mas a inflação come 5%, seu poder de compra real cresce bem menos. Informe a renda em valores de hoje e o rendimento <em>acima da inflação</em> - aí o resultado já vem corrigido e a meta não nasce furada.</p>
<h2>O que este número não inclui</h2>
<p>É um planejamento com investimentos próprios, não uma simulação do INSS. Benefício público, Imposto de Renda sobre os rendimentos e imprevistos da vida ficam de fora. Use uma hipótese prudente de rentabilidade, mantenha uma reserva de emergência separada e revise a meta todo ano.</p>
<p>Descubra o seu patrimônio-alvo e o aporte que fecha a sua conta na <a href="/aposentadoria/">calculadora de aposentadoria</a>.</p>`,
  },
  {
    slug: 'juros-compostos-aporte-mensal-e-tempo',
    titulo: 'Juros compostos: como o aporte mensal e o tempo mudam o resultado',
    descricao: 'Entenda a fórmula dos juros compostos com um exemplo de aporte mensal de R$ 500 e veja por que o tempo pesa mais que o valor aplicado de uma vez.',
    data: '2026-10-17',
    calc: 'juros-compostos',
    corpo: `
<p>Todo mundo já ouviu que juros compostos são "a oitava maravilha do mundo". A frase é gasta, mas esconde uma verdade incômoda: a maioria das pessoas subestima brutalmente o quanto o tempo - não o valor aplicado - decide o resultado final.</p>
<p>A mecânica é simples: a cada mês, os rendimentos se somam ao saldo e passam a render também. É juro sobre juro, mês após mês. A fórmula leva capital inicial, aporte mensal, taxa e prazo - e a calculadora faz essa conta considerando os aportes no fim de cada mês.</p>
<h2>R$ 500 por mês viram quanto em 10 anos?</h2>
<p>A 0,8% ao mês, quem aplica R$ 500,00 mensais durante 10 anos tira R$ 60.000,00 do bolso - e termina com R$ 100.108,75. Os juros somam R$ 40.108,75: quase metade do montante final foi o dinheiro trabalhando sozinho, não você.</p>
<h2>O experimento que muda a cabeça</h2>
<p>A 0,8% ao mês, o dinheiro dobra em cerca de 87 meses - por volta de 7 anos e 3 meses. Agora compare: R$ 10.000,00 aplicados uma única vez, na mesma taxa, chegam a R$ 67.690,48 em 20 anos, com R$ 57.690,48 de juros. Moral da história: quem começa cedo com pouco costuma terminar à frente de quem começa tarde com muito. Tempo é o ativo mais caro da conta.</p>
<h2>E o Imposto de Renda no resgate?</h2>
<p>Os rendimentos pagam IR pela tabela regressiva: 22,5% para resgates de até 180 dias, caindo até 15% após 720 dias. Mais um prêmio para a paciência - deixar o dinheiro quieto por mais de dois anos corta o imposto quase pela metade. A calculadora já estima esse desconto junto com o montante.</p>
<p>Monte o seu cenário - capital inicial, aporte e prazo - na <a href="/juros-compostos/">calculadora de juros compostos</a> e veja onde você estaria daqui a 10, 20, 30 anos se começasse hoje.</p>`,
  },
  {
    slug: 'ferias-como-calcular-terco-e-abono',
    titulo: 'Férias: como calcular o valor, o 1/3 constitucional e o abono de 10 dias',
    descricao: 'Passo a passo do cálculo das férias com o terço constitucional, a venda de 10 dias (abono pecuniário), os descontos de INSS e IRRF e os prazos de pagamento.',
    data: '2026-10-17',
    calc: 'ferias',
    corpo: `
<p>As férias estão chegando e, junto com a mala, vem a dúvida de todo ano: quanto vou receber, afinal? O contracheque das férias parece escrito em outro idioma - salário, terço, abono, descontos. Vamos traduzir, com um exemplo de R$ 3.000,00 de salário para acompanhar.</p>
<p>O ponto de partida: depois de 12 meses de trabalho, você tem direito a 30 dias de descanso, e cada dia vale o salário dividido por 30. Em cima do total vem o famoso <strong>terço constitucional</strong> - um bônus de 1/3 previsto na Constituição. Com 30 dias, são R$ 3.000,00 de férias mais R$ 1.000,00 de terço: R$ 4.000,00 brutos.</p>
<h2>Quanto o governo morde - e o que escapa</h2>
<p>Nem todo desconto pega tudo. O <strong>INSS</strong> incide só sobre as férias - o terço é isento desde 2020. Já o <strong>Imposto de Renda</strong> morde férias mais terço juntos, com dependentes e desconto simplificado aliviando a base. No nosso exemplo, o INSS dá R$ 248,60, o IRRF zera e o líquido fica em R$ 3.751,40.</p>
<h2>Vender 10 dias: quando vale a pena?</h2>
<p>O abono pecuniário permite converter até 10 dias em dinheiro: você descansa 20 e recebe 10. O pedido pode ser feito a qualquer tempo dentro do período concessivo. No exemplo, o abono vale R$ 1.000,00 mais R$ 333,33 de terço - e como o bruto total é o mesmo, o líquido segue R$ 3.751,40. Ou seja: vender dias troca descanso por dinheiro na mão, sem mágica tributária. Vale a pena quando você precisa do reforço no caixa mais do que dos dias livres.</p>
<h2>Os prazos que ninguém pode furar</h2>
<p>A empresa tem que pagar até 2 dias antes de você sair - se atrasar, paga em dobro. Faltas injustificadas cortam os dias (de 6 a 14 faltas, caem para 24 dias; de 15 a 23, para 18). E dá para dividir as férias em até 3 períodos, desde que você concorde: um com pelo menos 14 dias e os outros com 5 ou mais.</p>
<p>Antes de combinar as datas com o chefe, simule o seu caso - salário, dias, abono - na <a href="/ferias/">calculadora de férias</a> e chegue na conversa sabendo exatamente quanto vai receber.</p>`,
  },
  {
    slug: 'rescisao-por-acordo-o-que-muda',
    titulo: 'Rescisão por acordo: o que muda no aviso prévio, no FGTS e no valor final',
    descricao: 'Na rescisão de comum acordo, o aviso indenizado é pago pela metade e a multa do FGTS cai de 40% para 20%. Veja um exemplo lado a lado com a demissão sem justa causa.',
    data: '2026-10-17',
    calc: 'rescisao',
    corpo: `
<p>A conversa costuma começar assim: "e se a gente fizer um acordo?" Empresa e funcionário querem encerrar o contrato sem briga - mas ninguém quer sair no prejuízo. O acordo entre as partes (CLT, art. 484-A) existe exatamente para isso: um meio-termo entre a demissão e o pedido, com metade das penalidades para cada lado.</p>
<p>Só que "metade" aqui tem pegadinhas. Vamos ver onde o acordo pesa no bolso, comparando com a demissão sem justa causa num exemplo de salário de R$ 3.000,00.</p>
<h2>O aviso prévio cai pela metade</h2>
<p>Na demissão, o aviso indenizado de 36 dias (para 2 anos e 4 meses de casa) vale R$ 3.600,00 cheios. No acordo, o mesmo aviso sai pela metade: R$ 1.800,00. O período continua contando como tempo de serviço - isso não muda.</p>
<h2>O FGTS é onde dói de verdade</h2>
<p>Na demissão, a multa é de 40% e você saca 100% do saldo. No acordo, a multa cai para 20% e o saque fica limitado a 80%. Com saldo de R$ 10.000,00 mais R$ 644,00 de depósitos da rescisão, a diferença é gritante:</p>
<div class="tabela-wrap"><table>
<thead><tr><th scope="col">Verba do FGTS</th><th scope="col">Sem justa causa</th><th scope="col">Acordo</th></tr></thead>
<tbody>
<tr><td>Multa</td><td>R$ 4.315,20</td><td>R$ 2.128,80</td></tr>
<tr><td>Saque liberado</td><td>R$ 15.103,20</td><td>R$ 10.218,24</td></tr>
</tbody></table></div>
<p>O que fica retido não some: continua na sua conta do fundo, disponível pelas regras normais (como compra da casa própria ou aposentadoria).</p>
<h2>O que não muda - e o que você perde</h2>
<p>Saldo de salário, 13º proporcional e férias com terço seguem as mesmas fórmulas. No exemplo completo - admissão em 01/06/2024, saída em 15/10/2026 - o acordo entrega R$ 7.714,31 de verbas mais R$ 10.218,24 de FGTS, contra R$ 9.478,50 mais R$ 15.103,20 na demissão. Diferença total de cerca de R$ 6.650,00. E tem mais: no acordo, <strong>não há seguro-desemprego</strong>.</p>
<p>Vale a pena? Depende do que você ganha em troca - rapidez, carta de recomendação, parcelamento de valores. Só não assine sem saber o preço: simule os dois cenários na <a href="/rescisao/">calculadora de rescisão</a>, escolhendo o tipo "Acordo entre as partes", e compare antes de decidir.</p>`,
  },
  {
    slug: 'mei-virou-me-o-que-muda-no-imposto',
    titulo: 'MEI que virou ME: o que muda no imposto',
    descricao: 'Estourou o teto do MEI? Entenda como funciona o DAS da ME no Simples Nacional, o Fator R, o pró-labore e a distribuição de lucros, com exemplo numérico.',
    data: '2026-10-12',
    calc: 'me',
    corpo: `
<p>O dia em que o faturamento passa de R$ 81 mil no ano é agridoce: o negócio cresceu, parabéns - mas o imposto fixo e baratinho do MEI ficou para trás. Agora você é microempresa no Simples Nacional, e a conta muda de figura. Calma, que não é nenhum bicho de sete cabeças.</p>
<p>A diferença central é esta: no MEI, você pagava por mês R$ 81,05 de INSS mais R$ 1,00 ou R$ 5,00 de imposto. Na ME, o DAS vira um percentual sobre o faturamento - e esse percentual depende do seu anexo e de quanto a empresa faturou nos últimos 12 meses. Quanto mais fatura, maior a alíquota.</p>
<h2>Seu anexo decide o tamanho da conta</h2>
<p>Cada atividade cai num anexo diferente. Serviços gerais ficam no Anexo III, que começa em 6%. Construção, limpeza, vigilância e advocacia caem no Anexo IV - onde o INSS patronal é pago à parte, fora do DAS. E profissões intelectuais como TI, consultoria e marketing dependem do <strong>Fator R</strong>: se a folha de 12 meses, incluindo o pró-labore, chegar a 28% do faturamento, você paga pelo Anexo III; abaixo disso, cai no Anexo V, bem mais salgado.</p>
<h2>O pró-labore vira um jogo de xadrez</h2>
<p>Diferente do MEI, o sócio da ME recolhe INSS sobre o pró-labore - 11% retido pela empresa ou 20% no carnê, até o teto - mais Imposto de Renda pela tabela mensal. Sem FGTS, sem férias, sem 13º em cima. Só que o pró-labore conta na folha do Fator R: às vezes, aumentá-lo derruba o DAS mais do que custa. É uma conta que vale fazer todo ano.</p>
<h2>Lucro distribuído continua isento - com um porém novo</h2>
<p>O lucro da ME no Simples segue isento de Imposto de Renda. A novidade, desde 2026, é que distribuições acima de R$ 50 mil por mês para a mesma pessoa sofrem retenção de 10% na fonte - a menos que a empresa tenha escrituração contábil e balanço mensal. Para quem distribui valores altos, a contabilidade deixou de ser opcional.</p>
<h2>Quanto isso dá em reais?</h2>
<p>Uma prestadora de serviços faturando R$ 40 mil no mês, com R$ 420 mil acumulados em 12 meses, cai na faixa 3 do Anexo III: alíquota efetiva de 9,3%, DAS de R$ 3.720,00. Compare com os R$ 86,05 do MEI de serviços e entenda por que estourar o teto pede um replanejamento - de preços, de pró-labore e de anexo.</p>
<p>Para estimar o seu cenário, com o Fator R e o pró-labore otimizado, use a <a href="/me/">calculadora de tributos do ME</a>.</p>`,
  },
  {
    slug: 'como-calcular-rescisao-sem-justa-causa',
    titulo: 'Como calcular a rescisão sem justa causa, passo a passo',
    descricao: 'Aprenda a calcular cada verba da rescisão sem justa causa: saldo de salário, aviso prévio, 13º, férias e multa de 40% do FGTS, com um exemplo numérico.',
    data: '2026-10-12',
    calc: 'rescisao',
    corpo: `
<p>Ser mandado embora sem justa causa mexe com tudo ao mesmo tempo: o susto, a papelada, o exame demissional - e aquela pulga atrás da orelha de que o valor na conta não bate. É normal desconfiar, porque a rescisão junta um monte de verbas diferentes numa conta só.</p>
<p>A boa notícia: quando você entende o que cada linha do termo significa, conferir vira coisa de dez minutos. Vamos passar por cada uma, com um exemplo de salário de R$ 3.000,00 para acompanhar.</p>
<h2>Comece pelo que você já trabalhou</h2>
<p>O <strong>saldo de salário</strong> é o mais simples - dias trabalhados no mês da saída, com o mês valendo 30 dias. Saiu dia 15? São R$ 1.500,00. Junto dele vêm o <strong>13º proporcional</strong> (salário dividido por 12 vezes os meses com 15 dias ou mais) e as <strong>férias proporcionais com o terço</strong>. Com 8 meses desde o último aniversário de admissão, dá R$ 2.000,00 mais R$ 666,67 de terço. Férias vencidas, se existirem, entram à parte - também com terço.</p>
<h2>O aviso prévio muda o tamanho de tudo</h2>
<p>O aviso é de 30 dias mais 3 por ano completo, até 90. Quem tem 4 anos de casa soma 42 dias - que, indenizados, valem R$ 4.200,00. E tem um detalhe que muita gente perde: o aviso indenizado conta como tempo de serviço. É ele que pode empurrar o fim do contrato para 27/10, por exemplo, e transformar o 13º em 10 meses (R$ 2.500,00) em vez de 9.</p>
<h2>FGTS, multa e o que vem depois</h2>
<p>A empresa deposita os 8% sobre as verbas e paga a <strong>multa de 40%</strong> sobre o saldo total. Você saca tudo e, cumprindo os requisitos, ainda pode pedir o <strong>seguro-desemprego</strong>. Sobre descontos, a lógica é esta: INSS e Imposto de Renda mordem o saldo e o 13º; o aviso indenizado escapa do INSS (mas entra no IR) e as férias indenizadas escapam do IR.</p>
<p>A empresa tem até 10 dias corridos depois do fim do contrato para pagar. Antes de assinar, rode os seus dados na <a href="/rescisao/">calculadora de rescisão</a>, imprima o resultado e confira linha por linha - questionar na hora é muito mais fácil que correr atrás depois.</p>`,
  },
  {
    slug: 'price-ou-sac-qual-compensa',
    titulo: 'Price ou SAC: qual sistema de financiamento compensa mais?',
    descricao: 'Entenda a diferença entre Tabela Price e SAC, com exemplo numérico, e saiba qual sistema cobra menos juros e qual cabe melhor no seu orçamento.',
    data: '2026-10-11',
    calc: 'financiamento',
    corpo: `
<p>Imagine a cena: você sai do banco com duas simulações na mão, a taxa de juros igual nas duas, e mesmo assim uma delas custa milhares de reais a mais no fim. Nenhum gerente vai explicar isso em voz alta - mas o nome no cabeçalho da simulação explica: <strong>Price</strong> ou <strong>SAC</strong>.</p>
<p>Os dois são jeitos diferentes de fatiar a mesma dívida. Na Price, a parcela é igual do primeiro ao último mês. No SAC, ela começa mais salgada e vai emagrecendo. Parece detalhe, mas é esse formato que decide quanto de juro você paga e quando o aperto acontece.</p>
<h2>Na prática, o que muda no seu orçamento</h2>
<p>Vamos aos números de verdade. Num financiamento de R$ 100.000,00 em 12 meses, a 1% ao mês:</p>
<div class="tabela-wrap"><table>
<thead><tr><th scope="col">Sistema</th><th scope="col">Parcelas</th><th scope="col">Juros totais</th></tr></thead>
<tbody>
<tr><td>Price</td><td>12x de R$ 8.884,88</td><td>R$ 6.618,53</td></tr>
<tr><td>SAC</td><td>de R$ 9.333,33 até R$ 8.416,70</td><td>R$ 6.500,00</td></tr>
</tbody></table></div>
<p>A diferença aqui é de pouco mais de R$ 100 - porque o prazo é curto. Num financiamento de 30 anos, essa mesma lógica vira dezenas de milhares de reais. É por isso que a escolha pesa tanto no crédito imobiliário.</p>
<h2>Por que o SAC cobra menos juro?</h2>
<p>Juro incide sobre o saldo devedor. No SAC, como a amortização (o pedaço que abate a dívida) é igual todo mês desde o início, o saldo cai rápido - e o juro de cada mês seguinte cai junto. Na Price, as primeiras parcelas são quase só juro: a dívida demora a encolher, e você paga juro sobre um saldo alto por mais tempo.</p>
<h2>Qual faz sentido para você?</h2>
<p>Esqueça a resposta única; pense no seu momento:</p>
<ul>
<li><strong>A renda deve crescer e o bolso aguenta o começo?</strong> O SAC costuma compensar: o início aperta, mas as parcelas diminuem e o custo total é menor.</li>
<li><strong>Está no limite - aluguel e prestação se sobrepondo, por exemplo?</strong> A Price dá previsibilidade e uma primeira parcela menor. O truque é usar 13º, férias e bônus para amortizar o saldo de tempos em tempos.</li>
</ul>
<h2>O detalhe que o banco não destaca: o CET</h2>
<p>Sistema de amortização é metade da conversa. Seguros, taxa de administração e tarifas entram no Custo Efetivo Total - e duas propostas com a mesma taxa nominal podem ter CETs bem diferentes. Compare sempre CET com CET, nunca taxa com CET.</p>
<p>Antes de assinar qualquer coisa, rode os seus números no <a href="/financiamento/">simulador de financiamento</a>: ele mostra Price e SAC lado a lado, com a tabela de amortização completa para levar impressa na negociação.</p>`,
  },
  {
    slug: 'quando-o-13o-e-pago',
    titulo: 'Quando o 13º é pago? Datas, parcelas e como calcular',
    descricao: 'Veja as datas de pagamento da 1ª e da 2ª parcela do 13º salário, quem tem direito e como calcular o valor proporcional e os descontos.',
    data: '2026-10-11',
    calc: 'decimo-terceiro',
    corpo: `
<p>Todo fim de ano a mesma novela: o 13º cai na conta, some em dois dias, e ninguém sabe dizer quanto veio em cada parcela - nem por que a segunda é sempre menor. Vamos acabar com esse mistério de uma vez.</p>
<p>A regra do calendário é simples e está na lei há décadas: a <strong>primeira parcela</strong>, de 50% do valor bruto e sem nenhum desconto, sai entre 1º de fevereiro e 30 de novembro. Muita empresa paga junto com as férias ou na data-base. A <strong>segunda parcela</strong>, com todos os descontos, tem prazo final em 20 de dezembro. Se o dia 20 cair no fim de semana, o pagamento é antecipado.</p>
<h2>Quanto cai em cada parcela, com números de verdade</h2>
<p>Pegue um salário de R$ 3.000,00 com o ano completo trabalhado. O 13º bruto é R$ 3.000,00. O INSS sobre ele dá R$ 248,60 e, nessa faixa, o IRRF fica zerado. O líquido é R$ 2.751,40 - mas ele não vem de uma vez:</p>
<ul>
<li><strong>1ª parcela:</strong> R$ 1.500,00 limpos, sem desconto nenhum.</li>
<li><strong>2ª parcela:</strong> R$ 1.251,40 - é aqui que descontam o INSS e o IR sobre o total.</li>
</ul>
<p>É por isso que tanta gente estranha: a segunda parcela parece "errada", mas ela carrega os descontos do 13º inteiro.</p>
<h2>E se eu entrei no meio do ano ou saí da empresa?</h2>
<p>Aí entra a proporcionalidade: cada mês com 15 dias ou mais trabalhados vale 1/12. Quem foi admitido no dia 20 de janeiro, por exemplo, não ganha aquele mês - foram só 12 dias. E quem é demitido com aviso indenizado de 36 dias em agosto ganha esses dias projetados como tempo a mais, o que pode render um avo extra.</p>
<h2>Como usar bem esse dinheiro</h2>
<p>Como a primeira parcela chega sem desconto, ela é ideal para abater dívida cara - cartão, cheque especial - antes dos juros de dezembro. A segunda, já líquida, pode ir para a reserva ou para amortizar financiamento. O erro clássico é tratar as duas como "extras" separados e gastar dobrado.</p>
<p>Quer saber exatamente quanto vem em cada parcela no seu caso, com horas extras e dependentes? Jogue os números na <a href="/decimo-terceiro/">calculadora de 13º salário</a> e confira antes do contracheque chegar.</p>`,
  },
  {
    slug: 'irrf-2026-isencao-e-reducao-quem-nao-paga',
    titulo: 'IRRF 2026: quem está isento e quem paga menos com a redução',
    descricao: 'Veja quem não paga Imposto de Renda na fonte em 2026, como funciona a redução do IRRF e como a dedução por dependente muda o desconto.',
    data: '2026-10-28',
    calc: 'rescisao',
    corpo: `
<p>Muito trabalhador olha o contracheque e se pergunta por que o Imposto de Renda retido na fonte (IRRF) é aquele número - ou por que, às vezes, ele é zero. A resposta mudou em 2026: com a Lei 15.270/2025, quem ganha até R$ 5.000,00 por mês pode ficar isento, e quem está acima disso paga menos graças à redução mensal.</p>
<h2>Quem está isento do IRRF em 2026</h2>
<p>O desconto simplificado sobe de R$ 564,80 para R$ 607,20, e o limite de isenção sobe de R$ 4.664,68 para R$ 5.000,00 mensais. Isso significa:</p>
<ul>
<li><strong>Até R$ 2.428,80:</strong> IRRF zerado (primeira faixa já é isenta).</li>
<li><strong>De R$ 2.428,81 a R$ 5.000,00:</strong> com a redução, o imposto pode cair a zero dependendo da faixa e dos dependentes.</li>
<li><strong>Acima de R$ 5.000,00:</strong> ainda há desconto, mas a redução mensal de até R$ 312,89 diminui o valor a pagar.</li>
</ul>
<h2>Como a redução funciona na prática</h2>
<p>A redução não é um desconto direto no salário: ela baixa a base sobre qual incide o IRRF. Em vez de calcular o imposto sobre o salário bruto, você subtrai a parcela da redução (R$ 312,89 no teto) e calcula sobre o resto. Quanto mais próximo do teto de R$ 5.000,00, maior o alívio - até R$ 312,89 a menos de imposto por mês.</p>
<h2>E os dependentes?</h2>
<p>Cada dependente adiciona uma dedução mensal de R$ 189,59 na base de cálculo. Se você tem dois dependentes, são R$ 379,18 a menos na base do IRRF - o suficiente para tirar muita gente da faixa de pagamento ou reduzir bastante o desconto.</p>
<h2>Exemplo numérico</h2>
<p>Salário bruto de R$ 4.000,00, sem dependentes: com a tabela antiga, o IRRF seria de cerca de R$ 203,24. Com a redução de R$ 312,89 aplicada, a base cai para R$ 3.687,11 e o imposto fica em cerca de R$ 122,31 - uma economia de R$ 80,93 por mês, ou quase R$ 1.000,00 por ano.</p>
<p>Quer conferir no seu caso? A <a href="/rescisao/">calculadora de rescisão</a> aplica as mesmas tabelas de IRRF de 2026 sobre o 13º, férias e rescisão, e a <a href="/decimo-terceiro/">calculadora de 13º salário</a> mostra o IRRF da segunda parcela com a redução já incluída.</p>`,
  },
  {
    slug: 'fgts-quando-sacar-multa-e-extrato',
    titulo: 'FGTS: quando sacar, quanto é a multa e como consultar o extrato',
    descricao: 'Tudo sobre o Fundo de Garantia do Tempo de Serviço: saque em demissão sem justa causa, multa de 40% ou 20% e como ver o extrato pelo app.',
    data: '2026-10-25',
    calc: 'rescisao',
    corpo: `
<p>O FGTS é aquele dinheiro que o patrão deposita todo mês em uma conta vinculada a você - 8% do seu salário, sem desconto no contracheque. Ele fica parado até você ter direito a sacar, que acontece em situações previstas em lei. Vamos tirar as dúvidas mais comuns.</p>
<h2>Quando você tem direito a sacar o FGTS</h2>
<ul>
<li><strong>Demissão sem justa causa:</strong> saque total do saldo + multa de 40% sobre o saldo.</li>
<li><strong>Demissão por acordo (art. 484-A da CLT):</strong> saque de até 80% do saldo + multa de 20%.</li>
<li><strong>Aposentadoria:</strong> saque total.</li>
<li><strong>Compra da casa própria:</strong> uso para amortizar, quitar ou dar entrada no imóvel.</li>
<li><strong>Doença grave (câncer, entre outras) ou falecimento:</strong> saque para o titular ou dependentes.</li>
</ul>
<h2>Multa de 40% ou 20% - quem paga?</h2>
<p>A multa é paga pelo <strong>empregador</strong> e não sai do seu saldo do FGTS. Em demissão sem justa causa, é 40% sobre o saldo total da conta (incluindo o depósito do mês da demissão). Na demissão por acordo, cai para 20%. Quem pede demissão não tem direito à multa nem ao saque total - só recebe as demais verbas rescisórias.</p>
<h2>Exemplo numérico</h2>
<p>Se o seu saldo do FGTS é de R$ 10.000,00 no momento da demissão sem justa causa:</p>
<ul>
<li>Você saca: R$ 10.000,00 (saldo total)</li>
<li>Multa do empregador: R$ 4.000,00 (40%)</li>
<li>Total que entra no seu bolso: R$ 14.000,00</li>
</ul>
<p>Já na demissão por acordo, você sacaria até R$ 8.000,00 (80%) e receberia multa de 20% (R$ 2.000,00), mas perderia o direito ao seguro-desemprego.</p>
<h2>Como consultar o extrato</h2>
<p>Pelo app FGTS (Caixa) ou pelo site da Caixa, com o número do NIS e a senha cadastrada. Você vê todos os depósitos feitos pelos empregadores ao longo dos anos. Se algum depósito estiver faltando, procure o RH da empresa anterior - o empregador que não recolhe FGTS está sujeito a multa e ao processo trabalhista.</p>
<p>A calculadora de <a href="/rescisao/">rescisão trabalhista</a> deste site já inclui o FGTS e a multa no resultado, para você conferir se o valor da rescisão bate com o que a empresa deve pagar.</p>`,
  },
  {
    slug: 'aviso-previo-trabalhado-ou-indenizado',
    titulo: 'Aviso prévio: trabalhado ou indenizado, qual a diferença e como calcula',
    descricao: 'Saiba como funciona o aviso prévio de 30 dias mais 3 por ano, a diferença entre cumprir ou ser dispensado, e como ele afeta o 13º e as férias.',
    data: '2026-10-22',
    calc: 'rescisao',
    corpo: `
<p>O aviso prévio é aquele período de 30 dias (ou mais) entre a comunicação da demissão e o fim efetivo do contrato. Ele serve para o empregado se organizar e para a empresa se ajustar. A regra básica vem da Lei 12.506/2011: 30 dias mais 3 dias por ano completo de serviço, no máximo 90 dias.</p>
<h2>Aviso prévio trabalhado</h2>
<p>Você cumpre o aviso na empresa. Para não prejudicar a busca por um novo emprego, a CLT permite: reduzir a jornada em 2 horas por dia durante todo o aviso, ou faltar 7 dias corridos (que podem ser fracionados). O saldo de salário, férias e 13º seguem sendo calculados normalmente, já que você continua trabalhando.</p>
<h2>Aviso prévio indenizado</h2>
<p>A empresa dispensa você de cumprir o aviso e paga o valor correspondente em dinheiro. Você sai no dia da demissão e recebe o aviso como verba rescisória. Aqui está a pegadinha: o aviso prévio indenizado <strong>não sofre desconto de INSS</strong>, mas entra na base de cálculo do <strong>Imposto de Renda</strong>.</p>
<h2>Como o aviso afeta o 13º e as férias</h2>
<p>O aviso prévio (trabalhado ou indenizado) conta como tempo de serviço. Isso significa que ele pode somar um mês extra ao seu 13º proporcional e às férias proporcionais. Exemplo: se você foi demitido com 9 meses completos e aviso indenizado de 42 dias, o contrato se "alongou" quase um mês e meio - o que pode render mais avos no 13º e nas férias.</p>
<h2>Prazo de pagamento</h2>
<p>A empresa tem até 10 dias corridos após o término do contrato para pagar todas as verbas rescisórias, incluindo o aviso prévio. Se atrasar, há multa e correção pelo índice do FGTS.</p>
<p>Confira cada verba na <a href="/rescisao/">calculadora de rescisão</a>: ela mostra separadamente o saldo de salário, o aviso prévio, o 13º proporcional, as férias com terço e a multa do FGTS.</p>`,
  },
  {
    slug: 'horas-extras-adicionais-entram-em-o-qual',
    titulo: 'Horas extras e adicionais: entram no 13º, férias, rescisão e FGTS?',
    descricao: 'Descubra quais valores variáveis integram a base de cálculo das férias, do 13º salário, da rescisão e do depósito do FGTS, e o que não conta.',
    data: '2026-10-20',
    calc: 'ferias',
    corpo: `
<p>Salário base não é tudo o que entra nas contas trabalhistas. Horas extras, comissões, adicional noturno, insalubridade e periculosidade podem subir - ou não - o valor das férias, do 13º, da rescisão e do depósito do FGTS. Confira o que entra e o que fica de fora.</p>
<h2>O que entra na base de cálculo</h2>
<ul>
<li><strong>Férias:</strong> entram horas extras, comissões e adicionais recebidos no período. A média dos valores variáveis soma ao salário para calcular o valor das férias.</li>
<li><strong>13º salário:</strong> entram. A média mensal dos valores variáveis integra o 13º bruto (salário + média de variáveis) ÷ 12 × meses trabalhados.</li>
<li><strong>Rescisão:</strong> entram no saldo de salário, aviso prévio, 13º proporcional e férias proporcionais/vencidas, quando são habituais.</li>
<li><strong>FGTS:</strong> o depósito de 8% incide sobre as verbas de natureza salarial, incluindo horas extras e adicionais habituais (Lei 8.036/1990, art. 15).</li>
</ul>
<h2>O que NÃO entra</h2>
<ul>
<li>Auxílios eventuais (ex.: auxílio-transporte reembolsado sem natureza de salário).</li>
<li>Gorjetas (não integram o salário para FGTS, salvo acordo/coletivo).</li>
<li>Diárias de viagem (reembolso de despesas, não remuneração).</li>
</ul>
<h2>Proporcionalidade e o limite dos 15 dias</h2>
<p>Para o 13º, cada mês com 15 dias ou mais trabalhados conta como mês inteiro. Se você recebeu horas extras em um mês mas trabalhou menos de 15 dias, esse mês não entra na contagem do 13º proporcional.</p>
<h2>Exemplo</h2>
<p>Salário de R$ 3.000,00 com média de R$ 400,00 de horas extras. As férias de 30 dias saem de (R$ 3.000 + R$ 400) ÷ 30 × 30 = R$ 3.400,00, mais o terço. Sem as horas extras, seriam R$ 3.000,00. A diferença de R$ 400,00 só nas férias mostra por que vale a pena informar a média nas calculadoras.</p>
<p>Na <a href="/ferias/">calculadora de férias</a> e na <a href="/decimo-terceiro/">calculadora de 13º salário</a> há um campo específico para a média de horas extras e comissões - preencha para ter o valor mais próximo da realidade.</p>`,
  },
];

export const institucionais = {
  sobre: {
    titulo: 'Sobre o {NOME}',
    descricao: 'Conheça o {NOME}: calculadoras financeiras e trabalhistas gratuitas, com a conta explicada e tabelas oficiais atualizadas.',
    corpo: `
<h1>Sobre o {NOME}</h1>
<p>O {NOME} reúne calculadoras de rescisão, 13º salário, férias, financiamento, juros compostos e aposentadoria, e de graça.</p>
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
  glossario: {
    titulo: 'Glossário de termos financeiros e trabalhistas',
    descricao: 'Significado de termos como FGTS, INSS, IRRF, 13º salário, aviso prévio, Fator R, pró-labore, CET e outros usados nas calculadoras do {NOME}.',
    corpo: `
<h1>Glossário de termos financeiros e trabalhistas</h1>
<p>Referência rápida para os termos usados nas calculadoras e artigos do {NOME}. Se algo não estiver aqui, envie sua dúvida pela página de <a href="/contato/">contato</a>.</p>

<h2>Números</h2>
<dl>
<dt><strong>13º salário</strong></dt>
<dd>Gratificação de Natal paga em duas parcelas (até 30 de novembro e até 20 de dezembro), equivalente a 1/12 do salário por mês trabalhado no ano.</dd>
</dl>

<h2>A</h2>
<dl>
<dt><strong>Adicionais</strong></dt>
<dd>Valores pagos além do salário base, como adicional noturno, de insalubridade ou de periculosidade. Costumam integrar a base de férias, 13º e FGTS.</dd>

<dt><strong>Abono pecuniário</strong></dt>
<dd>Direito de vender até 1/3 das férias (10 dias) em dinheiro, recebendo o salário desses dias mais o terço constitucional.</dd>
</dl>

<h2>C</h2>
<dl>
<dt><strong>CET (Custo Efetivo Total)</strong></dt>
<dd>Custo real de um financiamento, somando juros, tarifas, seguros, IOF e impostos em uma única taxa anual. É o número correto para comparar propostas de crédito.</dd>

<dt><strong>CLT</strong></dt>
<dd>Consolidação das Leis do Trabalho (Decreto-Lei 5.452/1943), que rege os direitos e deveres de empregados e empregadores no regime CLT.</dd>
</dl>

<h2>F</h2>
<dl>
<dt><strong>FGTS</strong></dt>
<dd>Fundo de Garantia do Tempo de Serviço. O empregador deposita 8% do salário todo mês em conta vinculada ao trabalhador. Pode ser sacado em demissão sem justa causa, aposentadoria e compra da casa própria.</dd>

<dt><strong>Fator R</strong></dt>
<dd>Índice do Simples Nacional que divide a folha de pagamento dos últimos 12 meses pelo faturamento dos últimos 12 meses. Acima de 28%, atividades intelectuais pagam pelo Anexo III; abaixo, pelo Anexo V.</dd>
</dl>

<h2>I</h2>
<dl>
<dt><strong>INSS</strong></dt>
<dd>Instituto Nacional do Seguro Social. Recolhe contribuições e paga benefícios como aposentadoria, auxílio-doença, salário-maternidade e pensão por morte.</dd>

<dt><strong>IRRF</strong></dt>
<dd>Imposto de Renda Retido na Fonte. É o Imposto de Renda descontado na fonte pagadora sobre salários, 13º, férias, rescisão e rendimentos de investimentos.</dd>
</dl>

<h2>J</h2>
<dl>
<dt><strong>Juros compostos</strong></dt>
<dd>Modalidade em que o rendimento de cada período soma-se ao saldo e passa a render também. É o efeito "juros sobre juros", que acelera o crescimento do dinheiro com o tempo.</dd>
</dl>

<h2>P</h2>
<dl>
<dt><strong>Pró-labore</strong></dt>
<dd>Remuneração do sócio-administrador pelo trabalho na empresa. É obrigatório para o sócio que administra e incide INSS (11% até o teto) e IRRF.</dd>
</dl>

<h2>R</h2>
<dl>
<dt><strong>Rescisão trabalhista</strong></dt>
<dd>Encerramento do contrato de trabalho. Pode ocorrer por demissão sem justa causa, pedido de demissão, justa causa ou acordo, com verbas diferentes em cada caso.</dd>
</dl>

<h2>S</h2>
<dl>
<dt><strong>Seguro-desemprego</strong></dt>
<dd>Benefício temporário pago ao trabalhador demitido sem justa causa que cumprir os requisitos de tempo de trabalho e não tiver renda própria suficiente.</dd>

<dt><strong>Terço constitucional</strong></dt>
<dd>Acréscimo de 1/3 sobre o valor das férias, previsto no artigo 7º, inciso XVII, da Constituição Federal. É isento de INSS.</dd>

<dt><strong>Teto do INSS</strong></dt>
<dd>Valor máximo sobre o qual incide a contribuição do INSS e que limita o benefício. Em {ANO}, é de R$ 8.475,55.</dd>
</dl>

<h2>V</h2>
<dl>
<dt><strong>Vigência</strong></dt>
<dd>Período em que uma tabela ou lei está em vigor. As tabelas de INSS e IRRF deste site valem a partir de 01/01/{ANO} e são revisadas todo ano.</dd>
</dl>

<aside class="aviso-legal"><p>Este glossário tem caráter informativo e educacional. Os valores e regras podem mudar com a legislação. Consulte um profissional para decisões importantes.</p></aside>`,
  },
};
