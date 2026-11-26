import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { MORE_COURSES_URL, formatInstallments, formatPrice, hasPrice, type Course } from "@/config/courses";
import { hasSalesPage } from "@/config/salesPages";
import { GUARANTEE_DAYS } from "@/config/site";
import { resolvePrice } from "@/lib/pricing";
import "@/components/ui/button.css";
import "./home-courses.css";

/**
 * Formações na home (desde 23/11/2026): resumidas para caber numa tela de notebook.
 * O detalhe (módulos, professor, perguntas) fica na página de cada formação.
 */
export const HOME_COURSE_CARD: Record<string, { photo: string; alt: string; subtitle: string; text: string }> = {
  "culto-ao-vivo-com-excelencia": {
    photo: "/images/formacoes/culto-aula-operacao.jpg",
    alt: "Operador na cabine de transmissão com o OBS, a mixagem da live e o controle das câmeras",
    subtitle: "Curso de OBS Studio para igrejas",
    text: "A live do culto do zero ao avançado: câmeras, NDI, áudio, cenas, letras e controle PTZ.",
  },
  "redes-para-igrejas": {
    photo: "/images/formacoes/redes-aula-equipamentos.jpg",
    alt: "Switch com cabos de rede ligados no rack da igreja",
    subtitle: "Roteador, switch, IP e NDI na prática",
    text: "Do zero, sem ser de TI: Wi-Fi que não cai no culto e a cabine inteira funcionando na mesma rede.",
  },
};

/** "R$ 67" em vez de "R$ 67,00" quando o valor é redondo */
const money = (v: number) => (Number.isInteger(v) ? `R$ ${v}` : formatPrice(v));

function HomeCourseCard({ course, index }: { course: Course; index: number }) {
  const c = HOME_COURSE_CARD[course.id];
  const href = hasSalesPage(course.id) ? `/formacoes/${course.id}` : course.href || MORE_COURSES_URL;
  const { price, priceFrom, off, promo, installments } = resolvePrice(course);
  const certificate = course.includes?.some((i) => /certificado/i.test(i));
  const photo = course.image?.url ?? c?.photo;
  return (
    <li className="hc-card" data-reveal style={{ "--i": index } as React.CSSProperties}>
      <article aria-labelledby={`hc-${course.id}`}>
        {photo && (
          <div className="hc-card__photo">
            <Image src={photo} alt={course.image?.alt ?? c?.alt ?? ""} fill sizes="(max-width: 900px) 100vw, 240px" />
            {off > 0 && <span className="hc-card__off">-{off}%</span>}
          </div>
        )}
        <div className="hc-card__body">
          {promo && <p className="hc-card__promo">{promo.label}</p>}
          <h3 id={`hc-${course.id}`} className="hc-card__title">
            <Link
              href={href}
              className="hc-card__link"
              data-track="select_item"
              data-track-label={course.title}
              data-track-id={course.id}
              data-track-location="formações da home"
            >
              {course.title}
            </Link>
          </h3>
          <p className="hc-card__sub">{c?.subtitle ?? course.tagline}</p>
          <p className="hc-card__text">{c?.text ?? course.tagline}</p>
          <ul className="hc-card__facts" aria-label="Formato">
            {/^\d/.test(course.topicsTitle) && <li>{course.topicsTitle}</li>}
            {certificate && <li>Certificado</li>}
            <li>{course.format.access}</li>
          </ul>
          <div className="hc-card__foot">
            {hasPrice(course) && (
              <p className="hc-card__price">
                {priceFrom && (
                  <span className="hc-card__from">
                    de <s>{money(priceFrom)}</s>
                  </span>
                )}
                <span className="sr-only">Preço: </span>
                <strong>{money(price)}</strong>
                {installments && <span className="hc-card__parcel">ou {formatInstallments(installments)}</span>}
              </p>
            )}
            <span className="btn btn--primary hc-card__cta" aria-hidden="true">
              <span>Ver a formação</span>
              <svg className="btn__arrow" viewBox="0 0 20 20" focusable="false">
                <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}

export default function HomeCourses({ courses }: { courses: Course[] }) {
  return (
    <section id="formacoes" className="section section--abyss hc" aria-labelledby="formacoes-title">
      <div className="section__inner">
        <SectionHeader channel="CH 02 · Escola Culto em Off" id="formacoes-title" title="Formações para entender, não só apertar botões.">
          <p>Para voluntários, líderes e pastores, dos fundamentos à aplicação no culto. Online, com certificado e {GUARANTEE_DAYS} dias de garantia.</p>
        </SectionHeader>

        <ul className="hc__grid" aria-label="Formações">
          {courses.map((c, i) => (
            <HomeCourseCard key={c.id} course={c} index={i} />
          ))}
        </ul>

        <p className="hc__more">
          <Link href="/formacoes">Ver todas as formações</Link>
        </p>
      </div>
    </section>
  );
}
