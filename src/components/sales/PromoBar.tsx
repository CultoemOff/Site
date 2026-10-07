import Link from "next/link";
import Countdown from "./Countdown";
import "./promo-bar.css";

type Props = {
  label: string;
  off: number;
  /** prazo da promoção (opcional): com data, mostra a contagem regressiva */
  endsAt?: string;
  /** texto curto antes do desconto, ex.: nome da formação (opcional) */
  product?: string;
  href: string;
  cta: string;
  /** versão curta do botão para o celular */
  ctaShort?: string;
  external?: boolean;
  /** medição do clique: nome da formação, onde a faixa está e, se o botão já leva à compra, o preço */
  track: { label: string; location: string; id?: string; value?: number };
};

/** Faixa amarela da promoção: fixa no topo, acima do menu, com o desconto, o prazo (se houver) e o botão. */
export default function PromoBar({ label, off, endsAt, product, href, cta, ctaShort, external, track: tr }: Props) {
  const inner = (
    <>
      <span className="promo-bar__cta-full">{cta}</span>
      <span className="promo-bar__cta-short">{ctaShort ?? cta}</span>
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </>
  );
  // link de fora (Hotmart) = início da compra; link interno = ida para a página da formação
  const track = {
    "data-track": external ? "begin_checkout" : "select_item",
    "data-track-label": tr.label,
    "data-track-location": tr.location,
    "data-track-id": tr.id,
    "data-track-value": tr.value,
  };
  return (
    <div className="promo-bar" role="note">
      <span className="promo-bar__label">{label}</span>
      {product && <span className="promo-bar__product">{product}</span>}
      <strong className="promo-bar__off">{off}% OFF</strong>
      {endsAt && (
        <span className="promo-bar__timer">
          <span className="promo-bar__ends">termina em </span>
          <Countdown endsAt={endsAt} variant="inline" />
        </span>
      )}
      {!external && href.startsWith("/") ? (
        <Link className="promo-bar__btn" href={href} {...track}>
          {inner}
        </Link>
      ) : (
        <a className="promo-bar__btn" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...track}>
          {inner}
        </a>
      )}
    </div>
  );
}
