import Image from "next/image";
import CourseDiagramView from "@/components/sections/courses/CourseDiagrams";
import SalesTracking from "@/components/analytics/SalesTracking";
import ArrowButton from "@/components/ui/ArrowButton";
import Icon, { type IconName } from "@/components/ui/Icon";
import { formatInstallments, formatPrice, type Course } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import { lessonCount, type SalesModule, type SalesPage } from "@/config/salesPages";
import { GUARANTEE_DAYS, LOGO_SRC, type SiteSettingsData } from "@/config/site";
import { resolvePrice } from "@/lib/pricing";
import "@/components/blog/blog.css";
import "@/components/sections/courses/courses.css";
import "@/components/software-page/software-page.css";
import Countdown from "./Countdown";
import ExitPopup from "./ExitPopup";
import PromoBar from "./PromoBar";
import SalesVideo from "./SalesVideo";
import { DhcpScreenIllo, TerminalIllo, TopologyIllo } from "./NetworkIllustrations";
import "./sales.css";

type Props = {
  course: Course;
  page: SalesPage;
  audience: SiteSettingsData["audience"];
  /** perfil do Instagram (do painel): vira o botão "Fale comigo no direct" */
  instagram?: string;
};

/** https://www.instagram.com/cultoemoff → https://ig.me/m/cultoemoff (abre direto a conversa no direct) */
function instagramDm(url?: string) {
  const m = url?.match(/instagram\.com\/([A-Za-z0-9._]+)/);
  return m ? `https://ig.me/m/${m[1]}` : "";
}

