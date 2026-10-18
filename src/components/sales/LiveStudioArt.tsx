/**
 * Ilustração da cabine de transmissão (página Culto ao Vivo com Excelência):
 * câmera PTZ no palco, o PC da live com uma tela no estilo de um programa de transmissão
 * (prévia × programa, cenas, mixer de áudio), a mesa de som e o celular de quem assiste em casa.
 * Desenho genérico, sem marcas nem logotipos. Animações só em CSS (prefixos .sd- e .ls- em sales.css).
 */
const SCENES = ["ABERTURA", "LOUVOR", "PREGAÇÃO", "AVISOS", "OFERTA"];

export default function LiveStudioArt() {
  return (
    <figure className="sd-art ls-art" data-anim role="img" aria-label="Cabine de transmissão: câmera PTZ, PC com a live, mesa de som e o culto no celular de quem assiste">
      <svg viewBox="0 0 600 560" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ls-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2a52" />
            <stop offset="1" stopColor="#0b1430" />
          </linearGradient>
          <linearGradient id="ls-scr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d4ed8" />
            <stop offset="1" stopColor="#6a5cff" />
          </linearGradient>
          <linearGradient id="ls-cone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5bd0ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#5bd0ff" stopOpacity="0" />
          </linearGradient>
          <pattern id="ls-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#5b8cff" strokeOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="600" height="560" fill="url(#ls-grid)" />

        {/* câmera PTZ no palco, girando entre os presets */}
        <g transform="translate(92 70)">
          <path d="M0 -60v34" stroke="#3b4a7a" strokeWidth="6" strokeLinecap="round" />
          <g className="ls-pan">
            <path d="M18 -6 L230 -70 L230 60 Z" fill="url(#ls-cone)" />
            <rect x="-30" y="-24" width="60" height="44" rx="15" fill="url(#ls-body)" stroke="#8fb6ff" strokeWidth="2.2" />
            <circle cx="0" cy="-2" r="12" fill="#050d26" stroke="#8fb6ff" strokeWidth="2.2" />
            <circle cx="0" cy="-2" r="5" fill="#5bd0ff" />
            <circle cx="20" cy="-14" r="2.5" className="ls-tally" />
          </g>
          <rect x="-22" y="22" width="44" height="12" rx="4" fill="url(#ls-body)" stroke="#8fb6ff" strokeWidth="2" />
        </g>
        <text x="92" y="132" textAnchor="middle" className="sd-mono">CÂMERA PTZ · NDI</text>

        {/* fio de rede até o PC, com o vídeo passando */}
        <path d="M92 140 C92 190 120 196 150 196" fill="none" stroke="#3b4a7a" strokeWidth="2" strokeDasharray="4 6" />
        <path d="M92 140 C92 190 120 196 150 196" pathLength={1} className="ls-flow" />

        {/* PC da live */}
        <g transform="translate(150 150)">
          <rect width="400" height="250" rx="16" fill="#0a0f1f" stroke="#33406b" strokeWidth="2" />
          <circle cx="18" cy="16" r="4" fill="#ff5f57" />
          <circle cx="32" cy="16" r="4" fill="#febc2e" />
          <circle cx="46" cy="16" r="4" fill="#28c840" />
          <text x="200" y="20" textAnchor="middle" className="sd-mono" style={{ fontSize: "10px" }}>
            PRÉVIA · PROGRAMA
          </text>
          {/* prévia */}
          <rect x="14" y="32" width="180" height="104" rx="6" fill="#121a33" stroke="#33406b" />
          <rect x="26" y="44" width="70" height="40" rx="4" fill="#1e293b" />
          <rect x="104" y="48" width="78" height="10" rx="4" fill="#1e293b" />
          <rect x="104" y="64" width="54" height="10" rx="4" fill="#1e293b" />
          {/* programa: cenas se revezando */}
          <rect x="206" y="32" width="180" height="104" rx="6" fill="#121a33" stroke="#ef4444" strokeWidth="2.5" />
          <g className="sd-scene sd-scene--1">
            <rect x="206" y="32" width="180" height="104" rx="6" fill="url(#ls-scr)" opacity="0.6" />
            <circle cx="296" cy="76" r="20" fill="#e0e7ff" opacity="0.8" />
            <rect x="268" y="100" width="56" height="26" rx="12" fill="#e0e7ff" opacity="0.6" />
            <rect x="214" y="116" width="80" height="12" rx="3" fill="#0f172a" opacity="0.75" />
          </g>
          <g className="sd-scene sd-scene--2">
            <rect x="206" y="32" width="180" height="104" rx="6" fill="#0f172a" />
            <rect x="228" y="62" width="136" height="11" rx="5" fill="#f8fafc" opacity="0.9" />
            <rect x="246" y="80" width="100" height="11" rx="5" fill="#f8fafc" opacity="0.7" />
            <rect x="262" y="100" width="68" height="9" rx="4" fill="#5bd0ff" opacity="0.8" />
          </g>
          <g className="sd-scene sd-scene--3">
            <rect x="206" y="32" width="180" height="104" rx="6" fill="#111827" />
            <rect x="226" y="52" width="58" height="58" rx="6" fill="#f8fafc" opacity="0.9" />
            <path d="M234 60h12v12h-12zM262 60h12v12h-12zM234 88h12v12h-12zM256 84h6v6h-6zM266 94h8v8h-8z" fill="#0f172a" />
            <rect x="296" y="62" width="76" height="10" rx="4" fill="#f0b955" opacity="0.9" />
            <rect x="296" y="80" width="58" height="9" rx="4" fill="#f8fafc" opacity="0.6" />
          </g>
          <g className="sd-onair">
            <rect x="316" y="142" width="70" height="20" rx="10" fill="#ef4444" />
            <text x="351" y="156" textAnchor="middle" className="sd-mono sd-mono--dark" style={{ fontSize: "10px" }}>
              AO VIVO
            </text>
          </g>

          {/* cenas do culto */}
          <text x="14" y="158" className="sd-mono" style={{ fontSize: "9.5px" }}>
            CENAS
          </text>
          {SCENES.map((s, i) => (
            <g key={s} transform={`translate(14 ${166 + i * 15})`}>
              <rect width="112" height="12" rx="3" fill="#16213f" />
              <rect width="112" height="12" rx="3" className="ls-active" style={{ animationDelay: `${i * 1.59}s` }} />
              <text x="7" y="9" className="sd-mono" style={{ fontSize: "8px", letterSpacing: "0.08em" }}>
                {s}
              </text>
            </g>
          ))}

          {/* mixer de áudio */}
          <text x="146" y="158" className="sd-mono" style={{ fontSize: "9.5px" }}>
            ÁUDIO
          </text>
          {["MESA", "MIC", "VÍDEO"].map((s, i) => (
            <g key={s} transform={`translate(146 ${170 + i * 24})`}>
              <rect width="150" height="8" rx="4" fill="#16213f" />
              <g className="ls-meter" style={{ animationDelay: `${i * 0.37}s` }}>
                <rect width="150" height="8" rx="4" fill="url(#ls-meter)" />
              </g>
              <text x="0" y="20" className="sd-mono" style={{ fontSize: "7.5px", letterSpacing: "0.08em" }}>
                {s}
              </text>
            </g>
          ))}
          <defs>
            <linearGradient id="ls-meter" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5fe39a" />
              <stop offset="0.7" stopColor="#5fe39a" />
              <stop offset="0.85" stopColor="#f0b955" />
              <stop offset="1" stopColor="#ff5d6c" />
            </linearGradient>
          </defs>
          <text x="316" y="190" className="sd-mono" style={{ fontSize: "8.5px" }}>
            4500 kbps
          </text>
          <text x="316" y="206" className="sd-mono" style={{ fontSize: "8.5px" }}>
            1080p · 30 fps
          </text>
          <circle cx="322" cy="226" r="4" className="ls-tally" />
          <text x="332" y="229" className="sd-mono" style={{ fontSize: "8.5px" }}>
            GRAVANDO
          </text>
        </g>
        <path d="M330 400 v22 M300 422 h60" stroke="#33406b" strokeWidth="4" strokeLinecap="round" />
        <text x="350" y="444" textAnchor="middle" className="sd-mono">PC DA LIVE</text>

        {/* mesa de som */}
        <g transform="translate(40 410)">
          <rect width="180" height="64" rx="10" fill="url(#ls-body)" stroke="#2f3b63" strokeWidth="2" />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`translate(${20 + i * 20} 10)`}>
              <path d="M0 0v44" stroke="#3b4a7a" strokeWidth="2" />
              <g className="ls-fader" style={{ animationDelay: `${(i * 0.4) % 2}s` }}>
                <rect x="-5" y="16" width="10" height="8" rx="2" fill={i === 6 || i === 7 ? "#f0b955" : "#8fb6ff"} />
              </g>
            </g>
          ))}
        </g>
        <text x="130" y="496" textAnchor="middle" className="sd-mono">MESA DE SOM</text>
        <path d="M220 440 C250 440 260 420 280 400" fill="none" stroke="#3b4a7a" strokeWidth="2" strokeDasharray="4 6" />

        {/* celular de quem assiste */}
        <g transform="translate(500 472)">
          <rect x="-34" y="-62" width="68" height="124" rx="12" fill="url(#ls-body)" stroke="#8fb6ff" strokeWidth="2" />
          <rect x="-28" y="-50" width="56" height="42" rx="4" fill="url(#ls-scr)" opacity="0.7" />
          <rect x="-28" y="-2" width="24" height="8" rx="4" fill="#ef4444" />
          <rect x="-28" y="12" width="56" height="5" rx="2.5" fill="#22355f" />
          <rect x="-28" y="22" width="40" height="5" rx="2.5" fill="#22355f" />
          <g transform="translate(18 -14)">
            <g className="ls-heart">
              <path d="M0 4 -6 -2a3.6 3.6 0 0 1 6-4 3.6 3.6 0 0 1 6 4Z" fill="#ff5d6c" />
            </g>
          </g>
          <g transform="translate(8 -10)">
            <g className="ls-heart ls-heart--2">
              <path d="M0 4 -6 -2a3.6 3.6 0 0 1 6-4 3.6 3.6 0 0 1 6 4Z" fill="#5bd0ff" />
            </g>
          </g>
        </g>
        <text x="500" y="552" textAnchor="middle" className="sd-mono">EM CASA</text>
        <path d="M360 422 C420 422 440 470 466 470" fill="none" stroke="#3b4a7a" strokeWidth="2" strokeDasharray="4 6" />
        <path d="M360 422 C420 422 440 470 466 470" pathLength={1} className="ls-flow" />
        <text x="420" y="414" textAnchor="middle" className="sd-mono" style={{ fontSize: "9px" }}>
          INTERNET
        </text>
      </svg>
    </figure>
  );
}
