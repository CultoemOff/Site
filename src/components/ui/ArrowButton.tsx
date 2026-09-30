import Link from "next/link";
import type { ReactNode } from "react";
import "./button.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  /** evento de analytics disparado no clique (ver components/analytics/Analytics.tsx) */
  track?: { event: string; label?: string };
};

/** Link com aparência de botão e seta animada. Rotas internas ("/...") usam next/link. */
export default function ArrowButton({ href, children, variant = "primary", external = false, track }: Props) {
  const className = `btn btn--${variant}`;
  const data = track ? { "data-track": track.event, "data-track-label": track.label } : {};
  const inner = (
    <>
      <span>{children}</span>
      <svg className="btn__arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </>
  );

  if (!external && href.startsWith("/")) {
    return (
      <Link href={href} className={className} {...data}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...data} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}
