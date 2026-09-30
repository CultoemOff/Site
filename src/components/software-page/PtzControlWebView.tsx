import ArrowButton from "@/components/ui/ArrowButton";
import { PtzVisual } from "@/components/sections/software/SoftwareVisuals";
import { SOFTWARE } from "@/config/software";
import type { LeadErrors, LeadInput } from "@/lib/leads";
import DownloadGate from "./DownloadGate";
import "@/components/sections/software/software.css";
import "./software-page.css";

const PTZ = SOFTWARE.find((s) => s.id === "ptz-control-web")!;

/** Descrição de cada recurso confirmado do PTZ Control Web. */
const FEATURE_DETAILS: Record<string, { text: string; icon: string }> = {
  "Pan, tilt, zoom e foco": { text: "Movimente, aproxime e ajuste o foco de cada câmera direto na tela.", icon: "M12 4v16M4 12h16M12 4l-3 3M12 4l3 3M12 20l-3-3M12 20l3-3" },
  Presets: { text: "Salve enquadramentos e chame a posição certa com um clique.", icon: "M6 4h12v16l-6-4-6 4z" },
  "Múltiplas câmeras": { text: "Controle várias câmeras PTZ na mesma interface.", icon: "M3 7h11v10H3zM14 10l7-3v10l-7-3" },
  "Controle por gamepad": { text: "Opere as câmeras com um controle de videogame.", icon: "M7 9h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14 14h-4l-1.6 1.8A3 3 0 0 1 3 14v-1a4 4 0 0 1 4-4zM8 11v3M6.5 12.5h3" },
  "Integração com o Companion": { text: "Dispare comandos das câmeras pelo Bitfocus Companion.", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  "Diferentes protocolos de câmera": { text: "Suporte a diferentes protocolos de controle de câmera.", icon: "M5 12h14M5 12l3-3M5 12l3 3M19 12l-3-3M19 12l-3 3" },
};

type Props = {
  downloadUrl: string;
  action: (input: LeadInput) => Promise<{ ok: true } | { ok: false; errors: LeadErrors }>;
};

/** Página do PTZ Control Web: apresentação, recursos, compatibilidade e cadastro para download. */
export default function PtzControlWebView({ downloadUrl, action }: Props) {
  return (
    <>
      <header className="swp-hero">
        <div className="swp-hero__inner">
          <div className="swp-hero__text">
            <p className="swp-hero__channel">
              <span aria-hidden="true" />
              Software Culto em Off · {PTZ.area}
            </p>
            <h1 className="swp-hero__title">{PTZ.name}</h1>
            <p className="swp-hero__tagline">{PTZ.tagline}</p>
            <p className="swp-hero__desc">{PTZ.description}</p>
            <div className="swp-hero__actions">
              <ArrowButton href="#download">Cadastre-se e baixe</ArrowButton>
              <a className="swp-hero__link" href="#recursos">
                Ver recursos
              </a>
            </div>
          </div>
          <div className="swp-hero__visual soft__visual">
            <PtzVisual />
          </div>
        </div>
      </header>

      <section id="recursos" className="swp-section" aria-labelledby="recursos-title">
        <div className="swp-section__inner">
          <p className="swp-kicker">Recursos</p>
          <h2 id="recursos-title" className="swp-title">
            Tudo o que a operação de câmeras do culto precisa.
          </h2>
          <ul className="swp-features">
            {PTZ.features.map((f, i) => {
              const d = FEATURE_DETAILS[f];
              return (
                <li key={f} className="swp-feature" data-reveal data-glow style={{ "--i": i % 3 } as React.CSSProperties}>
                  <span className="swp-feature__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={d?.icon ?? "M5 12h14"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3>{f}</h3>
                  {d && <p>{d.text}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {PTZ.worksWith && (
        <section className="swp-section swp-section--alt" aria-labelledby="compat-title">
          <div className="swp-section__inner swp-compat">
            <div>
              <p className="swp-kicker">Compatibilidade</p>
              <h2 id="compat-title" className="swp-title">
                Funciona ao lado do software de transmissão que você já usa.
              </h2>
              <p className="swp-lead">
                O PTZ Control Web roda no navegador. Você controla as câmeras enquanto o seu software de transmissão
                cuida da live.
              </p>
            </div>
            <ul className="swp-compat__list">
              {PTZ.worksWith.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="swp-section" aria-labelledby="passos-title">
        <div className="swp-section__inner">
          <p className="swp-kicker">Como começar</p>
          <h2 id="passos-title" className="swp-title">
            Três passos até a primeira câmera se mexer.
          </h2>
          <ol className="swp-steps">
            <li data-reveal>
              <span>01</span>
              <h3>Cadastre-se e baixe</h3>
              <p>Preencha nome, celular e e-mail logo abaixo. O link de download aparece na hora.</p>
            </li>
            <li data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <span>02</span>
              <h3>Adicione suas câmeras</h3>
              <p>Cadastre as câmeras PTZ da igreja e salve os enquadramentos que você mais usa.</p>
            </li>
            <li data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <span>03</span>
              <h3>Opere no culto</h3>
              <p>Controle pelo navegador, pelo gamepad ou pelo Companion, junto com a sua transmissão.</p>
            </li>
          </ol>
        </div>
      </section>

      <section id="download" className="swp-section swp-download" aria-labelledby="download-title">
        <div className="swp-section__inner swp-download__layout">
          <div>
            <p className="swp-kicker">Download</p>
            <h2 id="download-title" className="swp-title">
              Baixe o {PTZ.name}.
            </h2>
            <p className="swp-lead">
              O download é gratuito. Com o cadastro, você também fica sabendo primeiro das atualizações, novos softwares
              e formações do Culto em Off.
            </p>
          </div>
          <DownloadGate source={PTZ.id} productName={PTZ.name} downloadUrl={downloadUrl} action={action} />
        </div>
      </section>
    </>
  );
}
