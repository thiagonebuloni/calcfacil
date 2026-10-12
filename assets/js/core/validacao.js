// Validação simples de campos. Cada função devolve uma mensagem de erro (string) ou null.

export const ehNumero = (v) => typeof v === 'number' && Number.isFinite(v);

export function numero(v, rotulo, { min = -Infinity, max = Infinity, inteiro = false } = {}) {
  if (!ehNumero(v)) return `Informe um valor válido em "${rotulo}".`;
  if (inteiro && !Number.isInteger(v)) return `"${rotulo}" deve ser um número inteiro.`;
  if (v < min) return `"${rotulo}" deve ser no mínimo ${String(min).replace('.', ',')}.`;
  if (v > max) return `"${rotulo}" deve ser no máximo ${String(max).replace('.', ',')}.`;
  return null;
}

export function dataValida(v, rotulo) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(v ?? '')) && !Number.isNaN(Date.parse(v))
    ? null
    : `Informe uma data válida em "${rotulo}".`;
}

/** Junta as mensagens não nulas em um objeto {campo: mensagem}. */
export function reunir(mapa) {
  const erros = {};
  for (const [campo, msg] of Object.entries(mapa)) if (msg) erros[campo] = msg;
  return erros;
}
