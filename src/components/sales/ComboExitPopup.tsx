import { COMBO_PAGE } from "@/config/comboPage";
import { COMBO, formatPrice, type Course } from "@/config/courses";
import { resolvePrice } from "@/lib/pricing";
import ExitPopup from "./ExitPopup";

/**
 * Aviso de saída que leva à página do combo (home e páginas de download dos softwares, pedido do Jonas em 27/11/2026).
 * Usa o mesmo prazo da promoção do Culto ao Vivo e some quando ela acaba. Aparece uma vez por visita (id "combo").
 */
export default function ComboExitPopup({ courses, location }: { courses: Course[]; location: string }) {
  const combo = COMBO;
  if (!combo || !(COMBO_PAGE.price > 0)) return null;
  const main = courses.find((c) => c.id === combo.main);
  const bump = courses.find((c) => c.id === combo.bump);
  if (!main || !bump) return null;
  const pMain = resolvePrice(main);
  const pBump = resolvePrice(bump);
  if (!pMain.promo) return null;
  const full = (pMain.priceFrom ?? pMain.price) + (pBump.priceFrom ?? pBump.price);
  const off = full > COMBO_PAGE.price ? Math.round((1 - COMBO_PAGE.price / full) * 100) : 0;
  if (off <= 0) return null;
  const short = (c: Course) => c.title.split(":")[0];
  return (
    <ExitPopup
      id="combo"
      productName={`Combo ${short(main)} + ${short(bump)}`}
      itemId={COMBO_PAGE.slug}
      location={location}
      badge={pMain.promo.label}
      title={`Antes de sair: ${off}% de desconto nos dois cursos`}
      text={`${short(main)} (a live do culto no OBS) + ${short(bump)} (a rede que segura a live), numa compra só, com 2 certificados e acesso vitalício.`}
      priceFrom={formatPrice(full)}
      price={formatPrice(COMBO_PAGE.price)}
      endsAt={pMain.promo.endsAt}
      ctaHref={`/formacoes/${COMBO_PAGE.slug}`}
      ctaLabel="Ver o combo"
    />
  );
}
