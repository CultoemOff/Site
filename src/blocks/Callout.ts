import type { Block } from "payload";

/** Caixa de destaque dentro de um post: dica, atenção ou informação. */
export const CalloutBlock: Block = {
  slug: "callout",
  interfaceName: "CalloutBlock",
  labels: { singular: "Caixa de destaque", plural: "Caixas de destaque" },
  fields: [
    {
      name: "kind",
      type: "select",
      label: "Tipo",
      defaultValue: "dica",
      options: [
        { label: "Dica", value: "dica" },
        { label: "Atenção", value: "atencao" },
        { label: "Informação", value: "info" },
      ],
    },
    { name: "title", type: "text", label: "Título (opcional)" },
    { name: "text", type: "textarea", label: "Texto", required: true, admin: { description: "Aceita **negrito**, `código` e [links](url)." } },
    {
      type: "row",
      fields: [
        { name: "buttonLabel", type: "text", label: "Botão: texto (opcional)" },
        { name: "buttonUrl", type: "text", label: "Botão: link (opcional)" },
      ],
    },
  ],
};
