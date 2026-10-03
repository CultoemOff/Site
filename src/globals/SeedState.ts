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
  ],
};
