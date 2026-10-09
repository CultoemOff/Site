import Image from "next/image";
import Link from "next/link";
import CopyCouponButton from "@/components/sections/partners/CopyCouponButton";
import SocialIcon from "@/components/ui/SocialIcon";
import { hasPrice, type Course } from "@/config/courses";
import { FACEBOOK_URL, LOGO_SRC, MAIN_SITE_URL, SITE_NAME, type SiteSettingsData } from "@/config/site";
import type { YouTubeVideo } from "@/lib/youtube";
import "./links.css";

/** Marca de origem nos links do próprio site (aparece no Analytics e segue até a Hotmart). */
const FROM_BIO = "utm_source=links&utm_medium=bio";

/** Miniaturas redondas de cada link (recortes das telas reais dos parceiros e do logo). */
const THUMBS = {
  formacao: "/images/links/formacao-redes.jpg",
  voluts: "/images/links/voluts.jpg",
  spresenter: "/images/links/spresenter.jpg",
  dorn: "/images/links/dorn.jpg",
};

type Row = {
  title: string;
  text?: string;
  href: string;
  track: string;
  thumb: React.ReactNode;
  extra?: React.ReactNode;
  sponsored?: boolean;
  external?: boolean;
};

const ext = (sponsored?: boolean) => ({ target: "_blank", rel: sponsored ? "noopener noreferrer sponsored" : "noopener noreferrer" });

