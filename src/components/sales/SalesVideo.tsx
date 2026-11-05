"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/components/analytics/track";
import { youTubeId } from "@/lib/youtubeId";

/**
 * Vídeo de vendas da página da formação.
 * - Arquivo .mp4 (em /public/videos/ ou um link direto): player do próprio navegador, com capa e play.
 * - Link do YouTube (inclusive Shorts): só carrega o player ao tocar no play.
 * `vertical` = vídeo em pé (9:16); no celular ele ocupa quase a tela toda, com o aviso para rolar logo abaixo.
 * Medição (Google Analytics): video_start ao dar play e, no .mp4, video_progress em 25/50/75% e video_complete.
 * Desempenho (.mp4): o vídeo só começa a baixar no toque (sem `src` antes disso) e a capa é uma imagem
 * otimizada com prioridade alta — ela costuma ser o maior elemento da tela (LCP) no celular.
 * `autoplayMobile` (só .mp4): no celular o vídeo começa sozinho, SEM som (os navegadores bloqueiam autoplay com som);
 * um toque liga o som e volta o vídeo para o começo.
 */
export default function SalesVideo({
  src,
  poster,
  vertical,
  title,
  autoplayMobile,
}: {
  src: string;
  poster?: string;
  vertical?: boolean;
  title: string;
  autoplayMobile?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  // tocando sozinho, sem som (celular)
  const [preview, setPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const marks = useRef(new Set<number>());
  const ytId = /\.(mp4|webm|mov)(\?|$)/i.test(src) ? null : youTubeId(src);
  const shape = vertical ? "sp-player sp-player--vertical" : "sp-player";

  // autoplay sem som no celular (não liga com "reduzir movimento" nem com economia de dados)
  useEffect(() => {
    if (!autoplayMobile || ytId) return;
    const v = videoRef.current;
    if (!v) return;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (!mobile || calm || saveData) return;
    v.muted = true;
    v.loop = true;
    v.play()
      .then(() => {
        setPreview(true);
        track("video_autoplay", { label: title, location: "topo", only: "ga" });
      })
      .catch(() => undefined);
  }, [autoplayMobile, ytId, title]);

  const start = () => {
    setPlaying(true);
    track("video_start", { label: title, location: "topo" });
    const v = videoRef.current;
    if (!ytId && v && preview) {
      // estava tocando sem som: liga o som e começa do início
      setPreview(false);
      v.loop = false;
      v.muted = false;
      v.currentTime = 0;
      void v.play().catch(() => undefined);
      return;
    }
    if (!ytId && v) {
      // o arquivo só é pedido agora (no toque): play() dentro do toque mantém o som liberado
      if (!v.getAttribute("src")) v.src = src;
      void v.play().catch(() => undefined);
    }
  };

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    for (const m of [25, 50, 75]) {
      if (pct >= m && !marks.current.has(m)) {
        marks.current.add(m);
        track("video_progress", { label: `${title} · ${m}%`, location: "topo" });
      }
    }
  };

  const cover = poster || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined);

  return (
    <figure className={shape}>
      <div className="sp-player__frame">
        {ytId && playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : null}

        {!ytId && (
          <video
            ref={videoRef}
            src={autoplayMobile ? src : undefined}
            controls={playing}
            playsInline
            preload={autoplayMobile ? "auto" : "none"}
            muted={preview || undefined}
            onTimeUpdate={onTime}
            onEnded={() => track("video_complete", { label: title, location: "topo" })}
            aria-label={title}
          />
        )}

        {!playing && preview && (
          <button type="button" className="sp-player__unmute" onClick={start}>
            <span className="sp-player__unmute-btn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Toque para ouvir
            </span>
            <span className="sr-only">Ligar o som e assistir do começo: {title}</span>
          </button>
        )}

        {!playing && !preview && (
          <button type="button" className="sp-player__poster" onClick={start}>
            {cover && (
              <Image
                src={cover}
                alt=""
                fill
                priority
                sizes={vertical ? "(max-width: 760px) 90vw, 360px" : "(max-width: 960px) 100vw, 600px"}
              />
            )}
            <span className="sp-video__play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span className="sp-player__hint">Assista com som</span>
            <span className="sr-only">Reproduzir: {title}</span>
          </button>
        )}
      </div>
    </figure>
  );
}
