import type { Endpoint, Payload, PayloadRequest } from "payload";
import { detectKind, metaKey, parseHotmart, parseMeta, type ParseResult } from "./parse";
import { DEFAULT_SETTINGS, withDefaults, type CampaignSettings, type MetaDay, type Sale } from "./types";

/**
 * Rotas do painel de campanhas (montadas na coleção "campaign-imports"):
 *   POST /api/campaign-imports/preview   → lê o CSV e diz o que vai entrar (novas, atualizadas, ignoradas, erros)
 *   POST /api/campaign-imports/commit    → grava (upsert: reenviar o mesmo arquivo não duplica nada)
 *   POST /api/campaign-imports/settings  → salva as premissas
 *   GET  /api/campaign-imports/reveal    → nomes e e-mails sem máscara (só para quem está logado)
 *   POST /api/campaign-imports/note      → salva (ou apaga, se vier vazia) a anotação de um dia
 * Todas exigem login no painel.
 */

const MAX_CHARS = 8_000_000;
const META = "meta-ad-days";
const SALES = "hotmart-sales";

type MongoModel = {
  find: (filter: object, projection?: object) => { lean: () => Promise<Record<string, unknown>[]> };
  bulkWrite: (ops: object[], opts?: object) => Promise<unknown>;
};

/** modelo do MongoDB por trás da coleção (gravação em lote, muito mais rápida que uma a uma) */
function model(payload: Payload, slug: string): MongoModel | null {
  const db = payload.db as unknown as { collections?: Record<string, MongoModel> };
  const m = db.collections?.[slug];
  return m && typeof m.bulkWrite === "function" ? m : null;
}

const json = (data: unknown, status = 200) => Response.json(data, { status });
const deny = () => json({ error: "Faça login no painel." }, 401);

