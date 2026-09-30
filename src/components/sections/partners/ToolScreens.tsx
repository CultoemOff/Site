import Image from "next/image";

/**
 * Miniaturas das telas das ferramentas recomendadas.
 * Se houver captura oficial configurada, ela é exibida; senão, uma ilustração
 * genérica (sem marcas) com o aviso "imagem ilustrativa".
 */

function Caption() {
  return <span className="tool-shot__caption">Imagem ilustrativa</span>;
}

export function PresenterScreen({ src }: { src?: string }) {
  return (
    <div className="tool-shot tool-shot--presenter">
      <div className={`tool-shot__window${src ? " tool-shot__window--bare" : ""}`} aria-hidden={src ? undefined : true}>
        {!src && (
          <div className="tool-shot__bar">
            <i />
            <i />
            <i />
          </div>
        )}
        {src ? (
          <Image src={src} alt="Tela do SPresenter com a letra de uma música no telão" fill sizes="(max-width: 860px) 90vw, 440px" className="tool-shot__img" />
        ) : (
          <div className="pm" data-anim>
            <aside className="pm__side">
              {[70, 55, 80, 62, 48].map((w, i) => (
                <span key={i} className={i === 1 ? "is-on" : ""} style={{ width: `${w}%` }} />
              ))}
            </aside>
            <div className="pm__main">
              <div className="pm__preview">
                <span className="pm__lyric" />
                <span className="pm__lyric pm__lyric--short" />
                <span className="pm__layer">LETRA</span>
              </div>
              <div className="pm__slides">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="pm__slide" style={{ "--i": i } as React.CSSProperties} />
                ))}
              </div>
            </div>
            <aside className="pm__outs">
              <span>TELÃO</span>
              <span>NDI</span>
              <span>LIVE</span>
            </aside>
          </div>
        )}
      </div>
      {!src && <Caption />}
    </div>
  );
}

export function VolunteersScreen({ src }: { src?: string }) {
  return (
    <div className="tool-shot tool-shot--volunteers">
      <div className={`tool-shot__phone${src ? " tool-shot__phone--real" : ""}`} aria-hidden={src ? undefined : true}>
        {src ? (
          <Image src={src} alt="Tela de escala do aplicativo Voluts" fill sizes="180px" className="tool-shot__img" />
        ) : (
          <div className="vm" data-anim>
            <div className="vm__head">
              <span className="vm__title">Escala · Domingo</span>
              <span className="vm__pill">19h</span>
            </div>
            {[
              ["Som", "is-a"],
              ["Projeção", "is-b"],
              ["Louvor", "is-a"],
              ["Recepção", "is-b"],
            ].map(([role, cls], i) => (
              <div key={role} className="vm__row" style={{ "--i": i } as React.CSSProperties}>
                <span className={`vm__avatar ${cls}`} />
                <span className="vm__name" />
                <span className="vm__role">{role}</span>
              </div>
            ))}
            <div className="vm__song">
              <span className="vm__song-title" />
              <span className="vm__song-meta">TOM G → A · 72 BPM</span>
              <span className="vm__wave">
                {Array.from({ length: 14 }, (_, i) => (
                  <i key={i} style={{ "--i": i } as React.CSSProperties} />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>
      {!src && <Caption />}
    </div>
  );
}

export function StoreScreen({ src }: { src?: string }) {
  return (
    <div className="tool-shot tool-shot--store">
      <div className="tool-shot__window tool-shot__window--store" aria-hidden={src ? undefined : true}>
        <div className="tool-shot__bar">
          <i />
          <i />
          <i />
        </div>
        {src ? (
          <Image src={src} alt="Site da Loja da Dorn com câmera PTZ e controladora" fill sizes="(max-width: 860px) 90vw, 440px" className="tool-shot__img" />
        ) : (
          <div className="sm" data-anim>
            {[
              ["ptz", "Câmera PTZ"],
              ["cam", "Filmadora"],
              ["mixer", "Mesa de corte"],
              ["encoder", "Placa de captura"],
              ["tripod", "Tripé"],
              ["cable", "Cabos e conversores"],
            ].map(([kind, label], i) => (
              <div key={kind} className="sm__item" style={{ "--i": i } as React.CSSProperties}>
                <span className={`sm__icon sm__icon--${kind}`} />
                <span className="sm__label">{label}</span>
                <span className="sm__price" />
              </div>
            ))}
          </div>
        )}
      </div>
      {!src && <Caption />}
    </div>
  );
}
