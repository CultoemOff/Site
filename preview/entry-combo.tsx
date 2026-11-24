import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import ViewportFx from "../src/components/fx/ViewportFx";
import Footer from "../src/components/layout/Footer";
import ComboPageView from "../src/components/sales/ComboPageView";
import { COURSES } from "../src/config/courses";
import { SALES_PAGES } from "../src/config/salesPages";
import { DEFAULT_SETTINGS } from "../src/config/site";

const main = COURSES.find((c) => c.id === "culto-ao-vivo-com-excelencia")!;
const bump = COURSES.find((c) => c.id === "redes-para-igrejas")!;
document.documentElement.classList.add("js-reveal");
createRoot(document.getElementById("root")!).render(
  <>
    <main id="conteudo" tabIndex={-1} className="sp-main">
      <ComboPageView main={{ course: main, page: SALES_PAGES[main.id] }} bump={{ course: bump, page: SALES_PAGES[bump.id] }} />
    </main>
    <Footer settings={DEFAULT_SETTINGS} minimal />
    <ViewportFx />
  </>,
);
