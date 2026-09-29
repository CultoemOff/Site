/**
 * Conteúdo do diagrama "Ecossistema tecnológico".
 * Coordenadas no viewBox 600 × 600 (centro em 300, 300).
 */

export type EcoIcon = "rede" | "audio" | "video" | "cameras" | "streaming" | "projecao" | "iluminacao";

export type EcoNode = {
  id: EcoIcon;
  label: string;
  /** protocolo/tecnologia que liga a área à rede */
  protocol: string;
  title: string;
  text: string;
  /** cadeia exibida no painel, ex.: IP → REDE → DANTE → ÁUDIO */
  chain: string[];
  x: number;
  y: number;
};

const R = 212;
const at = (deg: number) => ({
  x: Math.round(300 + R * Math.cos((deg * Math.PI) / 180)),
  y: Math.round(300 + R * Math.sin((deg * Math.PI) / 180)),
});

export const ECO_CENTER: EcoNode = {
  id: "rede",
  label: "Rede + Automação",
  protocol: "Companion",
  title: "A rede é o ponto de encontro",
  text: "Áudio, vídeo, luz, câmeras e projeção cada vez mais conversam pela mesma infraestrutura. Com o Bitfocus Companion, um único botão pode disparar ações em vários desses sistemas ao mesmo tempo.",
  chain: ["BOTÃO", "COMPANION", "OBS + PTZ + LUZ"],
  x: 300,
  y: 300,
};

export const ECO_NODES: EcoNode[] = [
  {
    id: "audio",
    label: "Áudio",
    protocol: "Dante",
    title: "Áudio profissional também trafega pela rede",
    text: "Com Dante, muitos canais de áudio saem da mesa e chegam a outros equipamentos por um cabo de rede. Quando algo não comunica, quase sempre a resposta está na configuração da rede.",
    chain: ["IP", "REDE", "DANTE", "ÁUDIO"],
    ...at(-90),
  },
  {
    id: "video",
    label: "Vídeo",
    protocol: "NDI",
    title: "Vídeo sobre IP",
    text: "Com NDI, o vídeo vira dados na rede: câmeras, computadores e o OBS encontram as fontes sem cabos de vídeo dedicados, desde que a rede esteja bem configurada.",
    chain: ["IP", "REDE", "NDI", "VÍDEO"],
    ...at(-30),
  },
  {
    id: "cameras",
    label: "Câmeras",
    protocol: "PTZ via IP",
    title: "Câmeras controladas pela rede",
    text: "Câmeras PTZ podem receber comandos de pan, tilt, zoom e presets pela rede, vindos de um software, de um controle ou do Companion.",
    chain: ["IP", "REDE", "COMANDOS PTZ", "CÂMERA"],
    ...at(30),
  },
  {
    id: "streaming",
    label: "Streaming",
    protocol: "OBS",
    title: "A transmissão reúne tudo",
    text: "O OBS junta o áudio da mix da live, as câmeras e os gráficos que chegam pela rede e envia o culto para a internet.",
    chain: ["ÁUDIO + VÍDEO", "OBS", "INTERNET"],
    ...at(90),
  },
  {
    id: "projecao",
    label: "Projeção",
    protocol: "NDI",
    title: "Projeção integrada à transmissão",
    text: "Softwares de apresentação podem enviar suas saídas pela rede, por exemplo via NDI, para o telão e para a live ao mesmo tempo.",
    chain: ["PROJEÇÃO", "NDI", "TELÃO + LIVE"],
    ...at(150),
  },
  {
    id: "iluminacao",
    label: "Iluminação",
    protocol: "Art-Net / sACN",
    title: "O DMX também viaja pela rede",
    text: "Com Art-Net ou sACN, vários universos DMX trafegam por um cabo de rede até os aparelhos ou até um node que converte para DMX.",
    chain: ["CONSOLE", "ART-NET / sACN", "DMX", "REFLETORES"],
    ...at(210),
  },
];
