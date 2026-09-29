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
  /** softwares/sistemas com os quais funciona */
  worksWith?: string[];
  /** sistemas operacionais */
  platforms?: string[];
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
      "Facilita a operação de câmeras PTZ em igrejas e transmissões, direto do navegador. Compatível com OBS, vMix, SPresenter ou qualquer outro software de transmissão de cultos.",
    features: [
      "Pan, tilt, zoom e foco",
      "Presets",
      "Múltiplas câmeras",
      "Controle por gamepad",
      "Integração com o Companion",
      "Diferentes protocolos de câmera",
    ],
    worksWith: ["OBS", "vMix", "SPresenter", "Qualquer software de transmissão"],
    learnMoreUrl: "",
    downloadUrl: "",
    visual: "ptz",
  },
  {
    id: "remote-iluminacao",
    name: "Remote de Iluminação",
    area: "Iluminação",
    tagline: "Controle a luz sem precisar aprender a usar a MA2.",
    description:
      "Um controle remoto de iluminação e automação para igrejas: os voluntários operam as cenas de luz de forma simples, sem precisar dominar a grandMA2.",
    features: [],
    worksWith: ["grandMA2", "Bitfocus Companion"],
    platforms: ["Windows", "Android", "iOS"],
    status: "em-desenvolvimento",
    learnMoreUrl: "",
    downloadUrl: "",
    visual: "light-remote",
  },
];
