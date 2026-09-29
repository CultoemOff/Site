import { STAGE_SCREEN_LOGO_SRC } from "@/config/site";

/**
 * Palco estilizado (estático) em SVG — inspirado em um auditório de igreja
 * contemporânea: treliça com refletores, painel ripado de madeira, cruz com
 * retroiluminação, telão de LED, púlpito de acrílico, PA, bateria e degraus.
 *
 * Coordenadas: viewBox 1600 × 900 (o mesmo sistema usado por StageLights).
 * Todo o desenho é decorativo (aria-hidden).
 */

const PAR_CANS = [150, 312, 478, 1122, 1288, 1450];
const LED_BARS = [560, 720, 880, 1040];

function Truss() {
  const x1 = 90;
  const x2 = 1510;
  const top = 62;
  const bottom = 84;
  const step = 22;
  const zig: string[] = [];
  for (let x = x1, i = 0; x < x2; x += step, i++) {
    zig.push(`${x},${i % 2 === 0 ? top : bottom}`);
  }
  return (
    <g>
      {/* hastes de fixação no teto */}
      {[180, 520, 800, 1080, 1420].map((x) => (
        <line key={x} x1={x} y1={0} x2={x} y2={top} stroke="#141a2a" strokeWidth={3} />
      ))}
      <rect x={x1} y={top - 3} width={x2 - x1} height={5} rx={2} fill="#1a2133" />
      <rect x={x1} y={bottom - 2} width={x2 - x1} height={5} rx={2} fill="#1a2133" />
      <polyline points={zig.join(" ")} fill="none" stroke="#141b2c" strokeWidth={2} />
      <rect x={x1} y={top - 3} width={x2 - x1} height={1.2} fill="#34436b" opacity={0.6} />
    </g>
  );
}

function ParCan({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 86)`}>
      <rect x={-3} y={0} width={6} height={8} fill="#141a2a" />
      <path d="M-15 8 H15 L13 34 H-13 Z" fill="#0c1120" stroke="#222c45" strokeWidth={1} />
      {/* bandeiras (barn doors) */}
      <path d="M-13 34 L-22 44 M13 34 L22 44" stroke="#1b2338" strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={0} cy={35} rx={12} ry={3.2} fill="url(#parLens)" />
    </g>
  );
}

function LineArray({ x, flip = false }: { x: number; flip?: boolean }) {
  const boxes = Array.from({ length: 6 }, (_, i) => i);
  return (
    <g transform={`translate(${x} 150) ${flip ? "scale(-1 1)" : ""}`}>
      <rect x={-34} y={-8} width={68} height={8} fill="#161d2e" />
      <line x1={-20} y1={-150} x2={-20} y2={-8} stroke="#141a2a" strokeWidth={2} />
      <line x1={20} y1={-150} x2={20} y2={-8} stroke="#141a2a" strokeWidth={2} />
      {boxes.map((i) => {
        const tilt = i * i * 0.9;
        const y = i * 29;
        return (
          <g key={i} transform={`translate(${i * i * 0.6} ${y}) rotate(${tilt})`}>
            <path d="M-36 0 H36 L32 26 H-32 Z" fill="#0a0e19" stroke="#1d2640" strokeWidth={1} />
            <rect x={-28} y={6} width={56} height={14} rx={2} fill="url(#grille)" opacity={0.9} />
          </g>
        );
      })}
    </g>
  );
}

function Cross() {
  const d =
    "M246 282 H270 V358 H340 V382 H270 V578 H246 V382 H176 V358 H246 Z";
  return (
    <g>
      <path d={d} fill="#ffcf85" filter="url(#crossBlur)" opacity={0.55} />
      <path d={d} fill="#ffcf85" filter="url(#crossBlurTight)" opacity={0.75} />
      <path d={d} fill="#0e0c0b" />
      <path d={d} fill="none" stroke="#ffcf85" strokeOpacity={0.35} strokeWidth={1} />
    </g>
  );
}

function DrumBooth() {
  return (
    <g>
      {/* cabine de acrílico */}
      <path d="M1318 500 H1540 V702 H1318 Z" fill="rgba(120,150,255,0.035)" stroke="rgba(150,180,255,0.16)" strokeWidth={1.5} />
      <path d="M1318 500 L1300 520 V706" fill="none" stroke="rgba(150,180,255,0.12)" strokeWidth={1.5} />
      <line x1={1318} y1={506} x2={1540} y2={506} stroke="rgba(170,200,255,0.14)" strokeWidth={1} />
      {/* bateria (silhuetas) */}
      <circle cx={1430} cy={664} r={34} fill="#070b16" stroke="#1f2847" strokeWidth={2} />
      <circle cx={1430} cy={664} r={10} fill="#0c1222" />
      <ellipse cx={1382} cy={612} rx={20} ry={9} fill="#0a0f1d" stroke="#1f2847" strokeWidth={1.5} />
      <ellipse cx={1476} cy={610} rx={22} ry={10} fill="#0a0f1d" stroke="#1f2847" strokeWidth={1.5} />
      <line x1={1352} y1={560} x2={1352} y2={700} stroke="#1c2542" strokeWidth={2} />
      <ellipse cx={1352} cy={560} rx={30} ry={4} fill="#28324f" />
      <line x1={1510} y1={548} x2={1510} y2={700} stroke="#1c2542" strokeWidth={2} />
      <ellipse cx={1510} cy={548} rx={34} ry={4.5} fill="#28324f" />
    </g>
  );
}

function Pulpit() {
  return (
    <g>
      {/* reflexo no piso */}
      <ellipse cx={800} cy={748} rx={70} ry={8} fill="#000" opacity={0.5} />
      <path
        d="M742 612 H858 L846 746 H754 Z"
        fill="rgba(170,200,255,0.07)"
        stroke="rgba(190,215,255,0.45)"
        strokeWidth={1.5}
      />
      <path d="M736 604 H864 L858 616 H742 Z" fill="rgba(200,220,255,0.18)" stroke="rgba(210,225,255,0.5)" strokeWidth={1} />
      <line x1={770} y1={622} x2={764} y2={740} stroke="rgba(220,235,255,0.18)" strokeWidth={3} />
      {/* microfone gooseneck */}
      <path d="M826 606 C 826 588, 820 582, 808 578" fill="none" stroke="#1f2847" strokeWidth={2} />
      <rect x={800} y={574} width={10} height={6} rx={2} fill="#1d2744" />
    </g>
  );
}

function Wedge({ x, flip = false }: { x: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} 758) ${flip ? "scale(-1 1)" : ""}`}>
      <path d="M-30 12 L-22 -10 H30 V12 Z" fill="#080c17" stroke="#1d2640" strokeWidth={1} />
      <rect x={-18} y={-6} width={42} height={12} rx={2} fill="url(#grille)" opacity={0.7} />
    </g>
  );
}

