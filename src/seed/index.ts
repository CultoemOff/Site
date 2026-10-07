/**
 * Popula o banco com as formações e configurações atuais do site.
 * Uso: `npm run seed` (com DATABASE_URI e PAYLOAD_SECRET no .env).
 * Pode rodar mais de uma vez: não duplica formações já existentes.
 */
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "../payload.config";
import { COURSES } from "../config/courses";
import { EQUIPMENT } from "../config/equipment";
import { OFFERS } from "../config/offers";
import type { InstructorId } from "../config/instructors";
import { DEFAULT_SETTINGS } from "../config/site";
import { toLexical, type SeedPost } from "../content/lexical";
import { SEED_POSTS } from "../content/posts";

const payload = await getPayload({ config });

/**
 * Num banco novo, o MongoDB ainda está criando coleções e índices quando o primeiro registro é gravado,
 * o que gera um erro passageiro ("WriteConflict"). Aqui garantimos que tudo exista antes e,
 * se mesmo assim acontecer, tentamos de novo.
 */
type Model = { createCollection?: () => Promise<unknown>; init?: () => Promise<unknown> };
const db = payload.db as unknown as { collections?: Record<string, Model>; versions?: Record<string, Model>; globals?: Model };
for (const model of [...Object.values(db.collections ?? {}), ...Object.values(db.versions ?? {}), db.globals]) {
  if (!model) continue;
  try {
    await model.createCollection?.();
    await model.init?.();
  } catch {
    /* já existe */
  }
}

