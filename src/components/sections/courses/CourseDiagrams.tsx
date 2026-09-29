import type { CourseDiagram } from "@/config/courses";

/**
 * Diagramas animados das formações (SVG + CSS/SMIL, decorativos).
 * Cada um mostra o "porquê" do conteúdo, não só o "onde clicar".
 */

function Box({ x, y, w, h, label, sub, tone = "base" }: { x: number; y: number; w: number; h: number; label: string; sub?: string; tone?: "base" | "hot" | "soft" }) {
  return (
    <g className={`cd-box cd-box--${tone}`}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={8} />
      <text x={x} y={y + 4} textAnchor="middle" className="cd-box__label">
        {label}
      </text>
      {sub && (
        <text x={x} y={y + h / 2 + 15} textAnchor="middle" className="cd-box__sub">
          {sub}
        </text>
      )}
    </g>
  );
}

function Packet({ path, dur, begin = "0s", tone = "a" }: { path: string; dur: number; begin?: string; tone?: "a" | "b" }) {
  return (
    <circle r={4} className={`cd-packet cd-packet--${tone} fx-motion`}>
      <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function NetworkDiagram() {
  const toAudio = "M60 130 H200 C 262 130, 262 64, 330 64 H470";
  const toVideo = "M60 130 H200 C 262 130, 262 196, 330 196 H470";
  return (
    <svg viewBox="0 0 530 250" className="cd-svg">
      <path d={toAudio} className="cd-link" />
      <path d={toVideo} className="cd-link" />
      <Packet path={toAudio} dur={3.4} tone="a" />
      <Packet path={toAudio} dur={3.4} begin="1.7s" tone="a" />
      <Packet path={toVideo} dur={3.4} begin="0.85s" tone="b" />
      <Packet path={toVideo} dur={3.4} begin="2.55s" tone="b" />
      <Box x={60} y={130} w={72} h={40} label="IP" sub="endereço" />
      <Box x={200} y={130} w={84} h={40} label="REDE" sub="switch" tone="hot" />
      <Box x={330} y={64} w={80} h={36} label="DANTE" />
      <Box x={330} y={196} w={80} h={36} label="NDI" />
      <Box x={470} y={64} w={80} h={36} label="ÁUDIO" tone="soft" />
      <Box x={470} y={196} w={80} h={36} label="VÍDEO" tone="soft" />
    </svg>
  );
}

function LiveDiagram() {
  const blocks = [
    { x: 50, y: 56, l: "MESA", tone: "hot" as const },
    { x: 162, y: 56, l: "MIX LIVE" },
    { x: 282, y: 56, l: "INTERFACE" },
    { x: 282, y: 150, l: "PC · OBS" },
    { x: 150, y: 150, l: "STREAMING", tone: "soft" as const },
  ];
  const path = "M50 56 H282 C 336 56, 336 150, 282 150 H150";
  return (
    <svg viewBox="0 0 350 200" className="cd-svg">
      <path d={path} className="cd-link" />
      <Packet path={path} dur={3.4} />
      <Packet path={path} dur={3.4} begin="1.7s" />
      {blocks.map((b) => (
        <Box key={b.l} x={b.x} y={b.y} w={b.l.length > 6 ? 96 : 72} h={34} label={b.l} tone={b.tone ?? "base"} />
      ))}
      {/* medidores da mix da live */}
      <g transform="translate(24 116)">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 12} 0)`}>
            <rect width={7} height={52} rx={2} className="cd-ch" />
            <rect width={7} height={52} rx={2} className="cd-ch__lvl" style={{ "--i": i * 2 } as React.CSSProperties} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function AnalogDiagram() {
  const steps = [
    { y: 26, l: "INPUT" },
    { y: 62, l: "GAIN" },
    { y: 98, l: "EQ" },
    { y: 134, l: "AUX" },
    { y: 176, l: "MASTER" },
  ];
  return (
    <svg viewBox="0 0 350 200" className="cd-svg">
      {/* canal da mesa */}
      <rect x={150} y={8} width={56} height={186} rx={8} className="cd-strip" />
      <circle cx={178} cy={26} r={6} className="cd-jack" />
      {[62, 88, 104, 120, 140].map((y, i) => (
        <g key={y} transform={`translate(178 ${y})`}>
          <circle r={i === 0 ? 9 : 7} className={`cd-knob${i === 0 ? " cd-knob--gain" : ""}`} />
          <line x1={0} y1={0} x2={0} y2={i === 0 ? -8 : -6} className={`cd-knob__ptr cd-knob__ptr--${i}`} />
        </g>
      ))}
      <rect x={174} y={156} width={8} height={32} rx={3} className="cd-fader-track" />
      <rect x={168} y={166} width={20} height={9} rx={2} className="cd-fader" />
      {/* sinal descendo */}
      <path d="M140 20 V186" className="cd-link" />
      <Packet path="M140 20 V186" dur={3.2} />
      {steps.map((s) => (
        <g key={s.l}>
          <line x1={214} y1={s.y} x2={244} y2={s.y} className="cd-leader" />
          <text x={252} y={s.y + 4} className="cd-step">
            {s.l}
          </text>
        </g>
      ))}
      <text x={20} y={104} className="cd-note">
        sinal
      </text>
      <path d="M58 100 H128" className="cd-leader" />
    </svg>
  );
}

function CompanionDiagram() {
  const targets = [
    { y: 34, l: "OBS · cena" },
    { y: 80, l: "PTZ · preset" },
    { y: 126, l: "Luz · cena" },
    { y: 172, l: "+ outra ação" },
  ];
  const from = { x: 118, y: 103 };
  return (
    <svg viewBox="0 0 350 206" className="cd-svg">
      {/* Stream Deck */}
      <rect x={10} y={40} width={148} height={126} rx={12} className="cd-deck" />
      {Array.from({ length: 8 }, (_, i) => {
        const cx = 36 + (i % 4) * 32;
        const cy = 71 + Math.floor(i / 4) * 32;
        const hot = i === 7;
        return <rect key={i} x={cx - 12} y={cy - 12} width={24} height={24} rx={5} className={`cd-key${hot ? " cd-key--hot" : ""}`} />;
      })}
      <text x={84} y={154} textAnchor="middle" className="cd-note">
        1 botão
      </text>
      {targets.map((t, i) => {
        const d = `M${from.x} ${from.y} C 190 ${from.y}, 190 ${t.y}, 236 ${t.y}`;
        return (
          <g key={t.l}>
            <path d={d} className="cd-link" />
            <circle r={3.5} className="cd-packet cd-packet--a fx-motion" opacity={0}>
              <animateMotion dur="3s" repeatCount="indefinite" path={d} keyPoints="0;0;1;1" keyTimes="0;0.12;0.5;1" calcMode="linear" />
              <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.12;0.48;0.52;1" />
            </circle>
            <g className="cd-target" style={{ "--i": i } as React.CSSProperties}>
              <rect x={236} y={t.y - 14} width={108} height={28} rx={7} />
              <text x={290} y={t.y + 4} textAnchor="middle">
                {t.l}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

function DmxDiagram() {
  const fixtures = [
    { x: 150, addr: "@001", l: "MOVING" },
    { x: 226, addr: "@017", l: "PAR" },
    { x: 302, addr: "@025", l: "PAR" },
  ];
  const cable = "M62 70 H302";
  return (
    <svg viewBox="0 0 350 200" className="cd-svg">
      <rect x={14} y={48} width={70} height={44} rx={6} className="cd-box-plain" />
      <text x={49} y={75} textAnchor="middle" className="cd-box__label">
        grandMA2
      </text>
      <path d={cable} className="cd-link" />
      <Packet path={cable} dur={2.4} tone="b" />
      <Packet path={cable} dur={2.4} begin="1.2s" tone="b" />
      {fixtures.map((f, i) => (
        <g key={f.addr}>
          <rect x={f.x - 24} y={46} width={48} height={48} rx={8} className="cd-fixture" />
          <circle cx={f.x} cy={70} r={11} className={`cd-fixture__lens cd-fixture__lens--${i}`} />
          <text x={f.x} y={112} textAnchor="middle" className="cd-box__sub">
            {f.l} {f.addr}
          </text>
        </g>
      ))}
      {/* canais */}
      <g transform="translate(20 132)">
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`translate(${i * 26} 0)`}>
            <rect width={16} height={48} rx={3} className="cd-ch" />
            <rect y={0} width={16} height={48} rx={3} className="cd-ch__lvl" style={{ "--i": i } as React.CSSProperties} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function CourseDiagramView({ type }: { type: CourseDiagram }) {
  return (
    <div className={`cd cd--${type}`} aria-hidden="true">
      {type === "network" && <NetworkDiagram />}
      {type === "live" && <LiveDiagram />}
      {type === "analog" && <AnalogDiagram />}
      {type === "companion" && <CompanionDiagram />}
      {type === "dmx" && <DmxDiagram />}
    </div>
  );
}
