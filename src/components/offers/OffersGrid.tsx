"use client";

import { useEffect, useRef, useState } from "react";
import { storeName } from "@/config/equipment";
import { formatPrice } from "@/config/courses";
import { OFFER_TAGS, OFFER_TAG_ORDER, type Offer, type OfferTag } from "@/config/offers";

/** Quantos cards entram por vez conforme a pessoa rola a página. */
const BATCH = 12;

const checkedOn = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
};

function OfferCard({ offer }: { offer: Offer }) {
  const [imgOk, setImgOk] = useState(true);
  const store = storeName({ store: offer.store, href: offer.href });
  const off = offer.price && offer.priceFrom ? Math.round((1 - offer.price / offer.priceFrom) * 100) : 0;
  const date = checkedOn(offer.priceCheckedAt);
  return (
    <li className="offer">
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
          <span className="offer__cta">
            Ver oferta
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only"> (abre em nova aba)</span>
          </span>
        </span>
      </a>
    </li>
  );
}

/** Filtros por categoria + lista que cresce conforme a rolagem (sem trocar de página). */
export default function OffersGrid({ offers }: { offers: Offer[] }) {
  const [tag, setTag] = useState<OfferTag | "all">("all");
  const [visible, setVisible] = useState(BATCH);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const tagsInUse = OFFER_TAG_ORDER.filter((t) => offers.some((o) => o.tags.includes(t)));
  const list = tag === "all" ? offers : offers.filter((o) => o.tags.includes(tag));
  const shown = list.slice(0, visible);
  const hasMore = visible < list.length;

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(list.length);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible((v) => v + BATCH);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, list.length, visible]);

  const choose = (t: OfferTag | "all") => {
    setTag(t);
    setVisible(BATCH);
  };

  return (
    <>
      <div className="offers__filters" role="group" aria-label="Filtrar por categoria">
        <button type="button" className="offers__chip" aria-pressed={tag === "all"} onClick={() => choose("all")}>
          Todos <span>{offers.length}</span>
        </button>
        {tagsInUse.map((t) => (
          <button key={t} type="button" className="offers__chip" aria-pressed={tag === t} onClick={() => choose(t)}>
            {OFFER_TAGS[t]} <span>{offers.filter((o) => o.tags.includes(t)).length}</span>
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <ul className="offers__grid">
          {shown.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </ul>
      ) : (
        <p className="offers__empty">Ainda não há ofertas nesta categoria.</p>
      )}

      {hasMore && (
        <div ref={sentinel} className="offers__more">
          <button type="button" className="offers__chip" onClick={() => setVisible((v) => v + BATCH)}>
            Carregar mais
          </button>
        </div>
      )}
    </>
  );
}
