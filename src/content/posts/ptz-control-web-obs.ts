import type { SeedPost } from "../lexical";

/**
 * Guia do PTZ Control Web (texto e imagens enviados pelo Jonas em 21/11/2026).
 * Downloads apontam para a página do site (cadastro no popup), não direto para o GitHub.
 */

const IMG = "/blog/ptz-control-web";
const PAGE = "/softwares/ptz-control-web";
const OBS_COURSE = "/formacoes/culto-ao-vivo-com-excelencia";

export const SLUG_PTZ_OBS = "controlar-camera-ptz-obs-studio";
export const PTZ_TUTORIAL_VIDEO = "https://www.youtube.com/watch?v=ISkOzuhff04";

export const guiaPtzControlWebObs: SeedPost = {
  slug: SLUG_PTZ_OBS,
  title: "Como controlar câmeras PTZ no OBS Studio com o PTZ Control Web",
  excerpt:
    "Guia passo a passo para instalar o PTZ Control Web, colocar o controle das câmeras PTZ dentro do OBS Studio, cadastrar câmeras de rede, USB e serial, operar com controle de videogame e salvar presets. Grátis.",
  publishedAt: "2026-11-21T15:00:00.000Z",
  tags: ["PTZ", "OBS Studio", "Câmeras", "Software grátis"],
  cover: { localPath: `${IMG}/capa-controlar-camera-ptz-obs-studio.jpg`, alt: "Como controlar câmeras PTZ no OBS Studio com o PTZ Control Web" },
  seo: {
    title: "Como controlar câmera PTZ no OBS Studio: guia completo",
    description:
      "Aprenda a instalar o PTZ Control Web, adicionar o controle de câmeras PTZ no OBS Studio, usar controle de videogame e salvar presets. Grátis.",
  },
  blocks: [
    {
      p: "Para **controlar câmeras PTZ no OBS Studio** sem sair dele, o PTZ Control Web coloca um painel com movimento, zoom, foco e presets ao lado das suas cenas. É gratuito, roda no próprio computador e foi criado pelo [Culto em Off](/) para equipes de transmissão de igrejas.",
    },
    { youtube: { url: PTZ_TUTORIAL_VIDEO, caption: "Vídeo tutorial: instalação e primeiros passos com o PTZ Control Web" } },
    { p: "Neste guia você vai aprender, passo a passo:" },
    {
      ul: [
        "a instalar o PTZ Control Web no Windows;",
        "a adicionar o painel de controle das câmeras no OBS Studio;",
        "a cadastrar câmeras de rede, USB (como a OBSBOT Tiny 2) ou serial;",
        "a operar as câmeras com um controle de videogame;",
        "a salvar e chamar presets.",
      ],
    },
    { p: "No fim há um resumo das outras funções e as respostas às dúvidas mais comuns." },
    {
      img: {
        sourceUrl: `${IMG}/como-funciona-ptz-control-web.webp`,
        alt: "Diagrama: o PTZ Control Web recebe comandos do OBS, do Stream Deck e do Companion e controla câmeras de rede, seriais e USB",
        caption: "Um servidor no seu computador recebe os comandos e fala com as câmeras.",
      },
    },
    {
      p: "O painel, o Stream Deck, as teclas de atalho e o Companion falam com o mesmo servidor. Por isso todos mostram a mesma câmera ativa e o mesmo último preset.",
    },

    { h2: "O que você precisa" },
    {
      p: "Basta um computador com Windows, o OBS Studio 33 ou mais novo e uma câmera PTZ compatível. Não é preciso internet para controlar câmeras da rede local.",
    },
    {
      table: {
        rows: [
          ["Item", "Requisito"],
          ["Computador", "Windows 10 ou 11, 64 bits"],
          ["OBS Studio", "Versão 33 ou mais nova (o painel também abre direto no navegador)"],
          ["Câmeras de rede", "VISCA over IP (UDP ou TCP) e ONVIF, como PTZOptics, AVer, Telycam e Sony"],
          ["Câmeras USB", "Webcams PTZ no padrão UVC, como a OBSBOT Tiny 2"],
          ["Câmeras seriais", "VISCA por RS-232 ou RS-422, inclusive com adaptador USB, até 7 em cadeia"],
          ["Controle (opcional)", "Controle de videogame no padrão Xbox, por USB ou Bluetooth"],
        ],
      },
    },
    { p: "O programa controla **até 8 câmeras ao mesmo tempo**, misturando protocolos." },

    { h2: "Como instalar o PTZ Control Web no Windows" },
    {
      p: "A instalação leva cerca de um minuto. O programa fica na pasta do seu usuário, e o Windows só pede permissão de administrador se for preciso para copiar o plugin para a pasta do OBS.",
    },
    {
      ol: [
        `Acesse a [página do PTZ Control Web](${PAGE}), faça o cadastro rápido e baixe o arquivo \`PTZ-Control-Web-Setup.exe\`.`,
        "Execute o instalador.",
        "Na tela da pasta de plugins do OBS, mantenha a sugerida (`C:\\ProgramData\\obs-studio\\plugins`). Troque apenas se você usa o OBS portátil ou uma instalação personalizada.",
        "Deixe marcada a opção **Criar atalho na área de trabalho**.",
        "Conclua com **Iniciar o servidor PTZ Control Web** e **Abrir PTZ Control Web** marcados.",
      ],
    },
    {
      callout: {
        kind: "atencao",
        title: "Aviso do Windows",
        text: "Se o Windows mostrar o aviso do SmartScreen, clique em **Mais informações** e depois em **Executar assim mesmo**.",
      },
    },
    {
      p: "Pronto: o painel abre no navegador e o servidor passa a iniciar sozinho junto com o Windows. Nas próximas vezes, use o atalho da área de trabalho para abrir o painel fora do OBS. O instalador também coloca o plugin de teclas de atalho do OBS, explicado mais abaixo.",
    },

    { h2: "Como adicionar o controle PTZ no OBS Studio" },
    {
      p: "O PTZ Control Web entra no OBS como um painel personalizável com URL, que pode ser encaixado ao lado das cenas e das fontes.",
    },
    {
      ol: [
        "Abra o OBS Studio 33 ou mais novo.",
        "No menu superior, clique em **Painéis** › **Painéis personalizáveis com URL…**.",
        "Em **Nome do painel**, digite `PTZ Control Web`.",
        "Em **URL**, cole `http://127.0.0.1:8765/obs`.",
        "Clique em **Aplicar** e feche a janela.",
        "Arraste o painel pela barra de título até o lugar que preferir: ao lado de Cenas, embaixo da Pré-visualização ou num segundo monitor.",
      ],
    },
    { p: "Dentro do OBS o painel fica compacto sozinho: esconde o rodapé, reduz os espaços e mostra só o essencial para a operação." },
    {
      img: {
        sourceUrl: `${IMG}/painel-ptz-obs-studio.webp`,
        alt: "Painel do PTZ Control Web no OBS Studio com abas de câmeras, direcional, zoom, foco e presets",
        caption: "O painel dentro do OBS: câmeras no topo, controles à esquerda e presets à direita, com o último chamado em destaque.",
      },
    },
    { h3: "O que aparece no painel" },
    {
      table: {
        rows: [
          ["Área", "Para que serve"],
          ["Abas das câmeras", "Escolhem a câmera controlada; mostram PGM (no ar) e PVW (na prévia) quando o OBS está conectado"],
          ["Direcional", "Move a câmera nas 8 direções; o botão do centro volta para a posição inicial (Home)"],
          ["Zoom e foco", "Botões de lupa (+ e −), foco perto e longe; o foco automático (AF) vem ligado e destacado"],
          ["Velocidade", "Controle deslizante com o valor ao lado"],
          ["Presets", "Botões numerados com o nome de cada posição salva"],
        ],
      },
    },
    {
      callout: {
        kind: "dica",
        text: "Prefere os presets embaixo dos controles? Em **Configurações** › **Geral** › **Layout**, troque para **Abaixo (Vertical)**. Ali também ficam o tema claro ou escuro e a densidade da tela.",
      },
    },

    { h2: "Como cadastrar as câmeras PTZ" },
    { p: "Cada câmera é cadastrada uma vez, com nome, protocolo e endereço; o programa guarda tudo e reconecta sozinho." },
    {
      ol: [
        "No painel, clique na engrenagem (**Configurações**) e abra a aba **Câmeras**.",
        "Clique em **+ Adicionar**.",
        "Para câmeras de rede, clique em **⌕ Procurar**: o programa lista as câmeras que respondem na rede. Clique em **Usar** para preencher o IP.",
        "Dê um nome curto, como `Palco` ou `Púlpito`. É esse nome que aparece nas abas, no Stream Deck e nas teclas de atalho do OBS.",
        "Escolha o protocolo e confira a porta (veja a tabela abaixo).",
        "Clique em **Salvar câmera**. Um ponto verde na aba indica que a câmera está respondendo.",
      ],
    },
    {
      img: {
        sourceUrl: `${IMG}/cadastro-cameras-ptz.webp`,
        alt: "Cadastro de câmera PTZ no PTZ Control Web com a busca de câmeras na rede",
        caption: "A busca encontra as câmeras da rede; o botão Usar preenche o IP.",
      },
    },
    {
      table: {
        rows: [
          ["Protocolo", "Quando usar", "O que preencher"],
          ["VISCA over IP — UDP", "A maioria das câmeras PTZ de rede", "IP e porta; o padrão é 52381, e algumas marcas, como a PTZOptics, usam 1259"],
          ["VISCA over IP — TCP", "Câmeras que só aceitam TCP", "IP e porta; o padrão é 5678"],
          ["ONVIF", "Câmeras sem VISCA ou modelos de segurança", "IP, porta 80, usuário e senha da câmera"],
          ["VISCA Serial", "Cabo RS-232 ou RS-422, inclusive por adaptador USB", "Porta COM, baud rate (9600, 19200, 38400 ou 115200) e endereço VISCA de 1 a 7"],
          ["USB (UVC)", "OBSBOT Tiny 2 e outras webcams PTZ", "Escolha a câmera na lista"],
        ],
        caption: "Protocolos aceitos e o que preencher no cadastro de cada câmera.",
      },
    },
    {
      callout: {
        kind: "info",
        title: "Câmeras seriais",
        text: "O endereço só importa quando várias câmeras estão em cadeia na mesma porta: a primeira é 1, a segunda 2, e assim por diante.",
      },
    },
    {
      callout: {
        kind: "atencao",
        title: "Câmeras USB",
        text: "Câmeras USB não guardam presets na memória, então as posições ficam salvas no computador. Na OBSBOT, desligue o rastreamento por IA para que ele não desfaça o movimento manual.",
      },
    },
    {
      callout: {
        kind: "dica",
        text: "Se a câmera mexe para o lado errado, marque **Inverter Pan** ou **Inverter Tilt** no cadastro dela.",
      },
    },

    { h2: "Como controlar a câmera PTZ com um controle de videogame" },
    {
      p: "Um controle no padrão Xbox vira uma mesa de controle PTZ: movimento no analógico, zoom nos gatilhos e presets no direcional, sem tirar os olhos da transmissão.",
    },
    {
      img: {
        sourceUrl: `${IMG}/controle-videogame-obsbot-tiny-2.webp`,
        alt: "Controle de videogame movendo uma câmera PTZ OBSBOT Tiny 2",
        caption: "Um controle comum de videogame operando uma OBSBOT Tiny 2 pelo PTZ Control Web.",
      },
    },
    {
      ol: [
        "Conecte o controle ao computador por USB ou Bluetooth.",
        "No painel, abra **Configurações** › **Geral** e ligue **Ativar Gamepad USB**.",
        "Aperte qualquer botão do controle para o painel reconhecê-lo. O ícone de controle no topo do painel acende quando ele está conectado.",
      ],
    },
    {
      table: {
        rows: [
          ["Comando no controle", "O que faz"],
          ["Analógico esquerdo", "Move a câmera nas 8 direções, na velocidade escolhida"],
          ["Analógico direito, para cima ou para baixo", "Aumenta ou diminui a velocidade"],
          ["RT / LT", "Zoom + / zoom −"],
          ["RB / LB", "Foco longe / foco perto"],
          ["X", "Volta ao foco automático"],
          ["Direcional (D-pad)", "Escolhe o preset"],
          ["A", "Chama o preset escolhido"],
          ["Y", "Salva a posição atual no preset escolhido"],
          ["B", "Passa para a próxima câmera"],
        ],
      },
    },
    { p: "O mapa completo aparece na mesma tela de configurações, com o desenho do controle e o nome de cada botão." },
    {
      img: {
        sourceUrl: `${IMG}/controle-xbox-camera-ptz.webp`,
        alt: "Mapa dos botões do controle Xbox no PTZ Control Web: zoom, foco, presets e troca de câmera",
        caption: "O mapa do controle nas configurações: o botão apertado acende no desenho.",
      },
    },
    {
      callout: {
        kind: "dica",
        text: "Quer usar só o controle físico e deixar a tela limpa? Em **Controles PTZ**, desligue **Exibir setas, zoom e foco**: o painel passa a mostrar apenas as câmeras e os nomes dos presets.",
      },
    },

    { h2: "Como salvar e chamar presets" },
    {
      p: "Preset é uma posição guardada da câmera, como “Púlpito”, “Banda” ou “Plano geral”. Com eles, a câmera vai ao enquadramento certo com um clique.",
    },
    { h3: "Para salvar" },
    {
      ol: [
        "Posicione a câmera com o direcional, o zoom e o foco.",
        "Clique com o botão direito num preset livre.",
        "Dê um nome e clique em **◆ Salvar posição atual**.",
      ],
    },
    {
      img: {
        sourceUrl: `${IMG}/salvar-preset-camera-ptz.webp`,
        alt: "Janela para salvar a posição atual da câmera PTZ como preset",
        caption: "O botão direito abre o preset: dê o nome e salve a posição atual.",
      },
    },
    { h3: "Para chamar" },
    {
      p: "Clique no preset, ou use as teclas **1** a **0** do teclado (o 0 chama o preset 10). No controle de videogame, escolha pelo direcional e confirme no **A**.",
    },
    {
      p: "O último preset chamado fica com uma cor diferente. A cor some assim que alguém move a câmera manualmente, para o operador saber que ela já não está naquela posição.",
    },
    {
      callout: { kind: "dica", text: "O painel mostra de 8 a 24 presets por câmera: ajuste em **Configurações** › **Geral** › **Presets**." },
    },

    { h2: "Outras funções do PTZ Control Web" },
    { p: "Com o básico funcionando, estes recursos poupam cliques durante o culto ou o evento." },
    {
      table: {
        rows: [
          ["Recurso", "Onde ativar", "O que faz"],
          ["Seguir a cena do OBS", "Configurações › Geral › OBS Studio", "Seleciona sozinho a câmera da cena; no Modo estúdio, segue a Pré-visualização ou o Programa e marca PGM e PVW nas abas"],
          ["Teclas de atalho do OBS", "OBS › Configurações › Teclas de atalho", "Lista cada câmera e cada preset pelo nome, como “PTZ Control Web · Palco — 01 Púlpito”"],
          ["Stream Deck e Ulanzi D200", "Configurações › Geral › Stream Deck e Ulanzi", "Instala o plugin com um clique; as teclas mostram o nome dos presets e destacam o último chamado"],
          ["Bitfocus Companion", "Conexão HTTP genérica no Companion", "Chama presets e move câmeras por endereços como `POST http://127.0.0.1:8765/api/companion/camera/1/preset/1/recall`"],
          ["Backup", "Configurações › Geral › Backup", "Salva câmeras, presets e preferências num arquivo onde você escolher; o arquivo inclui as senhas, então guarde-o bem"],
          ["Atualizações", "Configurações › Sobre › Procurar atualizações", "Baixa, confere e instala a versão nova sem perder a configuração"],
          ["Idioma e tema", "Configurações › Geral", "Português, inglês, espanhol ou alemão; tema claro ou escuro"],
        ],
      },
    },
    {
      callout: {
        kind: "info",
        title: "Seguir a cena do OBS",
        text: "O OBS precisa estar com o WebSocket ligado: em **Ferramentas** › **Configurações do servidor WebSocket**, marque **Ativar servidor WebSocket** e use **Mostrar informações da conexão** para copiar a senha para o cartão OBS Studio do PTZ Control Web. O programa reconhece a câmera pelo nome da fonte, pelo IP nas configurações dela ou pela fonte definida em **Fonte no OBS** no cadastro da câmera.",
      },
    },

    { h2: "Perguntas frequentes" },
    {
      faq: [
        { question: "O PTZ Control Web é gratuito?", answer: "Sim. O programa e os plugins para OBS, Stream Deck e Ulanzi são gratuitos." },
        {
          question: "Quais câmeras PTZ são compatíveis?",
          answer: "Qualquer câmera que aceite VISCA over IP (UDP ou TCP), VISCA Serial, ONVIF ou USB no padrão UVC. Isso inclui a maior parte das câmeras PTZ usadas em igrejas e a OBSBOT Tiny 2.",
        },
        { question: "Funciona no Mac ou no Linux?", answer: "O instalador é para Windows 10 e 11, de 64 bits. As câmeras USB também dependem do Windows." },
        { question: "Preciso de internet para usar?", answer: "Não. Tudo roda no próprio computador, e a internet só é usada para procurar atualizações." },
        {
          question: "O painel aparece em branco no OBS. O que fazer?",
          answer: "Abra o atalho da área de trabalho: se o painel abrir no navegador, o servidor está ligado e basta conferir a URL no OBS. Se outro programa ocupa a porta 8765, o servidor usa a próxima livre, e o número em uso fica no arquivo `%APPDATA%\\PTZ Control Web\\server-port.txt`.",
        },
        {
          question: "A câmera não responde. O que conferir?",
          answer: "Confira se o computador e a câmera estão na mesma rede, se o IP e a porta estão certos e se o protocolo escolhido está ativado no menu da câmera. Para ONVIF, confira também o usuário e a senha.",
        },
        {
          question: "A troca automática de câmera parou de funcionar.",
          answer: "Verifique se o WebSocket do OBS está ligado e se a senha está certa. No modo de segurança do OBS 33, o WebSocket e os plugins de terceiros ficam desligados: reinicie o OBS normalmente.",
        },
        {
          question: "O controle de videogame não mexe a câmera.",
          answer: "Confirme que **Ativar Gamepad USB** está ligado e aperte um botão do controle para o painel reconhecê-lo. Use um controle no padrão Xbox; outros modelos podem ter os botões em posições diferentes.",
        },
      ],
    },

    { h2: "Comece agora" },
    {
      callout: {
        kind: "info",
        title: "Download gratuito",
        text: "Com o painel no OBS, as câmeras cadastradas e alguns presets salvos, um voluntário já opera a transmissão inteira sem sair do OBS.",
        button: { label: "Baixe o PTZ Control Web grátis para Windows", url: PAGE },
      },
    },
    {
      p: `Quer ir além? No [canal do Culto em Off no YouTube](https://www.youtube.com/@CultoemOff) há vídeos sobre transmissão ao vivo para igrejas, e o [curso de OBS Studio para igrejas Culto ao Vivo com Excelência](${OBS_COURSE}) é dedicado ao OBS Studio. Para entender quando a câmera PTZ vale a pena, leia também [Câmera PTZ para igreja: o que é, se vale a pena e como escolher](/blog/camera-ptz-para-igreja-vale-a-pena).`,
    },
    {
      p: "O PTZ Control Web foi criado por Jonas Silva, do Culto em Off, e Daniel Frizzatti. Se ele ajudou sua equipe, compartilhe este guia com outros voluntários.",
    },
  ],
};
