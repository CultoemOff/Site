/**
 * Lê um link de produto (Mercado Livre e outras lojas) e tenta descobrir título, foto e preço.
 * Só no servidor. Nunca lança erro: se a loja bloquear ou a página mudar, retorna o que conseguiu (ou null).
 *
 * Ordem de leitura do preço:
 *  1. dados estruturados da página (JSON-LD de produto);
 *  2. marcações de preço (meta itemprop="price", product:price:amount, og:price:amount);
 *  3. o valor em destaque na página do Mercado Livre.
 */

export type ProductLinkInfo = {
  title?: string;
  image?: string;
  price?: number;
};

const USER_AGENT = "Mozilla/5.0 (compatible; CultoEmOffOfertas/1.0; +https://cultoemoff.com.br/ofertas)";
const MAX_HTML = 2_500_000;

/** Aceita só http(s) e recusa endereços internos (o link vem do painel, mas não custa conferir). */
export function isPublicHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || !h.includes(".")) return false;
    if (/^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)) return false;
    if (h.startsWith("[")) return false;
    return true;
  } catch {
    return false;
  }
}

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .trim();

/** "1.234,56" | "1234.56" | "1.234" | "R$ 99,90" → número (ou undefined). */
export function parsePrice(raw: unknown): number | undefined {
  if (typeof raw === "number") return Number.isFinite(raw) && raw > 0 ? raw : undefined;
  if (typeof raw !== "string") return undefined;
  let s = raw.replace(/[^\d.,]/g, "");
  if (!s) return undefined;
  if (s.includes(",") && s.includes(".")) {
    // o separador decimal é o que aparece por último
    s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : undefined;
}

function metaContent(html: string, keys: string[]): string | undefined {
  for (const key of keys) {
    const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const a = html.match(new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${k}["'][^>]*?content=["']([^"']*)["']`, "i"));
    const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*?(?:property|name|itemprop)=["']${k}["']`, "i"));
    const v = a?.[1] ?? b?.[1];
    if (v) return decode(v);
  }
  return undefined;
}

type Json = Record<string, unknown>;

/** Procura um objeto de produto (com oferta) em qualquer nível do JSON-LD. */
function findProduct(node: unknown, depth = 0): Json | undefined {
  if (!node || typeof node !== "object" || depth > 6) return undefined;
  if (Array.isArray(node)) {
    for (const n of node) {
      const hit = findProduct(n, depth + 1);
      if (hit) return hit;
    }
    return undefined;
  }
  const o = node as Json;
  const type = o["@type"];
  const isProduct = type === "Product" || (Array.isArray(type) && type.includes("Product"));
  if (isProduct && o.offers) return o;
  for (const key of ["@graph", "mainEntity", "itemListElement", "item"]) {
    const hit = findProduct(o[key], depth + 1);
    if (hit) return hit;
  }
  return undefined;
}

function jsonLdProduct(html: string): { title?: string; image?: string; price?: number } {
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];
  for (const block of blocks) {
    const body = block.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "");
    try {
      const product = findProduct(JSON.parse(body));
      if (!product) continue;
      const offers = (Array.isArray(product.offers) ? product.offers[0] : product.offers) as Json | undefined;
      const image = Array.isArray(product.image) ? product.image[0] : product.image;
      return {
        title: typeof product.name === "string" ? decode(product.name) : undefined,
        image: typeof image === "string" ? image : undefined,
        price: parsePrice(offers?.price) ?? parsePrice(offers?.lowPrice),
      };
    } catch {
      /* bloco inválido: tenta o próximo */
    }
  }
  return {};
}

/** Valor em destaque na página do Mercado Livre (ignora o preço antigo, riscado). */
function mercadoLivrePrice(html: string): number | undefined {
  // os centavos só valem se vierem logo depois, antes de aparecer outro valor
  const re = /andes-money-amount__fraction[^>]*>([\d.]+)<(?:(?:(?!andes-money-amount__fraction)[\s\S]){0,300}?andes-money-amount__cents[^>]*>(\d{1,2})<)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    // olha só o elemento que envolve este valor: o preço antigo vem marcado como "previous"
    const before = html.slice(Math.max(0, m.index - 600), m.index);
    let container = before.slice(Math.max(before.lastIndexOf("<s "), before.lastIndexOf('"andes-money-amount '), 0));
    const closed = container.lastIndexOf("</s>");
    if (closed >= 0) container = container.slice(closed);
    if (/previous|original/i.test(container)) continue;
    return parsePrice(`${m[1]}${m[2] ? `,${m[2].padStart(2, "0")}` : ""}`);
  }
  return undefined;
}

export async function readProductLink(url: string): Promise<ProductLinkInfo | null> {
  if (!isPublicHttpUrl(url)) return null;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "pt-BR,pt;q=0.9",
      },
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, MAX_HTML);
    const ld = jsonLdProduct(html);
    const host = new URL(res.url || url).hostname;

    const title = ld.title ?? metaContent(html, ["og:title", "twitter:title"]) ?? decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const image = ld.image ?? metaContent(html, ["og:image", "og:image:secure_url", "twitter:image"]);
    const price =
      ld.price ??
      parsePrice(metaContent(html, ["price", "product:price:amount", "og:price:amount"])) ??
      (/mercadoli[vb]re/i.test(host) ? mercadoLivrePrice(html) : undefined);

    const info: ProductLinkInfo = {
      title: title ? title.replace(/\s*[|\-–]\s*(Mercado\s?Livre|MercadoLivre|Amazon\.com\.br|Shopee Brasil).*$/i, "").slice(0, 160) : undefined,
      image: image && isPublicHttpUrl(image) ? image.replace(/^http:/, "https:") : undefined,
      price,
    };
    return info.title || info.image || info.price ? info : null;
  } catch {
    return null;
  }
}
