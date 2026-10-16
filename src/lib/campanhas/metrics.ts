/**
 * Cálculos do painel de campanhas. Regras:
 * - taxas (CTR, CPC, CPM, ROAS, frequência) nunca são somadas: sempre recalculadas dos totais;
 * - no total do dia, a Hotmart é a verdade (vendas reais); por anúncio/campanha, usa as compras do Meta
 *   (a Hotmart não sabe de qual anúncio veio a venda, a não ser quando o sck traz o 3º campo).
 */
import { addDays, dayRange, diffDays } from "./dates";
import { originGroup, statusGroup, type CampaignSettings, type MetaDay, type OriginGroup, type Sale } from "./types";

/* ------------------------------------------------------------------ */
/* filtros                                                             */
/* ------------------------------------------------------------------ */

export type Filters = {
  from: string;
  to: string;
  campaigns: string[];
  adsets: string[];
  ads: string[];
  /** fb, ig, an, msg, site, outros, desconhecida */
  origins: string[];
  /** "" = todos · "com" · "sem" · ou o código do cupom */
  coupon: string;
  payments: string[];
};

export type SaleX = Sale & {
  group: ReturnType<typeof statusGroup>;
  originGroup: OriginGroup;
  isTest: boolean;
  youtube: boolean;
};

export function enrichSales(sales: Sale[], s: CampaignSettings): SaleX[] {
  const tests = new Set(s.testEmails.map((e) => e.toLowerCase()));
  const yt = new Set(s.youtubeCoupons.map((c) => c.toUpperCase()));
  return sales.map((x) => ({
    ...x,
    group: statusGroup(x.status),
    originGroup: originGroup(x.origin, s.adOrigins),
    isTest: Boolean(x.test) || tests.has(x.buyerEmail.toLowerCase()),
    youtube: Boolean(x.coupon) && yt.has(x.coupon.toUpperCase()),
  }));
}

export function filterMeta(rows: MetaDay[], f: Pick<Filters, "campaigns" | "adsets" | "ads">): MetaDay[] {
  return rows.filter(
    (r) =>
      (!f.campaigns.length || f.campaigns.includes(r.campaign)) &&
      (!f.adsets.length || f.adsets.includes(r.adset)) &&
      (!f.ads.length || f.ads.includes(r.ad)),
  );
}

