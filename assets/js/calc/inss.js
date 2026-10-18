// Estimativa de aposentadoria do INSS (MVP): regra permanente, pontos,
// idade mínima progressiva e pedágio de 100% (EC 103/2019).
// Sem acesso ao CNIS: usa a média informada e a projeta com o salário atual.

import { arredondar, emCentavos, formatarBRL as brl, formatarNumero } from '../core/moeda.js';
import { numero, dataValida, reunir } from '../core/validacao.js';
import { AVISO_ESTIMATIVA } from './apresentacao.js';

const MESES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
// Corte da reforma: 13/11/2019 (em granularidade mensal, nov/2019).
const CORTE_ANO = 2019, CORTE_MES = 11;
const IDADE_MAXIMA_MESES = 1200; // projeção até os 100 anos

const anoMesDe = (d) => ({ ano: d.getFullYear(), mes: d.getMonth() + 1 });

/** Meses completos entre o nascimento (AAAA-MM-DD) e a referência. */
function idadeMeses(ref, nascISO) {
  const [a, m, d] = String(nascISO).split('-').map(Number);
  let total = (ref.getFullYear() - a) * 12 + (ref.getMonth() + 1 - m);
  if (ref.getDate() < d) total -= 1;
  return total;
}

function somarMeses(ano, mes, f) {
  const total = mes - 1 + f;
  return { ano: ano + Math.floor(total / 12), mes: (total % 12) + 1 };
}

/** Meta vigente no ano de concessão (tabelas ano a ano; além do último, vale o último). */
function metaAnual(porAno, ano, sexo) {
  let meta = porAno[0][sexo];
  for (const e of porAno) if (e.ano <= ano) meta = e[sexo];
  return meta;
}

function fmtTempo(meses) {
  const a = Math.floor(meses / 12), m = meses % 12;
  if (a === 0) return `${m} ${m === 1 ? 'mês' : 'meses'}`;
  if (m === 0) return `${a} ${a === 1 ? 'ano' : 'anos'}`;
  return `${a} ${a === 1 ? 'ano' : 'anos'} e ${m} ${m === 1 ? 'mês' : 'meses'}`;
}

const fmtData = (ano, mes) => `${MESES_PT[mes - 1]} de ${ano}`;

