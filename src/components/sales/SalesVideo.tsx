"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { track } from "@/components/analytics/track";
import { youTubeId } from "@/lib/youtubeId";

/**
 * Vídeo de vendas da página da formação.
 * - Arquivo .mp4 (em /public/videos/ ou um link direto): player do próprio navegador, com capa e play.
 * - Link do YouTube (inclusive Shorts): só carrega o player ao tocar no play.
 * `vertical` = vídeo em pé (9:16); no celular ele ocupa quase a tela toda, com o aviso para rolar logo abaixo.
 * Medição (Google Analytics): video_start ao dar play e, no .mp4, video_progress em 25/50/75% e video_complete.
 */
export default function SalesVideo({
  src,
  poster,
  vertical,
  title,
}: {
  src: string;
  poster?: string;
  vertical?: boolean;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const marks = useRef(new Set<number>());
  const ytId = /\.(mp4|webm|mov)(\?|$)/i.test(src) ? null : youTubeId(src);
  const shape = vertical ? "sp-player sp-player--vertical" : "sp-player";

  const start = () => {
    setPlaying(true);
    track("video_start", { label: title, location: "topo" });
    if (!ytId) requestAnimationFrame(() => void videoRef.current?.play().catch(() => undefined));
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
            src={src}
            poster={poster}
            controls={playing}
            playsInline
            preload="metadata"
            onTimeUpdate={onTime}
            onEnded={() => track("video_complete", { label: title, location: "topo" })}
            aria-label={title}
          />
        )}

        {!playing && (
          <button type="button" className="sp-player__poster" onClick={start}>
            {cover && ytId && <Image src={cover} alt="" fill sizes={vertical ? "(max-width: 760px) 90vw, 360px" : "(max-width: 960px) 100vw, 600px"} />}
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
