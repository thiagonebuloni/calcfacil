// Planejador de aposentadoria (acúmulo de patrimônio). NÃO é uma simulação do INSS.
// Meta: patrimônio que, rendendo a taxa real, paga a renda desejada sem consumir o principal (perpetuidade).

import { arredondar, emCentavos, formatarBRL as brl, formatarPercentual } from '../core/moeda.js';
import { numero, reunir } from '../core/validacao.js';
import { taxaMensal } from './juros-compostos.js';
import { AVISO_ESTIMATIVA } from './apresentacao.js';

export function validar(e) {
  const erros = reunir({
    idadeAtual: numero(e.idadeAtual, 'Idade atual', { min: 14, max: 99, inteiro: true }),
    idadeAlvo: numero(e.idadeAlvo, 'Idade para se aposentar', { min: 15, max: 100, inteiro: true }),
    renda: numero(e.renda, 'Renda mensal desejada', { min: 1 }),
    patrimonio: numero(e.patrimonio ?? 0, 'Patrimônio atual', { min: 0 }),
    aporte: numero(e.aporte ?? 0, 'Aporte mensal', { min: 0 }),
    rentabilidade: numero(e.rentabilidade, 'Rentabilidade real ao ano', { min: 0.1, max: 30 }),
  });
  if (!erros.idadeAtual && !erros.idadeAlvo && e.idadeAlvo <= e.idadeAtual) {
    erros.idadeAlvo = 'A idade para se aposentar deve ser maior que a idade atual.';
  }
  return erros;
}

export function calcular(e, t) {
  void t;
  const i = taxaMensal(e.rentabilidade, 'anual');
  const n = (e.idadeAlvo - e.idadeAtual) * 12;
  const patrimonio = emCentavos(e.patrimonio ?? 0);
  const aporte = emCentavos(e.aporte ?? 0);
  const renda = emCentavos(e.renda);

  const necessario = arredondar(renda / i);
  const fator = Math.pow(1 + i, n);
  const projetado = arredondar(patrimonio * fator + (aporte * (fator - 1)) / i);
  const falta = Math.max(0, necessario - projetado);
  const aporteNecessario = Math.max(0, arredondar(((necessario - patrimonio * fator) * i) / (fator - 1)));

  // Projeção anual e idade em que a meta seria atingida com o aporte atual
  const anual = [{ idade: e.idadeAtual, valor: patrimonio }];
  let saldo = patrimonio;
  let mesesAteMeta = saldo >= necessario ? 0 : null;
  const limite = (100 - e.idadeAtual) * 12;
  for (let m = 1; m <= limite; m++) {
    saldo = saldo * (1 + i) + aporte;
    if (mesesAteMeta === null && saldo >= necessario) mesesAteMeta = m;
    if (m % 12 === 0) anual.push({ idade: e.idadeAtual + m / 12, valor: arredondar(saldo) });
  }

  return {
    n, taxaMensal: i, renda, necessario, projetado, falta, aporteNecessario, aporte, patrimonio,
    atinge: projetado >= necessario, mesesAteMeta, idadeAtual: e.idadeAtual, idadeAlvo: e.idadeAlvo, anual,
  };
}

export function exibir(r) {
  const resumo = [
    { rotulo: 'Patrimônio necessário', valor: brl(r.necessario), destaque: true },
    { rotulo: `Patrimônio projetado aos ${r.idadeAlvo} anos`, valor: brl(r.projetado) },
  ];
  if (r.atinge) {
    resumo.push({ rotulo: 'Situação', valor: 'Meta atingida no prazo' });
  } else {
    resumo.push({ rotulo: 'Aporte mensal necessário', valor: brl(r.aporteNecessario) });
    if (r.mesesAteMeta !== null) {
      const anos = Math.floor(r.mesesAteMeta / 12), meses = r.mesesAteMeta % 12;
      const idade = r.idadeAtual + anos;
      resumo.push({
        rotulo: 'Com o aporte atual, a meta sai aos',
        valor: `${idade} anos${meses ? ` e ${meses} ${meses === 1 ? 'mês' : 'meses'}` : ''}`,
      });
    } else {
      resumo.push({ rotulo: 'Com o aporte atual', valor: 'Meta não atingida até os 100 anos' });
    }
  }

  const ate = Math.max(r.idadeAlvo, r.mesesAteMeta !== null ? r.idadeAtual + Math.ceil(r.mesesAteMeta / 12) : r.idadeAlvo);
  const pontos = r.anual.filter((p) => p.idade <= Math.min(100, ate));
  return {
    resumo,
    detalhes: [
      { descricao: 'Renda mensal desejada (valores de hoje)', valor: brl(r.renda) },
      { descricao: 'Falta acumular até a idade-alvo, com o aporte atual', valor: brl(r.falta) },
      { descricao: 'Rentabilidade mensal real equivalente', valor: formatarPercentual(r.taxaMensal, 4) },
      { descricao: 'Prazo de acumulação', valor: `${r.n / 12} anos` },
    ],
    grafico: {
      titulo: 'Patrimônio projetado e meta',
      formatoX: 'idade',
      x: pontos.map((p) => p.idade),
      series: [
        { nome: 'Patrimônio projetado', valores: pontos.map((p) => p.valor / 100) },
        { nome: 'Meta', valores: pontos.map(() => r.necessario / 100) },
      ],
    },
    avisos: [
      'A meta supõe viver só dos rendimentos, sem consumir o patrimônio. Rentabilidade e inflação futuras são incertas.',
      'Use uma rentabilidade REAL (acima da inflação) e uma renda em valores de hoje. Este cálculo não simula a aposentadoria do INSS.',
      AVISO_ESTIMATIVA,
    ],
    copiar: `Aposentadoria: preciso de ${brl(r.necessario)} para renda de ${brl(r.renda)}/mês; projeção aos ${r.idadeAlvo}: ${brl(r.projetado)}; aporte necessário ${brl(r.aporteNecessario)}/mês.`,
  };
}
