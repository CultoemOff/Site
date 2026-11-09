import type { Metadata } from "next";
import LatestPosts from "@/components/blog/LatestPosts";
import HomeView from "@/components/HomeView";
import YouTube from "@/components/sections/youtube/YouTube";
import { isListed } from "@/config/courses";
import { getCourses, getOffers, getPosts, getSiteSettings } from "@/lib/cms";
import { JsonLd, coursesJsonLd, faqJsonLd, organizationJsonLd } from "@/lib/seo";

// Revalida a cada 1 h (vídeos do YouTube). Alterações no admin atualizam na hora.
export const revalidate = 3600;

// título e descrição da home no Google: com os termos que as pessoas pesquisam
export const metadata: Metadata = {
  title: { absolute: "Culto em Off: cursos para igrejas de OBS Studio, transmissão de culto e redes" },
  description:
    "Cursos online para a equipe de mídia da igreja: OBS Studio e transmissão de culto ao vivo, redes e Wi-Fi, câmeras PTZ, som e iluminação. Linguagem simples, aulas práticas e certificado.",
  alternates: { canonical: "/" },
};

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
