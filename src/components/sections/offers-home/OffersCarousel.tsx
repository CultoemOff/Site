"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import OfferCard from "@/components/offers/OfferCard";
import type { Offer } from "@/config/offers";

/** Intervalo entre um produto e o próximo quando o carrossel anda sozinho. */
const AUTOPLAY_MS = 3500;

/**
 * Carrossel de ofertas da home: anda sozinho, um produto por vez, e volta ao começo no fim.
 * Para quando a pessoa passa o mouse, toca, usa o teclado ou sai da área visível,
 * e não anda sozinho para quem pediu menos movimento no sistema.
 */
export default function OffersCarousel({ offers }: { offers: Offer[] }) {
  const track = useRef<HTMLUListElement | null>(null);
  const paused = useRef(false);
  const visible = useRef(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = useCallback(() => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  const move = useCallback(
    (dir: 1 | -1, loop = false) => {
      const el = track.current;
      if (!el) return;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (dir === 1 && end && loop) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: dir * step(), behavior: "smooth" });
    },
    [step],
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const io = new IntersectionObserver((entries) => (visible.current = entries.some((e) => e.isIntersecting)), { threshold: 0.3 });
    io.observe(el);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = reduce
      ? 0
      : window.setInterval(() => {
          if (!paused.current && visible.current && !document.hidden && el.scrollWidth > el.clientWidth + 4) move(1, true);
        }, AUTOPLAY_MS);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      io.disconnect();
      if (timer) window.clearInterval(timer);
    };
  }, [move, update]);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <div
      className="oc"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
      onTouchEnd={() => window.setTimeout(resume, 6000)}
    >
      <ul ref={track} className="oc__track" aria-label="Produtos recomendados">
        {offers.map((o) => (
          <OfferCard key={o.id} offer={o} />
        ))}
      </ul>
      <div className="oc__nav">
        <button type="button" className="oc__btn" onClick={() => move(-1)} disabled={atStart} aria-label="Produtos anteriores">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M12 4 6 10l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="oc__btn" onClick={() => move(1)} disabled={atEnd} aria-label="Próximos produtos">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="m8 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