async function retry<T>(fn: () => Promise<T>, tries = 6): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      const e = err as { code?: number; codeName?: string; errorLabelSet?: Set<string>; message?: string };
      const transient =
        e?.code === 112 ||
        e?.codeName === "WriteConflict" ||
        Boolean(e?.errorLabelSet?.has?.("TransientTransactionError")) ||
        /catalog changes|WriteConflict/i.test(String(e?.message ?? ""));
      if (!transient || i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

let created = 0;
let updated = 0;
for (const [i, c] of COURSES.entries()) {
  const data = {
    title: c.title,
    slug: c.id,
    tagline: c.tagline,
    summary: c.summary,
    question: c.question,
    price: c.price > 0 ? c.price : null,
    priceFrom: c.priceFrom ?? null,
    installmentCount: c.installments?.count ?? null,
    installmentValue: c.installments?.value ?? null,
    status: c.status ?? "lancamento-em-breve",
    format: c.format,
    href: c.href ?? "",
    diagram: c.diagram,
    topicsTitle: c.topicsTitle,
    topics: c.topics.map((text) => ({ text })),
    appliedTo: (c.appliedTo ?? []).map((text) => ({ text })),
    featured: Boolean(c.featured),
    instructor: c.instructor as InstructorId | undefined,
    includes: (c.includes ?? []).map((text) => ({ text })),
    hideOnHome: Boolean(c.hideOnHome),
    contentRev: c.rev ?? 0,
  };
  // depoimentos ficam fora de `data`: uma atualização completa da formação não mexe neles
  const testimonials = (c.testimonials ?? []).map((t) => ({ title: t.title ?? "", text: t.text, name: t.name, role: t.role ?? "" }));
  const exists = await payload.find({ collection: "courses", where: { slug: { equals: c.id } }, limit: 1, depth: 0 });
  const doc = exists.docs[0] as unknown as
    | { id: string | number; contentRev?: number; testimonials?: unknown[] | null; format?: { mode?: string | null; access?: string | null } | null }
    | undefined;
  if (doc) {
    // já existe: só atualiza quando o conteúdo no código é mais novo (campo "rev" em src/config/courses.ts)
    if ((doc.contentRev ?? 0) < (c.rev ?? 0)) {
      const scopes = c.revScope ? (Array.isArray(c.revScope) ? c.revScope : [c.revScope]) : [];
      if (scopes.length > 0) {
        // mudança dirigida: só os campos do(s) escopo(s); textos e demais campos do painel ficam como estão
        const { price, priceFrom, installmentCount, installmentValue, status, href, contentRev } = data;
        const hasTestimonials = Array.isArray(doc.testimonials) && doc.testimonials.length > 0;
        await retry(() =>
          payload.update({
            collection: "courses",
            id: doc.id,
            data: {
              contentRev,
              ...(scopes.includes("price") ? { price, priceFrom, installmentCount, installmentValue, status } : {}),
              ...(scopes.includes("href") ? { href } : {}),
              // carga horária: mantém modalidade e acesso como estão no painel e troca só as horas
              ...(scopes.includes("hours")
                ? { format: { mode: doc.format?.mode ?? c.format.mode, access: doc.format?.access ?? c.format.access, hours: c.format.hours } }
                : {}),
              // depoimentos: só entram se o painel ainda não tiver nenhum (nunca sobrescreve o que foi cadastrado lá)
              ...(scopes.includes("testimonials") && !hasTestimonials ? { testimonials } : {}),
            },
          }),
        );
      } else {
        // link de inscrição: se o código não tem um, mantém o que foi colocado no painel
        const { href, ...semLink } = data;
        await retry(() => payload.update({ collection: "courses", id: doc.id, data: href ? data : semLink }));
      }
      updated++;
    }
    continue;
  }
  await retry(() => payload.create({ collection: "courses", data: { ...data, testimonials, order: (i + 1) * 10 } }));
  created++;
}

/**
 * Itens iniciais de equipamentos, ofertas e posts entram UMA vez só.
 * Depois disso, quem manda é o painel: o seed não recria o que foi apagado, não apaga nada
 * e não mexe no que foi adicionado ou editado. Se a lista já tem itens (banco que já estava em uso),
 * só marca como concluído, sem criar nada.
 */
type SeedKey = "offers" | "equipment" | "posts";
const seedState = (await payload.findGlobal({ slug: "seed-state", depth: 0 })) as unknown as Partial<Record<SeedKey, boolean>>;
async function firstTime(key: SeedKey): Promise<boolean> {
  if (seedState?.[key]) return false;
  const existing = await payload.count({ collection: key });
  const done = key === "offers" ? { offers: true } : key === "equipment" ? { equipment: true } : { posts: true };
  await retry(() => payload.updateGlobal({ slug: "seed-state", data: done }));
  return existing.totalDocs === 0;
}

let equipmentCreated = 0;
const seedEquipment = await firstTime("equipment");
for (const [i, e] of seedEquipment ? EQUIPMENT.entries() : []) {
  const exists = await payload.find({ collection: "equipment", where: { slug: { equals: e.id } }, limit: 1 });
  if (exists.totalDocs > 0) continue;
  await retry(() => payload.create({
    collection: "equipment",
    data: {
      name: e.name,
      slug: e.id,
      order: (i + 1) * 10,
      category: e.category,
      icon: e.icon,
      note: e.note ?? "",
      href: e.href,
      store: e.store ?? "",
      featured: e.featured,
    },
  }));
  equipmentCreated++;
}

// Ofertas (página /ofertas): só na primeira vez. Foto e preço são preenchidos depois, no painel.
let offersCreated = 0;
const seedOffers = await firstTime("offers");
for (const [i, o] of seedOffers ? OFFERS.entries() : []) {
  const exists = await payload.find({ collection: "offers", where: { slug: { equals: o.id } }, limit: 1, depth: 0 });
  if (exists.totalDocs > 0) continue;
  await retry(() => payload.create({
    collection: "offers",
    data: {
      title: o.title,
      slug: o.id,
      href: o.href,
      tags: o.tags,
      note: o.note ?? "",
      imageUrl: o.imageUrl ?? "",
      price: o.price ?? null,
      readPrice: false,
      active: true,
      order: (i + 1) * 10,
    },
  }));
  offersCreated++;
}

// Configurações do site: só preenche na primeira vez (não sobrescreve o que foi editado no admin)
const currentSettings = (await payload.findGlobal({ slug: "site-settings", depth: 0 })) as unknown as { youtube?: string; updatedAt?: string };
let settingsSeeded = false;
if (!currentSettings?.updatedAt) {
  await retry(() => payload.updateGlobal({
    slug: "site-settings",
    data: {
      youtube: DEFAULT_SETTINGS.social.youtube,
      instagram: DEFAULT_SETTINGS.social.instagram,
      tiktok: DEFAULT_SETTINGS.social.tiktok,
      videosMode: "latest",
      spresenter: {
        url: DEFAULT_SETTINGS.spresenter.url,
        coupon: DEFAULT_SETTINGS.spresenter.coupon,
        discount: DEFAULT_SETTINGS.spresenter.discount,
      },
      voluts: { url: DEFAULT_SETTINGS.voluts.url },
      dorn: { url: DEFAULT_SETTINGS.dorn.url },
    },
  }));
  settingsSeeded = true;
}


/** Envia uma imagem para Mídias: baixa da URL de origem; se não conseguir, usa o arquivo em /public. */
async function uploadImage(img: { sourceUrl?: string; localPath?: string; alt: string }) {
  if (img.sourceUrl) {
    try {
      const res = await fetch(img.sourceUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = Buffer.from(await res.arrayBuffer());
      const name = img.sourceUrl.split("/").pop() || "imagem.png";
      return await retry(() =>
        payload.create({
          collection: "media",
          data: { alt: img.alt },
          file: { data, mimetype: res.headers.get("content-type") || "image/png", name, size: data.length },
        }),
      );
    } catch (err) {
      payload.logger.warn(`Não consegui baixar ${img.sourceUrl}: ${String(err)}`);
    }
  }
  if (img.localPath) {
    const local = path.resolve(process.cwd(), "public" + img.localPath);
    if (fs.existsSync(local)) {
      return retry(() => payload.create({ collection: "media", data: { alt: img.alt }, filePath: local }));
    }
  }
  return null;
}

async function uploadCover(cover: NonNullable<SeedPost["cover"]>) {
  return uploadImage(cover);
}

const firstUser = await payload.find({ collection: "users", limit: 1, depth: 0 });
const authorId = firstUser.docs[0]?.id;

let postsCreated = 0;
const seedPosts = await firstTime("posts");
for (const post of seedPosts ? SEED_POSTS : []) {
  const exists = await payload.find({ collection: "posts", where: { slug: { equals: post.slug } }, limit: 1, draft: true });
  if (exists.totalDocs > 0) continue;
  const cover = post.cover ? await uploadCover(post.cover) : null;
  // imagens dentro do texto
  const images = new Map<string, string | number>();
  for (const block of post.blocks) {
    if ("img" in block && !images.has(block.img.sourceUrl)) {
      const media = await uploadImage(block.img);
      if (media) images.set(block.img.sourceUrl, media.id);
    }
  }
  await retry(() => payload.create({
    collection: "posts",
    data: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      tags: post.tags,
      content: toLexical(
        // imagens que não puderam ser enviadas ficam de fora do post
        post.blocks.filter((b) => !("img" in b) || images.has(b.img.sourceUrl)),
        images,
      ),
      ...(cover ? { coverImage: cover.id } : {}),
      ...(authorId ? { author: authorId } : {}),
      _status: "published",
    },
  }));
  postsCreated++;
}

payload.logger.info(
  `Seed concluído: ${created} formação(ões) criada(s) e ${updated} atualizada(s), ${equipmentCreated} equipamento(s), ${offersCreated} oferta(s) e ${postsCreated} post(s) criados${settingsSeeded ? "; configurações iniciais gravadas" : ""}.`,
);
process.exit(0);
