/**
 * Ofertas (página /ofertas, que também responde em ofertas.<domínio>).
 * Produtos com link de afiliado recomendados pelo Culto em Off.
 * Tudo se cadastra e edita no admin → Loja → Ofertas.
 */

export type OfferTag = "audio" | "video" | "iluminacao" | "automacao" | "cabeamento" | "acessorios" | "hardware";

export const OFFER_TAGS: Record<OfferTag, string> = {
  audio: "Áudio",
  video: "Vídeo",
  iluminacao: "Iluminação",
  automacao: "Automação",
  cabeamento: "Cabeamento",
  acessorios: "Acessórios",
  hardware: "Hardware",
};

export const OFFER_TAG_ORDER: OfferTag[] = ["audio", "video", "iluminacao", "automacao", "cabeamento", "acessorios", "hardware"];

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
  /** link de um vídeo de review do produto (opcional): vira o botão "Assistir review" */
  reviewUrl?: string;
  /** marcado no painel para aparecer no carrossel da home */
  home?: boolean;
};

/** Quantos produtos passam no carrossel da home. */
export const HOME_OFFERS_LIMIT = 10;

/**
 * Sem produtos iniciais no código: as ofertas vivem só no painel (Loja → Ofertas).
 * Assim uma nova publicação nunca cria, altera nem apaga produto nenhum.
 */
export const OFFERS: Offer[] = [];

/**
 * Produtos do carrossel da home: os marcados com "Mostrar na home" no painel (até 10, na ordem do painel).
 * Se nenhum estiver marcado, entram os 10 primeiros, para a seção não ficar vazia.
 */
export function pickHomeOffers(offers: Offer[]): Offer[] {
  const marked = offers.filter((o) => o.home);
  return (marked.length ? marked : offers).slice(0, HOME_OFFERS_LIMIT);
}
