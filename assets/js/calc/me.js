// Tributos do ME no Simples Nacional: DAS, Fator R, transição MEI→ME, pró-labore e lucros.
// Todas as alíquotas, faixas e limites vêm de data/tabelas.json; nada fixo aqui.
// Entradas em reais (number); saídas monetárias em CENTAVOS inteiros.

import { arredondar, emCentavos, formatarBRL as brl, formatarPercentual as pct } from '../core/moeda.js';
import { numero, reunir } from '../core/validacao.js';
import { calcularIRRF } from './impostos.js';
import { detalheIRRF, AVISO_ESTIMATIVA } from './apresentacao.js';

/**
 * Segmentos curados para quem saiu do MEI. Cada um sugere um anexo do Simples;
 * 'FATOR_R' significa que o anexo (III ou V) é decidido pela folha de 12 meses.
 */
export const SEGMENTOS = {
  comercio: { rotulo: 'Comércio varejista (loja, mercadinho, roupas)', anexo: 'I' },
  alimentacao: { rotulo: 'Bar, restaurante, lanchonete ou delivery', anexo: 'I' },
  industria: { rotulo: 'Indústria / fabricação', anexo: 'II' },
  servicos: { rotulo: 'Serviços em geral (salão, reparos, saúde, educação)', anexo: 'III' },
  transporte: { rotulo: 'Transporte de cargas ou passageiros', anexo: 'III' },
  construcao: { rotulo: 'Construção, reforma, limpeza ou vigilância', anexo: 'IV' },
  advocacia: { rotulo: 'Advocacia', anexo: 'IV' },
  intelectual: { rotulo: 'TI, consultoria, marketing, engenharia, design…', anexo: 'FATOR_R' },
};

export const MODALIDADES_PROLABORE = {
  empresa: 'Retido pela empresa (11%)',
  carne: 'Recolhido no carnê-leão (20%)',
};

export const TIPOS_MEI = {
  comercio: 'Comércio/indústria (INSS + ICMS)',
  servicos: 'Serviços (INSS + ISS)',
  ambos: 'Comércio + serviços (INSS + ICMS + ISS)',
};

export const STATUS_MEI = {
  dentro: 'Dentro do teto do MEI',
  ate20: 'Acima do teto em até 20%: vira ME no ano seguinte',
  acima: 'Acima de 20% do teto: desenquadramento retroativo',
};

export function validar(e) {
  return reunir({
    segmento: SEGMENTOS[e.segmento] ? null : 'Escolha o segmento da empresa.',
    receitaMensal: numero(e.receitaMensal, 'Faturamento do mês', { min: 0.01 }),
    rbt12: numero(e.rbt12 ?? 0, 'Faturamento dos últimos 12 meses', { min: 0 }),
    folha12: numero(e.folha12 ?? 0, 'Folha dos últimos 12 meses', { min: 0 }),
    tipoMei: TIPOS_MEI[e.tipoMei] ? null : 'Escolha o tipo de atividade no MEI.',
    prolabore: numero(e.prolabore ?? 0, 'Pró-labore mensal', { min: 0 }),
    modalidade: MODALIDADES_PROLABORE[e.modalidade] ? null : 'Escolha a forma de recolher o INSS.',
    dependentes: numero(e.dependentes ?? 0, 'Dependentes', { min: 0, max: 20, inteiro: true }),
    distribuicao: numero(e.distribuicao ?? 0, 'Lucros distribuídos no mês', { min: 0 }),
  });
}

/**
 * DAS do Simples: localiza a faixa pelo RBT12 e aplica
 * alíquota efetiva = (RBT12 × nominal − parcela) ÷ RBT12 sobre a receita do mês.
 */
export function calcularDAS({ rbt12, receitaMensal, anexo }, t) {
  const faixas = t.simples.anexos[anexo].faixas;
  let faixa = faixas[faixas.length - 1];
  let indice = faixas.length - 1;
  for (let i = 0; i < faixas.length; i++) {
    if (faixas[i].ate === null || rbt12 <= emCentavos(faixas[i].ate)) {
      faixa = faixas[i];
      indice = i;
      break;
    }
  }
  const efetiva = rbt12 > 0
    ? Math.max(0, (rbt12 * faixa.nominal - emCentavos(faixa.deducao)) / rbt12)
    : faixa.nominal;
  return { anexo, faixa: indice + 1, nominal: faixa.nominal, efetiva, das: arredondar(receitaMensal * efetiva) };
}

