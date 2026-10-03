import type { CollectionConfig } from "payload";

/**
 * Cadastros feitos para liberar downloads (ex.: PTZ Control Web).
 * Só usuários logados no admin podem ver. O site cria os registros pelo servidor.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Cadastro", plural: "Cadastros" },
  admin: {
    useAsTitle: "email",
    group: "Site",
    defaultColumns: ["name", "email", "phoneFull", "source", "createdAt"],
    description: "Pessoas que se cadastraram para baixar softwares ou entrar na lista de espera das formações. Todas aceitaram receber ofertas e novidades.",
  },
  defaultSort: "-createdAt",
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", label: "Nome", required: true },
    { name: "email", type: "email", label: "E-mail", required: true, index: true },
    {
      type: "row",
      fields: [
        { name: "country", type: "text", label: "País (ISO)" },
        { name: "dial", type: "text", label: "DDI" },
        { name: "phone", type: "text", label: "Telefone" },
      ],
    },
    { name: "phoneFull", type: "text", label: "Telefone completo", admin: { description: "Formato internacional, ex.: +5511912345678" } },
    { name: "source", type: "text", label: "Origem", admin: { description: "Ex.: ptz-control-web" } },
    {
      name: "consent",
      type: "group",
      label: "Consentimento",
      fields: [
        { name: "accepted", type: "checkbox", label: "Aceitou" },
        { name: "text", type: "textarea", label: "Texto aceito" },
        { name: "at", type: "date", label: "Data do aceite", admin: { date: { pickerAppearance: "dayAndTime" } } },
      ],
    },
  ],
  timestamps: true,
};
