import type { Metadata } from "next";
import HomeView2 from "@/components/home2/HomeView2";
import { isListed } from "@/config/courses";
import { getCourses, getOffers, getPosts, getSiteSettings } from "@/lib/cms";
import { getSelectedVideos } from "@/lib/youtube";
import { getLatestVideosWithFallback } from "@/lib/youtubeCache";

// Rascunho da nova home (26/11/2026): fora do Google e do sitemap até o Jonas aprovar.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Culto em Off · nova home (rascunho)" },
  robots: { index: false, follow: false },
};

export default async function Home2() {
  const [allCourses, settings, { posts }, offers] = await Promise.all([getCourses(), getSiteSettings(), getPosts(1), getOffers()]);
  const selected = settings.videosMode === "selected" && settings.selectedVideos.length > 0;
  const videos = selected ? await getSelectedVideos(settings.selectedVideos) : await getLatestVideosWithFallback(4);
  return <HomeView2 courses={allCourses.filter(isListed)} settings={settings} offers={offers} videos={videos} posts={posts} />;
}
