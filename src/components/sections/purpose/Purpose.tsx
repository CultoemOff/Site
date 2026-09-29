import SectionHeader from "@/components/ui/SectionHeader";
import "./purpose.css";

const PILLARS = [
  { name: "Simples", text: "Conceitos explicados desde o começo, sem jargão desnecessário." },
  { name: "Prático", text: "Exemplos tirados da operação real de um culto." },
  { name: "Acessível", text: "Pensado para equipes pequenas e orçamento limitado." },
  { name: "Aplicável", text: "O que você aprende hoje, usa no próximo culto." },
];

const REALITY = [
  "Equipes pequenas",
  "Orçamento limitado",
  "Equipamentos de gerações diferentes",
  "Uma mesma pessoa operando várias áreas",
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
              igreja: pegar o que parece complicado e explicar de um jeito simples, prático, acessível e aplicável.
            </p>
          </SectionHeader>

          <p className="purpose__note" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            Você não precisa virar engenheiro de áudio, administrador de redes ou especialista em broadcast. Precisa
            entender a tecnologia o suficiente para <strong>operar melhor, diagnosticar problemas, tomar decisões</strong>{" "}
            e servir com mais confiança.
          </p>

          <div className="purpose__reality" data-reveal style={{ "--i": 4 } as React.CSSProperties}>
            <p className="purpose__reality-title">Feito para a realidade da maioria das igrejas brasileiras</p>
            <ul>
              {REALITY.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="purpose__chain" aria-label="Como ensinamos" data-anim>
          {PILLARS.map((p, i) => (
            <li key={p.name} className="purpose__step" data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
              <span className="purpose__jack" aria-hidden="true" />
              <div>
                <p className="purpose__step-name">{p.name}</p>
                <p className="purpose__step-text">{p.text}</p>
              </div>
            </li>
          ))}
          <span className="purpose__signal fx-motion" aria-hidden="true" />
        </ol>
      </div>

      <p className="section__inner purpose__motto" data-reveal>
        <span>Conhecimento profissional.</span> <span>Linguagem acessível.</span> <span>Aplicação na igreja.</span>
      </p>
    </section>
  );
}
