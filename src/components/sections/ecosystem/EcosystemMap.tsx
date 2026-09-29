import type { CSSProperties } from "react";
import { ECO_NODES, type EcoIcon } from "./ecosystemData";
import "./ecosystem.css";

/**
 * Mapa animado do ecossistema: a rede no centro e as áreas técnicas em volta,
 * com pacotes de dados percorrendo as ligações. Cada ligação acende em
 * sequência, sem interação obrigatória.
 */

function EcoGlyph({ icon }: { icon: EcoIcon }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className="eco-glyph" aria-hidden="true" focusable="false">
      {icon === "rede" && (
        <g {...common}>
          <rect x="4" y="9" width="16" height="6" rx="1.5" />
          <path d="M7 12h.01M10 12h.01M13 12h.01M16 12h.01M12 9V5M12 15v4M8 5h8M8 19h8" />
        </g>
      )}
      {icon === "audio" && (
        <g {...common}>
          <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
        </g>
      )}
      {icon === "video" && (
        <g {...common}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10l5-3v10l-5-3" />
        </g>
      )}
      {icon === "cameras" && (
        <g {...common}>
          <rect x="6" y="4" width="12" height="10" rx="5" />
          <circle cx="12" cy="9" r="2.4" />
          <path d="M9 14l-1 5h8l-1-5" />
        </g>
      )}
      {icon === "streaming" && (
        <g {...common}>
          <circle cx="12" cy="12" r="2" />
          <path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8" />
        </g>
      )}
      {icon === "projecao" && (
        <g {...common}>
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="M12 16v4M8 20h8M7 9h10M7 12h6" />
        </g>
      )}
      {icon === "iluminacao" && (
        <g {...common}>
          <path d="M8 3h8l-1 6H9L8 3z" />
          <path d="M9 9l-4 12M15 9l4 12M12 9v12" opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

const pct = (n: number) => `${((n / 600) * 100).toFixed(3)}%`;

export default function EcosystemMap() {
  return (
    <figure className="eco__map" aria-label="Áudio, vídeo, câmeras, streaming, projeção e iluminação conectados pela rede">
      <svg viewBox="0 0 600 600" className="eco__svg" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="eco-hub" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#7fb0ff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#7fb0ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="212" className="eco__ring" />
        <circle cx="300" cy="300" r="140" className="eco__ring eco__ring--inner" />
        <circle cx="300" cy="300" r="120" fill="url(#eco-hub)" className="eco__hub-glow" />

        {ECO_NODES.map((n, i) => {
          const out = `M300 300 L${n.x} ${n.y}`;
          const back = `M${n.x} ${n.y} L300 300`;
          const mx = (300 + n.x) / 2;
          const my = (300 + n.y) / 2;
          return (
            <g key={n.id} className="eco__link" style={{ "--i": i } as CSSProperties}>
              <path d={out} className="eco__wire" />
              <g className="fx-motion">
                <circle r="4" className="eco__packet">
                  <animateMotion dur={`${2.4 + (i % 3) * 0.4}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" path={out} />
                </circle>
                <circle r="3" className="eco__packet eco__packet--back">
                  <animateMotion dur={`${2.8 + (i % 2) * 0.5}s`} begin={`${i * 0.45 + 1}s`} repeatCount="indefinite" path={back} />
                </circle>
              </g>
              <g transform={`translate(${mx} ${my})`} className="eco__proto">
                <rect x={-(n.protocol.length * 3.6 + 12)} y="-11" width={n.protocol.length * 7.2 + 24} height="22" rx="11" />
                <text y="4" textAnchor="middle">
                  {n.protocol}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className="eco__node eco__node--hub" style={{ left: pct(300), top: pct(300) } as CSSProperties} aria-hidden="true">
        <EcoGlyph icon="rede" />
        <span className="eco__node-label">Rede</span>
        <span className="eco__node-sub">Companion</span>
      </div>

      {ECO_NODES.map((n, i) => (
        <div
          key={n.id}
          className="eco__node"
          style={{ left: pct(n.x), top: pct(n.y), "--i": i } as CSSProperties}
          aria-hidden="true"
        >
          <EcoGlyph icon={n.id} />
          <span className="eco__node-label">{n.label}</span>
        </div>
      ))}
    </figure>
  );
}
