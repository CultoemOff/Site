/**
 * Arte animada do topo da página do Companion (enquanto não há vídeo):
 * palco com luzes móveis em cima, janela de transmissão no estilo OBS no meio e um painel de 15 teclas embaixo.
 * As teclas acendem em sequência e cada toque muda a cena, a luz e o "no ar" (só CSS, prefixo .sd- em sales.css).
 * Desenho genérico: sem marcas nem logotipos.
 */
const KEYS: { label: string; tone: "blue" | "amber" | "red" | "green" | "violet" }[] = [
  { label: "ABERTURA", tone: "violet" },
  { label: "LOUVOR", tone: "blue" },
  { label: "PALAVRA", tone: "blue" },
  { label: "CEIA", tone: "blue" },
  { label: "FINAL", tone: "violet" },
  { label: "PTZ 1", tone: "amber" },
  { label: "PTZ 2", tone: "amber" },
  { label: "LETRA", tone: "green" },
  { label: "LUZ", tone: "amber" },
  { label: "TIMER", tone: "green" },
  { label: "LIVE", tone: "red" },
  { label: "GRAVAR", tone: "red" },
  { label: "MUTE", tone: "red" },
  { label: "TELA ⬛", tone: "violet" },
  { label: "ESPERA", tone: "violet" },
];

const BEAMS = [
  { x: 110, c: "#ff4d5e", d: "0s" },
  { x: 210, c: "#a78bfa", d: "-1.2s" },
  { x: 390, c: "#a78bfa", d: "-2.4s" },
  { x: 490, c: "#ff4d5e", d: "-3.6s" },
];

export default function StreamDeckArt() {
  return (
    <figure className="sd-art" data-anim role="img" aria-label="Painel de botões comandando a transmissão e as luzes do palco">
      <svg viewBox="0 0 600 640" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="sd-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sd-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2440" />
            <stop offset="1" stopColor="#0b1022" />
          </linearGradient>
          <linearGradient id="sd-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d4ed8" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* palco: treliça e luzes móveis varrendo */}
        <path d="M40 40h520" stroke="#3b4a7a" strokeWidth="6" strokeLinecap="round" />
        <path d="M40 52h520" stroke="#2a365c" strokeWidth="2" strokeDasharray="6 10" />
        {BEAMS.map((b) => (
          <g key={b.x} transform={`translate(${b.x} 46)`}>
            <g className="sd-beam" style={{ color: b.c, animationDelay: b.d }}>
              <path d="M-6 6 L-64 250 L64 250 L6 6 Z" fill="url(#sd-beam)" opacity="0.55" />
            </g>
            <rect x="-14" y="-6" width="28" height="20" rx="5" fill="#141c34" stroke="#5b6b9a" strokeWidth="2" />
          </g>
        ))}

        {/* janela de transmissão (prévia × programa) */}
        <g transform="translate(70 170)">
          <rect width="460" height="200" rx="14" fill="#0a0f1f" stroke="#33406b" strokeWidth="2" />
          <rect x="16" y="14" width="10" height="10" rx="5" fill="#ff5f57" />
          <rect x="32" y="14" width="10" height="10" rx="5" fill="#febc2e" />
          <rect x="48" y="14" width="10" height="10" rx="5" fill="#28c840" />
          <text x="230" y="24" textAnchor="middle" className="sd-mono">PRÉVIA · PROGRAMA</text>
          <rect x="16" y="38" width="206" height="124" rx="6" fill="#121a33" stroke="#33406b" />
          <rect x="238" y="38" width="206" height="124" rx="6" fill="#121a33" stroke="#ef4444" strokeWidth="2.5" />
          {/* três "cenas" que se revezam no programa */}
          <g className="sd-scene sd-scene--1">
            <rect x="238" y="38" width="206" height="124" rx="6" fill="url(#sd-screen)" opacity="0.65" />
            <circle cx="341" cy="96" r="22" fill="#e0e7ff" opacity="0.8" />
            <rect x="311" y="122" width="60" height="26" rx="12" fill="#e0e7ff" opacity="0.6" />
          </g>
          <g className="sd-scene sd-scene--2">
            <rect x="238" y="38" width="206" height="124" rx="6" fill="#0f172a" />
            <rect x="262" y="70" width="158" height="12" rx="6" fill="#f8fafc" opacity="0.9" />
            <rect x="282" y="92" width="118" height="12" rx="6" fill="#f8fafc" opacity="0.7" />
            <rect x="300" y="114" width="82" height="10" rx="5" fill="#fbbf24" opacity="0.8" />
          </g>
          <g className="sd-scene sd-scene--3">
            <rect x="238" y="38" width="206" height="124" rx="6" fill="#111827" />
            <path d="M238 162 L300 100 L340 130 L380 90 L444 150 V162 Z" fill="#38bdf8" opacity="0.5" />
            <circle cx="410" cy="68" r="12" fill="#fde68a" opacity="0.8" />
          </g>
          <rect x="22" y="44" width="194" height="112" rx="4" fill="#1e293b" opacity="0.6" />
          <rect x="40" y="62" width="70" height="44" rx="4" fill="#334155" />
          <rect x="120" y="62" width="80" height="12" rx="4" fill="#334155" />
          <rect x="120" y="82" width="56" height="12" rx="4" fill="#334155" />
          <g className="sd-onair">
            <rect x="372" y="172" width="72" height="20" rx="10" fill="#ef4444" />
            <text x="408" y="186" textAnchor="middle" className="sd-mono sd-mono--dark">AO VIVO</text>
          </g>
          <text x="22" y="186" className="sd-mono">CENA ▸</text>
        </g>

        {/* painel de 15 teclas */}
        <g transform="translate(60 404)">
          <rect width="480" height="216" rx="26" fill="url(#sd-body)" stroke="#2f3b63" strokeWidth="2" />
          {KEYS.map((k, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            return (
              <g key={k.label} transform={`translate(${26 + col * 88} ${22 + row * 64})`}>
                <rect width="76" height="54" rx="10" className={`sd-key sd-key--${k.tone}`} style={{ animationDelay: `${(i * 0.53) % 7.95}s` }} />
                <text x="38" y="32" textAnchor="middle" className="sd-key__txt">
                  {k.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </figure>
  );
}
