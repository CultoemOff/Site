import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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
import Timecode from "./Timecode";
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

/** cabeçalho de seção: número do canal + título (+ texto opcional à direita) */
function Head({ n, label, id, title, children }: { n: string; label: string; id: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="hm2-head">
      <p className="hm2-index">
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

/** fotos reais das aulas no "multiview" abaixo do topo */
const MULTIVIEW = [
  { src: "/images/formacoes/culto-aula-gravacao.jpg", w: 1195, h: 672, label: "Cabine", alt: "Aula gravada na cabine de transmissão da igreja" },
  { src: "/images/formacoes/culto-aula-cameras.jpg", w: 825, h: 464, label: "Câmeras", alt: "Aula sobre câmeras para igrejas" },
  { src: "/images/formacoes/redes-aula-regra-de-ouro.jpg", w: 1600, h: 900, label: "Redes", alt: "Slide de aula explicando o endereço IP com uma analogia de rua e casa" },
  { src: "/images/formacoes/redes-aula-ndi-obs.jpg", w: 1600, h: 899, label: "NDI", alt: "Câmeras NDI recebidas no OBS Studio durante a aula" },
];

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
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
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
  "culto-ao-vivo-com-excelencia": "/images/formacoes/culto-aula-obs-ptz.jpg",
};

function CoursePanel({ course }: { course: Course }) {
  const c = HOME_COURSE_CARD[course.id];
  const href = hasSalesPage(course.id) ? `/formacoes/${course.id}` : course.href || MORE_COURSES_URL;
  const { price, priceFrom, off, promo, installments } = resolvePrice(course);
  const photo = PANEL_PHOTO[course.id] ?? course.image?.url ?? c?.photo;
  const facts = [/^\d/.test(course.topicsTitle) ? course.topicsTitle : "", course.includes?.some((i) => /certificado/i.test(i)) ? "Certificado" : "", course.format.access].filter(Boolean);
  return (
    <li className="hm2-course">
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
export default function HomeView2({ courses, settings, offers, videos, posts }: Props) {
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
  const soon = SOFTWARE.filter((s) => s.status === "em-desenvolvimento");
  const teacher = getInstructor("jonas-silva");
  const homeOffers = pickHomeOffers(offers);
  const [lead, ...rest] = videos;
  const [postLead, ...postRest] = posts.slice(0, 3);
  const { spresenter, voluts, dorn } = settings;

  return (
    <>
      <Navbar newLogo />
      <main id="conteudo" tabIndex={-1} className="hm2">
        {/* ================= topo ================= */}
        <section className="hm2-hero" aria-labelledby="hm2-hero-title">
          <div className="hm2-wrap hm2-hero__grid">
            <div className="hm2-hero__text">
              <p className="hm2-eyebrow hm2-in" style={{ "--d": "0ms" } as React.CSSProperties}>
                <span className="hm2-dot" aria-hidden="true" />
                Formação · Tecnologia · Igreja
              </p>
              <h1 id="hm2-hero-title" className="hm2-hero__title hm2-in hm2-in--lead" style={{ "--d": "40ms" } as React.CSSProperties}>
                A escola técnica para voluntários <span>que servem na Igreja.</span>
              </h1>
              <p className="hm2-hero__lead hm2-in" style={{ "--d": "140ms" } as React.CSSProperties}>
                O Culto em Off nasceu com um objetivo: tornar-se referência na formação de voluntários de igreja, transformando
                conhecimento técnico em conteúdo simples, prático e acessível.
              </p>
              <div className="hm2-hero__ctas hm2-in" style={{ "--d": "210ms" } as React.CSSProperties}>
                <a className="hm2-btn hm2-btn--primary" href="#formacoes">
                  Explorar formações
                  <Arrow />
                </a>
                <a className="hm2-btn hm2-btn--ghost" href="#manifesto">
                  Conhecer o Culto em Off
                </a>
              </div>
              <p className="hm2-hero__areas hm2-in hm2-in--fade" style={{ "--d": "280ms" } as React.CSSProperties}>
                Áudio · Vídeo · Iluminação · Redes · Transmissão · Projeção · Automação
              </p>
            </div>

            {/* monitor de programa: foto real da cabine */}
            <figure className="hm2-pgm hm2-in hm2-in--scale" style={{ "--d": "90ms" } as React.CSSProperties}>
              <div className="hm2-pgm__screen">
                <Image
                  src="/images/formacoes/culto-aula-operacao.jpg"
                  alt="Operador na cabine de transmissão da igreja, com o OBS, a mixagem da live e o controle das câmeras"
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 560px"
                />
                <span className="hm2-pgm__safe" aria-hidden="true" />
                <span className="hm2-pgm__tag" aria-hidden="true">
                  PGM
                </span>
                <span className="hm2-pgm__live" aria-hidden="true">
                  <span className="hm2-tally" />
                  Ao vivo
                </span>
              </div>
              <figcaption className="hm2-pgm__bar">
                <span>CAM 1 · Cabine de transmissão</span>
                {/* medidor de áudio: as barras do logo */}
                <span className="hm2-meter" aria-hidden="true">
                  {[38, 62, 48, 80, 56, 92, 70, 44, 66, 30].map((h, i) => (
                    <i key={i} style={{ height: `${h}%` }} />
                  ))}
                </span>
                <Timecode />
              </figcaption>
            </figure>
          </div>

          {/* multiview: fotos reais das aulas */}
          <div className="hm2-wrap">
            <ul className="hm2-multi hm2-in hm2-in--fade" style={{ "--d": "320ms" } as React.CSSProperties} aria-label="Cenas das aulas">
              {MULTIVIEW.map((m, i) => (
                <li key={m.src}>
                  <Image src={m.src} alt={m.alt} width={m.w} height={m.h} sizes="(max-width: 700px) 45vw, 290px" />
                  <span>
                    {String(i + 2).padStart(2, "0")} · {m.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= manifesto ================= */}
        <section id="manifesto" className="hm2-section hm2-manifesto" aria-labelledby="hm2-manifesto-title">
          <div className="hm2-wrap">
            <div className="hm2-manifesto__grid">
              <div>
                <p className="hm2-index">
                  <span>01</span>Manifesto
                </p>
                <h2 id="hm2-manifesto-title" className="hm2-manifesto__title">
                  Quem serve também merece acesso a conhecimento de qualidade.
                </h2>
                <p className="hm2-manifesto__text">
                  Não importa se sua igreja tem uma grande estrutura ou uma equipe de três voluntários. Entender a tecnologia
                  permite resolver problemas, tomar decisões melhores e servir com mais tranquilidade.
                </p>
                <p className="hm2-manifesto__sign">Esse é o Culto em Off.</p>
              </div>
              {teacher?.photoScene && (
                <figure className="hm2-portrait">
                  <Image src={teacher.photoScene} alt={`${teacher.name} na mesa de som`} width={800} height={1000} sizes="(max-width: 860px) 70vw, 380px" />
                  <figcaption>
                    <strong>{teacher.name}</strong>
                    <span>{teacher.role}</span>
                  </figcaption>
                </figure>
              )}
            </div>
            <ol className="hm2-pillars" aria-label="Como ensinamos">
              {PILLARS.map((p, i) => (
                <li key={p.name}>
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
              {homeCourses.map((c) => (
                <CoursePanel key={c.id} course={c} />
              ))}
            </ul>

            {proofs.length > 0 && (
              <ul className="hm2-proofs" aria-label="O que os alunos dizem">
                {proofs.map((p) => (
                  <li key={p.title}>
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
              <article className="hm2-soft__main" aria-labelledby="hm2-ptz">
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
                <div className="hm2-window" aria-hidden="true">
                  <span className="hm2-window__bar">
                    <i />
                    <i />
                    <i />
                    <span>PTZ Control Web</span>
                  </span>
                  <Image src="/images/softwares/ptz-control-web/horizontal-pt.webp" alt="" width={1600} height={543} sizes="(max-width: 960px) 100vw, 640px" />
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
            <Head n="04" label="Conteúdo gratuito" id="hm2-yt-title" title="Nos acompanhe no YouTube.">
              <p>Tutoriais, testes, configurações, equipamentos e experiências práticas, gratuitos no canal Culto em Off.</p>
              <a className="hm2-link" href={settings.social.youtube} target="_blank" rel="noopener noreferrer" data-track="click_social" data-track-label="YouTube">
                Ver o canal no YouTube
                <Arrow />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </Head>
            {lead ? (
              <div className="hm2-yt__grid">
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
              <li>
                <p className="hm2-kicker">Projeção</p>
                <h3>SPresenter</h3>
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
              <li>
                <p className="hm2-kicker">Voluntários</p>
                <h3>Voluts</h3>
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
              <li>
                <p className="hm2-kicker">Câmeras e transmissão</p>
                <h3>Loja da Dorn</h3>
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
              <OffersCarousel offers={homeOffers} />
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
              <div className="hm2-blog__grid">
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
            <Image className="hm2-outro__logo" src={LOGO_V_SRC} alt="Culto em Off" width={LOGO_V_SIZE.width} height={LOGO_V_SIZE.height} sizes="(max-width: 700px) 70vw, 380px" />
            <a className="hm2-btn hm2-btn--primary" href="#formacoes">
              Explorar formações
              <Arrow />
            </a>
          </div>
        </section>
      </main>
      <Footer settings={settings} newLogo />
    </>
  );
}
