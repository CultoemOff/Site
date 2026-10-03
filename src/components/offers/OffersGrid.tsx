"use client";

import { useEffect, useRef, useState } from "react";
import { OFFER_TAGS, OFFER_TAG_ORDER, type Offer, type OfferTag } from "@/config/offers";
import OfferCard from "./OfferCard";

/** Quantos cards entram por vez conforme a pessoa rola a página. */
const BATCH = 12;

type Sort = "recommended" | "price-asc" | "price-desc";
const SORTS: { value: Sort; label: string }[] = [
  { value: "recommended", label: "Recomendados" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

/** Ordena por preço; produtos sem preço ("Ver preço na loja") ficam sempre no fim. */
function sortOffers(list: Offer[], sort: Sort): Offer[] {
  if (sort === "recommended") return list;
  const dir = sort === "price-asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    if (a.price == null && b.price == null) return 0;
    if (a.price == null) return 1;
    if (b.price == null) return -1;
    return (a.price - b.price) * dir;
  });
}

/** Filtros por categoria + lista que cresce conforme a rolagem (sem trocar de página). */
export default function OffersGrid({ offers }: { offers: Offer[] }) {
  const [tag, setTag] = useState<OfferTag | "all">("all");
  const [sort, setSort] = useState<Sort>("recommended");
  const [visible, setVisible] = useState(BATCH);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const tagsInUse = OFFER_TAG_ORDER.filter((t) => offers.some((o) => o.tags.includes(t)));
  const list = sortOffers(tag === "all" ? offers : offers.filter((o) => o.tags.includes(tag)), sort);
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
      <div className="offers__filters">
        <div className="offers__chips" role="group" aria-label="Filtrar por categoria">
          <button type="button" className="offers__chip" aria-pressed={tag === "all"} onClick={() => choose("all")}>
            Todos <span>{offers.length}</span>
          </button>
          {tagsInUse.map((t) => (
            <button key={t} type="button" className="offers__chip" aria-pressed={tag === t} onClick={() => choose(t)}>
              {OFFER_TAGS[t]} <span>{offers.filter((o) => o.tags.includes(t)).length}</span>
            </button>
          ))}
        </div>
        <label className="offers__sort">
          <span className="sr-only">Ordenar por</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M6 4v12m0 0-3-3m3 3 3-3M14 16V4m0 0-3 3m3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as Sort);
              setVisible(BATCH);
            }}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
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
