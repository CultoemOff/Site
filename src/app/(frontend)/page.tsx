import LatestPosts from "@/components/blog/LatestPosts";
import HomeView from "@/components/HomeView";
import YouTube from "@/components/sections/youtube/YouTube";
import { getCourses, getPosts, getSiteSettings } from "@/lib/cms";
import { JsonLd, coursesJsonLd, organizationJsonLd } from "@/lib/seo";

// Revalida a cada 1 h (vídeos do YouTube). Alterações no admin atualizam na hora.
export const revalidate = 3600;

export default async function Home() {
  const [courses, settings, { posts }] = await Promise.all([getCourses(), getSiteSettings(), getPosts(1)]);
  return (
    <>
      <JsonLd data={organizationJsonLd(settings)} />
      <JsonLd data={coursesJsonLd(courses)} />
      <HomeView
        courses={courses}
        settings={settings}
        youtube={<YouTube settings={settings} />}
        latestPosts={<LatestPosts posts={posts} />}
      />
    </>
  );
}
