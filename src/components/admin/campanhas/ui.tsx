"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { Signal } from "@/lib/campanhas/metrics";

/** largura atual de um elemento (gráficos responsivos) */
export function useWidth<T extends HTMLElement>(): [{ current: T | null }, number] {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(Math.floor(entries[0].contentRect.width)));
    ro.observe(el);
    setW(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export function Card({ title, kicker, aside, children, className = "", id }: { title?: ReactNode; kicker?: string; aside?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section className={`cmp-card ${className}`} id={id}>
      {(title || kicker || aside) && (
        <header className="cmp-card__head">
          <div>
            {kicker && <p className="cmp-kicker">{kicker}</p>}
            {title && <h2 className="cmp-card__title">{title}</h2>}
          </div>
          {aside && <div className="cmp-card__aside">{aside}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

const SIGNAL_ICON: Record<Signal["code"], string> = {
  escalar: "M4 17l6-6 4 4 7-7M15 8h6v6",
  manter: "M5 12h14",
  revisar: "M12 8v5m0 3.5v.5M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  pausar: "M9 5v14M15 5v14",
  aguardar: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

export function SignalBadge({ signal, size = "sm" }: { signal: Signal; size?: "sm" | "lg" }) {
  return (
    <span className={`cmp-signal cmp-signal--${signal.code} cmp-signal--${size}`} title={`${signal.reason} · base: ${signal.basis}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={SIGNAL_ICON[signal.code]} />
      </svg>
      {signal.label}
    </span>
  );
}

/** variação vs. período anterior; `good` diz se subir é bom (true), ruim (false) ou neutro (null) */
export function Delta({ cur, prev, good, mode = "pct" }: { cur: number | null; prev: number | null; good: boolean | null; mode?: "pct" | "pp" }) {
  if (cur === null || prev === null || !Number.isFinite(cur) || !Number.isFinite(prev)) return <span className="cmp-delta cmp-delta--na">sem base</span>;
  if (prev === 0 && cur === 0) return <span className="cmp-delta cmp-delta--flat">= anterior</span>;
  let txt: string;
  let diff: number;
  if (mode === "pp") {
    diff = (cur - prev) * 100;
    txt = `${diff >= 0 ? "+" : ""}${diff.toFixed(1).replace(".", ",")} p.p.`;
  } else {
    if (prev === 0) return <span className={`cmp-delta ${good === null ? "cmp-delta--flat" : good ? "cmp-delta--up" : "cmp-delta--down"}`}>novo</span>;
    diff = (cur - prev) / Math.abs(prev);
    txt = `${diff >= 0 ? "+" : ""}${(diff * 100).toFixed(0)}%`;
  }
  const better = good === null || Math.abs(diff) < 0.0005 ? null : diff > 0 === good;
  return (
    <span className={`cmp-delta ${better === null ? "cmp-delta--flat" : better ? "cmp-delta--up" : "cmp-delta--down"}`}>
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d={diff >= 0 ? "M6 2 10 8H2z" : "M6 10 2 4h8z"} />
      </svg>
      {txt}
    </span>
  );
}

/** botões de alternância (períodos, abas) */
export function Segmented<T extends string>({ options, value, onChange, label }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="cmp-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className={o.id === value ? "is-on" : ""} aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** seleção múltipla compacta (filtros) */
export function MultiSelect({ label, options, value, onChange, all = "Todos" }: { label: string; options: { id: string; label: string; hint?: string }[]; value: string[]; onChange: (v: string[]) => void; all?: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  const summary = !value.length ? all : value.length === 1 ? (options.find((o) => o.id === value[0])?.label ?? value[0]) : `${value.length} selecionados`;
  return (
    <div className={`cmp-ms${value.length ? " is-active" : ""}`} ref={box}>
      <button type="button" className="cmp-ms__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span className="cmp-ms__label">{label}</span>
        <span className="cmp-ms__value">{summary}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="m3 4.5 3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div className="cmp-ms__pop" id={id} role="listbox" aria-multiselectable="true">
          <button type="button" className="cmp-ms__clear" onClick={() => onChange([])}>
            {all}
          </button>
          {options.length === 0 && <p className="cmp-ms__empty">Sem opções no período</p>}
          {options.map((o) => {
            const on = value.includes(o.id);
            return (
              <label key={o.id} className={`cmp-ms__opt${on ? " is-on" : ""}`}>
                <input type="checkbox" checked={on} onChange={() => onChange(on ? value.filter((v) => v !== o.id) : [...value, o.id])} />
                <span className="cmp-ms__check" aria-hidden="true" />
                <span className="cmp-ms__text">
                  {o.label}
                  {o.hint && <small>{o.hint}</small>}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="cmp-empty">{children}</p>;
}
