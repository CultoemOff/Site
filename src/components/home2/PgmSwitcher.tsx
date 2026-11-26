"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Timecode from "./Timecode";

export type PgmShot = { src: string; alt: string; label: string };

/**
 * Monitor de programa do topo da home2.
 * - Com `video` (MP4 leve, sem som, em loop): toca o vídeo (só na tela; com "reduzir movimento" mostra a capa).
 * - Sem vídeo: corta entre fotos reais das aulas como um switcher (troca a cada ~4,5 s, com aproximação lenta na foto no ar).
 */
export default function PgmSwitcher({ shots, video }: { shots: PgmShot[]; video?: { src: string; poster: string } | null }) {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(0);
  const [cut, setCut] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let id: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
      vid.current?.pause();
    };
    const start = () => {
      stop();
      if (reduce || !visible || document.visibilityState !== "visible") return;
      if (vid.current) {
        vid.current.play().catch(() => {});
        return;
      }
      if (shots.length > 1)
        id = setInterval(() => {
          setOn((i) => (i + 1) % shots.length);
          setCut((c) => c + 1);
        }, 4500);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", start);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, [shots.length]);

  // multiview do topo: a câmera no ar ganha a borda vermelha (tally)
  useEffect(() => {
    document.querySelectorAll(".hm2-multi li").forEach((li, i) => li.toggleAttribute("data-live", i === on));
  }, [on]);

  return (
    <>
      <div ref={box} className="hm2-pgm__screen">
        {video ? (
          <video ref={vid} className="hm2-pgm__video" src={video.src} poster={video.poster} muted loop playsInline preload="metadata" aria-hidden="true" />
        ) : (
          shots.map((s, i) => (
            <span key={s.src} className={`hm2-pgm__shot${i === on ? " is-on" : ""}`}>
              <Image src={s.src} alt={i === 0 ? s.alt : ""} fill priority={i === 0} sizes="(max-width: 960px) 100vw, 560px" />
            </span>
          ))
        )}
        <span className="hm2-pgm__safe" aria-hidden="true" />
        {/* a cada corte a etiqueta PGM pisca, como no switcher */}
        <span key={cut} className={`hm2-pgm__tag${cut ? " is-cut" : ""}`} aria-hidden="true">
          PGM
        </span>
        <span className="hm2-pgm__live" aria-hidden="true">
          <span className="hm2-tally" />
          Ao vivo
        </span>
      </div>
      <figcaption className="hm2-pgm__bar">
        <span>
          CAM {on + 1} · {video ? "Cabine de transmissão" : shots[on]?.label}
        </span>
        {/* medidor de áudio: as barras do logo */}
        <span className="hm2-meter" aria-hidden="true">
          {[38, 62, 48, 80, 56, 92, 70, 44, 66, 30].map((h, i) => (
            <i key={i} style={{ height: `${h}%`, "--i": i } as React.CSSProperties} />
          ))}
        </span>
        <Timecode />
      </figcaption>
    </>
  );
}
