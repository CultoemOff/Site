import type { IconName } from "@/components/ui/Icon";

/**
 * Conteúdo das páginas de venda das formações (/formacoes/[id]).
 * Só as formações listadas aqui ganham página própria e o botão "Ver detalhes" no card.
 * Preço, professor, módulos e status vêm de src/config/courses.ts (ou do admin).
 */

/** um módulo da formação; `items` são os títulos das aulas e `lessons` sai da contagem deles */
export type SalesModule = { title: string; items: string[]; tag?: string; icon?: IconName };

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
  /** proporção real do vídeo (largura e altura em pixels); sem isso, usa 9:16 no vertical e 16:9 no horizontal */
  videoSize?: { width: number; height: number };
  /** situações em que o aluno se reconhece hoje e como ficam depois da formação */
  /** situações "hoje × depois", cada uma com um ícone próprio */
  compare: { before: string; after: string; icon?: IconName }[];
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
    frames?: { src: string; alt: string; width: number; height: number; title: string; text: string; icon?: IconName }[];
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
      { icon: "plug", before: "Usa cabo HDMI ou USB longo, com extensão, e não sabe por que a câmera fica travando.", after: "Conhece o limite de cada tipo de cabo e passa a levar as câmeras pela rede, com NDI." },
      { icon: "refresh", before: "A solução de sempre é desligar e ligar tudo de novo, e torcer.", after: "Você entende o que acontece entre a câmera, o switch e o computador da live." },
      { icon: "cart", before: "Compra equipamento sem saber se vai funcionar.", after: "Entende o que cada switch, roteador, cabo e câmera faz antes de comprar." },
      { icon: "users", before: "Precisa de uma equipe grande de voluntários para operar os cultos.", after: "Conhece os protocolos de rede que ligam mesa, live, iluminação e projeção, e ganha coragem para automatizar o culto com o Companion." },
    ],
    value: {
      title: "Quanto custa não entender de rede?",
      text: "Uma live fora do ar ou uma visita técnica de emergência custam mais do que esta formação.",
    },
    finalTitle: "O próximo culto pode começar sem susto na rede.",
    finalNote: "Fazer o melhor para Deus também passa pela técnica.",
    verse: {
      text: "Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.",
      ref: "Colossenses 3:23",
    },
    // Títulos das aulas conforme os roteiros (01/10/2026): cada item é uma aula. 53 aulas no curso principal.
    modules: [
      {
        title: "Entendendo redes",
        icon: "network",
        items: ["O que é uma rede?", "Rede local x internet", "Como os equipamentos se comunicam", "A rede de uma igreja moderna"],
      },
      {
        title: "IP na prática",
        icon: "hash",
        items: [
          "O que é um endereço IP?",
          "DHCP: quem entrega os IPs",
          "IP automático x IP fixo",
          "Máscara e gateway",
          "DNS",
          "A regra de ouro",
        ],
      },
      {
        title: "Comandos essenciais no Windows e no Linux",
        icon: "terminal",
        tag: "Aula prática",
        items: [
          "Abrindo o terminal",
          "ipconfig e ip a: descobrindo o seu IP",
          "ping: o equipamento responde?",
          "DNS pelo terminal",
          "Rede privada no Windows",
          "A cola do técnico",
        ],
      },
      {
        title: "Equipamentos, cabos e PoE",
        icon: "plug",
        tag: "Aula prática",
        items: [
          "Modem, roteador, switch e access point",
          "Por dentro do roteador",
          "Entendendo o switch",
          "Switch gerenciável",
          "Cabos de rede",
          "Até onde vai cada cabo",
          "PoE: energia pelo cabo",
        ],
      },
      {
        title: "Wi-Fi na igreja",
        icon: "wifi",
        tag: "Aula prática",
        items: [
          "Como o Wi-Fi funciona",
          "Canais, largura e sinal",
          "Repetidor, mesh e access point",
          "Rede da produção x rede dos visitantes",
          "Celular como câmera com o Iriun",
          "Do celular no Wi-Fi até o OBS",
        ],
      },
      {
        title: "NDI e câmeras PTZ",
        icon: "video",
        tag: "Aula prática",
        items: [
          "NDI: vídeo pela rede",
          "Banda: Full NDI x NDI HX",
          "NDI Tools",
          "NDI no OBS",
          "Áudio por NDI",
          "Câmeras PTZ",
          "A câmera PTZ na rede",
          "Comandos de PTZ",
        ],
      },
      {
        title: "Controle pela rede",
        icon: "sliders",
        tag: "Aula prática",
        items: ["IP, porta, TCP e UDP", "Os protocolos da igreja", "OBS WebSocket e firewall", "Companion: visão geral"],
      },
      {
        title: "Prática: NDI de ponta a ponta",
        icon: "monitorPlay",
        tag: "Módulo prático",
        items: [
          "O cenário e o plano",
          "Preparando a rede",
          "NDI na câmera PTZ",
          "O PC do telão",
          "O PC da transmissão",
          "Testes e checklist",
        ],
      },
      {
        title: "Planejar, diagnosticar e projeto final",
        icon: "clipboardCheck",
        tag: "Projeto final",
        items: [
          "Planejando a rede",
          "Organizando os IPs",
          "Boas práticas",
          "Método de diagnóstico",
          "Problemas reais",
          "Projeto final: a rede completa de uma igreja",
        ],
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
        question: "Preciso saber alguma coisa de rede antes?",
        answer: "Não. Começa do zero, com exemplos reais de culto.",
      },
      {
        question: "Como são as aulas?",
        answer: "53 videoaulas gravadas em 9 módulos, com demonstrações na tela e projeto final. Acesso vitalício, no computador ou celular.",
      },
      {
        question: "E se eu tiver dúvidas durante as aulas?",
        answer: "Você tira dúvidas na área de membros e conversa com a comunidade de alunos.",
      },
      {
        question: "O curso ensina Dante e Bitfocus Companion?",
        answer: "O Companion aparece no módulo 7, numa visão geral. Ele e o Dante terão formações próprias.",
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
        question: "Posso parcelar?",
        answer: "Sim, no cartão. As parcelas aparecem no checkout da Hotmart.",
      },
      {
        question: "E se eu não gostar?",
        answer: "Você tem 7 dias de garantia, com reembolso de 100%.",
      },
    ],
  },
};

export const hasSalesPage = (courseId: string) => Boolean(SALES_PAGES[courseId]);
