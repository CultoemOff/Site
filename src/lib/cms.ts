import { cache } from "react";
import { COURSES, type Course, type CourseDiagram, type CourseStatus } from "@/config/courses";
import {
  CATEGORY_ICON,
  EQUIPMENT,
  EQUIPMENT_CATEGORIES,
  type Equipment,
  type EquipmentCategory,
  type EquipmentIcon,
} from "@/config/equipment";
import { DEFAULT_SETTINGS, type SiteSettingsData } from "@/config/site";
import { toLexical, type SeedPost } from "@/content/lexical";
import { SEED_POSTS } from "@/content/posts";
import { localMediaPath } from "@/lib/mediaPath";

/**
 * Camada de dados do site.
 * Lê o conteúdo do admin (Payload) e, se o banco não estiver configurado ou
 * estiver vazio, usa os valores padrão de src/config — o site nunca quebra.
 */

type Doc = Record<string, unknown>;

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const obj = (v: unknown): Doc => (v && typeof v === "object" ? (v as Doc) : {});

/** Extrai a URL de um campo de upload populado. */
export function mediaUrl(v: unknown, size: "card" | "wide" = "card"): string | undefined {
  const m = obj(v);
  const sized = obj(obj(m.sizes)[size]);
  const url = str(sized.url) || str(m.url);
  return url ? localMediaPath(url) : undefined;
}
export function mediaAlt(v: unknown) {
  return str(obj(v).alt);
}

export const getPayloadClient = cache(async () => {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) return null;
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
    return await getPayload({ config });
  } catch (err) {
    console.error("[cms] Não foi possível conectar ao Payload:", err);
    return null;
  }
});

const DIAGRAMS: CourseDiagram[] = ["network", "analog", "live", "companion", "dmx"];
const STATUSES: CourseStatus[] = ["disponivel", "inscricoes-abertas", "lancamento-em-breve", "em-preparacao"];

function mapCourse(d: Doc): Course {
  const format = obj(d.format);
  const list = (v: unknown) =>
    (Array.isArray(v) ? v : []).map((i) => str(obj(i).text)).filter(Boolean);
  const diagram = str(d.diagram) as CourseDiagram;
  const status = str(d.status) as CourseStatus;
  const imageUrl = mediaUrl(d.image);
  return {
    id: str(d.slug) || str(d.id),
    title: str(d.title),
    tagline: str(d.tagline),
    summary: str(d.summary),
    question: str(d.question) || undefined,
    topicsTitle: str(d.topicsTitle, "Conteúdo"),
    topics: list(d.topics),
    appliedTo: list(d.appliedTo).length ? list(d.appliedTo) : undefined,
    diagram: DIAGRAMS.includes(diagram) ? diagram : "network",
    status: STATUSES.includes(status) ? status : undefined,
    price: num(d.price),
    priceFrom: num(d.priceFrom) > num(d.price) ? num(d.priceFrom) : undefined,
    installments:
      num(d.installmentCount) > 1 && num(d.installmentValue) > 0
        ? { count: num(d.installmentCount), value: num(d.installmentValue) }
        : undefined,
    format: {
      mode: str(format.mode, "Online"),
      hours: num(format.hours, 0),
      access: str(format.access, "Acesso por 1 ano"),
    },
    href: str(d.href) || undefined,
    featured: Boolean(d.featured),
    image: imageUrl ? { url: imageUrl, alt: mediaAlt(d.image) } : undefined,
    instructor: str(d.instructor) || undefined,
    includes: list(d.includes).length ? list(d.includes) : undefined,
    hideOnHome: Boolean(d.hideOnHome),
  };
}

/** Formações (admin → fallback para src/config/courses.ts). */
export const getCourses = cache(async (): Promise<Course[]> => {
  const payload = await getPayloadClient();
  if (!payload) return COURSES;
  try {
    const res = await payload.find({ collection: "courses", sort: "order", limit: 50, depth: 1 });
    const docs = res.docs as unknown as Doc[];
    return docs.length ? docs.map(mapCourse) : COURSES;
  } catch (err) {
    console.error("[cms] Erro ao buscar formações:", err);
    return COURSES;
  }
});

