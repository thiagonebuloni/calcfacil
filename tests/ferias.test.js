import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { calcular, validar } from '../assets/js/calc/ferias.js';

test('férias de 30 dias, R$ 3.000', () => {
  const r = calcular({ salario: 3000, dias: 30, inicio: '2026-11-10' }, tabelas);
  assert.equal(r.ferias, 300000);
  assert.equal(r.terco, 100000);
  assert.equal(r.inss, 36860);
  assert.equal(r.irrf.imposto, 0);
  assert.equal(r.liquido, 363140);
  assert.equal(r.pagarAte, '2026-11-08');
});

test('férias com abono pecuniário: abono e seu 1/3 não sofrem desconto', () => {
  const r = calcular({ salario: 6000, dias: 20, abono: true }, tabelas);
  assert.equal(r.ferias, 400000);
  assert.equal(r.terco, 133333);
  assert.equal(r.abono, 200000);
  assert.equal(r.abonoTerco, 66667);
  assert.equal(r.inss, 54818);
  assert.equal(r.irrf.imposto, 12245);
  assert.equal(r.liquido, 732937);
});

test('férias com dependente e salário alto', () => {
  const r = calcular({ salario: 8000, dias: 30, dependentes: 1 }, tabelas);
  assert.equal(r.inss, 98809);
  assert.equal(r.irrf.imposto, 170074);
  assert.equal(r.liquido, 797784);
});

test('férias: validação', () => {
  assert.ok(validar({ salario: 3000, dias: 4 }).dias);
  assert.ok(validar({ salario: 3000, dias: 31 }).dias);
  assert.ok(validar({ salario: 3000, dias: 30, abono: true }).dias);
  assert.deepEqual(validar({ salario: 3000, dias: 20, abono: true }), {});
  assert.ok(validar({ salario: 3000, dias: 30, inicio: '2026-13-40' }).inicio);
});
