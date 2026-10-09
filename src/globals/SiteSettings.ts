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
  admin: { group: "Site" },
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
          label: "Softwares",
          fields: [
            {
              name: "ptzDownloadUrl",
              type: "text",
              label: "Link de download do PTZ Control Web",
              admin: {
                description:
                  "Liberado depois do cadastro na página do software. Se vazio, usa o link padrão (GitHub → releases/latest).",
              },
            },
          ],
        },
        {
          label: "Números das redes",
          description: "Aparecem no CH 06 (Quem está por trás). Se a lista ficar vazia, usa os números padrão do código.",
          fields: [
            {
              name: "audienceStats",
              type: "array",
              label: "Números",
              labels: { singular: "Número", plural: "Números" },
              maxRows: 4,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "value", type: "text", label: "Valor", required: true, admin: { description: "Ex.: 250 mil+" } },
                    { name: "label", type: "text", label: "Legenda", required: true, admin: { description: "Ex.: visualizações nas redes" } },
                  ],
                },
              ],
            },
            {
              name: "audienceNote",
              type: "text",
              label: "Observação (fonte/data)",
              admin: { description: "Ex.: Dados das redes em outubro de 2026." },
            },
          ],
        },
        {
          label: "Perguntas frequentes",
          description: "Aparecem na home (Perguntas frequentes). Se a lista ficar vazia, usa as perguntas padrão do código.",
          fields: [
            {
              name: "faq",
              type: "array",
              label: "Perguntas",
              labels: { singular: "Pergunta", plural: "Perguntas" },
              fields: [
                { name: "question", type: "text", label: "Pergunta", required: true },
                { name: "answer", type: "textarea", label: "Resposta", required: true },
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
            {
              name: "metaPixelId",
              type: "text",
              label: "ID do Meta Pixel (opcional)",
              admin: {
                description:
                  "Só números. Carrega apenas depois que o visitante aceita os cookies. Se vazio, usa a variável NEXT_PUBLIC_META_PIXEL_ID da Vercel e, sem ela, o pixel do Culto em Off (1167756799251222).",
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidate("/", "/blog", "/formacoes", "/equipamentos", "/softwares/ptz-control-web");
        return doc;
      },
    ],
  },
};
