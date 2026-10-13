/**
 * Ilustrações animadas dos cards "problema → solução" da página de venda.
 * Mesmo visual dos slides das aulas: fundo azul-noite com grade, traço em néon azul, rótulos em fonte mono
 * e um ponto de cor (âmbar para o que importa, vermelho para o problema).
 * As animações são só CSS (sales.css, prefixo .pi-): pausam fora da tela ([data-anim]), no modo leve
 * e com "reduzir movimento".
 */
export type ProblemIlloName = "cable" | "restart" | "buy" | "automate" | "ptz" | "timer" | "panel";

const LINE = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** fundo comum: brilho no centro, grade e chão em perspectiva */
function Backdrop({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="58%" r="60%">
          <stop offset="0" stopColor="#1d4ed8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1d4ed8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#13306e" />
          <stop offset="1" stopColor="#0a1a44" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="#5b8cff" strokeOpacity="0.09" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-grid)`} />
      <rect width="320" height="180" fill={`url(#${id}-glow)`} />
      <path d="M0 150h320" stroke="#5b8cff" strokeOpacity="0.25" strokeWidth="1" />
    </>
  );
}

/** etiqueta em fonte mono, como nos slides */
function Tag({ x, y, children, tone = "blue", anchor = "middle" }: { x: number; y: number; children: string; tone?: "blue" | "amber" | "red"; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={`pi-tag pi-tag--${tone}`}>
      {children}
    </text>
  );
}

function Camera({ x, y, s = 1, id }: { x: number; y: number; s?: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="pi-line">
      <rect x="-24" y="-20" width="48" height="36" rx="13" {...LINE} fill={`url(#${id}-panel)`} />
      <circle cx="0" cy="-2" r="10.5" {...LINE} fill="#06102c" />
      <circle cx="0" cy="-2" r="4.2" className="pi-lens" />
      <rect x="-17" y="17" width="34" height="8" rx="3" {...LINE} fill={`url(#${id}-panel)`} />
      <circle cx="17" cy="-13" r="2" className="pi-led" />
    </g>
  );
}

function Monitor({ x, y, w, h, id, children }: { x: number; y: number; w: number; h: number; id: string; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`} className="pi-line">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="7" {...LINE} fill={`url(#${id}-panel)`} />
      <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w - 12} height={h - 12} rx="3" fill="#050d26" />
      {children}
      <path d={`M-12 ${h / 2 + 11}h24M0 ${h / 2}v11`} {...LINE} />
    </g>
  );
}

function Switch({ x, y, id, ports = 6, lit = false }: { x: number; y: number; id: string; ports?: number; lit?: boolean }) {
  const w = ports * 11 + 14;
  return (
    <g transform={`translate(${x} ${y})`} className="pi-line">
      <rect x={-w / 2} y="-13" width={w} height="26" rx="5" {...LINE} fill={`url(#${id}-panel)`} />
      {Array.from({ length: ports }, (_, i) => (
        <g key={i}>
          <rect x={-w / 2 + 9 + i * 11} y="-5" width="7" height="8" rx="1.5" fill="#050d26" stroke="currentColor" strokeWidth="1.2" />
          {lit && <circle cx={-w / 2 + 12.5 + i * 11} cy="-9" r="1.4" className="pi-port" style={{ animationDelay: `${i * 0.18}s` }} />}
        </g>
      ))}
    </g>
  );
}

