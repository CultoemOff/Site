import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SiteSettingsData } from "@/config/site";
import CopyCouponButton from "./CopyCouponButton";
import { PresenterScreen, StoreScreen, VolunteersScreen } from "./ToolScreens";
import "./partners.css";

/** "5% de desconto no plano Pro" → destaca "5% de desconto". */
function CouponBenefit({ text }: { text: string }) {
  const m = text.match(/^(.*?desconto)\s*(.*)$/i);
  return (
    <p className="coupon__benefit">
      {m ? (
        <>
          <strong>{m[1]}</strong> {m[2]}
        </>
      ) : (
        text
      )}
    </p>
  );
}

export default function Partners({ settings }: { settings: SiteSettingsData }) {
  const { spresenter, voluts, dorn } = settings;
  return (
    <section id="parceiros" className="section section--paper partners" aria-labelledby="parceiros-title">
      <div className="section__inner">
        <SectionHeader channel="CH 05 · Ferramentas" id="parceiros-title" title="Ferramentas que recomendamos.">
          <p>Softwares e lojas que usamos e indicamos para facilitar o dia a dia de quem serve na igreja.</p>
        </SectionHeader>

        <div className="partners__grid">
          {/* SPresenter */}
          <article className="partner partner--spresenter" aria-labelledby="parceiro-spresenter" data-reveal>
            <div className="partner__media">
              <PresenterScreen src={spresenter.screen} />
            </div>
            <div className="partner__content">
              <p className="partner__area">Projeção</p>
              <h3 id="parceiro-spresenter" className="partner__name">
                SPresenter
              </h3>
              <p className="partner__text">
                Software de apresentação para igrejas e eventos ao vivo, para Windows e macOS. Trabalha com letras,
                Bíblia, vídeos e fundos em camadas independentes, com várias saídas ao mesmo tempo, inclusive por NDI.
              </p>

              {spresenter.coupon && (
                <div className="coupon" aria-label="Cupom Culto em Off">
                  <div className="coupon__info">
                    <p className="coupon__label">Cupom Culto em Off</p>
                    <CouponBenefit text={spresenter.discount} />
                  </div>
                  <div className="coupon__code-wrap">
                    <code className="coupon__code">{spresenter.coupon}</code>
                    <CopyCouponButton code={spresenter.coupon} />
                  </div>
                </div>
              )}

              <div className="partner__actions">
                <ArrowButton href={spresenter.url} variant="ghost" external>
                  Conhecer o SPresenter
                </ArrowButton>
              </div>
            </div>
          </article>

          {/* Voluts */}
          <article
            className="partner partner--voluts"
            aria-labelledby="parceiro-voluts"
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <div className="partner__media">
              <VolunteersScreen src={voluts.screen} />
            </div>
            <div className="partner__content">
              <p className="partner__area">Voluntários</p>
              <h3 id="parceiro-voluts" className="partner__name">
                Voluts
              </h3>
              <p className="partner__text">
                Aplicativo de gestão de voluntários para igrejas. Organiza as escalas de todos os ministérios, ajuda a
                banda a estudar para os ensaios, mudando o tom e o ritmo da música, e sincroniza a letra do louvor com o
                SPresenter.
              </p>
              <ul className="partner__features" aria-label="Destaques do Voluts">
                <li>Escalas de todos os ministérios</li>
                <li>Estudo para ensaios</li>
                <li>Mudança de tom e ritmo</li>
                <li>Letra sincronizada com o SPresenter</li>
              </ul>

              <div className="partner__trial">
                <span className="partner__trial-badge" aria-hidden="true">
                  14<small>dias</small>
                </span>
                <p>Teste grátis por 14 dias e veja como fica a escala da sua equipe.</p>
              </div>

              <div className="partner__actions">
                <ArrowButton href={voluts.url} external>
                  Testar grátis por 14 dias
                </ArrowButton>
              </div>
            </div>
          </article>

          {/* Loja da Dorn */}
          <article
            className="partner partner--dorn"
            aria-labelledby="parceiro-dorn"
            data-reveal
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <div className="partner__media">
              <StoreScreen src={dorn.image} />
            </div>
            <div className="partner__content">
              <p className="partner__area">Câmeras e transmissão</p>
              <h3 id="parceiro-dorn" className="partner__name">
                Loja da Dorn
              </h3>
              <p className="partner__text">
                Loja de câmeras e produtos de transmissão para igrejas. Um bom lugar para montar ou ampliar a estrutura
                de vídeo e live da sua equipe.
              </p>
              <div className="partner__actions">
                <ArrowButton href={dorn.url} external>
                  Visitar a Loja da Dorn
                </ArrowButton>
              </div>
            </div>
          </article>
        </div>

        <p className="partners__disclaimer" data-reveal>
          SPresenter, Voluts e Loja da Dorn são empresas independentes e não pertencem ao Culto em Off. São parceiros
          que recomendamos.
        </p>
      </div>
    </section>
  );
}
