/** Ilustrações das interfaces dos softwares do Culto em Off (decorativas). */

export function PtzVisual() {
  return (
    <div className="sv sv-ptz" aria-hidden="true" data-anim>
      <div className="sv-ptz__tabs">
        <span className="is-on">CAM 1</span>
        <span>CAM 2</span>
        <span>CAM 3</span>
      </div>
      <div className="sv-ptz__view">
        <div className="sv-ptz__scene">
          <span className="sv-ptz__pulpit" />
          <span className="sv-ptz__screen" />
          <span className="sv-ptz__floor" />
        </div>
        <span className="sv-ptz__cross" />
        <span className="sv-ptz__rec">
          <i /> LIVE
        </span>
        <span className="sv-ptz__zoom">ZOOM 3.2×</span>
      </div>
      <div className="sv-ptz__controls">
        <div className="sv-ptz__pad">
          <span className="sv-ptz__stick" />
        </div>
        <div className="sv-ptz__presets">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <span key={n} style={{ "--i": n } as React.CSSProperties}>
              {n}
            </span>
          ))}
        </div>
        <div className="sv-ptz__slider">
          <span />
        </div>
      </div>
    </div>
  );
}

export function LightRemoteVisual() {
  return (
    <div className="sv sv-light" aria-hidden="true" data-anim>
      <div className="sv-light__beams">
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="sv-light__tablet">
        <div className="sv-light__scenes">
          {["Abertura", "Louvor", "Palavra", "Ceia", "Apelo", "Final"].map((s, i) => (
            <span key={s} style={{ "--i": i } as React.CSSProperties}>
              {s}
            </span>
          ))}
        </div>
        <div className="sv-light__faders">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              <i />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
