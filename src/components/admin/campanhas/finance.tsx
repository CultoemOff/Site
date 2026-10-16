"use client";

import type { ReactNode } from "react";
import { addDays } from "@/lib/campanhas/dates";
import { brl, dec, int, pct } from "@/lib/campanhas/format";
import type { MetaTotals, SalesTotals } from "@/lib/campanhas/metrics";
import type { CampaignSettings, MetaDay } from "@/lib/campanhas/types";

/** siglas usadas no painel, com o nome por extenso (aparece ao passar o mouse) */
export const GLOSSARY: Record<string, string> = {
  CPC: "Custo por clique (cost per click)",
  CTR: "Taxa de cliques (click-through rate)",
  CVR: "Taxa de conversão (conversion rate)",
  CPA: "Custo por aquisição (cost per acquisition): quanto custa cada venda vinda do anúncio",
  CAC: "Custo de aquisição de cliente: investimento ÷ todas as vendas",
  AOV: "Ticket médio (average order value)",
  ROAS: "Retorno sobre o investimento em anúncio (return on ad spend)",
  ROI: "Retorno sobre o investimento (return on investment): lucro ÷ investimento",
  MoM: "Mês contra mês (month over month)",
  CPM: "Custo por mil impressões",
  LPV: "Visualizações da página de destino (landing page views)",
  Hook: "Taxa de gancho (hook rate): quem assistiu 3 s ÷ impressões",
  OB: "Order bump: produto extra oferecido no checkout",
};

export function Abbr({ k }: { k: string }) {
  return (
    <abbr className="cmp-abbr" title={GLOSSARY[k] ?? k}>
      {k}
    </abbr>
  );
}

type Row = { label: string; abbr?: string; value: string; hint: ReactNode; tone?: "good" | "bad" | "mid" | "" };

const div = (a: number, b: number) => (b > 0 ? a / b : null);

/** verba do mês atual (até hoje) × mesmos dias do mês anterior */
function monthGrowth(meta: MetaDay[], today: string) {
  const [y, m, d] = today.split("-").map(Number);
  const start = `${today.slice(0, 7)}-01`;
  const prevStart = new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 10);
  const prevLastDay = new Date(Date.UTC(y, m - 1, 0)).getUTCDate();
  const prevEnd = `${prevStart.slice(0, 7)}-${String(Math.min(d, prevLastDay)).padStart(2, "0")}`;
  let cur = 0;
  let prev = 0;
  for (const r of meta) {
    if (r.date >= start && r.date <= today) cur += r.spend;
    if (r.date >= prevStart && r.date <= prevEnd) prev += r.spend;
  }
  return { cur, prev, growth: prev > 0 ? cur / prev - 1 : null, prevStart, prevEnd: addDays(prevEnd, 0) };
}

