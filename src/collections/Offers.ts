import { APIError, type CollectionConfig } from "payload";
import { revalidate, slugify } from "../cms/hooks";
import { readProductLink } from "../lib/productLink";

const stamp = () =>
  new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * Ofertas: produtos com link de afiliado (página /ofertas).
 * Ao salvar, o site abre o link e tenta preencher sozinho o título, a foto e o preço.
 * O que não conseguir ler fica para preencher à mão.
 */
export const Offers: CollectionConfig = {
  slug: "offers",
  labels: { singular: "Oferta", plural: "Ofertas" },
  admin: {
    useAsTitle: "title",
    group: "Conteúdo",
    defaultColumns: ["title", "price", "tags", "active", "order"],
    description: "Cole o link do produto e salve: o site tenta ler o título, a foto e o preço. A página mostra até 100 ofertas.",
  },
  defaultSort: "order",
  access: { read: () => true },
  fields: [
    {
      name: "href",
      type: "text",
      label: "Link do produto (afiliado)",
      required: true,
      admin: { description: "É para onde o botão “Ver oferta” leva. Cole o link de afiliado completo." },
    },
    {
      name: "title",
      type: "text",
      label: "Nome do produto",
      admin: { description: "Pode deixar vazio ao criar: o site tenta ler do link. Se não conseguir, ele avisa para preencher." },
    },
    {
      name: "imageUrl",
      type: "text",
      label: "Link da imagem do produto",
      admin: {
        description:
          "Endereço da foto (clique com o botão direito na foto do produto → “Copiar endereço da imagem”). Vazio = o site tenta pegar a foto do link. O card ajusta o enquadramento sozinho.",
      },
    },
    {
      name: "tags",
      type: "select",
      label: "Categorias",
      hasMany: true,
      required: true,
      defaultValue: ["audio"],
      options: [
        { label: "Áudio", value: "audio" },
        { label: "Vídeo", value: "video" },
        { label: "Acessórios", value: "acessorios" },
        { label: "Hardware", value: "hardware" },
      ],
      admin: { description: "São os filtros que o visitante escolhe no topo da página. Pode marcar mais de uma." },
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          label: "Preço (R$)",
          min: 0,
          admin: { step: 0.01, description: "Preenchido sozinho quando o site consegue ler do link. Vazio = “Ver preço na loja”." },
        },
        {
          name: "priceFrom",
          type: "number",
          label: "Preço anterior (R$), opcional",
          min: 0,
          admin: { step: 0.01, description: "Se for maior que o preço, aparece riscado com o desconto." },
        },
      ],
    },
    {
      name: "autoPrice",
      type: "checkbox",
      label: "Atualizar o preço automaticamente pelo link",
      defaultValue: true,
      admin: { description: "Ligado: o preço é lido ao salvar e uma vez por dia. Desligue para manter o preço que você digitou." },
    },
    { name: "note", type: "text", label: "Frase curta (opcional)", admin: { description: "Ex.: 16 portas Gigabit com PoE." } },
    {
      name: "store",
      type: "text",
      label: "Nome da loja (opcional)",
      admin: { description: "Se vazio, é deduzido do link (ex.: Mercado Livre)." },
    },
    {
      name: "active",
      type: "checkbox",
      label: "Mostrar na página",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    {
      name: "order",
      type: "number",
      label: "Ordem",
      defaultValue: 10,
      admin: { position: "sidebar", description: "Menor aparece primeiro." },
    },
    {
      name: "priceInfo",
      type: "text",
      label: "Leitura do link",
      admin: { position: "sidebar", readOnly: true, description: "O que o site conseguiu ler na última tentativa." },
    },
    { name: "priceCheckedAt", type: "date", label: "Preço conferido em", admin: { position: "sidebar", readOnly: true } },
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
    beforeValidate: [
      async ({ data, originalDoc, context }) => {
        if (!data || context?.skipLinkRead) return data;
        const href = String(data.href ?? originalDoc?.href ?? "").trim();
        if (!href) return data;
        data.href = href;

        const title = String(data.title ?? originalDoc?.title ?? "").trim();
        const imageUrl = String(data.imageUrl ?? originalDoc?.imageUrl ?? "").trim();
        const auto = (data.autoPrice ?? originalDoc?.autoPrice ?? true) !== false;
        if (title && imageUrl && !auto) return data;

        const info = await readProductLink(href);
        const read: string[] = [];
        if (!title && info?.title) {
          data.title = info.title;
          read.push("nome");
        }
        if (!imageUrl && info?.image) {
          data.imageUrl = info.image;
          read.push("foto");
        }
        if (auto && info?.price) {
          data.price = info.price;
          data.priceCheckedAt = new Date().toISOString();
          read.push("preço");
        }
        if (!String(data.title ?? title).trim()) {
          throw new APIError("Não consegui ler o nome do produto neste link. Preencha o campo “Nome do produto” e salve de novo.", 400);
        }
        if (!info) data.priceInfo = `${stamp()}: a loja não respondeu ou bloqueou a leitura. Preencha à mão.`;
        else if (auto && !info.price) data.priceInfo = `${stamp()}: não encontrei o preço neste link. Preencha à mão.`;
        else if (read.length) data.priceInfo = `${stamp()}: li ${read.join(", ")}.`;
        return data;
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidate("/ofertas");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidate("/ofertas");
        return doc;
      },
    ],
  },
};
