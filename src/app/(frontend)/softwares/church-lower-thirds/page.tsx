import type { Metadata } from "next";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ChurchLowerThirdsView from "@/components/software-page/ChurchLowerThirdsView";
import { SOFTWARE } from "@/config/software";
import { getSiteSettings } from "@/lib/cms";
import { submitDownloadLead } from "@/lib/leadActions";
import { JsonLd, SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

const CLT = SOFTWARE.find((s) => s.id === "church-lower-thirds")!;

export const metadata: Metadata = {
  title: "Church Lower Thirds: lower thirds gratuitos para igrejas no OBS Studio",
  description:
    "Nomes, ofertas com QR Code de PIX, avisos, agenda, redes sociais e contagem regressiva na transmissão do culto. 25 modelos, painel dentro do OBS e controle com prévia ao vivo. Gratuito, para Windows e macOS.",
  alternates: { canonical: "/softwares/church-lower-thirds" },
};

export default async function ChurchLowerThirdsPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: CLT.name,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Windows 10, Windows 11, macOS",
          softwareVersion: "1.0.0",
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          description: CLT.description,
          url: `${SITE_URL}/softwares/church-lower-thirds`,
          publisher: { "@type": "Organization", name: "Culto em Off", url: SITE_URL },
        }}
      />
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <ChurchLowerThirdsView downloadUrl={CLT.downloadUrl} downloadUrlMac={CLT.downloadUrlMac ?? ""} action={submitDownloadLead} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
