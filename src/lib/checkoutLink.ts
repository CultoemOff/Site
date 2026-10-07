/**
 * Link de compra da Hotmart com a origem da venda.
 *
 * O que a Hotmart aceita no link da página de pagamento (pay.hotmart.com), segundo a Central de Ajuda
 * ("Como identificar a origem das minhas vendas na Hotmart?" e "Como configuro os parâmetros UTM..."):
 *  - utm_source, utm_medium, utm_campaign, utm_content, utm_term: aparecem no Hotmart Analytics
 *    e na aba UTM do Dashboard de Origem de Vendas. Quando a página de vendas é externa (o nosso caso),
 *    as UTMs só chegam à Hotmart se estiverem no link do botão que leva ao checkout.
 *  - sck: parâmetro do produtor para links que vão direto à página de pagamento. Preenche o campo "Origem" da venda.
 *    Até 30 caracteres; "|" separa partes; "_" não é permitido.
 *  - src: é o equivalente para links de afiliado e hotlinks (go.hotmart.com), não para pay.hotmart.com.
 *
 * Aqui: as UTMs que chegaram na URL da página são repassadas como vieram, e o sck é montado como
 * "<origem>|<botão>", por exemplo "ig|oferta" ou "site|topo". Se a URL já trouxer sck (ou src), vale o que veio.
 */

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** parâmetros de campanha que guardamos durante a visita */
export const CAMPAIGN_KEYS = [...UTM_KEYS, "sck", "src", "fbclid"] as const;

export type Campaign = Partial<Record<(typeof CAMPAIGN_KEYS)[number], string>>;

/** Lê os parâmetros de campanha de uma query string ("?utm_source=ig&..."). */
export function readCampaign(search: string): Campaign {
  const params = new URLSearchParams(search);
  const out: Campaign = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

/** Deixa um valor no formato que a Hotmart aceita em sck/src: sem "_", sem espaços nem acentos, até `max` caracteres. */
export function hotmartCode(value: string, max = 30): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^A-Za-z0-9|.-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/-?\|-?/g, "|")
    .replace(/^[-|]+|[-|]+$/g, "")
    .slice(0, max);
}

/** Nome curto do botão para o sck, a partir do rótulo usado na medição (data-track-location). */
export function buttonCode(location?: string | null): string {
  const text = (location ?? "").toLowerCase();
  if (!text) return "";
  if (text.includes("faixa")) return "faixa";
  if (text.includes("antes")) return "antes";
  if (text.includes("barra")) return "barra";
  if (text.includes("popup")) return "popup";
  if (text.includes("card")) return "card";
  return hotmartCode(text, 12);
}

type Options = {
  campaign: Campaign;
  /** rótulo do botão clicado (data-track-location) */
  location?: string | null;
  /** o visitante aceitou os cookies de anúncios? Só então o identificador do clique da Meta (fbclid) é repassado */
  adsConsent: boolean;
};

/** Devolve o link de compra com UTMs e origem. Links que não são da Hotmart voltam como vieram. */
export function buildCheckoutUrl(href: string, { campaign, location, adsConsent }: Options): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (!/(^|\.)hotmart\.com$/i.test(url.hostname)) return href;

  // UTMs: repassadas como vieram (não sobrescreve o que já estiver no link)
  for (const key of UTM_KEYS) {
    if (campaign[key] && !url.searchParams.has(key)) url.searchParams.set(key, campaign[key]!);
  }

  // origem: sck na página de pagamento, src nos demais links da Hotmart
  const originKey = url.hostname.toLowerCase().startsWith("pay.") ? "sck" : "src";
  if (!url.searchParams.has(originKey)) {
    // se a URL da página já trouxe um código de origem (sck ou src), ele vale como está
    const fromUrl = hotmartCode(campaign[originKey] ?? campaign.sck ?? campaign.src ?? "");
    const button = buttonCode(location);
    const source = hotmartCode(campaign.utm_source ?? "", button ? 29 - button.length : 30) || "site";
    const value = fromUrl || [source, button].filter(Boolean).join("|");
    if (value) url.searchParams.set(originKey, value.slice(0, 30));
  }

  // identificador do clique no anúncio da Meta: ajuda a Hotmart a atribuir a compra ao anúncio; só com aceite
  if (adsConsent && campaign.fbclid && !url.searchParams.has("fbclid")) url.searchParams.set("fbclid", campaign.fbclid);

  // espaços como %20 (e não "+"): é a forma que qualquer sistema lê sem ambiguidade
  url.search = url.search.replace(/\+/g, "%20");
  return url.toString();
}
