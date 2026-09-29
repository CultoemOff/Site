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

// YouTube
export const YOUTUBE_CHANNEL_ID = "UCW6UK6AE4PyaJsH5PIAD7hw";
export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;
export const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
export const YOUTUBE_REVALIDATE_SECONDS = 3600;

// Parceiros
export const SPRESENTER_URL = "https://spresenter.com/pt";
export const SPRESENTER_COUPON = "CULTOEMOFF5";

export const VOLUTS_URL = "https://voluts.com.br/igrejas/";
// TODO: adicionar URL do trial de 14 dias do Voluts.
export const VOLUTS_TRIAL_URL = "";

/**
 * Redes sociais. Deixe a URL vazia para ocultar o link.
 * TODO: preencher as URLs oficiais restantes.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "YouTube", href: YOUTUBE_CHANNEL_URL },
  { label: "Instagram", href: "" },
];

/** Itens da navegação principal (âncoras da homepage). */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Formações", href: "/#formacoes" },
  { label: "Ecossistema", href: "/#ecossistema" },
  { label: "Parceiros", href: "/#parceiros" },
  { label: "Softwares", href: "/#softwares" },
  { label: "Sobre", href: "/#sobre" },
];
