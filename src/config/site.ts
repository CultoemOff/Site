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
export const STAGE_SCREEN_LOGO_SRC = "/images/logo-stage.webp";
/** ícones do navegador (versões pequenas da logo) */
export const ICON_SRC = "/images/icon-96.png";
export const APPLE_ICON_SRC = "/images/apple-icon-180.png";


// Redes sociais (valores padrão; podem ser alterados no admin)
export const SOCIAL_DEFAULTS = {
  youtube: "https://www.youtube.com/@cultoemoff",
  instagram: "https://www.instagram.com/cultoemoff",
  tiktok: "https://www.tiktok.com/@cultoemoff",
};

/** Facebook (só aparece na página de links; não está no painel) */
export const FACEBOOK_URL = "https://www.facebook.com/cultoemoff";
/** Endereço principal do site, usado nos links que saem de links.cultoemoff.com.br */
export const MAIN_SITE_URL = "https://cultoemoff.com.br";

// YouTube
export const YOUTUBE_CHANNEL_ID = "UCW6UK6AE4PyaJsH5PIAD7hw";
export const YOUTUBE_CHANNEL_URL = SOCIAL_DEFAULTS.youtube;
export const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
export const YOUTUBE_REVALIDATE_SECONDS = 3600;

// Parceiros (valores padrão; podem ser alterados no admin)
export const SPRESENTER_URL = "https://spresenter.com/pt";
export const SPRESENTER_COUPON = "CULTOEMOFF5";
export const VOLUTS_URL = "https://voluts.com.br/igrejas/?parceiro=cultoemoff";
export const DORN_URL = "https://www.dornstore.com.br?bg_ref=5bEbXB4NMt";

/** Configurações que o site usa (vindas do admin, com estes valores como padrão). */
export type SiteSettingsData = {
  social: { youtube: string; instagram: string; tiktok: string };
  videosMode: "latest" | "selected";
  selectedVideos: { url: string; title?: string }[];
  spresenter: { url: string; coupon: string; discount: string; screen?: string };
  voluts: { url: string; screen?: string };
  dorn: { url: string; image?: string };
  /** link de download do PTZ Control Web (vazio = usa o padrão de src/config/software.ts) */
  ptzDownloadUrl: string;
  gaId: string;
  /** ID do Meta Pixel (opcional; só carrega após o consentimento) */
  metaPixelId: string;
  /** números das redes exibidos no CH 06 */
  audience: { stats: AudienceStat[]; note: string };
  /** perguntas frequentes da home */
  faq: FaqItem[];
};

export type AudienceStat = { value: string; label: string };
export type FaqItem = { question: string; answer: string };

/**
 * Números das redes em 29/09/2026.
 * Visualizações somadas nas redes (informado por Jonas): mais de 1 milhão.
 * YouTube (YouTube Studio): 145 mil visualizações, 5,4 mil horas assistidas, 2,5 mil inscritos, 86 vídeos.
 * Instagram: 5.540 seguidores, 44 posts. TikTok: 1.625 seguidores, 8.840 curtidas, 46 vídeos.
 * Visualizações do Instagram e do TikTok não são públicas: atualize pelo admin.
 */
export const AUDIENCE_DEFAULTS: SiteSettingsData["audience"] = {
  stats: [
    { value: "1 milhão+", label: "visualizações nas redes" },
    { value: "180+", label: "vídeos e posts publicados" },
  ],
  note: "Dados das redes em setembro de 2026.",
};

export const FAQ_DEFAULTS: FaqItem[] = [
  {
    question: "Preciso ter experiência para fazer as formações?",
    answer:
      "Não. As formações começam pelos fundamentos, com linguagem simples e exemplos tirados da operação real de um culto.",
  },
  {
    question: "Minha igreja usa equipamentos diferentes. Serve para mim?",
    answer:
      "Sim. Os conceitos valem para qualquer marca. Quando uma formação é sobre um equipamento ou software específico, como a grandMA2 ou o Bitfocus Companion, isso está indicado no card da formação.",
  },
  {
    question: "Como funciona o acesso?",
    answer:
      "As formações são online. Depois da compra, você recebe as instruções de acesso e pode assistir no seu ritmo, pelo computador ou celular. O tempo de acesso está indicado em cada formação.",
  },
  {
    question: "E se eu não gostar?",
    answer:
      "Você tem 7 dias de garantia. Se a formação não for para você, basta pedir o reembolso dentro desse prazo e devolvemos 100% do valor.",
  },
  {
    question: "Posso comprar para a equipe técnica da minha igreja?",
    answer: "Sim. Fale com a gente pelo Instagram para combinar o acesso de vários voluntários.",
  },
  {
    question: "Quando as formações serão lançadas?",
    answer:
      "A formação Redes para Igrejas já está com inscrições abertas. As demais serão lançadas em breve: acompanhe o canal no YouTube e o Instagram para saber primeiro.",
  },
];

/** Garantia exibida nas formações e na FAQ. */
export const GUARANTEE_DAYS = 7;

export const DEFAULT_SETTINGS: SiteSettingsData = {
  social: { ...SOCIAL_DEFAULTS },
  videosMode: "latest",
  selectedVideos: [],
  spresenter: {
    url: SPRESENTER_URL,
    coupon: SPRESENTER_COUPON,
    discount: "5% de desconto no plano Pro",
    screen: "/partners/spresenter.jpg",
  },
  voluts: { url: VOLUTS_URL, screen: "/partners/voluts.jpg" },
  dorn: { url: DORN_URL, image: "/partners/dorn.jpg" },
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  ptzDownloadUrl: "",
  audience: AUDIENCE_DEFAULTS,
  faq: FAQ_DEFAULTS,
};

/** Itens da navegação principal. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Manifesto", href: "/#manifesto" },
  { label: "Formações", href: "/#formacoes" },
  { label: "Downloads gratuitos", href: "/#softwares" },
  { label: "Parceiros", href: "/#parceiros" },
  { label: "Blog", href: "/blog" },
  { label: "Produtos em oferta", href: "/ofertas" },
];