function Scene({ name }: { name: ProblemIlloName }) {
  const id = `pi-${name}`;
  switch (name) {
    // HDMI/USB longo com emenda: o sinal anda, engasga na emenda e a tela trava
    case "cable":
      return (
        <>
          <Backdrop id={id} />
          <Camera x={54} y={78} id={id} />
          <path id={`${id}-wire`} d="M54 104c0 34 34 40 62 26s34-22 50-22 20 12 40 12 30-18 52-34" {...LINE} className="pi-wire" />
          {/* sinal andando pelo cabo e parando na emenda */}
          <path d="M54 104c0 34 34 40 62 26s34-22 50-22 20 12 40 12 30-18 52-34" pathLength={1} className="pi-signal" />
          <g transform="translate(152 109)">
            <rect x="-17" y="-10" width="34" height="20" rx="5" fill={`url(#${id}-panel)`} className="pi-amber" stroke="currentColor" strokeWidth="2.2" />
            <path d="M-8 0h16M-5 -4l-3 4 3 4M5 -4l3 4-3 4" className="pi-amber" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <Tag x={152} y={168} tone="amber">EXTENSÃO</Tag>
          <Tag x={70} y={168}>HDMI 15 m</Tag>
          <Monitor x={262} y={64} w={88} h={58} id={id}>
            <g className="pi-frame">
              <rect x="-36" y="-21" width="72" height="42" fill="#1d4ed8" opacity="0.35" />
              <circle cx="-8" cy="-2" r="9" fill="#5bd0ff" opacity="0.5" />
            </g>
            <g className="pi-glitch">
              <rect x="-36" y="-12" width="50" height="5" fill="#ff8a7a" />
              <rect x="-20" y="2" width="56" height="4" fill="#5bd0ff" />
              <rect x="-36" y="10" width="30" height="4" fill="#ff8a7a" />
            </g>
          </Monitor>
          <g transform="translate(301 30)">
            <g className="pi-alert">
              <circle r="10" />
              <path d="M0 -5v5.5M0 4.5v.4" stroke="#0a1430" strokeWidth="2.6" strokeLinecap="round" />
            </g>
          </g>
          <Tag x={262} y={124} tone="red">SINAL PERDIDO</Tag>
        </>
      );
    // desliga tudo, liga de novo e torce
    case "restart":
      return (
        <>
          <Backdrop id={id} />
          <Camera x={64} y={110} s={0.9} id={id} />
          <Switch x={160} y={118} id={id} />
          <Monitor x={258} y={106} w={70} h={46} id={id}>
            <rect x="-29" y="-17" width="58" height="34" className="pi-screen-on" />
          </Monitor>
          {/* "luz de energia" de cada aparelho apaga e acende em sequência */}
          <circle cx="64" cy="146" r="3" className="pi-power" />
          <circle cx="160" cy="146" r="3" className="pi-power" style={{ animationDelay: "0.25s" }} />
          <circle cx="258" cy="146" r="3" className="pi-power" style={{ animationDelay: "0.5s" }} />
          <g transform="translate(160 46)">
            <g className="pi-spin">
              <path d="M-30 0a30 30 0 0 1 55-16" className="pi-amber" {...LINE} strokeWidth={3} />
              <path d="M25 -16l2 -13M25 -16l-12 -3" className="pi-amber" {...LINE} strokeWidth={3} />
              <path d="M30 0a30 30 0 0 1-55 16" className="pi-amber" {...LINE} strokeWidth={3} />
              <path d="M-25 16l-2 13M-25 16l12 3" className="pi-amber" {...LINE} strokeWidth={3} />
            </g>
            <g className="pi-red" {...LINE} strokeWidth={2.6}>
              <path d="M0 -10v9" />
              <path d="M-7 -6a10 10 0 1 0 14 0" />
            </g>
          </g>
          <text x="104" y="40" className="pi-q">?</text>
          <text x="214" y="34" className="pi-q pi-q--2">?</text>
          <Tag x={160} y={170}>DESLIGA · LIGA · TORCE</Tag>
        </>
      );
    // carrinho cheio de equipamento sem saber se vai funcionar
    case "buy":
      return (
        <>
          <Backdrop id={id} />
          <g className="pi-cart">
            <g className="pi-line" {...LINE}>
              <path d="M34 40h20l18 86h138l18-62H62" />
              <path d="M76 104h140" opacity="0.4" />
            </g>
            <circle cx="92" cy="144" r="8" className="pi-line" {...LINE} fill="#050d26" />
            <circle cx="196" cy="144" r="8" className="pi-line" {...LINE} fill="#050d26" />
            {/* caixas caindo no carrinho, uma de cada vez */}
            <g className="pi-drop">
              <Switch x={104} y={96} id={id} ports={4} />
            </g>
            <g className="pi-drop pi-drop--2">
            <g transform="translate(186 94)">
              <rect x="-20" y="-12" width="40" height="24" rx="5" className="pi-line" {...LINE} fill={`url(#${id}-panel)`} />
              <path d="M-9 -12l-6-13M9 -12l6-13" className="pi-line" {...LINE} />
              <circle cx="-8" cy="0" r="1.8" className="pi-led" />
              <circle cx="0" cy="0" r="1.8" className="pi-led" />
            </g>
            </g>
            <g className="pi-drop pi-drop--3">
            <g transform="translate(146 92)">
              <rect x="-16" y="-12" width="32" height="22" rx="8" className="pi-line" {...LINE} fill={`url(#${id}-panel)`} />
              <circle cx="0" cy="-1" r="6" className="pi-line" {...LINE} fill="#050d26" />
            </g>
            </g>
          </g>
          <text x="244" y="58" className="pi-q">?</text>
          <text x="276" y="92" className="pi-q pi-q--2">?</text>
          <text x="252" y="126" className="pi-q pi-q--3">?</text>
          <Tag x={56} y={30} anchor="start" tone="amber">VAI FUNCIONAR?</Tag>
        </>
      );
    // uma controladora de botões ligando mesa, live, luz e projeção pela rede
    case "automate":
      return (
        <>
          <Backdrop id={id} />
          {/* fios até cada sistema, com o comando passando */}
          {["M114 66H74", "M114 116H74", "M206 66h40", "M206 116h40"].map((d, i) => (
            <g key={d}>
              <path d={d} className="pi-line" {...LINE} strokeWidth={1.4} strokeDasharray="3 5" opacity="0.6" />
              <path d={d} pathLength={1} className="pi-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
            </g>
          ))}
          <g transform="translate(160 91)">
            <rect x="-48" y="-40" width="96" height="80" rx="12" fill={`url(#${id}-panel)`} className="pi-amber" stroke="currentColor" strokeWidth="2.4" />
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={-37 + c * 19}
                  y={-28 + r * 19}
                  width="15"
                  height="14"
                  rx="3"
                  className="pi-key"
                  style={{ animationDelay: `${((r * 4 + c) * 7) % 12 * 0.2}s` }}
                />
              )),
            )}
          </g>
          <Tag x={160} y={150} tone="amber">1 BOTÃO</Tag>
          {/* mesa de som */}
          <g transform="translate(46 66)" className="pi-line">
            <rect x="-24" y="-16" width="48" height="32" rx="5" {...LINE} fill={`url(#${id}-panel)`} />
            <path d="M-12 -8v16M0 -8v16M12 -8v16" {...LINE} strokeWidth={1.6} />
            <rect x="-15" y="-2" width="6" height="4" rx="1" className="pi-fader" />
            <rect x="-3" y="2" width="6" height="4" rx="1" className="pi-fader pi-fader--2" />
            <rect x="9" y="-5" width="6" height="4" rx="1" className="pi-fader" />
          </g>
          <Tag x={46} y={98}>MESA</Tag>
          {/* live */}
          <g transform="translate(46 128)" className="pi-line">
            <rect x="-22" y="-12" width="32" height="24" rx="5" {...LINE} fill={`url(#${id}-panel)`} />
            <path d="M10 -5l12-7v24l-12-7" {...LINE} />
            <circle cx="-14" cy="-5" r="2.4" className="pi-rec" />
          </g>
          <Tag x={46} y={160}>LIVE</Tag>
          {/* luz */}
          <g transform="translate(274 66)">
            <circle cy="-2" r="16" className="pi-bulb-glow" />
            <path d="M-10 4a12 12 0 1 1 20 0c-3 3-4 5-4 9h-12c0-4-1-6-4-9Z" className="pi-line" {...LINE} fill={`url(#${id}-panel)`} />
            <path d="M-6 19h12" className="pi-line" {...LINE} />
          </g>
          <Tag x={274} y={98}>LUZ</Tag>
          {/* projeção */}
          <g transform="translate(274 128)" className="pi-line">
            <rect x="-26" y="-15" width="52" height="30" rx="4" {...LINE} fill={`url(#${id}-panel)`} />
            <rect x="-20" y="-9" width="40" height="18" rx="2" className="pi-slide" />
          </g>
          <Tag x={274} y={160}>TELÃO</Tag>
        </>
      );
    // câmera PTZ chegando atrasada: com um toque ela vai ao preset e a cena troca junto
    case "ptz":
      return (
        <>
          <Backdrop id={id} />
          <g transform="translate(96 82)">
            <g className="pi-ptz-head">
              <rect x="-30" y="-26" width="60" height="44" rx="16" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
              <circle cx="0" cy="-4" r="12" {...LINE} fill="#050d26" className="pi-line" />
              <circle cx="0" cy="-4" r="5" className="pi-lens" />
            </g>
            <rect x="-22" y="20" width="44" height="12" rx="4" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
            <rect x="-30" y="32" width="60" height="10" rx="4" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
          </g>
          {/* alvo: o púlpito */}
          <g transform="translate(250 104)">
            <path d="M-20 40 h40 l-6 -34 h-28 Z" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
            <circle cx="0" cy="-12" r="12" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
            <g className="pi-target">
              <path d="M-34 -40 h12 M-34 -40 v12 M34 -40 h-12 M34 -40 v12 M-34 50 h12 M-34 50 v-12 M34 50 h-12 M34 50 v-12" stroke="#ffc24d" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </g>
          {/* tecla do painel */}
          <g transform="translate(170 150)">
            <rect x="-40" y="-14" width="80" height="26" rx="6" className="pi-press" />
            <text x="0" y="4" textAnchor="middle" className="pi-tag" style={{ fill: "#0a1430" }}>
              PREGAÇÃO
            </text>
          </g>
          <Tag x={96} y={30}>PRESET 3</Tag>
        </>
      );
    // pregação estourando o tempo: cronômetro na tecla e luz que pisca no fim
    case "timer":
      return (
        <>
          <Backdrop id={id} />
          <g transform="translate(110 92)">
            <rect x="-62" y="-50" width="124" height="100" rx="16" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
            <rect x="-48" y="-36" width="96" height="72" rx="10" className="pi-timer-key" />
            <text x="0" y="-8" textAnchor="middle" className="pi-tag" style={{ fill: "#0a1430" }}>
              PREGAÇÃO
            </text>
            <g className="pi-count">
              <text x="0" y="22" textAnchor="middle" className="pi-big">00:30</text>
            </g>
            <g className="pi-count pi-count--end">
              <text x="0" y="22" textAnchor="middle" className="pi-big">00:00</text>
            </g>
          </g>
          {/* lâmpada no púlpito pisca quando o tempo acaba */}
          <g transform="translate(240 80)">
            <circle cy="-4" r="30" className="pi-flash" />
            <path d="M-12 6a14 14 0 1 1 24 0c-3.5 3.5-5 6-5 10.5h-14c0-4.5-1.5-7-5-10.5Z" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
            <path d="M-7 23h14" {...LINE} className="pi-line" />
          </g>
          <path d="M176 92 H210" {...LINE} strokeDasharray="3 5" className="pi-line" opacity="0.6" />
          <Tag x={240} y={140} tone="amber">LUZ AVISA O FIM</Tag>
        </>
      );
    // painel com páginas por função e cores que a equipe entende
    case "panel":
      return (
        <>
          <Backdrop id={id} />
          {[
            { x: 70, t: "CÂMERAS", c: "#ffc24d" },
            { x: 160, t: "ÁUDIO", c: "#ff7a6a" },
            { x: 250, t: "LUZ", c: "#a78bfa" },
          ].map((pg, k) => (
            <g key={pg.t} transform={`translate(${pg.x} 86)`}>
            <g className="pi-page" style={{ animationDelay: `${k * 1.1}s` }}>
              <rect x="-40" y="-46" width="80" height="84" rx="10" {...LINE} fill={`url(#${id}-panel)`} className="pi-line" />
              {[0, 1, 2].map((r) =>
                [0, 1].map((c) => <rect key={`${r}${c}`} x={-30 + c * 32} y={-36 + r * 24} width="28" height="20" rx="4" fill={pg.c} opacity={0.35 + ((r + c) % 2) * 0.45} />),
              )}
              <text x="0" y="58" textAnchor="middle" className="pi-tag">
                {pg.t}
              </text>
            </g>
            </g>
          ))}
          <Tag x={160} y={170} tone="amber">1 PÁGINA POR FUNÇÃO</Tag>
        </>
      );
  }
}

export default function ProblemIllo({ name }: { name: ProblemIlloName }) {
  return (
    <svg className={`pi pi--${name}`} viewBox="0 0 320 180" role="presentation" aria-hidden="true" focusable="false">
      <Scene name={name} />
    </svg>
  );
}
