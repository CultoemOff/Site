/**
 * Softwares do Culto em Off.
 * - `features`: somente funcionalidades confirmadas. TODO: revisar a lista do PTZ Control Web.
 * - `learnMoreUrl` / `downloadUrl`: vazios = o botão aparece como "em breve", sem link.
 * - `pageUrl`: quando existe, o card da home mostra só o botão "Conheça e baixe" para essa página.
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
  /** instalador do macOS (quando houver) */
  downloadUrlMac?: string;
  pageUrl?: string;
  visual: "ptz" | "light-remote";
};

export const SOFTWARE: Software[] = [
  {
    id: "ptz-control-web",
    name: "PTZ Control Web",
    area: "Câmeras",
    // textos do briefing do Jonas para a versão 0.9.0 (19/11/2026): não citar SPresenter nem vMix
    tagline: "Controle gratuito de câmeras PTZ pelo navegador.",
    description:
      "Controle até 8 câmeras PTZ (pan, tilt, zoom, foco e presets com nome) dentro do OBS Studio, direto no navegador ou em qualquer software com fonte de navegador. Funciona com câmeras de rede (VISCA, ONVIF), seriais e USB como a OBSBOT Tiny 2, e aceita controle de videogame e Stream Deck.",
    features: [],
    worksWith: ["OBS Studio", "Navegador", "Software com fonte de navegador"],
    platforms: ["Windows 10 e 11 (64 bits)", "macOS 13.5 ou mais novo"],
    learnMoreUrl: "",
    // sempre o instalador da versão mais recente (liberado depois do cadastro no popup da página)
    downloadUrl: "https://github.com/CultoemOff/PTZ-Control-Web-Releases/releases/latest/download/PTZ-Control-Web-Setup.exe",
    // macOS 13.5+ (Apple Silicon e Intel), versão mais recente; enviado pelo Jonas em 23/11/2026
    downloadUrlMac: "https://github.com/CultoemOff/PTZ-Control-Web-Releases/releases/latest/download/PTZ-Control-Web-macOS.pkg",
    pageUrl: "/softwares/ptz-control-web",
    visual: "ptz",
  },
  {
    id: "church-lower-thirds",
    name: "Church Lower Thirds",
    area: "Transmissão",
    tagline: "Lower thirds para igrejas, direto no OBS Studio.",
    description:
      "Nomes, ofertas com QR Code, avisos, agenda e redes sociais na transmissão do culto, com 25 modelos prontos e um painel dentro do OBS para colocar e tirar cada elemento da tela.",
    features: [],
    worksWith: ["OBS Studio", "Stream Deck", "Bitfocus Companion"],
    platforms: ["Windows 10 e 11", "macOS"],
    status: "disponivel",
    learnMoreUrl: "",
    // instaladores da versão 1.0.0 (links enviados pelo Jonas em 26/11/2026)
    downloadUrl: "https://github.com/CultoemOff/Church-Lower-Thirds-Releases/releases/download/v1.0.0/Church-Lower-Thirds-Setup-1.0.0.exe",
    downloadUrlMac: "https://github.com/CultoemOff/Church-Lower-Thirds-Releases/releases/download/v1.0.0/Church-Lower-Thirds-macOS-1.0.0.pkg",
    pageUrl: "/softwares/church-lower-thirds",
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
