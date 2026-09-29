# Culto em Off — site oficial

Next.js (App Router) + TypeScript + Tailwind CSS v4. Animações só com CSS, SVG e IntersectionObserver (sem WebGL, sem vídeo de fundo).

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Hospedagem recomendada: Vercel (necessário servidor Next para o cache de 1 h do feed do YouTube).

## Onde editar

| O quê | Arquivo |
|---|---|
| Links, cupom, YouTube, redes sociais, menu, fotos | `src/config/site.ts` |
| Formações (preço, formato, status, tópicos, links) | `src/config/courses.ts` |
| Softwares (recursos, compatibilidade, links) | `src/config/software.ts` |
| Palco do hero (moving heads, cores, foco) | `src/components/hero/stageRig.ts` |

## Pendências (TODO)

- `VOLUTS_TRIAL_URL` — link do trial de 14 dias (o botão aparece quando preenchido).
- `SPRESENTER_SCREEN_SRC` / `VOLUTS_SCREEN_SRC` — capturas oficiais das telas (hoje: ilustração genérica marcada como ilustrativa).
- `public/images/jonas.silva.jpeg` — foto real usada na seção "Quem está por trás".
- Preços e cargas horárias das formações são provisórios.
- Links "Conhecer" e "Download" do PTZ Control Web.
- Link de inscrição de cada formação (`href`) e `MORE_COURSES_URL`.
- Instagram e demais redes em `SOCIAL_LINKS`.

## Estrutura

```
src/
  app/            layout, página inicial, /formacoes
  config/         site.ts, courses.ts, software.ts
  lib/youtube.ts  busca + parse do feed (server-side, revalidate 3600, fallback)
  components/
    hero/         palco (SVG), luzes, fumaça
    layout/       Navbar, Footer
    fx/           ViewportFx (reveal, pausa fora da tela, brilho do mouse)
    ui/           ArrowButton, SectionHeader
    sections/     problems, purpose (+ ecosystem), courses, software,
                  partners, about, youtube, manifesto
preview/          prévia fora do Next (não faz parte do build)
```
