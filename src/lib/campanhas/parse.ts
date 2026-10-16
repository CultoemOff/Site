/**
 * Leitura dos CSVs exportados do Meta (Gerenciador de Anúncios) e da Hotmart (histórico de vendas).
 * Funciona no servidor e no navegador (sem dependências). Telefone e documento do comprador são descartados aqui.
 */
import type { MetaDay, Sale } from "./types";

export type CsvKind = "meta" | "hotmart";

export type ParseResult<T> = {
  kind: CsvKind;
  rows: T[];
  ignored: number;
  errors: string[];
  warnings: string[];
  /** Meta: o arquivo não tem a coluna "Nome da campanha" */
  missingCampaign?: boolean;
};

/* ---------------- CSV genérico ---------------- */

/** lê CSV com aspas (RFC 4180), separador automático (vírgula ou ponto e vírgula) e BOM */
export function parseCsv(text: string): { header: string[]; rows: string[][]; delimiter: string } {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.slice(0, src.search(/\r?\n/) === -1 ? src.length : src.search(/\r?\n/));
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";
  const out: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === delimiter) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      out.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    out.push(row);
  }
  const rows = out.filter((r) => r.some((x) => x.trim() !== ""));
  const header = (rows.shift() ?? []).map((h) => h.trim());
  return { header, rows, delimiter };
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** índice das colunas pelo nome (sem acento e sem diferença de maiúsculas); aceita apelidos */
function columns(header: string[]) {
  const map = new Map(header.map((h, i) => [norm(h), i]));
  return (...names: string[]) => {
    for (const n of names) {
      const i = map.get(norm(n));
      if (i !== undefined) return i;
    }
    return -1;
  };
}

export function detectKind(text: string): CsvKind | null {
  const head = norm(text.replace(/^﻿/, "").slice(0, 4000));
  if (head.includes("codigo da transacao") || head.includes("transacao")) return "hotmart";
  if (head.includes("nome do anuncio") || head.includes("inicio dos relatorios")) return "meta";
  return null;
}

/* ---------------- números e datas ---------------- */

function num(raw: string | undefined, delimiter: string): number {
  const v = (raw ?? "").trim();
  if (!v || v === "–" || v === "-" || v === "(none)") return 0;
  let s = v.replace(/[R$\s%]/g, "");
  // separador ";" costuma vir com decimais em vírgula (1.234,56)
  if (delimiter === ";" && s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function numOrNull(raw: string | undefined, delimiter: string): number | null {
  const v = (raw ?? "").trim();
  if (v === "–" || v === "") return null;
  return num(v, delimiter);
}

const text = (raw: string | undefined) => {
  const v = (raw ?? "").trim();
  return v === "(none)" || v === "–" ? "" : v;
};

/** "AAAA-MM-DD" a partir de "AAAA-MM-DD" ou "DD/MM/AAAA" */
function isoDay(raw: string): string {
  const v = raw.trim();
  let m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return "";
}

/** "DD/MM/AAAA HH:MM:SS" (Brasília) → partes da data */
function brDateTime(raw: string): { iso: string; day: string; hour: number; weekday: number } | null {
  const m = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/) ?? null;
  const m2 = m ? null : raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!m && !m2) return null;
  const [y, mo, d] = m ? [m[3], m[2], m[1]] : [m2![1], m2![2], m2![3]];
  const [hh, mi, ss] = (m ? [m[4], m[5], m[6]] : [m2![4], m2![5], m2![6]]).map((x) => (x ?? "00").padStart(2, "0"));
  const day = `${y}-${mo}-${d}`;
  const weekday = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d))).getUTCDay();
  return { iso: `${day}T${hh}:${mi}:${ss}-03:00`, day, hour: Number(hh), weekday };
}

/* ---------------- Meta ---------------- */

