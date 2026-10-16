"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { fullDay, labelDay, presetRange, previousRange, PRESETS, shortDay, type PeriodPreset } from "@/lib/campanhas/dates";
import { brl, int, pct, roas } from "@/lib/campanhas/format";
import {
  breakdown,
  dailySeries,
  derive,
  enrichSales,
  filterMeta,
  filterSales,
  funnel,
  groupRows,
  heatmap,
  sumMeta,
  sumSales,
  type Alert,
  type Filters,
  type SaleX,
  type Signal,
} from "@/lib/campanhas/metrics";
import { ORIGIN_LABEL, type CampaignSettings, type MetaDay, type Sale } from "@/lib/campanhas/types";
import { BarList, DailyChart, Funnel, Heatmap, HourBars, ProfitChart, Sparkline } from "./charts";
import { ImportDialog, SettingsPanel } from "./panels";
import { DailyTable, dailyCsv, GroupTable, SalesList } from "./tables";
import { Card, Delta, MultiSelect, SignalBadge, Segmented } from "./ui";

export type ImportLog = {
  kind: "meta" | "hotmart";
  fileName: string;
  rows: number;
  created: number;
  updated: number;
  ignored: number;
  periodFrom: string;
  periodTo: string;
  createdAt: string;
};

type Props = {
  meta: MetaDay[];
  sales: Sale[];
  settings: CampaignSettings;
  imports: ImportLog[];
  today: string;
  query: Record<string, string>;
};

type State = Filters & { preset: PeriodPreset; compare: boolean };

const list = (v: string | undefined) => (v ? v.split("~").map(decodeURIComponent).filter(Boolean) : []);
const enc = (v: string[]) => v.map(encodeURIComponent).join("~");

function initialState(q: Record<string, string>, today: string, launch: string): State {
  const preset = (PRESETS.some((p) => p.id === q.p) ? q.p : "7d") as PeriodPreset;
  const r = presetRange(preset, today, launch);
  const custom = /^\d{4}-\d{2}-\d{2}$/.test(q.de ?? "") && /^\d{4}-\d{2}-\d{2}$/.test(q.ate ?? "");
  return {
    preset,
    from: preset === "custom" && custom ? q.de : (r?.from ?? today),
    to: preset === "custom" && custom ? q.ate : (r?.to ?? today),
    campaigns: list(q.camp),
    adsets: list(q.cj),
    ads: list(q.an),
    origins: list(q.or),
    coupon: q.cup ?? "",
    payments: list(q.pg),
    compare: q.cmp === "1",
  };
}

function toQuery(s: State): string {
  const q = new URLSearchParams();
  if (s.preset !== "7d") q.set("p", s.preset);
  if (s.preset === "custom") {
    q.set("de", s.from);
    q.set("ate", s.to);
  }
  if (s.campaigns.length) q.set("camp", enc(s.campaigns));
  if (s.adsets.length) q.set("cj", enc(s.adsets));
  if (s.ads.length) q.set("an", enc(s.ads));
  if (s.origins.length) q.set("or", enc(s.origins));
  if (s.coupon) q.set("cup", s.coupon);
  if (s.payments.length) q.set("pg", enc(s.payments));
  if (s.compare) q.set("cmp", "1");
  return q.toString();
}

const SIGNAL_HINT: Record<Signal["code"], (s: CampaignSettings) => string> = {
  escalar: (s) => `Aumente a verba em ${s.scaleMin}–${s.scaleMax}% e espere 2–3 dias antes de mexer de novo.`,
  manter: () => "Não mexa na verba. Acompanhe mais 1–2 dias.",
  revisar: () => "CPA acima do máximo: revise criativo, público ou página antes de seguir investindo.",
  pausar: () => "Pause o anúncio ou troque o criativo: o gasto sem venda passou do limite.",
  aguardar: () => "Ainda há poucos dados para decidir.",
};

type KpiProps = {
  label: string;
  value: string;
  cur: number | null;
  prev: number | null;
  good: boolean | null;
  compare: boolean;
  spark?: number[];
  color?: string;
  note?: ReactNode;
  tone?: "good" | "mid" | "bad" | "";
  mode?: "pct" | "pp";
  big?: boolean;
};

