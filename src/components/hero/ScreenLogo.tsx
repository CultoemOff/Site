"use client";

import { useEffect, useRef } from "react";
import { LOGO_H_SRC } from "@/config/site";

/**
 * Logo animado no telão de LED do palco (animação "Logo Reveal" enviada pelo Jonas em 26/11/2026, adaptada).
 * - Fica por cima do desenho do palco, no retângulo do telão (coordenadas do viewBox 1600 × 900 em %),
 *   com grade de LED, brilho e o reflexo da luz do telão na parede; a luz do palco e a fumaça passam por cima.
 * - O reveal toca ao abrir a página e repete a cada 18 s; entre um e outro, as barras "tocam".
 * - Só anima com o topo na tela e a aba visível. Com "reduzir movimento" (ou sem JavaScript), mostra o logo parado.
 */

const W = 1800;
const H = 792;
const REPEAT = 18;
const BPM = 124;
const SRC = "/images/brand/telao";
const L = {
  text: { x: 695.6, y: 12.8, w: 1091, h: 713 },
  rings: { x: 16, y: 87.2, w: 728, h: 512 },
  cross: { x: 268.4, y: 231.2, w: 338, h: 546 },
};
const BARS = [
  [74.8, 638.4, 32, 85],
  [115.6, 572, 32, 125],
  [156.4, 600.8, 32, 96],
  [197.2, 503.6, 32, 174],
  [238, 557.6, 32, 100],
  [278.8, 471.2, 32, 263],
  [320, 564.8, 31, 103],
  [360.8, 514.8, 31, 178],
  [483.2, 503.6, 32, 178],
  [524, 528, 32, 103],
  [564.8, 461.6, 32, 263],
  [605.6, 538.4, 32, 126],
  [646.8, 518.8, 31, 174],
  [687.6, 499.2, 31, 163],
  [727.2, 474, 26, 140],
] as const;
const BG = (() => {
  const x0 = Math.min(...BARS.map((b) => b[0]));
  const y0 = Math.min(...BARS.map((b) => b[1]));
  const x1 = Math.max(...BARS.map((b) => b[0] + b[2]));
  const y1 = Math.max(...BARS.map((b) => b[1] + b[3]));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
})();

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const E = {
  outExpo: (p: number) => (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  inOutExpo: (p: number) => (p === 0 ? 0 : p === 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2),
  outBack: (p: number, s = 1.7) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2),
  inCubic: (p: number) => p * p * p,
  outCubic: (p: number) => 1 - Math.pow(1 - p, 3),
  inOutCubic: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
};

function music(t: number) {
  const beat = 60 / BPM;
  const ph = (t % beat) / beat;
  const n = Math.floor(t / beat) % 4;
  return { kick: Math.exp(-ph * 7), snare: n === 1 || n === 3 ? Math.exp(-ph * 10) : 0, hat: Math.exp(-(((t * 2) % beat) / beat) * 14) };
}

const box = (a: { x: number; y: number; w: number; h: number }): React.CSSProperties => ({ left: a.x, top: a.y, width: a.w, height: a.h });

