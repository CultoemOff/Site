"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  BEAM_LENGTH,
  FOCUS_BOUNDS,
  LENS_OFFSET,
  MOVING_HEADS,
  STAGE_FOCUS,
  aimAngle,
  u,
  type MovingHead,
} from "./stageRig";

type Pose = { beam: string; head: string; pool: string };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Calcula os transforms de um moving head apontando para (tx, ty). */
function pose(h: MovingHead, tx: number, ty: number): Pose {
  const dx = tx - h.x;
  const dy = ty - h.y;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const angle = aimAngle(h.x, h.y, tx, ty);
  const lens = LENS_OFFSET * h.size;
  const ox = (dx / dist) * lens;
  const oy = (dy / dist) * lens;
  const scale = Math.max(0.05, (dist - lens) / BEAM_LENGTH);
  return {
    beam: `translate(${u(ox)}, ${u(oy)}) rotate(${angle.toFixed(4)}rad) scaleY(${scale.toFixed(4)})`,
    head: `rotate(${angle.toFixed(4)}rad)`,
    // no piso a mancha é achatada; subindo pela parede/telão ela fica mais redonda
    pool: `translate(${u(tx)}, ${u(ty)}) translate(-50%, -50%) scaleY(${(1 + clamp((700 - ty) / 220, 0, 1) * 1.4).toFixed(3)})`,
  };
}

const TAU = Math.PI * 2;

function MovingHeadFixture({ head, initial }: { head: MovingHead; initial: Pose }) {
  const size = head.size;
  const style = {
    left: u(head.x),
    top: u(head.y),
    width: u(40 * size),
    height: u(60 * size),
    "--beam-rgb": head.rgb,
  } as CSSProperties;
  return (
    <div className={`mh${head.desktopOnly ? " mh--desktop" : ""}`} style={style}>
      <svg className="mh__yoke" viewBox="0 0 40 60" aria-hidden="true" focusable="false">
        <rect x="16" y="0" width="8" height="6" fill="#161d2f" />
        <rect x="7" y="5" width="26" height="7" rx="2.5" fill="#0e1427" stroke="#27324f" strokeWidth="0.8" />
        <path d="M9.5 11 V31 M30.5 11 V31" stroke="#141b2e" strokeWidth="4.2" strokeLinecap="round" />
      </svg>
      <div className="mh__head" data-head={head.id} style={{ transform: initial.head }}>
        <svg viewBox="0 0 40 60" aria-hidden="true" focusable="false">
          <rect x="11.5" y="17" width="17" height="28" rx="7.5" fill="#0c1222" stroke="#2a3657" strokeWidth="0.9" />
          <circle cx="20" cy="30" r="3" fill="#1a2440" />
          <circle cx="20" cy="44" r="6.2" fill="#0a0f1c" />
          <circle cx="20" cy="44" r="4.6" style={{ fill: `rgb(${head.rgb})` }} opacity="0.95" />
          <circle cx="20" cy="44" r="2" fill="#eaf2ff" />
        </svg>
        <span className="mh__lens" />
      </div>
    </div>
  );
}

