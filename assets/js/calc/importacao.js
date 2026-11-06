// Calculadora de compras internacionais (custo de desembarque no Brasil).
// Regras baseadas no programa Remessa Conforme da Receita Federal e na
// tributação padrão de importação (II, ICMS e despacho postal dos Correios).
// Todas as entradas e saídas de dinheiro usam CENTAVOS INTEIROS.

import { arredondar, emCentavos, formatarBRL as brl, formatarPercentual } from '../core/moeda.js';
import { numero, reunir } from '../core/validacao.js';
import { AVISO_ESTIMATIVA } from './apresentacao.js';

// Regras fixas do texto-base (alíquotas federais e taxa dos Correios).
const LIMITE_REMESSA_CONFORME_USD = 50;      // isento de II até US$ 50
const TETO_REMESSA_CONFORME_USD = 3000;      // II de 20% até US$ 3.000
const II_REMESSA_CONFORME = 0.20;            // 20% acima de US$ 50
const II_PADRAO = 0.60;                      // 60% fora do Remessa Conforme
const DESPACHO_CORREIOS_CENTAVOS = emCentavos(15); // R$ 15,00

const dinheiro = (v, d = 0) => (Number.isFinite(v) ? v : d);

export function validar(e) {
  return reunir({
    precoProduto: numero(e.precoProduto, 'Preço do produto', { min: 0 }),
    cotacaoDolar: numero(e.cotacaoDolar, 'Cotação do dólar', { min: 0.01 }),
    icms: numero(dinheiro(e.icms, 17), 'Alíquota do ICMS', { min: 0, max: 100 }),
    frete: numero(dinheiro(e.frete), 'Frete', { min: 0 }),
    seguro: numero(dinheiro(e.seguro), 'Seguro', { min: 0 }),
  });
}

export function calcular(e, tabelas) {
  void tabelas;

  const produto = emCentavos(dinheiro(e.precoProduto));
  const frete = emCentavos(dinheiro(e.frete));
  const seguro = emCentavos(dinheiro(e.seguro));
  const cotacao = Number(e.cotacaoDolar);
  const alqIcms = dinheiro(e.icms, 17) / 100;
  const remessaConforme = e.remessaConforme === true;
  const despacho = e.despachoPostal === true ? DESPACHO_CORREIOS_CENTAVOS : 0;

  const valorAduaneiro = produto + frete + seguro;
  const valorDolar = valorAduaneiro / 100 / cotacao;

  let cenario;
  let ii = 0;
  let iiAliquota = 0;
  let icms = 0;
  let baseIcms = 0;

  if (remessaConforme && valorDolar <= LIMITE_REMESSA_CONFORME_USD) {
    // Cenário A: isento de Imposto de Importação; incide apenas o ICMS.
    cenario = 'A';
    icms = arredondar(valorAduaneiro * alqIcms);
  } else if (remessaConforme) {
    // Cenário B: II de 20% e ICMS "por dentro" (base = (VA + II) / (1 - alíquota)).
    cenario = valorDolar <= TETO_REMESSA_CONFORME_USD ? 'B' : 'B';
    iiAliquota = II_REMESSA_CONFORME;
    ii = arredondar(valorAduaneiro * iiAliquota);
    baseIcms = arredondar((valorAduaneiro + ii) / (1 - alqIcms));
    icms = arredondar(baseIcms * alqIcms);
  } else {
    // Cenário C: II padrão de 60% e ICMS sobre (valor aduaneiro + II).
    cenario = 'C';
    iiAliquota = II_PADRAO;
    ii = arredondar(valorAduaneiro * iiAliquota);
    baseIcms = valorAduaneiro + ii;
    icms = arredondar(baseIcms * alqIcms);
  }

  const total = valorAduaneiro + ii + icms + despacho;

  let cenarioDescricao;
  if (cenario === 'A') {
    cenarioDescricao = 'Remessa Conforme até US$ 50 — isento de Imposto de Importação';
  } else if (valorDolar > TETO_REMESSA_CONFORME_USD) {
    cenarioDescricao = 'Remessa Conforme acima de US$ 3.000 — II de 20% (verifique se o programa se aplica)';
  } else {
    cenarioDescricao = 'Remessa Conforme acima de US$ 50 — II de 20%';
  }

  return {
    cenario,
    cenarioDescricao,
    produto,
    frete,
    seguro,
    valorAduaneiro,
    valorDolar,
    cotacao,
    alqIcms,
    ii,
    iiAliquota,
    baseIcms,
    icms,
    despacho,
    total,
    remessaConforme,
    acimaTetoRemessaConforme: remessaConforme && valorDolar > TETO_REMESSA_CONFORME_USD,
  };
}

