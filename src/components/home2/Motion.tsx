"use client";

import { useEffect } from "react";

/**
 * Entradas por rolagem da home2: cada bloco com [data-m] entra uma vez, quando chega na tela.
 * Sem JavaScript nada fica escondido (o estado inicial só vale com a classe .hm2-js).
 */
export default function Motion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hm2");
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-m]"));
    if (!("IntersectionObserver" in window)) return;
    root.classList.add("hm2-js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
