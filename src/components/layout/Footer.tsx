import Image from "next/image";
import Link from "next/link";
import { LOGO_SRC, NAV_LINKS, SITE_NAME, SITE_TAGLINE, SOCIAL_LINKS } from "@/config/site";
import "./footer.css";

export default function Footer() {
  const socials = SOCIAL_LINKS.filter((s) => s.href);
  const year = new Date().getFullYear();
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
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
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
        <p className="footer__signal" aria-hidden="true">
          <span />
          SINAL OK
        </p>
      </div>
    </footer>
  );
}
