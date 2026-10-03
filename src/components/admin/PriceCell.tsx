/**
 * Coluna de preço nas listas (ofertas e formações): mostra em reais,
 * com o preço anterior riscado e o desconto quando houver.
 */

type Props = {
  cellData?: unknown;
  rowData?: Record<string, unknown>;
};

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function PriceCell({ cellData, rowData }: Props) {
  if (typeof cellData !== "number") return <span className="ceo-price ceo-price--empty">sem preço</span>;
  const from = typeof rowData?.priceFrom === "number" && rowData.priceFrom > cellData ? rowData.priceFrom : null;
  const off = from ? Math.round((1 - cellData / from) * 100) : 0;
  return (
    <span className="ceo-price">
      {from !== null && <s>{money(from)}</s>}
      <strong>{money(cellData)}</strong>
      {off > 0 && <span className="ceo-price__off">-{off}%</span>}
    </span>
  );
}
