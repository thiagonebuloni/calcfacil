import test from 'node:test';
import assert from 'node:assert/strict';
import * as imp from '../assets/js/calc/importacao.js';

const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b} (±${tol})`);

const entradaPadrao = {
  precoProduto: 200,
  frete: 30,
  seguro: 0,
  cotacaoDolar: 5,
  icms: 17,
  remessaConforme: true,
};

test('cenario A: Remessa Conforme até US$ 50 — II isento, só ICMS', () => {
  const r = imp.calcular(entradaPadrao, {});
  // Valor aduaneiro R$ 230,00 = US$ 46,00 -> dentro do limite
  perto(r.valorDolar, 46, 0.001);
  assert.equal(r.cenario, 'A');
  assert.equal(r.ii, 0);
  assert.equal(r.icms, 3910); // 230,00 × 17% = 39,10
  assert.equal(r.total, 26910); // 230,00 + 39,10
});

test('limite exato de US$ 50 continua no cenario A', () => {
  const r = imp.calcular({ ...entradaPadrao, precoProduto: 250, frete: 0 }, {});
  perto(r.valorDolar, 50, 0.001);
  assert.equal(r.cenario, 'A');
  assert.equal(r.ii, 0);
  assert.equal(r.icms, 4250); // 250,00 × 17%
});

test('cenario B: acima de US$ 50 — II de 20% e ICMS por dentro', () => {
  const r = imp.calcular(
    { precoProduto: 600, frete: 50, seguro: 0, cotacaoDolar: 5, icms: 17, remessaConforme: true },
    {}
  );
  perto(r.valorDolar, 130, 0.001);
  assert.equal(r.cenario, 'B');
  assert.equal(r.ii, 13000); // 650,00 × 20%
  perto(r.baseIcms, 93976, 1); // (650 + 130) / 0,83 = 939,759...
  assert.equal(r.icms, 15976); // 939,76 × 17%
  assert.equal(r.total, 93976); // 650 + 130 + 159,76
});

test('cenario B com seguro incluso no valor aduaneiro', () => {
  const r = imp.calcular(
    { precoProduto: 600, frete: 50, seguro: 50, cotacaoDolar: 5, icms: 17, remessaConforme: true },
    {}
  );
  assert.equal(r.valorAduaneiro, 70000); // 700,00 = US$ 140
  assert.equal(r.ii, 14000);
  perto(r.baseIcms, 101205, 1); // (700 + 140) / 0,83
  assert.equal(r.icms, 17205); // 1012,05 × 17%
  assert.equal(r.total, 101205);
});

test('cenario C: fora do Remessa Conforme — II de 60%, ICMS e despacho', () => {
  const r = imp.calcular(
    {
      precoProduto: 1000,
      frete: 100,
      seguro: 50,
      cotacaoDolar: 5,
      icms: 17,
      remessaConforme: false,
      despachoPostal: true,
    },
    {}
  );
  assert.equal(r.cenario, 'C');
  assert.equal(r.valorAduaneiro, 115000);
  assert.equal(r.ii, 69000); // 1150,00 × 60%
  assert.equal(r.icms, 31280); // (1150 + 690) × 17%
  assert.equal(r.despacho, 1500);
  assert.equal(r.total, 216780); // 1150 + 690 + 312,80 + 15
});

test('cenario C sem despacho postal', () => {
  const r = imp.calcular(
    { precoProduto: 1000, frete: 0, seguro: 0, cotacaoDolar: 5, icms: 17, remessaConforme: false },
    {}
  );
  assert.equal(r.despacho, 0);
  assert.equal(r.total, 187200); // 1000 + 600 + 272 (ICMS de 17% sobre 1600)
});

test('aliquota de ICMS informada pelo usuario', () => {
  const r = imp.calcular({ ...entradaPadrao, icms: 18 }, {});
  assert.equal(r.icms, 4140); // 230,00 × 18%
  perto(r.total, 27140, 0.5); // 230 + 41,40
});

test('exposicao do resultado (exibir)', () => {
  const calculado = imp.calcular(entradaPadrao, {});
  const exibicao = imp.exibir(calculado);
  const brl = (v) => v.replace(/[\u00a0\u202f]/g, ' '); // Intl usa espaco nao separavel em "R$ 269,10"
  assert.ok(exibicao.resumo.some((l) => brl(l.valor) === 'R$ 269,10'));
  assert.ok(exibicao.resumo.some((l) => l.destaque && brl(l.valor) === 'R$ 269,10'));
  assert.ok(exibicao.detalhes.some((d) => d.valor.includes('US$ 46.00')));
  assert.ok(exibicao.avisos.length > 0);
  assert.ok(typeof exibicao.copiar === 'string' && exibicao.copiar.length > 0);
});

test('validacao de entradas invalidas', () => {
  assert.ok(imp.validar({ precoProduto: -10, cotacaoDolar: 5 }).precoProduto);
  assert.ok(imp.validar({ precoProduto: 100, cotacaoDolar: 0 }).cotacaoDolar);
  assert.ok(imp.validar({ precoProduto: 100, cotacaoDolar: 5, icms: 101 }).icms);
  assert.deepEqual(imp.validar(entradaPadrao), {});
  // campos opcionais em branco nao invalidam
  assert.deepEqual(
    imp.validar({ ...entradaPadrao, frete: NaN, seguro: NaN }),
    {}
  );
});
