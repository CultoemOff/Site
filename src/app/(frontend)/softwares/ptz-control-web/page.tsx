import type { Metadata } from "next";
import ViewportFx from "@/components/fx/ViewportFx";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PtzControlWebView from "@/components/software-page/PtzControlWebView";
import { SOFTWARE } from "@/config/software";
import { getSiteSettings } from "@/lib/cms";
import { JsonLd, SITE_URL } from "@/lib/seo";
import { submitLead } from "@/lib/leadActions";

export const revalidate = 3600;

const PTZ = SOFTWARE.find((s) => s.id === "ptz-control-web")!;

export const metadata: Metadata = {
  title: "PTZ Control Web — controle de câmeras PTZ para igrejas",
  description: `${PTZ.description} Baixe gratuitamente.`,
  alternates: { canonical: "/softwares/ptz-control-web" },
};

export default async function PtzControlWebPage() {
  const settings = await getSiteSettings();
  const downloadUrl = settings.ptzDownloadUrl || PTZ.downloadUrl;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: PTZ.name,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          description: PTZ.description,
          url: `${SITE_URL}/softwares/ptz-control-web`,
          publisher: { "@type": "Organization", name: "Culto em Off", url: SITE_URL },
        }}
      />
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <PtzControlWebView downloadUrl={downloadUrl} action={submitLead} />
      </main>
      <Footer settings={settings} />
      <ViewportFx />
    </>
  );
}
