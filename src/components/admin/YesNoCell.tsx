/** Colunas de marcar/desmarcar nas listas: "Sim" em destaque ou "Não" discreto, no lugar de verdadeiro/falso. */

type Props = { cellData?: unknown };

export default function YesNoCell({ cellData }: Props) {
  return cellData === true ? <span className="ceo-pill ceo-pill--yes">Sim</span> : <span className="ceo-pill ceo-pill--no">Não</span>;
}
