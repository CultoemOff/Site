import { COMBO, formatPrice, type Course } from "@/config/courses";
import { resolvePrice } from "@/lib/pricing";

/**
 * "Leve os dois": o checkout do curso principal já traz o outro curso como order bump.
 * Os preços vêm das formações (preço atual) e do valor do order bump em COMBO (src/config/courses.ts).
 */
export default function ComboBanner({ courses }: { courses: Course[] }) {
  const combo = COMBO;
  if (!combo) return null;
  const main = courses.find((c) => c.id === combo.main);
  const bump = courses.find((c) => c.id === combo.bump);
  if (!main?.href || !bump) return null;
  const pMain = resolvePrice(main).price;
  const pBump = resolvePrice(bump).price;
  if (!(pMain > 0) || !(pBump > 0)) return null;
  const total = Math.round((pMain + combo.bumpPrice) * 100) / 100;
  const separate = Math.round((pMain + pBump) * 100) / 100;
  const short = (c: Course) => c.title.split(":")[0];
  return (
    <aside className="combo" data-reveal aria-labelledby="combo-title">
      <div className="combo__text">
        <p className="combo__kicker">Combo · os dois cursos</p>
        <h3 id="combo-title" className="combo__title">
          {short(main)} + {short(bump)}
        </h3>
        <p className="combo__note">
          No checkout do {short(main)}, o {short(bump)} já vem marcado por {formatPrice(combo.bumpPrice)}. Se não quiser, é só desmarcar.
        </p>
      </div>
      <div className="combo__offer">
        <p className="combo__price">
          {separate > total && (
            <span className="combo__from">
              separados <s>{formatPrice(separate)}</s>
            </span>
          )}
          <strong>{formatPrice(total)}</strong>
          <span className="combo__save">{separate > total ? `economia de ${formatPrice(separate - total)}` : ""}</span>
        </p>
        <a
          className="combo__btn"
          href={main.href}
          target="_blank"
          rel="noopener noreferrer"
          data-track="begin_checkout"
          data-track-label={`Combo ${short(main)} + ${short(bump)}`}
          data-track-id={main.id}
          data-track-value={total}
          data-track-location="combo"
        >
          Quero os dois
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </aside>
  );
}
