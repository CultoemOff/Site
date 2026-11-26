import ArrowButton from "@/components/ui/ArrowButton";
import StageScene from "./StageScene";
import "./hero.css";

export default function Hero() {
  return (
    <section className="hero" data-hero aria-labelledby="hero-title">
      <StageScene />
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="hero__live" aria-hidden="true" />
          Formação <span aria-hidden="true">•</span> Tecnologia <span aria-hidden="true">•</span> Igreja
        </p>

        <h1 id="hero-title" className="hero__title">
          A escola técnica para voluntários <span className="hero__title-accent">que servem na Igreja.</span>
        </h1>

        <p className="hero__sub">
          Áudio, vídeo, iluminação, redes, transmissão, projeção e automação — conhecimento para quem faz o
          culto acontecer nos bastidores.
        </p>

        <div className="hero__ctas">
          <ArrowButton href="#formacoes">Explorar formações</ArrowButton>
        </div>

      </div>

      <a href="#manifesto" className="hero__scroll" aria-label="Rolar para a próxima seção">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
