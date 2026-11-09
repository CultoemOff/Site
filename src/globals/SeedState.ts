import type { GlobalConfig } from "payload";

/**
 * Controle interno do cadastro inicial (`npm run seed`).
 * Marca quais listas já receberam os itens iniciais, para que novas publicações
 * nunca recriem um produto, equipamento ou post que foi apagado no painel.
 * Não aparece no painel.
 */
export const SeedState: GlobalConfig = {
  slug: "seed-state",
  label: "Cadastro inicial (controle interno)",
  admin: { hidden: true },
  access: { read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
  fields: [
    { name: "offers", type: "checkbox", defaultValue: false },
    { name: "equipment", type: "checkbox", defaultValue: false },
    { name: "posts", type: "checkbox", defaultValue: false },
    // guias do blog de 11/2026 (SEO): entram uma vez; se forem apagados no painel, não voltam
    { name: "postsGuias2026", type: "checkbox", defaultValue: false },
    // segunda leva (câmeras, OBS × vMix, ATEM, plataformas, ministério de mídia, podcast)
    { name: "postsGuias2026b", type: "checkbox", defaultValue: false },
  ],
};
