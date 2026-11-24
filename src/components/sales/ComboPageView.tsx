import Image from "next/image";
import SalesTracking from "@/components/analytics/SalesTracking";
import ArrowButton from "@/components/ui/ArrowButton";
import Icon from "@/components/ui/Icon";
import { COMBO, formatPrice, type Course } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import { lessonCount, type SalesPage } from "@/config/salesPages";
import { GUARANTEE_DAYS, LOGO_SRC } from "@/config/site";
import { COMBO_PAGE } from "@/config/comboPage";
import { resolvePrice } from "@/lib/pricing";
import "@/components/sections/courses/courses.css";
import "@/components/software-page/software-page.css";
import { Kicker, ModuleItem } from "./SalesPageView";
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
  const proofs = [...(main.page.proofs ?? []), ...(bump.page.proofs ?? [])];

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
  const howItWorks = `No checkout do ${short(main.course)}, o ${short(bump.course)} já vem no carrinho por ${money(bumpPrice)}.`;

  const course = (item: Item, n: number, lessons: number) => (
    <section
      id={item.course.id}
      className={`sp-section ${n === 1 ? "sp-section--ink" : "sp-section--graphite"} cb-course`}
      aria-labelledby={`cb-${item.course.id}`}
      data-track-view={`curso ${n}`}
    >
      <div className="sp-section__inner">
        <p className="cb-course__num">Curso {n} de 2</p>
        <Kicker icon={n === 1 ? "monitorPlay" : "network"}>{item.page.seo?.kicker ?? "Curso"}</Kicker>
        <h2 id={`cb-${item.course.id}`} className="swp-title">
          {item.course.title}
        </h2>
        {item.page.learn && <p className="swp-lead">{item.page.learn.title}</p>}
        {item.page.learn && (
          <ul className="sp-learn__list">
            {item.page.learn.items.map((t) => (
              <li key={t}>
                <Icon name="check" size={16} />
                {t}
              </li>
            ))}
            {item.page.learn.bonus && (
              <li className="sp-learn__bonus">
                <Icon name="gift" size={16} />
                {item.page.learn.bonus}
              </li>
            )}
          </ul>
        )}
        <h3 className="cb-course__modules-title">
          {item.page.modules.length} módulos, {lessons} aulas{item.page.extraModule?.label ? ` + ${item.page.extraModule.label}` : ""}
        </h3>
        <ol className="sp-modules">
          {item.page.modules.map((m, i) => (
            <ModuleItem key={m.title} m={m} num={String(i + 1).padStart(2, "0")} />
          ))}
          {item.page.extraModule && <ModuleItem m={item.page.extraModule} num="+" extra note={item.page.extraModule.note} />}
        </ol>
      </div>
    </section>
  );

  return (
    <div className="sp-page cb-page">
      {/* ---------- topo (sem vídeo por enquanto) ---------- */}
      <header className="sp-hero sp-hero--novideo">
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

      {/* ---------- por que os dois juntos ---------- */}
      <section className="sp-highlights cb-highlights" aria-label="Por que os dois cursos juntos">
        <ul className="sp-highlights__list">
          {[
            { icon: "monitorPlay" as const, title: "A live depende da rede.", text: "Câmeras NDI e PTZ, o computador da live e a internet conversam pela rede da igreja. Se ela falha, a transmissão cai." },
            { icon: "wifi" as const, title: "Um curso cobre o OBS, o outro a rede.", text: "No primeiro, você monta e opera a live. No segundo, entende IP, switch, Wi-Fi e NDI para ela não travar." },
            { icon: "tag" as const, title: `Os dois por ${money(price)}.`, text: off > 0 ? `Separados, sairiam por ${money(separate)}. No combo, você economiza ${money(separate - price)}.` : "Um preço só para os dois cursos." },
          ].map((h, k) => (
            <li key={h.title} className="sp-highlight" data-reveal style={{ "--i": k } as React.CSSProperties}>
              <span className="sp-highlight__icon">
                <Icon name={h.icon} size={28} />
              </span>
              <div>
                <h2 className="sp-highlight__title">{h.title}</h2>
                <p className="sp-highlight__text">{h.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- os dois cursos: Culto ao Vivo primeiro ---------- */}
      {course(main, 1, lessonsMain)}
      {course(bump, 2, lessonsBump)}

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
              { question: "Como funciona o combo?", answer: `${howItWorks} Você paga uma vez só e recebe o acesso aos dois cursos.` },
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
