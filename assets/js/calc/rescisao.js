// Rescisão de contrato de trabalho (CLT). Estimativa para os casos mais comuns.
// Regras: Lei 12.506/2011 (aviso proporcional), CLT art. 484-A (acordo), Lei 8.036/1990 (FGTS).

import { arredondar, emCentavos, formatarBRL as brl } from '../core/moeda.js';
import { numero, dataValida, reunir } from '../core/validacao.js';
import {
  parseISO, diasNoMes, addDias, formatarBR, anosCompletos, avosEntre, ultimoAniversario, avos13NoAno,
} from '../core/datas.js';
import { calcularINSS, calcularIRRF } from './impostos.js';
import { holerite, detalheIRRF, AVISO_ESTIMATIVA } from './apresentacao.js';

export const TIPOS = {
  sem_justa_causa: 'Dispensa sem justa causa',
  pedido_demissao: 'Pedido de demissão',
  justa_causa: 'Dispensa por justa causa',
  acordo: 'Acordo entre as partes (art. 484-A)',
};

export function validar(e) {
  const erros = reunir({
    salario: numero(e.salario, 'Salário bruto', { min: 0.01 }),
    admissao: dataValida(e.admissao, 'Data de admissão'),
    demissao: dataValida(e.demissao, 'Data de demissão'),
    dependentes: numero(e.dependentes ?? 0, 'Dependentes', { min: 0, max: 20, inteiro: true }),
    saldoFgts: numero(e.saldoFgts ?? 0, 'Saldo do FGTS', { min: 0 }),
  });
  if (!TIPOS[e.tipo]) erros.tipo = 'Escolha o tipo de rescisão.';
  if (!erros.admissao && !erros.demissao && e.demissao < e.admissao) {
    erros.demissao = 'A data de demissão deve ser igual ou posterior à de admissão.';
  }
  if (e.aviso === 'dispensado' && e.tipo !== 'pedido_demissao' && e.tipo !== 'justa_causa') {
    erros.aviso = '"Dispensado pelo empregador" só se aplica ao pedido de demissão.';
  }
  return erros;
}

