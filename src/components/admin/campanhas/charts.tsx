"use client";

import { useState, type ReactNode } from "react";
import { labelDay, shortDay, WEEKDAYS } from "@/lib/campanhas/dates";
import { brl, brlShort, int, pct } from "@/lib/campanhas/format";
import type { DayRow, FunnelStep, Slice } from "@/lib/campanhas/metrics";
import type { CampaignSettings } from "@/lib/campanhas/types";
import { SignalBadge, useWidth } from "./ui";

/* ---------------- escalas ---------------- */

function niceMax(v: number, ticks = 4): number {
  if (!(v > 0)) return ticks;
  const raw = v / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  return step * ticks;
}

const C = {
  spend: "#3b8cff",
  sales: "#5bd0ff",
  cpa: "#c4b5fd",
  target: "#34d399",
  max: "#ff6b7a",
  profit: "#34d399",
  total: "#5bd0ff",
  grid: "rgba(148, 170, 214, 0.12)",
  axis: "#7f8fb3",
};

function Tooltip({ x, w, children }: { x: number; w: number; children: ReactNode }) {
  const left = Math.min(Math.max(x, 110), Math.max(110, w - 110));
  return (
    <div className="cmp-tip" style={{ left }}>
      {children}
    </div>
  );
}

/* ---------------- gráfico diário principal ---------------- */