function Arrow() {
  return (
    <svg className="lk__arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Thumb({ src }: { src: string }) {
  return (
    <span className="lk__thumb">
      <Image src={src} alt="" width={96} height={96} sizes="48px" />
    </span>
  );
}

function LogoThumb() {
  return (
    <span className="lk__thumb lk__thumb--logo">
      <Image src={LOGO_SRC} alt="" width={96} height={96} sizes="48px" />
    </span>
  );
}

function IconThumb({ kind }: { kind: "youtube" | "ofertas" }) {
  return (
    <span className={`lk__thumb lk__thumb--${kind}`}>
      {kind === "youtube" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="#ff0033" />
          <path d="M10 9.2v5.6l4.8-2.8z" fill="#fff" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M3.5 12.2V4.8a1.3 1.3 0 011.3-1.3h7.4l8.3 8.3a1.3 1.3 0 010 1.8l-7.4 7.4a1.3 1.3 0 01-1.8 0z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="8" r="1.6" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}

/** Um link da lista: miniatura redonda, título, texto e (opcional) um conteúdo extra abaixo. */
function LinkRow({ row }: { row: Row }) {
  return (
    <li className="lk__card">
      <a
        className="lk__item"
        href={row.href}
        {...(row.external ? ext(row.sponsored) : {})}
        data-track="click_link"
        data-track-label={row.track}
        data-track-location="links"
      >
        {row.thumb}
        <span className="lk__text">
          <strong>{row.title}</strong>
          {row.text && <span>{row.text}</span>}
        </span>
        <Arrow />
      </a>
      {row.extra}
    </li>
  );
}

export default function LinksView({
  settings,
  course,
  videos = [],
}: {
  settings: SiteSettingsData;
  course?: Course;
  videos?: YouTubeVideo[];
}) {
  const { spresenter } = settings;
  const onSale = Boolean(course && hasPrice(course) && course.priceFrom && course.priceFrom > course.price);
  const courseHref = course ? `${MAIN_SITE_URL}/formacoes/${course.id}?${FROM_BIO}&utm_campaign=formacao` : "";

  const youtube: Row = {
    title: "YouTube · Culto em Off",
    text: "Reviews e aulas gratuitas para voluntários de igrejas",
    href: settings.social.youtube,
    track: "YouTube",
    thumb: <IconThumb kind="youtube" />,
    external: true,
    extra:
      videos.length > 0 ? (
        <ul className="lk__videos" aria-label="Vídeos mais recentes">
          {videos.slice(0, 3).map((v) => (
            <li key={v.id}>
              <a href={v.url} {...ext()} data-track="click_link" data-track-label={`Vídeo: ${v.title}`} data-track-location="links">
                <Image src={v.thumbnail} alt="" width={320} height={180} sizes="(min-width: 600px) 170px, 30vw" />
                <span>{v.title}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : undefined,
  };

  const rows: Row[] = [
    youtube,
    {
      title: "Voluts",
      text: "App para líderes de ministérios de igrejas",
      href: settings.voluts.url,
      track: "Voluts",
      thumb: <Thumb src={THUMBS.voluts} />,
      sponsored: true,
      external: true,
      extra: <p className="lk__note">Teste grátis na sua igreja</p>,
    },
    {
      title: "SPresenter Pro",
      text: "Software de projeção para igrejas, com NDI",
      href: spresenter.url,
      track: "SPresenter",
      thumb: <Thumb src={THUMBS.spresenter} />,
      sponsored: true,
      external: true,
      extra: spresenter.coupon ? (
        <div className="lk__voucher" aria-label="Cupom Culto em Off">
          <div className="lk__voucher-info">
            <p className="lk__voucher-label">Cupom Culto em Off</p>
            {spresenter.discount && <p className="lk__voucher-benefit">{spresenter.discount}</p>}
          </div>
          <div className="lk__voucher-code">
            <code>{spresenter.coupon}</code>
            <CopyCouponButton code={spresenter.coupon} />
          </div>
        </div>
      ) : undefined,
    },
    {
      title: "Site do Culto em Off",
      text: "Downloads gratuitos, blog e formações",
      href: `${MAIN_SITE_URL}/?${FROM_BIO}`,
      track: "Site",
      thumb: <LogoThumb />,
    },
    {
      title: "Produtos em oferta",
      text: "Equipamentos e ferramentas com desconto, escolhidos pelo Culto em Off",
      href: `${MAIN_SITE_URL}/ofertas?${FROM_BIO}`,
      track: "Produtos em oferta",
      thumb: <IconThumb kind="ofertas" />,
    },
    {
      title: "Câmeras PTZ e controles",
      text: "Loja da Dorn",
      href: settings.dorn.url,
      track: "Loja da Dorn",
      thumb: <Thumb src={THUMBS.dorn} />,
      sponsored: true,
      external: true,
    },
  ];

  const socials = [
    { key: "instagram" as const, label: "Instagram", href: settings.social.instagram },
    { key: "youtube" as const, label: "YouTube", href: settings.social.youtube },
    { key: "tiktok" as const, label: "TikTok", href: settings.social.tiktok },
    { key: "facebook" as const, label: "Facebook", href: FACEBOOK_URL },
  ].filter((s) => s.href);

  return (
    <main id="conteudo" className="lk" tabIndex={-1}>
      <div className="lk__inner">
        <header className="lk__head">
          <span className="lk__logo">
            <Image src={LOGO_SRC} alt={SITE_NAME} width={192} height={192} sizes="96px" priority />
          </span>
          <h1 className="lk__name">{SITE_NAME}</h1>
          <p className="lk__bio">Tudo sobre os bastidores audiovisuais das igrejas</p>
          <p className="lk__topics">Reaper · SPresenter · Holyrics · NDI · OBS Studio · grandMA2 · DMX · Transmissões · Painel de LED · Voluts</p>
          <ul className="lk__social" aria-label="Redes sociais">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  {...ext()}
                  aria-label={`${s.label} (abre em nova aba)`}
                  data-track="click_social"
                  data-track-label={s.label}
                  data-track-location="links"
                >
                  <SocialIcon name={s.key} />
                </a>
              </li>
            ))}
          </ul>
        </header>

        {/* formação em destaque */}
        {course && (
          <a
            className="lk__feature"
            href={courseHref}
            data-track="click_link"
            data-track-label={`Formação ${course.title}`}
            data-track-location="links"
          >
            <span className="lk__feature-media">
              <Image
                src={THUMBS.formacao}
                alt="Diagrama da cabine técnica na mesma rede: internet, roteador, switch PoE, câmeras PTZ, mesa digital, PCs e Wi-Fi"
                width={640}
                height={480}
                sizes="(min-width: 600px) 528px, 100vw"
                priority
              />
              {onSale && <span className="lk__sale">Desconto de lançamento</span>}
            </span>
            <span className="lk__feature-body">
              <span className="lk__kicker">Formação</span>
              <strong>{course.title}</strong>
              <span>
                IP, DHCP, switch, roteador e Wi-Fi explicados do zero, com exemplos da cabine técnica da igreja: câmeras PTZ,
                NDI, OBS e mesa digital funcionando na mesma rede.
              </span>
              <span className="lk__feature-cta">
                Saiba mais
                <Arrow />
              </span>
            </span>
          </a>
        )}

        <ul className="lk__list">
          {rows.map((r) => (
            <LinkRow key={r.title} row={r} />
          ))}
        </ul>

        <footer className="lk__foot">
          <p>Alguns links são de parceiros ou afiliados: o Culto em Off pode receber uma comissão, sem custo extra para você.</p>
          <Link href={`${MAIN_SITE_URL}/privacidade`} prefetch={false}>
            Política de privacidade
          </Link>
        </footer>
      </div>
    </main>
  );
}