/** Botão para tirar dúvida no direct do Instagram (abre o app no celular). */
function DirectButton({ href, location, compact }: { href: string; location: string; compact?: boolean }) {
  return (
    <a
      className={`sp-direct${compact ? " sp-direct--compact" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="click_contact"
      data-track-label="Direct do Instagram"
      data-track-location={location}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </g>
      </svg>
      <span>{compact ? "Dúvida? Fale comigo no direct" : "Fale comigo no direct do Instagram"}</span>
    </a>
  );
}

/** rótulo pequeno acima do título da seção, com ícone */
const Kicker = ({ icon, children }: { icon: IconName; children: React.ReactNode }) => (
  <p className="swp-kicker sp-kicker">
    <Icon name={icon} size={16} />
    {children}
  </p>
);

/** Página de venda de uma formação: promessa, vídeo, dores, módulos, professor, oferta com prazo, garantia e FAQ. */
export default function SalesPageView({ course, page, audience, instagram }: Props) {
  const dm = instagramDm(instagram);
  const teacher = getInstructor(course.instructor);
  // cada item de módulo é uma aula; o módulo extra fica fora da contagem
  const lessons = lessonCount(page.modules);
  const moduleFacts = `${page.modules.length} módulos · ${lessons} aulas`;
  // materiais apresentados como bônus; o que eles substituem some da lista "Inclui" para não repetir
  const bonuses = (page.materials?.items ?? []).filter((m) => m.bonus);
  const replaced = bonuses.map((m) => m.bonus?.replaces?.toLowerCase()).filter(Boolean) as string[];
  const includes = (course.includes ?? []).filter((x) => !replaced.some((r) => x.toLowerCase().includes(r)));

  // Promoção: vale enquanto o prazo não passou. Depois disso a página mostra o preço cheio.
  const { price, priceFrom, off, promo, installments } = resolvePrice(course);
  const promoOn = Boolean(promo);
  const endsAt = promo?.endsAt;

  // Botão de compra: usa o link de inscrição da formação (Hotmart). Sem link ainda, leva até a oferta.
  const hasLink = Boolean(course.href);
  const ctaHref = hasLink ? course.href! : "#oferta";
  const ctaLabel = promoOn ? "Comprar com desconto" : "Comprar agora";
  const cta = (location: string, variant: "primary" | "ghost" = "primary", label = ctaLabel) => (
    <ArrowButton
      href={ctaHref}
      variant={variant}
      external={hasLink}
      track={{ event: "begin_checkout", label: course.title, id: course.id, value: price, location }}
    >
      {label}
    </ArrowButton>
  );
  const testimonials = page.showTestimonials === false ? [] : (course.testimonials ?? []);
  // selos de resumo (topo e conteúdo), cada um com ícone
  const facts = (
    <>
      <li>
        <Icon name="play" size={15} />
        {moduleFacts}
      </li>
      {/* carga horária: só aparece quando está definida (0 ou vazio = não mostra) */}
      {course.format.hours > 0 && (
        <li>
          <Icon name="clock" size={15} />
          {course.format.hours} horas
        </li>
      )}
      <li>
        <Icon name="infinity" size={15} />
        {course.format.access}
      </li>
      {bonuses.length > 0 && (
        <li>
          <Icon name="gift" size={15} />
          {bonuses.length} bônus
        </li>
      )}
      {course.includes?.some((x) => /comunidade|membros/i.test(x)) && (
        <li>
          <Icon name="message" size={15} />
          Comunidade
        </li>
      )}
    </>
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
      {installments && (
        <span className="sp-price__parcel">
          à vista ou <b>{formatInstallments(installments)}</b> no cartão
        </span>
      )}
    </p>
  );

  return (
    <>
      {/* ---------- faixa da promoção: fixa no topo, acima do menu ---------- */}
      {promoOn && (
        <PromoBar
          label={page.promo!.label}
          product={`Curso de ${course.title}`}
          off={off}
          endsAt={endsAt}
          href={ctaHref}
          cta="Comprar agora"
          ctaShort="Comprar"
          external={hasLink}
          track={{ label: course.title, id: course.id, location: "faixa amarela (página do curso)", value: hasLink ? price : undefined }}
        />
      )}

      {/* ---------- topo ---------- */}
      <header className={`sp-hero${promoOn ? " sp-hero--promo" : ""}${page.videoVertical ? " sp-hero--vertical" : ""}`}>
        {/* a página não tem o menu do site: só a marca, sem link */}
        <p className="sp-brand">
          <Image src={LOGO_SRC} alt="" width={36} height={36} priority />
          <span>
            Culto em <strong>Off</strong>
          </span>
        </p>
        <div className="sp-hero__inner">
          <div className="sp-hero__text" id="sp-inicio">
            <p className="swp-hero__channel">
              <span aria-hidden="true" />
              Formação Culto em Off{course.status === "lancamento-em-breve" ? " · Lançamento em breve" : ""}
              {course.status === "inscricoes-abertas" ? " · Inscrições abertas" : ""}
            </p>
            <p className="sp-hero__course">{course.title}</p>
            <h1 className="sp-hero__title">{page.headline}</h1>
            <p className="sp-hero__sub">{page.subheadline}</p>
            <ul className="sp-hero__facts sp-facts--icons" aria-label="Resumo">
              {facts}
            </ul>
            <div className="sp-hero__actions">
              {cta("topo")}
              <div className="sp-hero__price">
                {priceTag()}
                <span>Acesso imediato · {GUARANTEE_DAYS} dias de garantia · Compra segura pela Hotmart</span>
              </div>
            </div>
          </div>

          {/* vídeo de vendas (no celular vem primeiro; em pé, ocupa quase a tela toda) */}
          <div
            className={`sp-video${page.videoVertical ? " sp-video--vertical" : ""}`}
            style={
              page.videoUrl && page.videoSize
                ? ({
                    "--video-ar": `${page.videoSize.width} / ${page.videoSize.height}`,
                    "--video-r": page.videoSize.width / page.videoSize.height,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {page.videoUrl ? (
              <SalesVideo
                src={page.videoUrl}
                poster={page.videoPoster}
                vertical={page.videoVertical}
                title={`Apresentação da formação ${course.title}`}
              />
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
            {/* aviso de que a página continua (só no celular, com o vídeo em pé) */}
            {page.videoVertical && (
              <a className="sp-scrollcue" href="#sp-inicio">
                <span>Role para saber mais</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ---------- prova / autoridade rápida ---------- */}
      <div className="sp-proof" aria-label="Números do Culto em Off">
        <ul className="sp-proof__list">
          {audience.stats.slice(0, 2).map((s, k) => (
            <li key={s.label}>
              <Icon name={k === 0 ? "eye" : "monitorPlay"} size={22} />
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
          <li>
            <Icon name="book" size={22} />
            <strong>{lessons} aulas</strong>
            <span>em {page.modules.length} módulos</span>
          </li>
          <li>
            <Icon name="shield" size={22} />
            <strong>{GUARANTEE_DAYS} dias</strong>
            <span>de garantia</span>
          </li>
        </ul>
      </div>

      {/* ---------- o problema e o que muda (hoje × depois da formação) ---------- */}
      <section className="sp-section sp-section--mist" aria-labelledby="sp-dores">
        <div className="sp-section__inner">
          <Kicker icon="eye">Você se reconhece?</Kicker>
          <h2 id="sp-dores" className="swp-title">
            Se alguma dessas situações já aconteceu no seu culto, esta formação é para você.
          </h2>
          <div className="sp-compare" role="table" aria-label="Hoje e depois da formação">
            <div className="sp-compare__head" role="row">
              <span role="columnheader">Hoje, no culto</span>
              <span role="columnheader">Depois da formação</span>
            </div>
            {page.compare.map((c) => (
              <div key={c.before} className="sp-compare__row" role="row" data-reveal>
                <p role="cell" className="sp-compare__before">
                  <span className="sp-compare__icon">
                    <Icon name={c.icon ?? "x"} size={20} />
                  </span>
                  {c.before}
                </p>
                <p role="cell" className="sp-compare__after">
                  <span className="sp-compare__icon">
                    <Icon name="check" size={20} />
                  </span>
                  {c.after}
                </p>
              </div>
            ))}
          </div>
          <div className="sp-center-cta">{cta("antes e depois")}</div>
        </div>
      </section>

      {/* ---------- versículo ---------- */}
      {page.verse && (
        <aside className="sp-verse" aria-label="Versículo">
          <blockquote>
            <p>“{page.verse.text}”</p>
            <cite>{page.verse.ref}</cite>
          </blockquote>
          {page.verse.note && <p className="sp-verse__note">{page.verse.note}</p>}
        </aside>
      )}

      {/* ---------- depoimentos (só aparecem quando há depoimentos reais cadastrados no painel) ---------- */}
      {testimonials.length > 0 && (
        <section className="sp-section sp-section--paper" aria-labelledby="sp-depoimentos" data-track-view="depoimentos">
          <div className="sp-section__inner">
            <Kicker icon="quote">Quem já fez</Kicker>
            <h2 id="sp-depoimentos" className="swp-title">
              O que os alunos dizem.
            </h2>
            <ul className="sp-quotes">
              {testimonials.map((t, i) => (
                <li key={`${t.name}-${i}`} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                  <blockquote>
                    {t.title && <p className="sp-quotes__title">“{t.title}”</p>}
                    <p>{t.text}</p>
                  </blockquote>
                  <p className="sp-quotes__who">
                    <span className="sp-quotes__avatar" aria-hidden="true">
                      {t.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <strong>{t.name}</strong>
                      {t.role && <span>{t.role}</span>}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- por dentro das aulas (frames reais; sem eles, ilustrações) ---------- */}
      {page.inside && (
        <section className="sp-section sp-section--ink" aria-labelledby="sp-inside">
          <div className="sp-section__inner">
            <Kicker icon="monitorPlay">Por dentro das aulas</Kicker>
            <h2 id="sp-inside" className="swp-title">
              {page.inside.title}
            </h2>
            {page.inside.frames && page.inside.frames.length > 0 ? (
              <div className="sp-inside__layout sp-inside__layout--frames">
                {page.inside.frames.map((f, k) => (
                  <figure
                    key={f.src}
                    className="sp-inside__card sp-inside__frame"
                    data-reveal
                    style={{ "--i": k } as React.CSSProperties}
                  >
                    <Image
                      src={f.src}
                      alt={f.alt}
                      width={f.width}
                      height={f.height}
                      sizes="(min-width: 1200px) 560px, (min-width: 700px) 50vw, 100vw"
                    />
                    <figcaption>
                      <strong>
                        {f.icon && <Icon name={f.icon} size={18} />}
                        {f.title}
                      </strong>
                      {f.text}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
            <div className="sp-inside__layout">
            <figure className="sp-inside__topo" data-anim>
              <TopologyIllo />
              <figcaption>{page.inside.topology}</figcaption>
            </figure>
            <div className="sp-inside__grid">
              <figure className="sp-inside__card" data-reveal data-anim>
                <div className="sp-inside__crop">
                  <DhcpScreenIllo />
                </div>
                <figcaption>
                  <strong>{page.inside.dhcp.title}</strong>
                  {page.inside.dhcp.text}
                </figcaption>
              </figure>
              <figure className="sp-inside__card" data-reveal data-anim style={{ "--i": 1 } as React.CSSProperties}>
                <div className="sp-inside__crop">
                  <TerminalIllo />
                </div>
                <figcaption>
                  <strong>{page.inside.terminal.title}</strong>
                  {page.inside.terminal.text}
                </figcaption>
              </figure>
            </div>
            </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- módulos ---------- */}
      <section id="modulos" className="sp-section sp-section--mist" aria-labelledby="sp-modulos" data-track-view="modulos">
        <div className="sp-section__inner">
          <Kicker icon="book">Conteúdo</Kicker>
          <h2 id="sp-modulos" className="swp-title">
            {page.modules.length} módulos, {lessons} aulas.
          </h2>
          <ul className="sp-hero__facts sp-facts--modules sp-facts--icons" aria-label="Formato">
            {facts}
          </ul>
          <ol className="sp-modules">
            {page.modules.map((m, i) => (
              <ModuleItem key={m.title} m={m} num={String(i + 1).padStart(2, "0")} star={Boolean(page.capstone) && i === page.modules.length - 1} open={i === 0} />
            ))}
            {page.extraModule && (
              <ModuleItem m={page.extraModule} num="+" extra note={page.extraModule.note} />
            )}
          </ol>

          {/* projeto prático do último módulo, em destaque dentro do conteúdo */}
          {page.capstone && (
            <div className="sp-capstone sp-capstone--card">
              <div>
                <p className="sp-capstone__badge">
                  <span aria-hidden="true" />
                  {page.capstone.badge}
                </p>
                <h3 className="swp-title">{page.capstone.title}</h3>
                <p className="swp-lead">{page.capstone.text}</p>
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
          )}
          <div className="sp-center-cta">{cta("módulos")}</div>
        </div>
      </section>

      {/* ---------- materiais inclusos (apostila, planilha) ---------- */}
      {page.materials && !page.materials.hideSection && (
        <section className="sp-section sp-section--ink" aria-labelledby="sp-materiais" data-track-view="materiais">
          <div className="sp-section__inner">
            <Kicker icon="gift">{page.materials.kicker ?? "Materiais inclusos"}</Kicker>
            <h2 id="sp-materiais" className="swp-title">
              {page.materials.title}
            </h2>
            <p className="swp-lead">{page.materials.lead}</p>
            <ul className="sp-materials">
              {page.materials.items.map((m, i) => (
                <li key={m.title} className={m.image ? "" : "sp-materials__item--text"} data-reveal style={{ "--i": i } as React.CSSProperties}>
                  {m.image && (
                    <span className="sp-materials__img">
                      <Image src={m.image.src} alt={m.image.alt} width={m.image.width} height={m.image.height} sizes="(max-width: 760px) 92vw, 560px" />
                    </span>
                  )}
                  <div>
                    <p className="sp-materials__tag">
                      {m.icon && <Icon name={m.icon} size={16} />}
                      {m.tag}
                    </p>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- para quem é + quem ensina ---------- */}
      <section className="sp-section sp-section--paper" aria-labelledby="sp-quem">
        <div className="sp-section__inner sp-fit">
          <div>
            <Kicker icon="userCheck">Para quem é</Kicker>
            <h2 id="sp-quem" className="swp-title">
              Para quem serve na técnica.
            </h2>
            <ul className="sp-checks sp-checks--icons">
              {page.forWho.map((w) => (
                <li key={w.text}>
                  <span className="sp-checks__icon">
                    <Icon name={w.icon} size={18} />
                  </span>
                  {w.text}
                </li>
              ))}
            </ul>
            <ul className="sp-checks sp-checks--no sp-checks--icons">
              {page.notForWho.map((w) => (
                <li key={w}>
                  <span className="sp-checks__icon">
                    <Icon name="x" size={18} />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          {teacher && (
            <aside className="sp-fit__teacher" aria-labelledby="sp-prof">
              {teacher.photoScene ? (
                <span className="sp-fit__scene">
                  <Image src={teacher.photoScene} alt={`${teacher.name} na mesa de som`} fill sizes="(max-width: 960px) 92vw, 400px" />
                </span>
              ) : (
                <span className="sp-teacher__photo">
                  <Image src={teacher.photo} alt={`Foto de ${teacher.name}`} fill sizes="120px" />
                </span>
              )}
              <Kicker icon="graduation">Seu professor</Kicker>
              <h3 id="sp-prof">{teacher.name}</h3>
              <p className="sp-teacher__role">{teacher.role}</p>
              <p>{teacher.bio}</p>
            </aside>
          )}
        </div>
      </section>

      {/* ---------- oferta ---------- */}
      <section id="oferta" className="sp-section sp-offer" aria-labelledby="sp-oferta" data-track-view="oferta">
        <div className="sp-section__inner sp-offer__intro">
          <Kicker icon="tag">Vale a pena?</Kicker>
          <h2 id="sp-oferta" className="swp-title">
            {page.value.title}
          </h2>
          <p className="swp-lead">{page.value.text}</p>
        </div>
        <div className="sp-section__inner sp-offer__layout">
          <div className="sp-offer__box">
            <p className="swp-kicker">O que você leva</p>
            <h3 className="sp-offer__title">{course.title}</h3>
            <ul className="sp-checks sp-checks--icons">
              <li>
                <span className="sp-checks__icon">
                  <Icon name="play" size={18} />
                </span>
                {lessons} videoaulas em {page.modules.length} módulos
                {course.format.hours > 0 ? ` (${course.format.hours} horas)` : ""}
              </li>
              {page.modules.some((m) => m.tag) && (
                <li>
                  <span className="sp-checks__icon">
                    <Icon name="wrench" size={18} />
                  </span>
                  Aulas práticas e projeto final
                </li>
              )}
              {includes.map((i) => (
                <li key={i}>
                  <span className="sp-checks__icon">
                    <Icon name={/comunidade|membros|dúvida/i.test(i) ? "message" : "check"} size={18} />
                  </span>
                  {/comunidade|membros/i.test(i) ? "Área de membros e comunidade de alunos" : i}
                </li>
              ))}
              <li>
                <span className="sp-checks__icon">
                  <Icon name="infinity" size={18} />
                </span>
                {course.format.access}, no computador ou celular
              </li>
              <li>
                <span className="sp-checks__icon">
                  <Icon name="shield" size={18} />
                </span>
                {GUARANTEE_DAYS} dias de garantia
              </li>
            </ul>
            {bonuses.length > 0 && (
              <>
                <p className="sp-bonus__title">Bônus inclusos</p>
                <ul className="sp-checks sp-bonus">
                  {bonuses.map((m, k) => (
                    <li key={m.title}>
                      <Icon name={m.icon ?? "gift"} size={18} className="sp-bonus__icon" />
                      <em className="sp-bonus__tag">Bônus {k + 1}</em>
                      {m.bonus?.line}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="sp-guarantee">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>
                <strong>Risco zero:</strong> não gostou em {GUARANTEE_DAYS} dias? Devolvemos 100%.
              </p>
            </div>
          </div>

          <div className={`sp-buy${promoOn ? " sp-buy--promo" : ""}`}>
            {promoOn && <p className="sp-buy__label">{page.promo!.label}</p>}
            {/* sem prazo, o selo acima ("Preço especial de lançamento") já diz tudo: não repete o título */}
            {(!promoOn || endsAt) && <p className="sp-buy__title">{promoOn ? "Preço promocional por tempo limitado" : "Investimento"}</p>}
            {priceTag("sp-price--big")}
            <p className="sp-buy__note">{installments ? "acesso imediato após a confirmação do pagamento" : "pagamento único · acesso imediato"}</p>
            {endsAt && (
              <div className="sp-buy__timer">
                <span>A promoção termina em</span>
                <Countdown endsAt={endsAt} />
                <small>
                  Quando o contador zerar, o preço volta para <strong>{formatPrice(priceFrom!)}</strong>.
                </small>
              </div>
            )}
            <div className="sp-buy__cta">{cta("oferta")}</div>
            <p className="sp-buy__safe">
              <Icon name="lock" size={16} />
              Compra segura pela Hotmart · {GUARANTEE_DAYS} dias de garantia
            </p>
            {dm && <DirectButton href={dm} location="oferta" compact />}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="sp-section sp-section--mist" aria-labelledby="sp-faq" data-track-view="duvidas">
        <div className="sp-section__inner sp-faq">
          <div>
            <Kicker icon="help">Dúvidas</Kicker>
            <h2 id="sp-faq" className="swp-title">
              Perguntas frequentes.
            </h2>
            {dm && (
              <div className="sp-direct-box">
                <p>Ficou com dúvida? Me chama no direct.</p>
                <DirectButton href={dm} location="duvidas" />
              </div>
            )}
          </div>
          <div className="sp-faq__list">
            {page.faq.map((f) => (
              <details key={f.question} className="sp-faq__item">
                <summary>
                  <Icon name="help" size={18} className="sp-faq__icon" />
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
      <section className="sp-final" aria-labelledby="sp-final" data-track-view="final">
        <div className="sp-section__inner">
          <h2 id="sp-final" className="swp-title">
            {page.finalTitle}
          </h2>
          <p className="swp-lead">
            {course.title} {priceFrom ? `de ${formatPrice(priceFrom)} por ${formatPrice(price)}` : `por ${formatPrice(price)}`}, com{" "}
            {GUARANTEE_DAYS} dias de garantia.
          </p>
          {page.finalNote && <p className="sp-final__note">{page.finalNote}</p>}
          {endsAt && (
            <div className="sp-final__timer">
              <span>Preço de lançamento termina em</span>
              <Countdown endsAt={endsAt} />
            </div>
          )}
          <div className="sp-final__cta">{cta("final")}</div>
        </div>
      </section>

      {/* ---------- barra fixa (celular) ---------- */}
      <div className="sp-sticky">
        <p>
          <strong>
            {priceFrom && <s>{formatPrice(priceFrom)}</s>} {formatPrice(price)}
          </strong>
          <span>{endsAt ? <>acaba em <Countdown endsAt={endsAt} variant="inline" /></> : `${GUARANTEE_DAYS} dias de garantia`}</span>
        </p>
        {cta("barra do celular", "primary", "Comprar")}
      </div>

      {/* ---------- aviso ao sair da página ---------- */}
      {promoOn && (
        <ExitPopup
          id={course.id}
          productName={course.title}
          itemId={course.id}
          value={hasLink ? price : undefined}
          badge={page.promo!.label}
          title={endsAt ? "Espere! O preço de lançamento não vai durar." : `Espere! Você ainda tem ${off}% de desconto.`}
          text={
            endsAt
              ? `Você está a um passo de entender a rede da sua igreja. Garanta agora ${off}% de desconto antes que o prazo acabe.`
              : "Você está a um passo de entender a rede da sua igreja. Garanta agora o preço de lançamento, com 7 dias de garantia."
          }
          priceFrom={formatPrice(priceFrom!)}
          price={formatPrice(price)}
          endsAt={endsAt}
          ctaHref={ctaHref}
          ctaLabel="Quero aproveitar o desconto"
          external={hasLink}
        />
      )}

      {/* medição da página (Google Analytics): não mostra nada na tela */}
      <SalesTracking itemId={course.id} name={course.title} value={price} />
    </>
  );
}

/** um módulo da lista (acordeão), com a contagem de aulas no título */
function ModuleItem({ m, num, star, open, extra, note }: { m: SalesModule; num: string; star?: boolean; open?: boolean; extra?: boolean; note?: string }) {
  const cls = `sp-module${star ? " sp-module--star" : ""}${extra ? " sp-module--extra" : ""}`;
  return (
    <li>
      <details className={cls} open={open}>
        <summary>
          <span className="sp-module__num">{num}</span>
          {m.icon && (
            <span className="sp-module__icon">
              <Icon name={m.icon} size={20} />
            </span>
          )}
          <span className="sp-module__title">
            {m.title}
            <small className="sp-module__count">
              {m.items.length} aulas{note ? ` · ${note}` : ""}
            </small>
            {m.tag && <em className={`sp-module__tag${/^(Projeto|Módulo extra)/.test(m.tag) ? " sp-module__tag--project" : ""}`}>{m.tag}</em>}
          </span>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <ol className="sp-module__lessons">
          {m.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ol>
      </details>
    </li>
  );
}
