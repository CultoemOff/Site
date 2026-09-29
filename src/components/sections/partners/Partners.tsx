import ArrowButton from "@/components/ui/ArrowButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { SPRESENTER_COUPON, SPRESENTER_URL, VOLUTS_TRIAL_URL, VOLUTS_URL } from "@/config/site";
import CopyCouponButton from "./CopyCouponButton";
import "./partners.css";

export default function Partners() {
  return (
    <section id="parceiros" className="section section--paper partners" aria-labelledby="parceiros-title">
      <div className="section__inner">
        <SectionHeader
          channel="CH 05 · Parceiros"
          id="parceiros-title"
          title="Parceiros do ecossistema."
        >
          <p>
            Ferramentas que fazem parte do dia a dia de quem serve na igreja e que se conectam com o que ensinamos aqui.
          </p>
        </SectionHeader>

        <div className="partners__grid">
          {/* SPresenter */}
          <article className="partner" aria-labelledby="parceiro-spresenter" data-reveal>
            <div className="partner__node" aria-hidden="true">
              <span className="partner__node-dot" />
              <span className="partner__node-line" />
              <span className="partner__node-area">Projeção</span>
            </div>
            <h3 id="parceiro-spresenter" className="partner__name">
              SPresenter
            </h3>
            <p className="partner__text">
              Software de apresentação para igrejas e eventos ao vivo, para Windows e macOS. Trabalha com letras, Bíblia,
              vídeos e fundos em camadas independentes, com várias saídas ao mesmo tempo, inclusive por NDI.
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
          </article>

          {/* Voluts */}
          <article className="partner" aria-labelledby="parceiro-voluts" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <div className="partner__node" aria-hidden="true">
              <span className="partner__node-dot" />
              <span className="partner__node-line" />
              <span className="partner__node-area">Voluntários</span>
            </div>
            <h3 id="parceiro-voluts" className="partner__name">
              Voluts
            </h3>
            <p className="partner__text">
              Aplicativo de gestão de voluntários para igrejas: organiza escalas, identifica conflitos quando alguém já
              está escalado em outro turno, envia lembretes e reúne repertórios e ensaios em um só lugar.
            </p>

            <div className="partner__trial">
              <span className="partner__trial-badge" aria-hidden="true">
                14<small>dias</small>
              </span>
              <p>
                Teste grátis por 14 dias e veja como fica a escala da sua equipe técnica.
              </p>
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
          </article>
        </div>
      </div>
    </section>
  );
}
