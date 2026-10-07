import Image from "next/image";
import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatVideoDate, type YouTubeVideo } from "@/lib/youtube";
import "./youtube.css";

/** Parte visual da seção do YouTube (recebe os vídeos já buscados no servidor). */
export default function YouTubeView({ videos, channelUrl }: { videos: YouTubeVideo[]; channelUrl: string }) {
  return (
    <section id="conteudo-gratuito" className="section section--paper yt" aria-labelledby="yt-title">
      <div className="section__inner">
        <div className="yt__head">
          <SectionHeader channel="CH 06 · Conteúdo gratuito" id="yt-title" title="E ainda tem muito conteúdo gratuito.">
            <p>
              Tutoriais, testes, configurações, equipamentos e experiências práticas estão disponíveis gratuitamente no
              canal Culto em Off.
            </p>
          </SectionHeader>
          <div className="yt__channel" data-reveal>
            <ArrowButton href={channelUrl} external track={{ event: "click_social", label: "YouTube" }}>
              Ver o canal no YouTube
            </ArrowButton>
          </div>
        </div>

        {videos.length > 0 ? (
          <ul className="yt__grid">
            {videos.map((v, i) => (
              <li key={v.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <a href={v.url} target="_blank" rel="noopener noreferrer" className="yt__card">
                  <span className="yt__thumb">
                    {/* direto do YouTube (sem passar pelo otimizador do site): carrega sempre e não gasta a cota de imagens */}
                    <Image src={v.thumbnail} alt="" fill unoptimized sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 280px" />
                    <span className="yt__play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                      </svg>
                    </span>
                  </span>
                  <span className="yt__meta">
                    {v.published && <time dateTime={v.published}>{formatVideoDate(v.published)}</time>}
                    <span className="yt__title">{v.title}</span>
                  </span>
                  <span className="sr-only"> (abre no YouTube em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="yt__fallback" data-reveal>
            <span className="yt__fallback-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span>
              <strong>Assista aos vídeos no canal Culto em Off</strong>
              <span>Os vídeos mais recentes aparecem aqui automaticamente.</span>
            </span>
            <span className="sr-only"> (abre no YouTube em nova aba)</span>
          </a>
        )}
      </div>
    </section>
  );
}