const ICONS: EquipmentIcon[] = ["mic", "rack", "switch", "power", "camera", "light", "cable"];

function mapEquipment(d: Doc): Equipment {
  const cat = str(d.category) as EquipmentCategory;
  const category = cat in EQUIPMENT_CATEGORIES ? cat : "acessorios";
  const icon = str(d.icon) as EquipmentIcon;
  const imageUrl = mediaUrl(d.image);
  return {
    id: str(d.slug) || str(d.id),
    name: str(d.name),
    category,
    icon: ICONS.includes(icon) ? icon : CATEGORY_ICON[category],
    note: str(d.note) || undefined,
    href: str(d.href),
    store: str(d.store) || undefined,
    image: imageUrl ? { url: imageUrl, alt: mediaAlt(d.image) } : undefined,
    featured: Boolean(d.featured),
  };
}

/** Equipamentos recomendados (admin → fallback para src/config/equipment.ts). */
export const getEquipment = cache(async (): Promise<Equipment[]> => {
  const payload = await getPayloadClient();
  if (!payload) return EQUIPMENT;
  try {
    const res = await payload.find({ collection: "equipment", sort: "order", limit: 200, depth: 1 });
    const docs = res.docs as unknown as Doc[];
    return docs.length ? docs.map((d) => mapEquipment(d)).filter((e) => e.href) : EQUIPMENT;
  } catch (err) {
    console.error("[cms] Erro ao buscar equipamentos:", err);
    return EQUIPMENT;
  }
});

/** Configurações do site (admin → fallback para DEFAULT_SETTINGS). */
export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  const payload = await getPayloadClient();
  if (!payload) return DEFAULT_SETTINGS;
  try {
    const g = (await payload.findGlobal({ slug: "site-settings", depth: 1 })) as unknown as Doc;
    const sp = obj(g.spresenter);
    const vo = obj(g.voluts);
    const dn = obj(g.dorn);
    const d = DEFAULT_SETTINGS;
    return {
      social: {
        youtube: str(g.youtube) || d.social.youtube,
        instagram: str(g.instagram) || d.social.instagram,
        tiktok: str(g.tiktok) || d.social.tiktok,
      },
      videosMode: str(g.videosMode) === "selected" ? "selected" : "latest",
      selectedVideos: (Array.isArray(g.selectedVideos) ? g.selectedVideos : [])
        .map((v) => ({ url: str(obj(v).url), title: str(obj(v).title) || undefined }))
        .filter((v) => v.url),
      spresenter: {
        url: str(sp.url) || d.spresenter.url,
        coupon: str(sp.coupon) || d.spresenter.coupon,
        discount: str(sp.discount) || d.spresenter.discount,
        screen: mediaUrl(sp.screen) || d.spresenter.screen,
      },
      voluts: { url: str(vo.url) || d.voluts.url, screen: mediaUrl(vo.screen) || d.voluts.screen },
      dorn: { url: str(dn.url) || d.dorn.url, image: mediaUrl(dn.image) || d.dorn.image },
      gaId: str(g.gaMeasurementId) || d.gaId,
      metaPixelId: str(g.metaPixelId) || d.metaPixelId,
      ptzDownloadUrl: str(g.ptzDownloadUrl),
      audience: (() => {
        const stats = (Array.isArray(g.audienceStats) ? g.audienceStats : [])
          .map((s) => ({ value: str(obj(s).value), label: str(obj(s).label) }))
          .filter((s) => s.value && s.label);
        return stats.length
          ? { stats, note: str(g.audienceNote) }
          : { stats: d.audience.stats, note: str(g.audienceNote) || d.audience.note };
      })(),
      faq: (() => {
        const items = (Array.isArray(g.faq) ? g.faq : [])
          .map((f) => ({ question: str(obj(f).question), answer: str(obj(f).answer) }))
          .filter((f) => f.question && f.answer);
        return items.length ? items : d.faq;
      })(),
    };
  } catch (err) {
    console.error("[cms] Erro ao buscar configurações:", err);
    return DEFAULT_SETTINGS;
  }
});