function Waveform() {
  // linha de sinal (inspirada na vinheta do canal) atravessando o telão
  const left =
    "M470 446 H560 L570 440 L578 452 L588 446 H612 L620 380 L630 500 L640 432 L648 446 H680 L688 438 L696 452 L704 446 H720";
  const right =
    "M880 446 H896 L904 438 L912 452 L920 446 H952 L960 396 L970 492 L980 436 L988 446 H1016 L1024 440 L1032 452 L1040 446 H1130";
  return (
    <g className="stage-screen__wave" fill="none" stroke="#5b9dff" strokeWidth={1.6} strokeLinejoin="round">
      <path d={left} pathLength={1} />
      <path d={right} pathLength={1} />
    </g>
  );
}

export default function StageBackdrop() {
  return (
    <svg
      className="stage-backdrop"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ceilingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020409" />
          <stop offset="1" stopColor="#060a15" />
        </linearGradient>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1020" />
          <stop offset="1" stopColor="#060a15" />
        </linearGradient>
        <linearGradient id="slatGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0f121c" />
          <stop offset="0.5" stopColor="#171b27" />
          <stop offset="1" stopColor="#0e111a" />
        </linearGradient>
        <pattern id="slats" patternUnits="userSpaceOnUse" width="18" height="900">
          <rect width="18" height="900" fill="#07090f" />
          <rect x="1" width="13" height="900" fill="url(#slatGrad)" />
        </pattern>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1633" />
          <stop offset="1" stopColor="#070c1d" />
        </linearGradient>
        <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1128" />
          <stop offset="1" stopColor="#050815" />
        </linearGradient>
        <radialGradient id="screenGrad" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0" stopColor="#0f1d44" />
          <stop offset="0.6" stopColor="#091230" />
          <stop offset="1" stopColor="#050a1c" />
        </radialGradient>
        <pattern id="ledGrid" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="0.8" />
        </pattern>
        <radialGradient id="parLens" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9fc2ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3b8cff" stopOpacity="0.1" />
        </radialGradient>
        <pattern id="grille" patternUnits="userSpaceOnUse" width="3" height="3">
          <rect width="3" height="3" fill="#0b1020" />
          <circle cx="1.5" cy="1.5" r="0.7" fill="#1b2440" />
        </pattern>
        <radialGradient id="wallWash" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#2f6bff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="crossWash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffcf85" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffcf85" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ledDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6ea4ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#6ea4ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="screenReflection" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c5cff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2c5cff" stopOpacity="0" />
        </linearGradient>
        <filter id="crossBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="crossBlurTight" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* teto */}
      <rect width="1600" height="160" fill="url(#ceilingGrad)" />
      <rect x="360" y="18" width="150" height="26" rx="3" fill="#070b16" stroke="#0e1426" />
      <rect x="1090" y="18" width="150" height="26" rx="3" fill="#070b16" stroke="#0e1426" />

      {/* parede do fundo */}
      <rect y="150" width="1600" height="560" fill="url(#wallGrad)" />
      {/* sanca com fita de LED */}
      <rect y="150" width="1600" height="22" fill="#0b1122" />
      <rect y="170" width="1600" height="2" fill="#6ea4ff" opacity="0.5" />
      <rect y="166" width="1600" height="10" fill="#3b8cff" opacity="0.2" filter="url(#softGlow)" />

      {/* painéis ripados */}
      <rect x="40" y="176" width="420" height="530" fill="url(#slats)" opacity="0.75" />
      <rect x="1140" y="176" width="420" height="530" fill="url(#slats)" opacity="0.75" />
      <rect x="40" y="176" width="420" height="330" fill="url(#wallWash)" />
      <rect x="1140" y="176" width="420" height="330" fill="url(#wallWash)" />
      <rect x="90" y="220" width="330" height="420" fill="url(#crossWash)" />

      <Cross />
      <DrumBooth />

      {/* painel central atrás do telão */}
      <rect x="460" y="176" width="680" height="530" fill="#050913" />

      {/* vara com barras de LED acima do telão */}
      <rect x="500" y="198" width="600" height="4" fill="#161d30" />
      {LED_BARS.map((x) => (
        <g key={x}>
          <path d={`M${x - 40} 224 L${x + 40} 224 L${x + 70} 330 L${x - 70} 330 Z`} fill="url(#ledDown)" opacity="0.5" />
          <rect x={x - 36} y="204" width="72" height="18" rx="2" fill="#0c1222" stroke="#232d4a" />
          <rect x={x - 30} y="216" width="60" height="4" rx="1" fill="#a8c6ff" opacity="0.85" />
        </g>
      ))}

      {/* brilho do telão na parede */}
      <rect x="440" y="236" width="720" height="420" rx="20" fill="#1f4dff" opacity="0.12" filter="url(#softGlow)" />

      {/* telão de LED */}
      <rect x="462" y="250" width="676" height="392" rx="4" fill="#020308" />
      <rect x="470" y="258" width="660" height="376" fill="url(#screenGrad)" />
      <g className="stage-screen__content">
        <Waveform />
        <image
          href={STAGE_SCREEN_LOGO_SRC}
          x="690"
          y="336"
          width="220"
          height="220"
          preserveAspectRatio="xMidYMid meet"
          className="stage-screen__logo"
        />
      </g>
      <rect x="470" y="258" width="660" height="376" fill="url(#ledGrid)" />
      <rect x="470" y="258" width="660" height="2" fill="#fff" opacity="0.05" />

      {/* PA line array */}
      <LineArray x={1470} flip />
      <LineArray x={130} />

      <Truss />
      {PAR_CANS.map((x) => (
        <ParCan key={x} x={x} />
      ))}

      {/* piso do palco */}
      <rect y="702" width="1600" height="72" fill="url(#floorGrad)" />
      <rect x="470" y="702" width="660" height="64" fill="url(#screenReflection)" />
      <rect y="702" width="1600" height="1.5" fill="#26345e" opacity="0.8" />

      <Pulpit />

      {/* pedestal de microfone e amplificador */}
      <g>
        <line x1="1196" y1="600" x2="1210" y2="760" stroke="#1f2945" strokeWidth={2.5} />
        <line x1="1196" y1="600" x2="1172" y2="592" stroke="#1f2945" strokeWidth={2.5} />
        <path d="M1194 760 L1210 748 L1226 760" fill="none" stroke="#1f2945" strokeWidth={2} />
        <rect x="1240" y="704" width="62" height="54" rx="3" fill="#080c17" stroke="#1d2640" />
        <rect x="1246" y="716" width="50" height="34" rx="2" fill="url(#grille)" />
      </g>
      <Wedge x={620} />
      <Wedge x={980} flip />

      {/* borda do palco com LED */}
      <rect y="774" width="1600" height="10" fill="#0a1024" />
      <rect y="782" width="1600" height="1.5" fill="#3b8cff" opacity="0.7" />
      <rect y="778" width="1600" height="10" fill="#3b8cff" opacity="0.18" filter="url(#softGlow)" />

      {/* degraus */}
      <rect y="784" width="1600" height="116" fill="url(#stepGrad)" />
      {[812, 846, 880].map((y) => (
        <g key={y}>
          <rect y={y} width="1600" height="3" fill="#18234a" opacity="0.8" />
          <rect y={y + 3} width="1600" height="8" fill="#03050c" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}
