/**
 * Catálogo de formações da Escola Culto em Off.
 *
 * - `price`: só a formação de Redes tem preço. As demais ficam com 0 (sem preço) até o lançamento:
 *   o site não mostra valor nenhum para elas.
 * - `format`: cargas horárias provisórias. TODO: confirmar as finais.
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

/** Parcelamento: { count: 8, value: 10.03 } → "8x de R$ 10,03" */
export const formatInstallments = (i: { count: number; value: number }) => `${i.count}x de ${formatPrice(i.value)}`;

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
  /** preço em reais (o que a pessoa paga hoje). 0 = sem preço definido: o site não mostra valor */
  price: number;
  /** preço cheio, exibido riscado quando há promoção ("de R$ 138,80 por R$ 59,00") */
  priceFrom?: number;
  /** parcelamento no cartão, como configurado no checkout (ex.: 8x de R$ 10,03) */
  installments?: { count: number; value: number };
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
  /**
   * Depoimentos de alunos, cadastrados no painel (Conteúdo → Formações). Só depoimentos reais:
   * enquanto a lista estiver vazia, a página de venda não mostra a seção.
   */
  testimonials?: { name: string; role?: string; text: string }[];
  /**
   * Versão do conteúdo no código. Ao rodar `npm run seed`, a formação já existente no banco só é
   * atualizada quando este número é maior que o gravado lá (assim as edições do admin não são perdidas).
   */
  rev?: number;
  /**
   * O que a mudança de `rev` altera no banco. "price" = só preço, parcelas e status; "href" = só o link de compra
   * (textos e demais campos editados no admin ficam como estão). Sem este campo, atualiza tudo.
   */
  revScope?: "price" | "href";
};

/** A formação tem preço para mostrar? (0 ou vazio = sem preço, como nas que ainda vão lançar) */
export const hasPrice = (course: Pick<Course, "price">) => course.price > 0;

const ONLINE_1_ANO = (hours: number): CourseFormat => ({ mode: "Online", hours, access: "Acesso por 1 ano" });

export const COURSES: Course[] = [
  {
    id: "redes-para-igrejas",
    title: "Redes para Igrejas",
    tagline: "Entenda a infraestrutura por trás das tecnologias que você já usa.",
    summary:
      "Para quem trabalha com áudio, vídeo, transmissão, câmeras, automação ou iluminação. Não é um curso para formar administradores de rede: é para você entender o que acontece entre um equipamento e outro. Videoaulas gravadas em 9 módulos, do conceito ao projeto prático com OBS, NDI, PTZ e Companion funcionando juntos.",
    question: "Por que dois equipamentos ligados no mesmo switch não conseguem conversar?",
    topicsTitle: "9 módulos",
    // Módulos do Curso 1 (básico). Tópicos avançados (VLAN, QoS, IGMP) ficam para o Curso 2.
    // TODO: conferir os títulos com o roteiro final das aulas.
    topics: [
      "Fundamentos: o que é uma rede, LAN, internet, switch e roteador",
      "Endereçamento: IP, máscara, gateway, DHCP e DNS",
      "Comandos de rede no Windows e no Linux",
      "Cabos, switches e PoE",
      "Wi-Fi na igreja",
      "NDI na prática",
      "Câmeras PTZ e o celular como câmera (Iriun)",
      "Troubleshooting: encontrando o problema antes do culto",
      "Projeto prático: OBS, NDI, PTZ, rede e Companion funcionando juntos",
    ],
    appliedTo: ["NDI", "Câmeras PTZ", "PoE", "Wi-Fi", "Iriun Webcam", "OBS", "Bitfocus Companion", "Streaming"],
    // rev 7: só troca o link de compra no banco (revScope "href"); o resto do que está no painel fica como está
    rev: 7,
    revScope: "href",
    diagram: "network",
    // Os valores precisam ser iguais aos do checkout da Hotmart.
    // Parcela calculada com a mesma taxa do print do Jonas (R$ 69,00 → 8x de R$ 10,03); confirmar na Hotmart.
    price: 59,
    priceFrom: 138.8,
    installments: { count: 8, value: 8.58 },
    instructor: "jonas-silva",
    includes: [
      "Apostila de comandos e dicas rápidas para imprimir e consultar depois",
      "Área de membros para tirar dúvidas e comunidade de alunos",
    ],
    format: { mode: "Online", hours: 8, access: "Acesso vitalício" },
    status: "inscricoes-abertas",
    featured: true,
    // página de pagamento da Hotmart (todos os botões de compra usam este link)
    href: "https://pay.hotmart.com/W107866343I",
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
    // sem preço até o lançamento (0 = o site não mostra preço)
    price: 0,
    rev: 1,
    revScope: "price",
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
    // sem preço até o lançamento (0 = o site não mostra preço)
    price: 0,
    rev: 1,
    revScope: "price",
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
    // sem preço até o lançamento (0 = o site não mostra preço)
    price: 0,
    rev: 1,
    revScope: "price",
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
    // sem preço até o lançamento (0 = o site não mostra preço)
    price: 0,
    rev: 1,
    revScope: "price",
    instructor: "cesar-augusto",
    format: ONLINE_1_ANO(10),
    status: "lancamento-em-breve",
    href: "",
  },
];
