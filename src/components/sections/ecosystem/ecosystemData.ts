/**
 * Mapa do ecossistema tecnológico (usado na seção Manifesto).
 * Coordenadas no viewBox 600 × 600 (centro em 300, 300).
 */

export type EcoIcon = "rede" | "audio" | "video" | "cameras" | "streaming" | "projecao" | "iluminacao";

export type EcoNode = {
  id: EcoIcon;
  label: string;
  /** tecnologia que liga a área à rede */
  protocol: string;
  x: number;
  y: number;
};

const R = 212;
const at = (deg: number) => ({
  x: Math.round(300 + R * Math.cos((deg * Math.PI) / 180)),
  y: Math.round(300 + R * Math.sin((deg * Math.PI) / 180)),
});

export const ECO_NODES: EcoNode[] = [
  { id: "audio", label: "Áudio", protocol: "Dante", ...at(-90) },
  { id: "video", label: "Vídeo", protocol: "NDI", ...at(-30) },
  { id: "cameras", label: "Câmeras", protocol: "PTZ via IP", ...at(30) },
  { id: "streaming", label: "Streaming", protocol: "OBS", ...at(90) },
  { id: "projecao", label: "Projeção", protocol: "NDI", ...at(150) },
  { id: "iluminacao", label: "Iluminação", protocol: "Art-Net / sACN", ...at(210) },
];
