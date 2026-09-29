/**
 * Pequenos "displays" animados de cada área técnica.
 * Todos decorativos (aria-hidden) e animados só com CSS/SMIL.
 */

/** Áudio: medidores com um canal clipando (microfonia). */
export function AudioMeters() {
  const channels = [
    { label: "VOZ 1", dur: 1.3, peak: 0.72 },
    { label: "VOZ 2", dur: 1.1, peak: 0.64 },
    { label: "VIOLÃO", dur: 1.6, peak: 0.55 },
    { label: "TECLADO", dur: 1.4, peak: 0.6 },
    { label: "PÚLPITO", dur: 0.9, peak: 1, clip: true },
    { label: "RETORNO", dur: 1.2, peak: 0.78 },
  ];
  return (
    <div className="pv pv-meters" aria-hidden="true">
      <div className="pv-meters__bars">
        {channels.map((c) => (
          <div key={c.label} className={`pv-meter${c.clip ? " pv-meter--clip" : ""}`}>
            <span className="pv-meter__led" />
            <span className="pv-meter__track">
              <span
                className="pv-meter__fill"
                style={{ "--dur": `${c.dur}s`, "--peak": c.peak } as React.CSSProperties}
              />
            </span>
            <span className="pv-meter__label">{c.label}</span>
          </div>
        ))}
      </div>
      <span className="pv-tag pv-tag--alert">FEEDBACK</span>
    </div>
  );
}

/** Projeção: slide travado com a letra errada. */
export function FrozenSlide() {
  return (
    <div className="pv pv-slide" aria-hidden="true">
      <div className="pv-slide__screen">
        <span className="pv-slide__line" />
        <span className="pv-slide__line pv-slide__line--wrong" />
        <span className="pv-slide__line pv-slide__line--short" />
        <span className="pv-slide__spinner" />
      </div>
      <span className="pv-tag">SLIDE 12 / 48 · NÃO RESPONDE</span>
    </div>
  );
}

/** Transmissão: áudio da sala x áudio da live fora de sincronia. */
export function SyncWaves() {
  const d =
    "M0 20 Q6 4 12 20 T24 20 Q28 8 32 20 T40 20 Q46 0 52 20 T64 20 Q68 12 72 20 T80 20";
  return (
    <div className="pv pv-sync" aria-hidden="true">
      <div className="pv-sync__row">
        <span className="pv-sync__label">SALA</span>
        <svg viewBox="0 0 160 40" preserveAspectRatio="none" className="pv-sync__wave">
          <g className="pv-sync__scroll">
            <path d={d} />
            <path d={d} transform="translate(80 0)" />
            <path d={d} transform="translate(160 0)" />
          </g>
        </svg>
      </div>
      <div className="pv-sync__row">
        <span className="pv-sync__label">
          <i className="pv-rec" /> LIVE
        </span>
        <svg viewBox="0 0 160 40" preserveAspectRatio="none" className="pv-sync__wave pv-sync__wave--late">
          <g className="pv-sync__scroll">
            <path d={d} />
            <path d={d} transform="translate(80 0)" />
            <path d={d} transform="translate(160 0)" />
          </g>
        </svg>
      </div>
      <span className="pv-tag pv-tag--alert">FORA DE SINCRONIA</span>
    </div>
  );
}

/** Iluminação: dois aparelhos disputando os mesmos canais DMX. */
export function DmxConflict() {
  const cells = Array.from({ length: 16 }, (_, i) => i + 1);
  return (
    <div className="pv pv-dmx" aria-hidden="true">
      <div className="pv-dmx__head">
        <span>UNIVERSO 1</span>
        <span>CH 001–016</span>
      </div>
      <div className="pv-dmx__grid">
        {cells.map((n) => {
          const a = n <= 8;
          const b = n >= 5 && n <= 12;
          return (
            <span
              key={n}
              className={`pv-dmx__cell${a ? " is-a" : ""}${b ? " is-b" : ""}${a && b ? " is-clash" : ""}`}
              style={{ "--i": n } as React.CSSProperties}
            >
              {String(n).padStart(3, "0")}
            </span>
          );
        })}
      </div>
      <div className="pv-dmx__legend">
        <span className="is-a">MOVING HEAD @001</span>
        <span className="is-b">PAR LED @005</span>
      </div>
      <span className="pv-tag pv-tag--alert">CONFLITO DE ENDEREÇO</span>
    </div>
  );
}

/** Redes: mesmo switch, sub-redes diferentes — o pacote não chega. */
export function SubnetMismatch() {
  return (
    <div className="pv pv-net" aria-hidden="true">
      <svg viewBox="0 0 520 150" className="pv-net__svg">
        <defs>
          <path id="pv-net-path" d="M92 75 H250 H410" />
        </defs>
        {/* cabos */}
        <line x1="92" y1="75" x2="228" y2="75" className="pv-net__cable" />
        <line x1="272" y1="75" x2="410" y2="75" className="pv-net__cable" />

        {/* computador */}
        <g transform="translate(40 75)">
          <rect x="-34" y="-24" width="68" height="42" rx="4" className="pv-net__node" />
          <rect x="-26" y="-17" width="52" height="28" rx="2" className="pv-net__screen" />
          <rect x="-40" y="18" width="80" height="6" rx="2" className="pv-net__node" />
        </g>
        <text x="40" y="126" className="pv-net__label" textAnchor="middle">OBS · NDI</text>
        <text x="40" y="142" className="pv-net__ip" textAnchor="middle">192.168.0.10/24</text>

        {/* switch */}
        <g transform="translate(250 75)">
          <rect x="-26" y="-14" width="52" height="28" rx="4" className="pv-net__node" />
          {[-16, -8, 0, 8, 16].map((x) => (
            <rect key={x} x={x - 3} y="-3" width="6" height="6" rx="1" className="pv-net__port" />
          ))}
        </g>
        <text x="250" y="126" className="pv-net__label" textAnchor="middle">SWITCH</text>

        {/* câmera */}
        <g transform="translate(456 75)">
          <rect x="-30" y="-22" width="50" height="40" rx="6" className="pv-net__node" />
          <circle cx="-5" cy="-2" r="12" className="pv-net__screen" />
          <circle cx="-5" cy="-2" r="5" className="pv-net__lens" />
          <path d="M20 -8 L36 -16 V12 L20 4 Z" className="pv-net__node" />
        </g>
        <text x="456" y="126" className="pv-net__label" textAnchor="middle">CÂMERA PTZ</text>
        <text x="456" y="142" className="pv-net__ip pv-net__ip--bad" textAnchor="middle">192.168.1.20/24</text>

        {/* pacote que não chega */}
        <g className="fx-motion">
          <circle r="5" className="pv-net__packet">
            <animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;0.75;0.75" keyTimes="0;0.55;1" calcMode="linear">
              <mpath href="#pv-net-path" />
            </animateMotion>
            <animate attributeName="opacity" dur="3.2s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.55;0.65;1" />
          </circle>
        </g>
        <g className="pv-net__x" transform="translate(342 75)">
          <circle r="13" />
          <path d="M-5 -5 L5 5 M5 -5 L-5 5" />
        </g>
      </svg>
      <span className="pv-tag pv-tag--alert">PING 192.168.1.20 · SEM RESPOSTA</span>
    </div>
  );
}
