import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import ViewportFx from "../src/components/fx/ViewportFx";
import Footer from "../src/components/layout/Footer";
import Navbar from "../src/components/layout/Navbar";
import About from "../src/components/sections/about/About";
import Courses from "../src/components/sections/courses/Courses";
import { COURSES } from "../src/config/courses";
import { DEFAULT_SETTINGS } from "../src/config/site";

// Prévia da página /formacoes: todas as formações e, em seguida, os professores.
document.documentElement.classList.add("js-reveal");
createRoot(document.getElementById("root")!).render(
  <>
    <Navbar />
    <main id="conteudo" tabIndex={-1} className="page-formacoes">
      <Courses courses={COURSES} showMoreButton={false} />
      <About />
    </main>
    <Footer settings={DEFAULT_SETTINGS} />
    <ViewportFx />
  </>,
);