function Kpi({ label, value, cur, prev, good, compare, spark, color, note, tone = "", mode, big }: KpiProps) {
  return (
    <article className={`cmp-kpi${tone ? ` cmp-kpi--${tone}` : ""}${big ? " cmp-kpi--big" : ""}`}>
      <p className="cmp-kpi__label">{label}</p>
      <p className="cmp-kpi__value">{value}</p>
      <div className="cmp-kpi__foot">
        {compare ? <Delta cur={cur} prev={prev} good={good} mode={mode} /> : <span className="cmp-kpi__note">{note}</span>}
        {spark && spark.length > 1 && <Sparkline values={spark} color={color} height={26} />}
      </div>
    </article>
  );
}

export default function Dashboard({ meta, sales, settings, imports, today, query }: Props) {
  const router = useRouter();
  const [dialog, setDialog] = useState<"import" | "settings" | null>(null);

  const salesX = useMemo(() => enrichSales(sales, settings), [sales, settings]);
  const launch = useMemo(() => {
    if (settings.launchDate) return settings.launchDate;
    const firstSale = salesX.filter((x) => !x.isTest && x.group === "approved").map((x) => x.day).sort()[0];
    const firstSpend = meta.filter((r) => r.spend > 0).map((r) => r.date).sort()[0];
    return [firstSale, firstSpend].filter(Boolean).sort()[0] ?? today;
  }, [settings.launchDate, salesX, meta, today]);

  const [st, setSt] = useState<State>(() => initialState(query, today, launch));
  const patch = (p: Partial<State>) => setSt((s) => ({ ...s, ...p }));

  // estado dos filtros na URL (dá para salvar o link)
  useEffect(() => {
    const qs = toQuery(st);
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(window.history.state, "", url);
  }, [st]);

  const setPreset = (p: PeriodPreset) => {
    if (p === "custom") return patch({ preset: p });
    const r = presetRange(p, today, launch);
    if (r) patch({ preset: p, ...r });
  };

  const metaLast = useMemo(() => meta.reduce((a, r) => (r.date > a ? r.date : a), ""), [meta]);
  const salesLast = useMemo(() => salesX.reduce((a, x) => (x.day > a ? x.day : a), ""), [salesX]);
  const lastImport = imports[0];

  /* ---------- dados filtrados ---------- */
  const v = useMemo(() => {
    const { from, to } = st;
    const metaF = filterMeta(meta, st);
    const salesF = filterSales(salesX, st);
    const inR = (d: string, a: string, b: string) => d >= a && d <= b;
    const crossTo = metaLast && metaLast < to ? metaLast : to;
    const calc = (a: string, b: string) => {
      const cross = metaLast && metaLast < b ? metaLast : b;
      const mt = sumMeta(metaF.filter((r) => inR(r.date, a, b)));
      const sP = salesF.filter((x) => inR(x.day, a, b));
      const all = sumSales(sP);
      const crossSales = sumSales(sP.filter((x) => x.day <= cross));
      return { mt, all, crossSales, d: derive(mt, crossSales), salesP: sP };
    };
    const cur = calc(from, to);
    const prevR = previousRange(from, to);
    const prev = calc(prevR.from, prevR.to);
    const daily = dailySeries(metaF, salesF, from, to, settings, today);
    const ads = groupRows("ad", metaF, salesF, from, to, settings, today);
    const camps = groupRows("campaign", metaF, salesF, from, to, settings, today);
    const fun = funnel(cur.mt, cur.crossSales);
    const salesP = cur.salesP;
    return {
      cur,
      prev,
      prevR,
      crossTo,
      daily,
      ads,
      camps,
      fun,
      salesP,
      byOrigin: breakdown(salesP, (x) => x.origin, (k) => ORIGIN_LABEL[k] ?? k),
      byButton: breakdown(salesP, (x) => x.button || "—"),
      byCoupon: breakdown(salesP, (x) => x.coupon || "sem cupom"),
      byPayment: breakdown(salesP, (x) => x.paymentMethod || "—"),
      heat: heatmap(salesP),
    };
  }, [st, meta, salesX, settings, today, metaLast]);

  const headRow = [...v.daily].reverse().find((r) => !r.metaMissing);
  const headSignal: Signal = headRow?.signal ?? { code: "aguardar", label: "Aguardar", reason: "Sem investimento no período", basis: "Hotmart" };

  // alertas: último dia com dados do Meta + criativos + reembolsos
  const alerts = useMemo(() => {
    const out: (Alert & { where?: string })[] = [];
    if (headRow) for (const a of headRow.alerts) out.push({ ...a, where: shortDay(headRow.date) });
    for (const g of v.ads) for (const a of g.alerts) if (a.code !== "end") out.push({ ...a, where: g.ad });
    const endA = v.ads.flatMap((g) => g.alerts.filter((a) => a.code === "end"))[0];
    if (endA && !out.some((a) => a.code === "end")) out.push(endA);
    const refunds = v.salesP.filter((x) => x.group === "refund");
    if (refunds.length && !out.some((a) => a.code === "refund"))
      out.push({ code: "refund", tone: "bad", text: `${refunds.length} reembolso(s) no período: ${brl(refunds.reduce((a, x) => a + x.net, 0))}` });
    const seen = new Set<string>();
    return out.filter((a) => {
      const k = `${a.code}|${a.text}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [headRow, v]);

  /* ---------- opções dos filtros ---------- */
  const opt = useMemo(() => {
    const camps = [...new Set(meta.map((r) => r.campaign))].sort();
    const adsets = [...new Set(meta.filter((r) => !st.campaigns.length || st.campaigns.includes(r.campaign)).map((r) => r.adset))].sort();
    const ads = [
      ...new Set(meta.filter((r) => (!st.campaigns.length || st.campaigns.includes(r.campaign)) && (!st.adsets.length || st.adsets.includes(r.adset))).map((r) => r.ad)),
    ].sort();
    const origins = [...new Set(salesX.filter((x) => !x.isTest).map((x) => x.origin || "desconhecida"))].sort();
    const coupons = [...new Set(salesX.filter((x) => !x.isTest && x.coupon).map((x) => x.coupon))].sort();
    const pays = [...new Set(salesX.filter((x) => !x.isTest).map((x) => x.paymentMethod).filter(Boolean))].sort();
    return { camps, adsets, ads, origins, coupons, pays };
  }, [meta, salesX, st.campaigns, st.adsets]);

  const activeFilters = st.campaigns.length + st.adsets.length + st.ads.length + st.origins.length + st.payments.length + (st.coupon ? 1 : 0);
  const metaFiltered = st.campaigns.length + st.adsets.length + st.ads.length > 0;
  const salesFiltered = st.origins.length + st.payments.length + (st.coupon ? 1 : 0) > 0;

  const exportCsv = () => {
    const blob = new Blob([dailyCsv(v.daily)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `campanhas_${st.from}_a_${st.to}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const refresh = () => {
    setDialog(null);
    router.refresh();
  };

  const { cur, prev } = v;
  const cpaTone = (x: number | null): KpiProps["tone"] => (x === null ? "" : x <= settings.cpaTarget ? "good" : x <= settings.cpaMax ? "mid" : "bad");
  const sp = (fn: (r: (typeof v.daily)[number]) => number | null) => v.daily.filter((r) => !r.metaMissing).map((r) => fn(r) ?? 0);
  const crossNote = v.crossTo < st.to ? `até ${shortDay(v.crossTo)} (último dia do Meta)` : undefined;
  const noData = meta.length === 0 && sales.length === 0;
  const ytSales = cur.all.youtube;

  return (
    <div className="cmp-wrap">
      {/* ---------- topo ---------- */}
      <header className="cmp-hero">
        <div className="cmp-hero__text">
          <p className="cmp-kicker">
            <span className="cmp-live" aria-hidden="true" />
            Meta Ads × Hotmart · Redes para Igrejas
          </p>
          <h1>Campanhas</h1>
          <p className="cmp-hero__meta">
            <span>
              Meta até <b>{metaLast ? fullDay(metaLast) : "—"}</b>
            </span>
            <span>
              Hotmart até <b>{salesLast ? fullDay(salesLast) : "—"}</b>
            </span>
            {lastImport && (
              <span>
                Última importação <b>{new Date(lastImport.createdAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</b>
              </span>
            )}
          </p>
        </div>
        <div className="cmp-hero__actions">
          <button type="button" className="cmp-btn cmp-btn--primary" onClick={() => setDialog("import")}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 15V3m0 0L7 8m5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
            </svg>
            Importar CSVs
          </button>
          <button type="button" className="cmp-btn cmp-btn--ghost" onClick={() => setDialog("settings")}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />
            </svg>
            Premissas
          </button>
          <button type="button" className="cmp-btn cmp-btn--ghost" onClick={exportCsv} disabled={!v.daily.length}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m0 0-5-5m5 5 5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            CSV do período
          </button>
        </div>
      </header>

      {/* ---------- filtros ---------- */}
      <div className="cmp-filters">
        <div className="cmp-filters__row">
          <Segmented label="Período" options={PRESETS} value={st.preset} onChange={setPreset} />
          {st.preset === "custom" && (
            <span className="cmp-dates">
              <input type="date" value={st.from} max={st.to} onChange={(e) => e.target.value && patch({ from: e.target.value })} aria-label="De" />
              <span>até</span>
              <input type="date" value={st.to} min={st.from} onChange={(e) => e.target.value && patch({ to: e.target.value })} aria-label="Até" />
            </span>
          )}
          <label className={`cmp-switch${st.compare ? " is-on" : ""}`}>
            <input type="checkbox" checked={st.compare} onChange={(e) => patch({ compare: e.target.checked })} />
            <span aria-hidden="true" />
            Comparar com {fullDay(v.prevR.from).slice(0, 5)}–{fullDay(v.prevR.to).slice(0, 5)}
          </label>
        </div>
        <div className="cmp-filters__row">
          <MultiSelect label="Campanha" options={opt.camps.map((c) => ({ id: c, label: c || "(sem campanha)" }))} value={st.campaigns} onChange={(campaigns) => patch({ campaigns, adsets: [], ads: [] })} all="Todas" />
          <MultiSelect label="Conjunto" options={opt.adsets.map((c) => ({ id: c, label: c }))} value={st.adsets} onChange={(adsets) => patch({ adsets, ads: [] })} />
          <MultiSelect label="Anúncio" options={opt.ads.map((c) => ({ id: c, label: c }))} value={st.ads} onChange={(ads) => patch({ ads })} />
          <MultiSelect
            label="Origem"
            options={opt.origins.map((o) => ({ id: o, label: ORIGIN_LABEL[o] ?? o, hint: o }))}
            value={st.origins}
            onChange={(origins) => patch({ origins })}
            all="Todas"
          />
          <label className={`cmp-select${st.coupon ? " is-active" : ""}`}>
            <span>Cupom</span>
            <select value={st.coupon} onChange={(e) => patch({ coupon: e.target.value })}>
              <option value="">Todos</option>
              <option value="com">Com cupom</option>
              <option value="sem">Sem cupom</option>
              {opt.coupons.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <MultiSelect label="Pagamento" options={opt.pays.map((p) => ({ id: p, label: p }))} value={st.payments} onChange={(payments) => patch({ payments })} />
          {activeFilters > 0 && (
            <button type="button" className="cmp-clear" onClick={() => patch({ campaigns: [], adsets: [], ads: [], origins: [], coupon: "", payments: [] })}>
              Limpar filtros ({activeFilters})
            </button>
          )}
        </div>
        {(metaFiltered || salesFiltered) && (
          <p className="cmp-filters__note">
            {metaFiltered && "Campanha/conjunto/anúncio filtram os dados do Meta; a Hotmart não sabe de qual anúncio veio cada venda. "}
            {salesFiltered && "Origem, cupom e pagamento filtram as vendas da Hotmart."}
          </p>
        )}
      </div>

      {noData ? (
        <section className="cmp-card cmp-onboard">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M24 30V8m0 0-8 8m8-8 8 8M8 30v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6" />
          </svg>
          <h2>Importe os dois CSVs para começar</h2>
          <p>Meta (nível Anúncios, por dia) e Hotmart (histórico de vendas). Depois é só repetir todo dia: nada duplica.</p>
          <button type="button" className="cmp-btn cmp-btn--primary" onClick={() => setDialog("import")}>
            Importar CSVs
          </button>
        </section>
      ) : (
        <>
          {/* ---------- sinal + alertas ---------- */}
          <section className="cmp-top">
            <article className={`cmp-verdict cmp-verdict--${headSignal.code}`}>
              <p className="cmp-kicker">Sinal da conta · janela de 3 dias{headRow ? ` até ${labelDay(headRow.date)}` : ""}</p>
              <SignalBadge signal={headSignal} size="lg" />
              <p className="cmp-verdict__reason">{headSignal.reason}</p>
              <p className="cmp-verdict__hint">{SIGNAL_HINT[headSignal.code](settings)}</p>
              {v.camps.length > 0 && (
                <ul className="cmp-verdict__camps">
                  {v.camps.map((c) => (
                    <li key={c.key}>
                      <span title={c.campaign}>{c.campaign || "(sem campanha)"}</span>
                      <SignalBadge signal={c.signal} />
                    </li>
                  ))}
                </ul>
              )}
            </article>
            <article className="cmp-alerts">
              <p className="cmp-kicker">Alertas</p>
              {alerts.length ? (
                <ul>
                  {alerts.map((a, i) => (
                    <li key={i} className={`cmp-alert cmp-alert--${a.tone}`}>
                      <i aria-hidden="true" />
                      <span>
                        {a.text}
                        {a.where && <small>{a.where}</small>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="cmp-alerts__ok">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  Nada fora do normal.
                </p>
              )}
            </article>
          </section>

          {/* ---------- KPIs ---------- */}
          <section className="cmp-kpis" aria-label="Indicadores do período">
            <Kpi big label="Investido" value={brl(cur.mt.spend)} cur={cur.mt.spend} prev={prev.mt.spend} good={null} compare={st.compare} spark={sp((r) => r.meta.spend)} color="#3b8cff" note={`${int(cur.mt.impressions)} impressões`} />
            <Kpi
              big
              label="Vendas de anúncio"
              value={String(cur.all.adSales)}
              cur={cur.all.adSales}
              prev={prev.all.adSales}
              good
              compare={st.compare}
              spark={v.daily.map((r) => r.sales.adSales)}
              color="#5bd0ff"
              note={`Hotmart · Meta contou ${cur.mt.purchasesMeta}`}
            />
            <Kpi
              big
              label="Lucro do anúncio"
              value={brl(cur.d.profitAd)}
              cur={cur.d.profitAd}
              prev={prev.d.profitAd}
              good
              compare={st.compare}
              spark={sp((r) => r.d.profitAd)}
              color="#34d399"
              tone={cur.d.profitAd >= 0 ? "good" : "bad"}
              note={crossNote ?? "líquido das vendas de anúncio − investido"}
            />
            <Kpi
              big
              label="CPA real"
              value={brl(cur.d.cpaReal)}
              cur={cur.d.cpaReal}
              prev={prev.d.cpaReal}
              good={false}
              compare={st.compare}
              spark={sp((r) => r.d.cpaReal)}
              color="#c4b5fd"
              tone={cpaTone(cur.d.cpaReal)}
              note={crossNote ?? `alvo ${brl(settings.cpaTarget)} · máx. ${brl(settings.cpaMax)}`}
            />
            <Kpi label="Vendas totais" value={String(cur.all.approved)} cur={cur.all.approved} prev={prev.all.approved} good compare={st.compare} note={`${cur.all.siteSales} site · ${cur.all.adSales} anúncio${cur.all.otherSales + cur.all.unknownSales ? ` · ${cur.all.otherSales + cur.all.unknownSales} outras` : ""}`} />
            <Kpi label="Líquido" value={brl(cur.all.net)} cur={cur.all.net} prev={prev.all.net} good compare={st.compare} note={`ticket ${brl(cur.d.ticket)}`} />
            <Kpi label="ROAS líquido" value={roas(cur.d.roasReal)} cur={cur.d.roasReal} prev={prev.d.roasReal} good compare={st.compare} tone={cur.d.roasReal === null ? "" : cur.d.roasReal >= 1 ? "good" : "bad"} note="líquido ÷ investido" />
            <Kpi label="CTR (link)" value={pct(cur.d.ctr, 2)} cur={cur.d.ctr} prev={prev.d.ctr} good compare={st.compare} mode="pp" note={`CPC ${brl(cur.d.cpc)}`} tone={cur.d.ctr !== null && cur.d.ctr * 100 < settings.ctrMin ? "bad" : ""} />
            <Kpi label="Taxa de gancho" value={pct(cur.d.hook)} cur={cur.d.hook} prev={prev.d.hook} good compare={st.compare} mode="pp" note="vídeo 3 s ÷ impressões" tone={cur.d.hook !== null && cur.d.hook * 100 < settings.hookMin ? "mid" : ""} />
          </section>
          <p className="cmp-mini">
            {cur.all.refunds > 0 && <span className="is-bad">{cur.all.refunds} reembolso(s) · {brl(cur.all.refundValue)}</span>}
            <span>Pix {pct(cur.all.approved ? cur.all.pix / cur.all.approved : null, 0)}</span>
            <span>parcelas médias {cur.all.installmentsAvg ? cur.all.installmentsAvg.toFixed(1).replace(".", ",") : "—"}</span>
            {ytSales > 0 && <span>{ytSales} com cupom do YouTube</span>}
            <span>clique → venda {pct(cur.d.clickToSale, 2)}</span>
            <span>frequência {cur.d.frequency ? cur.d.frequency.toFixed(2).replace(".", ",") : "—"} (aprox.)</span>
          </p>

          {/* ---------- gráfico principal ---------- */}
          <Card kicker="Dia a dia" title="Investimento × vendas × CPA" aside={<span className="cmp-muted">{v.daily.length} dias</span>}>
            <DailyChart rows={v.daily} settings={settings} />
          </Card>

          <div className="cmp-grid2">
            <Card kicker="Resultado" title="Lucro acumulado">
              <ProfitChart rows={v.daily} />
            </Card>
            <Card kicker="Caminho do cliente" title="Funil do período">
              <Funnel steps={v.fun} />
            </Card>
          </div>

          <Card kicker="Criativos" title="Comparação de anúncios" aside={<span className="cmp-muted">clique no título da coluna para ordenar</span>}>
            <GroupTable rows={v.ads} settings={settings} level="ad" />
          </Card>

          <Card kicker="Campanhas" title="Principal × teste">
            <GroupTable rows={v.camps} settings={settings} level="campaign" />
          </Card>

          <div className="cmp-grid2">
            <Card kicker="Vendas" title="Origem, botão, cupom e pagamento">
              <div className="cmp-quad">
                <div>
                  <p className="cmp-sub">Origem</p>
                  <BarList items={v.byOrigin} />
                </div>
                <div>
                  <p className="cmp-sub">Botão da página</p>
                  <BarList items={v.byButton} />
                </div>
                <div>
                  <p className="cmp-sub">Cupom</p>
                  <BarList items={v.byCoupon} tag={(s) => (settings.youtubeCoupons.includes(s.key) ? <em className="cmp-tag cmp-tag--yt">YouTube</em> : null)} />
                </div>
                <div>
                  <p className="cmp-sub">Pagamento</p>
                  <BarList items={v.byPayment} />
                </div>
              </div>
            </Card>
            <Card kicker="Quando compram" title="Horário das vendas">
              <HourBars grid={v.heat} />
              <p className="cmp-sub">Dia da semana × hora</p>
              <Heatmap grid={v.heat} />
            </Card>
          </div>

          <Card
            kicker="Tabela"
            title="Dia a dia completo"
            aside={
              <button type="button" className="cmp-btn cmp-btn--ghost cmp-btn--sm" onClick={exportCsv}>
                Exportar CSV
              </button>
            }
          >
            <DailyTable rows={v.daily} settings={settings} />
          </Card>

          <Card kicker="Hotmart" title="Vendas do período">
            <SalesList sales={v.salesP as SaleX[]} />
          </Card>
        </>
      )}

      <Card kicker="Histórico" title="Importações" className="cmp-card--quiet">
        {imports.length ? (
          <ul className="cmp-imports">
            {imports.map((i, k) => (
              <li key={k}>
                <span className={`cmp-file__kind cmp-file__kind--${i.kind}`}>{i.kind === "meta" ? "Meta" : "Hotmart"}</span>
                <span className="cmp-imports__name" title={i.fileName}>
                  {i.fileName || "arquivo"}
                </span>
                <span className="cmp-muted">
                  {fullDay(i.periodFrom).slice(0, 5)}–{fullDay(i.periodTo).slice(0, 5)}
                </span>
                <span>
                  <b>{i.created}</b> novas · <b>{i.updated}</b> atualizadas{i.ignored ? ` · ${i.ignored} ignoradas` : ""}
                </span>
                <span className="cmp-muted">{new Date(i.createdAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cmp-empty">Nenhuma importação ainda.</p>
        )}
      </Card>

      {dialog === "import" && <ImportDialog onClose={() => setDialog(null)} onDone={refresh} />}
      {dialog === "settings" && <SettingsPanel settings={settings} onClose={() => setDialog(null)} onSaved={refresh} />}
    </div>
  );
}
