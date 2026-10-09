import type { Metadata } from "next";
import LinksView from "@/components/links/LinksView";
import { SITE_NAME } from "@/config/site";
import { getCourses, getSiteSettings } from "@/lib/cms";
import { getLatestVideosWithFallback } from "@/lib/youtubeCache";

// a página se refaz a cada hora: os últimos vídeos do canal entram sozinhos
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} · Links` },
  description: "Tudo sobre os bastidores audiovisuais das igrejas: formação, vídeos, ofertas e parceiros do Culto em Off.",
  alternates: { canonical: "https://links.cultoemoff.com.br" },
  openGraph: { url: "https://links.cultoemoff.com.br" },
};

/** Página de links da bio (links.cultoemoff.com.br), no lugar do Linktree. Os links de parceiros vêm do painel. */
export default async function LinksPage() {
  const [settings, courses, videos] = await Promise.all([getSiteSettings(), getCourses(), getLatestVideosWithFallback(3)]);
  const course = courses.find((c) => c.id === "redes-para-igrejas");
  return <LinksView settings={settings} course={course} videos={videos} />;
}
