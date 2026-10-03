"use client";

import { useEffect, useRef, useState } from "react";
import { OFFER_TAGS, OFFER_TAG_ORDER, type Offer, type OfferTag } from "@/config/offers";
import OfferCard from "./OfferCard";

/** Quantos cards entram por vez conforme a pessoa rola a página. */
const BATCH = 12;

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
