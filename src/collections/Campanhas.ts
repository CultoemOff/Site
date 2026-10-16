import type { CollectionConfig, Field, GlobalConfig } from "payload";
import { campaignEndpoints } from "../lib/campanhas/endpoints";
import { DEFAULT_SETTINGS } from "../lib/campanhas/types";

/**
 * Painel de campanhas (Meta Ads × Hotmart): dados guardados no MongoDB do site.
 * As coleções ficam escondidas do menu: tudo é visto e importado pela página /admin/campanhas.
 * Só quem está logado no painel lê ou grava.
 */

const loggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);
const access = { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn };

const n = (name: string): Field => ({ name, type: "number", defaultValue: 0 });
const t = (name: string, index = false): Field => ({ name, type: "text", index });

export const MetaAdDays: CollectionConfig = {
  slug: "meta-ad-days",
  labels: { singular: "Anúncio por dia (Meta)", plural: "Anúncios por dia (Meta)" },
  admin: { hidden: true, useAsTitle: "ad" },
  access,
  fields: [
    t("date", true),
    t("campaign", true),
    t("adset"),
    t("ad"),
    t("delivery"),
    n("spend"),
    n("impressions"),
    n("reach"),
    n("linkClicks"),
    n("landingPageViews"),
    n("video3s"),
    n("p25"),
    n("p50"),
    n("p75"),
    n("p100"),
    n("checkouts"),
    n("purchasesMeta"),
    n("purchaseValueMeta"),
    { name: "budget", type: "number" },
    t("budgetType"),
    t("endDate"),
    t("qualityRank"),
    t("engagementRank"),
    t("conversionRank"),
    t("attribution"),
  ],
};

export const HotmartSales: CollectionConfig = {
  slug: "hotmart-sales",
  labels: { singular: "Venda (Hotmart)", plural: "Vendas (Hotmart)" },
  admin: { hidden: true, useAsTitle: "transactionId" },
  access,
  fields: [
    { name: "transactionId", type: "text", required: true, unique: true, index: true },
    t("status"),
    t("soldAt"),
    t("day", true),
    n("hour"),
    n("weekday"),
    t("confirmedAt"),
    t("productId"),
    t("productName"),
    n("grossPaid"),
    n("gross"),
    n("net"),
    n("feeProcessing"),
    n("feeOther"),
    n("feeInstallment"),
    t("src"),
    t("sck"),
    t("origin"),
    t("button"),
    t("adName"),
    t("paymentMethod"),
    n("installments"),
    t("coupon"),
    // dados pessoais mínimos (telefone e CPF/CNPJ não são guardados); a página mostra mascarado
    t("buyerName"),
    t("buyerEmail"),
    t("buyerState"),
  ],
};

export const CampaignImports: CollectionConfig = {
  slug: "campaign-imports",
  labels: { singular: "Importação", plural: "Importações (campanhas)" },
  admin: { hidden: true, useAsTitle: "fileName" },
  access,
  defaultSort: "-createdAt",
  // rotas usadas pela página: /api/campaign-imports/{preview,commit,settings,reveal}
  endpoints: campaignEndpoints,
  fields: [
    { name: "kind", type: "select", options: ["meta", "hotmart"], required: true },
    t("fileName"),
    n("rows"),
    n("created"),
    n("updated"),
    n("ignored"),
    t("periodFrom"),
    t("periodTo"),
  ],
};

export const CampaignSettingsGlobal: GlobalConfig = {
  slug: "campaign-settings",
  label: "Premissas das campanhas",
  admin: { hidden: true },
  access: { read: loggedIn, update: loggedIn },
  fields: [
    { name: "netPerSale", type: "number", defaultValue: DEFAULT_SETTINGS.netPerSale },
    { name: "cpaMax", type: "number", defaultValue: DEFAULT_SETTINGS.cpaMax },
    { name: "cpaTarget", type: "number", defaultValue: DEFAULT_SETTINGS.cpaTarget },
    { name: "minSales3d", type: "number", defaultValue: DEFAULT_SETTINGS.minSales3d },
    { name: "pauseSpend", type: "number", defaultValue: DEFAULT_SETTINGS.pauseSpend },
    { name: "ctrMin", type: "number", defaultValue: DEFAULT_SETTINGS.ctrMin },
    { name: "ctrMinImpressions", type: "number", defaultValue: DEFAULT_SETTINGS.ctrMinImpressions },
    { name: "hookMin", type: "number", defaultValue: DEFAULT_SETTINGS.hookMin },
    { name: "freqAlert", type: "number", defaultValue: DEFAULT_SETTINGS.freqAlert },
    { name: "scaleMin", type: "number", defaultValue: DEFAULT_SETTINGS.scaleMin },
    { name: "scaleMax", type: "number", defaultValue: DEFAULT_SETTINGS.scaleMax },
    { name: "waitSpend", type: "number", defaultValue: DEFAULT_SETTINGS.waitSpend },
    { name: "launchDate", type: "text" },
    { name: "testEmails", type: "array", defaultValue: DEFAULT_SETTINGS.testEmails.map((email) => ({ email })), fields: [{ name: "email", type: "text" }] },
    { name: "youtubeCoupons", type: "array", defaultValue: DEFAULT_SETTINGS.youtubeCoupons.map((code) => ({ code })), fields: [{ name: "code", type: "text" }] },
    { name: "adOrigins", type: "array", defaultValue: DEFAULT_SETTINGS.adOrigins.map((code) => ({ code })), fields: [{ name: "code", type: "text" }] },
    {
      name: "campaignMap",
      type: "array",
      fields: [
        { name: "adset", type: "text" },
        { name: "campaign", type: "text" },
      ],
    },
  ],
};