export function DailyChart({
  rows,
  settings,
  notes = {},
  onNote,
}: {
  rows: DayRow[];
  settings: CampaignSettings;
  notes?: Record<string, string>;
  onNote?: (day: string) => void;
}) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const h = w < 560 ? 250 : 320;
  const pad = { l: w < 560 ? 44 : 58, r: w < 560 ? 30 : 44, t: 30, b: 34 };
  const iw = Math.max(10, w - pad.l - pad.r);
  const ih = h - pad.t - pad.b;
  const n = rows.length || 1;
  const bw = iw / n;
  const barW = Math.max(4, Math.min(34, bw * 0.56));
  const moneyMax = niceMax(Math.max(settings.cpaMax * 1.12, ...rows.map((r) => Math.max(r.meta.spend, r.d.cpaReal ?? 0))));
  const salesMax = niceMax(Math.max(4, ...rows.map((r) => r.sales.adSales)));
  const xm = (i: number) => pad.l + bw * i + bw / 2;
  const ym = (v: number) => pad.t + ih - (v / moneyMax) * ih;
  const ys = (v: number) => pad.t + ih - (v / salesMax) * ih;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const every = Math.ceil(n / Math.max(1, Math.floor(iw / 54)));

  const salesPts = rows.map((r, i) => `${xm(i)},${ys(r.sales.adSales)}`).join(" ");
  // CPA real: segmentos só onde existe
  const cpaPaths: string[] = [];
  let seg = "";
  rows.forEach((r, i) => {
    if (r.d.cpaReal === null) {
      if (seg) cpaPaths.push(seg);
      seg = "";
      return;
    }
    seg += `${seg ? "L" : "M"}${xm(i)},${ym(Math.min(r.d.cpaReal, moneyMax))}`;
  });
  if (seg) cpaPaths.push(seg);
  const cur = hover !== null ? rows[hover] : null;

  return (
    <div className="cmp-chart" ref={ref} onMouseLeave={() => setHover(null)}>
      {w > 0 && (
        <svg width={w} height={h} role="img" aria-label="Investimento, vendas de anúncio e CPA real por dia">
          <defs>
            <linearGradient id="cmp-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.spend} stopOpacity="0.95" />
              <stop offset="1" stopColor={C.spend} stopOpacity="0.35" />
            </linearGradient>
            <pattern id="cmp-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(148,170,214,0.18)" strokeWidth="2" />
            </pattern>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={pad.l + iw} y1={pad.t + ih * (1 - t)} y2={pad.t + ih * (1 - t)} stroke={C.grid} />
              <text x={pad.l - 8} y={pad.t + ih * (1 - t) + 4} textAnchor="end" className="cmp-axis">
                {brlShort(moneyMax * t).replace(",00", "")}
              </text>
              <text x={pad.l + iw + 8} y={pad.t + ih * (1 - t) + 4} className="cmp-axis cmp-axis--sales">
                {Math.round(salesMax * t)}
              </text>
            </g>
          ))}
          {rows.map((r, i) =>
            r.metaMissing ? <rect key={`m${r.date}`} x={pad.l + bw * i + 1} y={pad.t} width={bw - 2} height={ih} fill="url(#cmp-hatch)" rx="4" /> : null,
          )}
          {hover !== null && <rect x={pad.l + bw * hover} y={pad.t} width={bw} height={ih} fill="rgba(91,208,255,0.07)" rx="6" />}
          {rows.map((r, i) => {
            const y = ym(r.meta.spend);
            const hh = pad.t + ih - y;
            if (hh <= 0) return null;
            const x = xm(i) - barW / 2;
            const rr = Math.min(5, barW / 2, hh);
            return (
              <path
                key={r.date}
                d={`M${x},${pad.t + ih}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + barW - rr}Q${x + barW},${y} ${x + barW},${y + rr}V${pad.t + ih}Z`}
                fill="url(#cmp-bar)"
              />
            );
          })}
          {[
            { v: settings.cpaTarget, c: C.target, t: "alvo" },
            { v: settings.cpaMax, c: C.max, t: "máx." },
          ].map((l) =>
            l.v <= moneyMax ? (
              <g key={l.t}>
                <line x1={pad.l} x2={pad.l + iw} y1={ym(l.v)} y2={ym(l.v)} stroke={l.c} strokeDasharray="5 5" strokeOpacity="0.75" />
                <text x={pad.l + 6} y={ym(l.v) - 5} className="cmp-axis" fill={l.c} style={{ fill: l.c }}>
                  CPA {l.t} {brl(l.v)}
                </text>
              </g>
            ) : null,
          )}
          {cpaPaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.cpa} strokeWidth="2" strokeDasharray="1 0" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {rows.map((r, i) =>
            r.d.cpaReal !== null ? <circle key={`c${r.date}`} cx={xm(i)} cy={ym(Math.min(r.d.cpaReal, moneyMax))} r="3" fill="#0b1428" stroke={C.cpa} strokeWidth="2" /> : null,
          )}
          <polyline points={salesPts} fill="none" stroke={C.sales} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {rows.map((r, i) => (
            <g key={`s${r.date}`}>
              <circle cx={xm(i)} cy={ys(r.sales.adSales)} r={hover === i ? 5 : 3.5} fill={C.sales} stroke="#050a18" strokeWidth="2" />
              {r.sales.adSales > 0 && n <= 21 && (
                <text x={xm(i)} y={ys(r.sales.adSales) - 9} textAnchor="middle" className="cmp-val">
                  {r.sales.adSales}
                </text>
              )}
            </g>
          ))}
          {rows.map((r, i) =>
            i % every === 0 || i === n - 1 ? (
              <text key={`x${r.date}`} x={xm(i)} y={h - 12} textAnchor="middle" className="cmp-axis">
                {shortDay(r.date)}
              </text>
            ) : null,
          )}
          {rows.map((r, i) => (
            <rect
              key={`h${r.date}`}
              x={pad.l + bw * i}
              y={pad.t}
              width={bw}
              height={ih}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onClick={() => setHover(i)}
              onDoubleClick={() => onNote?.(r.date)}
            />
          ))}
          {rows.map((r, i) =>
            notes[r.date] ? (
              <g
                key={`n${r.date}`}
                className="cmp-note-pin"
                transform={`translate(${xm(i)} ${pad.t - 14})`}
                onMouseEnter={() => setHover(i)}
                onClick={() => onNote?.(r.date)}
                role="button"
                aria-label={`Anotação de ${labelDay(r.date)}`}
              >
                <line x1="0" y1="8" x2="0" y2={ih + 14} stroke="rgba(255,212,59,0.28)" strokeDasharray="2 4" />
                <rect x="-9" y="-9" width="18" height="18" rx="6" fill="#ffd43b" />
                <path d="M-4 -3h8M-4 1h8M-4 5h5" stroke="#3a2a00" strokeWidth="1.6" strokeLinecap="round" />
              </g>
            ) : null,
          )}
        </svg>
      )}
      {cur && hover !== null && (
        <Tooltip x={xm(hover)} w={w}>
          <p className="cmp-tip__title">{labelDay(cur.date)}</p>
          <dl>
            <dt>
              <i style={{ background: C.spend }} />
              Investido
            </dt>
            <dd>{cur.metaMissing ? "sem dados" : brl(cur.meta.spend)}</dd>
            <dt>
              <i style={{ background: C.sales }} />
              Vendas anúncio
            </dt>
            <dd>{cur.sales.adSales}</dd>
            <dt>Compras Meta</dt>
            <dd>{cur.metaMissing ? "—" : cur.meta.purchasesMeta}</dd>
            <dt>
              <i style={{ background: C.cpa }} />
              CPA real
            </dt>
            <dd>{brl(cur.d.cpaReal)}</dd>
            <dt>CPA 3 dias</dt>
            <dd>{brl(cur.cpa3)}</dd>
            <dt>Lucro anúncio</dt>
            <dd className={cur.d.profitAd >= 0 ? "is-good" : "is-bad"}>{cur.metaMissing ? "—" : brl(cur.d.profitAd)}</dd>
          </dl>
          <SignalBadge signal={cur.signal} />
          {notes[cur.date] && <p className="cmp-tip__note">{notes[cur.date]}</p>}
        </Tooltip>
      )}
      <ul className="cmp-legend">
        <li>
          <i className="cmp-legend__bar" style={{ background: C.spend }} />
          Investido (R$)
        </li>
        <li>
          <i className="cmp-legend__line" style={{ background: C.sales }} />
          Vendas de anúncio (Hotmart)
        </li>
        <li>
          <i className="cmp-legend__line" style={{ background: C.cpa }} />
          CPA real
        </li>
        <li>
          <i className="cmp-legend__dash" style={{ borderColor: C.target }} />
          CPA alvo
        </li>
        <li>
          <i className="cmp-legend__dash" style={{ borderColor: C.max }} />
          CPA máximo
        </li>
        {rows.some((r) => r.metaMissing) && (
          <li>
            <i className="cmp-legend__hatch" />
            Sem dados do Meta
          </li>
        )}
        <li>
          <i className="cmp-legend__note" />
          Anotação (dois cliques no dia para escrever)
        </li>
      </ul>
    </div>
  );
}

