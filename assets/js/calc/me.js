// Otimizador pro-labore x lucros (ME no Simples Nacional).
// Varre o pro-labore do minimo ao teto e recomenda a divisao que atinge a
// meta liquida com menos imposto. Entradas em reais; saidas em CENTAVOS.

import { arredondar, emCentavos, formatarBRL as brl, formatarPercentual as pct } from '../core/moeda.js';
import { numero, dataValida, reunir } from '../core/validacao.js';
import { calcularINSS, calcularIRRF } from './impostos.js';
import { detalheIRRF, AVISO_ESTIMATIVA } from './apresentacao.js';

export const SEGMENTOS = {
  comercio: { rotulo: 'Comercio (Anexo I)', anexo: 'I' },
  industria: { rotulo: 'Industria (Anexo II)', anexo: 'II' },
  servicos: { rotulo: 'Servicos em geral (Anexo III)', anexo: 'III' },
  construcao: { rotulo: 'Construcao, limpeza, vigilancia (Anexo IV)', anexo: 'IV' },
  intelectual: { rotulo: 'TI, consultoria, marketing, engenharia, design (Fator R)', anexo: 'FATOR_R' },
};

export function validar(e) {
  const opt = (v) => v ?? 0;
  const dataMsg = e.dataMigracao == null || e.dataMigracao === '' ? null : dataValida(e.dataMigracao, 'Data da migracao MEI para ME');
  return reunir({
    meta: numero(e.meta, 'Quanto quer receber liquido por mes', { min: 0.01 }),
    atividade: SEGMENTOS[e.atividade] ? null : 'Escolha a atividade principal da empresa.',
    receitaMensal: numero(e.receitaMensal, 'Faturamento mensal esperado', { min: 0.01 }),
    rbt12: numero(opt(e.rbt12), 'Faturamento dos ultimos 12 meses', { min: 0 }),
    dataMigracao: dataMsg,
    despesas: numero(opt(e.despesas), 'Despesas e custos mensais', { min: 0 }),
    folhaMensal: numero(opt(e.folhaMensal), 'Folha de funcionarios no mes', { min: 0 }),
    folha12: numero(opt(e.folha12), 'Folha total dos ultimos 12 meses', { min: 0 }),
    dependentes: numero(opt(e.dependentes), 'Dependentes', { min: 0, max: 20, inteiro: true }),
    pensao: numero(opt(e.pensao), 'Pensao alimenticia paga', { min: 0 }),
    outrasRendas: numero(opt(e.outrasRendas), 'Outras rendas tributaveis mensais', { min: 0 }),
    inssOutro: numero(opt(e.inssOutro), 'Base no outro vinculo (INSS)', { min: 0 }),
    outrosDividendos: numero(opt(e.outrosDividendos), 'Outros dividendos recebidos', { min: 0 }),
    numSocios: numero(e.numSocios ?? 1, 'Numero de socios', { min: 1, inteiro: true }),
    participacao: numero(e.participacao ?? 100, 'Participacao no lucro (%)', { min: 0.01, max: 100 }),
    prolaboreMin: numero(opt(e.prolaboreMin), 'Pro-labore minimo desejado', { min: 0 }),
  });
}

export function calcularDAS({ rbt12, receitaMensal, anexo }, t) {
  const faixas = t.simples.anexos[anexo].faixas;
  let faixa = faixas[faixas.length - 1];
  let indice = faixas.length - 1;
  for (let i = 0; i < faixas.length; i++) {
    if (faixas[i].ate === null || rbt12 <= emCentavos(faixas[i].ate)) { faixa = faixas[i]; indice = i; break; }
  }
  const efetiva = rbt12 > 0 ? Math.max(0, (rbt12 * faixa.nominal - emCentavos(faixa.deducao)) / rbt12) : faixa.nominal;
  return { anexo, faixa: indice + 1, nominal: faixa.nominal, efetiva, das: arredondar(receitaMensal * efetiva) };
}

export function fatorRAtual({ folha12 = 0, rbt12 }, t) {
  const razao = rbt12 > 0 ? folha12 / rbt12 : 0;
  return { folhaAnual: folha12, denominador: rbt12, razao, anexo: razao >= t.simples.fatorR ? 'III' : 'V' };
}

