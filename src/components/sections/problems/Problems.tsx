import type { ReactNode } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { AudioMeters, CableMess, DmxConflict, FrozenSlide, SyncWaves } from "./ProblemVisuals";
import "./problems.css";

type Problem = {
  area: string;
  title: string;
  items: string[];
  visual: ReactNode;
  wide?: boolean;
  terms?: string[];
};

const PROBLEMS: Problem[] = [
  {
    area: "Áudio",
    title: "Microfonia no meio da ministração.",
    items: [
      "Músicos dizendo que não se escutam no retorno",
      "A congregação achando o volume alto demais",
      "Um operador tentando resolver tudo ao mesmo tempo",
    ],
    visual: <AudioMeters />,
  },
  {
    area: "Projeção",
    title: "A letra errada no telão.",
    items: [
      "Apresentação travando na hora do louvor",
      "PowerPoint usado no improviso",
      "Falta gente para operar tudo, e o slide passa atrasado",
    ],
    visual: <FrozenSlide />,
  },
  {
    area: "Transmissão",
    title: "O áudio da live não é o que a igreja ouve.",
    items: ["OBS, cenas e câmeras para administrar", "Áudio e vídeo fora de sincronia", "Conexões que caem durante o culto"],
    visual: <SyncWaves />,
  },
  {
    area: "Iluminação",
    title: "A cena não acende o refletor certo.",
    items: [
      "DMX, universos e endereçamento",
      "Fixtures e moving heads com dezenas de canais",
      "Operação manual complicada",
    ],
    visual: <DmxConflict />,
  },
  {
    area: "Redes e conexões",
    title: "Um emaranhado de cabos segurando o culto.",
    items: [
      "Extensões de HDMI e USB que falham justamente durante o culto",
      "O áudio da live saindo da mesa por um cabo P2 improvisado",
      "NDI, Dante e Companion parecem coisa de outro mundo, mas poderiam simplificar essas ligações",
    ],
    terms: ["HDMI", "USB", "P2", "NDI", "Dante", "Companion"],
    visual: <CableMess />,
    wide: true,
  },
];

export default function Problems() {
  return (
    <section id="problemas" className="section section--paper problems" aria-labelledby="problemas-title">
      <div className="section__inner">
        <SectionHeader
          channel="CH 01 · Bastidores reais"
          id="problemas-title"
          title="Se você serve na técnica, provavelmente já passou por isso."
        >
          <p>
            Situações que se repetem em igrejas de todos os tamanhos. Quase sempre existe uma explicação técnica por
            trás delas, e dá para aprender a resolver.
          </p>
        </SectionHeader>

        <ul className="problems__grid">
          {PROBLEMS.map((p, i) => (
            <li
              key={p.area}
              className={`problem-card${p.wide ? " problem-card--wide" : ""}`}
              data-reveal
              data-anim
              style={{ "--i": i % 3 } as React.CSSProperties}
            >
              <div className="problem-card__display">{p.visual}</div>
              <div className="problem-card__body">
                <p className="problem-card__area">{p.area}</p>
                <h3 className="problem-card__title">{p.title}</h3>
                <ul className="problem-card__list">
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {p.terms && (
                  <p className="problem-card__terms">
                    <span className="sr-only">Termos envolvidos: </span>
                    {p.terms.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="problems__verdict" data-reveal>
          <p className="problems__verdict-a">Não falta vontade.</p>
          <p className="problems__verdict-b">Falta acesso ao conhecimento certo.</p>
        </div>
      </div>
    </section>
  );
}
