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
  trackLabel: string;
};

/** Faixa amarela da promoção: fixa no topo, acima do menu, com o desconto, o prazo (se houver) e o botão. */
export default function PromoBar({ label, off, endsAt, product, href, cta, ctaShort, external, trackLabel }: Props) {
  const inner = (
    <>
      <span className="promo-bar__cta-full">{cta}</span>
      <span className="promo-bar__cta-short">{ctaShort ?? cta}</span>
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </>
  );
  const track = { "data-track": "select_course", "data-track-label": trackLabel };
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