export function validar(e) {
  const agora = new Date();
  const erros = reunir({
    sexo: ['mulher', 'homem'].includes(e.sexo) ? null : 'Escolha "Mulher" ou "Homem".',
    nascimento: dataValida(e.nascimento, 'Data de nascimento'),
    tempoAnos: numero(e.tempoAnos, 'Anos de contribuição', { min: 0, max: 80, inteiro: true }),
    tempoMeses: numero(e.tempoMeses, 'Meses de contribuição', { min: 0, max: 11, inteiro: true }),
    media: numero(e.media, 'Média dos salários', { min: 1 }),
  });
  if (e.salarioAtual !== undefined) {
    const m = numero(e.salarioAtual, 'Salário atual', { min: 1 });
    if (m) erros.salarioAtual = m;
  }
  if (e.em2019 !== undefined) {
    const m = numero(e.em2019, 'Contribuição em 11/2019', { min: 0, max: 80 });
    if (m) erros.em2019 = m;
  }
  if (!erros.nascimento) {
    if (Number.isNaN(Date.parse(e.nascimento)) || new Date(`${e.nascimento}T12:00:00`) > agora) {
      erros.nascimento = 'A data de nascimento não pode estar no futuro.';
    } else {
      const idade = idadeMeses(agora, e.nascimento);
      if (idade > 1320) erros.nascimento = 'Confira a data de nascimento.';
      else if (!erros.tempoAnos && !erros.tempoMeses) {
        const total = e.tempoAnos * 12 + e.tempoMeses;
        if (total < 1) erros.tempoAnos = 'Informe ao menos 1 mês de contribuição.';
        else if (total > idade - 14 * 12) erros.tempoAnos = 'Tempo de contribuição maior que o possível para a idade (conta a partir dos 14 anos).';
      }
    }
  }
  if (!erros.em2019 && e.em2019 !== undefined && !erros.tempoAnos && !erros.tempoMeses) {
    if (Math.round(e.em2019 * 12) > e.tempoAnos * 12 + e.tempoMeses) {
      erros.em2019 = 'Não pode ser maior que o tempo total de contribuição.';
    }
  }
  return erros;
}
export function calcular(e, t, hoje = new Date()) {
  const R = t.aposentadoriaInss;
  const sexo = e.sexo;
  const anoRef = hoje.getFullYear(), mesRef = hoje.getMonth() + 1;
  const idade0 = idadeMeses(hoje, e.nascimento);
  const T0 = e.tempoAnos * 12 + e.tempoMeses;
  const mediaC = emCentavos(e.media);
  const salC = emCentavos(e.salarioAtual !== undefined ? e.salarioAtual : e.media);
  const piso = emCentavos(t.salarioMinimo.valor);
  const teto = emCentavos(t.inss.teto);
  const limite = Math.max(0, IDADE_MAXIMA_MESES - idade0);

  const reqPerm = R.permanente[sexo];
  const reqCP = R.pontos.contribuicaoAnos[sexo] * 12;
  const reqCI = R.idadeProgressiva.contribuicaoAnos[sexo] * 12;
  const reqPed = R.pedagio100[sexo];

  const decorrido = (anoRef - CORTE_ANO) * 12 + (mesRef - CORTE_MES);
  let c2019, pedagioSuposto;
  if (e.em2019 !== undefined) { c2019 = Math.round(e.em2019 * 12); pedagioSuposto = false; }
  else { c2019 = T0 - decorrido; pedagioSuposto = true; }
  const pedagioAplica = e.em2019 !== undefined || c2019 > 0;
  const pedagioTotal = reqPed.contribuicaoAnos * 12 * 2 - c2019;

  const projetar = (ok) => {
    for (let f = 0; f <= limite; f++) {
      const sm = somarMeses(anoRef, mesRef, f);
      if (ok(f, sm.ano)) return { f, ano: sm.ano, mes: sm.mes };
    }
    return null;
  };
  const beneficioDe = (f, coef) => {
    const mediaFinal = arredondar((mediaC * T0 + salC * f) / (T0 + f));
    const bruto = arredondar(mediaFinal * coef);
    return { mediaFinal, bruto, valor: Math.min(teto, Math.max(piso, bruto)) };
  };
  const coefComum = (f) => {
    const anos = Math.floor((T0 + f) / 12);
    const base = sexo === 'mulher' ? R.coeficiente.anosBaseMulher : R.coeficiente.anosBaseHomem;
    return Math.min(1, R.coeficiente.base + R.coeficiente.adicionalPorAno * Math.max(0, anos - base));
  };
  const montar = (id, nome, proj, coefFn, extra) => {
    if (!proj) return { id, nome, aplica: true, alcanca: false };
    const coef = coefFn(proj.f);
    const b = beneficioDe(proj.f, coef);
    const base = {
      id, nome, aplica: true, alcanca: true,
      faltaMeses: proj.f, ano: proj.ano, mes: proj.mes,
      idadeMeses: idade0 + proj.f, contribMeses: T0 + proj.f,
      coeficiente: coef, mediaFinal: b.mediaFinal, beneficioBruto: b.bruto, beneficio: b.valor,
    };
    return extra ? { ...base, ...extra } : base;
  };

  const okPontos = (f, ano) => T0 + f >= reqCP
    && (idade0 + f + T0 + f) / 12 >= metaAnual(R.pontos.porAno, ano, sexo);
  const projPontos = projetar(okPontos);
  const extraPontos = {};
  if (projPontos) {
    extraPontos.pontosNaConcessao = (idade0 + projPontos.f + T0 + projPontos.f) / 12;
    extraPontos.metaPontos = metaAnual(R.pontos.porAno, projPontos.ano, sexo);
  }

  const regras = [
    montar('permanente', 'Regra permanente',
      projetar((f) => idade0 + f >= reqPerm.idade * 12 && T0 + f >= reqPerm.contribuicaoAnos * 12),
      (f) => coefComum(f)),
    montar('pontos', 'Transição por pontos', projPontos, (f) => coefComum(f), extraPontos),
    montar('idade-progressiva', 'Transição da idade mínima',
      projetar((f, ano) => T0 + f >= reqCI && idade0 + f >= metaAnual(R.idadeProgressiva.porAno, ano, sexo) * 12),
      (f) => coefComum(f)),
    pedagioAplica
      ? montar('pedagio-100', 'Pedágio de 100%',
        projetar((f) => idade0 + f >= reqPed.idade * 12 && T0 + f >= pedagioTotal),
        () => 1, { pedagioMeses: pedagioTotal })
      : { id: 'pedagio-100', nome: 'Pedágio de 100%', aplica: false },
  ];
  const candidatas = regras
    .filter((g) => g.aplica && g.alcanca)
    .sort((a, b) => a.faltaMeses - b.faltaMeses || b.beneficio - a.beneficio);
  return {
    sexo, T0, idade0, media: mediaC, salario: salC, piso, teto,
    c2019: pedagioAplica ? c2019 : null, pedagioSuposto, regras, melhor: candidatas[0] || null,
  };
}

