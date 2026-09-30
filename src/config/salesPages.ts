/**
 * Conteúdo das páginas de venda das formações (/formacoes/[id]).
 * Só as formações listadas aqui ganham página própria e o botão "Ver detalhes" no card.
 * Preço, professor, módulos e status vêm de src/config/courses.ts (ou do admin).
 */

export type SalesPage = {
  /** título principal (promessa) */
  headline: string;
  subheadline: string;
  /** link do vídeo de vendas no YouTube; vazio = espaço reservado "vídeo em breve" */
  videoUrl: string;
  /** situações em que o aluno se reconhece */
  pains: string[];
  /** frase-ponte depois das dores */
  bridge: string;
  outcomesTitle: string;
  /** o que muda depois da formação */
  outcomes: string[];
  /** título do chamado final */
  finalTitle: string;
  /** exemplos práticos: sintoma → causa → o que fazer */
  examples: { symptom: string; cause: string; fix: string }[];
  /** detalhe de cada módulo (mesma ordem de course.topics) */
  modules: { title: string; items: string[] }[];
  /** amostra da apostila */
  cheatsheet?: { title: string; label: string; rows: { cmd: string; what: string }[] };
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
    pains: [
      "A fonte NDI não aparece no OBS e ninguém sabe por quê.",
      "A câmera PTZ “sumiu” da rede depois que alguém mexeu no roteador.",
      "A transmissão engasga justamente na hora da ministração.",
      "Ninguém da equipe sabe qual é o IP de cada equipamento.",
      "O celular usado como câmera trava ou perde a conexão.",
      "A solução de sempre é desligar e ligar tudo de novo, e torcer.",
    ],
    bridge: "O problema quase nunca é o equipamento. É a rede que ninguém explicou para a equipe.",
    outcomesTitle: "Você passa a entender a rede, em vez de depender da sorte.",
    finalTitle: "O próximo culto pode começar sem susto na rede.",
    outcomes: [
      "Saber o que é IP, máscara, gateway, DHCP e DNS, e por que isso importa no culto.",
      "Descobrir e testar qualquer equipamento da rede com poucos comandos.",
      "Montar a rede da técnica com cabo, switch e PoE do jeito certo.",
      "Fazer NDI, câmeras PTZ e o celular como câmera funcionarem de forma estável.",
      "Seguir um roteiro de diagnóstico quando algo falhar, em vez de adivinhar.",
      "Conversar com o pessoal de TI ou com o fornecedor falando a mesma língua.",
    ],
    examples: [
      {
        symptom: "A câmera PTZ não responde ao controle.",
        cause: "A câmera ficou com um IP de outra faixa da rede.",
        fix: "Encontrar o IP com um comando, ajustar endereço e máscara e testar com ping.",
      },
      {
        symptom: "A fonte NDI não aparece no computador da live.",
        cause: "Os computadores estão em redes diferentes ou o firewall está bloqueando.",
        fix: "Conferir a rede de cada máquina, liberar o NDI no firewall e validar a descoberta.",
      },
      {
        symptom: "A live trava sempre no mesmo momento do culto.",
        cause: "O computador da transmissão está no Wi-Fi, disputando espaço com a igreja inteira.",
        fix: "Levar o computador da live para o cabo e separar o que precisa de estabilidade.",
      },
    ],
    modules: [
      {
        title: "Fundamentos: o que é uma rede, LAN, internet, switch e roteador",
        items: ["O que é uma rede local", "LAN e internet", "Diferença entre switch e roteador", "Como os equipamentos da técnica se conectam"],
      },
      {
        title: "Endereçamento: IP, máscara, gateway, DHCP e DNS",
        items: ["Endereço IP e IPv4", "IP privado e IP público", "Máscara e faixa de rede", "Gateway, DHCP e DNS"],
      },
      {
        title: "Comandos de rede no Windows e no Linux",
        items: ["Descobrir o próprio IP", "Testar se um equipamento responde", "Ver quem está na rede", "Guia rápido para imprimir"],
      },
      {
        title: "Cabos, switches e PoE",
        items: ["Cabo de rede e conectores", "Switch gerenciável e não gerenciável", "PoE: energia pelo cabo", "Organizando a rede da técnica"],
      },
      {
        title: "Wi-Fi na igreja",
        items: ["Quando usar Wi-Fi e quando usar cabo", "Rede da técnica x rede dos membros", "Cuidados com a transmissão"],
      },
      {
        title: "NDI na prática",
        items: ["O que é NDI", "Por que a fonte não aparece", "NDI e OBS", "Boas práticas de rede para vídeo"],
      },
      {
        title: "Câmeras PTZ e o celular como câmera (Iriun)",
        items: ["Colocando a câmera PTZ na rede", "Controle e descoberta", "Usando o celular como câmera com o Iriun", "Estabilidade na hora do culto"],
      },
      {
        title: "Troubleshooting: encontrando o problema antes do culto",
        items: ["Roteiro de diagnóstico passo a passo", "Problemas mais comuns da técnica", "Checklist antes do culto"],
      },
    ],
    cheatsheet: {
      title: "Apostila de comandos e dicas rápidas",
      label: "Redes · guia rápido",
      rows: [
        { cmd: "ipconfig /all", what: "Mostra IP, máscara, gateway e DNS no Windows" },
        { cmd: "ip a", what: "Mostra os endereços da máquina no Linux" },
        { cmd: "ping 192.168.0.50", what: "Testa se um equipamento responde" },
        { cmd: "arp -a", what: "Lista os equipamentos vistos na rede" },
        { cmd: "tracert / traceroute", what: "Mostra o caminho até um destino" },
      ],
    },
    forWho: [
      "Voluntários de áudio, vídeo, transmissão, projeção e iluminação.",
      "Quem opera NDI, câmeras PTZ, OBS ou mesa digital e quer entender o que está por trás.",
      "Líderes técnicos que precisam organizar a rede da igreja.",
      "Quem nunca estudou redes e quer começar do jeito certo.",
    ],
    notForWho: [
      "Quem quer se formar administrador de redes corporativas.",
      "Quem procura VLAN, QoS e IGMP em profundidade: esses temas ficam para o Curso 2.",
    ],
    faq: [
      {
        question: "Preciso saber alguma coisa de rede antes?",
        answer: "Não. A formação começa do zero, com linguagem simples e exemplos da operação real de um culto.",
      },
      {
        question: "Como são as aulas?",
        answer: "Videoaulas gravadas, divididas em 8 módulos. Você assiste no seu ritmo, pelo computador ou celular, durante 1 ano.",
      },
      {
        question: "Como é a apostila?",
        answer: "Um material com os principais comandos e dicas rápidas, pensado para ser impresso e ficar na mesa da técnica para consulta.",
      },
      {
        question: "Vou aprender VLAN, QoS e IGMP?",
        answer: "Não neste curso. Aqui o foco são os fundamentos. Tópicos avançados como VLAN, QoS e IGMP ficam para o Curso 2.",
      },
      {
        question: "O curso ensina Dante e Bitfocus Companion?",
        answer: "Os dois aparecem como exemplos de uso da rede. O Companion tem uma formação própria, e o Dante terá uma formação dedicada no futuro.",
      },
      {
        question: "E se eu não gostar?",
        answer: "Você tem 7 dias de garantia. Se a formação não for para você, basta pedir o reembolso dentro desse prazo e devolvemos 100% do valor.",
      },
    ],
  },
};

export const hasSalesPage = (courseId: string) => Boolean(SALES_PAGES[courseId]);
