import Image from "next/image";
import Link from "next/link";
import { SOFTWARE } from "@/config/software";
import type { DownloadLeadErrors, DownloadLeadInput } from "@/lib/leads";
import DownloadModal from "./DownloadModal";
import "@/components/sections/software/software.css";
import "./software-page.css";

const PTZ = SOFTWARE.find((s) => s.id === "ptz-control-web")!;

/** endereço do painel (para colar no OBS ou abrir no navegador) */
export const PTZ_PANEL_URL = "http://127.0.0.1:8765/obs";
/** vídeo tutorial (enviado pelo Jonas em 21/11/2026); vazio = botão "em breve" no popup */
export const PTZ_TUTORIAL_URL = "https://www.youtube.com/watch?v=ISkOzuhff04";
const VERSION = "0.9.0";
const IMG = "/images/softwares/ptz-control-web";
const YOUTUBE = "https://www.youtube.com/@CultoemOff";

/** Recursos da versão 0.9.0, na ordem do briefing (do mais básico ao mais avançado). */
const FEATURES: { title: string; text: string; icon: string }[] = [
  { title: "Pan, tilt, zoom, foco e home", text: "Com velocidade ajustável.", icon: "M12 4v16M4 12h16M12 4l-3 3M12 4l3 3M12 20l-3-3M12 20l3-3" },
  { title: "Presets com nome", text: "Clique para chamar, botão direito para salvar, teclas 1 a 0 como atalho.", icon: "M6 4h12v16l-6-4-6 4z" },
  { title: "Até 8 câmeras", text: "Com indicador de câmera respondendo.", icon: "M3 7h11v10H3zM14 10l7-3v10l-7-3" },
  { title: "Vários protocolos", text: "VISCA over IP (UDP/TCP), VISCA Serial, ONVIF e USB (UVC): OBSBOT Tiny 2 e outras webcams PTZ.", icon: "M5 12h14M5 12l3-3M5 12l3 3M19 12l-3-3M19 12l-3 3" },
  { title: "Busca de câmeras na rede", text: "Encontra as câmeras ONVIF da rede para você cadastrar.", icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l4 4" },
  { title: "Controle de videogame", text: "Um controle USB para mover, dar zoom, focar e chamar presets.", icon: "M7 9h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14 14h-4l-1.6 1.8A3 3 0 0 1 3 14v-1a4 4 0 0 1 4-4zM8 11v3M6.5 12.5h3" },
  { title: "Integração com o OBS Studio", text: "Teclas de atalho para presets e troca automática de câmera conforme a cena.", icon: "M4 5h16v11H4zM9 20h6M12 16v4" },
  { title: "Bitfocus Companion e Stream Deck", text: "Comandos das câmeras pelo Companion, via HTTP.", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { title: "Backup", text: "Das câmeras, dos presets e das configurações.", icon: "M12 4v10m0 0-4-4m4 4 4-4M5 20h14" },
  { title: "Atualização pelo próprio programa", text: "Com verificação do instalador.", icon: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" },
  { title: "Do seu jeito", text: "Português, inglês, espanhol e alemão · tema claro e escuro · layout horizontal ou vertical.", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" },
];

const REQUIREMENTS: [string, string][] = [
  ["Sistema", "Windows 10 ou 11, 64 bits"],
  ["OBS Studio", "Versão 33 ou mais nova (o painel também abre direto no navegador)"],
  ["Troca de câmera pela cena", "WebSocket do OBS ativado"],
  ["Câmeras", "VISCA over IP (UDP/TCP), VISCA Serial, ONVIF ou USB (UVC)"],
  ["Internet", "Só para baixar e atualizar; o controle das câmeras é local"],
];

const CHANGELOG: [string, string][] = [
  ["0.9.0", "Atualização pelo próprio programa, com verificação do instalador. Nomes de presets em até duas linhas."],
  ["0.8.0", "Busca automática de câmeras na rede (ONVIF). Português, inglês, espanhol e alemão. Telas para painéis pequenos e monitores grandes."],
  ["0.7.0", "Backup e restauração. Indicador real de câmera respondendo. Avisos de erro na tela. Instalação sem pedir administrador."],
  ["0.6.0", "Câmeras USB (UVC), como a OBSBOT Tiny 2. Painel mais compacto para o OBS."],
];

type Props = {
  downloadUrl: string;
  action: (input: DownloadLeadInput) => Promise<{ ok: true } | { ok: false; errors: DownloadLeadErrors }>;
};

/** Página do PTZ Control Web (versão 0.9.0): apresentação, recursos, onde usar, requisitos e download com cadastro em popup. */
export default function PtzControlWebView({ downloadUrl, action }: Props) {
  const download = (location: string, variant: "primary" | "ghost" = "primary", label?: string) => (
    <DownloadModal
      source={PTZ.id}
      productName={PTZ.name}
      downloadUrl={downloadUrl}
      panelUrl={PTZ_PANEL_URL}
      tutorialUrl={PTZ_TUTORIAL_URL}
      action={action}
      location={location}
      variant={variant}
      label={label}
      sideImage={{ src: `${IMG}/gamepad-obsbot.webp`, alt: "Controle de videogame movendo uma OBSBOT Tiny 2", width: 810, height: 1080 }}
    />
  );

  return (
    <>
      <header className="swp-hero ptzp-hero">
        <div className="ptzp-hero__inner">
          <div className="swp-hero__text">
            <p className="swp-hero__channel">
              <span aria-hidden="true" />
              Software gratuito · Versão {VERSION}
            </p>
            <h1 className="swp-hero__title">{PTZ.name}</h1>
            <p className="swp-hero__tagline">Controle gratuito de câmeras PTZ pelo navegador.</p>
            <p className="swp-hero__desc">{PTZ.description}</p>
            <div className="swp-hero__actions">
              {download("topo")}
              <a className="swp-hero__link" href="#recursos">
                Ver recursos
              </a>
            </div>
            <p className="ptzp-hero__fine">Windows 10 e 11 · Gratuito</p>
          </div>
          <figure className="ptzp-shot ptzp-shot--wide">
            <Image src={`${IMG}/horizontal-pt.webp`} alt="Painel do PTZ Control Web com 4 câmeras, controles de movimento e zoom e 15 presets com nome" width={1600} height={543} priority sizes="(max-width: 1240px) 100vw, 1200px" />
          </figure>
        </div>
      </header>

      <section id="recursos" className="swp-section" aria-labelledby="recursos-title">
        <div className="swp-section__inner">
          <p className="swp-kicker">Recursos</p>
          <h2 id="recursos-title" className="swp-title">
            Tudo o que a operação de câmeras do culto precisa.
          </h2>
          <ul className="swp-features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="swp-feature" data-reveal data-glow style={{ "--i": i % 3 } as React.CSSProperties}>
                <span className="swp-feature__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={f.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="swp-section swp-section--alt" aria-labelledby="obs-title">
        <div className="swp-section__inner ptzp-split">
          <div>
            <p className="swp-kicker">Dentro do OBS</p>
            <h2 id="obs-title" className="swp-title">
              O painel fica ao lado da sua live.
            </h2>
            <p className="swp-lead">O painel abre no endereço abaixo e pode ser usado em três lugares:</p>
            <p className="ptzp-url">
              <code>{PTZ_PANEL_URL}</code>
            </p>
            <ul className="ptzp-list">
              <li>
                <b>OBS Studio</b>, como painel (Painéis › Painéis personalizáveis com URL…).
              </li>
              <li>
                <b>Direto no navegador</b>, abrindo o mesmo endereço.
              </li>
              <li>
                <b>Outros softwares</b> compatíveis com fonte de navegador.
              </li>
            </ul>
          </div>
          <figure className="ptzp-shot ptzp-shot--tall">
            <Image src={`${IMG}/vertical-pt.webp`} alt="Painel vertical do PTZ Control Web em tema claro, como fica numa doca estreita do OBS" width={700} height={1172} sizes="(max-width: 900px) 80vw, 420px" />
          </figure>
        </div>
      </section>

      <section className="swp-section" aria-labelledby="cameras-title">
        <div className="swp-section__inner ptzp-split ptzp-split--reverse">
          <div>
            <p className="swp-kicker">Câmeras</p>
            <h2 id="cameras-title" className="swp-title">
              Rede, serial ou USB: cadastre e opere.
            </h2>
            <p className="swp-lead">
              Use câmeras de rede com VISCA ou ONVIF, câmeras com VISCA Serial ou câmeras USB, como a OBSBOT Tiny 2. A
              busca na rede encontra as câmeras ONVIF para você cadastrar com um clique.
            </p>
          </div>
          <figure className="ptzp-shot">
            <Image src={`${IMG}/cameras-pt.webp`} alt="Tela de cadastro de câmera com a busca na rede mostrando duas câmeras encontradas" width={1200} height={1275} sizes="(max-width: 900px) 92vw, 520px" />
          </figure>
        </div>
      </section>

      <section className="swp-section swp-section--alt" aria-labelledby="gamepad-title">
        <div className="swp-section__inner ptzp-split">
          <div>
            <p className="swp-kicker">Controle de videogame</p>
            <h2 id="gamepad-title" className="swp-title">
              Opere as câmeras com um controle na mão.
            </h2>
            <p className="swp-lead">
              Ligue um controle de videogame USB para mover, dar zoom, focar e chamar presets. Também funciona pelo
              Bitfocus Companion e pelo Stream Deck.
            </p>
          </div>
          <figure className="ptzp-shot ptzp-shot--photo">
            <Image src={`${IMG}/gamepad-obsbot.webp`} alt="Controle de videogame USB movendo uma câmera OBSBOT Tiny 2" width={810} height={1080} sizes="(max-width: 900px) 80vw, 420px" />
          </figure>
        </div>
      </section>

      <section className="swp-section" aria-labelledby="req-title">
        <div className="swp-section__inner ptzp-req">
          <div>
            <p className="swp-kicker">Requisitos e instalação</p>
            <h2 id="req-title" className="swp-title">
              Instale em três passos.
            </h2>
            <ol className="swp-steps ptzp-steps">
              <li>
                <span>01</span>
                <h3>Baixe e abra o instalador</h3>
                <p>Cadastre-se, baixe o PTZ-Control-Web-Setup.exe e abra o arquivo. Se o Windows mostrar o SmartScreen, clique em Mais informações › Executar assim mesmo.</p>
              </li>
              <li>
                <span>02</span>
                <h3>Confirme a pasta do OBS</h3>
                <p>A pasta de plugins sugerida serve para a maioria das instalações.</p>
              </li>
              <li>
                <span>03</span>
                <h3>Pronto</h3>
                <p>O programa inicia com o Windows e o atalho na área de trabalho abre o painel.</p>
              </li>
            </ol>
            <p className="ptzp-note">
              Atualizações: <b>Configurações → Sobre → Procurar atualizações → Baixar e instalar</b>.
            </p>
            <p className="ptzp-note">
              Passo a passo completo, com imagens:{" "}
              <Link href="/blog/controlar-camera-ptz-obs-studio">como controlar câmeras PTZ no OBS Studio com o PTZ Control Web</Link>.
            </p>
          </div>
          <table className="ptzp-table">
            <caption className="sr-only">Requisitos do PTZ Control Web</caption>
            <tbody>
              {REQUIREMENTS.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="swp-section swp-section--alt" aria-labelledby="novidades-title">
        <div className="swp-section__inner">
          <p className="swp-kicker">Novidades</p>
          <h2 id="novidades-title" className="swp-title">
            O que mudou nas últimas versões.
          </h2>
          <dl className="ptzp-changelog">
            {CHANGELOG.map(([v, t]) => (
              <div key={v}>
                <dt>v{v}</dt>
                <dd>{t}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="download" className="swp-section swp-download" aria-labelledby="download-title">
        <div className="swp-section__inner ptzp-final">
          <p className="swp-kicker">Download gratuito</p>
          <h2 id="download-title" className="swp-title">
            Baixe o {PTZ.name}.
          </h2>
          <p className="swp-lead">Gratuito, para Windows 10 e 11. Você se cadastra em 10 segundos e o download é liberado na hora.</p>
          <div className="ptzp-final__cta">{download("rodapé")}</div>
          <p className="ptzp-credits">
            Desenvolvido por{" "}
            <a href={YOUTUBE} target="_blank" rel="noopener noreferrer">
              Culto em Off
            </a>
            . Projeto criado por Jonas Silva e Daniel Frizzatti. Jonas é o criador do Culto em Off, projeto voltado a
            compartilhar conhecimento, ferramentas e soluções para áudio, vídeo, transmissão e tecnologia em igrejas. Daniel é
            designer e desenvolvedor, contribuindo com o desenvolvimento e a experiência do PTZ Control Web.
          </p>
        </div>
      </section>
    </>
  );
}
