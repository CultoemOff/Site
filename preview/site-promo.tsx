import SitePromoBar from "../src/components/sales/SitePromoBar";
import { COMBO_PAGE } from "../src/config/comboPage";
import { COURSES } from "../src/config/courses";
import { SITE_PROMO_COURSE_ID } from "../src/config/site";
import { resolvePrice } from "../src/lib/pricing";

// mesma lógica do layout do site (faixa amarela em todas as páginas, levando ao combo)
export default function SitePromo() {
  const c = COURSES.find((x) => x.id === SITE_PROMO_COURSE_ID);
  const p = c ? resolvePrice(c) : undefined;
  const full = ["culto-ao-vivo-com-excelencia", "redes-para-igrejas"]
    .map((id) => COURSES.find((x) => x.id === id)!)
    .reduce((s, x) => s + (resolvePrice(x).priceFrom ?? x.price), 0);
  const off = Math.round((1 - COMBO_PAGE.price / full) * 100);
  if (!c || !p?.promo) return null;
  return (
    <SitePromoBar
      label={p.promo.label}
      off={off}
      endsAt={p.promo.endsAt}
      courseId={COMBO_PAGE.slug}
      title="Combo Culto ao Vivo + Redes para Igrejas"
      product="Combo Culto ao Vivo + Redes"
      href={`/${"combo.html"}`}
    />
  );
}
