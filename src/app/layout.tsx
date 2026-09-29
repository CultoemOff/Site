import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { LOGO_SRC, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/config/site";
import "./globals.css";
import "@/components/fx/fx.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  icons: { icon: LOGO_SRC },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050A18",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      </body>
    </html>
  );
}