export default function ScreenLogo() {
  const wrap = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const barsEl = useRef<HTMLDivElement>(null);
  const rings = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const spill = useRef<HTMLDivElement>(null);
  const shines = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const root = wrap.current;
    const lg = logo.current;
    if (!root || !lg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // cada barra "ouve" uma faixa do espectro (mesmos números da animação original)
    const bars = BARS.map((a, i) => {
      const r = (n: number) => {
        const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      return { f1: 2.1 + r(1) * 4.5, f2: 5 + r(2) * 7, ph: r(3) * 6.28, band: i / (BARS.length - 1), sm: 1 };
    });

    let K = 1,
      LX = 0,
      LY = 0,
      VW = 0,
      VH = 0;
    const layout = () => {
      VW = root.clientWidth;
      VH = root.clientHeight;
      K = Math.min((VW * 0.8) / W, (VH * 0.72) / H);
      LX = (VW - W * K) / 2;
      LY = (VH - H * K) / 2;
    };
    const ro = new ResizeObserver(layout);
    ro.observe(root);
    layout();

    let t0 = performance.now();
    let lastT = 0;
    let raf = 0;
    let running = false;
    let visible = true;

    const frame = () => {
      let t = (performance.now() - t0) / 1000;
      if (t > REPEAT) {
        t0 = performance.now();
        t = 0;
        lastT = 0;
      }
      const dt = clamp(t - lastT, 0, 0.1);
      lastT = t;

      // barras: cobrem o telão e descem para o lugar
      const gcx = LX + (BG.x + BG.w / 2) * K;
      const gcy = LY + (BG.y + BG.h / 2) * K;
      const sFull = Math.max((VW * 1.08) / (BG.w * K), (VH * 1.25) / (BG.h * K));
      const pDrop = E.inOutExpo(prog(t, 0.42, 1.18));
      const gs = lerp(sFull, 1, pDrop);
      const gdx = lerp(VW / 2 - gcx, 0, pDrop);
      const gdy = lerp(VH / 2 - gcy, 0, pDrop);
      const vel = Math.sin(Math.PI * prog(t, 0.42, 1.18));
      const bg = barsEl.current!;
      bg.style.transform = `translate(${gdx / K}px,${gdy / K}px) scale(${gs})`;
      bg.style.filter = vel > 0.02 ? `blur(${(vel * 2.2).toFixed(2)}px) brightness(${1 + vel * 0.25})` : "none";

      const m = music(t);
      const amp = lerp(1.0, 0.55, E.outCubic(prog(t, 0.9, 1.6)));
      bars.forEach((b, i) => {
        const el = barRefs.current[i];
        if (!el) return;
        const intro = E.outBack(prog(t, 0.02 + Math.abs(i - 7) * 0.018, 0.26 + Math.abs(i - 7) * 0.018), 2.2);
        const spec = 0.5 + 0.5 * Math.sin(t * b.f1 * 6.283 + b.ph) * Math.sin(t * b.f2 * 2.1 + b.ph * 1.7);
        const energy = m.kick * (1 - b.band) * 0.9 + m.snare * (0.35 + 0.4 * Math.sin(b.ph)) + m.hat * b.band * 0.5 + spec * 0.55;
        const target = clamp(1 + amp * (energy - 0.55), 0.28, 1.45);
        b.sm += (target - b.sm) * (1 - Math.exp(-dt / 0.031));
        el.style.transform = `scaleY(${Math.max(0.001, b.sm * intro).toFixed(4)})`;
        if (i === bars.length - 1) el.style.opacity = String(clamp(prog(t, 2.05, 2.35)));
      });

      // fone / anéis
      const pR = prog(t, 0.95, 1.75);
      const pulse = t > 1.9 ? 1 + 0.018 * m.kick : 1;
      const rg = rings.current!;
      rg.style.opacity = String(E.outCubic(prog(t, 0.95, 1.35)));
      rg.style.transform = `scale(${(lerp(0.35, 1, E.outBack(pR, 1.5)) * pulse).toFixed(4)}) rotate(${lerp(-40, 0, E.outExpo(pR)).toFixed(2)}deg)`;
      rg.style.filter = pR < 1 ? `blur(${lerp(10, 0, E.outCubic(pR)).toFixed(2)}px)` : "none";

      // cruz: vem grande e encaixa
      const pC = prog(t, 1.28, 1.82);
      const pB = prog(t, 1.82, 2.25);
      const cs = pC < 1 ? lerp(3.4, 1, E.inCubic(pC)) : 1 - 0.07 * Math.sin(pB * Math.PI) * (1 - pB);
      const cr = cross.current!;
      cr.style.opacity = String(E.outCubic(prog(t, 1.28, 1.5)));
      cr.style.transform = `scale(${cs.toFixed(4)})`;
      const glow = t >= 1.82 ? Math.exp(-(t - 1.82) * 5) : 0;
      cr.style.filter =
        pC < 1
          ? `blur(${lerp(14, 0, E.inCubic(pC)).toFixed(2)}px)`
          : glow > 0.01
            ? `brightness(${1 + glow * 0.9}) drop-shadow(0 0 ${(glow * 30).toFixed(1)}px rgba(90,190,255,${glow.toFixed(3)}))`
            : "none";

      // impacto: onda, clarão no telão e na parede, tremida
      const pW = prog(t, 1.82, 2.5);
      const cxL = L.cross.x + L.cross.w / 2;
      const cyL = L.cross.y + L.cross.h * 0.42;
      const wr = lerp(40, H * 1.5, E.outCubic(pW));
      const wv = wave.current!;
      wv.style.left = `${cxL - wr}px`;
      wv.style.top = `${cyL - wr}px`;
      wv.style.width = `${wr * 2}px`;
      wv.style.height = `${wr * 2}px`;
      wv.style.borderWidth = `${lerp(14, 1, pW)}px`;
      wv.style.opacity = String(t >= 1.82 ? (1 - pW) * 0.9 : 0);
      const fl = flash.current!;
      fl.style.setProperty("--fx", `${LX + cxL * K}px`);
      fl.style.setProperty("--fy", `${LY + cyL * K}px`);
      const fo = t >= 1.82 ? Math.exp(-(t - 1.82) * 7) * 0.9 : 0;
      fl.style.opacity = String(fo);
      // a luz do telão bate na parede em volta: acompanha o clarão e o grave
      if (spill.current) spill.current.style.opacity = String(0.35 + fo * 0.65 + (t > 2 ? m.kick * 0.12 : 0));
      const sh = t >= 1.82 ? Math.exp(-(t - 1.82) * 12) * 14 : 0;
      const shx = sh * Math.sin(t * 95);
      const shy = sh * Math.cos(t * 120) * 0.7;

      // texto: entra deslizando
      const pT = prog(t, 1.95, 2.75);
      const eT = E.outExpo(pT);
      const tx = text.current!;
      tx.style.opacity = String(E.outCubic(prog(t, 1.95, 2.2)));
      tx.style.transform = `translateX(${lerp(W * 0.22, 0, eT)}px) skewX(${lerp(-18, 0, eT)}deg) scale(${lerp(0.9, 1, eT)})`;
      tx.style.clipPath = `inset(-20% ${lerp(100, 0, E.outCubic(prog(t, 1.95, 2.45)))}% -20% -40%)`;
      tx.style.filter = pT < 1 ? `blur(${lerp(8, 0, eT).toFixed(2)}px)` : "none";

      // brilho que atravessa
      const pS = E.inOutCubic(prog(t, 2.75, 3.6));
      const pS2 = E.inOutCubic(prog(t, 2.65, 3.35));
      shines.current.forEach((s, i) => {
        if (!s) return;
        s.style.setProperty("--p", `${i === 0 ? lerp(-45, 115, pS) : lerp(-45, 115, pS2)}%`);
        s.style.opacity = (pS > 0 && pS < 1) || (i > 0 && t > 2.65 && t < 3.35) ? "0.75" : "0";
      });

      const breathe = t > 3.2 ? 1 + 0.006 * m.kick : 1;
      lg.style.transform = `translate(${LX + shx * 0.5}px,${LY + shy * 0.5}px) scale(${K * breathe})`;
      if (!("live" in root.dataset)) root.dataset.live = "";
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.visibilityState !== "visible") return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(root);
    const onVis = () => (document.visibilityState === "visible" ? start() : stop());
    document.addEventListener("visibilitychange", onVis);

    // começa quando as camadas estiverem carregadas (senão o reveal passa com imagens vazias)
    const imgs = Array.from(lg.querySelectorAll("img"));
    Promise.all(imgs.map((i) => i.decode().catch(() => undefined))).then(() => {
      t0 = performance.now();
      start();
    });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      delete root.dataset.live;
    };
  }, []);

  const shine = (src: string, a: { w: number; h: number }, i: number) => (
    <div
      ref={(el) => {
        shines.current[i] = el;
      }}
      className="telao__shine"
      style={{ width: a.w, height: a.h, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
    />
  );

  return (
    <>
      {/* luz do telão na parede em volta (fica atrás do telão) */}
      <div ref={spill} className="telao-spill" aria-hidden="true" />
      <div ref={wrap} className="telao" aria-hidden="true">
        {/* sem JavaScript ou com "reduzir movimento": logo parado */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="telao__static" src={LOGO_H_SRC} alt="" />
        <div ref={flash} className="telao__flash" />
        <div ref={logo} className="telao__logo">
          <div ref={wave} className="telao__wave" />
          <div ref={rings} className="telao__layer" style={box(L.rings)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/rings.webp`} alt="" width={L.rings.w} height={L.rings.h} />
            {shine(`${SRC}/rings.webp`, L.rings, 2)}
          </div>
          <div ref={cross} className="telao__layer" style={box(L.cross)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/cross.webp`} alt="" width={L.cross.w} height={L.cross.h} />
            {shine(`${SRC}/cross.webp`, L.cross, 1)}
          </div>
          <div ref={barsEl} className="telao__layer" style={box(BG)}>
            {BARS.map(([x, y, w, h], i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="telao__bar"
                src={`${SRC}/bar${i}.webp`}
                alt=""
                width={w}
                height={h}
                style={{ left: x - BG.x, top: y - BG.y }}
              />
            ))}
          </div>
          <div ref={text} className="telao__layer" style={box(L.text)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SRC}/text.webp`} alt="" width={L.text.w} height={L.text.h} />
            {shine(`${SRC}/text.webp`, L.text, 0)}
          </div>
        </div>
        {/* grade de LED e reflexo do vidro por cima de tudo */}
        <div className="telao__leds" />
      </div>
    </>
  );
}
