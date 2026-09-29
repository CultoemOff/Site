"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./cinematic.css";

/**
 * Pausa cinematográfica: palco escuro com moving heads, fachos azuis, haze
 * e reflexo no piso. Os aparelhos fazem pan/tilt lento (CSS) e o conjunto
 * inclina levemente conforme o scroll (--scroll, de -1 a 1).
 */

type Head = { x: number; period: number; delay: number; amp: number; rgb: string; mobile?: boolean };

const HEADS: Head[] = [
  { x: 8, period: 15, delay: -3, amp: 18, rgb: "46,96,255" },
  { x: 20, period: 12, delay: -7, amp: 22, rgb: "59,140,255", mobile: true },
  { x: 32, period: 18, delay: -1, amp: 16, rgb: "106,92,255" },
  { x: 44, period: 9, delay: -4, amp: 20, rgb: "120,176,255", mobile: true },
  { x: 56, period: 9, delay: -6.5, amp: 20, rgb: "120,176,255", mobile: true },
  { x: 68, period: 18, delay: -10, amp: 16, rgb: "106,92,255" },
  { x: 80, period: 12, delay: -2, amp: 22, rgb: "59,140,255", mobile: true },
  { x: 92, period: 15, delay: -9, amp: 18, rgb: "46,96,255" },
];

function Rig({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <div className={`cine__rig${mirrored ? " cine__rig--mirror" : ""}`} aria-hidden="true">
      {HEADS.map((h, i) => {
        const tilt = (h.x - 50) * -0.35; // aparelhos das pontas apontam para o centro
        return (
          <div
            key={i}
            className={`cine__head${h.mobile ? "" : " cine__head--desktop"}`}
            style={
              {
                left: `${h.x}%`,
                "--rgb": h.rgb,
                "--tilt": `${tilt}deg`,
                "--amp": `${h.amp}deg`,
                "--dur": `${h.period}s`,
                "--delay": `${h.delay}s`,
                "--dir": i % 2 ? -1 : 1,
              } as CSSProperties
            }
          >
            <div className="cine__aim">
              <div className="cine__sweep">
                <span className="cine__beam" />
                {!mirrored && <span className="cine__lens" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CinematicStage() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 quando a seção entra por baixo, 0 no centro, 1 quando sai por cima
      const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)));
      el.style.setProperty("--scroll", p.toFixed(3));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) update();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id="bastidores" className="cine" aria-labelledby="bastidores-title" data-anim>
      <div className="cine__scene" aria-hidden="true">
        <div className="cine__truss" />
        <Rig />
        <div className="cine__haze cine__haze--a" />
        <div className="cine__haze cine__haze--b" />
        <div className="cine__floor">
          <div className="cine__floor-glow" />
          <div className="cine__floor-lines" />
        </div>
        {/* reflexo: o mesmo rig espelhado na linha do piso */}
        <div className="cine__reflection">
          <Rig mirrored />
        </div>
      </div>

      <div className="cine__content">
        <p className="cine__areas" data-reveal>
          Áudio <span aria-hidden="true">•</span> Vídeo <span aria-hidden="true">•</span> Iluminação{" "}
          <span aria-hidden="true">•</span> Automação
        </p>
        <h2 id="bastidores-title" className="cine__title" data-reveal style={{ "--i": 1 } as CSSProperties}>
          Tecnologia trabalhando nos bastidores.
        </h2>
        <p className="cine__sub" data-reveal style={{ "--i": 2 } as CSSProperties}>
          Para que o foco continue no que realmente importa.
        </p>
      </div>
    </section>
  );
}
