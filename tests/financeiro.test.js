import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import * as juros from '../assets/js/calc/juros-compostos.js';
import * as fin from '../assets/js/calc/financiamento.js';
import * as apo from '../assets/js/calc/aposentadoria.js';

const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b} (±${tol})`);

test('juros compostos batem com a fórmula fechada', () => {
  const r = juros.calcular({ capital: 1000, aporte: 500, taxa: 1, periodoTaxa: 'mensal', prazo: 12, unidadePrazo: 'meses' }, tabelas);
  perto(r.montanteBruto, 746808, 8); // fechada: 7.468,08 (diferença só de arredondamento mensal)
  assert.equal(r.investido, 700000);
  assert.equal(r.meses.length, 12);
  assert.equal(r.jurosTotal, r.montanteBruto - r.investido);
});

test('taxa anual vira taxa mensal equivalente (não divide por 12)', () => {
  const r = juros.calcular({ capital: 10000, aporte: 0, taxa: 12, periodoTaxa: 'anual', prazo: 10, unidadePrazo: 'anos' }, tabelas);
  perto(r.montanteBruto, 3105848, 30); // 10.000 × 1,12^10
  assert.equal(r.n, 120);
});

test('IR regressivo: faixas pelo tempo corrido (3, 6, 12 e 24 meses)', () => {
  const ir = (prazo) =>
    juros.calcular({ capital: 10000, aporte: 0, taxa: 1, periodoTaxa: 'mensal', prazo, unidadePrazo: 'meses', ir: true }, tabelas);
  const rendimento = (n) => 10000 * (Math.pow(1.01, n) - 1) * 100; // em centavos, fórmula fechada
  // 3 meses = 91 dias -> 22,5%; 6 meses = 183 dias -> 20%; 12 meses = 365 dias -> 17,5%; 24 meses = 730 dias -> 15%
  perto(ir(3).ir, rendimento(3) * 0.225, 2);
  perto(ir(6).ir, rendimento(6) * 0.2, 2);
  perto(ir(12).ir, rendimento(12) * 0.175, 2);
  perto(ir(24).ir, rendimento(24) * 0.15, 2);
  assert.equal(ir(24).ir, 40460); // 2.697,35 × 15%
  assert.equal(ir(24).montante, ir(24).montanteBruto - ir(24).ir);
});

test('IR regressivo com aportes: cada aporte tem a alíquota do seu próprio prazo', () => {
  // 13 meses de aporte de R$ 100 a 1% ao mês. Aporte do mês k rende (n-k) meses; o último não rende.
  const r = juros.calcular({ capital: 0, aporte: 100, taxa: 1, periodoTaxa: 'mensal', prazo: 13, unidadePrazo: 'meses', ir: true }, tabelas);
  let esperado = 0;
  for (let k = 1; k <= 13; k++) {
    const m = 13 - k;
    const dias = Math.round((m * 365) / 12);
    const aliq = dias <= 180 ? 0.225 : dias <= 360 ? 0.2 : dias <= 720 ? 0.175 : 0.15;
    esperado += 10000 * (Math.pow(1.01, m) - 1) * aliq;
  }
  perto(r.ir, esperado, 3);
});

test('juros com taxa zero', () => {
  const r = juros.calcular({ capital: 1000, aporte: 100, taxa: 0, periodoTaxa: 'mensal', prazo: 10, unidadePrazo: 'meses' }, tabelas);
  assert.equal(r.montanteBruto, 200000);
  assert.equal(r.jurosTotal, 0);
});

test('juros: validação', () => {
  assert.ok(juros.validar({ capital: 0, aporte: 0, taxa: 1, prazo: 12 }).capital);
  assert.ok(juros.validar({ capital: 100, taxa: 1, prazo: 0 }).prazo);
  assert.ok(juros.validar({ capital: 100, taxa: 1, prazo: 101, unidadePrazo: 'anos' }).prazo);
  assert.deepEqual(juros.validar({ capital: 100, aporte: 0, taxa: 1, prazo: 12, unidadePrazo: 'meses' }), {});
});

test('financiamento Price: parcela fixa e totais', () => {
  const r = fin.calcular({ valor: 100000, entrada: 0, taxa: 1, periodoTaxa: 'mensal', prazo: 12, sistema: 'price' }, tabelas);
  assert.equal(r.primeira, 888488);
  assert.equal(r.totalPago, 10661853);
  assert.equal(r.totalJuros, 661853);
  assert.equal(r.parcelas.at(-1).saldo, 0);
});

test('financiamento SAC: parcelas decrescentes', () => {
  const r = fin.calcular({ valor: 100000, entrada: 0, taxa: 1, periodoTaxa: 'mensal', prazo: 12, sistema: 'sac' }, tabelas);
  assert.equal(r.primeira, 933333);
  assert.equal(r.ultima, 841670);
  assert.equal(r.totalPago, 10650000);
  assert.equal(r.totalJuros, 650000);
  assert.equal(r.parcelas.at(-1).saldo, 0);
});

test('financiamento longo e com entrada: amortização zera o saldo', () => {
  const r = fin.calcular({ valor: 240000, entrada: 40000, taxa: 0.8, periodoTaxa: 'mensal', prazo: 360, sistema: 'price' }, tabelas);
  assert.equal(r.financiado, 20000000);
  assert.equal(r.primeira, 169632);
  assert.equal(r.totalPago, 61067503);
  assert.equal(r.parcelas.at(-1).saldo, 0);
  assert.equal(r.parcelas.reduce((s, p) => s + p.amort, 0), r.financiado);
});

test('financiamento: validação', () => {
  assert.ok(fin.validar({ valor: 1000, entrada: 1000, taxa: 1, prazo: 12, sistema: 'price' }).entrada);
  assert.ok(fin.validar({ valor: 1000, entrada: 0, taxa: 1, prazo: 12, sistema: 'x' }).sistema);
  assert.ok(fin.validar({ valor: 1000, entrada: 0, taxa: 1, prazo: 601, sistema: 'sac' }).prazo);
});

test('aposentadoria: meta, projeção e aporte necessário', () => {
  const r = apo.calcular({ idadeAtual: 30, idadeAlvo: 60, renda: 5000, patrimonio: 0, aporte: 1000, rentabilidade: 4 }, tabelas);
  perto(r.necessario, 152730526, 5);
  perto(r.projetado, 68527056, 300);
  perto(r.aporteNecessario, 222876, 5);
  assert.equal(r.atinge, false);
  assert.ok(r.mesesAteMeta > r.n);
});

test('aposentadoria: meta atingida quando o aporte basta', () => {
  const r = apo.calcular({ idadeAtual: 30, idadeAlvo: 60, renda: 5000, patrimonio: 0, aporte: 2300, rentabilidade: 4 }, tabelas);
  assert.equal(r.atinge, true);
});

test('aposentadoria: validação', () => {
  assert.ok(apo.validar({ idadeAtual: 40, idadeAlvo: 40, renda: 1, rentabilidade: 4 }).idadeAlvo);
  assert.ok(apo.validar({ idadeAtual: 40, idadeAlvo: 60, renda: 1, rentabilidade: 0 }).rentabilidade);
});
