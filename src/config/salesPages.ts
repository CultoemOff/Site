import type { ProblemIlloName } from "@/components/sales/ProblemIllo";
import type { IconName } from "@/components/ui/Icon";

/**
 * Conteúdo das páginas de venda das formações (/formacoes/[id]).
 * Só as formações listadas aqui ganham página própria e o botão "Ver detalhes" no card.
 * Preço, professor, módulos e status vêm de src/config/courses.ts (ou do admin).
 */

/** um módulo da formação; `items` são os títulos das aulas e `lessons` sai da contagem deles */
export type SalesModule = { title: string; items: string[]; tag?: string; icon?: IconName; /** duração do módulo em minutos (aparece ao lado do número de aulas) */ minutes?: number };

/** total de aulas do curso principal (cada item de módulo é uma aula) */
export const lessonCount = (modules: SalesModule[]) => modules.reduce((n, m) => n + m.items.length, 0);

export type SalesPage = {
  /** título principal (promessa) */
  headline: string;
  subheadline: string;
  /**
   * Vídeo de vendas: link do YouTube (pode ser Shorts) ou arquivo .mp4 (ex.: "/videos/redes-para-igrejas.mp4",
   * guardado em /public/videos/). Vazio = espaço reservado "vídeo em breve".
   */
  videoUrl: string;
  /** capa do vídeo .mp4 (imagem em /public); no YouTube a capa vem de lá */
  videoPoster?: string;
  /** vídeo em pé (9:16): no celular ocupa quase a tela toda, com o aviso para rolar abaixo */
  videoVertical?: boolean;
  /** arte animada no lugar do vídeo enquanto ele não existe ("streamdeck" = painel de botões com palco e OBS) */
  heroArt?: "streamdeck";
  /** cor de destaque da página ("red" = vermelho, como a marca do Companion); sem isso, azul */
  theme?: "red";
  /** logo oficial do produto (arquivo enviado pelo Jonas, em /public/images/formacoes/); aparece no topo */
  productLogo?: { src: string; alt: string; width: number; height: number };
  /** texto do parcelamento quando o valor da parcela ainda não está definido (ex.: "em até 8x no cartão") */
  installmentsNote?: string;
  /** destaque curto logo abaixo do subtítulo (responde a principal objeção) */
  heroNote?: { icon: IconName; text: string };
  /** card de outra formação que complementa esta (link interno) */
  complement?: { kicker: string; title: string; text: string; points: string[]; href: string; cta: string };
  /** imagem de compartilhamento (WhatsApp, redes): arquivo em /public */
  ogImage?: string;
  /** frase do popup de saída ("Você está a um passo de ...") */
  exitPitch?: string;
  /** frases de promessa em destaque, logo depois dos números (cartões grandes com ícone) */
  highlights?: { icon: IconName; title: string; text: string }[];
  /** "além das aulas": comunidade e curso que cresce (cartões com mini-ilustração) */
  extras?: {
    title: string;
    items: {
      art: "community" | "updates";
      tag: string;
      title: string;
      text: string;
      /** linha do tempo própria (só no "updates"): etapas já feitas acesas, a próxima pulsando */
      timeline?: { label: string; done?: boolean }[];
    }[];
  };
  /** o que a formação controla/integra: grade de cartões com ícone */
  integrations?: {
    title: string;
    items: { icon: IconName; name: string; what: string }[];
    /** etiqueta pequena acima do título (padrão: "Um painel, tudo junto") */
    kicker?: string;
    /** ilustração ao lado dos cartões: painel de botões ou cabine de transmissão */
    art?: "streamdeck" | "live";
    /** meia-lua de logos girando em volta do título; logo = arquivo em /public/images/logos/ (sem fundo) */
    orbit?: { name: string; logo?: string }[];
    /** aviso pequeno no fim da seção (ex.: sem parceria com as marcas) */
    note?: string;
  };
  /** proporção real do vídeo (largura e altura em pixels); sem isso, usa 9:16 no vertical e 16:9 no horizontal */
  videoSize?: { width: number; height: number };
  /** situações em que o aluno se reconhece hoje e como ficam depois da formação */
  /** situações "hoje × depois", cada uma com um ícone próprio */
  compare: { before: string; after: string; icon?: IconName; illo?: ProblemIlloName }[];
  /** argumento de valor, logo acima da oferta: quanto custa não saber */
  value: { title: string; text: string };
  /** frase-ponte depois das dores */
  bridge?: string;
  /** título do chamado final */
  finalTitle: string;
  /** frase curta acima do botão final */
  finalNote?: string;
  /** versículo em destaque (use poucos: a página não é um devocional) */
  verse?: { text: string; ref: string; note?: string };
  /**
   * Promoção (o preço "de/por" vem da formação: priceFrom e price).
   * `endsAt` é opcional: com data, o site mostra a contagem regressiva e volta ao preço cheio no fim do prazo;
   * sem data, mostra só o selo e o desconto, sem contagem.
   */
  promo?: { label: string; endsAt?: string };
  /** detalhe de cada módulo (mesma ordem de course.topics); tag opcional, ex.: "Aula prática" */
  modules: SalesModule[];
  /** módulo bônus lançado depois do curso principal: aparece à parte e não entra na contagem de módulos e aulas */
  extraModule?: SalesModule & { note: string };
  /** projeto prático do último módulo, em destaque dentro da lista de módulos */
  capstone?: {
    badge: string;
    title: string;
    text: string;
    chain: { name: string; what: string }[];
  };
  /** seção ilustrada "por dentro das aulas" */
  inside?: {
    title: string;
    topology: string;
    dhcp: { title: string; text: string };
    terminal: { title: string; text: string };
    /**
     * Frames REAIS das aulas (em /public/images/formacoes/). Quando existem, entram no lugar das ilustrações:
     * aparecem numa grade de 2 colunas (1 no celular), todos em 16:9.
     */
    /** sem `src`: espaço reservado ("imagem real em breve") até chegarem as imagens do curso */
    frames?: { src?: string; alt: string; width: number; height: number; title: string; text: string; icon?: IconName }[];
  };
  /**
   * Materiais inclusos (apostila, planilha...). `image` é a foto ou captura REAL do material,
   * guardada em /public/images/formacoes/. Sem imagem, o card mostra só o texto.
   */
  materials?: {
    /** "Bônus inclusos" quando os materiais são apresentados como bônus */
    kicker?: string;
    /** true = não mostra a seção própria dos materiais; eles aparecem só como bônus na oferta */
    hideSection?: boolean;
    title: string;
    lead: string;
    items: {
      tag: string;
      icon?: IconName;
      title: string;
      text: string;
      /** como o material aparece na lista "O que você leva" (só para o que não está no campo "Inclui" da formação) */
      offerLine?: string;
      /**
       * Material apresentado como bônus: nome na lista "O que você leva" (com o selo "Bônus").
       * `replaces` = trecho do campo "Inclui" da formação que fala do mesmo material (some da lista para não repetir).
       */
      bonus?: { line: string; replaces?: string };
      image?: { src: string; alt: string; width: number; height: number };
    }[];
  };
  forWho: { icon: IconName; text: string }[];
  /** false = esconde a seção "Para quem é" (o conteúdo pode ir para o FAQ) */
  showForWho?: boolean;
  /** false = esconde a seção de depoimentos ("Quem já fez"), mesmo com depoimentos no painel */
  showTestimonials?: boolean;
  notForWho: string[];
  faq: { question: string; answer: string }[];
};

