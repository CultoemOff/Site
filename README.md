# Culto em Off — site oficial

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + **Payload CMS 3** (admin em `/admin`).
Animações só com CSS, SVG e IntersectionObserver (sem WebGL, sem vídeo de fundo).

## O que o admin controla

Acesse `https://SEU-SITE/admin` e faça login.

| Menu do admin | O que dá para fazer |
|---|---|
| **Conteúdo → Blog** | Criar posts com texto, títulos, listas, citações, links, imagens, vídeos enviados e vídeos do YouTube (bloco “Vídeo do YouTube”). Rascunho/publicado, capa, tags, SEO por post. |
| **Escola → Formações** | Nome, frase, descrição, preço, status, modalidade, carga horária, acesso, link de inscrição, imagem, tópicos, ordem e destaque. |
| **Administração → Configurações do site** | YouTube/Instagram/TikTok, vídeos do YouTube (últimos automaticamente ou escolhidos à mão), links e cupom dos parceiros, capturas das telas, ID do Google Analytics. |
| **Conteúdo → Mídias** | Biblioteca de imagens e vídeos. |
| **Administração → Usuários** | Quem pode entrar no admin. |

Se o banco não estiver configurado, o site continua funcionando com os valores padrão de `src/config/`.

## Rodar localmente

Pré-requisitos: Node 20+ e um MongoDB (Atlas gratuito ou local).

```bash
cp .env.example .env        # preencha DATABASE_URI e PAYLOAD_SECRET
npm install
npm run dev                 # http://localhost:3000  e  http://localhost:3000/admin
```

No primeiro acesso a `/admin`, o Payload pede para criar o primeiro usuário (você).

Para já começar com as formações e configurações atuais no banco:

```bash
npm run seed
```

Outros comandos:

```bash
npm run lint
npm run build               # gera o importMap do admin e compila o site
npm run generate:types      # (opcional) gera src/payload-types.ts
```

## Publicar na Vercel

1. Crie um banco no **MongoDB Atlas** e copie a connection string.
2. Na Vercel, importe o repositório.
3. Em **Storage**, crie um **Blob** e conecte ao projeto (isso cria `BLOB_READ_WRITE_TOKEN`). É onde ficam as imagens e vídeos enviados pelo admin.
4. Em **Settings → Environment Variables**, defina:
   - `NEXT_PUBLIC_SITE_URL` — ex.: `https://cultoemoff.com.br`
   - `DATABASE_URI` — string do MongoDB Atlas
   - `PAYLOAD_SECRET` — uma chave longa e aleatória
   - `NEXT_PUBLIC_GA_ID` — opcional (também pode ser definido no admin)
5. Faça o deploy, acesse `/admin`, crie seu usuário e rode o seed (localmente, apontando para o mesmo banco) se quiser os dados iniciais.
6. No **Google Search Console**, envie `https://SEU-SITE/sitemap.xml`.

## SEO e Analytics

- Metadados, Open Graph e Twitter Card em todas as páginas; título/descrição/imagem próprios por post.
- `sitemap.xml` (inclui os posts) e `robots.txt` (bloqueia `/admin` e `/api`).
- Dados estruturados (JSON-LD): organização, formações (Course com preço em BRL) e posts (BlogPosting).
- Google Analytics 4 com **Consent Mode v2**: nada é coletado até o visitante aceitar no banner (LGPD). O link “Preferências de cookies” no rodapé reabre a escolha.

## Onde editar no código

| O quê | Arquivo |
|---|---|
| Valores padrão (links, cupom, redes, menu) | `src/config/site.ts` |
| Formações padrão (usadas sem banco e no seed) | `src/config/courses.ts` |
| Softwares (PTZ Control Web, Remote de Iluminação) | `src/config/software.ts` |
| Campos do admin | `src/collections/*`, `src/globals/SiteSettings.ts` |
| Palco do hero (moving heads, cores, foco) | `src/components/hero/stageRig.ts` |

## Estrutura

```
src/
  app/(frontend)/   site: home, /formacoes, /blog, /blog/[slug], 404
  app/(payload)/    admin e API do Payload (arquivos padrão)
  app/sitemap.ts, robots.ts
  collections/      Posts, Courses, Media, Users
  globals/          SiteSettings
  lib/cms.ts        leitura do admin com fallback para src/config
  lib/youtube.ts    feed do canal (revalida a cada 1 h) e vídeos escolhidos
  lib/seo.tsx       URL do site, JSON-LD
  components/       hero, seções, blog, analytics, layout, ui, fx
  seed/             npm run seed
preview/            prévia fora do Next (não faz parte do build)
```

## Pendências

- Capturas oficiais das telas do SPresenter e do Voluts e imagem da Loja da Dorn (enviar em Configurações do site → Parceiros). Até lá aparecem ilustrações marcadas como “imagem ilustrativa”.
- Links “Conhecer” e “Download” do PTZ Control Web (`src/config/software.ts`).
- Links de inscrição das formações (admin → Formações).
- Preços e cargas horárias atuais são provisórios.
