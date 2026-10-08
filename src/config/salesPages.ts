/**
 * Conteúdo das páginas de venda das formações (/formacoes/[id]).
 * Só as formações listadas aqui ganham página própria e o botão "Ver detalhes" no card.
 * Preço, professor, módulos e status vêm de src/config/courses.ts (ou do admin).
 */

/** um módulo da formação; `items` são os títulos das aulas e `lessons` sai da contagem deles */
export type SalesModule = { title: string; items: string[]; tag?: string };

/** total de aulas do curso principal (cada item de módulo é uma aula) */
export const lessonCount = (modules: SalesModule[]) => modules.reduce((n, m) => n + m.items.length, 0);

export type SalesPage = {
  /** título principal (promessa) */
  headline: string;
  subheadline: string;
  /** link do vídeo de vendas no YouTube; vazio = espaço reservado "vídeo em breve" */
  videoUrl: string;
  /** situações em que o aluno se reconhece hoje e como ficam depois da formação */
  compare: { before: string; after: string }[];
  /** argumento de valor, logo acima da oferta: quanto custa não saber */
  value: { title: string; text: string };
  /** frase-ponte depois das dores */
  bridge: string;
  /** título do chamado final */
  finalTitle: string;
  /** frase curta acima do botão final */
  finalNote?: string;
  /** versículo em destaque (use poucos: a página não é um devocional) */
  verse?: { text: string; ref: string; note: string };
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
  inside?: { title: string; topology: string; dhcp: { title: string; text: string }; terminal: { title: string; text: string } };
  /**
   * Materiais inclusos (apostila, planilha...). `image` é a foto ou captura REAL do material,
   * guardada em /public/images/formacoes/. Sem imagem, o card mostra só o texto.
   */
  materials?: {
    title: string;
    lead: string;
    items: {
      tag: string;
      title: string;
      text: string;
      /** como o material aparece na lista "O que você leva" (só para o que não está no campo "Inclui" da formação) */
      offerLine?: string;
      image?: { src: string; alt: string; width: number; height: number };
    }[];
  };
  forWho: string[];
  notForWho: string[];
  faq: { question: string; answer: string }[];
};

