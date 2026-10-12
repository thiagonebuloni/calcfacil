// Casos verificados por conta independente (LC 123/2006, anexos; valores DAS-MEI 2026 do PGMEI).
import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { calcular, validar, exibir, calcularDAS, aplicarFatorR, calcularProLabore, simularLucros, dasMeiMensal } from '../assets/js/calc/me.js';

const base = {
  segmento: 'servicos',
  receitaMensal: 40000,
  rbt12: 420000,
  folha12: 0,
  tipoMei: 'servicos',
  prolabore: 5000,
  modalidade: 'empresa',
  dependentes: 0,
  distribuicao: 10000,
  escrituracao: false,
};

test('ME servicos: DAS faixa 3 do Anexo III', () => {
  const r = calcular(base, tabelas);
  assert.equal(r.anexo, 'III');
  // Efetiva = (420.000 x 13,5% - 17.640) / 420.000 = 9,3%; DAS = 40.000 x 9,3%.
  assert.equal(r.das.faixa, 3);
  assert.equal(r.das.efetiva, 0.093);
  assert.equal(r.das.das, 372000);
});

test('ME comercio faixa 1: 4% sobre a receita do mes', () => {
  const r = calcular({ ...base, segmento: 'comercio', receitaMensal: 15000, rbt12: 150000 }, tabelas);
  assert.equal(r.anexo, 'I');
  assert.equal(r.das.faixa, 1);
  assert.equal(r.das.das, 60000);
});

test('Fator R: 28% exatos vao ao Anexo III, abaixo ao V', () => {
  assert.equal(aplicarFatorR({ folha12: 112000, rbt12: 400000 }, tabelas).anexo, 'III');
  assert.equal(aplicarFatorR({ folha12: 111999, rbt12: 400000 }, tabelas).anexo, 'V');
  const r = calcular({ ...base, segmento: 'intelectual', folha12: 120000, rbt12: 400000 }, tabelas);
  assert.equal(r.anexo, 'III');
  assert.equal(r.fatorR.razao, 0.3);
});

test('Fator R baixo cai no Anexo V (15,5% na faixa 1)', () => {
  const r = calcular({ ...base, segmento: 'intelectual', receitaMensal: 10000, rbt12: 100000, folha12: 10000 }, tabelas);
  assert.equal(r.anexo, 'V');
  assert.equal(r.das.das, 155000);
});

test('pro-labore 5.000 retido: INSS 550 e IRRF zerado pela reducao', () => {
  const p = calcularProLabore({ valor: 500000, modalidade: 'empresa', dependentes: 0 }, tabelas);
  assert.equal(p.inss, 55000);
  assert.equal(p.irrf.imposto, 0);
  assert.equal(p.liquido, 445000);
});

test('pro-labore 5.000 no carne: INSS 1.000 e liquido 4.000', () => {
  const p = calcularProLabore({ valor: 500000, modalidade: 'carne', dependentes: 0 }, tabelas);
  assert.equal(p.inss, 100000);
  assert.equal(p.irrf.imposto, 0);
  assert.equal(p.liquido, 400000);
});

test('pro-labore no teto: INSS limitado (11% e 20%)', () => {
  const emp = calcularProLabore({ valor: 2000000, modalidade: 'empresa', dependentes: 0 }, tabelas);
  assert.equal(emp.inss, 93231);
  const carne = calcularProLabore({ valor: 2000000, modalidade: 'carne', dependentes: 0 }, tabelas);
  assert.equal(carne.inss, 169511);
});

test('MEI-ME: dentro do teto, ate 20% e acima de 20%', () => {
  assert.equal(calcular({ ...base, rbt12: 80000 }, tabelas).statusMei, 'dentro');
  const ate20 = calcular({ ...base, rbt12: 90000 }, tabelas);
  assert.equal(ate20.statusMei, 'ate20');
  assert.equal(ate20.excessoMei, 900000);
  assert.ok(ate20.complementar > 0);
  assert.equal(calcular({ ...base, rbt12: 97201 }, tabelas).statusMei, 'acima');
});

test('DAS-MEI 2026 por tipo de atividade', () => {
  assert.equal(dasMeiMensal('comercio', tabelas), 8205);
  assert.equal(dasMeiMensal('servicos', tabelas), 8605);
  assert.equal(dasMeiMensal('ambos', tabelas), 8705);
});

test('lucros: isentos ate o limite; 10% do excedente sem escrituracao', () => {
  const isento = simularLucros({ distribuicao: 5000000, escrituracao: false }, tabelas);
  assert.equal(isento.retencao, 0);
  assert.equal(isento.liquido, 5000000);
  const retido = simularLucros({ distribuicao: 6000000, escrituracao: false }, tabelas);
  assert.equal(retido.baseRetencao, 1000000);
  assert.equal(retido.retencao, 100000);
  assert.equal(retido.liquido, 5900000);
  const escriturado = simularLucros({ distribuicao: 6000000, escrituracao: true }, tabelas);
  assert.equal(escriturado.retencao, 0);
  assert.equal(escriturado.alertaMinimo, true); // 60 mil x 12 = 720 mil, acima do limite anual
});

test('lucros altos disparam o alerta do imposto minimo anual', () => {
  const r = simularLucros({ distribuicao: 6000000, escrituracao: true }, tabelas);
  assert.equal(r.alertaMinimo, true);
});

test('sublimite: RBT12 acima de 3,6 mi gera aviso', () => {
  const r = calcular({ ...base, rbt12: 3700000, receitaMensal: 300000 }, tabelas);
  assert.ok(r.avisos.some((a) => a.includes('sublimite')));
  assert.equal(r.das.faixa, 6);
});

test('Anexo IV avisa que a CPP fica fora do DAS', () => {
  const r = calcular({ ...base, segmento: 'construcao', rbt12: 200000, receitaMensal: 20000 }, tabelas);
  assert.equal(r.anexo, 'IV');
  assert.equal(r.cppNoDas, false);
  assert.ok(r.avisos.some((a) => a.includes('CPP')));
});

test('ME valida entradas', () => {
  assert.ok(validar({}).segmento);
  assert.ok(validar({ ...base, receitaMensal: 0 }).receitaMensal);
  assert.deepEqual(validar(base), {});
});

test('ME: apresentacao com resumo, detalhes e avisos', () => {
  const v = exibir(calcular(base, tabelas));
  assert.equal(v.resumo[0].valor.replace(/\s/g, ' '), 'R$ 3.720,00');
  assert.ok(v.detalhes.length >= 10);
  assert.ok(v.avisos.length >= 1);
  assert.match(v.copiar, /Anexo III/);
});
