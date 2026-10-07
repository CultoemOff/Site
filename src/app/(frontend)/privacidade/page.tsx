import type { Metadata } from "next";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PrivacyView from "@/components/privacy/PrivacyView";
import { getSiteSettings } from "@/lib/cms";
import { safeGaId, safePixelId } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Quais dados o site do Culto em Off coleta, para que são usados, com quem são compartilhados e como pedir a exclusão.",
  alternates: { canonical: "/privacidade" },
};

/** Política de privacidade: descreve o que o site coleta de fato (cadastros, medição, anúncios e compra pela Hotmart). */
export default async function PrivacidadePage() {
  const settings = await getSiteSettings();
  const hasConsent = Boolean(safeGaId(settings.gaId) || safePixelId(settings.metaPixelId));
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <PrivacyView instagram={settings.social.instagram} hasConsent={hasConsent} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
