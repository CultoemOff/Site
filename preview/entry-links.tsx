import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import { trackClick } from "../src/components/analytics/track";
import LinksView from "../src/components/links/LinksView";
import { COURSES } from "../src/config/courses";
import { DEFAULT_SETTINGS } from "../src/config/site";

// Prévia da página de links da bio (vídeos de exemplo só para ver o layout; no site vêm do canal).
const demo = [1, 2, 3].map((n) => ({
  id: `demo${n}`,
  title: `Vídeo de exemplo ${n} com um título um pouco mais comprido`,
  url: "#",
  thumbnail: ["/images/formacoes/redes-aula-ndi-obs.jpg", "/images/formacoes/redes-aula-regra-de-ouro.jpg", "/images/formacoes/redes-aula-equipamentos.jpg"][n - 1],
  published: "",
}));
createRoot(document.getElementById("root")!).render(
  <LinksView settings={DEFAULT_SETTINGS} course={COURSES.find((c) => c.id === "redes-para-igrejas")} videos={demo} />,
);

// como no site: cliques com data-track viram eventos
document.addEventListener("click", trackClick, { capture: true });
