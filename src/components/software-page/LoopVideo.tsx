"use client";

import { useEffect, useRef } from "react";

/**
 * Vídeo curto em loop no lugar de um GIF (MP4 sem som, bem mais leve).
 * Só toca quando está na tela; com "reduzir movimento" fica parado na capa.
 */
export default function LoopVideo({ src, poster, width, height, label }: { src: string; poster: string; width: number; height: number; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className="cltp-video" src={src} poster={poster} width={width} height={height} muted loop playsInline preload="metadata" aria-label={label} />
  );
}
