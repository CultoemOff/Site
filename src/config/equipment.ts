/**
 * Equipamentos recomendados (página /equipamentos; a seção CH 04 da home usa as Ofertas).
 * Estes são os valores padrão: usados quando o banco não está configurado e no `npm run seed`.
 * Depois do seed, tudo se edita no admin → Conteúdo → Equipamentos.
 */

export type EquipmentCategory = "audio" | "microfones" | "rede" | "energia" | "video" | "iluminacao" | "acessorios";

/** Ilustração usada quando o equipamento não tem foto enviada. */
export type EquipmentIcon = "mic" | "rack" | "switch" | "power" | "camera" | "light" | "cable";

export type Equipment = {
  id: string;
  name: string;
  category: EquipmentCategory;
  icon: EquipmentIcon;
  note?: string;
  href: string;
  /** nome da loja; se vazio, é deduzido do link */
  store?: string;
  image?: { url: string; alt: string };
  /** aparece na homepage */
  featured: boolean;
};

export const EQUIPMENT_CATEGORIES: Record<EquipmentCategory, string> = {
  audio: "Áudio",
  microfones: "Microfones",
  rede: "Rede",
  energia: "Energia",
  video: "Vídeo",
  iluminacao: "Iluminação",
  acessorios: "Acessórios",
};

/** Ícone padrão sugerido para cada categoria. */
export const CATEGORY_ICON: Record<EquipmentCategory, EquipmentIcon> = {
  audio: "rack",
  microfones: "mic",
  rede: "switch",
  energia: "power",
  video: "camera",
  iluminacao: "light",
  acessorios: "cable",
};

/** Quantos equipamentos em destaque aparecem na homepage. */
export const HOME_EQUIPMENT_LIMIT = 5;

export const EQUIPMENT: Equipment[] = [
  {
    id: "microfone-sem-fio-kadosh-k502m",
    name: "Microfone sem fio duplo Kadosh K502M",
    category: "microfones",
    icon: "mic",
    note: "Sistema UHF com dois bastões recarregáveis.",
    href: "https://www.mercadolivre.com.br/microfone-sem-fio-duplo-kadosh-k502m-uhf-pll-profissional-2-bastoes-recarregavel-para-igrejas-shows-eventos/p/MLB24091326?sid=bookmarks#polycard_client=wishlist&wid=MLB3437621001&sid=bookmarks",
    featured: true,
  },
  {
    id: "microfone-sem-fio-akg-wp300",
    name: "Microfone sem fio AKG WP300",
    category: "microfones",
    icon: "mic",
    note: "Microfone de mão sem fio da AKG.",
    href: "https://www.mercadolivre.com.br/microfone-akg-sem-fio-modelo-wp300-preto/up/MLBU2901202094?pdp_filters=item_id%3AMLB5221214426&sid=bookmarks#polycard_client=wishlist&wid=MLB5221214426&sid=bookmarks",
    featured: true,
  },
  {
    id: "switch-tp-link-tl-sg1016pe",
    name: "Switch TP-Link TL-SG1016PE",
    category: "rede",
    icon: "switch",
    note: "16 portas Gigabit com PoE.",
    href: "https://www.mercadolivre.com.br/switch-tl-sg1016pe-tp-link-v3-poe-16-portas-gigabit/p/MLB14807741?pdp_filters=item_id%3AMLB5172859383&matt_event_ts=1790729858870&matt_d2id=990d2c7d-aa07-4b44-8200-4b9b2fe80862&matt_tracing_id=00552636-aff6-4583-a910-9fab92cd5fe1#polycard_client=recommendations_home_affiliate-profile&wid=MLB5172859383&sid=recos&reco_backend=item_decorator&reco_client=home_affiliate-profile&matt_tool_id=68515993&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=a4f9ce08-32ac-414c-9f6d-0389e45602b8&tracking_id=78c7346f-5afd-45f6-8c5b-336d604ad22d&c_id=/home/card-featured/element&c_uid=94591389-a706-4a34-9e48-926191980532",
    featured: true,
  },
  {
    id: "case-rack-xr18",
    name: "Case rack para mesa XR18",
    category: "audio",
    icon: "rack",
    note: "Rack 2U com gaveta e compartimento.",
    href: "https://www.mercadolivre.com.br/case-rack-para-xr18--2u--4-bases--gaveta--compartimento/up/MLBU1421976858?pdp_filters=item_id%3AMLB2166347651&sid=bookmarks#polycard_client=wishlist&wid=MLB2166347651&sid=bookmarks",
    featured: true,
  },
  {
    id: "filtro-de-linha-wireconex-wpd8d",
    name: "Filtro de linha Wireconex WPD8D",
    category: "energia",
    icon: "power",
    note: "Filtro de linha e distribuidor de energia.",
    href: "https://www.mercadolivre.com.br/filtro-de-linha-distribuidor-energia-wpd8d-preto-wireconex/p/MLB51968742?sid=bookmarks#polycard_client=wishlist&wid=MLB4395731629&sid=bookmarks",
    featured: true,
  },
];

/** "https://www.mercadolivre.com.br/..." → "Mercado Livre". */
export function storeName(item: Pick<Equipment, "store" | "href">): string {
  if (item.store) return item.store;
  try {
    const host = new URL(item.href).hostname.replace(/^www\./, "");
    if (host.includes("mercadolivre") || host.includes("mercadolibre")) return "Mercado Livre";
    if (host.includes("amazon")) return "Amazon";
    if (host.includes("shopee")) return "Shopee";
    if (host.includes("magazineluiza") || host.includes("magalu")) return "Magalu";
    if (host.includes("dornstore")) return "Loja da Dorn";
    const base = host.split(".")[0];
    return base.charAt(0).toUpperCase() + base.slice(1);
  } catch {
    return "a loja";
  }
}
