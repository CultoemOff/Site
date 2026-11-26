import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Analytics from "@/components/analytics/Analytics";
import CheckoutParams from "@/components/analytics/CheckoutParams";
import SitePromoBar from "@/components/sales/SitePromoBar";
import { COMBO_PAGE } from "@/config/comboPage";
import { COMBO } from "@/config/courses";
import { APPLE_ICON_SRC, ICON_SRC, SITE_DESCRIPTION, SITE_NAME, SITE_PROMO_COURSE_ID, SITE_TAGLINE } from "@/config/site";
import { getCourses, getSiteSettings } from "@/lib/cms";
import { resolvePrice } from "@/lib/pricing";
import { LITE_INLINE_SCRIPT } from "@/lib/perfMode";
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
    "cursos para igrejas",
    "curso de OBS Studio",
    "transmissão de culto",
    "live de igreja",
    "transmissão ao vivo",
    "curso de redes para igrejas",
    "Wi-Fi para igreja",
    "câmera PTZ para igreja",
    "equipe de mídia da igreja",
    "voluntários de igreja",
    "curso de som para igreja",
    "NDI",
    "Dante",
    "Bitfocus Companion",
    "grandMA2",
    "iluminação para igreja",
    "mesa de som",
    "câmera para igreja",
    "filmar culto",
    "culto ao vivo",
    "transmitir culto online",
    "ministério de mídia",
    "vMix",
    "ATEM Mini",
    "mesa de corte para igreja",
    "podcast da igreja",
    "live no YouTube",
    "como fazer live no YouTube",
    "como configurar o OBS",
    "OBS NDI",
    "câmera IP PTZ",
    "mesa de som digital",
    "Behringer X32",
    "live no TikTok",
  ],
  icons: { icon: ICON_SRC, apple: APPLE_ICON_SRC },
  // verificação do domínio no Meta Business (vai no <head> de todas as páginas, renderizado no servidor)
  verification: { other: { "facebook-domain-verification": "k574kq63f26dfor8p205bsp6m1e87x" } },
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
  const [settings, courses] = await Promise.all([getSiteSettings(), getCourses()]);
  // faixa amarela: desde 26/11/2026 leva à página do combo (o prazo e o selo seguem a promoção do Culto ao Vivo)
  const promoCourse = courses.find((c) => c.id === SITE_PROMO_COURSE_ID);
  const promoPrice = promoCourse ? resolvePrice(promoCourse) : undefined;
  const combo = COMBO; // cópia local: dentro das buscas o TypeScript perde a checagem de "não é null"
  const comboMain = combo ? courses.find((c) => c.id === combo.main) : undefined;
  const comboBump = combo ? courses.find((c) => c.id === combo.bump) : undefined;
  const comboFull =
    comboMain && comboBump ? (resolvePrice(comboMain).priceFrom ?? comboMain.price) + (resolvePrice(comboBump).priceFrom ?? comboBump.price) : 0;
  const comboOff = comboFull > COMBO_PAGE.price && COMBO_PAGE.price > 0 ? Math.round((1 - COMBO_PAGE.price / comboFull) * 100) : 0;
  const promoHref = `${SITE_URL.includes("localhost") ? "" : SITE_URL}/formacoes/${COMBO_PAGE.slug}`;
  const gaId = safeGaId(settings.gaId);
  const pixelId = safePixelId(settings.metaPixelId);

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* Esconde o conteúdo "revelável" só quando há JS; se o JS não iniciar em 4 s, mostra tudo. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              LITE_INLINE_SCRIPT +
              "document.documentElement.classList.add('js-reveal');setTimeout(function(){var r=document.documentElement;if(!r.classList.contains('reveal-live'))r.classList.remove('js-reveal')},4000);",
          }}
        />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {promoCourse && promoPrice?.promo && comboOff > 0 && (
          <SitePromoBar
            label={promoPrice.promo.label}
            off={comboOff}
            endsAt={promoPrice.promo.endsAt}
            courseId={COMBO_PAGE.slug}
            title="Combo Culto ao Vivo + Redes para Igrejas"
            product="Combo Culto ao Vivo + Redes"
            href={promoHref}
          />
        )}
        {children}
        {/* leva UTMs e origem da visita até o link de compra da Hotmart */}
        <CheckoutParams />
        {(gaId || pixelId) && <Analytics gaId={gaId} pixelId={pixelId} />}
      </body>
    </html>
  );
}
