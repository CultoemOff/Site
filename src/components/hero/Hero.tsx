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
          A escola de tecnologia <span className="hero__title-accent">para quem serve.</span>
        </h1>

        <p className="hero__lead">
          O Culto em Off nasceu com um objetivo: tornar-se referência na formação de voluntários de igreja,
          transformando conhecimento técnico em conteúdo simples, prático e acessível.
        </p>

        <p className="hero__sub">
          Áudio, vídeo, iluminação, redes, transmissão, projeção e automação — conhecimento para quem faz o
          culto acontecer nos bastidores.
        </p>

        <div className="hero__ctas">
          <ArrowButton href="#formacoes">Explorar formações</ArrowButton>
          <ArrowButton href="#proposito" variant="ghost">
            Conhecer o Culto em Off
          </ArrowButton>
        </div>

        <ul className="hero__pillars" aria-label="Nossos pilares">
          <li>Conhecimento profissional</li>
          <li>Linguagem acessível</li>
          <li>Aplicação na igreja</li>
        </ul>
      </div>

      <a href="#problemas" className="hero__scroll" aria-label="Rolar para a próxima seção">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
