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
  /** três motivos pelos quais esta formação é diferente de um curso de redes comum */
  pillars: { title: string; text: string }[];
  /** situações em que o aluno se reconhece */
  pains: string[];
  /** antes × depois */
  compare: { before: string; after: string }[];
  /** argumento de valor: quanto custa não saber */
  value: { title: string; text: string; points: string[] };
  /** objeções comuns, respondidas */
  objections: { objection: string; answer: string }[];
  /** frase-ponte depois das dores */
  bridge: string;
  outcomesTitle: string;
  /** o que muda depois da formação */
  outcomes: string[];
  /** título do chamado final */
  finalTitle: string;
  /** frase curta acima do contador final */
  finalNote?: string;
  /** versículo em destaque (use poucos: a página não é um devocional) */
  verse?: { text: string; ref: string; note: string };
  /** promoção com prazo real (o preço "de/por" vem da formação: priceFrom e price) */
  promo?: { label: string; endsAt: string };
  /** detalhe de cada módulo (mesma ordem de course.topics); tag opcional, ex.: "Aula prática" */
  modules: { title: string; items: string[]; tag?: string }[];
  /** módulo final em destaque (aula prática) */
  capstone?: {
    badge: string;
    title: string;
    text: string;
    points: string[];
    chain: { name: string; what: string }[];
  };
  /** aviso de pré-requisito (ex.: rede antes do Companion) */
  prereq?: { kicker: string; title: string; text: string; steps: string[] };
  /** seção ilustrada "por dentro das aulas" */
  inside?: { title: string; topology: string; dhcp: { title: string; text: string }; terminal: { title: string; text: string } };
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
    // Promoção de lançamento + Black November. Quando o prazo passa, a página volta a mostrar o preço cheio.
    promo: { label: "Lançamento + Black November", endsAt: "2026-11-30T23:59:59-03:00" },
    pillars: [
      {
        title: "Feita para a técnica da igreja",
        text: "Nada de exemplos de escritório. Tudo é explicado com câmera, mesa, switch, projeção e o computador da live.",
      },
      {
        title: "Do zero, sem jargão",
        text: "Cada conceito começa do começo, em português claro. Você não precisa ser de TI para acompanhar.",
      },
      {
        title: "Você não aprende sozinho",
        text: "Área de membros para tirar dúvidas e uma comunidade de alunos que vivem os mesmos desafios na técnica.",
      },
      {
        title: "Aprendeu hoje, usa no próximo culto",
        text: "Cada módulo termina em algo prático: um comando, um teste ou um ajuste que você aplica na sua igreja.",
      },
    ],
    compare: [
      { before: "Desliga e liga tudo de novo, e torce.", after: "Segue um roteiro de diagnóstico e acha a causa." },
      { before: "Depende de “alguém de TI” para qualquer problema.", after: "A própria equipe resolve o que aparece no culto." },
      { before: "Ninguém sabe o IP de nada.", after: "A rede da técnica fica mapeada e documentada." },
      { before: "Live no Wi-Fi, disputando com a igreja inteira.", after: "Cada equipamento no lugar certo: cabo, PoE ou Wi-Fi." },
      { before: "Compra equipamento sem saber se vai funcionar.", after: "Entende o que cada switch, cabo e câmera faz antes de comprar." },
    ],
    value: {
      title: "Quanto custa não entender de rede?",
      text: "Um culto com a transmissão fora do ar, uma câmera parada no meio da ministração ou uma visita técnica de emergência custam muito mais do que esta formação.",
      points: [
        "Custa menos do que um lanche para a equipe depois do culto.",
        "Você paga uma vez e a equipe toda aprende a pensar a rede.",
        "Acesso vitalício: o conteúdo fica com você para rever quando precisar.",
        "Área de membros para tirar dúvidas e comunidade de alunos.",
      ],
    },
    objections: [
      {
        objection: "“Eu não sou de TI.”",
        answer: "A formação foi pensada exatamente para você: voluntário que opera a técnica e nunca estudou redes.",
      },
      {
        objection: "“Minha igreja é pequena.”",
        answer: "Rede pequena também dá problema. Com um roteador, um switch e um computador você já aplica tudo.",
      },
      {
        objection: "“Não tenho tempo.”",
        answer: "São videoaulas gravadas e o acesso é vitalício. Você assiste no seu ritmo, quando puder.",
      },
      {
        objection: "“E se não for para mim?”",
        answer: "Você tem 7 dias de garantia. Se não gostar, pede o reembolso e recebe 100% do valor de volta.",
      },
    ],
    pains: [
      "A fonte NDI não aparece no OBS e ninguém sabe por quê.",
      "A câmera PTZ “sumiu” da rede depois que alguém mexeu no roteador.",
      "A transmissão engasga justamente na hora da ministração.",
      "Ninguém da equipe sabe qual é o IP de cada equipamento.",
      "O celular usado como câmera trava ou perde a conexão.",
      "A solução de sempre é desligar e ligar tudo de novo, e torcer.",
      "Não sei o que é NDI, Bitfocus Companion ou Art-Net, nem como essas tecnologias podem ajudar.",
    ],
    bridge: "O problema quase nunca é o equipamento. É a rede que ninguém explicou para a equipe.",
    outcomesTitle: "Você passa a entender a rede, em vez de depender da sorte.",
    finalTitle: "O próximo culto pode começar sem susto na rede.",
    finalNote: "Fazer o melhor para Deus também passa pela técnica.",
    verse: {
      text: "Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.",
      ref: "Colossenses 3:23",
      note: "Servir com excelência é também entender o que você opera.",
    },
    outcomes: [
      "Saber o que é IP, máscara, gateway, DHCP e DNS, e por que isso importa no culto.",
      "Descobrir e testar qualquer equipamento da rede com poucos comandos.",
      "Montar a rede da técnica com cabo, switch e PoE do jeito certo.",
      "Fazer NDI, câmeras PTZ e o celular como câmera funcionarem de forma estável.",
      "Seguir um roteiro de diagnóstico quando algo falhar, em vez de adivinhar.",
      "Conversar com o pessoal de TI ou com o fornecedor falando a mesma língua.",
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
        tag: "Aula prática",
        items: ["Descobrir o próprio IP", "Testar se um equipamento responde", "Ver quem está na rede", "Guia rápido para imprimir"],
      },
      {
        title: "Cabos, switches e PoE",
        tag: "Aula prática",
        items: ["Cabo de rede e conectores", "Switch gerenciável e não gerenciável", "PoE: energia pelo cabo", "Organizando a rede da técnica"],
      },
      {
        title: "Wi-Fi na igreja",
        tag: "Aula prática",
        items: ["Quando usar Wi-Fi e quando usar cabo", "Rede da técnica x rede dos membros", "Cuidados com a transmissão"],
      },
      {
        title: "NDI na prática",
        tag: "Aula prática",
        items: ["O que é NDI", "Por que a fonte não aparece", "NDI e OBS", "Boas práticas de rede para vídeo"],
      },
      {
        title: "Câmeras PTZ e o celular como câmera (Iriun)",
        tag: "Aula prática",
        items: ["Colocando a câmera PTZ na rede", "Controle e descoberta", "Usando o celular como câmera com o Iriun", "Estabilidade na hora do culto"],
      },
      {
        title: "Troubleshooting: encontrando o problema antes do culto",
        tag: "Aula prática",
        items: ["Roteiro de diagnóstico passo a passo", "Problemas mais comuns da técnica", "Checklist antes do culto"],
      },
      {
        title: "Tudo funcionando junto: OBS, NDI, PTZ, rede e Companion",
        tag: "Projeto prático",
        items: [
          "A rede montada e conferida",
          "Câmera PTZ respondendo na rede",
          "Vídeo chegando por NDI no OBS",
          "Companion disparando as ações com um botão",
        ],
      },
    ],
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
    prereq: {
      kicker: "Antes do Companion",
      title: "Não adianta querer aprender Bitfocus Companion sem saber os fundamentos de rede.",
      text: "O Companion conversa com o OBS, as câmeras PTZ, a mesa e a iluminação pela rede. Cada conexão pede um endereço IP e uma porta. Sem a base, cada botão vira tentativa e erro. Com ela, você entende por que a conexão não fecha e resolve.",
      steps: ["Primeiro: fundamentos de rede", "Depois: Companion e automação", "Resultado: um botão comanda tudo"],
    },
    capstone: {
      badge: "Módulo 9 · Projeto prático",
      title: "No final, você vê tudo funcionando junto.",
      text: "O último módulo é um projeto prático: a rede, a câmera PTZ, o NDI, o OBS e o Companion montados e operando ao mesmo tempo, como em um culto de verdade.",
      points: [
        "Você acompanha a montagem do começo ao fim, passo a passo.",
        "Cada conceito dos módulos anteriores aparece em uso real.",
        "É o roteiro para repetir na sua igreja.",
      ],
      chain: [
        { name: "Rede", what: "IPs, switch e cabos conferidos" },
        { name: "Câmera PTZ", what: "encontrada e controlada pela rede" },
        { name: "NDI", what: "vídeo trafegando entre os equipamentos" },
        { name: "OBS", what: "recebendo as fontes e transmitindo" },
        { name: "Companion", what: "um botão comandando tudo" },
      ],
    },
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
      "Quem quer servir com excelência e ver tudo feito com decência e ordem (1 Coríntios 14:40).",
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
        answer: "Videoaulas gravadas, divididas em 9 módulos. Seis deles têm aula prática e o último é um projeto prático com tudo funcionando junto. Você assiste no seu ritmo, pelo computador ou celular, com acesso vitalício.",
      },
      {
        question: "E se eu tiver dúvidas durante as aulas?",
        answer: "A formação tem uma área de membros com espaço para tirar dúvidas e uma comunidade de alunos, para você trocar experiências com quem serve na técnica de outras igrejas.",
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
        answer: "O Companion aparece no projeto prático do módulo 9, em uso junto com OBS, NDI e PTZ, e tem uma formação própria para quem quiser se aprofundar. O Dante é citado como exemplo e terá uma formação dedicada no futuro.",
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
