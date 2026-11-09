import type { SeedPost } from "../lexical";

/**
 * Guias do blog para SEO (escritos em 09/11/2026): cada um responde uma busca real e leva a um curso.
 * Ilustrações em /public/blog/guias/ (capas e diagramas próprios do Culto em Off).
 */

const OBS = "/formacoes/culto-ao-vivo-com-excelencia";
const REDES = "/formacoes/redes-para-igrejas";
const G = "/blog/guias";

export const SLUG_TRANSMITIR = "como-transmitir-o-culto-ao-vivo-com-obs-studio";
export const SLUG_CAMERA = "qual-camera-comprar-para-transmitir-o-culto";
export const SLUG_PTZ = "camera-ptz-para-igreja-vale-a-pena";
export const SLUG_WIFI = "wi-fi-na-igreja-rede-que-nao-cai-no-culto";
export const SLUG_TRAVANDO = "live-do-culto-travando-causas-e-solucoes";

/* ------------------------------------------------------------------ */

export const guiaTransmitirCulto: SeedPost = {
  slug: SLUG_TRANSMITIR,
  title: "Como transmitir o culto ao vivo no YouTube com OBS Studio: guia completo para igrejas",
  excerpt:
    "Como fazer a live do culto no YouTube com o OBS Studio: o que é o OBS, onde baixar, como ligar câmeras e a mesa de som, como montar as cenas e como configurar o OBS para a transmissão ao vivo.",
  publishedAt: "2026-11-09T15:00:00.000Z",
  tags: ["Transmissão", "OBS Studio", "YouTube"],
  cover: { localPath: `${G}/transmitir-culto-obs-capa.jpg`, alt: "Como transmitir o culto ao vivo com OBS Studio" },
  blocks: [
    {
      p: "Transmitir o culto ao vivo deixou de ser coisa de igreja grande. Com um computador, uma câmera e o **OBS Studio**, que é gratuito, dá para levar o culto a quem está em casa, no hospital ou viajando. O que separa uma live que funciona de uma que trava, chia ou fica escura não é o preço do equipamento: é entender o caminho que o vídeo e o som percorrem até chegar no celular de quem assiste.",
    },
    { p: "Este guia mostra esse caminho do começo ao fim, na realidade de igrejas pequenas e médias de qualquer denominação: igreja batista, presbiteriana, Assembleia de Deus, pentecostal, e também paróquias que transmitem a missa." },
    { h2: "O que é o OBS Studio" },
    {
      p: "O **OBS Studio** (Open Broadcaster Software) é um programa gratuito e de código aberto para transmitir ao vivo e gravar vídeo. Ele junta câmeras, som, imagens, letras e vídeos em **cenas** e envia o resultado para o YouTube, o Facebook ou outra plataforma. Também funciona como gravador: dá para gravar o culto ou a tela do computador sem transmitir.",
    },
    { h2: "O caminho da transmissão" },
    {
      p: "Toda transmissão de culto tem as mesmas peças: as **câmeras**, o **som** (que sai da mesa), as **letras e avisos**, o **computador com o OBS** juntando tudo e a **internet** enviando para o YouTube ou o Facebook.",
    },
    { img: { sourceUrl: `${G}/transmitir-culto-obs-fluxo.jpg`, alt: "Diagrama: câmeras, mesa de som e letras chegam ao PC com OBS, que envia pela internet para o YouTube e o Facebook" } },
    {
      p: "Quando algo dá errado, quase sempre é em uma dessas ligações. Por isso vale montar e testar uma de cada vez.",
    },
    { h2: "1. O que você precisa" },
    {
      ul: [
        "**Um computador** com placa de vídeo dedicada ou processador recente. Ele não precisa ser de última geração, mas não pode ser o mesmo que roda a projeção com muitas outras tarefas.",
        "**OBS Studio**, gratuito, para Windows, Mac e Linux. Faça o download do OBS Studio só no site oficial (obsproject.com): sites que oferecem \"baixar OBS\" com instalador próprio podem trazer outros programas junto.",
        "**Uma câmera** e um jeito de ligá-la no computador. Se ainda não tem, veja o nosso guia [qual câmera comprar para transmitir o culto](/blog/qual-camera-comprar-para-transmitir-o-culto).",
        "**Uma saída de áudio da mesa de som** para o computador.",
        "**Internet com upload estável**, de preferência por cabo.",
      ],
    },
    { h2: "2. Ligando a câmera no OBS" },
    {
      p: "O tipo de câmera não define o tipo de conexão. A mesma câmera pode chegar ao computador por caminhos diferentes:",
    },
    {
      ul: [
        "**USB**: webcams e algumas câmeras PTZ. É o mais simples, mas o cabo USB tem limite de comprimento.",
        "**HDMI ou SDI com placa de captura**: câmeras mirrorless, filmadoras e PTZ. O HDMI funciona bem em distâncias curtas; para cabos longos, o SDI ou conversores são mais seguros.",
        "**Pela rede (NDI)**: o vídeo viaja no cabo de rede da igreja. No OBS, isso funciona com o plugin **DistroAV**. É o caminho que mais simplifica a cabine quando há várias câmeras.",
      ],
    },
    {
      p: "No OBS, a câmera entra como uma **fonte** (\"Dispositivo de captura de vídeo\" para USB e placas, ou a fonte do NDI). Ajuste a resolução da fonte para a mesma da transmissão, normalmente 1920×1080 ou 1280×720.",
    },
    { h2: "3. O som da live não é o som do templo" },
    {
      p: "Esse é o erro mais comum. O som que soa bem no templo chega ruim na live porque a mesa está mixada para o ambiente: a caixa do louvor e a acústica do salão completam o que falta. Em casa, a pessoa ouve só o que sai do cabo.",
    },
    {
      ul: [
        "Use uma **saída auxiliar** da mesa só para a transmissão, com um mix pensado para fone e celular.",
        "Com **mesa de som analógica**, leve esse sinal para o computador por uma **interface de áudio** USB. Na **mesa de som digital**, a própria USB da mesa costuma funcionar como placa de áudio: mesas como a **Behringer X32** enviam vários canais separados para o computador.",
        "No OBS, ajuste os níveis no **mixer de áudio**: a voz deve ficar na faixa amarela nos picos, sem encostar no vermelho.",
        "Filtros simples ajudam muito: **compressor** e **limitador** evitam picos que estouram.",
      ],
    },
    {
      p: "Se o áudio chega atrasado em relação à imagem, o OBS tem o ajuste de **deslocamento de sincronia** em cada fonte de áudio.",
    },
    { h2: "4. Monte as cenas do culto" },
    {
      p: "Uma **cena** é uma tela pronta: câmera, letra, logo, tarja. Monte uma cena para cada momento do culto e o operador só precisa clicar na hora certa. Um plano simples que funciona:",
    },
    {
      ol: [
        "**Antes do culto**: logo da igreja, contagem regressiva e uma música.",
        "**Louvor**: câmera da banda com a letra embaixo.",
        "**Palavra**: câmera do pregador, com uma tarja com o nome.",
        "**Avisos e oferta**: arte com QR code ou chave Pix.",
        "**Encerramento**: logo, redes sociais e próximo culto.",
      ],
    },
    {
      p: "Use o **Modo Estúdio** do OBS: você prepara a próxima cena na prévia, sem ninguém ver, e só passa para o ar quando estiver pronta. As letras podem vir do Holyrics ou do SPresenter, direto para o OBS.",
    },
    { h2: "5. Como configurar o OBS para a live no YouTube" },
    {
      p: "Antes de mexer no OBS, meça a velocidade de **upload** da igreja no horário do culto, com outras pessoas conectadas. A regra prática é usar no máximo uns 60% a 70% desse upload para a live.",
    },
    {
      ul: [
        "**Resolução e quadros**: 1080p a 30 fps se o upload passa de uns 10 Mbps; com menos, 720p a 30 fps costuma ser mais seguro.",
        "**Controle de taxa**: CBR (taxa constante), como o YouTube recomenda.",
        "**Intervalo de quadro-chave**: 2 segundos.",
        "**Encoder**: se o computador tem placa de vídeo, use o encoder dela (NVENC na NVIDIA, AMF na AMD, QuickSync na Intel). Isso alivia o processador.",
        "**Áudio**: AAC a 128 kbps é o que o YouTube indica para estéreo.",
      ],
    },
    {
      p: "Faça sempre uma **transmissão de teste** como não listada ou privada, de pelo menos 15 minutos, antes do primeiro domingo.",
    },
    { h3: "Primeira live no YouTube" },
    {
      p: "Antes da primeira live, o canal precisa ter a transmissão ao vivo ativada no **YouTube Studio**, e essa liberação pode levar até 24 horas. Faça isso com antecedência. Depois, copie a **chave de transmissão** do YouTube Studio para o OBS (Configurações > Transmissão), ou conecte a sua conta direto pelo OBS.",
    },
    { h3: "E fazer live no YouTube pelo celular?" },
    {
      p: "Dá para fazer live no YouTube pelo celular, direto no aplicativo, mas o YouTube pede requisitos mínimos do canal para isso, e o celular sozinho não junta câmeras, som da mesa e letras. Para o culto, o caminho mais completo é fazer a live pelo computador com o OBS, usando o celular como câmera, se precisar (veja o guia [Qual câmera comprar para transmitir o culto](/blog/qual-camera-comprar-para-transmitir-o-culto)).",
    },
    { h3: "OBS ou Streamlabs?" },
    {
      p: "O Streamlabs Desktop (antigo Streamlabs OBS) é outro programa baseado no OBS, mais voltado para quem faz live de jogos, com alertas e overlays prontos. Para o culto, o OBS Studio puro é mais leve e tem tudo o que a igreja precisa. Comparando com programas pagos? Veja [OBS Studio ou vMix: qual usar na igreja](/blog/obs-studio-ou-vmix-qual-usar-na-igreja).",
    },
    { h2: "6. No domingo: checklist rápido" },
    {
      ul: [
        "Ligue tudo pelo menos 30 minutos antes.",
        "Confira se todas as câmeras e o áudio aparecem no OBS.",
        "Abra a live como não listada, ouça com fone e veja no celular.",
        "Deixe a janela de **estatísticas** do OBS aberta para acompanhar quadros perdidos.",
        "Tenha um plano B: cabo reserva, uma cena de \"voltamos já\" e o celular com internet móvel.",
      ],
    },
    {
      p: "Se a live começar a travar, o nosso guia [Live do culto travando? 7 causas e como resolver](/blog/live-do-culto-travando-causas-e-solucoes) mostra como descobrir o motivo pelas estatísticas do OBS.",
    },
    { hr: true },
    { h2: "Quer aprender tudo isso na prática?" },
    {
      p: `No **Culto ao Vivo com Excelência**, nosso [curso de OBS Studio para igrejas](${OBS}), cada etapa deste guia vira aula prática, gravada na tela do OBS e na cabine de uma igreja de verdade: câmeras e PTZ, NDI, o mix da live, cenas, letras com Holyrics e SPresenter, encoder, plataformas e o plano B do domingo.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaCameraCulto: SeedPost = {
  slug: SLUG_CAMERA,
  title: "Qual câmera comprar para transmitir o culto: do celular à PTZ",
  excerpt:
    "Celular, webcam, câmera de ação, mirrorless, DSLR, filmadora ou PTZ: o que cada câmera resolve na live da igreja, os cuidados de cada uma e por onde começar o equipamento para live com o orçamento que você tem.",
  publishedAt: "2026-11-09T14:00:00.000Z",
  tags: ["Câmeras", "Transmissão"],
  cover: { localPath: `${G}/camera-culto-capa.jpg`, alt: "Qual câmera comprar para transmitir o culto" },
  blocks: [
    {
      p: "\"Qual câmera eu compro para a live da igreja?\" A resposta honesta é: depende do que está atrapalhando a sua transmissão hoje. Uma câmera cara mal ligada fica pior que uma simples bem configurada. Este guia mostra o que cada tipo de câmera resolve, para você investir no degrau certo.",
    },
    { img: { sourceUrl: `${G}/camera-culto-degraus.jpg`, alt: "Degraus de câmeras para a live do culto: celular, webcam USB, câmera de ação, mirrorless com placa de captura e PTZ" } },
    { h2: "Antes de comprar: três perguntas" },
    {
      ol: [
        "**Qual a distância até o púlpito?** Câmeras sem zoom óptico só funcionam bem de perto.",
        "**Quantas câmeras você quer operar?** Com uma pessoa só na cabine, câmeras que se movem por controle remoto fazem muita diferença.",
        "**Como a câmera vai chegar no computador?** Cabo USB, HDMI com placa de captura ou rede. O cabo pode custar tanto quanto a câmera, se a distância for grande.",
      ],
    },
    { h2: "Degrau 1: o celular" },
    {
      p: "O celular que já está no bolso de alguém da equipe é um ótimo começo. Aplicativos como **DroidCam** e **Iriun Webcam** transformam o celular em webcam no OBS, pela rede Wi-Fi ou por cabo. Outra opção é o **VDO.Ninja** (antigo OBS.Ninja), que leva a câmera do celular para o OBS pelo navegador.",
    },
    {
      ul: [
        "**Bom para**: começar sem gastar e ter uma segunda câmera (ângulo da banda, da plateia).",
        "**Cuidados**: aquecimento e bateria em cultos longos, notificações e ligações no meio da live, e o Wi-Fi, que pode oscilar. Use um suporte firme e, se puder, cabo e carregador.",
      ],
    },
    { h2: "Degrau 2: a webcam USB" },
    {
      ul: [
        "**Bom para**: plano aberto do púlpito em igrejas pequenas, com o computador perto. Liga direto no USB, sem placa.",
        "**Cuidados**: quase sempre não tem zoom óptico, e o cabo USB não vai longe sem extensor ativo. Em ambiente com pouca luz, a imagem perde qualidade rápido.",
      ],
    },
    { h2: "Degrau 3: a câmera de ação" },
    {
      p: "Câmeras de ação, como a DJI Action 4, que usamos nas aulas, têm imagem limpa, lente grande-angular e podem funcionar como webcam.",
    },
    {
      ul: [
        "**Bom para**: planos abertos e ângulos diferentes (bateria, palco inteiro).",
        "**Cuidados**: a lente muito aberta não serve para fechar no pregador de longe, e a alimentação precisa ser contínua em cultos longos.",
      ],
    },
    { h2: "Degrau 4: mirrorless com placa de captura" },
    {
      p: "Uma câmera mirrorless, como a Sony ZV-E10, dá aquela imagem com fundo desfocado e cores bonitas. Ela entra no computador pela saída HDMI, com uma placa de captura. O mesmo vale para outras mirrorless e DSLR (de marcas como Sony, Canon, Panasonic, Nikon e Fujifilm) e para filmadoras com saída HDMI.",
    },
    {
      ul: [
        "**Bom para**: a câmera principal do pregador, quando você quer qualidade de imagem.",
        "**Cuidados**: confira se a câmera tem **saída HDMI limpa** (sem os menus na tela), use **bateria falsa ligada na tomada** e veja se ela não desliga sozinha depois de um tempo. O zoom depende da lente.",
      ],
    },
    { h2: "Degrau 5: a câmera PTZ" },
    {
      p: "A PTZ gira (pan), inclina (tilt) e dá zoom por controle remoto. Para a igreja, é o degrau que mais muda a operação: uma pessoa só controla várias câmeras e salva posições prontas para cada momento do culto.",
    },
    {
      ul: [
        "**Bom para**: igrejas que querem vários ângulos sem ter um operador em cada câmera.",
        "**Cuidados**: escolha o zoom pela distância até o púlpito e prefira uma câmera IP PTZ com saída pela rede (NDI) e alimentação pelo cabo de rede (PoE).",
      ],
    },
    {
      p: "Explicamos isso em detalhe no guia [Câmera PTZ para igreja: vale a pena?](/blog/camera-ptz-para-igreja-vale-a-pena).",
    },
    { h2: "Então, por onde começar?" },
    {
      ul: [
        "**Orçamento zero**: celular bem posicionado e um bom mix de áudio. O som pesa mais que a imagem para quem assiste.",
        "**Primeiro investimento**: uma câmera principal para o púlpito com zoom óptico, ou uma mirrorless com placa de captura.",
        "**Para crescer**: PTZ com NDI e PoE, que simplifica cabos e permite operar vários ângulos com uma pessoa.",
      ],
    },
    {
      p: "Preços mudam muito; compare sempre a câmera **somada** ao que ela precisa para chegar ao computador (placa, cabos, conversores, alimentação).",
    },
    { hr: true },
    { h2: "Veja cada câmera funcionando" },
    {
      p: `No **Culto ao Vivo com Excelência**, nosso [curso de OBS Studio para igrejas](${OBS}), o módulo de câmeras mostra os tipos lado a lado e tem aulas práticas configurando e testando uma webcam USB, a DJI Action 4 e a Sony ZV-E10 no OBS, além da PTZ com NDI.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaPtzIgreja: SeedPost = {
  slug: SLUG_PTZ,
  title: "Câmera PTZ para igreja: o que é, se vale a pena e como escolher",
  excerpt:
    "O que é uma câmera PTZ, por que ela é a câmera ideal para muitas igrejas, como escolher o zoom e as conexões, e como controlar com presets, joystick ou plugin no OBS.",
  publishedAt: "2026-11-09T13:00:00.000Z",
  tags: ["Câmeras", "PTZ"],
  cover: { localPath: `${G}/camera-ptz-igreja-capa.jpg`, alt: "Câmera PTZ para igreja" },
  blocks: [
    {
      p: "A câmera PTZ (em inglês, PTZ camera) tem esse nome por causa de **pan, tilt e zoom**: ela gira para os lados, inclina para cima e para baixo e aproxima a imagem, tudo por controle remoto. Para a igreja, isso resolve o maior problema da transmissão: ter poucos voluntários para muitas câmeras.",
    },
    { h2: "Por que a PTZ combina com a igreja" },
    {
      ul: [
        "**Uma pessoa opera várias câmeras** da cabine, sem ninguém andando no meio do culto.",
        "**Presets**: você salva posições prontas e chama cada uma com um botão.",
        "**Discreta**: fica presa na parede ou no teto, sem tripé no corredor.",
        "**Zoom óptico**: fecha no pregador mesmo de longe, sem perder qualidade.",
      ],
    },
    { h2: "Presets: o culto em botões" },
    {
      p: "O preset é a grande vantagem da PTZ. Antes do culto, você posiciona a câmera em cada enquadramento e salva. Na hora, um clique leva a câmera até lá, com movimento suave.",
    },
    { img: { sourceUrl: `${G}/camera-ptz-presets.jpg`, alt: "Exemplo de presets de câmera PTZ: púlpito, louvor, ministro, geral, plateia e oferta" } },
    {
      p: "Dica: dê nomes aos presets pelo momento do culto, não pela posição (\"Pregação\", e não \"Centro 2\"). Assim qualquer voluntário entende.",
    },
    { h2: "Como escolher" },
    { h3: "Zoom" },
    {
      p: "Escolha pela distância da câmera até o púlpito. Em salões pequenos, zoom menor já resolve; em templos grandes, com a câmera no fundo, procure zoom óptico maior. Desconfie do zoom digital: ele só aumenta a imagem e perde qualidade.",
    },
    { h3: "Saídas de vídeo" },
    {
      ul: [
        "**USB**: simples, mas com limite de distância.",
        "**HDMI / SDI**: precisa de placa de captura no computador; SDI vai mais longe.",
        "**NDI pela rede**: o vídeo chega ao OBS pelo cabo de rede, sem placa. Há o NDI completo (mais qualidade, mais banda) e o NDI|HX (comprimido, mais leve para a rede). No OBS, o NDI entra com o plugin DistroAV.",
      ],
    },
    { h3: "Câmera IP PTZ: cuidado com as câmeras de segurança" },
    {
      p: "**Câmera IP PTZ** é a PTZ que se liga à rede: recebe um endereço IP, é controlada pela rede e envia o vídeo por NDI, RTSP ou SRT. Câmeras de segurança também são vendidas como \"IP PTZ\", mas muitas só têm RTSP, com atraso e imagem pensados para vigilância, não para transmissão. Para a live do culto, prefira modelos feitos para transmissão ao vivo, com NDI ou saída HDMI/SDI. Há opções de marcas como Sony e Panasonic e de fabricantes mais acessíveis.",
    },
    { h3: "PoE" },
    {
      p: "Com **PoE** (energia pelo cabo de rede), um único cabo leva energia, vídeo e controle. Confira se a câmera pede **PoE+** e se o seu switch entrega essa potência.",
    },
    { img: { sourceUrl: `${G}/camera-ptz-um-cabo.jpg`, alt: "Diagrama: câmera PTZ ligada por um cabo de rede a um switch PoE, que leva o vídeo ao PC com OBS e recebe os comandos do controle" } },
    {
      p: "Para isso funcionar bem, a rede da igreja precisa estar organizada: endereços IP fixos para as câmeras e um switch adequado. Explicamos o básico no guia [Wi-Fi na igreja: uma rede que não cai no culto](/blog/wi-fi-na-igreja-rede-que-nao-cai-no-culto).",
    },
    { h2: "Como controlar a PTZ" },
    {
      ul: [
        "**Controle remoto IR** que vem com a câmera: serve para configurar, não para operar o culto.",
        "**Plugin no OBS**: controla a câmera e chama presets sem sair do OBS. O Culto em Off tem o próprio controle gratuito, o [PTZ Control Web](/softwares/ptz-control-web).",
        "**Controle de videogame**: uma solução barata e surpreendentemente boa para movimentos suaves.",
        "**Joystick dedicado**: o mais confortável para quem opera todo domingo, com botões físicos para presets e várias câmeras.",
      ],
    },
    { h2: "Então, vale a pena?" },
    {
      p: "Se a sua igreja transmite toda semana e tem pouca gente na cabine, sim: a PTZ costuma ser o investimento que mais melhora a live por pessoa disponível. Se você ainda está começando, uma câmera fixa bem posicionada e um bom áudio vêm antes. O guia [qual câmera comprar para transmitir o culto](/blog/qual-camera-comprar-para-transmitir-o-culto) ajuda a decidir o degrau certo.",
    },
    { hr: true },
    { h2: "Aprenda a operar a PTZ no culto" },
    {
      p: `O **Culto ao Vivo com Excelência**, nosso [curso de OBS Studio para igrejas](${OBS}), tem um módulo inteiro de controle PTZ: o plugin do Culto em Off, controle de videogame, controle físico e outro plugin. E se a sua dúvida é a rede por trás das câmeras, o [curso de redes para igrejas](${REDES}) **Redes para Igrejas** explica NDI, PoE, IP e switch do zero.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaWifiIgreja: SeedPost = {
  slug: SLUG_WIFI,
  title: "Wi-Fi na igreja: como montar uma rede que não cai no culto",
  excerpt:
    "Por que o Wi-Fi da igreja cai justamente no culto e como organizar a rede: técnica separada dos visitantes, cabo para o que é crítico, pontos de acesso no lugar de repetidores e os canais certos.",
  publishedAt: "2026-11-09T12:00:00.000Z",
  tags: ["Redes", "Wi-Fi"],
  cover: { localPath: `${G}/wifi-igreja-capa.jpg`, alt: "Wi-Fi na igreja: uma rede que não cai no culto" },
  blocks: [
    {
      p: "Durante a semana, o Wi-Fi da igreja funciona. No domingo, com o templo cheio, a live trava, o tablet da mesa de som desconecta e a projeção perde o celular do pastor. Não é azar: é a rede recebendo, de uma vez, centenas de aparelhos que não estavam lá na terça.",
    },
    { h2: "O erro mais comum: tudo na mesma rede" },
    {
      p: "Quando a transmissão, a mesa de som, as câmeras e os celulares da congregação dividem a mesma rede e a mesma senha, quem chega por último disputa espaço com o que é crítico. A solução começa separando:",
    },
    { img: { sourceUrl: `${G}/wifi-igreja-rede.jpg`, alt: "Diagrama de rede da igreja: internet, roteador e switch; PC da live e câmeras no cabo; ponto de acesso da técnica e ponto de acesso dos visitantes separados" } },
    {
      ul: [
        "**Cabo para o que é crítico**: o computador da transmissão, as câmeras pela rede e a mesa de som digital devem estar no cabo, sempre que possível.",
        "**Rede da técnica**: um Wi-Fi só para a equipe (tablet da mesa, controle de câmeras), oculto e com senha forte, de preferência em 5 GHz.",
        "**Rede dos visitantes**: separada da técnica, idealmente com limite de banda por aparelho, para que ninguém consuma a internet da live.",
      ],
    },
    { h2: "Ponto de acesso não é repetidor" },
    {
      p: "Repetidores pegam o sinal pelo ar e retransmitem, também pelo ar. Isso divide a velocidade e aumenta a instabilidade. Para cobrir o templo, prefira **pontos de acesso (APs) ligados por cabo** ao switch. Sistemas mesh também funcionam, mas rendem muito mais quando os pontos estão ligados por cabo entre si.",
    },
    { h2: "Os canais certos" },
    {
      p: "Na faixa de **2,4 GHz**, os canais vizinhos se sobrepõem. Por isso, os pontos de acesso devem usar só os canais **1, 6 e 11**, alternando entre os APs próximos. Deixar todos no automático ou no mesmo canal faz um atrapalhar o outro.",
    },
    { img: { sourceUrl: `${G}/wifi-igreja-canais.jpg`, alt: "Gráfico dos canais de Wi-Fi 2,4 GHz: apenas os canais 1, 6 e 11 não se sobrepõem" } },
    {
      p: "Na faixa de **5 GHz** há mais canais livres e mais velocidade, mas o alcance é menor e as paredes atrapalham mais. Use 5 GHz para a rede da técnica, perto da cabine.",
    },
    { h2: "Checklist da rede da igreja" },
    {
      ol: [
        "Faça um desenho simples da rede: de onde vem a internet, onde estão o roteador e o switch e o que está ligado em cada porta.",
        "Ligue por cabo tudo o que é crítico para o culto.",
        "Crie redes separadas para a técnica e para os visitantes.",
        "Troque repetidores por pontos de acesso cabeados.",
        "Configure os canais 1, 6 e 11 em 2,4 GHz.",
        "Dê endereço IP fixo aos equipamentos da técnica (câmeras, mesa, PC da live).",
        "Teste a internet e o Wi-Fi **no horário do culto**, com a igreja cheia.",
      ],
    },
    {
      p: "Se a live trava mesmo com a rede organizada, veja o guia [Live do culto travando? 7 causas e como resolver](/blog/live-do-culto-travando-causas-e-solucoes).",
    },
    { hr: true },
    { h2: "Entenda a rede da sua igreja de verdade" },
    {
      p: `O [curso de redes para igrejas](${REDES}) **Redes para Igrejas** explica do zero, com exemplos da cabine técnica: IP, DHCP, máscara, gateway, switch, PoE, Wi-Fi, NDI e câmeras PTZ, com roteadores na prática e um projeto final com OBS, NDI e PTZ. Feito para quem não é de TI.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaLiveTravando: SeedPost = {
  slug: SLUG_TRAVANDO,
  title: "Live do culto travando? 7 causas e como resolver",
  excerpt:
    "Como descobrir por que a transmissão do culto trava usando as estatísticas do OBS e o YouTube Studio, e o que fazer em cada caso: upload, Wi-Fi, bitrate, encoder, placa de vídeo e mais.",
  publishedAt: "2026-11-09T16:00:00.000Z",
  tags: ["Transmissão", "OBS Studio"],
  cover: { localPath: `${G}/live-travando-capa.jpg`, alt: "Live do culto travando: causas e soluções" },
  blocks: [
    {
      p: "A live travar no meio da pregação é a reclamação mais comum de quem transmite culto. A boa notícia: o OBS mostra exatamente onde está o problema. Antes de trocar de computador ou de internet, descubra qual é a causa.",
    },
    { h2: "Primeiro passo: abra as estatísticas do OBS" },
    {
      p: "No OBS, abra a janela de **estatísticas** (menu Docks ou Visualizar). Ela mostra três tipos de quadros perdidos, e cada um aponta para uma causa diferente:",
    },
    { img: { sourceUrl: `${G}/live-travando-estatisticas.jpg`, alt: "Os três tipos de quadros perdidos nas estatísticas do OBS: pela rede, por atraso de codificação e por atraso de renderização" } },
    {
      p: "Do lado do YouTube, o **YouTube Studio** mostra a **saúde da transmissão** durante a live e avisa quando o sinal chega instável.",
    },
    { h2: "1. Upload insuficiente" },
    {
      p: "A causa número um. O que importa para a live é o **upload** (envio), não o download que a operadora anuncia. Meça o upload no horário do culto, com a igreja cheia.",
    },
    { img: { sourceUrl: `${G}/live-travando-bitrate.jpg`, alt: "Regra prática de bitrate: usar no máximo cerca de 60 a 70% do upload medido, com exemplos para 6, 10 e 20 Mbps" } },
    { h2: "2. Bitrate alto demais" },
    {
      p: "Se o bitrate da live é maior do que a internet aguenta com folga, os quadros se perdem pela rede. Baixe o bitrate ou a resolução (720p a 30 fps é bem mais leve que 1080p). Use **CBR** (taxa constante) e intervalo de quadro-chave de **2 segundos**, como o YouTube recomenda.",
    },
    { h2: "3. Wi-Fi no computador da live" },
    {
      p: "Wi-Fi oscila, principalmente com o templo cheio de celulares. O computador da transmissão deve estar **no cabo de rede**. Veja como organizar isso no guia [Wi-Fi na igreja: uma rede que não cai no culto](/blog/wi-fi-na-igreja-rede-que-nao-cai-no-culto).",
    },
    { h2: "4. A internet dividida com todo mundo" },
    {
      p: "Se a rede dos visitantes usa a mesma internet sem limite, alguém baixando uma atualização de celular disputa banda com a live. Separe as redes e limite a banda dos visitantes, ou tenha uma internet só para a transmissão.",
    },
    { h2: "5. Encoder sobrecarregado" },
    {
      p: "Quando aparecem quadros perdidos por **atraso de codificação**, o computador não está dando conta de comprimir o vídeo. Se ele tem placa de vídeo, troque o encoder para o da placa (NVENC, AMF ou QuickSync). Se não, use um preset mais leve ou baixe a resolução.",
    },
    { h2: "6. Placa de vídeo sobrecarregada" },
    {
      p: "Quadros perdidos por **atraso de renderização** indicam que a placa de vídeo está no limite. Feche programas pesados, evite navegadores com muitas abas e simplifique cenas com muitos filtros, vídeos e fontes de navegador.",
    },
    { h2: "7. Sem plano B" },
    {
      p: "Mesmo bem configurada, a internet pode cair. Prepare-se:",
    },
    {
      ul: [
        "Ative a **reconexão automática** nas configurações avançadas do OBS.",
        "Tenha uma cena de \"voltamos já\" para usar se algo falhar.",
        "Grave o culto no computador ao mesmo tempo, para publicar depois se a live cair.",
        "Tenha uma internet reserva (por exemplo, o roteador do celular) testada antes.",
      ],
    },
    { h2: "Resumo" },
    {
      ol: [
        "Abra as estatísticas do OBS e veja qual tipo de quadro está sendo perdido.",
        "Rede: meça o upload, baixe o bitrate, use cabo, separe as redes.",
        "Codificação: use o encoder da placa de vídeo ou baixe a resolução.",
        "Renderização: alivie a placa de vídeo e simplifique as cenas.",
        "Sempre: reconexão automática, gravação local e internet reserva.",
      ],
    },
    {
      p: "Começando do zero? Veja o guia [Como transmitir o culto ao vivo com OBS Studio](/blog/como-transmitir-o-culto-ao-vivo-com-obs-studio).",
    },
    { hr: true },
    { h2: "Uma live que não trava no domingo" },
    {
      p: `O **Culto ao Vivo com Excelência**, nosso [curso de OBS Studio para igrejas](${OBS}), tem um módulo de encoder, bitrate e plataformas (\"Sua internet aguenta?\", encoder, bitrate, resolução e fps) e outro de operação no domingo e plano B. E o [curso de redes para igrejas](${REDES}) **Redes para Igrejas** ajuda a resolver a rede por trás da live.`,
    },
  ],
};

export const GUIDE_POSTS = [guiaTransmitirCulto, guiaCameraCulto, guiaPtzIgreja, guiaWifiIgreja, guiaLiveTravando];
