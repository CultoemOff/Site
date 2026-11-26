import Image from "next/image";
import SalesTracking from "@/components/analytics/SalesTracking";
import ArrowButton from "@/components/ui/ArrowButton";
import Icon from "@/components/ui/Icon";
import { COMBO, formatPrice, type Course } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import { lessonCount, type SalesPage } from "@/config/salesPages";
import { GUARANTEE_DAYS, LOGO_H_SRC, LOGO_H_SIZE } from "@/config/site";
import { COMBO_PAGE } from "@/config/comboPage";
import { resolvePrice } from "@/lib/pricing";
import "@/components/sections/courses/courses.css";
import "@/components/software-page/software-page.css";
import PromoBar from "./PromoBar";
import { Kicker, ModuleItem } from "./SalesPageView";
import SalesVideo from "./SalesVideo";
import "./sales.css";

type Item = { course: Course; page: SalesPage };
type Props = { main: Item; bump: Item };

/** "R$ 67" em vez de "R$ 67,00" quando o valor é redondo */
const money = (v: number) => (Number.isInteger(v) ? `R$ ${v}` : formatPrice(v));
const short = (c: Course) => c.title.split(":")[0];

/**
 * Página do combo: Culto ao Vivo com Excelência (primeiro) + Redes para Igrejas, sem vídeo.
 * Conteúdo de cada curso vem de src/config/salesPages.ts; preço e link, de src/config/comboPage.ts.
 */
