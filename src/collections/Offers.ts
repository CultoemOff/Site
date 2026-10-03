import type { CollectionConfig } from "payload";
import { revalidate, slugify } from "../cms/hooks";
import { readProductLink } from "../lib/productLink";

const stamp = () =>
  new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * Ofertas: produtos com link de afiliado (página /ofertas).
 * O cadastro é manual: link, nome, link da imagem, categorias e preço.
 * A leitura automática pelo link existe como opção por produto (desligada por padrão),
 * porque as lojas costumam recusar esse tipo de leitura.
 */
export const Offers: CollectionConfig = {
  slug: "offers",
  labels: { singular: "Oferta", plural: "Ofertas" },
  admin: {
    useAsTitle: "title",
    group: "Loja",
    defaultColumns: ["title", "price", "tags", "reviewUrl", "home", "active", "order"],
    description: "Preencha o link, o nome, o link da imagem, as categorias e o preço. A página mostra até 100 ofertas.",
  },
  defaultSort: "order",
  access: { read: () => true },
  fields: [
    {
      // atalho no topo da tela: aparece depois de salvar, para cadastrar o próximo produto
      name: "addNew",
      type: "ui",
      admin: { components: { Field: "/components/admin/AddOfferButton" } },
    },
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
      required: true,
      // na lista: miniatura da foto + nome + loja
      admin: { components: { Cell: "/components/admin/OfferTitleCell" } },
    },
    {
      name: "imageUrl",
      type: "text",
      label: "Link da imagem do produto",
      admin: {
        description:
          "Endereço da foto: na página do produto, clique com o botão direito na foto → “Copiar endereço da imagem” e cole aqui. O card ajusta o enquadramento sozinho.",
      },
    },
    {
      // prévia da foto, logo abaixo do campo do link
      name: "imagePreview",
      type: "ui",
      admin: { components: { Field: "/components/admin/OfferImagePreview" } },
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
        { label: "Iluminação", value: "iluminacao" },
        { label: "Automação", value: "automacao" },
        { label: "Cabeamento", value: "cabeamento" },
        { label: "Acessórios", value: "acessorios" },
        { label: "Hardware", value: "hardware" },
      ],
      admin: {
        description: "São os filtros que o visitante escolhe no topo da página. Pode marcar mais de uma.",
        components: { Cell: "/components/admin/OfferTagsCell" },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          label: "Preço (R$)",
          min: 0,
          admin: {
            step: 0.01,
            description: "Digite o preço de hoje. Vazio = o card mostra “Ver preço na loja”.",
            components: { Cell: "/components/admin/PriceCell" },
          },
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
      name: "readPrice",
      type: "checkbox",
      label: "Tentar ler o preço pelo link (experimental)",
      defaultValue: false,
      admin: {
        description:
          "Desligado: vale o preço que você digitou. Ligado: ao salvar, o site tenta ler o preço na página do produto; muitas lojas recusam essa leitura, e aí o preço digitado continua valendo.",
      },
    },
    {
      name: "reviewUrl",
      type: "text",
      label: "Link de review (opcional)",
      admin: {
        description: "Link de um vídeo de review do produto (YouTube, por exemplo). Se preenchido, o card ganha o botão “Assistir review”.",
        // na lista: mostra se o produto tem review
        components: { Cell: "/components/admin/ReviewCell" },
      },
      validate: (value: unknown) =>
        !value || /^https?:\/\/\S+$/i.test(String(value).trim()) ? true : "Cole o link completo, começando com https://",
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
      admin: { position: "sidebar", components: { Cell: "/components/admin/YesNoCell" } },
    },
    {
      name: "home",
      type: "checkbox",
      label: "Mostrar na home (carrossel)",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "A home passa até 10 produtos marcados, na ordem abaixo. Se nenhum estiver marcado, passam os 10 primeiros.",
        components: { Cell: "/components/admin/YesNoCell" },
      },
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
      admin: { position: "sidebar", readOnly: true, description: "Só é usado quando a leitura automática está ligada." },
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
        if (href) data.href = href;
        // preço do dia: registra quando foi informado, para o card mostrar "preço em dd/mm"
        if (typeof data.price === "number" && data.price !== originalDoc?.price) data.priceCheckedAt = new Date().toISOString();

        const wantsRead = (data.readPrice ?? originalDoc?.readPrice ?? false) === true;
        if (!href || !wantsRead) return data;

        const info = await readProductLink(href);
        if (info?.price) {
          data.price = info.price;
          data.priceCheckedAt = new Date().toISOString();
          data.priceInfo = `${stamp()}: preço lido do link.`;
        } else {
          data.priceInfo = `${stamp()}: a loja não deixou ler o preço. Vale o valor digitado.`;
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidate("/ofertas", "/");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidate("/ofertas", "/");
        return doc;
      },
    ],
  },
};
