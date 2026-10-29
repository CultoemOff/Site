import SitePromoBar from "../src/components/sales/SitePromoBar";
import { COURSES } from "../src/config/courses";
import { SITE_PROMO_COURSE_ID } from "../src/config/site";
import { resolvePrice } from "../src/lib/pricing";

// mesma lógica do layout do site (faixa amarela em todas as páginas)
export default function SitePromo() {
  const c = COURSES.find((x) => x.id === SITE_PROMO_COURSE_ID);
  const p = c ? resolvePrice(c) : undefined;
  if (!c || !p?.promo) return null;
  return <SitePromoBar label={p.promo.label} off={p.off} endsAt={p.promo.endsAt} courseId={c.id} title={c.title} href={`/formacoes/${c.id}`} />;
}
