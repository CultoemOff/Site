"use client";

import { useEffect } from "react";

/**
 * Observador único de viewport (montado uma vez na página):
 * - [data-reveal]: entra com opacity + translateY + blur (stagger via --i);
 * - [data-anim]: animações CSS só rodam enquanto o bloco está visível;
 * - [data-glow]: gradiente discreto que acompanha o mouse (--mx / --my).
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

    // brilho que acompanha o mouse em cards marcados com [data-glow]
    let glowRaf = 0;
    let lastEvent: PointerEvent | null = null;
    const applyGlow = () => {
      glowRaf = 0;
      const e = lastEvent;
      if (!e) return;
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-glow]") : null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastEvent = e;
      if (!glowRaf) glowRaf = requestAnimationFrame(applyGlow);
    };
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover && !reduce) document.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      revealIO?.disconnect();
      animIO.disconnect();
      document.removeEventListener("pointermove", onPointer);
      if (glowRaf) cancelAnimationFrame(glowRaf);
    };
  }, []);

  return null;
}
