/**
 * Popula o banco com as formações e configurações atuais do site.
 * Uso: `npm run seed` (com DATABASE_URI e PAYLOAD_SECRET no .env).
 * Pode rodar mais de uma vez: não duplica formações já existentes.
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { COURSES } from "../config/courses";
import { DEFAULT_SETTINGS } from "../config/site";

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

payload.logger.info(`Seed concluído: ${created} formação(ões) criada(s); configurações atualizadas.`);
process.exit(0);
