import type { Metadata } from "next";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PtzControlWebView from "@/components/software-page/PtzControlWebView";
import { SOFTWARE } from "@/config/software";
import { getSiteSettings } from "@/lib/cms";
import { JsonLd, SITE_URL } from "@/lib/seo";
import { submitDownloadLead } from "@/lib/leadActions";

export const revalidate = 3600;

const PTZ = SOFTWARE.find((s) => s.id === "ptz-control-web")!;

export const metadata: Metadata = {
  title: "PTZ Control Web: controle gratuito de câmeras PTZ pelo navegador e no OBS Studio",
  description:
    "Controle gratuito de até 8 câmeras PTZ dentro do OBS Studio ou no navegador: pan, tilt, zoom, foco e presets com nome. VISCA, ONVIF, USB (OBSBOT Tiny 2), controle de videogame e Stream Deck. Para Windows.",
  alternates: { canonical: "/softwares/ptz-control-web" },
};

export default async function PtzControlWebPage() {
  const settings = await getSiteSettings();
  // link fixo do instalador mais recente (o campo antigo do painel não é mais usado)
  const downloadUrl = PTZ.downloadUrl;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: PTZ.name,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Windows 10, Windows 11",
          softwareVersion: "0.9.0",
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          description: PTZ.description,
          url: `${SITE_URL}/softwares/ptz-control-web`,
          publisher: { "@type": "Organization", name: "Culto em Off", url: SITE_URL },
        }}
      />
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <PtzControlWebView downloadUrl={downloadUrl} action={submitDownloadLead} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
