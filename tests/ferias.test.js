import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { calcular, validar } from '../assets/js/calc/ferias.js';

test('férias de 30 dias, R$ 3.000 (INSS sem o 1/3, que é isento)', () => {
  const r = calcular({ salario: 3000, dias: 30, inicio: '2026-11-10' }, tabelas);
  assert.equal(r.ferias, 300000);
  assert.equal(r.terco, 100000);
  assert.equal(r.baseInss, 300000); // férias; o 1/3 não compõe a base (Lei 8.212/91, art. 28, §9º, IV)
  assert.equal(r.baseIrrf, 400000); // férias + 1/3
  assert.equal(r.inss, 24860);
  assert.equal(r.irrf.imposto, 0);
  assert.equal(r.liquido, 375140);
  assert.equal(r.pagarAte, '2026-11-08');
});

test('férias com abono: INSS sobre férias + abono; IRRF sobre tudo (com 1/3)', () => {
  const r = calcular({ salario: 6000, dias: 20, abono: true }, tabelas);
  assert.equal(r.ferias, 400000);
  assert.equal(r.terco, 133333);
  assert.equal(r.abono, 200000);
  assert.equal(r.abonoTerco, 66667);
  assert.equal(r.baseInss, 600000); // férias + abono, sem os terços constitucionais
  assert.equal(r.baseIrrf, 800000); // férias + abono + 1/3 + 1/3 do abono
  assert.equal(r.inss, 64151);
  // Base 7.358,49 × 27,5% − 908,73 = 1.114,85 (rendimento acima de R$ 7.350 não tem redução)
  assert.equal(r.irrf.imposto, 111485);
  assert.equal(r.liquido, 624364);
});

test('férias com dependente e salário alto', () => {
  const r = calcular({ salario: 8000, dias: 30, dependentes: 1 }, tabelas);
  assert.equal(r.baseInss, 800000); // sem o 1/3, a base fica abaixo do teto de 2026 (R$ 8.475,55)
  assert.equal(r.inss, 92151); // INSS progressivo cheio sobre R$ 8.000,00
  assert.equal(r.irrf.imposto, 171905); // base 9.555,57 × 27,5% − 908,73
  assert.equal(r.liquido, 802611);
});

test('férias: validação', () => {
  assert.ok(validar({ salario: 3000, dias: 4 }).dias);
  assert.ok(validar({ salario: 3000, dias: 31 }).dias);
  assert.ok(validar({ salario: 3000, dias: 30, abono: true }).dias);
  assert.deepEqual(validar({ salario: 3000, dias: 20, abono: true }), {});
  assert.ok(validar({ salario: 3000, dias: 30, inicio: '2026-13-40' }).inicio);
});
