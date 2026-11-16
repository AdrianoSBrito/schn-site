# Site Schn Estúdio

Portfólio do Schn Estúdio. Feito em [Astro](https://astro.build), com painel de edição [Keystatic](https://keystatic.com) e publicado no Cloudflare Workers.

## Editar o site (sem código)

1. Abra `seu-endereço/keystatic` e entre com o Keystatic Cloud (conta do GitHub).
2. Escolha o que editar no menu lateral:
   - **Configurações gerais**: menu do topo, rodapé, e-mail, e o botão "Permitir que o Google mostre o site".
   - **Home**: título, apresentação, botões, projetos selecionados (arraste para reordenar) e a chamada para contato.
   - **Contato**: textos e opções do formulário, mensagem de sucesso e a chave do serviço de formulário.
   - **Política de Privacidade**: seções e data de atualização.
   - **Cases** e **Páginas avulsas**: crie páginas novas empilhando blocos (Texto, Imagem, Chamada para contato).
3. Clique em **Save**. O GitHub guarda a alteração e o Cloudflare publica de novo em 1 a 2 minutos.

### Links nos campos
- Página do site: `/contato`, `/politica-de-privacidade`, `/cases/odyssey`
- Seção da Home: `/#projetos`
- Site externo: `https://...` (abre em nova aba)
- E-mail: `mailto:voce@email.com`

### Textos longos
Cada linha vira um parágrafo. Linhas que começam com `- ` viram lista. E-mails viram link sozinhos.

## Estrutura (para quem for mexer no código)

| Pasta | O que tem |
| --- | --- |
| `src/content/` | Todo o conteúdo editável (arquivos .yaml que o painel grava) |
| `src/components/` | Componentes espelhando o Figma: Botão, Badge, Card, Header, Footer, Texto, Imagem, Chamada |
| `src/styles/global.css` | Tokens de cor e tipografia (variáveis do arquivo "Schn" no Figma) |
| `src/pages/` | Páginas: Home, Contato, Política, cases e páginas avulsas |
| `keystatic.config.ts` | Campos e blocos do painel |

### Comandos
- `npm run build`: gera o site.
- `npm run deploy`: publica no Cloudflare (normalmente é automático a cada alteração no GitHub).
- `ADAPTER=node npx astro build && node dist/server/entry.mjs` com `PUBLIC_KEYSTATIC_STORAGE=local`: abre o painel no computador gravando direto nos arquivos.
