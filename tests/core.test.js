import test from 'node:test';
import assert from 'node:assert/strict';
import { emCentavos, arredondar, parseNumero, formatarBRL, formatarNumero, mascararMoeda } from '../assets/js/core/moeda.js';
import {
  parseISO, addDias, addMeses, diffDias, mesesEDias, anosCompletos, avosEntre, avos13NoAno, formatarBR, ultimoAniversario,
} from '../assets/js/core/datas.js';

test('emCentavos evita erro de ponto flutuante', () => {
  assert.equal(emCentavos(1.005), 101);
  assert.equal(emCentavos(0.1 + 0.2), 30);
  assert.equal(emCentavos(1234.56), 123456);
  assert.equal(arredondar(20068.499999999996), 20068 + 1 - 0); // meio centavo sobe
});

test('parseNumero entende formatos brasileiros e internacionais', () => {
  assert.equal(parseNumero('1.234,56'), 1234.56);
  assert.equal(parseNumero('R$ 3.000,00'), 3000);
  assert.equal(parseNumero('3000'), 3000);
  assert.equal(parseNumero('1234.56'), 1234.56);
  assert.equal(parseNumero('1.500'), 1500);
  assert.equal(parseNumero('0,9'), 0.9);
  assert.ok(Number.isNaN(parseNumero('abc')));
  assert.ok(Number.isNaN(parseNumero('')));
});

test('formatarBRL usa padrão brasileiro', () => {
  assert.equal(formatarBRL(123456).replace(/ /g, ' '), 'R$ 1.234,56');
  assert.equal(formatarNumero(1234.5, 2), '1.234,50');
});

test('mascararMoeda: só dígitos entram, formato aplicado em tempo real', () => {
  assert.equal(mascararMoeda('5'), '0,05');
  assert.equal(mascararMoeda('5000'), '50,00');
  assert.equal(mascararMoeda('5.000,00'), '5.000,00');
  // Ponto, vírgula e ponto e vírgula digitados são descartados (separador vem da máscara).
  assert.equal(mascararMoeda('5.000;00'), '5.000,00');
  assert.equal(mascararMoeda('15.000.00'), '15.000,00');
  assert.equal(mascararMoeda('1a2b3c'), '1,23');
  assert.equal(mascararMoeda(''), '');
  assert.equal(mascararMoeda('abc'), '');
});

test('datas: validação, soma e diferença', () => {
  assert.equal(parseISO('2026-02-30'), null);
  assert.deepEqual(parseISO('2024-02-29'), { a: 2024, m: 2, d: 29 });
  assert.equal(addDias('2026-09-15', 42), '2026-10-27');
  assert.equal(addDias('2026-03-01', -2), '2026-02-27');
  assert.equal(addMeses('2026-01-31', 1), '2026-02-28');
  assert.equal(diffDias('2026-01-01', '2026-12-31'), 364);
  assert.equal(formatarBR('2026-09-05'), '05/09/2026');
});

test('datas: avos e anos de serviço', () => {
  assert.equal(anosCompletos('2022-03-01', '2026-09-15'), 4);
  assert.equal(anosCompletos('2022-03-01', '2026-02-28'), 3);
  assert.equal(ultimoAniversario('2022-03-01', '2026-09-15'), '2026-03-01');
  assert.deepEqual(mesesEDias('2026-03-01', '2026-10-27'), { meses: 7, dias: 27 });
  assert.equal(avosEntre('2026-03-01', '2026-10-27'), 8);
  assert.equal(avosEntre('2026-03-01', '2026-09-14'), 6); // 14 dias não contam
  assert.equal(avosEntre('2026-03-01', '2026-09-15'), 7); // 15 dias contam
  assert.equal(avosEntre('2026-03-10', '2026-09-09'), 6);
  assert.equal(avos13NoAno('2022-03-01', '2026-10-27', 2026), 10);
  assert.equal(avos13NoAno('2026-03-20', '2026-12-31', 2026), 9); // março tem 12 dias: não conta
  assert.equal(avos13NoAno('2026-03-17', '2026-12-31', 2026), 10); // 15 dias: conta
});
