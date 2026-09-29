/**
 * Configuração do "rig" de iluminação do palco do hero.
 * Coordenadas no mesmo sistema do SVG do palco (1600 × 900).
 */

export type MovingHead = {
  id: string;
  /** ponto de pivô da cabeça (onde ela gira) */
  x: number;
  y: number;
  /** cor do facho (RGB separado por vírgula, para usar em rgba()) */
  rgb: string;
  /** período do movimento lento de pan/tilt (s) */
  period: number;
  /** defasagem do movimento */
  phase: number;
  /** deslocamento do ponto de foco em relação ao centro */
  spread: number;
  /** amortecimento (quanto maior, mais rápido segue o foco) */
  follow: number;
  /** tamanho relativo do aparelho */
  size: number;
  /** oculto em telas pequenas */
  desktopOnly?: boolean;
  /** "spot" = facho central largo e suave (luz principal focada no centro) */
  kind?: "beam" | "spot";
};

const BLUE = "59,140,255";
const ROYAL = "46,96,255";
const ICE = "120,176,255";
const VIOLET = "106,92,255";

export const MOVING_HEADS: MovingHead[] = [
  // luz principal: facho largo e suave, focado no centro do palco
  { id: "spot", x: 800, y: 100, rgb: "84,118,255", period: 21, phase: 0, spread: 0, follow: 0.05, size: 1.25, kind: "spot" },
  { id: "mh1", x: 230, y: 104, rgb: ROYAL, period: 15, phase: 0.2, spread: -70, follow: 0.035, size: 1, desktopOnly: true },
  { id: "mh2", x: 395, y: 104, rgb: BLUE, period: 12, phase: 1.3, spread: -46, follow: 0.05, size: 1, desktopOnly: true },
  { id: "mh3", x: 560, y: 104, rgb: VIOLET, period: 18, phase: 2.1, spread: -26, follow: 0.042, size: 1 },
  { id: "mh4", x: 720, y: 104, rgb: ICE, period: 9, phase: 0.7, spread: -8, follow: 0.06, size: 1 },
  { id: "mh5", x: 880, y: 104, rgb: ICE, period: 9, phase: 2.6, spread: 8, follow: 0.06, size: 1 },
  { id: "mh6", x: 1040, y: 104, rgb: VIOLET, period: 18, phase: 0.4, spread: 26, follow: 0.042, size: 1 },
  { id: "mh7", x: 1205, y: 104, rgb: BLUE, period: 12, phase: 1.9, spread: 46, follow: 0.05, size: 1, desktopOnly: true },
  { id: "mh8", x: 1370, y: 104, rgb: ROYAL, period: 15, phase: 3.0, spread: 70, follow: 0.035, size: 1, desktopOnly: true },
  // cabeças menores nas laterais do telão
  { id: "mh9", x: 438, y: 268, rgb: BLUE, period: 18, phase: 1.1, spread: -30, follow: 0.03, size: 0.72, desktopOnly: true },
  { id: "mh10", x: 1162, y: 268, rgb: BLUE, period: 18, phase: 2.4, spread: 30, follow: 0.03, size: 0.72, desktopOnly: true },
];

/** Ponto padrão de foco: centro do palco, na altura do púlpito. */
export const STAGE_FOCUS = { x: 800, y: 690 };

/** Limites do ponto de foco quando segue o mouse. */
export const FOCUS_BOUNDS = { minX: 420, maxX: 1180, minY: 430, maxY: 770 };

/** Comprimento base do elemento do facho (unidades do palco). */
export const BEAM_LENGTH = 1120;
/** Distância do pivô até a lente. */
export const LENS_OFFSET = 15;

/** Converte unidades do palco (1600 de largura) em cqw. */
export const u = (n: number) => `${(n / 16).toFixed(3)}cqw`;

export function aimAngle(fromX: number, fromY: number, toX: number, toY: number) {
  // ângulo (rad) para girar um elemento que aponta para baixo até o alvo
  return -Math.atan2(toX - fromX, toY - fromY);
}
