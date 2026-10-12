// Juros compostos com aportes mensais (feitos no fim de cada mês).
// M = C·(1+i)^n + PMT·((1+i)^n − 1)/i

import { arredondar, emCentavos, formatarBRL as brl, formatarPercentual } from '../core/moeda.js';
import { numero, reunir } from '../core/validacao.js';
import { AVISO_ESTIMATIVA } from './apresentacao.js';

export function taxaMensal(taxaPercentual, periodo) {
  const i = taxaPercentual / 100;
  return periodo === 'anual' ? Math.pow(1 + i, 1 / 12) - 1 : i;
}

export function validar(e) {
  const erros = reunir({
    capital: numero(e.capital ?? 0, 'Capital inicial', { min: 0 }),
    aporte: numero(e.aporte ?? 0, 'Aporte mensal', { min: 0 }),
    taxa: numero(e.taxa, 'Taxa de juros', { min: 0, max: 1000 }),
    prazo: numero(e.prazo, 'Prazo', { min: 1, inteiro: true }),
  });
  if (!erros.prazo) {
    const meses = e.unidadePrazo === 'anos' ? e.prazo * 12 : e.prazo;
    if (meses > 1200) erros.prazo = 'O prazo máximo é de 100 anos (1.200 meses).';
  }
  if (!erros.capital && !erros.aporte && (e.capital ?? 0) + (e.aporte ?? 0) <= 0) {
    erros.capital = 'Informe um capital inicial ou um aporte mensal maior que zero.';
  }
  return erros;
}

function aliquotaIR(dias, faixas) {
  for (const f of faixas) if (f.ateDias === null || dias <= f.ateDias) return f.aliquota;
  return faixas[faixas.length - 1].aliquota;
}

export function calcular(e, t) {
  const n = e.unidadePrazo === 'anos' ? e.prazo * 12 : e.prazo;
  const i = taxaMensal(e.taxa, e.periodoTaxa);
  const capital = emCentavos(e.capital ?? 0);
  const aporte = emCentavos(e.aporte ?? 0);

  let saldo = capital, investido = capital, jurosAcum = 0;
  const meses = [];
  for (let m = 1; m <= n; m++) {
    const juros = arredondar(saldo * i);
    saldo += juros + aporte;
    investido += aporte;
    jurosAcum += juros;
    meses.push({ mes: m, investido, juros, jurosAcum, saldo });
  }

  // IR regressivo (renda fixa): cada aporte tem sua própria idade; 1 mês = 365/12 dias
  // (assim 6 meses ≈ 183 dias, 12 meses = 365 dias e 24 meses = 730 dias, como no calendário).
  const dias = (meses) => Math.round((meses * 365) / 12);
  let ir = 0;
  if (e.ir) {
    const faixas = t.irRegressivo.faixas;
    let soma = capital * (Math.pow(1 + i, n) - 1) * aliquotaIR(dias(n), faixas);
    for (let k = 1; k <= n; k++) {
      soma += aporte * (Math.pow(1 + i, n - k) - 1) * aliquotaIR(dias(n - k), faixas);
    }
    ir = arredondar(soma);
  }

  return {
    n, taxaMensal: i, capital, aporte, investido, montanteBruto: saldo, jurosTotal: saldo - investido,
    ir, montante: saldo - ir, meses, comIR: !!e.ir,
  };
}

function amostrar(meses, passo) {
  const idx = [];
  for (let k = passo; k <= meses.length; k += passo) idx.push(k - 1);
  if (idx[idx.length - 1] !== meses.length - 1) idx.push(meses.length - 1);
  return idx;
}

export function exibir(r) {
  const passo = Math.max(1, Math.ceil(r.n / 48));
  const idx = amostrar(r.meses, passo);
  const inicio = { mes: 0, investido: r.capital, saldo: r.capital };
  const resumo = [
    { rotulo: r.comIR ? 'Montante líquido (após IR)' : 'Montante final', valor: brl(r.montante), destaque: true },
    { rotulo: 'Total investido', valor: brl(r.investido) },
    { rotulo: 'Total em juros', valor: brl(r.jurosTotal) },
  ];
  const detalhes = [
    { descricao: 'Taxa mensal equivalente', valor: formatarPercentual(r.taxaMensal, 4) },
    { descricao: 'Prazo', valor: `${r.n} meses` },
  ];
  if (r.comIR) {
    detalhes.push({ descricao: 'Montante bruto (antes do IR)', valor: brl(r.montanteBruto) });
    detalhes.push({ descricao: 'IR regressivo estimado', valor: '− ' + brl(r.ir) });
  }
  return {
    resumo,
    detalhes,
    grafico: {
      titulo: 'Evolução do patrimônio',
      formatoX: 'mês',
      x: [inicio.mes, ...idx.map((k) => r.meses[k].mes)],
      series: [
        { nome: 'Saldo com juros', valores: [inicio.saldo / 100, ...idx.map((k) => r.meses[k].saldo / 100)] },
        { nome: 'Total investido', valores: [inicio.investido / 100, ...idx.map((k) => r.meses[k].investido / 100)] },
      ],
    },
    tabela: {
      titulo: 'Evolução mês a mês',
      arquivo: 'juros-compostos.csv',
      colunas: ['Mês', 'Total investido', 'Juros do mês', 'Juros acumulados', 'Saldo'],
      linhas: r.meses.map((m) => [String(m.mes), brl(m.investido), brl(m.juros), brl(m.jurosAcum), brl(m.saldo)]),
    },
    avisos: [
      'Aportes considerados no fim de cada mês. Rentabilidade futura não é garantida e o cálculo não desconta inflação.',
      ...(r.comIR ? ['O IR regressivo considera o prazo de cada aporte em dias corridos (1 mês ≈ 30,4 dias) e vale para renda fixa; fundos, CDB e Tesouro podem ter outras regras (como o come-cotas).'] : []),
      AVISO_ESTIMATIVA,
    ],
    copiar: `Juros compostos: investido ${brl(r.investido)}; juros ${brl(r.jurosTotal)}; montante ${brl(r.montante)} em ${r.n} meses.`,
  };
}
