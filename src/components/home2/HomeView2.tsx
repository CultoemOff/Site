import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { HOME_COURSE_CARD } from "@/components/sections/courses/HomeCourses";
import OffersCarousel from "@/components/sections/offers-home/OffersCarousel";
import CopyCouponButton from "@/components/sections/partners/CopyCouponButton";
import { COMBO_PAGE } from "@/config/comboPage";
import { MORE_COURSES_URL, formatInstallments, formatPrice, hasPrice, type Course } from "@/config/courses";
import { getInstructor } from "@/config/instructors";
import { pickHomeOffers, type Offer } from "@/config/offers";
import { SALES_PAGES, hasSalesPage } from "@/config/salesPages";
import { GUARANTEE_DAYS, HOME_COURSE_IDS, LOGO_V_SIZE, LOGO_V_SRC, type SiteSettingsData } from "@/config/site";
import { SOFTWARE } from "@/config/software";
import type { PostSummary } from "@/lib/cms";
import { resolvePrice } from "@/lib/pricing";
import { formatVideoDate, type YouTubeVideo } from "@/lib/youtube";
import "@/components/sections/offers-home/offers-home.css";
import { EqBand, LogoCross, LogoMark } from "./LogoParts";
import Motion from "./Motion";
import PgmSwitcher from "./PgmSwitcher";
import PtzDemo from "./PtzDemo";
import LoopVideo from "@/components/software-page/LoopVideo";
import { PresenterScreen, StoreScreen, VolunteersScreen } from "@/components/sections/partners/ToolScreens";
import "@/components/sections/partners/partners.css";
import "./home2.css";

type Props = {
  courses: Course[];
  settings: SiteSettingsData;
  offers: Offer[];
  videos: YouTubeVideo[];
  posts: PostSummary[];
};

/** "R$ 67" em vez de "R$ 67,00" quando o valor é redondo */
const money = (v: number) => (Number.isInteger(v) ? `R$ ${v}` : formatPrice(v));

