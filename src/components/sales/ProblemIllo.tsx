/**
 * Ilustrações dos cards "problema → solução" da página de venda (decorativas, sem marcas).
 * Cada uma é uma pequena cena 320×180 no visual da página: fundo azul-noite, traço claro e um ponto de cor.
 */
export type ProblemIlloName = "cable" | "restart" | "buy" | "automate";

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Camera({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} {...STROKE}>
      <rect x="-22" y="-18" width="44" height="32" rx="12" />
      <circle cx="0" cy="-2" r="9" />
      <circle cx="0" cy="-2" r="3" fill="currentColor" />
      <rect x="-16" y="16" width="32" height="7" rx="3" />
    </g>
  );
}

function Screen({ x, y, w = 70, h = 46 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} {...STROKE}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="6" />
      <path d={`M-10 ${h / 2 + 10}h20M0 ${h / 2}v10`} />
    </g>
  );
}

function SwitchBox({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-34" y="-12" width="68" height="24" rx="5" {...STROKE} />
      {[-22, -11, 0, 11, 22].map((px) => (
        <rect key={px} x={px - 3.5} y="-4" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.8" />
      ))}
    </g>
  );
}

function Scene({ name }: { name: ProblemIlloName }) {
  switch (name) {
    // cabo longo com emenda até a tela, imagem travando
    case "cable":
      return (
        <>
          <Camera x={58} y={78} />
          <path d="M58 101c0 30 40 34 70 22s48-30 72-6 22 22 42 4" {...STROKE} strokeDasharray="1 7" opacity="0.9" />
          <rect x="139" y="104" width="30" height="18" rx="4" {...STROKE} className="pi-accent" />
          <path d="M146 113h16" {...STROKE} className="pi-accent" />
          <Screen x={258} y={70} w={86} h={56} />
          <g className="pi-bad">
            <path d="M226 58h28M234 68h40M222 78h22M250 88h30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="290" cy="36" r="11" fill="currentColor" />
            <path d="M290 30v7M290 41.5v.5" stroke="#0a1430" strokeWidth="2.6" strokeLinecap="round" />
          </g>
        </>
      );
    // tudo desligado e religado, na torcida
    case "restart":
      return (
        <>
          <Camera x={70} y={118} />
          <SwitchBox x={160} y={124} />
          <Screen x={252} y={114} w={64} h={42} />
          <g className="pi-accent" {...STROKE} strokeWidth={3}>
            <path d="M118 62a46 46 0 0 1 84 0" />
            <path d="M202 62l2-16M202 62l-15-5" />
          </g>
          <g className="pi-bad" {...STROKE} strokeWidth={3}>
            <path d="M160 28v14" />
            <path d="M149 33a13 13 0 1 0 22 0" />
          </g>
          <g className="pi-bad" fill="currentColor" fontFamily="inherit" fontWeight="700" fontSize="22">
            <text x="96" y="52">?</text>
            <text x="216" y="40">?</text>
          </g>
        </>
      );
    // carrinho cheio de equipamento sem saber se funciona
    case "buy":
      return (
        <>
          <g {...STROKE}>
            <path d="M40 46h22l20 82h132l18-60H70" />
            <circle cx="98" cy="146" r="8" />
            <circle cx="198" cy="146" r="8" />
          </g>
          <g transform="translate(118 84)">
            <SwitchBox x={0} y={0} />
          </g>
          <g {...STROKE} transform="translate(186 82)">
            <rect x="-18" y="-14" width="36" height="24" rx="5" />
            <path d="M-8 -14l-6-12M8 -14l6-12" />
          </g>
          <g className="pi-bad" fill="currentColor" fontFamily="inherit" fontWeight="700">
            <text x="242" y="56" fontSize="34">?</text>
            <text x="272" y="88" fontSize="24">?</text>
            <text x="250" y="122" fontSize="18">?</text>
          </g>
        </>
      );
    // uma controladora de botões ligando mesa, live, luz e projeção pela rede
    case "automate":
      return (
        <>
          <g transform="translate(160 92)">
            <rect x="-46" y="-34" width="92" height="68" rx="10" {...STROKE} className="pi-accent" />
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={-36 + c * 19}
                  y={-24 + r * 17}
                  width="14"
                  height="12"
                  rx="3"
                  fill="currentColor"
                  className={(r + c) % 3 === 0 ? "pi-accent" : undefined}
                  opacity={(r + c) % 3 === 0 ? 1 : 0.55}
                />
              )),
            )}
          </g>
          <g {...STROKE} opacity="0.7" strokeDasharray="2 6">
            <path d="M114 74H76M114 110H76M206 74h38M206 110h38" />
          </g>
          {/* mesa de som */}
          <g transform="translate(46 70)" {...STROKE}>
            <rect x="-22" y="-14" width="44" height="28" rx="4" />
            <path d="M-12 -6v12M0 -6v12M12 -6v12" />
          </g>
          {/* live */}
          <g transform="translate(46 114)" {...STROKE}>
            <rect x="-20" y="-12" width="30" height="24" rx="5" />
            <path d="M10 -4l12-7v22l-12-7" />
          </g>
          {/* luz */}
          <g transform="translate(274 70)" {...STROKE}>
            <path d="M-10 4a12 12 0 1 1 20 0c-3 3-4 5-4 9h-12c0-4-1-6-4-9Z" />
            <path d="M-6 19h12" />
          </g>
          {/* projeção */}
          <g transform="translate(274 114)" {...STROKE}>
            <rect x="-24" y="-14" width="48" height="28" rx="4" />
          </g>
        </>
      );
  }
}

export default function ProblemIllo({ name }: { name: ProblemIlloName }) {
  return (
    <svg className={`pi pi--${name}`} viewBox="0 0 320 170" role="presentation" aria-hidden="true" focusable="false">
      <Scene name={name} />
    </svg>
  );
}