export function exibir(r) {
  const resumo = [];
  if (r.melhor) {
    const m = r.melhor;
    resumo.push({ rotulo: 'Benefício mensal estimado', valor: brl(m.beneficio), destaque: true });
    resumo.push({ rotulo: 'Pela regra', valor: m.nome });
    const quando = m.faltaMeses === 0 ? 'Você já cumpre os requisitos'
      : `Faltam ${fmtTempo(m.faltaMeses)} — ${fmtData(m.ano, m.mes)}`;
    resumo.push({ rotulo: 'Quando', valor: quando });
  } else {
    resumo.push({ rotulo: 'Projeção', valor: 'Nenhuma regra alcançável até os 100 anos', destaque: true });
  }
  const detalhes = [];
  if (r.melhor) {
    const m = r.melhor;
    detalhes.push({ descricao: 'Média salarial projetada na concessão', valor: brl(m.mediaFinal) });
    detalhes.push({ descricao: 'Coeficiente aplicado sobre a média', valor: formatarNumero(m.coeficiente * 100, 0) + '%' });
    detalhes.push({ descricao: 'Idade na concessão', valor: fmtTempo(m.idadeMeses) });
    detalhes.push({ descricao: 'Contribuição na concessão', valor: fmtTempo(m.contribMeses) });
    if (m.id === 'pontos') {
      const pts = `${formatarNumero(m.pontosNaConcessao, 1)} de ${formatarNumero(m.metaPontos, 0)} pontos`;
      detalhes.push({ descricao: 'Pontos na concessão (idade + contribuição)', valor: pts });
    }
  }
  const linha = (g) => {
    if (!g.aplica) return [g.nome, 'não se aplica', '—', '—'];
    if (!g.alcanca) return [g.nome, '—', 'após os 100 anos', '—'];
    const falta = g.faltaMeses === 0 ? 'nenhuma (já)' : fmtTempo(g.faltaMeses);
    const data = g.faltaMeses === 0 ? 'agora' : fmtData(g.ano, g.mes);
    return [g.nome, falta, data, brl(g.beneficio)];
  };
  const ped = r.regras.find((g) => g.id === 'pedagio-100');
  const avisos = [
    'Estimativa sem o CNIS: o valor oficial considera todos os salários desde 07/1994 corrigidos. Confirme no simulador do Meu INSS antes de decidir.',
    `Piso de ${brl(r.piso)} e teto de ${brl(r.teto)} já aplicados ao resultado.`,
  ];
  if (r.pedagioSuposto && ped && ped.aplica) {
    avisos.push('Pedágio de 100% calculado supondo contribuição contínua até hoje; informe o tempo em 11/2019 para maior precisão.');
  }
  avisos.push('Pedágio de 50% e direito adquirido (anterior a 11/2019) não são calculados aqui.');
  avisos.push(AVISO_ESTIMATIVA);
  const copiar = r.melhor
    ? `INSS (${r.melhor.nome}): benefício estimado de ${brl(r.melhor.beneficio)}/mês.`
    : 'INSS: nenhuma regra alcançável até os 100 anos.';
  return {
    resumo,
    detalhes,
    tabela: {
      titulo: 'Comparação das regras',
      arquivo: 'inss-regras.csv',
      colunas: ['Regra', 'Falta', 'Data prevista', 'Benefício estimado'],
      linhas: r.regras.map(linha),
    },
    avisos,
    copiar,
  };
}
