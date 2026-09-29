import type { SeedPost } from "../lexical";

const IMG = "https://cultoemoff.com.br/wp-content/uploads/2026/05/";

/** Artigo migrado de cultoemoff.com.br (06/05/2026). */
export const analiseNeoidPtzMini: SeedPost = {
  slug: "analise-neoid-ptz-controller-mini-poe",
  title: "Análise: NEOiD PTZ Controller MINI PoE+",
  excerpt:
    "Um controlador compacto, profissional e extremamente funcional para igrejas e produções ao vivo: design, uso na prática, protocolos, PoE+, preço, prós e contras.",
  publishedAt: "2026-05-06T15:00:00.000Z",
  tags: ["Análise de Equipamentos"],
  cover: {
    localPath: "/blog/analise-neoid-ptz-controller-mini.png",
    sourceUrl: `${IMG}image.png`,
    alt: "NEOiD PTZ Controller MINI PoE+",
  },
  blocks: [
    { h2: "Um controlador compacto, profissional e extremamente funcional para igrejas e produções ao vivo" },

    { h3: "Design e Construção" },
    { img: { sourceUrl: `${IMG}image-1024x782.png`, alt: "NEOiD PTZ Controller MINI PoE+: joystick, botões e knobs" } },
    {
      p: "O **NEOiD PTZ Controller MINI PoE+** aposta em um formato compacto, mas sem abrir mão da robustez. Com dimensões de 244 x 164 x 48 mm e peso de 1,1 kg, ele transmite uma sensação profissional desde o primeiro contato.",
    },
    {
      p: "O joystick de 2 eixos é um dos grandes destaques: firme, preciso e com excelente resposta. Diferente de controladores mais baratos, aqui você realmente sente controle fino nos movimentos da câmera. O botão de zoom tipo \"gangorra\" também contribui para ajustes suaves, algo essencial em transmissões ao vivo.",
    },
    {
      p: "Os 17 botões de silicone retroiluminados facilitam o uso em ambientes escuros — como igrejas e estúdios — e os 4 knobs rotatórios com pequenas telas trazem um nível de controle avançado para parâmetros de imagem.",
    },

    { h3: "Usabilidade e Experiência na Prática" },
    { img: { sourceUrl: `${IMG}image-3-1024x576.png`, alt: "Controlador NEOiD em uso na operação de câmeras PTZ" } },
    {
      p: "O controle entrega exatamente o que promete: **precisão e fluidez**. O ajuste de velocidade PTZ com 7 níveis permite desde movimentos extremamente suaves até transições rápidas — ideal para diferentes momentos da transmissão.",
    },
    { p: "Comparado ao uso via software (como controle por plugin no OBS), o ganho é enorme:" },
    { ul: ["Movimentos mais naturais", "Muito mais controle de enquadramento", "Redução de erros durante a live"] },
    {
      p: "Mesmo em cenários com leve delay de câmera (comum em modelos mais antigos), o operador consegue se adaptar facilmente com o joystick.",
    },
    { p: "Outro ponto forte é o uso com presets. Você pode:" },
    {
      ul: [
        "Salvar posições diretamente no controlador",
        "Ou utilizar presets via software (como OBS) que são armazenados na própria câmera",
      ],
    },
    { p: "Isso agiliza muito a operação durante cultos ou eventos." },

    { h3: "Conectividade e Compatibilidade" },
    { img: { sourceUrl: `${IMG}image-4-1024x629.png`, alt: "Conexões do NEOiD PTZ Controller MINI PoE+" } },
    { p: "O NEOiD PTZ MINI é extremamente versátil quando o assunto é integração." },
    { p: "**Protocolos suportados:**" },
    { ul: ["VISCA", "VISCA over IP", "UDP", "PELCO P/D", "NDI"] },
    { p: "**Interfaces disponíveis:**" },
    { ul: ["RS232", "RS422/RS485", "LAN (IP)", "Micro USB (para firmware)"] },
    { p: "Na prática, isso significa que você pode usar:" },
    {
      ul: [
        "Câmeras mais antigas via serial",
        // TODO: no site antigo, "LEIA SOBRE NDI" era um link. Adicionar o destino quando houver um artigo sobre NDI.
        "Câmeras modernas via rede (IP, NDI), Isso significa que você pode utilizar uma câmera, com suporte a NDI, ligada na rede através de um switch e, deste switch, mandar o sinal de vídeo para o PC e o sinal de controle para o NEOID Controller MINI. Ou seja: Sem cabos HDMI, DVI, Serial. Apenas um cabo de rede. Quer saber mais sobre isso? **LEIA SOBRE NDI**",
      ],
    },
    { p: "Ele suporta até **10 câmeras simultaneamente**, com troca rápida via botões dedicados." },

    { h3: "Alimentação (Destaque para PoE+)" },
    { p: "Um dos recursos mais úteis é o suporte a **PoE+**." },
    {
      p: "Isso permite que o controlador seja alimentado diretamente pelo cabo de rede, eliminando a necessidade de fonte externa — desde que você tenha um switch compatível. Complementando o que disse acima: Você pode ter um cabo de rede que manda ENERGIA, VÍDEO e CONTROLE!",
    },
    { p: "Também é possível usar alimentação via 12V DC, caso necessário. Fonte já inclusa." },

    { h3: "Recursos e Controles Avançados" },
    { img: { sourceUrl: `${IMG}image-2-1024x537.png`, alt: "Knobs e menu do NEOiD PTZ Controller MINI PoE+" } },
    { p: "O controlador vai além do básico e entrega recursos que realmente fazem diferença:" },
    {
      ul: [
        "Controle de exposição e ganho via knobs",
        "Ajuste de foco (auto/manual)",
        "Acesso ao menu completo da câmera",
        "Configuração direta pelo próprio controlador",
        "Indicador visual de velocidade PTZ",
        "Gerenciamento de múltiplas câmeras com IP individual",
      ],
    },
    {
      p: "A interface é simples e direta, com menus acessíveis pelo botão \"Menu\", incluindo configurações de rede, sistema e comunicação.",
    },

    { h3: "Uso em Igrejas e Produções ao Vivo" },
    {
      p: "Para igrejas, esse controlador é praticamente um upgrade obrigatório para quem trabalha com mais de uma câmera.",
    },
    {
      ul: [
        "Operação mais profissional da transmissão",
        "Movimentos suaves durante louvor e pregação",
        "Facilidade para alternar enquadramentos",
        "Integração perfeita com softwares como OBS",
      ],
    },
    {
      p: "Uma vantagem importante é o uso em conjunto com o **modo estúdio do OBS**, permitindo preparar o enquadramento antes de colocá-lo no ar.",
    },

    { h3: "Preço" },
    { p: "O NEOiD PTZ Controller MINI PoE+ é encontrado na faixa de **R$ 2.690** (podendo variar)." },
    {
      p: "Não é um equipamento barato, mas está alinhado com a proposta profissional. Para quem depende de qualidade na transmissão, o investimento faz sentido.",
    },
    { p: "**COMPRE AQUI:** [https://meli.la/2XnNvWt](https://meli.la/2XnNvWt)" },

    { h3: "Pontos Positivos" },
    {
      ul: [
        "Controle extremamente preciso e suave",
        "Suporte a múltiplos protocolos (alta compatibilidade)",
        "Alimentação via PoE+ (menos cabos)",
        "Interface simples e funcional",
        "Excelente para uso com múltiplas câmeras",
        "Construção robusta",
      ],
    },

    { h3: "Pontos Negativos" },
    {
      ul: [
        "Preço elevado para iniciantes",
        "Interface apenas em inglês/chinês",
        "Aproveitamento total depende de câmeras compatíveis",
      ],
    },

    { h3: "Conclusão" },
    {
      p: "O **NEOiD PTZ Controller MINI PoE+** é um controlador compacto que entrega performance de equipamento profissional.",
    },
    {
      p: "Ele não é apenas um acessório — é uma ferramenta que **muda completamente a forma de operar câmeras PTZ**, especialmente em ambientes como igrejas, eventos e estúdios.",
    },
    {
      p: "Se você hoje controla câmeras via mouse ou soluções improvisadas, a diferença ao usar esse controlador é imediata.",
    },
    { p: "**Vale a pena?**" },
    { p: "Sim — especialmente se você busca:" },
    { ul: ["Mais precisão", "Mais agilidade", "Um padrão mais profissional na sua transmissão"] },
    { p: "É o tipo de equipamento que, depois de usar, você dificilmente vai querer voltar atrás." },
  ],
};
