import { SOFTWARE } from "@/config/software";
import type { DownloadLeadErrors, DownloadLeadInput } from "@/lib/leads";
import DownloadModal from "./DownloadModal";
import LoopVideo from "./LoopVideo";
import "@/components/sections/software/software.css";
import "./software-page.css";

const CLT = SOFTWARE.find((s) => s.id === "church-lower-thirds")!;

/** endereço do painel (dock) para colar no OBS */
export const CLT_DOCK_URL = "http://127.0.0.1:8795/dock";
const MEDIA = "/images/softwares/church-lower-thirds";

/** os nove elementos (texto da página de divulgação enviada pelo Jonas em 26/11/2026) */
const ELEMENTS: [string, string][] = [
  ["Nomes", "Nome e legenda do pregador, cantor ou convidado, digitados na hora ou salvos numa lista"],
  ["Ofertas e dízimos", "Cartão com QR Code de PIX, de link ou com os dados bancários; várias ofertas salvas"],
  ["Selo superior", "Logo, nome da igreja, “ao vivo”, hora, data e recados, num canto da tela"],
  ["Barra inferior", "Avisos em texto rolando"],
  ["Agenda", "Dias e horários dos cultos, um dia por vez"],
  ["Redes sociais", "“Siga-nos” com o @ de cada rede, uma por vez ou em sequência"],
  ["Comentários", "Um comentário digitado na hora, com o nome de quem escreveu"],
  ["Contagem regressiva", "O tempo que falta para o culto começar"],
  ["Logo", "O logo da igreja fixo num canto"],
];

const PANEL: [string, string][] = [
  ["Uma aba por elemento", "O ponto vermelho na aba mostra o que está no ar."],
  ["Chave liga/desliga", "Cinza é fora do ar; vermelha é no ar. O elemento entra e sai com a animação do modelo."],
  ["Lista pronta", "Um clique num nome salvo coloca esse nome na tela. Também dá para digitar um nome na hora."],
  ["Tempo na tela", "Um tempo global tira cada elemento sozinho, e o alfinete fixa o que deve ficar."],
  ["Roteiro do culto", "Põe em ordem o que vai ao ar e avança com um clique em “Próximo”."],
  ["Perfil", "Troca tudo de uma vez, por exemplo do culto de domingo para o encontro de mulheres."],
];

const CONTROL: [string, string][] = [
  ["Tema global", "Um modelo, um conjunto de cores e uma fonte valem para todos os elementos. Cada elemento pode ter aparência própria."],
  ["Posições na tela", "Arraste cada elemento para o lugar e puxe o canto para mudar o tamanho, no layout horizontal ou no vertical."],
  ["Conteúdo", "Nomes, ofertas, avisos, agenda e redes ficam salvos e prontos para o painel."],
  ["Modo simples ou avançado", "O simples mostra só o essencial; o avançado abre todos os ajustes."],
  ["Backup", "Todas as configurações num arquivo, para guardar ou levar a outro computador."],
];

const THEMES: [string, string][] = [
  ["Modelos temáticos", "Para jovens, kids, mulheres, casais, coral, banda, Natal e Páscoa."],
  ["Vidro líquido", "O efeito de vidro aplicado a qualquer modelo."],
  ["Modelos próprios", "O programa entrega um prompt para qualquer IA escrever a aparência de um modelo novo."],
  ["19 fontes e 11 animações", "Fontes incluídas, além das instaladas no computador, e animações de entrada e saída."],
];

const MORE: [string, string][] = [
  ["Perfis", "Guardam conjuntos separados (nome da igreja, logo, aparência, nomes, ofertas e textos) para cada culto ou evento"],
  ["Lista de nomes", "Entra colada ou por arquivo CSV, com busca no painel"],
  ["Layout vertical", "Fontes próprias em 1080 × 1920 para transmissões na vertical"],
  ["Stream Deck e Companion", "Endereços HTTP para mostrar e esconder os elementos, sem plugin"],
  ["Compartilhamento", "Modelos próprios e perfis viajam em arquivo de uma igreja a outra"],
  ["Atualização", "O painel avisa quando há versão nova e atualiza com um clique"],
  ["Idiomas", "Português (Brasil e Portugal), inglês, espanhol, italiano e alemão"],
];

function Checks({ items }: { items: [string, string][] }) {
  return (
    <ul className="cltp-checks">
      {items.map(([t, d]) => (
        <li key={t}>
          <b>{t}.</b> {d}
        </li>
      ))}
    </ul>
  );
}