export function parseMeta(csv: string): ParseResult<MetaDay> {
  const { header, rows, delimiter } = parseCsv(csv);
  const col = columns(header);
  const errors: string[] = [];
  const warnings: string[] = [];
  const c = {
    start: col("Início dos relatórios", "Inicio dos relatorios", "Dia"),
    end: col("Encerramento dos relatórios"),
    ad: col("Nome do anúncio"),
    adset: col("Nome do conjunto de anúncios"),
    campaign: col("Nome da campanha"),
    delivery: col("Veiculação de anúncio", "Veiculação do anúncio"),
    spend: col("Valor gasto (BRL)", "Valor usado (BRL)"),
    impressions: col("Impressões"),
    reach: col("Alcance"),
    clicks: col("Cliques no link"),
    lpv: col("Visualizações da página de destino"),
    v3: col("Reproduções do vídeo por no mínimo 3 segundos"),
    p25: col("Reproduções de 25% do vídeo"),
    p50: col("Reproduções de 50% do vídeo"),
    p75: col("Reproduções de 75% do vídeo"),
    p100: col("Reproduções de 100% do vídeo"),
    checkouts: col("Finalizações de compra iniciadas"),
    purchases: col("Compras"),
    value: col("Valor de conversão da compra"),
    budget: col("Orçamento do conjunto de anúncios"),
    budgetType: col("Tipo de orçamento do conjunto de anúncios"),
    endDate: col("Término"),
    quality: col("Classificação de qualidade"),
    engagement: col("Classificação da taxa de engajamento"),
    conversion: col("Classificação da taxa de conversão"),
    attribution: col("Configuração de atribuição"),
  };
  const required: [keyof typeof c, string][] = [
    ["start", "Início dos relatórios"],
    ["ad", "Nome do anúncio"],
    ["adset", "Nome do conjunto de anúncios"],
    ["spend", "Valor gasto (BRL)"],
    ["impressions", "Impressões"],
  ];
  for (const [k, label] of required) if (c[k] < 0) errors.push(`Coluna obrigatória ausente: "${label}".`);
  if (errors.length) return { kind: "meta", rows: [], ignored: 0, errors, warnings };

  const g = (r: string[], i: number) => (i >= 0 ? r[i] : undefined);
  const out: MetaDay[] = [];
  let ignored = 0;
  let notDaily = 0;
  for (const r of rows) {
    const date = isoDay(g(r, c.start) ?? "");
    const endDay = c.end >= 0 ? isoDay(g(r, c.end) ?? "") : date;
    if (!date) {
      ignored++;
      continue;
    }
    if (endDay && endDay !== date) {
      notDaily++;
      continue;
    }
    const spend = num(g(r, c.spend), delimiter);
    const impressions = num(g(r, c.impressions), delimiter);
    if (spend === 0 && impressions === 0) {
      ignored++;
      continue;
    }
    out.push({
      date,
      campaign: text(g(r, c.campaign)),
      adset: text(g(r, c.adset)),
      ad: text(g(r, c.ad)),
      delivery: text(g(r, c.delivery)),
      spend,
      impressions,
      reach: num(g(r, c.reach), delimiter),
      linkClicks: num(g(r, c.clicks), delimiter),
      landingPageViews: num(g(r, c.lpv), delimiter),
      video3s: num(g(r, c.v3), delimiter),
      p25: num(g(r, c.p25), delimiter),
      p50: num(g(r, c.p50), delimiter),
      p75: num(g(r, c.p75), delimiter),
      p100: num(g(r, c.p100), delimiter),
      checkouts: num(g(r, c.checkouts), delimiter),
      purchasesMeta: num(g(r, c.purchases), delimiter),
      purchaseValueMeta: num(g(r, c.value), delimiter),
      budget: numOrNull(g(r, c.budget), delimiter),
      budgetType: text(g(r, c.budgetType)),
      endDate: isoDay(g(r, c.endDate) ?? ""),
      qualityRank: text(g(r, c.quality)),
      engagementRank: text(g(r, c.engagement)),
      conversionRank: text(g(r, c.conversion)),
      attribution: text(g(r, c.attribution)),
    });
  }
  if (notDaily > 0) {
    errors.push(
      `O arquivo não está dividido por dia (${notDaily} linha(s) cobrem vários dias). No Gerenciador, exporte com Detalhamento → Por tempo → Dia.`,
    );
    return { kind: "meta", rows: [], ignored, errors, warnings };
  }
  const missingCampaign = c.campaign < 0;
  if (missingCampaign) warnings.push('O arquivo não tem a coluna "Nome da campanha": informe a campanha de cada conjunto abaixo.');
  return { kind: "meta", rows: out, ignored, errors, warnings, missingCampaign };
}

/* ---------------- Hotmart ---------------- */

export function splitSck(sck: string): { origin: string; button: string; adName: string } {
  const parts = sck.split("|").map((p) => p.trim());
  return { origin: (parts[0] ?? "").toLowerCase(), button: (parts[1] ?? "").toLowerCase(), adName: parts.slice(2).join("|") };
}

