// INSS e IRRF. Todas as faixas vêm de data/tabelas.json; nada fixo aqui.
// Entradas e saídas em CENTAVOS inteiros.

import { arredondar, emCentavos } from '../core/moeda.js';

/** INSS progressivo (cada faixa só incide sobre a parcela que cai nela), limitado ao teto. */
export function calcularINSS(baseCentavos, tabelas) {
  const { faixas, teto } = tabelas.inss;
  const base = Math.min(Math.max(0, baseCentavos), emCentavos(teto));
  let total = 0;
  let anterior = 0;
  for (const f of faixas) {
    const limite = emCentavos(f.ate);
    if (base > anterior) total += (Math.min(base, limite) - anterior) * f.aliquota;
    anterior = limite;
    if (base <= limite) break;
  }
  return arredondar(total);
}

/**
 * IRRF mensal (também usado no 13º, que é tributado separadamente).
 * Aplica a dedução mais vantajosa (legal ou desconto simplificado) e, se `aplicarReducao`,
 * a redução da Lei 15.270/2025 sobre o rendimento tributável bruto.
 * Com `decimoTerceiro: true`, usa a tabela própria do 13º (limites e parcela ÷ 2,
 * Lei 7.713/1988, art. 12, §1º); a redução também se aplica ao 13º (Lei 15.270/2025, art. 3º-A, §3º).
 */
export function calcularIRRF({ rendimento, inss, dependentes = 0, deducaoExtra = 0, aplicarReducao = true, decimoTerceiro = false }, tabelas) {
  const t = tabelas.irrf;
  const faixas = decimoTerceiro && Array.isArray(t.faixasDecimoTerceiro) ? t.faixasDecimoTerceiro : t.faixas;
  const deducaoLegal = inss + dependentes * emCentavos(t.deducaoDependente) + deducaoExtra;
  const simplificado = emCentavos(t.descontoSimplificado);
  const usouSimplificado = simplificado > deducaoLegal;
  const deducao = usouSimplificado ? simplificado : deducaoLegal;
  const base = Math.max(0, rendimento - deducao);

  let imposto = 0;
  let aliquota = 0;
  for (const f of faixas) {
    if (f.ate === null || base <= emCentavos(f.ate)) {
      aliquota = f.aliquota;
      imposto = Math.max(0, arredondar(base * f.aliquota - emCentavos(f.parcela)));
      break;
    }
  }

  let reducao = 0;
  const r = t.reducao;
  if (aplicarReducao && r && imposto > 0) {
    if (rendimento <= emCentavos(r.limiteIsencao)) {
      reducao = Math.min(imposto, emCentavos(r.maximoIsencao));
    } else if (rendimento < emCentavos(r.limiteSuperior)) {
      reducao = Math.min(imposto, Math.max(0, arredondar(emCentavos(r.constante) - r.fator * rendimento)));
    }
  }

  return { base, deducao, usouSimplificado, aliquota, impostoTabela: imposto, reducao, imposto: imposto - reducao };
}
