/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/**
 * Coluna "Nome do produto" na lista de ofertas: miniatura da foto + nome + loja.
 * O conjunto todo abre a tela de edição do produto.
 */

type Props = {
  cellData?: unknown;
  rowData?: Record<string, unknown>;
  linkURL?: string;
  collectionSlug?: string;
};

function store(row: Record<string, unknown>): string {
  if (typeof row.store === "string" && row.store.trim()) return row.store.trim();
  try {
    const host = new URL(String(row.href ?? "")).hostname.replace(/^www\./, "");
    if (host.includes("mercadolivre") || host.includes("mercadolibre")) return "Mercado Livre";
    if (host.includes("amazon") || host === "a.co" || host === "amzn.to") return "Amazon";
    if (host.includes("shopee")) return "Shopee";
    if (host.includes("magazineluiza") || host.includes("magalu")) return "Magalu";
    return host;
  } catch {
    return "";
  }
}

export default function OfferTitleCell({ cellData, rowData, linkURL, collectionSlug }: Props) {
  const row = rowData ?? {};
  const title = typeof cellData === "string" && cellData ? cellData : "(sem nome)";
  const image = typeof row.imageUrl === "string" ? row.imageUrl.trim() : "";
  const href = linkURL || (row.id ? `/admin/collections/${collectionSlug || "offers"}/${String(row.id)}` : "");
  const shop = store(row);

  const content = (
    <>
      <span className="ceo-cell__thumb">
        {image ? <img src={image} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span aria-hidden="true">sem foto</span>}
      </span>
      <span className="ceo-cell__text">
        <span className="ceo-cell__title">{title}</span>
        {shop && <span className="ceo-cell__sub">{shop}</span>}
      </span>
    </>
  );

  return href ? (
    <Link className="ceo-cell" href={href}>
      {content}
    </Link>
  ) : (
    <span className="ceo-cell">{content}</span>
  );
}
