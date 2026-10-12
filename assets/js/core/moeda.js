// Utilitários de dinheiro. Toda a aritmética monetária usa CENTAVOS INTEIROS.

/** Arredonda removendo ruído de ponto flutuante (ex.: 20068.499999999996 -> 20069). */
export function arredondar(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.round(Number(x.toPrecision(12)));
}

/** Reais (number) -> centavos inteiros. */
export function emCentavos(reais) {
  return arredondar(Number(reais) * 100);
}

/** Centavos inteiros -> reais (number), apenas para exibição/entrada de fórmulas. */
export function emReais(centavos) {
  return centavos / 100;
}

const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtNum = (casas) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** Centavos -> "R$ 1.234,56". */
export function formatarBRL(centavos) {
  return fmtBRL.format(centavos / 100);
}

/** Número comum no padrão brasileiro: 1234.5 -> "1.234,50". */
export function formatarNumero(n, casas = 2) {
  return fmtNum(casas).format(n);
}

/** 0.0875 -> "8,75%". */
export function formatarPercentual(fracao, casas = 2) {
  return formatarNumero(fracao * 100, casas) + '%';
}

/**
 * Converte texto digitado em número. Aceita "1.234,56", "1234,56", "1234.56", "R$ 1.500".
 * Retorna NaN se não for possível interpretar.
 */
export function parseNumero(texto) {
  if (typeof texto === 'number') return texto;
  let s = String(texto ?? '').replace(/R\$|%|\s/g, '');
  if (s === '') return NaN;
  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^-?\d+\.\d{1,2}$/.test(s)) {
    // "1234.5" ou "1234.56": ponto decimal
  } else {
    s = s.replace(/\./g, '');
  }
  if (!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
  return Number(s);
}
