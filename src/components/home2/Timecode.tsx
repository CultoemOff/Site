"use client";

import { useEffect, useRef } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Contador do "monitor PGM" no topo da home2 (decorativo).
 * Escreve direto no elemento (sem re-render do React a cada segundo) e para quando a aba fica escondida.
 */
export default function Timecode({ start = 12 * 60 + 48 }: { start?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t0 = Date.now() - start * 1000;
    const tick = () => {
      const s = Math.floor((Date.now() - t0) / 1000);
      el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
    };
    let id: ReturnType<typeof setInterval> | undefined;
    const run = () => {
      if (id) clearInterval(id);
      id = undefined;
      if (document.visibilityState === "visible") {
        tick();
        id = setInterval(tick, 1000);
      }
    };
    run();
    document.addEventListener("visibilitychange", run);
    return () => {
      if (id) clearInterval(id);
      document.removeEventListener("visibilitychange", run);
    };
  }, [start]);
  return (
    <span ref={ref} className="hm2-tc" aria-hidden="true">
      {`00:${pad(Math.floor(start / 60))}:${pad(start % 60)}`}
    </span>
  );
}
