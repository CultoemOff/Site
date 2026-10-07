import { createRoot } from "react-dom/client";
import "../src/app/(frontend)/globals.css";
import Footer from "../src/components/layout/Footer";
import Navbar from "../src/components/layout/Navbar";
import PrivacyView from "../src/components/privacy/PrivacyView";
import { DEFAULT_SETTINGS } from "../src/config/site";

// Prévia da página /privacidade.
createRoot(document.getElementById("root")!).render(
  <>
    <Navbar />
    <main id="conteudo" tabIndex={-1}>
      <PrivacyView instagram={DEFAULT_SETTINGS.social.instagram} hasConsent />
    </main>
    <Footer settings={DEFAULT_SETTINGS} />
  </>,
);
