import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import { COURSE_STATUS_LABEL, MORE_COURSES_URL, formatPrice, type Course } from "@/config/courses";
import { ABOUT_PHOTO_SRC, GUARANTEE_DAYS } from "@/config/site";
import CourseDiagramView from "./CourseDiagrams";
import "./courses.css";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const featured = course.featured;
  return (
    <article
      className={`course${featured ? " course--featured" : ""}`}
      aria-labelledby={`curso-${course.id}`}
      data-reveal
      data-anim
      data-glow
      style={{ "--i": index % 2 } as React.CSSProperties}
    >
      <div className={`course__visual${course.image ? " course__visual--image" : ""}`}>
        {course.image ? (
          <Image src={course.image.url} alt={course.image.alt} fill sizes="(max-width: 760px) 100vw, 600px" />
        ) : (
          <CourseDiagramView type={course.diagram} />
        )}
      </div>

      <div className="course__body">
        <div className="course__meta">
          <span className="course__kind">{featured ? "Formação em destaque" : "Formação"}</span>
          {course.status && <span className={`course__status course__status--${course.status}`}>{COURSE_STATUS_LABEL[course.status]}</span>}
        </div>

        <h3 id={`curso-${course.id}`} className="course__title">
          {course.title}
        </h3>
        <p className="course__tagline">{course.tagline}</p>
        <p className="course__summary">{course.summary}</p>

        {course.question && (
          <p className="course__question">
            <span className="course__question-label">Uma pergunta que você vai saber responder</span>
            {course.question}
          </p>
        )}

        {course.appliedTo && (
          <div className="course__applied">
            <span className="course__applied-label">Aplicado a</span>
            <ul>
              {course.appliedTo.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="course__offer">
          <p className="course__price">
            <span className="sr-only">Preço: </span>
            {formatPrice(course.price)}
          </p>
          <ul className="course__format" aria-label="Formato">
            <li>{course.format.mode}</li>
            <li>{course.format.hours} horas</li>
            <li>{course.format.access}</li>
          </ul>
          <p className="course__guarantee">
            <ShieldIcon />
            {GUARANTEE_DAYS} dias de garantia
          </p>
        </div>

        <details className="course__topics">
          <summary>
            <span>{course.topicsTitle}</span>
            <span className="course__topics-count">{course.topics.length} tópicos</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <ul>
            {course.topics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </details>

        {course.href && (
          <div className="course__cta">
            <ArrowButton href={course.href} external track={{ event: "select_course", label: course.title }}>
              Quero participar
            </ArrowButton>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Courses({ courses, showMoreButton = true }: { courses: Course[]; showMoreButton?: boolean }) {
  const [featured, ...rest] = [...courses].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
    <section id="formacoes" className="section section--abyss courses" aria-labelledby="formacoes-title">
      <div className="courses__glow" aria-hidden="true" />
      <div className="section__inner">
        <SectionHeader
          channel="CH 03 · Escola Culto em Off"
          id="formacoes-title"
          title="Formações para entender, não só apertar botões."
        >
          <p>
            Um catálogo em construção, pensado para voluntários. Cada formação parte dos fundamentos e chega na
            aplicação dentro da igreja, <strong>com preço acessível</strong>. Lançamento em breve.
          </p>
        </SectionHeader>

        <ul className="courses__trust" aria-label="Por que confiar" data-reveal style={{ "--i": 3 } as React.CSSProperties}>
          <li>
            <span className="courses__trust-avatar">
              <Image src={ABOUT_PHOTO_SRC} alt="" fill sizes="44px" />
            </span>
            <span>
              <strong>Criado por Jonas Silva</strong>
              15+ anos em equipes técnicas de igreja e 12+ anos em TI.
            </span>
          </li>
          <li>
            <span className="courses__trust-icon">
              <ShieldIcon />
            </span>
            <span>
              <strong>Garantia de {GUARANTEE_DAYS} dias</strong>
              Não era o que você esperava? Devolvemos 100% do valor.
            </span>
          </li>
          <li>
            <span className="courses__trust-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.5 8.5v5l4-2.5z" fill="currentColor" />
                <path d="M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <strong>100% online</strong>
              No seu ritmo, pelo computador ou celular, com acesso por 1 ano.
            </span>
          </li>
        </ul>

        {featured && <CourseCard course={featured} index={0} />}

        <div className="courses__grid">
          {rest.map((c, i) => (
            <CourseCard key={c.id} course={c} index={i} />
          ))}
        </div>

        {showMoreButton && (
          <div className="courses__more" data-reveal>
            <ArrowButton href={MORE_COURSES_URL}>Ver mais formações</ArrowButton>
          </div>
        )}
      </div>
    </section>
  );
}