/** seta dos links e botões */
const Arrow = () => (
  <svg className="hm2-arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** ícone do YouTube (botão vermelho com o play), para o link do canal */
const YouTubeLogo = ({ className = "hm2-ytlogo" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 20" aria-hidden="true" focusable="false">
    <path fill="#ff0033" d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5C28 14.7 28 10 28 10s0-4.7-.6-6.9z" />
    <path fill="#fff" d="M11.2 14.3 18.4 10l-7.2-4.3z" />
  </svg>
);

/** cabeçalho de seção: número do canal + título (+ texto opcional à direita) */
function Head({ n, label, id, title, children }: { n: string; label: string; id: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="hm2-head" data-m="head">
      <p className="hm2-index">
        <LogoCross className="hm2-index__cross" />
        <span>{n}</span>
        {label}
      </p>
      <h2 id={id} className="hm2-title">
        {title}
      </h2>
      {children && <div className="hm2-intro">{children}</div>}
    </header>
  );
}

/** câmeras do "switcher" do topo: fotos reais das aulas (o monitor PGM corta entre elas; o multiview mostra todas) */
const SHOTS = [
  { src: "/images/formacoes/culto-aula-operacao.jpg", w: 1600, h: 900, label: "Cabine", alt: "Operador na cabine de transmissão da igreja, com o OBS, a mixagem da live e o controle das câmeras" },
  { src: "/images/formacoes/culto-aula-obs-ptz.jpg", w: 1189, h: 669, label: "OBS + PTZ", alt: "Tela do OBS Studio com o controle das câmeras PTZ" },
  { src: "/images/formacoes/culto-aula-cameras.jpg", w: 825, h: 464, label: "Câmeras", alt: "Aula sobre câmeras para igrejas" },
  { src: "/images/formacoes/redes-aula-ndi-obs.jpg", w: 1600, h: 899, label: "NDI", alt: "Câmeras NDI recebidas no OBS Studio durante a aula" },
];
/** vídeo do monitor PGM (MP4 leve, sem som, horizontal, 8 a 12 s). Vazio = corta entre as fotos */
const PGM_VIDEO: { src: string; poster: string } | null = null;

const PILLARS = [
  { name: "Simples", text: "Sem jargão desnecessário: cada conceito explicado desde o começo." },
  { name: "Prático", text: "Exemplos tirados da operação real de um culto." },
  { name: "Acessível", text: "Pensado para equipes pequenas e orçamento limitado." },
  { name: "Aplicável", text: "Aprendeu hoje, usa no próximo culto." },
];

function VideoCard({ v, lead = false }: { v: YouTubeVideo; lead?: boolean }) {
  return (
    <a href={v.url} target="_blank" rel="noopener noreferrer" className={`hm2-yt__card${lead ? " is-lead" : ""}`}>
      <span className="hm2-yt__thumb">
        {/* direto do YouTube (sem passar pelo otimizador do site) */}
        <Image src={v.thumbnail} alt="" fill unoptimized sizes={lead ? "(max-width: 860px) 100vw, 680px" : "(max-width: 860px) 40vw, 180px"} />
        <span className="hm2-yt__play" aria-hidden="true">
          <YouTubeLogo className="hm2-yt__playlogo" />
        </span>
      </span>
      <span className="hm2-yt__meta">
        {v.published && <time dateTime={v.published}>{formatVideoDate(v.published)}</time>}
        <span className="hm2-yt__title">{v.title}</span>
      </span>
      <span className="sr-only"> (abre no YouTube em nova aba)</span>
    </a>
  );
}

function PostItem({ p, lead = false }: { p: PostSummary; lead?: boolean }) {
  return (
    <Link href={`/blog/${p.slug}`} className={`hm2-post${lead ? " is-lead" : ""}`}>
      <span className="hm2-post__cover">
        {p.cover && <Image src={p.cover.url} alt={p.cover.alt} fill sizes={lead ? "(max-width: 860px) 100vw, 680px" : "(max-width: 860px) 40vw, 200px"} />}
      </span>
      <span className="hm2-post__body">
        {p.publishedAt && <time dateTime={p.publishedAt}>{formatVideoDate(p.publishedAt)}</time>}
        <span className="hm2-post__title">{p.title}</span>
        {lead && p.excerpt && <span className="hm2-post__excerpt">{p.excerpt}</span>}
      </span>
    </Link>
  );
}

/** foto do painel de cada formação na home2 (diferente da foto do topo) */
const PANEL_PHOTO: Record<string, string> = {
  "culto-ao-vivo-com-excelencia": "/images/formacoes/culto-aula-gravacao.jpg",
};

function CoursePanel({ course, delay = 0 }: { course: Course; delay?: number }) {
  const c = HOME_COURSE_CARD[course.id];
  const href = hasSalesPage(course.id) ? `/formacoes/${course.id}` : course.href || MORE_COURSES_URL;
  const { price, priceFrom, off, promo, installments } = resolvePrice(course);
  const photo = PANEL_PHOTO[course.id] ?? course.image?.url ?? c?.photo;
  const facts = [/^\d/.test(course.topicsTitle) ? course.topicsTitle : "", course.includes?.some((i) => /certificado/i.test(i)) ? "Certificado" : "", course.format.access].filter(Boolean);
  return (
    <li className="hm2-course" data-m="course" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <Link
        href={href}
        className="hm2-course__link"
        data-track="select_item"
        data-track-label={course.title}
        data-track-id={course.id}
        data-track-location="formações da home2"
      >
        <span className="hm2-course__media">
          {photo && <Image src={photo} alt={course.image?.alt ?? c?.alt ?? ""} fill sizes="(max-width: 860px) 100vw, 600px" />}
          {off > 0 && <span className="hm2-course__off">-{off}%</span>}
        </span>
        <span className="hm2-course__body">
          {promo && <span className="hm2-course__promo">{promo.label}</span>}
          <span className="hm2-course__title">{course.title}</span>
          <span className="hm2-course__sub">{c?.subtitle ?? course.tagline}</span>
          <span className="hm2-course__text">{c?.text ?? course.tagline}</span>
          <span className="hm2-course__facts">
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </span>
          <span className="hm2-course__foot">
            {hasPrice(course) && (
              <span className="hm2-course__price">
                {priceFrom && (
                  <span className="hm2-course__from">
                    de <s>{money(priceFrom)}</s>
                  </span>
                )}
                <strong>{money(price)}</strong>
                {installments && <span className="hm2-course__parcel">ou {formatInstallments(installments)}</span>}
              </span>
            )}
            <span className="hm2-btn hm2-btn--primary" aria-hidden="true">
              Ver a formação
              <Arrow />
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * Home2 (rascunho, 26/11/2026): direção "sala de controle".
 * Mesmo conteúdo da home, com Parceiros compacto, Iluminação numa linha só e 3 provas reais abaixo das formações.
 * Movimento: só a entrada do topo (uma vez), resposta ao toque nos botões e hover só com mouse.
 */
/** seções da home depois do topo (manifesto até o encerramento). Usada na home principal e na home2 */
export function HomeSections({ courses, settings, offers, videos, posts }: Props) {
  const homeCourses = HOME_COURSE_IDS.map((id) => courses.find((c) => c.id === id)).filter((c): c is Course => Boolean(c));
  // provas reais já aprovadas (as mesmas do combo), com o nome do curso
  const proofs = COMBO_PAGE.proofTitles
    .map((t) => {
      for (const id of HOME_COURSE_IDS) {
        const p = SALES_PAGES[id]?.proofs?.find((x) => x.title === t);
        const course = courses.find((c) => c.id === id);
        if (p) return { ...p, course: course?.title.split(":")[0] ?? "" };
      }
      return null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const ptz = SOFTWARE.find((s) => s.id === "ptz-control-web");
  const clt = SOFTWARE.find((s) => s.id === "church-lower-thirds");
  const soon = SOFTWARE.filter((s) => s.status === "em-desenvolvimento");
  const teacher = getInstructor("jonas-silva");
  const homeOffers = pickHomeOffers(offers);
  const [lead, ...rest] = videos;
  const [postLead, ...postRest] = posts.slice(0, 3);
  const { spresenter, voluts, dorn } = settings;

  return (
    <div className="hm2">
        {/* ================= manifesto ================= */}
        <section id="manifesto" className="hm2-section hm2-manifesto" aria-labelledby="hm2-manifesto-title">
          <LogoCross className="hm2-manifesto__cross" />
          <div className="hm2-wrap">
            <div className="hm2-manifesto__grid">
              <div>
                <p className="hm2-index">
                  <LogoCross className="hm2-index__cross" />
                  <span>01</span>Manifesto
                </p>
                <h2 id="hm2-manifesto-title" className="hm2-manifesto__title" aria-label="Quem serve também merece acesso a conhecimento de qualidade.">
                  {"Quem serve também merece acesso a conhecimento de qualidade.".split(" ").map((w, i) => (
                    <span key={i} className="hm2-w" aria-hidden="true" style={{ "--w": i } as React.CSSProperties}>
                      {w}{" "}
                    </span>
                  ))}
                </h2>
                <p className="hm2-manifesto__text" data-m="rise">
                  O Culto em Off nasceu para ser referência na formação de voluntários de igreja, transformando conhecimento técnico
                  em conteúdo simples, prático e acessível. Seja numa grande estrutura ou numa equipe de três voluntários, entender a
                  tecnologia permite resolver problemas, tomar decisões melhores e servir com mais tranquilidade.
                </p>
                <p className="hm2-manifesto__sign" data-m="rise" style={{ "--d": "120ms" } as React.CSSProperties}>Esse é o Culto em Off.</p>
              </div>
              {teacher?.photoScene && (
                <figure className="hm2-portrait" data-m="clip">
                  <Image src={teacher.photoScene} alt={`${teacher.name} na mesa de som`} width={800} height={1000} sizes="(max-width: 860px) 70vw, 380px" />
                  <figcaption>
                    <strong>{teacher.name}</strong>
                    <span>{teacher.role}</span>
                  </figcaption>
                </figure>
              )}
            </div>
            <ol className="hm2-pillars" data-m="stagger" aria-label="Como ensinamos">
              {PILLARS.map((p, i) => (
                <li key={p.name} style={{ "--d": `${[0, 90, 160, 210][i]}ms` } as React.CSSProperties}>
                  <span className="hm2-pillars__n">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{p.name}</strong>
                  <span>{p.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= formações + provas ================= */}
        <section id="formacoes" className="hm2-section hm2-courses" aria-labelledby="hm2-formacoes-title">
          <div className="hm2-wrap">
            <Head n="02" label="Escola Culto em Off" id="hm2-formacoes-title" title="Formações para entender, não só apertar botões.">
              <p>
                Para voluntários, líderes e pastores, dos fundamentos à aplicação no culto. Online, com certificado e {GUARANTEE_DAYS} dias
                de garantia.
              </p>
            </Head>
            <ul className="hm2-courses__grid" aria-label="Formações">
              {homeCourses.map((c, i) => (
                <CoursePanel key={c.id} course={c} delay={i * 110} />
              ))}
            </ul>

            {proofs.length > 0 && (
              <ul className="hm2-proofs" data-m="stagger" aria-label="O que os alunos dizem">
                {proofs.map((p, i) => (
                  <li key={p.title} style={{ "--d": `${[0, 100, 170][i] ?? 0}ms` } as React.CSSProperties}>
                    <blockquote>
                      {p.rating ? (
                        <p className="hm2-proofs__stars" aria-label={`Nota ${p.rating} de 5`}>
                          {"★".repeat(p.rating)}
                        </p>
                      ) : null}
                      <p className="hm2-proofs__quote">“{p.title}”</p>
                    </blockquote>
                    <p className="hm2-proofs__who">
                      <strong>{p.name}</strong>
                      <span>Aluno · {p.course}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <p className="hm2-more">
              <Link href="/formacoes" className="hm2-link">
                Ver todas as formações
                <Arrow />
              </Link>
            </p>
          </div>
        </section>

        {/* ================= softwares ================= */}
        <section id="softwares" className="hm2-section hm2-soft" aria-labelledby="hm2-softwares-title">
          <div className="hm2-wrap">
            <Head n="03" label="Softwares Culto em Off" id="hm2-softwares-title" title="Ferramentas feitas para a operação da igreja.">
              <p>Além das formações, o Culto em Off desenvolve softwares, gratuitos e comerciais, para simplificar a operação técnica de quem serve.</p>
            </Head>
            {ptz && (
              <article className="hm2-soft__main" data-m="rise" aria-labelledby="hm2-ptz">
                <div className="hm2-soft__text">
                  <p className="hm2-kicker">
                    {ptz.area} · <span className="hm2-free">Gratuito</span>
                  </p>
                  <h3 id="hm2-ptz" className="hm2-soft__name">
                    {ptz.name}
                  </h3>
                  <p className="hm2-soft__tagline">{ptz.tagline}</p>
                  <p className="hm2-soft__desc">{ptz.description}</p>
                  {ptz.pageUrl && (
                    <Link href={ptz.pageUrl} className="hm2-btn hm2-btn--primary" data-track="select_item" data-track-label={ptz.name} data-track-location="softwares da home2">
                      Conheça e baixe
                      <Arrow />
                    </Link>
                  )}
                </div>
                <div className="hm2-window" data-m="rise" style={{ "--d": "120ms" } as React.CSSProperties}>
                  <span className="hm2-window__bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>PTZ Control Web · demonstração</span>
                  </span>
                  <PtzDemo />
                </div>
              </article>
            )}
            {/* Church Lower Thirds: logo abaixo do PTZ Control Web (pedido do Jonas em 26/11/2026) */}
            {clt && (
              <article className="hm2-soft__main hm2-soft__main--alt" data-m="rise" aria-labelledby="hm2-clt">
                <div className="hm2-window" data-m="rise" style={{ "--d": "120ms" } as React.CSSProperties}>
                  <span className="hm2-window__bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>Church Lower Thirds · no ar</span>
                  </span>
                  <LoopVideo
                    src="/images/softwares/church-lower-thirds/elementos.mp4"
                    poster="/images/softwares/church-lower-thirds/elementos.webp"
                    width={640}
                    height={360}
                    label="Elementos do Church Lower Thirds entrando na tela durante uma transmissão: selo, avisos, ofertas, nome e agenda"
                  />
                </div>
                <div className="hm2-soft__text">
                  <p className="hm2-kicker">
                    {clt.area} · <span className="hm2-free">Gratuito</span> · Beta
                  </p>
                  <h3 id="hm2-clt" className="hm2-soft__name">
                    {clt.name}
                  </h3>
                  <p className="hm2-soft__tagline">{clt.tagline}</p>
                  <p className="hm2-soft__desc">{clt.description}</p>
                  {clt.pageUrl && (
                    <Link href={clt.pageUrl} className="hm2-btn hm2-btn--primary" data-track="select_item" data-track-label={clt.name} data-track-location="softwares da home">
                      Conheça e baixe
                      <Arrow />
                    </Link>
                  )}
                </div>
              </article>
            )}
            {soon.map((s) => (
              <p key={s.id} className="hm2-soon">
                <span className="hm2-soon__badge">Em desenvolvimento</span>
                <strong>{s.name}</strong>
                <span>{s.tagline}</span>
              </p>
            ))}
          </div>
        </section>

        {/* ================= youtube ================= */}
        <section id="conteudo-gratuito" className="hm2-section hm2-yt" aria-labelledby="hm2-yt-title">
          <div className="hm2-wrap">
            <Head
              n="04"
              label="Conteúdo gratuito"
              id="hm2-yt-title"
              title={
                <>
                  Nos acompanhe no <span className="hm2-yt__word">YouTube</span>.
                </>
              }
            >
              <p>Tutoriais, testes, configurações, equipamentos e experiências práticas, gratuitos no canal Culto em Off.</p>
              <a className="hm2-btn hm2-btn--yt" href={settings.social.youtube} target="_blank" rel="noopener noreferrer" data-track="click_social" data-track-label="YouTube">
                <YouTubeLogo />
                Ver o canal no YouTube
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </Head>
            {lead ? (
              <div className="hm2-yt__grid" data-m="feed">
                <VideoCard v={lead} lead />
                {rest.length > 0 && (
                  <ul className="hm2-yt__side">
                    {rest.slice(0, 3).map((v) => (
                      <li key={v.id}>
                        <VideoCard v={v} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="hm2-yt__fallback">
                Assista aos vídeos no canal Culto em Off
                <Arrow />
              </a>
            )}
          </div>
        </section>

        {/* ================= parceiros (compacto) ================= */}
        <section id="parceiros" className="hm2-section hm2-partners" aria-labelledby="hm2-parceiros-title">
          <div className="hm2-wrap">
            <Head n="05" label="Parceiros" id="hm2-parceiros-title" title="Parceiros que recomendamos.">
              <p>Softwares e lojas que usamos e indicamos para facilitar o dia a dia de quem serve na igreja.</p>
            </Head>
            <ul className="hm2-partners__grid">
              <li className="partner--spresenter" data-m="rise">
                <div className="partner__media hm2-partners__media">
                  <PresenterScreen src={spresenter.screen} />
                </div>
                <p className="hm2-kicker">Projeção</p>
                <h3>
                  <Image className="hm2-partners__logo" src="/images/logos/spresenter.png" alt="" width={240} height={240} />
                  SPresenter
                </h3>
                <p>Apresentação para igrejas e eventos ao vivo, no Windows e no macOS: letras, Bíblia, vídeos e várias saídas, inclusive por NDI.</p>
                {spresenter.coupon && (
                  <div className="hm2-coupon">
                    <span>
                      Cupom · <strong>{spresenter.discount}</strong>
                    </span>
                    <code>{spresenter.coupon}</code>
                    <CopyCouponButton code={spresenter.coupon} />
                  </div>
                )}
                <a className="hm2-link" href={spresenter.url} target="_blank" rel="noopener noreferrer" data-track="click_partner" data-track-label="SPresenter">
                  Conhecer o SPresenter
                  <Arrow />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li className="partner--voluts" data-m="rise" style={{ "--d": "90ms" } as React.CSSProperties}>
                <div className="partner__media hm2-partners__media">
                  <VolunteersScreen src={voluts.screen} />
                </div>
                <p className="hm2-kicker">Voluntários</p>
                <h3>
                  <Image className="hm2-partners__logo" src="/images/links/voluts.png" alt="" width={200} height={200} />
                  Voluts
                </h3>
                <p>Escalas de todos os ministérios, estudo para ensaios com mudança de tom e letra sincronizada com o SPresenter.</p>
                <p className="hm2-partners__note">
                  <strong>14 dias</strong> de teste grátis
                </p>
                <a className="hm2-link" href={voluts.url} target="_blank" rel="noopener noreferrer" data-track="click_partner" data-track-label="Voluts">
                  Testar grátis por 14 dias
                  <Arrow />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li className="partner--dorn" data-m="rise" style={{ "--d": "160ms" } as React.CSSProperties}>
                <div className="partner__media hm2-partners__media">
                  <StoreScreen src={dorn.image} />
                </div>
                <p className="hm2-kicker">Câmeras e transmissão</p>
                <h3>
                  <Image className="hm2-partners__logo" src="/images/links/dorn.jpg" alt="" width={200} height={200} />
                  Loja da Dorn
                </h3>
                <p>Câmeras Full HD e 4K, zoom para a distância da sua igreja e controle PTZ físico, para montar ou ampliar a estrutura de vídeo.</p>
                <a className="hm2-link" href={dorn.url} target="_blank" rel="noopener noreferrer" data-track="click_partner" data-track-label="Loja da Dorn">
                  Visitar a Loja da Dorn
                  <Arrow />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            </ul>
            <p className="hm2-fine">SPresenter, Voluts e Loja da Dorn são empresas independentes e não pertencem ao Culto em Off. São parceiros que recomendamos.</p>
          </div>
        </section>

        {/* ================= equipamentos ================= */}
        {homeOffers.length > 0 && (
          <section id="equipamentos" className="hm2-section hm2-offers" aria-labelledby="hm2-equip-title">
            <div className="hm2-wrap">
              <Head n="06" label="Equipamentos" id="hm2-equip-title" title="Equipamentos que recomendamos.">
                <p>Produtos recomendados pelo Culto em Off para te ajudar na igreja.</p>
                <Link className="hm2-link" href="/ofertas">
                  Ver todas as ofertas
                  <Arrow />
                </Link>
              </Head>
              <div data-m="rise">
                <OffersCarousel offers={homeOffers} />
              </div>
              <p className="hm2-fine">
                Links de afiliado: comprando por eles, o Culto em Off pode receber uma comissão, sem custo extra para você. Preço e
                disponibilidade são definidos pela loja.
              </p>
            </div>
          </section>
        )}

        {/* ================= blog ================= */}
        {postLead && (
          <section className="hm2-section hm2-blog" aria-labelledby="hm2-blog-title">
            <div className="hm2-wrap">
              <Head n="07" label="Blog" id="hm2-blog-title" title="Artigos para quem serve na técnica.">
                <Link className="hm2-link" href="/blog">
                  Ver todos os artigos
                  <Arrow />
                </Link>
              </Head>
              <div className="hm2-blog__grid" data-m="feed">
                <PostItem p={postLead} lead />
                {postRest.length > 0 && (
                  <ul className="hm2-blog__side">
                    {postRest.map((p) => (
                      <li key={p.slug}>
                        <PostItem p={p} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ================= encerramento ================= */}
        <section className="hm2-outro" aria-label="Culto em Off">
          <div className="hm2-wrap">
            <p className="hm2-outro__status">
              <span className="hm2-dot hm2-dot--ok" aria-hidden="true" />
              Sinal OK
            </p>
            <EqBand count={56} className="hm2-outro__eq" />
            <Image data-m="logo" className="hm2-outro__logo" src={LOGO_V_SRC} alt="Culto em Off" width={LOGO_V_SIZE.width} height={LOGO_V_SIZE.height} sizes="(max-width: 700px) 70vw, 380px" />
            <a className="hm2-btn hm2-btn--primary" href="#formacoes">
              Explorar formações
              <Arrow />
            </a>
          </div>
        </section>
      <Motion />
    </div>
  );
}

/** Home2 (rascunho em /home2): topo "sala de controle" + as mesmas seções da home */
export default function HomeView2(props: Props) {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <div className="hm2">
        {/* ================= topo ================= */}
        <section className="hm2-hero" aria-labelledby="hm2-hero-title">
          <div className="hm2-wrap hm2-hero__grid">
            <div className="hm2-hero__text">
              <p className="hm2-eyebrow hm2-in" style={{ "--d": "0ms" } as React.CSSProperties}>
                <LogoCross className="hm2-eyebrow__cross" />
                Formação · Tecnologia · Igreja
              </p>
              <h1 id="hm2-hero-title" className="hm2-hero__title" aria-label="A escola técnica para voluntários que servem na Igreja.">
                {/* entrada palavra por palavra (sobe de dentro de uma máscara), uma vez */}
                {["A", "escola", "técnica", "para", "voluntários", "que", "servem", "na", "Igreja."].map((w, i) => (
                  <Fragment key={i}>
                    <span className={`hm2-wl${i >= 5 ? " is-muted" : ""}`} aria-hidden="true">
                      <span style={{ "--d": `${40 + Math.round(i * 46 - i * i * 1.6)}ms` } as React.CSSProperties}>{w}</span>
                    </span>{" "}
                  </Fragment>
                ))}
              </h1>
              <p className="hm2-hero__lead hm2-in" style={{ "--d": "300ms" } as React.CSSProperties}>
                O Culto em Off nasceu com um objetivo: tornar-se referência na formação de voluntários de igreja, transformando
                conhecimento técnico em conteúdo simples, prático e acessível.
              </p>
              <div className="hm2-hero__ctas hm2-in" style={{ "--d": "370ms" } as React.CSSProperties}>
                <a className="hm2-btn hm2-btn--primary" href="#formacoes">
                  Explorar formações
                  <Arrow />
                </a>
                <a className="hm2-btn hm2-btn--ghost" href="#manifesto">
                  Conhecer o Culto em Off
                </a>
              </div>
              <p className="hm2-hero__areas hm2-in hm2-in--fade" style={{ "--d": "430ms" } as React.CSSProperties}>
                Áudio · Vídeo · Iluminação · Redes · Transmissão · Projeção · Automação
              </p>
            </div>

            {/* monitor de programa: corta entre as câmeras (fotos reais das aulas) */}
            <div className="hm2-pgm-wrap">
              {/* cruz e barras do logo, grandes, atrás do monitor */}
              <LogoMark className="hm2-hero__mark hm2-in hm2-in--fade" live />
              <figure className="hm2-pgm hm2-in hm2-in--scale" style={{ "--d": "150ms" } as React.CSSProperties}>
                <PgmSwitcher shots={SHOTS.map(({ src, alt, label }) => ({ src, alt, label }))} video={PGM_VIDEO} />
              </figure>
            </div>
          </div>

          {/* barras sonoras do logo tocando na base do topo */}
          <EqBand count={72} className="hm2-hero__eq" />
          {/* multiview: fotos reais das aulas */}
          <div className="hm2-wrap">
            <ul className="hm2-multi" aria-label="Câmeras do switcher (cenas das aulas)">
              {SHOTS.map((m, i) => (
                <li key={m.src} data-live={i === 0 ? "" : undefined} style={{ "--i": i } as React.CSSProperties}>
                  <Image src={m.src} alt="" width={m.w} height={m.h} sizes="(max-width: 700px) 45vw, 290px" />
                  <span>
                    CAM {i + 1} · {m.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        </div>
        <HomeSections {...props} />
      </main>
      <Footer settings={props.settings} />
    </>
  );
}
