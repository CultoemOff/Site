import type { Block } from "payload";

/** Bloco para incorporar um vídeo do YouTube dentro de um post. */
export const YouTubeBlock: Block = {
  slug: "youtube",
  interfaceName: "YouTubeBlock",
  labels: { singular: "Vídeo do YouTube", plural: "Vídeos do YouTube" },
  fields: [
    {
      name: "url",
      type: "text",
      label: "Link do vídeo",
      required: true,
      admin: { description: "Ex.: https://www.youtube.com/watch?v=… ou https://youtu.be/…" },
    },
    { name: "caption", type: "text", label: "Legenda (opcional)" },
  ],
};
