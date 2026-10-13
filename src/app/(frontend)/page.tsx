import LatestPosts from "@/components/blog/LatestPosts";
import HomeView from "@/components/HomeView";
import YouTube from "@/components/sections/youtube/YouTube";
import { isListed } from "@/config/courses";
import { getCourses, getOffers, getPosts, getSiteSettings } from "@/lib/cms";
import { JsonLd, coursesJsonLd, faqJsonLd, organizationJsonLd } from "@/lib/seo";

// Revalida a cada 1 h (vídeos do YouTube). Alterações no admin atualizam na hora.
export const revalidate = 3600;

export default async function Home() {
  const [allCourses, settings, { posts }, offers] = await Promise.all([
    getCourses(),
    getSiteSettings(),
    getPosts(1),
    getOffers(),
  ]);
  // formações fora da lista (só pelo link direto) não aparecem na home
  const courses = allCourses.filter(isListed);
  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <JsonLd data={coursesJsonLd(courses)} />
      {settings.faq.length > 0 && <JsonLd data={faqJsonLd(settings.faq)} />}
      <HomeView
        courses={courses}
        settings={settings}
        offers={offers}
        youtube={<YouTube settings={settings} />}
        latestPosts={<LatestPosts posts={posts} />}
      />
    </>
  );
}
