"use client";

import { useMemo, useState, type ReactNode } from "react";
import { fullDay, labelDay } from "@/lib/campanhas/dates";
import { brl, dec, int, pct, roas } from "@/lib/campanhas/format";
import type { DayRow, GroupRow, SaleX } from "@/lib/campanhas/metrics";
import { ORIGIN_LABEL, type CampaignSettings } from "@/lib/campanhas/types";
import { Sparkline } from "./charts";
import { SignalBadge } from "./ui";

type Col<T> = {
  key: string;
  label: string;
  get: (r: T) => number | string | null;
  show?: (r: T) => ReactNode;
  num?: boolean;
  title?: string;
};

function useSort<T>(rows: T[], cols: Col<T>[], initial: string, dir: 1 | -1 = -1) {
  const [key, setKey] = useState(initial);
  const [d, setD] = useState<1 | -1>(dir);
  const sorted = useMemo(() => {
    const c = cols.find((x) => x.key === key);
    if (!c) return rows;
    return [...rows].sort((a, b) => {
      const va = c.get(a);
      const vb = c.get(b);
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return (va > vb ? 1 : va < vb ? -1 : 0) * d;
    });
  }, [rows, cols, key, d]);
  const head = (c: Col<T>) => (
    <th key={c.key} className={c.num ? "is-num" : ""} title={c.title} aria-sort={key === c.key ? (d === 1 ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={() => {
          if (key === c.key) setD((x) => (x === 1 ? -1 : 1));
          else {
            setKey(c.key);
            setD(c.num ? -1 : 1);
          }
        }}
      >
        {c.label}
        <span className="cmp-sort" aria-hidden="true">
          {key === c.key ? (d === 1 ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
  return { sorted, head };
}

const cpaClass = (v: number | null, s: CampaignSettings) => (v === null ? "" : v <= s.cpaTarget ? "is-good" : v <= s.cpaMax ? "is-mid" : "is-bad");

/* ---------------- anúncios / campanhas ---------------- */

export function GroupTable({ rows, settings, level }: { rows: GroupRow[]; settings: CampaignSettings; level: "ad" | "campaign" }) {
  const cpaOf = (r: GroupRow) => (r.realSales !== null ? r.d.cpaReal : r.d.cpaMeta);
  const eligible = rows.filter((r) => r.meta.spend >= settings.waitSpend);
  const withCpa = eligible.filter((r) => cpaOf(r) !== null);
  const best = withCpa.length > 1 ? withCpa.reduce((a, b) => ((cpaOf(b) ?? Infinity) < (cpaOf(a) ?? Infinity) ? b : a)).key : null;
  const worstPool = eligible.filter((r) => r.key !== best);
  // pior: maior CPA (sem venda conta como o pior); empate → quem gastou mais
  const worst =
    eligible.length > 1 && worstPool.length
      ? [...worstPool].sort((a, b) => (cpaOf(b) ?? Infinity) - (cpaOf(a) ?? Infinity) || b.meta.spend - a.meta.spend)[0].key
      : null;

  const cols: Col<GroupRow>[] = [
    {
      key: "name",
      label: level === "ad" ? "Anúncio" : "Campanha",
      get: (r) => (level === "ad" ? r.ad : r.campaign),
      show: (r) => (
        <div className="cmp-name">
          <strong>
            {level === "ad" ? r.ad : r.campaign || "(sem campanha)"}
            {r.key === best && <em className="cmp-tag cmp-tag--best">melhor</em>}
            {r.key === worst && <em className="cmp-tag cmp-tag--worst">pior</em>}
          </strong>
          {level === "ad" && (
            <small>
              {r.campaign} · {r.adset}
            </small>
          )}
          {r.alerts.length > 0 && (
            <span className="cmp-name__alerts">
              {r.alerts.map((a) => (
                <em key={a.code} className={`cmp-alert-chip cmp-alert-chip--${a.tone}`}>
                  {a.text}
                </em>
              ))}
            </span>
          )}
        </div>
      ),
    },
    { key: "spark", label: "Gasto/dia", get: (r) => r.meta.spend, show: (r) => <Sparkline values={r.spark} color="#3b8cff" /> },
    { key: "spend", label: "Investido", get: (r) => r.meta.spend, show: (r) => brl(r.meta.spend), num: true },
    { key: "imp", label: "Impr.", get: (r) => r.meta.impressions, show: (r) => int(r.meta.impressions), num: true },
    { key: "ctr", label: "CTR", get: (r) => r.d.ctr, show: (r) => pct(r.d.ctr, 2), num: true, title: "Cliques no link ÷ impressões" },
    { key: "cpc", label: "CPC", get: (r) => r.d.cpc, show: (r) => brl(r.d.cpc), num: true },
    { key: "hook", label: "Gancho", get: (r) => r.d.hook, show: (r) => pct(r.d.hook), num: true, title: "Vídeo 3 s ÷ impressões" },
    { key: "ret", label: "Ret. 50%", get: (r) => r.d.ret50, show: (r) => pct(r.d.ret50, 0), num: true, title: "50% do vídeo ÷ vídeo 3 s" },
    { key: "pm", label: "Compras Meta", get: (r) => r.meta.purchasesMeta, show: (r) => int(r.meta.purchasesMeta), num: true },
    {
      key: "cpa",
      label: "CPA",
      get: (r) => cpaOf(r),
      show: (r) => (
        <span className={`cmp-cpa ${cpaClass(cpaOf(r), settings)}`} title={r.realSales !== null ? "CPA real (vendas Hotmart)" : "CPA pelas compras do Meta"}>
          {brl(cpaOf(r))}
          <small>{r.realSales !== null ? `${r.realSales} Hotmart` : "Meta"}</small>
        </span>
      ),
      num: true,
    },
    { key: "freq", label: "Freq.", get: (r) => r.d.frequency, show: (r) => dec(r.d.frequency), num: true },
    { key: "sig", label: "Sinal (3 d)", get: (r) => r.signal.code, show: (r) => <SignalBadge signal={r.signal} /> },
    {
      key: "end",
      label: "Status",
      get: (r) => r.endDate,
      show: (r) => (
        <span className="cmp-status">
          <i className={`cmp-dot cmp-dot--${/active|ativ/i.test(r.status) ? "on" : "off"}`} />
          {/active/i.test(r.status) ? "ativo" : r.status || "—"}
          {r.endDate && <small>até {fullDay(r.endDate).slice(0, 5)}</small>}
        </span>
      ),
    },
  ];
  const { sorted, head } = useSort(rows, cols, "spend");
  if (!rows.length) return <p className="cmp-empty">Sem investimento no período.</p>;
  return (
    <div className="cmp-table-wrap">
      <table className="cmp-table">
        <thead>
          <tr>{cols.map(head)}</tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.key} className={r.key === best ? "is-best" : r.key === worst ? "is-worst" : ""}>
              {cols.map((c) => (
                <td key={c.key} className={c.num ? "is-num" : ""}>
                  {c.show ? c.show(r) : String(c.get(r) ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- dia a dia ---------------- */

export function dailyCsv(rows: DayRow[], notes: Record<string, string> = {}): string {
  const n = (v: number | null, d = 2) => (v === null || !Number.isFinite(v) ? "" : v.toFixed(d).replace(".", ","));
  const head = [
    "Data",
    "Investido",
    "Impressões",
    "Cliques no link",
    "CTR (%)",
    "CPC",
    "Gancho (%)",
    "Visitas à página",
    "Checkouts",
    "Compras Meta",
    "Vendas anúncio (Hotmart)",
    "Vendas site",
    "Líquido",
    "Lucro do anúncio",
    "CPA real",
    "ROAS líquido",
    "CPA 3 dias",
    "Sinal",
    "Alertas",
    "Anotação",
  ];
  const lines = rows.map((r) =>
    [
      fullDay(r.date),
      r.metaMissing ? "" : n(r.meta.spend),
      r.meta.impressions,
      r.meta.linkClicks,
      n(r.d.ctr === null ? null : r.d.ctr * 100),
      n(r.d.cpc),
      n(r.d.hook === null ? null : r.d.hook * 100),
      r.meta.landingPageViews,
      r.meta.checkouts,
      r.meta.purchasesMeta,
      r.sales.adSales,
      r.sales.siteSales,
      n(r.sales.net),
      r.metaMissing ? "" : n(r.d.profitAd),
      n(r.d.cpaReal),
      n(r.d.roasReal),
      n(r.cpa3),
      r.signal.label,
      r.alerts.map((a) => a.text).join(" | "),
      notes[r.date] ?? "",
    ]
      .map((v) => {
        const s = String(v);
        return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      })
      .join(";"),
  );
  return "﻿" + [head.join(";"), ...lines].join("\r\n");
}

export function NoteButton({ day, note, onNote }: { day: string; note?: string; onNote: (day: string) => void }) {
  return note ? (
    <button type="button" className="cmp-note" onClick={() => onNote(day)} title="Editar anotação">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4" />
      </svg>
      <span>{note}</span>
    </button>
  ) : (
    <button type="button" className="cmp-note cmp-note--add" onClick={() => onNote(day)}>
      + nota
    </button>
  );
}

export function DailyTable({ rows, settings, notes, onNote }: { rows: DayRow[]; settings: CampaignSettings; notes: Record<string, string>; onNote: (day: string) => void }) {
  const list = [...rows].reverse();
  const tot = rows.reduce(
    (a, r) => {
      if (!r.metaMissing) {
        a.spend += r.meta.spend;
        a.salesCross += r.sales.adSales;
        a.netCross += r.sales.netAd;
      }
      a.imp += r.meta.impressions;
      a.clk += r.meta.linkClicks;
      a.lpv += r.meta.landingPageViews;
      a.chk += r.meta.checkouts;
      a.pm += r.meta.purchasesMeta;
      a.ad += r.sales.adSales;
      a.site += r.sales.siteSales;
      a.net += r.sales.net;
      return a;
    },
    { spend: 0, imp: 0, clk: 0, lpv: 0, chk: 0, pm: 0, ad: 0, site: 0, net: 0, salesCross: 0, netCross: 0 },
  );
  if (!rows.length) return <p className="cmp-empty">Sem dias no período.</p>;
  return (
    <div className="cmp-table-wrap">
      <table className="cmp-table cmp-table--daily">
        <thead>
          <tr>
            <th>Dia</th>
            <th>Anotação</th>
            <th className="is-num">Investido</th>
            <th className="is-num">Impr.</th>
            <th className="is-num">Cliques</th>
            <th className="is-num">CTR</th>
            <th className="is-num">CPC</th>
            <th className="is-num">Gancho</th>
            <th className="is-num" title="Visualizações da página de destino">LPV</th>
            <th className="is-num">Checkouts</th>
            <th className="is-num">Compras Meta</th>
            <th className="is-num">Vendas anúncio</th>
            <th className="is-num">Vendas site</th>
            <th className="is-num">Líquido</th>
            <th className="is-num">Lucro</th>
            <th className="is-num">CPA real</th>
            <th className="is-num">ROAS</th>
            <th className="is-num">CPA 3 d</th>
            <th>Sinal</th>
            <th>Alertas</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.date} className={r.metaMissing ? "is-missing" : ""}>
              <td className="cmp-sticky">{labelDay(r.date)}</td>
              <td className="cmp-note-cell">
                <NoteButton day={r.date} note={notes[r.date]} onNote={onNote} />
              </td>
              <td className="is-num">{r.metaMissing ? <span className="cmp-muted">sem Meta</span> : brl(r.meta.spend)}</td>
              <td className="is-num">{int(r.meta.impressions)}</td>
              <td className="is-num">{int(r.meta.linkClicks)}</td>
              <td className="is-num">{pct(r.d.ctr, 2)}</td>
              <td className="is-num">{brl(r.d.cpc)}</td>
              <td className="is-num">{pct(r.d.hook)}</td>
              <td className="is-num">{int(r.meta.landingPageViews)}</td>
              <td className="is-num">{int(r.meta.checkouts)}</td>
              <td className="is-num">{int(r.meta.purchasesMeta)}</td>
              <td className="is-num">
                <strong>{r.sales.adSales}</strong>
              </td>
              <td className="is-num">{r.sales.siteSales}</td>
              <td className="is-num">{brl(r.sales.net)}</td>
              <td className={`is-num ${r.metaMissing ? "" : r.d.profitAd >= 0 ? "is-good" : "is-bad"}`}>{r.metaMissing ? "—" : brl(r.d.profitAd)}</td>
              <td className={`is-num ${cpaClass(r.d.cpaReal, settings)}`}>{brl(r.d.cpaReal)}</td>
              <td className="is-num">{roas(r.d.roasReal)}</td>
              <td className={`is-num ${cpaClass(r.cpa3, settings)}`}>{brl(r.cpa3)}</td>
              <td>
                <SignalBadge signal={r.signal} />
              </td>
              <td className="cmp-alerts-cell">
                {r.alerts.length ? (
                  r.alerts.map((a) => (
                    <em key={a.code} className={`cmp-alert-chip cmp-alert-chip--${a.tone}`}>
                      {a.text}
                    </em>
                  ))
                ) : (
                  <span className="cmp-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="cmp-sticky">Total</td>
            <td />
            <td className="is-num">{brl(tot.spend)}</td>
            <td className="is-num">{int(tot.imp)}</td>
            <td className="is-num">{int(tot.clk)}</td>
            <td className="is-num">{pct(tot.imp ? tot.clk / tot.imp : null, 2)}</td>
            <td className="is-num">{brl(tot.clk ? tot.spend / tot.clk : null)}</td>
            <td className="is-num">—</td>
            <td className="is-num">{int(tot.lpv)}</td>
            <td className="is-num">{int(tot.chk)}</td>
            <td className="is-num">{int(tot.pm)}</td>
            <td className="is-num">
              <strong>{tot.ad}</strong>
            </td>
            <td className="is-num">{tot.site}</td>
            <td className="is-num">{brl(tot.net)}</td>
            <td className={`is-num ${tot.netCross - tot.spend >= 0 ? "is-good" : "is-bad"}`}>{brl(tot.netCross - tot.spend)}</td>
            <td className={`is-num ${cpaClass(tot.salesCross ? tot.spend / tot.salesCross : null, settings)}`}>{brl(tot.salesCross ? tot.spend / tot.salesCross : null)}</td>
            <td className="is-num">{roas(tot.spend ? tot.netCross / tot.spend : null)}</td>
            <td className="is-num" />
            <td />
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ---------------- vendas ---------------- */

const STATUS_TONE: Record<SaleX["group"], string> = { approved: "good", refund: "bad", pending: "mid", other: "mid" };

export function SalesList({ sales }: { sales: SaleX[] }) {
  const [revealed, setRevealed] = useState<Record<string, { name: string; email: string }> | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(40);
  const list = [...sales].sort((a, b) => (a.soldAt < b.soldAt ? 1 : -1));
  const toggle = async () => {
    if (revealed) return setRevealed(null);
    setLoading(true);
    try {
      const res = await fetch("/api/campaign-imports/reveal", { credentials: "include", cache: "no-store" });
      if (res.ok) setRevealed(await res.json());
    } finally {
      setLoading(false);
    }
  };
  if (!list.length) return <p className="cmp-empty">Nenhuma venda no período e nos filtros.</p>;
  return (
    <>
      <div className="cmp-sales-bar">
        <span className="cmp-muted">{list.length} transação(ões) · compras de teste não aparecem</span>
        <button type="button" className="cmp-btn cmp-btn--ghost cmp-btn--sm" onClick={toggle} disabled={loading} aria-pressed={Boolean(revealed)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {revealed ? <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10 10 0 0 1 12 5c5 0 9 4.5 10 7a13 13 0 0 1-3 4M6.2 6.2A13 13 0 0 0 2 12c1 2.5 5 7 10 7a10 10 0 0 0 4.2-.9" /> : <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />}
          </svg>
          {loading ? "Carregando…" : revealed ? "Ocultar dados" : "Mostrar dados"}
        </button>
      </div>
      <div className="cmp-table-wrap">
        <table className="cmp-table cmp-table--sales">
          <thead>
            <tr>
              <th>Quando</th>
              <th>Comprador</th>
              <th>Origem</th>
              <th>Cupom</th>
              <th>Pagamento</th>
              <th className="is-num">Líquido</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.slice(0, limit).map((x) => {
              const who = revealed?.[x.transactionId];
              return (
                <tr key={x.transactionId}>
                  <td className="cmp-nowrap">
                    {labelDay(x.day)} <small className="cmp-muted">{String(x.hour).padStart(2, "0")}h{x.soldAt.slice(14, 16)}</small>
                  </td>
                  <td>
                    <div className="cmp-name">
                      <strong>{who?.name ?? x.buyerName}</strong>
                      <small>{who?.email ?? x.buyerEmail}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`cmp-origin cmp-origin--${x.originGroup}`}>{ORIGIN_LABEL[x.origin] ?? x.origin ?? "—"}</span>
                    {x.button && <small className="cmp-muted"> · {x.button}</small>}
                    {x.adName && <small className="cmp-muted"> · {x.adName}</small>}
                  </td>
                  <td>
                    {x.coupon ? (
                      <span className="cmp-coupon">
                        {x.coupon}
                        {x.youtube && <em className="cmp-tag cmp-tag--yt">YouTube</em>}
                      </span>
                    ) : (
                      <span className="cmp-muted">—</span>
                    )}
                  </td>
                  <td className="cmp-nowrap">
                    {x.paymentMethod || "—"}
                    {x.installments > 1 && <small className="cmp-muted"> {x.installments}×</small>}
                  </td>
                  <td className="is-num">
                    {brl(x.net)}
                    {x.isBump && <em className="cmp-tag cmp-tag--bump">order bump</em>}
                  </td>
                  <td>
                    <span className={`cmp-pill cmp-pill--${STATUS_TONE[x.group]}`}>{x.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {list.length > limit && (
        <button type="button" className="cmp-btn cmp-btn--ghost cmp-more" onClick={() => setLimit((l) => l + 60)}>
          Ver mais {Math.min(60, list.length - limit)}
        </button>
      )}
    </>
  );
}
