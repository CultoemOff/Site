/**
 * Ofertas (página /ofertas, que também responde em ofertas.<domínio>).
 * Produtos com link de afiliado recomendados pelo Culto em Off.
 * Estes são os valores padrão: usados quando o banco não está configurado e no `npm run seed`.
 * Depois do seed, tudo se edita no admin → Conteúdo → Ofertas.
 */

export type OfferTag = "audio" | "video" | "acessorios" | "hardware";

export const OFFER_TAGS: Record<OfferTag, string> = {
  audio: "Áudio",
  video: "Vídeo",
  acessorios: "Acessórios",
  hardware: "Hardware",
};

export const OFFER_TAG_ORDER: OfferTag[] = ["audio", "video", "acessorios", "hardware"];

/** Limite de produtos na página. */
export const OFFERS_LIMIT = 100;

export type Offer = {
  id: string;
  title: string;
  /** link do produto (de afiliado) */
  href: string;
  /** nome da loja; se vazio, é deduzido do link */
  store?: string;
  /** endereço da foto do produto (qualquer site); o card ajusta o enquadramento */
  imageUrl?: string;
  /** preço em reais; vazio = "Ver preço na loja" */
  price?: number;
  /** preço anterior ("de"), opcional */
  priceFrom?: number;
  tags: OfferTag[];
  note?: string;
  /** quando o preço foi conferido pela última vez (ISO) */
  priceCheckedAt?: string;
};

/** Produtos iniciais: os mesmos equipamentos da home. Foto e preço são preenchidos no painel. */
export const OFFERS: Offer[] = [
  {
    id: "microfone-sem-fio-kadosh-k502m",
    title: "Microfone sem fio duplo Kadosh K502M",
    tags: ["audio"],
    note: "Sistema UHF com dois bastões recarregáveis.",
    href: "https://www.mercadolivre.com.br/microfone-sem-fio-duplo-kadosh-k502m-uhf-pll-profissional-2-bastoes-recarregavel-para-igrejas-shows-eventos/p/MLB24091326?sid=bookmarks#polycard_client=wishlist&wid=MLB3437621001&sid=bookmarks",
  },
  {
    id: "microfone-sem-fio-akg-wp300",
    title: "Microfone sem fio AKG WP300",
    tags: ["audio"],
    note: "Microfone de mão sem fio da AKG.",
    href: "https://www.mercadolivre.com.br/microfone-akg-sem-fio-modelo-wp300-preto/up/MLBU2901202094?pdp_filters=item_id%3AMLB5221214426&sid=bookmarks#polycard_client=wishlist&wid=MLB5221214426&sid=bookmarks",
  },
  {
    id: "switch-tp-link-tl-sg1016pe",
    title: "Switch TP-Link TL-SG1016PE",
    tags: ["hardware"],
    note: "16 portas Gigabit com PoE.",
    href: "https://www.mercadolivre.com.br/switch-tl-sg1016pe-tp-link-v3-poe-16-portas-gigabit/p/MLB14807741?pdp_filters=item_id%3AMLB5172859383&matt_event_ts=1790729858870&matt_d2id=990d2c7d-aa07-4b44-8200-4b9b2fe80862&matt_tracing_id=00552636-aff6-4583-a910-9fab92cd5fe1#polycard_client=recommendations_home_affiliate-profile&wid=MLB5172859383&sid=recos&reco_backend=item_decorator&reco_client=home_affiliate-profile&matt_tool_id=68515993&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=a4f9ce08-32ac-414c-9f6d-0389e45602b8&tracking_id=78c7346f-5afd-45f6-8c5b-336d604ad22d&c_id=/home/card-featured/element&c_uid=94591389-a706-4a34-9e48-926191980532",
  },
  {
    id: "case-rack-xr18",
    title: "Case rack para mesa XR18",
    tags: ["audio", "acessorios"],
    note: "Rack 2U com gaveta e compartimento.",
    href: "https://www.mercadolivre.com.br/case-rack-para-xr18--2u--4-bases--gaveta--compartimento/up/MLBU1421976858?pdp_filters=item_id%3AMLB2166347651&sid=bookmarks#polycard_client=wishlist&wid=MLB2166347651&sid=bookmarks",
  },
  {
    id: "filtro-de-linha-wireconex-wpd8d",
    title: "Filtro de linha Wireconex WPD8D",
    tags: ["acessorios"],
    note: "Filtro de linha e distribuidor de energia.",
    href: "https://www.mercadolivre.com.br/filtro-de-linha-distribuidor-energia-wpd8d-preto-wireconex/p/MLB51968742?sid=bookmarks#polycard_client=wishlist&wid=MLB4395731629&sid=bookmarks",
  },
];
