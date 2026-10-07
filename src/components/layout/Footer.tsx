import Image from "next/image";
import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import { LOGO_SRC, NAV_LINKS, SITE_NAME, SITE_TAGLINE, type SiteSettingsData } from "@/config/site";
import ConsentLink from "@/components/analytics/ConsentLink";
import { safeGaId, safePixelId } from "@/lib/seo";
import "./footer.css";

/**
 * Rodapé do site. `minimal` = versão enxuta da página de venda: só a marca e os direitos,
 * sem links de navegação nem redes sociais, para a pessoa não sair antes da oferta.
 */
export default function Footer({ settings, minimal = false }: { settings: SiteSettingsData; minimal?: boolean }) {
  const socials = (
    [
      { key: "youtube", label: "YouTube", href: settings.social.youtube },
      { key: "instagram", label: "Instagram", href: settings.social.instagram },
      { key: "tiktok", label: "TikTok", href: settings.social.tiktok },
    ] as const
  ).filter((s) => s.href);
  const year = new Date().getFullYear();
  const hasConsent = Boolean(safeGaId(settings.gaId) || safePixelId(settings.metaPixelId));

  if (minimal) {
    return (
      <footer className="footer footer--minimal">
        <div className="footer__bottom">
          <p className="footer__mark">
            <Image src={LOGO_SRC} alt="" width={28} height={28} />
            <span>
              © {year} {SITE_NAME}. Formação técnica para quem serve na igreja.
            </span>
          </p>
          {/* preferências de cookies continuam acessíveis: não é link de saída */}
          {hasConsent && (
            <div className="footer__legal">
              <ConsentLink />
            </div>
          )}
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link href="/" className="footer__logo" aria-label={`${SITE_NAME} — início`}>
            <Image src={LOGO_SRC} alt="" width={56} height={56} />
            <span>
              Culto em <strong>Off</strong>
            </span>
          </Link>
          <p>{SITE_TAGLINE}</p>
          {socials.length > 0 && (
            <ul className="footer__social" aria-label="Redes sociais">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (abre em nova aba)`} data-track="click_social" data-track-label={s.label}>
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="footer__col" aria-label="Rodapé">
          <p className="footer__title">Navegação</p>
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/formacoes">Todas as formações</Link>
            </li>
          </ul>
        </nav>

        {socials.length > 0 && (
          <div className="footer__col">
            <p className="footer__title">Acompanhe</p>
            <ul>
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" data-track="click_social" data-track-label={s.label}>
                    {s.label}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="footer__bottom">
        <p>
          © {year} {SITE_NAME}. Formação técnica para quem serve na igreja.
        </p>
        <div className="footer__legal">
          {hasConsent && <ConsentLink />}
          <p className="footer__signal" aria-hidden="true">
            <span />
            SINAL OK
          </p>
        </div>
      </div>
    </footer>
  );
}
