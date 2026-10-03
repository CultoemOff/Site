import type { Course } from "@/config/courses";
import { SALES_PAGES } from "@/config/salesPages";

export type ResolvedPrice = {
  /** preço que a pessoa paga agora */
  price: number;
  /** preço cheio riscado ("de"), quando há desconto valendo */
  priceFrom?: number;
  /** desconto em % (0 quando não há) */
  off: number;
  /** promoção valendo (com ou sem prazo) */
  promo?: { label: string; endsAt?: string };
  /** parcelamento do preço atual (some quando a promoção acaba, pois as parcelas são do preço promocional) */
  installments?: { count: number; value: number };
};

/**
 * Preço de uma formação considerando a promoção.
 * - Formação com promoção datada (src/config/salesPages.ts): o desconto vale até o prazo;
 *   depois disso, o preço exibido volta a ser o cheio.
 * - Formação só com "preço cheio" (sem prazo): mostra "de/por" enquanto o campo estiver preenchido.
 */
export function resolvePrice(
  course: Pick<Course, "id" | "price" | "priceFrom" | "installments">,
  now = Date.now(),
): ResolvedPrice {
  // sem preço definido (formação que ainda vai lançar): nada de promoção nem parcelas
  if (!(course.price > 0)) return { price: 0, off: 0 };
  const full = course.priceFrom && course.priceFrom > course.price ? course.priceFrom : undefined;
  const installments =
    course.installments && course.installments.count > 1 && course.installments.value > 0 ? course.installments : undefined;
  if (!full) return { price: course.price, off: 0, installments };
  const promo = SALES_PAGES[course.id]?.promo;
  if (promo?.endsAt && now >= Date.parse(promo.endsAt)) return { price: full, off: 0 };
  return {
    price: course.price,
    priceFrom: full,
    off: Math.round((1 - course.price / full) * 100),
    promo: promo ? { label: promo.label, endsAt: promo.endsAt } : undefined,
    installments,
  };
}
