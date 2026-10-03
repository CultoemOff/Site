import { OFFER_TAGS, type OfferTag } from "@/config/offers";

/** Coluna "Categorias" na lista de ofertas: uma etiqueta por categoria. */

type Props = { cellData?: unknown };

export default function OfferTagsCell({ cellData }: Props) {
  const tags = Array.isArray(cellData) ? cellData.map(String) : typeof cellData === "string" && cellData ? [cellData] : [];
  if (tags.length === 0) return <span className="ceo-pill ceo-pill--no">—</span>;
  return (
    <span className="ceo-tags">
      {tags.map((tag) => (
        <span key={tag} className="ceo-pill ceo-pill--tag">
          {OFFER_TAGS[tag as OfferTag] ?? tag}
        </span>
      ))}
    </span>
  );
}
