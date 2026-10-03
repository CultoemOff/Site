"use client";

import { useState } from "react";
import { formatPrice } from "@/config/courses";
import { storeName } from "@/config/equipment";
import { OFFER_TAGS, type Offer } from "@/config/offers";
import "./offer-card.css";

const checkedOn = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
};

/** Card branco de um produto (página de ofertas e carrossel da home). */
export default function OfferCard({ offer }: { offer: Offer }) {
  const [imgOk, setImgOk] = useState(true);
  const store = storeName({ store: offer.store, href: offer.href });
  const off = offer.price && offer.priceFrom ? Math.round((1 - offer.price / offer.priceFrom) * 100) : 0;
  const date = checkedOn(offer.priceCheckedAt);
  return (
    <li className="offer">
      <div className="offer__card">
      <a
        className="offer__link"
        href={offer.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-track="click_offer"
        data-track-label={offer.title}
      >
        <span className="offer__media">
          {offer.imageUrl && imgOk ? (
            // foto hospedada na loja: o card centraliza e encaixa a imagem inteira, sem cortar o produto
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgOk(false)}
            />
          ) : (
            <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
              <rect x="7" y="11" width="34" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="18" cy="21" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m9 33 10-9 8 7 5-4 8 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          )}
          {off >= 5 && <span className="offer__off">-{off}%</span>}
        </span>
        <span className="offer__body">
          <span className="offer__tags">
            {offer.tags.map((t) => (
              <span key={t}>{OFFER_TAGS[t]}</span>
            ))}
          </span>
          <span className="offer__title">{offer.title}</span>
          <span className="sr-only"> (ver oferta, abre em nova aba)</span>
          {offer.note && <span className="offer__note">{offer.note}</span>}
          <span className="offer__price">
            {offer.price ? (
              <>
                {offer.priceFrom && <s>{formatPrice(offer.priceFrom)}</s>}
                <strong>{formatPrice(offer.price)}</strong>
                {date && <small>preço em {date}</small>}
              </>
            ) : (
              <strong className="offer__price--ask">Ver preço na loja</strong>
            )}
          </span>
          <span className="offer__store">no {store}</span>
        </span>
      </a>
      {offer.reviewUrl && (
        <a
          className="offer__review"
          href={offer.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track="click_review"
          data-track-label={offer.title}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />
          </svg>
          Assistir review
          <span className="sr-only"> de {offer.title} (abre em nova aba)</span>
        </a>
      )}
      {/* mesmo destino do link acima; fica fora da navegação por teclado para não repetir o produto */}
      <a
        className="offer__cta"
        href={offer.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        data-track="click_offer"
        data-track-label={offer.title}
      >
        Ver oferta
        <svg viewBox="0 0 16 16" focusable="false">
          <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      </div>
    </li>
  );
}
