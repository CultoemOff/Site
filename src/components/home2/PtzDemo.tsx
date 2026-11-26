"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Demonstração do PTZ Control Web na home2: réplica leve do painel (HTML/CSS, sem vídeo nem GIF)
 * com um cursor "operando": as setas e o zoom acendem em azul-claro ao toque e o preset chamado fica vermelho (no ar).
 * Anda só quando está na tela e a aba está visível; com "reduzir movimento" fica parado num estado de exemplo.
 */

const CAMERAS = ["Central", "Lateral", "Púlpito", "Coral"];
const PRESETS = [
  "Igreja Geral",
  "Pastor",
  "Pastor Fechado",
  "Louvor",
  "Teclado",
  "Bateria",
  "Violão",
  "Guitarra",
  "Baixo",
  "Vozes",
  "Solos",
  "Membros",
  "Batismo",
  "Santa Ceia",
  "Coral",
  "Preset 16",
];
const PAD = ["ul", "up", "ur", "left", "home", "right", "dl", "down", "dr"] as const;
const PAD_ICON: Record<(typeof PAD)[number], string> = {
  ul: "M14 14L6 6M6 6v6M6 6h6",
  up: "M10 16V4M10 4l-5 5M10 4l5 5",
  ur: "M6 14l8-8M14 6v6M14 6H8",
  left: "M16 10H4M4 10l5-5M4 10l5 5",
  home: "M4 10l6-5 6 5M6 9v6h8V9",
  right: "M4 10h12M16 10l-5-5M16 10l-5 5",
  dl: "M14 6l-8 8M6 14V8M6 14h6",
  down: "M10 4v12M10 16l-5-5M10 16l5-5",
  dr: "M6 6l8 8M14 14V8M14 14H8",
};
const ZOOM = [
  { id: "zout", label: "Zoom −", d: "M4 9a5 5 0 1010 0 5 5 0 10-10 0M13 13l4 4M7 9h4" },
  { id: "zin", label: "Zoom +", d: "M4 9a5 5 0 1010 0 5 5 0 10-10 0M13 13l4 4M7 9h4M9 7v4" },
  { id: "focus", label: "Foco automático", d: "M4 7V4h3M13 4h3v3M16 13v3h-3M7 16H4v-3M8 10h4" },
  { id: "fnear", label: "Foco perto", d: "M13 5l-6 5 6 5" },
  { id: "ffar", label: "Foco longe", d: "M7 5l6 5-6 5" },
];

/** roteiro: o que o "operador" faz, em ordem (volta ao começo no fim) */
type Step = { kind: "tab"; i: number } | { kind: "btn"; id: string } | { kind: "preset"; i: number };
const SCRIPT: Step[] = [
  { kind: "preset", i: 0 },
  { kind: "btn", id: "up" },
  { kind: "btn", id: "right" },
  { kind: "btn", id: "zin" },
  { kind: "preset", i: 1 },
  { kind: "tab", i: 1 },
  { kind: "btn", id: "left" },
  { kind: "preset", i: 3 },
  { kind: "tab", i: 2 },
  { kind: "btn", id: "zout" },
  { kind: "btn", id: "down" },
  { kind: "preset", i: 2 },
  { kind: "tab", i: 0 },
  { kind: "preset", i: 13 },
];

const BASE_W = 640;