export function exibir(r) {
  const pct = (x) => formatarPercentual(x, x % 1 === 0 ? 0 : 2);
  const resumo = [
    { rotulo: 'Cenário aplicado', valor: r.cenarioDescricao },
    { rotulo: 'Valor aduaneiro (produto + frete + seguro)', valor: brl(r.valorAduaneiro) },
    { rotulo: `Imposto de Importação (${pct(r.iiAliquota)})`, valor: brl(r.ii) },
    { rotulo: `ICMS (${pct(r.alqIcms)})`, valor: brl(r.icms) },
  ];
  if (r.despacho) {
    resumo.push({ rotulo: 'Despacho postal dos Correios', valor: brl(r.despacho) });
  }
  resumo.push({ rotulo: 'Preço total estimado (desembarque)', valor: brl(r.total), destaque: true });

  const detalhes = [
    { descricao: 'Valor em dólares (cotação informada)', valor: `US$ ${r.valorDolar.toFixed(2)}` },
  ];
  if (r.cenario === 'A') {
    detalhes.push(
      { descricao: 'Imposto de Importação', valor: 'Isento (Remessa Conforme até US$ 50)' },
      { descricao: 'ICMS', valor: `Valor aduaneiro × ${pct(r.alqIcms)}` },
      { descricao: 'Preço total', valor: 'Produto + frete + seguro + ICMS' }
    );
  } else if (r.cenario === 'B') {
    detalhes.push(
      { descricao: 'Imposto de Importação', valor: `Valor aduaneiro × ${pct(r.iiAliquota)}` },
      { descricao: 'Base de cálculo do ICMS (por dentro)', valor: `(valor aduaneiro + II) ÷ (1 − ${pct(r.alqIcms)})` },
      { descricao: 'ICMS', valor: `Base × ${pct(r.alqIcms)}` },
      { descricao: 'Preço total', valor: 'Produto + frete + seguro + II + ICMS' }
    );
  } else {
    detalhes.push(
      { descricao: 'Imposto de Importação', valor: `Valor aduaneiro × ${pct(r.iiAliquota)}` },
      { descricao: 'ICMS', valor: `(valor aduaneiro + II) × ${pct(r.alqIcms)}` },
      { descricao: 'Despacho postal dos Correios', valor: r.despacho ? 'R$ 15,00' : 'Não informado' },
      { descricao: 'Preço total', valor: 'Produto + frete + seguro + II + ICMS + despacho postal' }
    );
  }

  const avisos = [
    'O ICMS varia por estado; informe a alíquota do seu estado de destino (geralmente 17% a 18%).',
    'No Remessa Conforme, o ICMS costuma ser cobrado diretamente no checkout da plataforma.',
    'Não inclui taxas de couriers privados (DHL, FedEx, UPS), armazenagem nem outros tributos.',
    AVISO_ESTIMATIVA,
  ];
  if (r.acimaTetoRemessaConforme) {
    avisos.splice(3, 0, 'Acima de US$ 3.000 via Remessa Conforme, confirme se o programa se aplica à sua remessa.');
  }

  return {
    resumo,
    detalhes,
    avisos,
    copiar: `Compras internacionais: ${r.cenarioDescricao}; II ${brl(r.ii)}; ICMS ${brl(r.icms)}; preço total ${brl(r.total)} (valor aduaneiro ${brl(r.valorAduaneiro)} ≈ US$ ${r.valorDolar.toFixed(2)}).`,
  };
}