export function fatorRProjetado({ folhaMensal = 0, prolabore, receitaMensal, rbt12 }, t) {
  const denominador = Math.max(rbt12, receitaMensal * 12, 1);
  const folhaAnual = (folhaMensal + prolabore) * 12;
  const razao = folhaAnual / denominador;
  return { folhaAnual, denominador, razao, anexo: razao >= t.simples.fatorR ? 'III' : 'V' };
}

export function anexoPara({ atividade, folhaMensal = 0, prolabore, receitaMensal, rbt12 }, t) {
  if (SEGMENTOS[atividade].anexo !== 'FATOR_R') return SEGMENTOS[atividade].anexo;
  return fatorRProjetado({ folhaMensal, prolabore, receitaMensal, rbt12 }, t).anexo;
}

export function prolaborePontoFatorR({ folhaMensal = 0, receitaMensal, rbt12 }, t) {
  const denominador = Math.max(rbt12, receitaMensal * 12, 1);
  return Math.max(0, arredondar((t.simples.fatorR * denominador) / 12 - folhaMensal));
}

export function calcularINSSProlabore({ prolabore, outraBase = 0 }, t) {
  const teto = emCentavos(t.inss.teto);
  const margemTeto = Math.max(0, teto - outraBase);
  const base = Math.min(prolabore, margemTeto);
  const aliquota = t.proLabore.retencaoEmpresa;
  return { base, aliquota, inss: arredondar(base * aliquota), margemTeto, teto };
}

export function calcularIRRFSocio({ prolabore, inss, outrasRendas = 0, outraBase = 0, dependentes = 0, pensao = 0 }, t) {
  const inssOutro = calcularINSS(outraBase, t);
  const total = calcularIRRF({ rendimento: prolabore + outrasRendas, inss: inss + inssOutro, dependentes, deducaoExtra: pensao }, t);
  const semProlabore = calcularIRRF({ rendimento: outrasRendas, inss: inssOutro, dependentes, deducaoExtra: pensao }, t);
  return { inssOutro, total, semProlabore, incremental: Math.max(0, total.imposto - semProlabore.imposto) };
}

export function impostoSobreLucros({ retirada, receitaMensal, anexo, escrituracao }, t) {
  const margem = t.lucros.presuncao.margens[anexo] ?? 0;
  const limitePresuncao = escrituracao ? null : arredondar(receitaMensal * margem);
  const limiteMensal = emCentavos(t.lucros.limiteRetencaoMensal);
  const excessoPresuncao = limitePresuncao == null ? 0 : Math.max(0, retirada - limitePresuncao);
  const excessoMensal = escrituracao ? 0 : Math.max(0, retirada - limiteMensal);
  const base = Math.max(excessoPresuncao, excessoMensal);
  const aliquota = t.lucros.aliquotaRetencao;
  const retencao = arredondar(base * aliquota);
  return { limitePresuncao, margem, limiteMensal, excessoPresuncao, excessoMensal, base, aliquota, retencao, liquido: retirada - retencao };
}

export function simularCenario(P, ctx, t) {
  const anexo = anexoPara({ atividade: ctx.atividade, folhaMensal: ctx.folhaMensal, prolabore: P, receitaMensal: ctx.receitaMensal, rbt12: ctx.rbt12 }, t);
  const das = calcularDAS({ rbt12: ctx.rbt12, receitaMensal: ctx.receitaMensal, anexo }, t);
  const prev = calcularINSSProlabore({ prolabore: P, outraBase: ctx.outraBase }, t);
  const ir = calcularIRRFSocio({ prolabore: P, inss: prev.inss, outrasRendas: ctx.outrasRendas, outraBase: ctx.outraBase, dependentes: ctx.dependentes, pensao: ctx.pensao }, t);
  const prolaboreLiquido = P - prev.inss - ir.incremental;
  const lucroTotal = ctx.receitaMensal - das.das - ctx.despesas - ctx.folhaMensal - P;
  const disponivel = lucroTotal > 0 ? arredondar(lucroTotal * ctx.share) : 0;
  const falta = Math.max(0, ctx.meta - prolaboreLiquido);
  // Gross-up da retirada: sem contabilidade, a retencao de aliquota sobre o
  // excedente do lucro presumido corrige o liquido para baixo. Para entregar
  // a meta no bolso levanta-se um pouco mais de dividendos (retirada liquida =
  // retirada - a x (retirada - limite)+), evitando inflar o pro-labore so
  // para zerar a retencao.
  const info = impostoSobreLucros({ retirada: 0, receitaMensal: ctx.receitaMensal, anexo, escrituracao: ctx.escrituracao }, t);
  const limiteIsento = ctx.escrituracao ? Infinity : Math.min(info.limitePresuncao ?? Infinity, info.limiteMensal);
  const aliquotaDiv = info.aliquota;
  let retirada = falta;
  if (falta > limiteIsento && aliquotaDiv < 1) retirada = Math.ceil((falta - aliquotaDiv * limiteIsento) / (1 - aliquotaDiv)) + 1; // +1 centavo de folga contra arredondamento da retencao
  if (retirada > disponivel) retirada = disponivel;
  const div = impostoSobreLucros({ retirada, receitaMensal: ctx.receitaMensal, anexo, escrituracao: ctx.escrituracao }, t);
  const liquido = prolaboreLiquido + retirada - div.retencao;
  const fatorR = fatorRProjetado({ folhaMensal: ctx.folhaMensal, prolabore: P, receitaMensal: ctx.receitaMensal, rbt12: ctx.rbt12 }, t);
  return {
    prolabore: P, anexo, das, inss: prev.inss, baseINSS: prev.base, aliquotaINSS: prev.aliquota,
    irrf: ir.incremental, irInfo: ir, prolaboreLiquido, lucroTotal, disponivel,
    retirada, irLucros: div.retencao, detalheLucros: div, liquido,
    impostos: das.das + prev.inss + ir.incremental + div.retencao,
    atinge: liquido >= ctx.meta && lucroTotal >= 0, fatorR,
  };
}

