import Link from "next/link";

/** Atalho "Campanhas" no menu lateral do painel (abre /admin/campanhas). */
export default function NavCampanhas() {
  return (
    <div className="ceo-navlinks cmp-navlink">
      <span className="ceo-navlinks__label">Marketing</span>
      <Link href="/admin/campanhas" prefetch={false}>
        Campanhas <span aria-hidden="true">· Meta × Hotmart</span>
      </Link>
    </div>
  );
}
