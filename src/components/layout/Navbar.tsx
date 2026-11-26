"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LOGO_H_SIZE, LOGO_H_SRC, NAV_LINKS, SITE_NAME } from "@/config/site";
import "./navbar.css";

/**
 * Menu principal. `base` só é usado quando a página está em outro endereço (ex.: ofertas.<domínio>):
 * aí os links apontam para o site principal em vez do endereço atual.
 */
export default function Navbar({ base }: { base?: string } = {}) {
  const prefix = base && base !== "/" ? base.replace(/\/$/, "") : "";
  const to = (href: string) => `${prefix}${href}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled || open ? " nav--solid" : ""}`}>
      <div className="nav__inner">
        <Link href={to("/")} className="nav__brand" aria-label={`${SITE_NAME} — início`}>
          <Image className="nav__logo-h" src={LOGO_H_SRC} alt="" width={LOGO_H_SIZE.width} height={LOGO_H_SIZE.height} priority />
        </Link>

        <nav aria-label="Principal" className="nav__links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={to(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href={to("/#formacoes")} className="nav__cta">
          Explorar formações
        </Link>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <nav id="menu-mobile" aria-label="Menu" className={`nav__mobile${open ? " is-open" : ""}`} hidden={!open}>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={to(l.href)} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href={to("/#formacoes")} className="nav__mobile-cta" onClick={() => setOpen(false)}>
          Explorar formações
        </Link>
      </nav>
    </header>
  );
}
