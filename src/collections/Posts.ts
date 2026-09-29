import type { CollectionConfig } from "payload";
import { revalidate, slugify } from "../cms/hooks";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Post", plural: "Blog" },
  admin: {
    useAsTitle: "title",
    group: "Conteúdo",
    defaultColumns: ["title", "publishedAt", "_status"],
    preview: (doc) => (doc?.slug ? `/blog/${doc.slug}` : null),
  },
  versions: { drafts: true },
  defaultSort: "-publishedAt",
  access: {
    // visitantes veem só posts publicados; quem está logado vê rascunhos também
    read: ({ req: { user } }) => (user ? true : { _status: { equals: "published" } }),
  },
  fields: [
    { name: "title", type: "text", label: "Título", required: true },
    {
      name: "excerpt",
      type: "textarea",
      label: "Resumo",
      admin: { description: "Aparece na lista do blog e no Google (até ~160 caracteres)." },
    },
    { name: "coverImage", type: "upload", relationTo: "media", label: "Imagem de capa" },
    { name: "content", type: "richText", label: "Conteúdo", required: true },
    {
      name: "slug",
      type: "text",
      label: "Endereço (slug)",
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Gerado a partir do título se ficar vazio." },
      hooks: {
        beforeValidate: [({ value, data }) => (value ? slugify(String(value)) : data?.title ? slugify(String(data.title)) : value)],
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Data de publicação",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
      hooks: {
        beforeChange: [({ value, siblingData }) => (!value && siblingData?._status === "published" ? new Date().toISOString() : value)],
      },
    },
    { name: "author", type: "relationship", relationTo: "users", label: "Autor", admin: { position: "sidebar" } },
    { name: "tags", type: "text", hasMany: true, label: "Tags", admin: { position: "sidebar" } },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "metaTitle", type: "text", label: "Título para o Google (opcional)" },
        { name: "metaDescription", type: "textarea", label: "Descrição para o Google (opcional)" },
        { name: "ogImage", type: "upload", relationTo: "media", label: "Imagem de compartilhamento (opcional)" },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidate("/", "/blog", `/blog/${doc.slug}`, "/sitemap.xml");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidate("/", "/blog", `/blog/${doc.slug}`, "/sitemap.xml");
        return doc;
      },
    ],
  },
};
