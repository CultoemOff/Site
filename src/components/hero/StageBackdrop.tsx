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

/**
 * Aquário de bateria em perspectiva (ponto de fuga no centro do palco):
 * painel de fundo com espuma acústica, praticável, bateria, laterais e teto
 * de acrílico, painel frontal com reflexos e montantes de alumínio.
 */
function DrumBooth() {
  // cantos da frente (F) e do fundo (B)
  const F = { l: 1300, r: 1560, t: 508, b: 752 };
  const B = { l: 1244, r: 1470, t: 502, b: 718 };
  const edge = "rgba(170,200,255,0.34)";
  const edgeSoft = "rgba(150,180,255,0.16)";
  return (
    <g>
      {/* sombra no piso */}
      <ellipse cx={1405} cy={764} rx={170} ry={10} fill="#000" opacity={0.55} />

      {/* painel do fundo com espuma acústica */}
      <rect x={B.l} y={B.t} width={B.r - B.l} height={B.b - B.t} fill="url(#foam)" />
      <rect x={B.l} y={B.t} width={B.r - B.l} height={B.b - B.t} fill="url(#boothInnerShade)" />

      {/* praticável (piso interno) */}
      <path d={`M${B.l} ${B.b} H${B.r} L${F.r} ${F.b} H${F.l} Z`} fill="#0b1124" />
      <path d={`M${B.l} ${B.b} H${B.r}`} stroke="#1a2444" strokeWidth={1} />

      {/* ---- bateria ---- */}
      <g>
        {/* banco */}
        <line x1={1392} y1={700} x2={1392} y2={736} stroke="#141c33" strokeWidth={3} />
        <ellipse cx={1392} cy={698} rx={13} ry={4} fill="#0e1528" stroke="#26325a" strokeWidth={1} />

        {/* chimbal */}
        <line x1={1322} y1={671} x2={1322} y2={742} stroke="#1c2645" strokeWidth={1.8} />
        <path d="M1322 742 L1312 748 M1322 742 L1332 748" stroke="#1c2645" strokeWidth={1.5} />
        <ellipse cx={1322} cy={670} rx={19} ry={2.6} fill="url(#cymbal)" />
        <ellipse cx={1322} cy={675} rx={19} ry={2.6} fill="url(#cymbal)" opacity={0.8} />

        {/* caixa */}
        <path d="M1343 706 L1336 742 M1343 706 L1350 742" stroke="#1c2645" strokeWidth={1.4} />
        <rect x={1329} y={696} width={30} height={13} fill="url(#shell)" />
        <ellipse cx={1344} cy={709} rx={15} ry={3.6} fill="#0b1124" stroke="#2d3b6b" strokeWidth={1} />
        <ellipse cx={1344} cy={696} rx={15} ry={4} fill="#3a4a78" stroke="#5a70ad" strokeWidth={0.8} />

        {/* surdo */}
        <path d="M1447 728 L1444 744 M1471 728 L1474 744" stroke="#1c2645" strokeWidth={1.6} />
        <rect x={1440} y={684} width={38} height={46} fill="url(#shell)" />
        <ellipse cx={1459} cy={730} rx={19} ry={4.5} fill="#0b1124" stroke="#2d3b6b" strokeWidth={1} />
        <ellipse cx={1459} cy={684} rx={19} ry={5} fill="#34446f" stroke="#5a70ad" strokeWidth={0.8} />

        {/* bumbo */}
        <circle cx={1392} cy={713} r={27} fill="#0a1126" stroke="#34457a" strokeWidth={3} />
        <circle cx={1392} cy={713} r={21} fill="#101a3a" />
        <circle cx={1392} cy={713} r={21} fill="url(#kickHead)" />
        <circle cx={1399} cy={722} r={4} fill="#050914" />
        <path d="M1372 736 L1366 744 M1412 736 L1418 744" stroke="#1c2645" strokeWidth={2} />

        {/* tons */}
        <g transform="rotate(-12 1372 672)">
          <rect x={1358} y={672} width={28} height={20} fill="url(#shell)" />
          <ellipse cx={1372} cy={692} rx={14} ry={3.4} fill="#0b1124" stroke="#2d3b6b" strokeWidth={1} />
          <ellipse cx={1372} cy={672} rx={14} ry={4} fill="#34446f" stroke="#5a70ad" strokeWidth={0.8} />
        </g>
        <g transform="rotate(12 1412 672)">
          <rect x={1398} y={672} width={28} height={22} fill="url(#shell)" />
          <ellipse cx={1412} cy={694} rx={14} ry={3.4} fill="#0b1124" stroke="#2d3b6b" strokeWidth={1} />
          <ellipse cx={1412} cy={672} rx={14} ry={4} fill="#34446f" stroke="#5a70ad" strokeWidth={0.8} />
        </g>

        {/* ataque (crash) */}
        <path d="M1336 744 L1336 660 L1344 628" fill="none" stroke="#1c2645" strokeWidth={1.8} />
        <ellipse cx={1344} cy={627} rx={28} ry={4.6} fill="url(#cymbal)" transform="rotate(-9 1344 627)" />

        {/* condução (ride) */}
        <path d="M1486 744 L1486 668 L1474 640" fill="none" stroke="#1c2645" strokeWidth={1.8} />
        <ellipse cx={1472} cy={639} rx={31} ry={5} fill="url(#cymbal)" transform="rotate(8 1472 639)" />
      </g>

      {/* aresta interna direita (vista através do acrílico) */}
      <path d={`M${B.r} ${B.t} L${F.r} ${F.t} M${B.r} ${B.t} V${B.b}`} fill="none" stroke={edgeSoft} strokeWidth={1} />

      {/* lateral esquerda de acrílico */}
      <path
        d={`M${F.l} ${F.t} L${B.l} ${B.t} V${B.b} L${F.l} ${F.b} Z`}
        fill="url(#acrylicSide)"
        stroke={edge}
        strokeWidth={1}
      />
      {/* teto de acrílico */}
      <path d={`M${F.l} ${F.t} H${F.r} L${B.r} ${B.t} H${B.l} Z`} fill="rgba(170,200,255,0.07)" stroke={edgeSoft} strokeWidth={1} />

      {/* painel frontal */}
      <rect x={F.l} y={F.t} width={F.r - F.l} height={F.b - F.t} fill="url(#acrylicFront)" />
      {/* reflexos */}
      <path d={`M${F.l + 30} ${F.t} h26 l-70 ${F.b - F.t} h-26 Z`} fill="#dce8ff" opacity={0.055} transform="translate(60 0)" />
      <path d={`M${F.l + 150} ${F.t} h10 l-60 ${F.b - F.t} h-10 Z`} fill="#dce8ff" opacity={0.05} transform="translate(60 0)" />
      <path d={`M${F.r - 40} ${F.t} h36 l-50 ${F.b - F.t} h-36 Z`} fill="#dce8ff" opacity={0.035} />
      {/* emenda da porta */}
      <line x1={1452} y1={F.t + 4} x2={1452} y2={F.b - 4} stroke={edgeSoft} strokeWidth={1} />
      <rect x={1446} y={624} width={3} height={22} rx={1.5} fill="rgba(190,210,255,0.35)" />

      {/* montantes de alumínio */}
      <g fill="#131a2e">
        <rect x={F.l - 2} y={F.t - 2} width={4} height={F.b - F.t + 4} />
        <rect x={F.r - 2} y={F.t - 2} width={4} height={F.b - F.t + 4} />
        <rect x={F.l - 2} y={F.t - 3} width={F.r - F.l + 4} height={4} />
        <rect x={B.l - 1.5} y={B.t - 1.5} width={3} height={B.b - B.t + 3} />
      </g>
      <g stroke="rgba(190,215,255,0.45)" strokeWidth={0.8}>
        <line x1={F.l - 1} y1={F.t} x2={F.l - 1} y2={F.b} />
        <line x1={F.r + 1} y1={F.t} x2={F.r + 1} y2={F.b} />
        <line x1={F.l} y1={F.t - 2.5} x2={F.r} y2={F.t - 2.5} />
      </g>

      {/* base do praticável */}
      <rect x={F.l - 4} y={F.b} width={F.r - F.l + 8} height={9} fill="#0c1329" />
      <rect x={F.l - 4} y={F.b} width={F.r - F.l + 8} height={1} fill="#3a4c86" opacity={0.7} />
    </g>
  );
}

