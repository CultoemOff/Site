import Image from "next/image";
import { LOGO_SRC, SITE_NAME } from "@/config/site";
import type { Offer } from "@/config/offers";
import OffersGrid from "./OffersGrid";
import "./offers.css";

/**
 * Página de ofertas: leve de propósito (sem palco animado nem menu completo),
 * com fundo azul-escuro e cards brancos. `homeUrl` leva ao site principal.
 */
export default function OffersView({ offers, homeUrl }: { offers: Offer[]; homeUrl: string }) {
  return (
    <div className="offers">
      <header className="offers__bar">
        <a className="offers__brand" href={homeUrl}>
          <Image src={LOGO_SRC} alt="" width={36} height={36} priority />
          <span>
            {SITE_NAME} <b>Ofertas</b>
          </span>
        </a>
        <a className="offers__site" href={homeUrl}>
          <span className="offers__site-long">Conhecer as formações</span>
          <span className="offers__site-short">Formações</span>
        </a>
      </header>

      <main id="conteudo" tabIndex={-1} className="offers__main">
        <div className="offers__head">
          <h1>Ofertas para a técnica da sua igreja</h1>
          <p>Produtos recomendados pelo Culto em Off para te ajudar na igreja.</p>
        </div>

        <OffersGrid offers={offers} />

        <p className="offers__legal">
          Os links desta página são de afiliado: se você comprar por eles, o Culto em Off pode receber uma comissão, sem
          custo extra para você. Preço e disponibilidade são definidos pela loja e podem mudar a qualquer momento; vale
          o valor mostrado na página da loja.
        </p>
      </main>

      <footer className="offers__footer">
        <a href={homeUrl}>{SITE_NAME}</a>
        <span>Formação técnica para voluntários de igreja</span>
      </footer>
    </div>
  );
}
