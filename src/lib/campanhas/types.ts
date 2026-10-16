/**
 * Painel de campanhas (Meta Ads × Hotmart): tipos e premissas padrão.
 * Datas de dia sempre como texto "AAAA-MM-DD" no fuso de São Paulo (sem conversão de fuso no caminho).
 */

/** uma linha do Gerenciador de Anúncios: um anúncio em um dia */
export type MetaDay = {
  date: string;
  campaign: string;
  adset: string;
  ad: string;
  delivery: string;
  spend: number;
  impressions: number;
  reach: number;
  linkClicks: number;
  landingPageViews: number;
  video3s: number;
  p25: number;
  p50: number;
  p75: number;
  p100: number;
  checkouts: number;
  purchasesMeta: number;
  purchaseValueMeta: number;
  budget: number | null;
  budgetType: string;
  endDate: string;
  qualityRank: string;
  engagementRank: string;
  conversionRank: string;
  attribution: string;
};

export type SaleStatusGroup = "approved" | "refund" | "pending" | "other";
export type OriginGroup = "meta" | "site" | "outros" | "desconhecida";

/** uma venda da Hotmart (sem telefone nem documento: descartados na importação) */
export type Sale = {
  transactionId: string;
  status: string;
  soldAt: string; // ISO com -03:00
  day: string; // AAAA-MM-DD (São Paulo)
  hour: number; // 0–23
  weekday: number; // 0 = domingo
  confirmedAt: string;
  productId: string;
  productName: string;
  grossPaid: number;
  gross: number;
  net: number;
  feeProcessing: number;
  feeOther: number;
  feeInstallment: number;
  src: string;
  sck: string;
  origin: string; // fb, ig, site… ou "" quando não há
  button: string; // barra, popup, topo…
  adName: string; // 3º campo do sck, quando existir
  paymentMethod: string;
  installments: number;
  coupon: string;
  buyerName: string;
  buyerEmail: string;
  buyerState: string;
  /** order bump: código da transação do produto principal (vazio quando é a venda principal) */
  mainTransaction?: string;
  /** compra de teste (calculado no servidor, pelos e-mails das premissas; o e-mail chega mascarado ao navegador) */
  test?: boolean;
};

export type CampaignSettings = {
  netPerSale: number;
  cpaMax: number;
  cpaTarget: number;
  minSales3d: number;
  pauseSpend: number;
  ctrMin: number; // %
  ctrMinImpressions: number;
  hookMin: number; // %
  freqAlert: number;
  scaleMin: number; // %
  scaleMax: number; // %
  waitSpend: number;
  launchDate: string; // AAAA-MM-DD ou ""
  testEmails: string[];
  youtubeCoupons: string[];
  adOrigins: string[];
  campaignMap: { adset: string; campaign: string }[];
};

export const DEFAULT_SETTINGS: CampaignSettings = {
  netPerSale: 49.49,
  cpaMax: 49.49,
  cpaTarget: 35,
  minSales3d: 5,
  pauseSpend: 75,
  ctrMin: 1,
  ctrMinImpressions: 1000,
  hookMin: 25,
  freqAlert: 2.5,
  scaleMin: 20,
  scaleMax: 30,
  waitSpend: 20,
  launchDate: "",
  testEmails: ["jonasgxp@gmail.com"],
  youtubeCoupons: ["OFF20"],
  adOrigins: ["fb", "ig", "an", "msg"],
  campaignMap: [],
};

/** junta o que veio do banco com os padrões (campos vazios ficam com o padrão) */
export function withDefaults(raw: Partial<Record<keyof CampaignSettings | "updatedAt", unknown>> | null | undefined): CampaignSettings {
  const s = { ...DEFAULT_SETTINGS };
  if (!raw) return s;
  const nums: (keyof CampaignSettings)[] = [
    "netPerSale",
    "cpaMax",
    "cpaTarget",
    "minSales3d",
    "pauseSpend",
    "ctrMin",
    "ctrMinImpressions",
    "hookMin",
    "freqAlert",
    "scaleMin",
    "scaleMax",
    "waitSpend",
  ];
  for (const k of nums) {
    const v = raw[k];
    if (typeof v === "number" && Number.isFinite(v)) (s as Record<string, unknown>)[k] = v;
  }
  if (typeof raw.launchDate === "string") s.launchDate = raw.launchDate;
  const list = (v: unknown, key: string): string[] | null =>
    Array.isArray(v)
      ? v
          .map((x) => (typeof x === "string" ? x : x && typeof x === "object" ? String((x as Record<string, unknown>)[key] ?? "") : ""))
          .map((x) => x.trim())
          .filter(Boolean)
      : null;
  // premissas nunca salvas chegam com listas vazias: aí valem as listas padrão
  const saved = Boolean((raw as Record<string, unknown>).updatedAt);
  const pick = (v: string[] | null, fallback: string[]) => (v && (v.length || saved) ? v : fallback);
  s.testEmails = pick(list(raw.testEmails, "email")?.map((e) => e.toLowerCase()) ?? null, s.testEmails);
  s.youtubeCoupons = pick(list(raw.youtubeCoupons, "code")?.map((c) => c.toUpperCase()) ?? null, s.youtubeCoupons);
  s.adOrigins = pick(list(raw.adOrigins, "code")?.map((c) => c.toLowerCase()) ?? null, s.adOrigins);
  if (!s.adOrigins.length) s.adOrigins = DEFAULT_SETTINGS.adOrigins;
  if (Array.isArray(raw.campaignMap)) {
    s.campaignMap = raw.campaignMap
      .map((x) => (x && typeof x === "object" ? (x as Record<string, unknown>) : {}))
      .map((x) => ({ adset: String(x.adset ?? "").trim(), campaign: String(x.campaign ?? "").trim() }))
      .filter((x) => x.adset && x.campaign);
  }
  return s;
}

export function statusGroup(status: string): SaleStatusGroup {
  const s = status.trim().toLowerCase();
  if (s === "aprovado" || s === "completo") return "approved";
  if (/(reembols|chargeback|cancelad|devolvid|estornad)/.test(s)) return "refund";
  if (/(aguardando|boleto|expirad|recusad|atrasad)/.test(s)) return "pending";
  return "other";
}

export function originGroup(origin: string, adOrigins: string[]): OriginGroup {
  if (!origin) return "desconhecida";
  if (adOrigins.includes(origin)) return "meta";
  if (origin === "site") return "site";
  return "outros";
}

export const ORIGIN_LABEL: Record<string, string> = {
  fb: "Facebook",
  ig: "Instagram",
  an: "Audience Network",
  msg: "Messenger",
  site: "Site (orgânico)",
  "": "Desconhecida",
};
