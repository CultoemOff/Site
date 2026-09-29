import EcosystemMap from "@/components/sections/ecosystem/EcosystemMap";
import SectionHeader from "@/components/ui/SectionHeader";
import "./purpose.css";

const PILLARS = [
  { name: "Simples", text: "Sem jargão desnecessário." },
  { name: "Prático", text: "Exemplos da operação real." },
  { name: "Acessível", text: "Para equipes pequenas e orçamento limitado." },
  { name: "Aplicável", text: "Aprendeu hoje, usa no próximo culto." },
];

export default function Purpose() {
  return (
    <section id="proposito" className="section section--royal purpose" aria-labelledby="proposito-title">
      <div className="purpose__grid-bg" aria-hidden="true" />
      <div className="section__inner purpose__layout">
        <div className="purpose__text">
          <SectionHeader
            channel="CH 02 · Propósito"
            id="proposito-title"
            title="Conhecimento técnico de verdade, na linguagem de quem serve."
          >
            <p>
              O Culto em Off quer construir uma das principais referências em formação técnica para voluntários de
              igreja. Você não precisa virar engenheiro: precisa entender a tecnologia o suficiente para{" "}
              <strong>operar melhor, diagnosticar problemas e servir com mais confiança</strong>.
            </p>
          </SectionHeader>

          <ul className="purpose__pillars" aria-label="Como ensinamos">
            {PILLARS.map((p, i) => (
              <li key={p.name} data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                <span className="purpose__pillar-name">{p.name}</span>
                <span className="purpose__pillar-text">{p.text}</span>
              </li>
            ))}
          </ul>

          <p className="purpose__eco" data-reveal style={{ "--i": 5 } as React.CSSProperties}>
            <span className="purpose__eco-label">Tudo conectado</span>
            Hoje, áudio, vídeo, luz, câmeras e projeção conversam pela mesma rede. Entender uma área técnica
            frequentemente exige compreender um pouco das outras, e é assim que ensinamos.
          </p>
        </div>

        <div className="purpose__map" data-reveal data-anim style={{ "--i": 2 } as React.CSSProperties}>
          <EcosystemMap />
        </div>
      </div>

      <p className="section__inner purpose__motto" data-reveal>
        <span>Conhecimento profissional.</span> <span>Linguagem acessível.</span> <span>Aplicação na igreja.</span>
      </p>
    </section>
  );
}
