import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { INSTRUCTORS, NEXT_INSTRUCTOR_SOON } from "@/config/instructors";
import "./about.css";

/** CH 04: professores da escola (cards grandes). Fica na página /formacoes, logo depois das formações. */
export default function About() {
  return (
    <section id="sobre" className="section section--abyss about" aria-labelledby="sobre-title">
      <div className="section__inner">
        <SectionHeader channel="CH 04 · Quem ensina" id="sobre-title" title="Professores">
          <p>Cada formação é conduzida por um especialista da área.</p>
        </SectionHeader>

        <div className="about__team">
          <ul className="about__team-list">
            {INSTRUCTORS.map((t, i) => (
              <li key={t.id} className="teacher" data-reveal style={{ "--i": i % 2 } as React.CSSProperties}>
                <span className="teacher__photo">
                  <Image src={t.photoLarge ?? t.photo} alt={`Foto de ${t.name}`} fill sizes="(max-width: 560px) 96px, 132px" />
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
