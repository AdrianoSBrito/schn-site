// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';

// ADAPTER=node npm run dev → abre o painel no seu computador gravando direto nos arquivos.
const local = process.env.ADAPTER === 'node';

// O site é estático (páginas geradas na publicação).
// Só o painel /keystatic roda no servidor (Cloudflare Workers).
export default defineConfig({
  site: 'https://schn-site.workers.dev',
  integrations: [react(), markdoc(), keystatic()],
  adapter: local ? node({ mode: 'standalone' }) : cloudflare({ prerenderEnvironment: 'node' }),
});
