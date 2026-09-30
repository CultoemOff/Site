import type { MetadataRoute } from "next";
import { SALES_PAGES } from "@/config/salesPages";
import { getAllPostSlugs } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostSlugs();
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/formacoes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...Object.keys(SALES_PAGES).map((slug) => ({
      url: `${SITE_URL}/formacoes/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/softwares/ptz-control-web`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/equipamentos`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