export default function ComboPageView({ main, bump }: Props) {
  const pMain = resolvePrice(main.course);
  const pBump = resolvePrice(bump.course);
  const bumpPrice = COMBO?.bumpPrice ?? pBump.price;
  const price = COMBO_PAGE.price || Math.round((pMain.price + bumpPrice) * 100) / 100;
  const separate = Math.round((pMain.price + pBump.price) * 100) / 100;
  const off = separate > price ? Math.round((1 - price / separate) * 100) : 0;
  const href = COMBO_PAGE.checkoutUrl || main.course.href || "#oferta";
  const external = /^https?:/.test(href);
  const promoLabel = pMain.promo?.label;
  const teacher = getInstructor(main.course.instructor);
  const lessonsMain = lessonCount(main.page.modules);
  const lessonsBump = lessonCount(bump.page.modules);
  const label = `Combo ${short(main.course)} + ${short(bump.course)}`;
  // provas reais escolhidas pelo Jonas (25/11/2026), nesta ordem
  const all = [...(bump.page.proofs ?? []), ...(main.page.proofs ?? [])];
  const proofs = COMBO_PAGE.proofTitles
    .map((t) => all.find((p) => p.title === t))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  // fotos das aulas dos dois cursos (as mesmas das páginas de cada curso)
  const frames = [main, bump].flatMap((it) => (it.page.inside?.frames ?? []).filter((f) => f.src).map((f) => ({ ...f, course: short(it.course) })));

  const cta = (location: string, text = `Quero os dois por ${money(price)}`) => (
    <ArrowButton href={href} external={external} track={{ event: "begin_checkout", label, id: main.course.id, value: price, location }}>
      {text}
    </ArrowButton>
  );
  const priceTag = (big = false) => (
    <p className={`sp-price${big ? " sp-price--big" : ""}`}>
      {off > 0 && (
        <span className="sp-price__from">
          separados <s>{formatPrice(separate)}</s> por
        </span>
      )}
      <strong>{formatPrice(price)}</strong>
      {off > 0 && <em className="sp-price__off">{off}% OFF</em>}
      <span className="sp-price__parcel">à vista ou parcelado no cartão</span>
    </p>
  );
  // oferta própria do combo (preço definido em comboPage.ts) ou o Redes no carrinho do Culto ao Vivo (order bump)
  const ownOffer = COMBO_PAGE.price > 0;
  const howItWorks = ownOffer
    ? `Os dois cursos numa compra só, por ${money(price)}. Prefere só um? Cada curso também é vendido separado.`
    : `No checkout do ${short(main.course)}, o ${short(bump.course)} já vem no carrinho por ${money(bumpPrice)}. Se quiser só um curso, é só desmarcar o ${short(bump.course)} no carrinho.`;

  // um curso: cabeçalho e módulos (no computador, os dois ficam lado a lado)
  const course = (item: Item, n: number, lessons: number) => (
    <article id={item.course.id} className="cb-col" aria-labelledby={`cb-${item.course.id}`}>
      <p className="cb-course__num">Curso {n} de 2</p>
      <Kicker icon={n === 1 ? "monitorPlay" : "network"}>{item.page.seo?.kicker ?? "Curso"}</Kicker>
      <h3 id={`cb-${item.course.id}`} className="cb-col__title">
        {item.course.title}
      </h3>
      <p className="cb-course__modules-title">
        {item.page.modules.length} módulos, {lessons} aulas{item.page.extraModule?.label ? ` + ${item.page.extraModule.label}` : ""}
      </p>
      <ol className="sp-modules">
        {item.page.modules.map((m, i) => (
          <ModuleItem key={m.title} m={m} num={String(i + 1).padStart(2, "0")} />
        ))}
        {item.page.extraModule && <ModuleItem m={item.page.extraModule} num="+" extra note={item.page.extraModule.note} />}
      </ol>
    </article>
  );

  return (
    <div className="sp-page cb-page">
      {/* ---------- faixa amarela da promoção (mesma da página do Culto ao Vivo): fixa no topo ---------- */}
      {pMain.promo && off > 0 && (
        <PromoBar
          label={pMain.promo.label}
          product="Combo Culto ao Vivo + Redes"
          off={off}
          endsAt={pMain.promo.endsAt}
          href={href}
          cta={`Quero os dois por ${money(price)}`}
          ctaShort="Comprar"
          external={external}
          track={{ label, id: main.course.id, location: "faixa amarela (combo)", value: price }}
        />
      )}

      {/* ---------- topo (sem vídeo por enquanto) ---------- */}
      <header className={`sp-hero${pMain.promo && off > 0 ? " sp-hero--promo" : ""}${COMBO_PAGE.video ? " sp-hero--vertical" : " sp-hero--novideo"}`}>
        <p className="sp-brand">
          <Image className="sp-brand__logo" src={LOGO_H_SRC} alt="Culto em Off" width={LOGO_H_SIZE.width} height={LOGO_H_SIZE.height} priority />
        </p>
        <div className="sp-hero__inner">
          <div className="sp-hero__text" id="sp-inicio">
            <p className="swp-hero__channel">
              <span aria-hidden="true" />
              Combo · 2 cursos para a equipe de mídia da igreja
            </p>
            <p className="sp-hero__course">
              {short(main.course)} + {short(bump.course)}
            </p>
            <h1 className="sp-hero__title">A live do culto no OBS e a rede que segura a live.</h1>
            <p className="sp-hero__sub">
              Dois cursos do zero ao avançado: monte e opere a transmissão no OBS Studio e entenda a rede por trás das
              câmeras, da mesa e da internet, sem precisar ser de TI.
            </p>
            <ul className="sp-hero__facts sp-facts--icons" aria-label="Resumo">
              <li>
                <Icon name="play" size={15} />2 cursos · {lessonsMain + lessonsBump} aulas
              </li>
              <li>
                <Icon name="graduation" size={15} />2 certificados
              </li>
              <li>
                <Icon name="infinity" size={15} />
                Acesso vitalício
              </li>
              <li>
                <Icon name="message" size={15} />
                Comunidade
              </li>
            </ul>
            <div className="sp-hero__actions">
              {cta("topo")}
              <div className="sp-hero__price">
                {promoLabel && <span className="sp-hero__promo">{promoLabel}</span>}
                {priceTag()}
                <span className="sp-combo-note">{howItWorks}</span>
                <span>Acesso imediato · {GUARANTEE_DAYS} dias de garantia · Compra segura pela Hotmart</span>
              </div>
            </div>
          </div>

          {/* vídeo do combo (em pé), carrega só quando a pessoa toca */}
          {COMBO_PAGE.video && (
            <div
              className="sp-video sp-video--vertical"
              style={
                {
                  "--video-ar": `${COMBO_PAGE.video.width} / ${COMBO_PAGE.video.height}`,
                  "--video-r": COMBO_PAGE.video.width / COMBO_PAGE.video.height,
                } as React.CSSProperties
              }
            >
              <SalesVideo src={COMBO_PAGE.video.src} poster={COMBO_PAGE.video.poster} vertical title={`Apresentação do ${label}`} />
              <a className="sp-scrollcue" href="#sp-inicio">
                <span>Role para saber mais</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </header>

      {/* ---------- faixa de confiança ---------- */}
      <div className="sp-trust" aria-label="Por que comprar com segurança">
        <ul className="sp-trust__list cb-trust">
          <li>
            <b className="sp-trust__star" aria-hidden="true">
              ★
            </b>
            <strong>{main.page.trust?.rating ?? "4.9"}</strong>
            <span>nota dos alunos</span>
          </li>
          <li>
            <Icon name="infinity" size={22} />
            <strong>Vitalício</strong>
            <span>acesso às aulas</span>
          </li>
          <li>
            <Icon name="graduation" size={22} />
            <strong>2 certificados</strong>
            <span>um por curso</span>
          </li>
          <li>
            <Icon name="shield" size={22} />
            <strong>{GUARANTEE_DAYS} dias</strong>
            <span>de garantia</span>
          </li>
        </ul>
      </div>

      {/* ---------- por dentro das aulas: fotos reais dos dois cursos ---------- */}
      {frames.length > 0 && (
        <section className="sp-section sp-section--ink" aria-labelledby="cb-inside" data-track-view="por dentro">
          <div className="sp-section__inner">
            <Kicker icon="monitorPlay">Por dentro das aulas</Kicker>
            <h2 id="cb-inside" className="swp-title">
              Gravado na cabine da igreja, com o equipamento de verdade.
            </h2>
            <ul className="cb-gallery">
              {frames.map((f, k) => (
                <li key={f.src} data-reveal style={{ "--i": k % 4 } as React.CSSProperties}>
                  <figure>
                    <Image src={f.src!} alt={f.alt} width={f.width} height={f.height} sizes="(min-width: 1100px) 290px, (min-width: 640px) 45vw, 92vw" />
                    <figcaption>
                      <span>{f.course}</span>
                      <strong>{f.title}</strong>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- os dois cursos: Culto ao Vivo primeiro; no computador, lado a lado ---------- */}
      <section id="cursos" className="sp-section sp-section--graphite cb-courses" aria-labelledby="cb-cursos" data-track-view="cursos">
        <div className="sp-section__inner">
          <Kicker icon="book">Conteúdo</Kicker>
          <h2 id="cb-cursos" className="swp-title">
            2 cursos, {lessonsMain + lessonsBump} aulas.
          </h2>
          <div className="cb-cols">
            {course(main, 1, lessonsMain)}
            {course(bump, 2, lessonsBump)}
          </div>
        </div>
      </section>

      {/* ---------- provas reais ---------- */}
      {proofs.length > 0 && (
        <section className="sp-section sp-section--paper" aria-labelledby="cb-provas" data-track-view="depoimentos">
          <div className="sp-section__inner">
            <Kicker icon="quote">Provas reais</Kicker>
            <h2 id="cb-provas" className="swp-title">
              O que os alunos dizem.
            </h2>
            <ul className="sp-quotes">
              {proofs.map((t, i) => (
                <li key={`${t.name}-${i}`} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                  <blockquote>
                    {t.rating ? (
                      <p className="sp-quotes__stars" aria-label={`Nota ${t.rating} de 5`}>
                        {Array.from({ length: 5 }, (_, k) => (
                          <svg key={k} viewBox="0 0 20 20" aria-hidden="true" className={k < (t.rating ?? 0) ? "is-on" : ""}>
                            <path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />
                          </svg>
                        ))}
                      </p>
                    ) : null}
                    {t.title && <p className="sp-quotes__title">“{t.title}”</p>}
                    <p>{t.text}</p>
                  </blockquote>
                  <p className="sp-quotes__who">
                    <span className="sp-quotes__avatar" aria-hidden="true">
                      {t.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <strong>{t.name}</strong>
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- oferta ---------- */}
      <section id="oferta" className="sp-section sp-offer" aria-labelledby="cb-oferta" data-track-view="oferta">
        <div className="sp-section__inner sp-offer__intro">
          <Kicker icon="tag">O combo</Kicker>
          <h2 id="cb-oferta" className="swp-title">
            Os dois cursos, um preço.
          </h2>
        </div>
        <div className="sp-section__inner sp-offer__layout">
          <div className="sp-offer__box">
            <p className="swp-kicker">O que você leva</p>
            <ul className="sp-checks sp-checks--icons">
              {[
                { item: main, lessons: lessonsMain, p: pMain },
                { item: bump, lessons: lessonsBump, p: pBump },
              ].map(({ item, lessons, p }) => (
                <li key={item.course.id}>
                  <span className="sp-checks__icon">
                    <Icon name="play" size={18} />
                  </span>
                  <span>
                    <strong>{item.course.title}</strong>: {lessons} aulas em {item.page.modules.length} módulos
                    {item.page.extraModule?.label ? ` + ${item.page.extraModule.label}` : ""}
                    {p.price > 0 && <span className="cb-offer__alone"> (sozinho: {money(p.price)})</span>}
                  </span>
                </li>
              ))}
              <li>
                <span className="sp-checks__icon">
                  <Icon name="graduation" size={18} />
                </span>
                2 certificados de conclusão
              </li>
              <li>
                <span className="sp-checks__icon">
                  <Icon name="message" size={18} />
                </span>
                Área de membros e comunidade de alunos
              </li>
              <li>
                <span className="sp-checks__icon">
                  <Icon name="infinity" size={18} />
                </span>
                Acesso vitalício, no computador ou celular
              </li>
              <li>
                <span className="sp-checks__icon">
                  <Icon name="shield" size={18} />
                </span>
                {GUARANTEE_DAYS} dias de garantia
              </li>
            </ul>
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

          <div className="sp-buy sp-buy--promo">
            {promoLabel && <p className="sp-buy__label">{promoLabel}</p>}
            <p className="sp-buy__title">Combo · 2 cursos</p>
            {priceTag(true)}
            <p className="sp-combo-note sp-combo-note--buy">{howItWorks}</p>
            <p className="sp-buy__note">acesso imediato após a confirmação do pagamento</p>
            <div className="sp-buy__cta">{cta("oferta")}</div>
            <p className="sp-buy__safe">
              <Icon name="lock" size={16} />
              Compra segura pela Hotmart · {GUARANTEE_DAYS} dias de garantia
            </p>
          </div>
        </div>
      </section>

      {/* ---------- professor e perguntas ---------- */}
      <section className="sp-section sp-section--mist" aria-labelledby="cb-faq" data-track-view="duvidas">
        <div className="sp-section__inner sp-faq">
          <div className="sp-faq__head">
            <Kicker icon="help">Dúvidas</Kicker>
            <h2 id="cb-faq" className="swp-title">
              Perguntas frequentes.
            </h2>
          </div>
          <div className="sp-faq__side">
            {teacher && (
              <aside className="sp-fit__teacher" aria-labelledby="cb-prof">
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
                <h3 id="cb-prof">{teacher.name}</h3>
                <p className="sp-teacher__role">{teacher.role}</p>
                <p>{teacher.bio}</p>
              </aside>
            )}
          </div>
          <div className="sp-faq__list">
            {[
              {
                question: "Como funciona o combo?",
                answer: ownOffer
                  ? `Você compra os dois cursos juntos por ${money(price)}, num pagamento só, e recebe o acesso aos dois. Se preferir só um, o ${short(main.course)} e o ${short(bump.course)} também são vendidos separados, cada um na sua página.`
                  : `No checkout do ${short(main.course)}, o ${short(bump.course)} já vem no carrinho por ${money(bumpPrice)}. Com os dois, você paga uma vez só e recebe o acesso aos dois cursos. Se preferir só um, é só desmarcar o ${short(bump.course)} no carrinho.`,
              },
              { question: "Preciso saber alguma coisa antes?", answer: "Não. Os dois cursos começam do zero, com exemplos reais de culto. Não precisa ser de TI nem profissional de vídeo." },
              { question: "Em que ordem eu faço?", answer: `Como preferir. A maioria começa pelo ${short(main.course)}, para colocar a live no ar, e segue para o ${short(bump.course)} para deixar a rede estável.` },
              { question: "Tem certificado?", answer: "Sim, um certificado para cada curso concluído." },
              { question: "Quanto tempo de acesso eu tenho?", answer: "Acesso vitalício aos dois cursos, com as aulas novas que forem acrescentadas." },
              { question: "E se eu não gostar?", answer: `Você tem ${GUARANTEE_DAYS} dias de garantia, com reembolso de 100%.` },
            ].map((f) => (
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

      {/* ---------- chamada final ---------- */}
      <section className="sp-final" aria-labelledby="cb-final" data-track-view="final">
        <div className="sp-section__inner">
          <h2 id="cb-final" className="swp-title">
            A live no ar e a rede estável, no próximo culto.
          </h2>
          <p className="swp-lead">
            {short(main.course)} + {short(bump.course)} por {formatPrice(price)}
            {off > 0 ? ` (separados, ${formatPrice(separate)})` : ""}, com {GUARANTEE_DAYS} dias de garantia.
          </p>
          <div className="sp-final__cta">{cta("final")}</div>
        </div>
      </section>

      {/* ---------- barra fixa (celular) ---------- */}
      <div className="sp-sticky sp-sticky--full">{cta("barra do celular", `${money(price)} • Quero os dois`)}</div>

      <SalesTracking itemId={main.course.id} name={label} value={price} />
    </div>
  );
}