/* ---------------- lucro acumulado ---------------- */

export function ProfitChart({ rows }: { rows: DayRow[] }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const data = rows.filter((r) => !r.metaMissing);
  let a = 0;
  let t = 0;
  const pts = data.map((r) => {
    a += r.d.profitAd;
    t += r.d.profitTotal;
    return { date: r.date, ad: Math.round(a * 100) / 100, total: Math.round(t * 100) / 100 };
  });
  const h = w < 560 ? 220 : 290;
  const pad = { l: 58, r: 14, t: 16, b: 30 };
  const iw = Math.max(10, w - pad.l - pad.r);
  const ih = h - pad.t - pad.b;
  const hi = niceMax(Math.max(10, ...pts.map((p) => Math.max(p.ad, p.total))));
  const lo = Math.min(0, ...pts.map((p) => Math.min(p.ad, p.total)));
  // prejuízo de centavos não abre eixo negativo
  const loN = lo < -0.5 ? -niceMax(-lo, 2) : 0;
  const n = Math.max(1, pts.length - 1);
  const x = (i: number) => pad.l + (pts.length === 1 ? iw / 2 : (iw * i) / n);
  const y = (v: number) => pad.t + ih - ((Math.max(v, loN) - loN) / (hi - loN)) * ih;
  const line = (k: "ad" | "total") => pts.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[k])}`).join("");
  const area = pts.length ? `${line("ad")}L${x(pts.length - 1)},${y(0)}L${x(0)},${y(0)}Z` : "";
  const last = pts[pts.length - 1];
  const good = !last || last.ad >= 0;
  const cur = hover !== null ? pts[hover] : null;
  if (!pts.length) return <p className="cmp-empty">Sem dias com investimento no período.</p>;
  return (
    <div className="cmp-chart" ref={ref} onMouseLeave={() => setHover(null)}>
      {w > 0 && (
        <svg width={w} height={h} role="img" aria-label="Lucro acumulado no período">
          <defs>
            <linearGradient id="cmp-profit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={good ? C.profit : C.max} stopOpacity="0.38" />
              <stop offset="1" stopColor={good ? C.profit : C.max} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...(loN < 0 ? [loN] : []), 0, hi / 2, hi].map((v) => {
            return (
              <g key={v}>
                <line x1={pad.l} x2={pad.l + iw} y1={y(v)} y2={y(v)} stroke={C.grid} />
                <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="cmp-axis">
                  {brlShort(v).replace(",00", "")}
                </text>
              </g>
            );
          })}
          <line x1={pad.l} x2={pad.l + iw} y1={y(0)} y2={y(0)} stroke="rgba(234,240,255,0.35)" />
          <path d={area} fill="url(#cmp-profit)" />
          <path d={line("total")} fill="none" stroke={C.total} strokeWidth="2" strokeDasharray="6 5" />
          <path d={line("ad")} fill="none" stroke={good ? C.profit : C.max} strokeWidth="2.5" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <circle key={p.date} cx={x(i)} cy={y(p.ad)} r={hover === i ? 5 : 3} fill={good ? C.profit : C.max} stroke="#050a18" strokeWidth="2" />
          ))}
          {pts.map((p, i) =>
            i === 0 || i === pts.length - 1 || pts.length <= 8 ? (
              <text key={`x${p.date}`} x={x(i)} y={h - 10} textAnchor="middle" className="cmp-axis">
                {shortDay(p.date)}
              </text>
            ) : null,
          )}
          {pts.map((p, i) => (
            <rect key={`h${p.date}`} x={x(i) - iw / (2 * Math.max(1, n))} y={pad.t} width={iw / Math.max(1, n)} height={ih} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
        </svg>
      )}
      {cur && hover !== null && (
        <Tooltip x={x(hover)} w={w}>
          <p className="cmp-tip__title">até {labelDay(cur.date)}</p>
          <dl>
            <dt>
              <i style={{ background: C.profit }} />
              Lucro do anúncio
            </dt>
            <dd className={cur.ad >= 0 ? "is-good" : "is-bad"}>{brl(cur.ad)}</dd>
            <dt>
              <i style={{ background: C.total }} />
              Lucro total
            </dt>
            <dd className={cur.total >= 0 ? "is-good" : "is-bad"}>{brl(cur.total)}</dd>
          </dl>
        </Tooltip>
      )}
      <ul className="cmp-legend">
        <li>
          <i className="cmp-legend__line" style={{ background: C.profit }} />
          Lucro do anúncio (líquido − investido)
        </li>
        <li>
          <i className="cmp-legend__dash" style={{ borderColor: C.total }} />
          Lucro total (todas as vendas)
        </li>
      </ul>
    </div>
  );
}

/* ---------------- mini gráfico ---------------- */

export function Sparkline({ values, color = C.sales, height = 30 }: { values: number[]; color?: string; height?: number }) {
  if (values.length < 2) return <span className="cmp-spark cmp-spark--empty" />;
  const max = Math.max(...values, 0.0001);
  const min = Math.min(0, ...values);
  const W = 100;
  const pts = values.map((v, i) => [(W * i) / (values.length - 1), height - 2 - ((v - min) / (max - min || 1)) * (height - 4)]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join("");
  return (
    <svg className="cmp-spark" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d}L${W},${height}L0,${height}Z`} fill={color} fillOpacity="0.14" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- funil ---------------- */

