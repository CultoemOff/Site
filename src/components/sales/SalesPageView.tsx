import Image from "next/image";
import YouTubeEmbed from "@/components/blog/YouTubeEmbed";
import CourseDiagramView from "@/components/sections/courses/CourseDiagrams";
import DownloadGate from "@/components/software-page/DownloadGate";
import ArrowButton from "@/components/ui/ArrowButton";
import { formatPrice, type Course } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import type { SalesPage } from "@/config/salesPages";
import { GUARANTEE_DAYS, type SiteSettingsData } from "@/config/site";
import type { LeadErrors, LeadInput } from "@/lib/leads";
import "@/components/blog/blog.css";
import "@/components/sections/courses/courses.css";
import "@/components/software-page/software-page.css";
import "./sales.css";

type Props = {
  course: Course;
  page: SalesPage;
  audience: SiteSettingsData["audience"];
  action: (input: LeadInput) => Promise<{ ok: true } | { ok: false; errors: LeadErrors }>;
};

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="m5 10.5 3.2 3.2L15 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="m6 6 8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Página de venda de uma formação: promessa, vídeo, dores, exemplos, módulos, professor, oferta, garantia e FAQ. */
export default function SalesPageView({ course, page, audience, action }: Props) {
  const teacher = getInstructor(course.instructor);
  const open = Boolean(course.href);
  const ctaHref = open ? course.href! : "#oferta";
  const ctaLabel = open ? "Quero participar" : "Entrar na lista de espera";
  const cta = (variant: "primary" | "ghost" = "primary") => (
    <ArrowButton
      href={ctaHref}
      variant={variant}
      external={open}
      track={open ? { event: "select_course", label: course.title } : undefined}
    >
      {ctaLabel}
    </ArrowButton>
  );

  return (
    <>
      {/* ---------- topo ---------- */}
      <header className="sp-hero">
        <div className="sp-hero__inner">
          <div className="sp-hero__text">
            <p className="swp-hero__channel">
              <span aria-hidden="true" />
              Formação Culto em Off{course.status === "lancamento-em-breve" ? " · Lançamento em breve" : ""}
            </p>
            <p className="sp-hero__course">{course.title}</p>
            <h1 className="sp-hero__title">{page.headline}</h1>
            <p className="sp-hero__sub">{page.subheadline}</p>
            <ul className="sp-hero__facts" aria-label="Resumo">
              <li>{course.topics.length} módulos em vídeo</li>
              <li>{course.format.hours} horas</li>
              <li>{course.format.access}</li>
              {course.includes?.length ? <li>Apostila para imprimir</li> : null}
            </ul>
            <div className="sp-hero__actions">
              {cta()}
              <p className="sp-hero__price">
                <strong>{formatPrice(course.price)}</strong>
                <span>· {GUARANTEE_DAYS} dias de garantia</span>
              </p>
            </div>
          </div>

          {/* vídeo de vendas */}
          <div className="sp-video">
            {page.videoUrl ? (
              <YouTubeEmbed url={page.videoUrl} caption={`Apresentação da formação ${course.title}`} />
            ) : (
              <div className="sp-video__placeholder" role="img" aria-label="Vídeo de apresentação em breve">
                <div className="sp-video__diagram" aria-hidden="true">
                  <CourseDiagramView type={course.diagram} />
                </div>
                <span className="sp-video__play" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  </svg>
                </span>
                <span className="sp-video__label">Vídeo de apresentação em breve</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------- prova / autoridade rápida ---------- */}
      <div className="sp-proof" aria-label="Números do Culto em Off">
        <ul className="sp-proof__list">
          {audience.stats.slice(0, 3).map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
          <li>
            <strong>{GUARANTEE_DAYS} dias</strong>
            <span>de garantia incondicional</span>
          </li>
        </ul>
      </div>

      {/* ---------- dores ---------- */}
      <section className="sp-section" aria-labelledby="sp-dores">
        <div className="sp-section__inner">
          <p className="swp-kicker">Você se reconhece?</p>
          <h2 id="sp-dores" className="swp-title">
            Se alguma dessas situações já aconteceu no seu culto, esta formação é para você.
          </h2>
          <ul className="sp-pains">
            {page.pains.map((p, i) => (
              <li key={p} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                <span aria-hidden="true">!</span>
                {p}
              </li>
            ))}
          </ul>
          <p className="sp-bridge">
            {page.bridge}
            {course.question && (
              <>
                {" "}
                <strong>{course.question}</strong> Você vai saber responder.
              </>
            )}
          </p>
        </div>
      </section>

      {/* ---------- transformação ---------- */}
      <section className="sp-section sp-section--alt" aria-labelledby="sp-depois">
        <div className="sp-section__inner sp-split">
          <div>
            <p className="swp-kicker">Depois da formação</p>
            <h2 id="sp-depois" className="swp-title">
              {page.outcomesTitle}
            </h2>
            <div className="sp-split__cta">{cta("ghost")}</div>
          </div>
          <ul className="sp-checks">
            {page.outcomes.map((o) => (
              <li key={o}>
                <Check />
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- exemplos ---------- */}
      <section className="sp-section" aria-labelledby="sp-exemplos">
        <div className="sp-section__inner">
          <p className="swp-kicker">Exemplos reais</p>
          <h2 id="sp-exemplos" className="swp-title">
            Do sintoma à solução: é assim que as aulas funcionam.
          </h2>
          <ul className="sp-examples">
            {page.examples.map((e, i) => (
              <li key={e.symptom} className="sp-example" data-reveal data-glow style={{ "--i": i } as React.CSSProperties}>
                <p className="sp-example__step sp-example__step--symptom">
                  <span>Sintoma</span>
                  {e.symptom}
                </p>
                <p className="sp-example__step">
                  <span>Causa</span>
                  {e.cause}
                </p>
                <p className="sp-example__step sp-example__step--fix">
                  <span>O que fazer</span>
                  {e.fix}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- módulos ---------- */}
      <section id="modulos" className="sp-section sp-section--alt" aria-labelledby="sp-modulos">
        <div className="sp-section__inner">
          <p className="swp-kicker">Conteúdo</p>
          <h2 id="sp-modulos" className="swp-title">
            {page.modules.length} módulos, do conceito à prática.
          </h2>
          <ol className="sp-modules">
            {page.modules.map((m, i) => (
              <li key={m.title}>
                <details className="sp-module" open={i === 0}>
                  <summary>
                    <span className="sp-module__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="sp-module__title">{m.title}</span>
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <ul>
                    {m.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- apostila ---------- */}
      {page.cheatsheet && (
        <section className="sp-section" aria-labelledby="sp-apostila">
          <div className="sp-section__inner sp-split">
            <div>
              <p className="swp-kicker">Bônus incluso</p>
              <h2 id="sp-apostila" className="swp-title">
                {page.cheatsheet.title} para deixar na mesa da técnica.
              </h2>
              <p className="swp-lead">
                Os comandos e atalhos que você mais vai usar, reunidos num material pronto para imprimir. Na hora do
                aperto, é só consultar.
              </p>
            </div>
            <div className="sp-sheet" aria-label="Amostra da apostila">
              <p className="sp-sheet__head">
                <span>Culto em Off</span>
                <span>{page.cheatsheet.label}</span>
              </p>
              <dl>
                {page.cheatsheet.rows.map((r) => (
                  <div key={r.cmd}>
                    <dt>
                      <code>{r.cmd}</code>
                    </dt>
                    <dd>{r.what}</dd>
                  </div>
                ))}
              </dl>
              <p className="sp-sheet__foot">Amostra ilustrativa</p>
            </div>
          </div>
        </section>
      )}

      {/* ---------- para quem é ---------- */}
      <section className="sp-section sp-section--alt" aria-labelledby="sp-quem">
        <div className="sp-section__inner">
          <p className="swp-kicker">Para quem é</p>
          <h2 id="sp-quem" className="swp-title">
            Feita para quem serve na técnica.
          </h2>
          <div className="sp-who">
            <ul className="sp-checks">
              {page.forWho.map((w) => (
                <li key={w}>
                  <Check />
                  {w}
                </li>
              ))}
            </ul>
            <ul className="sp-checks sp-checks--no">
              {page.notForWho.map((w) => (
                <li key={w}>
                  <Cross />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- professor ---------- */}
      {teacher && (
        <section className="sp-section" aria-labelledby="sp-prof">
          <div className="sp-section__inner sp-teacher">
            <span className="sp-teacher__photo">
              <Image src={teacher.photo} alt={`Foto de ${teacher.name}`} fill sizes="160px" />
            </span>
            <div>
              <p className="swp-kicker">Seu professor</p>
              <h2 id="sp-prof" className="swp-title">
                {teacher.name}
              </h2>
              <p className="sp-teacher__role">{teacher.role}</p>
              <p className="swp-lead">{teacher.bio}</p>
              <p className="swp-lead">
                Aulas com quem vive na prática os problemas que ensina a resolver, na realidade de quem serve na
                igreja.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ---------- oferta ---------- */}
      <section id="oferta" className="sp-section sp-offer" aria-labelledby="sp-oferta">
        <div className="sp-section__inner sp-offer__layout">
          <div className="sp-offer__box">
            <p className="swp-kicker">Oferta</p>
            <h2 id="sp-oferta" className="sp-offer__title">
              {course.title}
            </h2>
            <ul className="sp-checks">
              <li>
                <Check />
                {course.topics.length} módulos em videoaulas gravadas ({course.format.hours} horas)
              </li>
              {course.includes?.map((i) => (
                <li key={i}>
                  <Check />
                  {i}
                </li>
              ))}
              <li>
                <Check />
                {course.format.access}, no seu ritmo, no computador ou celular
              </li>
              <li>
                <Check />
                Garantia incondicional de {GUARANTEE_DAYS} dias
              </li>
            </ul>
            <p className="sp-offer__price">
              <span>Investimento</span>
              <strong>{formatPrice(course.price)}</strong>
              <small>pagamento único</small>
            </p>
            {open && <div className="sp-offer__cta">{cta()}</div>}
            <div className="sp-guarantee">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>
                <strong>Risco zero:</strong> se em até {GUARANTEE_DAYS} dias você achar que a formação não é para você,
                devolvemos 100% do valor.
              </p>
            </div>
          </div>

          {!open && (
            <DownloadGate
              source={`lista-${course.id}`}
              productName={`formação ${course.title}`}
              action={action}
              mode="waitlist"
              copy={{
                title: "Entre na lista de espera",
                text: "As inscrições abrem em breve. Quem está na lista fica sabendo primeiro.",
              }}
            />
          )}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="sp-section sp-section--alt" aria-labelledby="sp-faq">
        <div className="sp-section__inner sp-faq">
          <div>
            <p className="swp-kicker">Dúvidas</p>
            <h2 id="sp-faq" className="swp-title">
              Perguntas frequentes.
            </h2>
          </div>
          <div className="sp-faq__list">
            {page.faq.map((f) => (
              <details key={f.question} className="sp-faq__item">
                <summary>
                  <span>{f.question}</span>
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="sp-final" aria-labelledby="sp-final">
        <div className="sp-section__inner">
          <h2 id="sp-final" className="swp-title">
            {page.finalTitle}
          </h2>
          <p className="swp-lead">
            {course.title} por {formatPrice(course.price)}, com {GUARANTEE_DAYS} dias de garantia.
          </p>
          <div className="sp-final__cta">{cta()}</div>
        </div>
      </section>
    </>
  );
}
