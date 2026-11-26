import SitePromo from "./site-promo";
import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import HomeView2 from "../src/components/home2/HomeView2";
import { COURSES } from "../src/config/courses";
import { DEFAULT_SETTINGS } from "../src/config/site";
import { SAMPLE_OFFERS } from "./sample-offers";
import { SEED_POSTS } from "../src/content/posts";

// Prévia da home2 fora do Next. Vídeos de exemplo (títulos reais do canal, capas locais só para a prévia).
document.documentElement.classList.add("js-reveal");
const videos = [
  { id: "a", title: "Plugin PTZ GRÁTIS para OBS Studio e vMix: controle câmeras PTZ com joystick (tutorial)", url: "#", thumbnail: "images/formacoes/culto-aula-obs-ptz.jpg", published: "2026-11-20T12:00:00Z" },
  { id: "b", title: "Como salvar cenas na Yamaha TF (Store, Recall e bloqueio) | Aula 3", url: "#", thumbnail: "images/formacoes/culto-aula-gravacao.jpg", published: "2026-11-25T12:00:00Z" },
  { id: "c", title: "Como configurar as saídas da Yamaha TF: auxiliares e Omni Out | Aula 2", url: "#", thumbnail: "images/formacoes/culto-aula-operacao.jpg", published: "2026-11-24T12:00:00Z" },
  { id: "d", title: "Controle sua câmera PTZ com o controle de videogame no OBS Studio", url: "#", thumbnail: "images/formacoes/redes-aula-ndi-obs.jpg", published: "2026-11-23T12:00:00Z" },
];
createRoot(document.getElementById("root")!).render(
  <>
    <SitePromo />
    <HomeView2
      courses={COURSES}
      settings={DEFAULT_SETTINGS}
      offers={SAMPLE_OFFERS}
      videos={videos}
      posts={SEED_POSTS.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        publishedAt: p.publishedAt,
        updatedAt: p.publishedAt,
        tags: p.tags,
        cover: p.cover ? { url: p.cover.localPath.slice(1), alt: p.cover.alt } : undefined,
      }))}
    />
  </>,
);
