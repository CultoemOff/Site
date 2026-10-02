"use client";

import { useEffect, useState } from "react";

type Props = {
  /** data/hora em que a promoção termina (ISO, com fuso: 2026-11-30T23:59:59-03:00) */
  endsAt: string;
  /** "boxes" = blocos grandes; "inline" = texto corrido */
  variant?: "boxes" | "inline";
  className?: string;
};

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
const pad = (n: number) => String(n).padStart(2, "0");

/** Contagem regressiva até uma data real (não reinicia por visitante). Some quando o prazo acaba. */
export default function Countdown({ endsAt, variant = "boxes", className = "" }: Props) {
  const end = Date.parse(endsAt);
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(end - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [end]);

  if (left !== null && left <= 0) return null;
  const p = left === null ? null : parts(left);
  const label = p ? `Termina em ${p.d} dias, ${p.h} horas, ${p.m} minutos e ${p.s} segundos` : "Calculando o tempo restante";

  if (variant === "inline") {
    return (
      <span className={`cd-inline ${className}`} role="timer" aria-label={label}>
        {p ? `${p.d}d ${pad(p.h)}h ${pad(p.m)}m ${pad(p.s)}s` : "--d --h --m --s"}
      </span>
    );
  }
  const cells: [string, string][] = [
    [p ? String(p.d) : "--", "dias"],
    [p ? pad(p.h) : "--", "horas"],
    [p ? pad(p.m) : "--", "min"],
    [p ? pad(p.s) : "--", "seg"],
  ];
  return (
    <div className={`cd-boxes ${className}`} role="timer" aria-label={label}>
      {cells.map(([v, l]) => (
        <span key={l} aria-hidden="true">
          <strong>{v}</strong>
          <small>{l}</small>
        </span>
      ))}
    </div>
  );
}