export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  const scale = (v: number) => (v <= 0 ? 0 : Math.max(0.035, Math.log10(v + 1) / Math.log10(max + 1)));
  return (
    <ol className="cmp-funnel">
      {steps.map((s, i) => (
        <li key={s.key} style={{ "--i": i } as React.CSSProperties}>
          <div className="cmp-funnel__row">
            <span className="cmp-funnel__label">{s.label}</span>
            <strong className="cmp-funnel__value">{int(s.value)}</strong>
          </div>
          <div className="cmp-funnel__track">
            <span className="cmp-funnel__bar" style={{ width: `${scale(s.value) * 100}%` }} />
            {s.rate !== null && (
              <span className={`cmp-funnel__rate${s.key === "lpv" && s.rate < 0.5 ? " is-bad" : ""}`}>
                {s.rateLabel} {pct(s.rate)}
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- listas com barras ---------------- */

export function BarList({ items: all, tag, empty = "Sem vendas.", limit = 6 }: { items: Slice[]; tag?: (s: Slice) => ReactNode; empty?: string; limit?: number }) {
  if (!all.length) return <p className="cmp-empty">{empty}</p>;
  // muitas linhas: as maiores e o resto somado em "outros"
  const items =
    all.length > limit
      ? [
          ...all.slice(0, limit - 1),
          all.slice(limit - 1).reduce<Slice>((a, x) => ({ ...a, count: a.count + x.count, net: Math.round((a.net + x.net) * 100) / 100 }), {
            key: "__outros",
            label: `outros (${all.length - limit + 1})`,
            count: 0,
            net: 0,
          }),
        ]
      : all;
  const max = Math.max(...items.map((i) => i.count));
  const total = items.reduce((a, i) => a + i.count, 0);
  return (
    <ul className="cmp-bars">
      {items.map((it) => (
        <li key={it.key}>
          <div className="cmp-bars__top">
            <span className="cmp-bars__label">
              {it.label}
              {tag?.(it)}
            </span>
            <span className="cmp-bars__num">
              <strong>{it.count}</strong> <small>{pct(it.count / total, 0)}</small>
            </span>
          </div>
          <div className="cmp-bars__track">
            <span style={{ width: `${(it.count / max) * 100}%` }} />
          </div>
          <small className="cmp-bars__net">{brl(it.net)} líquido</small>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- horários ---------------- */

export function HourBars({ grid }: { grid: number[][] }) {
  const hours = Array.from({ length: 24 }, (_, h) => grid.reduce((a, row) => a + row[h], 0));
  const max = Math.max(1, ...hours);
  const peak = hours.indexOf(Math.max(...hours));
  return (
    <div className="cmp-hours" role="img" aria-label="Vendas por hora do dia">
      {hours.map((v, h) => (
        <div key={h} className={`cmp-hours__col${h === peak && v > 0 ? " is-peak" : ""}`} title={`${h}h: ${v} venda(s)`}>
          <span className="cmp-hours__bar" style={{ height: `${(v / max) * 100}%` }}>
            {v > 0 && <em>{v}</em>}
          </span>
          <small>{h % 3 === 0 ? `${h}h` : ""}</small>
        </div>
      ))}
    </div>
  );
}

export function Heatmap({ grid }: { grid: number[][] }) {
  const max = Math.max(1, ...grid.flat());
  // segunda a domingo
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <div className="cmp-heat" role="img" aria-label="Vendas por dia da semana e hora">
      {order.map((d) => (
        <div key={d} className="cmp-heat__row">
          <span className="cmp-heat__day">{WEEKDAYS[d]}</span>
          {grid[d].map((v, h) => (
            <span key={h} className="cmp-heat__cell" style={{ "--a": v / max } as React.CSSProperties} title={`${WEEKDAYS[d]} ${h}h: ${v}`} />
          ))}
          <span className="cmp-heat__sum">{grid[d].reduce((a, b) => a + b, 0)}</span>
        </div>
      ))}
      <div className="cmp-heat__row cmp-heat__row--axis">
        <span className="cmp-heat__day" />
        {Array.from({ length: 24 }, (_, h) => (
          <span key={h} className="cmp-heat__h">
            {h % 6 === 0 ? h : ""}
          </span>
        ))}
        <span className="cmp-heat__sum" />
      </div>
    </div>
  );
}
