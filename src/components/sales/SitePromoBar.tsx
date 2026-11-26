"use client";

import { usePathname } from "next/navigation";
import PromoBar from "./PromoBar";

type Props = {
  label: string;
  off: number;
  endsAt?: string;
  courseId: string;
  title: string;
  /** texto antes do desconto (padrão: "Curso de <título>") */
  product?: string;
  /** endereço completo da página da formação (funciona também em links. e ofertas.) */
  href: string;
};

/**
 * Faixa amarela da promoção em todas as páginas do site (desde 26/11/2026 leva ao combo).
 * Fica de fora nas páginas de venda (/formacoes/<formação>), que já têm a faixa da própria formação.
 */
export default function SitePromoBar({ label, off, endsAt, courseId, title, product, href }: Props) {
  const path = usePathname() ?? "/";
  if (/^\/formacoes\/[^/]+/.test(path)) return null;
  return (
    <PromoBar
      label={label}
      product={product ?? `Curso de ${title}`}
      off={off}
      endsAt={endsAt}
      href={href}
      cta="Ver a oferta"
      ctaShort="Ver oferta"
      track={{ label: title, id: courseId, location: `faixa amarela (${path})` }}
    />
  );
}
