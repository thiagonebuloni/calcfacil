import test from 'node:test';
import assert from 'node:assert/strict';
import { tabelas } from './_util.js';
import { validar, calcular } from '../assets/js/calc/inss.js';

// Data de referência fixa: 18/10/2026 (fora do código, só nos testes).
const HOJE = new Date(2026, 9, 18);

// Mulher 55a (nasc. 01/03/1971), 27a de contribuição, média 4000, salário 4500.
const base = { sexo: 'mulher', nascimento: '1971-03-01', tempoAnos: 27, tempoMeses: 0, media: 4000, salarioAtual: 4500 };

test('idade progressiva: meta sobe junto, concessão quando a tabela trava', () => {
  const r = calcular(base, tabelas, HOJE);
  const g = r.regras.find((x) => x.id === 'idade-progressiva');
  assert.equal(g.alcanca, true);
  // A meta sobe 6m/ano até travar em 62a (2031); ela faz 62a em mar/2033: 77 meses
  assert.equal(g.faltaMeses, 77);
  assert.equal(g.ano, 2033);
  // 27a + 77m = 33a5m -> 33 anos completos -> coef 60% + 2% x 18 = 96%
  assert.equal(g.coeficiente, 0.96);
});

test('pedágio 100% com em2019 informado: total = 2x necessário − C2019', () => {
  // Em 11/2019 tinha 20a; pedágio total = 60a − 20a = 40a; tem 27a -> faltam 13a = 156m
  const r = calcular({ ...base, em2019: 20 }, tabelas, HOJE);
  assert.equal(r.c2019, 240);
  assert.equal(r.pedagioSuposto, false);
  const g = r.regras.find((x) => x.id === 'pedagio-100');
  // Idade mínima 57a já cumprida (55a7m? não: 57a−55a7m = 17m) -> idade limita: 17 meses? não:
  // T0+f >= 480 (40a) -> f >= 156; idade 667+156=823m = 68a7m >= 57a ok -> falta 156m
  assert.equal(g.alcanca, true);
  assert.equal(g.faltaMeses, 156);
  assert.equal(g.coeficiente, 1);
});

test('pedágio suposto por continuidade quando em2019 não informado', () => {
  const r = calcular(base, tabelas, HOJE);
  // out/2026 − nov/2019 = 83m decorridos; 324 − 83 = 241m supostos em 2019
  assert.equal(r.pedagioSuposto, true);
  assert.equal(r.c2019, 241);
});

test('pedágio 100% não se aplica a quem começou depois de 2019', () => {
  const r = calcular({ sexo: 'homem', nascimento: '2000-01-15', tempoAnos: 4, tempoMeses: 0, media: 3000 }, tabelas, HOJE);
  const g = r.regras.find((x) => x.id === 'pedagio-100');
  assert.equal(g.aplica, false);
});

test('regra permanente do homem: 65a + 20a, coeficiente 60% + 2%/ano', () => {
  // Homem 60a (nasc. 01/01/1966), 18a de contribuição, média 3000.
  const r = calcular({ sexo: 'homem', nascimento: '1966-01-15', tempoAnos: 18, tempoMeses: 0, media: 3000 }, tabelas, HOJE);
  const g = r.regras.find((x) => x.id === 'permanente');
  // idade: 60a9m -> 65a: 51m; contrib 18a -> 20a: 24m -> limita idade: 51m
  assert.equal(g.faltaMeses, 51);
  // 18a + 51m = 22a3m -> 22 anos -> coef 60% + 2% x 2 = 64%
  assert.equal(g.coeficiente, 0.64);
  // média projetada = 3000 (salário = média); bruto = 1920 -> piso 1621 -> 1920
  assert.equal(g.beneficio, 192000);
});

test('piso e teto aplicados', () => {
  const piso = calcular({ sexo: 'mulher', nascimento: '1960-01-01', tempoAnos: 20, tempoMeses: 0, media: 1000 }, tabelas, HOJE);
  assert.ok(piso.melhor.beneficio >= 162100);
  const teto = calcular({ sexo: 'homem', nascimento: '1960-01-01', tempoAnos: 40, tempoMeses: 0, media: 30000, salarioAtual: 30000 }, tabelas, HOJE);
  assert.ok(teto.melhor.beneficio <= 847555);
});

test('coeficiente limitado a 100%', () => {
  // Homem com 40a: 60% + 2% x 20 = 100% (teto do coeficiente)
  const r = calcular({ sexo: 'homem', nascimento: '1980-01-01', tempoAnos: 40, tempoMeses: 0, media: 5000 }, tabelas, HOJE);
  const g = r.regras.find((x) => x.id === 'permanente');
  assert.equal(g.coeficiente, 1);
});

test('pontos: meta do ano de concessão', () => {
  // Homem 60a9m, 34a de contribuição: pontos hoje = 94,9 < 103 -> precisa contribuir até pontos 103+ (sobe 1/ano)
  const r = calcular({ sexo: 'homem', nascimento: '1966-01-01', tempoAnos: 34, tempoMeses: 0, media: 4000 }, tabelas, HOJE);
  const g = r.regras.find((x) => x.id === 'pontos');
  assert.equal(g.alcanca, true);
  assert.ok(g.pontosNaConcessao >= g.metaPontos);
});

test('melhor regra é a mais próxima', () => {
  const r = calcular(base, tabelas, HOJE);
  assert.ok(r.melhor);
  const min = Math.min(...r.regras.filter((g) => g.aplica && g.alcanca).map((g) => g.faltaMeses));
  assert.equal(r.melhor.faltaMeses, min);
});

test('validação: campos obrigatórios e limites', () => {
  assert.ok(validar({ ...base, sexo: 'x' }).sexo);
  assert.ok(validar({ ...base, nascimento: '2099-01-01' }).nascimento);
  assert.ok(validar({ ...base, tempoAnos: 0, tempoMeses: 0 }).tempoAnos);
  assert.ok(validar({ ...base, tempoAnos: 60, tempoMeses: 0 }).tempoAnos); // > idade−14a
  assert.ok(validar({ ...base, em2019: 30 }).em2019); // > total
  assert.deepEqual(validar(base), {});
});
