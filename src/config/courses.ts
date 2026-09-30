/**
 * Catálogo de formações da Escola Culto em Off.
 *
 * - `price` e `format`: valores provisórios definidos para o lançamento.
 *   TODO: confirmar preços e cargas horárias finais.
 * - `status`: "lancamento-em-breve" enquanto as formações não abrem.
 * - `href`: link de inscrição/lista de espera. Vazio = botão oculto.
 */

/**
 * Botão "Mais formações" ao final da seção.
 * TODO: apontar para a página/plataforma com o catálogo completo quando existir.
 */
export const MORE_COURSES_URL = "/formacoes";

export type CourseStatus = "disponivel" | "inscricoes-abertas" | "lancamento-em-breve" | "em-preparacao";

export const COURSE_STATUS_LABEL: Record<CourseStatus, string> = {
  disponivel: "Disponível",
  "inscricoes-abertas": "Inscrições abertas",
  "lancamento-em-breve": "Lançamento em breve",
  "em-preparacao": "Em preparação",
};

export type CourseFormat = {
  /** ex.: "Online" */
  mode: string;
  /** carga horária em horas */
  hours: number;
  /** ex.: "Acesso por 1 ano" */
  access: string;
};

/** Formata preço em reais: 49.9 → "R$ 49,90" */
export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/\u00a0/g, " ");

export type CourseDiagram = "network" | "analog" | "live" | "companion" | "dmx";

export type Course = {
  id: string;
  title: string;
  /** frase-mensagem da formação */
  tagline: string;
  summary: string;
  /** pergunta que a formação ajuda a responder (opcional) */
  question?: string;
  topicsTitle: string;
  topics: string[];
  /** onde o conteúdo é aplicado (opcional) */
  appliedTo?: string[];
  diagram: CourseDiagram;
  status?: CourseStatus;
  /** preço em reais */
  price: number;
  format: CourseFormat;
  href?: string;
  featured?: boolean;
  /** imagem enviada pelo admin (substitui o diagrama) */
  image?: { url: string; alt: string };
  /** id do professor (src/config/instructors.ts) */
  instructor?: string;
  /** o que vem junto, ex.: apostila para imprimir */
  includes?: string[];
  /** não aparece na home (continua em /formacoes) */
  hideOnHome?: boolean;
};

const ONLINE_1_ANO = (hours: number): CourseFormat => ({ mode: "Online", hours, access: "Acesso por 1 ano" });

export const COURSES: Course[] = [
  {
    id: "redes-para-igrejas",
    title: "Redes para Igrejas",
    tagline: "Entenda a infraestrutura por trás das tecnologias que você já usa.",
    summary:
      "Para quem trabalha com áudio, vídeo, transmissão, câmeras, automação ou iluminação. Não é um curso para formar administradores de rede: é para você entender o que acontece entre um equipamento e outro.",
    question: "Por que dois equipamentos ligados no mesmo switch não conseguem conversar?",
    topicsTitle: "Fundamentos de rede",
    topics: [
      "O que é uma rede",
      "LAN e Internet",
      "Endereço IP e IPv4",
      "IP privado e IP público",
      "DHCP",
      "DNS",
      "Gateway",
      "Máscara / subnet",
      "Switch e roteador",
      "Portas, TCP e UDP",
      "Wi-Fi e cabo de rede",
      "Multicast",
      "VLAN (no nível certo)",
      "Ping e descoberta de dispositivos",
      "Troubleshooting",
    ],
    appliedTo: ["NDI", "Dante", "Bitfocus Companion", "Câmeras PTZ", "Consoles digitais", "Controle de iluminação", "OBS", "Streaming"],
    diagram: "network",
    price: 39.9,
    instructor: "jonas-silva",
    includes: ["Apostila de comandos e dicas rápidas para imprimir e consultar depois"],
    format: ONLINE_1_ANO(8),
    status: "lancamento-em-breve",
    featured: true,
    href: "",
  },
  {
    id: "audio-mesa-analogica",
    title: "Fundamentos de Mixagem",
    tagline: "Os fundamentos continuam os mesmos.",
    summary:
      "Os fundamentos que valem para qualquer mesa, explicados numa mesa analógica, onde tudo fica à vista. Entenda o caminho do sinal e o que cada botão faz com ele.",
    topicsTitle: "Conteúdo",
    topics: [
      "Sinal e fluxo de sinal",
      "Ganho e estrutura de ganho",
      "Equalização",
      "Auxiliares e retorno",
      "Grupos",
      "Conexões",
      "PFL / Solo",
      "Prevenção de microfonia",
    ],
    diagram: "analog",
    price: 39.9,
    instructor: "chico-ferreira",
    format: ONLINE_1_ANO(6),
    status: "lancamento-em-breve",
    href: "",
  },
  {
    id: "audio-para-live",
    title: "Áudio para Live",
    tagline: "Quem assiste de casa também precisa ouvir bem.",
    summary:
      "O áudio da transmissão não é o mesmo da igreja. Entenda como levar o som da mesa até o PC da live com qualidade e sem improviso.",
    topicsTitle: "Conteúdo previsto",
    // TODO: revisar a lista de tópicos da formação Áudio para Live.
    topics: [
      "Por que o áudio da live é diferente do áudio da sala",
      "Mix dedicado para a transmissão",
      "Da mesa ao computador: P2, interface de áudio e rede",
      "Níveis e ganho para streaming",
      "Áudio no OBS",
      "Sincronismo entre áudio e vídeo",
      "Monitoramento da transmissão",
    ],
    diagram: "live",
    price: 44.9,
    format: ONLINE_1_ANO(5),
    status: "lancamento-em-breve",
    hideOnHome: true,
    href: "",
  },
  {
    id: "bitfocus-companion",
    title: "Bitfocus Companion",
    tagline: "Faça a tecnologia trabalhar junto.",
    summary:
      "Transforme várias operações em fluxos simples. Um botão pode trocar a cena do OBS, mover a câmera PTZ, alterar a iluminação e disparar outras ações ao mesmo tempo.",
    topicsTitle: "Conteúdo",
    topics: [
      "Conceito do Companion",
      "Connections",
      "Buttons e páginas",
      "Actions e feedbacks",
      "Variables",
      "Triggers",
      "Stream Deck",
      "Automações",
      "Integração entre sistemas",
    ],
    appliedTo: ["OBS", "Câmeras PTZ", "Iluminação", "Áudio", "Projeção", "Streaming"],
    diagram: "companion",
    price: 77.9,
    instructor: "jonas-silva",
    format: ONLINE_1_ANO(6),
    status: "lancamento-em-breve",
    href: "",
  },
  {
    id: "iluminacao-dmx-grandma2",
    title: "Iluminação e DMX com grandMA2",
    tagline: "Do canal ao universo, operando na grandMA2.",
    summary:
      "Uma formação futura focada na console grandMA2: entenda como a luz é controlada (canais, endereços, universos e aparelhos) e como tudo isso se organiza na operação da MA2.",
    topicsTitle: "Conteúdo previsto",
    // TODO: revisar os tópicos específicos de grandMA2.
    topics: [
      "O que é DMX e DMX512",
      "Canais e endereçamento",
      "Universos",
      "Fixtures, PAR LED e moving head",
      "Dimmer e cores",
      "Pan e tilt",
      "Patch de fixtures na grandMA2",
      "Grupos, presets e cues na grandMA2",
      "Art-Net e sACN",
      "Conceitos de operação",
    ],
    diagram: "dmx",
    price: 69.9,
    instructor: "cesar-augusto",
    format: ONLINE_1_ANO(10),
    status: "lancamento-em-breve",
    href: "",
  },
];
