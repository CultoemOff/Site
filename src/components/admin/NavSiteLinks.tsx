import Link from "next/link";

const LINKS = [
  { href: "/", label: "Página inicial" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/blog", label: "Blog" },
];

/** Atalhos no fim do menu lateral do painel: abrem o site em outra aba. */
export default function NavSiteLinks() {
  return (
    <div className="ceo-navlinks">
      <span className="ceo-navlinks__label">Abrir o site</span>
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" prefetch={false}>
          {link.label} <span aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}
