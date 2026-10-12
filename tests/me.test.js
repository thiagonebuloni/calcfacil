// Casos verificados por conta independente (LC 123/2006, anexos; valores DAS-MEI 2026 do PGMEI).
import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { calcular, validar, exibir, calcularDAS, aplicarFatorR, calcularProLabore, simularLucros, dasMeiMensal, sugerirDivisao } from '../assets/js/calc/me.js';

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
  const r = calcular({ ...base, segmento: 'intelectual', folha12: 120000, rbt12: 400000, prolabore: 0 }, tabelas);
  assert.equal(r.anexo, 'III');
  assert.equal(r.fatorR.razao, 0.3);
});

test('Fator R conta o pro-labore do socio na folha', () => {
  // Folha de funcionarios 100.000 + pro-labore de 1.000 x 12 = 112.000 -> exatamente 28% de 400.000.
  const r = calcular({ ...base, segmento: 'intelectual', folha12: 100000, prolabore: 1000, rbt12: 400000 }, tabelas);
  assert.equal(r.fatorR.folha, 11200000); // R$ 112.000 em centavos
  assert.equal(r.fatorR.razao, 0.28);
  assert.equal(r.anexo, 'III');
  // Um centavo menos de pro-labore derruba para o Anexo V.
  const v = calcular({ ...base, segmento: 'intelectual', folha12: 100000, prolabore: 999.99, rbt12: 400000 }, tabelas);
  assert.equal(v.anexo, 'V');
});

test('Pro-labore informado muda o DAS pelo Fator R', () => {
  const comum = { segmento: 'intelectual', receitaMensal: 10000, rbt12: 100000, folha12: 0 };
  // Sem pro-labore a folha e zero: Anexo V, 15,5%.
  const baixo = calcular({ ...comum, prolabore: 0 }, tabelas);
  assert.equal(baixo.anexo, 'V');
  assert.equal(baixo.das.das, 155000);
  // Com pro-labore de 2.500 x 12 = 30.000 (30% de 100.000): Anexo III, 6%.
  const alto = calcular({ ...comum, prolabore: 2500 }, tabelas);
  assert.equal(alto.anexo, 'III');
  assert.equal(alto.das.das, 60000);
  assert.ok(alto.das.das < baixo.das.das);
});

test('Fator R baixo cai no Anexo V (15,5% na faixa 1)', () => {
  const r = calcular({ ...base, segmento: 'intelectual', receitaMensal: 10000, rbt12: 100000, folha12: 10000, prolabore: 0 }, tabelas);
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
  // O destaque agora e o total sugerido no bolso, nao o DAS.
  assert.equal(v.resumo[0].rotulo, 'Total sugerido no seu bolso');
  assert.equal(v.resumo[0].destaque, true);
  assert.ok(v.detalhes.some((d) => d.descricao.includes('SUGESTAO - total no seu bolso')));
  assert.ok(v.detalhes.some((d) => d.descricao.includes('Caixa do mes')));
  assert.ok(v.avisos.length >= 1);
  assert.match(v.copiar, /Anexo III/);
  assert.match(v.copiar, /Sugestao/);
});

test('Sugestao de divisao: cenario de 7.000 por mes no intelectual', () => {
  // Cenario do anexo: 12 meses de 7.000 -> RBT12 84.000.
  const c = { segmento: 'intelectual', receitaMensal: 700000, rbt12: 8400000, folha12: 0, modalidade: 'empresa', dependentes: 0 };
  const s = sugerirDivisao(c, tabelas);
  assert.equal(s.comparavel, true);
  // Pro-labore alvo = (28% + 2%) x 84.000 / 12 = 2.100.
  assert.equal(s.prolaboreFatorR, 210000);
  const rec = s.recomendado;
  assert.equal(rec.anexo, 'III');
  assert.equal(rec.prolabore, 210000);
  assert.equal(rec.das, 42000);       // 6% de 7.000
  assert.equal(rec.inss, 23100);      // 11% de 2.100
  assert.equal(rec.irrf, 0);          // isento pela reducao
  assert.equal(rec.prolaboreLiquido, 186900);
  assert.equal(rec.lucro, 448000);    // 7.000 - 420 - 2.100
  assert.equal(rec.bolso, 634900);
  // A alternativa (Anexo V, pro-labore no piso) deixa menos no bolso.
  assert.equal(s.alternativa.anexo, 'V');
  assert.equal(s.alternativa.das, 108500);  // 15,5% de 7.000
  assert.ok(s.alternativa.bolso < rec.bolso);
});

test('Sugestao sem Fator R: pro-labore no piso maximiza o lucro isento', () => {
  const s = sugerirDivisao({ segmento: 'servicos', receitaMensal: 400000, rbt12: 4200000, folha12: 0, modalidade: 'empresa' }, tabelas);
  assert.equal(s.comparavel, false);
  assert.equal(s.recomendado.prolabore, 162100); // salario minimo de 2026
  assert.equal(s.alternativa, null);
});

test('Caixa e reserva: distribuicao maior que o caixa gera aviso', () => {
  const r = calcular({ ...base, distribuicao: 40000 }, tabelas);
  assert.equal(r.caixaDisponivel, 3128000); // R$ 31.280 em centavos
  assert.ok(r.avisos.some((a) => a.includes('passa do caixa do mes')));
  // Retirando todo o caixa sobra reserva zero, com aviso proprio.
  const cheio = calcular({ ...base, distribuicao: 31280 }, tabelas);
  assert.equal(cheio.reserva, 0);
  assert.ok(cheio.avisos.some((a) => a.includes('sem reserva')));
});
