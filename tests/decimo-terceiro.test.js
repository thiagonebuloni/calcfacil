import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { calcular, validar, exibir } from '../assets/js/calc/decimo-terceiro.js';

test('13º integral de R$ 3.000', () => {
  const r = calcular({ salario: 3000, meses: 12, dependentes: 0 }, tabelas);
  assert.equal(r.bruto, 300000);
  assert.equal(r.inss, 24860);
  assert.equal(r.irrf.imposto, 0);
  assert.equal(r.liquido, 275140);
  assert.equal(r.primeira, 150000);
  assert.equal(r.segunda, 125140);
});

test('13º integral de R$ 6.000 (com IRRF após redução)', () => {
  const r = calcular({ salario: 6000, meses: 12 }, tabelas);
  assert.equal(r.inss, 64151);
  assert.equal(r.irrf.imposto, 38510);
  assert.equal(r.liquido, 497339);
  assert.equal(r.segunda, 197339);
});

test('13º proporcional 7/12', () => {
  const r = calcular({ salario: 3000, meses: 7 }, tabelas);
  assert.equal(r.bruto, 175000);
  assert.equal(r.inss, 13319);
  assert.equal(r.liquido, 161681);
});

test('13º inclui média de variáveis', () => {
  const r = calcular({ salario: 3000, media: 600, meses: 12 }, tabelas);
  assert.equal(r.bruto, 360000);
});

test('13º valida entradas', () => {
  assert.ok(validar({ salario: 0, meses: 12 }).salario);
  assert.ok(validar({ salario: 3000, meses: 13 }).meses);
  assert.ok(validar({ salario: 3000, meses: 5.5 }).meses);
  assert.deepEqual(validar({ salario: 3000, meses: 12, dependentes: 0 }), {});
  assert.ok(validar({ salario: NaN, meses: 12 }).salario);
});

test('13º: a apresentação fecha com o cálculo', () => {
  const v = exibir(calcular({ salario: 3000, meses: 12 }, tabelas));
  assert.equal(v.holerite.proventos.length, 1);
  assert.match(v.holerite.liquido.replace(/ /g, ' '), /R\$ 2\.751,40/);
});
