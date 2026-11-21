import type { Block } from "payload";

/** Perguntas frequentes dentro de um post (cada pergunta abre e fecha). */
export const FaqBlock: Block = {
  slug: "faq",
  interfaceName: "FaqBlock",
  labels: { singular: "Perguntas frequentes", plural: "Perguntas frequentes" },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Perguntas",
      minRows: 1,
      fields: [
        { name: "question", type: "text", label: "Pergunta", required: true },
        { name: "answer", type: "textarea", label: "Resposta", required: true, admin: { description: "Aceita **negrito**, `código` e [links](url)." } },
      ],
    },
  ],
};
