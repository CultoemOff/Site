/**
 * Ilustrações da página de venda de Redes (decorativas, sem marcas):
 *  - TopologyIllo: a cabine técnica com rack, câmeras, computadores e Wi-Fi
 *  - DhcpScreenIllo: tela de configuração de rede de um equipamento (DHCP × IP fixo)
 *  - TerminalIllo: prompt de comando com ipconfig e ping
 */

type Node = { x: number; y: number; label: string; ip: string; kind: "ptz" | "pc" | "mixer" | "ap" | "phone" };

const RACK = { x: 300, y: 150, w: 150, h: 190 };
const SWITCH_Y = RACK.y + 78;

const NODES: Node[] = [
  { x: 96, y: 70, label: "Câmera PTZ 1", ip: ".51", kind: "ptz" },
  { x: 96, y: 200, label: "Câmera PTZ 2", ip: ".52", kind: "ptz" },
  { x: 96, y: 330, label: "Mesa digital", ip: ".30", kind: "mixer" },
  { x: 640, y: 70, label: "PC da live", ip: ".10", kind: "pc" },
  { x: 640, y: 200, label: "PC da projeção", ip: ".11", kind: "pc" },
  { x: 640, y: 330, label: "Wi-Fi da técnica", ip: ".2", kind: "ap" },
];

function Glyph({ kind }: { kind: Node["kind"] }) {
  switch (kind) {
    case "ptz":
      return (
        <g>
          <rect x="-16" y="-14" width="32" height="24" rx="9" />
          <circle cx="0" cy="-2" r="7" />
          <rect x="-12" y="12" width="24" height="5" rx="2" />
        </g>
      );
    case "pc":
      return (
        <g>
          <rect x="-18" y="-14" width="36" height="24" rx="3" />
          <path d="M-8 16h16M0 10v6" />
        </g>
      );
    case "mixer":
      return (
        <g>
          <rect x="-18" y="-12" width="36" height="24" rx="3" />
          <path d="M-10 -6v12M-2 -6v12M6 -6v12M14 -6v12" className="illo-thin" />
        </g>
      );
    case "ap":
      return (
        <g>
          <rect x="-16" y="2" width="32" height="10" rx="4" />
          <path d="M-9 -4a12 12 0 0 1 18 0M-14 -10a20 20 0 0 1 28 0" className="illo-wave" />
        </g>
      );
    default:
      return (
        <g>
          <rect x="-9" y="-16" width="18" height="32" rx="4" />
          <path d="M-3 11h6" />
        </g>
      );
  }
}

