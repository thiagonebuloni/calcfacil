// Datas em formato ISO (aaaa-mm-dd), tratadas em UTC para evitar problemas de fuso/horário de verão.

const DIA_MS = 86400000;

/** Interpreta "aaaa-mm-dd". Retorna {a, m, d} ou null se inválida. */
export function parseISO(iso) {
  const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
  if (!r) return null;
  const a = +r[1], m = +r[2], d = +r[3];
  const t = new Date(Date.UTC(a, m - 1, d));
  if (t.getUTCFullYear() !== a || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return null;
  return { a, m, d };
}

export function paraISO({ a, m, d }) {
  return `${String(a).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const utc = (iso) => {
  const p = parseISO(iso);
  return Date.UTC(p.a, p.m - 1, p.d);
};

export function diasNoMes(a, m) {
  return new Date(Date.UTC(a, m, 0)).getUTCDate();
}

export function ultimoDiaDoMes(iso) {
  const { a, m } = parseISO(iso);
  return diasNoMes(a, m);
}

/** Soma (ou subtrai) dias. */
export function addDias(iso, n) {
  const t = new Date(utc(iso) + n * DIA_MS);
  return paraISO({ a: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() });
}

/** Soma meses mantendo o dia, limitado ao último dia do mês de destino. */
export function addMeses(iso, n) {
  const p = parseISO(iso);
  const total = p.a * 12 + (p.m - 1) + n;
  const a = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return paraISO({ a, m, d: Math.min(p.d, diasNoMes(a, m)) });
}

/** Diferença em dias (fim - inicio). */
export function diffDias(inicio, fim) {
  return Math.round((utc(fim) - utc(inicio)) / DIA_MS);
}

/** "2026-09-15" -> "15/09/2026". */
export function formatarBR(iso) {
  const p = parseISO(iso);
  return `${String(p.d).padStart(2, '0')}/${String(p.m).padStart(2, '0')}/${p.a}`;
}

/** Meses completos entre duas datas (inicio <= fim) e dias restantes (contagem inclusiva do último dia). */
export function mesesEDias(inicio, fim) {
  const i = parseISO(inicio), f = parseISO(fim);
  let meses = (f.a - i.a) * 12 + (f.m - i.m);
  if (f.d < i.d) meses -= 1;
  if (meses < 0) return { meses: 0, dias: 0 };
  const ancora = addMeses(inicio, meses);
  const dias = diffDias(ancora, fim) + 1;
  return { meses, dias };
}

/** Anos completos de serviço entre admissão e demissão. */
export function anosCompletos(inicio, fim) {
  const i = parseISO(inicio), f = parseISO(fim);
  let anos = f.a - i.a;
  if (f.m < i.m || (f.m === i.m && f.d < i.d)) anos -= 1;
  return Math.max(0, anos);
}

/**
 * "Avos" no padrão trabalhista: cada mês com 15 dias ou mais conta como 1/12.
 * Aqui: meses completos + 1 se o resto tiver 15 dias ou mais.
 */
export function avosEntre(inicio, fim) {
  const { meses, dias } = mesesEDias(inicio, fim);
  return meses + (dias >= 15 ? 1 : 0);
}

/** Último aniversário de `base` que seja menor ou igual a `ref`. */
export function ultimoAniversario(base, ref) {
  return addMeses(base, anosCompletos(base, ref) * 12);
}

/** Avos de 13º dentro de um ano civil: meses com 15 ou mais dias trabalhados. */
export function avos13NoAno(admissao, fim, ano) {
  let total = 0;
  for (let m = 1; m <= 12; m++) {
    const primeiro = paraISO({ a: ano, m, d: 1 });
    const fimMes = paraISO({ a: ano, m, d: diasNoMes(ano, m) });
    const de = admissao > primeiro ? admissao : primeiro;
    const ate = fim < fimMes ? fim : fimMes;
    if (ate < de) continue;
    if (diffDias(de, ate) + 1 >= 15) total++;
  }
  return total;
}