function Clip({ name, w, h, label, caption }: { name: string; w: number; h: number; label: string; caption: string }) {
  return (
    <figure className="cltp-clip">
      <div className="cltp-clip__frame">
        <LoopVideo src={`${MEDIA}/${name}.mp4`} poster={`${MEDIA}/${name}.webp`} width={w} height={h} label={label} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** "Como funciona": duas origens de comando, um programa, os gráficos no OBS */
function HowDiagram() {
  return (
    <div className="cltp-flow" role="img" aria-label="O painel no OBS e o controle no navegador mandam pedidos ao programa, que atualiza os gráficos no OBS">
      <div className="cltp-flow__col">
        <div className="cltp-node">
          <small>No OBS</small>
          <b>Painel</b>
          <span>Liga e desliga cada elemento durante o culto</span>
        </div>
        <div className="cltp-node">
          <small>No navegador</small>
          <b>Controle</b>
          <span>Aparência e conteúdo, com prévia ao vivo</span>
        </div>
      </div>
      <div className="cltp-flow__arrow" aria-hidden="true">
        <span>pedidos</span>
      </div>
      <div className="cltp-node cltp-node--main">
        <small>Em segundo plano</small>
        <b>Programa</b>
        <span>Guarda as configurações e sabe o que está no ar</span>
      </div>
      <div className="cltp-flow__arrow" aria-hidden="true">
        <span>atualiza</span>
      </div>
      <div className="cltp-node cltp-node--out">
        <small>Fontes de navegador</small>
        <b>Gráficos no OBS</b>
        <span>Fundo transparente, por cima da câmera</span>
      </div>
    </div>
  );
}

type Props = {
  downloadUrl: string;
  action: (input: DownloadLeadInput) => Promise<{ ok: true } | { ok: false; errors: DownloadLeadErrors }>;
};

/** Página do Church Lower Thirds (beta): o que vai para a tela, como funciona, painel, controle, modelos e download com cadastro. */
export default function ChurchLowerThirdsView({ downloadUrl, action }: Props) {
  const download = (location: string) => (
    <div className="dl-group">
      <DownloadModal
        platform="windows"
        source={CLT.id}
        productName={CLT.name}
        downloadUrl={downloadUrl}
        panelUrl={CLT_DOCK_URL}
        action={action}
        location={location}
        sideImage={{ src: `${MEDIA}/elementos.webp`, alt: "", width: 640, height: 360 }}
        steps={(url) => (
          <>
            <li>
              <b>Baixe o instalador</b> na página de versões (o arquivo do Windows da versão mais recente) e execute. Se o Windows mostrar o
              SmartScreen, clique em <b>Mais informações</b> › <b>Executar assim mesmo</b>.
            </li>
            <li>
              <b>Siga o assistente</b>: na primeira vez, ele explica cada passo e deixa tudo pronto.
            </li>
            <li>
              <b>Ligue ao OBS</b>: em <b>OBS e atalhos</b>, o programa cria as fontes com um clique. Para o painel, abra <b>Painéis › Painéis
              personalizáveis com URL</b> e cole:
              {url}
            </li>
          </>
        )}
      />
    </div>
  );

  return (
    <>
      <header className="swp-hero ptzp-hero cltp-hero">
        <div className="ptzp-hero__inner">
          <div className="swp-hero__text">
            <p className="swp-hero__channel">
              <span aria-hidden="true" />
              Software gratuito · Versão beta
            </p>
            <h1 className="swp-hero__title">{CLT.name}</h1>
            <p className="swp-hero__tagline">Lower thirds para igrejas, direto no OBS Studio.</p>
            <p className="swp-hero__desc">
              Coloque nomes, ofertas, avisos e redes sociais na transmissão do culto, com modelos prontos e controle dentro do próprio OBS.
              Criado pelo Culto em Off para equipes de transmissão de igrejas.
            </p>
            <div className="swp-hero__actions">
              {download("topo")}
              <a className="swp-hero__link" href="#elementos">
                Ver o que vai para a tela
              </a>
            </div>
            <p className="ptzp-hero__fine">Windows 10 e 11 · OBS Studio · Gratuito</p>
          </div>
          <Clip
            name="elementos"
            w={640}
            h={360}
            label="Elementos do Church Lower Thirds entrando na tela durante uma transmissão: selo, barra de avisos, cartão de dízimos e ofertas, nome e agenda"
            caption="Numa transmissão real: o selo, os avisos, as ofertas, o nome e a agenda entram por cima da câmera, cada um com a sua animação."
          />
        </div>
      </header>

      <section id="elementos" className="swp-section" aria-labelledby="clt-elementos">
        <div className="swp-section__inner">
          <p className="swp-kicker">O que vai para a tela</p>
          <h2 id="clt-elementos" className="swp-title">
            Nove elementos, um tema só.
          </h2>
          <p className="swp-lead">Cada elemento liga e desliga sozinho, e todos seguem o mesmo tema.</p>
          <dl className="cltp-elements">
            {ELEMENTS.map(([k, v], i) => (
              <div key={k} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                <dt>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {k}
                </dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="swp-section swp-section--alt" aria-labelledby="clt-como">
        <div className="swp-section__inner">
          <p className="swp-kicker">Como funciona</p>
          <h2 id="clt-como" className="swp-title">
            Tudo roda no computador da transmissão.
          </h2>
          <HowDiagram />
          <ul className="cltp-checks cltp-checks--grid">
            <li>
              <b>O programa</b> fica em segundo plano e inicia com o Windows. Ele guarda as configurações e sabe o que deve estar no ar.
            </li>
            <li>
              <b>Os gráficos</b> entram no OBS como fontes de navegador com fundo transparente. Há uma fonte com todos os elementos e uma para
              cada elemento, para quem prefere separar por cena.
            </li>
            <li>
              <b>O painel</b> é um dock dentro do OBS. É ali que o operador liga e desliga cada elemento durante o culto.
            </li>
            <li>
              <b>O controle</b> abre no navegador, com prévia ao vivo. É onde se preparam a aparência e o conteúdo antes do culto.
            </li>
          </ul>
          <p className="ptzp-note">
            O painel e o controle só mandam pedidos; quem atualiza os gráficos é o programa. Por isso o que se muda aparece na hora, sem
            recarregar as fontes no OBS.
          </p>
        </div>
      </section>

      <section className="swp-section" aria-labelledby="clt-painel">
        <div className="swp-section__inner cltp-split">
          <div>
            <p className="swp-kicker">O painel dentro do OBS</p>
            <h2 id="clt-painel" className="swp-title">
              Durante o culto, um clique por elemento.
            </h2>
            <p className="swp-lead">O operador só usa o painel, sem sair do OBS.</p>
            <Checks items={PANEL} />
          </div>
          <Clip
            name="painel"
            w={1100}
            h={508}
            label="Painel do Church Lower Thirds ao lado da saída no OBS: um clique no nome e nas chaves faz cada elemento entrar e sair da tela"
            caption="À esquerda, o painel; à direita, o que vai ao ar. Cada clique aparece na hora."
          />
        </div>
      </section>

      <section className="swp-section swp-section--alt" aria-labelledby="clt-controle">
        <div className="swp-section__inner cltp-split cltp-split--reverse">
          <div>
            <p className="swp-kicker">O controle</p>
            <h2 id="clt-controle" className="swp-title">
              Aparência e conteúdo, com prévia ao vivo.
            </h2>
            <p className="swp-lead">O controle abre no navegador e mostra, numa prévia ao vivo, tudo o que se muda.</p>
            <Checks items={CONTROL} />
          </div>
          <Clip
            name="controle"
            w={1000}
            h={562}
            label="Controle do Church Lower Thirds: troca de modelo com prévia ao vivo e um elemento sendo arrastado em Posições na tela"
            caption="No controle: a troca de modelo com prévia ao vivo e o nome arrastado para outro lugar da tela."
          />
        </div>
      </section>

      <section className="swp-section" aria-labelledby="clt-modelos">
        <div className="swp-section__inner cltp-split">
          <div>
            <p className="swp-kicker">Modelos e temas</p>
            <h2 id="clt-modelos" className="swp-title">
              25 modelos prontos, 30 conjuntos de cores.
            </h2>
            <p className="swp-lead">
              Trocar de modelo muda o formato, a fonte e a animação de todos os elementos de uma vez, e as cores que a igreja escolheu
              continuam.
            </p>
            <Checks items={THEMES} />
          </div>
          <Clip
            name="temas"
            w={600}
            h={338}
            label="A mesma transmissão trocando de tema: todos os elementos mudam de formato, cor e fonte ao mesmo tempo"
            caption="A mesma transmissão em três temas: a troca vale para todos os elementos de uma vez."
          />
        </div>
      </section>

      <section className="swp-section swp-section--alt" aria-labelledby="clt-mais">
        <div className="swp-section__inner ptzp-req">
          <div>
            <p className="swp-kicker">Instalação</p>
            <h2 id="clt-mais" className="swp-title">
              Instale em três passos.
            </h2>
            <ol className="swp-steps ptzp-steps">
              <li>
                <span>01</span>
                <h3>Instale</h3>
                <p>Baixe o instalador para Windows e execute. Se aparecer o SmartScreen: Mais informações › Executar assim mesmo.</p>
              </li>
              <li>
                <span>02</span>
                <h3>Siga o assistente</h3>
                <p>Na primeira vez, um assistente ilustrado explica cada passo e deixa tudo pronto. Quem já conhece pode pular.</p>
              </li>
              <li>
                <span>03</span>
                <h3>Ligue ao OBS</h3>
                <p>
                  Em OBS e atalhos, o programa cria as fontes de navegador com um clique. O painel entra em Painéis › Painéis personalizáveis
                  com URL, com o endereço <code>{CLT_DOCK_URL}</code>.
                </p>
              </li>
            </ol>
          </div>
          <table className="ptzp-table">
            <caption className="sr-only">Outros recursos do Church Lower Thirds</caption>
            <tbody>
              {MORE.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="download" className="swp-section swp-download" aria-labelledby="clt-download">
        <div className="swp-section__inner ptzp-final">
          <p className="swp-kicker">Download gratuito</p>
          <h2 id="clt-download" className="swp-title">
            Baixe o {CLT.name}.
          </h2>
          <p className="swp-lead">
            Versão beta, gratuita. Funciona com o OBS Studio no Windows 10 e 11, em português, inglês, espanhol, italiano e alemão. Você se
            cadastra em 10 segundos e o download é liberado na hora.
          </p>
          <div className="ptzp-final__cta">{download("rodapé")}</div>
          <p className="ptzp-credits">Desenvolvido pelo Culto em Off.</p>
        </div>
      </section>
    </>
  );
}
