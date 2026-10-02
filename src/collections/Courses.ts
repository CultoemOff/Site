import type { CollectionConfig, Field } from "payload";
import { revalidate, slugify } from "../cms/hooks";
import { INSTRUCTORS } from "../config/instructors";

const lines = (name: string, label: string, itemLabel: string): Field => ({
  name,
  type: "array",
  label,
  labels: { singular: itemLabel, plural: label },
  fields: [{ name: "text", type: "text", label: itemLabel, required: true }],
});

export const Courses: CollectionConfig = {
  slug: "courses",
  labels: { singular: "Formação", plural: "Formações" },
  admin: {
    useAsTitle: "title",
    group: "Escola",
    defaultColumns: ["title", "price", "status", "order"],
  },
  defaultSort: "order",
  access: { read: () => true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", label: "Nome da formação", required: true },
        {
          name: "order",
          type: "number",
          label: "Ordem na página",
          defaultValue: 10,
          admin: { description: "Menor aparece primeiro." },
        },
      ],
    },
    { name: "tagline", type: "text", label: "Frase de destaque", required: true },
    { name: "summary", type: "textarea", label: "Descrição", required: true },
    { name: "question", type: "text", label: "Pergunta que a formação ajuda a responder (opcional)" },
    {
      type: "row",
      fields: [
        { name: "price", type: "number", label: "Preço (R$)", required: true, min: 0, admin: { step: 0.1 } },
        {
          name: "status",
          type: "select",
          label: "Status",
          defaultValue: "lancamento-em-breve",
          options: [
            { label: "Lançamento em breve", value: "lancamento-em-breve" },
            { label: "Inscrições abertas", value: "inscricoes-abertas" },
            { label: "Disponível", value: "disponivel" },
            { label: "Em preparação", value: "em-preparacao" },
          ],
        },
      ],
    },
    {
      name: "format",
      type: "group",
      label: "Formato",
      fields: [
        {
          type: "row",
          fields: [
            { name: "mode", type: "text", label: "Modalidade", defaultValue: "Online" },
            { name: "hours", type: "number", label: "Carga horária (horas)", defaultValue: 6 },
            { name: "access", type: "text", label: "Acesso", defaultValue: "Acesso por 1 ano" },
          ],
        },
      ],
    },
    {
      name: "href",
      type: "text",
      label: "Link de inscrição / compra",
      admin: { description: "Quando preenchido, aparece o botão “Quero participar”." },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Imagem (opcional)",
      admin: { description: "Se enviada, substitui o diagrama animado do card." },
    },
    {
      name: "diagram",
      type: "select",
      label: "Diagrama animado",
      defaultValue: "network",
      options: [
        { label: "Rede (IP → Dante/NDI)", value: "network" },
        { label: "Mesa analógica", value: "analog" },
        { label: "Áudio para live", value: "live" },
        { label: "Companion (botão → sistemas)", value: "companion" },
        { label: "DMX / iluminação", value: "dmx" },
      ],
    },
    {
      name: "instructor",
      type: "select",
      label: "Professor",
      options: INSTRUCTORS.map((i) => ({ label: i.name, value: i.id })),
      admin: { description: "Aparece no card com foto e uma breve descrição." },
    },
    lines("includes", "Inclui (opcional)", "Item"),
    { name: "topicsTitle", type: "text", label: "Título da lista de tópicos", defaultValue: "Conteúdo" },
    lines("topics", "Tópicos", "Tópico"),
    lines("appliedTo", "Aplicado a (opcional)", "Tecnologia"),
    {
      name: "featured",
      type: "checkbox",
      label: "Formação em destaque",
      admin: { position: "sidebar" },
    },
    {
      name: "contentRev",
      type: "number",
      defaultValue: 0,
      admin: { hidden: true },
    },
    {
      name: "hideOnHome",
      type: "checkbox",
      label: "Não mostrar na home",
      admin: { position: "sidebar", description: "Continua aparecendo em /formacoes." },
    },
    {
      name: "slug",
      type: "text",
      label: "Identificador",
      unique: true,
      index: true,
      admin: { position: "sidebar" },
      hooks: {
        beforeValidate: [({ value, data }) => (value ? slugify(String(value)) : data?.title ? slugify(String(data.title)) : value)],
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidate("/", "/formacoes", `/formacoes/${doc.slug}`);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidate("/", "/formacoes", `/formacoes/${doc.slug}`);
        return doc;
      },
    ],
  },
};
