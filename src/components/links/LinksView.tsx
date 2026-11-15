import Image from "next/image";
import Link from "next/link";
import CopyCouponButton from "@/components/sections/partners/CopyCouponButton";
import SocialIcon from "@/components/ui/SocialIcon";
import { formatInstallments, formatPrice, type Course } from "@/config/courses";
import { LOGO_SRC, MAIN_SITE_URL, SITE_NAME, type SiteSettingsData } from "@/config/site";
import { resolvePrice } from "@/lib/pricing";
import type { YouTubeVideo } from "@/lib/youtube";
import LinksTracking from "./LinksTracking";
import "./links.css";

/** Marca de origem nos links do próprio site (aparece no Analytics e segue até a Hotmart). */
const FROM_BIO = "utm_source=links&utm_medium=bio";

/** Miniaturas redondas de cada link (logos enviados pelo Jonas). */
const THUMBS = {
  voluts: "/images/links/voluts.png",
  spresenter: "/images/links/spresenter.png",
};

/** Cards das formações em destaque (subtítulo e texto de cada uma). Formações fora desta lista não aparecem.
 *  Sem miniatura desde 15/11/2026 (pedido do Jonas): título, "Formação" e subtítulo em destaque. */
const FEATURES: Record<string, { subtitle: string; text: string }> = {
  "culto-ao-vivo-com-excelencia": {
    subtitle: "Curso de OBS Studio para igrejas",
    text: "A live do culto do zero ao avançado: câmeras, conexões, NDI, áudio da live, cenas, letras e controle PTZ, na realidade da igreja pequena e média.",
  },
  "redes-para-igrejas": {
    subtitle: "Roteador, Switch, IP, NDI na prática",
    text: "Do zero, sem precisar ser de TI: Wi-Fi que não cai no culto e câmeras, mesa digital e PC da live funcionando juntos na rede da igreja.",
  },
};

/** Card grande de uma formação. */
function FeatureCard({ course, position }: { course: Course; position: number }) {
  const f = FEATURES[course.id];
  if (!f) return null;
  const { price, priceFrom, off, installments } = resolvePrice(course);
  // "R$ 67" em vez de "R$ 67,00" quando o valor é redondo
  const money = (v: number) => (Number.isInteger(v) ? `R$ ${v}` : formatPrice(v));
  return (
    <a
      className="lk__feature"
      href={`${MAIN_SITE_URL}/formacoes/${course.id}?${FROM_BIO}&utm_campaign=formacao`}
      data-track="click_link"
      data-track-label={`Formação ${course.title}`}
      data-track-location="links"
      data-track-position={position}
    >
      <span className="lk__feature-body">
        <span className="lk__kicker">Formação</span>
        <strong className="lk__feature-title">{course.title}</strong>
        <span className="lk__feature-sub">{f.subtitle}</span>
        <span className="lk__feature-text">{f.text}</span>
        <span className="lk__feature-actions">
          <span className="lk__feature-cta">
            Saiba mais
            <Arrow />
          </span>
          {/* preço atual ao lado do botão: de/por, desconto e parcelas (some o "de" quando a promoção acaba) */}
          {price > 0 && (
            <span className="lk__price">
              {priceFrom && (
                <span className="lk__price-from">
                  de <s>{money(priceFrom)}</s>
                  {off > 0 && <b className="lk__price-off">-{off}%</b>}
                </span>
              )}
              <strong className="lk__price-now">{money(price)}</strong>
              {installments && <span className="lk__price-parcel">ou {formatInstallments(installments)}</span>}
            </span>
          )}
        </span>
      </span>
    </a>
  );
}

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
function LinkRow({ row, position }: { row: Row; position: number }) {
  return (
    <li className="lk__card">
      <a
        className="lk__item"
        href={row.href}
        {...(row.external ? ext(row.sponsored) : {})}
        data-track="click_link"
        data-track-label={row.track}
        data-track-location="links"
        data-track-position={position}
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
  courses = [],
  videos = [],
}: {
  settings: SiteSettingsData;
  /** formações em destaque, na ordem em que aparecem (só as que têm card em FEATURES) */
  courses?: Course[];
  videos?: YouTubeVideo[];
}) {
  const { spresenter } = settings;
  const featured = courses.filter((c) => FEATURES[c.id]);

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
              <a href={v.url} {...ext()} data-track="click_link" data-track-label={`Vídeo: ${v.title}`} data-track-location="links" data-track-position={1}>
                <Image src={v.thumbnail} alt="" width={320} height={180} sizes="(min-width: 600px) 170px, 30vw" />
                <span>{v.title}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : undefined,
  };

  const rows: Row[] = [
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
  ];

  const socials = [
    { key: "instagram" as const, label: "Instagram", href: settings.social.instagram },
    { key: "youtube" as const, label: "YouTube", href: settings.social.youtube },
    { key: "tiktok" as const, label: "TikTok", href: settings.social.tiktok },
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

        {/* 1º YouTube, depois as formações em destaque (Culto ao Vivo, Redes), depois os parceiros */}
        <ul className="lk__list">
          <LinkRow row={youtube} position={1} />
        </ul>

        {featured.map((c, i) => (
          <FeatureCard key={c.id} course={c} position={i + 2} />
        ))}

        <ul className="lk__list">
          {rows.map((r, i) => (
            <LinkRow key={r.title} row={r} position={i + 2 + featured.length} />
          ))}
        </ul>

        <footer className="lk__foot">
          <p>Alguns links são de parceiros ou afiliados: o Culto em Off pode receber uma comissão, sem custo extra para você.</p>
          <Link href={`${MAIN_SITE_URL}/privacidade`} prefetch={false}>
            Política de privacidade
          </Link>
        </footer>
      </div>
      <LinksTracking />
    </main>
  );
}
