import ArrowButton from "@/components/ui/ArrowButton";
import "./manifesto.css";

/** Waveform discreta de fundo (duas cópias para rolar em loop). */
function Wave() {
  const d =
    "M0 60 H120 L130 52 L140 68 L150 60 H230 L240 20 L252 100 L264 40 L272 60 H380 L388 54 L396 66 L404 60 H520 L530 30 L542 92 L554 48 L562 60 H700 L708 56 L716 64 L724 60 H800";
  return (
    <svg className="manifesto__wave" viewBox="0 0 1600 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="manifesto__wave-track">
        <path d={d} />
        <path d={d} transform="translate(800 0)" />
        <path d={d} transform="translate(1600 0)" />
      </g>
    </svg>
  );
}

export default function Manifesto() {
  return (
    <section className="manifesto" aria-labelledby="manifesto-title" data-anim>
      <Wave />
      <div className="manifesto__inner">
        <p className="manifesto__label" data-reveal>
          Manifesto
        </p>
        <h2 id="manifesto-title" className="manifesto__title" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          Quem serve também merece acesso a conhecimento de qualidade.
        </h2>
        <p className="manifesto__text" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
          Não importa se sua igreja tem uma grande estrutura ou uma equipe de três voluntários. Entender a tecnologia
          permite resolver problemas, tomar decisões melhores e servir com mais tranquilidade.
        </p>
        <p className="manifesto__sign" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
          Esse é o Culto em Off.
        </p>
        <div className="manifesto__cta" data-reveal style={{ "--i": 4 } as React.CSSProperties}>
          <ArrowButton href="/#formacoes">Explorar formações</ArrowButton>
        </div>
      </div>
    </section>
  );
}