export default function PtzDemo() {
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const [tab, setTab] = useState(0);
  const [live, setLive] = useState(1);
  const [press, setPress] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [natH, setNatH] = useState(300);

  // painel desenhado em 640px e redimensionado para caber no espaço (fica igual no celular)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setScale(Math.min(1, e.contentRect.width / BASE_W));
      if (panel.current) setNatH(panel.current.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = panel.current;
    const cur = cursor.current;
    if (!root || !cur) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let step = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    const wait = (ms: number) => new Promise<void>((r) => (timer = setTimeout(r, ms)));

    const target = (s: Step) =>
      root.querySelector<HTMLElement>(s.kind === "tab" ? `[data-tab="${s.i}"]` : s.kind === "preset" ? `[data-preset="${s.i}"]` : `[data-btn="${s.id}"]`);

    const moveTo = (el: HTMLElement) => {
      const r = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const k = r.width / BASE_W || 1;
      const x = (b.left - r.left + b.width * 0.55) / k;
      const y = (b.top - r.top + b.height * 0.6) / k;
      cur.style.transform = `translate(${x}px, ${y}px)`;
    };

    const loop = async () => {
      if (running) return;
      running = true;
      cur.dataset.on = "";
      while (visible && document.visibilityState === "visible") {
        const s = SCRIPT[step % SCRIPT.length];
        const el = target(s);
        if (el) {
          moveTo(el);
          await wait(620);
          if (!visible) break;
          const key = s.kind === "btn" ? s.id : `${s.kind}-${s.i}`;
          setPress(key);
          cur.dataset.down = "";
          if (s.kind === "tab") setTab(s.i);
          if (s.kind === "preset") setLive(s.i);
          await wait(240);
          delete cur.dataset.down;
          await wait(s.kind === "btn" ? 260 : 120);
          setPress(null);
          await wait(s.kind === "preset" ? 900 : 380);
        }
        step++;
      }
      running = false;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) loop();
      },
      { threshold: 0.35 },
    );
    io.observe(root);
    const onVis = () => visible && document.visibilityState === "visible" && loop();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      visible = false;
      if (timer) clearTimeout(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const pressed = (key: string) => (press === key ? " is-press" : "");

  return (
    <div ref={wrap} className="ptzd" style={{ height: `${Math.ceil(natH * scale)}px` }} aria-hidden="true">
      <div ref={panel} className="ptzd__panel" style={{ transform: `scale(${scale})` }}>
        <div className="ptzd__top">
          <strong>PTZ CONTROL WEB</strong>
          <span className="ptzd__icons">
            <i />
            <i />
            <i />
          </span>
        </div>

        <div className="ptzd__box ptzd__cams">
          <span className="ptzd__label">Câmeras</span>
          <div className="ptzd__tabs">
            {CAMERAS.map((c, i) => (
              <span key={c} data-tab={i} className={`ptzd__tab${tab === i ? " is-on" : ""}${pressed(`tab-${i}`)}`}>
                <b />
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="ptzd__grid">
          <div className="ptzd__box ptzd__ctrl">
            <div className="ptzd__pad">
              {PAD.map((p) => (
                <span key={p} data-btn={p} className={`ptzd__key${pressed(p)}`}>
                  <svg viewBox="0 0 20 20">
                    <path d={PAD_ICON[p]} />
                  </svg>
                </span>
              ))}
            </div>
            <div className="ptzd__speed">
              <span>Velocidade</span>
              <span className="ptzd__track">
                <span />
              </span>
            </div>
            <div className="ptzd__zoom">
              {ZOOM.map((z) => (
                <span key={z.id} data-btn={z.id} className={`ptzd__key${pressed(z.id)}`}>
                  <svg viewBox="0 0 20 20">
                    <path d={z.d} />
                  </svg>
                </span>
              ))}
            </div>
          </div>

          <div className="ptzd__box ptzd__presets">
            <span className="ptzd__label">
              Presets <em>· {CAMERAS[tab]}</em>
            </span>
            <div className="ptzd__pgrid">
              {PRESETS.map((p, i) => (
                <span key={p} data-preset={i} className={`ptzd__preset${live === i ? " is-live" : ""}${pressed(`preset-${i}`)}`}>
                  <strong>{p}</strong>
                  <small>#{String(i + 1).padStart(2, "0")}</small>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* cursor do "operador" */}
        <span ref={cursor} className="ptzd__cursor">
          <svg viewBox="0 0 24 24">
            <path d="M5 3l14 8-6.2 1.6L10 19z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
