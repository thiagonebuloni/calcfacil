import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { calcular, validar } from '../assets/js/calc/rescisao.js';

const base = { salario: 3000, admissao: '2022-03-01', demissao: '2026-09-15', tipo: 'sem_justa_causa', aviso: 'indenizado', saldoFgts: 10000 };

test('sem justa causa, aviso indenizado (caso de referência)', () => {
  const r = calcular(base, tabelas);
  assert.equal(r.diasSaldo, 15);
  assert.equal(r.saldoSalario, 150000);
  assert.equal(r.diasAviso, 42); // 30 + 3 × 4 anos
  assert.equal(r.avisoPago, 420000);
  assert.equal(r.fimProjetado, '2026-10-27');
  assert.equal(r.avos13, 10);
  assert.equal(r.decimoTerceiro, 250000);
  assert.equal(r.avosFerias, 8);
  assert.equal(r.feriasProp, 200000);
  assert.equal(r.tercoProp, 66667);
  assert.equal(r.totalProventos, 1086667);
  assert.equal(r.inssSaldo, 11250);
  assert.equal(r.inss13, 20069);
  assert.equal(r.totalDescontos, 31319);
  assert.equal(r.liquido, 1055348);
  assert.equal(r.fgts.deposito, 65600);
  assert.equal(r.fgts.multa, 426240);
  assert.equal(r.fgts.saque, 1491840);
  assert.equal(r.pagarAte, '2026-09-25');
});

test('aviso trabalhado não paga aviso nem projeta o contrato', () => {
  const r = calcular({ ...base, aviso: 'trabalhado' }, tabelas);
  assert.equal(r.avisoPago, 0);
  assert.equal(r.fimProjetado, '2026-09-15');
  assert.equal(r.avos13, 9);
  assert.equal(r.avosFerias, 7);
});

test('justa causa: sem 13º e férias proporcionais, sem multa, mantém férias vencidas', () => {
  const r = calcular({ ...base, tipo: 'justa_causa', feriasVencidas: true }, tabelas);
  assert.equal(r.avisoPago, 0);
  assert.equal(r.decimoTerceiro, 0);
  assert.equal(r.feriasProp, 0);
  assert.equal(r.feriasVenc, 300000);
  assert.equal(r.tercoVenc, 100000);
  assert.equal(r.fgts.multa, 0);
});

test('pedido de demissão com aviso indenizado desconta 30 dias; sem multa', () => {
  const r = calcular({ ...base, tipo: 'pedido_demissao' }, tabelas);
  assert.equal(r.descontoAviso, 300000);
  assert.equal(r.avisoPago, 0);
  assert.equal(r.fgts.multa, 0);
  assert.equal(r.avos13, 9); // sem projeção
  const dispensado = calcular({ ...base, tipo: 'pedido_demissao', aviso: 'dispensado' }, tabelas);
  assert.equal(dispensado.descontoAviso, 0);
});

test('acordo: metade do aviso, multa de 20% e saque de 80%', () => {
  const r = calcular(base, tabelas);
  const a = calcular({ ...base, tipo: 'acordo' }, tabelas);
  assert.equal(a.avisoPago, r.avisoPago / 2);
  assert.equal(a.fgts.multa, Math.round((10000_00 + a.fgts.deposito) * 0.2));
  assert.equal(a.fgts.saque, Math.round((10000_00 + a.fgts.deposito + a.fgts.multa) * 0.8));
});

test('aviso proporcional é limitado a 90 dias', () => {
  const r = calcular({ ...base, admissao: '1990-01-01' }, tabelas);
  assert.equal(r.diasAviso, 90);
});

test('saldo de salário: demissão no último dia do mês paga 30/30', () => {
  assert.equal(calcular({ ...base, demissao: '2026-09-30' }, tabelas).diasSaldo, 30);
  assert.equal(calcular({ ...base, demissao: '2026-02-28' }, tabelas).diasSaldo, 30);
  assert.equal(calcular({ ...base, demissao: '2026-10-31' }, tabelas).diasSaldo, 30);
});

test('admissão e demissão no mesmo mês', () => {
  const r = calcular({ ...base, admissao: '2026-09-01', demissao: '2026-09-20', aviso: 'trabalhado' }, tabelas);
  assert.equal(r.diasSaldo, 20);
  assert.equal(r.avos13, 1);
  assert.equal(r.anos, 0);
  assert.equal(r.diasAviso, 30);
});

test('aviso projetado que atravessa o ano soma 13º do ano seguinte', () => {
  const r = calcular({ ...base, demissao: '2026-12-20' }, tabelas); // +42 dias => 31/01/2027
  assert.equal(r.fimProjetado, '2027-01-31');
  assert.equal(r.avos13, 12 + 1);
});

test('validação da rescisão', () => {
  assert.deepEqual(validar(base), {});
  assert.ok(validar({ ...base, demissao: '2021-01-01' }).demissao);
  assert.ok(validar({ ...base, tipo: 'x' }).tipo);
  assert.ok(validar({ ...base, aviso: 'dispensado' }).aviso);
  assert.ok(validar({ ...base, admissao: '' }).admissao);
});