export function otimizar(ctx, t, passo = 5000) {
  const teto = emCentavos(t.inss.teto);
  const minimo = Math.min(Math.max(ctx.prolaboreMin, 0), teto);
  let otimo = null;
  let melhor = null;
  for (let P = minimo; P <= teto; P += passo) {
    const c = simularCenario(P, ctx, t);
    if (!melhor || c.liquido > melhor.liquido) melhor = c;
    if (c.atinge && (!otimo || c.impostos < otimo.impostos)) otimo = c;
  }
  const tetoCenario = simularCenario(teto, ctx, t);
  if (!melhor || tetoCenario.liquido > melhor.liquido) melhor = tetoCenario;
  if (tetoCenario.atinge && (!otimo || tetoCenario.impostos < otimo.impostos)) otimo = tetoCenario;
  return { otimo, melhor, minimo, teto, passo, viavel: !!otimo };
}

export function cenarioTudoProlabore(ctx, t) {
  const teto = emCentavos(t.inss.teto);
  const liquida = ctx.receitaMensal - ctx.despesas - ctx.folhaMensal;
  const anexoBase = anexoPara({ atividade: ctx.atividade, folhaMensal: ctx.folhaMensal, prolabore: ctx.prolaboreMin, receitaMensal: ctx.receitaMensal, rbt12: ctx.rbt12 }, t);
  let P = Math.min(teto, Math.max(0, liquida - calcularDAS({ rbt12: ctx.rbt12, receitaMensal: ctx.receitaMensal, anexo: anexoBase }, t).das));
  for (let i = 0; i < 6; i++) {
    const das = calcularDAS({ rbt12: ctx.rbt12, receitaMensal: ctx.receitaMensal, anexo: anexoPara({ atividade: ctx.atividade, folhaMensal: ctx.folhaMensal, prolabore: P, receitaMensal: ctx.receitaMensal, rbt12: ctx.rbt12 }, t) }, t).das;
    P = Math.min(teto, Math.max(ctx.prolaboreMin, liquida - das));
  }
  const c = simularCenario(P, ctx, t);
  return { ...c, retirada: 0, irLucros: 0, liquido: c.prolaboreLiquido, impostos: c.das.das + c.inss + c.irrf, atinge: c.prolaboreLiquido >= ctx.meta };
}

export function faturamentoMinimo(ctx, t) {
  const testa = (receita) => {
    const c = { ...ctx, receitaMensal: receita, rbt12: Math.max(ctx.rbt12, receita * 12) };
    return otimizar(c, t).viavel;
  };
  if (testa(ctx.receitaMensal)) return ctx.receitaMensal;
  let alta = ctx.receitaMensal;
  for (let i = 0; i < 40 && !testa(alta); i++) alta = arredondar(alta * 1.5 + ctx.meta);
  if (!testa(alta)) return null;
  let baixa = ctx.receitaMensal;
  for (let i = 0; i < 40; i++) {
    const meio = arredondar((baixa + alta) / 2);
    if (meio === baixa || meio === alta) break;
    if (testa(meio)) alta = meio; else baixa = meio;
  }
  return alta;
}

