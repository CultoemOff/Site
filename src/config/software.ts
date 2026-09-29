/**
 * Softwares do Culto em Off.
 * - `features`: somente funcionalidades confirmadas. TODO: revisar a lista do PTZ Control Web.
 * - `learnMoreUrl` / `downloadUrl`: vazios = o botão aparece como "em breve", sem link.
 */

export type SoftwareStatus = "disponivel" | "em-desenvolvimento" | "beta";

export const SOFTWARE_STATUS_LABEL: Record<SoftwareStatus, string> = {
  disponivel: "Disponível",
  "em-desenvolvimento": "Em desenvolvimento",
  beta: "Beta",
};

export type Software = {
  id: string;
  name: string;
  area: string;
  tagline: string;
  description: string;
  features: string[];
  status?: SoftwareStatus;
  learnMoreUrl: string;
  downloadUrl: string;
  visual: "ptz" | "light-remote";
};

export const SOFTWARE: Software[] = [
  {
    id: "ptz-control-web",
    name: "PTZ Control Web",
    area: "Câmeras",
    tagline: "Controle de câmeras PTZ pensado para o culto.",
    description:
      "Um projeto para facilitar a operação de câmeras PTZ em igrejas e transmissões, direto do navegador.",
    features: [
      "Pan, tilt, zoom e foco",
      "Presets",
      "Múltiplas câmeras",
      "Controle por gamepad",
      "Integração com o Companion",
      "Diferentes protocolos de câmera",
    ],
    learnMoreUrl: "",
    downloadUrl: "",
    visual: "ptz",
  },
  {
    id: "remote-iluminacao",
    name: "Remote de Iluminação",
    area: "Iluminação",
    tagline: "Iluminação e automação ao alcance de quem opera.",
    description:
      "Um software de controle remoto para facilitar a operação de iluminação e automação em igrejas.",
    features: [],
    status: "em-desenvolvimento",
    learnMoreUrl: "",
    downloadUrl: "",
    visual: "light-remote",
  },
];