export default function StageLights() {
  const rootRef = useRef<HTMLDivElement>(null);

  const initialPoses = MOVING_HEADS.map((h) => pose(h, STAGE_FOCUS.x + h.spread, STAGE_FOCUS.y));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const hero = root.closest<HTMLElement>("[data-hero]") ?? root;
    const stage = root.closest<HTMLElement>("[data-stage]") ?? root;
    const beamsLayer = root.querySelector<HTMLElement>("[data-beams]");
    const beams = MOVING_HEADS.map((h) => root.querySelector<HTMLElement>(`[data-beam="${h.id}"]`));
    const heads = MOVING_HEADS.map((h) => root.querySelector<HTMLElement>(`[data-head="${h.id}"]`));
    const pools = MOVING_HEADS.map((h) => root.querySelector<HTMLElement>(`[data-pool="${h.id}"]`));
    const hazeLayers = Array.from(hero.querySelectorAll<HTMLElement>("[data-haze-depth]"));
    const hazeGlow = hero.querySelector<HTMLElement>("[data-haze-glow]");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return; // mantém a pose estática renderizada no servidor

    const state = MOVING_HEADS.map((h) => ({ x: STAGE_FOCUS.x + h.spread, y: STAGE_FOCUS.y }));
    const aim = { x: STAGE_FOCUS.x, y: STAGE_FOCUS.y };
    const parallax = { x: 0, y: 0 };
    const pointer = { x: STAGE_FOCUS.x, y: STAGE_FOCUS.y, nx: 0, ny: 0, last: -Infinity };

    let raf = 0;
    let running = false;
    const start = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = stage.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 1600;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 900;
      pointer.nx = clamp(e.clientX / window.innerWidth - 0.5, -0.5, 0.5);
      pointer.ny = clamp(e.clientY / window.innerHeight - 0.5, -0.5, 0.5);
      pointer.last = performance.now();
    };

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const active = now - pointer.last < 4000;

      // ponto de foco: segue o mouse (amortecido) ou faz uma varredura lenta
      let goalX: number;
      let goalY: number;
      if (active) {
        goalX = STAGE_FOCUS.x + (pointer.x - STAGE_FOCUS.x) * 0.7;
        goalY = STAGE_FOCUS.y + (pointer.y - STAGE_FOCUS.y) * 0.7;
      } else {
        goalX = STAGE_FOCUS.x + Math.sin((t * TAU) / 16) * 150;
        goalY = STAGE_FOCUS.y + Math.sin((t * TAU) / 11) * 40 - 20;
      }
      goalX = clamp(goalX, FOCUS_BOUNDS.minX, FOCUS_BOUNDS.maxX);
      goalY = clamp(goalY, FOCUS_BOUNDS.minY, FOCUS_BOUNDS.maxY);
      aim.x += (goalX - aim.x) * 0.06;
      aim.y += (goalY - aim.y) * 0.06;

      MOVING_HEADS.forEach((h, i) => {
        const amp = h.kind === "spot" ? 0.35 : 1;
        const wobbleX = Math.sin((t * TAU) / h.period + h.phase) * 36 * amp;
        const wobbleY = Math.cos((t * TAU) / (h.period * 1.3) + h.phase) * 16 * amp;
        const tx = aim.x + h.spread + wobbleX;
        const ty = aim.y + wobbleY;
        const s = state[i];
        s.x += (tx - s.x) * h.follow;
        s.y += (ty - s.y) * h.follow;
        const p = pose(h, s.x, s.y);
        const beam = beams[i];
        const head = heads[i];
        const pool = pools[i];
        if (beam) beam.style.transform = p.beam;
        if (head) head.style.transform = p.head;
        if (pool) pool.style.transform = p.pool;
      });

      // fumaça: paralaxe com o mouse + deriva contínua da textura dentro dos fachos
      const px = active ? pointer.nx : Math.sin((t * TAU) / 20) * 0.15;
      const py = active ? pointer.ny : 0;
      parallax.x += (px - parallax.x) * 0.04;
      parallax.y += (py - parallax.y) * 0.04;
      for (const layer of hazeLayers) {
        const depth = Number(layer.dataset.hazeDepth ?? 1);
        layer.style.transform = `translate3d(${(-parallax.x * 70 * depth).toFixed(2)}px, ${(-parallax.y * 26 * depth).toFixed(2)}px, 0)`;
      }
      if (hazeGlow) hazeGlow.style.transform = `translate(${u(aim.x)}, ${u(aim.y - 60)}) translate(-50%, -50%)`;
      if (beamsLayer) {
        const mx = (-t * 9 - parallax.x * 120).toFixed(1);
        const my = (-t * 3 - parallax.y * 40).toFixed(1);
        beamsLayer.style.setProperty("--smoke-pos", `${mx}px ${my}px`);
      }

      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()), {
      threshold: 0,
    });
    io.observe(hero);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="stage-lights" ref={rootRef} aria-hidden="true">
      <div className="stage-pools">
        {MOVING_HEADS.map((h, i) => (
          <span
            key={h.id}
            data-pool={h.id}
            className={`stage-pool${h.kind === "spot" ? " stage-pool--spot" : ""}${h.desktopOnly ? " mh--desktop" : ""}`}
            style={{ transform: initialPoses[i].pool, "--beam-rgb": h.rgb } as CSSProperties}
          />
        ))}
      </div>
      <div className="stage-beams" data-beams>
        {MOVING_HEADS.map((h, i) => (
          <span
            key={h.id}
            data-beam={h.id}
            className={`beam${h.kind === "spot" ? " beam--spot" : ""}${h.desktopOnly ? " mh--desktop" : ""}`}
            style={
              {
                left: u(h.x),
                top: u(h.y),
                transform: initialPoses[i].beam,
                "--beam-rgb": h.rgb,
                "--beam-w": u((h.kind === "spot" ? 460 : 150) * h.size),
              } as CSSProperties
            }
          />
        ))}
      </div>
      {MOVING_HEADS.map((h, i) => (
        <MovingHeadFixture key={h.id} head={h} initial={initialPoses[i]} />
      ))}
    </div>
  );
}
