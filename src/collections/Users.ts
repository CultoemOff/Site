import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuário", plural: "Usuários do painel" },
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Sistema",
  },
  fields: [{ name: "name", type: "text", label: "Nome" }],
};
