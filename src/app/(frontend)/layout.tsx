import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Analytics from "@/components/analytics/Analytics";
import CheckoutParams from "@/components/analytics/CheckoutParams";
import { APPLE_ICON_SRC, ICON_SRC, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/config/site";
import { getSiteSettings } from "@/lib/cms";
import { OG_IMAGE, SITE_URL, safeGaId, safePixelId } from "@/lib/seo";
import "./globals.css";
import "@/components/fx/fx.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// fonte dos rótulos pequenos: fora do carregamento inicial (não atrasa o primeiro desenho no celular)
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "voluntários de igreja",
    "curso de som para igreja",
    "redes para igrejas",
    "NDI",
    "Dante",
    "Bitfocus Companion",
    "grandMA2",
    "iluminação para igreja",
    "transmissão de culto",
    "mesa de som",
  ],
  icons: { icon: ICON_SRC, apple: APPLE_ICON_SRC },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_TAGLINE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050A18",
};

export default async function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const gaId = safeGaId(settings.gaId);
  const pixelId = safePixelId(settings.metaPixelId);

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* Esconde o conteúdo "revelável" só quando há JS; se o JS não iniciar em 4 s, mostra tudo. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js-reveal');setTimeout(function(){var r=document.documentElement;if(!r.classList.contains('reveal-live'))r.classList.remove('js-reveal')},4000);",
          }}
        />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
        {/* leva UTMs e origem da visita até o link de compra da Hotmart */}
        <CheckoutParams />
        {(gaId || pixelId) && <Analytics gaId={gaId} pixelId={pixelId} />}
      </body>
    </html>
  );
}
