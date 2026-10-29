// Liga cada <form data-calc="..."> ao módulo de cálculo correspondente.

import { parseNumero, mascararMoeda, formatarBRL } from '../core/moeda.js';
import { renderizar } from './render.js';
import { blocoAfiliado } from './afiliados.js';
import { iniciarCookies } from './cookies.js';
import '../core/analytics.js';

const cfg = (() => {
  try { return JSON.parse(document.getElementById('site-config')?.textContent || '{}'); } catch { return {}; }
})();

iniciarCookies(cfg);

const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

function lerCampos(form) {
  const v = {};
  for (const campo of form.elements) {
    if (!campo.name) continue;
    switch (campo.dataset.tipo) {
      case 'money': {
        if (campo.value.trim() === '') { v[campo.name] = undefined; break; }
        // Máscara em tempo real grava "1.234,56"; parseNumero entende esse formato.
        // Fallback: só dígitos como centavos (ex.: "500000" -> 5000,00).
        let n = parseNumero(campo.value);
        if (!Number.isFinite(n)) {
          const dig = String(campo.value).replace(/\D/g, '');
          n = dig === '' ? NaN : parseInt(dig, 10) / 100;
        }
        v[campo.name] = n;
        break;
      }
      case 'number':
      case 'percent':
        v[campo.name] = campo.value.trim() === '' ? undefined : parseNumero(campo.value);
        break;
      case 'calculado':
        // Campo somente-leitura preenchido pelo motor: não entra na validação
        // nem no cálculo; serve apenas para exibir o lucro limitado ao caixa.
        break;
      case 'checkbox':
        v[campo.name] = campo.checked;
        break;
      default:
        v[campo.name] = campo.value;
    }
  }
  return v;
}

function mostrarErros(form, erros) {
  let primeiro = null;
  for (const campo of form.elements) {
    if (!campo.name) continue;
    const msg = erros[campo.name];
    const alvo = form.querySelector(`#erro-${campo.name}`);
    if (alvo) alvo.textContent = msg || '';
    if (msg) {
      campo.setAttribute('aria-invalid', 'true');
      campo.setAttribute('aria-describedby', `erro-${campo.name}`);
      primeiro ??= campo;
    } else {
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
    }
  }
  return primeiro;
}

async function iniciar(form) {
  const nome = form.dataset.calc;
  const resultado = document.getElementById('resultado');
  let calculou = false;

  let modulo, tabelas;
  try {
    [modulo, tabelas] = await Promise.all([
      import(new URL(`../calc/${nome}.js`, import.meta.url)),
      fetch('/data/tabelas.json').then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    ]);
  } catch (e) {
    resultado.hidden = false;
    resultado.textContent = 'Não foi possível carregar a calculadora. Atualize a página e tente de novo.';
    return;
  }

  function executar({ aoEnviar }) {
    const entrada = lerCampos(form);
    const erros = modulo.validar(entrada);
    if (Object.keys(erros).length) {
      // Depois do primeiro cálculo, erros também aparecem durante a edição e o resultado antigo
      // fica esmaecido, para ninguém ler um valor que já não corresponde aos campos.
      if (aoEnviar || calculou) {
        const primeiro = mostrarErros(form, erros);
        if (aoEnviar) primeiro?.focus();
      }
      if (calculou) resultado.classList.add('desatualizado');
      return;
    }
    mostrarErros(form, {});
    resultado.classList.remove('desatualizado');
    const calculado = modulo.calcular(entrada, tabelas);
    const exibicao = modulo.exibir(calculado);
    const afiliado = blocoAfiliado(nome);
    resultado.hidden = false; // antes de desenhar: o gráfico mede a largura do contêiner
    renderizar(resultado, exibicao, afiliado ? [afiliado] : []);
    calculou = true;
    if (aoEnviar) {
      resultado.scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'start' });
      resultado.focus({ preventScroll: true });
    }
  }

  form.addEventListener('submit', (ev) => { ev.preventDefault(); executar({ aoEnviar: true }); });

  // Nos campos monetários só entram dígitos: ponto, vírgula e ponto e vírgula
  // (e letras) são bloqueados na digitação; o formato "1.234,56" é posto pela
  // máscara em tempo real. Atalhos (Ctrl+V etc.) e navegação seguem livres -
  // o que vier de colagem é higienizado no 'input' abaixo.
  form.addEventListener('keydown', (ev) => {
    const c = ev.target;
    if (c?.dataset?.tipo !== 'money') return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(ev.key)) return;
    if (/^\d$/.test(ev.key)) return;
    ev.preventDefault();
  });

  let timer;
  form.addEventListener('input', (ev) => {
    const c = ev.target;
    // Máscara monetária em tempo real: só entram dígitos; o formato "1.234,56"
    // é aplicado enquanto se digita. Ponto, vírgula e ponto e vírgula digitados
    // são descartados - nunca chegam ao valor do campo.
    if (c?.dataset?.tipo === 'money' && c.value !== mascararMoeda(c.value)) {
      c.value = mascararMoeda(c.value);
    }
    if (!calculou) return;
    clearTimeout(timer);
    timer = setTimeout(() => executar({ aoEnviar: false }), 200);
  });
  form.addEventListener('change', () => { if (calculou) executar({ aoEnviar: false }); });

  form.addEventListener('focusout', (ev) => {
    const c = ev.target;
    if (c.dataset?.tipo === 'money' && c.value.trim() !== '') {
      const n = parseNumero(c.value);
      if (Number.isFinite(n)) c.value = mascararMoeda(c.value);
    }
  });

  form.addEventListener('reset', () => {
    calculou = false;
    resultado.classList.remove('desatualizado');
    resultado.hidden = true;
    resultado.replaceChildren();
    mostrarErros(form, {});
  });
}

document.querySelectorAll('form[data-calc]').forEach(iniciar);