export function TopologyIllo() {
  return (
    <svg className="illo illo-topo" viewBox="0 0 740 440" role="img" aria-label="Diagrama da cabine técnica: rack com roteador e switch ligado por cabo às câmeras PTZ, à mesa digital, aos computadores da live e da projeção e ao Wi-Fi, que atende o celular usado como câmera.">
      {/* cabos: cada equipamento até o switch */}
      {NODES.map((n, i) => {
        const left = n.x < RACK.x;
        const sx = left ? RACK.x : RACK.x + RACK.w;
        const mid = left ? n.x + 110 : n.x - 110;
        const d = `M${n.x + (left ? 34 : -34)} ${n.y} H${mid} V${SWITCH_Y} H${sx}`;
        return (
          <g key={n.label}>
            <path d={d} className="illo-cable" />
            <path d={d} className="illo-flow" style={{ "--l": i } as React.CSSProperties} />
          </g>
        );
      })}
      {/* Wi-Fi → celular */}
      <path d="M614 352 C596 382 566 400 524 406" className="illo-wifi" />

      {/* rack */}
      <g className="illo-rack">
        <rect x={RACK.x} y={RACK.y - 30} width={RACK.w} height={RACK.h + 40} rx="10" className="illo-rack__body" />
        <text x={RACK.x + RACK.w / 2} y={RACK.y - 10} textAnchor="middle" className="illo-label">
          RACK
        </text>
        {/* roteador */}
        <rect x={RACK.x + 12} y={RACK.y + 8} width={RACK.w - 24} height="30" rx="4" className="illo-unit" />
        <text x={RACK.x + 22} y={RACK.y + 27} className="illo-unit__text">
          ROTEADOR
        </text>
        <circle cx={RACK.x + RACK.w - 24} cy={RACK.y + 23} r="3" className="illo-led" />
        {/* switch */}
        <rect x={RACK.x + 12} y={RACK.y + 52} width={RACK.w - 24} height="52" rx="4" className="illo-unit illo-unit--hot" />
        <text x={RACK.x + 22} y={RACK.y + 68} className="illo-unit__text">
          SWITCH PoE
        </text>
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            <rect x={RACK.x + 22 + i * 13.5} y={RACK.y + 76} width="9" height="8" rx="1.5" className="illo-port" />
            <circle cx={RACK.x + 26.5 + i * 13.5} cy={RACK.y + 92} r="1.8" className="illo-led" style={{ "--l": i } as React.CSSProperties} />
          </g>
        ))}
        {/* patch panel e gaveta */}
        <rect x={RACK.x + 12} y={RACK.y + 118} width={RACK.w - 24} height="20" rx="4" className="illo-unit" />
        <text x={RACK.x + 22} y={RACK.y + 132} className="illo-unit__text">
          PATCH PANEL
        </text>
        <rect x={RACK.x + 12} y={RACK.y + 150} width={RACK.w - 24} height="34" rx="4" className="illo-unit" />
        <path d={`M${RACK.x + 55} ${RACK.y + 167}h40`} className="illo-thin" />
        <text x={RACK.x + RACK.w / 2} y={RACK.y + RACK.h + 28} textAnchor="middle" className="illo-ip">
          192.168.10.1
        </text>
      </g>

      {/* equipamentos */}
      {NODES.map((n) => (
        <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
          <circle r="34" className="illo-node" />
          <g className="illo-glyph">
            <Glyph kind={n.kind} />
          </g>
          <text y="52" textAnchor="middle" className="illo-label">
            {n.label}
          </text>
          <text y="66" textAnchor="middle" className="illo-ip">
            192.168.10{n.ip}
          </text>
        </g>
      ))}

      {/* celular como câmera */}
      <g transform="translate(504 410)">
        <g className="illo-glyph">
          <Glyph kind="phone" />
        </g>
        <text x="-22" y="-2" textAnchor="end" className="illo-label">
          Celular como câmera
        </text>
        <text x="-22" y="12" textAnchor="end" className="illo-ip">
          192.168.10.60 · Wi-Fi
        </text>
      </g>
    </svg>
  );
}

export function DhcpScreenIllo() {
  return (
    <div className="illo-screen" aria-hidden="true">
      <div className="illo-screen__bar">
        <i />
        <i />
        <i />
        <span>Câmera PTZ · Configurações de rede</span>
      </div>
      <div className="illo-screen__body">
        <div className="illo-field illo-field--toggle">
          <span>DHCP (IP automático)</span>
          <span className="illo-toggle">
            <i />
          </span>
        </div>
        <p className="illo-screen__hint">DHCP desligado: o endereço fica fixo e a câmera não “some” da rede.</p>
        {[
          ["Endereço IP", "192.168.10.51"],
          ["Máscara de sub-rede", "255.255.255.0"],
          ["Gateway", "192.168.10.1"],
          ["DNS", "192.168.10.1"],
        ].map(([label, value], i) => (
          <div key={label} className={`illo-field${i === 0 ? " illo-field--focus" : ""}`}>
            <span>{label}</span>
            <code>{value}</code>
          </div>
        ))}
        <span className="illo-screen__save">Salvar</span>
      </div>
    </div>
  );
}

export function TerminalIllo() {
  return (
    <div className="illo-term" aria-hidden="true">
      <div className="illo-term__bar">
        <i />
        <i />
        <i />
        <span>Prompt de Comando</span>
      </div>
      <pre className="illo-term__body">
        <span className="illo-term__cmd">C:\&gt; ipconfig</span>
        {"\n"}
        {"   Endereço IPv4 . . . . . . : "}
        <b>192.168.10.10</b>
        {"\n"}
        {"   Máscara de Sub-rede . . . : 255.255.255.0\n"}
        {"   Gateway Padrão. . . . . . : 192.168.10.1\n\n"}
        <span className="illo-term__cmd">C:\&gt; ping 192.168.10.51</span>
        {"\n"}
        <span className="illo-term__ok">{"   Resposta de 192.168.10.51: tempo=1ms\n"}</span>
        <span className="illo-term__ok">{"   Resposta de 192.168.10.51: tempo=1ms\n"}</span>
        <span className="illo-term__ok">{"   Resposta de 192.168.10.51: tempo<1ms\n\n"}</span>
        <span className="illo-term__cmd">C:\&gt; arp -a</span>
        {"\n"}
        {"   192.168.10.51     dinâmico\n"}
        {"   192.168.10.52     dinâmico\n\n"}
        <span className="illo-term__cmd">
          C:\&gt; <i className="illo-term__cursor" />
        </span>
      </pre>
    </div>
  );
}
