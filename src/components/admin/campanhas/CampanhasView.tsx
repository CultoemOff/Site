import { DefaultTemplate } from "@payloadcms/next/templates";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { todaySP } from "@/lib/campanhas/dates";
import { maskEmail, maskName } from "@/lib/campanhas/format";
import { withDefaults, type MetaDay, type Sale } from "@/lib/campanhas/types";
import Dashboard, { type ImportLog } from "./Dashboard";
import "./campanhas.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--cmp-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--cmp-mono", display: "swap" });

const META_FIELDS: (keyof MetaDay)[] = [
  "date",
  "campaign",
  "adset",
  "ad",
  "delivery",
  "spend",
  "impressions",
  "reach",
  "linkClicks",
  "landingPageViews",
  "video3s",
  "p25",
  "p50",
  "p75",
  "p100",
  "checkouts",
  "purchasesMeta",
  "purchaseValueMeta",
  "budget",
  "budgetType",
  "endDate",
  "qualityRank",
  "engagementRank",
  "conversionRank",
  "attribution",
];

const NUMERIC = new Set<keyof MetaDay>([
  "spend",
  "impressions",
  "reach",
  "linkClicks",
  "landingPageViews",
  "video3s",
  "p25",
  "p50",
  "p75",
  "p100",
  "checkouts",
  "purchasesMeta",
  "purchaseValueMeta",
]);

function pickMeta(d: Record<string, unknown>): MetaDay {
  const o: Record<string, unknown> = {};
  for (const k of META_FIELDS) {
    if (NUMERIC.has(k)) o[k] = Number(d[k] ?? 0) || 0;
    else if (k === "budget") o[k] = typeof d[k] === "number" ? d[k] : null;
    else o[k] = String(d[k] ?? "");
  }
  return o as MetaDay;
}

/**
 * /admin/campanhas — página única do painel de campanhas, dentro do admin do Payload.
 * Usa o login do próprio painel: sem login, vai para a tela de entrar.
 */
export default async function CampanhasView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, locale, visibleEntities } = initPageResult;
  const { payload, user } = req;
  const admin = payload.config.routes.admin;
  if (!user) redirect(`${admin}/login?redirect=${encodeURIComponent(`${admin}/campanhas`)}`);

  const [metaRes, salesRes, importsRes, rawSettings] = await Promise.all([
    payload.find({ collection: "meta-ad-days", pagination: false, depth: 0, sort: "date" }),
    payload.find({ collection: "hotmart-sales", pagination: false, depth: 0, sort: "soldAt" }),
    payload.find({ collection: "campaign-imports", limit: 15, depth: 0, sort: "-createdAt" }),
    payload.findGlobal({ slug: "campaign-settings", depth: 0 }).catch(() => null),
  ]);
  const settings = withDefaults(rawSettings as unknown as Record<string, unknown>);
  const tests = new Set(settings.testEmails);

  const meta = (metaRes.docs as unknown as Record<string, unknown>[]).map(pickMeta);
  // nomes e e-mails já saem mascarados do servidor; o "mostrar" busca o original numa rota protegida
  const sales: Sale[] = (salesRes.docs as unknown as Sale[]).map((d) => ({
    transactionId: d.transactionId,
    status: d.status ?? "",
    soldAt: d.soldAt ?? "",
    day: d.day ?? "",
    hour: d.hour ?? 0,
    weekday: d.weekday ?? 0,
    confirmedAt: d.confirmedAt ?? "",
    productId: d.productId ?? "",
    productName: d.productName ?? "",
    grossPaid: d.grossPaid ?? 0,
    gross: d.gross ?? 0,
    net: d.net ?? 0,
    feeProcessing: d.feeProcessing ?? 0,
    feeOther: d.feeOther ?? 0,
    feeInstallment: d.feeInstallment ?? 0,
    src: d.src ?? "",
    sck: d.sck ?? "",
    origin: d.origin ?? "",
    button: d.button ?? "",
    adName: d.adName ?? "",
    paymentMethod: d.paymentMethod ?? "",
    installments: d.installments ?? 1,
    coupon: d.coupon ?? "",
    buyerName: maskName(d.buyerName ?? ""),
    buyerEmail: maskEmail(d.buyerEmail ?? ""),
    buyerState: d.buyerState ?? "",
    test: tests.has(String(d.buyerEmail ?? "").toLowerCase()),
  }));
  const imports: ImportLog[] = (importsRes.docs as unknown as (ImportLog & { createdAt: string })[]).map((d) => ({
    kind: d.kind,
    fileName: d.fileName ?? "",
    rows: d.rows ?? 0,
    created: d.created ?? 0,
    updated: d.updated ?? 0,
    ignored: d.ignored ?? 0,
    periodFrom: d.periodFrom ?? "",
    periodTo: d.periodTo ?? "",
    createdAt: d.createdAt,
  }));
  const sp = (await searchParams) ?? {};
  const query = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? String(v[0] ?? "") : String(v ?? "")]));

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <div className={`cmp ${display.variable} ${mono.variable}`}>
        <Dashboard meta={meta} sales={sales} settings={settings} imports={imports} today={todaySP()} query={query} />
      </div>
    </DefaultTemplate>
  );
}
