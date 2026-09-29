import Link from "next/link";
import type { ReactNode } from "react";
import "./button.css";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
};

/** Link com aparência de botão e seta animada. Rotas internas ("/...") usam next/link. */
export default function ArrowButton({ href, children, variant = "primary", external = false }: Props) {
  const className = `btn btn--${variant}`;
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
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}
