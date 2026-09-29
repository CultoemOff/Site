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

/** Redes: extensões de HDMI/USB e P2 improvisado x sinal trafegando pela rede. */
export function CableMess() {
  const netPath = "M80 122 H250 H430";
  return (
    <div className="pv pv-net" aria-hidden="true">
      <svg viewBox="0 0 520 170" className="pv-net__svg">
        <defs>
          <path id="pv-net-ok" d={netPath} />
        </defs>

        {/* linha 1: hoje — HDMI com extensores até o telão */}
        <text x="14" y="22" className="pv-net__row">HOJE</text>
        <path d="M80 50 H150" className="pv-net__hdmi" />
        <path d="M186 50 H256" className="pv-net__hdmi" />
        <path d="M292 50 H340 l6 -8 l6 16 l6 -16 l6 8" className="pv-net__hdmi pv-net__hdmi--bad" />
        <g transform="translate(50 50)">
          <rect x="-30" y="-18" width="60" height="36" rx="4" className="pv-net__node" />
          <text y="4" textAnchor="middle" className="pv-net__box">PC</text>
        </g>
        {[168, 274].map((x) => (
          <g key={x} transform={`translate(${x} 50)`}>
            <rect x="-18" y="-9" width="36" height="18" rx="3" className="pv-net__ext" />
            <text y="3.5" textAnchor="middle" className="pv-net__tiny">EXT</text>
          </g>
        ))}
        <g transform="translate(430 50)">
          <rect x="-44" y="-24" width="88" height="48" rx="3" className="pv-net__screen" />
          <rect x="-44" y="-24" width="88" height="48" rx="3" className="pv-net__noise" />
          <text y="4" textAnchor="middle" className="pv-net__nosignal">SEM SINAL</text>
        </g>
        <text x="206" y="40" textAnchor="middle" className="pv-net__tiny pv-net__tiny--dim">HDMI</text>
        {/* linha 2: com rede — um cabo, um switch, NDI */}
        <text x="14" y="90" className="pv-net__row pv-net__row--ok">COM REDE</text>
        <path d={netPath} className="pv-net__cable" />
        <g transform="translate(50 122)">
          <rect x="-30" y="-18" width="60" height="36" rx="4" className="pv-net__node" />
          <text y="4" textAnchor="middle" className="pv-net__box">MESA</text>
        </g>
        <g transform="translate(250 122)">
          <rect x="-30" y="-13" width="60" height="26" rx="4" className="pv-net__node" />
          {[-18, -9, 0, 9, 18].map((x) => (
            <rect key={x} x={x - 3} y="-3" width="6" height="6" rx="1" className="pv-net__port" />
          ))}
        </g>
        <g transform="translate(430 122)">
          <rect x="-44" y="-20" width="88" height="40" rx="4" className="pv-net__node" />
          <text y="4" textAnchor="middle" className="pv-net__box">PC DA LIVE</text>
        </g>
        <text x="165" y="114" textAnchor="middle" className="pv-net__tiny">DANTE</text>
        <text x="340" y="114" textAnchor="middle" className="pv-net__tiny">NDI</text>
        <text x="250" y="156" textAnchor="middle" className="pv-net__tiny pv-net__tiny--dim">SWITCH</text>
        <g className="fx-motion">
          {[0, 1.1, 2.2].map((b) => (
            <circle key={b} r="4" className="pv-net__packet">
              <animateMotion dur="3.3s" begin={`${b}s`} repeatCount="indefinite">
                <mpath href="#pv-net-ok" />
              </animateMotion>
            </circle>
          ))}
        </g>
      </svg>
      <span className="pv-tag pv-tag--alert">HDMI + EXTENSORES · SEM SINAL</span>
    </div>
  );
}
