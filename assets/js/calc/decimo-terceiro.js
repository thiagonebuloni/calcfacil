// 13º salário (Lei 4.090/1962 e Lei 4.749/1965).

import { arredondar, emCentavos, formatarBRL as brl } from '../core/moeda.js';
import { numero, reunir } from '../core/validacao.js';
import { calcularINSS, calcularIRRF } from './impostos.js';
import { holerite, detalheIRRF, AVISO_ESTIMATIVA } from './apresentacao.js';

export function validar(e) {
  return reunir({
    salario: numero(e.salario, 'Salário bruto', { min: 0.01 }),
    media: numero(e.media ?? 0, 'Média de variáveis', { min: 0 }),
    meses: numero(e.meses, 'Meses trabalhados no ano', { min: 1, max: 12, inteiro: true }),
    dependentes: numero(e.dependentes ?? 0, 'Dependentes', { min: 0, max: 20, inteiro: true }),
  });
}

export function calcular(e, t) {
  const remuneracao = emCentavos(e.salario) + emCentavos(e.media ?? 0);
  const bruto = arredondar((remuneracao * e.meses) / 12);
  const inss = calcularINSS(bruto, t);
  const irrf = calcularIRRF(
    { rendimento: bruto, inss, dependentes: e.dependentes ?? 0, aplicarReducao: t.irrf.reducao?.aplicaAoDecimoTerceiro !== false },
    t,
  );
  const liquido = bruto - inss - irrf.imposto;
  const primeira = arredondar(bruto / 2);
  return { remuneracao, meses: e.meses, bruto, inss, irrf, liquido, primeira, segunda: liquido - primeira };
}

export function exibir(r) {
  return {
    resumo: [
      { rotulo: '1ª parcela (até 30/11, sem descontos)', valor: brl(r.primeira) },
      { rotulo: '2ª parcela (até 20/12, já com descontos)', valor: brl(r.segunda) },
      { rotulo: 'Total líquido do 13º', valor: brl(r.liquido), destaque: true },
    ],
    holerite: holerite(
      [{ descricao: '13º salário', referencia: `${r.meses}/12`, valor: r.bruto }],
      [
        { descricao: 'INSS', valor: r.inss },
        { descricao: 'IRRF', valor: r.irrf.imposto },
      ],
    ),
    detalhes: [
      { descricao: 'Remuneração mensal considerada', valor: brl(r.remuneracao) },
      { descricao: 'INSS (tabela progressiva sobre o 13º)', valor: brl(r.inss) },
      ...detalheIRRF(r.irrf),
    ],
    avisos: [AVISO_ESTIMATIVA],
    copiar: `13º salário: bruto ${brl(r.bruto)}; 1ª parcela ${brl(r.primeira)}; 2ª parcela ${brl(r.segunda)}; líquido ${brl(r.liquido)}.`,
  };
}
