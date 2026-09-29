"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LOGO_SRC, NAV_LINKS, SITE_NAME } from "@/config/site";
import "./navbar.css";

export default function Navbar() {
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
        <Link href="/" className="nav__brand" aria-label={`${SITE_NAME} — início`}>
          <Image src={LOGO_SRC} alt="" width={40} height={40} priority />
          <span className="nav__wordmark">
            Culto em <strong>Off</strong>
          </span>
        </Link>

        <nav aria-label="Principal" className="nav__links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#formacoes" className="nav__cta">
          Explorar formações
        </a>

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
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#formacoes" className="nav__mobile-cta" onClick={() => setOpen(false)}>
          Explorar formações
        </a>
      </nav>
    </header>
  );
}