export function calcular(e, t) {
  const receitaMensal = emCentavos(e.receitaMensal);
  const rbt12 = emCentavos(e.rbt12 ?? 0);
  const salarioMinimo = emCentavos(t.salarioMinimo.valor);
  const desejado = emCentavos(e.prolaboreMin ?? 0);
  const tetoINSS = emCentavos(t.inss.teto);
  const ctx = {
    meta: emCentavos(e.meta), atividade: e.atividade, receitaMensal, rbt12,
    despesas: emCentavos(e.despesas ?? 0), folhaMensal: emCentavos(e.folhaMensal ?? 0),
    folha12: emCentavos(e.folha12 ?? 0), semHistorico: !!e.semHistorico, escrituracao: !!e.escrituracao,
    outrasRendas: emCentavos(e.outrasRendas ?? 0), outraBase: emCentavos(e.inssOutro ?? 0),
    dependentes: e.dependentes ?? 0, pensao: emCentavos(e.pensao ?? 0),
    outrosDividendos: emCentavos(e.outrosDividendos ?? 0),
    numSocios: e.numSocios ?? 1, share: (e.participacao ?? 100) / 100, metaPorSocio: !!e.metaPorSocio,
    acimaMinimo: !!e.acimaMinimo, prolaboreMin: desejado > 0 ? desejado : salarioMinimo,
  };
  const found = otimizar(ctx, t);
  const cenarioA = simularCenario(Math.min(ctx.prolaboreMin, tetoINSS), ctx, t);
  const ponto = prolaborePontoFatorR({ folhaMensal: ctx.folhaMensal, receitaMensal, rbt12 }, t);
  const cenarioB = simularCenario(Math.min(Math.max(ponto, ctx.prolaboreMin), tetoINSS), ctx, t);
  const recomendado = found.otimo ?? found.melhor;
  const real = fatorRAtual({ folha12: ctx.semHistorico ? 0 : ctx.folha12, rbt12 }, t);
  const receitaMin = found.viavel ? null : faturamentoMinimo(ctx, t);
  const limiteME = emCentavos(t.simples.limiteME);
  const limiteSimples = emCentavos(t.simples.limite);
  const projAnual = receitaMensal * 12;
  const avisos = [];
  if (SEGMENTOS[ctx.atividade].anexo === 'FATOR_R') {
    const base = Math.max(rbt12, receitaMensal * 12, 1);
    const faltaFolha = Math.max(0, arredondar(t.simples.fatorR * base) - (ctx.folhaMensal + ctx.prolaboreMin) * 12);
    if (!ctx.semHistorico && real.razao < t.simples.fatorR) avisos.push('Fator R realizado em ' + pct(real.razao) + ' (corte ' + pct(t.simples.fatorR, 0) + '): hoje a empresa paga pelo Anexo V. Faltam ' + brl(faltaFolha) + ' de folha em 12 meses para o Anexo III.');
    if (ctx.semHistorico) avisos.push('Sem historico de folha, o projetado usa (funcionarios + pro-labore) x 12. O enquadramento oficial usa os ultimos 12 meses pagos, entao o DAS menor pode demorar ate um ano.');
    else avisos.push('O Fator R oficial usa os ultimos 12 meses: mesmo subindo o pro-labore hoje, o Anexo III so aparece quando a folha nova compoe o periodo.');
    const custo = (cenarioB.inss + cenarioB.irrf) - (cenarioA.inss + cenarioA.irrf);
    if (ponto > ctx.prolaboreMin && custo > 0) avisos.push('Chegar ao ponto do Fator R (' + brl(ponto) + ') custa ' + brl(custo) + '/mes a mais de INSS + IR, mas derruba o DAS de ' + brl(cenarioA.das.das) + ' para ' + brl(cenarioB.das.das) + '.');
  }
  if (projAnual > limiteSimples || rbt12 > limiteSimples) avisos.push('Receita acima do teto do Simples Nacional: a empresa e excluida do regime. Procure um contador com urgencia.');
  else if (projAnual > limiteME || rbt12 > limiteME) avisos.push('Acima do teto de ME (' + brl(limiteME) + '/ano): a empresa vira EPP, ainda no Simples, com aliquotas maiores.');
  else if (projAnual > arredondar(limiteME * 0.9) || rbt12 > arredondar(limiteME * 0.9)) avisos.push('Perto do teto de ME: ao virar EPP as aliquotas sobem.');
  if (!ctx.escrituracao && recomendado.detalheLucros.limitePresuncao != null && recomendado.retirada > recomendado.detalheLucros.limitePresuncao) avisos.push('Retirada acima do lucro presumido isento (' + brl(recomendado.detalheLucros.limitePresuncao) + '): sem contabilidade e balanco, o excedente sofre retencao de ' + pct(recomendado.detalheLucros.aliquota, 0) + '.');
  if (recomendado.retirada > emCentavos(t.lucros.limiteRetencaoMensal)) avisos.push(ctx.escrituracao ? 'Retirada acima do limite mensal por fonte: com escrituracao e balanco a retencao e dispensada.' : 'Retirada acima do limite mensal por fonte: retencao de ' + pct(recomendado.detalheLucros.aliquota, 0) + ' sobre o excedente.');
  if ((recomendado.retirada + ctx.outrosDividendos) * 12 > emCentavos(t.lucros.limiteImpostoMinimoAnual)) avisos.push('Somando outras fontes, os dividendos passam do patamar do imposto minimo anual: parte pode ser tributada na declaracao.');
  if (recomendado.prolabore < salarioMinimo) avisos.push('Pro-labore abaixo do salario minimo: a base minima do socio administrador e um salario minimo.');
  if (ctx.outraBase >= tetoINSS) avisos.push('O outro vinculo ja atinge o teto do INSS: nao ha INSS sobre o pro-labore, so IR.');
  else if (ctx.outraBase > 0) avisos.push('O teto do INSS e compartilhado: o pro-labore usa a folga de ' + brl(tetoINSS - ctx.outraBase) + '.');
  if (ctx.outrasRendas > 0) avisos.push('Outras rendas elevam a faixa do IR: o IRRF acima e a parcela marginal do pro-labore.');
  if (ctx.numSocios > 1) avisos.push(ctx.metaPorSocio ? 'Meta por socio com ' + ctx.numSocios + ' socios: a empresa precisa gerar ' + brl(ctx.meta * ctx.numSocios) + '/mes no total.' : 'Com ' + ctx.numSocios + ' socios, sua parte do lucro e ' + pct(ctx.share, 1) + ' do total.');
  if (recomendado.lucroTotal < 0) avisos.push({ texto: 'Atencao: nem com o pro-labore minimo a receita cobre DAS, despesas, folha e pro-labore (falta ' + brl(-recomendado.lucroTotal) + ').', critico: true });
  else if (recomendado.retirada > 0 && recomendado.disponivel - recomendado.retirada === 0) avisos.push('Todo o lucro do mes vai para o seu bolso e nada fica em caixa - o DAS vence no mes seguinte.');
  if (!found.viavel) avisos.push({ texto: 'Atencao: com este faturamento a meta de ' + brl(ctx.meta) + ' nao e alcancavel (melhor: ' + brl(found.melhor.liquido) + ').' + (receitaMin ? ' Minimo estimado: ' + brl(receitaMin) + '/mes.' : ''), critico: true });
  if (recomendado.anexo === 'IV') avisos.push('No Anexo IV a contribuicao patronal nao esta no DAS: e recolhida a parte.');
  if (ctx.acimaMinimo) avisos.push('Voce optou por contribuir acima do minimo: o otimo prioriza menos imposto; suba o pro-labore para turbinar a aposentadoria.');
  avisos.push('O pro-labore gera direitos previdenciarios e o minimo e obrigatorio para o socio administrador: emita a folha e recolha o INSS.');
  return {
    meta: ctx.meta, atividade: e.atividade, receitaMensal, rbt12, ctx, salarioMinimo, tetoINSS,
    recomendado, cenarioA, cenarioB, cenarioC: recomendado, cenarioD: cenarioTudoProlabore(ctx, t),
    pontoFatorR: ponto, fatorRReal: real, viavel: found.viavel, melhor: found.melhor, receitaMin,
    reserva: Math.max(0, recomendado.disponivel - recomendado.retirada),
    parametros: { vigencia: t.vigencia, salarioMinimo, tetoINSS, corteFatorR: t.simples.fatorR, limiteME, limiteRetencao: emCentavos(t.lucros.limiteRetencaoMensal) },
    avisos,
  };
}

