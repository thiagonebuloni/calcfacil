// Otimizador ME: casos conferidos por conta independente (LC 123/2006,
// tabelas de 2026 em data/tabelas.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { validar, calcularDAS, fatorRAtual, fatorRProjetado, calcularINSSProlabore, calcularIRRFSocio, impostoSobreLucros, simularCenario, otimizar, cenarioTudoProlabore, faturamentoMinimo, prolaborePontoFatorR, calcular, exibir } from '../assets/js/calc/me.js';

const base = {
  meta: 8000, atividade: 'intelectual', receitaMensal: 20000, rbt12: 200000,
  despesas: 2000, folhaMensal: 0, folha12: 0, dependentes: 0, pensao: 0,
  outrasRendas: 0, inssOutro: 0, outrosDividendos: 0, numSocios: 1,
  participacao: 100, prolaboreMin: 0,
};

test('DAS: efetiva = (RBT12 x nominal - parcela) / RBT12', () => {
  const r = calcularDAS({ rbt12: 42000000, receitaMensal: 4000000, anexo: 'III' }, tabelas);
  assert.equal(r.faixa, 3);
  assert.equal(r.efetiva, 0.093);
  assert.equal(r.das, 372000);
});

test('Fator R: 28% vai ao III; projetado usa folha futura', () => {
  assert.equal(fatorRAtual({ folha12: 11200000, rbt12: 40000000 }, tabelas).anexo, 'III');
  assert.equal(fatorRAtual({ folha12: 11199900, rbt12: 40000000 }, tabelas).anexo, 'V');
  const p = fatorRProjetado({ folhaMensal: 0, prolabore: 280000, receitaMensal: 1000000, rbt12: 10000000 }, tabelas);
  assert.equal(p.anexo, 'III');
});

test('INSS respeita o teto compartilhado com outro vinculo', () => {
  const teto = tabelas.inss.teto * 100;
  const cheio = calcularINSSProlabore({ prolabore: 500000, outraBase: teto }, tabelas);
  assert.equal(cheio.inss, 0);
  const livre = calcularINSSProlabore({ prolabore: 500000, outraBase: 0 }, tabelas);
  assert.equal(livre.inss, 55000);
});

test('IRRF marginal: outras rendas empurram a faixa', () => {
  const sem = calcularIRRFSocio({ prolabore: 500000, inss: 55000, outrasRendas: 0 }, tabelas);
  assert.equal(sem.incremental, 0);
  const com = calcularIRRFSocio({ prolabore: 500000, inss: 55000, outrasRendas: 800000 }, tabelas);
  assert.ok(com.incremental > 0);
});

test('Lucro: sem contabilidade o isento limita no presumido', () => {
  const sem = impostoSobreLucros({ retirada: 500000, receitaMensal: 1000000, anexo: 'III', escrituracao: false }, tabelas);
  assert.equal(sem.limitePresuncao, 320000);
  assert.equal(sem.retencao, 18000);
  const com = impostoSobreLucros({ retirada: 500000, receitaMensal: 1000000, anexo: 'III', escrituracao: true }, tabelas);
  assert.equal(com.retencao, 0);
});

test('Otimizador atinge a meta com menos imposto que o minimo', () => {
  const r = calcular(base, tabelas);
  assert.equal(r.viavel, true);
  assert.ok(r.recomendado.liquido >= r.meta);
  assert.ok(r.recomendado.impostos <= r.cenarioA.impostos || r.cenarioA.atinge === false);
  assert.equal(r.cenarioC.prolabore, r.recomendado.prolabore);
  const v = exibir(r);
  assert.equal(v.resumo.length, 5);
  assert.equal(v.tabela.linhas.length, 4);
  assert.ok(v.avisos.some((a) => a.includes('contador')));
});

test('Cenarios A, B, C e D existem e D nao distribui lucro', () => {
  const r = calcular(base, tabelas);
  assert.ok(r.cenarioA.prolabore <= r.cenarioB.prolabore || r.pontoFatorR <= r.ctx.prolaboreMin);
  assert.equal(r.cenarioD.retirada, 0);
});

test('Meta impossivel: marca inviavel e estima o faturamento minimo', () => {
  const r = calcular({ ...base, meta: 50000, receitaMensal: 8000, rbt12: 96000 }, tabelas);
  assert.equal(r.viavel, false);
  assert.ok(r.receitaMin > 800000);
  assert.ok(r.avisos.some((a) => typeof a !== 'string' && a.critico));
});

test('Tudo como pro-labore respeita o teto do INSS', () => {
  const r = calcular({ ...base, atividade: 'servicos', receitaMensal: 30000, rbt12: 300000 }, tabelas);
  assert.ok(r.cenarioD.prolabore <= r.tetoINSS);
});

test('Ponto do Fator R entrega exatamente o corte', () => {
  const ponto = prolaborePontoFatorR({ folhaMensal: 0, receitaMensal: 1000000, rbt12: 10000000 }, tabelas);
  const p = fatorRProjetado({ folhaMensal: 0, prolabore: ponto, receitaMensal: 1000000, rbt12: 10000000 }, tabelas);
  assert.ok(p.razao >= tabelas.simples.fatorR);
});

test('Validacao exige meta, atividade e receita', () => {
  const e = validar({ ...base, meta: 0, atividade: 'x', receitaMensal: 0 });
  assert.ok(e.meta && e.atividade && e.receitaMensal);
});

test('Faturamento minimo retorna a receita atual quando ja viavel', () => {
  const r = calcular(base, tabelas);
  assert.equal(faturamentoMinimo(r.ctx, tabelas), r.ctx.receitaMensal);
});

test('Simulacao nunca distribui mais do que o lucro do socio', () => {
  const r = calcular({ ...base, meta: 30000 }, tabelas);
  const c = r.recomendado;
  assert.ok(c.retirada <= Math.max(0, c.disponivel));
});

test('Retirada bruta cobre a meta sem inflar o pro-labore (retencao sobre presumido)', () => {
  // Comercio sem contabilidade: a retencao de 10% sobre a retirada acima de 8%
  // de presumido corrige o liquido para baixo; a solucao e levantar um pouco
  // mais de dividendos, nao inflar o pro-labore ate zerar a retencao.
  const e = { ...base, atividade: 'comercio', meta: 5000, receitaMensal: 15000, rbt12: 180000, despesas: 5000 };
  const r = calcular(e, tabelas);
  assert.equal(r.viavel, true);
  assert.equal(r.recomendado.prolabore, r.ctx.prolaboreMin); // fica no minimo legal
  assert.ok(r.recomendado.liquido >= r.meta);
  assert.ok(r.recomendado.retirada > r.meta - r.recomendado.prolaboreLiquido); // gross-up da retencao
  const inflado = simularCenario(427100, r.ctx, tabelas);
  assert.ok(inflado.atinge);
  assert.ok(r.recomendado.impostos < inflado.impostos);
});