export function calcular(e, t) {
  const sal = emCentavos(e.salario);
  const dep = e.dependentes ?? 0;
  const justa = e.tipo === 'justa_causa';
  const semJusta = e.tipo === 'sem_justa_causa';
  const acordo = e.tipo === 'acordo';
  const pedido = e.tipo === 'pedido_demissao';
  const aviso = justa ? 'nenhum' : e.aviso;

  const pa = parseISO(e.admissao), pd = parseISO(e.demissao);

  // Saldo de salário (base comercial de 30 dias)
  const mesmoMes = pa.a === pd.a && pa.m === pd.m;
  const inicioMes = mesmoMes ? pa.d : 1;
  let diasSaldo = pd.d - inicioMes + 1;
  if (inicioMes === 1 && pd.d === diasNoMes(pd.a, pd.m)) diasSaldo = 30;
  diasSaldo = Math.min(30, diasSaldo);
  const saldoSalario = arredondar((sal * diasSaldo) / 30);

  // Aviso prévio
  const anos = anosCompletos(e.admissao, e.demissao);
  const ap = t.avisoPrevio;
  const diasAviso = Math.min(ap.maximo, ap.diasBase + ap.diasPorAno * anos);
  let avisoPago = 0;
  if ((semJusta || acordo) && aviso === 'indenizado') {
    const cheio = arredondar((sal * diasAviso) / 30);
    avisoPago = acordo ? arredondar(cheio / 2) : cheio;
  }
  const descontoAviso = pedido && aviso === 'indenizado' ? sal : 0;
  const projeta = (semJusta || acordo) && aviso === 'indenizado';
  const fimProjetado = projeta ? addDias(e.demissao, diasAviso) : e.demissao;

  // 13º proporcional
  let avos13 = 0;
  if (!justa) {
    const anoFim = parseISO(fimProjetado).a;
    for (let ano = pd.a; ano <= anoFim; ano++) avos13 += Math.min(12, avos13NoAno(e.admissao, fimProjetado, ano));
  }
  const decimoTerceiro = arredondar((sal * avos13) / 12);

  // Férias proporcionais (+ 1/3) e vencidas (+ 1/3)
  let avosFerias = 0;
  if (!justa) avosFerias = avosEntre(ultimoAniversario(e.admissao, e.demissao), fimProjetado);
  const feriasProp = arredondar((sal * avosFerias) / 12);
  const tercoProp = arredondar(feriasProp / 3);
  const feriasVenc = e.feriasVencidas ? sal : 0;
  const tercoVenc = e.feriasVencidas ? arredondar(sal / 3) : 0;

  // Descontos: INSS e IRRF incidem sobre saldo de salário e 13º (bases separadas).
  // O aviso prévio indenizado não sofre INSS, mas entra na base do IRRF (tributável).
  // Férias indenizadas (vencidas e proporcionais, com o 1/3) são isentas de INSS e de IRRF.
  const inssSaldo = calcularINSS(saldoSalario, t);
  const irSaldo = calcularIRRF({ rendimento: saldoSalario + avisoPago, inss: inssSaldo, dependentes: dep }, t);
  const inss13 = calcularINSS(decimoTerceiro, t);
  const ir13 = calcularIRRF(
    {
      rendimento: decimoTerceiro, inss: inss13, dependentes: dep, decimoTerceiro: true,
      aplicarReducao: t.irrf.reducao?.aplicaAoDecimoTerceiro !== false,
    },
    t,
  );

  const totalProventos =
    saldoSalario + avisoPago + decimoTerceiro + feriasProp + tercoProp + feriasVenc + tercoVenc;
  const totalDescontos = inssSaldo + irSaldo.imposto + inss13 + ir13.imposto + descontoAviso;
  const liquido = totalProventos - totalDescontos;

  // FGTS: 8% sobre todas as verbas de natureza salarial — saldo, 13º, aviso indenizado
  // e férias vencidas/proporcionais com o 1/3 (Lei 8.036/1990, art. 15, §1º).
  const baseFgts = saldoSalario + decimoTerceiro + avisoPago + feriasProp + tercoProp + feriasVenc + tercoVenc;
  const deposito = arredondar(baseFgts * t.fgts.aliquotaDeposito);
  const saldoInformado = emCentavos(e.saldoFgts ?? 0);
  const percMulta = semJusta ? t.fgts.multaSemJustaCausa : acordo ? t.fgts.multaAcordo : 0;
  const multa = arredondar((saldoInformado + deposito) * percMulta);
  let saque = 0;
  if (semJusta) saque = saldoInformado + deposito + multa;
  else if (acordo) saque = arredondar((saldoInformado + deposito + multa) * t.fgts.saqueAcordo);

  return {
    tipo: e.tipo, aviso, anos, diasSaldo, saldoSalario, diasAviso, avisoPago, descontoAviso, fimProjetado, projeta,
    avos13, decimoTerceiro, avosFerias, feriasProp, tercoProp, feriasVenc, tercoVenc,
    inssSaldo, irSaldo, inss13, ir13, totalProventos, totalDescontos, liquido,
    fgts: { base: baseFgts, deposito, saldoInformado, percMulta, multa, saque },
    pagarAte: addDias(e.demissao, 10),
  };
}

