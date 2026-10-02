import Image from "next/image";
import YouTubeEmbed from "@/components/blog/YouTubeEmbed";
import CourseDiagramView from "@/components/sections/courses/CourseDiagrams";
import ArrowButton from "@/components/ui/ArrowButton";
import { formatPrice, type Course } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import type { SalesPage } from "@/config/salesPages";
import { GUARANTEE_DAYS, type SiteSettingsData } from "@/config/site";
import { resolvePrice } from "@/lib/pricing";
import "@/components/blog/blog.css";
import "@/components/sections/courses/courses.css";
import "@/components/software-page/software-page.css";
import Countdown from "./Countdown";
import ExitPopup from "./ExitPopup";
import PromoBar from "./PromoBar";
import { DeckIllo, DhcpScreenIllo, TerminalIllo, TopologyIllo } from "./NetworkIllustrations";
import "./sales.css";

type Props = {
  course: Course;
  page: SalesPage;
  audience: SiteSettingsData["audience"];
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

/** Página de venda de uma formação: promessa, vídeo, dores, módulos, professor, oferta com prazo, garantia e FAQ. */
export default function SalesPageView({ course, page, audience }: Props) {
  const teacher = getInstructor(course.instructor);

  // Promoção: vale enquanto o prazo não passou. Depois disso a página mostra o preço cheio.
  const { price, priceFrom, off, promo } = resolvePrice(course);
  const promoOn = Boolean(promo);
  const endsAt = promo?.endsAt;

  // Botão de compra: usa o link de inscrição da formação (Hotmart). Sem link ainda, leva até a oferta.
  const hasLink = Boolean(course.href);
  const ctaHref = hasLink ? course.href! : "#oferta";
  const ctaLabel = promoOn ? "Comprar com desconto" : "Comprar agora";
  const cta = (variant: "primary" | "ghost" = "primary", label = ctaLabel) => (
    <ArrowButton
      href={ctaHref}
      variant={variant}
      external={hasLink}
      track={{ event: "select_course", label: course.title }}
    >
      {label}
    </ArrowButton>
  );
  const priceTag = (className = "") => (
    <p className={`sp-price ${className}`}>
      {priceFrom && (
        <span className="sp-price__from">
          de <s>{formatPrice(priceFrom)}</s> por
        </span>
      )}
      <strong>{formatPrice(price)}</strong>
      {priceFrom && <em className="sp-price__off">{off}% OFF</em>}
    </p>
  );

  return (
    <>
      {/* ---------- faixa da promoção: fixa no topo, acima do menu ---------- */}
      {promoOn && (
        <PromoBar
          label={page.promo!.label}
          off={off}
          endsAt={endsAt!}
          href={ctaHref}
          cta="Comprar agora"
          ctaShort="Comprar"
          external={hasLink}
          trackLabel={`${course.title} (faixa do topo)`}
        />
      )}

      {/* ---------- topo ---------- */}
      <header className={`sp-hero${promoOn ? " sp-hero--promo" : ""}`}>
        <div className="sp-hero__inner">
          <div className="sp-hero__text">
            <p className="swp-hero__channel">
              <span aria-hidden="true" />
              Formação Culto em Off{course.status === "lancamento-em-breve" ? " · Lançamento em breve" : ""}
              {course.status === "inscricoes-abertas" ? " · Inscrições abertas" : ""}
            </p>
            <p className="sp-hero__course">{course.title}</p>
            <h1 className="sp-hero__title">{page.headline}</h1>
            <p className="sp-hero__sub">{page.subheadline}</p>
            <ul className="sp-hero__facts" aria-label="Resumo">
              <li>{page.modules.length} módulos em vídeo</li>
              <li>{course.format.hours} horas</li>
              <li>{course.format.access}</li>
              {course.includes?.some((x) => /apostila/i.test(x)) ? <li>Apostila para imprimir</li> : null}
              {course.includes?.some((x) => /comunidade|membros/i.test(x)) ? <li>Dúvidas e comunidade</li> : null}
            </ul>
            <div className="sp-hero__actions">
              {cta()}
              <div className="sp-hero__price">
                {priceTag()}
                <span>{GUARANTEE_DAYS} dias de garantia</span>
              </div>
            </div>
          </div>

          {/* vídeo de vendas */}
          <div className="sp-video">
            {page.videoUrl ? (
              <YouTubeEmbed url={page.videoUrl} caption={`Apresentação da formação ${course.title}`} />
            ) : (
              <div className="sp-video__placeholder" role="img" aria-label="Vídeo de apresentação em breve">
                <div className="sp-video__diagram" aria-hidden="true">
                  <CourseDiagramView type={course.diagram} variant="simple" />
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
          {audience.stats.slice(0, 2).map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
          <li>
            <strong>{page.modules.length} módulos</strong>
            <span>com aulas práticas e projeto final</span>
          </li>
          <li>
            <strong>{GUARANTEE_DAYS} dias</strong>
            <span>de garantia incondicional</span>
          </li>
        </ul>
      </div>

      {/* ---------- por que é diferente ---------- */}
      <section className="sp-section sp-section--tight sp-section--paper" aria-labelledby="sp-pilares">
        <div className="sp-section__inner">
          <p className="swp-kicker">Por que esta formação</p>
          <h2 id="sp-pilares" className="swp-title">
            Muito mais que um curso de redes: é a rede explicada para quem serve na técnica.
          </h2>
          <ul className="sp-pillars">
            {page.pillars.map((p, i) => (
              <li key={p.title} data-reveal data-glow style={{ "--i": i } as React.CSSProperties}>
                <span className="sp-pillars__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- dores ---------- */}
      <section className="sp-section sp-section--mist" aria-labelledby="sp-dores">
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

      {/* ---------- antes × depois ---------- */}
      <section className="sp-section sp-section--paper" aria-labelledby="sp-compare">
        <div className="sp-section__inner">
          <p className="swp-kicker">Antes e depois</p>
          <h2 id="sp-compare" className="swp-title">
            O que muda na rotina da sua equipe.
          </h2>
          <div className="sp-compare" role="table" aria-label="Antes e depois da formação">
            <div className="sp-compare__head" role="row">
              <span role="columnheader">Sem a formação</span>
              <span role="columnheader">Com a formação</span>
            </div>
            {page.compare.map((c) => (
              <div key={c.before} className="sp-compare__row" role="row" data-reveal>
                <p role="cell" className="sp-compare__before">
                  <Cross />
                  {c.before}
                </p>
                <p role="cell" className="sp-compare__after">
                  <Check />
                  {c.after}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- versículo ---------- */}
      {page.verse && (
        <aside className="sp-verse" aria-label="Versículo">
          <blockquote>
            <p>“{page.verse.text}”</p>
            <cite>{page.verse.ref}</cite>
          </blockquote>
          <p className="sp-verse__note">{page.verse.note}</p>
        </aside>
      )}

      {/* ---------- por dentro das aulas (ilustrações) ---------- */}
      {page.inside && (
        <section className="sp-section sp-section--ink" aria-labelledby="sp-inside">
          <div className="sp-section__inner">
            <p className="swp-kicker">Por dentro das aulas</p>
            <h2 id="sp-inside" className="swp-title">
              {page.inside.title}
            </h2>
            <figure className="sp-inside__topo" data-anim>
              <TopologyIllo />
              <figcaption>{page.inside.topology}</figcaption>
            </figure>
            <div className="sp-inside__grid">
              <figure className="sp-inside__card" data-reveal data-anim>
                <DhcpScreenIllo />
                <figcaption>
                  <strong>{page.inside.dhcp.title}</strong>
                  {page.inside.dhcp.text}
                </figcaption>
              </figure>
              <figure className="sp-inside__card" data-reveal data-anim style={{ "--i": 1 } as React.CSSProperties}>
                <TerminalIllo />
                <figcaption>
                  <strong>{page.inside.terminal.title}</strong>
                  {page.inside.terminal.text}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      )}

      {/* ---------- transformação ---------- */}
      <section className="sp-section sp-section--mist" aria-labelledby="sp-depois">
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

      {/* ---------- pré-requisito: rede antes do Companion ---------- */}
      {page.prereq && (
        <section className="sp-section sp-section--graphite sp-prereq" aria-labelledby="sp-prereq">
          <div className="sp-section__inner sp-prereq__layout">
            <div>
              <p className="swp-kicker">{page.prereq.kicker}</p>
              <h2 id="sp-prereq" className="swp-title">
                {page.prereq.title}
              </h2>
              <p className="swp-lead">{page.prereq.text}</p>
              <ol className="sp-prereq__steps">
                {page.prereq.steps.map((st, k) => (
                  <li key={st} data-reveal style={{ "--i": k } as React.CSSProperties}>
                    <span>{k + 1}</span>
                    {st}
                  </li>
                ))}
              </ol>
            </div>
            <div className="sp-prereq__deck" data-anim>
              <DeckIllo />
            </div>
          </div>
        </section>
      )}

      {/* ---------- módulos ---------- */}
      <section id="modulos" className="sp-section sp-section--mist" aria-labelledby="sp-modulos">
        <div className="sp-section__inner">
          <p className="swp-kicker">Conteúdo</p>
          <h2 id="sp-modulos" className="swp-title">
            {page.modules.length} módulos, do conceito à prática.
          </h2>
          <ul className="sp-hero__facts sp-facts--modules" aria-label="Formato">
            <li>{page.modules.length} módulos</li>
            <li>{course.format.hours} horas de videoaulas gravadas</li>
            <li>{course.format.access}</li>
            {course.includes?.some((x) => /apostila/i.test(x)) ? <li>Apostila para imprimir</li> : null}
            {course.includes?.some((x) => /comunidade|membros/i.test(x)) ? <li>Dúvidas e comunidade</li> : null}
          </ul>
          <ol className="sp-modules">
            {page.modules.map((m, i) => (
              <li key={m.title}>
                <details className={`sp-module${page.capstone && i === page.modules.length - 1 ? " sp-module--star" : ""}`} open={i === 0}>
                  <summary>
                    <span className="sp-module__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="sp-module__title">
                      {m.title}
                      {m.tag && (
                        <em className={`sp-module__tag${m.tag.startsWith("Projeto") ? " sp-module__tag--project" : ""}`}>{m.tag}</em>
                      )}
                    </span>
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

      {/* ---------- módulo prático em destaque ---------- */}
      {page.capstone && (
        <section className="sp-section sp-capstone" aria-labelledby="sp-capstone">
          <div className="sp-section__inner sp-capstone__layout">
            <div>
              <p className="sp-capstone__badge">
                <span aria-hidden="true" />
                {page.capstone.badge}
              </p>
              <h2 id="sp-capstone" className="swp-title">
                {page.capstone.title}
              </h2>
              <p className="swp-lead">{page.capstone.text}</p>
              <ul className="sp-checks sp-capstone__list">
                {page.capstone.points.map((pt) => (
                  <li key={pt}>
                    <Check />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <ol className="sp-chain" aria-label="O que entra em operação na aula prática">
              {page.capstone.chain.map((c, k) => (
                <li key={c.name} data-reveal style={{ "--i": k } as React.CSSProperties}>
                  <span className="sp-chain__num">{k + 1}</span>
                  <span className="sp-chain__name">{c.name}</span>
                  <span className="sp-chain__what">{c.what}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- apostila ---------- */}
      {page.cheatsheet && (
        <section className="sp-section sp-section--ink" aria-labelledby="sp-apostila">
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
      <section className="sp-section sp-section--paper" aria-labelledby="sp-quem">
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
        <section className="sp-section sp-section--mist" aria-labelledby="sp-prof">
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

      {/* ---------- objeções ---------- */}
      <section className="sp-section sp-section--graphite" aria-labelledby="sp-objecoes">
        <div className="sp-section__inner">
          <p className="swp-kicker">Talvez você esteja pensando</p>
          <h2 id="sp-objecoes" className="swp-title">
            “Será que é para mim?”
          </h2>
          <ul className="sp-objections">
            {page.objections.map((o, i) => (
              <li key={o.objection} data-reveal style={{ "--i": i % 2 } as React.CSSProperties}>
                <h3>{o.objection}</h3>
                <p>{o.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- valor ---------- */}
      <section className="sp-section sp-section--paper" aria-labelledby="sp-valor">
        <div className="sp-section__inner sp-split">
          <div>
            <p className="swp-kicker">Vale a pena?</p>
            <h2 id="sp-valor" className="swp-title">
              {page.value.title}
            </h2>
            <p className="swp-lead">{page.value.text}</p>
          </div>
          <div className="sp-value">
            <div className="sp-value__price">
              <span>Tudo isso por</span>
              {priceTag("sp-price--big")}
            </div>
            <ul className="sp-checks">
              {page.value.points.map((v) => (
                <li key={v}>
                  <Check />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- oferta ---------- */}
      <section id="oferta" className="sp-section sp-offer" aria-labelledby="sp-oferta">
        <div className="sp-section__inner sp-offer__layout">
          <div className="sp-offer__box">
            <p className="swp-kicker">O que você leva</p>
            <h2 id="sp-oferta" className="sp-offer__title">
              {course.title}
            </h2>
            <ul className="sp-checks">
              <li>
                <Check />
                {page.modules.length} módulos em videoaulas gravadas ({course.format.hours} horas)
              </li>
              {page.modules.some((m) => m.tag) && (
                <li>
                  <Check />
                  Aulas práticas e um projeto final com tudo funcionando junto
                </li>
              )}
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

          <div className={`sp-buy${promoOn ? " sp-buy--promo" : ""}`}>
            {promoOn && <p className="sp-buy__label">{page.promo!.label}</p>}
            <p className="sp-buy__title">{promoOn ? "Preço promocional por tempo limitado" : "Investimento"}</p>
            {priceTag("sp-price--big")}
            <p className="sp-buy__note">pagamento único · acesso imediato</p>
            {promoOn && (
              <div className="sp-buy__timer">
                <span>A promoção termina em</span>
                <Countdown endsAt={endsAt!} />
                <small>
                  Quando o contador zerar, o preço volta para <strong>{formatPrice(priceFrom!)}</strong>.
                </small>
              </div>
            )}
            <div className="sp-buy__cta">{cta()}</div>
            <p className="sp-buy__safe">
              <Check />
              Compra segura pela Hotmart · {GUARANTEE_DAYS} dias de garantia
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="sp-section sp-section--mist" aria-labelledby="sp-faq">
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
            {course.title} {priceFrom ? `de ${formatPrice(priceFrom)} por ${formatPrice(price)}` : `por ${formatPrice(price)}`}, com{" "}
            {GUARANTEE_DAYS} dias de garantia.
          </p>
          {page.finalNote && <p className="sp-final__note">{page.finalNote}</p>}
          {promoOn && (
            <div className="sp-final__timer">
              <span>Preço de lançamento termina em</span>
              <Countdown endsAt={endsAt!} />
            </div>
          )}
          <div className="sp-final__cta">{cta()}</div>
        </div>
      </section>

      {/* ---------- barra fixa (celular) ---------- */}
      <div className="sp-sticky">
        <p>
          <strong>
            {priceFrom && <s>{formatPrice(priceFrom)}</s>} {formatPrice(price)}
          </strong>
          <span>{promoOn ? <>acaba em <Countdown endsAt={endsAt!} variant="inline" /></> : `${GUARANTEE_DAYS} dias de garantia`}</span>
        </p>
        {cta("primary", "Comprar")}
      </div>

      {/* ---------- aviso ao sair da página ---------- */}
      {promoOn && (
        <ExitPopup
          id={course.id}
          productName={course.title}
          badge={page.promo!.label}
          title="Espere! O preço de lançamento não vai durar."
          text={`Você está a um passo de entender a rede da sua igreja. Garanta agora ${off}% de desconto antes que o prazo acabe.`}
          priceFrom={formatPrice(priceFrom!)}
          price={formatPrice(price)}
          endsAt={endsAt}
          ctaHref={ctaHref}
          ctaLabel="Quero aproveitar o desconto"
          external={hasLink}
        />
      )}
    </>
  );
}
