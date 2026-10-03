import type { GlobalConfig } from "payload";

/**
 * Última lista de vídeos que o YouTube entregou com sucesso.
 * O site grava aqui sozinho e usa esta cópia quando o YouTube não responde,
 * para a seção "Conteúdo gratuito" nunca ficar vazia. Não aparece no painel.
 */
export const YouTubeCache: GlobalConfig = {
  slug: "youtube-cache",
  label: "Vídeos do YouTube (cópia de segurança)",
  admin: { hidden: true },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    { name: "videos", type: "json" },
    { name: "fetchedAt", type: "date" },
  ],
};
