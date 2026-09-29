"use client";

import Image from "next/image";
import { useState } from "react";
import { youTubeId } from "@/lib/youtubeId";

/** Vídeo do YouTube leve: mostra a miniatura e só carrega o player ao clicar. */
export default function YouTubeEmbed({ url, caption }: { url: string; caption?: string }) {
  const id = youTubeId(url);
  const [playing, setPlaying] = useState(false);
  if (!id) return null;

  return (
    <figure className="post-embed">
      <div className="post-embed__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={caption || "Vídeo do YouTube"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="post-embed__poster" onClick={() => setPlaying(true)}>
            <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 800px) 100vw, 760px" />
            <span className="post-embed__play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span className="sr-only">Reproduzir vídeo{caption ? `: ${caption}` : ""}</span>
          </button>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
