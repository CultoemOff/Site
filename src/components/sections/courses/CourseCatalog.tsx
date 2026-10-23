import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { COURSE_STATUS_LABEL, formatInstallments, formatPrice, hasPrice, type Course } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import { hasSalesPage } from "@/config/salesPages";
import { resolvePrice } from "@/lib/pricing";
import CourseDiagramView from "./CourseDiagrams";
import { CoursesTrust } from "./Courses";
import "./courses.css";
import "./catalog.css";

/**
 * Catálogo de /formacoes: todos os cards do mesmo tamanho (compactos), com as formações em
 * preço promocional primeiro e em destaque. A home continua usando o componente Courses.
 */

/** capas locais (enquanto a formação não tiver imagem no painel) */
const COVERS: Record<string, string> = {
  "redes-para-igrejas": "/images/links/formacao-redes.jpg",
  "culto-ao-vivo-com-excelencia": "/images/formacoes/culto-ao-vivo-og.jpg",
};

const hasPromo = (c: Course) => resolvePrice(c).off > 0;

function CatalogCard({ course, index }: { course: Course; index: number }) {
  const { price, priceFrom, off, promo, installments } = resolvePrice(course);
  const highlight = off > 0;
  const teacher = getInstructor(course.instructor);
  const cover = course.image?.url ?? COVERS[course.id];
  const certificate = course.includes?.some((i) => /certificado/i.test(i));
  const page = hasSalesPage(course.id) ? `/formacoes/${course.id}` : undefined;
  const href = page ?? (course.href || undefined);
  const external = !page && Boolean(course.href);
  const presale = !course.href;
  const cta = !href ? null : page ? (presale && highlight ? "Garantir o preço" : "Ver a formação") : "Quero participar";
  const titleId = `cat-${course.id}`;

  return (
    <li className={`cat-card${highlight ? " cat-card--promo" : ""}`} data-reveal style={{ "--i": index % 4 } as React.CSSProperties}>
      <article aria-labelledby={titleId}>
        <div className={`cat-card__visual${cover ? " cat-card__visual--image" : ""}`}>
          {cover ? (
            <Image src={cover} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 300px" />
          ) : (
            <CourseDiagramView type={course.diagram} />
          )}
          {highlight && (
            <span className="cat-card__off">
              <span className="sr-only">Desconto de </span>-{off}%
            </span>
          )}
        </div>

        <div className="cat-card__body">
          {course.status && <span className={`course__status course__status--${course.status} cat-card__status`}>{COURSE_STATUS_LABEL[course.status]}</span>}

          <h3 id={titleId} className="cat-card__title">
            {href ? (
              <Link href={href} className="cat-card__link" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                data-track="select_item" data-track-label={course.title} data-track-id={course.id} data-track-location="catálogo de formações">
                {course.title}
              </Link>
            ) : (
              course.title
            )}
          </h3>
          <p className="cat-card__tagline">{course.tagline}</p>

          <ul className="cat-card__facts" aria-label="Formato">
            {/^\d/.test(course.topicsTitle) && <li>{course.topicsTitle}</li>}
            {certificate && <li>Certificado</li>}
            <li>{course.format.mode}</li>
          </ul>

          <div className="cat-card__foot">
            {hasPrice(course) ? (
              <p className="cat-card__price">
                {promo && <span className="cat-card__promo">{promo.label}</span>}
                {priceFrom && (
                  <span className="cat-card__from">
                    de <s>{formatPrice(priceFrom)}</s> por
                  </span>
                )}
                <span className="sr-only">Preço: </span>
                <strong>{formatPrice(price)}</strong>
                {installments && <span className="cat-card__parcel">ou {formatInstallments(installments)}</span>}
              </p>
            ) : (
              <p className="cat-card__price cat-card__price--soon">Preço no lançamento</p>
            )}

            {teacher && (
              <p className="cat-card__teacher">
                <span className="cat-card__teacher-photo">
                  <Image src={teacher.photo} alt="" fill sizes="28px" />
                </span>
                com <strong>{teacher.name}</strong>
              </p>
            )}

            {cta ? (
              <span className={`cat-card__cta${highlight ? " cat-card__cta--promo" : ""}`} aria-hidden="true">
                {cta}
                <svg viewBox="0 0 20 20" focusable="false">
                  <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <span className="cat-card__cta cat-card__cta--off">Em breve</span>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

export default function CourseCatalog({ courses }: { courses: Course[] }) {
  // promoção primeiro (mantendo a ordem do painel dentro de cada grupo)
  const sorted = [...courses].sort((a, b) => Number(hasPromo(b)) - Number(hasPromo(a)));
  const promos = sorted.filter(hasPromo);
  return (
    <section id="formacoes" className="section section--abyss courses catalog" aria-labelledby="formacoes-title">
      <div className="courses__glow" aria-hidden="true" />
      <div className="section__inner">
        <SectionHeader channel="CH 03 · Escola Culto em Off" id="formacoes-title" title="Formações para entender, não só apertar botões.">
          <p>
            Formações pensadas para voluntários: cada uma parte dos fundamentos e chega na aplicação dentro da igreja,{" "}
            <strong>com preço acessível</strong>.
          </p>
        </SectionHeader>

        {promos.length > 0 && (
          <p className="catalog__promo" data-reveal>
            <span className="catalog__promo-dot" aria-hidden="true" />
            <span>
              <strong>Preço promocional</strong> em {promos.length === 1 ? "uma formação" : `${promos.length} formações`}:{" "}
              {promos.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && (i === promos.length - 1 ? " e " : ", ")}
                  <a href={`#cat-${c.id}`}>{c.title}</a>
                </span>
              ))}
              .
            </span>
          </p>
        )}

        <ul className="catalog__grid" aria-label="Formações">
          {sorted.map((c, i) => (
            <CatalogCard key={c.id} course={c} index={i} />
          ))}
        </ul>

        <CoursesTrust />
      </div>
    </section>
  );
}
