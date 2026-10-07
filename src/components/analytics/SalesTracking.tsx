"use client";

import { useEffect } from "react";
import { track } from "./track";

type Props = {
  /** id e nome da formação */
  itemId: string;
  name: string;
  /** preço atual, em reais */
  value?: number;
};

/**
 * Medição da página de venda (não mostra nada na tela):
 *  - view_item quando a página abre;
 *  - view_section quando cada parte marcada com data-track-view aparece na tela (uma vez por visita à página).
 * Assim dá para ver no Google Analytics até onde as pessoas rolam antes de comprar ou desistir.
 */
export default function SalesTracking({ itemId, name, value }: Props) {
  useEffect(() => {
    // o Google Analytics pode terminar de carregar um pouco depois da página: espera até 6 s
    let tries = 0;
    let sent = false;
    const send = () => {
      if (sent) return;
      if (!window.gtag && !window.fbq && tries++ < 20) return;
      sent = true;
      clearInterval(timer);
      track("view_item", { label: name, itemId, value });
    };
    const timer = setInterval(send, 300);
    send();

    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = (entry.target as HTMLElement).dataset.trackView;
          if (!entry.isIntersecting || !section || seen.has(section)) continue;
          seen.add(section);
          io.unobserve(entry.target);
          track("view_section", { label: name, itemId, section });
        }
      },
      { threshold: 0.25 },
    );
    document.querySelectorAll<HTMLElement>("[data-track-view]").forEach((el) => io.observe(el));

    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [itemId, name, value]);

  return null;
}
