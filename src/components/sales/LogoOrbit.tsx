import Image from "next/image";
import type { ReactNode } from "react";

export type OrbitLogo = {
  name: string;
  /** arquivo em /public (PNG/SVG sem fundo). Sem arquivo, o quadrado mostra o nome. */
  logo?: string;
};

/**
 * Meia-lua de logos girando em loop em volta de um título (só CSS, prefixo .lo- em sales.css).
 * Os logos são repetidos para fechar o círculo inteiro; só a metade de cima aparece.
 * Pausa fora da tela (data-anim) e fica parada com "reduzir movimento".
 */
export default function LogoOrbit({ logos, children }: { logos: OrbitLogo[]; children: ReactNode }) {
  const ring = logos.length < 14 ? [...logos, ...logos] : logos;
  return (
    <div className="lo" data-anim>
      <div className="lo__stage">
      <div className="lo__ring" style={{ "--n": ring.length } as React.CSSProperties} aria-hidden="true">
        {ring.map((l, k) => (
          <span key={`${l.name}-${k}`} className="lo__item" style={{ "--k": k } as React.CSSProperties}>
            <span className="lo__tile">
              {l.logo ? (
                <Image src={l.logo} alt="" width={120} height={120} sizes="96px" className="lo__img" />
              ) : (
                <span className="lo__name">{l.name}</span>
              )}
            </span>
          </span>
        ))}
      </div>
      </div>
      <p className="sr-only">Funciona com: {logos.map((l) => l.name).join(", ")}.</p>
      <div className="lo__center">{children}</div>
    </div>
  );
}
