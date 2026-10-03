import Navbar from "@/components/layout/Navbar";
import ExitPopup from "@/components/sales/ExitPopup";
import PromoBar from "@/components/sales/PromoBar";
import { formatPrice, type Course } from "@/config/courses";
import { resolvePrice } from "@/lib/pricing";
import { GUARANTEE_DAYS, SITE_NAME } from "@/config/site";
import type { Offer } from "@/config/offers";
import OffersGrid from "./OffersGrid";
import "./offers.css";

/**
 * Página de ofertas: leve de propósito (sem palco animado), com o menu do site,
 * fundo azul-escuro e cards brancos. `homeUrl` leva ao site principal; `courses` serve só para a faixa da promoção.
 */
export default function OffersView({ offers, homeUrl, courses = [] }: { offers: Offer[]; homeUrl: string; courses?: Course[] }) {
  // Formação em promoção: a mesma faixa amarela da home, levando à página da oferta no site principal.
  const promoCourse = courses.map((c) => ({ c, p: resolvePrice(c) })).find(({ p }) => p.promo);
  const prefix = homeUrl === "/" ? "" : homeUrl.replace(/\/$/, "");
  return (
    <div className="offers">
      {promoCourse && (
        <PromoBar
          label={promoCourse.p.promo!.label}
          product={`Curso de ${promoCourse.c.title}`}
          off={promoCourse.p.off}
          endsAt={promoCourse.p.promo!.endsAt}
          href={`${prefix}/formacoes/${promoCourse.c.id}`}
          cta="Ver a oferta"
          ctaShort="Ver oferta"
          trackLabel={`${promoCourse.c.title} (faixa das ofertas)`}
        />
      )}
      <Navbar base={homeUrl} />

      <main id="conteudo" tabIndex={-1} className="offers__main">
        <div className="offers__head">
          <h1>Ofertas para a técnica da sua igreja</h1>
          <p>Produtos recomendados pelo Culto em Off para te ajudar na igreja.</p>
          <p className="offers__legal">
            Os links desta página são de afiliado: se você comprar por eles, o Culto em Off pode receber uma comissão,
            sem custo extra para você. Preço e disponibilidade são definidos pela loja e podem mudar a qualquer momento;
            vale o valor mostrado na página da loja.
          </p>
        </div>

        <OffersGrid offers={offers} />
      </main>

      <footer className="offers__footer">
        <a href={homeUrl}>{SITE_NAME}</a>
        <span>Formação técnica para voluntários de igreja</span>
      </footer>

      {/* aviso ao sair: apresenta o curso em promoção a quem veio só pelas ofertas (uma vez por visita) */}
      {promoCourse && (
        <ExitPopup
          id={`ofertas-${promoCourse.c.id}`}
          productName={`${promoCourse.c.title} (página de ofertas)`}
          badge={promoCourse.p.promo!.label}
          title={`Antes de sair: ${promoCourse.p.off}% de desconto no Curso de ${promoCourse.c.title}`}
          text={`${promoCourse.c.tagline} São ${promoCourse.c.topics.length} módulos em vídeo, com ${promoCourse.c.format.access.toLowerCase()} e ${GUARANTEE_DAYS} dias de garantia.`}
          priceFrom={promoCourse.p.priceFrom ? formatPrice(promoCourse.p.priceFrom) : undefined}
          price={formatPrice(promoCourse.p.price)}
          endsAt={promoCourse.p.promo!.endsAt}
          ctaHref={`${prefix}/formacoes/${promoCourse.c.id}`}
          ctaLabel="Conhecer o curso"
        />
      )}
    </div>
  );
}
