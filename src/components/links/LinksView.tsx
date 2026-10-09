import Image from "next/image";
import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import { hasPrice, type Course } from "@/config/courses";
import { FACEBOOK_URL, LOGO_SRC, MAIN_SITE_URL, SITE_NAME, type SiteSettingsData } from "@/config/site";
import "./links.css";

/** Marca de origem nos links do próprio site (aparece no Analytics e segue até a Hotmart). */
const FROM_BIO = "utm_source=links&utm_medium=bio";

/** Link afiliado do Mercado Livre (o mesmo do Linktree). */
const MERCADO_LIVRE_URL = "https://meli.la/1f2YSrB";

type Item = {
  title: string;
  text?: string;
  href: string;
  tag?: string;
  track: string;
  highlight?: boolean;
  external?: boolean;
};

export default function LinksView({ settings, course }: { settings: SiteSettingsData; course?: Course }) {
  const items: Item[] = [];
  if (course) {
    items.push({
      title: `Formação ${course.title}`,
      text: course.status === "inscricoes-abertas" && hasPrice(course) ? "Inscrições abertas · preço especial de lançamento" : course.tagline,
      href: `${MAIN_SITE_URL}/formacoes/${course.id}?${FROM_BIO}&utm_campaign=formacao`,
      tag: "Formação",
      track: "Formação Redes para Igrejas",
      highlight: true,
    });
  }
  items.push(
    {
      title: "YouTube · vídeos completos",
      href: settings.social.youtube,
      track: "YouTube",
      external: true,
    },
    {
      title: "Voluts",
      text: "App para líderes de ministérios de igrejas",
      href: settings.voluts.url,
      tag: "Parceiro",
      track: "Voluts",
      external: true,
    },
    {
      title: "SPresenter Pro",
      text: settings.spresenter.coupon ? `Use o cupom ${settings.spresenter.coupon} e ganhe desconto` : undefined,
      href: settings.spresenter.url,
      tag: "Parceiro",
      track: "SPresenter",
      external: true,
    },
    {
      title: "Produtos recomendados",
      text: "Lista no Mercado Livre",
      href: MERCADO_LIVRE_URL,
      tag: "Afiliado",
      track: "Mercado Livre",
      external: true,
    },
    {
      title: "Câmeras PTZ e controles",
      text: "Loja da Dorn",
      href: settings.dorn.url,
      tag: "Parceiro",
      track: "Loja da Dorn",
      external: true,
    },
    {
      title: "Site do Culto em Off",
      text: "Downloads gratuitos, blog e produtos em oferta",
      href: `${MAIN_SITE_URL}/?${FROM_BIO}`,
      track: "Site",
    },
  );

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
          <Image src={LOGO_SRC} alt={SITE_NAME} width={96} height={96} className="lk__logo" priority />
          <h1 className="lk__name">{SITE_NAME}</h1>
          <p className="lk__bio">Tudo sobre os bastidores audiovisuais das igrejas</p>
          <p className="lk__topics">Reaper · SPresenter · Holyrics · NDI · OBS Studio · grandMA2 · DMX · Transmissões · Painel de LED · Voluts</p>
          <ul className="lk__social" aria-label="Redes sociais">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
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

        <ul className="lk__list">
          {items.map((it) => (
            <li key={it.title}>
              <a
                className={`lk__item${it.highlight ? " lk__item--hi" : ""}`}
                href={it.href}
                {...(it.external ? { target: "_blank", rel: it.tag === "Parceiro" || it.tag === "Afiliado" ? "noopener noreferrer sponsored" : "noopener noreferrer" } : {})}
                data-track="click_link"
                data-track-label={it.track}
                data-track-location="links"
              >
                <span className="lk__text">
                  {it.tag && <span className="lk__tag">{it.tag}</span>}
                  <strong>{it.title}</strong>
                  {it.text && <span>{it.text}</span>}
                </span>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
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
