import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import ViewportFx from "../src/components/fx/ViewportFx";
import Footer from "../src/components/layout/Footer";
import Navbar from "../src/components/layout/Navbar";
import PtzControlWebView from "../src/components/software-page/PtzControlWebView";
import { SOFTWARE } from "../src/config/software";
import { DEFAULT_SETTINGS } from "../src/config/site";
import { validateLead, type LeadInput } from "../src/lib/leads";

// Prévia: o cadastro não é salvo (sem servidor); só valida o formato e libera o link.
async function mockAction(input: LeadInput) {
  await new Promise((r) => setTimeout(r, 500));
  const errors = validateLead(input);
  return Object.keys(errors).length ? { ok: false as const, errors } : { ok: true as const };
}

document.documentElement.classList.add("js-reveal");
createRoot(document.getElementById("root")!).render(
  <>
    <Navbar />
    <main id="conteudo" tabIndex={-1}>
      <PtzControlWebView downloadUrl={SOFTWARE[0].downloadUrl} action={mockAction} />
    </main>
    <Footer settings={DEFAULT_SETTINGS} />
    <ViewportFx />
  </>,
);
