/** Dados estruturados extras de alguns posts (além do BlogPosting), por endereço do post. */
export const POST_EXTRA_SCHEMA: Record<string, object[]> = {
  "controlar-camera-ptz-obs-studio": [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PTZ Control Web",
      operatingSystem: "Windows 10, Windows 11",
      applicationCategory: "MultimediaApplication",
      downloadUrl: "https://cultoemoff.com.br/softwares/ptz-control-web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      publisher: { "@type": "Organization", name: "Culto em Off", url: "https://cultoemoff.com.br" },
    },
  ],
};
