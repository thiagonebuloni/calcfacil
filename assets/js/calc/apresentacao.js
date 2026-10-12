// Ajudantes de apresentação (sem DOM): transformam números em estruturas prontas para exibir.

import { formatarBRL, formatarPercentual } from '../core/moeda.js';

const brl = formatarBRL;

/** Monta o "contracheque": proventos x descontos, com totais. Valores em centavos. */
export function holerite(proventos, descontos) {
  const totalProventos = proventos.reduce((s, l) => s + l.valor, 0);
  const totalDescontos = descontos.reduce((s, l) => s + l.valor, 0);
  const fmt = (l) => ({ descricao: l.descricao, referencia: l.referencia ?? '', valor: brl(l.valor) });
  return {
    proventos: proventos.map(fmt),
    descontos: descontos.map(fmt),
    totalProventos: brl(totalProventos),
    totalDescontos: brl(totalDescontos),
    liquido: brl(totalProventos - totalDescontos),
  };
}

/** Linhas de apoio explicando como o IRRF foi obtido. */
export function detalheIRRF(ir, rotulo = 'IRRF') {
  const linhas = [
    { descricao: `${rotulo}: base de cálculo`, valor: brl(ir.base) },
    {
      descricao: `${rotulo}: dedução aplicada (${ir.usouSimplificado ? 'desconto simplificado' : 'INSS + dependentes'})`,
      valor: brl(ir.deducao),
    },
    { descricao: `${rotulo}: alíquota da faixa`, valor: formatarPercentual(ir.aliquota, 1) },
    { descricao: `${rotulo}: imposto pela tabela`, valor: brl(ir.impostoTabela) },
  ];
  if (ir.reducao > 0) linhas.push({ descricao: `${rotulo}: redução (Lei 15.270/2025)`, valor: '− ' + brl(ir.reducao) });
  linhas.push({ descricao: `${rotulo}: imposto devido`, valor: brl(ir.imposto) });
  return linhas;
}

export const AVISO_ESTIMATIVA =
  'Resultado estimado, com base na legislação e nas tabelas vigentes. Convenções coletivas, parcelas variáveis e situações específicas podem alterar o valor final.';
