// Férias (CLT arts. 129 a 145) com 1/3 constitucional e abono pecuniário.

import { arredondar, emCentavos, formatarBRL as brl } from '../core/moeda.js';
import { numero, dataValida, reunir } from '../core/validacao.js';
import { addDias, formatarBR } from '../core/datas.js';
import { calcularINSS, calcularIRRF } from './impostos.js';
import { holerite, detalheIRRF, AVISO_ESTIMATIVA } from './apresentacao.js';

export function validar(e) {
  const erros = reunir({
    salario: numero(e.salario, 'Salário bruto', { min: 0.01 }),
    media: numero(e.media ?? 0, 'Média de variáveis', { min: 0 }),
    dias: numero(e.dias, 'Dias de férias', { min: 5, max: 30, inteiro: true }),
    dependentes: numero(e.dependentes ?? 0, 'Dependentes', { min: 0, max: 20, inteiro: true }),
    inicio: e.inicio ? dataValida(e.inicio, 'Início das férias') : null,
  });
  if (!erros.dias && e.abono && e.dias > 20) {
    erros.dias = 'Ao vender 10 dias, restam no máximo 20 dias para descansar.';
  }
  return erros;
}

export function calcular(e, t) {
  const remuneracao = emCentavos(e.salario) + emCentavos(e.media ?? 0);
  const ferias = arredondar((remuneracao * e.dias) / 30);
  const terco = arredondar(ferias / 3);
  const abono = e.abono ? arredondar((remuneracao * 10) / 30) : 0;
  const abonoTerco = e.abono ? arredondar(abono / 3) : 0;
  const tributavel = ferias + terco;
  const inss = calcularINSS(tributavel, t);
  const irrf = calcularIRRF({ rendimento: tributavel, inss, dependentes: e.dependentes ?? 0 }, t);
  const liquido = tributavel + abono + abonoTerco - inss - irrf.imposto;
  return {
    remuneracao, dias: e.dias, ferias, terco, abono, abonoTerco, tributavel, inss, irrf, liquido,
    pagarAte: e.inicio ? addDias(e.inicio, -2) : null,
  };
}

export function exibir(r) {
  const proventos = [
    { descricao: 'Férias', referencia: `${r.dias} dias`, valor: r.ferias },
    { descricao: '1/3 constitucional', valor: r.terco },
  ];
  if (r.abono > 0) {
    proventos.push({ descricao: 'Abono pecuniário (10 dias)', valor: r.abono });
    proventos.push({ descricao: '1/3 sobre o abono', valor: r.abonoTerco });
  }
  const resumo = [{ rotulo: 'Valor líquido das férias', valor: brl(r.liquido), destaque: true }];
  if (r.pagarAte) resumo.push({ rotulo: 'Pagamento até (2 dias antes)', valor: formatarBR(r.pagarAte) });
  return {
    resumo,
    holerite: holerite(proventos, [
      { descricao: 'INSS', valor: r.inss },
      { descricao: 'IRRF', valor: r.irrf.imposto },
    ]),
    detalhes: [
      { descricao: 'Remuneração mensal considerada', valor: brl(r.remuneracao) },
      { descricao: 'Base tributável (férias + 1/3)', valor: brl(r.tributavel) },
      ...detalheIRRF(r.irrf),
    ],
    avisos: [
      'O abono pecuniário e o 1/3 sobre ele não sofrem INSS nem IRRF.',
      'O cálculo considera as férias isoladas. Se o salário do mês for pago na mesma folha, o imposto pode mudar.',
      AVISO_ESTIMATIVA,
    ],
    copiar: `Férias: líquido ${brl(r.liquido)} (${r.dias} dias, 1/3 incluso; INSS ${brl(r.inss)}; IRRF ${brl(r.irrf.imposto)}).`,
  };
}