export const SALES_PAGES: Record<string, SalesPage> = {
  "redes-para-igrejas": {
    headline: "Pare de reiniciar tudo e torcer para funcionar.",
    subheadline: "Entenda a rede por trás da câmera, da mesa e da live, e resolva os problemas do culto sem depender de TI.",
    // vídeo de apresentação (versão provisória enviada pelo Jonas em 09/10/2026), convertido para a web:
    // 720x1218, 30 fps, H.264 + AAC, ~13 MB, em /public/videos/
    videoUrl: "/videos/redes-para-igrejas.mp4",
    videoPoster: "/images/formacoes/redes-video-capa.jpg",
    videoVertical: true,
    videoSize: { width: 720, height: 1218 },
    // Preço especial de lançamento, sem contagem regressiva.
    // Para voltar a ter prazo: promo: { label: "...", endsAt: "2026-11-30T23:59:59-03:00" }
    promo: { label: "Preço especial de lançamento" },
    compare: [
      { icon: "plug", illo: "cable", before: "Usa cabo HDMI ou USB longo, com extensão, e não sabe por que a câmera fica travando.", after: "Conhece o limite de cada tipo de cabo e passa a levar as câmeras pela rede, com NDI." },
      { icon: "refresh", illo: "restart", before: "A solução de sempre é desligar e ligar tudo de novo, e torcer.", after: "Você entende o que acontece entre a câmera, o switch e o computador da live." },
      { icon: "cart", illo: "buy", before: "Compra equipamento sem saber se vai funcionar.", after: "Entende o que cada switch, roteador, cabo e câmera faz antes de comprar." },
      { icon: "users", illo: "automate", before: "Precisa de uma equipe grande de voluntários para operar os cultos.", after: "Conhece os protocolos de rede que ligam mesa, live, iluminação e projeção, e ganha coragem para automatizar o culto com o Companion." },
    ],
    value: {
      title: "Quanto custa não entender de rede?",
      text: "Uma live fora do ar ou uma visita técnica de emergência custam mais do que esta formação.",
    },
    extras: {
      title: "Você não vai aprender sozinho.",
      items: [
        {
          art: "community",
          tag: "Comunidade",
          title: "Tire dúvidas e troque com outras igrejas.",
          text: "Uma comunidade com técnicos de outras igrejas: dúvidas, ideias e a experiência de quem está montando a mesma rede.",
        },
        {
          art: "updates",
          tag: "Novas aulas",
          title: "Saiba quando sair aula nova.",
          timeline: [
            { label: "Lançamento", done: true },
            { label: "Novas aulas", done: true },
            { label: "Atualizações chegando" },
          ],
          text: "Quando uma aula nova for lançada, você recebe o aviso na comunidade.",
        },
      ],
    },
    finalTitle: "O próximo culto pode começar sem susto na rede.",
    finalNote: "Fazer o melhor para Deus também passa pela técnica.",
    verse: {
      text: "Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.",
      ref: "Colossenses 3:23",
    },
    // Relação final de aulas da Hotmart (18/10/2026): 10 módulos, 44 vídeos (numeração até a 50).
    // Cada item é um vídeo; "12, 13" e "31, 32" são um vídeo só. A Aula 0 é grátis no YouTube.
    modules: [
      {
        title: "Entendendo redes",
        icon: "network",
        items: ["O que é uma rede?", "Rede local x Internet", "Como os equipamentos se comunicam", "A rede de uma igreja atualizada"],
      },
      {
        title: "IP na prática",
        icon: "hash",
        items: ["O que é um endereço IP?", "DHCP: quem entrega os IPs", "IP automático x IP fixo", "Máscara e gateway", "DNS", "A regra de ouro"],
      },
      {
        title: "Comandos essenciais",
        icon: "terminal",
        tag: "Aula prática",
        items: ["Abrindo o terminal", "ipconfig e ping", "DNS pelo terminal", "Configuração de rede privada no Windows", "A cola do técnico"],
      },
      {
        title: "Equipamentos, cabos e PoE",
        icon: "plug",
        tag: "Aula prática",
        items: [
          "Modem, roteador, switch e AP",
          "Por dentro do roteador",
          "Entendendo o switch",
          "Cabos de rede",
          "Rede, HDMI, USB e SDI: distância e limites",
          "PoE: energia e dados em um único cabo",
        ],
      },
      {
        title: "Wi-Fi na igreja",
        icon: "wifi",
        tag: "Aula prática",
        items: [
          "Como o Wi-Fi funciona: 2,4 GHz x 5 GHz",
          "Canais, largura e sinal",
          "Repetidor, mesh e access point",
          "Rede de membros/visitantes x rede principal",
        ],
      },
      {
        title: "NDI e câmeras PTZ",
        icon: "video",
        tag: "Aula prática",
        items: [
          "Protocolo NDI: vídeo pela rede",
          "NDI Full, HX2 e HX3",
          "Câmeras PTZ",
          "Configurando uma PTZ no OBS Studio + plugin de controle remoto",
        ],
      },
      {
        title: "Introdução às automações na igreja (OBS Studio + Bitfocus Companion)",
        icon: "sliders",
        tag: "Aula prática",
        items: [
          "Portas, TCP e UDP, protocolos",
          "WebSocket do OBS Studio: controle remotamente as cenas da live",
          "Introdução ao Bitfocus Companion (automações, atalhos e Stream Deck)",
          "Bitfocus Companion: demonstração prática",
        ],
      },
      {
        title: "Roteadores na prática",
        icon: "server",
        tag: "Aula prática",
        items: [
          "Configurando o roteador/modem da Vivo: acesso, DHCP, reserva, portas, Wi-Fi e modo bridge",
          "Configurando o roteador da Claro",
          "Configurando um roteador TP-Link",
        ],
      },
      {
        title: "Planejar a rede da igreja + introdução ao Dante",
        icon: "clipboardCheck",
        items: [
          "Levantamento e dimensionamento",
          "Endereçamento e segmentação da rede + planilha para download",
          "Equipamentos de referência",
          "Introdução ao Dante",
          "Diagnósticos",
        ],
      },
      {
        title: "Prática: OBS, NDI e PTZ",
        icon: "monitorPlay",
        tag: "Projeto final",
        items: ["Preparando o ambiente", "Preparando a rede e o computador", "Montando uma cena no OBS Studio com áudio e vídeo NDI"],
      },
    ],
    inside: {
      title: "Veja como são as aulas.",
      topology:
        "A cabine como ela é: a internet chega ao roteador e leva a live para o YouTube; o switch liga câmeras PTZ, mesa digital e os computadores da live e da projeção; no Wi-Fi da técnica ficam o celular como câmera e o tablet que controla a mesa de som. Cada equipamento com o seu endereço.",
      dhcp: {
        title: "DHCP ou IP fixo, direto no equipamento",
        text: "Você aprende a abrir a tela de rede de uma câmera ou mesa, entender cada campo e decidir quando o endereço deve ser fixo.",
      },
      terminal: {
        title: "Os comandos que resolvem",
        text: "ipconfig, ping e arp, mostrados na tela e explicados linha por linha: o que digitar e como ler a resposta.",
      },
      // frames reais das aulas, enviados pelo Jonas em 08/10/2026
      frames: [
        {
          src: "/images/formacoes/redes-aula-regra-de-ouro.jpg",
          alt: "Slide da aula A regra de ouro: o IP 192.168.0.148 dividido em rua (192.168.0) e casa (148), com duas ruas diferentes que têm uma casa de mesmo número",
          width: 1600,
          height: 900,
          icon: "book",
          title: "Analogias fáceis",
          text: "Cada conceito vira um desenho simples.",
        },
        {
          src: "/images/formacoes/redes-aula-terminal-ping.jpg",
          alt: "Prompt de comando do Windows com o resultado do ipconfig e um ping respondendo, gravado durante a aula",
          width: 1598,
          height: 858,
          icon: "terminal",
          title: "Comandos na tela",
          text: "O que digitar e como ler a resposta.",
        },
        {
          src: "/images/formacoes/redes-aula-ndi-obs.jpg",
          alt: "Propriedades de uma fonte NDI no OBS, recebendo a imagem da câmera PTZ principal da igreja",
          width: 1600,
          height: 899,
          icon: "video",
          title: "NDI na prática",
          text: "Câmeras, telas e outras fontes no OBS.",
        },
        {
          src: "/images/formacoes/redes-aula-equipamentos.jpg",
          alt: "Equipamentos de rede num rack, com cabos ligados nas portas e os LEDs de link acesos",
          width: 1400,
          height: 923,
          icon: "server",
          title: "Equipamento real",
          text: "Portas, cabos e LEDs de perto.",
        },
      ],
    },
    materials: {
      kicker: "Bônus inclusos",
      // seção com as prévias retirada a pedido do Jonas (09/10/2026); os bônus continuam listados na oferta
      hideSection: true,
      title: "Dois bônus para a mesa da técnica.",
      lead: "Já inclusos na formação, sem custo a mais.",
      items: [
        {
          tag: "Bônus 1 · PDF para imprimir",
          icon: "fileText",
          title: "A cola do técnico",
          // no campo "Inclui" da formação ela aparece como "Apostila de comandos e dicas rápidas..."
          bonus: { line: "A cola do técnico (PDF)", replaces: "apostila" },
          text: "Os comandos certos para cada problema, no Windows e no Linux, e um diagnóstico rápido por sintoma.",
          image: { src: "/images/formacoes/redes-cola-do-tecnico.jpg", alt: "Primeira página da cola do técnico, com a tabela “Qual comando responde qual pergunta” no Windows e no Linux", width: 1600, height: 1067 },
        },
        {
          tag: "Bônus 2 · Planilha",
          icon: "sheet",
          title: "Documentação de rede da igreja",
          text: "Cada equipamento com o seu IP. Avisa IP duplicado e mostra os endereços livres.",
          bonus: { line: "Planilha de documentação da rede" },
          image: { src: "/images/formacoes/redes-planilha-mapa-de-ips.jpg", alt: "Aba Mapa de IPs da planilha, mostrando quais endereços da rede estão em uso e quais estão livres", width: 1600, height: 1067 },
        },
      ],
    },
    // seção "Quem já fez" retirada a pedido do Jonas (09/10/2026); os depoimentos continuam no painel
    showTestimonials: false,
    // seção "Para quem é" retirada (10/10/2026): o conteúdo foi para o FAQ; o professor fica ao lado do FAQ
    showForWho: false,
    forWho: [
      { icon: "headphones", text: "Voluntários de áudio, vídeo, live, projeção e luz." },
      { icon: "video", text: "Quem opera NDI, PTZ, OBS ou mesa digital." },
      { icon: "userCheck", text: "Líderes que organizam a técnica da igreja." },
      { icon: "graduation", text: "Quem nunca estudou redes." },
    ],
    notForWho: [
      "Quem quer virar administrador de redes corporativas.",
      "Quem busca VLAN e QoS a fundo (ficam para o Curso 2).",
    ],
    faq: [
      {
        question: "Para quem é a formação?",
        answer: "Voluntários de áudio, vídeo, live, projeção e luz, quem opera NDI, PTZ, OBS ou mesa digital e líderes que organizam a técnica.",
      },
      {
        question: "Preciso saber alguma coisa de rede antes?",
        answer: "Não. Começa do zero, com exemplos reais de culto.",
      },
      {
        question: "Como são as aulas?",
        answer: "44 videoaulas gravadas em 10 módulos, com demonstrações na tela e projeto final com OBS, NDI e PTZ. Acesso vitalício, no computador ou celular.",
      },
      {
        question: "E se eu tiver dúvidas durante as aulas?",
        answer: "Na comunidade de alunos: você tira dúvidas, troca experiências com técnicos de outras igrejas e recebe o aviso quando sair aula nova.",
      },
      {
        question: "O curso ensina Dante e Bitfocus Companion?",
        answer: "Como introdução: o módulo 7 tem duas aulas de Bitfocus Companion (o que é e uma demonstração prática) e o módulo 9 tem uma introdução ao Dante. Os dois terão formações próprias, mais completas.",
      },
      {
        question: "Preciso de algum equipamento?",
        answer: "Só um computador e a rede de casa ou da igreja.",
      },
      {
        question: "Serve para igreja pequena?",
        answer: "Sim. Os fundamentos valem para qualquer tamanho de igreja.",
      },
      {
        question: "Tem certificado?",
        answer: "Sim. Ao concluir, você recebe um certificado de 6 horas, que estudantes de TI podem usar como horas complementares (confira as regras da sua faculdade).",
      },
      {
        question: "Posso parcelar?",
        answer: "Sim, no cartão. As parcelas aparecem no checkout da Hotmart.",
      },
      {
        question: "E se eu não gostar?",
        answer: "Você tem 7 dias de garantia, com reembolso de 100%.",
      },
      {
        question: "Para quem a formação não é?",
        answer: "Para quem quer virar administrador de redes corporativas ou busca VLAN e QoS a fundo (esses temas ficam para o Curso 2).",
      },
    ],
  },

  // Bitfocus Companion (13/10/2026): página só pelo link direto (fora das listas, ver UNLISTED_COURSE_IDS).
  // Sem link da Hotmart ainda: os botões levam ao direct ("Quero ser avisado").
  "bitfocus-companion": {
    headline: "Um botão. O culto inteiro.",
    subheadline: "Cena do OBS, câmera, mesa, letra e luz comandados juntos pelo Companion, num Stream Deck, celular ou tablet.",
    // vídeo de vendas (vertical, como o de Redes): coloque o arquivo em /public/videos/ e preencha videoUrl/videoPoster/videoSize
    videoUrl: "",
    videoVertical: true,
    theme: "red",
    exitPitch: "Você está a um passo de rodar o culto inteiro num toque.",
    heroNote: { icon: "smartphone", text: "Não precisa comprar Stream Deck: funciona no celular, tablet ou navegador." },
    installmentsNote: "em até 8x no cartão",
    promo: { label: "Preço especial de lançamento" },
    highlights: [
      {
        icon: "users",
        title: "Precise de menos voluntários para operar o culto.",
        text: "Otimize as funções na sua igreja: o painel faz o trabalho repetitivo e a equipe fica livre para o que importa.",
      },
      {
        icon: "lightbulb",
        title: "Iluminação 100% automática durante o culto.",
        text: "Aprenda a automatizar toda a iluminação da sua igreja: no Louvor, no Momento da Palavra e em todo o culto.",
      },
    ],
    compare: [
      { icon: "users", illo: "automate", before: "Uma pessoa em cada programa, e o culto depende de todo mundo acertar junto.", after: "Um toque troca a cena, chama a letra e acende a luz, na ordem certa." },
      { icon: "video", illo: "ptz", before: "A câmera chega atrasada no pregador.", after: "Preset da câmera e cena certa no mesmo botão." },
      { icon: "clock", illo: "timer", before: "A pregação estoura o tempo e ninguém percebe.", after: "Cronômetro na tecla e luz que pisca quando o tempo acaba." },
      { icon: "grid", illo: "panel", before: "Só uma pessoa sabe operar a técnica.", after: "Painel por função, com cores que qualquer voluntário entende." },
    ],
    integrations: {
      title: "Tudo o que você vai controlar.",
      art: "streamdeck",
      note: "Não tenho parceria com a Bitfocus nem com essas marcas: elas aparecem aqui só para mostrar a compatibilidade. Marcas e logos pertencem aos seus donos.",
      // logos oficiais: colocar o PNG/SVG sem fundo em /public/images/logos/ e preencher "logo"
      orbit: [
        { name: "Holyrics" },
        { name: "SPresenter", logo: "/images/logos/spresenter.png" },
        { name: "OBS Studio" },
        { name: "grandMA2" },
        { name: "Lumikit" },
        { name: "Stream Deck" },
        { name: "Yamaha" },
        { name: "Behringer" },
        { name: "Soundcraft" },
      ],
      items: [
        { icon: "monitorPlay", name: "OBS Studio", what: "Cenas, fontes, áudio, live e gravação" },
        { icon: "presentation", name: "Holyrics", what: "Letras, Bíblia e avisos" },
        { icon: "presentation", name: "SPresenter", what: "Projeção, pelo caminho que funcionar" },
        { icon: "sliders", name: "Mesas de som digitais", what: "Mute, fader, cenas e medidores" },
        { icon: "video", name: "Câmeras PTZ", what: "Presets, velocidade e movimento" },
        { icon: "lightbulb", name: "grandMA2", what: "Executores e cues da iluminação" },
        { icon: "power", name: "Tomada e lâmpada", what: "Liga equipamentos e vira tally" },
        { icon: "code", name: "HTTP, OSC, TCP/UDP", what: "O que não tem módulo pronto" },
      ],
    },
    value: {
      title: "Quanto vale um culto sem correria na técnica?",
      text: "Menos gente apertando botão ao mesmo tempo, menos erro na hora que todo mundo vê.",
    },
    extras: {
      title: "Você não vai montar seu painel sozinho.",
      items: [
        {
          art: "community",
          tag: "Comunidade",
          title: "Tire dúvidas e troque projetos.",
          text: "Uma comunidade com quem também está montando o Companion na igreja: dúvidas, ideias e painéis compartilhados.",
        },
        {
          art: "updates",
          tag: "Sempre atualizado",
          title: "Um curso que cresce com o tempo.",
          text: "Novas aulas e atualizações conforme o Companion evolui, incluídas no seu acesso.",
        },
      ],
    },
    finalTitle: "O próximo culto pode rodar num toque.",
    // capstone: o projeto do módulo 7, em destaque logo abaixo dos módulos
    capstone: {
      badge: "Módulo 7 · Projeto",
      title: "Você monta o painel do culto completo.",
      text: "Do mapa do culto ao ensaio final, com página de emergência pronta.",
      chain: [
        { name: "Roteiro", what: "um botão por momento do culto" },
        { name: "Funções", what: "páginas por operador" },
        { name: "Emergência", what: "tela preta, mute geral, espera" },
        { name: "Ensaio", what: "checklist antes do culto" },
      ],
    },
    inside: {
      title: "Veja como são as aulas.",
      topology: "",
      dhcp: { title: "", text: "" },
      terminal: { title: "", text: "" },
      // espaços reservados: trocar por imagens reais das aulas quando estiverem prontas (src + width/height)
      frames: [
        { icon: "grid", alt: "Painel do culto no Stream Deck", width: 1600, height: 900, title: "Painel do culto", text: "Um botão por momento do culto." },
        { icon: "monitorPlay", alt: "Conexões do Companion com OBS, Holyrics e mesa", width: 1600, height: 900, title: "Conexões", text: "OBS, Holyrics, mesas digitais e câmeras." },
        { icon: "zap", alt: "Triggers e variáveis no Companion", width: 1600, height: 900, title: "Automação", text: "Triggers, variáveis e cronômetro." },
        { icon: "smartphone", alt: "Celular usado como painel do Companion", width: 1600, height: 900, title: "Qualquer tela", text: "Stream Deck, celular ou tablet." },
      ],
    },
    // aulas conforme o plano do curso (13/10/2026): 41 aulas em 8 módulos
    modules: [
      {
        title: "Começando",
        icon: "play",
        items: ["O Companion na igreja", "O mínimo de rede", "Preparando o computador", "Instalando o Companion", "Interface e primeira conexão"],
      },
      {
        title: "Botões",
        icon: "grid",
        items: ["Anatomia do botão", "Ações: press, release e long press", "Feedbacks e padrão de cores", "Steps", "Páginas, presets e organização"],
      },
      {
        title: "Conectando as aplicações",
        icon: "network",
        items: [
          "Módulos e conexões",
          "OBS a fundo",
          "Holyrics: conectar",
          "Holyrics: botões",
          "SPresenter",
          "Mesas de som digitais: conectar",
          "Mesas de som digitais: além do mute",
          "Câmeras PTZ",
          "grandMA2",
          "Tomada e lâmpada inteligente",
          "O que não tem módulo",
        ],
      },
      {
        title: "Variáveis e automação",
        icon: "zap",
        items: [
          "Variáveis no botão e como feedback",
          "Variáveis personalizadas e locais",
          "Expressões: o conceito",
          "Expressões: na prática",
          "Cronômetro de pregação",
          "Triggers",
          "Pré-culto automático",
        ],
      },
      {
        title: "Painéis",
        icon: "smartphone",
        items: ["Stream Deck e Stream Deck +", "Celular, tablet e navegador", "Vários operadores e Surface Groups"],
      },
      {
        title: "Operação remota",
        icon: "lock",
        items: ["Cenários e riscos", "Acesso por VPN", "Satellite"],
      },
      {
        title: "Projeto: o culto completo",
        icon: "clipboardCheck",
        tag: "Projeto final",
        items: ["Planejando o painel", "Página roteiro do culto", "Páginas por função e emergência", "Ensaio e checklist"],
      },
      {
        title: "Confiabilidade",
        icon: "shield",
        items: ["Backup e restauração", "Atualização e segurança", "Quando o botão não responde"],
      },
    ],
    forWho: [
      { icon: "headphones", text: "Quem opera áudio, vídeo, live, projeção ou luz." },
      { icon: "users", text: "Líderes que querem uma técnica mais simples de operar." },
    ],
    notForWho: ["Quem procura programação avançada de automação."],
    showForWho: false,
    showTestimonials: false,
    faq: [
      {
        question: "Preciso ter um Stream Deck?",
        answer: "Não. Celular, tablet ou navegador também viram painel (módulo 5).",
      },
      {
        question: "Preciso saber de redes?",
        answer: "Não. O módulo 1 ensina o mínimo de rede que o Companion precisa.",
      },
      {
        question: "Quais programas e equipamentos o curso mostra?",
        answer: "OBS, Holyrics, SPresenter, mesas de som digitais, câmeras PTZ, grandMA2, tomadas e lâmpadas inteligentes, e o que não tem módulo, por HTTP, OSC e TCP/UDP.",
      },
      {
        question: "Como são as aulas?",
        answer: "41 videoaulas gravadas em 8 módulos, com projeto final do culto completo.",
      },
      {
        question: "Posso parcelar?",
        answer: "Sim, em até 8x no cartão, pela Hotmart.",
      },
      {
        question: "E se eu não gostar?",
        answer: "Você tem 7 dias de garantia, com reembolso de 100%.",
      },
    ],
  },
  // Culto ao Vivo com Excelência (18/10/2026): pré-venda, só pelo link direto (fora das listas, ver UNLISTED_COURSE_IDS).
  // Sem link da Hotmart ainda: os botões levam ao direct ("Quero ser avisado").
  "culto-ao-vivo-com-excelencia": {
    headline: "Sua live do culto, estável e bonita.",
    subheadline: "Transmissão de cultos com OBS Studio, do zero ao avançado, para a realidade de igrejas pequenas e médias.",
    // vídeo de vendas (vertical, como o de Redes): coloque o arquivo em /public/videos/ e preencha videoUrl/videoPoster/videoSize
    videoUrl: "",
    videoVertical: true,
    ogImage: "/images/formacoes/culto-ao-vivo-og.jpg",
    exitPitch: "Você está a um passo de colocar o culto no ar sem susto.",
    heroNote: { icon: "monitorPlay", text: "Feito para PC simples, poucas câmeras, internet de operadora e equipe voluntária." },
    promo: { label: "Preço especial de lançamento" },
    highlights: [
      {
        icon: "video",
        title: "Qual câmera comprar, para cada orçamento.",
        text: "Uma aula sobre os tipos de câmera e as escolhas que a gente recomenda para cada faixa de orçamento da igreja.",
      },
      {
        icon: "users",
        title: "Pensado para igreja pequena e média.",
        text: "Nada de estúdio de TV: tudo parte do PC, das câmeras e da internet que a sua igreja já tem.",
      },
      {
        icon: "monitorPlay",
        title: "Demonstrações reais na tela do OBS.",
        text: "Você vê cada configuração sendo feita, passo a passo, e repete no computador da igreja.",
      },
      {
        icon: "refresh",
        title: "Um curso que cresce com o tempo.",
        text: "As aulas são numeradas por módulo porque novas aulas vão entrar, incluídas no seu acesso.",
      },
    ],
    compare: [
      { icon: "wifi", illo: "buffer", before: "A live trava ou cai no meio do culto.", after: "Encoder, bitrate e resolução certos para a sua internet e o seu PC." },
      { icon: "sliders", illo: "sync", before: "O áudio chega ruim ou atrasado em relação à imagem.", after: "Um mix só para a live, níveis, filtros e sincronia acertados." },
      { icon: "grid", illo: "scenes", before: "Cenas bagunçadas e a letra entrando na hora errada.", after: "Um plano de cenas do culto, com letras e avisos no lugar." },
      { icon: "users", illo: "solo", before: "Tudo depende de \u201cum cara que entende\u201d.", after: "Checklist e plano B para qualquer voluntário operar no domingo." },
    ],
    value: {
      title: "Quanto vale um domingo sem a live cair?",
      text: "Uma transmissão que trava afasta quem assiste de casa. Uma que funciona leva o culto a quem não pôde ir.",
    },
    finalTitle: "O próximo culto pode ir ao ar sem susto.",
    inside: {
      title: "Veja como são as aulas.",
      topology: "",
      dhcp: { title: "", text: "" },
      terminal: { title: "", text: "" },
      // espaços reservados: trocar por imagens reais das aulas quando estiverem prontas (src + width/height)
      frames: [
        { icon: "monitorPlay", alt: "Tela do OBS com as cenas do culto", width: 1600, height: 900, title: "Na tela do OBS", text: "Cada configuração feita na hora." },
        { icon: "video", alt: "Câmeras da igreja e conexões", width: 1600, height: 900, title: "Câmeras e conexões", text: "PTZ, NDI, placas e celular." },
        { icon: "sliders", alt: "Áudio da mesa levado para a live", width: 1600, height: 900, title: "Áudio da live", text: "Da mesa para o OBS, sem atraso." },
        { icon: "clipboardCheck", alt: "Checklist de operação do culto", width: 1600, height: 900, title: "Operação no domingo", text: "Checklist e plano B." },
      ],
    },
    // aulas numeradas por módulo (o Jonas vai acrescentar aulas no futuro)
    modules: [
      {
        title: "O sistema de transmissão e o OBS",
        icon: "monitorPlay",
        items: ["Como funciona uma transmissão de culto", "O PC da transmissão: o que realmente importa", "Instalando o OBS Studio", "Tour pela interface do OBS"],
      },
      {
        title: "Câmeras para igrejas",
        icon: "video",
        items: [
          "Os 7 tipos de câmera",
          "Por que a PTZ é a câmera ideal para a igreja",
          "PTZ com NDI: a combinação recomendada",
          "As outras categorias: quando fazem sentido",
          "Configurações essenciais da câmera",
        ],
      },
      {
        title: "Conexões, placas, NDI e mesa de corte",
        icon: "plug",
        items: [
          "Tipo de câmera não é tipo de conexão",
          "HDMI e SDI",
          "USB e placas de captura",
          "Vídeo pela rede: NDI, RTSP, SRT e Wi-Fi",
          "Instalando o NDI e o DistroAV no OBS",
          "Celular como câmera no OBS",
          "Mesa de corte: o que é e quando faz sentido",
        ],
      },
      {
        title: "Áudio na transmissão",
        icon: "sliders",
        items: [
          "O mix da live não é o mix do templo",
          "Levando o som da mesa para o PC (auxiliares e interface estéreo)",
          "Do Reaper para o OBS por NDI",
          "Mixer do OBS e níveis",
          "Filtros essenciais",
          "Sincronia de áudio e vídeo",
        ],
      },
      {
        title: "Montando o culto no OBS",
        icon: "grid",
        tag: "Aula prática",
        items: [
          "Configurações de vídeo do OBS",
          "Cenas e fontes: a lógica",
          "O plano de cenas do culto",
          "Câmeras com boa imagem: cor, LUT e enquadramento",
          "Modo Estúdio e transições",
          "Letras e avisos com o Holyrics",
          "Letras e avisos com o SPresenter",
          "Tarjas, QR code de ofertas e avisos",
          "Organização e backup do OBS",
        ],
      },
      {
        title: "Controle PTZ",
        icon: "presentation",
        tag: "Aula prática",
        items: [
          "Como funciona o controle PTZ",
          "Planejando os presets do culto",
          "Controle físico: conexão e configuração (exemplo: NEOiD Mini)",
          "Controle físico na operação do culto",
          "Plugin PTZ para OBS",
        ],
      },
      {
        title: "Encoder, bitrate e plataformas",
        icon: "wifi",
        items: [
          "Sua internet aguenta?",
          "Encoder: qual usar",
          "Bitrate, resolução e fps",
          "Transmitindo no YouTube",
          "Facebook e várias plataformas ao mesmo tempo",
          "Gravação local junto com a live",
        ],
      },
      {
        title: "Operação no domingo e plano B",
        icon: "clipboardCheck",
        tag: "Operação no domingo",
        items: [
          "Checklist pré-culto",
          "Operando durante o culto",
          "Monitorando a live",
          "Quando algo dá errado",
          "Pós-culto",
          "Fechamento: a estrutura ideal por porte de igreja",
        ],
      },
    ],
    forWho: [
      { icon: "video", text: "Quem cuida da transmissão, das câmeras, da projeção ou do som." },
      { icon: "users", text: "Líderes de mídia e pastores que cuidam da estrutura." },
    ],
    notForWho: ["Quem procura produção de vídeo profissional para TV."],
    showForWho: false,
    showTestimonials: false,
    faq: [
      {
        question: "Para quem é o curso?",
        answer: "Para quem cuida da transmissão, das câmeras, da projeção ou do som da igreja, voluntário ou contratado, e para líderes de mídia, pastores e o técnico que faz tudo sozinho. Não precisa ser profissional de vídeo nem de TI.",
      },
      {
        question: "Preciso de equipamento caro?",
        answer: "Não. O curso parte do que a igreja já tem: um PC com OBS, celular ou webcam e a mesa de som. A câmera PTZ com NDI aparece como recomendação para quando a igreja for investir.",
      },
      {
        question: "Serve para PC fraco?",
        answer: "Sim. O módulo 1 mostra o que realmente importa no PC da live, e o módulo 7 ensina a ajustar encoder, resolução e bitrate ao que o seu PC e a sua internet aguentam.",
      },
      {
        question: "Serve para Mac?",
        answer: "O OBS Studio funciona no Windows e no Mac, e a lógica do curso vale para os dois.",
      },
      {
        question: "Quanto tempo de acesso eu tenho?",
        answer: "Acesso vitalício, com as aulas novas que forem acrescentadas.",
      },
      {
        question: "Como recebo o acesso?",
        answer: "Pela Hotmart: depois da confirmação do pagamento, você recebe o acesso no seu e-mail.",
      },
      {
        question: "E se eu tiver dúvidas?",
        answer: "Na área de membros tem uma comunidade para tirar dúvidas.",
      },
      {
        question: "Para quem o curso não é?",
        answer: "Para quem procura produção de vídeo profissional para TV. O foco é a live do culto na igreja pequena e média.",
      },
    ],
  },

};

export const hasSalesPage = (courseId: string) => Boolean(SALES_PAGES[courseId]);
