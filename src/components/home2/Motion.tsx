"use client";

import { useEffect } from "react";

/**
 * Entradas por rolagem da home: cada bloco com [data-m] entra uma vez, quando chega na tela.
 * Sem JavaScript nada fica escondido (o estado inicial só vale com a classe .hm2-js).
 * Blocos que começam recortados (data-m="clip") são observados pelo elemento pai,
 * porque o recorte zera a área visível e o navegador não os veria entrar.
 */
export default function Motion() {
  useEffect(() => {
    const roots = Array.from(document.querySelectorAll<HTMLElement>(".hm2"));
    const els = Array.from(document.querySelectorAll<HTMLElement>(".hm2 [data-m]"));
    if (!roots.length || !("IntersectionObserver" in window)) return;
    roots.forEach((r) => r.classList.add("hm2-js"));
    const byTarget = new Map<Element, HTMLElement[]>();
    for (const el of els) {
      const target = el.dataset.m === "clip" ? (el.parentElement ?? el) : el;
      byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          byTarget.get(e.target)?.forEach((el) => el.setAttribute("data-in", ""));
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    byTarget.forEach((_, t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return null;
}