function linhaCenario(nome, c, meta) {
  return [nome, brl(c.prolabore), brl(c.retirada), 'Anexo ' + c.anexo + ' ' + brl(c.das.das), brl(c.inss), brl(c.irrf), brl(c.irLucros), brl(c.liquido), brl(c.impostos), c.atinge ? 'Atinge a meta' : 'Abaixo da meta (' + brl(meta) + ')'];
}

export function exibir(r) {
  const c = r.recomendado;
  const fr = SEGMENTOS[r.atividade].anexo === 'FATOR_R' ? 'Anexo ' + c.anexo + ' pelo Fator R projetado (' + pct(c.fatorR.razao) + ')' : 'Anexo ' + c.anexo;
  const detalhes = [
    { descricao: 'Meta liquida mensal', valor: brl(r.meta) },
    { descricao: 'Anexo aplicado', valor: fr },
    { descricao: 'Fator R realizado (folha paga / RBT12)', valor: r.ctx.semHistorico ? 'sem historico' : pct(r.fatorRReal.razao) + ' -> Anexo ' + r.fatorRReal.anexo },
    { descricao: 'Fator R projetado com o recomendado', valor: pct(c.fatorR.razao) + ' -> Anexo ' + c.fatorR.anexo },
    { descricao: 'Aliquota efetiva: (RBT12 x nominal - parcela) / RBT12', valor: pct(c.das.efetiva) + ' (nominal ' + pct(c.das.nominal, 1) + ', faixa ' + c.das.faixa + ')' },
    { descricao: 'DAS do mes (vence dia 20)', valor: brl(c.das.das) },
    { descricao: 'INSS do socio (GPS dia 20 do mes seguinte)', valor: brl(c.inss) },
    ...detalheIRRF(c.irInfo.total, 'IRRF total (pro-labore + outras rendas)'),
    { descricao: 'IRRF atribuido ao pro-labore', valor: brl(c.irrf) },
    { descricao: 'Lucro total do mes', valor: brl(Math.max(0, c.lucroTotal)) },
    { descricao: 'Sua parte no lucro', valor: brl(c.disponivel) },
    { descricao: 'IR sobre a retirada', valor: brl(c.irLucros) },
    { descricao: 'Reserva em caixa', valor: brl(r.reserva) },
  ];
  const pctReceita = r.receitaMensal > 0 ? c.impostos / r.receitaMensal : 0;
  const avisosTxt = r.avisos.map((a) => (typeof a === 'string' ? a : a.texto));
  if (r.avisos.some((a) => typeof a !== 'string' && a.critico)) avisosTxt.unshift('Corrija os campos destacados antes de considerar o resultado.');
  return {
    resumo: [
      { rotulo: c.atinge ? 'Liquido total no bolso (meta atingida)' : 'Liquido total no bolso (abaixo da meta)', valor: brl(c.liquido), destaque: true },
      { rotulo: 'Pro-labore recomendado', valor: brl(c.prolabore) },
      { rotulo: 'Retirada de lucro recomendada', valor: brl(c.retirada) },
      { rotulo: 'Total de impostos no mes', valor: brl(c.impostos) + ' (' + pct(pctReceita, 1) + ' da receita)' },
      { rotulo: 'Reserva em caixa', valor: brl(r.reserva) },
    ],
    detalhes,
    tabela: {
      titulo: 'Comparativo de cenarios A, B, C e D',
      arquivo: 'me-cenarios.csv',
      colunas: ['Cenario', 'Pro-labore', 'Retirada', 'DAS', 'INSS', 'IRRF', 'IR lucros', 'Liquido', 'Impostos', 'Meta'],
      linhas: [linhaCenario('(A) Minimo', r.cenarioA, r.meta), linhaCenario('(B) Ponto Fator R', r.cenarioB, r.meta), linhaCenario('(C) Otimo', r.cenarioC, r.meta), linhaCenario('(D) Tudo pro-labore', r.cenarioD, r.meta)],
    },
    avisos: [...avisosTxt, AVISO_ESTIMATIVA, 'Simulacao com as tabelas vigentes - valide com o contador antes de colocar em pratica.'],
    copiar: 'ME: pro-labore ' + brl(c.prolabore) + ' + lucros ' + brl(c.retirada) + ' = ' + brl(c.liquido) + ' (' + (c.atinge ? 'meta ok' : 'abaixo da meta') + '). Impostos ' + brl(c.impostos) + '.',
  };
}
