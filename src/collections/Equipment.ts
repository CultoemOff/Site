import type { CollectionConfig } from "payload";
import { revalidate, slugify } from "../cms/hooks";

/** Equipamentos recomendados (página /equipamentos). A seção da home usa a coleção Ofertas. */
export const Equipment: CollectionConfig = {
  slug: "equipment",
  labels: { singular: "Equipamento", plural: "Equipamentos" },
  admin: {
    useAsTitle: "name",
    group: "Conteúdo",
    defaultColumns: ["name", "category", "featured", "order"],
  },
  defaultSort: "order",
  access: { read: () => true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "Nome do equipamento", required: true },
        {
          name: "order",
          type: "number",
          label: "Ordem",
          defaultValue: 10,
          admin: { description: "Menor aparece primeiro." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          label: "Categoria",
          required: true,
          defaultValue: "audio",
          options: [
            { label: "Áudio", value: "audio" },
            { label: "Microfones", value: "microfones" },
            { label: "Rede", value: "rede" },
            { label: "Energia", value: "energia" },
            { label: "Vídeo", value: "video" },
            { label: "Iluminação", value: "iluminacao" },
            { label: "Acessórios", value: "acessorios" },
          ],
        },
        {
          name: "icon",
          type: "select",
          label: "Ilustração (quando não há foto)",
          defaultValue: "rack",
          options: [
            { label: "Microfone", value: "mic" },
            { label: "Rack / mesa", value: "rack" },
            { label: "Switch de rede", value: "switch" },
            { label: "Filtro de linha", value: "power" },
            { label: "Câmera", value: "camera" },
            { label: "Refletor", value: "light" },
            { label: "Cabo / conector", value: "cable" },
          ],
        },
      ],
    },
    { name: "note", type: "text", label: "Frase curta (opcional)", admin: { description: "Ex.: 16 portas Gigabit com PoE." } },
    {
      type: "row",
      fields: [
        { name: "href", type: "text", label: "Link do produto", required: true },
        {
          name: "store",
          type: "text",
          label: "Nome da loja (opcional)",
          admin: { description: "Se vazio, é deduzido do link (ex.: Mercado Livre)." },
        },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Foto do produto (opcional)",
      admin: { description: "Se enviada, substitui a ilustração. Fundo branco fica melhor." },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destaque (não é mais usado na home)",
      defaultValue: true,
      admin: { position: "sidebar", description: "A home agora mostra as Ofertas marcadas com “Mostrar na home”. Esta lista aparece só na página /equipamentos." },
    },
    {
      name: "slug",
      type: "text",
      label: "Identificador",
      unique: true,
      index: true,
      admin: { position: "sidebar" },
      hooks: {
        beforeValidate: [({ value, data }) => (value ? slugify(String(value)) : data?.name ? slugify(String(data.name)) : value)],
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidate("/", "/equipamentos");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidate("/", "/equipamentos");
        return doc;
      },
    ],
  },
};
