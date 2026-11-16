import { config, fields, collection, singleton } from '@keystatic/core';

/*
 * Painel de edição do site (/keystatic).
 * No seu computador ele grava direto nos arquivos; publicado, ele salva no GitHub
 * pelo Keystatic Cloud (projeto schn/schn-site).
 */

const ajudaLink =
  'Para onde o botão leva. Exemplos: /contato · /#projetos · /cases/odyssey · https://instagram.com/... · mailto:voce@email.com';

const link = (label: string, defaultValue = '') =>
  fields.text({ label, description: ajudaLink, defaultValue });

const badges = fields.multiselect({
  label: 'Etiquetas',
  options: [
    { label: 'UI/UX', value: 'uiux' },
    { label: 'Branding', value: 'branding' },
    { label: 'Premiado', value: 'premiado' },
  ],
});

const imagemProjeto = (label: string) =>
  fields.image({ label, directory: 'public/images/projetos', publicPath: '/images/projetos/' });

const textoAjuda =
  'Cada linha vira um parágrafo. Comece a linha com "- " para virar item de lista. E-mails viram link sozinhos.';

/* Blocos para montar cases e páginas novas, espelhando os componentes do Figma. */
const blocos = fields.blocks(
  {
    texto: {
      label: 'Texto',
      itemLabel: (p) => p.fields.titulo.value || 'Texto',
      schema: fields.object({
        titulo: fields.text({ label: 'Título (opcional)' }),
        texto: fields.text({ label: 'Texto', multiline: true, description: textoAjuda }),
        legenda: fields.text({ label: 'Legenda (opcional)' }),
      }),
    },
    imagem: {
      label: 'Imagem',
      itemLabel: (p) => p.fields.legenda.value || 'Imagem',
      schema: fields.object({
        imagem: fields.image({ label: 'Imagem', directory: 'public/images/conteudo', publicPath: '/images/conteudo/' }),
        alt: fields.text({ label: 'Descrição da imagem (acessibilidade)', description: 'O que a imagem mostra, para quem usa leitor de tela.' }),
        legenda: fields.text({ label: 'Legenda (opcional)' }),
        proporcao: fields.select({
          label: 'Proporção',
          options: [
            { label: '16:9', value: '16-9' },
            { label: '4:3', value: '4-3' },
          ],
          defaultValue: '16-9',
        }),
      }),
    },
    chamada: {
      label: 'Chamada para contato',
      itemLabel: (p) => p.fields.titulo.value || 'Chamada',
      schema: fields.object({
        titulo: fields.text({ label: 'Título', defaultValue: 'Tem um grande projeto para tirar do papel?' }),
        texto: fields.text({ label: 'Texto', multiline: true }),
        rotuloBotao: fields.text({ label: 'Texto do botão', defaultValue: 'Falar Comigo' }),
        link: link('Link do botão', '/contato'),
      }),
    },
  },
  { label: 'Conteúdo da página (blocos)' }
);

const seo = fields.object(
  {
    titulo: fields.text({ label: 'Título na aba do navegador e no Google (opcional)' }),
    descricao: fields.text({ label: 'Descrição para o Google (opcional)', multiline: true }),
  },
  { label: 'Busca (SEO)' }
);

