import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { INSTRUCTORS, NEXT_INSTRUCTOR_SOON } from "@/config/instructors";
import { ABOUT_PHOTO_SRC, type SiteSettingsData } from "@/config/site";
import "./about.css";

const AREAS = ["Infraestrutura", "Cloud", "Cibersegurança", "Automação"];

export default function About({ audience }: { audience: SiteSettingsData["audience"] }) {
  return (
    <section id="sobre" className="section section--abyss about" aria-labelledby="sobre-title">
      <div className="section__inner">
      <div className="about__layout">
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
            <span className="about__role">Idealizador e professor</span>
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

          {audience.stats.length > 0 && (
            <div className="about__reach" data-reveal style={{ "--i": 4 } as React.CSSProperties}>
              <p className="about__reach-title">
                <span aria-hidden="true" />
                Alcance nas redes
              </p>
              <dl className="about__reach-list">
                {audience.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              {audience.note && <p className="about__reach-note">{audience.note}</p>}
            </div>
          )}

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

      <div className="about__team" aria-labelledby="professores-title">
        <div className="about__team-head" data-reveal>
          <h3 id="professores-title">Professores</h3>
          <p>
            O Culto em Off foi idealizado por Jonas Silva, que também dá aulas. Cada formação é conduzida por um
            especialista da área.
          </p>
        </div>
        <ul className="about__team-list">
          {INSTRUCTORS.map((t, i) => (
            <li key={t.id} className="teacher" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className="teacher__photo">
                <Image src={t.photo} alt={`Foto de ${t.name}`} fill sizes="72px" />
              </span>
              <div>
                <p className="teacher__role">{t.role}</p>
                <p className="teacher__name">{t.name}</p>
                <p className="teacher__area">{t.area}</p>
                <p className="teacher__bio">{t.bio}</p>
              </div>
            </li>
          ))}
          {NEXT_INSTRUCTOR_SOON && (
            <li className="teacher teacher--soon" data-reveal style={{ "--i": INSTRUCTORS.length } as React.CSSProperties}>
              <span className="teacher__photo teacher__photo--soon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="teacher__role">Em breve</p>
                <p className="teacher__name">Novo professor</p>
                <p className="teacher__bio">Mais um especialista vai se juntar à escola.</p>
              </div>
            </li>
          )}
        </ul>
      </div>
      </div>
    </section>
  );
}
