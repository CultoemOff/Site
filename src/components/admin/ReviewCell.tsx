/**
 * Coluna "Link de review" na lista de ofertas: mostra se o produto tem review.
 * Quando tem, a etiqueta abre o vídeo em outra aba.
 */

type Props = { cellData?: unknown };

export default function ReviewCell({ cellData }: Props) {
  const url = typeof cellData === "string" ? cellData.trim() : "";
  if (!/^https?:\/\/\S+$/i.test(url)) return <span className="ceo-pill ceo-pill--no">Sem review</span>;
  return (
    <a className="ceo-pill ceo-pill--review" href={url} target="_blank" rel="noopener noreferrer" title="Abrir o review em outra aba">
      ▶ Tem review
    </a>
  );
}
