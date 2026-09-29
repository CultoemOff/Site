import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  SPRESENTER_COUPON,
  SPRESENTER_SCREEN_SRC,
  SPRESENTER_URL,
  VOLUTS_SCREEN_SRC,
  VOLUTS_TRIAL_URL,
  VOLUTS_URL,
} from "@/config/site";
import CopyCouponButton from "./CopyCouponButton";
import { PresenterScreen, VolunteersScreen } from "./ToolScreens";
import "./partners.css";

export default function Partners() {
  return (
    <section id="parceiros" className="section section--paper partners" aria-labelledby="parceiros-title">
      <div className="section__inner">
        <SectionHeader channel="CH 05 · Ferramentas" id="parceiros-title" title="Ferramentas que recomendamos.">
          <p>Softwares que usamos e indicamos para facilitar o dia a dia de quem serve na igreja.</p>
        </SectionHeader>

        <div className="partners__grid">
          {/* SPresenter */}
          <article className="partner partner--spresenter" aria-labelledby="parceiro-spresenter" data-reveal>
            <div className="partner__media">
              <PresenterScreen src={SPRESENTER_SCREEN_SRC || undefined} />
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

              <div className="coupon" aria-label="Cupom Culto em Off">
                <div className="coupon__info">
                  <p className="coupon__label">Cupom Culto em Off</p>
                  <p className="coupon__benefit">
                    <strong>5% de desconto</strong> no plano Pro
                  </p>
                </div>
                <div className="coupon__code-wrap">
                  <code className="coupon__code">{SPRESENTER_COUPON}</code>
                  <CopyCouponButton code={SPRESENTER_COUPON} />
                </div>
              </div>

              <div className="partner__actions">
                <ArrowButton href={SPRESENTER_URL} variant="ghost" external>
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
              <VolunteersScreen src={VOLUTS_SCREEN_SRC || undefined} />
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
                {/* TODO: VOLUTS_TRIAL_URL — o botão aparece quando a URL do trial for configurada em src/config/site.ts */}
                {VOLUTS_TRIAL_URL && (
                  <ArrowButton href={VOLUTS_TRIAL_URL} external>
                    Testar grátis por 14 dias
                  </ArrowButton>
                )}
                <ArrowButton href={VOLUTS_URL} variant="ghost" external>
                  Conhecer o Voluts
                </ArrowButton>
              </div>
            </div>
          </article>
        </div>

        <p className="partners__disclaimer" data-reveal>
          SPresenter e Voluts são produtos independentes, de suas próprias empresas, e não pertencem ao Culto em Off.
          São ferramentas parceiras que recomendamos.
        </p>
      </div>
    </section>
  );
}
