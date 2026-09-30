"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/components/analytics/track";

/** Copia o cupom para a área de transferência e mostra "Copiado!" (sem alert). */
export default function CopyCouponButton({ code }: { code: string }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const flash = (next: "copied" | "manual") => {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2400);
  };

  const fallbackCopy = () => {
    const input = document.createElement("textarea");
    input.value = code;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(input);
    return ok;
  };

  const onClick = async () => {
    track("copy_coupon", { label: code });
    try {
      await navigator.clipboard.writeText(code);
      flash("copied");
    } catch {
      flash(fallbackCopy() ? "copied" : "manual");
    }
  };

  return (
    <>
      <button type="button" className={`coupon__copy${state === "copied" ? " is-copied" : ""}`} onClick={onClick}>
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          {state === "copied" ? (
            <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
              <rect x="7" y="7" width="10" height="10" rx="2" />
              <path d="M13 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" />
            </g>
          )}
        </svg>
        <span>{state === "copied" ? "Copiado!" : "Copiar cupom"}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? `Cupom ${code} copiado.` : state === "manual" ? `Não foi possível copiar. Selecione o código ${code}.` : ""}
      </span>
    </>
  );
}