/* ---------------------------- Blog ---------------------------- */

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  cover?: { url: string; alt: string };
};

export type PostFull = PostSummary & {
  content: unknown;
  authorName?: string;
  seo: { title?: string; description?: string; image?: string };
};

function mapPost(d: Doc, size: "card" | "wide" = "card"): PostSummary {
  const coverUrl = mediaUrl(d.coverImage, size);
  return {
    slug: str(d.slug),
    title: str(d.title),
    excerpt: str(d.excerpt),
    publishedAt: str(d.publishedAt) || str(d.createdAt),
    updatedAt: str(d.updatedAt),
    tags: Array.isArray(d.tags) ? d.tags.filter((t): t is string => typeof t === "string") : [],
    cover: coverUrl ? { url: coverUrl, alt: mediaAlt(d.coverImage) } : undefined,
  };
}

export const POSTS_PER_PAGE = 9;

/* Sem banco configurado, o blog mostra os artigos migrados (src/content/posts). */
function staticSummary(p: SeedPost): PostSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    updatedAt: p.publishedAt,
    tags: p.tags,
    cover: p.cover ? { url: p.cover.localPath, alt: p.cover.alt } : undefined,
  };
}
const STATIC_POSTS = [...SEED_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const getPosts = cache(async (page = 1): Promise<{ posts: PostSummary[]; totalPages: number }> => {
  const payload = await getPayloadClient();
  if (!payload) {
    const start = (page - 1) * POSTS_PER_PAGE;
    return {
      posts: STATIC_POSTS.slice(start, start + POSTS_PER_PAGE).map(staticSummary),
      totalPages: Math.ceil(STATIC_POSTS.length / POSTS_PER_PAGE),
    };
  }
  try {
    const res = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      limit: POSTS_PER_PAGE,
      page,
      depth: 1,
    });
    return { posts: (res.docs as unknown as Doc[]).map((d) => mapPost(d)), totalPages: res.totalPages };
  } catch (err) {
    console.error("[cms] Erro ao buscar posts:", err);
    return { posts: [], totalPages: 0 };
  }
});

export const getPost = cache(async (slug: string): Promise<PostFull | null> => {
  const payload = await getPayloadClient();
  if (!payload) {
    const p = STATIC_POSTS.find((x) => x.slug === slug);
    return p
      ? { ...staticSummary(p), content: toLexical(p.blocks), authorName: "Jonas Silva", seo: { image: p.cover?.localPath } }
      : null;
  }
  try {
    const res = await payload.find({
      collection: "posts",
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
      limit: 1,
      depth: 2,
    });
    const d = (res.docs as unknown as Doc[])[0];
    if (!d) return null;
    const seo = obj(d.seo);
    return {
      ...mapPost(d, "wide"),
      content: d.content,
      authorName: str(obj(d.author).name) || undefined,
      seo: {
        title: str(seo.metaTitle) || undefined,
        description: str(seo.metaDescription) || undefined,
        image: mediaUrl(seo.ogImage, "wide") || mediaUrl(d.coverImage, "wide"),
      },
    };
  } catch (err) {
    console.error("[cms] Erro ao buscar post:", err);
    return null;
  }
});

/** Slugs e datas para o sitemap. */
export async function getAllPostSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const payload = await getPayloadClient();
  if (!payload) return STATIC_POSTS.map((p) => ({ slug: p.slug, updatedAt: p.publishedAt }));
  try {
    const res = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    });
    return (res.docs as unknown as Doc[]).map((d) => ({ slug: str(d.slug), updatedAt: str(d.updatedAt) }));
  } catch {
    return [];
  }
}