export function parseHotmart(csv: string): ParseResult<Sale> {
  const { header, rows, delimiter } = parseCsv(csv);
  const col = columns(header);
  const errors: string[] = [];
  const warnings: string[] = [];
  const c = {
    id: col("Código da transação", "Transação"),
    status: col("Status da transação", "Status"),
    soldAt: col("Data da transação", "Data de Venda"),
    confirmedAt: col("Confirmação do pagamento", "Data de Confirmação"),
    productId: col("Código do produto"),
    productName: col("Produto", "Nome do Produto"),
    grossPaid: col("Valor de compra com impostos"),
    gross: col("Faturamento bruto (sem impostos)", "Faturamento bruto"),
    net: col("Faturamento líquido do(a) Produtor(a)", "Faturamento líquido"),
    feeProcessing: col("Taxa de processamento"),
    feeOther: col("Outras Taxas"),
    feeInstallment: col("Taxa de parcelamento"),
    src: col("Código SRC", "SRC"),
    sck: col("Código SCK", "Origem de Checkout", "SCK"),
    payment: col("Método de pagamento", "Tipo de Pagamento"),
    installments: col("Quantidade total de parcelas", "Parcelas"),
    coupon: col("Código de cupom", "Cupom"),
    name: col("Comprador(a)", "Nome do Comprador", "Comprador"),
    email: col("Email do(a) Comprador(a)", "Email do Comprador", "Email"),
    state: col("Estado / Província", "Estado"),
  };
  if (c.id < 0) errors.push('Coluna obrigatória ausente: "Código da transação".');
  if (c.status < 0) errors.push('Coluna obrigatória ausente: "Status da transação".');
  if (c.soldAt < 0) errors.push('Coluna obrigatória ausente: "Data da transação".');
  if (c.net < 0) errors.push('Coluna obrigatória ausente: "Faturamento líquido do(a) Produtor(a)".');
  if (errors.length) return { kind: "hotmart", rows: [], ignored: 0, errors, warnings };

  const g = (r: string[], i: number) => (i >= 0 ? r[i] : undefined);
  const out: Sale[] = [];
  const seen = new Set<string>();
  let ignored = 0;
  for (const r of rows) {
    const id = text(g(r, c.id));
    const when = brDateTime(g(r, c.soldAt) ?? "");
    if (!id || !when) {
      ignored++;
      continue;
    }
    if (seen.has(id)) {
      ignored++;
      continue;
    }
    seen.add(id);
    const sck = text(g(r, c.sck));
    const src = text(g(r, c.src));
    // origem: sck; se vazio, tenta o src no mesmo formato
    const parts = splitSck(sck || src);
    const confirmed = brDateTime(g(r, c.confirmedAt) ?? "");
    out.push({
      transactionId: id,
      status: text(g(r, c.status)),
      soldAt: when.iso,
      day: when.day,
      hour: when.hour,
      weekday: when.weekday,
      confirmedAt: confirmed?.iso ?? "",
      productId: text(g(r, c.productId)),
      productName: text(g(r, c.productName)),
      grossPaid: num(g(r, c.grossPaid), delimiter),
      gross: num(g(r, c.gross), delimiter),
      net: num(g(r, c.net), delimiter),
      feeProcessing: num(g(r, c.feeProcessing), delimiter),
      feeOther: num(g(r, c.feeOther), delimiter),
      feeInstallment: num(g(r, c.feeInstallment), delimiter),
      src,
      sck,
      origin: parts.origin,
      button: parts.button,
      adName: parts.adName,
      paymentMethod: text(g(r, c.payment)),
      installments: Math.max(1, Math.round(num(g(r, c.installments), delimiter)) || 1),
      coupon: text(g(r, c.coupon)).toUpperCase(),
      buyerName: text(g(r, c.name)).replace(/\s+/g, " "),
      buyerEmail: text(g(r, c.email)).toLowerCase(),
      buyerState: text(g(r, c.state)),
    });
  }
  return { kind: "hotmart", rows: out, ignored, errors, warnings };
}

/** chave única de uma linha do Meta (upsert) */
export const metaKey = (r: Pick<MetaDay, "date" | "campaign" | "adset" | "ad">) => `${r.date}␟${r.campaign}␟${r.adset}␟${r.ad}`;
