"use client";

import { useEffect } from "react";

/**
 * Medição da página de links da bio (vai para o Google Analytics, junto com o page_view e os cliques "click_link").
 * Ao sair (fechar a aba, trocar de app ou de aba), envia uma única vez:
 *  - links_exit      sempre: clicou ou não, quantos cliques, último clique, segundos na página e até onde rolou (%)
 *  - links_no_click  só quando a pessoa saiu sem clicar em nada
 * Os eventos usam "beacon", que chega ao GA mesmo com a página fechando.
 */
export default function LinksTracking() {
  useEffect(() => {
    const start = Date.now();
    let clicks = 0;
    let lastClick = "";
    let maxScroll = 0;
    let sent = false;

    const onClick = (e: MouseEvent) => {
      // links com data-track e botões (ex.: "Copiar cupom") contam como interação
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-track], button") : null;
      if (!el) return;
      clicks += 1;
      lastClick = el.dataset.trackLabel || el.dataset.track || el.textContent?.trim().slice(0, 40) || "";
    };
    // botão do meio e "abrir em nova aba" pelo toque longo também contam como clique no link
    const onAux = (e: MouseEvent) => {
      if (e.button === 1) onClick(e);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.round((window.scrollY / total) * 100) : 100;
      if (pct > maxScroll) maxScroll = Math.min(100, pct);
    };

    const send = () => {
      if (sent || !window.gtag) return;
      sent = true;
      const params = {
        clicked: clicks > 0 ? "sim" : "nao",
        clicks,
        last_click: lastClick || "(nenhum)",
        seconds: Math.round((Date.now() - start) / 1000),
        scroll_percent: maxScroll,
        transport_type: "beacon",
      };
      window.gtag("event", "links_exit", params);
      if (clicks === 0) window.gtag("event", "links_no_click", params);
    };
    const onHidden = () => {
      if (document.visibilityState === "hidden") send();
    };

    onScroll();
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onAux, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", send);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onAux, true);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", send);
    };
  }, []);

  return null;
}
