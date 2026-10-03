import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { INSTRUCTORS, NEXT_INSTRUCTOR_SOON } from "@/config/instructors";
import type { SiteSettingsData } from "@/config/site";
import "./about.css";

export default function About({ audience }: { audience: SiteSettingsData["audience"] }) {
  return (
    <section id="sobre" className="section section--abyss about" aria-labelledby="sobre-title">
      <div className="section__inner">
        <div className="about__layout">
          <div className="about__text">
            <SectionHeader channel="CH 06 · Quem está por trás" id="sobre-title" title="Quem está por trás do Culto em Off">
              <p className="about__headline">Tecnologia, experiência prática e igreja.</p>
            </SectionHeader>

            <blockquote className="about__quote" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
              <p>
                O Culto em Off nasceu da união de duas experiências: tecnologia profissional aplicada à realidade de quem
                serve na igreja.
              </p>
            </blockquote>
          </div>

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
              <li key={t.id} className="teacher" data-reveal style={{ "--i": i % 2 } as React.CSSProperties}>
                <span className="teacher__photo">
                  <Image src={t.photo} alt={`Foto de ${t.name}`} fill sizes="(max-width: 560px) 96px, 132px" />
                </span>
                <div className="teacher__head">
                  <p className="teacher__role">{t.role}</p>
                  <p className="teacher__name">{t.name}</p>
                  <p className="teacher__area">{t.area}</p>
                </div>
                <div className="teacher__details">
                  <p className="teacher__bio">{t.details ?? t.bio}</p>
                  {t.stats && t.stats.length > 0 && (
                    <dl className="teacher__stats">
                      {t.stats.map((s) => (
                        <div key={s.label}>
                          <dt>{s.label}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {t.tags && t.tags.length > 0 && (
                    <>
                      {t.tagsLabel && <p className="teacher__tags-label">{t.tagsLabel}</p>}
                      <ul className="teacher__tags" aria-label={t.tagsLabel ?? "Destaques"}>
                        {t.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </li>
            ))}
            {NEXT_INSTRUCTOR_SOON && (
              <li className="teacher teacher--soon" data-reveal style={{ "--i": INSTRUCTORS.length % 2 } as React.CSSProperties}>
                <span className="teacher__photo teacher__photo--soon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="teacher__head">
                  <p className="teacher__role">Em breve</p>
                  <p className="teacher__name">Novo professor</p>
                  <p className="teacher__area">Mais uma área da técnica</p>
                </div>
                <div className="teacher__details">
                  <p className="teacher__bio">
                    Mais um especialista vai se juntar à escola. Assim que a próxima formação for confirmada, o nome
                    aparece aqui.
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
