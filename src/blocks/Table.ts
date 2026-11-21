import type { Block } from "payload";

/**
 * Tabela dentro de um post. Uma linha do texto = uma linha da tabela; colunas separadas por "|".
 * A primeira linha é o cabeçalho. Aceita **negrito**, `código` e [links](url) nas células.
 */
export const TableBlock: Block = {
  slug: "table",
  interfaceName: "TableBlock",
  labels: { singular: "Tabela", plural: "Tabelas" },
  fields: [
    {
      name: "rows",
      type: "textarea",
      label: "Linhas da tabela",
      required: true,
      admin: {
        rows: 8,
        description: "Uma linha por linha da tabela, colunas separadas por | . A primeira linha é o cabeçalho. Ex.: Item | Requisito",
      },
    },
    { name: "caption", type: "text", label: "Legenda (opcional)" },
  ],
};
