"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/components/analytics/track";
import Countdown from "./Countdown";
import "@/components/ui/button.css";
import "./exit-popup.css";

type Props = {
  /** identificador (uma vez por visita) */
  id: string;
  title: string;
  text: string;
  priceFrom?: string;
  price: string;
  badge?: string;
  endsAt?: string;
  ctaHref: string;
  ctaLabel: string;
  external?: boolean;
  productName: string;
};

/**
 * Aviso que aparece quando a pessoa faz menção de sair da página:
 *  - no computador, quando o mouse sai pelo topo da janela;
 *  - no celular, quando ela já rolou boa parte da página e volta rápido para cima.
 * Aparece uma vez por visita. Fecha com Esc, no X ou clicando fora.
 */
export default function ExitPopup({ id, title, text, priceFrom, price, badge, endsAt, ctaHref, ctaLabel, external, productName }: Props) {
  const [open, setOpen] = useState(false);
  const shown = useRef(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const key = `coe-exit:${id}`;

  const show = useCallback(() => {
    if (shown.current) return;
    shown.current = true;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* sem sessionStorage: mostra mesmo assim, uma vez nesta página */
    }
    setOpen(true);
    track("exit_popup_view", { label: productName });
  }, [key, productName]);

  useEffect(() => {
    let armed = false;
    const arm = setTimeout(() => (armed = true), 6000); // não interrompe quem acabou de chegar

    const onLeave = (e: MouseEvent) => {
      if (armed && e.clientY <= 0 && !e.relatedTarget) show();
    };

    let maxY = 0;
    let lastY = window.scrollY;
    let lastT = Date.now();
    const onScroll = () => {
      const y = window.scrollY;
      const now = Date.now();
      maxY = Math.max(maxY, y);
      const deep = maxY > (document.documentElement.scrollHeight - window.innerHeight) * 0.35;
      const speed = (lastY - y) / Math.max(1, now - lastT); // px/ms para cima
      if (armed && deep && speed > 2.2 && window.matchMedia("(pointer: coarse)").matches) show();
      lastY = y;
      lastT = now;
    };

    document.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div className="exit" role="dialog" aria-modal="true" aria-labelledby="exit-title" onClick={() => setOpen(false)}>
      <div className="exit__card" onClick={(e) => e.stopPropagation()}>
        <button ref={closeBtn} type="button" className="exit__close" aria-label="Fechar" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {badge && <p className="exit__badge">{badge}</p>}
        <h2 id="exit-title" className="exit__title">
          {title}
        </h2>
        <p className="exit__text">{text}</p>
        <p className="exit__price">
          {priceFrom && <s>de {priceFrom}</s>}
          <strong>
            {priceFrom ? "por " : ""}
            {price}
          </strong>
        </p>
        {endsAt && (
          <div className="exit__timer">
            <span>O preço promocional termina em</span>
            <Countdown endsAt={endsAt} />
          </div>
        )}
        <a
          className="btn btn--primary exit__cta"
          href={ctaHref}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          data-track="select_course"
          data-track-label={`${productName} (popup de saída)`}
          onClick={() => setOpen(false)}
        >
          <span>{ctaLabel}</span>
        </a>
        <button type="button" className="exit__dismiss" onClick={() => setOpen(false)}>
          Agora não
        </button>
      </div>
    </div>
  );
}
