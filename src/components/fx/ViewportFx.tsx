"use client";

import { useEffect } from "react";

/**
 * Observador único de viewport (montado uma vez na página):
 * - [data-reveal]: entra com opacity + translateY + blur (stagger via --i);
 * - [data-anim]: animações CSS só rodam enquanto o bloco está visível.
 *
 * Sem JavaScript, nada fica escondido: a classe .js-reveal só é aplicada
 * por um script inline no layout, que também a remove se este componente
 * não iniciar a tempo.
 */
export default function ViewportFx() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-live");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let revealIO: IntersectionObserver | null = null;
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      revealIO = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealIO?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      revealEls.forEach((el) => revealIO?.observe(el));
    }

    const animEls = Array.from(document.querySelectorAll<HTMLElement>("[data-anim]"));
    const animIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute("data-inview", entry.isIntersecting);
        }
      },
      { rootMargin: "80px 0px" },
    );
    animEls.forEach((el) => animIO.observe(el));

    return () => {
      revealIO?.disconnect();
      animIO.disconnect();
    };
  }, []);

  return null;
}
