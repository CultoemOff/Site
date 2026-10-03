import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Imagem ou vídeo", plural: "Imagens e vídeos" },
  admin: { group: "Conteúdo" },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "video/*"],
    imageSizes: [
      { name: "card", width: 800 },
      { name: "wide", width: 1600 },
    ],
    adminThumbnail: "card",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      required: true,
      admin: { description: "Descreva a imagem para leitores de tela e para o Google." },
    },
    { name: "caption", type: "text", label: "Legenda (opcional)" },
  ],
};