/** Amplificador combo + guitarra no suporte (lado esquerdo, abaixo da cruz). */
function GuitarRig() {
  return (
    <g>
      {/* sombras */}
      <ellipse cx={252} cy={764} rx={70} ry={6} fill="#000" opacity={0.55} />
      <ellipse cx={356} cy={766} rx={34} ry={4} fill="#000" opacity={0.5} />

      {/* amplificador combo */}
      <g>
        <path d="M232 684 C 232 674, 272 674, 272 684" fill="none" stroke="#1b2440" strokeWidth={4} strokeLinecap="round" />
        <rect x={196} y={684} width={112} height={78} rx={5} fill="#090d18" stroke="#222c4a" strokeWidth={1.2} />
        <rect x={200} y={688} width={104} height={14} rx={2} fill="#121a2e" />
        {[212, 224, 236, 248, 260, 272].map((x) => (
          <circle key={x} cx={x} cy={695} r={2.4} fill="#33416b" />
        ))}
        <circle cx={292} cy={695} r={1.8} fill="#5bd0ff" />
        <circle cx={292} cy={695} r={4.5} fill="#5bd0ff" opacity={0.18} />
        <rect x={202} y={706} width={100} height={50} rx={2} fill="url(#grilleCloth)" />
        <rect x={202} y={706} width={100} height={50} rx={2} fill="url(#ampShade)" />
        <rect x={238} y={710} width={28} height={6} rx={1.5} fill="#1e2848" />
        {[
          [196, 684],
          [300, 684],
          [196, 754],
          [300, 754],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={8} height={8} rx={2} fill="#161e36" />
        ))}
        <rect x={196} y={684} width={112} height={1} fill="#4a5f9e" opacity={0.5} />
      </g>

      {/* cabo e pedal */}
      <path d="M357 750 C 352 776, 330 772, 322 764 C 314 756, 300 756, 296 748" fill="none" stroke="#161e36" strokeWidth={2} />
      <rect x={314} y={758} width={20} height={9} rx={2} fill="#101830" stroke="#2a3657" strokeWidth={0.8} />
      <circle cx={330} cy={761} r={1.3} fill="#5bd0ff" />

      {/* guitarra no suporte */}
      <g transform="translate(356 762) rotate(-9)">
        {/* suporte */}
        <path d="M-22 4 L0 -60 L22 4" fill="none" stroke="#1a2340" strokeWidth={2.4} />
        <path d="M0 -60 V-128" stroke="#1a2340" strokeWidth={2} />
        <path d="M-6 -128 H6" stroke="#1a2340" strokeWidth={3} strokeLinecap="round" />
        {/* braço e mão */}
        <rect x={-3.6} y={-168} width={7.2} height={108} rx={1.5} fill="#1a1f33" stroke="#2d3a66" strokeWidth={0.6} />
        {[-150, -138, -126, -114, -102, -90, -80].map((y) => (
          <line key={y} x1={-3.4} y1={y} x2={3.4} y2={y} stroke="#46578a" strokeWidth={0.5} />
        ))}
        <path d="M-5 -168 L-7 -190 C -7 -194, 6 -196, 8 -192 L5 -168 Z" fill="#141a2d" stroke="#2d3a66" strokeWidth={0.8} />
        {/* corpo */}
        <path
          d="M0 0 C -26 0 -36 -10 -34 -28 C -33 -38 -26 -42 -24 -50 C -23 -58 -32 -66 -30 -78 C -28 -88 -18 -86 -14 -76 C -10 -68 -6 -66 0 -66 C 6 -66 10 -70 12 -80 C 15 -92 26 -90 26 -80 C 26 -70 22 -60 24 -50 C 26 -40 34 -36 34 -24 C 34 -8 22 0 0 0 Z"
          fill="url(#guitarBody)"
          stroke="#4a64b0"
          strokeWidth={1}
        />
        <path
          d="M-4 -6 C -22 -8 -26 -20 -22 -32 C -18 -44 -12 -48 -10 -60 C -6 -62 -2 -62 2 -62 L4 -40 C 12 -34 14 -18 8 -10 Z"
          fill="#d6e0f5"
          opacity={0.22}
        />
        {[-52, -40, -28].map((y) => (
          <rect key={y} x={-7} y={y} width={14} height={4} rx={1.5} fill="#0b0f1c" stroke="#3a4a78" strokeWidth={0.5} />
        ))}
        <rect x={-8} y={-17} width={16} height={4} rx={1} fill="#6a7cb0" opacity={0.7} />
        {[-1.6, 0, 1.6].map((x) => (
          <line key={x} x1={x} y1={-15} x2={x * 0.8} y2={-168} stroke="#b9c8ee" strokeWidth={0.25} opacity={0.6} />
        ))}
        <circle cx={18} cy={-12} r={2} fill="#3a4a78" />
        <circle cx={22} cy={-20} r={2} fill="#3a4a78" />
      </g>
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
        {/* aquário de bateria */}
        <pattern id="foam" patternUnits="userSpaceOnUse" width="16" height="16">
          <rect width="16" height="16" fill="#080c18" />
          <path d="M0 16 L8 2 L16 16 Z" fill="#0c1222" />
          <path d="M8 2 L16 16" stroke="#141c33" strokeWidth="0.8" />
        </pattern>
        <linearGradient id="boothInnerShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d3c9e" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="acrylicFront" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8c4ff" stopOpacity="0.09" />
          <stop offset="0.45" stopColor="#7fa2ff" stopOpacity="0.03" />
          <stop offset="1" stopColor="#a8c4ff" stopOpacity="0.07" />
        </linearGradient>
        <linearGradient id="acrylicSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b8ceff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#6f90ff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="shell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a1022" />
          <stop offset="0.35" stopColor="#1a2750" />
          <stop offset="0.6" stopColor="#0e1630" />
          <stop offset="1" stopColor="#070b18" />
        </linearGradient>
        <radialGradient id="kickHead" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#3a58b0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#0a1126" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cymbal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a3765" />
          <stop offset="0.5" stopColor="#7d93d6" />
          <stop offset="1" stopColor="#2a3765" />
        </linearGradient>
        {/* amplificador e guitarra */}
        <pattern id="grilleCloth" patternUnits="userSpaceOnUse" width="3" height="3">
          <rect width="3" height="3" fill="#121829" />
          <path d="M0 0 L3 3 M3 0 L0 3" stroke="#1d2640" strokeWidth="0.6" />
        </pattern>
        <linearGradient id="ampShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b6bff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="guitarBody" cx="0.45" cy="0.7" r="0.75">
          <stop offset="0" stopColor="#2a4aa8" />
          <stop offset="0.6" stopColor="#15245a" />
          <stop offset="1" stopColor="#070c1e" />
        </radialGradient>
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
      <GuitarRig />
      <DrumBooth />

      {/* pedestal de microfone e amplificador */}
      <g transform="translate(-62 0)">
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
