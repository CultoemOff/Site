import type { EquipmentIcon as Icon } from "@/config/equipment";

/**
 * Ilustrações em traço (sem marcas) usadas quando o equipamento não tem foto.
 * Os LEDs (.eq-led) piscam em sequência para dar vida ao card.
 */
export default function EquipmentIcon({ icon }: { icon: Icon }) {
  return (
    <svg className="eq-icon" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
      {ICONS[icon] ?? ICONS.cable}
    </svg>
  );
}

const led = (cx: number, cy: number, i: number, r = 2.6) => (
  <circle key={`${cx}-${cy}`} className="eq-led" cx={cx} cy={cy} r={r} style={{ "--l": i } as React.CSSProperties} />
);

const ICONS: Record<Icon, React.ReactNode> = {
  mic: (
    <g className="eq-stroke">
      {/* dois bastões */}
      <g transform="rotate(-18 62 58)">
        <rect x="52" y="14" width="22" height="24" rx="11" />
        <path d="M54 26h18M54 20h18M54 32h18" className="eq-thin" />
        <path d="M55 38h16l-3 52a5 5 0 0 1-10 0z" />
        <path d="M58 70h10" className="eq-thin" />
      </g>
      <g transform="rotate(14 104 58)">
        <rect x="93" y="14" width="22" height="24" rx="11" />
        <path d="M95 26h18M95 20h18M95 32h18" className="eq-thin" />
        <path d="M96 38h16l-3 52a5 5 0 0 1-10 0z" />
        <path d="M99 70h10" className="eq-thin" />
      </g>
      {/* ondas de rádio */}
      <path className="eq-wave" d="M30 30a26 26 0 0 0 0 30" style={{ "--l": 0 } as React.CSSProperties} />
      <path className="eq-wave" d="M22 24a36 36 0 0 0 0 42" style={{ "--l": 1 } as React.CSSProperties} />
      <path className="eq-wave" d="M134 30a26 26 0 0 1 0 30" style={{ "--l": 0 } as React.CSSProperties} />
      <path className="eq-wave" d="M142 24a36 36 0 0 1 0 42" style={{ "--l": 1 } as React.CSSProperties} />
      {led(66, 76, 0, 2.2)}
      {led(101, 76, 2, 2.2)}
    </g>
  ),
  rack: (
    <g className="eq-stroke">
      <rect x="18" y="22" width="124" height="66" rx="6" />
      <path d="M10 26h8v24h-8zM142 26h8v24h-8z" />
      <circle cx="14" cy="32" r="1.6" className="eq-fill" />
      <circle cx="146" cy="32" r="1.6" className="eq-fill" />
      {/* mesa no rack */}
      <rect x="26" y="30" width="108" height="26" rx="3" />
      {[36, 48, 60, 72].map((x) => (
        <circle key={x} cx={x} cy="43" r="4.2" className="eq-thin" />
      ))}
      <rect x="84" y="36" width="42" height="14" rx="2" className="eq-thin" />
      {/* gaveta */}
      <rect x="26" y="62" width="108" height="18" rx="3" />
      <path d="M68 71h24" />
      {led(122, 43, 0)}
      {led(114, 43, 1)}
      {led(106, 43, 2)}
    </g>
  ),
  switch: (
    <g className="eq-stroke">
      <rect x="10" y="32" width="140" height="44" rx="6" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect x={26 + i * 14} y="42" width="10" height="9" rx="1.5" className="eq-thin" />
          <rect x={26 + i * 14} y="56" width="10" height="9" rx="1.5" className="eq-thin" />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => led(31 + i * 14, 38.5, i, 1.6))}
      {led(18, 54, 3, 2.4)}
      <path d="M28 76v10M58 76v14M88 76v10M118 76v14" className="eq-thin eq-cable" />
    </g>
  ),
  power: (
    <g className="eq-stroke">
      <rect x="14" y="36" width="124" height="36" rx="8" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={36 + i * 22} cy="54" r="8" className="eq-thin" />
          <circle cx={33 + i * 22} cy="54" r="1.4" className="eq-fill" />
          <circle cx={39 + i * 22} cy="54" r="1.4" className="eq-fill" />
        </g>
      ))}
      <rect x="120" y="46" width="10" height="16" rx="2" className="eq-thin" />
      {led(125, 50, 0, 2)}
      <path d="M138 54c10 0 10 20 20 20" className="eq-thin eq-cable" />
    </g>
  ),
  camera: (
    <g className="eq-stroke">
      <rect x="56" y="80" width="48" height="12" rx="4" />
      <path d="M64 80v-8h32v8" />
      <rect x="50" y="22" width="60" height="50" rx="18" />
      <circle cx="80" cy="47" r="15" />
      <circle cx="80" cy="47" r="7" className="eq-thin" />
      {led(98, 30, 0)}
    </g>
  ),
  light: (
    <g className="eq-stroke">
      <rect x="54" y="80" width="52" height="12" rx="3" />
      <path d="M62 80V62M98 80V62" />
      <rect x="58" y="24" width="44" height="40" rx="10" />
      <circle cx="80" cy="44" r="12" />
      <path className="eq-wave" d="M72 24l-18-18M88 24l18-18M80 22V4" style={{ "--l": 0 } as React.CSSProperties} />
      {led(80, 86, 1)}
    </g>
  ),
  cable: (
    <g className="eq-stroke">
      <circle cx="54" cy="55" r="22" />
      <circle cx="46" cy="50" r="3" className="eq-thin" />
      <circle cx="62" cy="50" r="3" className="eq-thin" />
      <circle cx="54" cy="64" r="3" className="eq-thin" />
      <path d="M76 55h14c20 0 20-26 40-26h16" className="eq-cable" />
      {led(54, 38, 0, 2)}
    </g>
  ),
};