export function filterSales(rows: SaleX[], f: Pick<Filters, "origins" | "coupon" | "payments">): SaleX[] {
  return rows.filter((x) => {
    if (x.isTest) return false;
    if (f.origins.length) {
      const key = x.origin || "desconhecida";
      const ok = f.origins.includes(key) || (f.origins.includes("outros") && x.originGroup === "outros");
      if (!ok) return false;
    }
    if (f.coupon === "com" && !x.coupon) return false;
    if (f.coupon === "sem" && x.coupon) return false;
    if (f.coupon && f.coupon !== "com" && f.coupon !== "sem" && x.coupon !== f.coupon) return false;
    if (f.payments.length && !f.payments.includes(x.paymentMethod)) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* totais                                                              */
/* ------------------------------------------------------------------ */

export type MetaTotals = {
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
};

const ZERO_META: MetaTotals = {
  spend: 0,
  impressions: 0,
  reach: 0,
  linkClicks: 0,
  landingPageViews: 0,
  video3s: 0,
  p25: 0,
  p50: 0,
  p75: 0,
  p100: 0,
  checkouts: 0,
  purchasesMeta: 0,
  purchaseValueMeta: 0,
};

export function sumMeta(rows: MetaDay[]): MetaTotals {
  const t = { ...ZERO_META };
  for (const r of rows) {
    t.spend += r.spend;
    t.impressions += r.impressions;
    t.reach += r.reach;
    t.linkClicks += r.linkClicks;
    t.landingPageViews += r.landingPageViews;
    t.video3s += r.video3s;
    t.p25 += r.p25;
    t.p50 += r.p50;
    t.p75 += r.p75;
    t.p100 += r.p100;
    t.checkouts += r.checkouts;
    t.purchasesMeta += r.purchasesMeta;
    t.purchaseValueMeta += r.purchaseValueMeta;
  }
  t.spend = round2(t.spend);
  return t;
}

export type SalesTotals = {
  approved: number;
  adSales: number;
  siteSales: number;
  otherSales: number;
  unknownSales: number;
  net: number;
  netAd: number;
  gross: number;
  grossPaid: number;
  refunds: number;
  refundValue: number;
  pending: number;
  pix: number;
  card: number;
  installmentsAvg: number;
  youtube: number;
};

export function sumSales(rows: SaleX[]): SalesTotals {
  const t: SalesTotals = {
    approved: 0,
    adSales: 0,
    siteSales: 0,
    otherSales: 0,
    unknownSales: 0,
    net: 0,
    netAd: 0,
    gross: 0,
    grossPaid: 0,
    refunds: 0,
    refundValue: 0,
    pending: 0,
    pix: 0,
    card: 0,
    installmentsAvg: 0,
    youtube: 0,
  };
  let inst = 0;
  for (const x of rows) {
    if (x.group === "refund") {
      t.refunds++;
      t.refundValue += x.net;
      continue;
    }
    if (x.group === "pending") {
      t.pending++;
      continue;
    }
    if (x.group !== "approved") continue;
    t.approved++;
    t.net += x.net;
    t.gross += x.gross;
    t.grossPaid += x.grossPaid;
    inst += x.installments;
    if (/pix/i.test(x.paymentMethod)) t.pix++;
    else if (/cart|credit|apple|google/i.test(x.paymentMethod)) t.card++;
    if (x.youtube) t.youtube++;
    if (x.originGroup === "meta") {
      t.adSales++;
      t.netAd += x.net;
    } else if (x.originGroup === "site") t.siteSales++;
    else if (x.originGroup === "outros") t.otherSales++;
    else t.unknownSales++;
  }
  t.installmentsAvg = t.approved ? inst / t.approved : 0;
  t.net = round2(t.net);
  t.netAd = round2(t.netAd);
  t.gross = round2(t.gross);
  t.grossPaid = round2(t.grossPaid);
  t.refundValue = round2(t.refundValue);
  return t;
}

/* ------------------------------------------------------------------ */
/* indicadores derivados                                               */
/* ------------------------------------------------------------------ */

export type Derived = {
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  frequency: number | null;
  hook: number | null;
  ret25: number | null;
  ret50: number | null;
  ret75: number | null;
  ret100: number | null;
  lpvRate: number | null;
  cpaMeta: number | null;
  roasMeta: number | null;
  cpaReal: number | null;
  roasReal: number | null;
  profitAd: number;
  profitTotal: number;
  clickToSale: number | null;
  divergence: number;
  ticket: number | null;
};

const div = (a: number, b: number) => (b > 0 ? a / b : null);
export const round2 = (n: number) => Math.round(n * 100) / 100;

export function derive(m: MetaTotals, s: SalesTotals): Derived {
  return {
    ctr: div(m.linkClicks, m.impressions),
    cpc: div(m.spend, m.linkClicks),
    cpm: m.impressions > 0 ? (m.spend / m.impressions) * 1000 : null,
    frequency: div(m.impressions, m.reach),
    hook: div(m.video3s, m.impressions),
    ret25: div(m.p25, m.video3s),
    ret50: div(m.p50, m.video3s),
    ret75: div(m.p75, m.video3s),
    ret100: div(m.p100, m.video3s),
    lpvRate: div(m.landingPageViews, m.linkClicks),
    cpaMeta: div(m.spend, m.purchasesMeta),
    roasMeta: div(m.purchaseValueMeta, m.spend),
    cpaReal: s.adSales > 0 ? m.spend / s.adSales : null,
    roasReal: div(s.netAd, m.spend),
    profitAd: round2(s.netAd - m.spend),
    profitTotal: round2(s.net - m.spend),
    clickToSale: div(s.adSales, m.linkClicks),
    divergence: m.purchasesMeta - s.adSales,
    ticket: div(s.net, s.approved),
  };
}

/* ------------------------------------------------------------------ */
/* sinais                                                              */
/* ------------------------------------------------------------------ */

export type SignalCode = "escalar" | "manter" | "revisar" | "pausar" | "aguardar";

export type Signal = { code: SignalCode; label: string; reason: string; basis: "Hotmart" | "Meta" };

export type SignalInput = {
  spend3: number;
  sales3: number;
  daysWithData3: number;
  spendSinceSale: number;
};

export function signalFor(i: SignalInput, s: CampaignSettings, basis: Signal["basis"]): Signal {
  const brl = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;
  const cpa3 = i.sales3 > 0 ? i.spend3 / i.sales3 : null;
  if (i.spendSinceSale >= s.pauseSpend)
    return { code: "pausar", label: "Pausar / trocar criativo", reason: `${brl(i.spendSinceSale)} gastos sem nenhuma venda`, basis };
  if (i.daysWithData3 < 1 || i.spend3 < s.waitSpend)
    return { code: "aguardar", label: "Aguardar", reason: `Poucos dados: ${brl(i.spend3)} em 3 dias`, basis };
  if (cpa3 !== null && i.sales3 >= s.minSales3d && cpa3 <= s.cpaTarget)
    return {
      code: "escalar",
      label: `Escalar +${s.scaleMin}%`,
      reason: `${i.sales3} vendas em 3 dias, CPA ${brl(cpa3)} (alvo ${brl(s.cpaTarget)})`,
      basis,
    };
  if (cpa3 === null || cpa3 > s.cpaMax)
    return {
      code: "revisar",
      label: "Revisar",
      reason: cpa3 === null ? `${brl(i.spend3)} em 3 dias sem venda` : `CPA ${brl(cpa3)} acima do máximo (${brl(s.cpaMax)})`,
      basis,
    };
  return {
    code: "manter",
    label: "Manter",
    reason:
      cpa3 <= s.cpaTarget
        ? `CPA ${brl(cpa3)} no alvo, mas só ${i.sales3} venda(s) em 3 dias`
        : `CPA ${brl(cpa3)} entre o alvo e o máximo`,
    basis,
  };
}

/* ------------------------------------------------------------------ */
/* série diária (com janelas de 3 e 7 dias)                            */
/* ------------------------------------------------------------------ */

export type Alert = { code: string; text: string; tone: "warn" | "bad" | "info" };

export type DayRow = {
  date: string;
  meta: MetaTotals;
  sales: SalesTotals;
  d: Derived;
  spend3: number;
  sales3: number;
  cpa3: number | null;
  roas3: number | null;
  spend7: number;
  sales7: number;
  cpa7: number | null;
  freq7: number | null;
  /** dia depois do último dia importado do Meta: investimento ainda desconhecido */
  metaMissing: boolean;
  signal: Signal;
  alerts: Alert[];
};

type DayBucket = { meta: MetaDay[]; sales: SaleX[] };

function bucketByDay(meta: MetaDay[], sales: SaleX[]): Map<string, DayBucket> {
  const m = new Map<string, DayBucket>();
  const get = (d: string) => {
    let b = m.get(d);
    if (!b) m.set(d, (b = { meta: [], sales: [] }));
    return b;
  };
  for (const r of meta) get(r.date).meta.push(r);
  for (const x of sales) get(x.day).sales.push(x);
  return m;
}

/** linhas diárias de `from` a `to`; as janelas usam todo o histórico (mesmo antes de `from`) */
export function dailySeries(meta: MetaDay[], sales: SaleX[], from: string, to: string, s: CampaignSettings, today: string): DayRow[] {
  const buckets = bucketByDay(meta, sales);
  const metaLast = meta.reduce((a, r) => (r.date > a ? r.date : a), "");
  const allDays = [...buckets.keys()].sort();
  const start = allDays[0] && allDays[0] < from ? allDays[0] : from;
  const days = dayRange(start, to);
  const base = days.map((date) => {
    const b = buckets.get(date) ?? { meta: [], sales: [] };
    const mt = sumMeta(b.meta);
    const st = sumSales(b.sales);
    return { date, meta: mt, sales: st, rows: b.meta };
  });
  const out: DayRow[] = [];
  let sinceSale = 0;
  for (let i = 0; i < base.length; i++) {
    const cur = base[i];
    sinceSale = cur.sales.adSales > 0 ? 0 : sinceSale + cur.meta.spend;
    const w3 = base.slice(Math.max(0, i - 2), i + 1);
    const w7 = base.slice(Math.max(0, i - 6), i + 1);
    const spend3 = round2(w3.reduce((a, x) => a + x.meta.spend, 0));
    const sales3 = w3.reduce((a, x) => a + x.sales.adSales, 0);
    const net3 = w3.reduce((a, x) => a + x.sales.netAd, 0);
    const spend7 = round2(w7.reduce((a, x) => a + x.meta.spend, 0));
    const sales7 = w7.reduce((a, x) => a + x.sales.adSales, 0);
    const imp7 = w7.reduce((a, x) => a + x.meta.impressions, 0);
    const reach7 = w7.reduce((a, x) => a + x.meta.reach, 0);
    if (cur.date < from) continue;
    const d = derive(cur.meta, cur.sales);
    const metaMissing = !metaLast || cur.date > metaLast;
    if (metaMissing) {
      d.cpaReal = null;
      d.roasReal = null;
      d.profitAd = 0;
    }
    const cpa3 = sales3 > 0 && !metaMissing ? spend3 / sales3 : null;
    const row: DayRow = {
      date: cur.date,
      meta: cur.meta,
      sales: cur.sales,
      d,
      spend3,
      sales3,
      cpa3,
      roas3: spend3 > 0 && !metaMissing ? net3 / spend3 : null,
      spend7,
      sales7,
      cpa7: sales7 > 0 ? spend7 / sales7 : null,
      freq7: reach7 > 0 ? imp7 / reach7 : null,
      metaMissing,
      signal: metaMissing
        ? {
            code: "aguardar",
            label: "Aguardar",
            reason: metaLast ? `Sem dados do Meta deste dia (importado até ${metaLast.slice(8, 10)}/${metaLast.slice(5, 7)})` : "Sem dados do Meta",
            basis: "Hotmart",
          }
        : signalFor(
        { spend3, sales3, daysWithData3: w3.filter((x) => x.meta.spend > 0).length, spendSinceSale: round2(sinceSale) },
        s,
        "Hotmart",
      ),
      alerts: [],
    };
    row.alerts = metaMissing ? (cur.sales.refunds ? [{ code: "refund", text: `${cur.sales.refunds} reembolso(s)/estorno(s)`, tone: "bad" }] : []) : dayAlerts(row, cur.rows, s, today);
    out.push(row);
  }
  return out;
}

const pctTxt = (n: number) => `${(n * 100).toFixed(1).replace(".", ",")}%`;

function dayAlerts(r: DayRow, rows: MetaDay[], s: CampaignSettings, today: string): Alert[] {
  const a: Alert[] = [];
  const m = r.meta;
  if (m.impressions > s.ctrMinImpressions && r.d.ctr !== null && r.d.ctr * 100 < s.ctrMin)
    a.push({ code: "ctr", text: `CTR baixo (${pctTxt(r.d.ctr)}): testar novo gancho`, tone: "warn" });
  if (m.impressions > s.ctrMinImpressions && r.d.hook !== null && r.d.hook * 100 < s.hookMin)
    a.push({ code: "hook", text: `Abertura do vídeo fraca (gancho ${pctTxt(r.d.hook)})`, tone: "warn" });
  if (r.freq7 !== null && r.freq7 > s.freqAlert) a.push({ code: "freq", text: `Criativo cansando (frequência 7 d ${r.freq7.toFixed(2)})`, tone: "warn" });
  if (r.d.cpaReal !== null && r.cpa3 !== null && r.sales3 >= 2 && r.d.cpaReal > 2 * r.cpa3)
    a.push({ code: "outlier", text: "Dia fora da curva (CPA mais que o dobro da média de 3 dias)", tone: "warn" });
  if (m.linkClicks >= 20 && r.d.lpvRate !== null && r.d.lpvRate < 0.5)
    a.push({ code: "pixel", text: `Só ${pctTxt(r.d.lpvRate)} dos cliques viraram visita: o Pixel do site pode não estar registrando`, tone: "bad" });
  const ends = rows.map((x) => x.endDate).filter((e) => e && e >= today);
  if (r.date === today || r.date === addDays(today, -1)) {
    const soon = ends.filter((e) => diffDays(today, e) <= 3).sort()[0];
    if (soon) a.push({ code: "end", text: `Campanha vai parar em ${soon.slice(8, 10)}/${soon.slice(5, 7)}`, tone: "info" });
  }
  const top = Math.max(m.purchasesMeta, r.sales.adSales);
  if (top >= 3 && Math.abs(m.purchasesMeta - r.sales.adSales) / top > 0.3)
    a.push({ code: "div", text: `Meta ${m.purchasesMeta} × Hotmart ${r.sales.adSales}: conferir rastreamento`, tone: "info" });
  if (r.sales.refunds > 0) a.push({ code: "refund", text: `${r.sales.refunds} reembolso(s)/estorno(s)`, tone: "bad" });
  return a;
}

/* ------------------------------------------------------------------ */
/* por anúncio e por campanha                                          */
/* ------------------------------------------------------------------ */

export type GroupRow = {
  key: string;
  campaign: string;
  adset: string;
  ad: string;
  meta: MetaTotals;
  d: Derived;
  /** vendas reais atribuídas (só quando o sck traz o anúncio ou a campanha é a única ativa) */
  realSales: number | null;
  realNet: number | null;
  status: string;
  endDate: string;
  spark: number[];
  signal: Signal;
  alerts: Alert[];
  days: number;
};

const nameKey = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

/**
 * Agrupa por anúncio ("ad") ou por campanha ("campaign"), dentro do período.
 * Sinal sobre os 3 últimos dias do período; "sem venda" conta todo o histórico até o fim do período.
 */
export function groupRows(
  level: "ad" | "campaign",
  metaAll: MetaDay[],
  salesAll: SaleX[],
  from: string,
  to: string,
  s: CampaignSettings,
  today: string,
): GroupRow[] {
  const keyOf = (r: MetaDay) => (level === "ad" ? `${r.campaign}␟${r.adset}␟${r.ad}` : r.campaign);
  const groups = new Map<string, MetaDay[]>();
  for (const r of metaAll) {
    if (r.date > to) continue;
    const k = keyOf(r);
    const g = groups.get(k);
    if (g) g.push(r);
    else groups.set(k, [r]);
  }
  const approvedAd = salesAll.filter((x) => x.group === "approved" && x.originGroup === "meta");
  const hasAdNames = approvedAd.some((x) => x.adName);
  const w3from = addDays(to, -2);
  // campanha única com gasto nos últimos 3 dias → recebe as vendas reais da Hotmart
  const activeCampaigns = new Set(metaAll.filter((r) => r.date >= w3from && r.date <= to && r.spend > 0).map((r) => r.campaign));
  const periodDays = dayRange(from, to);

  const out: GroupRow[] = [];
  for (const [key, all] of groups) {
    const inPeriod = all.filter((r) => r.date >= from);
    if (!inPeriod.length) continue;
    const meta = sumMeta(inPeriod);
    const sample = all[all.length - 1];
    let realFor: (x: SaleX) => boolean = () => false;
    let basis: Signal["basis"] = "Meta";
    if (level === "ad" && hasAdNames) {
      const k = nameKey(sample.ad);
      realFor = (x) => Boolean(x.adName) && nameKey(x.adName) === k;
      basis = "Hotmart";
    } else if (level === "campaign" && groups.size === 1) {
      realFor = () => true;
      basis = "Hotmart";
    } else if (level === "campaign" && activeCampaigns.size === 1 && activeCampaigns.has(sample.campaign)) {
      realFor = () => true;
      basis = "Hotmart";
    }
    const real = basis === "Hotmart" ? approvedAd.filter(realFor) : [];
    const realPeriod = real.filter((x) => x.day >= from && x.day <= to);
    const salesT: SalesTotals = sumSales(realPeriod);
    const d = derive(meta, salesT);
    // sinal
    const byDay = new Map<string, { spend: number; sales: number }>();
    for (const r of all) {
      const b = byDay.get(r.date) ?? { spend: 0, sales: 0 };
      b.spend += r.spend;
      if (basis === "Meta") b.sales += r.purchasesMeta;
      byDay.set(r.date, b);
    }
    if (basis === "Hotmart")
      for (const x of real) {
        if (x.day > to) continue;
        const b = byDay.get(x.day) ?? { spend: 0, sales: 0 };
        b.sales += 1;
        byDay.set(x.day, b);
      }
    const days = [...byDay.keys()].sort();
    let since = 0;
    for (const day of dayRange(days[0], to)) {
      const b = byDay.get(day);
      if (!b) continue;
      since = b.sales > 0 ? 0 : since + b.spend;
    }
    let spend3 = 0,
      sales3 = 0,
      dw = 0;
    for (const day of dayRange(w3from, to)) {
      const b = byDay.get(day);
      if (!b) continue;
      spend3 += b.spend;
      sales3 += b.sales;
      if (b.spend > 0) dw++;
    }
    const signal = signalFor({ spend3, sales3, daysWithData3: dw, spendSinceSale: round2(since) }, s, basis);
    // alertas do grupo
    const alerts: Alert[] = [];
    if (meta.impressions > s.ctrMinImpressions && d.ctr !== null && d.ctr * 100 < s.ctrMin)
      alerts.push({ code: "ctr", text: "CTR baixo: testar novo gancho", tone: "warn" });
    if (meta.impressions > s.ctrMinImpressions && d.hook !== null && d.hook * 100 < s.hookMin)
      alerts.push({ code: "hook", text: "Abertura do vídeo fraca", tone: "warn" });
    const w7 = sumMeta(all.filter((r) => r.date >= addDays(to, -6)));
    const f7 = w7.reach > 0 ? w7.impressions / w7.reach : null;
    if (f7 !== null && f7 > s.freqAlert) alerts.push({ code: "freq", text: "Criativo cansando", tone: "warn" });
    const end = all.map((r) => r.endDate).filter(Boolean).sort().pop() ?? "";
    if (end && end >= today && diffDays(today, end) <= 3)
      alerts.push({ code: "end", text: `Para em ${end.slice(8, 10)}/${end.slice(5, 7)}`, tone: "info" });
    const spendBy = new Map<string, number>();
    for (const r of inPeriod) spendBy.set(r.date, (spendBy.get(r.date) ?? 0) + r.spend);
    out.push({
      key,
      campaign: sample.campaign,
      adset: level === "ad" ? sample.adset : "",
      ad: level === "ad" ? sample.ad : "",
      meta,
      d,
      realSales: basis === "Hotmart" ? salesT.adSales : null,
      realNet: basis === "Hotmart" ? salesT.netAd : null,
      status: sample.delivery,
      endDate: end,
      spark: periodDays.map((day) => round2(spendBy.get(day) ?? 0)),
      signal,
      alerts,
      days: new Set(inPeriod.filter((r) => r.spend > 0).map((r) => r.date)).size,
    });
  }
  return out.sort((a, b) => b.meta.spend - a.meta.spend);
}

/* ------------------------------------------------------------------ */
/* funil e distribuições                                               */
/* ------------------------------------------------------------------ */

export type FunnelStep = { key: string; label: string; value: number; rate: number | null; rateLabel: string };

export function funnel(m: MetaTotals, s: SalesTotals): FunnelStep[] {
  const steps: [string, string, number, string][] = [
    ["imp", "Impressões", m.impressions, ""],
    ["v3", "Vídeo 3 s", m.video3s, "gancho"],
    ["clk", "Cliques no link", m.linkClicks, "CTR"],
    ["lpv", "Visitas à página", m.landingPageViews, "chegada"],
    ["chk", "Checkouts iniciados", m.checkouts, "checkout"],
    ["pm", "Compras (Meta)", m.purchasesMeta, "conversão"],
    ["hm", "Vendas Hotmart (anúncio)", s.adSales, "Hotmart ÷ Meta"],
  ];
  return steps.map(([key, label, value, rateLabel], i) => {
    // gancho e CTR se medem contra as impressões; o resto, contra a etapa anterior
    const ref = key === "clk" ? m.impressions : i > 0 ? steps[i - 1][2] : 0;
    return { key, label, value, rate: i > 0 && ref > 0 ? value / ref : null, rateLabel };
  });
}

export type Slice = { key: string; label: string; count: number; net: number };

export function breakdown(rows: SaleX[], keyOf: (x: SaleX) => string, labelOf: (k: string) => string = (k) => k || "—"): Slice[] {
  const m = new Map<string, Slice>();
  for (const x of rows) {
    if (x.group !== "approved") continue;
    const k = keyOf(x);
    const b = m.get(k) ?? { key: k, label: labelOf(k), count: 0, net: 0 };
    b.count++;
    b.net = round2(b.net + x.net);
    m.set(k, b);
  }
  return [...m.values()].sort((a, b) => b.count - a.count || b.net - a.net);
}

/** vendas aprovadas por dia da semana × hora (7 × 24) */
export function heatmap(rows: SaleX[]): number[][] {
  const g = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
  for (const x of rows) if (x.group === "approved") g[x.weekday][x.hour]++;
  return g;
}