export function FinanceSummary({
  mt,
  s,
  meta,
  settings,
  today,
  until,
}: {
  mt: MetaTotals;
  s: SalesTotals;
  meta: MetaDay[];
  settings: CampaignSettings;
  today: string;
  until?: string;
}) {
  const spend = mt.spend;
  const revenue = s.courseGross + s.bumpGross;
  const netPerSale = div(s.net, s.approved);
  const cpa = div(spend, s.adSales);
  const cac = div(spend, s.approved);
  const roas = div(revenue, spend);
  const roasMin = div(revenue, s.net);
  const profit = Math.round((s.net - spend) * 100) / 100;
  const profitAd = Math.round((s.netAd - spend) * 100) / 100;
  const roi = div(profit, spend);
  const mg = monthGrowth(meta, today);
  const cpaTone = (v: number | null) => (v === null ? "" : v <= settings.cpaTarget ? "good" : v <= (netPerSale ?? settings.cpaMax) ? "mid" : "bad");

  const groups: { title: string; rows: Row[] }[] = [
    {
      title: "Tráfego",
      rows: [
        { label: "Investimento", value: brl(spend), hint: "valor gasto no Meta" },
        { label: "Cliques", value: int(mt.linkClicks), hint: "cliques no link do anúncio" },
        { label: "CPC", abbr: "CPC", value: brl(div(spend, mt.linkClicks)), hint: "investimento ÷ cliques" },
        { label: "Taxa de conversão", abbr: "CVR", value: pct(div(s.adSales, mt.linkClicks), 2), hint: "vendas de anúncio ÷ cliques" },
        {
          label: "Crescimento da verba vs. mês anterior",
          abbr: "MoM",
          value: mg.growth === null ? "—" : `${mg.growth >= 0 ? "+" : ""}${pct(mg.growth, 0)}`,
          hint: `${brl(mg.cur)} este mês × ${brl(mg.prev)} nos mesmos dias do mês passado`,
        },
      ],
    },
    {
      title: "Vendas e faturamento",
      rows: [
        { label: "Vendas", value: int(s.approved), hint: `${s.adSales} de anúncio · ${s.approved - s.adSales} de outras origens` },
        {
          label: "Ticket / preço",
          abbr: "AOV",
          value: brl(div(revenue, s.approved)),
          hint: `ticket médio com order bump · preço médio do curso ${brl(div(s.courseGross, s.approved))}`,
        },
        { label: "Faturamento do curso", value: brl(s.courseGross), hint: "bruto, sem juros do parcelamento" },
        { label: "Order bump: % que aceita", abbr: "OB", value: s.approved ? pct(div(s.bumps, s.approved), 0) : "—", hint: `${s.bumps} de ${s.approved} compradores` },
        { label: "Order bump: preço", value: brl(div(s.bumpGross, s.bumps)), hint: s.bumps ? "preço médio cobrado" : "nenhum order bump no período" },
        { label: "Faturamento do order bump", value: brl(s.bumpGross), hint: "bruto" },
        { label: "Faturamento total", value: brl(revenue), hint: "curso + order bump" },
        { label: "Taxas Hotmart", value: brl(s.fees), hint: `${pct(div(s.fees, revenue), 1)} do faturamento · sobra ${brl(s.net)} líquido` },
      ],
    },
    {
      title: "Resultado",
      rows: [
        { label: "CPA", abbr: "CPA", value: brl(cpa), hint: "investimento ÷ vendas de anúncio", tone: cpaTone(cpa) },
        { label: "CAC", abbr: "CAC", value: brl(cac), hint: "investimento ÷ todas as vendas" },
        {
          label: "CPA máximo sem prejuízo",
          abbr: "CPA",
          value: brl(netPerSale ?? settings.cpaMax),
          hint: netPerSale ? `líquido médio por venda (com order bump) · premissa ${brl(settings.cpaMax)}` : "premissa (sem vendas no período)",
        },
        { label: "ROAS", abbr: "ROAS", value: roas === null ? "—" : `${dec(roas)}×`, hint: "faturamento ÷ investimento", tone: roas !== null && roasMin !== null ? (roas >= roasMin ? "good" : "bad") : "" },
        { label: "ROAS mínimo sem prejuízo", abbr: "ROAS", value: roasMin === null ? "—" : `${dec(roasMin)}×`, hint: "faturamento ÷ líquido: abaixo disso, prejuízo" },
        { label: "Lucro líquido", value: brl(profit), hint: `todas as vendas − investimento · só anúncio ${brl(profitAd)}`, tone: profit >= 0 ? "good" : "bad" },
        { label: "ROI", abbr: "ROI", value: roi === null ? "—" : pct(roi, 0), hint: "lucro líquido ÷ investimento", tone: roi === null ? "" : roi >= 0 ? "good" : "bad" },
      ],
    },
  ];

  return (
    <div className="cmp-fin">
      {until && <p className="cmp-fin__until">Valores até {until}: o último dia com dados do Meta, para comparar investimento e vendas do mesmo período.</p>}
      <div className="cmp-fin__grid">
        {groups.map((g) => (
          <div key={g.title} className="cmp-fin__group">
            <p className="cmp-sub">{g.title}</p>
            <dl>
              {g.rows.map((r) => (
                <div key={r.label} className="cmp-fin__row">
                  <dt>
                    {r.label}
                    {r.abbr && <Abbr k={r.abbr} />}
                    <small>{r.hint}</small>
                  </dt>
                  <dd className={r.tone ? `is-${r.tone}` : ""}>{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
