import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import { trackClick } from "../src/components/analytics/track";
import Analytics from "../src/components/analytics/Analytics";
import CheckoutParams from "../src/components/analytics/CheckoutParams";
import ViewportFx from "../src/components/fx/ViewportFx";
import Footer from "../src/components/layout/Footer";
import SalesPageView from "../src/components/sales/SalesPageView";
import { COURSES } from "../src/config/courses";
import { SALES_PAGES } from "../src/config/salesPages";
import { DEFAULT_SETTINGS } from "../src/config/site";

const course = COURSES.find((c) => c.id === "redes-para-igrejas")!;
document.documentElement.classList.add("js-reveal");
// no site, quem registra os cliques é o componente Analytics (só existe com o ID do GA configurado)
document.addEventListener("click", trackClick, { capture: true });
createRoot(document.getElementById("root")!).render(
  <>
    <main id="conteudo" tabIndex={-1} className="sp-main">
      <SalesPageView course={course} page={SALES_PAGES[course.id]} audience={DEFAULT_SETTINGS.audience} />
    </main>
    <Footer settings={DEFAULT_SETTINGS} minimal />
    <CheckoutParams />
    {/* só na prévia: mostra o aviso de cookies como no site (IDs de mentira, nada é carregado) */}
    <Analytics gaId="G-PREVIA" pixelId="" />
    <ViewportFx />
  </>,
);
