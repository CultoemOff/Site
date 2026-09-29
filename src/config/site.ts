/**
 * Configurações centralizadas do site Culto em Off.
 * Tudo que pode mudar (links, cupons, IDs, imagens) fica aqui.
 */

export const SITE_NAME = "Culto em Off";
export const SITE_TAGLINE = "A escola técnica para voluntários que servem na Igreja.";
export const SITE_DESCRIPTION =
  "Formação técnica para voluntários de igreja: áudio, vídeo, iluminação, redes, transmissão, projeção e automação — com linguagem simples, prática e acessível.";

/** Logo principal (navbar, footer, metadados). */
export const LOGO_SRC = "/images/logo-culto-em-off.png";

/**
 * Imagem exibida (de forma discreta) no telão do palco do hero.
 * Pode ser trocada por outra arte sem alterar componentes.
 */
export const STAGE_SCREEN_LOGO_SRC = "/images/logo-culto-em-off.png";

/** Foto real do Jonas Silva (sem edição). */
export const ABOUT_PHOTO_SRC = "/images/jonas.silva.jpeg";

// Redes sociais (valores padrão; podem ser alterados no admin)
export const SOCIAL_DEFAULTS = {
  youtube: "https://www.youtube.com/@cultoemoff",
  instagram: "https://www.instagram.com/cultoemoff",
  tiktok: "https://www.tiktok.com/@cultoemoff",
};

// YouTube
export const YOUTUBE_CHANNEL_ID = "UCW6UK6AE4PyaJsH5PIAD7hw";
export const YOUTUBE_CHANNEL_URL = SOCIAL_DEFAULTS.youtube;
export const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
export const YOUTUBE_REVALIDATE_SECONDS = 3600;

// Parceiros (valores padrão; podem ser alterados no admin)
export const SPRESENTER_URL = "https://spresenter.com/pt";
export const SPRESENTER_COUPON = "CULTOEMOFF5";
export const VOLUTS_URL = "https://voluts.com.br/igrejas/?parceiro=cultoemoff";
export const DORN_URL = "https://www.dornstore.com.br/?bg_ref=5bEbXB4NMt";

/** Configurações que o site usa (vindas do admin, com estes valores como padrão). */
export type SiteSettingsData = {
  social: { youtube: string; instagram: string; tiktok: string };
  videosMode: "latest" | "selected";
  selectedVideos: { url: string; title?: string }[];
  spresenter: { url: string; coupon: string; discount: string; screen?: string };
  voluts: { url: string; screen?: string };
  dorn: { url: string; image?: string };
  gaId: string;
};

export const DEFAULT_SETTINGS: SiteSettingsData = {
  social: { ...SOCIAL_DEFAULTS },
  videosMode: "latest",
  selectedVideos: [],
  spresenter: { url: SPRESENTER_URL, coupon: SPRESENTER_COUPON, discount: "5% de desconto no plano Pro" },
  voluts: { url: VOLUTS_URL },
  dorn: { url: DORN_URL },
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
};

/** Itens da navegação principal. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Propósito", href: "/#proposito" },
  { label: "Formações", href: "/#formacoes" },
  { label: "Softwares", href: "/#softwares" },
  { label: "Ferramentas", href: "/#parceiros" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Blog", href: "/blog" },
];
