/**
 * Catálogo de formações da Escola Culto em Off.
 *
 * Nada aqui inventa preço, carga horária, certificado ou data.
 * - `status`: deixe `undefined` até existir uma informação oficial.
 *   Use "em-preparacao" para formações futuras.
 * - `href`: link de inscrição/lista de espera. Vazio = botão oculto.
 */

export type CourseStatus = "disponivel" | "inscricoes-abertas" | "em-breve" | "em-preparacao";

export const COURSE_STATUS_LABEL: Record<CourseStatus, string> = {
  disponivel: "Disponível",
  "inscricoes-abertas": "Inscrições abertas",
  "em-breve": "Em breve",
  "em-preparacao": "Em preparação",
};

export type CourseDiagram = "network" | "tf5" | "analog" | "companion" | "dmx";

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
  href?: string;
  featured?: boolean;
};

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
    featured: true,
    href: "",
  },
  {
    id: "yamaha-tf5",
    title: "Yamaha TF5",
    tagline: "Aprenda a entender a mesa, não apenas apertar botões.",
    summary:
      "Do fluxo de sinal ao monitoramento: como a TF5 organiza canais, processamento, mixes e saídas — para você operar com segurança e montar retornos que funcionam.",
    topicsTitle: "Conteúdo",
    topics: [
      "Fluxo de sinal",
      "Canais",
      "Ganho e phantom power",
      "HPF",
      "Equalização",
      "Compressor e gate",
      "Auxiliares, buses e grupos",
      "Efeitos",
      "Cenas",
      "Sends e retornos",
      "Roteamento e Omni Outs",
      "Monitoramento",
    ],
    diagram: "tf5",
    href: "",
  },
  {
    id: "audio-mesa-analogica",
    title: "Áudio em Mesa Analógica",
    tagline: "Os fundamentos continuam os mesmos.",
    summary:
      "Muitas igrejas ainda usam mesas analógicas, e é nelas que os fundamentos ficam mais claros. Entenda o caminho do sinal e o que cada botão faz com ele.",
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
    href: "",
  },
  {
    id: "iluminacao-dmx",
    title: "Iluminação e DMX",
    tagline: "Conceitos de iluminação, do canal ao universo.",
    summary:
      "Uma formação futura para entender como a luz é controlada: canais, endereços, universos e aparelhos — inclusive iluminação sobre rede.",
    topicsTitle: "Conteúdo previsto",
    topics: [
      "O que é DMX e DMX512",
      "Canais e endereçamento",
      "Universos",
      "Fixtures, PAR LED e moving head",
      "Dimmer e cores",
      "Pan e tilt",
      "Cenas e presets",
      "Art-Net e sACN",
      "Conceitos de operação",
    ],
    diagram: "dmx",
    status: "em-preparacao",
    href: "",
  },
];
