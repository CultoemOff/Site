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
import { DEFAULT_SETTINGS } from "../config/site";
import { toLexical, type SeedPost } from "../content/lexical";
import { SEED_POSTS } from "../content/posts";

const payload = await getPayload({ config });

let created = 0;
for (const [i, c] of COURSES.entries()) {
  const exists = await payload.find({ collection: "courses", where: { slug: { equals: c.id } }, limit: 1 });
  if (exists.totalDocs > 0) continue;
  await payload.create({
    collection: "courses",
    data: {
      title: c.title,
      slug: c.id,
      order: (i + 1) * 10,
      tagline: c.tagline,
      summary: c.summary,
      question: c.question,
      price: c.price,
      status: c.status ?? "lancamento-em-breve",
      format: c.format,
      href: c.href ?? "",
      diagram: c.diagram,
      topicsTitle: c.topicsTitle,
      topics: c.topics.map((text) => ({ text })),
      appliedTo: (c.appliedTo ?? []).map((text) => ({ text })),
      featured: Boolean(c.featured),
    },
  });
  created++;
}

await payload.updateGlobal({
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
});

/** Envia a capa para Mídias: baixa a imagem original; se não conseguir, usa o arquivo em /public. */
async function uploadCover(cover: NonNullable<SeedPost["cover"]>) {
  if (cover.sourceUrl) {
    try {
      const res = await fetch(cover.sourceUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = Buffer.from(await res.arrayBuffer());
      const name = cover.sourceUrl.split("/").pop() || "capa.png";
      return await payload.create({
        collection: "media",
        data: { alt: cover.alt },
        file: { data, mimetype: res.headers.get("content-type") || "image/png", name, size: data.length },
      });
    } catch (err) {
      payload.logger.warn(`Não consegui baixar a capa original (${cover.sourceUrl}): ${String(err)}. Usando public${cover.localPath}.`);
    }
  }
  const local = path.resolve(process.cwd(), "public" + cover.localPath);
  if (fs.existsSync(local)) {
    return payload.create({ collection: "media", data: { alt: cover.alt }, filePath: local });
  }
  return null;
}

const firstUser = await payload.find({ collection: "users", limit: 1, depth: 0 });
const authorId = firstUser.docs[0]?.id;

let postsCreated = 0;
for (const post of SEED_POSTS) {
  const exists = await payload.find({ collection: "posts", where: { slug: { equals: post.slug } }, limit: 1, draft: true });
  if (exists.totalDocs > 0) continue;
  const cover = post.cover ? await uploadCover(post.cover) : null;
  await payload.create({
    collection: "posts",
    data: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      tags: post.tags,
      content: toLexical(post.blocks),
      ...(cover ? { coverImage: cover.id } : {}),
      ...(authorId ? { author: authorId } : {}),
      _status: "published",
    },
  });
  postsCreated++;
}

payload.logger.info(
  `Seed concluído: ${created} formação(ões) e ${postsCreated} post(s) criados; configurações atualizadas.`,
);
process.exit(0);
