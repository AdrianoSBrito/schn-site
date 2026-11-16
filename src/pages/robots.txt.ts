import type { APIRoute } from 'astro';
import { configuracoes } from '../lib/conteudo';

export const GET: APIRoute = async ({ site }) => {
  const cfg = await configuracoes();
  const corpo = cfg.indexar
    ? `User-agent: *\nAllow: /\nDisallow: /keystatic\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