/** Fator R: folha de 12 meses (inclui pró-labore) ÷ RBT12 ≥ 28% → Anexo III, senão Anexo V. */
export function aplicarFatorR({ folha12, rbt12 }, t) {
  const razao = rbt12 > 0 ? folha12 / rbt12 : 0;
  const anexo = razao >= t.simples.fatorR ? 'III' : 'V';
  return { razao, anexo };
}
/** DAS-MEI mensal de 2026 conforme o tipo de atividade. */
export function dasMeiMensal(tipo, t) {
  const d = t.mei.das;
  let v = emCentavos(d.inss);
  if (tipo === 'comercio') v += emCentavos(d.icms);
  else if (tipo === 'servicos') v += emCentavos(d.iss);
  else v += emCentavos(d.icms) + emCentavos(d.iss);
  return v;
}

/**
 * Pro-labore: INSS de 11% (retido) ou 20% (carne) ate o teto,
 * mais IRRF pela tabela mensal. Sem FGTS, ferias ou 13o.
 */
export function calcularProLabore({ valor, modalidade, dependentes = 0 }, t) {
  const aliquota = modalidade === 'carne' ? t.proLabore.carneLeao : t.proLabore.retencaoEmpresa;
  const inss = arredondar(Math.min(valor, emCentavos(t.inss.teto)) * aliquota);
  const irrf = calcularIRRF({ rendimento: valor, inss, dependentes }, t);
  return { valor, aliquota, inss, irrf, liquido: valor - inss - irrf.imposto };
}

/**
 * Distribuicao de lucros: isenta no Simples; retencao de 10% sobre o que
 * exceder o limite mensal, exceto com escrituracao contabil e balanco mensal.
 */
export function simularLucros({ distribuicao, escrituracao }, t) {
  const baseRetencao = Math.max(0, distribuicao - emCentavos(t.lucros.limiteRetencaoMensal));
  const retencao = baseRetencao > 0 && !escrituracao
    ? arredondar(baseRetencao * t.lucros.aliquotaRetencao)
    : 0;
  const alertaMinimo = distribuicao * 12 > emCentavos(t.lucros.limiteImpostoMinimoAnual);
  return { distribuicao, baseRetencao, retencao, liquido: distribuicao - retencao, alertaMinimo };
}

export function calcular(e, t) {
  const receitaMensal = emCentavos(e.receitaMensal);
  const rbt12 = emCentavos(e.rbt12 ?? 0);
  const folha12 = emCentavos(e.folha12 ?? 0);
  const seg = SEGMENTOS[e.segmento];

  let fatorR = null;
  const anexo = seg.anexo === 'FATOR_R'
    ? (fatorR = aplicarFatorR({ folha12, rbt12 }, t)).anexo
    : seg.anexo;
  const das = calcularDAS({ rbt12, receitaMensal, anexo }, t);
  const rotuloAnexo = t.simples.anexos[anexo].rotulo;
  const cppNoDas = t.simples.cppNoDas[anexo] === true;
  const corteFatorR = t.simples.fatorR;

  const tetoMei = emCentavos(t.mei.tetoAnual);
  const limiteTolerancia = arredondar(tetoMei * (1 + t.mei.tolerancia));
  const percentualTolerancia = t.mei.tolerancia;
  const statusMei = rbt12 > limiteTolerancia ? 'acima' : rbt12 > tetoMei ? 'ate20' : 'dentro';
  const meiMensal = dasMeiMensal(e.tipoMei, t);
  const excessoMei = Math.max(0, rbt12 - tetoMei);
  // Estimativa do DAS complementar sobre o excedente (aliquota efetiva do Simples).
  const complementar = statusMei === 'ate20' ? arredondar(excessoMei * das.efetiva) : 0;

  const prolabore = calcularProLabore(
    { valor: emCentavos(e.prolabore ?? 0), modalidade: e.modalidade, dependentes: e.dependentes ?? 0 },
    t,
  );
  const salarioMinimo = emCentavos(t.salarioMinimo.valor);
  const abaixoDoPiso = prolabore.valor > 0 && prolabore.valor < salarioMinimo;

  const lucros = simularLucros({ distribuicao: emCentavos(e.distribuicao ?? 0), escrituracao: !!e.escrituracao }, t);
  const limiteRetencao = emCentavos(t.lucros.limiteRetencaoMensal);
  const aliquotaRetencao = t.lucros.aliquotaRetencao;
  const limiteMinimoAnual = emCentavos(t.lucros.limiteImpostoMinimoAnual);
  const tetoSimples = emCentavos(t.simples.limite);
  const sublimite = emCentavos(t.simples.sublimite);

  const avisos = [];
  if (rbt12 > tetoSimples) {
    avisos.push('RBT12 acima do teto do Simples Nacional: a empresa e excluida do regime. Procure um contador com urgencia.');
  } else if (rbt12 > sublimite) {
    avisos.push('RBT12 acima do sublimite: ICMS e ISS passam a ser recolhidos fora do DAS, direto ao estado/municipio.');
  }
  if (!cppNoDas) avisos.push('Neste anexo a CPP (INSS patronal) nao esta no DAS: e recolhida a parte e soma ao custo da empresa.');
  if (statusMei === 'ate20') avisos.push('Faturamento acima do teto do MEI dentro da tolerancia: a empresa vira ME no ano seguinte e recolhe DAS complementar sobre o excedente (valor estimado).');
  if (statusMei === 'acima') avisos.push('Faturamento acima da tolerancia do teto do MEI: desenquadramento com efeito retroativo ao inicio do ano. Procure um contador.');
  if (abaixoDoPiso) avisos.push('Pro-labore abaixo de 1 salario minimo: a base previdenciaria minima do socio e o salario minimo.');
  if (lucros.retencao > 0) avisos.push('Distribuicao acima do limite mensal: retencao de ' + pct(aliquotaRetencao, 0) + ' sobre o excedente na fonte.');
  if (lucros.baseRetencao > 0 && !!e.escrituracao) avisos.push('Com escrituracao contabil e balanco mensal, a ME do Simples nao sofre a retencao sobre lucros - confirme com o contador.');
  if (lucros.alertaMinimo) avisos.push('Distribuicao anual acima do limite do imposto minimo: parte pode ser tributada na declaracao anual. Confirme com o contador.');

  return {
    segmento: e.segmento, anexo, rotuloAnexo, fatorR, corteFatorR, das, cppNoDas, receitaMensal, rbt12,
    statusMei, percentualTolerancia, meiMensal, meiAnual: meiMensal * 12, excessoMei, complementar,
    prolabore, salarioMinimo, abaixoDoPiso, lucros, limiteRetencao, aliquotaRetencao, limiteMinimoAnual, avisos,
  };
}