export default config({
  storage:
    import.meta.env.DEV || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'local' ? { kind: 'local' } : { kind: 'cloud' },
  cloud: { project: 'schn/schn-site' },
  locale: 'pt-BR',
  ui: {
    brand: { name: 'Schn Estúdio' },
    navigation: {
      Site: ['configuracoes'],
      Páginas: ['home', 'contato', 'politica'],
      Conteúdo: ['cases', 'paginas'],
    },
  },

  singletons: {
    configuracoes: singleton({
      label: 'Configurações gerais',
      path: 'src/content/configuracoes',
      format: { data: 'yaml' },
      schema: {
        nome: fields.text({ label: 'Nome do estúdio', defaultValue: 'Schn Estúdio' }),
        descricao: fields.text({ label: 'Descrição padrão para o Google', multiline: true }),
        indexar: fields.checkbox({
          label: 'Permitir que o Google mostre o site',
          description: 'Deixe desligado enquanto o site estiver em teste. Ligue quando o domínio definitivo estiver no ar.',
          defaultValue: false,
        }),
        menu: fields.array(
          fields.object({
            rotulo: fields.text({ label: 'Texto' }),
            link: link('Link'),
            estilo: fields.select({
              label: 'Estilo',
              options: [
                { label: 'Fantasma (só texto)', value: 'ghost' },
                { label: 'Contorno', value: 'stroke' },
              ],
              defaultValue: 'ghost',
            }),
          }),
          { label: 'Menu do topo', itemLabel: (p) => p.fields.rotulo.value }
        ),
        rodape: fields.object(
          {
            assinatura: fields.text({ label: 'Texto do rodapé', multiline: true, defaultValue: '© 2026\nSchn Estúdio' }),
            links: fields.array(
              fields.object({ rotulo: fields.text({ label: 'Texto' }), link: link('Link') }),
              { label: 'Links do rodapé', itemLabel: (p) => p.fields.rotulo.value }
            ),
          },
          { label: 'Rodapé' }
        ),
      },
    }),

    home: singleton({
      label: 'Home',
      path: 'src/content/home',
      format: { data: 'yaml' },
      schema: {
        titulo: fields.text({ label: 'Título principal' }),
        bio: fields.text({ label: 'Texto de apresentação', multiline: true }),
        botoes: fields.array(
          fields.object({
            rotulo: fields.text({ label: 'Texto' }),
            link: link('Link'),
            variante: fields.select({
              label: 'Estilo',
              options: [
                { label: 'Primário (verde)', value: 'primario' },
                { label: 'Secundário (verde escuro)', value: 'secundario' },
                { label: 'Contorno', value: 'stroke' },
              ],
              defaultValue: 'primario',
            }),
          }),
          { label: 'Botões da apresentação', itemLabel: (p) => p.fields.rotulo.value }
        ),
        rotuloProjetos: fields.text({ label: 'Título da seção de projetos', defaultValue: 'Projetos selecionados' }),
        projetos: fields.array(
          fields.object({
            titulo: fields.text({ label: 'Título' }),
            descricao: fields.text({ label: 'Descrição (até 2 linhas)', multiline: true }),
            imagem: imagemProjeto('Imagem do card'),
            alt: fields.text({ label: 'Descrição da imagem (acessibilidade)' }),
            badges,
            formato: fields.select({
              label: 'Formato do card',
              description: 'Horizontal ocupa a linha inteira e vira vertical em telas estreitas.',
              options: [
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
              ],
              defaultValue: 'vertical',
            }),
            link: fields.text({
              label: 'Link do card',
              description: 'Deixe vazio enquanto o case não existir: o card aparece, mas não é clicável. Ex.: /cases/odyssey',
            }),
          }),
          {
            label: 'Projetos selecionados (arraste para reordenar)',
            itemLabel: (p) => p.fields.titulo.value,
          }
        ),
        chamada: fields.object(
          {
            titulo: fields.text({ label: 'Título' }),
            texto: fields.text({ label: 'Texto', multiline: true }),
            rotuloBotao: fields.text({ label: 'Texto do botão' }),
            link: link('Link do botão'),
          },
          { label: 'Chamada para contato' }
        ),
        seo,
      },
    }),

    contato: singleton({
      label: 'Contato',
      path: 'src/content/contato',
      format: { data: 'yaml' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        texto: fields.text({ label: 'Texto', multiline: true }),
        servicos: fields.array(fields.text({ label: 'Opção' }), {
          label: 'Opções de "Tipo de serviço"',
          itemLabel: (p) => p.value,
        }),
        investimento: fields.array(fields.text({ label: 'Opção' }), {
          label: 'Opções de investimento',
          itemLabel: (p) => p.value,
        }),
        colaboradores: fields.array(fields.text({ label: 'Opção' }), {
          label: 'Opções de nº de colaboradores',
          itemLabel: (p) => p.value,
        }),
        rotuloEnviar: fields.text({ label: 'Texto do botão de envio', defaultValue: 'Enviar mensagem' }),
        mensagemSucesso: fields.text({
          label: 'Mensagem depois do envio',
          multiline: true,
          defaultValue: 'Mensagem enviada. Te respondo em até 3 dias úteis.',
        }),
        chaveFormulario: fields.text({
          label: 'Chave do serviço de formulário (Web3Forms)',
          description: 'Enquanto estiver vazia, o formulário avisa que ainda não está recebendo mensagens.',
        }),
        seo,
      },
    }),

    politica: singleton({
      label: 'Política de Privacidade',
      path: 'src/content/politica',
      format: { data: 'yaml' },
      schema: {
        titulo: fields.text({ label: 'Título', defaultValue: 'Política de Privacidade' }),
        atualizadaEm: fields.date({ label: 'Atualizada em' }),
        introducao: fields.text({ label: 'Introdução', multiline: true }),
        secoes: fields.array(
          fields.object({
            titulo: fields.text({ label: 'Título da seção' }),
            texto: fields.text({ label: 'Texto', multiline: true, description: textoAjuda }),
          }),
          { label: 'Seções', itemLabel: (p) => p.fields.titulo.value }
        ),
        rodape: fields.object(
          { pergunta: fields.text({ label: 'Chamada final' }), contato: fields.text({ label: 'Contato' }) },
          { label: 'Fechamento' }
        ),
      },
    }),
  },

  collections: {
    cases: collection({
      label: 'Cases',
      slugField: 'titulo',
      path: 'src/content/cases/*',
      format: { data: 'yaml' },
      entryLayout: 'form',
      schema: {
        titulo: fields.slug({ name: { label: 'Título' }, slug: { label: 'Endereço', description: 'Aparece na URL: /cases/endereco' } }),
        subtitulo: fields.text({ label: 'Subtítulo', multiline: true }),
        badges,
        blocos,
        seo,
      },
    }),
    paginas: collection({
      label: 'Páginas avulsas',
      slugField: 'titulo',
      path: 'src/content/paginas/*',
      format: { data: 'yaml' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título' }, slug: { label: 'Endereço', description: 'Aparece na URL: /endereco' } }),
        subtitulo: fields.text({ label: 'Subtítulo', multiline: true }),
        blocos,
        seo,
      },
    }),
  },
});
