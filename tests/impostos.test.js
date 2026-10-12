import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { calcularINSS, calcularIRRF } from '../assets/js/calc/impostos.js';

// Valores de referência: implementação independente em Decimal (Python), arredondamento meio-para-cima.
test('INSS progressivo por faixa', () => {
  assert.equal(calcularINSS(150000, tabelas), 11250); // 1.500,00 -> 112,50
  assert.equal(calcularINSS(162100, tabelas), 12158); // 1.621,00 -> 121,575 -> 121,58
  assert.equal(calcularINSS(250000, tabelas), 20069); // 2.500,00 -> 200,685 -> 200,69
  assert.equal(calcularINSS(300000, tabelas), 24860);
  assert.equal(calcularINSS(400000, tabelas), 36860);
  assert.equal(calcularINSS(600000, tabelas), 64151);
});

test('INSS limitado ao teto', () => {
  assert.equal(calcularINSS(1000000, tabelas), 98809);
  assert.equal(calcularINSS(5000000, tabelas), 98809);
  assert.equal(calcularINSS(0, tabelas), 0);
});

const ir = (rend, dep = 0) => {
  const inss = calcularINSS(rend, tabelas);
  return calcularIRRF({ rendimento: rend, inss, dependentes: dep }, tabelas);
};

test('IRRF: isenção até R$ 5.000 (desconto simplificado + redução)', () => {
  assert.equal(ir(300000).imposto, 0);
  assert.equal(ir(500000).imposto, 0);
  assert.equal(ir(500000).usouSimplificado, true);
});

test('IRRF: faixa de transição com redução parcial', () => {
  const r = ir(600000);
  assert.equal(r.usouSimplificado, false); // INSS (641,51) > simplificado (607,20)
  assert.equal(r.impostoTabela, 56485);
  assert.equal(r.reducao, 17975);
  assert.equal(r.imposto, 38510);
  assert.equal(ir(700000).imposto, 75474);
  assert.equal(ir(600000, 2).imposto, 28083);
});

test('IRRF: acima de R$ 7.350 não há redução', () => {
  const r = ir(900000);
  assert.equal(r.reducao, 0);
  assert.equal(r.imposto, 129455);
  assert.equal(ir(900000, 2).imposto, 119027);
});
