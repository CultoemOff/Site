import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { ABOUT_PHOTO_SRC } from "@/config/site";
import "./about.css";

const AREAS = ["Infraestrutura", "Cloud", "Cibersegurança", "Automação"];

export default function About() {
  return (
    <section id="sobre" className="section section--abyss about" aria-labelledby="sobre-title">
      <div className="section__inner about__layout">
        <figure className="about__photo" data-reveal>
          <span className="about__beam" aria-hidden="true" />
          <div className="about__frame">
            <Image
              src={ABOUT_PHOTO_SRC}
              alt="Jonas Silva, criador do Culto em Off"
              fill
              sizes="(max-width: 900px) 80vw, 420px"
              className="about__img"
            />
          </div>
          <figcaption className="about__caption">
            <span className="about__name">Jonas Silva</span>
            <span className="about__role">Criador do Culto em Off</span>
          </figcaption>
        </figure>

        <div className="about__text">
          <SectionHeader
            channel="CH 06 · Quem está por trás"
            id="sobre-title"
            title="Quem está por trás do Culto em Off"
          >
            <p className="about__headline">Tecnologia, experiência prática e igreja.</p>
          </SectionHeader>

          <dl className="about__stats" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <div>
              <dt>Anos de experiência profissional em TI</dt>
              <dd>12+</dd>
            </div>
            <div>
              <dt>Anos servindo em igrejas</dt>
              <dd>15+</dd>
            </div>
          </dl>

          <p className="about__body" data-reveal style={{ "--i": 4 } as React.CSSProperties}>
            Jonas Silva é especialista em tecnologia. Profissionalmente, atua com infraestrutura, cloud, cibersegurança e
            automação. Na igreja, vive na prática os desafios das equipes técnicas e dos voluntários.
          </p>

          <ul className="about__areas" aria-label="Áreas de atuação" data-reveal style={{ "--i": 5 } as React.CSSProperties}>
            {AREAS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>

          <div className="about__equation" data-reveal style={{ "--i": 6 } as React.CSSProperties}>
            <span>Tecnologia profissional</span>
            <span className="about__plus" aria-hidden="true">
              +
            </span>
            <span>Experiência prática na igreja</span>
          </div>

          <blockquote className="about__quote" data-reveal style={{ "--i": 7 } as React.CSSProperties}>
            <p>
              O Culto em Off nasceu da união dessas duas experiências: tecnologia profissional aplicada à realidade de
              quem serve na igreja.
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
