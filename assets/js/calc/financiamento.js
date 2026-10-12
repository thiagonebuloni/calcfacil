// Financiamento nos sistemas Price (parcela fixa) e SAC (amortização constante).

import { arredondar, emCentavos, formatarBRL as brl, formatarPercentual } from '../core/moeda.js';
import { numero, reunir } from '../core/validacao.js';
import { taxaMensal } from './juros-compostos.js';
import { AVISO_ESTIMATIVA } from './apresentacao.js';

export function validar(e) {
  const erros = reunir({
    valor: numero(e.valor, 'Valor do bem', { min: 1 }),
    entrada: numero(e.entrada ?? 0, 'Entrada', { min: 0 }),
    taxa: numero(e.taxa, 'Taxa de juros', { min: 0, max: 1000 }),
    prazo: numero(e.prazo, 'Prazo em meses', { min: 1, max: 600, inteiro: true }),
  });
  if (!erros.valor && !erros.entrada && e.entrada >= e.valor) {
    erros.entrada = 'A entrada deve ser menor que o valor do bem.';
  }
  if (e.sistema !== 'price' && e.sistema !== 'sac') erros.sistema = 'Escolha Price ou SAC.';
  return erros;
}

export function calcular(e, t) {
  void t;
  const financiado = emCentavos(e.valor) - emCentavos(e.entrada ?? 0);
  const n = e.prazo;
  const i = taxaMensal(e.taxa, e.periodoTaxa);
  const parcelas = [];
  let saldo = financiado;

  if (e.sistema === 'price') {
    const pmt = arredondar(i === 0 ? financiado / n : (financiado * i) / (1 - Math.pow(1 + i, -n)));
    for (let k = 1; k <= n; k++) {
      const juros = arredondar(saldo * i);
      const amort = k === n ? saldo : pmt - juros;
      parcelas.push({ k, parcela: amort + juros, juros, amort, saldo: saldo - amort });
      saldo -= amort;
    }
  } else {
    const base = arredondar(financiado / n);
    for (let k = 1; k <= n; k++) {
      const juros = arredondar(saldo * i);
      const amort = k === n ? saldo : base;
      parcelas.push({ k, parcela: amort + juros, juros, amort, saldo: saldo - amort });
      saldo -= amort;
    }
  }

  const totalPago = parcelas.reduce((s, p) => s + p.parcela, 0);
  const totalJuros = parcelas.reduce((s, p) => s + p.juros, 0);
  return {
    sistema: e.sistema, n, taxaMensal: i, financiado, entrada: emCentavos(e.entrada ?? 0),
    primeira: parcelas[0].parcela, ultima: parcelas[n - 1].parcela, totalPago, totalJuros, parcelas,
  };
}

export function exibir(r) {
  const price = r.sistema === 'price';
  const resumo = price
    ? [{ rotulo: 'Parcela mensal (fixa)', valor: brl(r.primeira), destaque: true }]
    : [
        { rotulo: 'Primeira parcela', valor: brl(r.primeira), destaque: true },
        { rotulo: 'Última parcela', valor: brl(r.ultima) },
      ];
  resumo.push({ rotulo: 'Total pago nas parcelas', valor: brl(r.totalPago) });
  resumo.push({ rotulo: 'Total de juros', valor: brl(r.totalJuros) });

  const passo = Math.max(1, Math.ceil(r.n / 48));
  const idx = [];
  for (let k = passo; k <= r.n; k += passo) idx.push(k - 1);
  if (idx[idx.length - 1] !== r.n - 1) idx.push(r.n - 1);

  return {
    resumo,
    detalhes: [
      { descricao: 'Valor financiado (bem − entrada)', valor: brl(r.financiado) },
      { descricao: 'Taxa mensal equivalente', valor: formatarPercentual(r.taxaMensal, 4) },
      { descricao: 'Sistema de amortização', valor: price ? 'Price (parcelas fixas)' : 'SAC (parcelas decrescentes)' },
      { descricao: 'Custo total (entrada + parcelas)', valor: brl(r.entrada + r.totalPago) },
    ],
    grafico: {
      titulo: 'Saldo devedor ao longo do prazo',
      formatoX: 'mês',
      x: [0, ...idx.map((k) => r.parcelas[k].k)],
      series: [{ nome: 'Saldo devedor', valores: [r.financiado / 100, ...idx.map((k) => r.parcelas[k].saldo / 100)] }],
    },
    tabela: {
      titulo: 'Tabela de amortização',
      arquivo: `financiamento-${r.sistema}.csv`,
      colunas: ['Parcela', 'Valor da parcela', 'Juros', 'Amortização', 'Saldo devedor'],
      linhas: r.parcelas.map((p) => [String(p.k), brl(p.parcela), brl(p.juros), brl(p.amort), brl(p.saldo)]),
    },
    avisos: [
      'Não inclui seguros, tarifas, IOF, correção monetária (TR, IPCA) nem o Custo Efetivo Total (CET) do contrato. O valor real da parcela costuma ser maior.',
      'Taxa anual convertida pela equivalência composta: (1 + taxa anual)^(1/12) − 1.',
      AVISO_ESTIMATIVA,
    ],
    copiar: `Financiamento ${price ? 'Price' : 'SAC'}: ${price ? 'parcela ' + brl(r.primeira) : 'parcelas de ' + brl(r.primeira) + ' a ' + brl(r.ultima)}; juros ${brl(r.totalJuros)}; total ${brl(r.totalPago)} em ${r.n} meses.`,
  };
}
