import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

/** Lê o conteúdo editado no painel (arquivos em src/content). */
export const reader = createReader(process.cwd(), config);

export async function configuracoes() {
  const c = await reader.singletons.configuracoes.readOrThrow();
  return c;
}

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const EMAIL = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

/**
 * Converte o texto do painel em HTML seguro:
 * cada linha vira parágrafo, linhas com "- " viram lista e e-mails viram link.
 */
export function formatarTexto(texto: string | null | undefined): string {
  if (!texto) return '';
  const linhas = texto.replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
  const partes: string[] = [];
  let lista: string[] = [];
  const fecharLista = () => {
    if (lista.length) partes.push(`<ul>${lista.map((i) => `<li>${i}</li>`).join('')}</ul>`);
    lista = [];
  };
  for (const linha of linhas) {
    const html = escapar(linha.replace(/^- /, '')).replace(EMAIL, '<a href="mailto:$1">$1</a>');
    if (linha.startsWith('- ')) lista.push(html);
    else { fecharLista(); partes.push(`<p>${html}</p>`); }
  }
  fecharLista();
  return partes.join('');
}

/** Links externos abrem em nova aba; mailto e links internos não. */
export function atributosLink(href: string) {
  const externo = /^https?:\/\//.test(href);
  return externo ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };
}

export const rotuloBadge: Record<string, { texto: string; variante: 'primario' | 'secundario' | 'stroke' }> = {
  uiux: { texto: 'UI/UX', variante: 'primario' },
  branding: { texto: 'Branding', variante: 'secundario' },
  premiado: { texto: 'Premiado', variante: 'stroke' },
};

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export function dataPorExtenso(iso: string | null | undefined) {
  if (!iso) return '';
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}
