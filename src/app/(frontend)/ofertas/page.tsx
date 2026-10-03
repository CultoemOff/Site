import type { Metadata } from "next";
import OffersView from "@/components/offers/OffersView";
import { getOffers } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

// Preços e produtos mudam: a página é refeita a cada 1 h (e na hora quando algo é salvo no admin).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ofertas para a técnica da sua igreja",
  description:
    "Produtos recomendados pelo Culto em Off para te ajudar na igreja: áudio, vídeo, iluminação, automação, acessórios e hardware, com link direto para a loja.",
  alternates: { canonical: "/ofertas" },
};

/** Página de ofertas (também atende em ofertas.<domínio>, ver next.config.mjs). */
export default async function OfertasPage() {
  const offers = await getOffers();
  // sem domínio configurado ainda, o link para o site principal fica relativo
  const homeUrl = SITE_URL.includes("localhost") ? "/" : SITE_URL;
  return <OffersView offers={offers} homeUrl={homeUrl} />;
}
