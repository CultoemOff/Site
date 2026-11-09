import type { SeedPost } from "../lexical";
import { SLUG_CAMERA, SLUG_PTZ, SLUG_TRANSMITIR, SLUG_TRAVANDO, SLUG_WIFI } from "./guias-2026-11";

/**
 * Segunda leva de guias do blog para SEO (escritos em 09/11/2026): câmeras e filmagem, OBS × vMix,
 * mesa de corte (ATEM), várias plataformas, ministério de mídia e podcast da igreja.
 * Ilustrações em /public/blog/guias/ (capas e diagramas próprios do Culto em Off).
 */

const OBS = "/formacoes/culto-ao-vivo-com-excelencia";
const REDES = "/formacoes/redes-para-igrejas";
const G = "/blog/guias";
const b = (slug: string) => `/blog/${slug}`;

export const SLUG_FILMAR = "como-filmar-o-culto-posicoes-enquadramento-e-luz";
export const SLUG_QUANTAS = "quantas-cameras-a-igreja-precisa-para-transmitir-o-culto";
export const SLUG_LUZ = "iluminacao-para-filmar-o-culto";
export const SLUG_VMIX = "obs-studio-ou-vmix-qual-usar-na-igreja";
export const SLUG_ATEM = "mesa-de-corte-na-igreja-atem-mini-vale-a-pena";
export const SLUG_PLATAFORMAS = "transmitir-o-culto-no-youtube-facebook-e-instagram-ao-mesmo-tempo";
export const SLUG_MINISTERIO = "ministerio-de-midia-como-montar-e-organizar-a-equipe";
export const SLUG_PODCAST = "podcast-da-igreja-como-gravar-com-o-equipamento-da-midia";

/* ------------------------------------------------------------------ */