export function exibir(r) {
  const detalhes = [
    { descricao: 'DAS: ' + r.rotuloAnexo + ' (faixa ' + r.das.faixa + ')', valor: brl(r.das.das) },
    { descricao: 'RBT12 considerado', valor: brl(r.rbt12) },
    { descricao: 'Aliquota nominal da faixa', valor: pct(r.das.nominal) },
    { descricao: 'Aliquota efetiva: (RBT12 x nominal - parcela) / RBT12', valor: pct(r.das.efetiva) },
  ];
  if (r.fatorR) {
    detalhes.push({ descricao: 'Fator R (folha / RBT12, corte em ' + pct(r.corteFatorR, 0) + ') - Anexo ' + r.fatorR.anexo, valor: pct(r.fatorR.razao) });
  }
  detalhes.push(
    { descricao: 'MEI-ME: ' + STATUS_MEI[r.statusMei], valor: brl(r.excessoMei) },
    { descricao: 'DAS-MEI mensal (para comparar)', valor: brl(r.meiMensal) },
    { descricao: 'DAS-MEI no ano (12 meses)', valor: brl(r.meiAnual) },
  );
  if (r.complementar > 0) detalhes.push({ descricao: 'DAS complementar estimado sobre o excedente', valor: brl(r.complementar) });
  detalhes.push(
    { descricao: 'Pro-labore bruto (INSS de ' + pct(r.prolabore.aliquota, 0) + ')', valor: brl(r.prolabore.valor) },
    { descricao: 'Pro-labore: INSS do socio', valor: brl(r.prolabore.inss) },
  );
  for (const l of detalheIRRF(r.prolabore.irrf, 'Pro-labore: IRRF')) detalhes.push(l);
  detalhes.push(
    { descricao: 'Pro-labore liquido', valor: brl(r.prolabore.liquido) },
    { descricao: 'Lucros distribuidos no mes (isentos no Simples)', valor: brl(r.lucros.distribuicao) },
  );
  if (r.lucros.baseRetencao > 0) {
    detalhes.push({ descricao: 'Parcela sujeita a retencao (acima de ' + brl(r.limiteRetencao) + ' no mes)', valor: brl(r.lucros.baseRetencao) });
  }
  detalhes.push(
    { descricao: 'Retencao na fonte (' + pct(r.aliquotaRetencao, 0) + ' do excedente)', valor: brl(r.lucros.retencao) },
    { descricao: 'Lucros liquidos recebidos', valor: brl(r.lucros.liquido) },
  );

  return {
    resumo: [
      { rotulo: 'DAS estimado do mes', valor: brl(r.das.das), destaque: true },
      { rotulo: 'Pro-labore liquido', valor: brl(r.prolabore.liquido) },
      { rotulo: 'Lucros liquidos no mes', valor: brl(r.lucros.liquido) },
    ],
    detalhes,
    avisos: [...r.avisos, AVISO_ESTIMATIVA],
    copiar: 'ME (Anexo ' + r.anexo + ', faixa ' + r.das.faixa + '): DAS ' + brl(r.das.das) + ' (efetiva ' + pct(r.das.efetiva) + '); pro-labore liquido ' + brl(r.prolabore.liquido) + '; lucros liquidos ' + brl(r.lucros.liquido) + '.',
  };
}
