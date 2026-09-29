import type { GlobalConfig } from "payload";
import { revalidate } from "../cms/hooks";
import {
  DORN_URL,
  SOCIAL_DEFAULTS,
  SPRESENTER_COUPON,
  SPRESENTER_URL,
  VOLUTS_URL,
} from "../config/site";

/** Configurações editáveis no admin: redes sociais, parceiros, YouTube e Analytics. */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Configurações do site",
  admin: { group: "Administração" },
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Redes sociais",
          fields: [
            { name: "youtube", type: "text", label: "YouTube", defaultValue: SOCIAL_DEFAULTS.youtube },
            { name: "instagram", type: "text", label: "Instagram", defaultValue: SOCIAL_DEFAULTS.instagram },
            { name: "tiktok", type: "text", label: "TikTok", defaultValue: SOCIAL_DEFAULTS.tiktok },
          ],
        },
        {
          label: "YouTube no site",
          fields: [
            {
              name: "videosMode",
              type: "radio",
              label: "Vídeos exibidos em “Conteúdo gratuito”",
              defaultValue: "latest",
              options: [
                { label: "Últimos vídeos do canal (automático)", value: "latest" },
                { label: "Vídeos escolhidos por mim", value: "selected" },
              ],
            },
            {
              name: "selectedVideos",
              type: "array",
              label: "Vídeos escolhidos",
              labels: { singular: "Vídeo", plural: "Vídeos" },
              maxRows: 8,
              admin: {
                condition: (data) => data?.videosMode === "selected",
                description: "Cole o link de cada vídeo. O título é buscado automaticamente se ficar vazio.",
              },
              fields: [
                { name: "url", type: "text", label: "Link do vídeo", required: true },
                { name: "title", type: "text", label: "Título (opcional)" },
              ],
            },
          ],
        },
        {
          label: "Parceiros",
          fields: [
            {
              name: "spresenter",
              type: "group",
              label: "SPresenter",
              fields: [
                { name: "url", type: "text", label: "Link", defaultValue: SPRESENTER_URL },
                { name: "coupon", type: "text", label: "Cupom", defaultValue: SPRESENTER_COUPON },
                { name: "discount", type: "text", label: "Benefício", defaultValue: "5% de desconto no plano Pro" },
                { name: "screen", type: "upload", relationTo: "media", label: "Captura da tela (opcional)" },
              ],
            },
            {
              name: "voluts",
              type: "group",
              label: "Voluts",
              fields: [
                { name: "url", type: "text", label: "Link", defaultValue: VOLUTS_URL },
                { name: "screen", type: "upload", relationTo: "media", label: "Captura da tela (opcional)" },
              ],
            },
            {
              name: "dorn",
              type: "group",
              label: "Loja da Dorn",
              fields: [
                { name: "url", type: "text", label: "Link", defaultValue: DORN_URL },
                { name: "image", type: "upload", relationTo: "media", label: "Imagem (opcional)" },
              ],
            },
          ],
        },
        {
          label: "Analytics",
          fields: [
            {
              name: "gaMeasurementId",
              type: "text",
              label: "ID do Google Analytics 4",
              admin: { description: "Formato G-XXXXXXXXXX. Se vazio, usa a variável NEXT_PUBLIC_GA_ID." },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidate("/", "/blog", "/formacoes");
        return doc;
      },
    ],
  },
};
