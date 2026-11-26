import Link from "next/link";
import { COMBO, formatPrice, type Course } from "@/config/courses";
import { COMBO_PAGE } from "@/config/comboPage";
import { resolvePrice } from "@/lib/pricing";
import "./combo.css";

/** "R$ 82" em vez de "R$ 82,00" quando o valor é redondo */
const money = (v: number) => (Number.isInteger(v) ? `R$ ${v}` : formatPrice(v));

/**
 * "Os dois cursos": leva para a página do combo (/formacoes/combo-culto-ao-vivo-e-redes).
 * Preço do combo em src/config/comboPage.ts (oferta própria na Hotmart); sem ele, Culto ao Vivo + valor do order bump.
 * compact: versão menor para a home.
 */
export default function ComboBanner({ courses, compact = false, location = "combo" }: { courses: Course[]; compact?: boolean; location?: string }) {
  const combo = COMBO;
  if (!combo) return null;
  const main = courses.find((c) => c.id === combo.main);
  const bump = courses.find((c) => c.id === combo.bump);
  if (!main || !bump) return null;
  const pMain = resolvePrice(main).price;
  const pBump = resolvePrice(bump).price;
  if (!(pMain > 0) || !(pBump > 0)) return null;
  const total = COMBO_PAGE.price || Math.round((pMain + combo.bumpPrice) * 100) / 100;
  const separate = Math.round((pMain + pBump) * 100) / 100;
  const short = (c: Course) => c.title.split(":")[0];
  const href = `/formacoes/${COMBO_PAGE.slug}`;
  return (
    <aside className={`combo${compact ? " combo--compact" : ""}`} data-reveal aria-labelledby="combo-title">
      <div className="combo__text">
        <p className="combo__kicker">Combo · os dois cursos</p>
        <h3 id="combo-title" className="combo__title">
          {short(main)} + {short(bump)}
        </h3>
        <p className="combo__note">Os dois cursos numa compra só, com 2 certificados e acesso vitalício.</p>
      </div>
      <div className="combo__offer">
        <p className="combo__price">
          {separate > total && (
            <span className="combo__from">
              separados <s>{money(separate)}</s>
            </span>
          )}
          <strong>{money(total)}</strong>
          <span className="combo__save">{separate > total ? `economia de ${money(Math.round((separate - total) * 100) / 100)}` : ""}</span>
        </p>
        <Link
          className="combo__btn"
          href={href}
          data-track="select_item"
          data-track-label={`Combo ${short(main)} + ${short(bump)}`}
          data-track-id={COMBO_PAGE.slug}
          data-track-location={location}
        >
          Ver o combo
        </Link>
      </div>
    </aside>
  );
}