export const guiaFilmarCulto: SeedPost = {
  slug: SLUG_FILMAR,
  title: "Como filmar o culto: posições das câmeras, enquadramento e luz",
  excerpt:
    "Onde colocar cada câmera na igreja, quais planos usar no púlpito e no louvor, e os ajustes que deixam a imagem do culto mais profissional sem trocar de equipamento.",
  publishedAt: "2026-11-09T20:00:00.000Z",
  tags: ["Câmeras", "Filmagem"],
  cover: { localPath: `${G}/filmar-culto-capa.jpg`, alt: "Como filmar o culto: posições, enquadramento e luz" },
  blocks: [
    {
      p: "Uma câmera boa mal posicionada entrega uma imagem pior do que uma câmera simples no lugar certo. Filmar o culto é, antes de tudo, decidir **de onde** cada câmera olha, **o que** ela mostra e **quanta luz** chega até ela. Este guia trata dessas três decisões.",
    },
    { h2: "1. Onde posicionar as câmeras" },
    {
      p: "Pense em cada câmera com uma função. Em igrejas pequenas e médias, três posições resolvem quase tudo:",
    },
    { img: { sourceUrl: `${G}/filmar-culto-posicoes.jpg`, alt: "Vista de cima do templo: câmera central no fundo apontada para o púlpito e duas câmeras laterais para a banda e a plateia" } },
    {
      ul: [
        "**Central, no fundo do templo**: é a câmera principal. Mostra o púlpito e o plano geral. Se possível, coloque-a elevada, na altura dos olhos de quem prega, para não filmar de baixo para cima nem pegar a cabeça das pessoas na frente.",
        "**Lateral, perto do palco**: mostra a banda e o pregador de um ângulo de uns 30 a 45 graus. Dá movimento à live e serve de plano de corte.",
        "**Lateral oposta ou no corredor**: mostra a igreja participando, o louvor e momentos como batismo e santa ceia.",
      ],
    },
    {
      p: "Com uma câmera só, ela fica na posição central. Para decidir quantas a sua igreja precisa, veja o guia [Quantas câmeras a igreja precisa para transmitir o culto](" + b(SLUG_QUANTAS) + ").",
    },
    { h3: "Cuidado com o eixo" },
    {
      p: "Mantenha todas as câmeras do mesmo lado de uma linha imaginária entre o pregador e a igreja. Se uma câmera fica do lado oposto, quem assiste sente que o pregador \"pulou\" de lado no corte. É a chamada regra dos 180 graus.",
    },
    { h2: "2. Os planos básicos" },
    { img: { sourceUrl: `${G}/filmar-culto-planos.jpg`, alt: "Quatro planos: geral, americano, médio e close" } },
    {
      ul: [
        "**Geral**: templo e palco. Abre e fecha o culto e serve de \"respiro\" entre momentos.",
        "**Americano** (do joelho para cima): bom para o pregador que anda pelo palco.",
        "**Médio** (da cintura para cima): o plano principal da pregação. Mostra gestos e expressão.",
        "**Close** (rosto e ombros): para momentos de emoção, oração ou destaque. Use com moderação.",
      ],
    },
    {
      p: "Dois detalhes que mudam o resultado: deixe um pequeno **espaço acima da cabeça** (sem cortar o topo nem sobrar teto) e, quando a pessoa olha para um lado, deixe **mais espaço na direção do olhar**.",
    },
    { h2: "3. Ajustes da câmera em manual" },
    {
      p: "No automático, a câmera muda a exposição e a cor sozinha a cada luz do palco. No culto, o ideal é travar os ajustes:",
    },
    {
      ul: [
        "**Exposição manual**: ajuste pelo rosto do pregador, não pelo fundo.",
        "**Balanço de branco manual**: use a mesma temperatura de cor em todas as câmeras, para a pele não mudar de cor no corte.",
        "**Obturador em 1/60 ou 1/120**: no Brasil a rede elétrica é de 60 Hz, e esses valores evitam a cintilação (as faixas que \"correm\" na imagem com lâmpadas LED).",
        "**Foco**: automático funciona bem em câmeras com bom reconhecimento de rosto; em PTZ, muitas vezes é melhor travar o foco depois de chamar o preset.",
        "**Mesma resolução e fps** em todas as câmeras e no OBS (por exemplo, 1080p a 30 fps).",
      ],
    },
    { h2: "4. A luz vem antes da câmera" },
    {
      p: "Se o rosto do pregador está escuro, nenhuma câmera resolve. Luz frontal suave, de preferência em dois lados, e nada de janela clara atrás do púlpito. O assunto é grande e tem um guia próprio: [Iluminação para filmar o culto](" + b(SLUG_LUZ) + ").",
    },
    { h2: "5. Cortes que não incomodam" },
    {
      ul: [
        "Corte quando a imagem da próxima câmera já está pronta, nunca no meio de um movimento da PTZ.",
        "Evite cortar entre dois planos muito parecidos; mude o tamanho ou o ângulo.",
        "Na pregação, menos é mais: um plano médio estável vale mais do que cortes a cada frase.",
        "No louvor, acompanhe a música: mais cortes em músicas animadas, menos em músicas lentas.",
      ],
    },
    {
      p: "Sem operador de câmera? Câmeras PTZ com presets resolvem boa parte disso com um clique. Veja [Câmera PTZ para igreja: vale a pena?](" + b(SLUG_PTZ) + ").",
    },
    { hr: true },
    { h2: "Aprenda a montar e operar as câmeras do culto" },
    {
      p: `No curso [Culto ao Vivo com Excelência](${OBS}), o módulo **Câmeras para igrejas** mostra os tipos de câmera, as configurações de exposição, abertura, foco, fps e resolução, e testes práticos com webcam USB, DJI Action 4 e Sony ZV-E10. Depois, você coloca tudo no OBS e opera o culto com PTZ.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaQuantasCameras: SeedPost = {
  slug: SLUG_QUANTAS,
  title: "Quantas câmeras a igreja precisa para transmitir o culto?",
  excerpt:
    "Uma, duas ou três câmeras: o que cada configuração permite fazer na live do culto, quantos voluntários exige e como crescer aos poucos sem desperdiçar dinheiro.",
  publishedAt: "2026-11-09T20:30:00.000Z",
  tags: ["Câmeras", "Transmissão"],
  cover: { localPath: `${G}/quantas-cameras-capa.jpg`, alt: "Quantas câmeras a igreja precisa para transmitir o culto" },
  blocks: [
    {
      p: "É uma das primeiras perguntas de quem vai começar a transmitir o culto. A resposta curta: **uma câmera bem usada já entrega uma boa live**. Mais câmeras deixam o culto mais dinâmico, mas também exigem mais do computador, da rede e da equipe.",
    },
    { img: { sourceUrl: `${G}/quantas-cameras-comparacao.jpg`, alt: "Comparação: com 1, 2 e 3 câmeras, o que cada configuração permite e quantos operadores exige" } },
    { h2: "Uma câmera" },
    {
      p: "Fica na posição central, no fundo do templo, em plano médio do púlpito. Se tiver zoom, abre um pouco no louvor e fecha na pregação.",
    },
    {
      ul: [
        "**Prós**: mais barato, simples de operar, pode funcionar sem operador.",
        "**Contras**: sem cortes, a live fica mais estática.",
        "**Dica**: uma câmera PTZ sozinha já dá a sensação de várias câmeras, porque troca de enquadramento com presets.",
      ],
    },
    { h2: "Duas câmeras" },
    {
      p: "A configuração mais comum. Uma câmera fica no púlpito (plano médio ou fechado) e a outra no plano geral ou na banda. No OBS, você corta entre as duas conforme o momento do culto.",
    },
    {
      ul: [
        "**Prós**: cortes entre pregação e louvor, live bem mais viva.",
        "**Contras**: as duas câmeras precisam combinar em cor e exposição.",
        "**Operação**: um voluntário no OBS dá conta.",
      ],
    },
    { h2: "Três câmeras" },
    {
      p: "Púlpito, banda e plateia. É o que deixa o culto com cara de produção, principalmente no louvor e em momentos especiais.",
    },
    {
      ul: [
        "**Prós**: culto dinâmico, mais opções de corte.",
        "**Contras**: mais cabos (ou rede), mais carga no computador, mais atenção do operador.",
        "**Operação**: uma ou duas pessoas. Com PTZ e presets, uma pessoa consegue.",
      ],
    },
    { h2: "O que pesa além das câmeras" },
    {
      ul: [
        "**Conexão**: cada câmera precisa chegar ao computador. Por HDMI, cada uma pede uma placa de captura ou uma entrada de mesa de corte. Pela rede (NDI), todas chegam pelo mesmo switch e entram no OBS com o plugin DistroAV. Veja [Mesa de corte na igreja: ATEM Mini vale a pena?](" + b(SLUG_ATEM) + ").",
        "**Computador**: mais fontes de vídeo no OBS pedem mais processador e placa de vídeo.",
        "**Rede**: câmeras NDI precisam de uma rede cabeada bem feita. O guia [Wi-Fi na igreja](" + b(SLUG_WIFI) + ") ajuda a entender por quê.",
        "**Combinar as câmeras**: modelos diferentes têm cores diferentes. Ajuste o balanço de branco de todas igual.",
      ],
    },
    { h2: "Como crescer sem desperdiçar" },
    {
      ol: [
        "Comece com uma câmera boa na posição central e um áudio bem resolvido. Áudio ruim derruba mais live do que imagem simples.",
        "Antes de comprar a segunda câmera, decida como ela vai chegar ao computador (placa, mesa de corte ou NDI).",
        "Pense na equipe: quantos voluntários vão operar no domingo, todo domingo?",
        "Se a ideia é crescer para várias câmeras com pouca gente, considere PTZ.",
      ],
    },
    {
      p: "Ainda escolhendo o modelo? Leia [Qual câmera comprar para transmitir o culto](" + b(SLUG_CAMERA) + ").",
    },
    { hr: true },
    { h2: "Monte o sistema certo para o tamanho da sua igreja" },
    {
      p: `O curso [Culto ao Vivo com Excelência](${OBS}) tem a aula **Projeto de acordo com o tamanho da igreja**, além dos módulos de câmeras, conexões (placas de captura, mesa de corte e NDI) e controle PTZ.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaIluminacao: SeedPost = {
  slug: SLUG_LUZ,
  title: "Iluminação para filmar o culto: o guia para a live não ficar escura",
  excerpt:
    "Por que a imagem do culto fica escura, granulada ou com faixas, e como posicionar a luz principal, o preenchimento e a contra-luz para o pregador aparecer bem na transmissão.",
  publishedAt: "2026-11-09T21:00:00.000Z",
  tags: ["Iluminação", "Câmeras"],
  cover: { localPath: `${G}/iluminacao-filmar-culto-capa.jpg`, alt: "Iluminação para filmar o culto" },
  blocks: [
    {
      p: "Muita igreja troca de câmera achando que o problema é a câmera, quando o problema é a **luz**. O olho humano se adapta a ambientes escuros; o sensor da câmera não. Com pouca luz, a câmera compensa aumentando o ganho (ISO), e a imagem fica granulada, sem nitidez e com cores lavadas.",
    },
    { h2: "A luz que a câmera precisa" },
    { img: { sourceUrl: `${G}/iluminacao-filmar-culto-luz.jpg`, alt: "Vista de cima: luz principal a 45 graus de um lado do pregador, preenchimento mais fraco do outro e contra-luz atrás" } },
    {
      p: "O esquema clássico de três pontos funciona muito bem no púlpito:",
    },
    {
      ul: [
        "**Luz principal**: na frente do pregador, a uns 45 graus para um lado e um pouco acima da altura dos olhos. É a luz que mais aparece.",
        "**Preenchimento**: do outro lado, mais fraca, para suavizar as sombras do rosto.",
        "**Contra-luz**: atrás e acima, iluminando cabelo e ombros. Separa a pessoa do fundo e dá profundidade.",
      ],
    },
    {
      p: "Na prática, muitas igrejas usam duas luzes frontais (uma de cada lado, uma mais forte) e a contra-luz que já existe no palco.",
    },
    { h2: "Que tipo de luz usar" },
    {
      ul: [
        "**Painéis ou refletores de LED** com luz difusa (suave). Luz dura demais marca sombras e faz a pessoa apertar os olhos.",
        "**Boa reprodução de cor**: prefira luzes com IRC (CRI) alto, 90 ou mais. Luz de baixa qualidade deixa a pele esverdeada ou acinzentada.",
        "**Mesma temperatura de cor** em todas as luzes que batem no rosto. Misturar luz amarela e branca deixa um lado do rosto de cada cor.",
        "**Regulagem de intensidade** (dimmer): ajuda a equilibrar com a luz do palco e não ofuscar quem prega.",
      ],
    },
    { h2: "Os problemas mais comuns" },
    { h3: "Faixas ou piscadas na imagem" },
    {
      p: "É a cintilação (flicker) de lâmpadas LED. No Brasil a rede é de 60 Hz: deixe o **obturador da câmera em 1/60 ou 1/120**. Se persistir, a lâmpada tem driver de baixa qualidade e pode precisar ser trocada.",
    },
    { h3: "Rosto estourado (branco demais)" },
    {
      p: "A luz está forte ou perto demais, ou a câmera está em exposição automática medindo o fundo escuro. Coloque a exposição em manual e ajuste pelo rosto.",
    },
    { h3: "Pregador escuro com fundo claro" },
    {
      p: "Janela, telão ou parede muito clara atrás do púlpito. A câmera expõe pelo fundo e o rosto fica escuro. Reduza a luz do fundo ou aumente a frontal.",
    },
    { h3: "Luzes coloridas no rosto" },
    {
      p: "Moving heads e luzes de efeito ficam lindos no louvor, mas no rosto de quem canta ou prega deixam a pele roxa ou vermelha. Garanta uma luz branca frontal mesmo durante o louvor.",
    },
    { h2: "Antes de comprar luz" },
    {
      ol: [
        "Desligue as luzes uma a uma e veja o que cada uma faz na imagem da câmera, não a olho nu.",
        "Ajuste a câmera em manual (exposição, balanço de branco, obturador) e veja quanto falta de luz.",
        "Só então decida quantas luzes comprar e onde instalar.",
      ],
    },
    {
      p: "Com a luz resolvida, vale revisar posições e enquadramento: [Como filmar o culto](" + b(SLUG_FILMAR) + ").",
    },
    { hr: true },
    { h2: "Ajuste a câmera para a luz do seu templo" },
    {
      p: `No curso [Culto ao Vivo com Excelência](${OBS}), a aula **Configurações da câmera: exposição, abertura, foco, FPS e resolução** mostra como travar os ajustes para a imagem não mudar a cada luz do palco.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaObsVmix: SeedPost = {
  slug: SLUG_VMIX,
  title: "OBS Studio ou vMix: qual usar na transmissão do culto?",
  excerpt:
    "As diferenças reais entre OBS Studio e vMix para igrejas: custo, sistema, NDI, letras, replay e convidados remotos, e qual faz mais sentido para a sua equipe de mídia.",
  publishedAt: "2026-11-09T21:30:00.000Z",
  tags: ["OBS Studio", "vMix", "Transmissão"],
  cover: { localPath: `${G}/obs-ou-vmix-capa.jpg`, alt: "OBS Studio ou vMix: qual usar na igreja" },
  blocks: [
    {
      p: "OBS Studio e vMix são os dois programas mais usados para transmitir o culto pelo computador. Os dois colocam o culto no ar com qualidade. A diferença está no **custo**, no **sistema** e no **jeito de operar**.",
    },
    { img: { sourceUrl: `${G}/obs-ou-vmix-tabela.jpg`, alt: "Tabela comparando OBS Studio e vMix: preço, sistema, NDI, letras, replay, comunidade e para quem é" } },
    { h2: "OBS Studio" },
    {
      ul: [
        "**Gratuito e de código aberto**, para Windows, Mac e Linux.",
        "**Comunidade enorme**: muitos tutoriais, plugins e respostas para quase qualquer problema.",
        "**Flexível**: cenas, fontes, filtros de áudio e vídeo, e plugins do OBS para NDI (DistroAV), controle de câmeras PTZ, multistream, tela vertical e muito mais.",
        "**Câmera virtual**: o botão \"Iniciar câmera virtual\" envia a imagem do OBS para o Zoom ou o Google Meet, útil em reuniões e cultos online.",
        "**Convidados remotos**: com o VDO.Ninja (antigo OBS.Ninja), alguém de fora entra na live pelo navegador.",
        "**Ponto de atenção**: algumas funções dependem de plugins, e é preciso organizar bem as cenas para a operação ficar simples.",
      ],
    },
    { h2: "vMix" },
    {
      ul: [
        "**Pago**, com licenças em várias edições e período de teste gratuito. Confira os valores e o que cada edição inclui no site oficial antes de decidir.",
        "**Só para Windows**.",
        "**NDI já vem pronto**, sem plugin.",
        "**Títulos prontos e editáveis**, além de recursos como replay e convidados remotos nas edições mais altas.",
        "**Ponto de atenção**: a interface é mais técnica, e há menos material em português.",
      ],
    },
    { h3: "E o Streamlabs?" },
    {
      p: "O Streamlabs Desktop (antigo Streamlabs OBS) é baseado no OBS e mais voltado para quem faz live de jogos, com alertas e overlays prontos. Para o culto, o OBS Studio puro costuma ser mais leve e suficiente.",
    },
    { h2: "O que importa para a igreja" },
    { h3: "Quem vai operar" },
    {
      p: "Na maioria das igrejas, a live é operada por voluntários que mudam de escala. Uma ferramenta gratuita, com muito material em português e que roda no computador que a igreja já tem, reduz a barreira de entrada. Esse é o grande trunfo do OBS.",
    },
    { h3: "O tamanho da produção" },
    {
      p: "Se a igreja faz produções mais complexas, como replay em eventos, várias câmeras com gráficos elaborados ou entrevistas com convidados remotos todo domingo, o vMix pode economizar tempo, e o custo da licença passa a fazer sentido.",
    },
    { h3: "O computador" },
    {
      p: "O vMix exige Windows. Se a mídia usa Mac, o OBS é o caminho. Em qualquer um dos dois, uma placa de vídeo dedicada faz diferença.",
    },
    { h2: "Nossa recomendação" },
    {
      p: "Para a maioria das igrejas pequenas e médias, **comece pelo OBS Studio**. Ele faz tudo o que a live do culto precisa, não tem custo de licença e a equipe encontra ajuda com facilidade. Se um dia a produção pedir recursos específicos do vMix, a base que a equipe aprendeu no OBS (cenas, fontes, áudio, encoder e bitrate) vale para qualquer programa.",
    },
    {
      p: "Para começar, siga o guia [Como transmitir o culto ao vivo com OBS Studio](" + b(SLUG_TRANSMITIR) + ").",
    },
    { hr: true },
    { h2: "Domine o OBS Studio do zero ao avançado" },
    {
      p: `O curso [Culto ao Vivo com Excelência](${OBS}) tem o módulo **OBS Studio: do zero à live**, com cenas, fontes, câmeras NDI e HDMI, Modo Estúdio, letras e avisos com Holyrics e SPresenter, câmera de Libras e backup das cenas.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaMesaDeCorte: SeedPost = {
  slug: SLUG_ATEM,
  title: "Mesa de corte na igreja: ATEM Mini vale a pena? Como ligar com o OBS",
  excerpt:
    "O que uma mesa de corte faz na transmissão do culto, quando a ATEM Mini da Blackmagic vale a pena, como ligar ela no OBS Studio e quando é melhor ir direto para câmeras NDI.",
  publishedAt: "2026-11-09T22:00:00.000Z",
  tags: ["Mesa de corte", "Câmeras", "OBS Studio"],
  cover: { localPath: `${G}/mesa-de-corte-atem-capa.jpg`, alt: "Mesa de corte na igreja: ATEM Mini vale a pena" },
  blocks: [
    {
      p: "A **mesa de corte** (switcher de vídeo, ou video switcher em inglês) recebe várias câmeras e escolhe qual vai para o ar, com cortes e transições. Na igreja, ela costuma aparecer quando a mídia quer usar mais de uma câmera HDMI sem comprar uma placa de captura para cada uma.",
    },
    {
      p: "A mais conhecida em igrejas é a família **ATEM Mini**, da Blackmagic Design.",
    },
    { h2: "O que a ATEM Mini faz" },
    {
      ul: [
        "Recebe **quatro câmeras por HDMI** (há modelos maiores com mais entradas).",
        "Corta e faz transições com **botões físicos**, sem depender do mouse.",
        "Tem **entradas de áudio** e um mixer simples.",
        "Sai para o computador pela **USB como se fosse uma webcam**, sem placa de captura.",
        "Os modelos **Pro** também transmitem e gravam sem computador e mostram as câmeras em um monitor (multiview). Confira as funções de cada modelo no site da Blackmagic.",
      ],
    },
    { h2: "Como ligar a ATEM Mini no OBS" },
    { img: { sourceUrl: `${G}/mesa-de-corte-atem-ligacao.jpg`, alt: "Quatro câmeras HDMI ligadas na ATEM Mini, que sai pela USB para o PC com OBS e pelo HDMI para um monitor" } },
    {
      ol: [
        "Ligue cada câmera em uma entrada HDMI da ATEM. Deixe todas na **mesma resolução e fps** (por exemplo, 1080p a 30 fps).",
        "Ligue a saída **USB** da ATEM no computador.",
        "No OBS, adicione um **Dispositivo de captura de vídeo** e escolha a ATEM na lista.",
        "Leve o áudio da mesa de som para a ATEM ou direto para o computador, e confira a sincronia.",
        "Opcional: ligue a saída HDMI em um monitor ou TV para o operador.",
      ],
    },
    {
      p: "Dessa forma, o corte entre câmeras é feito na ATEM, e o OBS cuida do resto: letras, avisos, vinhetas, gravação e transmissão.",
    },
    { h2: "Quando a ATEM Mini vale a pena" },
    {
      ul: [
        "Você tem ou vai ter **duas a quatro câmeras HDMI** perto da cabine (mirrorless, filmadoras ou PTZ com HDMI).",
        "Quer **botões físicos** para cortar, mais fáceis para voluntários.",
        "Quer aliviar o computador, que recebe um só sinal de vídeo.",
      ],
    },
    { h2: "Quando talvez não valha" },
    {
      ul: [
        "**Câmeras longe da cabine**: HDMI não vai longe sem conversores. Nesse caso, compare com SDI ou com câmeras pela rede.",
        "**Câmeras PTZ com NDI**: elas já chegam ao OBS pelo cabo de rede, cada uma como uma fonte, e o corte é feito no próprio OBS. A mesa de corte vira um equipamento a mais.",
        "**Só uma câmera**: uma placa de captura resolve.",
      ],
    },
    { h2: "Dá para cortar no OBS?" },
    {
      p: "Sim. Com o **Modo Estúdio**, o OBS mostra a próxima cena antes de ir para o ar, como numa mesa de corte. E dá para usar um Stream Deck, um controle ou até o celular como botões físicos. Para muitas igrejas, essa combinação substitui a mesa de corte.",
    },
    {
      p: "Leia também: [Quantas câmeras a igreja precisa](" + b(SLUG_QUANTAS) + ") e [Câmera PTZ para igreja: vale a pena?](" + b(SLUG_PTZ) + ").",
    },
    { hr: true },
    { h2: "Entenda cada caminho antes de comprar" },
    {
      p: `O curso [Culto ao Vivo com Excelência](${OBS}) tem o módulo **Conexões, placas de captura, mesa de corte e NDI**: conversores HDMI e SDI, placas de captura, vídeo pela rede, DistroAV no OBS e a aula de mesa de corte. Para montar a rede das câmeras NDI, veja o curso [Redes para Igrejas](${REDES}).`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaVariasPlataformas: SeedPost = {
  slug: SLUG_PLATAFORMAS,
  title: "Como transmitir o culto no YouTube, Facebook e Instagram ao mesmo tempo",
  excerpt:
    "Três caminhos para levar a mesma live do culto a várias plataformas: multistream no OBS, serviço de envio ou uma plataforma principal. Quanto de internet cada um pede e os cuidados com Instagram e TikTok.",
  publishedAt: "2026-11-09T22:30:00.000Z",
  tags: ["Transmissão", "OBS Studio", "YouTube"],
  cover: { localPath: `${G}/transmitir-varias-plataformas-capa.jpg`, alt: "Transmitir o culto no YouTube, Facebook e Instagram ao mesmo tempo" },
  blocks: [
    {
      p: "Parte da igreja assiste à live no YouTube, outra parte pelo Facebook Live, e os mais jovens estão no Instagram e no TikTok. Dá para transmitir o mesmo culto em todas ao mesmo tempo, mas cada caminho tem um custo: na internet, no computador ou no bolso.",
    },
    { img: { sourceUrl: `${G}/transmitir-varias-plataformas-caminhos.jpg`, alt: "Três caminhos: plugin no OBS, serviço de envio e plataforma principal" } },
    { h2: "Caminho 1: multistream no OBS (plugin)" },
    {
      p: "O OBS envia para uma plataforma por padrão. Com um plugin de várias saídas RTMP, ele envia para várias ao mesmo tempo, cada uma com a sua chave de transmissão.",
    },
    {
      ul: [
        "**Prós**: sem custo extra, tudo no mesmo computador.",
        "**Contras**: o **upload soma**. Se cada plataforma recebe 6 Mbps, três plataformas pedem 18 Mbps estáveis, fora a margem de segurança. O computador também trabalha mais.",
      ],
    },
    { h2: "Caminho 2: serviço de envio (restream)" },
    {
      p: "O OBS manda **um único sinal** para um serviço na internet, e esse serviço replica para o YouTube, o Facebook e outras plataformas.",
    },
    {
      ul: [
        "**Prós**: leve para a internet da igreja e para o computador.",
        "**Contras**: em geral é pago para usar mais de duas plataformas ou com mais qualidade, e é mais um ponto que pode falhar. Confira planos e limites no site do serviço.",
      ],
    },
    { h2: "Caminho 3: uma plataforma principal" },
    {
      p: "Transmita só no YouTube (ou só no Facebook) e, nas outras redes, publique o link da live ou a gravação depois.",
    },
    {
      ul: [
        "**Prós**: o mais simples e o mais estável. Concentra a audiência e os comentários em um lugar.",
        "**Contras**: quem só usa a outra rede precisa clicar no link.",
      ],
    },
    { h2: "E o Instagram?" },
    {
      p: "O Instagram é diferente: a live é **vertical**, e transmitir pelo computador depende de a conta ter a opção de chave de transmissão liberada, o que não acontece em todas as contas. Por isso, muitas igrejas fazem a live do Instagram pelo celular ou publicam cortes do culto depois. Se for transmitir pelo OBS, monte cenas em formato vertical: plugins como o **Aitum Vertical** criam uma tela vertical separada no mesmo OBS.",
    },
    { h2: "E a live no TikTok?" },
    {
      p: "A live no TikTok também é vertical. Pelo computador, o TikTok oferece o **TikTok LIVE Studio** e, para algumas contas, uma chave de transmissão para usar no OBS. Os requisitos para liberar a live (como número de seguidores e idade) mudam com o tempo e não valem para todas as contas, então confira no próprio aplicativo. Para muitas igrejas, os cortes curtos do culto funcionam melhor no TikTok do que a live inteira.",
    },
    { h2: "Configurações que valem para todas" },
    {
      ul: [
        "**Bitrate constante (CBR)** e **intervalo de quadro-chave de 2 segundos**, como recomendam as plataformas.",
        "Para 1080p a 30 fps, o YouTube recomenda entre 5 e 14 Mbps; para 720p a 30 fps, entre 3 e 8 Mbps. Fique bem abaixo do upload real da igreja.",
        "Áudio AAC a 128 kbps ou mais.",
        "Teste a transmissão em todas as plataformas antes do culto, com live privada ou não listada quando a plataforma permitir.",
      ],
    },
    {
      p: "Se a live trava quando você soma plataformas, o guia [Live do culto travando: causas e soluções](" + b(SLUG_TRAVANDO) + ") ajuda a achar o gargalo.",
    },
    { h2: "Nossa recomendação" },
    {
      p: "Comece com **uma plataforma principal** bem estável. Quando a internet tiver folga de sobra, teste o plugin no OBS com duas plataformas. Se o upload não aguentar, use um serviço de envio.",
    },
    { hr: true },
    { h2: "Aprenda a configurar cada plataforma" },
    {
      p: `O curso [Culto ao Vivo com Excelência](${OBS}) tem o módulo **Encoder, bitrate e plataformas**, com as aulas \"Sua internet aguenta?\", \"Transmitindo no YouTube\", \"Facebook e várias plataformas ao mesmo tempo\" e \"Gravação local junto com a live\".`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaMinisterioMidia: SeedPost = {
  slug: SLUG_MINISTERIO,
  title: "Ministério de mídia: como montar e organizar a equipe da igreja",
  excerpt:
    "As funções do ministério de mídia, como montar a escala, treinar voluntários novos e criar uma rotina com checklist para o culto não depender de uma pessoa só.",
  publishedAt: "2026-11-09T23:00:00.000Z",
  tags: ["Ministério de mídia", "Equipe"],
  cover: { localPath: `${G}/ministerio-de-midia-capa.jpg`, alt: "Ministério de mídia: como montar e organizar a equipe" },
  blocks: [
    {
      p: "Em muitas igrejas, a mídia começa com uma pessoa que \"entende de computador\" e faz tudo: liga a câmera, solta as letras, cuida da live e posta as fotos. Funciona até o dia em que essa pessoa viaja, adoece ou cansa. Um ministério de mídia organizado é o que faz o culto funcionar **todo domingo, com qualquer pessoa da escala**.",
    },
    { h2: "As funções do ministério" },
    { img: { sourceUrl: `${G}/ministerio-de-midia-funcoes.jpg`, alt: "Organograma: líder de mídia com as funções de transmissão, câmeras, projeção, fotos e redes sociais" } },
    {
      ul: [
        "**Líder de mídia**: cuida da escala, do treinamento e da comunicação com a liderança e com o louvor.",
        "**Transmissão**: opera o OBS, o áudio da live e as plataformas.",
        "**Câmeras**: opera as câmeras ou os presets da PTZ.",
        "**Projeção**: letras, versículos e avisos no telão.",
        "**Fotos**: registro do culto e dos eventos.",
        "**Redes sociais**: cortes, posts e stories.",
      ],
    },
    {
      p: "Igreja pequena não precisa de uma pessoa por função. O importante é que cada função tenha **um responsável** e que mais de uma pessoa saiba fazer cada coisa.",
    },
    { h2: "1. Escala" },
    {
      ul: [
        "Monte a escala por mês e publique com antecedência.",
        "Evite escalar a mesma pessoa todos os domingos. Quem nunca descansa desiste.",
        "Combine um horário de chegada antes do culto para ligar e testar tudo.",
        "Tenha um combinado para trocas: quem não pode avisa e busca substituto.",
      ],
    },
    { h2: "2. Checklist para cada função" },
    {
      p: "O checklist é o que permite que um voluntário novo opere sem ligar para ninguém. Exemplo para a transmissão:",
    },
    {
      ol: [
        "Ligar computador, câmeras e interface de áudio.",
        "Abrir o OBS e conferir se todas as câmeras e o áudio aparecem.",
        "Testar a internet e iniciar a gravação local.",
        "Conferir título e descrição da live na plataforma.",
        "Iniciar a transmissão com a cena de pré-culto alguns minutos antes.",
      ],
    },
    { h2: "3. Treinamento" },
    {
      ul: [
        "**Acompanhamento**: o voluntário novo fica ao lado de alguém experiente por alguns cultos antes de operar sozinho.",
        "**Culto de treino**: de tempos em tempos, monte tudo num dia sem culto e deixe a equipe errar sem pressão.",
        "**Material de consulta**: documente como a igreja faz (onde ligar cada cabo, quais cenas usar, quem chamar se algo der errado).",
      ],
    },
    { h2: "4. Depois do culto" },
    {
      p: "Reserve cinco minutos para registrar o que deu errado e o que funcionou. Esse registro vira melhoria no checklist e evita o mesmo erro no domingo seguinte.",
    },
    { h2: "5. Cuidado com as pessoas filmadas" },
    {
      p: "Avise que o culto é transmitido e combine com a liderança como tratar momentos sensíveis, como oração por pessoas, ministração e imagens de crianças. A câmera geral pode ficar mais aberta nesses momentos.",
    },
    { h2: "6. Ministério, não só técnica" },
    {
      quote: "Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens. (Colossenses 3.23)",
    },
    {
      p: "A equipe de mídia serve quem está em casa, no hospital ou longe. Cuidar das pessoas da equipe, orar juntos antes do culto e celebrar o que deu certo é tão importante quanto o equipamento.",
    },
    {
      p: "Para começar a parte técnica, veja [Como transmitir o culto ao vivo com OBS Studio](" + b(SLUG_TRANSMITIR) + ") e [Como filmar o culto](" + b(SLUG_FILMAR) + ").",
    },
    { hr: true },
    { h2: "Forme a equipe de mídia da sua igreja" },
    {
      p: `O curso [Culto ao Vivo com Excelência](${OBS}) é pensado para voluntários: começa nos fundamentos e termina no módulo **Operação no domingo e plano B**, com checklist pré-culto e o que fazer quando algo dá errado. Um bom material para treinar quem está chegando na mídia.`,
    },
  ],
};

/* ------------------------------------------------------------------ */

export const guiaPodcastIgreja: SeedPost = {
  slug: SLUG_PODCAST,
  title: "Podcast da igreja: como gravar com o equipamento que a mídia já tem",
  excerpt:
    "Como gravar o podcast da igreja usando a mesa de som, o Reaper e o OBS que a mídia já usa no culto: microfones, gravação de cada voz, vídeo opcional, edição e publicação.",
  publishedAt: "2026-11-09T23:30:00.000Z",
  tags: ["Podcast", "Áudio"],
  cover: { localPath: `${G}/podcast-igreja-capa.jpg`, alt: "Podcast da igreja: como gravar com o equipamento da mídia" },
  blocks: [
    {
      p: "A igreja que transmite o culto já tem quase tudo para gravar um podcast: microfones, mesa de som, computador e, muitas vezes, câmeras. O que muda é o **jeito de usar**: no podcast, a prioridade é a voz limpa e cada pessoa gravada separada, para facilitar a edição.",
    },
    { h2: "O caminho do podcast" },
    { img: { sourceUrl: `${G}/podcast-igreja-fluxo.jpg`, alt: "Fluxo: microfones na mesa de som, Reaper grava cada voz; câmeras opcionais no OBS; edição junta tudo e publica no Spotify e YouTube" } },
    { h2: "1. Microfones" },
    {
      ul: [
        "**Microfones dinâmicos** (os mesmos de voz do culto) captam menos o som da sala. Em uma sala sem tratamento acústico, costumam soar melhor que os condensadores.",
        "**Um microfone por pessoa**, perto da boca (um palmo ou menos), sempre na mesma distância.",
        "**Pedestal ou braço articulado**, para ninguém segurar o microfone e fazer barulho.",
        "Escolha uma sala pequena, com tapete, cortina e móveis. Evite o templo vazio, que tem muito eco.",
      ],
    },
    { h2: "2. Gravando cada voz separada" },
    {
      p: "Se a **mesa de som digital** tem **USB multipista** (como a Behringer X32 e outras mesas digitais), ela envia cada canal separado para o computador. No **Reaper**, cada microfone vira uma trilha. Assim, se uma pessoa tossir ou falar mais alto, você corrige só a voz dela.",
    },
    {
      p: "Com **mesa de som analógica**, dá para gravar a saída estéreo da mesa por uma interface de áudio. Funciona, mas a mixagem precisa ficar boa na hora, porque não dá para separar as vozes depois.",
    },
    { h2: "3. Vídeo (opcional)" },
    {
      p: "Para o videocast no YouTube, use as câmeras da igreja no **OBS**, só gravando (sem transmitir): o OBS também é um gravador de vídeo. Um plano aberto com todos e um plano de cada pessoa já dão uma boa edição. Grave em alta qualidade, e o OBS também consegue gravar faixas de áudio separadas no mesmo arquivo.",
    },
    {
      p: "Para ajudar a sincronizar áudio e vídeo na edição, bata uma palma na frente das câmeras no início da gravação.",
    },
    { h2: "4. Edição" },
    {
      ul: [
        "Corte silêncios longos, falsos começos e ruídos.",
        "Use **compressor** e **equalização** leves em cada voz para deixar o volume constante e a voz clara.",
        "Normalize o volume final. Uma referência comum para podcasts é algo por volta de -16 LUFS.",
        "Exporte o áudio em MP3 ou o vídeo em MP4, conforme a plataforma.",
      ],
    },
    { h2: "5. Publicação" },
    {
      p: "Para o áudio chegar ao Spotify, Apple Podcasts e outros aplicativos, use uma plataforma de hospedagem de podcast, que gera o feed e distribui os episódios. A versão em vídeo vai para o YouTube. Corte trechos curtos para Reels e Shorts: é o que mais leva gente nova para o episódio completo.",
    },
    { h2: "Dicas para manter o podcast vivo" },
    {
      ul: [
        "Defina uma frequência que a equipe consiga manter (por exemplo, a cada quinze dias).",
        "Grave alguns episódios antes de lançar.",
        "Use um checklist de gravação, como no culto. Veja [Ministério de mídia: como montar e organizar a equipe](" + b(SLUG_MINISTERIO) + ").",
        "Músicas e trilhas também têm direitos autorais: use apenas as que a igreja pode usar.",
      ],
    },
    { hr: true },
    { h2: "O mesmo Reaper e OBS do culto" },
    {
      p: `O curso [Culto ao Vivo com Excelência](${OBS}) tem o módulo **Áudio na transmissão** e o bônus **Utilizando o Reaper na mixagem do áudio da live**, que ensinam a ligar a mesa de som no computador, mixar no Reaper e levar o sinal para o OBS. É a mesma base do podcast da igreja.`,
    },
  ],
};

export const GUIDE_POSTS_2 = [
  guiaFilmarCulto,
  guiaQuantasCameras,
  guiaIluminacao,
  guiaObsVmix,
  guiaMesaDeCorte,
  guiaVariasPlataformas,
  guiaMinisterioMidia,
  guiaPodcastIgreja,
];
