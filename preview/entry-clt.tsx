import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import "../src/components/fx/fx.css";
import ViewportFx from "../src/components/fx/ViewportFx";
import Footer from "../src/components/layout/Footer";
import Navbar from "../src/components/layout/Navbar";
import ChurchLowerThirdsView from "../src/components/software-page/ChurchLowerThirdsView";
import { SOFTWARE } from "../src/config/software";
import { DEFAULT_SETTINGS } from "../src/config/site";
import { validateDownloadLead, type DownloadLeadInput } from "../src/lib/leads";

// Prévia: o cadastro não é salvo (sem servidor); só valida o formato e libera o link.
async function mockAction(input: DownloadLeadInput) {
  await new Promise((r) => setTimeout(r, 500));
  const errors = validateDownloadLead(input);
  return Object.keys(errors).length ? { ok: false as const, errors } : { ok: true as const };
}

document.documentElement.classList.add("js-reveal");
createRoot(document.getElementById("root")!).render(
  <>
    <Navbar />
    <main id="conteudo" tabIndex={-1}>
      <ChurchLowerThirdsView downloadUrl={SOFTWARE.find((s) => s.id === "church-lower-thirds")!.downloadUrl} action={mockAction} />
    </main>
    <Footer settings={DEFAULT_SETTINGS} />
    <ViewportFx />
  </>,
);
