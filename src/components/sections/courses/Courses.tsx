import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { COURSE_STATUS_LABEL, COURSES, MORE_COURSES_URL, formatPrice, type Course } from "@/config/courses";
import CourseDiagramView from "./CourseDiagrams";
import "./courses.css";

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
      <div className="course__visual">
        <CourseDiagramView type={course.diagram} />
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
            <ArrowButton href={course.href} external>
              Quero participar
            </ArrowButton>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Courses({ showMoreButton = true }: { showMoreButton?: boolean }) {
  const [featured, ...rest] = [...COURSES].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
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
