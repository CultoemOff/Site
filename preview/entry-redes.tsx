import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import ViewportFx from "../src/components/fx/ViewportFx";
import Footer from "../src/components/layout/Footer";
import Navbar from "../src/components/layout/Navbar";
import SalesPageView from "../src/components/sales/SalesPageView";
import { COURSES } from "../src/config/courses";
import { SALES_PAGES } from "../src/config/salesPages";
import { DEFAULT_SETTINGS } from "../src/config/site";
import { validateLead, type LeadInput } from "../src/lib/leads";

async function mockAction(input: LeadInput) {
  await new Promise((r) => setTimeout(r, 500));
  const errors = validateLead(input);
  return Object.keys(errors).length ? { ok: false as const, errors } : { ok: true as const };
}

const course = COURSES.find((c) => c.id === "redes-para-igrejas")!;
document.documentElement.classList.add("js-reveal");
createRoot(document.getElementById("root")!).render(
  <>
    <Navbar />
    <main id="conteudo" tabIndex={-1}>
      <SalesPageView course={course} page={SALES_PAGES[course.id]} audience={DEFAULT_SETTINGS.audience} action={mockAction} />
    </main>
    <Footer settings={DEFAULT_SETTINGS} />
    <ViewportFx />
  </>,
);
