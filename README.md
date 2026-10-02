# Culto em Off — site oficial

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + **Payload CMS 3** (admin em `/admin`).
Animações só com CSS, SVG e IntersectionObserver (sem WebGL, sem vídeo de fundo).

## O que o admin controla

Acesse `https://SEU-SITE/admin` e faça login.

| Menu do admin | O que dá para fazer |
|---|---|
| **Conteúdo → Blog** | Criar posts com texto, títulos, listas, citações, links, imagens, vídeos enviados e vídeos do YouTube (bloco “Vídeo do YouTube”). Rascunho/publicado, capa, tags, SEO por post. |
| **Conteúdo → Equipamentos** | Equipamentos recomendados: nome, categoria, frase, link da loja, foto (opcional), ordem e se aparece na home (até 5). |
| **Escola → Formações** | Nome, frase, descrição, professor, itens inclusos, preço, status, modalidade, carga horária, acesso, link de inscrição, imagem, tópicos, ordem e destaque. |
| **Administração → Configurações do site** | Números das redes (CH 06), perguntas frequentes, YouTube/Instagram/TikTok, vídeos do YouTube (últimos automaticamente ou escolhidos à mão), links e cupom dos parceiros, capturas das telas, ID do Google Analytics. |
| **Contatos → Cadastros** | Nome, celular (com DDI) e e-mail de quem se cadastrou para baixar o PTZ Control Web, com o texto e a data do consentimento. |
| **Conteúdo → Mídias** | Biblioteca de imagens e vídeos. |
| **Administração → Usuários** | Quem pode entrar no admin. |

Se o banco não estiver configurado, o site continua funcionando com os valores padrão de `src/config/`.

## Rodar localmente

Pré-requisitos: Node 20+ e um MongoDB (Atlas gratuito ou local).

```bash
node scripts/configurar-env.mjs   # cria o .env: pede a connection string do Atlas e gera o PAYLOAD_SECRET
# (ou: cp .env.example .env e preencha DATABASE_URI e PAYLOAD_SECRET à mão)
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
- Eventos de conversão enviados ao GA4 (e ao Meta Pixel, se configurado): `select_course` (clique em "Quero participar"), `click_partner`, `copy_coupon`, `click_equipment` e `click_social`. No GA4, marque `select_course` como **evento principal** para acompanhar como conversão.
- Meta Pixel opcional (admin → Configurações do site → Analytics, ou `NEXT_PUBLIC_META_PIXEL_ID`). Só carrega depois que o visitante aceita os cookies.
- Google Analytics 4 com **Consent Mode v2**: nada é coletado até o visitante aceitar no banner (LGPD). O link “Preferências de cookies” no rodapé reabre a escolha.

## Onde editar no código

| O quê | Arquivo |
|---|---|
| Valores padrão (links, cupom, redes, menu) | `src/config/site.ts` |
| Formações padrão (usadas sem banco e no seed) | `src/config/courses.ts` |
| Equipamentos padrão | `src/config/equipment.ts` |
| Softwares (PTZ Control Web, Remote de Iluminação) | `src/config/software.ts` |
| Professores (fotos, bios, card "em breve") | `src/config/instructors.ts` |
| Páginas de venda das formações (textos, módulos, exemplos, FAQ, vídeo) | `src/config/salesPages.ts` |
| Campos do admin | `src/collections/*`, `src/globals/SiteSettings.ts` |
| Palco do hero (moving heads, cores, foco) | `src/components/hero/stageRig.ts` |

## Estrutura

```
src/
  app/(frontend)/   site: home, /formacoes, /formacoes/[slug] (página de venda), /softwares/ptz-control-web, /equipamentos, /blog, /blog/[slug], 404
  app/(payload)/    admin e API do Payload (arquivos padrão)
  app/sitemap.ts, robots.ts
  collections/      Posts, Courses, Equipment, Leads, Media, Users
  globals/          SiteSettings
  lib/cms.ts        leitura do admin com fallback para src/config
  lib/youtube.ts    feed do canal (revalida a cada 1 h) e vídeos escolhidos
  lib/seo.tsx       URL do site, JSON-LD
  components/       hero, seções, blog, analytics, layout, ui, fx
  seed/             npm run seed
preview/            prévia fora do Next (não faz parte do build)
```

## Pendências

- Capturas dos parceiros ficam em `public/partners/` (padrão). Para trocar, envie outra em Configurações do site → Parceiros.
- Link de download do PTZ Control Web: o padrão aponta para as releases do GitHub (o repositório precisa ser público) — ou troque em Configurações do site → Softwares.
- Links de inscrição das formações (admin → Formações).
- Preços e cargas horárias atuais são provisórios.
- Fotos dos equipamentos (admin → Equipamentos). Sem foto, o card mostra uma ilustração.
