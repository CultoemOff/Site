import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { pickHomeOffers, type Offer } from "@/config/offers";
import OffersCarousel from "./OffersCarousel";
import "./offers-home.css";

/**
 * CH 04 · Produtos que recomendamos: carrossel com até 10 ofertas cadastradas no painel
 * (as marcadas com "Mostrar na home") e botão para a página completa.
 */
export default function OffersHome({ offers }: { offers: Offer[] }) {
  const list = pickHomeOffers(offers);
  if (list.length === 0) return null;

  return (
    <section id="equipamentos" className="section section--abyss offers-home" aria-labelledby="equipamentos-title">
      <div className="offers-home__grid-bg" aria-hidden="true" />
      <div className="section__inner">
        <SectionHeader channel="CH 04 · Equipamentos" id="equipamentos-title" title="Equipamentos que recomendamos.">
          <p>Produtos recomendados pelo Culto em Off para te ajudar na igreja.</p>
        </SectionHeader>

        <OffersCarousel offers={list} />

        <div className="offers-home__footer" data-reveal>
          <ArrowButton href="/ofertas">Ver todas as ofertas</ArrowButton>
          <p className="offers-home__disclaimer">
            Links de afiliado: comprando por eles, o Culto em Off pode receber uma comissão, sem custo extra para você.
            Preço e disponibilidade são definidos pela loja.
          </p>
        </div>
      </div>
    </section>
  );
}