export function exibir(r) {
  const proventos = [{ descricao: 'Saldo de salário', referencia: `${r.diasSaldo} dias`, valor: r.saldoSalario }];
  if (r.avisoPago > 0) {
    proventos.push({ descricao: r.tipo === 'acordo' ? 'Aviso prévio indenizado (50%)' : 'Aviso prévio indenizado', referencia: `${r.diasAviso} dias`, valor: r.avisoPago });
  }
  if (r.decimoTerceiro > 0) proventos.push({ descricao: '13º proporcional', referencia: `${r.avos13}/12`, valor: r.decimoTerceiro });
  if (r.feriasProp > 0) {
    proventos.push({ descricao: 'Férias proporcionais', referencia: `${r.avosFerias}/12`, valor: r.feriasProp });
    proventos.push({ descricao: '1/3 sobre férias proporcionais', valor: r.tercoProp });
  }
  if (r.feriasVenc > 0) {
    proventos.push({ descricao: 'Férias vencidas', referencia: '1 período', valor: r.feriasVenc });
    proventos.push({ descricao: '1/3 sobre férias vencidas', valor: r.tercoVenc });
  }
  const descontos = [
    { descricao: 'INSS sobre saldo de salário', valor: r.inssSaldo },
    { descricao: r.avisoPago > 0 ? 'IRRF sobre saldo de salário e aviso indenizado' : 'IRRF sobre saldo de salário', valor: r.irSaldo.imposto },
  ];
  if (r.decimoTerceiro > 0) {
    descontos.push({ descricao: 'INSS sobre 13º', valor: r.inss13 });
    descontos.push({ descricao: 'IRRF sobre 13º', valor: r.ir13.imposto });
  }
  if (r.descontoAviso > 0) descontos.push({ descricao: 'Aviso prévio não cumprido', valor: r.descontoAviso });

  const avisos = [];
  if (r.liquido < 0) avisos.push('Os descontos superam as verbas: o resultado negativo indica valor que o empregado deveria ao empregador.');
  if (r.tipo === 'justa_causa') avisos.push('Na justa causa não há aviso prévio, 13º proporcional, férias proporcionais, multa nem saque do FGTS.');
  if (r.tipo === 'pedido_demissao') avisos.push('No pedido de demissão não há multa do FGTS, saque do FGTS nem seguro-desemprego.');
  if (r.tipo === 'acordo') avisos.push('No acordo: metade do aviso indenizado, multa de 20%, saque de até 80% do FGTS e sem seguro-desemprego.');
  if (r.avisoPago > 0) avisos.push('O aviso prévio indenizado não sofre INSS, mas entra na base do IRRF.');
  if (r.projeta) avisos.push(`O aviso indenizado projeta o contrato até ${formatarBR(r.fimProjetado)}, o que soma meses ao 13º e às férias proporcionais.`);
  avisos.push('Não inclui horas extras, adicionais, comissões, estabilidades, férias em dobro, 13º já antecipado nem descontos como vale-transporte e pensão.');
  avisos.push(AVISO_ESTIMATIVA);

  const f = r.fgts;
  const detalhes = [
    { descricao: 'Tempo de serviço (anos completos)', valor: String(r.anos) },
    { descricao: 'Dias de aviso prévio devidos', valor: String(r.diasAviso) },
    { descricao: 'Base de cálculo do FGTS (saldo, 13º, aviso e férias — Lei 8.036, art. 15)', valor: brl(f.base) },
    { descricao: 'FGTS a depositar sobre as verbas rescisórias (8%)', valor: brl(f.deposito) },
    ...(f.percMulta > 0 ? [{ descricao: `Multa do FGTS (${Math.round(f.percMulta * 100)}%), paga pelo empregador`, valor: brl(f.multa) }] : []),
    ...(f.saque > 0 ? [{ descricao: r.tipo === 'acordo' ? 'Saque estimado do FGTS (até 80%)' : 'Saque estimado do FGTS', valor: brl(f.saque) }] : []),
    ...detalheIRRF(r.irSaldo, r.avisoPago > 0 ? 'IRRF do saldo e do aviso indenizado' : 'IRRF do saldo de salário'),
    ...(r.decimoTerceiro > 0 ? detalheIRRF(r.ir13, 'IRRF do 13º') : []),
  ];

  return {
    resumo: [
      { rotulo: 'Valor líquido da rescisão', valor: brl(r.liquido), destaque: true },
      { rotulo: 'Total bruto das verbas', valor: brl(r.totalProventos) },
      ...(f.multa > 0 ? [{ rotulo: 'Multa do FGTS (à parte)', valor: brl(f.multa) }] : []),
      { rotulo: 'Prazo para pagamento', valor: formatarBR(r.pagarAte) },
    ],
    holerite: holerite(proventos, descontos),
    detalhes,
    avisos,
    copiar: `Rescisão (${TIPOS[r.tipo]}): bruto ${brl(r.totalProventos)}; descontos ${brl(r.totalDescontos)}; líquido ${brl(r.liquido)}; multa FGTS ${brl(f.multa)}.`,
  };
}