async function body(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    const b = req.json ? await req.json() : null;
    return b && typeof b === "object" ? (b as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function loadSettings(payload: Payload): Promise<CampaignSettings> {
  try {
    const raw = await payload.findGlobal({ slug: "campaign-settings", depth: 0 });
    return withDefaults(raw as unknown as Record<string, unknown>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

type Parsed = { kind: "meta"; result: ParseResult<MetaDay> } | { kind: "hotmart"; result: ParseResult<Sale> };

function parse(text: string): Parsed | { error: string } {
  if (!text.trim()) return { error: "Arquivo vazio." };
  if (text.length > MAX_CHARS) return { error: "Arquivo grande demais (limite de 8 MB)." };
  const kind = detectKind(text);
  if (kind === "meta") return { kind, result: parseMeta(text) };
  if (kind === "hotmart") return { kind, result: parseHotmart(text) };
  return { error: "Não reconheci o arquivo. Use o CSV do Gerenciador de Anúncios (nível Anúncios, por dia) ou o CSV de vendas da Hotmart." };
}

/** aplica campanha aos conjuntos (arquivo sem a coluna "Nome da campanha") */
function applyCampaigns(rows: MetaDay[], map: { adset: string; campaign: string }[]) {
  const m = new Map(map.map((x) => [x.adset, x.campaign]));
  for (const r of rows) if (!r.campaign) r.campaign = m.get(r.adset) ?? "";
}

function readMap(v: unknown): { adset: string; campaign: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (x && typeof x === "object" ? (x as Record<string, unknown>) : {}))
    .map((x) => ({ adset: String(x.adset ?? "").trim(), campaign: String(x.campaign ?? "").trim() }))
    .filter((x) => x.adset && x.campaign);
}

async function existingMetaKeys(payload: Payload, dates: string[]): Promise<Set<string>> {
  const m = model(payload, META);
  if (m) {
    const docs = await m.find({ date: { $in: dates } }, { date: 1, campaign: 1, adset: 1, ad: 1 }).lean();
    return new Set(docs.map((d) => metaKey(d as unknown as MetaDay)));
  }
  const res = await payload.find({ collection: META, where: { date: { in: dates } }, pagination: false, depth: 0 });
  return new Set((res.docs as unknown as MetaDay[]).map((d) => metaKey(d)));
}

async function existingSaleIds(payload: Payload, ids: string[]): Promise<Set<string>> {
  const m = model(payload, SALES);
  if (m) {
    const docs = await m.find({ transactionId: { $in: ids } }, { transactionId: 1 }).lean();
    return new Set(docs.map((d) => String(d.transactionId)));
  }
  const res = await payload.find({ collection: SALES, where: { transactionId: { in: ids } }, pagination: false, depth: 0 });
  return new Set((res.docs as unknown as Sale[]).map((d) => d.transactionId));
}

function period(days: string[]) {
  const s = [...days].sort();
  return { from: s[0] ?? "", to: s[s.length - 1] ?? "" };
}

async function preview(req: PayloadRequest, commit: boolean): Promise<Response> {
  if (!req.user) return deny();
  const b = await body(req);
  const parsed = parse(String(b.text ?? ""));
  if ("error" in parsed) return json({ ok: false, errors: [parsed.error] }, 400);
  const { payload } = req;
  const fileName = String(b.fileName ?? "").slice(0, 200);

  if (parsed.kind === "meta") {
    const r = parsed.result;
    if (r.errors.length) return json({ ok: false, kind: "meta", errors: r.errors, warnings: r.warnings }, 400);
    const settings = await loadSettings(payload);
    const sentMap = readMap(b.campaignMap);
    const map = [...settings.campaignMap.filter((x) => !sentMap.some((y) => y.adset === x.adset)), ...sentMap];
    applyCampaigns(r.rows, map);
    const adsets = [...new Set(r.rows.map((x) => x.adset))];
    const missing = adsets.filter((a) => r.rows.some((x) => x.adset === a && !x.campaign));
    const knownCampaigns = [
      ...new Set([...map.map((x) => x.campaign), ...((await model(payload, META)?.find({}, { campaign: 1 }).lean()) ?? []).map((d) => String(d.campaign ?? ""))]),
    ].filter(Boolean);
    const pr = period(r.rows.map((x) => x.date));
    const existing = await existingMetaKeys(payload, [...new Set(r.rows.map((x) => x.date))]);
    const updated = r.rows.filter((x) => existing.has(metaKey(x))).length;
    const summary = {
      ok: true,
      kind: "meta" as const,
      rows: r.rows.length,
      created: r.rows.length - updated,
      updated,
      ignored: r.ignored,
      errors: [] as string[],
      warnings: r.warnings,
      period: pr,
      spend: Math.round(r.rows.reduce((a, x) => a + x.spend, 0) * 100) / 100,
      adsets: adsets.map((a) => ({ adset: a, campaign: map.find((x) => x.adset === a)?.campaign ?? r.rows.find((x) => x.adset === a)?.campaign ?? "" })),
      missingCampaign: missing,
      knownCampaigns,
      ads: [...new Set(r.rows.map((x) => x.ad))],
    };
    if (!commit) return json(summary);
    if (missing.length) return json({ ...summary, ok: false, errors: [`Informe a campanha de: ${missing.join(", ")}.`] }, 400);

    const m = model(payload, META);
    if (m) {
      await m.bulkWrite(
        r.rows.map((row) => ({
          updateOne: { filter: { date: row.date, campaign: row.campaign, adset: row.adset, ad: row.ad }, update: { $set: row }, upsert: true },
        })),
        { ordered: false },
      );
    } else {
      for (const row of r.rows) {
        const found = await payload.find({
          collection: META,
          where: { and: [{ date: { equals: row.date } }, { campaign: { equals: row.campaign } }, { adset: { equals: row.adset } }, { ad: { equals: row.ad } }] },
          limit: 1,
          depth: 0,
        });
        const doc = found.docs[0] as { id?: string | number } | undefined;
        if (doc?.id !== undefined) await payload.update({ collection: META, id: doc.id, data: row as never, depth: 0 });
        else await payload.create({ collection: META, data: row as never, depth: 0 });
      }
    }
    // guarda o mapeamento conjunto → campanha para as próximas importações
    if (sentMap.length) {
      await payload.updateGlobal({ slug: "campaign-settings", data: { campaignMap: map } as never, depth: 0 });
    }
    await payload.create({
      collection: "campaign-imports",
      data: { kind: "meta", fileName, rows: summary.rows, created: summary.created, updated, ignored: r.ignored, periodFrom: pr.from, periodTo: pr.to } as never,
      depth: 0,
    });
    return json(summary);
  }

  const r = parsed.result;
  if (r.errors.length) return json({ ok: false, kind: "hotmart", errors: r.errors, warnings: r.warnings }, 400);
  const existing = await existingSaleIds(payload, r.rows.map((x) => x.transactionId));
  const updated = r.rows.filter((x) => existing.has(x.transactionId)).length;
  const pr = period(r.rows.map((x) => x.day));
  const settings = await loadSettings(payload);
  const tests = new Set(settings.testEmails);
  const summary = {
    ok: true,
    kind: "hotmart" as const,
    rows: r.rows.length,
    created: r.rows.length - updated,
    updated,
    ignored: r.ignored,
    errors: [] as string[],
    warnings: r.warnings,
    period: pr,
    approved: r.rows.filter((x) => /^(aprovado|completo)$/i.test(x.status) && !tests.has(x.buyerEmail)).length,
    tests: r.rows.filter((x) => tests.has(x.buyerEmail)).length,
    statuses: Object.entries(
      r.rows.reduce<Record<string, number>>((a, x) => {
        a[x.status || "—"] = (a[x.status || "—"] ?? 0) + 1;
        return a;
      }, {}),
    ).map(([status, count]) => ({ status, count })),
  };
  if (!commit) return json(summary);

  const m = model(payload, SALES);
  if (m) {
    await m.bulkWrite(
      r.rows.map((row) => ({ updateOne: { filter: { transactionId: row.transactionId }, update: { $set: row }, upsert: true } })),
      { ordered: false },
    );
  } else {
    for (const row of r.rows) {
      const found = await payload.find({ collection: SALES, where: { transactionId: { equals: row.transactionId } }, limit: 1, depth: 0 });
      const doc = found.docs[0] as { id?: string | number } | undefined;
      if (doc?.id !== undefined) await payload.update({ collection: SALES, id: doc.id, data: row as never, depth: 0 });
      else await payload.create({ collection: SALES, data: row as never, depth: 0 });
    }
  }
  await payload.create({
    collection: "campaign-imports",
    data: { kind: "hotmart", fileName, rows: summary.rows, created: summary.created, updated, ignored: r.ignored, periodFrom: pr.from, periodTo: pr.to } as never,
    depth: 0,
  });
  return json(summary);
}

function clampNum(v: unknown, fallback: number, min = 0, max = 1_000_000): number {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

const strList = (v: unknown) =>
  (Array.isArray(v) ? v : String(v ?? "").split(/[\n,;]+/))
    .map((x) => String(x).trim())
    .filter(Boolean)
    .slice(0, 100);

export const campaignEndpoints: Endpoint[] = [
  { path: "/preview", method: "post", handler: (req) => preview(req, false) },
  { path: "/commit", method: "post", handler: (req) => preview(req, true) },
  {
    path: "/settings",
    method: "post",
    handler: async (req) => {
      if (!req.user) return deny();
      const b = await body(req);
      const cur = await loadSettings(req.payload);
      const day = String(b.launchDate ?? "").trim();
      const data = {
        netPerSale: clampNum(b.netPerSale, cur.netPerSale),
        cpaMax: clampNum(b.cpaMax, cur.cpaMax),
        cpaTarget: clampNum(b.cpaTarget, cur.cpaTarget),
        minSales3d: Math.round(clampNum(b.minSales3d, cur.minSales3d, 1, 1000)),
        pauseSpend: clampNum(b.pauseSpend, cur.pauseSpend),
        ctrMin: clampNum(b.ctrMin, cur.ctrMin, 0, 100),
        ctrMinImpressions: Math.round(clampNum(b.ctrMinImpressions, cur.ctrMinImpressions)),
        hookMin: clampNum(b.hookMin, cur.hookMin, 0, 100),
        freqAlert: clampNum(b.freqAlert, cur.freqAlert, 0, 100),
        scaleMin: clampNum(b.scaleMin, cur.scaleMin, 0, 500),
        scaleMax: clampNum(b.scaleMax, cur.scaleMax, 0, 500),
        waitSpend: clampNum(b.waitSpend, cur.waitSpend),
        launchDate: /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : "",
        testEmails: strList(b.testEmails).map((email) => ({ email: email.toLowerCase() })),
        youtubeCoupons: strList(b.youtubeCoupons).map((code) => ({ code: code.toUpperCase() })),
        adOrigins: strList(b.adOrigins).map((code) => ({ code: code.toLowerCase() })),
        campaignMap: Array.isArray(b.campaignMap) ? readMap(b.campaignMap) : cur.campaignMap,
      };
      await req.payload.updateGlobal({ slug: "campaign-settings", data: data as never, depth: 0 });
      return json({ ok: true });
    },
  },
  {
    path: "/note",
    method: "post",
    handler: async (req) => {
      if (!req.user) return deny();
      const b = await body(req);
      const day = String(b.day ?? "").trim();
      const text = String(b.text ?? "").trim().slice(0, 2000);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return json({ ok: false, error: "Dia inválido." }, 400);
      const found = await req.payload.find({ collection: "campaign-notes", where: { day: { equals: day } }, limit: 1, depth: 0 });
      const doc = found.docs[0] as { id?: string | number } | undefined;
      if (!text) {
        if (doc?.id !== undefined) await req.payload.delete({ collection: "campaign-notes", id: doc.id });
        return json({ ok: true, day, text: "" });
      }
      if (doc?.id !== undefined) await req.payload.update({ collection: "campaign-notes", id: doc.id, data: { text } as never, depth: 0 });
      else await req.payload.create({ collection: "campaign-notes", data: { day, text } as never, depth: 0 });
      return json({ ok: true, day, text });
    },
  },
  {
    path: "/reveal",
    method: "get",
    handler: async (req) => {
      if (!req.user) return deny();
      const res = await req.payload.find({ collection: SALES, pagination: false, depth: 0 });
      const out: Record<string, { name: string; email: string }> = {};
      for (const d of res.docs as unknown as Sale[]) out[d.transactionId] = { name: d.buyerName, email: d.buyerEmail };
      return Response.json(out, { headers: { "Cache-Control": "no-store" } });
    },
  },
];