export const SALES_PAGES: Record<string, SalesPage> = {
  "redes-para-igrejas": {
    headline: "Pare de reiniciar tudo e torcer para funcionar.",
    subheadline:
      "Entenda o que acontece entre a câmera, a mesa, o switch e o computador da live, e resolva os problemas de rede do culto com segurança, sem precisar virar técnico de TI.",
    videoUrl: "",
    // Preço especial de lançamento, sem contagem regressiva.
    // Para voltar a ter prazo: promo: { label: "...", endsAt: "2026-11-30T23:59:59-03:00" }
    promo: { label: "Preço especial de lançamento" },
    compare: [
      { before: "A fonte NDI não aparece no OBS e ninguém sabe por quê.", after: "Você segue um roteiro de diagnóstico e acha a causa." },
      { before: "A câmera PTZ “sumiu” da rede depois que alguém mexeu no roteador.", after: "A rede da técnica fica mapeada e documentada: cada equipamento com o seu IP." },
      { before: "A transmissão engasga justamente na hora da ministração.", after: "Cada equipamento fica no lugar certo: cabo, PoE ou Wi-Fi." },
      { before: "A solução de sempre é desligar e ligar tudo de novo, e torcer.", after: "Você entende o que acontece entre a câmera, o switch e o computador da live." },
      { before: "Depende de “alguém de TI” para qualquer problema.", after: "A própria equipe resolve o que aparece no culto." },
      { before: "Compra equipamento sem saber se vai funcionar.", after: "Entende o que cada switch, cabo e câmera faz antes de comprar." },
    ],
    value: {
      title: "Quanto custa não entender de rede?",
      text: "Um culto com a transmissão fora do ar, uma câmera parada no meio da ministração ou uma visita técnica de emergência custam muito mais do que esta formação. Você paga uma vez e a equipe toda aprende a pensar a rede.",
    },
    bridge: "O problema quase nunca é o equipamento. É a rede que ninguém explicou para a equipe.",
    finalTitle: "O próximo culto pode começar sem susto na rede.",
    finalNote: "Fazer o melhor para Deus também passa pela técnica.",
    verse: {
      text: "Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.",
      ref: "Colossenses 3:23",
      note: "Servir com excelência é também entender o que você opera.",
    },
    // Títulos das aulas conforme os roteiros (01/10/2026): cada item é uma aula. 53 aulas no curso principal.
    modules: [
      {
        title: "Entendendo redes",
        items: ["O que é uma rede?", "Rede local x internet", "Como os equipamentos se comunicam", "A rede de uma igreja moderna"],
      },
      {
        title: "IP na prática",
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
        tag: "Aula prática",
        items: ["IP, porta, TCP e UDP", "Os protocolos da igreja", "OBS WebSocket e firewall", "Companion: visão geral"],
      },
      {
        title: "Prática: NDI de ponta a ponta",
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
    extraModule: {
      title: "Acesso remoto",
      tag: "Módulo extra",
      note: "Lançado depois do curso principal",
      items: [
        "Acessar a rede da igreja de fora",
        "IP público, CGNAT e portas",
        "VPN na prática",
        "Área de trabalho remota",
        "Mesa, câmeras, OBS e Companion de longe",
      ],
    },
    inside: {
      title: "Por dentro das aulas: você enxerga a rede da sua técnica.",
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
    },
    capstone: {
      badge: "Módulos 8 e 9 · Prática e projeto final",
      title: "No final, você vê tudo funcionando junto e projeta a rede da sua igreja.",
      text: "No módulo 8 você acompanha, na tela, uma câmera PTZ, o PC do telão e o PC da transmissão ligados por NDI, do zero ao checklist. No módulo 9 vem o projeto final: a rede completa de uma igreja, com topologia, lista de compras, tabela de IPs e teste.",
      chain: [
        { name: "Rede", what: "switch, cabos e IPs conferidos" },
        { name: "Câmera PTZ", what: "enviando vídeo por NDI" },
        { name: "PC do telão", what: "entrando na rede como fonte NDI" },
        { name: "OBS", what: "recebendo câmera e telão para transmitir" },
        { name: "Projeto final", what: "a rede de uma igreja, do zero" },
      ],
    },
    materials: {
      title: "Dois materiais para deixar na mesa da técnica.",
      lead: "Prévias reais do que vem com a formação: um PDF para consultar na hora do aperto e uma planilha para a rede da igreja parar de ser um mistério.",
      items: [
        {
          tag: "PDF para imprimir · 3 páginas",
          title: "A cola do técnico",
          text: "Uma pergunta, um comando, no Windows e no Linux. Traz também a revisão dos primeiros módulos, um diagnóstico rápido por sintoma e a ficha “A rede da minha igreja” para preencher a lápis.",
          image: { src: "/images/formacoes/redes-cola-do-tecnico.jpg", alt: "Primeira página da cola do técnico, com a tabela “Qual comando responde qual pergunta” no Windows e no Linux", width: 1600, height: 1067 },
        },
        {
          tag: "Planilha · modelo para preencher",
          title: "Documentação de rede da igreja",
          text: "Abas para vídeo, áudio, iluminação, infraestrutura e computadores, além de faixas de IP, Wi-Fi e portas do switch. A planilha avisa quando um IP está duplicado ou fora da faixa, e o Mapa de IPs mostra quais endereços estão livres.",
          offerLine: "Planilha de documentação de rede da igreja",
          image: { src: "/images/formacoes/redes-planilha-mapa-de-ips.jpg", alt: "Aba Mapa de IPs da planilha, mostrando quais endereços da rede estão em uso e quais estão livres", width: 1600, height: 1067 },
        },
      ],
    },
    forWho: [
      "Voluntários de áudio, vídeo, transmissão, projeção e iluminação.",
      "Quem opera NDI, câmeras PTZ, OBS ou mesa digital e quer entender o que está por trás.",
      "Líderes técnicos que precisam organizar a rede da igreja.",
      "Quem nunca estudou redes e quer começar do jeito certo.",
      "Quem quer servir com excelência e ver tudo feito com decência e ordem (1 Coríntios 14:40).",
    ],
    notForWho: [
      "Quem quer se formar administrador de redes corporativas.",
      "Quem procura projeto de VLAN e QoS em profundidade: esses temas ficam para o Curso 2.",
    ],
    faq: [
      {
        question: "Preciso saber alguma coisa de rede antes?",
        answer: "Não. A formação começa do zero, com linguagem simples e exemplos da operação real de um culto.",
      },
      {
        question: "Como são as aulas?",
        answer: "São 53 videoaulas gravadas, divididas em 9 módulos. Boa parte tem demonstração na tela, o módulo 8 é todo prático (NDI de ponta a ponta) e o módulo 9 termina com o projeto final. Depois do lançamento chega um módulo extra de acesso remoto, com mais 5 aulas. Você assiste no seu ritmo, pelo computador ou celular, com acesso vitalício.",
      },
      {
        question: "E se eu tiver dúvidas durante as aulas?",
        answer: "A formação tem uma área de membros com espaço para tirar dúvidas e uma comunidade de alunos, para você trocar experiências com quem serve na técnica de outras igrejas.",
      },
      {
        question: "O curso ensina Dante e Bitfocus Companion?",
        answer: "O Companion aparece no módulo 7, numa visão geral do que ele é e do que precisa da rede, e terá uma formação própria para quem quiser se aprofundar. O Dante é citado como exemplo de áudio em rede e também terá uma formação dedicada no futuro.",
      },
      {
        question: "Preciso ter algum equipamento para acompanhar?",
        answer: "Um computador e a rede que você já tem (em casa ou na igreja) são suficientes para praticar os comandos e testes.",
      },
      {
        question: "Serve para igreja pequena?",
        answer: "Sim. Os fundamentos são os mesmos para uma rede com um roteador e um computador ou para uma estrutura maior.",
      },
      {
        question: "Posso parcelar?",
        answer: "Sim. No cartão de crédito dá para parcelar, e as opções aparecem na página de pagamento da Hotmart. Quem preferir pode pagar à vista.",
      },
      {
        question: "E se eu não gostar?",
        answer: "Você tem 7 dias de garantia. Se a formação não for para você, basta pedir o reembolso dentro desse prazo e devolvemos 100% do valor.",
      },
    ],
  },
};

export const hasSalesPage = (courseId: string) => Boolean(SALES_PAGES[courseId]);
